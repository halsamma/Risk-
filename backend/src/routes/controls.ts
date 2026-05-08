import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { SOC2_CONTROLS, CONTROL_CATEGORIES } from '../data/soc2-controls';
import { FEDRAMP_CONTROLS, FEDRAMP_FAMILY_LABELS, getFedRAMPControlsByFamily, getFedRAMPControlById, FedRAMPFamily } from '../data/fedramp-controls';
import { PCI_DSS_CONTROLS, PCI_REQUIREMENT_LABELS, getPCIControlsByRequirement, getPCIControlById, PCIRequirement, PCIEntityType } from '../data/pci-dss-controls';
import { NIST_AI_CONTROLS, NIST_AI_FUNCTION_LABELS, getNISTAIControlsByFunction, getNISTAIControlById, NISTAIFunction } from '../data/nist-ai-rmf-controls';
import { PCI_PIN_CONTROLS, PCI_PIN_DOMAIN_LABELS, getPCIPINControlsByDomain, getPCIPINControlById, PCIPINDomain } from '../data/pci-pin-controls';
import { db } from '../config/database';

const router = Router();

// GET /api/controls?framework=soc2|fedramp|pci_dss|nist_ai_rmf|pci_pin&category=...
router.get('/', authenticate, (req: Request, res: Response) => {
  const { framework = 'soc2', category, impactLevel } = req.query;

  if (framework === 'fedramp') {
    let controls = FEDRAMP_CONTROLS;
    if (category) controls = getFedRAMPControlsByFamily(category as FedRAMPFamily);
    if (impactLevel) controls = controls.filter(c => c.impactLevels.includes(impactLevel as any));
    res.json(controls); return;
  }
  if (framework === 'pci_dss') {
    const entityType = (impactLevel ?? 'merchant') as PCIEntityType;
    let controls = PCI_DSS_CONTROLS.filter(c => c.applicableTo.includes(entityType));
    if (category) controls = getPCIControlsByRequirement(category as PCIRequirement).filter(c => c.applicableTo.includes(entityType));
    res.json(controls); return;
  }
  if (framework === 'nist_ai_rmf') {
    let controls = NIST_AI_CONTROLS;
    if (category) controls = getNISTAIControlsByFunction(category as NISTAIFunction);
    res.json(controls); return;
  }
  if (framework === 'pci_pin') {
    let controls = PCI_PIN_CONTROLS;
    if (category) controls = getPCIPINControlsByDomain(category as PCIPINDomain);
    res.json(controls); return;
  }
  // default: soc2
  const controls = category ? SOC2_CONTROLS.filter(c => c.category === category) : SOC2_CONTROLS;
  res.json(controls);
});

// GET /api/controls/categories?framework=...
router.get('/categories', authenticate, (req: Request, res: Response) => {
  const { framework = 'soc2' } = req.query;
  if (framework === 'fedramp')     { res.json(FEDRAMP_FAMILY_LABELS);   return; }
  if (framework === 'pci_dss')     { res.json(PCI_REQUIREMENT_LABELS);  return; }
  if (framework === 'nist_ai_rmf') { res.json(NIST_AI_FUNCTION_LABELS); return; }
  if (framework === 'pci_pin')     { res.json(PCI_PIN_DOMAIN_LABELS);   return; }
  res.json(CONTROL_CATEGORIES);
});

// GET /api/controls/:id?framework=...
router.get('/:id', authenticate, (req: Request, res: Response) => {
  const { framework = 'soc2' } = req.query;
  const control =
    framework === 'fedramp'     ? getFedRAMPControlById(req.params.id) :
    framework === 'pci_dss'     ? getPCIControlById(req.params.id) :
    framework === 'nist_ai_rmf' ? getNISTAIControlById(req.params.id) :
    framework === 'pci_pin'     ? getPCIPINControlById(req.params.id) :
    SOC2_CONTROLS.find(c => c.id === req.params.id);

  if (!control) { res.status(404).json({ error: 'Control not found' }); return; }
  res.json(control);
});

// GET /api/controls/:id/responses?assessmentId=xxx
router.get('/:id/responses', authenticate, (req: Request, res: Response) => {
  const { assessmentId } = req.query;
  if (!assessmentId) { res.status(400).json({ error: 'assessmentId is required' }); return; }
  const assessment = db.prepare('SELECT id FROM assessments WHERE id = ? AND user_id = ?').get(assessmentId as string, req.user!.userId);
  if (!assessment) { res.status(404).json({ error: 'Assessment not found' }); return; }
  const response = db.prepare('SELECT * FROM control_responses WHERE assessment_id = ? AND control_id = ?').get(assessmentId as string, req.params.id);
  res.json(response ?? null);
});

export default router;
