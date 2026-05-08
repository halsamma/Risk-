import express from 'express';
import path from 'path';
import { env } from './config/env';
import { initializeDatabase } from './config/database';
import { securityHeaders, corsOptions, generalRateLimit, compressionMiddleware, requestLogger, sanitizeQuery } from './middleware/security';
import { logger } from './utils/logger';

import authRoutes from './routes/auth';
import assessmentRoutes from './routes/assessments';
import controlRoutes from './routes/controls';
import findingRoutes from './routes/findings';
import remediationRoutes from './routes/remediation';
import documentRoutes from './routes/documents';
import guidanceRoutes from './routes/guidance';

const app = express();

// ── Security Middleware (OWASP) ────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(securityHeaders);
app.use(corsOptions);
app.use(compressionMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(generalRateLimit);
app.use(requestLogger);
app.use(sanitizeQuery);

// Disable X-Powered-By (security hardening)
app.disable('x-powered-by');

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/assessments', findingRoutes);
app.use('/api/assessments', remediationRoutes);
app.use('/api/assessments', documentRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api/guidance', guidanceRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Error handler ─────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  // Don't leak internal error details in production (OWASP A05)
  const message = env.isDev ? err.message : 'Internal server error';
  res.status(500).json({ error: message });
});

// ── Start ─────────────────────────────────────────────────────────────────
initializeDatabase();
app.listen(env.PORT, () => {
  logger.info(`Technology Risk Assessment API running on http://localhost:${env.PORT}`);
});

export default app;
