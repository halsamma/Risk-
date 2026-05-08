import { NIST_AI_EXAMPLES } from './nist-ai-rmf-examples';
import { ControlExample, RemediationStep, Severity } from './soc2-controls';

export type NISTAIFunction = 'govern' | 'map' | 'measure' | 'manage';

export interface NISTAIControl {
  id: string;                    // e.g. "GV-1.1"
  function: NISTAIFunction;
  category: string;              // e.g. "GV-1"
  title: string;
  description: string;
  objective: string;
  guidance: string[];
  evidenceExamples: string[];
  severity: Severity;
  staticRemediation: RemediationStep[];
  example?: ControlExample;
}

export const NIST_AI_FUNCTION_LABELS: Record<NISTAIFunction, { label: string; abbr: string; color: string; description: string }> = {
  govern:  { label: 'GOVERN (GV)',  abbr: 'GV', color: '#6366f1', description: 'Policies, accountability, culture, and organizational risk management for AI' },
  map:     { label: 'MAP (MP)',     abbr: 'MP', color: '#22c55e', description: 'Identify AI context, intended uses, potential harms, and risk categorization' },
  measure: { label: 'MEASURE (MS)', abbr: 'MS', color: '#f59e0b', description: 'Analyze, test, evaluate, and monitor AI risk using quantitative and qualitative tools' },
  manage:  { label: 'MANAGE (MG)', abbr: 'MG', color: '#ef4444', description: 'Prioritize, respond to, and recover from AI risks through defined processes' },
};

export const NIST_AI_CONTROLS: NISTAIControl[] = [

  // ── GOVERN ────────────────────────────────────────────────────────────────
  {
    id: 'GV-1.1', function: 'govern', category: 'GV-1', severity: 'high',
    title: 'Legal and Regulatory AI Requirements',
    description: 'Legal and regulatory requirements involving AI are understood, managed, and documented.',
    objective: 'Identify all applicable laws, regulations, and standards that apply to your AI system and document compliance obligations.',
    guidance: [
      'Inventory applicable AI regulations (EU AI Act, state AI laws, sector-specific rules)',
      'Document legal basis for AI decisions that affect individuals',
      'Include AI-specific clauses in contracts with customers and vendors',
      'Assign legal/compliance ownership for AI regulatory monitoring',
    ],
    evidenceExamples: ['AI regulatory inventory document', 'Legal review records for AI use cases', 'Contractual AI clauses', 'Compliance calendar for AI regulations'],
    staticRemediation: [
      { order: 1, title: 'Create AI Regulatory Inventory', description: 'List every regulation, standard, and guideline that applies to your AI systems (EU AI Act, CCPA, HIPAA if applicable, sector rules). Map each to your AI use cases.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 2, title: 'Assign Regulatory Owners', description: 'Name a person responsible for monitoring and responding to each regulatory area.', effort: 'low', timeframe: '3 days' },
      { order: 3, title: 'Update Contracts', description: 'Add AI-specific clauses to customer and vendor contracts (transparency, data use, right to explanation).', effort: 'high', timeframe: '3–4 weeks' },
    ],
  },
  {
    id: 'GV-1.2', function: 'govern', category: 'GV-1', severity: 'high',
    title: 'Trustworthy AI in Organizational Mission',
    description: 'The characteristics of trustworthy AI are integrated into organizational policies and mission.',
    objective: 'Embed trustworthy AI principles (fairness, transparency, safety, explainability) into organizational values and policies.',
    guidance: [
      'Define what "trustworthy AI" means for your organization',
      'Include AI ethics principles in the information security policy or a dedicated AI policy',
      'Communicate AI principles to all staff who build or use AI',
      'Reference NIST AI RMF characteristics: valid/reliable, safe, secure/resilient, explainable/interpretable, privacy-enhanced, fair/unbiased, accountable/transparent',
    ],
    evidenceExamples: ['AI ethics policy or principles document', 'AI policy acknowledgment records', 'Leadership communications about AI principles'],
    staticRemediation: [
      { order: 1, title: 'Publish AI Ethics Policy', description: 'Write a 1–2 page AI ethics policy covering the 7 trustworthy AI characteristics from NIST AI RMF. Get executive sign-off.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Staff Communication', description: 'Share the policy with all teams that build, deploy, or use AI. Collect acknowledgments.', effort: 'low', timeframe: '1 week' },
    ],
  },
  {
    id: 'GV-1.3', function: 'govern', category: 'GV-1', severity: 'high',
    title: 'Leadership Commitment to AI Risk Culture',
    description: 'Organizational leadership is committed to a culture that addresses and communicates AI risk.',
    objective: 'Ensure leadership visibly champions responsible AI practices.',
    guidance: [
      'Leadership endorses the AI risk management program in writing',
      'AI risk is a standing agenda item in leadership/board meetings',
      'Leadership sets tone for escalating AI concerns without reprisal',
    ],
    evidenceExamples: ['CEO/leadership statement on AI risk', 'Board meeting minutes mentioning AI risk', 'Internal communications from leadership on AI policy'],
    staticRemediation: [
      { order: 1, title: 'Leadership AI Risk Statement', description: 'Have the CEO or CTO publish an internal statement committing the organization to responsible AI development.', effort: 'low', timeframe: '1 week' },
      { order: 2, title: 'Add AI Risk to Leadership Reviews', description: 'Add AI risk as a standing quarterly review item for the leadership team. Document discussions.', effort: 'low', timeframe: '1 week' },
    ],
  },
  {
    id: 'GV-1.5', function: 'govern', category: 'GV-1', severity: 'medium',
    title: 'Ongoing Monitoring of AI Risk Management',
    description: 'Ongoing monitoring and periodic review of the AI risk management process and its outcomes exist.',
    objective: 'Continuously assess whether the AI risk management program is effective.',
    guidance: [
      'Review AI risk management outcomes quarterly',
      'Track metrics: AI incidents, bias complaints, model drift events',
      'Update AI risk policies based on new incidents or regulatory changes',
    ],
    evidenceExamples: ['Quarterly AI risk review records', 'AI incident log', 'Policy update history with rationale'],
    staticRemediation: [
      { order: 1, title: 'Establish AI Risk Review Cadence', description: 'Schedule quarterly reviews of the AI risk management program. Review incidents, metrics, and policy gaps.', effort: 'medium', timeframe: '1 week setup + ongoing' },
    ],
  },
  {
    id: 'GV-1.6', function: 'govern', category: 'GV-1', severity: 'high',
    title: 'Third-Party AI Software and Data Policies',
    description: 'Policies and procedures are in place to address AI risks and benefits arising from third-party software and data.',
    objective: 'Manage risks from AI tools, models, and datasets sourced from external parties.',
    guidance: [
      'Inventory all third-party AI components (APIs, models, datasets, services)',
      'Evaluate each for bias, provenance, security, and contractual terms',
      'Require AI transparency documentation (model cards, datasheets) from vendors',
      'Include AI-specific provisions in vendor contracts',
    ],
    evidenceExamples: ['Third-party AI inventory', 'Vendor AI risk assessments', 'Model cards or datasheets from vendors', 'Contract AI clauses'],
    staticRemediation: [
      { order: 1, title: 'Create Third-Party AI Inventory', description: 'List all external AI APIs, models, and datasets used in your systems. Rate each by risk (high/medium/low).', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Request Model Cards', description: 'Ask high-risk AI vendors for model cards or equivalent documentation. Evaluate for bias, accuracy, and limitations.', effort: 'medium', timeframe: '2–4 weeks' },
    ],
  },
  {
    id: 'GV-1.7', function: 'govern', category: 'GV-1', severity: 'medium',
    title: 'AI System Decommissioning',
    description: 'Processes and procedures are in place for decommissioning and phasing out AI systems safely.',
    objective: 'Ensure AI systems are retired in a controlled, safe manner that addresses data and model risks.',
    guidance: [
      'Define criteria for when an AI system should be decommissioned',
      'Document decommissioning procedures (model deletion, data purge, access revocation)',
      'Notify affected stakeholders before decommissioning',
      'Preserve audit trails from decommissioned AI systems',
    ],
    evidenceExamples: ['AI decommissioning policy', 'Completed decommissioning checklists', 'Stakeholder notification records'],
    staticRemediation: [
      { order: 1, title: 'Write AI Decommissioning Procedure', description: 'Document steps for retiring an AI system: notify users, archive logs, delete model weights, purge training data per retention policy, revoke API keys.', effort: 'medium', timeframe: '1 week' },
    ],
  },
  {
    id: 'GV-2.1', function: 'govern', category: 'GV-2', severity: 'critical',
    title: 'AI Risk Roles and Responsibilities',
    description: 'Roles and responsibilities and the corresponding organizational teams for AI risk management are defined, assigned, and communicated.',
    objective: 'Establish clear accountability for AI risk across the organization.',
    guidance: [
      'Define AI risk roles: AI Risk Owner, Model Owner, TEVV Lead, Ethics Reviewer',
      'Assign named individuals to each role',
      'Publish an AI RACI matrix',
      'Ensure the AI risk function reports to executive leadership',
    ],
    evidenceExamples: ['AI RACI matrix', 'Org chart showing AI risk function', 'Job descriptions with AI risk responsibilities', 'Named AI risk owners per system'],
    staticRemediation: [
      { order: 1, title: 'Define AI Risk Roles', description: 'Create role definitions for: AI Risk Officer, Model Owner (per model), Testing/Evaluation Lead, and Responsible AI Reviewer.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Publish AI RACI Matrix', description: 'Map all AI risk activities (training, testing, deployment, monitoring, decommissioning) to responsible parties.', effort: 'medium', timeframe: '1 week' },
    ],
  },
  {
    id: 'GV-2.2', function: 'govern', category: 'GV-2', severity: 'high',
    title: 'AI Risk Accountability and Explainability of Decisions',
    description: 'Teams responsible for AI risk management can explain and defend their work to appropriate oversight bodies.',
    objective: 'Ensure AI decision-making processes are documented and defensible.',
    guidance: [
      'Document rationale for key AI design and deployment decisions',
      'Maintain decision logs for high-stakes AI outputs',
      'Prepare explainability briefings for leadership and external auditors',
    ],
    evidenceExamples: ['AI decision logs', 'Model design rationale documents', 'Audit-ready AI documentation package'],
    staticRemediation: [
      { order: 1, title: 'Create AI Decision Log', description: 'Implement a log capturing key decisions: model selection rationale, training data choices, threshold settings, and deployment approvals.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'GV-3.1', function: 'govern', category: 'GV-3', severity: 'high',
    title: 'AI Risk Knowledge Sharing',
    description: 'AI risk and benefit knowledge is communicated across the organization to build a shared understanding.',
    objective: 'Ensure all relevant teams understand AI risks and how to identify and report them.',
    guidance: [
      'Conduct AI risk training for all staff who build, deploy, or use AI',
      'Include AI risk in onboarding for technical roles',
      'Share AI risk updates (incidents, new regulations) organization-wide',
    ],
    evidenceExamples: ['AI risk training completion records', 'Internal AI risk newsletter or communications', 'Onboarding materials with AI risk content'],
    staticRemediation: [
      { order: 1, title: 'Deploy AI Risk Training', description: 'Create a 1-hour AI risk training covering: what AI risks are, how to identify them, how to report concerns, and your organization\'s AI policies.', effort: 'medium', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'GV-4.1', function: 'govern', category: 'GV-4', severity: 'high',
    title: 'Critical Thinking Culture for AI',
    description: 'Organizational policies and practices are in place to foster a critical thinking and safety-first culture for AI.',
    objective: 'Create psychological safety for raising AI risk concerns and questioning AI outputs.',
    guidance: [
      'Establish a no-reprisal policy for reporting AI concerns',
      'Run pre-mortems before deploying high-stakes AI',
      'Encourage red team exercises and adversarial testing',
      'Document lessons learned from AI incidents',
    ],
    evidenceExamples: ['No-reprisal policy for AI concerns', 'Pre-deployment AI risk review records', 'Red team exercise reports', 'Lessons learned log'],
    staticRemediation: [
      { order: 1, title: 'Establish AI Concern Reporting Channel', description: 'Create a dedicated channel (Slack, ticketing system) for staff to raise AI risks. Guarantee no-reprisal. Assign an owner to respond within 5 business days.', effort: 'low', timeframe: '1 week' },
      { order: 2, title: 'Pre-Deployment Risk Review', description: 'Before every significant AI deployment, run a structured 30-min pre-mortem: "What could go wrong?" Document findings.', effort: 'medium', timeframe: '1 week to establish + ongoing' },
    ],
  },
  {
    id: 'GV-5.1', function: 'govern', category: 'GV-5', severity: 'high',
    title: 'External Feedback Mechanisms',
    description: 'Organizational policies and practices are in place to collect, consider, prioritize, and integrate feedback from those external to the team.',
    objective: 'Create pathways for users, affected communities, and external experts to provide AI feedback.',
    guidance: [
      'Provide a public mechanism for users to report AI errors, bias, or harms',
      'Conduct user research and impact assessments involving affected communities',
      'Act on feedback and communicate changes made',
    ],
    evidenceExamples: ['Public feedback/reporting mechanism', 'User research reports', 'Log of feedback received and actions taken'],
    staticRemediation: [
      { order: 1, title: 'Create AI Feedback Channel', description: 'Add an "AI Feedback" form to your product where users can report incorrect, biased, or harmful AI outputs. Route to the AI risk owner.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Conduct Affected Community Consultation', description: 'For high-impact AI systems, conduct structured interviews or surveys with affected communities before deployment.', effort: 'high', timeframe: '4–6 weeks' },
    ],
  },
  {
    id: 'GV-6.1', function: 'govern', category: 'GV-6', severity: 'critical',
    title: 'AI Supply Chain Risk Management',
    description: 'Policies and procedures are in place to address AI risks and benefits from third-party AI components including supply chain issues.',
    objective: 'Assess and manage risks from AI components sourced externally including foundation models, datasets, and APIs.',
    guidance: [
      'Require AI suppliers to disclose training data sources and known limitations',
      'Evaluate third-party AI models for bias before production use',
      'Include AI-specific contractual protections (SLAs, incident notification)',
      'Monitor third-party AI APIs for performance degradation or behavioral changes',
    ],
    evidenceExamples: ['Third-party AI risk assessments', 'Supplier AI transparency disclosures', 'AI API performance monitoring dashboards', 'AI-specific contract clauses'],
    staticRemediation: [
      { order: 1, title: 'Tier AI Suppliers by Risk', description: 'Classify all AI suppliers: Tier 1 (foundation models, core AI APIs — highest scrutiny), Tier 2 (supporting AI services), Tier 3 (low-risk tools).', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Require Model Cards from Tier 1 Suppliers', description: 'Request model cards or AI system documentation from all Tier 1 AI suppliers. Evaluate for known biases, limitations, and training data provenance.', effort: 'medium', timeframe: '2–4 weeks' },
    ],
  },

  // ── MAP ───────────────────────────────────────────────────────────────────
  {
    id: 'MAP-1.1', function: 'map', category: 'MAP-1', severity: 'critical',
    title: 'AI Intended Purpose and Context of Use',
    description: 'Intended purposes, potentially beneficial uses, context of use, and assumptions and limitations of the AI system are articulated.',
    objective: 'Clearly document what the AI system is for, who it affects, and where it should and should not be used.',
    guidance: [
      'Document the intended use case and target users for each AI system',
      'List explicitly prohibited uses (out-of-scope uses)',
      'Document assumptions about input data quality and user behavior',
      'Identify which populations are directly or indirectly affected',
    ],
    evidenceExamples: ['AI system use case document', 'Intended and prohibited use list', 'Affected population analysis', 'AI system card'],
    staticRemediation: [
      { order: 1, title: 'Write AI System Card', description: 'For every AI system, create a system card documenting: intended use, prohibited use, target users, data inputs, known limitations, and affected populations.', effort: 'medium', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'MAP-1.3', function: 'map', category: 'MAP-1', severity: 'critical',
    title: 'AI Impact and Harm Assessment',
    description: 'Potential impacts including harms, benefits, and risks of the AI system are assessed and documented.',
    objective: 'Systematically identify and document potential harms before deploying AI.',
    guidance: [
      'Conduct a structured AI impact assessment before deployment',
      'Consider harms to: users, non-users, groups, society, and the environment',
      'Identify both direct harms (from AI outputs) and indirect harms (from misuse)',
      'Document benefit claims and the evidence supporting them',
    ],
    evidenceExamples: ['AI Impact Assessment (AIIA) document', 'Harm taxonomy for the AI system', 'Benefit evidence documentation'],
    staticRemediation: [
      { order: 1, title: 'Conduct AI Impact Assessment', description: 'Run a structured impact assessment for each deployed AI system. Use the NIST AI RMF playbook or equivalent framework. Document all identified harms and mitigations.', effort: 'high', timeframe: '3–4 weeks' },
    ],
  },
  {
    id: 'MAP-1.4', function: 'map', category: 'MAP-1', severity: 'high',
    title: 'AI Risk Tolerance',
    description: 'Organizational risk tolerances are determined and documented for AI systems.',
    objective: 'Define how much AI risk the organization is willing to accept, by risk type and use case.',
    guidance: [
      'Define risk tolerance levels for AI: what risks are acceptable vs. unacceptable',
      'Differentiate tolerance by AI use case type (low stakes vs. high stakes)',
      'Document risk tolerance thresholds that trigger escalation or halt deployment',
    ],
    evidenceExamples: ['AI risk tolerance policy', 'Risk tolerance thresholds per AI use case category', 'Escalation criteria for exceeding tolerance'],
    staticRemediation: [
      { order: 1, title: 'Define AI Risk Tolerance Statement', description: 'Write a risk tolerance statement for AI: acceptable risk levels for bias, accuracy, fairness, and reliability. Different thresholds for different stakes (e.g., customer-facing vs. internal).', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'MAP-1.6', function: 'map', category: 'MAP-1', severity: 'high',
    title: 'AI Adversarial Risk Assessment',
    description: 'Risk to AI systems from malicious actors including adversarial attacks, data poisoning, and model theft are assessed.',
    objective: 'Identify and mitigate security threats specifically targeting AI systems.',
    guidance: [
      'Assess vulnerability to adversarial inputs (prompt injection, adversarial examples)',
      'Assess risk of training data poisoning',
      'Assess model extraction and intellectual property risks',
      'Implement adversarial robustness testing',
    ],
    evidenceExamples: ['Adversarial AI risk assessment', 'Prompt injection test results', 'Data poisoning defense documentation', 'AI-specific pen test report'],
    staticRemediation: [
      { order: 1, title: 'Adversarial AI Risk Assessment', description: 'For each AI system, assess: can inputs be crafted to cause harmful outputs? Can training data be poisoned? Can the model be extracted? Document findings.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Prompt Injection Testing (LLMs)', description: 'If using LLMs, run structured prompt injection tests. Test for jailbreaking, data leakage, and instruction override vulnerabilities.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'MAP-2.3', function: 'map', category: 'MAP-2', severity: 'high',
    title: 'AI Risk Categorization',
    description: 'AI risks are categorized in terms of type and effect with attention to context.',
    objective: 'Classify AI systems by risk level to determine the appropriate governance rigor.',
    guidance: [
      'Classify each AI system as: minimal, limited, high, or unacceptable risk',
      'Use EU AI Act prohibited/high-risk categories as a reference',
      'Document the categorization rationale',
      'Apply stricter controls to high-risk AI systems',
    ],
    evidenceExamples: ['AI system risk classification register', 'EU AI Act mapping for each AI system', 'Risk categorization rationale', 'Risk-based control matrix'],
    staticRemediation: [
      { order: 1, title: 'Create AI Risk Classification Register', description: 'List every AI system with its risk category (Minimal/Limited/High/Unacceptable) and justification. Use the EU AI Act Annex III as a checklist for high-risk use cases.', effort: 'medium', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'MAP-3.1', function: 'map', category: 'MAP-3', severity: 'high',
    title: 'AI Benefits Identification',
    description: 'Potential benefits of the intended AI are identified, quantified where possible, and communicated to stakeholders.',
    objective: 'Document evidence-based benefit claims to balance against risk assessments.',
    guidance: [
      'Define measurable success metrics for each AI system',
      'Conduct baseline measurement before AI deployment',
      'Track realized vs. projected benefits post-deployment',
      'Communicate benefit evidence to stakeholders honestly',
    ],
    evidenceExamples: ['AI success metrics dashboard', 'Pre/post deployment performance comparison', 'Benefit realization report'],
    staticRemediation: [
      { order: 1, title: 'Define AI Success Metrics', description: 'For each AI system, define 3–5 measurable success metrics. Establish baselines before deployment. Track monthly.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'MAP-4.1', function: 'map', category: 'MAP-4', severity: 'critical',
    title: 'Bias Measurement Approaches',
    description: 'Approaches for measuring and assessing bias are known, documented, and applied to the AI system.',
    objective: 'Implement structured bias measurement before and after AI deployment.',
    guidance: [
      'Define which bias metrics apply to your AI system (demographic parity, equal opportunity, etc.)',
      'Measure bias across protected characteristics (race, gender, age, disability)',
      'Test on disaggregated datasets by demographic group',
      'Document thresholds for acceptable vs. unacceptable bias levels',
    ],
    evidenceExamples: ['Bias metrics definition document', 'Disaggregated performance test results', 'Bias threshold policy', 'Bias testing code/methodology'],
    staticRemediation: [
      { order: 1, title: 'Define Bias Metrics', description: 'Choose the appropriate fairness metrics for your use case (e.g., demographic parity for hiring, equal opportunity for lending). Document why each metric was chosen.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Run Disaggregated Bias Tests', description: 'Test model performance separately for each protected group. Compare accuracy, false positive rates, and false negative rates across groups.', effort: 'high', timeframe: '2–4 weeks' },
    ],
  },
  {
    id: 'MAP-5.1', function: 'map', category: 'MAP-5', severity: 'high',
    title: 'AI Risk Likelihood and Impact Estimation',
    description: 'Likelihood and magnitude of each identified AI impact based on expected and real-world conditions are evaluated.',
    objective: 'Quantify AI risks to enable prioritization of mitigation efforts.',
    guidance: [
      'Estimate probability of each identified harm occurring',
      'Estimate severity of impact (individual, group, societal level)',
      'Factor in real-world deployment conditions (not just ideal conditions)',
      'Update estimates as real-world data becomes available',
    ],
    evidenceExamples: ['AI risk register with likelihood and impact ratings', 'Real-world condition analysis', 'Risk prioritization matrix'],
    staticRemediation: [
      { order: 1, title: 'Build AI Risk Register with Ratings', description: 'For each identified AI harm, assign: likelihood (1–5), impact severity (1–5), affected population size, and risk score. Prioritize mitigations by score.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },

  // ── MEASURE ───────────────────────────────────────────────────────────────
  {
    id: 'MS-1.1', function: 'measure', category: 'MS-1', severity: 'high',
    title: 'AI Risk Measurement Methodology',
    description: 'Approaches and metrics for measuring and identifying AI risks, impacts, and effects are selected and documented.',
    objective: 'Establish a consistent methodology for measuring AI risk across all systems.',
    guidance: [
      'Select risk metrics aligned to trustworthy AI characteristics',
      'Document measurement methodology for each AI risk dimension',
      'Use quantitative metrics where possible; qualitative where not',
      'Reference standard benchmarks (HELM, BIG-bench for LLMs; standard ML fairness toolkits)',
    ],
    evidenceExamples: ['AI risk measurement methodology document', 'Metrics selection rationale', 'Benchmark references', 'Measurement cadence schedule'],
    staticRemediation: [
      { order: 1, title: 'Define AI Risk Measurement Methodology', description: 'Document your measurement approach: what metrics, how they are collected, what tools are used (Fairlearn, IBM AI Fairness 360, LIME, SHAP, etc.), and how often.', effort: 'high', timeframe: '3–4 weeks' },
    ],
  },
  {
    id: 'MS-2.1', function: 'measure', category: 'MS-2', severity: 'critical',
    title: 'Real-World Test Sets',
    description: 'Test sets reflecting real-world conditions and actual usage patterns are developed and used to evaluate AI systems.',
    objective: 'Evaluate AI systems on data that reflects actual deployment conditions, not just clean benchmark data.',
    guidance: [
      'Build evaluation datasets from real-world production data (with privacy safeguards)',
      'Include edge cases, out-of-distribution inputs, and adversarial examples',
      'Include representation from all affected demographic groups',
      'Refresh test sets periodically to reflect distribution shifts',
    ],
    evidenceExamples: ['Evaluation dataset description', 'Dataset demographic distribution report', 'Test set refresh schedule', 'Out-of-distribution test results'],
    staticRemediation: [
      { order: 1, title: 'Build Production-Representative Test Set', description: 'Collect a sample of real-world production inputs (anonymized). Supplement with edge cases and adversarial examples. Use this as the primary evaluation benchmark.', effort: 'high', timeframe: '3–4 weeks' },
    ],
  },
  {
    id: 'MS-2.2', function: 'measure', category: 'MS-2', severity: 'critical',
    title: 'AI System Performance Evaluation',
    description: 'AI system performance or assurance criteria are measured and documented before and after deployment.',
    objective: 'Establish baseline performance metrics and track them over the AI system lifecycle.',
    guidance: [
      'Define performance thresholds (minimum acceptable accuracy, F1, etc.)',
      'Measure performance pre-deployment and after each model update',
      'Track performance by subgroup, not just aggregate',
      'Define performance degradation thresholds that trigger review',
    ],
    evidenceExamples: ['Model performance report', 'Performance threshold documentation', 'Subgroup performance breakdown', 'Performance trend dashboard'],
    staticRemediation: [
      { order: 1, title: 'Establish Performance Baselines', description: 'Measure and document baseline performance metrics for every AI system. Define the minimum acceptable threshold that would trigger review or rollback.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Subgroup Performance Analysis', description: 'Break performance metrics down by relevant demographic groups and use cases. Identify and document any performance disparities.', effort: 'high', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'MS-2.5', function: 'measure', category: 'MS-2', severity: 'critical',
    title: 'AI Bias and Fairness Testing',
    description: 'The AI system undergoes structured bias and fairness testing before deployment.',
    objective: 'Detect and document bias in AI outputs across all affected groups before go-live.',
    guidance: [
      'Run bias tests on all protected characteristics applicable to the use case',
      'Use tools: Fairlearn, IBM AI Fairness 360, Google What-If Tool, Aequitas',
      'Test both input bias (training data) and output bias (model predictions)',
      'Document bias findings and mitigation steps taken',
      'Define acceptable thresholds for fairness metrics',
    ],
    evidenceExamples: ['Bias testing report with per-group metrics', 'Fairness tool configuration', 'Pre-deployment bias sign-off', 'Mitigation steps for identified bias'],
    staticRemediation: [
      { order: 1, title: 'Run Pre-Deployment Bias Audit', description: 'Run your AI system through Fairlearn or IBM AI Fairness 360. Measure demographic parity difference, equalized odds, and predictive parity across protected groups. Document all findings.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 2, title: 'Define Fairness Thresholds', description: 'Set maximum acceptable bias thresholds (e.g., demographic parity difference < 0.1). Block deployment if thresholds are exceeded until mitigations are applied.', effort: 'medium', timeframe: '1 week' },
    ],
  },
  {
    id: 'MS-2.6', function: 'measure', category: 'MS-2', severity: 'high',
    title: 'AI Evaluation Documentation',
    description: 'Evaluations of AI systems and testing procedures are documented and accessible.',
    objective: 'Maintain auditable records of all AI testing and evaluation activities.',
    guidance: [
      'Document all tests: what was tested, methodology, results, and decisions made',
      'Retain evaluation records for the AI system lifecycle',
      'Make evaluation documentation accessible to auditors and oversight bodies',
    ],
    evidenceExamples: ['AI evaluation report archive', 'Test methodology documentation', 'Evaluation sign-off records', 'Model card with evaluation summary'],
    staticRemediation: [
      { order: 1, title: 'Create Model Cards', description: 'For every AI system, create a Model Card (Google\'s standard) documenting: model details, intended use, training data, evaluation results, fairness analysis, and limitations.', effort: 'high', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'MS-3.1', function: 'measure', category: 'MS-3', severity: 'critical',
    title: 'Deployed AI Monitoring',
    description: 'Ongoing monitoring of deployed AI system behavior is in place to detect performance degradation, drift, and unexpected behavior.',
    objective: 'Continuously monitor AI systems in production to catch degradation, drift, and harmful outputs.',
    guidance: [
      'Monitor prediction distribution for data drift and concept drift',
      'Alert on significant changes in model output patterns',
      'Monitor for bias drift (fairness metrics in production)',
      'Log a representative sample of AI inputs/outputs for human review',
      'Track user feedback and reported errors',
    ],
    evidenceExamples: ['AI monitoring dashboard', 'Drift detection configuration', 'Bias monitoring in production', 'AI output sampling and review logs', 'Alert configuration for anomalous behavior'],
    staticRemediation: [
      { order: 1, title: 'Deploy AI Monitoring', description: 'Implement data drift and model performance monitoring using tools like Evidently AI, Arize, Whylogs, or custom dashboards. Alert on performance drops >5% or significant distribution shifts.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'AI Output Sampling and Review', description: 'Log a random sample (1–5%) of AI outputs for human review. Create a process for reviewers to flag errors, biased outputs, or harmful content.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'MS-4.1', function: 'measure', category: 'MS-4', severity: 'high',
    title: 'AI System Explainability',
    description: 'Measurement approaches for AI system explainability are implemented and documented.',
    objective: 'Ensure AI decision-making can be explained to affected individuals and oversight bodies.',
    guidance: [
      'Implement post-hoc explainability tools (SHAP, LIME, Integrated Gradients)',
      'Define the level of explanation required per use case (global vs. local)',
      'Provide human-readable explanations for high-stakes AI decisions',
      'Test whether explanations are faithful to the model\'s actual behavior',
    ],
    evidenceExamples: ['Explainability methodology documentation', 'SHAP/LIME output examples', 'User-facing explanation samples', 'Explanation faithfulness test results'],
    staticRemediation: [
      { order: 1, title: 'Implement SHAP Explanations', description: 'Integrate SHAP (SHapley Additive exPlanations) for feature importance explanations. Generate local explanations for individual predictions in high-stakes use cases.', effort: 'high', timeframe: '2–4 weeks' },
      { order: 2, title: 'Design User-Facing Explanations', description: 'For customer-facing AI decisions, design natural language explanations that communicate the key factors. Test with users for comprehension.', effort: 'high', timeframe: '3–4 weeks' },
    ],
  },
  {
    id: 'MS-4.2', function: 'measure', category: 'MS-4', severity: 'high',
    title: 'AI System Interpretability',
    description: 'Measurement approaches for AI system interpretability are documented and applied.',
    objective: 'Ensure the internal workings of AI systems can be understood by developers and auditors.',
    guidance: [
      'Use interpretable models where feasible for high-stakes decisions',
      'Document model architecture, feature importance, and decision rules',
      'Perform sensitivity analysis to understand which inputs drive outputs',
      'Maintain interpretability documentation for each model version',
    ],
    evidenceExamples: ['Model architecture documentation', 'Feature importance analysis', 'Sensitivity analysis reports', 'Interpretability assessment by model type'],
    staticRemediation: [
      { order: 1, title: 'Document Model Architecture and Features', description: 'Create technical documentation for every production model: architecture, training data, features, hyperparameters, and known failure modes.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'MS-5.1', function: 'measure', category: 'MS-5', severity: 'critical',
    title: 'AI Performance Maintenance and Model Drift',
    description: 'Ongoing maintenance of AI system metrics is in place and model drift is detected and addressed.',
    objective: 'Detect and respond to model performance degradation caused by data or concept drift.',
    guidance: [
      'Monitor data distribution changes (data drift) vs. model target relationship changes (concept drift)',
      'Set drift detection thresholds and automated alerts',
      'Define retraining criteria and schedule',
      'Test retrained models before replacing production models',
    ],
    evidenceExamples: ['Drift monitoring configuration', 'Drift detection alert history', 'Retraining criteria document', 'Model version comparison reports'],
    staticRemediation: [
      { order: 1, title: 'Implement Drift Detection', description: 'Deploy drift detection (Evidently AI, Alibi Detect, or custom PSI/KL divergence checks) on all production AI systems. Set alerts for when drift exceeds thresholds.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 2, title: 'Define Retraining Policy', description: 'Document when models should be retrained: performance drops below X%, data drift score exceeds Y, or on a fixed schedule. Define the validation process before promoting new versions.', effort: 'medium', timeframe: '1 week' },
    ],
  },

  // ── MANAGE ────────────────────────────────────────────────────────────────
  {
    id: 'MG-1.1', function: 'manage', category: 'MG-1', severity: 'critical',
    title: 'AI System Fitness for Purpose Assessment',
    description: 'A determination is made as to whether the AI system achieves its intended purposes and remains fit for deployment.',
    objective: 'Regularly validate that each AI system still meets its intended goals and risk criteria.',
    guidance: [
      'Conduct formal go/no-go deployment reviews for new AI systems',
      'Periodically reassess whether deployed systems still meet performance and fairness criteria',
      'Define criteria for taking an AI system offline',
      'Document all deployment decisions and the evidence supporting them',
    ],
    evidenceExamples: ['AI deployment approval records', 'Go/no-go decision criteria', 'Periodic fitness reviews', 'AI sunset criteria'],
    staticRemediation: [
      { order: 1, title: 'Create AI Deployment Gate', description: 'Define a formal deployment gate checklist: minimum performance threshold, bias test passed, explainability documented, risks accepted by risk owner. No AI ships without sign-off.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Quarterly Fitness Reviews', description: 'Review each deployed AI system quarterly. Ask: Is it still performing as intended? Are there new harms? Should it continue, be updated, or be decommissioned?', effort: 'medium', timeframe: '1 week setup + ongoing' },
    ],
  },
  {
    id: 'MG-1.2', function: 'manage', category: 'MG-1', severity: 'high',
    title: 'AI Risk Prioritization',
    description: 'Treatment of identified AI risks is prioritized based on impact, likelihood, and available resources.',
    objective: 'Ensure the most harmful AI risks receive the most attention and resources.',
    guidance: [
      'Score all identified AI risks by likelihood × impact',
      'Prioritize risks to vulnerable groups or involving irreversible harm',
      'Align risk treatment prioritization with business priorities',
      'Review prioritization when new risks are identified',
    ],
    evidenceExamples: ['AI risk prioritization matrix', 'Risk treatment roadmap', 'Resource allocation for high-priority risks'],
    staticRemediation: [
      { order: 1, title: 'Build AI Risk Prioritization Matrix', description: 'Rate all identified AI risks (L×I score). Create a prioritized treatment roadmap with owners and target dates for the top 10 risks.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'MG-2.2', function: 'manage', category: 'MG-2', severity: 'high',
    title: 'AI System Value Sustainment',
    description: 'Mechanisms to sustain the value of deployed AI systems are evaluated and implemented.',
    objective: 'Ensure AI systems continue delivering value safely over time through maintenance and updates.',
    guidance: [
      'Define a maintenance plan for each AI system (retraining schedule, monitoring, updates)',
      'Allocate ongoing budget and resources for AI system maintenance',
      'Track value metrics over time to confirm the system remains beneficial',
    ],
    evidenceExamples: ['AI system maintenance plan', 'Maintenance budget allocation', 'Value metric trend reports'],
    staticRemediation: [
      { order: 1, title: 'Create AI System Maintenance Plans', description: 'For each deployed AI system, write a maintenance plan: who owns it, how often it is retrained, how performance is monitored, and when it will be reviewed for decommissioning.', effort: 'medium', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'MG-2.3', function: 'manage', category: 'MG-2', severity: 'critical',
    title: 'AI Incident Response and Recovery',
    description: 'AI risk treatment is prioritized and processes are established to respond to and recover from AI risk events.',
    objective: 'Maintain an AI-specific incident response plan covering harmful outputs, bias incidents, and model failures.',
    guidance: [
      'Create an AI incident response plan with AI-specific scenarios',
      'Define severity levels for AI incidents (bias complaint, harmful output, model failure)',
      'Include rollback procedures for AI system updates',
      'Define who is notified for different AI incident types',
      'Conduct AI incident response drills annually',
    ],
    evidenceExamples: ['AI Incident Response Plan', 'AI incident severity classification', 'Model rollback procedure', 'AI incident drill records', 'AI incident log'],
    staticRemediation: [
      { order: 1, title: 'Create AI Incident Response Plan', description: 'Write an AI-specific IRP covering: harmful output incidents, bias complaints, model failure, data poisoning, and adversarial attacks. Define response steps, owners, and escalation paths.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 2, title: 'Document Model Rollback Procedure', description: 'For every AI system, document how to roll back to the previous model version if the new version causes problems. Test the rollback procedure.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'MG-3.1', function: 'manage', category: 'MG-3', severity: 'critical',
    title: 'Ongoing AI Risk Monitoring',
    description: 'AI risks and impacts are monitored on a regular basis using established metrics and processes.',
    objective: 'Continuously track AI risk indicators in production to detect emerging harms.',
    guidance: [
      'Monitor: bias drift, performance degradation, user complaints, anomalous outputs',
      'Set alert thresholds that trigger review when exceeded',
      'Review AI risk metrics at least monthly',
      'Escalate to AI risk owner when thresholds are breached',
    ],
    evidenceExamples: ['AI risk monitoring dashboard', 'Monthly AI risk review records', 'Alert threshold configuration', 'Escalation records for breached thresholds'],
    staticRemediation: [
      { order: 1, title: 'Deploy Unified AI Risk Dashboard', description: 'Create a dashboard combining: model performance metrics, fairness metrics, user complaints, and operational metrics. Review in monthly AI risk meeting.', effort: 'high', timeframe: '3–4 weeks' },
    ],
  },
  {
    id: 'MG-3.2', function: 'manage', category: 'MG-3', severity: 'high',
    title: 'Deployed AI Risk Treatment',
    description: 'Treatment of risks to deployed AI systems including updates, limitations, and mitigations is performed in a timely manner.',
    objective: 'Act promptly when AI risks are identified in deployed systems.',
    guidance: [
      'Define SLAs for responding to AI risk findings by severity',
      'Track risk treatment to completion',
      'Communicate risk mitigations to affected stakeholders',
      'Verify that mitigations actually reduced the identified risk',
    ],
    evidenceExamples: ['AI risk treatment log', 'Risk treatment SLA policy', 'Mitigation effectiveness validation', 'Stakeholder communication records'],
    staticRemediation: [
      { order: 1, title: 'Define AI Risk Treatment SLAs', description: 'Set response SLAs: Critical AI risk (harmful output causing harm) — 24 hours; High (significant bias detected) — 7 days; Medium — 30 days; Low — 90 days.', effort: 'low', timeframe: '3 days' },
    ],
  },
  {
    id: 'MG-4.1', function: 'manage', category: 'MG-4', severity: 'high',
    title: 'Post-Deployment AI Risk Evaluation',
    description: 'Post-deployment AI risks and any residual risks that emerge after deployment are evaluated and documented.',
    objective: 'Conduct systematic post-deployment reviews to capture real-world AI risks not anticipated pre-deployment.',
    guidance: [
      'Conduct post-deployment reviews at 30, 90, and 180 days after launch',
      'Compare pre-deployment risk assumptions with observed real-world behavior',
      'Document residual risks and accepted risks with rationale',
      'Update AI impact assessments based on post-deployment learnings',
    ],
    evidenceExamples: ['Post-deployment review reports', 'Residual risk documentation', 'Pre vs. post deployment risk comparison', 'Updated AI impact assessments'],
    staticRemediation: [
      { order: 1, title: 'Conduct Post-Deployment Reviews', description: 'Schedule 30-day, 90-day, and 180-day reviews for every newly deployed AI system. Compare observed behavior vs. pre-deployment assumptions. Update impact assessment.', effort: 'medium', timeframe: 'Ongoing after each deployment' },
    ],
  },
  {
    id: 'MG-4.2', function: 'manage', category: 'MG-4', severity: 'medium',
    title: 'AI Performance Improvement Tracking',
    description: 'Measurable performance improvements or updates to AI systems in the context of AI risks are identified and tracked.',
    objective: 'Demonstrate continuous improvement in AI risk management over time.',
    guidance: [
      'Track risk metric trends over model versions',
      'Document improvements in bias, safety, and performance with each update',
      'Conduct root cause analysis for AI incidents and track corrective actions',
      'Report AI improvement metrics to leadership',
    ],
    evidenceExamples: ['Model version comparison reports', 'Bias metric trend charts', 'Root cause analysis reports', 'AI improvement report to leadership'],
    staticRemediation: [
      { order: 1, title: 'Track AI Risk Metrics Over Time', description: 'Maintain a version-by-version comparison of key risk metrics (bias score, performance, safety incidents). Present trend to leadership quarterly.', effort: 'medium', timeframe: '2 weeks to set up + ongoing' },
    ],
  },
  {
    id: 'MG-4.3', function: 'manage', category: 'MG-4', severity: 'high',
    title: 'AI Risk Documentation and Transparency',
    description: 'Organizational teams document and demonstrate the risks of the AI system to appropriate oversight and stakeholders.',
    objective: 'Maintain transparent, accessible documentation of AI risks for all relevant stakeholders.',
    guidance: [
      'Publish model cards for all production AI systems',
      'Communicate AI limitations and known issues to users',
      'Maintain an AI risk register accessible to oversight bodies',
      'Issue public transparency reports for high-impact AI systems',
    ],
    evidenceExamples: ['Published model cards', 'User-facing AI limitation disclosures', 'AI risk register', 'AI transparency report (if applicable)'],
    staticRemediation: [
      { order: 1, title: 'Publish Model Cards Internally', description: 'Complete model cards for all production AI systems and publish internally. For consumer-facing AI, publish a simplified version on your website.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 2, title: 'AI Transparency Disclosure', description: 'Where AI makes decisions affecting users, add disclosure: "This decision was made using AI. Key factors were: [explanation]." Include how to appeal or request human review.', effort: 'high', timeframe: '3–4 weeks' },
    ],
  },
];

// Merge examples
for (const control of NIST_AI_CONTROLS) {
  const ex = NIST_AI_EXAMPLES[control.id];
  if (ex) control.example = ex;
}

export function getNISTAIControlsByFunction(fn: NISTAIFunction): NISTAIControl[] {
  return NIST_AI_CONTROLS.filter(c => c.function === fn);
}

export function getNISTAIControlById(id: string): NISTAIControl | undefined {
  return NIST_AI_CONTROLS.find(c => c.id === id);
}
