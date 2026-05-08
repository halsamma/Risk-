import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload & { iat: number; exp: number };
    req.user = { userId: payload.userId, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    } else {
      logger.warn(`Invalid JWT from IP ${req.ip}: ${(err as Error).message}`);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      logger.warn(`Forbidden: user ${req.user.userId} (role: ${req.user.role}) tried to access ${req.path}`);
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}

// Verify that the user owns the requested resource (OWASP A01 — Broken Access Control)
export function ownsAssessment(req: Request, res: Response, next: NextFunction): void {
  const { id: assessmentId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const assessment = db.prepare('SELECT id FROM assessments WHERE id = ? AND user_id = ?').get(assessmentId, userId);
  if (!assessment) {
    res.status(404).json({ error: 'Assessment not found' });
    return;
  }

  next();
}
