import { SOC2_CONTROLS, getControlById as getSOC2Control } from './soc2-controls';
import { FEDRAMP_CONTROLS, FedRAMPImpactLevel, getFedRAMPControlById } from './fedramp-controls';
import { PCI_DSS_CONTROLS, PCIEntityType, getPCIControlById } from './pci-dss-controls';
import { NIST_AI_CONTROLS, getNISTAIControlById } from './nist-ai-rmf-controls';
import { PCI_PIN_CONTROLS, getPCIPINControlById } from './pci-pin-controls';

export type Framework = 'soc2' | 'fedramp' | 'pci_dss' | 'nist_ai_rmf' | 'pci_pin';

export interface UniversalControl {
  id: string;
  framework?: Framework;
  category: string;
  title: string;
  description: string;
  objective: string;
  guidance: string[];
  evidenceExamples: string[];
  severity: string;
  staticRemediation: Array<{ order: number; title: string; description: string; effort: string; timeframe: string }>;
  example?: { scenario: string; evidence: string; quickWin: string };
}

function getCategoryKey(framework: Framework, control: any): string {
  if (framework === 'soc2')        return control.category;
  if (framework === 'fedramp')     return control.family;
  if (framework === 'pci_dss')     return control.requirement;
  if (framework === 'nist_ai_rmf') return control.function;
  if (framework === 'pci_pin')     return control.domain;
  return '';
}

export function getControlsForAssessment(
  framework: Framework,
  scope: string[],
  impactLevel?: string
): UniversalControl[] {
  if (framework === 'soc2') {
    return SOC2_CONTROLS.filter(c => scope.includes(c.category)) as unknown as UniversalControl[];
  }
  if (framework === 'fedramp') {
    return FEDRAMP_CONTROLS.filter(c => {
      const inScope = scope.length === 0 || scope.includes(c.family);
      const inLevel = !impactLevel || c.impactLevels.includes(impactLevel as FedRAMPImpactLevel);
      return inScope && inLevel;
    }) as unknown as UniversalControl[];
  }
  if (framework === 'pci_dss') {
    const entityType = (impactLevel ?? 'merchant') as PCIEntityType;
    return PCI_DSS_CONTROLS.filter(c => {
      const inScope = scope.length === 0 || scope.includes(c.requirement);
      return inScope && c.applicableTo.includes(entityType);
    }) as unknown as UniversalControl[];
  }
  if (framework === 'nist_ai_rmf') {
    return NIST_AI_CONTROLS.filter(c =>
      scope.length === 0 || scope.includes(c.function)
    ) as unknown as UniversalControl[];
  }
  if (framework === 'pci_pin') {
    return PCI_PIN_CONTROLS.filter(c =>
      scope.length === 0 || scope.includes(c.domain)
    ) as unknown as UniversalControl[];
  }
  return [];
}

export function getControlByIdForFramework(framework: Framework, id: string): UniversalControl | undefined {
  if (framework === 'soc2')        return getSOC2Control(id) as unknown as UniversalControl;
  if (framework === 'fedramp')     return getFedRAMPControlById(id) as unknown as UniversalControl;
  if (framework === 'pci_dss')     return getPCIControlById(id) as unknown as UniversalControl;
  if (framework === 'nist_ai_rmf') return getNISTAIControlById(id) as unknown as UniversalControl;
  if (framework === 'pci_pin')     return getPCIPINControlById(id) as unknown as UniversalControl;
  return undefined;
}

export function getControlCategoryKey(framework: Framework, control: any): string {
  return getCategoryKey(framework, control);
}

export function getCategoriesForFramework(framework: Framework): string[] {
  if (framework === 'soc2')
    return ['security','availability','processing_integrity','confidentiality','privacy'];
  if (framework === 'fedramp')
    return ['access_control','awareness_training','audit_accountability','assessment_authorization',
      'configuration_management','contingency_planning','identification_authentication',
      'incident_response','maintenance','media_protection','physical_environmental','planning',
      'program_management','personnel_security','pii_processing','risk_assessment',
      'system_acquisition','system_communications','system_integrity','supply_chain'];
  if (framework === 'pci_dss')
    return ['req_1_network_security','req_2_secure_config','req_3_protect_stored_data',
      'req_4_protect_transmission','req_5_anti_malware','req_6_secure_development',
      'req_7_restrict_access','req_8_authentication','req_9_physical_access',
      'req_10_logging_monitoring','req_11_security_testing','req_12_security_policy'];
  if (framework === 'nist_ai_rmf')
    return ['govern','map','measure','manage'];
  if (framework === 'pci_pin')
    return ['management','physical_security','logical_security','key_management','transaction_processing','monitoring_testing'];
  return [];
}
