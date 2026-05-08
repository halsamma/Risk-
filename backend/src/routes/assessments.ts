import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { authenticate, ownsAssessment } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { generateSecureId } from '../utils/crypto';
import { auditLog } from '../utils/audit';
import { logger } from '../utils/logger';
import { getControlsForAssessment, getControlByIdForFramework, Framework } from '../data/framework';
import { FedRAMPImpactLevel } from '../data/fedramp-controls';
import { env } from '../config/env';

const router = Router();

const VALID_SOC2_SCOPES = new Set(['security','availability','processing_integrity','confidentiality','privacy']);
const VALID_FEDRAMP_FAMILIES = new Set([
  'access_control','awareness_training','audit_accountability','assessment_authorization',
  'configuration_management','contingency_planning','identification_authentication',
  'incident_response','maintenance','media_protection','physical_environmental','planning',
  'program_management','personnel_security','pii_processing','risk_assessment',
  'system_acquisition','system_communications','system_integrity','supply_chain',
]);
const VALID_PCI_REQUIREMENTS = new Set([
  'req_1_network_security','req_2_secure_config','req_3_protect_stored_data',
  'req_4_protect_transmission','req_5_anti_malware','req_6_secure_development',
  'req_7_restrict_access','req_8_authentication','req_9_physical_access',
  'req_10_logging_monitoring','req_11_security_testing','req_12_security_policy',
]);

const VALID_NIST_AI_FUNCTIONS = new Set(['govern', 'map', 'measure', 'manage']);
const VALID_PCI_PIN_DOMAINS = new Set([
  'management','physical_security','logical_security',
  'key_management','transaction_processing','monitoring_testing',
]);

function getScopeSet(fw: Framework): Set<string> {
  if (fw === 'fedramp')     return VALID_FEDRAMP_FAMILIES;
  if (fw === 'pci_dss')     return VALID_PCI_REQUIREMENTS;
  if (fw === 'nist_ai_rmf') return VALID_NIST_AI_FUNCTIONS;
  if (fw === 'pci_pin')     return VALID_PCI_PIN_DOMAINS;
  return VALID_SOC2_SCOPES;
}

const CreateAssessmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200).trim(),
  description: z.string().max(1000).trim().optional(),
  framework: z.enum(['soc2', 'fedramp', 'pci_dss', 'nist_ai_rmf', 'pci_pin']).default('soc2'),
  impact_level: z.string().default('moderate'),
  scope: z.array(z.string().min(1)).min(1, 'Select at least one category'),
  // Two-mode creation: 'scratch' (default) or 'findings' (pre-populated from uploaded audit doc)
  creation_mode: z.enum(['scratch', 'findings']).default('scratch'),
  findings_document_text: z.string().max(100000).optional(),
});

const UpdateResponseSchema = z.object({
  controlId: z.string().min(1).max(20),
  status: z.enum(['yes', 'no', 'partial', 'na']),
  evidence: z.string().max(5000).trim().optional(),
  notes: z.string().max(2000).trim().optional(),
});

// GET /api/assessments
router.get('/', authenticate, (_req: Request, res: Response) => {
  const assessments = db.prepare(`
    SELECT a.*,
      (SELECT COUNT(*) FROM control_responses cr WHERE cr.assessment_id = a.id) as responded_controls,
      (SELECT COUNT(*) FROM findings f WHERE f.assessment_id = a.id AND f.status = 'open') as open_findings
    FROM assessments a WHERE a.user_id = ?
    ORDER BY a.updated_at DESC
  `).all(_req.user!.userId);
  res.json(assessments);
});

// POST /api/assessments
router.post('/', authenticate, validateBody(CreateAssessmentSchema), async (req: Request, res: Response) => {
  try {
  const { name, description, scope, framework, impact_level, creation_mode, findings_document_text } = req.body;
  const fw: Framework = (framework ?? 'soc2') as Framework;
  const impactLevel: FedRAMPImpactLevel = (impact_level ?? 'moderate') as FedRAMPImpactLevel;
  const mode = creation_mode ?? 'scratch';

  // Validate scope values against the chosen framework
  const validSet = getScopeSet(fw);
  const invalid = (scope as string[]).filter((s: string) => !validSet.has(s));
  if (invalid.length > 0) {
    res.status(422).json({ error: `Invalid scope value(s) for ${fw}: ${invalid.join(', ')}` });
    return;
  }

  const id = generateSecureId();

  db.prepare(`
    INSERT INTO assessments (id, user_id, name, description, framework, impact_level, scope)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.user!.userId, name, description ?? null, fw, impactLevel, JSON.stringify(scope));

  const totalControls = getControlsForAssessment(fw, scope, impactLevel).length;
  auditLog('assessment.create', { userId: req.user!.userId, resourceType: 'assessment', resourceId: id, req, details: { name, scope, framework: fw, totalControls, mode } });

  // ── FINDINGS MODE: parse uploaded audit doc and pre-populate ──────────────
  if (mode === 'findings' && findings_document_text) {
    try {
      // Use Claude if API key is set, otherwise fall back to keyword-based parser
      let parsed;
      const hasApiKey = env.ANTHROPIC_API_KEY && !env.ANTHROPIC_API_KEY.startsWith('REPLACE_');
      if (hasApiKey) {
        const { parseAuditFindings } = await import('../services/claude');
        parsed = await parseAuditFindings(findings_document_text, fw, scope);
      } else {
        const { parseDocumentManually } = await import('../services/document-parser');
        parsed = parseDocumentManually(findings_document_text, fw, scope);
        logger.info(`Keyword parser found ${parsed.findings.length} findings (no API key configured)`);
      }

      for (const finding of parsed.findings) {
        const control = getControlByIdForFramework(fw, finding.controlId);
        if (!control) continue;

        // Mark control response as 'no' or 'partial'
        const responseId = generateSecureId();
        db.prepare(`
          INSERT INTO control_responses (id, assessment_id, control_id, status, notes, score)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(assessment_id, control_id) DO UPDATE SET
            status = excluded.status, notes = excluded.notes, score = excluded.score, updated_at = datetime('now')
        `).run(responseId, id, finding.controlId, finding.status, finding.description, finding.status === 'partial' ? 50 : 0);

        // Create finding
        const findingId = generateSecureId();
        db.prepare(`
          INSERT INTO findings (id, assessment_id, control_id, severity, title, description, recommendation)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(findingId, id, finding.controlId, finding.severity,
          finding.title, finding.description,
          control.staticRemediation?.[0]?.description ?? 'Review and remediate this control.');

        // Auto-create remediation plan
        db.prepare(`
          INSERT INTO remediation_plans (id, finding_id, assessment_id, type, content)
          VALUES (?, ?, ?, 'static', ?)
        `).run(generateSecureId(), findingId, id, JSON.stringify({
          type: 'static', framework: fw,
          control: { id: control.id, title: control.title },
          steps: control.staticRemediation,
          objective: control.objective,
        }));
      }

      // Recalculate overall score
      const allResponses = db.prepare('SELECT status FROM control_responses WHERE assessment_id = ?').all(id) as any[];
      const totalScore = allResponses.reduce((sum: number, r: any) => r.status === 'partial' ? sum + 50 : sum, 0);
      const overallScore = totalControls > 0 ? Math.round(totalScore / totalControls) : 0;
      db.prepare(`UPDATE assessments SET overall_score = ? WHERE id = ?`).run(overallScore, id);

      const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(id);
      res.status(201).json({ ...assessment, parsed_summary: parsed.summary, parsed_findings_count: parsed.findings.length });
      return;
    } catch (err: any) {
      logger.error('Audit findings parsing failed:', err);
      db.prepare('DELETE FROM assessments WHERE id = ?').run(id);
      res.status(422).json({
        error: 'Failed to parse audit findings document',
        hint: (err?.message ?? '') || 'Check that the document contains readable text and try again.',
      });
      return;
    }
  }

  const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(id);
  res.status(201).json(assessment);
  } catch (err) {
    logger.error('Assessment creation failed:', err);
    res.status(500).json({ error: 'Failed to create assessment' });
  }
});

// GET /api/assessments/:id
router.get('/:id', authenticate, ownsAssessment, (req: Request, res: Response) => {
  const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(req.params.id) as any;
  const responses = db.prepare('SELECT * FROM control_responses WHERE assessment_id = ?').all(req.params.id);
  const findings = db.prepare('SELECT * FROM findings WHERE assessment_id = ? ORDER BY severity ASC').all(req.params.id);

  const scope: string[] = JSON.parse(assessment.scope);
  const fw: Framework = assessment.framework ?? 'soc2';
  const inScopeControls = getControlsForAssessment(fw, scope, assessment.impact_level ?? 'moderate');

  res.json({ ...assessment, scope, responses, findings, totalControls: inScopeControls.length });
});

// DELETE /api/assessments/:id
router.delete('/:id', authenticate, ownsAssessment, (req: Request, res: Response) => {
  db.prepare('DELETE FROM assessments WHERE id = ?').run(req.params.id);
  auditLog('assessment.delete', { userId: req.user!.userId, resourceType: 'assessment', resourceId: req.params.id, req });
  res.json({ message: 'Assessment deleted' });
});

// PUT /api/assessments/:id/responses
router.put('/:id/responses', authenticate, ownsAssessment, validateBody(UpdateResponseSchema), (req: Request, res: Response) => {
  try {
    const assessmentId = req.params.id;
    const { controlId, status, evidence, notes } = req.body;

    const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(assessmentId) as any;
    const scope: string[] = JSON.parse(assessment.scope);
    const fw: Framework = assessment.framework ?? 'soc2';
    const impactLevel: FedRAMPImpactLevel = assessment.impact_level ?? 'moderate';

    const control = getControlByIdForFramework(fw, controlId);
    if (!control) {
      res.status(404).json({ error: 'Control not found' });
      return;
    }
    if (!scope.includes(fw === 'soc2' ? (control as any).category : (control as any).family)) {
      res.status(400).json({ error: 'Control is not in assessment scope' });
      return;
    }

    const score = status === 'yes' ? 100 : status === 'partial' ? 50 : 0;
    const responseId = generateSecureId();

    db.prepare(`
      INSERT INTO control_responses (id, assessment_id, control_id, status, evidence, notes, score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(assessment_id, control_id) DO UPDATE SET
        status = excluded.status, evidence = excluded.evidence, notes = excluded.notes,
        score = excluded.score, updated_at = datetime('now')
    `).run(responseId, assessmentId, controlId, status, evidence ?? null, notes ?? null, score);

    if (status === 'no' || status === 'partial') {
      const existingFinding = db.prepare('SELECT id FROM findings WHERE assessment_id = ? AND control_id = ?').get(assessmentId, controlId);
      if (!existingFinding) {
        const findingId = generateSecureId();
        db.prepare(`
          INSERT INTO findings (id, assessment_id, control_id, severity, title, description, recommendation)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          findingId, assessmentId, controlId, control.severity,
          `${status === 'no' ? 'Missing' : 'Partial'}: ${control.title}`,
          control.description,
          control.staticRemediation[0]?.description ?? 'Review and remediate this control.'
        );
        const planContent = JSON.stringify({
          type: 'static', framework: fw,
          control: { id: control.id, title: control.title },
          steps: control.staticRemediation,
          objective: control.objective,
        });
        db.prepare(`
          INSERT INTO remediation_plans (id, finding_id, assessment_id, type, content)
          VALUES (?, ?, ?, 'static', ?)
        `).run(generateSecureId(), findingId, assessmentId, planContent);
      }
    } else if (status === 'yes' || status === 'na') {
      db.prepare(`UPDATE findings SET status = 'resolved', updated_at = datetime('now') WHERE assessment_id = ? AND control_id = ?`).run(assessmentId, controlId);
    }

    // Recalculate overall score
    const allResponses = db.prepare('SELECT status FROM control_responses WHERE assessment_id = ?').all(assessmentId) as any[];
    const inScopeCount = getControlsForAssessment(fw, scope, impactLevel).length;
    const totalScore = allResponses.reduce((sum: number, r: any) => {
      if (r.status === 'yes') return sum + 100;
      if (r.status === 'partial') return sum + 50;
      return sum;
    }, 0);
    const overallScore = inScopeCount > 0 ? Math.round(totalScore / inScopeCount) : 0;

    db.prepare(`UPDATE assessments SET overall_score = ?, updated_at = datetime('now') WHERE id = ?`).run(overallScore, assessmentId);

    res.json({ message: 'Response saved', score: overallScore });
  } catch (err) {
    logger.error('Error saving response:', err);
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// GET /api/assessments/:id/progress
router.get('/:id/progress', authenticate, ownsAssessment, (req: Request, res: Response) => {
  const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(req.params.id) as any;
  const scope: string[] = JSON.parse(assessment.scope);
  const fw: Framework = assessment.framework ?? 'soc2';
  const impactLevel: FedRAMPImpactLevel = assessment.impact_level ?? 'moderate';
  const responses = db.prepare('SELECT control_id, status, score FROM control_responses WHERE assessment_id = ?').all(req.params.id) as any[];

  const responseMap = new Map(responses.map((r: any) => [r.control_id, r]));
  const inScopeControls = getControlsForAssessment(fw, scope, impactLevel);

  const byCategory: Record<string, { total: number; answered: number; score: number }> = {};

  for (const control of inScopeControls) {
    const cat = fw === 'soc2' ? (control as any).category : (control as any).family;
    if (!byCategory[cat]) byCategory[cat] = { total: 0, answered: 0, score: 0 };
    byCategory[cat].total++;
    const resp = responseMap.get(control.id) as any;
    if (resp) {
      byCategory[cat].answered++;
      byCategory[cat].score += resp.score;
    }
  }

  const categoryScores = Object.entries(byCategory).map(([category, data]) => ({
    category,
    total: data.total,
    answered: data.answered,
    score: data.total > 0 ? Math.round(data.score / data.total) : 0,
    completionPct: data.total > 0 ? Math.round((data.answered / data.total) * 100) : 0,
  }));

  const openFindings = db.prepare(`
    SELECT severity, COUNT(*) as count FROM findings WHERE assessment_id = ? AND status = 'open' GROUP BY severity
  `).all(req.params.id);

  res.json({
    overallScore: assessment.overall_score,
    totalControls: inScopeControls.length,
    answeredControls: responses.length,
    completionPct: Math.round((responses.length / inScopeControls.length) * 100),
    categoryScores,
    openFindings,
    status: assessment.status,
  });
});

export default router;
