import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { sensitiveRateLimit } from '../middleware/security';
import { getControlGuidance } from '../services/claude';
import { getControlById } from '../data/soc2-controls';
import { db } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

router.post('/ask', authenticate, sensitiveRateLimit, validateBody(z.object({
  controlId: z.string().min(1).max(20),
  question: z.string().min(10).max(1000).trim(),
})), async (req: Request, res: Response) => {
  try {
    const { controlId, question } = req.body;
    const control = getControlById(controlId);
    if (!control) {
      res.status(404).json({ error: 'Control not found' });
      return;
    }

    const user = db.prepare('SELECT company_name FROM users WHERE id = ?').get(req.user!.userId) as any;

    const answer = await getControlGuidance({
      controlId: control.id,
      controlTitle: control.title,
      controlDescription: control.description,
      question,
      companyContext: user?.company_name,
    });

    res.json({ answer });
  } catch (err) {
    logger.error('Guidance request failed:', err);
    res.status(500).json({ error: 'Failed to get guidance. Please try again.' });
  }
});

export default router;
