import { FEDRAMP_EXAMPLES } from './fedramp-examples';
import { ControlExample, RemediationStep, Severity } from './soc2-controls';

export type FedRAMPFamily =
  | 'access_control' | 'awareness_training' | 'audit_accountability'
  | 'assessment_authorization' | 'configuration_management' | 'contingency_planning'
  | 'identification_authentication' | 'incident_response' | 'maintenance'
  | 'media_protection' | 'physical_environmental' | 'planning'
  | 'program_management' | 'personnel_security' | 'pii_processing'
  | 'risk_assessment' | 'system_acquisition' | 'system_communications'
  | 'system_integrity' | 'supply_chain';

export type FedRAMPImpactLevel = 'low' | 'moderate' | 'high';

export interface FedRAMPControl {
  id: string;
  family: FedRAMPFamily;
  title: string;
  description: string;
  objective: string;
  guidance: string[];
  evidenceExamples: string[];
  severity: Severity;
  impactLevels: FedRAMPImpactLevel[];
  staticRemediation: RemediationStep[];
  example?: ControlExample;
}

export const FEDRAMP_FAMILY_LABELS: Record<FedRAMPFamily, { label: string; abbr: string; color: string }> = {
  access_control:              { label: 'Access Control (AC)',                           abbr: 'AC',  color: '#6366f1' },
  awareness_training:          { label: 'Awareness & Training (AT)',                     abbr: 'AT',  color: '#8b5cf6' },
  audit_accountability:        { label: 'Audit & Accountability (AU)',                   abbr: 'AU',  color: '#06b6d4' },
  assessment_authorization:    { label: 'Assessment, Authorization & Monitoring (CA)',   abbr: 'CA',  color: '#3b82f6' },
  configuration_management:    { label: 'Configuration Management (CM)',                 abbr: 'CM',  color: '#f59e0b' },
  contingency_planning:        { label: 'Contingency Planning (CP)',                     abbr: 'CP',  color: '#ef4444' },
  identification_authentication:{ label: 'Identification & Authentication (IA)',         abbr: 'IA',  color: '#22c55e' },
  incident_response:           { label: 'Incident Response (IR)',                        abbr: 'IR',  color: '#f97316' },
  maintenance:                 { label: 'Maintenance (MA)',                              abbr: 'MA',  color: '#64748b' },
  media_protection:            { label: 'Media Protection (MP)',                         abbr: 'MP',  color: '#a78bfa' },
  physical_environmental:      { label: 'Physical & Environmental Protection (PE)',      abbr: 'PE',  color: '#84cc16' },
  planning:                    { label: 'Planning (PL)',                                 abbr: 'PL',  color: '#14b8a6' },
  program_management:          { label: 'Program Management (PM)',                       abbr: 'PM',  color: '#f43f5e' },
  personnel_security:          { label: 'Personnel Security (PS)',                       abbr: 'PS',  color: '#fb923c' },
  pii_processing:              { label: 'PII Processing & Transparency (PT)',            abbr: 'PT',  color: '#c084fc' },
  risk_assessment:             { label: 'Risk Assessment (RA)',                          abbr: 'RA',  color: '#fbbf24' },
  system_acquisition:          { label: 'System & Services Acquisition (SA)',            abbr: 'SA',  color: '#4ade80' },
  system_communications:       { label: 'System & Communications Protection (SC)',       abbr: 'SC',  color: '#38bdf8' },
  system_integrity:            { label: 'System & Information Integrity (SI)',           abbr: 'SI',  color: '#fb7185' },
  supply_chain:                { label: 'Supply Chain Risk Management (SR)',             abbr: 'SR',  color: '#a3e635' },
};

export const FEDRAMP_CONTROLS: FedRAMPControl[] = [

  // ── AC – Access Control ──────────────────────────────────────────────────
  {
    id: 'AC-1', family: 'access_control', severity: 'medium', impactLevels: ['low','moderate','high'],
    title: 'Access Control Policy and Procedures',
    description: 'Develop, document, and disseminate an access control policy and procedures.',
    objective: 'Establish a documented, approved access control policy that addresses purpose, scope, roles, responsibilities, and compliance.',
    guidance: ['Policy must be reviewed and updated annually','Must address all access control control objectives','Procedures must cover implementation of policy'],
    evidenceExamples: ['Access control policy document','Policy approval record','Annual review evidence'],
    staticRemediation: [
      {order:1,title:'Draft Access Control Policy',description:'Write a policy covering account management, access enforcement, least privilege, separation of duties, and remote access. Include roles and review cadence.',effort:'medium',timeframe:'1–2 weeks'},
      {order:2,title:'Get Formal Approval',description:'Submit policy for approval by the ISSO/AO and document the approval date and approver.',effort:'low',timeframe:'3 days'},
      {order:3,title:'Disseminate and Track Acknowledgment',description:'Share with all staff and collect signed acknowledgments.',effort:'low',timeframe:'1 week'},
    ],
  },
  {
    id: 'AC-2', family: 'access_control', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Account Management',
    description: 'Manage system accounts including establishing, activating, modifying, reviewing, disabling, and removing accounts.',
    objective: 'Ensure all system accounts are properly authorized, monitored, and removed when no longer needed.',
    guidance: ['Maintain an inventory of all system accounts','Define account types and approval requirements','Review accounts at least annually','Disable accounts within defined timeframes upon termination'],
    evidenceExamples: ['Account inventory spreadsheet','Access provisioning/deprovisioning tickets','Annual account review records','Termination checklist with account revocation'],
    staticRemediation: [
      {order:1,title:'Build Account Inventory',description:'List every account (human and service) across all FedRAMP boundary systems with type, owner, last login, and justification.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Formalize Provisioning Workflow',description:'Create a ticketed workflow requiring manager and ISSO approval before accounts are created or elevated.',effort:'medium',timeframe:'1–2 weeks'},
      {order:3,title:'Implement Annual Review',description:'Schedule an annual review where managers certify all accounts in their team are still needed.',effort:'medium',timeframe:'1 week setup + ongoing'},
      {order:4,title:'Automate Deprovisioning',description:'Connect HR system to IdP to auto-disable accounts within 1 business day of termination.',effort:'high',timeframe:'3–4 weeks'},
    ],
  },
  {
    id: 'AC-3', family: 'access_control', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Access Enforcement',
    description: 'Enforce approved authorizations for logical access to information and system resources.',
    objective: 'Implement technical access controls that enforce least privilege and need-to-know.',
    guidance: ['Implement role-based access control (RBAC)','Enforce access based on approved authorizations','Log access enforcement decisions','Review and test access controls periodically'],
    evidenceExamples: ['RBAC configuration documentation','Access control policy enforcement screenshots','Periodic access testing results'],
    staticRemediation: [
      {order:1,title:'Implement RBAC',description:'Define roles for each system component in the FedRAMP boundary and assign permissions using least privilege.',effort:'high',timeframe:'3–4 weeks'},
      {order:2,title:'Test Access Controls',description:'Attempt to access resources beyond your assigned role and document that access is denied.',effort:'medium',timeframe:'1 week'},
    ],
  },
  {
    id: 'AC-5', family: 'access_control', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Separation of Duties',
    description: 'Separate duties of individuals to reduce risk of malevolent activity.',
    objective: 'Ensure no single individual can perform all critical functions, preventing fraud and errors.',
    guidance: ['Define duties that must be separated','Document separation in a matrix','Implement technical controls to enforce separation','Review separation annually'],
    evidenceExamples: ['Separation of duties matrix','Technical enforcement screenshots (e.g., no prod deploy without second approval)','Annual review records'],
    staticRemediation: [
      {order:1,title:'Document Separation of Duties Matrix',description:'Identify roles that must be separated (e.g., developer cannot also approve prod deployments). Create a matrix showing separation.',effort:'medium',timeframe:'1 week'},
      {order:2,title:'Enforce Technically',description:'Require 2-person approval for production changes, privileged access requests, and financial transactions in the system.',effort:'medium',timeframe:'2 weeks'},
    ],
  },
  {
    id: 'AC-6', family: 'access_control', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Least Privilege',
    description: 'Employ the principle of least privilege, allowing only authorized accesses for users and processes necessary to accomplish assigned tasks.',
    objective: 'Minimize access rights to only what is required for each user or process to perform their function.',
    guidance: ['Audit and remove excessive permissions quarterly','Privileged accounts must be separate from standard accounts','Document justification for all privileged access','Review privileged access monthly'],
    evidenceExamples: ['Privileged user list with justifications','Quarterly privilege review records','IAM role/policy documentation showing least privilege'],
    staticRemediation: [
      {order:1,title:'Conduct Privilege Audit',description:'Review every account across all in-boundary systems. Remove any permissions not required for the user\'s current role.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Separate Privileged Accounts',description:'Require admins to use dedicated privileged accounts (separate from their daily-use accounts) for all admin tasks.',effort:'medium',timeframe:'2 weeks'},
      {order:3,title:'Quarterly Privilege Reviews',description:'Schedule formal quarterly reviews where system owners certify all privileged access is still needed.',effort:'low',timeframe:'Ongoing'},
    ],
  },
  {
    id: 'AC-7', family: 'access_control', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Unsuccessful Login Attempts',
    description: 'Enforce a limit on consecutive invalid login attempts and lock the account.',
    objective: 'Prevent brute-force attacks by locking accounts after a defined number of failed attempts.',
    guidance: ['Lock accounts after 3 consecutive failed attempts (FedRAMP requirement)','Notify user and admin on lockout','Require manual unlock or time-based unlock after 30 minutes'],
    evidenceExamples: ['System configuration showing lockout threshold','Test results showing lockout behavior','Alert configuration for lockout events'],
    staticRemediation: [
      {order:1,title:'Configure Account Lockout',description:'Set the lockout threshold to 3 consecutive failed attempts and a 30-minute lockout duration in all in-boundary systems.',effort:'low',timeframe:'1–2 days'},
      {order:2,title:'Alert on Lockout',description:'Configure SIEM to alert the security team when accounts are locked out repeatedly.',effort:'low',timeframe:'3 days'},
    ],
  },
  {
    id: 'AC-17', family: 'access_control', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Remote Access',
    description: 'Establish and document usage restrictions, configuration and connection requirements, and implementation guidance for remote access.',
    objective: 'Control and monitor all remote access to the system.',
    guidance: ['All remote access must use VPN or equivalent','MFA required for all remote access','Monitor and log all remote access sessions','Review remote access authorizations annually'],
    evidenceExamples: ['Remote access policy','VPN configuration documentation','MFA enforcement configuration','Remote access session logs'],
    staticRemediation: [
      {order:1,title:'Enforce VPN + MFA for Remote Access',description:'Require all production system access from outside the office network to go through a corporate VPN with MFA.',effort:'medium',timeframe:'1–2 weeks'},
      {order:2,title:'Log Remote Sessions',description:'Capture session start/end times, source IP, user, and actions for all remote admin sessions.',effort:'medium',timeframe:'1–2 weeks'},
    ],
  },
  {
    id: 'AC-22', family: 'access_control', severity: 'medium', impactLevels: ['low','moderate','high'],
    title: 'Publicly Accessible Content',
    description: 'Designate individuals authorized to post information publicly and review proposed content prior to posting.',
    objective: 'Prevent unauthorized or sensitive information from being posted publicly.',
    guidance: ['Define who can post publicly','Review all public content before posting','Remove non-public information promptly','Train staff on what can be posted publicly'],
    evidenceExamples: ['Public content approval process','Review records for recently posted content','Training records'],
    staticRemediation: [
      {order:1,title:'Define Public Posting Policy',description:'Document who is authorized to publish content to public-facing systems and what review process must be followed.',effort:'low',timeframe:'3 days'},
      {order:2,title:'Implement Review Workflow',description:'Require all public content to be approved by a designated reviewer before publishing.',effort:'low',timeframe:'1 week'},
    ],
  },

  // ── AT – Awareness & Training ─────────────────────────────────────────────
  {
    id: 'AT-1', family: 'awareness_training', severity: 'medium', impactLevels: ['low','moderate','high'],
    title: 'Awareness and Training Policy and Procedures',
    description: 'Develop, document, and disseminate a security awareness and training policy.',
    objective: 'Establish policy governing the security awareness and training program.',
    guidance: ['Policy reviewed annually','Covers all users with system access','Includes role-based training requirements'],
    evidenceExamples: ['Security awareness and training policy','Annual review records'],
    staticRemediation: [
      {order:1,title:'Draft Training Policy',description:'Create a policy defining training requirements for all users (annual awareness) and privileged users (role-based training).',effort:'medium',timeframe:'1 week'},
    ],
  },
  {
    id: 'AT-2', family: 'awareness_training', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Security Awareness Training',
    description: 'Provide basic security awareness training to all system users.',
    objective: 'Ensure all personnel with system access understand security risks and their responsibilities.',
    guidance: ['Training before initial system access','Annual refresher training required','Training must cover current threats','Track completion records'],
    evidenceExamples: ['Training completion records (100% coverage)','Training curriculum/content','Tracking reports by user'],
    staticRemediation: [
      {order:1,title:'Deploy Annual Security Training',description:'Implement security awareness training covering phishing, password security, insider threats, incident reporting, and FedRAMP-specific data handling.',effort:'medium',timeframe:'2–3 weeks'},
      {order:2,title:'Track 100% Completion',description:'Implement tracking to ensure every user with system access completes training before access and annually thereafter.',effort:'low',timeframe:'1 week'},
    ],
  },
  {
    id: 'AT-3', family: 'awareness_training', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Role-Based Security Training',
    description: 'Provide role-based security training to personnel with assigned security roles and responsibilities.',
    objective: 'Ensure personnel with privileged or security-specific roles receive appropriate role-based training.',
    guidance: ['Before assuming security roles','Annual refresher','Covers specific tools and responsibilities','Privileged users need admin-specific training'],
    evidenceExamples: ['Role-based training completion records','Training content per role','Assignment records linking roles to training'],
    staticRemediation: [
      {order:1,title:'Define Role-Based Training Matrix',description:'Map security roles (ISSO, system admin, developer, security reviewer) to required training topics.',effort:'medium',timeframe:'1 week'},
      {order:2,title:'Deploy Role-Specific Training',description:'Deliver role-specific training to all privileged users covering secure coding, incident handling, or system administration as appropriate.',effort:'high',timeframe:'3–4 weeks'},
    ],
  },
  {
    id: 'AT-4', family: 'awareness_training', severity: 'medium', impactLevels: ['low','moderate','high'],
    title: 'Security Training Records',
    description: 'Document and monitor security awareness training activities.',
    objective: 'Maintain records of all security training to demonstrate compliance.',
    guidance: ['Retain training records for at least 3 years','Records include user, training name, date, and result','Accessible for audit'],
    evidenceExamples: ['LMS training completion export','Training log spreadsheet with dates','3-year retention of past records'],
    staticRemediation: [
      {order:1,title:'Implement Training Record Retention',description:'Store training completion records in an LMS or spreadsheet with date, user, and training module. Retain for 3 years.',effort:'low',timeframe:'3 days'},
    ],
  },

  // ── AU – Audit & Accountability ───────────────────────────────────────────
  {
    id: 'AU-2', family: 'audit_accountability', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Event Logging',
    description: 'Identify the types of events that the system is capable of logging in support of the audit function.',
    objective: 'Define and enable logging for all security-relevant events across all in-boundary systems.',
    guidance: ['Log: login/logout, privilege use, account changes, policy changes, system starts/stops, data access','Coordinate event types with other organizations using the system','Review log categories at least annually'],
    evidenceExamples: ['List of auditable events with justification','SIEM or logging platform showing enabled event types','Annual review of event categories'],
    staticRemediation: [
      {order:1,title:'Define Auditable Events',description:'Document all event types that must be logged per FedRAMP guidance: authentication events, privilege escalation, configuration changes, and data access.',effort:'medium',timeframe:'1 week'},
      {order:2,title:'Enable Logging on All Systems',description:'Configure logging on all systems within the authorization boundary for the defined event types.',effort:'high',timeframe:'2–3 weeks'},
    ],
  },
  {
    id: 'AU-3', family: 'audit_accountability', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Content of Audit Records',
    description: 'Ensure audit records contain sufficient information to establish what events occurred, the sources of events, and the outcomes.',
    objective: 'Capture enough context in log records to support forensic investigation.',
    guidance: ['Each record must include: date/time, event type, subject identity, source, outcome','Use consistent timestamp format (UTC)','Include enough detail to reconstruct events'],
    evidenceExamples: ['Sample log records showing all required fields','Log format documentation','SIEM parsing rules'],
    staticRemediation: [
      {order:1,title:'Standardize Log Format',description:'Configure all systems to log in a format that includes: timestamp (UTC), event type, user ID, source IP, destination, and outcome (success/failure).',effort:'medium',timeframe:'2 weeks'},
      {order:2,title:'Validate Log Completeness',description:'Test logging by performing actions (login, privilege change, data access) and verify all required fields appear in the log records.',effort:'low',timeframe:'3 days'},
    ],
  },
  {
    id: 'AU-6', family: 'audit_accountability', severity: 'critical', impactLevels: ['moderate','high'],
    title: 'Audit Record Review, Analysis, and Reporting',
    description: 'Review and analyze audit records at a defined frequency for indications of inappropriate or unusual activity.',
    objective: 'Regularly review logs to detect security incidents and anomalies.',
    guidance: ['Review logs at least weekly','Alert on anomalous activity','Report findings to security leadership','Document all review activities'],
    evidenceExamples: ['SIEM dashboard with alert rules','Weekly log review records','Incident tickets generated from log review','Escalation reports'],
    staticRemediation: [
      {order:1,title:'Implement Automated Log Alerting',description:'Configure SIEM rules to automatically alert on: failed logins >3 consecutive, privilege escalation, after-hours access, data export events.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Establish Weekly Log Review',description:'Schedule a weekly review of SIEM dashboard and alert queue by the ISSO. Document review completion in a log.',effort:'low',timeframe:'1 week'},
    ],
  },
  {
    id: 'AU-9', family: 'audit_accountability', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Protection of Audit Information',
    description: 'Protect audit information and tools from unauthorized access, modification, and deletion.',
    objective: 'Prevent tampering with or deletion of audit records.',
    guidance: ['Only authorized personnel can modify audit logs','Store logs in write-once or append-only storage','Alert on log deletion or tampering','Backup logs to a separate system'],
    evidenceExamples: ['Log storage configuration (S3 with Object Lock, or WORM storage)','Access controls on log storage','Alert configuration for log tampering','Backup records for logs'],
    staticRemediation: [
      {order:1,title:'Protect Log Storage',description:'Move logs to an append-only storage system (e.g., S3 with Object Lock, CloudWatch with no-delete policy) accessible only to the ISSO and security team.',effort:'medium',timeframe:'1–2 weeks'},
      {order:2,title:'Alert on Log Tampering',description:'Configure an alert if log storage is modified, deleted, or if logging stops unexpectedly.',effort:'medium',timeframe:'1 week'},
    ],
  },
  {
    id: 'AU-11', family: 'audit_accountability', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Audit Record Retention',
    description: 'Retain audit records for 90 days online and 1 year total (FedRAMP minimum).',
    objective: 'Ensure logs are retained long enough for forensic investigation and compliance.',
    guidance: ['90 days immediately accessible','1 year total retention minimum','Secure and tamper-evident storage','Documented retention schedule'],
    evidenceExamples: ['Log retention policy','Storage configuration showing 90-day hot + 1-year cold retention','CloudWatch/S3 lifecycle rules'],
    staticRemediation: [
      {order:1,title:'Configure Log Retention',description:'Set log retention to 90 days in hot storage (searchable) and 1 year in cold/archive storage (e.g., S3 Glacier). Document the configuration.',effort:'low',timeframe:'1 day'},
    ],
  },
  {
    id: 'AU-12', family: 'audit_accountability', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Audit Record Generation',
    description: 'Provide audit record generation capability for defined auditable events at defined system components.',
    objective: 'Ensure all system components within the boundary generate the required audit records.',
    guidance: ['All boundary components must generate logs','Designated ISSO can select which events are logged','Logs generated on all relevant system layers'],
    evidenceExamples: ['Inventory of all log-generating components','Logging enabled confirmation per system','Sample logs from each component type'],
    staticRemediation: [
      {order:1,title:'Audit Log Coverage Assessment',description:'Map every system component to its log source. Identify gaps where components are not logging.',effort:'medium',timeframe:'1 week'},
      {order:2,title:'Enable Logging on All Components',description:'Enable logging on all identified gaps. Verify logs are flowing into the SIEM.',effort:'high',timeframe:'2–3 weeks'},
    ],
  },

  // ── CA – Assessment, Authorization & Monitoring ───────────────────────────
  {
    id: 'CA-2', family: 'assessment_authorization', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Control Assessments',
    description: 'Assess the controls in the system to determine the extent to which the controls are implemented correctly.',
    objective: 'Conduct periodic assessments of security and privacy controls.',
    guidance: ['Annual security assessment required','Use 3PAO for FedRAMP authorizations','Assessment plan must be approved before testing','Document results in Security Assessment Report (SAR)'],
    evidenceExamples: ['Security Assessment Plan (SAP)','Security Assessment Report (SAR)','3PAO engagement letter','Assessment findings and remediation tracker'],
    staticRemediation: [
      {order:1,title:'Select a 3PAO',description:'Engage a FedRAMP-authorized Third Party Assessment Organization (3PAO) from the FedRAMP marketplace to conduct the independent assessment.',effort:'high',timeframe:'4–8 weeks'},
      {order:2,title:'Prepare System Security Plan',description:'Document all controls in the SSP before the assessment begins.',effort:'high',timeframe:'6–12 weeks'},
    ],
  },
  {
    id: 'CA-5', family: 'assessment_authorization', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Plan of Action and Milestones (POA&M)',
    description: 'Develop and update a plan of action and milestones for the system.',
    objective: 'Track and manage all open findings and control deficiencies through to remediation.',
    guidance: ['POA&M must be updated monthly','Each finding must have: description, risk level, milestone dates, resources needed, responsible party','Report POA&M to the AO regularly','Findings must be remediated within defined timeframes (Critical: 30 days, High: 90 days)'],
    evidenceExamples: ['POA&M spreadsheet (FedRAMP template)','Monthly update records','Remediation evidence for closed items','Risk acceptance records for accepted items'],
    staticRemediation: [
      {order:1,title:'Create POA&M Using FedRAMP Template',description:'Download the FedRAMP POA&M template and populate it with all current open findings. Include severity, milestone dates, and responsible parties.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Establish Monthly Update Process',description:'Schedule monthly POA&M reviews with the ISSO and system owner to update status and add new findings.',effort:'low',timeframe:'1 week'},
    ],
  },
  {
    id: 'CA-6', family: 'assessment_authorization', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Authorization',
    description: 'Authorize the operation of the information system before commencing operations.',
    objective: 'Obtain formal Authority to Operate (ATO) from the Authorizing Official.',
    guidance: ['ATO required before processing federal data','Authorization package: SSP, SAP, SAR, POA&M','Reassess every 3 years or after significant changes','Continuous monitoring required post-authorization'],
    evidenceExamples: ['Authorization letter (ATO)','Complete authorization package','Date of authorization','3-year reassessment schedule'],
    staticRemediation: [
      {order:1,title:'Complete Authorization Package',description:'Prepare full FedRAMP authorization package: SSP, SAP, SAR, POA&M, FIPS 199, e-Authentication, and Privacy Impact Assessment.',effort:'high',timeframe:'3–6 months'},
      {order:2,title:'Submit to FedRAMP PMO or Agency AO',description:'Submit the complete package to the sponsoring agency or FedRAMP PMO for review and authorization.',effort:'medium',timeframe:'2–4 months for review'},
    ],
  },
  {
    id: 'CA-7', family: 'assessment_authorization', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Continuous Monitoring',
    description: 'Develop a continuous monitoring strategy and implement a continuous monitoring program.',
    objective: 'Maintain ongoing awareness of security, vulnerabilities, and threats to support authorization decisions.',
    guidance: ['Monthly vulnerability scanning required','Annual control assessments','Automated scanning of OS/web app vulnerabilities','Report monthly to AO via ConMon reports','Patch critical vulns in 30 days, high in 90 days'],
    evidenceExamples: ['ConMon strategy document','Monthly vulnerability scan reports','Monthly POA&M updates','Annual assessment results','Patch compliance reports'],
    staticRemediation: [
      {order:1,title:'Implement Monthly Vuln Scanning',description:'Configure authenticated vulnerability scans to run monthly against all in-boundary systems. Route results to POA&M.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Establish ConMon Reporting',description:'Create a ConMon report template and schedule monthly delivery to the sponsoring agency.',effort:'medium',timeframe:'2 weeks'},
    ],
  },

  // ── CM – Configuration Management ────────────────────────────────────────
  {
    id: 'CM-2', family: 'configuration_management', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Baseline Configuration',
    description: 'Develop, document, and maintain a current baseline configuration of the information system.',
    objective: 'Establish and maintain an approved baseline configuration for all system components.',
    guidance: ['Baseline for every component type (OS, network device, application)','Update baseline after changes','Review baseline at least annually','Use hardening guides (DISA STIGs or CIS Benchmarks)'],
    evidenceExamples: ['Baseline configuration documents per component type','CIS/STIG hardening evidence','Annual baseline review records','Configuration management database (CMDB)'],
    staticRemediation: [
      {order:1,title:'Apply CIS Benchmarks',description:'Apply CIS Level 1 benchmarks to all OS and application components. Document deviations with justification.',effort:'high',timeframe:'3–4 weeks'},
      {order:2,title:'Document Baseline Configurations',description:'Create a baseline configuration document for each component type (web server, database, OS). Include version, settings, and last review date.',effort:'high',timeframe:'2–3 weeks'},
    ],
  },
  {
    id: 'CM-6', family: 'configuration_management', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Configuration Settings',
    description: 'Establish and document configuration settings for technology products employed within the system.',
    objective: 'Enforce secure configuration settings across all components.',
    guidance: ['Use USGCB, STIG, or CIS as configuration baseline standards','Monitor and alert on configuration deviations','Require approval for deviations from standards'],
    evidenceExamples: ['STIG/CIS compliance scan results','Configuration deviation approvals','Automated drift detection alerts'],
    staticRemediation: [
      {order:1,title:'Run STIG Compliance Scan',description:'Run SCAP-compliant STIG scans (using NIST SCAP tools or Tenable) against all in-boundary systems and document results.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Remediate or Document Deviations',description:'Remediate all critical/high STIG findings. For accepted deviations, document technical justification and get AO approval.',effort:'high',timeframe:'4–8 weeks'},
    ],
  },
  {
    id: 'CM-7', family: 'configuration_management', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Least Functionality',
    description: 'Configure the system to provide only essential capabilities and prohibit or restrict the use of functions, ports, protocols, and services not required.',
    objective: 'Minimize attack surface by disabling all unnecessary services, ports, and protocols.',
    guidance: ['Disable all unnecessary ports and services','Only approved software may run on system components','Document all allowed ports/protocols/services','Review for unnecessary functionality annually'],
    evidenceExamples: ['Port scan results showing only necessary ports open','Approved ports/protocols/services list','Software inventory showing no unauthorized software'],
    staticRemediation: [
      {order:1,title:'Document Approved Ports and Services',description:'Create an approved ports/protocols/services document listing exactly what is needed. Disable everything else.',effort:'medium',timeframe:'1–2 weeks'},
      {order:2,title:'Run Port Scan and Remediate',description:'Run an external/internal port scan. Close any open port not on the approved list.',effort:'medium',timeframe:'1–2 weeks'},
    ],
  },
  {
    id: 'CM-8', family: 'configuration_management', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'System Component Inventory',
    description: 'Develop and document an inventory of system components that accurately reflects the current system.',
    objective: 'Maintain an accurate, up-to-date inventory of all hardware and software components within the authorization boundary.',
    guidance: ['Update inventory within 30 days of changes','Include: component name, type, location, owner, software versions','Review inventory at least annually','Automated discovery tools preferred'],
    evidenceExamples: ['System component inventory (hardware and software)','Automated discovery tool reports','Annual review records'],
    staticRemediation: [
      {order:1,title:'Build System Component Inventory',description:'Document all hardware and software within the FedRAMP boundary: servers, applications, databases, network devices, and cloud services.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Automate Discovery',description:'Deploy an automated asset discovery tool (AWS Config, ServiceNow, or Qualys) to keep the inventory current.',effort:'high',timeframe:'3–4 weeks'},
    ],
  },

  // ── CP – Contingency Planning ─────────────────────────────────────────────
  {
    id: 'CP-2', family: 'contingency_planning', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Contingency Plan',
    description: 'Develop a contingency plan for the system addressing contingency roles, responsibilities, and procedures.',
    objective: 'Document a tested contingency plan ensuring system recovery within defined RTO/RPO.',
    guidance: ['Plan must define RTO and RPO for the system','Include procedures for degraded mode operations','Identify alternate processing and storage sites','Review and update annually','Coordinate with agency COOP'],
    evidenceExamples: ['Contingency plan document (FedRAMP template)','Annual review record','RTO/RPO definition','Alternate site agreements'],
    staticRemediation: [
      {order:1,title:'Develop Contingency Plan Using FedRAMP Template',description:'Download and complete the FedRAMP Contingency Plan template. Define RTO, RPO, team roles, and step-by-step recovery procedures.',effort:'high',timeframe:'4–6 weeks'},
      {order:2,title:'Get Plan Reviewed and Approved',description:'Have the ISSO and system owner review and approve the plan. Document approval.',effort:'low',timeframe:'1 week'},
    ],
  },
  {
    id: 'CP-4', family: 'contingency_planning', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Contingency Plan Testing',
    description: 'Test the contingency plan for the system to determine the effectiveness of the plan.',
    objective: 'Validate that the contingency plan works and recovery objectives can be met.',
    guidance: ['Test at least annually','Tabletop exercise at minimum; functional test preferred','Document test results and gaps','Update plan based on test findings'],
    evidenceExamples: ['Annual contingency plan test report','Test scenario and results','After-action report with gaps and corrective actions'],
    staticRemediation: [
      {order:1,title:'Conduct Annual Contingency Plan Test',description:'Run a tabletop exercise simulating a system failure. Walk through the CP procedures and measure time against RTO/RPO. Document results.',effort:'medium',timeframe:'1–2 days per year'},
      {order:2,title:'Perform Functional Restore Test',description:'Actually restore from backup to a test environment and measure recovery time. Document vs RTO.',effort:'high',timeframe:'1–2 days'},
    ],
  },
  {
    id: 'CP-9', family: 'contingency_planning', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'System Backup',
    description: 'Conduct backups of user-level, system-level, and system documentation at defined frequencies.',
    objective: 'Ensure all critical data can be recovered within defined RPO.',
    guidance: ['User-level backups: daily','System-level backups: weekly','Store backups off-site or in separate region','Test backup restores quarterly','Protect backups from unauthorized access'],
    evidenceExamples: ['Backup configuration screenshots','Off-site/alternate region backup evidence','Quarterly restore test records','Backup encryption evidence'],
    staticRemediation: [
      {order:1,title:'Configure Daily Automated Backups',description:'Enable automated daily backups for all production databases and file systems. Verify retention meets RPO.',effort:'medium',timeframe:'1 week'},
      {order:2,title:'Replicate to Alternate Region',description:'Configure cross-region replication for backup storage.',effort:'medium',timeframe:'3–5 days'},
      {order:3,title:'Test Restores Quarterly',description:'Perform a documented restore test each quarter. Measure restore time vs RPO.',effort:'medium',timeframe:'Ongoing'},
    ],
  },

  // ── IA – Identification & Authentication ──────────────────────────────────
  {
    id: 'IA-2', family: 'identification_authentication', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Identification and Authentication (Organizational Users)',
    description: 'Uniquely identify and authenticate organizational users accessing the system. Implement MFA for privileged and non-privileged access.',
    objective: 'Enforce multi-factor authentication for all user access to federal systems.',
    guidance: ['MFA required for ALL privileged access (no exceptions)','MFA required for non-privileged network access','PIV/CAC preferred; TOTP acceptable as minimum','No shared accounts allowed','FIDO2/WebAuthn preferred for phishing-resistance'],
    evidenceExamples: ['MFA enforcement configuration','Account policies showing unique account requirement','PIV/CAC configuration if applicable','MFA coverage report showing 100% enforcement'],
    staticRemediation: [
      {order:1,title:'Enforce MFA for All Accounts',description:'Configure your IdP to require MFA for every login — privileged and non-privileged. Use FIDO2/WebAuthn or PIV/CAC where possible.',effort:'medium',timeframe:'1–2 weeks'},
      {order:2,title:'Eliminate Shared Accounts',description:'Audit for and eliminate all shared accounts. Every user must have a unique account.',effort:'medium',timeframe:'1–2 weeks'},
    ],
  },
  {
    id: 'IA-4', family: 'identification_authentication', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Identifier Management',
    description: 'Manage system identifiers for users and devices.',
    objective: 'Ensure unique identifiers are assigned and managed for all users and devices.',
    guidance: ['Unique IDs for every user','Prevent identifier reuse for 2 years','Disable identifiers after 35 days of inactivity (FedRAMP)','Assign identifiers per account management process'],
    evidenceExamples: ['Identity management system configuration','Dormant account policy showing 35-day threshold','ID reuse prevention configuration'],
    staticRemediation: [
      {order:1,title:'Configure 35-Day Inactivity Lockout',description:'Set IdP policy to automatically disable accounts that have not logged in for 35 days (FedRAMP requirement, stricter than NIST).',effort:'low',timeframe:'1 day'},
    ],
  },
  {
    id: 'IA-5', family: 'identification_authentication', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Authenticator Management',
    description: 'Manage system authenticators by verifying identities of users, devices, and services before issuing authenticators.',
    objective: 'Ensure authenticators (passwords, tokens, certificates) are properly managed and protected.',
    guidance: ['Minimum password: 12 chars, complexity required','Change temporary passwords on first use','Protect authenticators from disclosure','Rotate shared authenticators when membership changes','FIPS 140-2 validated cryptography for authenticators'],
    evidenceExamples: ['Password policy configuration','FIPS 140-2 validation certificates for cryptographic modules','Authenticator rotation records','Service account credential management'],
    staticRemediation: [
      {order:1,title:'Configure Password Policy',description:'Set minimum 12-character passwords with complexity requirements (upper, lower, number, special). Enable password history (24 passwords) and maximum age (60 days).',effort:'low',timeframe:'1 day'},
      {order:2,title:'Use FIPS 140-2 Validated Modules',description:'Ensure all cryptographic operations use FIPS 140-2 validated modules. AWS GovCloud and Azure Government are FIPS-compliant by default.',effort:'medium',timeframe:'2–4 weeks'},
    ],
  },
  {
    id: 'IA-8', family: 'identification_authentication', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Identification and Authentication (Non-Organizational Users)',
    description: 'Uniquely identify and authenticate non-organizational users accessing the system.',
    objective: 'Apply strong authentication controls to external users (customers, contractors, partners).',
    guidance: ['Unique identifiers for all non-org users','MFA required for non-org privileged access','PIV/CAC for federal users accessing the system','Document external authentication mechanisms'],
    evidenceExamples: ['External user authentication configuration','MFA enforcement for external users','Federation/SAML configuration for federal users'],
    staticRemediation: [
      {order:1,title:'Enforce MFA for External Users',description:'Configure your application to require MFA for all external users with any privileged access or access to sensitive data.',effort:'medium',timeframe:'1–2 weeks'},
    ],
  },

  // ── IR – Incident Response ────────────────────────────────────────────────
  {
    id: 'IR-1', family: 'incident_response', severity: 'medium', impactLevels: ['low','moderate','high'],
    title: 'Incident Response Policy and Procedures',
    description: 'Develop, document, and disseminate an incident response policy and procedures.',
    objective: 'Establish a documented incident response policy covering reporting to US-CERT/CISA.',
    guidance: ['Policy reviewed annually','Must include federal reporting requirements (US-CERT)','Covers roles, responsibilities, and escalation','FedRAMP: must report to US-CERT within 1 hour of confirmed breach'],
    evidenceExamples: ['Incident response policy with FedRAMP reporting requirements','Annual review records','US-CERT reporting procedures'],
    staticRemediation: [
      {order:1,title:'Update IR Policy for FedRAMP',description:'Add US-CERT reporting requirements to your IR policy: 1-hour notification for confirmed incidents, use US-CERT incident reporting form.',effort:'medium',timeframe:'1 week'},
    ],
  },
  {
    id: 'IR-4', family: 'incident_response', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Incident Handling',
    description: 'Implement an incident handling capability including preparation, detection, analysis, containment, eradication, and recovery.',
    objective: 'Execute a structured incident response process for all security incidents.',
    guidance: ['FedRAMP: report to US-CERT within 1 hour of confirmed incident','Coordinate with FedRAMP PMO and agency AO','Document all incidents in incident tracking system','Conduct after-action review for all significant incidents'],
    evidenceExamples: ['Incident response plan with US-CERT notification steps','Incident log showing tracked incidents','US-CERT notification records','After-action reports'],
    staticRemediation: [
      {order:1,title:'Update IRP with FedRAMP Requirements',description:'Add to your IRP: (1) US-CERT notification within 1 hour, (2) Agency AO notification, (3) FedRAMP PMO notification procedure.',effort:'medium',timeframe:'1 week'},
      {order:2,title:'Test Notification Procedures',description:'Conduct a tabletop exercise specifically testing the US-CERT and AO notification process.',effort:'medium',timeframe:'1–2 days'},
    ],
  },
  {
    id: 'IR-6', family: 'incident_response', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Incident Reporting',
    description: 'Report security incidents to US-CERT within defined timeframes.',
    objective: 'Meet federal incident reporting obligations including US-CERT notification.',
    guidance: ['Report to US-CERT within 1 hour of confirmed incident','Use US-CERT incident reporting form at us-cert.gov','Report to sponsoring agency CISO within 1 hour','Monthly reporting to FedRAMP PMO for ConMon'],
    evidenceExamples: ['US-CERT reporting procedure','Incident tickets with notification timestamps','Monthly ConMon reports'],
    staticRemediation: [
      {order:1,title:'Register with US-CERT',description:'Create an account at us-cert.gov for your organization to enable incident reporting. Document the URL and process in your IRP.',effort:'low',timeframe:'1 day'},
      {order:2,title:'Add Reporting Checklist to IRP',description:'Add a checklist to your IRP: "Within 1 hour: notify ISSO → notify agency CISO → submit US-CERT form at [URL]."',effort:'low',timeframe:'2 days'},
    ],
  },
  {
    id: 'IR-8', family: 'incident_response', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Incident Response Plan',
    description: 'Develop an incident response plan addressing roles, responsibilities, and reporting requirements.',
    objective: 'Maintain a documented, tested incident response plan meeting FedRAMP requirements.',
    guidance: ['Plan must include US-CERT notification requirements','Coordinate with agency incident response capabilities','Update plan annually or after major incidents','Review with all IR team members annually'],
    evidenceExamples: ['Incident Response Plan document (FedRAMP template)','Annual review records','Team acknowledgment records'],
    staticRemediation: [
      {order:1,title:'Complete IRP Using FedRAMP Template',description:'Download and complete the FedRAMP Incident Response Plan template. Include US-CERT notification, agency coordination, and severity classification.',effort:'high',timeframe:'2–3 weeks'},
    ],
  },

  // ── MA – Maintenance ──────────────────────────────────────────────────────
  {
    id: 'MA-2', family: 'maintenance', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Controlled Maintenance',
    description: 'Schedule, document, and review records of maintenance and repairs on system components.',
    objective: 'Ensure all system maintenance is authorized, documented, and reviewed.',
    guidance: ['Pre-approve all maintenance activities','Log maintenance dates, personnel, and actions taken','Post-maintenance security checks required','Remove maintenance personnel access when complete'],
    evidenceExamples: ['Maintenance schedule and approval records','Maintenance log with dates, personnel, and actions','Post-maintenance security check records'],
    staticRemediation: [
      {order:1,title:'Create Maintenance Log',description:'Implement a maintenance log (Jira ticket or spreadsheet) capturing: date, system, maintenance type, personnel, actions taken, and post-check results.',effort:'low',timeframe:'3 days'},
    ],
  },
  {
    id: 'MA-4', family: 'maintenance', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Nonlocal Maintenance',
    description: 'Authorize, monitor, and control nonlocal maintenance and diagnostic activities.',
    objective: 'Ensure remote maintenance sessions are authorized, monitored, and terminated when complete.',
    guidance: ['Require MFA for remote maintenance connections','Log all remote maintenance sessions (session recording preferred)','Terminate sessions immediately when maintenance is complete','Use encrypted connections only'],
    evidenceExamples: ['Remote maintenance policy','Session log showing remote maintenance activities','MFA requirement for remote maintenance connections'],
    staticRemediation: [
      {order:1,title:'Configure Remote Maintenance Controls',description:'Require MFA + VPN for all remote maintenance sessions. Enable session recording for privileged remote sessions.',effort:'medium',timeframe:'1 week'},
    ],
  },

  // ── MP – Media Protection ─────────────────────────────────────────────────
  {
    id: 'MP-2', family: 'media_protection', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Media Access',
    description: 'Restrict access to digital and non-digital media to authorized individuals.',
    objective: 'Control access to media containing federal data.',
    guidance: ['Restrict USB/removable media access to authorized users only','Log media access events','Protect media in transit','Maintain media inventory'],
    evidenceExamples: ['Media access policy','Technical controls restricting USB use (MDM policy)','Media access logs'],
    staticRemediation: [
      {order:1,title:'Restrict Removable Media via MDM',description:'Configure MDM policy to block unauthorized USB drives and removable media on all devices accessing the FedRAMP system.',effort:'medium',timeframe:'1 week'},
    ],
  },
  {
    id: 'MP-6', family: 'media_protection', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Media Sanitization',
    description: 'Sanitize system media before disposal or reuse using approved methods.',
    objective: 'Ensure all federal data is unrecoverable before media is disposed or repurposed.',
    guidance: ['Use NIST 800-88 compliant sanitization methods','Get certificates of destruction for physical media','Document all sanitization activities','Verify effectiveness of sanitization'],
    evidenceExamples: ['Media sanitization policy','Certificate of data destruction from ITAD vendor','Sanitization log with NIST 800-88 method used'],
    staticRemediation: [
      {order:1,title:'Establish Media Sanitization Procedure',description:'Document that all decommissioned storage uses NIST 800-88 methods (cryptographic erasure for SSDs, DoD 5220.22-M for HDDs). Use certified ITAD vendor.',effort:'medium',timeframe:'1 week'},
    ],
  },

  // ── PE – Physical & Environmental Protection ──────────────────────────────
  {
    id: 'PE-2', family: 'physical_environmental', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Physical Access Authorizations',
    description: 'Develop and maintain a list of individuals with authorized access to the facility where the system resides.',
    objective: 'Control who is authorized to physically access the facility housing the system.',
    guidance: ['Maintain authorized access list','Review and update access list at least annually','Revoke access within 1 day of termination','Issue credentials only after background checks'],
    evidenceExamples: ['Physical access authorization list','Annual review records','Badge access system reports','Terminated employee access revocation records'],
    staticRemediation: [
      {order:1,title:'Maintain Physical Access Authorization List',description:'Create and maintain a list of all personnel authorized for physical access to the data center or server room. Review quarterly.',effort:'low',timeframe:'1 day'},
    ],
  },
  {
    id: 'PE-3', family: 'physical_environmental', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Physical Access Control',
    description: 'Enforce physical access authorizations using physical access control mechanisms.',
    objective: 'Implement technical controls that enforce authorized physical access.',
    guidance: ['Electronic badge access with audit logs','Two-factor physical access for critical areas','Visitor escort and sign-in required','Review and maintain access records'],
    evidenceExamples: ['Badge access system configuration','Access logs for last 90 days','Visitor log','Data center physical security documentation or SOC 2 report'],
    staticRemediation: [
      {order:1,title:'Implement Electronic Badge Access',description:'Deploy electronic badge readers with audit logging for all entry points to areas containing the federal system.',effort:'high',timeframe:'2–4 weeks'},
      {order:2,title:'Leverage Data Center SOC 2 Report',description:'For cloud-hosted systems, obtain the AWS/Azure/GCP SOC 2 report from their audit portal. This inherits PE controls.',effort:'low',timeframe:'1 day'},
    ],
  },
  {
    id: 'PE-6', family: 'physical_environmental', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Monitoring Physical Access',
    description: 'Monitor physical access to the facility where the system resides.',
    objective: 'Detect and investigate physical access anomalies.',
    guidance: ['CCTV cameras at all entry/exit points','Review physical access logs weekly','Alert on after-hours access','Investigate anomalies within 1 business day'],
    evidenceExamples: ['CCTV coverage map','Weekly log review records','Alert configuration for after-hours access','Anomaly investigation records'],
    staticRemediation: [
      {order:1,title:'Deploy Physical Access Monitoring',description:'Install CCTV at all entry/exit points. Configure alerts for after-hours access. Review logs weekly.',effort:'high',timeframe:'2–4 weeks (or inherit from cloud provider)'},
    ],
  },

  // ── PL – Planning ─────────────────────────────────────────────────────────
  {
    id: 'PL-2', family: 'planning', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'System Security and Privacy Plan (SSP)',
    description: 'Develop, document, and maintain a system security plan that describes the system boundary, operational environment, and controls.',
    objective: 'Maintain the complete System Security Plan as the authoritative document for the FedRAMP authorization.',
    guidance: ['SSP must use FedRAMP SSP template','Update SSP within 30 days of significant changes','ISSO reviews and updates SSP at least annually','SSP must describe all 325 Moderate controls','All personnel must acknowledge the SSP rules of behavior'],
    evidenceExamples: ['Completed FedRAMP SSP (all 17 chapters)','Annual review record','Change history log','Staff acknowledgment of rules of behavior'],
    staticRemediation: [
      {order:1,title:'Complete FedRAMP SSP Template',description:'Download the FedRAMP System Security Plan template and complete all 17 chapters. This is the foundational document for your authorization.',effort:'high',timeframe:'2–4 months'},
      {order:2,title:'Get SSP Reviewed by ISSO and AO',description:'Have the ISSO review for accuracy and completeness and get formal approval from the Authorizing Official.',effort:'medium',timeframe:'3–4 weeks'},
    ],
  },
  {
    id: 'PL-4', family: 'planning', severity: 'medium', impactLevels: ['low','moderate','high'],
    title: 'Rules of Behavior',
    description: 'Establish rules of behavior for individuals requiring access to the system.',
    objective: 'Ensure all users understand and agree to system rules before receiving access.',
    guidance: ['All users must sign rules of behavior before access','Rules renewed annually or when changed','Cover: acceptable use, password policy, reporting obligations','Maintain signed copies'],
    evidenceExamples: ['Rules of Behavior document','Signed acknowledgments from all users','Annual renewal records'],
    staticRemediation: [
      {order:1,title:'Create and Circulate Rules of Behavior',description:'Draft a Rules of Behavior document covering acceptable use, password policy, and incident reporting. Get signed acknowledgment from all users with system access.',effort:'medium',timeframe:'1–2 weeks'},
    ],
  },

  // ── PM – Program Management ───────────────────────────────────────────────
  {
    id: 'PM-1', family: 'program_management', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Information Security Program Plan',
    description: 'Develop and disseminate an organization-wide information security program plan.',
    objective: 'Establish an organization-wide information security program.',
    guidance: ['Plan addresses all systems','Reviewed and updated annually','Approved by the CISO or equivalent','Describes the program structure, goals, and resources'],
    evidenceExamples: ['Information Security Program Plan','Annual review records','CISO approval signature'],
    staticRemediation: [
      {order:1,title:'Draft Information Security Program Plan',description:'Create a plan describing your security program: scope, leadership, budget, key processes (risk management, training, assessments, incident response).',effort:'high',timeframe:'3–4 weeks'},
    ],
  },
  {
    id: 'PM-9', family: 'program_management', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Risk Management Strategy',
    description: 'Develop a risk management strategy for the organization that includes a determination of risk tolerance.',
    objective: 'Define and document the organization\'s approach to managing security risk.',
    guidance: ['Document risk tolerance levels','Describe risk management approach (NIST RMF)','Align with agency risk management strategy','Review annually'],
    evidenceExamples: ['Risk management strategy document','Risk tolerance statement','Alignment with NIST RMF documentation'],
    staticRemediation: [
      {order:1,title:'Document Risk Management Strategy',description:'Write a 2-3 page risk management strategy defining: risk tolerance, risk acceptance criteria, and how the organization identifies, assesses, and treats risks.',effort:'medium',timeframe:'2 weeks'},
    ],
  },

  // ── PS – Personnel Security ───────────────────────────────────────────────
  {
    id: 'PS-3', family: 'personnel_security', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Personnel Screening',
    description: 'Screen individuals prior to authorizing access to the system.',
    objective: 'Conduct background checks on all personnel before granting system access.',
    guidance: ['Background check required before system access','Position sensitivity level determines depth of screening','Rescreening required every 5 years for privileged users','Document screening completion'],
    evidenceExamples: ['Background check policy','Screening completion records (NACI, Tier 1, or higher)','Position risk designation for each role'],
    staticRemediation: [
      {order:1,title:'Implement Background Check Program',description:'Require NACI (National Agency Check with Inquiries) or equivalent background check for all personnel with system access before granting credentials.',effort:'high',timeframe:'4–8 weeks to implement program'},
    ],
  },
  {
    id: 'PS-4', family: 'personnel_security', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Personnel Termination',
    description: 'Upon termination, disable access within the defined time period and retrieve organizational credentials.',
    objective: 'Revoke all system access immediately upon personnel termination.',
    guidance: ['Disable all accounts within 1 business day of termination (FedRAMP)','Retrieve PIV cards, tokens, and credentials','Notify system owners','Document termination checklist completion'],
    evidenceExamples: ['Termination checklist with completion timestamps','Account deactivation records showing time from termination to deactivation','Credential recovery records'],
    staticRemediation: [
      {order:1,title:'Implement 1-Business-Day Offboarding',description:'Create an automated or manual process to disable all accounts within 1 business day of termination. Document each occurrence with timestamps.',effort:'high',timeframe:'2–3 weeks'},
    ],
  },
  {
    id: 'PS-6', family: 'personnel_security', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Access Agreements',
    description: 'Obtain signed access agreements from users before granting access to the system.',
    objective: 'Ensure all users acknowledge their responsibilities before accessing the system.',
    guidance: ['Sign before access granted','Annual renewal required','Include NDA if appropriate','Retain signed copies','Cover: rules of behavior, acceptable use, and reporting obligations'],
    evidenceExamples: ['Access agreement template','Signed agreements for all current users','Annual renewal records'],
    staticRemediation: [
      {order:1,title:'Create and Obtain Access Agreements',description:'Create an access agreement combining rules of behavior, AUP, and NDA. Require signature before any access is granted.',effort:'medium',timeframe:'1–2 weeks'},
    ],
  },

  // ── PT – PII Processing ───────────────────────────────────────────────────
  {
    id: 'PT-1', family: 'pii_processing', severity: 'medium', impactLevels: ['low','moderate','high'],
    title: 'PII Processing and Transparency Policy',
    description: 'Develop, document, and disseminate a PII processing and transparency policy.',
    objective: 'Establish policy governing the collection, use, and protection of PII.',
    guidance: ['Policy reviewed annually','Covers all PII processing within the system boundary','Addresses Privacy Act requirements','Describes individual rights and notification'],
    evidenceExamples: ['PII processing policy document','Annual review records','Privacy Impact Assessment (PIA)'],
    staticRemediation: [
      {order:1,title:'Conduct Privacy Impact Assessment',description:'Complete a PIA for the system documenting what PII is collected, why, how it\'s used, and what protections are in place.',effort:'high',timeframe:'3–4 weeks'},
    ],
  },
  {
    id: 'PT-2', family: 'pii_processing', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Authority to Process PII',
    description: 'Determine and document the legal authority that permits the collection, use, and maintenance of PII.',
    objective: 'Establish documented legal authority for every PII processing activity.',
    guidance: ['Document legal authority for each PII data element','Legal authority types: statute, executive order, regulation','Include in Privacy Act SORN if applicable','Review legal authorities annually'],
    evidenceExamples: ['PII inventory with legal authority per data element','Privacy Act SORN (if applicable)','Legal counsel review records'],
    staticRemediation: [
      {order:1,title:'Map PII to Legal Authority',description:'For each PII data element collected, document the specific law, regulation, or executive order that authorizes collection. Have legal counsel review.',effort:'high',timeframe:'3–4 weeks'},
    ],
  },

  // ── RA – Risk Assessment ──────────────────────────────────────────────────
  {
    id: 'RA-2', family: 'risk_assessment', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Security Categorization',
    description: 'Categorize the information system in accordance with FIPS 199 and NIST SP 800-60.',
    objective: 'Formally classify the system impact level (Low/Moderate/High) using FIPS 199.',
    guidance: ['Use FIPS 199 and NIST 800-60 for categorization','Categorize for confidentiality, integrity, and availability','Overall impact = highest of the three','Document in FIPS 199 worksheet','Get AO approval of categorization'],
    evidenceExamples: ['Completed FIPS 199 Security Categorization form','NIST 800-60 mapping','AO approval of categorization'],
    staticRemediation: [
      {order:1,title:'Complete FIPS 199 Security Categorization',description:'Download and complete the FIPS 199 Security Categorization form. Rate confidentiality, integrity, and availability as Low/Moderate/High based on impact of compromise.',effort:'medium',timeframe:'1–2 weeks'},
      {order:2,title:'Get AO Sign-Off',description:'Submit completed categorization to the Authorizing Official for approval.',effort:'low',timeframe:'1–2 weeks'},
    ],
  },
  {
    id: 'RA-3', family: 'risk_assessment', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Risk Assessment',
    description: 'Conduct an organizational assessment of risk and update the risk assessment at least annually.',
    objective: 'Identify and assess risks to the system and organization annually.',
    guidance: ['Annual risk assessment required','Use NIST 800-30 methodology','Include threat landscape, vulnerability analysis, and impact assessment','Document in risk register','Feed results into POA&M'],
    evidenceExamples: ['Annual risk assessment report','Risk register','NIST 800-30 methodology evidence','Results fed to POA&M'],
    staticRemediation: [
      {order:1,title:'Conduct Annual Risk Assessment',description:'Perform a risk assessment using NIST 800-30. Identify threats, vulnerabilities, likelihood, and impact. Document in a risk register.',effort:'high',timeframe:'3–4 weeks'},
      {order:2,title:'Feed Results to POA&M',description:'Create POA&M items for all high and critical risks identified in the assessment.',effort:'medium',timeframe:'1 week'},
    ],
  },
  {
    id: 'RA-5', family: 'risk_assessment', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Vulnerability Monitoring and Scanning',
    description: 'Scan for vulnerabilities in the system and applications at defined frequencies.',
    objective: 'Maintain an active vulnerability management program meeting FedRAMP scanning requirements.',
    guidance: ['OS/infrastructure scans: monthly (FedRAMP requirement)','Web application scans: monthly','Database scans: monthly','Authenticated scans required','Results fed into POA&M within 30 days','Critical: remediate in 30 days, High: 90 days, Moderate: 180 days'],
    evidenceExamples: ['Monthly vulnerability scan reports','POA&M items for open findings','Remediation evidence for closed findings','Scan tool configuration showing authenticated scans'],
    staticRemediation: [
      {order:1,title:'Configure Monthly Authenticated Scans',description:'Run authenticated vulnerability scans monthly against all in-boundary OS, web applications, and databases using an approved scanner (Tenable, Qualys, Rapid7).',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Establish FedRAMP Remediation SLAs',description:'Set POA&M milestones: Critical = 30 days, High = 90 days, Moderate = 180 days, Low = 365 days.',effort:'low',timeframe:'3 days'},
    ],
  },

  // ── SA – System & Services Acquisition ───────────────────────────────────
  {
    id: 'SA-3', family: 'system_acquisition', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'System Development Life Cycle',
    description: 'Manage the system using a system development life cycle methodology that incorporates information security considerations.',
    objective: 'Integrate security into all phases of the system development life cycle.',
    guidance: ['Define SDLC methodology including security gates','Security reviews at design, development, and test phases','Security testing before production release','Document security decisions throughout SDLC'],
    evidenceExamples: ['SDLC policy with security integration','Security review checklists per phase','SAST/DAST scan results before release','Code review records'],
    staticRemediation: [
      {order:1,title:'Define Secure SDLC',description:'Document your SDLC with security gates: threat modeling at design, SAST in CI/CD, DAST before release, and security sign-off before production.',effort:'medium',timeframe:'2 weeks'},
    ],
  },
  {
    id: 'SA-9', family: 'system_acquisition', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'External System Services',
    description: 'Require external service providers to comply with security requirements and employ appropriate security controls.',
    objective: 'Ensure third-party services within the authorization boundary meet FedRAMP requirements.',
    guidance: ['External services processing federal data must be FedRAMP authorized or meet equivalent security requirements','Document all external services in SSP','Include security requirements in contracts','Conduct annual supplier reviews'],
    evidenceExamples: ['External services inventory in SSP','FedRAMP authorization evidence for each cloud service','Contract security clauses','Annual vendor review records'],
    staticRemediation: [
      {order:1,title:'Inventory External Services',description:'List all third-party services within the authorization boundary (cloud, SaaS, APIs). Verify each is FedRAMP authorized or document compensating controls.',effort:'high',timeframe:'2–3 weeks'},
    ],
  },
  {
    id: 'SA-11', family: 'system_acquisition', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Developer Testing and Evaluation',
    description: 'Require developers to create and implement a security assessment plan for the system.',
    objective: 'Ensure developers perform security testing throughout the development process.',
    guidance: ['SAST required in CI/CD pipeline','DAST before production releases','Penetration testing at least annually','Remediate findings before production'],
    evidenceExamples: ['SAST scan results and remediation records','DAST tool reports','Annual penetration test report','Remediation evidence for critical/high findings'],
    staticRemediation: [
      {order:1,title:'Implement SAST in CI/CD',description:'Add a Static Application Security Testing (SAST) tool (Semgrep, SonarQube, Checkmarx) to your CI/CD pipeline. Block releases with critical findings.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Conduct Annual Penetration Test',description:'Commission an annual penetration test by a qualified tester. Use a FedRAMP-authorized 3PAO for the assessment.',effort:'high',timeframe:'4–6 weeks'},
    ],
  },

  // ── SC – System & Communications Protection ───────────────────────────────
  {
    id: 'SC-5', family: 'system_communications', severity: 'high', impactLevels: ['low','moderate','high'],
    title: 'Denial-of-Service Protection',
    description: 'Protect against or limit the effects of denial-of-service attacks.',
    objective: 'Implement technical controls to detect and mitigate DoS/DDoS attacks.',
    guidance: ['Implement DDoS protection at network boundary','Rate limiting on all public-facing APIs','Monitor for DoS indicators','Define response procedures for DoS events'],
    evidenceExamples: ['DDoS protection service configuration (AWS Shield, Cloudflare)','Rate limiting configuration','DoS response procedure','Incident records showing DoS mitigation'],
    staticRemediation: [
      {order:1,title:'Enable DDoS Protection',description:'Enable AWS Shield Standard (free) or equivalent at the network boundary. For high-value systems, use AWS Shield Advanced or Cloudflare.',effort:'low',timeframe:'1 day'},
      {order:2,title:'Implement API Rate Limiting',description:'Configure rate limiting on all public API endpoints to prevent abuse.',effort:'medium',timeframe:'1 week'},
    ],
  },
  {
    id: 'SC-7', family: 'system_communications', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Boundary Protection',
    description: 'Monitor and control communications at the external boundary and key internal boundaries of the system.',
    objective: 'Implement strong network boundary controls to protect the authorization boundary.',
    guidance: ['Define the authorization boundary clearly in SSP','Default deny for inbound traffic','Log all boundary crossing traffic','Implement next-gen firewall or WAF','Regularly audit boundary rules'],
    evidenceExamples: ['Network boundary diagram (in SSP)','Firewall rule documentation showing default deny','WAF configuration','Quarterly firewall rule review records'],
    staticRemediation: [
      {order:1,title:'Document and Enforce Authorization Boundary',description:'Clearly define the FedRAMP authorization boundary in your network diagram and SSP. All ingress/egress must pass through controlled boundary points.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Implement Default-Deny Firewall Rules',description:'Configure all boundary firewalls with default-deny and explicit allow rules for only required traffic.',effort:'medium',timeframe:'1–2 weeks'},
    ],
  },
  {
    id: 'SC-8', family: 'system_communications', severity: 'critical', impactLevels: ['moderate','high'],
    title: 'Transmission Confidentiality and Integrity',
    description: 'Implement cryptographic mechanisms to prevent unauthorized disclosure or modification of information during transmission.',
    objective: 'Encrypt all data in transit using FIPS 140-2 validated cryptography.',
    guidance: ['TLS 1.2 minimum (TLS 1.3 preferred)','FIPS 140-2 validated cryptographic modules required','Disable SSL, TLS 1.0, TLS 1.1','HTTPS only for all web interfaces','Use HSTS with minimum 1-year max-age'],
    evidenceExamples: ['TLS scan results from SSLLabs showing TLS 1.2+','FIPS 140-2 certificate for cryptographic module','HSTS configuration','Configuration file showing disabled legacy protocols'],
    staticRemediation: [
      {order:1,title:'Enforce TLS 1.2+ with FIPS Modules',description:'Disable TLS 1.0/1.1 and SSL on all systems. Configure FIPS 140-2 validated cipher suites. Test with SSLLabs.com.',effort:'medium',timeframe:'1 week'},
      {order:2,title:'Implement HSTS',description:'Add HSTS header with max-age=31536000 to all web interfaces. Use AWS Certificate Manager for FIPS-compliant TLS.',effort:'low',timeframe:'1–2 days'},
    ],
  },
  {
    id: 'SC-13', family: 'system_communications', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Cryptographic Protection',
    description: 'Implement FIPS-validated cryptography when used to protect information.',
    objective: 'Use only FIPS 140-2 validated cryptographic modules for all cryptographic operations.',
    guidance: ['All encryption must use FIPS 140-2 validated modules','Document all cryptographic implementations','Use FIPS-mode for OpenSSL, .NET, Java','AWS GovCloud and Azure Government are FIPS-compliant'],
    evidenceExamples: ['FIPS 140-2 certificates for all cryptographic modules used','FIPS-mode configuration documentation','Cryptographic inventory in SSP'],
    staticRemediation: [
      {order:1,title:'Enable FIPS Mode',description:'Enable FIPS 140-2 mode on all OS instances and application runtimes. AWS: use FIPS endpoints. Azure/GCP: use Government regions.',effort:'high',timeframe:'2–4 weeks'},
    ],
  },
  {
    id: 'SC-28', family: 'system_communications', severity: 'critical', impactLevels: ['moderate','high'],
    title: 'Protection of Information at Rest',
    description: 'Implement cryptographic mechanisms to prevent unauthorized disclosure or modification of information at rest.',
    objective: 'Encrypt all sensitive federal data at rest using FIPS 140-2 validated encryption.',
    guidance: ['All federal data at rest must be encrypted','AES-256 minimum (FIPS 140-2 validated)','Encrypt databases, file systems, and backups','Manage encryption keys using a dedicated KMS','Key rotation at least annually'],
    evidenceExamples: ['Database encryption configuration','File system/disk encryption status','KMS configuration','Key rotation schedule and records','S3 server-side encryption configuration'],
    staticRemediation: [
      {order:1,title:'Enable Encryption at Rest Everywhere',description:'Enable AES-256 encryption for all databases (RDS), storage (S3, EBS), and backups. Use AWS KMS with CMKs for key management.',effort:'medium',timeframe:'1–2 weeks'},
      {order:2,title:'Establish Key Rotation',description:'Configure automatic annual key rotation in KMS. Document the key management plan.',effort:'low',timeframe:'3 days'},
    ],
  },

  // ── SI – System & Information Integrity ───────────────────────────────────
  {
    id: 'SI-2', family: 'system_integrity', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Flaw Remediation',
    description: 'Identify, report, and correct information system flaws and vulnerabilities.',
    objective: 'Remediate software vulnerabilities within FedRAMP-required timeframes.',
    guidance: ['Critical CVEs: patch within 30 days (FedRAMP)','High CVEs: patch within 90 days','Monitor CVE databases and vendor advisories','Test patches before deployment','Document all patch activities'],
    evidenceExamples: ['Patch management policy with FedRAMP SLAs','Monthly patch reports','Vulnerability scan results before/after patching','POA&M for open vulnerabilities'],
    staticRemediation: [
      {order:1,title:'Implement Patch Management with FedRAMP SLAs',description:'Establish a patch management process with documented SLAs: Critical ≤ 30 days, High ≤ 90 days, Moderate ≤ 180 days. Track in POA&M.',effort:'high',timeframe:'2–3 weeks'},
      {order:2,title:'Subscribe to CVE Feeds',description:'Subscribe to NVD, CISA KEV, and vendor security advisories for all software in the boundary.',effort:'low',timeframe:'1 day'},
    ],
  },
  {
    id: 'SI-3', family: 'system_integrity', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'Malicious Code Protection',
    description: 'Implement malicious code protection mechanisms at system entry and exit points.',
    objective: 'Deploy and maintain anti-malware/EDR across all systems.',
    guidance: ['Anti-malware on all endpoints and servers','Automatic signature updates (within 24 hours)','Scan email and web downloads','Alert on detection','EDR preferred over traditional AV'],
    evidenceExamples: ['EDR/AV deployment report showing 100% coverage','Auto-update configuration','Recent detection/response log','Alert configuration'],
    staticRemediation: [
      {order:1,title:'Deploy EDR with Auto-Updates',description:'Install CrowdStrike, Carbon Black, or Microsoft Defender (FIPS-compliant) on all servers and endpoints. Configure automatic signature updates.',effort:'medium',timeframe:'1–2 weeks'},
    ],
  },
  {
    id: 'SI-4', family: 'system_integrity', severity: 'critical', impactLevels: ['low','moderate','high'],
    title: 'System Monitoring',
    description: 'Monitor the information system to detect attacks and indicators of potential attacks.',
    objective: 'Implement continuous monitoring to detect security incidents and anomalies.',
    guidance: ['Deploy SIEM with correlation rules','Monitor all authorization boundary ingress/egress','Alert on anomalous behavior within 1 hour','Protect monitoring data from tampering','Retain monitoring data per AU-11 requirements'],
    evidenceExamples: ['SIEM configuration and dashboard screenshots','Alert rules document','Recent alert and response records','Network monitoring coverage diagram'],
    staticRemediation: [
      {order:1,title:'Deploy SIEM',description:'Implement a SIEM (Splunk, AWS Security Hub, or equivalent) that aggregates logs from all boundary systems and generates alerts for anomalous activity.',effort:'high',timeframe:'4–6 weeks'},
      {order:2,title:'Tune Alert Rules',description:'Configure rules for: failed logins, privilege escalation, after-hours access, data exfiltration indicators, and configuration changes.',effort:'high',timeframe:'2–3 weeks'},
    ],
  },
  {
    id: 'SI-7', family: 'system_integrity', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Software, Firmware, and Information Integrity',
    description: 'Employ integrity verification tools to detect unauthorized changes to software, firmware, and information.',
    objective: 'Detect unauthorized modification of critical system software and data.',
    guidance: ['File integrity monitoring on critical OS files and configs','Alert immediately on unauthorized changes','Verify software integrity before installation','Use code signing for all deployments'],
    evidenceExamples: ['FIM tool configuration and alerts','Code signing configuration','Software integrity verification records','Alert log for unauthorized change detections'],
    staticRemediation: [
      {order:1,title:'Deploy File Integrity Monitoring',description:'Enable FIM using AWS Config, AIDE, or Tripwire on all production servers. Alert on changes to critical system files.',effort:'medium',timeframe:'1–2 weeks'},
      {order:2,title:'Implement Code Signing',description:'Sign all deployment artifacts. Verify signatures before deployment to production.',effort:'medium',timeframe:'2 weeks'},
    ],
  },
  {
    id: 'SI-10', family: 'system_integrity', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Information Input Validation',
    description: 'Check the validity of information inputs to the system.',
    objective: 'Validate all data inputs to prevent injection attacks and data corruption.',
    guidance: ['Server-side validation for all inputs','Reject inputs that do not meet format/range requirements','Validate for: SQL injection, XSS, command injection','Log all validation failures'],
    evidenceExamples: ['Input validation code review','DAST/SAST scan results','Web application firewall rule configuration','Validation failure log samples'],
    staticRemediation: [
      {order:1,title:'Implement Server-Side Input Validation',description:'Add server-side validation for all API inputs. Reject and log invalid inputs. Use parameterized queries for all database operations.',effort:'high',timeframe:'2–4 weeks'},
      {order:2,title:'Deploy WAF with OWASP Rules',description:'Configure WAF with OWASP Core Rule Set to detect and block injection attacks.',effort:'medium',timeframe:'1 week'},
    ],
  },

  // ── SR – Supply Chain Risk Management ────────────────────────────────────
  {
    id: 'SR-2', family: 'supply_chain', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Supply Chain Risk Management Plan',
    description: 'Develop a supply chain risk management plan.',
    objective: 'Document the organization\'s approach to managing supply chain risks.',
    guidance: ['Address risks from third-party hardware, software, and services','Include processes for evaluating suppliers','Address counterfeit component risk','Review and update annually'],
    evidenceExamples: ['Supply chain risk management plan','Supplier evaluation process','Annual review records'],
    staticRemediation: [
      {order:1,title:'Develop Supply Chain Risk Management Plan',description:'Create a plan covering: vendor vetting process, software provenance verification, hardware security, and third-party code review.',effort:'high',timeframe:'3–4 weeks'},
    ],
  },
  {
    id: 'SR-6', family: 'supply_chain', severity: 'high', impactLevels: ['moderate','high'],
    title: 'Supplier Assessments and Reviews',
    description: 'Assess and review the supply chain-related risks associated with suppliers and services.',
    objective: 'Conduct periodic security assessments of critical suppliers.',
    guidance: ['Annual review of critical suppliers','Obtain security attestations or certifications','Contractual security requirements for all suppliers','Document assessment results'],
    evidenceExamples: ['Supplier risk assessment records','Supplier SOC 2 or FedRAMP authorization evidence','Contract security clauses','Annual review completion'],
    staticRemediation: [
      {order:1,title:'Annual Supplier Security Reviews',description:'Conduct annual security reviews of all critical suppliers. Obtain SOC 2 reports, ISO 27001 certs, or FedRAMP authorizations.',effort:'medium',timeframe:'2–4 weeks'},
    ],
  },
];

// Merge examples
for (const control of FEDRAMP_CONTROLS) {
  const ex = FEDRAMP_EXAMPLES[control.id];
  if (ex) control.example = ex;
}

export function getFedRAMPControlsByFamily(family: FedRAMPFamily): FedRAMPControl[] {
  return FEDRAMP_CONTROLS.filter(c => c.family === family);
}

export function getFedRAMPControlById(id: string): FedRAMPControl | undefined {
  return FEDRAMP_CONTROLS.find(c => c.id === id);
}

export function getFedRAMPControlsByImpact(level: FedRAMPImpactLevel): FedRAMPControl[] {
  return FEDRAMP_CONTROLS.filter(c => c.impactLevels.includes(level));
}
