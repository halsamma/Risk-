import { ControlExample } from './soc2-controls';

export const FEDRAMP_EXAMPLES: Record<string, ControlExample> = {

  'AC-1': {
    scenario: 'GovCloud Inc. maintains an Access Control Policy (v3.2, approved by the CISO on March 1) stored in their GRC system. The policy is reviewed annually, covers all 14 AC controls, and is distributed to all staff via the onboarding checklist. Procedures are documented in a companion document with step-by-step instructions for account provisioning, least privilege enforcement, and remote access approval.',
    evidence: 'Access Control Policy document with version, approval date, and CISO signature. Annual review record. Procedures document. Staff acknowledgment records showing all personnel read the policy.',
    quickWin: 'Download the FedRAMP SSP template — it contains a pre-formatted policy structure for every control family. Fill in your organization name and get it signed by your CISO this week.',
  },

  'AC-2': {
    scenario: 'FedSaaS Corp tracks every account in their authorization boundary in a spreadsheet: username, system, account type (admin/operator/read-only), owner, date created, last login, and last reviewed. New accounts require a Jira ticket with manager + ISSO approval. When staff are terminated, HR triggers a Slack notification to IT who disables all accounts within 4 hours. Quarterly, managers certify their team\'s access is still needed.',
    evidence: 'Account inventory spreadsheet with all required fields. Jira provisioning tickets. Termination checklist showing account disable timestamps. Quarterly manager certification emails. Annual access review report.',
    quickWin: 'Open a spreadsheet right now. Columns: Username | System | Type | Owner | Created | Last Login | Justification. Populate from your IdP export. This is your account inventory — the first artifact auditors will request.',
  },

  'AC-3': {
    scenario: 'CloudGov LLC uses Okta with 4 defined roles per system: System Admin, Operator, Read-Only, and Auditor. Each role maps to specific AWS IAM policies with least privilege. A quarterly automated test verifies that a "Read-Only" account receives a 403 when attempting to write data. Access control decisions are logged in CloudTrail and reviewed in the SIEM.',
    evidence: 'RBAC configuration in Okta and IAM. Role-to-permission mapping document. Quarterly access test results showing denied access. CloudTrail logs showing enforcement.',
    quickWin: 'In AWS IAM, run the "Access Analyzer" to identify overly permissive policies. Screenshot the findings. Address any policies granting * permissions. This proves you\'re actively enforcing least-privilege access controls.',
  },

  'AC-5': {
    scenario: 'At SecureGov SaaS, no developer can also approve their own production deployments. A Separation of Duties matrix documents that the ISSO cannot also be the system owner, and that financial approvals require two separate approvers. GitHub branch protection requires 2 approvals from different team members before merging to main. The matrix is reviewed annually by the AO.',
    evidence: 'Separation of Duties matrix. GitHub branch protection configuration showing 2-reviewer requirement. Financial approval workflow showing dual approval. Annual review sign-off.',
    quickWin: 'Create a simple 5-row spreadsheet: list your 5 most sensitive functions (deploy to prod, approve access, review logs, modify firewall, create admin accounts). For each, write who CAN do it and ensure no single person can do all of them.',
  },

  'AC-6': {
    scenario: 'FedPlatform Inc. conducts quarterly privilege reviews. Each system owner reviews a report from their IdP listing all admin and privileged accounts with last-login dates. After Q1 review, 4 developer admin accounts were downgraded to operator. Admins use separate "admin@" accounts for privileged tasks and regular accounts for daily use. IAM roles follow least privilege with no wildcard permissions.',
    evidence: 'Quarterly privilege review reports with sign-off. Before/after account permission comparison. IAM policy documents showing no wildcard permissions. Privileged account list with justifications for each.',
    quickWin: 'In AWS, go to IAM → Credential Report. Export it. Identify anyone with AdministratorAccess who doesn\'t need it. Remove or scope down permissions. Screenshot before and after. This is your first privilege review.',
  },

  'AC-7': {
    scenario: 'GovApp Inc. configured all in-boundary systems with a 3-attempt lockout and 30-minute unlock delay, meeting FedRAMP\'s stricter requirement. When an account locks out, PagerDuty sends a low-priority alert to the ISSO. If an account locks out 3 times in one day, it escalates to the security team for investigation.',
    evidence: 'Lockout configuration screenshots for every in-boundary system. PagerDuty alert rule for lockout events. Test evidence showing lockout triggers at attempt 3.',
    quickWin: 'Test your lockout policy right now: create a test account and fail login 3 times. Verify it locks. Screenshot the locked state. This is your validation evidence.',
  },

  'AC-17': {
    scenario: 'CloudSecure LLC requires all production access from off-network to route through their WireGuard VPN with Okta MFA (FIDO2). Production SSH sessions are recorded using AWS Session Manager (session logging enabled, no direct SSH key access). Remote maintenance windows are approved 24 hours in advance and logged in a Jira ticket.',
    evidence: 'VPN configuration requiring MFA. Session Manager configuration showing session recording. Remote access approval tickets. Session logs from the last 90 days.',
    quickWin: 'Enable AWS Systems Manager Session Manager for all EC2 instances and disable direct SSH access. This gives you encrypted, logged remote access with no SSH keys to manage — and is a strong control evidence piece.',
  },

  'AC-22': {
    scenario: 'FedSaaS Ltd. maintains an "Authorized Content Publishers" list with 3 people cleared to publish to public channels. All public blog posts and documentation updates go through a review checklist (no PII, no internal system names, no security findings) before publishing. Training records show all publishers completed a "What Can Be Public" training module.',
    evidence: 'Authorized publishers list. Content review checklist with completion records for recent publications. Training completion records.',
    quickWin: 'Send a quick email to your team: "Before posting anything publicly about our systems — blog posts, LinkedIn, GitHub issues — get approval from [name]." BCC yourself. That email is your public content authorization evidence.',
  },

  'AT-2': {
    scenario: 'GovCloud Corp uses KnowBe4 to deliver annual security awareness training. Every new hire completes training before receiving system credentials. The curriculum covers: FedRAMP data handling requirements, phishing recognition, password hygiene, incident reporting to the ISSO, and rules of behavior. 100% completion is required before the 30-day deadline. Phishing simulations run quarterly.',
    evidence: 'KnowBe4 completion report showing 100% of users completed training with dates. Training content outline showing FedRAMP-specific topics. Phishing simulation results. New-hire training completion tracking.',
    quickWin: 'Before your first access grant, add one step to your onboarding checklist: "Complete security awareness training." Even a 30-minute video covering phishing + password policy + incident reporting satisfies this requirement if documented.',
  },

  'AT-3': {
    scenario: 'SecureFed Inc. runs role-specific training for ISSOs (FISMA requirements, POA&M management, ConMon reporting), system admins (STIG hardening, patch management, access provisioning), and developers (secure coding, OWASP Top 10, input validation). Each role-specific course is 4-6 hours annually. Completion is tracked in the LMS and linked to job assignment records.',
    evidence: 'Role-based training matrix linking roles to required courses. LMS completion records for all privileged users. Training content for each role. Annual completion attestation.',
    quickWin: 'For your ISSO (or yourself if you\'re performing that role), register for the free CISA FISMA course at niccs.cisa.gov. Complete it and save the certificate. That\'s ISSO role-based training evidence.',
  },

  'AU-2': {
    scenario: 'CloudGov Systems logs the following events across all boundary systems: authentication (success/failure), account management changes, privilege escalation, configuration changes, system startup/shutdown, and data access events. The event list was defined by the ISSO and reviewed by the 3PAO during the initial assessment. Events are reviewed annually or when the threat landscape changes.',
    evidence: 'Auditable events list with justification for each category. SIEM configuration showing enabled event types. Sample log entries for each event type. Annual review record.',
    quickWin: 'Go to AWS CloudTrail and verify it\'s enabled in all regions for your account. Enable CloudTrail log file validation. This alone covers most AU-2 requirements for AWS-hosted systems. Screenshot the configuration.',
  },

  'AU-3': {
    scenario: 'FedApp Corp standardized log format across all systems using a structured JSON schema: timestamp (ISO 8601/UTC), event_type, user_id, source_ip, destination, action, outcome (success/failure), and session_id. All logs are parsed by the SIEM using Logstash. The ISSO validated the format during the initial assessment by pulling sample logs for 10 event types.',
    evidence: 'Log schema documentation. Sample log records showing all 7 required fields. SIEM parsing configuration. ISSO validation record.',
    quickWin: 'Pull a sample log from each of your key systems (web server, database, IdP). Open each in a text editor and verify these fields exist: timestamp, user ID, event type, source IP, outcome. If any are missing, add them to your logging configuration.',
  },

  'AU-6': {
    scenario: 'GovSaaS Inc. runs Splunk SIEM with 15 correlation rules. The ISSO reviews the Splunk security dashboard every Monday morning and documents the review in a log: date, reviewee, alerts reviewed, notable findings, and disposition. Critical alerts auto-escalate to PagerDuty. Three times this year, log review identified anomalies that turned into formal incident investigations.',
    evidence: 'Splunk correlation rule configuration. Weekly review log showing consistent documentation. PagerDuty escalation rules. Incident tickets generated from log review (evidence of effectiveness).',
    quickWin: 'Set a recurring Monday morning calendar block: "Review SIEM alerts." Keep a simple log: Date | Reviewer | Alerts Reviewed | Findings. After 4 weeks, you have consistent, documented log review evidence.',
  },

  'AU-9': {
    scenario: 'CloudFed Corp stores all logs in S3 with Object Lock (compliance mode, 90-day lock). Only the ISSO and CISO have s3:DeleteObject permissions, and those permissions are audited in CloudTrail. If log delivery stops for 5 minutes, CloudWatch fires a critical alert. Logs are replicated daily to a separate AWS account (isolated log archive account) that even system admins cannot access.',
    evidence: 'S3 Object Lock configuration screenshot. IAM policy showing restricted delete permissions. CloudWatch alert for log delivery failure. Cross-account replication configuration. Access control list for log archive account.',
    quickWin: 'In the AWS S3 console, enable Object Lock on your CloudTrail log bucket with a 90-day retention lock. This takes 5 minutes and immediately protects your audit records from tampering or deletion.',
  },

  'AU-11': {
    scenario: 'LogKeeper SaaS configures CloudWatch log groups with 90-day active retention and exports to S3 with a lifecycle policy: S3 Standard (90 days) → S3 Glacier (up to 1 year). Total retention = 1 year. An AWS Config rule alerts if any log group drops below 90-day retention. The retention schedule is documented in the Log Management Plan.',
    evidence: 'CloudWatch log group retention configuration. S3 lifecycle policy screenshot. AWS Config rule for retention compliance. Log Management Plan showing 90-day/1-year schedule.',
    quickWin: 'In AWS CloudWatch, go to each log group and set retention to 90 days. For critical logs, add an S3 export lifecycle rule extending to 365 days. Screenshot both configurations. This satisfies AU-11 in under 30 minutes.',
  },

  'CA-2': {
    scenario: 'FedCloud Inc. engaged Coalfire (a FedRAMP-authorized 3PAO) for their annual assessment. The 3PAO reviewed all 325 Moderate controls, tested 60% through technical examination and interviews, and documented results in a Security Assessment Report (SAR). 23 findings were identified — 2 high, 12 moderate, 9 low. All findings were added to the POA&M with milestone dates.',
    evidence: '3PAO engagement letter. Security Assessment Plan (SAP) approved by AO. Security Assessment Report (SAR). POA&M with all SAR findings. 3PAO FedRAMP marketplace listing.',
    quickWin: 'Visit marketplace.fedramp.gov and search "3PAO" to find authorized assessors. Request quotes from 3 assessors. Getting quotes and documenting your 3PAO selection process is the first step toward CA-2 compliance.',
  },

  'CA-5': {
    scenario: 'GovApp LLC maintains their POA&M in the FedRAMP-provided Excel template. The ISSO updates it the first Monday of every month: adds new findings from vuln scans, updates milestone dates, and marks remediated items as closed with evidence links. The AO reviews the POA&M monthly and signs off. Currently 8 open items: 0 critical, 2 high (on track for 90-day remediation), 6 moderate.',
    evidence: 'POA&M spreadsheet (FedRAMP template) with all required columns. Monthly update records showing consistent updates. AO sign-off on most recent review. Closed items with remediation evidence linked.',
    quickWin: 'Download the FedRAMP POA&M template from fedramp.gov/resources/templates. Populate it with your 5 most significant security findings. Get your ISSO to review and your AO to approve. That\'s a compliant starting POA&M.',
  },

  'CA-7': {
    scenario: 'SecureGov Corp\'s ConMon program runs monthly authenticated vulnerability scans on all in-boundary components, generates a ConMon report using the FedRAMP monthly reporting template, and submits it to their sponsoring agency AO by the 15th of each month. The report includes: vuln scan results, open/closed POA&M items, patching metrics, and any significant changes or incidents.',
    evidence: 'ConMon strategy document. Monthly scan reports for last 6 months. Monthly ConMon reports submitted to AO. AO acknowledgment records. Patching SLA compliance metrics.',
    quickWin: 'Download the FedRAMP ConMon Monthly Executive Summary template from fedramp.gov. Fill it in with your current security posture metrics (vuln counts by severity, patching rates, open POA&M items). Send to your AO. That\'s your first ConMon submission.',
  },

  'CM-2': {
    scenario: 'CloudGov Inc. maintains baseline configuration documents for: RHEL 9 (CIS Level 1 hardening), Nginx (Mozilla Intermediate TLS configuration), PostgreSQL 15 (CIS Level 1), and Kubernetes 1.28 (NSA hardening guide). Each document lists all settings, acceptable values, and deviations with justification. AWS Config continuously checks for drift and alerts the ISSO.',
    evidence: 'Baseline configuration documents per component type. CIS Benchmark scan results showing compliance percentage. AWS Config rules for configuration drift detection. Annual baseline review records.',
    quickWin: 'Download the CIS Benchmark for your operating system (free at cisecurity.org). Run the CIS-CAT Lite scanner (free) against one server. The report shows your current baseline compliance score and is valid auditable evidence.',
  },

  'CM-6': {
    scenario: 'FedSaaS LLC runs DISA STIG scans monthly using Tenable.sc. The ISSO reviews findings, remediates all CAT I (critical) findings within 30 days, and creates POA&M items for accepted deviations. Two STIG exceptions are documented: one RHEL setting incompatible with the application stack (approved by AO), and one network setting with a compensating control.',
    evidence: 'Monthly STIG/SCAP scan reports. POA&M items for open STIG findings. AO-approved deviation documentation with compensating controls. Remediation evidence for closed findings.',
    quickWin: 'Download OpenSCAP (free) and run a STIG scan against your primary server. Even a single scan report with a remediation plan for the top 5 findings demonstrates a configuration management program.',
  },

  'CM-7': {
    scenario: 'GovCloud Corp maintains a "Ports, Protocols, and Services" document in their SSP listing exactly what is allowed on each boundary interface. A monthly Nessus scan verifies no unexpected ports are open. All applications run with only required OS packages installed — they use minimal Docker base images. Software installation on production servers requires ISSO approval via change ticket.',
    evidence: 'Approved Ports/Protocols/Services document (PPS) in SSP. Monthly port scan results. Docker base image policy showing minimal images. Software installation approval workflow.',
    quickWin: 'Run nmap against your primary production server from an external IP: `nmap -sV [your-ip]`. Screenshot the output. Compare against your expected services list. If unexpected ports appear, document them or close them. This is your baseline PPS compliance check.',
  },

  'CM-8': {
    scenario: 'FedPlatform Inc. uses AWS Config + ServiceNow as their CMDB. Every EC2 instance, RDS database, S3 bucket, and Lambda function is automatically discovered and inventoried. Each component has: instance ID, type, OS version, software installed, data classification, and owner. The ISSO reconciles the CMDB against actual AWS inventory weekly using AWS Config drift detection.',
    evidence: 'CMDB or asset inventory with all required fields. AWS Config rules showing continuous discovery. Weekly reconciliation records. Last inventory date and reviewer signature.',
    quickWin: 'In the AWS console, go to AWS Systems Manager → Fleet Manager. It automatically inventories all EC2 instances with OS details and installed software. Screenshot the inventory report. That\'s a compliant system component inventory.',
  },

  'CP-2': {
    scenario: 'FedSaaS Ltd. completed their Contingency Plan using the FedRAMP template. RTO = 4 hours, RPO = 1 hour for Tier-1 services. The plan defines: primary/alternate processing sites (AWS us-east-1 / us-west-2), backup procedures, recovery steps, and team contact trees. The plan was approved by the AO and tested with a successful restore drill in Q1.',
    evidence: 'Contingency Plan document (FedRAMP template, all sections complete). RTO/RPO definition. AO approval. Annual review record. Test results showing recovery within RTO.',
    quickWin: 'Download the FedRAMP Contingency Plan template from fedramp.gov/resources/templates. Fill in sections 1-3: System Name, Purpose, and Activation Criteria. Define your RTO and RPO. Get the ISSO to review. That\'s a compliant starting CP.',
  },

  'CP-4': {
    scenario: 'CloudGov Corp ran their annual CP test in February. The scenario: "Primary database unavailable due to AZ failure." The team followed the CP step-by-step: activated the plan at 9:00 AM, failed over to the alternate region by 9:47 AM (within 1-hour RTO), verified data integrity, and declared recovery at 10:15 AM. The after-action report identified 2 gaps: an outdated IP address in the contact tree and a missing recovery step for the queue service.',
    evidence: 'CP test report with scenario, timeline, recovery time vs RTO, participants, and findings. After-action report. Updated CP showing corrections based on test findings.',
    quickWin: 'Schedule a 2-hour tabletop exercise: walk your team through the CP using a hypothetical scenario ("your primary database is down"). Document who attended, what steps were followed, and what gaps were identified. Write a 1-page after-action report.',
  },

  'CP-9': {
    scenario: 'FedData Corp uses AWS Backup to take daily database snapshots with 35-day retention. Backups are replicated to us-west-2 (separate region). An automated Lambda runs weekly to restore a random snapshot to a test environment and verify row counts match. Restore results are logged to S3 with the restore time and data validation checksum. All backup data is encrypted with a CMK.',
    evidence: 'AWS Backup configuration screenshots. Cross-region replication configuration. Weekly automated restore test logs. Data validation results. CMK encryption configuration.',
    quickWin: 'In AWS RDS, open your production database → Maintenance & backups. Verify automated backups are ON with 7-day minimum retention. Screenshot it. Then restore the latest snapshot to a test instance and note the restore time. Two screenshots = CP-9 evidence.',
  },

  'IA-2': {
    scenario: 'FedCloud Corp enforces MFA for 100% of users through Okta with FIDO2 WebAuthn hardware keys for privileged users and TOTP (Okta Verify) for standard users. An Okta authentication policy blocks any login attempt without a second factor. AWS console access goes through Okta SSO — no direct IAM user console access exists. Service accounts use IAM roles, never passwords. Monthly report confirms 0 accounts without MFA enrolled.',
    evidence: 'Okta authentication policy screenshot showing MFA required. Monthly MFA coverage report showing 100%. AWS IAM configuration showing no console passwords for service accounts. FIDO2 hardware key inventory for privileged users.',
    quickWin: 'In Okta, go to Security → Authentication Policies → Add rule: "Users in group All Users must authenticate with MFA on every sign-in." This single policy change enforces MFA across all Okta-connected apps immediately.',
  },

  'IA-4': {
    scenario: 'GovSaaS Inc. configured Okta to automatically suspend accounts with no login in 35 days (FedRAMP-required threshold, stricter than NIST\'s 90 days). A weekly Okta report identifies accounts approaching the 35-day threshold and notifies managers to confirm if the user is still active. Service account identifiers are never reused even after decommissioning.',
    evidence: 'Okta session policy showing 35-day inactivity suspension. Weekly dormant account report. Account reuse prevention documentation. Suspended account log showing consistent enforcement.',
    quickWin: 'In Okta Admin: Security → Authentication Policies → add a "Deactivate after 35 days of inactivity" rule. This is a single configuration change that immediately brings you into FedRAMP IA-4 compliance.',
  },

  'IA-5': {
    scenario: 'FedApp Corp enforces passwords of minimum 12 characters with complexity (Okta policy). Temporary passwords expire in 24 hours and must be changed on first use. Service accounts use IAM roles (no passwords) or 1Password-managed secrets with automatic 90-day rotation. All cryptographic operations use FIPS 140-2 validated modules — AWS Certificate Manager and AWS KMS are both FIPS-validated.',
    evidence: 'Okta password policy screenshot. AWS KMS FIPS 140-2 certificate. Service account rotation configuration. FIPS validation certificate for all cryptographic modules. Temporary password expiry configuration.',
    quickWin: 'In Okta, go to Security → Password Policies. Set minimum length to 12, require uppercase + number + special character, and set temporary password expiry to 24 hours. Screenshot the policy. IA-5 password requirements satisfied.',
  },

  'IR-4': {
    scenario: 'When GovSaaS Corp detected unusual API calls in their SIEM, the on-call ISSO followed the IRP: isolated the affected service at T+8min, notified the agency CISO at T+15min, submitted US-CERT report at T+52min (within 1-hour requirement), and notified FedRAMP PMO at T+2hr. The full incident was documented in a Jira ticket with timestamps for every action. Post-incident review completed within 5 days.',
    evidence: 'Incident ticket with timestamps for detection, containment, notifications. US-CERT report submission confirmation. Agency CISO notification record. FedRAMP PMO notification. Post-incident review report.',
    quickWin: 'Add a "US-CERT Notification" step to your IRP right now: "Within 1 hour of confirmed incident: go to us-cert.cisa.gov/forms/report and complete the incident report. Save the submission confirmation number." This single addition satisfies IR-6 and IR-4 together.',
  },

  'IR-6': {
    scenario: 'CloudFed Inc. registered on CISA\'s reporting portal and documented the process in their IRP. During their last two incidents, they submitted US-CERT reports within 45 minutes and 52 minutes respectively. The ISSO maintains a laminated quick-reference card on their desk: "1. Call agency CISO: [number]. 2. Submit US-CERT form: [URL]. 3. Notify FedRAMP PMO: [email]."',
    evidence: 'US-CERT portal registration confirmation. Incident report submission confirmations from last 2 incidents. IRP documentation showing notification procedure. Time-stamped notification records.',
    quickWin: 'Visit us-cert.cisa.gov and register your organization for an account. Take a screenshot of the completed registration. Add the reporting URL to your IRP. That\'s your IR-6 setup — complete in 15 minutes.',
  },

  'MA-2': {
    scenario: 'FedSystems Corp logs every maintenance activity in ServiceNow: ticket includes the system, maintenance type, scheduled window, technician name, changes made, and post-maintenance security check result. Before maintenance, the ISSO approves the maintenance window. After maintenance, the technician documents what was changed and runs a quick configuration check to verify the baseline wasn\'t altered.',
    evidence: 'ServiceNow maintenance ticket template. Last 6 months of maintenance logs. Pre-approval records. Post-maintenance security check results.',
    quickWin: 'Create a Google Form titled "Maintenance Log." Fields: Date, System, Technician, Work Performed, Configuration Changed (Y/N), Post-Check Performed (Y/N). Fill it in after every maintenance activity. That\'s a compliant maintenance log.',
  },

  'MP-6': {
    scenario: 'SecureData Gov uses an NSA/CSS-certified ITAD vendor for all hardware disposal. Before pickup, drives are encrypted with BitLocker/FileVault (they were encrypted from day one, so the data is unrecoverable after key deletion). The ITAD vendor provides a certificate of destruction for every device. All certificates are stored in an S3 bucket tagged "compliance-artifacts."',
    evidence: 'ITAD vendor contract and NSA/CSS certification. Media sanitization policy referencing NIST 800-88. Certificate of destruction for each device. Drive encryption evidence (showing data was encrypted pre-disposal).',
    quickWin: 'For any device decommissioned: (1) Enable BitLocker/FileVault if not already. (2) Use the OS\'s secure erase function or delete the encryption key. (3) Request an ITAD certificate. Store the certificate in your evidence folder. Three steps, fully NIST 800-88 compliant.',
  },

  'PE-3': {
    scenario: 'FedApp LLC runs in AWS GovCloud. They obtained the AWS GovCloud SOC 2 Type II report and FedRAMP authorization documentation from AWS Artifact. These documents evidence AWS\'s physical access controls (badge readers, CCTV, man-traps, security guards) and inherit them. The SSP documents this inheritance: "PE-3 is inherited from AWS GovCloud (FedRAMP High P-ATO)."',
    evidence: 'AWS GovCloud SOC 2 Type II report. AWS FedRAMP P-ATO documentation from fedramp.gov. SSP documenting PE control inheritance from AWS. Customer Responsibility Matrix showing which PE controls are inherited.',
    quickWin: 'Go to AWS Artifact in your console. Download the AWS GovCloud SOC 2 report and the FedRAMP authorization package. These two documents cover almost all PE controls for cloud-hosted systems. This is the fastest path to PE compliance for any SaaS company.',
  },

  'PL-2': {
    scenario: 'CloudGov Corp spent 4 months completing their SSP using the FedRAMP Moderate template. All 325 controls are documented with: implementation status (implemented, planned, alternative, not applicable), responsible entity (customer/provider/shared), implementation description, and evidence links. The SSP is 400 pages. The ISSO updates it within 30 days of any significant system change.',
    evidence: 'Completed FedRAMP SSP (all 17 chapters). AO approval letter. Change history log. Annual review record. 30-day update evidence for recent system changes.',
    quickWin: 'Download the FedRAMP Moderate SSP template from fedramp.gov/resources/templates. Start with the easiest sections: (1) System Overview, (2) System Environment, (3) Leveraged FedRAMP Authorizations (list your AWS/Azure usage). Getting these 3 sections done moves you significantly closer to a complete SSP.',
  },

  'PL-4': {
    scenario: 'FedSaaS Inc. created a "Rules of Behavior" document that all users must sign before receiving credentials. The document covers: acceptable use of the system, password requirements, prohibition on sharing credentials, requirement to report security incidents within 1 hour, data handling requirements, and consequences for violations. New hires sign digitally via DocuSign. Annual re-acknowledgment is required every January.',
    evidence: 'Rules of Behavior document with current version date. DocuSign records showing all users signed before access was granted. Annual re-acknowledgment completion records.',
    quickWin: 'Write a 1-page "Rules of Behavior" document: 5-7 bullet points covering acceptable use, password policy, incident reporting, and data handling. Send via DocuSign to all users with system access. This takes 2 hours and satisfies PL-4.',
  },

  'RA-2': {
    scenario: 'GovCloud LLC completed their FIPS 199 categorization. Confidentiality: Moderate (financial data could cause significant harm if disclosed). Integrity: High (inaccurate financial data could cause severe harm). Availability: Moderate (brief outage is disruptive but not catastrophic). Overall: HIGH (takes the highest of the three). The AO reviewed and approved the HIGH categorization.',
    evidence: 'Completed FIPS 199 worksheet with ratings for C, I, A. NIST 800-60 information type mapping. AO approval letter for categorization. Impact analysis documentation supporting each rating.',
    quickWin: 'Download the FIPS 199 template from csrc.nist.gov. Fill in Table 1: for each information type your system handles, rate the potential impact if confidentiality, integrity, or availability is compromised (Low/Moderate/High). Takes 2-3 hours with your system owner.',
  },

  'RA-3': {
    scenario: 'SecureFed Corp conducts annual risk assessments using NIST 800-30. The ISSO facilitated 4-hour workshops with system owners. Output: a risk register with 28 risks, each rated for likelihood (1-5) and impact (1-5). Top 5 risks were presented to the AO. 8 risks resulted in new POA&M items. The risk assessment was peer-reviewed by the 3PAO during the annual CA-2 assessment.',
    evidence: 'Risk assessment report using NIST 800-30 methodology. Risk register with all 28 risks. POA&M items linked to risk findings. 3PAO peer review notes. AO briefing record.',
    quickWin: 'Hold a 2-hour risk identification session with your system owner and ISSO. Use this prompt: "What are the 10 most likely things that could go wrong with this system?" For each, rate likelihood 1-3 and impact 1-3. Multiply for a risk score. That\'s a compliant RA-3 output.',
  },

  'RA-5': {
    scenario: 'FedCloud Inc. runs Tenable.io authenticated scans monthly against all in-boundary EC2 instances, RDS databases, and containers. Web application scans run monthly using Tenable.io WAS. Results auto-populate their FedRAMP POA&M via the Tenable-Jira integration. This month\'s scan: 0 critical, 3 high (all on track for 90-day remediation), 12 moderate, 24 low.',
    evidence: 'Monthly scan reports for last 12 months. Authenticated scan configuration. POA&M showing all vuln findings with milestone dates. Remediation evidence for closed items. Scan tool FedRAMP authorization (Tenable is FedRAMP authorized).',
    quickWin: 'Enable AWS Inspector v2 in your account — it\'s one click and immediately starts scanning EC2, Lambda, and container images monthly. Export the first report. That\'s your baseline vulnerability scan for RA-5. Free for 15 days, then ~$0.11/instance/month.',
  },

  'SA-3': {
    scenario: 'GovApp Corp defined their SDLC with 4 security gates: (1) Threat model review at architecture phase, (2) SAST scan passing in CI/CD before merge, (3) DAST scan before production release, (4) Security sign-off from ISSO before major releases. The SDLC policy is documented in Confluence. SAST uses Semgrep (configured with FedRAMP-relevant rulesets), and DAST uses OWASP ZAP.',
    evidence: 'SDLC policy document with security gate descriptions. Semgrep CI/CD integration screenshots. DAST scan reports before last 3 releases. ISSO sign-off records for major releases. Threat model documents for key features.',
    quickWin: 'Add Semgrep to your GitHub Actions workflow: `- uses: semgrep/semgrep-action@v1`. It runs on every PR and flags security issues. Screenshot a PR with Semgrep results. That\'s your first SDLC security gate.',
  },

  'SA-11': {
    scenario: 'SecureCode Corp runs Checkmarx SAST in their CI/CD pipeline, blocking releases with critical or high findings. A pre-release DAST scan using OWASP ZAP runs in a staging environment monthly. An annual penetration test is conducted by Coalfire (3PAO). The last pentest found 1 high finding (now remediated) and 3 mediums (in POA&M with 180-day milestones). Evidence is maintained in a SharePoint folder.',
    evidence: 'Checkmarx CI/CD integration and scan results. OWASP ZAP DAST reports. Annual penetration test report from 3PAO. Remediation evidence for pentest findings.',
    quickWin: 'Run a free OWASP ZAP scan against your staging environment right now. ZAP is free and available at zaproxy.org. Export the HTML report. That\'s your first DAST scan result — auditors love seeing even a basic scan with a documented follow-up plan.',
  },

  'SC-5': {
    scenario: 'FedSaaS Corp uses AWS Shield Standard (automatically applied) plus Cloudflare (DDoS mitigation, rate limiting) in front of all public APIs. Rate limits: 100 requests/minute per IP for standard endpoints, 10 requests/minute for auth endpoints. During a recent DDoS attempt, Cloudflare blocked 48,000 malicious requests over 3 hours with no user impact.',
    evidence: 'AWS Shield Standard enablement (automatic). Cloudflare configuration showing DDoS rules and rate limits. Incident record showing DDoS mitigation in action. Rate limiting configuration per endpoint type.',
    quickWin: 'Go to AWS → Shield → Enable AWS Shield Standard. It\'s free and automatic for all AWS resources. Screenshot the "Shield Standard: Active" status. That\'s your DoS protection control evidence.',
  },

  'SC-7': {
    scenario: 'CloudGov Inc. defined their authorization boundary in their SSP network diagram. The boundary includes 3 VPCs: Production, Management, and Development (development has no access to production). AWS Security Groups follow default-deny with explicit allow for only HTTPS (443), VPN (500/4500), and management (SSH via SSM only). Monthly firewall rule reviews are documented in Confluence.',
    evidence: 'SSP network/boundary diagram. AWS Security Group rule exports showing default-deny. VPC flow logs showing only authorized traffic. Monthly rule review records. Architecture diagram in SSP.',
    quickWin: 'Export your AWS Security Group rules for all production instances using AWS CLI: `aws ec2 describe-security-groups`. Screenshot each group showing the rules. Verify no "all traffic" inbound rules exist. This is your boundary protection documentation.',
  },

  'SC-8': {
    scenario: 'FedApp Corp uses AWS Certificate Manager (ACM) for all TLS certificates with FIPS 140-2 validated cipher suites. SSLLabs.com scan shows A+ rating with TLS 1.2 and 1.3 only, HSTS enabled (max-age=31536000), and FIPS-approved cipher suites. Legacy TLS 1.0/1.1 is disabled at the load balancer level. Internal service communication also uses mutual TLS (mTLS).',
    evidence: 'SSLLabs.com scan report showing A+ rating. ACM configuration. Load balancer HTTPS listener configuration showing TLS policy. HSTS header verification. FIPS-mode configuration for application runtimes.',
    quickWin: 'Go to ssllabs.com/ssltest and run a scan on your main production domain. Screenshot the result. If you get B or lower, the most common fix is enabling TLS 1.3 and disabling legacy protocols in your load balancer — a 5-minute configuration change.',
  },

  'SC-13': {
    scenario: 'GovCloud Corp uses AWS GovCloud us-east-1, which operates in FIPS 140-2 mode by default. All API calls use FIPS endpoints (e.g., s3-fips.us-east-1.amazonaws.com). The application uses Java 17 with the Bouncy Castle FIPS provider. Database connections use FIPS-validated TLS. A cryptographic inventory in the SSP lists every cryptographic operation and its FIPS 140-2 certificate.',
    evidence: 'FIPS endpoint configuration in application config files. Bouncy Castle FIPS certificate. AWS GovCloud FIPS compliance documentation. Cryptographic inventory in SSP. Application runtime FIPS-mode verification.',
    quickWin: 'Switch your AWS API calls to use FIPS endpoints: change s3.amazonaws.com to s3-fips.us-east-1.amazonaws.com and similarly for other services. AWS FIPS endpoints are automatically FIPS 140-2 compliant. Test one endpoint today and document the change.',
  },

  'SC-28': {
    scenario: 'FedData Corp encrypts all data at rest: RDS uses AES-256 with CMK (AWS KMS), EBS volumes use AES-256, S3 buckets use SSE-KMS, and ElastiCache uses in-transit and at-rest encryption. CMKs are rotated annually (automatic rotation enabled). KMS access policies restrict decryption to only the application IAM role. A CMK usage report is reviewed quarterly.',
    evidence: 'RDS encryption configuration. EBS encryption default policy (encrypting new volumes by default). S3 default encryption configuration. KMS key rotation enabled screenshot. CMK usage report.',
    quickWin: 'In AWS: go to EC2 → EBS → Settings → Enable "Always encrypt new EBS volumes." Go to S3 → each bucket → Properties → Default encryption → Enable SSE-KMS. These two settings take 10 minutes and encrypt all new data at rest.',
  },

  'SI-2': {
    scenario: 'GovSaaS Corp uses AWS Systems Manager Patch Manager with a maintenance window every Tuesday 2-4 AM UTC. Critical patches deploy automatically; high patches require ISSO review before deployment. Patch compliance dashboard shows 99.2% of instances patched within SLA. Critical patches this quarter: average 12 days to patch (within 30-day FedRAMP SLA). All open vulns are in POA&M with milestone dates.',
    evidence: 'Patch Manager configuration and maintenance window. Monthly patch compliance dashboard export. POA&M items for open vulnerabilities. Patch timeline vs FedRAMP SLAs (Critical ≤ 30 days, High ≤ 90 days).',
    quickWin: 'Enable AWS Systems Manager Patch Manager for all EC2 instances. Create a patch baseline with "Critical" patches set to auto-approve after 0 days. Screenshot the configuration. This gives you automated patching that meets the FedRAMP 30-day critical patch SLA.',
  },

  'SI-3': {
    scenario: 'CloudFed Inc. deploys CrowdStrike Falcon (FedRAMP Authorized) on all EC2 instances and developer laptops. CrowdStrike is configured to auto-update threat intelligence feeds every 4 hours. The CrowdStrike dashboard shows 100% coverage across 247 endpoints. Three threats were detected and automatically quarantined this month. The ISSO receives a weekly threat summary report.',
    evidence: 'CrowdStrike FedRAMP authorization documentation. Coverage report showing 100% enrollment. Auto-update configuration. Threat detection/quarantine log. ISSO weekly report.',
    quickWin: 'Deploy Microsoft Defender for Cloud (formerly Security Center) — it\'s built into Azure or available for AWS. Enable "Enhanced security features." It covers malware protection, file integrity monitoring, and vulnerability assessment in one platform with a FedRAMP-authorized option.',
  },

  'SI-4': {
    scenario: 'SecureGov Corp runs a Splunk SIEM ingesting logs from all 47 in-boundary components. 23 correlation rules generate alerts for: consecutive failed logins, privilege escalation, off-hours access, data exfiltration indicators, and configuration changes. The on-call ISSO receives PagerDuty alerts within 5 minutes of trigger. All alerts are investigated and documented within 1 business day.',
    evidence: 'Splunk ingestion source list showing all boundary components. Correlation rule configuration (23 rules). PagerDuty alert integration. Alert investigation log showing consistent same-day review. SIEM architecture diagram.',
    quickWin: 'Enable AWS Security Hub (FedRAMP authorized) in your account. It aggregates findings from GuardDuty, Inspector, and Config into a single dashboard with built-in compliance checks. Enable it in 5 minutes, get findings immediately. Screenshot the Security Hub dashboard.',
  },

  'SI-7': {
    scenario: 'FedApp Corp uses AWS Config with managed rules including "cloudtrail-enabled," "s3-bucket-public-read-prohibited," and custom rules checking for configuration drift. Additionally, AIDE (Advanced Intrusion Detection Environment) runs on all Linux servers and alerts on file changes to /etc, /bin, and /sbin. All changes require a corresponding change ticket — unauthorized changes trigger a P2 incident.',
    evidence: 'AWS Config rule configuration and compliance status. AIDE configuration and scan schedule. File integrity alert log. Change ticket records linked to authorized changes. Unauthorized change investigation records.',
    quickWin: 'Enable AWS Config in your account and enable the "required-tags" and "cloudtrail-enabled" managed rules. AWS Config also tracks configuration changes over time — turning this on creates a continuous file/config integrity monitoring record for your entire AWS environment.',
  },

  'PS-3': {
    scenario: 'GovCloud Corp requires all personnel with system access to complete a minimum Tier 1 background investigation (NACI) before receiving credentials. The HR system has a checkbox "Background Check Completed" that must be checked before the provisioning ticket can be approved in Jira. Results are stored in a secure HR folder. Privileged users require a Tier 2 (NACLC) investigation.',
    evidence: 'Personnel screening policy. Completed background check records for all current users (redacted copies acceptable for audit). Jira provisioning workflow showing background check dependency. Tier mapping per role.',
    quickWin: 'As a starting point: document your current screening process. Even basic commercial background checks (through companies like HireRight or Checkr) can satisfy PS-3 initially, with a plan to escalate to NACI for anyone handling CUI. Document the policy and get it approved.',
  },

  'PS-4': {
    scenario: 'When FedSaaS Corp terminates an employee, HR immediately triggers an automated Workday → Okta deactivation webhook. The account is suspended within 15 minutes of the termination record being created. A Jira offboarding ticket is auto-created listing 12 system-specific deactivation steps. The ISSO reviews the ticket for completeness within 1 business day. All accounts confirmed disabled within 4 hours of termination.',
    evidence: 'Workday-Okta integration configuration. Termination ticket with timestamp showing 15-minute deactivation. Last 6 months of termination records showing time-to-deactivation. ISSO review sign-off on each offboarding ticket.',
    quickWin: 'Document the current time from "termination decision" to "account disabled" for your last 3 terminations. If it exceeds 1 business day, create a checklist and assign a single owner (ISSO) to verify within 4 hours. That improvement plan + the measurement satisfies PS-4 for Type 1.',
  },

  'PT-1': {
    scenario: 'GovData Corp completed a Privacy Impact Assessment (PIA) for their system as part of the FedRAMP authorization process. The PIA documents: what PII is collected (names, emails, agency affiliations), legal authority (5 USC 301), purpose and use, sharing, retention, and security controls. The PIA was reviewed by the agency Privacy Officer and is updated annually or when system changes affect PII handling.',
    evidence: 'Completed Privacy Impact Assessment (PIA). Agency Privacy Officer review and approval. Annual update records. Notice to users about PII collection.',
    quickWin: 'Download the DHS PIA template (free, widely used for FedRAMP). Fill in Section 1 (system overview) and Section 2 (what PII you collect and why). Getting these two sections done and reviewed by your legal/privacy lead satisfies PT-1 as a starting point.',
  },

  'SR-2': {
    scenario: 'CloudGov Inc. developed a Supply Chain Risk Management Plan covering their 45 suppliers. The plan defines: supplier criticality tiers (Tier 1: FedRAMP authorization required, Tier 2: SOC 2 Type II, Tier 3: self-attestation), supplier onboarding vetting process, and how to handle supplier compromise events. AWS, Okta, and Cloudflare are all FedRAMP authorized (Tier 1). The plan is reviewed annually.',
    evidence: 'Supply Chain Risk Management Plan. Supplier tier classification matrix. FedRAMP authorization evidence for Tier 1 suppliers. Annual review record.',
    quickWin: 'Create a 3-tier supplier classification: Tier 1 (processes federal data — must be FedRAMP authorized), Tier 2 (has system access — must have SOC 2), Tier 3 (no data/system access — self-attestation). Classify your top 10 suppliers. That\'s a compliant starting SCRM plan.',
  },

  'SR-6': {
    scenario: 'FedPlatform Corp conducts annual supplier security reviews for all Tier 1 and Tier 2 suppliers. Reviews include: obtaining current SOC 2 or FedRAMP reports, reviewing the reports for any findings affecting the federal system, and documenting the review outcome. This year\'s review of 8 Tier 1 suppliers found 1 with a medium finding in their SOC 2 report — a compensating control was documented.',
    evidence: 'Annual supplier review schedule. Current SOC 2/FedRAMP reports for all Tier 1/2 suppliers. Review completion records. Compensating control documentation for supplier findings.',
    quickWin: 'Email your 5 most critical SaaS vendors: "Could you share your most recent SOC 2 Type II report or FedRAMP authorization documentation?" Most will respond within a few days. Storing these reports is your SR-6 evidence.',
  },
};
