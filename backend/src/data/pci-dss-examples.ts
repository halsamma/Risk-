import { ControlExample } from './soc2-controls';

export const PCI_DSS_EXAMPLES: Record<string, ControlExample> = {

  '1.1.1': {
    scenario: 'PayFlow Inc. maintains a Network Security Policy (v2.1) in Confluence. The policy documents their firewall vendor, all rule categories, the business owner for each ruleset, and the review schedule. Updated every January by the Security Manager. All engineers and DevOps staff acknowledge reading it via DocuSign. The policy explicitly defines the CDE boundary.',
    evidence: 'Network security policy document with version and approval date. Annual review email thread. DocuSign acknowledgment records for all relevant staff. Network diagram showing CDE boundary.',
    quickWin: 'Create a 2-page "Network Security Policy" document naming your firewall/NSC tools, who owns them, and when rules are reviewed. Get your CTO to sign it. Publish it in your intranet. Done in 2 hours.',
  },

  '1.2.1': {
    scenario: 'CardVault Corp exported every firewall rule to a spreadsheet: rule number, source, destination, port, protocol, direction, and a "business justification" column filled in by the system owner. 14 rules had no justification — all were removed. Rules are reviewed every May and November by the Security Lead with sign-off stored in Jira.',
    evidence: 'Firewall ruleset export with justification column. Records showing deletion of 14 unjustified rules. Last two bi-annual review Jira tickets with sign-off. Default-deny screenshot from firewall console.',
    quickWin: 'Export your firewall rules to a spreadsheet right now. Add a "Business Justification" column. For every rule without a clear justification, ask: "Do we need this?" Delete what you can\'t justify. This single exercise gives you documented, justified rulesets.',
  },

  '1.3.1': {
    scenario: 'RetailPay LLC documented every required traffic flow to/from their CDE: payment processor API (HTTPS/443 outbound), admin VPN (UDP/500 inbound from VPN gateway only), database replication (TCP/5432 internal only). Their firewall has exactly these rules — everything else is blocked. Last quarter\'s pen test confirmed no unauthorized access paths exist.',
    evidence: 'Approved traffic flow document with source/destination/port/business justification for each. Firewall configuration showing matching rules and default deny. Pen test confirmation of restriction.',
    quickWin: 'Draw a box labelled "CDE" on a whiteboard. Draw arrows showing every required connection in/out (payment API call, admin access, DB backup). List the port and protocol for each arrow. That\'s your traffic flow document — implement matching firewall rules.',
  },

  '1.3.2': {
    scenario: 'CommercePay deploys in AWS with a dedicated VPC for the CDE. The CDE VPC has no peering to development or corporate VPCs — all traffic must go through a transit gateway with strict security group rules. Their QSA performed a segmentation test by attempting to access CDE resources from the dev VPC — all attempts failed. Test results are documented.',
    evidence: 'AWS VPC architecture diagram showing CDE isolation. Transit gateway security group rules. QSA segmentation test report confirming isolation. No VPC peering to CDE from non-CDE VPCs.',
    quickWin: 'In AWS, open the CDE VPC and check "VPC Peering Connections." If there are any to non-CDE VPCs, review them. Run a quick nmap scan from a non-CDE instance against a CDE instance IP. If you get no response, document that as segmentation evidence.',
  },

  '2.2.1': {
    scenario: 'PCI Payments Inc. uses CIS Benchmark Level 1 as their configuration standard for all Amazon Linux 2, PostgreSQL, and Nginx instances. They run CIS-CAT Pro assessments monthly. This month\'s results: 94% compliance. The 6% non-compliant items have documented deviations approved by the CISO with compensating controls described.',
    evidence: 'CIS-CAT scan reports for last 3 months. Configuration standards document referencing CIS Benchmark v3.0. Deviation register with CISO approval. Hardening checklist per component type.',
    quickWin: 'Download CIS-CAT Lite (free) from cisecurity.org and run it against your most important server. Even a 65% compliance score with a remediation plan is a valid starting point for a PCI assessment.',
  },

  '2.2.7': {
    scenario: 'SecurePay Corp disabled Telnet and rsh on all 23 in-scope servers during a sprint dedicated to hardening. They verified by running `netstat -tlnp` on each server and confirmed no cleartext services listening. SSH is configured with Protocol 2 only, using key-based authentication for admins.',
    evidence: 'Configuration showing SSH Protocol 2 only. Netstat output showing no Telnet/rsh listeners. Firewall rules blocking Telnet (port 23). Evidence of key-based authentication requirement.',
    quickWin: 'Run this on every in-scope server: `ss -tlnp | grep -E "23|514|512"` (Telnet, rsh, rexec ports). If any appear, disable the service immediately. Takes 5 minutes per server.',
  },

  '3.2.1': {
    scenario: 'TokenFlow Inc. only stores last-4 of PAN and an expiry date — no full PANs ever stored. Actual PANs are handled by their payment processor (Stripe) who is a PCI-validated service provider. A quarterly automated script searches all databases and log files for patterns matching full PAN formats (16-digit sequences). Last 4 quarters: zero findings.',
    evidence: 'Data retention policy. Database schema showing only last-4 and expiry. Quarterly data discovery script and results showing zero full PANs. Stripe\'s AOC confirming they handle PAN storage.',
    quickWin: 'Run a PAN discovery scan using a free tool like PANscan (pcisecuritystandards.org). Scan your most likely locations: application logs, temp files, database exports. Even running this once documents your awareness and first scan result.',
  },

  '3.3.1': {
    scenario: 'After a PCI assessment, CardShop discovered their legacy payment app was logging full CVV values in debug logs. They immediately purged all affected logs, patched the application to strip CVV before any logging, and ran a verification scan confirming no CVV data in any storage. The incident was documented as a finding with remediation evidence.',
    evidence: 'Code review showing CVV is never logged. Database schema showing no CVV column. Application log samples showing masked/absent CVV. Scan tool results confirming no CVV in storage.',
    quickWin: 'Search your application logs right now for patterns like "cvv", "cvc", "security_code" using grep. If you find any, that\'s a critical PCI finding to remediate immediately. If you find nothing, screenshot the search result — that\'s your compliance evidence.',
  },

  '3.4.1': {
    scenario: 'PayPortal Corp updated their admin UI to show only the last 4 digits of PAN by default. The "View Full PAN" button is only visible to users in the "PCI Authorized" RBAC role (3 people: fraud analysts). The role assignment is reviewed quarterly. All "View Full PAN" actions are logged with user ID, timestamp, and the full PAN viewed.',
    evidence: 'Screenshot showing masked PAN in standard view. Role configuration showing "PCI Authorized" role. List of 3 authorized users with business justification. Audit log showing full PAN access events.',
    quickWin: 'Check your admin/CRM UI: what does a customer profile show for payment info? If you see full card numbers, that\'s a finding. Even masking to show only last 4 in code takes about 4 hours to implement.',
  },

  '3.5.1': {
    scenario: 'VaultPay Ltd. stores PANs encrypted with AES-256 using AWS KMS customer-managed keys (CMKs). The CMK is in a dedicated KMS key ring accessible only to the payment processing Lambda role — no engineer has direct decryption access. Keys rotate annually (automatic in KMS). The decryption is logged in CloudTrail.',
    evidence: 'AWS KMS CMK configuration showing AES-256. IAM policy restricting KMS decrypt to payment Lambda only. Automatic key rotation enabled. CloudTrail logs showing all decryption events.',
    quickWin: 'If you\'re on AWS: go to RDS → your payment database → Configuration → Encryption. Verify it says "Enabled." If not, create an encrypted snapshot and restore to an encrypted instance. That\'s PAN-at-rest encryption.',
  },

  '4.2.1': {
    scenario: 'CardGate Inc. disabled TLS 1.0 and 1.1 across all payment endpoints in Q3. They ran SSLLabs.com against all 4 public-facing payment APIs — all show A+ rating. An internal scan using testssl.sh confirms all internal services also use TLS 1.2+. Certificate expiry monitoring via Datadog alerts at 60 days.',
    evidence: 'SSLLabs.com scan reports showing A+ rating for all payment endpoints. testssl.sh output for internal services. TLS configuration showing 1.2+ only. Certificate inventory with expiry monitoring.',
    quickWin: 'Go to ssllabs.com/ssltest and enter your payment portal URL. Screenshot the result. If you get B or lower, the most common fix is enabling TLS 1.3 and disabling TLS 1.0/1.1 in your load balancer — a 10-minute change.',
  },

  '4.2.2': {
    scenario: 'SecureCheckout Inc. maintains a certificate inventory in Google Sheets: domain, issuer, expiry date, SHA-2 fingerprint, responsible team, and renewal SLA. All 12 payment-related certificates are documented. Auto-renewal is enabled for ACM certs. Manual certs have calendar reminders at 90 and 30 days. Last updated: yesterday.',
    evidence: 'Certificate inventory spreadsheet with all required fields. ACM auto-renewal configuration. Calendar reminders for manual cert renewal. Annual review sign-off.',
    quickWin: 'Open a spreadsheet. List every domain certificate you have. Add columns: Expiry Date, Algorithm (should be SHA-256), Issuer. For each certificate expiring in less than 90 days, set a calendar reminder. That\'s your certificate inventory.',
  },

  '5.2.1': {
    scenario: 'PayProtect Corp deploys CrowdStrike Falcon on all 47 in-scope servers and 52 employee laptops. The CrowdStrike console shows 100% coverage with zero unprotected endpoints. Weekly report emailed to the CISO. Any server missing the agent triggers a PagerDuty P2 alert.',
    evidence: 'CrowdStrike console showing 100% coverage. Weekly coverage report. PagerDuty alert configuration for missing agents. Any systems excluded have written risk justification approved by CISO.',
    quickWin: 'Log into your AV/EDR management console right now. Export the "devices" report. Count devices vs your inventory. Any gaps need agents installed. Screenshot 100% coverage as evidence.',
  },

  '5.3.3': {
    scenario: 'EmailGuard Payments configured DMARC (p=reject), DKIM, and SPF on all payment-related domains. MXToolbox verification shows all records passing. Microsoft Defender for Office 365 provides anti-phishing with link detonation. Quarterly phishing simulations show 8% click rate (down from 23% at program launch). Suspicious email reporting button deployed.',
    evidence: 'DMARC, DKIM, SPF DNS records (verify with MXToolbox). Email security tool configuration. Last 4 quarters of phishing simulation results showing improving trend.',
    quickWin: 'Go to mxtoolbox.com/dmarc. Enter your domain. If you don\'t have a DMARC record, create one starting with p=none to monitor: `v=DMARC1; p=none; rua=mailto:dmarc@yourcompany.com`. This takes 5 minutes and is the first step to email security compliance.',
  },

  '6.2.4': {
    scenario: 'SecureCode Payments added Semgrep to their GitHub Actions workflow. It runs on every PR and blocks merges with critical OWASP findings. In Q1, it caught 3 SQL injection attempts and 1 hardcoded API key before they reached production. Results are stored in GitHub Security tab and reviewed by the Security Lead weekly.',
    evidence: 'GitHub Actions workflow showing Semgrep integration. Last 90 days of Semgrep findings with remediation records. Evidence critical findings were blocked. PR records showing security check requirement.',
    quickWin: 'Add this to your GitHub Actions workflow in 15 minutes: `- uses: semgrep/semgrep-action@v1 with: config: p/owasp-top-ten`. It will run on every PR and flag OWASP Top 10 vulnerabilities for free.',
  },

  '6.3.3': {
    scenario: 'PatchFirst Ltd. uses AWS Systems Manager Patch Manager. Critical patches auto-approve after 0 days. Non-critical after 7 days. A maintenance window runs every Sunday 2-4 AM. Patch compliance dashboard shows 98.7% patched within SLA. The 1.3% exceptions have documented business justifications and compensating controls.',
    evidence: 'Patch Manager configuration showing maintenance windows. Monthly patch compliance dashboard showing >95% within SLA. Exception register with justifications. Before/after vulnerability scan comparison.',
    quickWin: 'Enable AWS Systems Manager Patch Manager for all in-scope EC2 instances. Create a patch baseline with "Critical" severity auto-approved. Schedule a Sunday maintenance window. Screenshot the configuration — you now have automated patch management.',
  },

  '6.4.1': {
    scenario: 'WebPay Inc. placed AWS WAF in front of their payment portal with the AWS Managed Core Rule Set and AWSManagedRulesKnownBadInputsRuleSet enabled. Last month, WAF blocked 1,247 requests matching SQL injection and XSS patterns. Weekly WAF reports reviewed by the Security Engineer. Rules updated when AWS releases new managed rules.',
    evidence: 'AWS WAF configuration showing enabled rule groups. WAF metrics/logs showing blocked requests. Monthly WAF review records. Evidence of regular rule updates.',
    quickWin: 'If you\'re on AWS: go to WAF → Create Web ACL → attach to your ALB → add "AWS Managed Rules - Core Rule Set." It costs ~$5/month and immediately provides OWASP Top 10 protection. Takes 15 minutes to deploy.',
  },

  '7.2.1': {
    scenario: 'CardAccess Corp defined 4 CHD access roles: Payment Processor (system account only), Fraud Analyst (read-only PAN access, last 4 only), Security Admin (logs and audit only), Finance (settlement reports, no PAN). All 12 employees with any CDE access are mapped to exactly one role. Role assignments reviewed every 6 months with manager sign-off.',
    evidence: 'Access control policy with role definitions. Role-to-person mapping spreadsheet. Business justification for each role\'s CHD access. Last 6-month review sign-off. Default deny configuration evidence.',
    quickWin: 'Draw a 3-column table: Name | System | Access Level. Fill in every person who can access CHD systems. For each row, add column 4: "Business Justification." If you can\'t fill in column 4, remove that access. This is your access control model.',
  },

  '8.2.1': {
    scenario: 'PayIdentity Inc. conducted a shared account audit. They found 2 shared service accounts (db_admin, app_user). Both were replaced with individual application service accounts using IAM roles. All 34 human users have unique accounts. A policy in their IdP prevents creation of accounts with generic names.',
    evidence: 'User account inventory showing all unique identifiers. Disabled/removed shared account records. Policy preventing generic account names. Service account inventory showing named, controlled accounts.',
    quickWin: 'Run `aws iam list-users` or export users from your IdP. Search for usernames containing: admin, test, shared, generic, temp. These are candidates for review. Even finding and documenting that no shared accounts exist is valuable audit evidence.',
  },

  '8.3.6': {
    scenario: 'SecureLogin Corp enforces password policy via Okta: 12-char minimum, must contain letters and numbers, history of last 4 passwords prevented. AWS IAM console requires 14 chars. Local Linux accounts use PAM with complexity rules. All 3 policies documented and screenshots taken after each configuration change.',
    evidence: 'Okta password policy screenshot. AWS IAM password policy screenshot. PAM configuration for Linux. All showing ≥12 chars, complexity, and history requirements. Annual policy review sign-off.',
    quickWin: 'In Okta → Security → Password Policies: set minimum length 12, require both letters and numbers, prohibit last 4 passwords. Screenshot it. Then run `aws iam get-account-password-policy` and confirm the same. 10 minutes of configuration, permanent compliance evidence.',
  },

  '8.4.2': {
    scenario: 'MFAFirst Payments enforces MFA for ALL CDE access — not just remote. Engineers accessing the AWS console from the office must still use MFA (Okta Verify push). Service accounts use IAM roles, not passwords. CDE database access requires MFA even from the internal network. Last audit: 100% of 28 users have MFA enrolled with zero exceptions.',
    evidence: 'Okta authentication policy showing MFA required for CDE-connected apps. AWS MFA enforcement for console access. 100% MFA coverage report. Evidence of MFA required even from internal network.',
    quickWin: 'In Okta, create an authentication policy called "CDE Access" and set it to require MFA for every sign-in with no exceptions (including network-based bypasses). Attach it to every CDE application. Screenshot the policy — this is your MFA enforcement evidence.',
  },

  '10.2.1': {
    scenario: 'AuditTrail Payments sends logs from all 15 in-scope systems to a Splunk SIEM. Log sources: CloudTrail (all API calls), VPC Flow Logs (network), application logs (auth events), RDS audit logs (all queries on CHD tables). NTP configured on all instances pointing to AWS time servers. All required event types verified by QSA during assessment.',
    evidence: 'Splunk source inventory showing all 15 systems ingesting logs. Sample logs for each required event type. NTP configuration on all CDE systems. QSA verification note from last assessment.',
    quickWin: 'Enable AWS CloudTrail in all regions with a multi-region trail. Enable RDS audit logging for your payment database. These two steps cover most of Req 10.2 for AWS-hosted CHD systems and take under 30 minutes.',
  },

  '10.3.2': {
    scenario: 'LogProtect Corp stores all CDE logs in S3 with Object Lock (compliance mode, 13-month retention). Only a dedicated "log-admin" IAM role can read — no delete or overwrite permissions for any other role. A CloudWatch alarm fires if the S3 log bucket receives zero objects for 15 minutes (potential logging failure). Integrity is validated weekly using S3 Event Notifications.',
    evidence: 'S3 Object Lock configuration (compliance mode, 13 months). IAM policy showing no delete permission except log-admin. CloudWatch alarm for logging failure. Weekly integrity check records.',
    quickWin: 'In AWS S3: open your CloudTrail logs bucket → Properties → Object Lock → Enable with 395-day (13-month) compliance retention. This single setting makes logs tamper-proof and satisfies 10.3.2 immediately.',
  },

  '10.4.1': {
    scenario: 'DailyReview Payments set up a Splunk dashboard that aggregates all CHD access events, failed logins, and admin actions. The Security Analyst reviews it every morning at 9am and documents in a shared spreadsheet: date, reviewer, alerts reviewed, anomalies found, disposition. In January, daily review caught a compromised credential used after business hours — incident contained within 2 hours.',
    evidence: 'Splunk dashboard screenshots showing CHD system logs. Daily review log for last 90 days (spreadsheet with date, reviewer, notes). Incident ticket showing anomaly caught during log review.',
    quickWin: 'Create a Google Sheet titled "Daily Log Review." Columns: Date | Reviewer | Alerts Reviewed | Anomalies Found | Action Taken. Fill it in every morning for 5 minutes while checking your SIEM. After 7 days, you have a week of documented daily log review — exactly what assessors look for.',
  },

  '10.5.1': {
    scenario: 'RetentionPay Inc. keeps CloudWatch logs for 90 days with immediate access, then exports to S3 Glacier with a lifecycle policy extending to 13 months total. All log groups are checked by an AWS Config rule that alerts the Security team if retention drops below 90 days. The retention configuration was last validated during the Q1 audit.',
    evidence: 'CloudWatch log group retention screenshots showing 90 days. S3 lifecycle policy extending to 395 days total. AWS Config rule for minimum 90-day retention. Last audit validation record.',
    quickWin: 'In AWS CloudWatch → Log groups → select all → Actions → Edit retention → set to 90 days. Set up an S3 export with a 395-day lifecycle. Takes 15 minutes and immediately satisfies PCI 10.5.1.',
  },

  '11.3.1': {
    scenario: 'QuarterScan Inc. engaged Trustwave (PCI SSC approved ASV) for quarterly external scans. All 4 quarterly scans this year passed with zero high-severity findings. In Q2, 3 medium vulnerabilities were found — all patched within 30 days and Trustwave confirmed resolution in a rescan. Scan reports with ASV attestation letters are stored in the PCI evidence folder.',
    evidence: '4 quarterly ASV scan reports (all passing). Trustwave\'s ASV attestation letters. Q2 remediation evidence and rescan report. ASV vendor on PCI SSC approved list.',
    quickWin: 'Go to pcisecuritystandards.org/assessors_and_solutions/approved_scanning_vendors to find an ASV. Email 3 of them for quotes. Getting quotes and selecting a vendor is the actionable first step — document this process as "ASV procurement in progress."',
  },

  '11.4.1': {
    scenario: 'PenTestPay Ltd. commissioned an annual penetration test from Coalfire. The test covered: external network penetration, internal network penetration, and application testing of the payment portal. 2 exploitable findings: one medium (outdated SSL cert on internal service) and one low. Both remediated. Coalfire provided a retest confirming remediation.',
    evidence: 'Coalfire penetration test report. Tester qualifications (OSCP certified). Findings with severity ratings. Remediation evidence for all exploitable findings. Coalfire retest confirmation report.',
    quickWin: 'Budget for an annual pen test ($5,000–$15,000 for scoped CDE testing). Add it to your security roadmap. Even having a signed Statement of Work with a pen testing firm in progress demonstrates you are working toward compliance.',
  },

  '11.5.1': {
    scenario: 'ThreatDetect Payments deployed Snort-based IDS at the CDE network perimeter and AWS GuardDuty for cloud-layer detection. Alerts are routed to PagerDuty — on-call acknowledges within 15 minutes. GuardDuty findings are reviewed daily in Security Hub. Snort signatures updated weekly. Last quarter: 14 alerts — all investigated, 12 false positives, 2 minor incidents handled.',
    evidence: 'Snort IDS deployment configuration. GuardDuty enabled in all regions. PagerDuty alert routing rules. Last quarter\'s alert log showing investigation records. Signature update records.',
    quickWin: 'Enable AWS GuardDuty in all regions in your AWS account (one click in the console). It immediately starts detecting threats like unusual API calls, compromised credentials, and port scanning — all relevant to CDE protection. Free for 30 days.',
  },

  '12.1.1': {
    scenario: 'PolicyFirst Payments maintains a 12-page Information Security Policy (v4.0, approved by CEO March 2026). It covers all 12 PCI DSS requirement areas. Reviewed every January. All staff receive it in their onboarding packet and sign a "Policy Acknowledgment" form via DocuSign. Policy version history is maintained in Confluence.',
    evidence: 'ISP document (v4.0) with CEO signature and March 2026 date. Annual review calendar event and completion record. DocuSign acknowledgment records for all staff. Confluence version history.',
    quickWin: 'Check if you have an existing security policy. If yes, verify it covers payment card data handling. If no, use the PCI DSS 12-requirement structure as your outline — one paragraph per requirement. Get your CEO to sign it. That\'s a compliant ISP in one afternoon.',
  },

  '12.3.1': {
    scenario: 'RiskFirst Payments conducts an annual targeted risk analysis every January. The CISO facilitates a 2-day workshop with system owners covering: asset identification, threat modeling, current control effectiveness, and residual risk. This year\'s output: 28 risks, 3 critical (all with treatment plans), 8 high. Results approved by CEO and fed into the security roadmap.',
    evidence: 'Annual risk analysis report. Risk register with ratings for each identified risk. CEO approval email. Treatment plans for critical/high risks. Evidence risks feed into the security program.',
    quickWin: 'Schedule a 2-hour meeting with your CISO, CTO, and lead developer. Ask: "What are the 10 most likely ways someone could steal our cardholder data?" For each, rate likelihood and impact 1-3. That\'s a risk analysis. Write it up and get it approved.',
  },

  '12.5.2': {
    scenario: 'ScopeFirst Inc. formally confirms their CDE scope every January. The CISO creates an updated network diagram and data flow diagram showing all CHD flows. Every system that stores, processes, transmits, or could impact CHD security is listed. The scope document was reviewed by their QSA who confirmed it was accurate before the annual assessment.',
    evidence: 'Annual scope confirmation document signed by CISO. Updated network diagram. Data flow diagram showing all CHD flows. QSA scope review confirmation. Record that scope document was updated when infrastructure changed.',
    quickWin: 'Draw a data flow diagram: "Card number enters here" → what systems does it touch → "Card number exits here." Every system that touches or connects to those systems is in scope. Document and date this diagram — that\'s your scope confirmation.',
  },

  '12.8.1': {
    scenario: 'VendorGuard Payments maintains a TPSP register with 8 vendors: Stripe (payment processor, AOC provided), Twilio (SMS alerts, PCI SAQ confirmed), AWS (infrastructure, AOC via AWS Artifact), Cloudflare (WAF/CDN, AOC confirmed), Salesforce (CRM — excluded from CDE after scope review), and 3 others. AOCs for all CDE-touching vendors collected annually.',
    evidence: 'TPSP inventory spreadsheet listing all vendors, services, data access level. Current AOC or PCI DSS compliance attestation for each CDE-touching TPSP. Annual review completion record.',
    quickWin: 'List your top 5 payment-related vendors. For each, go to their trust/compliance page and download their current AOC (most major vendors publish these). Store them in a "PCI Vendor Compliance" folder. That\'s your TPSP register.',
  },

  '12.10.1': {
    scenario: 'IncidentReady Payments has a PCI-specific IRP section covering: "Suspected cardholder data breach" scenario with step-by-step procedures including when to call their acquiring bank, how to notify Visa/Mastercard within the required timeframe, and their forensic investigator (PFI) contact. Last year\'s tabletop simulated a data breach — 47-minute end-to-end response time documented.',
    evidence: 'PCI-specific IRP with payment brand notification procedures. Acquiring bank contact information. PFI (PCI Forensic Investigator) vendor contract. Last year\'s tabletop exercise report with response timeline.',
    quickWin: 'Add one page to your existing IRP titled "Cardholder Data Breach." Include: (1) Call acquiring bank: [number]. (2) Preserve forensic evidence — do not reboot affected systems. (3) Visa/Mastercard notification: contact your acquiring bank. (4) Engage PFI if required. That\'s a compliant PCI IRP addition.',
  },

  '12.4.1': {
    scenario: 'ExecOwned Payments (a service provider) formally assigned PCI DSS ownership to their CISO in a board resolution. The CISO sends quarterly PCI compliance status reports to the board covering: open findings, remediation progress, upcoming audit timeline, and any significant changes. A compliance calendar tracks all PCI DSS control review dates year-round.',
    evidence: 'Board resolution naming CISO as PCI DSS owner. Last 4 quarterly compliance reports to board. Compliance calendar showing year-round activities. Evidence of ongoing compliance monitoring.',
    quickWin: 'Send an email to your CEO/board: "I am formally taking ownership of PCI DSS compliance. I will report quarterly on our status." CC your CISO. That email with the date is your executive ownership documentation — takes 2 minutes.',
  },
};
