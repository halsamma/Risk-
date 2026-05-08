/**
 * Concrete real-world examples for each SOC 2 control.
 * Each entry shows what "implemented" looks like in practice — what you'd find
 * in a company that satisfies the control and what evidence they'd have.
 */
export const CONTROL_EXAMPLES: Record<string, { scenario: string; evidence: string; quickWin: string }> = {

  // ── CC1 ──────────────────────────────────────────────────────────────────
  'CC1.1': {
    scenario: 'Acme SaaS requires every employee to read and sign a Code of Conduct on their first day and again every January. The policy covers conflicts of interest, data handling, and how to report concerns. An anonymous ethics hotline (Ethena or EthicsPoint) is shared in the employee handbook, and the CEO sends a company-wide email each year reinforcing the values.',
    evidence: 'Signed acknowledgment PDFs in the HR system (BambooHR / Rippling), dated ethics training completion certificates, email thread from leadership, and a URL to the live ethics reporting portal.',
    quickWin: 'Use Google Forms or DocuSign to collect signed acknowledgments from all current employees this week. It takes about 2 hours to set up and is immediately auditable.',
  },

  'CC1.2': {
    scenario: 'CloudStack AI\'s board holds a quarterly Security & Risk Committee meeting where the CISO presents a risk dashboard covering open findings, patch SLAs, and vendor risk scores. Meeting minutes are stored in Confluence and reference specific control gaps discussed. The board charter explicitly names "information security oversight" as a board responsibility.',
    evidence: 'Board charter with security language, meeting minutes (at least 4 per year), CISO risk report template, and a risk dashboard screenshot from the most recent meeting.',
    quickWin: 'Draft a one-page "Security Risk Summary" slide for your next all-hands or leadership meeting. Presenting it and keeping the recording or notes gives you evidence of leadership oversight immediately.',
  },

  'CC1.3': {
    scenario: 'DataFlowInc maintains an org chart in BambooHR with a named Security Lead (even if part-time) who owns the information security program. Job descriptions for engineering, DevOps, and IT roles include a "Security Responsibilities" section. A RACI matrix in Confluence maps each SOC 2 control to an owner.',
    evidence: 'Published org chart with security role highlighted, job descriptions with security responsibilities, RACI matrix linking controls to named owners.',
    quickWin: 'Add one line — "Responsible for following the company\'s information security policies" — to every job description in your ATS. This takes under an hour and satisfies the accountability requirement.',
  },

  'CC1.4': {
    scenario: 'Startup Corp runs annual security awareness training through KnowBe4. All employees complete a 45-minute module on phishing, password hygiene, and data handling. Developers additionally complete a 2-hour OWASP secure coding course. Completion is tracked in the LMS, and employees who don\'t finish within 30 days receive automated reminders.',
    evidence: 'LMS completion report showing 100% staff completion with dates, training curriculum outline, phishing simulation click-rate report (before/after), developer course certificates.',
    quickWin: 'Free tools like Google\'s Phishing Quiz or CISA\'s free awareness content can be assigned via a Google Form with a completion tracker — enough for SOC 2 Type 1 if done now and documented.',
  },

  'CC1.5': {
    scenario: 'At PlatformOne, the Q4 performance review template includes a section on security: "Did the employee follow the security policies? Did they complete training? Were there any policy violations?" Managers score each report. HR\'s disciplinary policy explicitly lists "sharing credentials" and "unauthorized data access" as terminable offenses.',
    evidence: 'Performance review template with security section, disciplinary policy document referencing security violations, HR records showing a policy acknowledgment by all staff.',
    quickWin: 'Add two questions to your next performance review template: (1) "Completed security training?" and (2) "Any security policy violations this period?" That\'s enough to satisfy this control.',
  },

  // ── CC2 ──────────────────────────────────────────────────────────────────
  'CC2.1': {
    scenario: 'TechNova maintains an asset inventory in Notion (or a spreadsheet) listing every production system, SaaS tool, and data store. Each asset has a data classification label (Public / Internal / Confidential / Restricted), an owner, and a last-reviewed date. A monthly Slack reminder prompts the owner to confirm nothing changed.',
    evidence: 'Asset inventory spreadsheet or Notion database with classification, owner, and review date columns. Exported PDF for auditors.',
    quickWin: 'Open a Google Sheet right now. Columns: Asset Name, Type (SaaS/Cloud/Endpoint), Data Classification, Owner, Last Reviewed. List your top 20 systems in 30 minutes. That\'s a compliant starting inventory.',
  },

  'CC2.2': {
    scenario: 'MeshCloud stores all security policies in a Confluence space called "Security Policies." On each new hire\'s first day, their onboarding Jira ticket includes a task: "Read and acknowledge all security policies." A quarterly Slack message from the Security Lead links to the policy space and asks staff to review changes.',
    evidence: 'Confluence (or Google Drive) policy folder with version history, onboarding checklist in HRIS showing "Policy Review" task, email/Slack archive of quarterly communications.',
    quickWin: 'Create a "Security" folder in Google Drive, drop your policies in, and share it company-wide with view permissions. Put the link in your onboarding checklist. Done in under an hour.',
  },

  'CC2.3': {
    scenario: 'SaaSify has a public security page at security.saasify.com listing their controls, certifications, and contact for security inquiries. Their privacy policy links to a breach notification procedure that promises to notify affected customers within 72 hours of confirming a breach. Vendor contracts include a mutual breach notification clause.',
    evidence: 'URL to security/trust page, breach notification procedure document with timelines, contract template with notification clauses, and a sample customer-facing security email template.',
    quickWin: 'Create a one-page "Security" section on your website or in your docs. List: who is responsible for security, what certifications you\'re pursuing, and a security@yourcompany.com contact. Publish it today.',
  },

  // ── CC3 ──────────────────────────────────────────────────────────────────
  'CC3.1': {
    scenario: 'BuildFast\'s CISO drafted a one-page "Security Objectives" document approved by the CEO: (1) No critical unpatched vulnerabilities older than 7 days. (2) 99.9% uptime for production systems. (3) 100% MFA adoption by Q2. (4) All staff complete security training annually. These objectives feed into quarterly OKRs.',
    evidence: 'Security objectives document with executive signature, quarterly OKR spreadsheet showing security metrics, board or leadership meeting where objectives were approved (minutes).',
    quickWin: 'Write 3-5 measurable security goals for this year (e.g., "Enforce MFA on all systems by March 31"). Get your CEO or CTO to sign off via email. That email chain is valid evidence.',
  },

  'CC3.2': {
    scenario: 'LoopStack conducted an annual risk assessment using the NIST 800-30 methodology. The output is a risk register in a spreadsheet listing 25 identified risks, each with a likelihood score (1-5), impact score (1-5), risk rating, owner, and treatment decision (accept/mitigate/transfer). The CISO presented it to the board in Q1.',
    evidence: 'Completed risk register spreadsheet (date-stamped), risk assessment methodology document, board presentation slides, and treatment decisions for each high/critical risk.',
    quickWin: 'Use this 5-step template: List your top 10 assets → for each asset, list 2 threats → score likelihood and impact 1-3 → multiply for risk score → assign an owner and decision. 2 hours, fully auditable.',
  },

  'CC3.3': {
    scenario: 'PipeCo\'s risk assessment includes an "Insider Threat" section identifying scenarios: (1) disgruntled engineer exfiltrating customer data, (2) contractor with excessive access, (3) accidental data leak. Controls: departing employees are offboarded within 4 hours, code commits are reviewed, and privileged access requires manager approval.',
    evidence: 'Risk register with insider threat section, access review records, offboarding checklist, and code review policy.',
    quickWin: 'Add a row to your risk register titled "Insider Threat — unauthorized data access" with likelihood 3, impact 4, treatment = quarterly access reviews + immediate offboarding. Done in 5 minutes.',
  },

  'CC3.4': {
    scenario: 'DeployFast\'s change management checklist includes a "Security Impact" field. For any change rated "significant" (new production system, major architecture change, third-party integration), the security lead reviews the PR or RFC before approval. M&A scenarios trigger a dedicated security due diligence assessment.',
    evidence: 'Change management form/ticket template with security field, completed examples of security reviews for recent changes, evidence the security lead approved or flagged each significant change.',
    quickWin: 'Add one question to your change request Jira ticket template: "Does this change affect data classification, access controls, or external exposure?" If yes, tag @security-lead for review. Enable this in 15 minutes.',
  },

  // ── CC4 ──────────────────────────────────────────────────────────────────
  'CC4.1': {
    scenario: 'CloudBase runs Tenable.io authenticated scans against all production EC2 instances and RDS databases weekly. Findings feed into a Jira project. Critical CVEs are patched within 7 days (tracked in Jira), high within 30 days. A Datadog dashboard shows open finding counts by severity trending over time. An annual pentest is conducted by Bishop Fox.',
    evidence: 'Tenable scan reports (last 4 quarters), Jira remediation tickets with close dates, Datadog dashboard screenshot, pentest report with findings and remediation evidence.',
    quickWin: 'Run a free Nessus Essentials scan or AWS Inspector scan on your production account today. Export the report. Even one scan with a documented remediation plan satisfies the "has a vulnerability management program" requirement for Type 1.',
  },

  'CC4.2': {
    scenario: 'Every quarter, StreamLine\'s CISO exports the open findings list from their vulnerability scanner, reviews it with engineering leads, and sends a summary email to the CTO: "12 open findings this quarter: 2 high (patched), 8 medium (on roadmap), 2 low (accepted)." The email thread is archived in Gmail with the label "Security/Deficiency Reports."',
    evidence: 'Quarterly deficiency summary emails, Jira/Linear tickets for each finding with status, escalation records for any critical findings, and a tracking spreadsheet showing open-to-close time per finding.',
    quickWin: 'Create a "Security Findings" Jira project or Notion database right now. Log your top 5 known gaps as issues with severity, owner, and due date. This is your deficiency tracking log — submit it as evidence.',
  },

  // ── CC5 ──────────────────────────────────────────────────────────────────
  'CC5.1': {
    scenario: 'ScaleOps maintains a Control Matrix in Confluence with one row per SOC 2 control. Columns: Control ID, Description, Type (Preventive/Detective), Owner, Frequency (Continuous/Monthly/Annual), Evidence Location, and Last Tested Date. The matrix is reviewed quarterly and updated when new risks are identified.',
    evidence: 'Control matrix spreadsheet or Confluence page (date-stamped), evidence artifacts linked per control, quarterly review meeting notes.',
    quickWin: 'Export this questionnaire\'s results as your starting control matrix. For each control you answered "Yes" or "Partial," note the evidence you have. You now have a living control matrix in under an hour.',
  },

  'CC5.2': {
    scenario: 'NodeFlow enforces MFA for all employees via Okta. An Okta authentication policy blocks access to all apps if the user lacks an enrolled MFA factor. GitHub and AWS console SSO through Okta — no direct IAM user logins allowed except one break-glass account stored in 1Password Secrets Manager with usage alerts. All MacBooks run CrowdStrike Falcon EDR with auto-update enabled.',
    evidence: 'Okta authentication policy screenshot showing MFA required, GitHub SSO configuration, AWS IAM policy denying console login without MFA, CrowdStrike dashboard showing 100% device coverage, patch management report.',
    quickWin: 'In Okta, go to Security → Authentication Policies → Default Policy → Edit → require MFA for every sign-in. This takes 10 minutes and immediately satisfies the MFA portion of CC5.2.',
  },

  'CC5.3': {
    scenario: 'ByteStream\'s Information Security Policy (v2.1, approved by CEO on Jan 15) is stored in Confluence and covers: purpose and scope, roles and responsibilities, acceptable use, access control, incident response, risk management, and compliance. Sub-policies exist for each domain. All policies have a review date and are updated annually by the security team.',
    evidence: 'ISP document with version number, approval date, and CEO signature. Policy library in Confluence showing all sub-policies. Annual review calendar entry and completion record.',
    quickWin: 'A 2-page Information Security Policy covering scope, responsibilities, and "employees must follow security guidelines" is enough for SOC 2 Type 1. Use a free template from SANS (sans.org/information-security-policy) and get it signed today.',
  },

  // ── CC6 ──────────────────────────────────────────────────────────────────
  'CC6.1': {
    scenario: 'FluxAPI uses Okta as their IdP with SSO connected to GitHub, AWS (via IAM Identity Center), Snowflake, Salesforce, and Slack. Three roles are defined: Admin (3 people), Developer (20 people), and Read-only (8 people). Each role maps to specific Okta groups, and group membership is reviewed quarterly. No shared service accounts exist — all automated jobs use individual IAM roles with least-privilege policies.',
    evidence: 'Okta group/role configuration screenshot, IAM roles with attached policies, quarterly access review spreadsheet signed by each manager, no shared-account policy in the access control policy.',
    quickWin: 'In Okta, create three groups: admin, developer, read-only. Move all users into the appropriate group. This takes 30 minutes and is the foundation of RBAC that satisfies CC6.1.',
  },

  'CC6.2': {
    scenario: 'At DevGrid, all access requests are submitted through a Jira Service Management form. The form requires: requester, system, access level needed, business justification, and manager. The manager receives an approval task and their approval is logged. IT provisions access only after seeing the approved ticket, and the ticket number is recorded in the access log.',
    evidence: 'Jira Service Management access request project, sample approved tickets, IT provisioning log linking ticket number to the account created.',
    quickWin: 'Create a Google Form titled "Access Request" with fields: Your Name, System, Access Level, Reason, Manager Name. Route submissions to a spreadsheet. Email your manager the link when access is requested. That is a compliant access request process.',
  },

  'CC6.3': {
    scenario: 'When an employee is terminated at StreamCore, HR triggers an automated workflow in Okta via Workday integration. Within 15 minutes, all Okta sessions are terminated and the account is suspended. A Jira offboarding ticket is auto-created with a checklist: revoke GitHub access, remove from AWS groups, recover company devices, disable email. Completion is required within 24 hours and signed off by IT.',
    evidence: 'Offboarding Jira ticket template with completion timestamps, HR/IT integration configuration, access log showing account deactivation time relative to termination time, quarterly user access review spreadsheet.',
    quickWin: 'Create an offboarding Jira template with 10 checkboxes (Okta, GitHub, AWS, Slack, email, device return…). For every future termination, open this ticket. For past terminations in the last year, pull the Okta user activity log to prove accounts were disabled. This satisfies auditors.',
  },

  'CC6.4': {
    scenario: 'TurboScale\'s servers run in AWS us-east-1 (SOC 2 certified). Their office server room has a keycard access reader managed through Kisi. Only IT and facilities staff have access. Monthly Kisi access logs are exported and reviewed. Visitors sign in at reception and are escorted. A co-lo data center SOC 2 report is kept on file for any physical hardware.',
    evidence: 'AWS SOC 2 report (available from AWS Artifact), Kisi access log exports, visitor sign-in log, office floor plan showing server room location, badge access policy.',
    quickWin: 'Download your AWS SOC 2 Type 2 report from AWS Artifact (console → AWS Artifact → Reports). That single PDF covers your physical access controls for all AWS-hosted infrastructure.',
  },

  'CC6.5': {
    scenario: 'PixelStack runs a monthly script that queries their IdP for accounts with no login in the past 90 days. The script outputs a CSV. IT reviews it, confirms with managers if the user is still active, and disables dormant accounts. Results are logged in a spreadsheet. Service accounts and API keys are inventoried in 1Password Teams with a quarterly rotation schedule.',
    evidence: 'Monthly dormant account report CSV, IT review sign-off log, service account inventory in 1Password or spreadsheet, API key rotation records.',
    quickWin: 'In Okta or your IdP, filter users by "Last Login > 90 days ago." Screenshot the list. Disable every account that is no longer employed. Document this as your first dormant account review. 20 minutes.',
  },

  'CC6.6': {
    scenario: 'DataBridge runs all web traffic through Cloudflare (WAF + DDoS protection). AWS Security Groups follow a default-deny policy — only ports 443 and 22 (from VPN IP only) are open. A GuardDuty alert fires if any unusual API call patterns are detected. Network architecture diagram is maintained in Confluence and reviewed quarterly.',
    evidence: 'Cloudflare WAF configuration screenshot, AWS Security Group rules export, GuardDuty enabled status, network architecture diagram, quarterly review record.',
    quickWin: 'In the AWS console, enable GuardDuty in all regions in under 5 minutes (free for 30 days, then ~$1/month for small environments). Screenshot "GuardDuty: Enabled" — this is immediate evidence of external threat detection.',
  },

  'CC6.7': {
    scenario: 'At SafeLayer, all production S3 buckets have server-side encryption (AES-256) and block public access enabled. RDS databases use encrypted EBS volumes. All API traffic uses TLS 1.2+. An AWS Config rule alerts if any S3 bucket becomes public. A DLP policy in Google Workspace prevents employees from sharing files containing SSNs or credit card numbers externally.',
    evidence: 'AWS Config compliance report, S3 bucket policy screenshots showing encryption and block-public-access, RDS encryption screenshot, TLS scan result from ssllabs.com, Google Workspace DLP policy configuration.',
    quickWin: 'Go to ssllabs.com/ssltest and test your main production domain. Screenshot the A or A+ result. That proves TLS encryption for data in transit. Then go to AWS → S3 → check "Block all public access" is ON for every bucket. Both done in under 15 minutes.',
  },

  'CC6.8': {
    scenario: 'DevLaunch deploys CrowdStrike Falcon on all company-issued MacBooks and Windows laptops via MDM (Jamf for Mac, Intune for Windows). The CrowdStrike dashboard shows 100% device coverage, last scan time, and any detections. New-hire devices are enrolled in MDM before they receive credentials, ensuring no unprotected device ever accesses production.',
    evidence: 'CrowdStrike / EDR dashboard screenshot showing device count and coverage %, MDM enrollment report, new-hire device provisioning checklist, detection/response log from last 90 days.',
    quickWin: 'If you can\'t afford CrowdStrike today, enable Microsoft Defender (built-in, free) on all Windows devices and turn on the built-in XProtect + Gatekeeper on Macs. Document the policy: "All company devices must have native AV enabled." Screenshot every device\'s status. Satisfies Type 1.',
  },

  // ── CC7 ──────────────────────────────────────────────────────────────────
  'CC7.1': {
    scenario: 'CoreEngine runs Tenable.io scans weekly on all EC2 instances and containers. Findings are automatically imported into a Jira "Vuln Management" project. The SLA policy (Critical ≤ 7 days, High ≤ 30 days, Medium ≤ 90 days) is enforced via Jira due dates with auto-escalation if overdue. A monthly vuln report is sent to the CTO.',
    evidence: 'Tenable scan reports (4 most recent), Jira vuln project with closed/open tickets, SLA policy document, monthly vuln summary emails, pentest report from the last 12 months.',
    quickWin: 'Enable AWS Inspector v2 in your AWS account today — it\'s one click in the console and starts scanning all EC2 instances and Lambda functions automatically. Export the first report as evidence of your vulnerability management program starting date.',
  },

  'CC7.2': {
    scenario: 'RailsFast has a documented Incident Response Plan (IRP) stored in Confluence. It defines 4 severity levels with response time SLAs (P1 = 15 min response, 4 hour resolution target). The IRP includes a contact tree, escalation paths, and playbooks for the 5 most likely incident types (ransomware, data breach, DDoS, credential compromise, insider threat). An annual tabletop exercise is run in Q1.',
    evidence: 'IRP document with version date and approval, severity classification table, contact tree, incident log from last 12 months, tabletop exercise report/notes.',
    quickWin: 'Write a 1-page IRP: (1) Definition of what constitutes an incident. (2) Who to call first (CTO/CISO). (3) How to contain it (isolate the affected system). (4) How to notify customers if data is involved. Get your CTO to approve it via email. That\'s a compliant IRP for Type 1.',
  },

  'CC7.3': {
    scenario: 'NexusAPI uses PagerDuty for on-call rotation. Every alert from Datadog, GuardDuty, and Snyk routes through PagerDuty. There are 5 runbooks in Confluence (one per common alert type) with triage steps, escalation criteria, and containment actions. On-call engineers are rotated weekly and documented in PagerDuty\'s schedule view.',
    evidence: 'PagerDuty on-call schedule screenshot, 5+ runbook pages in Confluence, Datadog alert configuration, recent on-call incident log showing response times.',
    quickWin: 'Write a one-page runbook for your most common alert: "If [alert name] fires: (1) Check X. (2) If Y, do Z. (3) Escalate to @person if not resolved in 30 min." Store it in Confluence. This is evidence of alert response procedures for auditors.',
  },

  'CC7.4': {
    scenario: 'When a P1 incident occurred at FastQueue (unauthorized API access), the on-call engineer followed the IRP: contained the affected token within 12 minutes, notified the CISO, engaged the engineering team, and drafted a customer notification within 2 hours. All actions were logged in a Jira incident ticket with timestamps. Affected customers received email notification within 24 hours.',
    evidence: 'Incident ticket in Jira with timestamped actions, customer notification email, post-incident report, evidence the IRP was followed (checklist completion in ticket).',
    quickWin: 'Create a Jira ticket template called "Security Incident" with these fields: Severity, Detection Time, Containment Time, Root Cause, Actions Taken, Customer Notified (Y/N), Notification Time. Even one completed ticket proves your IRP execution capability.',
  },

  'CC7.5': {
    scenario: 'After a credential stuffing attack in March, SpeedAPI held a blameless post-mortem within 72 hours. The 5-page report covered: timeline, root cause (no account lockout policy), contributing factors, impact, and 6 action items with owners and due dates. The action items were tracked in Jira and completed within 60 days. The IRP was updated to include account lockout detection.',
    evidence: 'Post-mortem report document, Jira action items linked to the incident ticket with completion dates, updated IRP version showing the added section, evidence the changes were deployed.',
    quickWin: 'For your next incident (even a minor one), write a 1-page "What happened / What we\'re doing about it" document. Store it in Confluence dated within 5 days of the incident. That is a post-incident review. One example satisfies Type 1.',
  },

  // ── CC8 ──────────────────────────────────────────────────────────────────
  'CC8.1': {
    scenario: 'LaunchPad requires all production changes to go through a pull request in GitHub. PRs require 2 approvals from senior engineers. A security checklist in the PR template asks: "Does this expose new endpoints? Does this change data access? Does this add a new dependency?" Deployments to production run through GitHub Actions with a manual approval gate. Rollback procedures are documented in each service\'s runbook.',
    evidence: 'GitHub branch protection settings screenshot (require 2 approvals), PR template with security checklist, GitHub Actions workflow with approval gate, recent PRs showing approvals and checklist completion, one example rollback procedure.',
    quickWin: 'In GitHub Settings → Branches → Add Rule → require 2 pull request approvals before merging to main. Takes 2 minutes. Screenshot it. This is the single highest-value change management control for a software company.',
  },

  // ── CC9 ──────────────────────────────────────────────────────────────────
  'CC9.1': {
    scenario: 'GridFlow\'s Business Continuity Plan defines RTO (4 hours) and RPO (1 hour) for all Tier-1 services. The DRP details exact steps to restore production from RDS snapshots and S3 backups in a new AWS region. The plan is tested annually: in the last test, engineers restored the full production stack in 2.5 hours (within the 4-hour RTO). Test results are documented in Confluence.',
    evidence: 'BCP document with RTO/RPO definitions, DRP with step-by-step recovery procedures, annual test report showing actual recovery time vs target, sign-off from CTO.',
    quickWin: 'Write a one-paragraph DRP for your most critical service: "In the event of a total region failure, we will: (1) Restore the latest RDS snapshot to us-west-2. (2) Update DNS. (3) Verify the service is healthy. Estimated recovery time: 3 hours." That\'s a compliant DRP for Type 1.',
  },

  'CC9.2': {
    scenario: 'MeshOps maintains a vendor risk register listing all 23 third-party vendors with access to production data. Each vendor is risk-rated (High/Medium/Low) based on data access level. For High-risk vendors, they obtain SOC 2 Type 2 reports annually. All vendor contracts include: data security requirements, breach notification obligations (48 hours), and the right to audit. A Data Processing Agreement (DPA) is signed with all EU data processors.',
    evidence: 'Vendor risk register spreadsheet, 3 SOC 2 reports from high-risk vendors, contract template with security clauses highlighted, signed DPAs, annual vendor review sign-off.',
    quickWin: 'Open a spreadsheet. List your top 10 vendors in column A. In column B, rate each: "High" (has access to production data), "Medium" (has access to internal tools), "Low" (no data access). That\'s your vendor inventory. Request SOC 2 reports from your top 3 "High" vendors today.',
  },

  // ── Availability ──────────────────────────────────────────────────────────
  'A1.1': {
    scenario: 'FlowMetrics configures Datadog monitors for all production services: CPU alert at 70% and 90%, memory alert at 80%, disk alert at 75%, and p99 latency alert at 500ms. Monthly capacity reports are exported showing 30-day trends. Engineering reviews these in the monthly infrastructure meeting and files Jira tickets when any metric approaches the 80% threshold.',
    evidence: 'Datadog monitor configuration screenshots, monthly capacity report PDFs (last 3), infrastructure meeting notes referencing capacity review, Jira tickets opened from capacity alerts.',
    quickWin: 'Enable AWS CloudWatch default dashboards for your EC2 instances — they\'re free and show CPU, memory, and network. Screenshot the dashboard. Set one alarm: if CPU > 80% for 5 minutes, send an email to your ops team. That\'s a compliant capacity monitoring control.',
  },

  'A1.2': {
    scenario: 'DataPulse\'s RDS databases have automated daily snapshots with 35-day retention stored in a separate AWS region. S3 cross-region replication copies all production data to us-west-2. Every quarter, an engineer runs a restore drill: they restore the latest snapshot to a test RDS instance and verify data integrity. Restore time (typically 45 minutes) is logged and compared to the 4-hour RTO.',
    evidence: 'AWS Backup / RDS snapshot configuration screenshot, cross-region replication policy, quarterly restore drill log with timestamps and data verification checklist, RTO/RPO definitions in the DRP.',
    quickWin: 'In the AWS RDS console, verify automated backups are enabled with at least 7-day retention. Screenshot it. Then do a test restore to a non-production instance this week and document the time it took. These two artifacts together satisfy A1.2 for Type 1.',
  },

  'A1.3': {
    scenario: 'LinkBridge ran a full DRP test in Q1: starting at 9am, engineers restored the entire production stack from backups in a sandbox AWS account. The test completed in 3h 20min against a 4-hour RTO target. Three gaps were identified (a missing environment variable and two outdated runbook steps) and corrected by Q2. Test results are in a Confluence page with screenshots and a sign-off from the CTO.',
    evidence: 'DRP test report with start time, completion time, recovery time vs RTO, issues found, sign-off from leadership, updated DRP version after the test.',
    quickWin: 'Schedule a 2-hour "restore drill" on your calendar for next Friday. Give one engineer the DRP and ask them to restore your most critical database from a backup to a staging environment. Document what they did, how long it took, and what broke. That report is your first DRP test.',
  },

  // ── Processing Integrity ──────────────────────────────────────────────────
  'PI1.1': {
    scenario: 'TransactOK validates all API inputs server-side: amount fields reject non-numeric values and values outside [0.01, 999999.99], email fields are validated against RFC 5321, and date fields reject future dates for historical records. All rejected inputs are logged with the reason. Checksums (SHA-256) are computed and verified for all file transfers between internal services.',
    evidence: 'Code review showing input validation logic, API error log showing rejected invalid inputs with reasons, data transfer checksum verification config, unit test coverage report for validation functions.',
    quickWin: 'Run your API through a free tool like OWASP ZAP or Burp Suite Community. Document 3 examples where it rejects invalid input (e.g., submit a string where a number is expected). Screenshot the 400/422 error responses. That proves input validation exists.',
  },

  'PI1.2': {
    scenario: 'BatchRunner monitors all nightly ETL jobs via Airflow. Each DAG has a success/failure alert in PagerDuty. If a job fails or takes more than 150% of its average runtime, on-call is paged. After every run, a reconciliation check compares row counts: input rows = processed rows + error rows. Any discrepancy triggers a Slack alert in #data-ops.',
    evidence: 'Airflow DAG configuration with monitoring enabled, PagerDuty alert rules, reconciliation check code/output log, sample Slack alert for a discrepancy, 30-day job success rate dashboard.',
    quickWin: 'Add a row-count check at the end of your most important data job: "SELECT COUNT(*) from source" vs "SELECT COUNT(*) from destination." Log both numbers and alert if they differ by more than 0.1%. This is a reconciliation control.',
  },

  'PI1.3': {
    scenario: 'ReportCo validates all generated reports before delivery: totals are checked against the sum of line items, date ranges match the request, and output files are scanned for empty content. Reports are only emailed to the address on the verified account. All report deliveries are logged: who requested it, what was sent, when, and to which address.',
    evidence: 'Output validation code/config, access control showing reports are user-specific, delivery log showing requestor, recipient, timestamp, and report ID for each delivery.',
    quickWin: 'Add a simple check to your most important report export: assert that the total field = sum of all line items before sending. Log "Report ID X delivered to user Y at timestamp Z." Both take under an hour and satisfy this control.',
  },

  // ── Confidentiality ──────────────────────────────────────────────────────
  'C1.1': {
    scenario: 'SecureData\'s data classification policy defines four levels. All new data assets are labeled at creation. Engineers apply AWS resource tags (DataClassification=Restricted, Confidential, Internal, Public) to every S3 bucket and RDS instance. A quarterly AWS Config rule checks for untagged resources and opens a Jira ticket for remediation. Employees must label all documents created in Google Drive.',
    evidence: 'Data classification policy PDF, AWS Config rule for untagged resources, sample S3 bucket showing classification tag, Google Workspace drive with labeled documents, training materials on classification.',
    quickWin: 'In AWS, go to Tag Editor. Add a "DataClassification" tag to your 5 most important S3 buckets right now (values: Restricted, Confidential, Internal). Screenshot the tagged resources. This is the starting evidence for a data classification program.',
  },

  'C1.2': {
    scenario: 'CloudArchive\'s data retention policy defines that customer PII is deleted 90 days after contract termination. A scheduled Lambda function runs on the 1st of each month, identifies expired records, hard-deletes them from RDS (not soft-delete), and logs the deletion to an immutable audit log in S3. Hardware retirement is handled by an ITAD vendor who provides a data destruction certificate.',
    evidence: 'Data retention policy document, Lambda function code/configuration, monthly deletion run logs from S3, ITAD vendor certificates for hardware destruction.',
    quickWin: 'Write a one-page "Data Disposal Procedure": "When a customer contract ends, we delete all their data from production within 90 days. For hardware, we use [vendor name] and keep their destruction certificate on file." Get this approved by your legal/ops lead. That\'s a compliant disposal procedure.',
  },

  // ── Privacy ──────────────────────────────────────────────────────────────
  'P1.1': {
    scenario: 'ConsentFlow displays a privacy notice at every data collection point: sign-up form, checkout, contact form. The notice links to the full Privacy Policy which was reviewed by an external privacy attorney and covers: what data is collected, why, how long it\'s kept, who it\'s shared with, and how users can exercise their rights. A cookie consent banner uses OneTrust for granular consent management.',
    evidence: 'URL to privacy policy, screenshot of consent banner, privacy attorney review email, collection point notices on sign-up and checkout flows, OneTrust configuration.',
    quickWin: 'Use Termly.io or iubenda to generate a GDPR/CCPA-compliant privacy policy for free. Publish it at yoursite.com/privacy. Add a link to it on your sign-up form. Done in 2 hours. That satisfies P1.1 for Type 1.',
  },

  'P2.1': {
    scenario: 'UserFirst lets customers manage their data through a self-service Privacy Center (built with Transcend). Users can: export all their data (delivered within 30 days), delete their account and all associated data, opt out of marketing emails, and withdraw analytics consent. Every request is logged with a ticket number, and the response is sent within the legally required timeframe.',
    evidence: 'Privacy Center URL, sample data export request ticket with response timestamp, opt-out confirmation emails, consent management configuration, DSAR request log.',
    quickWin: 'Add an "Export my data" and "Delete my account" button to your account settings page. Even if it triggers a manual process (someone on your team does it), document the process: "We will complete data export requests within 30 days of receiving them." That\'s compliant.',
  },

  'P3.1': {
    scenario: 'MinimalData audited their sign-up form and removed 4 fields that weren\'t strictly necessary: fax number, industry sector, title, and date of birth. They documented the purpose for each remaining field in their data mapping document (Name: for personalization; Email: for account access and notifications; Company: for billing). New features require a Privacy Impact Assessment (PIA) before collecting any new personal data.',
    evidence: 'Data mapping document with purpose per field, before/after comparison of sign-up form, PIA template, completed PIA for the last 2 new features.',
    quickWin: 'List every field in your sign-up/onboarding form. For each field, write one sentence: "We collect this because ___." Delete any field where you can\'t complete that sentence. Document the list with purposes. That\'s a data minimization assessment.',
  },

  'P4.1': {
    scenario: 'RetainRight defines retention schedules in their privacy policy: account data (active contract + 2 years), support tickets (3 years), marketing leads (2 years after last engagement), audit logs (7 years). A scheduled Airflow job runs monthly, checks the "created_at" timestamp against the retention schedule, and deletes or anonymizes expired records. The job logs all deletions.',
    evidence: 'Retention schedule table (in privacy policy or data mapping doc), deletion job configuration, deletion log from last 3 months, anonymization examples for analytics data.',
    quickWin: 'Create a simple spreadsheet: Data Type | Retention Period | Deletion Method. Fill it in for your top 5 data types (user accounts, emails, logs, etc.). That\'s your retention schedule — the first requirement for P4.1.',
  },

  'P5.1': {
    scenario: 'AccessMe built a self-service data access portal where users log in and see all their stored personal data in a structured view. Users can download a JSON export, correct their name/email/phone in-app, and submit a deletion request. All requests are logged. The portal was built in 2 sprints and satisfies GDPR Article 15/16/17 rights.',
    evidence: 'URL to data access portal, screenshot of data export functionality, correction flow, deletion request form, request fulfillment log with timestamps.',
    quickWin: 'Create a one-paragraph "Data Subject Request Process" doc: "Users can email privacy@yourcompany.com to request access, correction, or deletion of their personal data. We will respond within 30 days." Publish this URL in your privacy policy. That satisfies P5.1 for Type 1 without building a portal.',
  },

  'P6.1': {
    scenario: 'SafeShare maintains a Third-Party Data Sharing Register listing all 15 vendors who receive personal data. For each: vendor name, data types shared, purpose, legal basis (contract/legitimate interest/consent), and DPA status. DPAs are signed with all EU processors. The privacy policy discloses categories of third parties. Annual review ensures the register stays current.',
    evidence: 'Third-party data sharing register spreadsheet, signed DPAs with top 5 vendors, privacy policy screenshot showing third-party disclosure section, annual review sign-off.',
    quickWin: 'List your top 5 SaaS tools that receive customer data (e.g., Intercom, Stripe, Salesforce, SendGrid, Mixpanel). For each: write what data they receive and why. Email each vendor requesting their DPA. That\'s your starter third-party sharing register.',
  },

  'P7.1': {
    scenario: 'CleanData validates personal data fields at entry: email addresses are validated with regex + DNS lookup, phone numbers are validated by format, and names reject special characters. Users can update their own profile data through a self-service settings page without needing to contact support. Stale contact data (no login in 18 months) is flagged for re-verification via email.',
    evidence: 'Input validation code for personal data fields, screenshot of user profile edit page, stale data re-verification email template, data quality report showing validation error rates.',
    quickWin: 'Add client-side and server-side email format validation to your account creation form (if not already present). Screenshot the validation error. Add a "Edit Profile" page where users can update their name/email. These two UI elements satisfy P7.1.',
  },

  'P8.1': {
    scenario: 'PrivacyFirst conducts an annual Privacy Impact Assessment (PIA) for any new feature touching personal data. The PIA template covers: what data is collected, legal basis, retention period, third-party sharing, user rights impact, and security controls. The Q1 PIA for the new analytics dashboard was completed by the product manager, reviewed by legal, and approved by the DPO. Findings are tracked in Jira.',
    evidence: 'PIA template document, 2 completed PIAs (one for a past feature, one recent), Jira PIA tickets with completion status, DPO/legal review sign-off, privacy training completion records.',
    quickWin: 'Schedule your first annual privacy review for next month. Agenda: (1) Review current data collection vs privacy policy. (2) Identify any new vendors added in the past year. (3) Check all data subject request responses were on time. Document the meeting notes. That\'s a compliant privacy compliance monitoring activity.',
  },
};
