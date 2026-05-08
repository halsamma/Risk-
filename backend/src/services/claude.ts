import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { TSCCategory } from '../data/soc2-controls';
import { Framework } from '../data/framework';
import { logger } from '../utils/logger';

function getClient(): Anthropic {
  if (!env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not configured. Add it to your .env file.');
  return new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
}

const MODEL = 'claude-sonnet-4-6';

interface RemediationInput {
  framework?: Framework;
  control: { id: string; title: string; category?: string; family?: string; objective: string; description: string };
  finding: { severity: string; title: string; description: string; status: string };
  assessmentName: string;
  companyName: string;
  additionalContext?: string;
}

interface RemediationPlanOutput {
  summary: string;
  priority: string;
  estimatedEffort: string;
  steps: Array<{
    order: number;
    title: string;
    description: string;
    effort: string;
    timeframe: string;
    acceptanceCriteria: string;
    tools?: string[];
  }>;
  successMetrics: string[];
  risks: string[];
  relatedControls: string[];
}

export async function generateAIRemediation(input: RemediationInput): Promise<RemediationPlanOutput> {
  const fw = input.framework ?? 'soc2';
  const frameworkLabel = fw === 'fedramp' ? 'FedRAMP Moderate' : 'SOC 2';
  const category = input.control.category ?? input.control.family ?? 'N/A';
  const prompt = `You are a ${frameworkLabel} compliance expert helping an organization remediate a security control finding.

**Framework:** ${frameworkLabel}
**Organization:** ${input.companyName}
**Assessment:** ${input.assessmentName}
**Control ID:** ${input.control.id}
**Control Title:** ${input.control.title}
**Control Category/Family:** ${category}
**Finding Severity:** ${input.finding.severity}
**Finding:** ${input.finding.title}
**Control Objective:** ${input.control.objective}
**Control Description:** ${input.control.description}
${input.additionalContext ? `**Additional Context from the organization:** ${input.additionalContext}` : ''}

Generate a detailed, actionable remediation plan tailored to this organization. The plan should be practical, specific, and sequenced correctly.

Respond ONLY with valid JSON matching this exact structure:
{
  "summary": "2-3 sentence summary of what needs to be done and why",
  "priority": "immediate|short_term|medium_term",
  "estimatedEffort": "e.g., 2-4 weeks with 1 FTE",
  "steps": [
    {
      "order": 1,
      "title": "Step title",
      "description": "Detailed description of what to do, how to do it, and who should be involved",
      "effort": "low|medium|high",
      "timeframe": "e.g., 3 days",
      "acceptanceCriteria": "How to verify this step is complete",
      "tools": ["optional list of specific tools/technologies"]
    }
  ],
  "successMetrics": ["How to measure success of the full remediation"],
  "risks": ["Key risks to watch during remediation"],
  "relatedControls": ["Other control IDs that this remediation will also help with"]
}`;

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

  try {
    return JSON.parse(jsonStr) as RemediationPlanOutput;
  } catch {
    logger.error('Failed to parse AI remediation response:', text);
    throw new Error('AI returned invalid response format');
  }
}

interface DocumentAnalysisOutput {
  summary: string;
  coveredControls: Array<{
    controlId: string;
    confidence: 'high' | 'medium' | 'low';
    evidence: string;
    suggestedStatus: 'yes' | 'partial' | 'no';
  }>;
  gaps: Array<{
    area: string;
    description: string;
    suggestedControls: string[];
  }>;
  documentType: string;
  recommendations: string[];
}

export async function analyzeDocument(content: string, scope: TSCCategory[]): Promise<DocumentAnalysisOutput> {
  const prompt = `You are a SOC 2 compliance auditor analyzing a policy or procedure document.

**Assessment Scope:** ${scope.join(', ')}

**Document Content:**
${content.slice(0, 30000)}

Analyze this document against SOC 2 Trust Service Criteria and identify:
1. Which SOC 2 controls are evidenced by this document
2. The quality of the evidence (high/medium/low confidence)
3. Gaps in the document relative to common SOC 2 requirements
4. Recommendations for improvement

Respond ONLY with valid JSON matching this exact structure:
{
  "summary": "Brief summary of what the document is and its overall quality for SOC 2 purposes",
  "documentType": "e.g., Information Security Policy, Incident Response Plan, Access Control Policy",
  "coveredControls": [
    {
      "controlId": "e.g., CC6.1",
      "confidence": "high|medium|low",
      "evidence": "Specific quote or section that covers this control",
      "suggestedStatus": "yes|partial|no"
    }
  ],
  "gaps": [
    {
      "area": "Area of concern",
      "description": "What is missing or insufficient",
      "suggestedControls": ["CC6.1", "CC7.2"]
    }
  ],
  "recommendations": ["Specific actionable improvement recommendations"]
}`;

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

  try {
    return JSON.parse(jsonStr) as DocumentAnalysisOutput;
  } catch {
    logger.error('Failed to parse document analysis response:', text);
    throw new Error('AI returned invalid response format');
  }
}

interface GuidanceInput {
  controlId: string;
  controlTitle: string;
  controlDescription: string;
  question: string;
  companyContext?: string;
}

export async function getControlGuidance(input: GuidanceInput): Promise<string> {
  const prompt = `You are a SOC 2 compliance expert. A GRC professional is asking for guidance about a specific control.

**Control:** ${input.controlId} — ${input.controlTitle}
**Control Description:** ${input.controlDescription}
${input.companyContext ? `**Company Context:** ${input.companyContext}` : ''}

**Question:** ${input.question}

Provide a clear, practical, expert answer. Be specific and actionable. Keep it under 400 words.`;

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// ── Audit Findings Parser ──────────────────────────────────────────────────
export interface ParsedFinding {
  controlId: string;
  status: 'no' | 'partial';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface ParsedAuditFindings {
  framework: string;
  summary: string;
  documentType: string;
  findings: ParsedFinding[];
  unmatched: Array<{ text: string; suggestedArea: string }>;
}

export async function parseAuditFindings(
  documentText: string,
  framework: string,
  scope: string[]
): Promise<ParsedAuditFindings> {
  const prompt = `You are a compliance expert parsing an audit report or gap assessment document.

**Framework:** ${framework.replace(/_/g, ' ').toUpperCase()}
**Scope:** ${scope.join(', ')}

**Document Content:**
${documentText.slice(0, 60000)}

Extract all compliance findings, gaps, and deficiencies from this document and map them to the specified framework's control IDs.

For ${framework === 'soc2' ? 'SOC 2, use control IDs like CC1.1, CC6.1, A1.2, etc.' :
     framework === 'fedramp' ? 'FedRAMP, use control IDs like AC-1, AC-2, AU-6, etc.' :
     framework === 'pci_dss' ? 'PCI DSS, use requirement IDs like REQ-1.1, REQ-6.3, etc.' :
     'NIST AI RMF, use IDs like GV-1.1, MAP-4.1, MS-2.5, MG-2.3, etc.'}

Respond ONLY with valid JSON:
{
  "framework": "${framework}",
  "summary": "2-3 sentence summary of the document and its overall compliance picture",
  "documentType": "e.g., SOC 2 Gap Assessment, Pentest Report, Internal Audit Report, Auditor Findings Letter",
  "findings": [
    {
      "controlId": "exact control ID from the framework",
      "status": "no | partial",
      "title": "Short title for the finding",
      "description": "What the document says is wrong or missing",
      "severity": "critical | high | medium | low"
    }
  ],
  "unmatched": [
    {
      "text": "Finding text from the document that could not be mapped to a specific control ID",
      "suggestedArea": "The general compliance area this relates to"
    }
  ]
}`;

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

  try {
    return JSON.parse(jsonStr) as ParsedAuditFindings;
  } catch {
    logger.error('Failed to parse audit findings response:', text);
    throw new Error('AI returned invalid response format when parsing audit document');
  }
}
