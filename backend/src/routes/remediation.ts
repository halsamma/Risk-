import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { authenticate, ownsAssessment } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { generateSecureId } from '../utils/crypto';
import { generateAIRemediation } from '../services/claude';
import { getControlById } from '../data/soc2-controls';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/assessments/:id/remediation
router.get('/:id/remediation', authenticate, ownsAssessment, (_req: Request, res: Response) => {
  const plans = db.prepare(`
    SELECT rp.*, f.title as finding_title, f.severity, f.control_id, f.status as finding_status
    FROM remediation_plans rp
    JOIN findings f ON f.id = rp.finding_id
    WHERE rp.assessment_id = ?
    ORDER BY CASE f.severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END
  `).all(_req.params.id);
  res.json(plans);
});

// GET /api/assessments/:id/remediation/:planId
router.get('/:id/remediation/:planId', authenticate, ownsAssessment, (req: Request, res: Response) => {
  const plan = db.prepare(`
    SELECT rp.*, f.title as finding_title, f.severity, f.control_id, f.description as finding_description
    FROM remediation_plans rp
    JOIN findings f ON f.id = rp.finding_id
    WHERE rp.id = ? AND rp.assessment_id = ?
  `).get(req.params.planId, req.params.id) as any;

  if (!plan) {
    res.status(404).json({ error: 'Remediation plan not found' });
    return;
  }

  res.json({ ...plan, content: JSON.parse(plan.content) });
});

// POST /api/assessments/:id/remediation/generate
router.post('/:id/remediation/generate', authenticate, ownsAssessment, validateBody(z.object({
  findingId: z.string().uuid(),
  context: z.string().max(2000).trim().optional(),
})), async (req: Request, res: Response) => {
  try {
    const { findingId, context } = req.body;
    const assessmentId = req.params.id;

    const finding = db.prepare('SELECT * FROM findings WHERE id = ? AND assessment_id = ?').get(findingId, assessmentId) as any;
    if (!finding) {
      res.status(404).json({ error: 'Finding not found' });
      return;
    }

    const control = getControlById(finding.control_id);
    if (!control) {
      res.status(404).json({ error: 'Control not found' });
      return;
    }

    const assessment = db.prepare('SELECT name, scope FROM assessments WHERE id = ?').get(assessmentId) as any;
    const user = db.prepare('SELECT company_name FROM users WHERE id = ?').get(req.user!.userId) as any;

    const aiContent = await generateAIRemediation({
      control,
      finding,
      assessmentName: assessment.name,
      companyName: user?.company_name ?? 'the organization',
      additionalContext: context,
    });

    // Check if an AI plan already exists for this finding; if so update it
    const existing = db.prepare("SELECT id FROM remediation_plans WHERE finding_id = ? AND type = 'ai_generated'").get(findingId) as any;

    if (existing) {
      db.prepare(`UPDATE remediation_plans SET content = ?, status = 'pending', updated_at = datetime('now') WHERE id = ?`)
        .run(JSON.stringify(aiContent), existing.id);
      res.json({ planId: existing.id, content: aiContent });
    } else {
      const planId = generateSecureId();
      db.prepare(`
        INSERT INTO remediation_plans (id, finding_id, assessment_id, type, content)
        VALUES (?, ?, ?, 'ai_generated', ?)
      `).run(planId, findingId, assessmentId, JSON.stringify(aiContent));
      res.status(201).json({ planId, content: aiContent });
    }
  } catch (err) {
    logger.error('AI remediation generation failed:', err);
    res.status(500).json({ error: 'Failed to generate AI remediation plan. Please try again.' });
  }
});

// PATCH /api/assessments/:id/remediation/:planId/status
router.patch('/:id/remediation/:planId/status', authenticate, ownsAssessment, validateBody(z.object({
  status: z.enum(['pending', 'in_progress', 'completed']),
})), (req: Request, res: Response) => {
  const { planId } = req.params;
  const { status } = req.body;

  const plan = db.prepare('SELECT id FROM remediation_plans WHERE id = ? AND assessment_id = ?').get(planId, req.params.id);
  if (!plan) {
    res.status(404).json({ error: 'Plan not found' });
    return;
  }

  db.prepare(`UPDATE remediation_plans SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, planId);
  res.json({ message: 'Status updated' });
});

export default router;
