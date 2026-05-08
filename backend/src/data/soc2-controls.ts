import { CONTROL_EXAMPLES } from './soc2-examples';

export type TSCCategory = 'security' | 'availability' | 'processing_integrity' | 'confidentiality' | 'privacy';
export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface ControlExample {
  scenario: string;   // real company story showing what "done" looks like
  evidence: string;   // what artifacts to collect
  quickWin: string;   // fastest path to compliance for this control
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

export interface RemediationStep {
  order: number;
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  templates?: string[];
}

export const SOC2_CONTROLS: SOC2Control[] = [
  // ─── CC1 – Control Environment ───────────────────────────────────────────
  {
    id: 'CC1.1',
    category: 'security',
    title: 'COSO Principle 1: Commitment to Integrity and Ethical Values',
    description: 'The entity demonstrates a commitment to integrity and ethical values.',
    objective: 'Establish the tone at the top and communicate ethical standards.',
    guidance: [
      'Document a formal code of conduct or ethics policy',
      'Require all employees to acknowledge the code of conduct annually',
      'Establish a whistleblower/ethics hotline',
      'Leadership must visibly model ethical behavior',
    ],
    evidenceExamples: ['Signed code of conduct acknowledgments', 'Ethics policy document', 'Training completion records'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Draft a Code of Conduct', description: 'Create a formal code of conduct covering conflicts of interest, data handling, acceptable use, and reporting obligations.', effort: 'medium', timeframe: '2–3 weeks', templates: ['CODE_OF_CONDUCT_TEMPLATE'] },
      { order: 2, title: 'Obtain Employee Acknowledgments', description: 'Distribute the policy and collect signed acknowledgments from all employees, contractors, and third parties with system access.', effort: 'low', timeframe: '1 week' },
      { order: 3, title: 'Establish Ethics Reporting Channel', description: 'Implement a confidential reporting mechanism (hotline, anonymous form, or third-party service).', effort: 'low', timeframe: '1 week' },
      { order: 4, title: 'Leadership Communication', description: 'CEO/leadership sends communication reinforcing ethical commitments.', effort: 'low', timeframe: '1–2 days' },
    ],
  },
  {
    id: 'CC1.2',
    category: 'security',
    title: 'COSO Principle 2: Board Independence and Oversight',
    description: 'The board of directors demonstrates independence from management and exercises oversight of internal controls.',
    objective: 'Ensure governance structure includes oversight of the security program.',
    guidance: [
      'Define and document board/leadership responsibilities for security oversight',
      'Conduct periodic security reviews with leadership',
      'Maintain meeting minutes documenting security discussions',
    ],
    evidenceExamples: ['Board meeting minutes', 'Security committee charter', 'Risk committee reports'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Form a Security / Risk Committee', description: 'Establish a formal security steering committee with defined membership, meeting cadence, and escalation paths.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Document Governance Charter', description: 'Create a charter defining roles, responsibilities, and reporting lines for security governance.', effort: 'medium', timeframe: '1 week' },
      { order: 3, title: 'Conduct Quarterly Reviews', description: 'Schedule and conduct quarterly security posture reviews; retain minutes as evidence.', effort: 'low', timeframe: 'Ongoing' },
    ],
  },
  {
    id: 'CC1.3',
    category: 'security',
    title: 'COSO Principle 3: Organizational Structure and Accountability',
    description: 'Management establishes structures, reporting lines, and appropriate authorities to pursue objectives.',
    objective: 'Define and document organizational accountability for security.',
    guidance: [
      'Maintain an up-to-date organizational chart',
      'Document roles and responsibilities for security functions',
      'Assign a named security/compliance owner',
    ],
    evidenceExamples: ['Org chart', 'RACI matrix for security', 'Job descriptions with security responsibilities'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Document Org Structure', description: 'Publish a current org chart and ensure it reflects security roles.', effort: 'low', timeframe: '1 week' },
      { order: 2, title: 'Assign Security Owner', description: 'Formally designate a CISO, Security Lead, or equivalent with written accountability.', effort: 'low', timeframe: '3 days' },
      { order: 3, title: 'Create RACI for Security Controls', description: 'Map all key security controls to responsible, accountable, consulted, and informed parties.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'CC1.4',
    category: 'security',
    title: 'COSO Principle 4: Commitment to Competence',
    description: 'The entity demonstrates a commitment to attract, develop, and retain individuals in alignment with objectives.',
    objective: 'Ensure staff have the skills and training required for their security responsibilities.',
    guidance: [
      'Conduct annual security awareness training for all staff',
      'Provide role-specific security training for privileged users',
      'Track and document training completion',
    ],
    evidenceExamples: ['Training completion records', 'Security awareness program curriculum', 'Role-specific training materials'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Launch Security Awareness Program', description: 'Deploy an annual security awareness training program covering phishing, password hygiene, incident reporting, and data handling.', effort: 'medium', timeframe: '3–4 weeks' },
      { order: 2, title: 'Role-Based Training', description: 'Provide additional training for admins, developers, and privileged users on secure coding, least privilege, and system hardening.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 3, title: 'Track Completion', description: 'Implement a tracking mechanism (LMS or spreadsheet) to record training completion with dates.', effort: 'low', timeframe: '1 week' },
    ],
  },
  {
    id: 'CC1.5',
    category: 'security',
    title: 'COSO Principle 5: Accountability for Internal Controls',
    description: 'The entity holds individuals accountable for their internal control responsibilities.',
    objective: 'Ensure personnel understand their security obligations and are held accountable.',
    guidance: [
      'Include security responsibilities in job descriptions and performance reviews',
      'Document disciplinary procedures for policy violations',
      'Enforce consequences for non-compliance',
    ],
    evidenceExamples: ['Performance review templates with security criteria', 'Disciplinary policy', 'Policy violation records'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Update Job Descriptions', description: 'Add explicit security responsibilities to all job descriptions, especially for privileged roles.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Document Disciplinary Procedures', description: 'Create and publish a policy outlining consequences for security policy violations.', effort: 'low', timeframe: '1 week' },
      { order: 3, title: 'Integrate Security into Reviews', description: 'Add security-related KPIs to annual performance review processes.', effort: 'low', timeframe: '2 weeks' },
    ],
  },

  // ─── CC2 – Communication and Information ─────────────────────────────────
  {
    id: 'CC2.1',
    category: 'security',
    title: 'COSO Principle 13: Use of Relevant Information',
    description: 'The entity obtains or generates and uses relevant, quality information to support the functioning of internal controls.',
    objective: 'Establish processes for gathering security-relevant information.',
    guidance: [
      'Maintain an information asset inventory',
      'Define data classification levels',
      'Ensure security metrics are tracked and reported',
    ],
    evidenceExamples: ['Asset inventory', 'Data classification policy', 'Security dashboards and reports'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Create Asset Inventory', description: 'Inventory all systems, data stores, and third-party services with their data classification.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Define Data Classification Policy', description: 'Establish tiers (e.g., Public, Internal, Confidential, Restricted) and map existing data to each tier.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'CC2.2',
    category: 'security',
    title: 'COSO Principle 14: Internal Communication',
    description: 'The entity internally communicates information, including objectives and responsibilities for internal controls.',
    objective: 'Communicate security policies and responsibilities to all relevant parties.',
    guidance: [
      'Distribute all security policies to employees',
      'Conduct security briefings for new hires',
      'Establish channels for security communication (e.g., security newsletter)',
    ],
    evidenceExamples: ['Policy distribution records', 'Onboarding materials', 'Security communications archive'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Create Security Policy Library', description: 'Publish all security policies in an accessible internal repository and communicate location to all staff.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'New-Hire Security Onboarding', description: 'Add security policy review to the employee onboarding checklist.', effort: 'low', timeframe: '1 week' },
    ],
  },
  {
    id: 'CC2.3',
    category: 'security',
    title: 'COSO Principle 15: External Communication',
    description: 'The entity communicates with external parties regarding matters affecting the functioning of internal controls.',
    objective: 'Ensure external communication obligations (customers, vendors, regulators) are met.',
    guidance: [
      'Publish a security/privacy notice or page',
      'Notify customers of security incidents within defined timeframes',
      'Communicate security requirements to vendors',
    ],
    evidenceExamples: ['Privacy policy', 'Breach notification procedures', 'Vendor security requirements documents'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Publish Security / Privacy Notice', description: 'Create and publish a customer-facing security or trust page describing your controls.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Define Breach Notification Process', description: 'Document procedures for notifying affected customers and regulators within required timeframes (72 hours for GDPR, etc.).', effort: 'medium', timeframe: '2 weeks' },
    ],
  },

  // ─── CC3 – Risk Assessment ────────────────────────────────────────────────
  {
    id: 'CC3.1',
    category: 'security',
    title: 'COSO Principle 6: Specification of Objectives',
    description: 'The entity specifies objectives with sufficient clarity to enable identification and assessment of related risks.',
    objective: 'Define security objectives to guide risk assessment activities.',
    guidance: [
      'Document security objectives aligned to business goals',
      'Ensure objectives are measurable and time-bound',
      'Review objectives at least annually',
    ],
    evidenceExamples: ['Security strategy document', 'Risk appetite statement', 'Annual security objectives'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Document Security Objectives', description: 'Write measurable security objectives tied to business goals (e.g., 99.9% uptime, zero critical unpatched vulns > 30 days).', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Define Risk Appetite', description: 'Board/leadership approve a written risk appetite statement.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'CC3.2',
    category: 'security',
    title: 'COSO Principle 7: Risk Identification and Analysis',
    description: 'The entity identifies risks to the achievement of its objectives and analyzes them as a basis for determining management.',
    objective: 'Perform formal risk assessments at least annually.',
    guidance: [
      'Conduct annual formal risk assessment',
      'Identify threats, vulnerabilities, and likelihood/impact',
      'Document risk register with ownership',
      'Prioritize risks by severity',
    ],
    evidenceExamples: ['Risk assessment report', 'Risk register', 'Risk treatment decisions'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Conduct Formal Risk Assessment', description: 'Perform a structured risk assessment covering assets, threats, vulnerabilities, and existing controls. Document findings in a risk register.', effort: 'high', timeframe: '4–6 weeks' },
      { order: 2, title: 'Maintain Risk Register', description: 'Create and maintain a risk register with fields for risk description, likelihood, impact, risk owner, and treatment status.', effort: 'medium', timeframe: '1 week' },
      { order: 3, title: 'Risk Treatment Plan', description: 'For each identified risk, document the treatment decision (accept, mitigate, transfer, avoid) and timeline.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'CC3.3',
    category: 'security',
    title: 'COSO Principle 8: Fraud Risk Assessment',
    description: 'The entity considers the potential for fraud in assessing risks to the achievement of objectives.',
    objective: 'Identify and address fraud risks, including insider threats.',
    guidance: [
      'Include insider threat scenarios in risk assessments',
      'Implement segregation of duties for critical processes',
      'Monitor for anomalous user behavior',
    ],
    evidenceExamples: ['Fraud risk assessment', 'Segregation of duties matrix', 'User activity monitoring reports'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Document Fraud Risk Scenarios', description: 'Add fraud risk scenarios (data theft, sabotage, unauthorized access) to your risk assessment.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Implement Segregation of Duties', description: 'Ensure no single person can initiate and approve high-risk transactions or changes without a second approver.', effort: 'medium', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'CC3.4',
    category: 'security',
    title: 'COSO Principle 9: Change Risk Identification',
    description: 'The entity identifies and assesses changes that could significantly impact internal controls.',
    objective: 'Assess security impact of significant organizational or technology changes.',
    guidance: [
      'Require security review for significant technology changes',
      'Assess security implications of organizational changes (M&A, restructuring)',
      'Update risk register when significant changes occur',
    ],
    evidenceExamples: ['Change risk assessment records', 'Security review artifacts for major projects', 'Updated risk register post-change'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Security Review in Change Process', description: 'Embed a security review gate in the change management process for significant changes.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Document Security Impact', description: 'For each major change, document security implications and required control updates.', effort: 'low', timeframe: 'Ongoing' },
    ],
  },

  // ─── CC4 – Monitoring Activities ─────────────────────────────────────────
  {
    id: 'CC4.1',
    category: 'security',
    title: 'COSO Principle 16: Ongoing and Separate Evaluations',
    description: 'The entity selects, develops, and performs ongoing and/or separate evaluations to determine components of internal control are present and functioning.',
    objective: 'Continuously monitor security controls for effectiveness.',
    guidance: [
      'Implement continuous monitoring tools (SIEM, vulnerability scanners)',
      'Conduct periodic internal control reviews',
      'Perform vulnerability assessments quarterly',
    ],
    evidenceExamples: ['SIEM alert records', 'Vulnerability scan reports', 'Internal audit reports', 'Penetration test reports'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Deploy SIEM / Log Management', description: 'Implement centralized log collection and alerting covering auth events, privileged access, network traffic, and configuration changes.', effort: 'high', timeframe: '4–8 weeks' },
      { order: 2, title: 'Establish Vulnerability Management Program', description: 'Run authenticated vulnerability scans on all in-scope systems at least quarterly. Track and remediate findings by severity SLA.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 3, title: 'Annual Penetration Test', description: 'Commission an external penetration test at least annually and remediate critical/high findings.', effort: 'high', timeframe: '4–6 weeks' },
    ],
  },
  {
    id: 'CC4.2',
    category: 'security',
    title: 'COSO Principle 17: Evaluation and Communication of Deficiencies',
    description: 'The entity evaluates and communicates internal control deficiencies in a timely manner.',
    objective: 'Ensure deficiencies are tracked, reported, and remediated.',
    guidance: [
      'Maintain a findings/deficiency tracking system',
      'Report significant deficiencies to leadership',
      'Track remediation progress with defined SLAs',
    ],
    evidenceExamples: ['Deficiency log', 'Remediation tracking reports', 'Leadership briefing records'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Create Deficiency Tracking Log', description: 'Establish a ticketing/tracking system for control deficiencies with fields for severity, owner, due date, and status.', effort: 'medium', timeframe: '1 week' },
      { order: 2, title: 'Define Remediation SLAs', description: 'Set SLAs: critical ≤ 7 days, high ≤ 30 days, medium ≤ 90 days, low ≤ 180 days.', effort: 'low', timeframe: '3 days' },
    ],
  },

  // ─── CC5 – Control Activities ─────────────────────────────────────────────
  {
    id: 'CC5.1',
    category: 'security',
    title: 'COSO Principle 10: Selection and Development of Control Activities',
    description: 'The entity selects and develops control activities that contribute to the mitigation of risks.',
    objective: 'Implement controls proportional to identified risks.',
    guidance: [
      'Map controls to identified risks in the risk register',
      'Implement preventive and detective controls',
      'Document the control framework / control matrix',
    ],
    evidenceExamples: ['Control matrix', 'Risk-to-control mapping', 'Policy documents'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Build a Control Matrix', description: 'Document all security controls, their type (preventive/detective/corrective), responsible owner, frequency, and evidence of operation.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Map Controls to Risks', description: 'Link each control in the matrix to the risks it mitigates.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'CC5.2',
    category: 'security',
    title: 'COSO Principle 11: General Technology Controls',
    description: 'The entity selects and develops general technology controls to support the achievement of objectives.',
    objective: 'Implement foundational technology security controls.',
    guidance: [
      'Enforce multi-factor authentication (MFA) for all systems',
      'Implement endpoint protection on all company devices',
      'Patch operating systems and software within defined SLAs',
      'Use encrypted communications (TLS 1.2+) for all data in transit',
    ],
    evidenceExamples: ['MFA configuration screenshots', 'Endpoint protection dashboard', 'Patch management reports', 'TLS scan results'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Enforce MFA Everywhere', description: 'Enable MFA for all user accounts on all systems: SSO, email, cloud consoles, VPN, and production systems. Phishing-resistant MFA (FIDO2/WebAuthn) preferred.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Deploy Endpoint Protection', description: 'Install and configure EDR/antivirus on all managed endpoints. Enable auto-updates.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 3, title: 'Establish Patch Management', description: 'Implement a formal patch management process with SLAs: critical patches ≤ 7 days, high ≤ 30 days.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 4, title: 'Enforce TLS Everywhere', description: 'Disable legacy TLS 1.0/1.1. Enforce TLS 1.2+ on all services. Use HSTS headers on web applications.', effort: 'medium', timeframe: '1 week' },
    ],
  },
  {
    id: 'CC5.3',
    category: 'security',
    title: 'COSO Principle 12: Policies and Procedures',
    description: 'The entity deploys control activities through policies and procedures.',
    objective: 'Ensure written policies underpin every key control area.',
    guidance: [
      'Maintain a comprehensive information security policy',
      'Create sub-policies for key domains (access control, encryption, incident response, etc.)',
      'Review and approve policies annually',
    ],
    evidenceExamples: ['Information Security Policy', 'Policy inventory with approval dates', 'Annual review sign-offs'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Draft Information Security Policy', description: 'Create an overarching Information Security Policy signed by executive leadership.', effort: 'medium', timeframe: '2–3 weeks', templates: ['ISP_TEMPLATE'] },
      { order: 2, title: 'Create Policy Library', description: 'Develop sub-policies for: access control, acceptable use, incident response, business continuity, change management, encryption, and vendor management.', effort: 'high', timeframe: '4–8 weeks' },
      { order: 3, title: 'Establish Annual Review Process', description: 'Schedule annual policy reviews; document sign-off by policy owner and leadership.', effort: 'low', timeframe: '1 week' },
    ],
  },

  // ─── CC6 – Logical and Physical Access ───────────────────────────────────
  {
    id: 'CC6.1',
    category: 'security',
    title: 'Logical Access Security Controls',
    description: 'The entity implements logical access security software, infrastructure, and architectures to protect against unauthorized access.',
    objective: 'Control logical access to all systems and data.',
    guidance: [
      'Implement role-based access control (RBAC)',
      'Enforce the principle of least privilege',
      'Use an identity provider / SSO for centralized access management',
      'Maintain a formal access provisioning and deprovisioning process',
    ],
    evidenceExamples: ['RBAC configuration', 'Access provisioning workflow', 'User access review records', 'SSO configuration'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Implement RBAC', description: 'Define roles for all systems and assign permissions based on job function. Eliminate shared accounts.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Least Privilege Audit', description: 'Review all user permissions and remove excessive access. Document the review.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 3, title: 'Formalize Provisioning / Deprovisioning', description: 'Create a workflow requiring manager approval for access requests and same-day revocation for terminated employees.', effort: 'medium', timeframe: '2 weeks' },
      { order: 4, title: 'Deploy SSO/IdP', description: 'Centralize authentication using an identity provider (Okta, Azure AD, etc.) and federate application access.', effort: 'high', timeframe: '4–6 weeks' },
    ],
  },
  {
    id: 'CC6.2',
    category: 'security',
    title: 'New Account Registration and Authorization',
    description: 'Prior to issuing system credentials and granting access, the entity registers new internal and external users.',
    objective: 'Ensure all new user accounts are properly approved and documented.',
    guidance: [
      'Require manager/HR approval for all new accounts',
      'Document access requests with business justification',
      'Verify identity before granting access',
    ],
    evidenceExamples: ['Access request tickets', 'Approval records', 'Onboarding checklists'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Create Access Request Process', description: 'Implement a formal ticketing system for access requests with required manager approval.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Document Business Justification', description: 'Require all access requests to include a business justification and data classification acknowledgment.', effort: 'low', timeframe: '3 days' },
    ],
  },
  {
    id: 'CC6.3',
    category: 'security',
    title: 'Access Removal and Modification',
    description: 'The entity authorizes, modifies, or removes access to system components and protected information assets.',
    objective: 'Timely revoke or modify access when roles change or employment ends.',
    guidance: [
      'Automate offboarding deprovisioning where possible',
      'Perform quarterly access reviews for all systems',
      'Complete offboarding checklist within 24 hours of termination',
    ],
    evidenceExamples: ['Offboarding checklists', 'Access review records', 'Terminated account audit logs'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Automate Offboarding', description: 'Connect HR system to IdP to automatically disable accounts upon termination. Document manual steps as fallback.', effort: 'high', timeframe: '2–4 weeks' },
      { order: 2, title: 'Quarterly Access Reviews', description: 'Implement formal quarterly user access reviews. Managers certify their team\'s access is still needed and appropriate.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'CC6.4',
    category: 'security',
    title: 'Physical Access Restrictions',
    description: 'The entity restricts physical access to facilities and protected information assets.',
    objective: 'Control physical access to data centers and office facilities.',
    guidance: [
      'Implement physical access controls (key cards, PIN pads) for server rooms',
      'Maintain visitor logs for all secure areas',
      'Use co-location data center with SOC2 certification or cloud provider',
    ],
    evidenceExamples: ['Physical access control configurations', 'Visitor logs', 'Data center certifications', 'Badge access reports'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Secure Server Rooms', description: 'Ensure all server rooms / network closets have electronic key card access and logs.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 2, title: 'Maintain Visitor Logs', description: 'Implement sign-in procedures for all visitors to secure areas. Review logs periodically.', effort: 'low', timeframe: '1 week' },
      { order: 3, title: 'Verify Data Center Controls', description: 'Obtain SOC 2 reports or equivalent from co-location/cloud providers.', effort: 'low', timeframe: '1 week' },
    ],
  },
  {
    id: 'CC6.5',
    category: 'security',
    title: 'Logical Access Deletion or Retirement',
    description: 'The entity discontinues logical access to protected information assets when no longer needed.',
    objective: 'Remove access for unused accounts, service accounts, and retired systems.',
    guidance: [
      'Audit service accounts and API keys periodically',
      'Remove or rotate credentials for decommissioned systems',
      'Track and disable dormant accounts (no login > 90 days)',
    ],
    evidenceExamples: ['Dormant account reports', 'Service account inventory', 'Decommission checklists'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Dormant Account Policy', description: 'Implement automatic detection and disabling of accounts with no login activity for 90+ days.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Service Account Inventory', description: 'Catalog all service accounts, API keys, and non-human identities. Review and rotate regularly.', effort: 'medium', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'CC6.6',
    category: 'security',
    title: 'Security Measures Against External Threats',
    description: 'The entity implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software.',
    objective: 'Protect systems from external threats including malware and unauthorized software.',
    guidance: [
      'Deploy web application firewall (WAF) for web-facing applications',
      'Implement network-level security (firewall, IDS/IPS)',
      'Enforce application allowlisting or software inventory controls',
      'Enable DDoS protection',
    ],
    evidenceExamples: ['Firewall rule documentation', 'WAF configuration', 'IDS/IPS alert logs', 'Network diagram'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Deploy WAF', description: 'Implement a Web Application Firewall (AWS WAF, Cloudflare, Akamai) for all internet-facing applications.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Harden Network Perimeter', description: 'Review and document firewall rules. Remove permissive rules. Implement default-deny for inbound traffic.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 3, title: 'Enable DDoS Protection', description: 'Enable DDoS protection at the CDN/cloud provider level (AWS Shield, Cloudflare, etc.).', effort: 'low', timeframe: '3 days' },
    ],
  },
  {
    id: 'CC6.7',
    category: 'security',
    title: 'Protection Against Unauthorized Disclosure',
    description: 'The entity restricts the transmission, movement, and removal of information to authorized external parties.',
    objective: 'Prevent unauthorized exfiltration of sensitive data.',
    guidance: [
      'Classify data and apply appropriate handling procedures',
      'Encrypt sensitive data at rest and in transit',
      'Implement Data Loss Prevention (DLP) controls',
      'Control removable media usage',
    ],
    evidenceExamples: ['Encryption policy', 'DLP tool configuration', 'Removable media policy', 'Data classification documentation'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Encrypt Data at Rest', description: 'Enable full-disk encryption on all endpoints and database encryption for production data stores.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Encrypt Data in Transit', description: 'Enforce TLS 1.2+ for all network communications. Document and scan for unencrypted channels.', effort: 'medium', timeframe: '1 week' },
      { order: 3, title: 'Implement DLP', description: 'Deploy email DLP or endpoint DLP to detect and block unauthorized transmission of sensitive data.', effort: 'high', timeframe: '3–4 weeks' },
    ],
  },
  {
    id: 'CC6.8',
    category: 'security',
    title: 'Malware and Unauthorized Software Prevention',
    description: 'The entity implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software.',
    objective: 'Prevent malware infection and unauthorized software execution.',
    guidance: [
      'Deploy antivirus/EDR on all endpoints',
      'Enable automatic updates for security software',
      'Block execution of unauthorized applications',
      'Monitor for malware detections and respond promptly',
    ],
    evidenceExamples: ['EDR platform reports', 'Malware detection logs', 'Endpoint policy configurations'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Deploy EDR on All Endpoints', description: 'Install and configure an Endpoint Detection and Response (EDR) solution on every managed device.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Enable Auto-Updates', description: 'Configure security software to update definitions automatically. Verify coverage in management console.', effort: 'low', timeframe: '3 days' },
      { order: 3, title: 'Establish Malware Response Procedure', description: 'Document steps to isolate, investigate, and recover from malware detections.', effort: 'medium', timeframe: '1 week' },
    ],
  },

  // ─── CC7 – System Operations ──────────────────────────────────────────────
  {
    id: 'CC7.1',
    category: 'security',
    title: 'Vulnerability Management',
    description: 'The entity uses detection and monitoring procedures to identify changes to configurations or the introduction of new vulnerabilities.',
    objective: 'Systematically identify, prioritize, and remediate vulnerabilities.',
    guidance: [
      'Run authenticated vulnerability scans quarterly (or continuously)',
      'Subscribe to security advisories for used software',
      'Track vulnerabilities in a risk register',
      'Define and enforce remediation SLAs by severity',
    ],
    evidenceExamples: ['Vulnerability scan reports', 'Remediation tracking records', 'CVE advisory subscriptions'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Implement Vulnerability Scanning', description: 'Deploy a vulnerability scanner (Tenable, Qualys, Rapid7) and schedule authenticated scans for all in-scope systems.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 2, title: 'Define Remediation SLAs', description: 'Establish and enforce SLAs: critical ≤ 7 days, high ≤ 30 days, medium ≤ 90 days, low ≤ 180 days.', effort: 'low', timeframe: '3 days' },
      { order: 3, title: 'Subscribe to Security Advisories', description: 'Subscribe to NVD, vendor security advisories, and CISA KEV for all components in use.', effort: 'low', timeframe: '1 day' },
    ],
  },
  {
    id: 'CC7.2',
    category: 'security',
    title: 'Security Incident Management',
    description: 'The entity monitors system components and the operation of those components for anomalies that are indicative of malicious acts.',
    objective: 'Detect, respond to, and learn from security incidents.',
    guidance: [
      'Maintain a formal incident response plan (IRP)',
      'Define incident severity classifications',
      'Conduct tabletop exercises at least annually',
      'Maintain incident log and post-mortem process',
    ],
    evidenceExamples: ['Incident Response Plan', 'Incident log', 'Tabletop exercise records', 'Post-incident reports'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Create Incident Response Plan', description: 'Document an IRP covering: identification, containment, eradication, recovery, and lessons learned phases. Include contact trees and escalation procedures.', effort: 'medium', timeframe: '2–3 weeks', templates: ['IRP_TEMPLATE'] },
      { order: 2, title: 'Define Incident Classification', description: 'Establish severity levels (P1/P2/P3/P4) with response time SLAs for each.', effort: 'low', timeframe: '3 days' },
      { order: 3, title: 'Conduct Annual Tabletop Exercise', description: 'Run a tabletop exercise simulating a realistic incident scenario. Document outcomes and update IRP.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'CC7.3',
    category: 'security',
    title: 'Incident Evaluation and Response',
    description: 'The entity evaluates security events to determine whether they could or have resulted in a failure of the entity to meet its objectives.',
    objective: 'Triage and respond to security events effectively.',
    guidance: [
      'Implement 24/7 or business-hours alerting with on-call rotation',
      'Define investigation procedures for common alert types',
      'Escalate potential breaches immediately',
    ],
    evidenceExamples: ['Alert runbooks', 'On-call schedules', 'Escalation matrix'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Create Alert Runbooks', description: 'Write runbooks for the top 10 most common alert types your SIEM generates. Each should have triage steps, escalation criteria, and containment actions.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 2, title: 'Establish On-Call Rotation', description: 'Define an on-call security rotation with documented response time expectations.', effort: 'low', timeframe: '1 week' },
    ],
  },
  {
    id: 'CC7.4',
    category: 'security',
    title: 'Incident Response and Notification',
    description: 'The entity responds to identified security incidents by executing a defined incident response plan.',
    objective: 'Execute the incident response plan and notify affected parties.',
    guidance: [
      'Follow IRP steps during incidents',
      'Notify customers/regulators per breach notification obligations',
      'Document all incident response activities',
    ],
    evidenceExamples: ['Incident response logs', 'Breach notification records', 'Post-incident reports'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Practice IRP Execution', description: 'Run a simulation where the team executes all IRP steps. Identify gaps.', effort: 'medium', timeframe: '1 week' },
      { order: 2, title: 'Document Notification Obligations', description: 'Map all contractual, legal, and regulatory notification requirements (customers, GDPR DPA, state AGs, etc.).', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'CC7.5',
    category: 'security',
    title: 'Post-Incident Recovery and Lessons Learned',
    description: 'The entity identifies, develops, and implements activities to recover from identified security incidents.',
    objective: 'Recover from incidents and apply lessons learned to prevent recurrence.',
    guidance: [
      'Complete post-incident review within 5 business days of major incidents',
      'Update controls and procedures based on lessons learned',
      'Track recurrence of similar incidents',
    ],
    evidenceExamples: ['Post-incident review reports', 'Updated procedures', 'Control improvement records'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Implement Post-Incident Review Process', description: 'After every P1/P2 incident, conduct a blameless post-mortem within 5 business days. Document findings and action items.', effort: 'low', timeframe: '1 week' },
      { order: 2, title: 'Track Lessons Learned', description: 'Create a lessons-learned register. Review quarterly to ensure action items are completed.', effort: 'low', timeframe: '3 days' },
    ],
  },

  // ─── CC8 – Change Management ──────────────────────────────────────────────
  {
    id: 'CC8.1',
    category: 'security',
    title: 'Change Management Process',
    description: 'The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures.',
    objective: 'Ensure all changes to in-scope systems are controlled and authorized.',
    guidance: [
      'Implement a formal change management policy and process',
      'Require approval for all production changes',
      'Maintain audit trails of all changes (Git history, change tickets)',
      'Test changes in a non-production environment before deployment',
      'Maintain rollback procedures for significant changes',
    ],
    evidenceExamples: ['Change management policy', 'Change tickets/approvals', 'Git commit history', 'Test results', 'Rollback procedures'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Implement Change Advisory Board (CAB)', description: 'Establish a CAB or approval workflow for all production changes. Document approval requirements by change risk level.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Enforce Code Review', description: 'Require peer code review (pull request approval) for all code changes before merge.', effort: 'low', timeframe: '3 days' },
      { order: 3, title: 'Non-Production Testing Gate', description: 'Mandate that all changes be tested in dev/staging before production deployment.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 4, title: 'Document Rollback Procedures', description: 'For every major release, document how to roll back and who is authorized to trigger it.', effort: 'medium', timeframe: '1 week' },
    ],
  },

  // ─── CC9 – Risk Mitigation ────────────────────────────────────────────────
  {
    id: 'CC9.1',
    category: 'security',
    title: 'Risk Mitigation Activities',
    description: 'The entity identifies and selects risk mitigation activities for risks arising from potential business disruptions.',
    objective: 'Implement controls to mitigate identified high-priority risks.',
    guidance: [
      'Implement Business Continuity Plan (BCP)',
      'Implement Disaster Recovery Plan (DRP)',
      'Test BCP/DRP at least annually',
    ],
    evidenceExamples: ['BCP document', 'DRP document', 'BCP/DRP test results', 'Recovery Time Objective (RTO) definitions'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Create Business Continuity Plan', description: 'Document a BCP covering critical business functions, RTO/RPO targets, and recovery procedures.', effort: 'high', timeframe: '4–6 weeks', templates: ['BCP_TEMPLATE'] },
      { order: 2, title: 'Create Disaster Recovery Plan', description: 'Document DRP with specific technical recovery steps for critical systems.', effort: 'high', timeframe: '4–6 weeks' },
      { order: 3, title: 'Test BCP/DRP Annually', description: 'Conduct an annual BCP/DRP test (tabletop or live). Document results and remediate gaps.', effort: 'medium', timeframe: '2 weeks per year' },
    ],
  },
  {
    id: 'CC9.2',
    category: 'security',
    title: 'Vendor and Business Partner Risk Management',
    description: 'The entity assesses and manages risks associated with vendors and business partners.',
    objective: 'Assess and monitor the security posture of vendors with access to your data or systems.',
    guidance: [
      'Maintain a vendor inventory with security risk classification',
      'Require SOC 2 reports or security questionnaires from critical vendors',
      'Include security requirements in vendor contracts',
      'Review vendor access annually',
    ],
    evidenceExamples: ['Vendor inventory', 'Vendor SOC 2 reports', 'Vendor security questionnaires', 'Data Processing Agreements (DPAs)'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Create Vendor Inventory', description: 'Catalog all vendors with system access or data handling. Classify each by risk level.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Require Vendor Security Evidence', description: 'For critical/high-risk vendors, obtain SOC 2 reports, ISO 27001 certs, or completed security questionnaires.', effort: 'medium', timeframe: '3–4 weeks' },
      { order: 3, title: 'Update Vendor Contracts', description: 'Ensure all vendor contracts include data security requirements, breach notification obligations, and audit rights.', effort: 'medium', timeframe: '3–4 weeks' },
    ],
  },

  // ─── AVAILABILITY ─────────────────────────────────────────────────────────
  {
    id: 'A1.1',
    category: 'availability',
    title: 'Capacity Management',
    description: 'The entity maintains, monitors, and evaluates current processing capacity and use to manage capacity demand.',
    objective: 'Ensure system capacity is sufficient to meet availability commitments.',
    guidance: [
      'Monitor resource utilization (CPU, memory, storage, network)',
      'Define capacity thresholds and alerts',
      'Forecast capacity needs and plan upgrades proactively',
    ],
    evidenceExamples: ['Capacity monitoring dashboards', 'Utilization reports', 'Capacity planning records'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Implement Capacity Monitoring', description: 'Configure monitoring dashboards for CPU, memory, disk, and network utilization with alerts at 70% and 90% thresholds.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Create Capacity Planning Process', description: 'Review capacity metrics monthly and project 6-month forward demand. Document and approve scaling decisions.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'A1.2',
    category: 'availability',
    title: 'Environmental Protections and Backup',
    description: 'The entity authorizes, designs, develops, and implements procedures to protect against environmental events and back up data and systems.',
    objective: 'Protect against data loss and environmental disruptions.',
    guidance: [
      'Implement automated daily backups',
      'Test backups by restoring from them at least quarterly',
      'Store backups off-site or in a separate cloud region',
      'Define and document RTO and RPO',
    ],
    evidenceExamples: ['Backup configuration screenshots', 'Restore test records', 'Off-site backup confirmation', 'RTO/RPO documentation'],
    severity: 'critical',
    staticRemediation: [
      { order: 1, title: 'Implement Automated Backups', description: 'Configure automated daily backups for all production databases and critical systems. Verify retention period meets RPO requirements.', effort: 'medium', timeframe: '1 week' },
      { order: 2, title: 'Test Backup Restores', description: 'Perform and document successful restore tests at least quarterly. Note restore time vs RTO.', effort: 'medium', timeframe: 'Ongoing' },
      { order: 3, title: 'Off-Site Backup Storage', description: 'Ensure backups are stored in a separate geographic region or off-site location.', effort: 'low', timeframe: '3 days' },
    ],
  },
  {
    id: 'A1.3',
    category: 'availability',
    title: 'Recovery Plan Testing',
    description: 'The entity tests recovery plan procedures to achieve recovery commitments.',
    objective: 'Validate that recovery plans work within defined RTO/RPO targets.',
    guidance: [
      'Test DRP at least annually',
      'Include failover testing for critical systems',
      'Document actual vs target recovery times',
    ],
    evidenceExamples: ['DRP test results', 'Failover test records', 'Recovery time logs'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Annual DRP Testing', description: 'Execute DRP test at least annually. Measure actual recovery times against RTO targets. Document gaps.', effort: 'high', timeframe: '2–3 days per year' },
      { order: 2, title: 'Failover Testing', description: 'Test failover for high-availability systems (e.g., database replication, load balancer failover).', effort: 'medium', timeframe: '1 day per quarter' },
    ],
  },

  // ─── PROCESSING INTEGRITY ─────────────────────────────────────────────────
  {
    id: 'PI1.1',
    category: 'processing_integrity',
    title: 'Input Processing Completeness and Accuracy',
    description: 'The entity obtains or generates, uses, and communicates relevant, quality information to support the functioning of internal control.',
    objective: 'Ensure inputs to systems are complete, accurate, and authorized.',
    guidance: [
      'Implement input validation for all data entry points',
      'Use checksums or hash verification for data transfers',
      'Log all data inputs for audit trail',
    ],
    evidenceExamples: ['Input validation code/configuration', 'Transfer integrity logs', 'Error rate reports'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Implement Input Validation', description: 'Add server-side validation for all user inputs and data interfaces. Reject malformed or out-of-range inputs.', effort: 'high', timeframe: '2–4 weeks' },
      { order: 2, title: 'Data Transfer Integrity Checks', description: 'Implement hash verification (SHA-256) for all critical data transfers.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'PI1.2',
    category: 'processing_integrity',
    title: 'Processing Completeness',
    description: 'System processing is complete, accurate, timely, and authorized.',
    objective: 'Ensure processing jobs complete successfully and results are verified.',
    guidance: [
      'Implement processing job monitoring and alerting',
      'Reconcile processing outputs against expected results',
      'Alert on processing failures or delays',
    ],
    evidenceExamples: ['Job monitoring dashboards', 'Reconciliation reports', 'Processing error logs'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Implement Job Monitoring', description: 'Add monitoring and alerting for all critical batch jobs and data processing workflows.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Reconciliation Controls', description: 'Implement automated reconciliation for critical data pipelines to detect discrepancies.', effort: 'medium', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'PI1.3',
    category: 'processing_integrity',
    title: 'Output Accuracy and Distribution',
    description: 'Outputs are complete, accurate, and distributed to authorized parties.',
    objective: 'Ensure outputs are accurate and only delivered to authorized recipients.',
    guidance: [
      'Validate output data before delivery',
      'Implement access controls on output distribution',
      'Log all output deliveries',
    ],
    evidenceExamples: ['Output validation procedures', 'Access-controlled delivery mechanisms', 'Output distribution logs'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Output Validation Checks', description: 'Implement sanity checks on critical outputs before delivery (range checks, format validation).', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Restrict Output Access', description: 'Ensure reports and data exports are only accessible to authorized parties.', effort: 'medium', timeframe: '1 week' },
    ],
  },

  // ─── CONFIDENTIALITY ──────────────────────────────────────────────────────
  {
    id: 'C1.1',
    category: 'confidentiality',
    title: 'Identification and Classification of Confidential Information',
    description: 'Confidential information is identified and classified and policies and procedures are implemented to protect it.',
    objective: 'Identify, classify, and protect all confidential information.',
    guidance: [
      'Classify all data assets by sensitivity',
      'Apply appropriate controls based on classification',
      'Train employees on data classification and handling',
    ],
    evidenceExamples: ['Data classification policy', 'Data inventory with classifications', 'Handling procedure documentation'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Implement Data Classification', description: 'Define classification levels and apply labels to data at rest and in documents.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Handling Procedures per Classification', description: 'Document required handling procedures (encryption, access restrictions, retention) for each classification level.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'C1.2',
    category: 'confidentiality',
    title: 'Disposal of Confidential Information',
    description: 'Confidential information is protected during disposal.',
    objective: 'Securely destroy confidential information when it is no longer needed.',
    guidance: [
      'Implement secure data deletion procedures',
      'Use certified data destruction for hardware',
      'Document all data disposal activities',
    ],
    evidenceExamples: ['Data retention and disposal policy', 'Secure deletion tool usage', 'Hardware destruction certificates'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Create Data Retention and Disposal Policy', description: 'Define retention schedules for each data type and required disposal methods.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Implement Secure Deletion', description: 'Use cryptographic erasure or NIST 800-88 compliant methods to dispose of sensitive data.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },

  // ─── PRIVACY ──────────────────────────────────────────────────────────────
  {
    id: 'P1.1',
    category: 'privacy',
    title: 'Privacy Notice',
    description: 'The entity provides notice to data subjects about the personal information collected, the purpose of collection, and how it will be used.',
    objective: 'Inform data subjects about personal data collection and use.',
    guidance: [
      'Publish a clear, comprehensive privacy policy',
      'Display privacy notice at all data collection points',
      'Obtain consent where required',
    ],
    evidenceExamples: ['Privacy policy', 'Consent mechanisms', 'Data collection point notices'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Draft / Update Privacy Policy', description: 'Write a privacy policy compliant with applicable laws (GDPR, CCPA). Have legal review.', effort: 'high', timeframe: '3–4 weeks', templates: ['PRIVACY_POLICY_TEMPLATE'] },
      { order: 2, title: 'Implement Consent Mechanisms', description: 'Add opt-in consent banners and checkboxes at all collection points where legally required.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'P2.1',
    category: 'privacy',
    title: 'Choice and Consent',
    description: 'The entity communicates choices available regarding the collection, use, retention, disclosure, and disposal of personal information.',
    objective: 'Give data subjects control over their personal information.',
    guidance: [
      'Provide opt-out mechanisms for data use',
      'Honor data subject requests (access, deletion, portability)',
      'Document consent records',
    ],
    evidenceExamples: ['Opt-out mechanisms', 'Data subject request process', 'Consent records'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Implement Data Subject Request Process', description: 'Create a process to receive, verify, and respond to data subject requests (access, deletion, portability) within required timeframes.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 2, title: 'Opt-Out Mechanisms', description: 'Implement and test opt-out controls for marketing, analytics, and any other optional processing.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'P3.1',
    category: 'privacy',
    title: 'Collection Limitation',
    description: 'Personal information is collected only for the purposes identified in the notice.',
    objective: 'Collect only the minimum personal data necessary (data minimization).',
    guidance: [
      'Document the purpose for each personal data field collected',
      'Remove collection of unnecessary personal data',
      'Review data collection practices against stated purposes',
    ],
    evidenceExamples: ['Data mapping document', 'Purpose limitation review', 'Data minimization assessment'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Create Data Mapping', description: 'Map all personal data collected, the purpose, legal basis, and retention period.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Data Minimization Review', description: 'Audit all data collection forms and remove any fields not strictly necessary.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'P4.1',
    category: 'privacy',
    title: 'Use, Retention, and Disposal',
    description: 'Personal information is used, retained, and disposed of only in accordance with the entity\'s privacy notice and policies.',
    objective: 'Ensure personal data is used, retained, and deleted per stated policies.',
    guidance: [
      'Enforce retention schedules for personal data',
      'Automate deletion of data past retention periods',
      'Document all secondary uses of personal data',
    ],
    evidenceExamples: ['Retention schedule', 'Automated deletion records', 'Data use documentation'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Enforce Retention Schedule', description: 'Implement automated deletion or anonymization of personal data that exceeds its retention period.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Audit Secondary Uses', description: 'Review all internal uses of personal data and verify they are consistent with the privacy notice.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'P5.1',
    category: 'privacy',
    title: 'Access to Personal Information',
    description: 'Data subjects have access to their personal information for review and update.',
    objective: 'Allow data subjects to access and correct their personal information.',
    guidance: [
      'Provide a mechanism for data subjects to access their data',
      'Allow data subjects to correct inaccurate information',
      'Respond to access requests within required timeframes (30 days for GDPR)',
    ],
    evidenceExamples: ['Self-service data access portal', 'Access request response records', 'Correction procedure'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Build Data Access Portal', description: 'Implement a self-service feature allowing users to export and view their personal data.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Data Correction Process', description: 'Create a process for users to request corrections to their personal data.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'P6.1',
    category: 'privacy',
    title: 'Disclosure to Third Parties',
    description: 'Personal information is disclosed to third parties only for the purposes identified in the notice.',
    objective: 'Control and document all third-party sharing of personal data.',
    guidance: [
      'Inventory all third parties receiving personal data',
      'Ensure Data Processing Agreements (DPAs) are in place',
      'Disclose third-party sharing in privacy notice',
    ],
    evidenceExamples: ['Third-party data sharing inventory', 'DPAs/contracts', 'Privacy notice disclosures'],
    severity: 'high',
    staticRemediation: [
      { order: 1, title: 'Create Third-Party Data Sharing Inventory', description: 'Catalog all third parties receiving personal data, the purpose, and the legal basis.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 2, title: 'Execute DPAs', description: 'Ensure Data Processing Agreements are signed with all third-party processors handling personal data.', effort: 'medium', timeframe: '2–4 weeks' },
    ],
  },
  {
    id: 'P7.1',
    category: 'privacy',
    title: 'Quality and Accuracy of Personal Information',
    description: 'The entity maintains accurate, complete, and relevant personal information.',
    objective: 'Ensure personal data quality and accuracy.',
    guidance: [
      'Validate personal data at point of collection',
      'Provide mechanisms for users to report and correct inaccurate data',
      'Periodically review data quality',
    ],
    evidenceExamples: ['Data validation controls', 'Correction mechanisms', 'Data quality reports'],
    severity: 'low',
    staticRemediation: [
      { order: 1, title: 'Data Validation Controls', description: 'Implement validation rules for personal data fields (email format, phone format, address verification).', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'User Data Correction', description: 'Allow users to update their own personal data through a self-service interface.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'P8.1',
    category: 'privacy',
    title: 'Privacy Compliance Monitoring',
    description: 'The entity monitors compliance with its privacy policies and procedures.',
    objective: 'Continuously monitor and enforce privacy compliance.',
    guidance: [
      'Conduct annual privacy impact assessments (PIAs)',
      'Monitor for unauthorized personal data access or disclosure',
      'Train staff on privacy requirements',
    ],
    evidenceExamples: ['PIA reports', 'Privacy audit records', 'Privacy training completion records'],
    severity: 'medium',
    staticRemediation: [
      { order: 1, title: 'Conduct Annual PIA', description: 'Perform a Privacy Impact Assessment at least annually and for all new products/features handling personal data.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Privacy Monitoring Controls', description: 'Implement monitoring for unauthorized personal data access in SIEM and data access logs.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 3, title: 'Privacy Training', description: 'Include privacy requirements in annual security training.', effort: 'low', timeframe: '1 week' },
    ],
  },
];

// Merge examples into each control at module load time
for (const control of SOC2_CONTROLS) {
  const ex = CONTROL_EXAMPLES[control.id];
  if (ex) control.example = ex;
}

export const CONTROL_CATEGORIES: Record<TSCCategory, { label: string; description: string; color: string }> = {
  security: { label: 'Security (CC)', description: 'Common Criteria — Confidentiality, integrity, and availability of systems and data', color: '#6366f1' },
  availability: { label: 'Availability (A)', description: 'System availability meets commitments and requirements', color: '#22c55e' },
  processing_integrity: { label: 'Processing Integrity (PI)', description: 'System processing is complete, accurate, timely, and authorized', color: '#f59e0b' },
  confidentiality: { label: 'Confidentiality (C)', description: 'Information designated as confidential is protected', color: '#ef4444' },
  privacy: { label: 'Privacy (P)', description: 'Personal information is collected, used, retained, and disclosed per commitments', color: '#8b5cf6' },
};

export function getControlsByCategory(category: TSCCategory): SOC2Control[] {
  return SOC2_CONTROLS.filter(c => c.category === category);
}

export function getControlById(id: string): SOC2Control | undefined {
  return SOC2_CONTROLS.find(c => c.id === id);
}

export function calculateScore(responses: { status: string }[]): number {
  if (responses.length === 0) return 0;
  const total = responses.reduce((sum, r) => {
    if (r.status === 'yes') return sum + 100;
    if (r.status === 'partial') return sum + 50;
    return sum;
  }, 0);
  return Math.round(total / responses.length);
}
