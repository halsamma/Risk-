export type TSCCategory = 'security' | 'availability' | 'processing_integrity' | 'confidentiality' | 'privacy';
export type FedRAMPFamily =
  | 'access_control' | 'awareness_training' | 'audit_accountability'
  | 'assessment_authorization' | 'configuration_management' | 'contingency_planning'
  | 'identification_authentication' | 'incident_response' | 'maintenance'
  | 'media_protection' | 'physical_environmental' | 'planning'
  | 'program_management' | 'personnel_security' | 'pii_processing'
  | 'risk_assessment' | 'system_acquisition' | 'system_communications'
  | 'system_integrity' | 'supply_chain';
export type Framework = 'soc2' | 'fedramp' | 'pci_dss' | 'nist_ai_rmf' | 'pci_pin';
export type PCIPINDomain = 'management' | 'physical_security' | 'logical_security' | 'key_management' | 'transaction_processing' | 'monitoring_testing';
export type FedRAMPImpactLevel = 'low' | 'moderate' | 'high';
export type PCIEntityType = 'merchant' | 'service_provider';
export type NISTAIFunction = 'govern' | 'map' | 'measure' | 'manage';
export type CreationMode = 'scratch' | 'findings';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type ControlStatus = 'yes' | 'no' | 'partial' | 'na';
export type FindingStatus = 'open' | 'in_progress' | 'resolved';
export type PlanStatus = 'pending' | 'in_progress' | 'completed';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  framework: Framework;
  impact_level: FedRAMPImpactLevel;
  scope: string[];
  status: 'in_progress' | 'completed';
  overall_score: number;
  created_at: string;
  updated_at: string;
  responded_controls?: number;
  open_findings?: number;
}

export interface ControlResponse {
  id: string;
  assessment_id: string;
  control_id: string;
  status: ControlStatus;
  evidence?: string;
  notes?: string;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Finding {
  id: string;
  assessment_id: string;
  control_id: string;
  severity: Severity;
  title: string;
  description?: string;
  recommendation?: string;
  status: FindingStatus;
  created_at: string;
  updated_at: string;
  plan_id?: string;
  plan_status?: PlanStatus;
  plan_type?: string;
}

export interface RemediationStep {
  order: number;
  title: string;
  description: string;
  effort: string;
  timeframe: string;
  acceptanceCriteria?: string;
  templates?: string[];
  tools?: string[];
}

export interface RemediationPlan {
  id: string;
  finding_id: string;
  assessment_id: string;
  type: 'static' | 'ai_generated';
  status: PlanStatus;
  content: {
    summary?: string;
    priority?: string;
    estimatedEffort?: string;
    type?: string;
    control?: { id: string; title: string };
    objective?: string;
    steps: RemediationStep[];
    successMetrics?: string[];
    risks?: string[];
    relatedControls?: string[];
  };
  finding_title?: string;
  severity?: Severity;
  control_id?: string;
  finding_description?: string;
  created_at: string;
  updated_at: string;
}

export interface ControlExample {
  scenario: string;
  evidence: string;
  quickWin: string;
}

export interface SOC2Control {
  id: string;
  category: TSCCategory;
  title: string;
  description: string;
  objective: string;
  guidance: string[];
  evidenceExamples: string[];
  severity: Severity;
  staticRemediation: RemediationStep[];
  example?: ControlExample;
}

export interface AssessmentProgress {
  overallScore: number;
  totalControls: number;
  answeredControls: number;
  completionPct: number;
  categoryScores: Array<{
    category: TSCCategory;
    total: number;
    answered: number;
    score: number;
    completionPct: number;
  }>;
  openFindings: Array<{ severity: Severity; count: number }>;
  status: string;
}

export interface DocumentAnalysis {
  summary: string;
  documentType: string;
  coveredControls: Array<{
    controlId: string;
    confidence: 'high' | 'medium' | 'low';
    evidence: string;
    suggestedStatus: ControlStatus;
  }>;
  gaps: Array<{ area: string; description: string; suggestedControls: string[] }>;
  recommendations: string[];
}
