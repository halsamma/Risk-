import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle2, XCircle, MinusCircle, HelpCircle,
  BookOpen, Lightbulb, ListChecks, Zap, Clock, X, Sparkles,
  TrendingUp, ArrowRight, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

// ── Framework definitions ─────────────────────────────────────────────────────
const FRAMEWORKS = [
  {
    id: 'soc2',
    icon: '🔐',
    label: 'SOC 2',
    subtitle: 'AICPA Trust Service Criteria',
    description: 'The most common compliance framework for SaaS companies. Covers security, availability, confidentiality, and privacy.',
    color: 'indigo',
    border: 'border-indigo-700/60',
    bg: 'bg-indigo-900/10',
    tag: 'Most Popular',
    controls: 52,
    bestFor: 'SaaS companies, cloud services, B2B software',
  },
  {
    id: 'fedramp',
    icon: '🦅',
    label: 'FedRAMP',
    subtitle: 'NIST 800-53 / Federal Cloud',
    description: 'Required for cloud services used by US federal agencies. Based on NIST 800-53 with 20 control families.',
    color: 'blue',
    border: 'border-blue-700/60',
    bg: 'bg-blue-900/10',
    tag: 'Government',
    controls: 110,
    bestFor: 'Cloud providers selling to US federal agencies',
  },
  {
    id: 'pci_dss',
    icon: '💳',
    label: 'PCI DSS v4',
    subtitle: 'Payment Card Industry',
    description: 'Required for any organization that processes, stores, or transmits payment card data.',
    color: 'green',
    border: 'border-green-700/60',
    bg: 'bg-green-900/10',
    tag: 'Payments',
    controls: 72,
    bestFor: 'E-commerce, fintech, payment processors',
  },
  {
    id: 'pci_pin',
    icon: '🔑',
    label: 'PCI PIN',
    subtitle: 'PIN Transaction Security',
    description: 'Covers PIN entry devices, cryptographic key management, and PIN-based transaction processing.',
    color: 'yellow',
    border: 'border-yellow-700/60',
    bg: 'bg-yellow-900/10',
    tag: 'PIN / ATM',
    controls: 33,
    bestFor: 'Acquirers, processors, PED deployers',
  },
  {
    id: 'nist_ai_rmf',
    icon: '🤖',
    label: 'NIST AI RMF',
    subtitle: 'AI Risk Management Framework',
    description: 'The US government\'s standard for managing AI risk — fairness, transparency, safety, explainability.',
    color: 'purple',
    border: 'border-purple-700/60',
    bg: 'bg-purple-900/10',
    tag: 'AI Governance',
    controls: 41,
    bestFor: 'Companies building or deploying AI systems',
  },
];

// ── Demo controls per framework ───────────────────────────────────────────────
const DEMO_CONTROLS: Record<string, any[]> = {
  soc2: [
    {
      id: 'CC5.2', severity: 'critical',
      title: 'MFA & Technology Controls',
      description: 'The entity selects and develops general technology controls — MFA, endpoint protection, and patch management.',
      objective: 'Implement foundational security controls that protect all systems.',
      guidance: ['Enforce MFA for all systems — no exceptions', 'Deploy EDR on all company devices', 'Patch critical vulnerabilities within 7 days', 'Enforce TLS 1.2+ on all connections'],
      evidenceExamples: ['MFA configuration screenshots', 'EDR dashboard showing 100% coverage', 'Patch compliance report'],
      quickWin: 'In Okta, go to Security → Authentication Policies → require MFA for every sign-in. This takes 10 minutes and immediately satisfies the MFA requirement.',
      scenario: 'NodeFlow enforces MFA for all employees via Okta. An authentication policy blocks access to all apps if the user lacks an enrolled MFA factor. GitHub and AWS console SSO through Okta.',
      howToFix: [{ order: 1, title: 'Enforce MFA Everywhere', description: 'Enable MFA for all user accounts. Phishing-resistant MFA (FIDO2/WebAuthn) preferred.', effort: 'medium', timeframe: '1–2 weeks' }, { order: 2, title: 'Deploy Endpoint Protection', description: 'Install and configure EDR on all managed endpoints.', effort: 'medium', timeframe: '1–2 weeks' }],
    },
    {
      id: 'CC6.1', severity: 'critical',
      title: 'Logical Access Controls (RBAC)',
      description: 'The entity implements logical access security software and architectures to protect against unauthorized access.',
      objective: 'Control who can access what using role-based access control and least privilege.',
      guidance: ['Implement role-based access control (RBAC)', 'Enforce least privilege — remove excessive permissions', 'Centralize auth with SSO / identity provider', 'Quarterly access reviews by managers'],
      evidenceExamples: ['RBAC configuration', 'Quarterly access review records', 'SSO configuration screenshot'],
      quickWin: 'In Okta, create three groups: admin, developer, read-only. Move all users into the right group. Takes 30 minutes — this is the foundation of RBAC.',
      scenario: 'FluxAPI uses Okta with SSO connected to GitHub, AWS, Snowflake, and Slack. Three roles defined. No shared accounts. Quarterly manager reviews certify all access is still needed.',
      howToFix: [{ order: 1, title: 'Implement RBAC', description: 'Define roles for all systems based on job function. Eliminate shared accounts.', effort: 'high', timeframe: '3–4 weeks' }, { order: 2, title: 'Quarterly Access Reviews', description: 'Managers certify their team\'s access every quarter.', effort: 'medium', timeframe: '1 week setup + ongoing' }],
    },
    {
      id: 'CC7.2', severity: 'critical',
      title: 'Security Incident Management',
      description: 'The entity monitors systems for anomalies and manages security incidents through a formal response program.',
      objective: 'Detect, respond to, and learn from security incidents with a documented plan.',
      guidance: ['Maintain a formal incident response plan', 'Define incident severity levels (P1–P4)', 'Conduct annual tabletop exercises', 'Post-incident review within 5 business days'],
      evidenceExamples: ['Incident Response Plan document', 'Tabletop exercise records', 'Incident log', 'Post-incident reports'],
      quickWin: 'Write a 1-page IRP: who to call first, how to contain the incident, how to notify customers. Get your CTO to approve it via email. That email is valid evidence.',
      scenario: 'RailsFast has a documented IRP in Confluence with 4 severity levels and SLAs. Contact trees, escalation paths, and playbooks for 5 incident types are included.',
      howToFix: [{ order: 1, title: 'Create Incident Response Plan', description: 'Document steps for identification, containment, eradication, recovery, and lessons learned.', effort: 'medium', timeframe: '2–3 weeks' }, { order: 2, title: 'Annual Tabletop Exercise', description: 'Simulate a realistic incident scenario. Document outcomes.', effort: 'medium', timeframe: '2 weeks' }],
    },
    {
      id: 'A1.2', severity: 'critical',
      title: 'Backups & Recovery',
      description: 'The entity protects against data loss through automated backups and tested recovery procedures.',
      objective: 'Ensure all critical data can be recovered within defined RPO targets.',
      guidance: ['Automated daily backups for all databases', 'Quarterly restore tests — documented', 'Off-site / cross-region backup storage', 'Defined RTO and RPO per system'],
      evidenceExamples: ['Backup config screenshots', 'Quarterly restore test records', 'Cross-region replication config', 'RTO/RPO definitions'],
      quickWin: 'In AWS RDS, verify automated backups are enabled with 7-day retention. Screenshot it. Restore the latest snapshot to a test instance this week. Two screenshots = A1.2 evidence.',
      scenario: 'DataPulse runs automated daily RDS snapshots with 35-day retention replicated to a separate region. An automated Lambda runs weekly to restore a snapshot and verify data integrity.',
      howToFix: [{ order: 1, title: 'Enable Automated Backups', description: 'Configure daily backups for all production databases. Verify retention meets RPO.', effort: 'medium', timeframe: '1 week' }, { order: 2, title: 'Test Restores Quarterly', description: 'Perform documented restore tests each quarter. Measure time vs RPO target.', effort: 'medium', timeframe: 'Ongoing' }],
    },
  ],
  fedramp: [
    {
      id: 'IA-2', severity: 'critical',
      title: 'Multi-Factor Authentication',
      description: 'Uniquely identify and authenticate organizational users. Implement MFA for ALL privileged and non-privileged access.',
      objective: 'Enforce multi-factor authentication for every user accessing federal systems — no exceptions.',
      guidance: ['MFA required for ALL access — privileged AND non-privileged', 'PIV/CAC preferred; FIDO2/WebAuthn acceptable', 'No shared accounts — every user has a unique ID', 'FIPS 140-2 validated cryptography required'],
      evidenceExamples: ['Okta authentication policy screenshot', 'Monthly MFA coverage report (100%)', 'No shared accounts confirmation'],
      quickWin: 'In Okta, go to Security → Authentication Policies → Add rule: "All Users must authenticate with MFA on every sign-in." This one change enforces MFA across all Okta-connected apps.',
      scenario: 'FedCloud Corp enforces MFA for 100% of users via Okta with FIDO2 hardware keys for privileged users. Monthly report confirms 0 accounts without MFA enrolled.',
      howToFix: [{ order: 1, title: 'Enforce MFA for All Accounts', description: 'Configure IdP to require MFA for every login — privileged and non-privileged. Use FIDO2/WebAuthn or PIV/CAC where possible.', effort: 'medium', timeframe: '1–2 weeks' }, { order: 2, title: 'Eliminate Shared Accounts', description: 'Audit for and eliminate all shared accounts. Every user must have a unique account.', effort: 'medium', timeframe: '1–2 weeks' }],
    },
    {
      id: 'CA-5', severity: 'critical',
      title: 'Plan of Action & Milestones (POA&M)',
      description: 'Develop and update a plan of action and milestones for the system to document open findings and track remediation.',
      objective: 'Track every open security finding through to remediation with documented milestones.',
      guidance: ['Update POA&M monthly', 'Each finding: description, risk, milestone dates, responsible party', 'Critical: remediate in 30 days; High: 90 days', 'Report monthly to Authorizing Official (AO)'],
      evidenceExamples: ['POA&M spreadsheet (FedRAMP template)', 'Monthly update records', 'AO sign-off on most recent review'],
      quickWin: 'Download the FedRAMP POA&M template from fedramp.gov/resources/templates. Populate it with your 5 most significant security findings. Get ISSO to review. That\'s your starting POA&M.',
      scenario: 'GovApp LLC maintains their POA&M in the FedRAMP Excel template, updated the first Monday of every month. Currently 8 open items — 0 critical, 2 high on track for 90-day remediation.',
      howToFix: [{ order: 1, title: 'Create POA&M Using FedRAMP Template', description: 'Download and populate the official FedRAMP POA&M template with all open findings, severity, milestones, and owners.', effort: 'high', timeframe: '2–3 weeks' }, { order: 2, title: 'Establish Monthly Update Process', description: 'Schedule monthly reviews with ISSO and system owner to update status and add new findings.', effort: 'low', timeframe: '1 week' }],
    },
    {
      id: 'RA-5', severity: 'critical',
      title: 'Vulnerability Scanning',
      description: 'Scan for vulnerabilities monthly using authenticated scans. Feed results into POA&M within 30 days.',
      objective: 'Maintain an active vulnerability management program meeting FedRAMP monthly scanning requirements.',
      guidance: ['Authenticated scans monthly — OS, web apps, databases', 'Critical CVEs: patch within 30 days', 'High CVEs: patch within 90 days', 'Route findings to POA&M automatically'],
      evidenceExamples: ['Monthly scan reports (last 12 months)', 'POA&M items for open findings', 'Remediation evidence for closed findings'],
      quickWin: 'Enable AWS Inspector v2 in your account — one click, free for 15 days. It immediately starts scanning EC2, Lambda, and containers. Export the first report. That\'s your baseline vulnerability scan.',
      scenario: 'FedCloud Inc. runs Tenable.io authenticated scans monthly. Results auto-populate their POA&M via Jira integration. This month: 0 critical, 3 high (on track), 12 moderate.',
      howToFix: [{ order: 1, title: 'Deploy Monthly Authenticated Scans', description: 'Configure authenticated vulnerability scans monthly on all in-boundary systems using an approved scanner.', effort: 'high', timeframe: '2–3 weeks' }, { order: 2, title: 'Establish FedRAMP SLAs', description: 'Set POA&M milestones: Critical ≤ 30 days, High ≤ 90 days, Moderate ≤ 180 days.', effort: 'low', timeframe: '3 days' }],
    },
    {
      id: 'SC-7', severity: 'critical',
      title: 'Boundary Protection',
      description: 'Monitor and control communications at the external boundary and key internal boundaries of the authorization boundary.',
      objective: 'Implement strong network boundary controls to protect the FedRAMP authorization boundary.',
      guidance: ['Define and document the authorization boundary in SSP', 'Default-deny for all inbound traffic', 'Log all boundary-crossing traffic', 'Quarterly firewall rule reviews'],
      evidenceExamples: ['Network boundary diagram in SSP', 'Firewall rules showing default-deny', 'Quarterly rule review records'],
      quickWin: 'Export your AWS Security Group rules. Verify no "All Traffic" inbound rules exist. If they do, replace with specific port/source rules. Screenshot before and after. That\'s your boundary protection evidence.',
      scenario: 'CloudGov Inc. defined their authorization boundary in the SSP network diagram. AWS Security Groups follow default-deny with explicit allow for only HTTPS (443) and VPN (500/4500).',
      howToFix: [{ order: 1, title: 'Document Authorization Boundary', description: 'Define the FedRAMP authorization boundary in your network diagram and SSP. All ingress/egress must pass through controlled boundary points.', effort: 'high', timeframe: '2–3 weeks' }, { order: 2, title: 'Implement Default-Deny', description: 'Configure all boundary firewalls with default-deny and explicit allow rules for only required traffic.', effort: 'medium', timeframe: '1–2 weeks' }],
    },
  ],
  pci_dss: [
    {
      id: 'REQ-6.3', severity: 'critical',
      title: 'Secure Development & Vulnerability Management',
      description: 'Security vulnerabilities are identified and addressed. Bespoke and custom software is developed securely.',
      objective: 'Identify and remediate security vulnerabilities in all software before they can be exploited.',
      guidance: ['Security testing before every production release', 'SAST in CI/CD pipeline', 'Critical patches within 1 month (PCI DSS v4)', 'Penetration test at least annually'],
      evidenceExamples: ['SAST scan results', 'Patch management reports', 'Annual penetration test report'],
      quickWin: 'Add Semgrep to your GitHub Actions: `- uses: semgrep/semgrep-action@v1`. It runs on every PR and flags security issues. Screenshot a PR with Semgrep results — that\'s your first secure development gate.',
      scenario: 'PaySecure Corp runs Checkmarx SAST in CI/CD, blocking releases with critical findings. DAST scans run monthly in staging. Annual pentest by QSA found 1 high (now remediated).',
      howToFix: [{ order: 1, title: 'Add SAST to CI/CD', description: 'Deploy a Static Application Security Testing tool (Semgrep, SonarQube) in your CI/CD pipeline. Block releases with critical findings.', effort: 'medium', timeframe: '1–2 weeks' }, { order: 2, title: 'Annual Penetration Test', description: 'Commission an annual penetration test targeting the cardholder data environment.', effort: 'high', timeframe: '4–6 weeks' }],
    },
    {
      id: 'REQ-8.4', severity: 'critical',
      title: 'Multi-Factor Authentication for CDE Access',
      description: 'MFA is implemented for all access into the cardholder data environment (CDE) — no exceptions.',
      objective: 'Prevent unauthorized access to systems that store, process, or transmit cardholder data.',
      guidance: ['MFA required for ALL access to CDE — not just remote', 'Phishing-resistant MFA (FIDO2) strongly preferred', 'No shared credentials for CDE systems', 'MFA required even for local network access to CDE'],
      evidenceExamples: ['MFA configuration for CDE systems', 'Access policy documentation', 'MFA coverage report (100%)'],
      quickWin: 'Map every system that touches cardholder data. For each, verify MFA is enabled. If any system allows password-only access to the CDE, that\'s a critical PCI DSS finding.',
      scenario: 'CardSafe Inc. enforces FIDO2 hardware keys for all CDE access — including internal developers. No password-only access to any CDE system exists. Monthly report confirms 100% MFA.',
      howToFix: [{ order: 1, title: 'Enforce MFA on All CDE Access', description: 'Enable MFA for every account that can access the cardholder data environment — local and remote.', effort: 'medium', timeframe: '1–2 weeks' }, { order: 2, title: 'Eliminate Shared Credentials', description: 'Remove all shared accounts from CDE systems. Every person needs a unique ID.', effort: 'medium', timeframe: '1 week' }],
    },
    {
      id: 'REQ-3.5', severity: 'critical',
      title: 'Protect Stored Account Data (PAN)',
      description: 'Primary account numbers (PANs) are secured wherever stored using strong cryptography.',
      objective: 'Ensure no cardholder data is stored in cleartext anywhere in your environment.',
      guidance: ['PAN must be unreadable anywhere it is stored (AES-256 or equivalent)', 'Truncate PANs where full number is not needed', 'Never store CVV/CVC — ever', 'Scan for unprotected PANs quarterly'],
      evidenceExamples: ['Encryption configuration for PAN storage', 'PAN scan results (no cleartext)', 'Tokenization configuration'],
      quickWin: 'Run a PAN scan on your databases using a tool like Spirion or a custom Luhn algorithm script. Search for 16-digit sequences that pass the Luhn check. If you find any, that\'s a critical finding.',
      scenario: 'SecureCard Corp uses tokenization — actual PANs never touch their systems. A third-party token vault handles all PAN storage. Quarterly scans confirm zero cleartext PANs.',
      howToFix: [{ order: 1, title: 'Implement Tokenization', description: 'Use a PCI-certified token vault so PANs never enter your systems. Replace stored PANs with tokens.', effort: 'high', timeframe: '4–8 weeks' }, { order: 2, title: 'Quarterly PAN Scans', description: 'Scan all databases and file systems for cleartext PANs every quarter. Document results.', effort: 'medium', timeframe: '1 week setup + ongoing' }],
    },
    {
      id: 'REQ-10.2', severity: 'high',
      title: 'Audit Log All CDE Access',
      description: 'Audit logs capture all access to system components in the cardholder data environment.',
      objective: 'Create a complete, tamper-protected audit trail of all CDE activity.',
      guidance: ['Log all access to CDE — successful and failed', 'Logs must include user ID, timestamp, event type, source IP', '12-month retention (3 months immediately accessible)', 'Protect logs from modification or deletion'],
      evidenceExamples: ['SIEM configuration showing CDE log sources', 'Sample log entries with all required fields', 'Log retention configuration'],
      quickWin: 'Enable AWS CloudTrail in all regions for your account and point it at an S3 bucket with Object Lock (WORM). Screenshot both configurations. That\'s your CDE audit logging evidence.',
      scenario: 'PayLog Corp ships all CDE logs to Splunk with 90-day hot retention and S3 Glacier archival to 12 months. S3 Object Lock prevents deletion. The CISO reviews the Splunk dashboard weekly.',
      howToFix: [{ order: 1, title: 'Enable Audit Logging on All CDE Systems', description: 'Configure logging for all CDE components: all access attempts, privilege escalation, config changes.', effort: 'medium', timeframe: '1–2 weeks' }, { order: 2, title: 'Protect Log Integrity', description: 'Store logs in append-only or WORM storage (S3 Object Lock). Only security team can access.', effort: 'low', timeframe: '3 days' }],
    },
  ],
  pci_pin: [
    {
      id: 'KM-2', severity: 'critical',
      title: 'Cryptographic Key Generation',
      description: 'Cryptographic keys are generated using approved random number generators in a secure HSM with dual control.',
      objective: 'Ensure PIN encryption keys are generated with sufficient randomness and under strict controlled conditions.',
      guidance: ['FIPS 140-2 Level 3 validated HSM required for key generation', 'Minimum two authorized key custodians must be physically present', 'Key generation events logged with timestamps and both custodian IDs', 'Never generate keys in software on general-purpose computers'],
      evidenceExamples: ['HSM FIPS 140-2 certificate', 'Key generation logs with dual custodian signatures', 'Dual control policy'],
      quickWin: 'Verify your HSM appears on the NIST CMVP validated modules list at csrc.nist.gov. Search by vendor (Thales, Utimaco, Safenet). Screenshot the "Level 3" validation. That\'s your KM-2 HSM qualification evidence.',
      scenario: 'PayCrypt Corp uses a Thales payShield 10K (FIPS 140-2 Level 3 validated). Key ceremonies require two of four designated custodians with physical smart card tokens. All generation events logged.',
      howToFix: [{ order: 1, title: 'Mandate HSM for Key Generation', description: 'All PIN keys must be generated within a FIPS 140-2 Level 3+ HSM. Document the HSM model and FIPS certificate.', effort: 'high', timeframe: '4–8 weeks' }, { order: 2, title: 'Implement Dual Control', description: 'Require two authorized custodians physically present for all key generation. Log both signatures.', effort: 'medium', timeframe: '1–2 weeks' }],
    },
    {
      id: 'PHYS-3', severity: 'critical',
      title: 'Secure Key Loading Facility',
      description: 'Key injection operations are performed in a physically isolated, access-controlled environment with CCTV coverage.',
      objective: 'Protect key injection from physical compromise — only authorized custodians, no network access during ceremonies.',
      guidance: ['Dedicated physically isolated room for key injection', 'Badge access restricted to authorized key custodians only', 'CCTV recording of entire key loading facility', 'No network connections during key loading ceremonies'],
      evidenceExamples: ['Key loading facility access log', 'CCTV configuration', 'Injection records with two custodian signatures', 'Network disconnection checklist'],
      quickWin: 'Designate any room with a lock as your key loading area. Create a log book: Date | Time | Custodian 1 | Custodian 2 | Key Type | Operation. Require two signatures per entry. That\'s a compliant starting point.',
      scenario: 'SecureKeyLoad LLC performs key injection in a dedicated 15m² room with badge access for 4 custodians only. CCTV covers the full room. Network cables disconnected during all ceremonies.',
      howToFix: [{ order: 1, title: 'Establish Secure Key Loading Facility', description: 'Designate a physically secure room for key injection. Install badge access and CCTV. Restrict to authorized custodians only.', effort: 'high', timeframe: '3–4 weeks' }, { order: 2, title: 'Enforce Dual Control', description: 'Require two authorized custodians physically present for all key loading. Log both signatures.', effort: 'medium', timeframe: '1 week' }],
    },
    {
      id: 'KM-4', severity: 'critical',
      title: 'Cryptographic Key Storage',
      description: 'Cryptographic keys are stored only within HSMs — never in cleartext outside hardware security modules.',
      objective: 'Ensure no PIN keys exist anywhere except inside approved hardware security modules.',
      guidance: ['Master keys stored only in HSM internal memory — never exported in cleartext', 'Working keys stored encrypted under KEKs within HSM', 'No keys in application config files, databases, or environment variables', 'HSM generates an audit log entry for every key access'],
      evidenceExamples: ['HSM key storage configuration', 'Application config scan showing no cleartext keys', 'HSM access audit logs'],
      quickWin: 'Run this search across all app configs: grep -r "SECRET\\|PRIVATE KEY\\|ZMK\\|ZPK" /your/app. If any cryptographic keys appear in config files, those are critical findings requiring immediate remediation.',
      scenario: 'VaultKey Corp stores all PIN keys in their Utimaco HSM. A config audit confirmed zero instances of cryptographic keys in files, databases, or environment variables. HSM logs every key access.',
      howToFix: [{ order: 1, title: 'Audit for Cleartext Keys', description: 'Search all app configs, databases, and code for any cleartext cryptographic keys. Remove immediately and replace with HSM-managed keys.', effort: 'high', timeframe: '2–3 weeks' }, { order: 2, title: 'Move All Keys to HSM', description: 'Migrate all PIN-related key storage to the HSM. No keys should exist outside the HSM except when encrypted under another key.', effort: 'high', timeframe: '4–8 weeks' }],
    },
    {
      id: 'MON-4', severity: 'critical',
      title: 'PIN Incident Response Plan',
      description: 'A PIN security incident response plan exists and is tested — covering key compromise, device tampering, and fraud.',
      objective: 'Respond rapidly and correctly to PIN security incidents including card brand notification requirements.',
      guidance: ['IRP must include PIN-specific scenarios: key compromise, PED tamper, mass fraud', 'Notify Visa and Mastercard within 4 hours of confirmed incident', 'Document key replacement steps as part of incident response', 'Annual tabletop exercise for PIN security scenarios'],
      evidenceExamples: ['PIN Incident Response Plan', 'Card brand notification contacts', 'Annual tabletop exercise records'],
      quickWin: 'Add these two contacts to your IRP right now: Visa Fraud Control: 1-650-432-7500 and Mastercard Global Security: 1-636-722-7111. Add a line: "Notify card brands within 4 hours of confirmed compromise." Done in 5 minutes.',
      scenario: 'SecurityFirst Payments\' PIN IRP includes Scenario B: "HSM compromise suspected." The last annual tabletop completed Scenario B in 47 minutes, within the 1-hour SLA.',
      howToFix: [{ order: 1, title: 'Create PIN Incident Response Plan', description: 'Document IRP covering: PED tamper, key compromise, mass card fraud. Include card brand notification contacts and timelines.', effort: 'high', timeframe: '2–3 weeks' }, { order: 2, title: 'Annual Tabletop Exercise', description: 'Test PIN incident response annually. Time the response against card brand notification SLAs.', effort: 'medium', timeframe: '1–2 days per year' }],
    },
  ],
  nist_ai_rmf: [
    {
      id: 'MS-2.5', severity: 'critical',
      title: 'AI Bias & Fairness Testing',
      description: 'The AI system undergoes structured bias and fairness testing before deployment across all affected groups.',
      objective: 'Detect and document bias in AI outputs before go-live — across race, gender, age, and other protected characteristics.',
      guidance: ['Test across all protected characteristics relevant to the use case', 'Use tools: Fairlearn, IBM AI Fairness 360, Google What-If Tool', 'Test both input bias (training data) and output bias (predictions)', 'Define acceptable fairness thresholds before testing'],
      evidenceExamples: ['Bias testing report with per-group metrics', 'Fairness tool configuration', 'Pre-deployment bias sign-off', 'Threshold policy'],
      quickWin: 'pip install fairlearn. Run demographic_parity_difference() on your model predictions. If >0.1 for any protected group, you have a documented finding. The test itself is your MS-2.5 evidence.',
      scenario: 'BiasCheck Corp ran their hiring AI through IBM AI Fairness 360. Found: demographic parity difference of 0.12 for gender (above 0.05 threshold). Applied reweighing — dropped to 0.04. Documented in model card.',
      howToFix: [{ order: 1, title: 'Run Pre-Deployment Bias Audit', description: 'Run your AI through Fairlearn or IBM AI Fairness 360. Measure demographic parity difference, equalized odds, predictive parity. Document all findings.', effort: 'high', timeframe: '2–3 weeks' }, { order: 2, title: 'Define Fairness Thresholds', description: 'Set maximum acceptable bias thresholds. Block deployment if thresholds are exceeded until mitigations are applied.', effort: 'medium', timeframe: '1 week' }],
    },
    {
      id: 'GV-2.1', severity: 'critical',
      title: 'AI Risk Roles & Accountability',
      description: 'Roles and responsibilities for AI risk management are defined, assigned to named individuals, and communicated.',
      objective: 'Establish clear accountability for AI risk — who owns each model, who approves deployment, who monitors for harm.',
      guidance: ['Define roles: AI Risk Officer, Model Owner per model, TEVV Lead, Ethics Reviewer', 'Assign named individuals to each role', 'Publish an AI RACI matrix', 'Ensure AI risk function reports to executive leadership'],
      evidenceExamples: ['AI RACI matrix', 'Org chart showing AI risk function', 'Named model owners for each production AI system', 'Role designation letters'],
      quickWin: 'Create a table: AI System | Model Owner | Testing Lead | Risk Approver. Fill in names for each production AI system. Send to leadership for acknowledgment. That\'s your AI accountability structure.',
      scenario: 'TechAI Corp created a clear RACI: AI Risk Officer (CISO) owns the program; each model has a named Model Owner; a TEVV Lead runs testing; an Ethics Reviewer approves high-risk deployments.',
      howToFix: [{ order: 1, title: 'Define AI Risk Roles', description: 'Create role definitions for AI Risk Officer, Model Owner, Testing Lead, and Ethics Reviewer.', effort: 'medium', timeframe: '1–2 weeks' }, { order: 2, title: 'Publish AI RACI Matrix', description: 'Map all AI risk activities to responsible parties. Publish and get leadership acknowledgment.', effort: 'medium', timeframe: '1 week' }],
    },
    {
      id: 'MS-3.1', severity: 'critical',
      title: 'Deployed AI Monitoring',
      description: 'Ongoing monitoring of deployed AI systems detects performance degradation, bias drift, and unexpected behavior in production.',
      objective: 'Continuously monitor AI systems to catch harmful outputs, drift, and performance problems before they cause harm.',
      guidance: ['Monitor prediction distribution for data drift and concept drift', 'Alert on significant changes in model output patterns', 'Monitor for bias drift — fairness metrics in production', 'Log a sample of AI inputs/outputs for human review weekly'],
      evidenceExamples: ['AI monitoring dashboard', 'Drift detection configuration', 'Bias monitoring alerts in production', 'AI output sampling and review logs'],
      quickWin: 'Install Evidently AI (pip install evidently). Run a basic data drift report comparing last month\'s model inputs to this month\'s. If you see significant drift, you have an actionable finding. The report is your monitoring evidence.',
      scenario: 'MonitorML Corp runs Evidently AI on all production models. Dashboard shows prediction drift (PSI score), model performance, and fairness metrics. Alerts fire when PSI > 0.2. Weekly ISSO review.',
      howToFix: [{ order: 1, title: 'Deploy AI Monitoring', description: 'Implement data drift and model performance monitoring using Evidently AI, Arize, or custom dashboards. Alert on performance drops >5%.', effort: 'high', timeframe: '3–4 weeks' }, { order: 2, title: 'AI Output Sampling', description: 'Log a random 1–5% sample of AI outputs for human review. Create a process for reviewers to flag errors or biased outputs.', effort: 'medium', timeframe: '2 weeks' }],
    },
    {
      id: 'MG-2.3', severity: 'critical',
      title: 'AI Incident Response',
      description: 'Processes are established to respond to and recover from AI risk events — harmful outputs, bias incidents, model failures.',
      objective: 'Respond effectively to AI incidents with a plan specifically covering AI-unique failure modes.',
      guidance: ['IRP must include AI-specific scenarios: harmful output, bias complaint, model failure', 'Define severity levels for AI incidents', 'Include model rollback procedures', 'Annual AI incident response drills'],
      evidenceExamples: ['AI Incident Response Plan', 'AI incident severity classification', 'Model rollback procedure', 'AI incident drill records'],
      quickWin: 'Add one AI scenario to your existing IRP: "If our AI produces a harmful/discriminatory output: (1) Disable the AI feature within 2 hours. (2) Notify affected users. (3) Investigate root cause. (4) Re-enable only after fix is verified."',
      scenario: 'SafeAI Corp\'s AI IRP covers 5 scenarios: harmful output, bias incident, model failure, data poisoning, prompt injection. Annual tabletop tests the top 2 scenarios. Model rollback is documented per system.',
      howToFix: [{ order: 1, title: 'Create AI Incident Response Plan', description: 'Write IRP covering harmful outputs, bias complaints, model failure, adversarial attacks. Define response steps, owners, escalation paths.', effort: 'high', timeframe: '2–3 weeks' }, { order: 2, title: 'Document Model Rollback', description: 'For every AI system, document how to roll back to the previous version if the new version causes problems.', effort: 'medium', timeframe: '1–2 weeks' }],
    },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  security: 'Security', availability: 'Availability',
  soc2: 'SOC 2', fedramp: 'FedRAMP', pci_dss: 'PCI DSS',
  pci_pin: 'PCI PIN', nist_ai_rmf: 'NIST AI RMF',
};

type Status = 'yes' | 'partial' | 'no' | 'na';
type Tab = 'overview' | 'how_to_fix' | 'example';

const STATUS_CONFIG = {
  yes:     { label: 'Implemented',     icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-400',  bg: 'bg-green-900/40 border-green-700' },
  partial: { label: 'Partial',         icon: <MinusCircle  className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-900/40 border-yellow-700' },
  no:      { label: 'Not Implemented', icon: <XCircle      className="w-4 h-4" />, color: 'text-red-400',    bg: 'bg-red-900/40 border-red-700' },
  na:      { label: 'Not Applicable',  icon: <HelpCircle   className="w-4 h-4" />, color: 'text-gray-400',   bg: 'bg-gray-800 border-gray-700' },
};

export default function Demo() {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [expandedControl, setExpandedControl] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, Status>>({});
  const [activeTab, setActiveTab] = useState<Record<string, Tab>>({});
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const controls = selectedFramework ? (DEMO_CONTROLS[selectedFramework] ?? []) : [];
  const fw = FRAMEWORKS.find(f => f.id === selectedFramework);

  const totalAnswered = Object.keys(responses).length;
  const score = controls.length === 0 ? 0 : Math.round(
    Object.values(responses).reduce((sum, s) => sum + (s === 'yes' ? 100 : s === 'partial' ? 50 : 0), 0) / controls.length
  );

  function handleResponse(controlId: string, status: Status) {
    setResponses(prev => {
      const next = { ...prev, [controlId]: status };
      if (Object.keys(next).length === 2) setTimeout(() => setShowSignupPrompt(true), 600);
      return next;
    });
  }

  // ── STEP 1: Framework picker ─────────────────────────────────────────────
  if (!selectedFramework) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        {/* Nav */}
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">TechRisk</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
              <Link to="/register" className="btn-primary text-sm">Create Account</Link>
            </div>
          </div>
        </nav>

        {/* Picker */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-brand-900/40 border border-brand-800/60 rounded-full px-4 py-1.5 text-xs text-brand-400 font-medium mb-4">
              <Sparkles className="w-3 h-3" /> No sign up required
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Which framework do you want to explore?
            </h1>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Pick a compliance framework and try the real assessment questionnaire — with guidance, examples, and remediation steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FRAMEWORKS.map(fw => (
              <button
                key={fw.id}
                onClick={() => { setSelectedFramework(fw.id); setResponses({}); }}
                className={clsx(
                  'text-left p-5 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.99]',
                  fw.border, fw.bg, 'hover:brightness-125'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{fw.icon}</span>
                  <span className={clsx(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    fw.id === 'soc2' ? 'bg-indigo-900/60 text-indigo-400' :
                    fw.id === 'fedramp' ? 'bg-blue-900/60 text-blue-400' :
                    fw.id === 'pci_dss' ? 'bg-green-900/60 text-green-400' :
                    fw.id === 'pci_pin' ? 'bg-yellow-900/60 text-yellow-400' :
                    'bg-purple-900/60 text-purple-400'
                  )}>
                    {fw.tag}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mb-0.5">{fw.label}</h3>
                <p className="text-xs text-gray-400 mb-3">{fw.subtitle}</p>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">{fw.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{fw.controls} controls total</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    4 in demo <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2 italic">Best for: {fw.bestFor}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-gray-600 text-xs mt-8">
            Want all 5 frameworks with full controls, findings, and AI remediation?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300">Create a free account →</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── STEP 2: Assessment questionnaire ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Demo banner */}
      {!dismissedBanner && (
        <div className="bg-brand-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-sm min-w-0">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate"><strong>Demo mode</strong> — exploring {fw?.label}. Create a free account to save and run full assessments.</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link to="/register" className="bg-white text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap hidden sm:block">
              Create Account
            </Link>
            <button onClick={() => setDismissedBanner(true)} className="text-white/70 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden lg:flex w-64 bg-gray-900 border-r border-gray-800 flex-col shrink-0">
          <div className="p-4 border-b border-gray-800">
            <button onClick={() => setSelectedFramework(null)} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-4 transition-colors">
              ← Change framework
            </button>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{fw?.icon}</span>
              <div>
                <div className="text-xs text-gray-500">{fw?.subtitle}</div>
                <div className="font-bold text-white">{fw?.label} Demo</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="text-2xl font-bold text-white">{score}%</div>
              <div className="flex-1">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${(totalAnswered / controls.length) * 100}%` }} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{totalAnswered}/{controls.length} answered</div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-3">You're seeing 4 of {fw?.controls} controls in the real assessment.</p>
              <div className="space-y-1.5">
                {controls.map(c => (
                  <div key={c.id} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className={clsx('w-2 h-2 rounded-full shrink-0',
                      responses[c.id] === 'yes' ? 'bg-green-500' :
                      responses[c.id] === 'partial' ? 'bg-yellow-500' :
                      responses[c.id] === 'no' ? 'bg-red-500' :
                      'bg-gray-700')} />
                    <span className="truncate">{c.id} — {c.title.split(' ').slice(0,3).join(' ')}…</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Link to="/register" className="btn-primary w-full text-sm flex items-center justify-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Save My Progress
              </Link>
              <button onClick={() => setSelectedFramework(null)} className="btn-secondary w-full text-sm">
                Try Another Framework
              </button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button onClick={() => setSelectedFramework(null)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
              ← {fw?.label} Demo
            </button>
            <Link to="/register" className="btn-primary text-xs">Save Progress</Link>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white">{fw?.label} — Sample Controls</h1>
              <p className="text-sm text-gray-400 mt-1">Answer these controls to see how the assessment works. Your score updates live.</p>
            </div>

            <div className="space-y-3">
              {controls.map(control => {
                const response = responses[control.id];
                const isExpanded = expandedControl === control.id;
                const tab = activeTab[control.id] ?? 'overview';

                return (
                  <div key={control.id} className={clsx(
                    'border rounded-xl overflow-hidden transition-all',
                    response === 'yes' ? 'border-green-800/60 bg-green-950/20' :
                    response === 'partial' ? 'border-yellow-800/60 bg-yellow-950/20' :
                    response === 'no' ? 'border-red-800/60 bg-red-950/20' :
                    'border-gray-800 bg-gray-900'
                  )}>
                    <div className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
                      onClick={() => setExpandedControl(isExpanded ? null : control.id)}>
                      <div className="shrink-0 mt-0.5">
                        {response ? (
                          <span className={STATUS_CONFIG[response].color}>{STATUS_CONFIG[response].icon}</span>
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs text-gray-500 font-mono">{control.id}</span>
                            <h3 className="text-sm font-medium text-white mt-0.5">{control.title}</h3>
                          </div>
                          <span className={clsx('text-xs px-2 py-0.5 rounded-full shrink-0',
                            control.severity === 'critical' ? 'badge-critical' : control.severity === 'high' ? 'badge-high' : 'badge-medium')}>
                            {control.severity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-800/60">
                        <div className="flex border-b border-gray-800/60">
                          {([['overview','Overview',<BookOpen className="w-3.5 h-3.5"/>],['how_to_fix','How to Fix',<ListChecks className="w-3.5 h-3.5"/>],['example','Example',<Lightbulb className="w-3.5 h-3.5"/>]] as const).map(([t,label,icon]) => (
                            <button key={t}
                              onClick={() => setActiveTab(prev => ({ ...prev, [control.id]: t as Tab }))}
                              className={clsx('flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px',
                                tab === t ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-300')}>
                              {icon}{label}
                            </button>
                          ))}
                        </div>
                        <div className="p-4 space-y-3">
                          {tab === 'overview' && (
                            <>
                              <p className="text-sm text-gray-300">{control.description}</p>
                              <div className="bg-gray-800/60 rounded-lg p-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Objective</p>
                                <p className="text-sm text-gray-300">{control.objective}</p>
                              </div>
                              <ul className="space-y-1">
                                {control.guidance.map((g: string, i: number) => (
                                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                    <span className="text-brand-500 mt-1 shrink-0">·</span>{g}
                                  </li>
                                ))}
                              </ul>
                              <div className="flex flex-wrap gap-2">
                                {control.evidenceExamples.map((e: string, i: number) => (
                                  <span key={i} className="text-xs bg-gray-800 border border-gray-700 rounded-full px-2.5 py-1 text-gray-400">{e}</span>
                                ))}
                              </div>
                            </>
                          )}
                          {tab === 'how_to_fix' && (
                            <div className="space-y-3">
                              {control.howToFix.map((step: any) => (
                                <div key={step.order} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3 border border-gray-800">
                                  <div className="w-6 h-6 rounded-full bg-brand-600/30 border border-brand-600/50 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0 mt-0.5">{step.order}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <p className="text-sm font-medium text-white">{step.title}</p>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className={clsx('text-xs', step.effort === 'low' ? 'text-green-400' : step.effort === 'medium' ? 'text-yellow-400' : 'text-red-400')}>{step.effort}</span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/>{step.timeframe}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-400">{step.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {tab === 'example' && (
                            <div className="space-y-4">
                              <div className="bg-green-900/20 border border-green-800/40 rounded-lg p-3 flex items-start gap-2.5">
                                <Zap className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-1">Quick Win</p>
                                  <p className="text-sm text-gray-300">{control.quickWin}</p>
                                </div>
                              </div>
                              <div className="bg-gray-800/40 border border-gray-800 rounded-lg p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <Lightbulb className="w-3 h-3 text-yellow-400" /> Real-World Example
                                </p>
                                <p className="text-sm text-gray-300 leading-relaxed">{control.scenario}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex border-t border-gray-800/60">
                      {(['yes','partial','no','na'] as Status[]).map(status => {
                        const cfg = STATUS_CONFIG[status];
                        const selected = response === status;
                        return (
                          <button key={status} onClick={() => handleResponse(control.id, status)}
                            className={clsx('flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all',
                              selected ? `${cfg.color} ${cfg.bg} border-0` : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50')}>
                            {cfg.icon}<span className="hidden sm:inline">{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 card border-brand-800/40 text-center py-8">
              <div className="w-12 h-12 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to assess your full {fw?.label} posture?</h3>
              <p className="text-gray-400 text-sm mb-5 max-w-md mx-auto">
                The real assessment has <strong className="text-white">{fw?.controls} controls</strong>, auto-generated findings, severity-prioritized remediation plans, and document upload to detect gaps from your existing policies.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" /> Create Free Account
                </Link>
                <button onClick={() => setSelectedFramework(null)} className="btn-secondary flex items-center justify-center gap-2">
                  Try Another Framework <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signup nudge */}
      {showSignupPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-brand-600/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-400" />
              </div>
              <button onClick={() => setShowSignupPrompt(false)} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">You're getting the hang of it!</h3>
            <p className="text-gray-400 text-sm mb-5">
              Create a free account to run the full {fw?.label} assessment with all {fw?.controls} controls, auto-generated findings, and step-by-step remediation plans.
            </p>
            <div className="space-y-2">
              <Link to="/register" className="btn-primary w-full flex items-center justify-center gap-2">
                Create Free Account — takes 1 minute
              </Link>
              <button onClick={() => setShowSignupPrompt(false)} className="btn-secondary w-full">
                Keep exploring the demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
