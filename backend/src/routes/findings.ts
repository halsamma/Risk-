import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { authenticate, ownsAssessment } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

// GET /api/assessments/:id/findings
router.get('/:id/findings', authenticate, ownsAssessment, (req: Request, res: Response) => {
  const { severity, status } = req.query;

  let query = 'SELECT f.*, rp.id as plan_id, rp.status as plan_status, rp.type as plan_type FROM findings f LEFT JOIN remediation_plans rp ON rp.finding_id = f.id WHERE f.assessment_id = ?';
  const params: unknown[] = [req.params.id];

  if (severity) {
    query += ' AND f.severity = ?';
    params.push(severity);
  }
  if (status) {
    query += ' AND f.status = ?';
    params.push(status);
  }

  query += ' ORDER BY CASE f.severity WHEN \'critical\' THEN 1 WHEN \'high\' THEN 2 WHEN \'medium\' THEN 3 WHEN \'low\' THEN 4 END, f.created_at DESC';

  const findings = db.prepare(query).all(...(params as string[]));
  res.json(findings);
});

// PATCH /api/assessments/:id/findings/:findingId
router.patch('/:id/findings/:findingId', authenticate, ownsAssessment, validateBody(z.object({
  status: z.enum(['open', 'in_progress', 'resolved']).optional(),
})), (req: Request, res: Response) => {
  const { findingId } = req.params;
  const { status } = req.body;

  const finding = db.prepare('SELECT id FROM findings WHERE id = ? AND assessment_id = ?').get(findingId, req.params.id);
  if (!finding) {
    res.status(404).json({ error: 'Finding not found' });
    return;
  }

  db.prepare(`UPDATE findings SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, findingId);
  res.json({ message: 'Finding updated' });
});

export default router;
