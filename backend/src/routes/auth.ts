import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { authRateLimit } from '../middleware/security';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { noCache } from '../middleware/security';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateSecureId,
  validatePasswordStrength,
} from '../utils/crypto';
import { auditLog } from '../utils/audit';
import { logger } from '../utils/logger';

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email('Invalid email address').max(255).toLowerCase().trim(),
  password: z.string().min(12).max(128),
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  companyName: z.string().max(200).trim().optional(),
});

const LoginSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(1).max(128),
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// POST /api/auth/register
router.post('/register', authRateLimit, noCache, validateBody(RegisterSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, companyName } = req.body;

    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.valid) {
      res.status(422).json({ error: strengthCheck.message });
      return;
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    // Constant-time response to prevent user enumeration (OWASP A07)
    if (existing) {
      // Still hash to avoid timing attacks revealing user existence
      await hashPassword(password);
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const userId = generateSecureId();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, company_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, email, passwordHash, firstName, lastName, companyName ?? null);

    const accessToken = generateAccessToken({ userId, email, role: 'user' });
    const refreshToken = generateRefreshToken({ userId, email, role: 'user' });
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(generateSecureId(), userId, refreshTokenHash, expiresAt);

    auditLog('user.register', { userId, req, details: { email } });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: userId, email, firstName, lastName, companyName, role: 'user' },
    });
  } catch (err) {
    logger.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', authRateLimit, noCache, validateBody(LoginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    // Generic message prevents user enumeration
    if (!user) {
      await hashPassword(password); // timing equalization
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Account lockout check (OWASP A07)
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      res.status(403).json({ error: 'Account temporarily locked. Please try again later.' });
      return;
    }

    const passwordMatch = await verifyPassword(password, user.password_hash);

    if (!passwordMatch) {
      const attempts = user.failed_login_attempts + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;

      db.prepare(`
        UPDATE users SET failed_login_attempts = ?, locked_until = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(attempts, lockUntil, user.id);

      auditLog('user.login.failed', { userId: user.id, req, details: { attempts } });
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Reset lockout on successful login
    db.prepare(`
      UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = datetime('now'), updated_at = datetime('now')
      WHERE id = ?
    `).run(user.id);

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Revoke old tokens for this user before issuing new one (optional: per-device tokens)
    db.prepare("DELETE FROM refresh_tokens WHERE user_id = ? AND revoked = 0").run(user.id);
    db.prepare(`
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(generateSecureId(), user.id, refreshTokenHash, expiresAt);

    auditLog('user.login', { userId: user.id, req });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, companyName: user.company_name, role: user.role },
    });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', noCache, validateBody(RefreshSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const payload = verifyRefreshToken(refreshToken);

    const tokenHash = hashToken(refreshToken);
    const stored = db.prepare(`
      SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked = 0 AND expires_at > datetime('now')
    `).get(tokenHash) as any;

    if (!stored || stored.user_id !== payload.userId) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    // Rotate refresh token (OWASP A07 — prevent token replay)
    db.prepare('UPDATE refresh_tokens SET revoked = 1 WHERE id = ?').run(stored.id);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.userId) as any;
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const newAccessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });
    const newHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(generateSecureId(), user.id, newHash, expiresAt);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, noCache, (req: Request, res: Response) => {
  try {
    db.prepare("DELETE FROM refresh_tokens WHERE user_id = ?").run(req.user!.userId);
    auditLog('user.logout', { userId: req.user!.userId, req });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req: Request, res: Response) => {
  const user = db.prepare('SELECT id, email, first_name, last_name, company_name, role, created_at, last_login FROM users WHERE id = ?').get(req.user!.userId) as any;
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, companyName: user.company_name, role: user.role, createdAt: user.created_at, lastLogin: user.last_login });
});

// PATCH /api/auth/profile
router.patch('/profile', authenticate, validateBody(z.object({
  firstName: z.string().min(1).max(100).trim().optional(),
  lastName: z.string().min(1).max(100).trim().optional(),
  companyName: z.string().max(200).trim().optional(),
})), (req: Request, res: Response) => {
  const { firstName, lastName, companyName } = req.body;
  db.prepare(`
    UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name),
    company_name = COALESCE(?, company_name), updated_at = datetime('now') WHERE id = ?
  `).run(firstName ?? null, lastName ?? null, companyName ?? null, req.user!.userId);
  res.json({ message: 'Profile updated' });
});

export default router;
