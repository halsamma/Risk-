/**
 * Keyword-based audit document parser — no AI/API key required.
 *
 * Strategy (in order):
 *  1. Structured block parser  — finds "FINDING xxx – SEVERITY" blocks (matches
 *     the sample report format) and extracts control ID, status, description.
 *  2. Inline control-ID scan   — scans every paragraph for known control IDs
 *     and classifies each paragraph as non-compliant / partial based on keywords.
 *  3. Section-heading scan     — finds headings like "ACCESS CONTROL" or
 *     "KEY MANAGEMENT" and maps them to the framework's controls.
 */

import { getCategoriesForFramework, getControlsForAssessment, Framework } from '../data/framework';

// ── Types (same shape as the Claude parser) ──────────────────────────────────
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

// ── Control-ID regex patterns per framework ───────────────────────────────────
const CONTROL_ID_PATTERNS: Record<string, RegExp> = {
  soc2:        /\b(CC\d+\.\d+|A\d+\.\d+|PI\d+\.\d+|C\d+\.\d+|P\d+\.\d+)\b/g,
  fedramp:     /\b([A-Z]{1,3}-\d+(?:\(\d+\))?)\b/g,
  pci_dss:     /\bR(?:eq(?:uirement)?)?[-. ]?(\d{1,2})(?:\.\d+)?\b/gi,
  pci_pin:     /\b(MGMT|PHYS|LOGIC|KM|TXN|MON)-\d+\b/gi,
  nist_ai_rmf: /\b(GV|MAP|MS|MG)-\d+\.\d+\b/gi,
};

// ── Severity keywords ─────────────────────────────────────────────────────────
const SEVERITY_KEYWORDS: Array<{ words: RegExp; severity: ParsedFinding['severity'] }> = [
  { words: /\bcritical\b/i,                                   severity: 'critical' },
  { words: /\bhigh\b|\bsevere\b|\bserious\b|\bcritical\b/i,  severity: 'high'     },
  { words: /\bmedium\b|\bmoderate\b/i,                        severity: 'medium'   },
  { words: /\blow\b|\bminor\b|\binformational\b/i,            severity: 'low'      },
];

// ── Status keywords ───────────────────────────────────────────────────────────
const NON_COMPLIANT_WORDS = /\b(not\s+implemented|not\s+in\s+place|does\s+not\s+exist|no\s+(procedure|policy|process|control|formal|documented|dedicated)|never\s+(been|conducted|performed|tested)|missing|absent|none\s+exist|failed|non[-‑]compliant|not\s+compliant|gap|deficien|no\s+(evidence|record)|never)\b/i;
const PARTIAL_WORDS       = /\b(partial(?:ly)?|inadequate(?:ly)?|insufficien|not\s+fully|limited|some\s+(?:controls?|measures?)|improvement\s+needed|not\s+all|only\s+(?:some|partial)|incomplete|informal|undocumented|inconsistent|needs?\s+improvement)\b/i;
const COMPLIANT_WORDS     = /\b(compliant|in\s+place|implemented|adequate|sufficient|meeting|satisf(?:ies|actory)|yes\b)\b/i;

// ── Section → control-family mapping (used for section-heading fallback) ──────
const SECTION_HEADINGS: Array<{ pattern: RegExp; families: string[]; frameworks: string[] }> = [
  { pattern: /access\s+control/i,               families: ['access_control','security'],        frameworks: ['fedramp','soc2'] },
  { pattern: /key\s+management|cryptograph/i,   families: ['key_management'],                   frameworks: ['pci_pin'] },
  { pattern: /physical\s+security/i,            families: ['physical_security','physical_environmental'], frameworks: ['pci_pin','fedramp'] },
  { pattern: /logical\s+security/i,             families: ['logical_security'],                 frameworks: ['pci_pin'] },
  { pattern: /transaction\s+processing/i,       families: ['transaction_processing'],           frameworks: ['pci_pin'] },
  { pattern: /monitoring|audit\s+log/i,         families: ['monitoring_testing','audit_accountability'], frameworks: ['pci_pin','fedramp'] },
  { pattern: /management|administration/i,      families: ['management'],                       frameworks: ['pci_pin'] },
  { pattern: /incident\s+response/i,            families: ['incident_response'],                frameworks: ['fedramp','pci_pin'] },
  { pattern: /configuration\s+management/i,     families: ['configuration_management'],         frameworks: ['fedramp'] },
  { pattern: /risk\s+assessment/i,              families: ['risk_assessment'],                  frameworks: ['fedramp','soc2'] },
  { pattern: /personnel\s+security/i,           families: ['personnel_security'],               frameworks: ['fedramp','pci_pin'] },
  { pattern: /contingency|business\s+continuity/i, families: ['contingency_planning'],         frameworks: ['fedramp','soc2'] },
  { pattern: /govern/i,                          families: ['govern'],                           frameworks: ['nist_ai_rmf'] },
  { pattern: /\bmap\b|context|use\s+case/i,     families: ['map'],                             frameworks: ['nist_ai_rmf'] },
  { pattern: /measure|evaluat|test/i,           families: ['measure'],                          frameworks: ['nist_ai_rmf'] },
  { pattern: /manage|remedia|response/i,        families: ['manage'],                           frameworks: ['nist_ai_rmf'] },
];

// ── Helper: guess severity from a text block ──────────────────────────────────
function guessSeverity(text: string): ParsedFinding['severity'] {
  for (const { words, severity } of SEVERITY_KEYWORDS) {
    if (words.test(text)) return severity;
  }
  return 'medium';
}

// ── Helper: guess status from a text block ────────────────────────────────────
function guessStatus(text: string): 'no' | 'partial' | 'compliant' {
  if (COMPLIANT_WORDS.test(text) && !NON_COMPLIANT_WORDS.test(text) && !PARTIAL_WORDS.test(text)) return 'compliant';
  if (NON_COMPLIANT_WORDS.test(text)) return 'no';
  if (PARTIAL_WORDS.test(text)) return 'partial';
  return 'no'; // default assumption in an audit findings doc
}

// ── Helper: extract first non-empty sentence as title ────────────────────────
function extractTitle(text: string, maxLen = 80): string {
  const first = text.replace(/\s+/g, ' ').trim().split(/[.!?\n]/)[0].trim();
  return first.length > maxLen ? first.slice(0, maxLen - 1) + '…' : first;
}

// ── Helper: normalise a control ID to the framework's format ─────────────────
function normaliseControlId(raw: string, framework: string): string {
  if (framework === 'pci_dss') {
    // "Req 1", "REQ-6", "Requirement 12" → map to our internal requirement keys
    const reqMap: Record<string, string> = {
      '1': 'req_1_network_security', '2': 'req_2_secure_config', '3': 'req_3_protect_stored_data',
      '4': 'req_4_protect_transmission', '5': 'req_5_anti_malware', '6': 'req_6_secure_development',
      '7': 'req_7_restrict_access', '8': 'req_8_authentication', '9': 'req_9_physical_access',
      '10': 'req_10_logging_monitoring', '11': 'req_11_security_testing', '12': 'req_12_security_policy',
    };
    const num = raw.replace(/[^0-9]/g, '').slice(0, 2);
    return reqMap[num] ?? raw;
  }
  return raw.toUpperCase().replace(/\s+/g, '-');
}

// ── STRATEGY 1: Structured "FINDING" block parser ─────────────────────────────
// Handles reports like:
//   FINDING M-001 – CRITICAL
//   Control: PIN Security Policy (MGMT-1)
//   Status: PARTIAL / NOT IMPLEMENTED
//   Observation: ...
function parseStructuredBlocks(text: string, framework: string): ParsedFinding[] {
  const findings: ParsedFinding[] = [];

  // Split on FINDING / Finding / finding headers
  const blockRe = /(?:^|\n)(?:FINDING|Finding|finding)\s+[\w-]+\s*[–\-—]\s*(\w+)/gm;
  const blocks: Array<{ start: number; severityStr: string }> = [];
  let m: RegExpExecArray | null;

  while ((m = blockRe.exec(text)) !== null) {
    blocks.push({ start: m.index, severityStr: m[1] });
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = text.slice(blocks[i].start, blocks[i + 1]?.start ?? text.length);

    // Extract control ID — look for patterns like "(MGMT-1)" or "Control: ... (CC6.1)"
    let controlId: string | null = null;

    // Explicit "Control: ... (ID)" line
    const controlLine = block.match(/Control:\s*[^(\n]*([(（]([^)）\n]+)[)）])/i);
    if (controlLine) controlId = controlLine[2].trim();

    // If not found, scan block for any control-ID pattern
    if (!controlId) {
      const pat = CONTROL_ID_PATTERNS[framework];
      if (pat) {
        pat.lastIndex = 0;
        const cm = pat.exec(block);
        if (cm) controlId = cm[0];
      }
    }

    if (!controlId) continue;

    const normId = normaliseControlId(controlId, framework);

    // Status — look for "Status:" line
    const statusLine = block.match(/Status:\s*(.+)/i)?.[1]?.trim().toLowerCase() ?? '';
    let status: 'no' | 'partial' = 'no';
    if (/partial/i.test(statusLine)) status = 'partial';
    else if (/not\s+implemented|missing|absent/i.test(statusLine)) status = 'no';
    else status = guessStatus(block) === 'partial' ? 'partial' : 'no';

    // Severity
    const severity = guessSeverity(blocks[i].severityStr + ' ' + block);

    // Description — grab "Observation:" section or first 500 chars of block
    const obsMatch = block.match(/(?:Observation|Observations?|Finding|Details?):\s*([\s\S]{20,500}?)(?:\n(?:Recommendation|Finding|FINDING|$))/i);
    const description = obsMatch
      ? obsMatch[1].replace(/\s+/g, ' ').trim()
      : block.replace(/\n/g, ' ').trim().slice(0, 300);

    // Title — first line of finding block or "Recommendation" title
    const titleLine = block.split('\n').find(l => l.trim().length > 5 && !/^(FINDING|Control:|Status:|Observation|Recommend)/i.test(l.trim()));
    const title = titleLine ? extractTitle(titleLine) : extractTitle(description);

    findings.push({ controlId: normId, status, title, description, severity });
  }

  return findings;
}

// ── STRATEGY 2: Inline control-ID pattern scan ───────────────────────────────
function parseInlinePatterns(text: string, framework: string, knownIds: Set<string>): ParsedFinding[] {
  const findings: ParsedFinding[] = [];
  const seen = new Set<string>();
  const pattern = CONTROL_ID_PATTERNS[framework];
  if (!pattern) return findings;

  // Split into paragraphs
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 30);

  for (const para of paragraphs) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    const idsInPara: string[] = [];

    while ((match = pattern.exec(para)) !== null) {
      const raw = match[0];
      const norm = normaliseControlId(raw, framework);
      if (knownIds.has(norm) || knownIds.has(norm.toLowerCase())) {
        idsInPara.push(norm);
      }
    }

    if (idsInPara.length === 0) continue;

    const paraStatus = guessStatus(para);
    if (paraStatus === 'compliant') continue; // skip passing controls

    const severity = guessSeverity(para);
    const description = para.replace(/\s+/g, ' ').trim().slice(0, 400);

    for (const id of idsInPara) {
      if (seen.has(id)) continue;
      seen.add(id);
      findings.push({
        controlId: id,
        status: paraStatus === 'partial' ? 'partial' : 'no',
        title: `Gap identified: ${id}`,
        description,
        severity,
      });
    }
  }

  return findings;
}

// ── STRATEGY 3: Section-heading scan ─────────────────────────────────────────
function parseSectionHeadings(text: string, framework: string, knownControls: any[]): ParsedFinding[] {
  const findings: ParsedFinding[] = [];
  const lines = text.split('\n');
  let currentFamily: string | null = null;
  let sectionBuffer = '';

  for (const line of lines) {
    // Detect section headings (ALL CAPS line, or short line with ===)
    const isHeading = /^[A-Z\s\-–—]{6,}$/.test(line.trim()) || /^[=\-]{3,}$/.test(line.trim());
    if (isHeading && line.trim().length > 5) {
      // Flush previous section
      if (currentFamily && sectionBuffer) {
        const sectionStatus = guessStatus(sectionBuffer);
        if (sectionStatus !== 'compliant') {
          const familyControls = knownControls.filter((c: any) => {
            const cat = c.category || c.family || c.domain || c.function || c.requirement;
            return cat === currentFamily;
          });
          const severity = guessSeverity(sectionBuffer);
          for (const ctrl of familyControls.slice(0, 3)) {
            findings.push({
              controlId: ctrl.id,
              status: sectionStatus === 'partial' ? 'partial' : 'no',
              title: `${ctrl.title} — gap indicated in ${currentFamily} section`,
              description: sectionBuffer.replace(/\s+/g, ' ').trim().slice(0, 300),
              severity,
            });
          }
        }
        sectionBuffer = '';
        currentFamily = null;
      }

      // Match heading to a family
      for (const { pattern, families, frameworks } of SECTION_HEADINGS) {
        if (frameworks.includes(framework) && pattern.test(line)) {
          currentFamily = families[0];
          break;
        }
      }
    } else {
      sectionBuffer += ' ' + line;
    }
  }

  return findings;
}

// ── Main entry point ──────────────────────────────────────────────────────────
export function parseDocumentManually(
  documentText: string,
  framework: string,
  scope: string[]
): ParsedAuditFindings {
  const fw = framework as Framework;

  // Get all known controls for this framework/scope
  const knownControls = getControlsForAssessment(fw, scope);
  const knownIdSet = new Set(knownControls.map((c: any) => c.id));

  const findings: ParsedFinding[] = [];
  const seen = new Set<string>();

  // ── Run strategies in order ───────────────────────────────────────────────
  const strategy1 = parseStructuredBlocks(documentText, framework);
  for (const f of strategy1) {
    if (!seen.has(f.controlId)) { findings.push(f); seen.add(f.controlId); }
  }

  // Only run strategy 2/3 if strategy 1 didn't find much
  if (strategy1.length < 3) {
    const strategy2 = parseInlinePatterns(documentText, framework, knownIdSet);
    for (const f of strategy2) {
      if (!seen.has(f.controlId)) { findings.push(f); seen.add(f.controlId); }
    }

    if (strategy2.length < 3) {
      const strategy3 = parseSectionHeadings(documentText, framework, knownControls);
      for (const f of strategy3) {
        if (!seen.has(f.controlId)) { findings.push(f); seen.add(f.controlId); }
      }
    }
  }

  // Deduplicate by control ID, keep highest severity
  const byId = new Map<string, ParsedFinding>();
  for (const f of findings) {
    const existing = byId.get(f.controlId);
    if (!existing) { byId.set(f.controlId, f); continue; }
    const ORDER = { critical: 4, high: 3, medium: 2, low: 1 };
    if (ORDER[f.severity] > ORDER[existing.severity]) byId.set(f.controlId, f);
    if (f.status === 'no' && existing.status === 'partial') byId.set(f.controlId, { ...existing, status: 'no' });
  }

  const finalFindings = Array.from(byId.values());

  // Sort: critical first
  const ORDER = { critical: 4, high: 3, medium: 2, low: 1 };
  finalFindings.sort((a, b) => ORDER[b.severity] - ORDER[a.severity]);

  // Unmatched: paragraphs that mention non-compliance but no control ID
  const unmatched: Array<{ text: string; suggestedArea: string }> = [];
  if (strategy1.length === 0) {
    const paragraphs = documentText.split(/\n{2,}/).filter(p => p.trim().length > 50);
    for (const para of paragraphs.slice(0, 30)) {
      if (!NON_COMPLIANT_WORDS.test(para) && !PARTIAL_WORDS.test(para)) continue;
      const ids = Array.from(byId.keys());
      if (ids.some(id => para.includes(id))) continue;
      const area = SECTION_HEADINGS.find(s => s.pattern.test(para))?.families[0] ?? 'General';
      unmatched.push({ text: para.replace(/\s+/g, ' ').trim().slice(0, 200), suggestedArea: area });
      if (unmatched.length >= 5) break;
    }
  }

  // Detect document type
  let documentType = 'Audit Document';
  if (/gap\s+assessment/i.test(documentText)) documentType = 'Gap Assessment Report';
  else if (/penetration\s+test|pentest/i.test(documentText)) documentType = 'Penetration Test Report';
  else if (/internal\s+audit/i.test(documentText)) documentType = 'Internal Audit Report';
  else if (/qsa|qualified\s+security/i.test(documentText)) documentType = 'QSA Assessment Report';
  else if (/findings?\s+letter|auditor/i.test(documentText)) documentType = 'Auditor Findings Letter';
  else if (/FINDING/m.test(documentText)) documentType = 'Structured Findings Report';

  const critCount = finalFindings.filter(f => f.severity === 'critical').length;
  const highCount = finalFindings.filter(f => f.severity === 'high').length;
  const noCount   = finalFindings.filter(f => f.status === 'no').length;
  const partCount = finalFindings.filter(f => f.status === 'partial').length;

  const summary = finalFindings.length === 0
    ? `No compliance findings were detected in the uploaded document for the ${framework.replace(/_/g,' ').toUpperCase()} framework. Try using a more structured report format or paste the document text directly.`
    : `Parsed ${finalFindings.length} finding(s) from the ${documentType} (${framework.replace(/_/g,' ').toUpperCase()}): ${critCount} critical, ${highCount} high. ${noCount} controls not implemented, ${partCount} partially implemented.`;

  return { framework, summary, documentType, findings: finalFindings, unmatched };
}
