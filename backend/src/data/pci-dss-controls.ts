import { PCI_DSS_EXAMPLES } from './pci-dss-examples';
import { ControlExample, RemediationStep, Severity } from './soc2-controls';

export type PCIRequirement =
  | 'req_1_network_security'
  | 'req_2_secure_config'
  | 'req_3_protect_stored_data'
  | 'req_4_protect_transmission'
  | 'req_5_anti_malware'
  | 'req_6_secure_development'
  | 'req_7_restrict_access'
  | 'req_8_authentication'
  | 'req_9_physical_access'
  | 'req_10_logging_monitoring'
  | 'req_11_security_testing'
  | 'req_12_security_policy';

export type PCIEntityType = 'merchant' | 'service_provider';

export interface PCIDSSControl {
  id: string;               // e.g. "1.2.1"
  requirement: PCIRequirement;
  title: string;
  description: string;
  objective: string;
  guidance: string[];
  evidenceExamples: string[];
  severity: Severity;
  applicableTo: PCIEntityType[];   // merchant, service_provider, or both
  staticRemediation: RemediationStep[];
  example?: ControlExample;
}

export const PCI_REQUIREMENT_LABELS: Record<PCIRequirement, { label: string; short: string; color: string }> = {
  req_1_network_security:    { label: 'Req 1 – Network Security Controls',               short: 'Req 1',  color: '#6366f1' },
  req_2_secure_config:       { label: 'Req 2 – Secure Configurations',                   short: 'Req 2',  color: '#8b5cf6' },
  req_3_protect_stored_data: { label: 'Req 3 – Protect Stored Account Data',             short: 'Req 3',  color: '#ef4444' },
  req_4_protect_transmission:{ label: 'Req 4 – Protect Data in Transmission',            short: 'Req 4',  color: '#f97316' },
  req_5_anti_malware:        { label: 'Req 5 – Protect Against Malicious Software',      short: 'Req 5',  color: '#f59e0b' },
  req_6_secure_development:  { label: 'Req 6 – Develop and Maintain Secure Systems',     short: 'Req 6',  color: '#84cc16' },
  req_7_restrict_access:     { label: 'Req 7 – Restrict Access to System Components',    short: 'Req 7',  color: '#22c55e' },
  req_8_authentication:      { label: 'Req 8 – Identify Users and Authenticate Access',  short: 'Req 8',  color: '#06b6d4' },
  req_9_physical_access:     { label: 'Req 9 – Restrict Physical Access',                short: 'Req 9',  color: '#3b82f6' },
  req_10_logging_monitoring: { label: 'Req 10 – Log and Monitor All Access',             short: 'Req 10', color: '#a78bfa' },
  req_11_security_testing:   { label: 'Req 11 – Test Security Regularly',                short: 'Req 11', color: '#fb923c' },
  req_12_security_policy:    { label: 'Req 12 – Support Information Security with Policy',short: 'Req 12', color: '#94a3b8' },
};

export const PCI_DSS_CONTROLS: PCIDSSControl[] = [

  // ── REQ 1: Network Security Controls ─────────────────────────────────────
  {
    id: '1.1.1', requirement: 'req_1_network_security', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Network Security Control Policies and Procedures',
    description: 'All security policies and operational procedures for network security controls are documented, kept up to date, in use, and known to all affected parties.',
    objective: 'Maintain documented, current policies covering all network security controls protecting the CDE.',
    guidance: ['Document all NSC rules and justifications','Review policies at least annually','Distribute to all relevant personnel','Include scope of CDE clearly'],
    evidenceExamples: ['Network security policy document','Annual review records','Network diagram showing CDE boundary'],
    staticRemediation: [
      { order:1, title:'Document Network Security Policy', description:'Create a policy covering all NSC configurations, the CDE boundary, and rules for traffic flow into/out of the CDE.', effort:'medium', timeframe:'1–2 weeks' },
      { order:2, title:'Review Annually', description:'Schedule annual review and document sign-off.', effort:'low', timeframe:'Ongoing' },
    ],
  },
  {
    id: '1.2.1', requirement: 'req_1_network_security', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Configuration Standards for NSCs',
    description: 'Configuration standards for NSCs are defined, implemented, and known to all affected parties.',
    objective: 'All firewalls and other NSCs are configured to a documented, secure standard.',
    guidance: ['Define approved ruleset for all NSCs','Deny all traffic not explicitly required','Review ruleset at least every 6 months','Document business justification for each rule'],
    evidenceExamples: ['Firewall ruleset with justifications','6-month rule review records','Default-deny evidence'],
    staticRemediation: [
      { order:1, title:'Audit All Firewall Rules', description:'Review every inbound and outbound rule. Document the business justification for each. Remove any rules with no justification.', effort:'high', timeframe:'2–3 weeks' },
      { order:2, title:'Implement Default Deny', description:'Set default-deny on all NSCs. All allowed traffic must have an explicit permit rule with documented justification.', effort:'medium', timeframe:'1 week' },
      { order:3, title:'Schedule 6-Month Reviews', description:'Calendar bi-annual firewall rule reviews with sign-off by the security team.', effort:'low', timeframe:'1 day setup' },
    ],
  },
  {
    id: '1.3.1', requirement: 'req_1_network_security', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Inbound and Outbound Traffic Restriction to CDE',
    description: 'Inbound and outbound traffic is restricted to what is necessary for the cardholder data environment, and all other traffic is denied.',
    objective: 'Only explicitly authorized traffic can enter or leave the CDE.',
    guidance: ['Restrict inbound to only necessary ports/protocols/services','Restrict outbound to only required destinations','Block all other traffic','Document and test restrictions'],
    evidenceExamples: ['Firewall rules showing CDE inbound/outbound restrictions','Port scan results showing only allowed ports open','Network diagram'],
    staticRemediation: [
      { order:1, title:'Map Required Traffic Flows', description:'Document every required inbound and outbound connection to the CDE with source, destination, port, protocol, and business justification.', effort:'high', timeframe:'2 weeks' },
      { order:2, title:'Implement Restriction Rules', description:'Create firewall rules matching only the documented flows. Block all else.', effort:'high', timeframe:'1–2 weeks' },
    ],
  },
  {
    id: '1.3.2', requirement: 'req_1_network_security', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Network Segmentation of CDE',
    description: 'All connections from untrusted networks to the cardholder data environment are denied except those required for business.',
    objective: 'Isolate the CDE from untrusted networks and limit lateral movement.',
    guidance: ['CDE must be segmented from all other network zones','Verify segmentation prevents unauthorized access','Test segmentation at least annually (quarterly for service providers)','Document DMZ architecture'],
    evidenceExamples: ['Network segmentation diagram','Penetration test results confirming segmentation','Quarterly/annual segmentation test results'],
    staticRemediation: [
      { order:1, title:'Implement Network Segmentation', description:'Move all CHD-processing systems into a dedicated, isolated CDE network segment. All other traffic denied.', effort:'high', timeframe:'3–6 weeks' },
      { order:2, title:'Test Segmentation', description:'Conduct a segmentation test (pen test or controlled scan) to confirm the CDE cannot be accessed from out-of-scope segments.', effort:'medium', timeframe:'1 week' },
    ],
  },
  {
    id: '1.4.1', requirement: 'req_1_network_security', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'NSC Between Trusted and Untrusted Networks',
    description: 'NSCs are implemented between trusted and untrusted networks.',
    objective: 'Ensure all traffic between the internet/untrusted networks and the CDE passes through a controlled network security control.',
    guidance: ['Firewall between internet and CDE required','DMZ for all public-facing components','Stateful inspection required','No direct routes between internet and CDE'],
    evidenceExamples: ['Network architecture diagram showing NSC placement','Firewall configuration','No direct internet-to-CDE routes confirmed'],
    staticRemediation: [
      { order:1, title:'Deploy DMZ Architecture', description:'Place all internet-facing components (web servers, APIs) in a DMZ. CDE must be behind a second firewall layer.', effort:'high', timeframe:'3–4 weeks' },
    ],
  },

  // ── REQ 2: Secure Configurations ─────────────────────────────────────────
  {
    id: '2.1.1', requirement: 'req_2_secure_config', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Secure Configuration Policy and Procedures',
    description: 'Policies and procedures for secure configurations are documented and in use.',
    objective: 'Maintain documented configuration standards for all system components in the CDE.',
    guidance: ['Document configuration standards for all component types','Reference industry best practices (CIS, DISA STIG)','Review standards at least annually'],
    evidenceExamples: ['Configuration standard documents per component type','Annual review records'],
    staticRemediation: [
      { order:1, title:'Document Configuration Standards', description:'Create hardening standards for each OS, database, and application in the CDE based on CIS Benchmarks.', effort:'high', timeframe:'2–3 weeks' },
    ],
  },
  {
    id: '2.2.1', requirement: 'req_2_secure_config', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'System Configuration Standards',
    description: 'Configuration standards are developed for all system components, addressing all known security vulnerabilities, and are consistent with industry best practices.',
    objective: 'Apply vendor-hardened, industry-standard configurations to every CDE component.',
    guidance: ['Apply CIS Benchmarks or DISA STIGs','Change all default passwords before deployment','Disable unnecessary services, protocols, ports','Only one primary function per server'],
    evidenceExamples: ['CIS Benchmark scan results','Hardening checklist per component','Default password change records','Running services inventory'],
    staticRemediation: [
      { order:1, title:'Run CIS Benchmark Scans', description:'Run CIS-CAT scans on all in-scope systems. Remediate all Level 1 failures.', effort:'high', timeframe:'3–4 weeks' },
      { order:2, title:'Change All Default Credentials', description:'Audit all systems for vendor default usernames and passwords. Change before deployment.', effort:'medium', timeframe:'1 week' },
      { order:3, title:'Disable Unnecessary Services', description:'Disable all unused services, daemons, protocols on every CDE component.', effort:'medium', timeframe:'2 weeks' },
    ],
  },
  {
    id: '2.2.7', requirement: 'req_2_secure_config', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Non-Console Administrative Access Encrypted',
    description: 'All non-console administrative access is encrypted using strong cryptography.',
    objective: 'Ensure all remote admin sessions are encrypted — no cleartext admin protocols.',
    guidance: ['Telnet, rsh, rlogin must not be used','SSH, HTTPS, and other encrypted protocols required','VNC over unencrypted channels prohibited','Verify encryption for all remote admin tools'],
    evidenceExamples: ['SSH-only configuration evidence','Disabled Telnet/rsh/rlogin configuration','Configuration showing no cleartext admin protocols'],
    staticRemediation: [
      { order:1, title:'Disable Cleartext Admin Protocols', description:'Disable Telnet, rsh, rlogin, FTP on all in-scope systems. Replace with SSH, SFTP, HTTPS.', effort:'medium', timeframe:'1 week' },
    ],
  },
  {
    id: '2.3.1', requirement: 'req_2_secure_config', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Wireless Environment Security',
    description: 'All wireless environments connected to the CDE or transmitting account data are inventoried and use industry best practices for security.',
    objective: 'Secure all wireless networks, especially those connected to or near the CDE.',
    guidance: ['Change default SSID and passwords on all wireless devices','Enable strong encryption (WPA3 or WPA2-Enterprise minimum)','Quarterly scans for unauthorized wireless access points','Disable wireless on systems that don\'t need it'],
    evidenceExamples: ['Wireless security configuration','Quarterly rogue AP scan results','WPA2/WPA3 configuration evidence'],
    staticRemediation: [
      { order:1, title:'Audit and Secure Wireless', description:'Inventory all wireless access points. Ensure WPA2-Enterprise minimum. Change default SSIDs and passwords.', effort:'medium', timeframe:'1–2 weeks' },
      { order:2, title:'Quarterly Rogue AP Scans', description:'Run wireless scanning tools quarterly to detect unauthorized access points.', effort:'low', timeframe:'Ongoing' },
    ],
  },

  // ── REQ 3: Protect Stored Account Data ───────────────────────────────────
  {
    id: '3.2.1', requirement: 'req_3_protect_stored_data', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Data Retention Policy for Account Data',
    description: 'Account data storage is minimized — a data retention and disposal policy exists and limits storage to what is needed.',
    objective: 'Store cardholder data only as long as necessary and dispose of it securely.',
    guidance: ['Document data retention requirements for each data element','Delete data exceeding retention period automatically','Quarterly process to find and delete stored data','Document what data is stored where'],
    evidenceExamples: ['Data retention policy','Quarterly purge execution records','Data flow diagram showing storage locations'],
    staticRemediation: [
      { order:1, title:'Data Inventory and Flow Diagram', description:'Map every location where cardholder data is stored (databases, files, logs, backups). Document retention requirement for each.', effort:'high', timeframe:'2–3 weeks' },
      { order:2, title:'Implement Automated Deletion', description:'Configure automated deletion of CHD exceeding the retention period.', effort:'high', timeframe:'3–4 weeks' },
      { order:3, title:'Quarterly Data Discovery', description:'Run a quarterly scan using data discovery tools to find CHD in unexpected locations.', effort:'medium', timeframe:'Ongoing' },
    ],
  },
  {
    id: '3.3.1', requirement: 'req_3_protect_stored_data', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Sensitive Authentication Data Not Retained After Authorization',
    description: 'SAD (full track data, CVV2, CVC2, PINs) is not retained after authorization even if encrypted.',
    objective: 'Never store CVV/CVC, full magnetic stripe data, or PINs after transaction authorization.',
    guidance: ['Full track data must never be stored post-authorization','CVV2/CVC2/CAV2 must never be stored','PINs and PIN blocks must never be stored','Verify applications don\'t store SAD in logs, temp files, or databases'],
    evidenceExamples: ['Database schema confirming no SAD fields','Application code review confirming no SAD logging','Scan results showing no SAD in storage','Payment application PCI compliance attestation'],
    staticRemediation: [
      { order:1, title:'Audit Storage for SAD', description:'Search all databases, log files, and temp files for CVV, track data, or PIN data using regex patterns.', effort:'high', timeframe:'2–3 weeks' },
      { order:2, title:'Purge Any Found SAD', description:'Immediately securely delete any SAD found in storage. Update application code to prevent future storage.', effort:'high', timeframe:'Immediate upon finding' },
    ],
  },
  {
    id: '3.4.1', requirement: 'req_3_protect_stored_data', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Full PAN Display Restricted',
    description: 'The PAN is masked when displayed so that only authorized personnel with a legitimate need can see more than the last four digits.',
    objective: 'Mask PAN in displays, reports, and screens — only last 4 digits visible by default.',
    guidance: ['Display only last 4 digits of PAN by default','Only personnel with business need can see more','Masking must apply to all displays, reports, screens','Document which roles are authorized to see full PAN'],
    evidenceExamples: ['Screenshot of masked PAN in UI','Role-based access documentation for full PAN access','Application configuration showing masking'],
    staticRemediation: [
      { order:1, title:'Implement PAN Masking in All UIs', description:'Update all screens, reports, and logs to display only the last 4 digits of the PAN. Implement role-based override only for authorized roles.', effort:'high', timeframe:'2–4 weeks' },
    ],
  },
  {
    id: '3.5.1', requirement: 'req_3_protect_stored_data', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'PAN Secured Wherever Stored',
    description: 'Primary account numbers are secured with strong cryptography wherever stored.',
    objective: 'All stored PANs must be encrypted, hashed, or tokenized.',
    guidance: ['Encrypt PAN using AES-256 or equivalent','OR use one-way hash (SHA-256 minimum)','OR use tokenization','Encryption keys must be protected and managed separately from the data'],
    evidenceExamples: ['Database encryption configuration','Tokenization service documentation','Key management procedures','Encryption algorithm and key length confirmation'],
    staticRemediation: [
      { order:1, title:'Encrypt or Tokenize All Stored PANs', description:'Implement AES-256 encryption or tokenization for all stored PANs. Use a dedicated key management service (HSM or cloud KMS).', effort:'high', timeframe:'4–8 weeks' },
      { order:2, title:'Implement Key Management', description:'Store encryption keys separately from encrypted data. Implement key rotation annually minimum.', effort:'high', timeframe:'2–4 weeks' },
    ],
  },

  // ── REQ 4: Protect CHD in Transmission ───────────────────────────────────
  {
    id: '4.2.1', requirement: 'req_4_protect_transmission', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Strong Cryptography for PAN Transmission',
    description: 'Strong cryptography is used to safeguard PAN during transmission over open, public networks.',
    objective: 'All PAN transmitted over any open, public network is encrypted using TLS 1.2+ with valid certificates.',
    guidance: ['TLS 1.2 minimum; TLS 1.3 recommended','Disable SSL, TLS 1.0, TLS 1.1 completely','Valid, unexpired TLS certificates required','Verify encryption for ALL cardholder data transmission paths'],
    evidenceExamples: ['SSLLabs.com scan results showing TLS 1.2+','Configuration showing SSL/TLS 1.0/1.1 disabled','Certificate inventory with expiry dates'],
    staticRemediation: [
      { order:1, title:'Disable Legacy TLS/SSL', description:'Disable SSL 3.0, TLS 1.0, and TLS 1.1 on all in-scope systems. Enforce TLS 1.2 minimum. Test with SSLLabs.com.', effort:'medium', timeframe:'1 week' },
      { order:2, title:'Certificate Inventory', description:'Maintain an inventory of all TLS certificates with expiry dates. Set renewal alerts at 60 days before expiry.', effort:'low', timeframe:'3 days' },
    ],
  },
  {
    id: '4.2.2', requirement: 'req_4_protect_transmission', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Inventory of Trusted Keys and Certificates',
    description: 'An inventory of trusted keys and certificates used to protect PAN during transmission is maintained.',
    objective: 'Maintain a complete, up-to-date inventory of all cryptographic keys and certificates in use.',
    guidance: ['Document all certificates: domain, issuer, expiry, purpose','Document all encryption keys: algorithm, key length, use case, custodian','Review inventory at least annually'],
    evidenceExamples: ['Certificate and key inventory spreadsheet','Annual review record'],
    staticRemediation: [
      { order:1, title:'Create Certificate and Key Inventory', description:'List every TLS certificate and encryption key in use. For each: domain/purpose, expiry, algorithm, key length, custodian, and renewal process.', effort:'medium', timeframe:'1 week' },
    ],
  },

  // ── REQ 5: Protect Against Malicious Software ─────────────────────────────
  {
    id: '5.2.1', requirement: 'req_5_anti_malware', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Anti-Malware Solution Deployed',
    description: 'An anti-malware solution is deployed on all system components except those determined to not be at risk.',
    objective: 'Deploy and maintain anti-malware on all in-scope systems.',
    guidance: ['Deploy on all systems commonly affected by malware','Document any systems excluded with risk justification','Must detect, remove, and protect against all types of malware','Automated, not manual, scanning'],
    evidenceExamples: ['Anti-malware deployment report showing 100% coverage','Configuration showing automatic scans','Exclusions log with risk justifications'],
    staticRemediation: [
      { order:1, title:'Deploy Anti-Malware on All Systems', description:'Install AV/EDR on every in-scope system component. Document any exclusions with a written risk justification approved by management.', effort:'medium', timeframe:'1–2 weeks' },
    ],
  },
  {
    id: '5.2.2', requirement: 'req_5_anti_malware', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Anti-Malware Solution Maintained and Active',
    description: 'The anti-malware solution is kept current, performs periodic scans, generates audit logs, and cannot be disabled by users.',
    objective: 'Ensure anti-malware is actively running, up-to-date, and generating logs.',
    guidance: ['Automatic updates for definitions (at least daily)','Periodic scans and real-time protection enabled','Logs retained per Req 10','Users cannot disable — managed via central console'],
    evidenceExamples: ['Anti-malware console showing all agents active and up-to-date','Scan logs','Definition update timestamps','Policy preventing user disabling'],
    staticRemediation: [
      { order:1, title:'Configure Auto-Update and Central Management', description:'Enable automatic daily definition updates. Manage all agents from a central console. Block users from disabling protection.', effort:'medium', timeframe:'1 week' },
    ],
  },
  {
    id: '5.3.3', requirement: 'req_5_anti_malware', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Anti-Phishing Mechanisms',
    description: 'Anti-phishing mechanisms protect users against phishing attacks.',
    objective: 'Implement technical controls to detect and block phishing attacks against users.',
    guidance: ['Email filtering and anti-phishing tools deployed','DMARC, DKIM, and SPF configured','Anti-phishing training for users','Procedures for reporting suspected phishing'],
    evidenceExamples: ['Email security configuration (DMARC/DKIM/SPF records)','Anti-phishing tool configuration','Phishing simulation results','User training completion records'],
    staticRemediation: [
      { order:1, title:'Configure DMARC, DKIM, SPF', description:'Publish SPF and DKIM records. Configure DMARC with p=quarantine or p=reject. Verify with MXToolbox.', effort:'medium', timeframe:'3–5 days' },
      { order:2, title:'Deploy Email Anti-Phishing', description:'Enable email anti-phishing tools (Microsoft Defender, Proofpoint, Mimecast) with link scanning and attachment sandboxing.', effort:'medium', timeframe:'1–2 weeks' },
    ],
  },

  // ── REQ 6: Develop and Maintain Secure Systems ────────────────────────────
  {
    id: '6.2.1', requirement: 'req_6_secure_development', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Secure Development Policy',
    description: 'Bespoke and custom software are developed securely based on industry standards.',
    objective: 'Embed security into the software development process via documented standards.',
    guidance: ['Written secure coding standards for all languages in use','Based on OWASP or equivalent','Developers trained on secure coding annually','Code reviewed before production release'],
    evidenceExamples: ['Secure coding standards document','Developer training completion records','Code review checklist and records'],
    staticRemediation: [
      { order:1, title:'Adopt OWASP Secure Coding Standards', description:'Create a secure coding guide based on OWASP covering the languages your team uses. Require all developers to sign off on reading it.', effort:'medium', timeframe:'1–2 weeks' },
    ],
  },
  {
    id: '6.2.4', requirement: 'req_6_secure_development', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Common Vulnerabilities Addressed in Code',
    description: 'Software engineering techniques are used to prevent or mitigate common software attacks and related vulnerabilities in bespoke and custom software.',
    objective: 'Ensure application code does not contain OWASP Top 10 vulnerabilities.',
    guidance: ['Injection attacks (SQL, command, LDAP) prevented via parameterized queries','XSS prevented via output encoding','Broken authentication prevented via secure session management','Code reviewed for OWASP Top 10 before each release'],
    evidenceExamples: ['SAST scan results','Code review records showing OWASP Top 10 checks','DAST scan results','Penetration test results'],
    staticRemediation: [
      { order:1, title:'Implement SAST in CI/CD', description:'Add a SAST tool (Semgrep, Checkmarx, SonarQube) to CI/CD pipeline. Block deployments with critical vulnerabilities.', effort:'high', timeframe:'2–3 weeks' },
      { order:2, title:'OWASP Top 10 Code Review Checklist', description:'Create a pre-release checklist covering OWASP Top 10. Require completion before any production deployment.', effort:'medium', timeframe:'1 week' },
    ],
  },
  {
    id: '6.3.1', requirement: 'req_6_secure_development', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Vulnerability Management for Security Vulnerabilities',
    description: 'Security vulnerabilities are identified and managed.',
    objective: 'Identify, rank, and remediate security vulnerabilities in a timely manner.',
    guidance: ['Subscribe to vulnerability alerts for all technologies in use','Rank vulnerabilities by risk (CVSS)','Critical/high vulnerabilities addressed within defined timeframes','Track remediation progress'],
    evidenceExamples: ['Vulnerability tracking system','CVE subscription evidence','Remediation timeline records','Patch compliance reports'],
    staticRemediation: [
      { order:1, title:'Subscribe to Security Advisories', description:'Subscribe to NVD, CISA KEV, and vendor security advisories for all software and hardware in the CDE.', effort:'low', timeframe:'1 day' },
      { order:2, title:'Implement Risk-Based Remediation SLAs', description:'Critical CVEs: patch within 30 days. High: 60 days. Medium: 90 days. Track in a ticketing system.', effort:'medium', timeframe:'1 week' },
    ],
  },
  {
    id: '6.3.3', requirement: 'req_6_secure_development', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Security Patches Applied in a Timely Manner',
    description: 'All system components are protected from known vulnerabilities by installing applicable security patches/updates.',
    objective: 'Apply security patches within required timeframes across all CDE systems.',
    guidance: ['Critical patches within 1 month of release','All other patches within 3 months','Test patches before deploying to production','Document any deviations'],
    evidenceExamples: ['Patch management reports','Patch timeline vs release date analysis','Test environment patch validation records'],
    staticRemediation: [
      { order:1, title:'Implement Automated Patch Management', description:'Deploy a patch management tool covering all CDE components. Configure: critical patches auto-approved in 30 days, others reviewed monthly.', effort:'high', timeframe:'2–3 weeks' },
    ],
  },
  {
    id: '6.4.1', requirement: 'req_6_secure_development', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'WAF for Public-Facing Web Applications',
    description: 'Public-facing web applications are protected against known attacks via a web application firewall (WAF) or automated technical solution.',
    objective: 'Deploy a WAF in front of all public-facing web applications that access cardholder data.',
    guidance: ['WAF required for all public-facing web apps in the CDE','Must inspect all HTTP/HTTPS traffic','Rules kept up to date','Alerts on detected attacks'],
    evidenceExamples: ['WAF deployment and configuration','WAF alert/blocking logs','Evidence WAF is active and updating rules'],
    staticRemediation: [
      { order:1, title:'Deploy WAF for All Public Web Apps', description:'Deploy a WAF (AWS WAF, Cloudflare, F5) in front of all public-facing applications in the CDE. Enable OWASP Core Rule Set.', effort:'medium', timeframe:'1–2 weeks' },
    ],
  },
  {
    id: '6.5.1', requirement: 'req_6_secure_development', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Change Management Process for System Components',
    description: 'Changes to all system components are managed securely.',
    objective: 'All changes to CDE components are authorized, tested, and reviewed before deployment.',
    guidance: ['Document change management policy','Test changes in non-production first','Require approval before production deployment','Maintain rollback procedures','Separate development/test from production environments'],
    evidenceExamples: ['Change management policy','Change approval tickets for recent deployments','Separate dev/prod environment evidence','Rollback procedure documentation'],
    staticRemediation: [
      { order:1, title:'Implement Change Management Workflow', description:'Require documented approval for all CDE changes. Mandate dev/test environment validation before production.', effort:'medium', timeframe:'2 weeks' },
      { order:2, title:'Separate Dev/Test from Production', description:'Ensure development and test environments are completely separate from production. No production data in dev/test.', effort:'high', timeframe:'3–4 weeks' },
    ],
  },

  // ── REQ 7: Restrict Access ────────────────────────────────────────────────
  {
    id: '7.2.1', requirement: 'req_7_restrict_access', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Access Control Model for Cardholder Data',
    description: 'An access control model is defined and includes granting access based on need-to-know and least privilege.',
    objective: 'Implement a formal access control model — all access to CHD requires documented business justification.',
    guidance: ['Document access control policy','All access to CHD must have documented business need','Deny by default; allow by exception','Access reviewed at least every 6 months'],
    evidenceExamples: ['Access control policy','Role definitions with justifications for CHD access','6-month access review records'],
    staticRemediation: [
      { order:1, title:'Define CHD Access Roles', description:'Document every role that requires access to cardholder data with the specific business justification. Implement deny-by-default.', effort:'medium', timeframe:'2 weeks' },
      { order:2, title:'6-Month Access Review', description:'Review all CHD access every 6 months. Remove any access that is no longer justified.', effort:'medium', timeframe:'Ongoing' },
    ],
  },
  {
    id: '7.2.4', requirement: 'req_7_restrict_access', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'User Account Reviews',
    description: 'All user accounts and related access privileges are reviewed at least once every six months.',
    objective: 'Formally review all user accounts with access to CHD systems every 6 months.',
    guidance: ['Review ALL accounts — not just admin','Verify access is still required','Remove inappropriate access promptly','Document review with manager sign-off'],
    evidenceExamples: ['6-month user access review spreadsheet with manager sign-offs','Account removal records for departed staff'],
    staticRemediation: [
      { order:1, title:'Schedule 6-Month Access Reviews', description:'Implement a formal 6-month user access review process where system owners certify all user access. Document results.', effort:'medium', timeframe:'1 week setup' },
    ],
  },
  {
    id: '7.3.1', requirement: 'req_7_restrict_access', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Access Control System for All System Components',
    description: 'An access control system is in place that restricts access based on a user\'s need to know and denies all access by default.',
    objective: 'Use a technical access control system enforcing least privilege for all CHD access.',
    guidance: ['Implement RBAC or equivalent','Access control system covers all in-scope components','Default deny for all access','Access control system generates logs'],
    evidenceExamples: ['RBAC configuration','Access control system logs showing denied access attempts','Default deny evidence'],
    staticRemediation: [
      { order:1, title:'Implement RBAC for CDE', description:'Define roles for each CDE component and assign permissions based on documented need-to-know. Enforce technically via IAM/RBAC.', effort:'high', timeframe:'3–4 weeks' },
    ],
  },

  // ── REQ 8: Identify Users and Authenticate Access ─────────────────────────
  {
    id: '8.2.1', requirement: 'req_8_authentication', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Unique User IDs for All Users',
    description: 'All users are assigned a unique ID before accessing system components or cardholder data.',
    objective: 'Ensure every user has a unique identifier — no shared accounts.',
    guidance: ['No shared accounts allowed — ever','Generic accounts (admin, root, guest) must be disabled or renamed','Service accounts must be named and controlled','Each user accountable via unique ID'],
    evidenceExamples: ['User account inventory showing all unique IDs','No shared credentials policy','Disabled generic accounts evidence'],
    staticRemediation: [
      { order:1, title:'Eliminate Shared Accounts', description:'Audit all systems for shared accounts. Create individual accounts for each user. Disable or remove all shared accounts.', effort:'high', timeframe:'2–3 weeks' },
    ],
  },
  {
    id: '8.3.6', requirement: 'req_8_authentication', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Password Complexity Requirements',
    description: 'Passwords/passphrases for user accounts meet a minimum length of at least 12 characters (or if the system does not support 12 characters, a minimum length of 8 characters).',
    objective: 'Enforce strong password requirements for all CDE user accounts.',
    guidance: ['Minimum 12 characters','Include numeric and alphabetic characters','Change passwords at least every 90 days (unless risk-based approach with compensating controls)','Passwords not the same as the last 4 passwords'],
    evidenceExamples: ['Password policy configuration screenshots','Password complexity enforcement evidence from all systems'],
    staticRemediation: [
      { order:1, title:'Configure Password Policy on All Systems', description:'Set minimum 12-char passwords with numeric and alphabetic characters on every CDE system. Enforce history of last 4 passwords.', effort:'medium', timeframe:'1 week' },
    ],
  },
  {
    id: '8.4.2', requirement: 'req_8_authentication', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'MFA for All Access into CDE',
    description: 'MFA is implemented for all access into the CDE.',
    objective: 'Require multi-factor authentication for every user accessing the cardholder data environment.',
    guidance: ['MFA required for ALL CDE access — not just remote','Applies to all personnel including admins','Second factor must be separate from first factor','TOTP, hardware tokens, push notification all acceptable'],
    evidenceExamples: ['MFA configuration screenshots for all CDE access paths','100% MFA coverage report','User list showing all have MFA enrolled'],
    staticRemediation: [
      { order:1, title:'Enforce MFA for All CDE Access', description:'Configure MFA for every authentication path into the CDE. No exceptions, including for administrators accessing from internal network.', effort:'medium', timeframe:'1–2 weeks' },
    ],
  },
  {
    id: '8.6.1', requirement: 'req_8_authentication', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'System/Application Accounts Managed via Policies',
    description: 'Use of application and system accounts is strictly managed.',
    objective: 'Manage all non-human accounts (service accounts, application accounts) with the same rigor as user accounts.',
    guidance: ['Document all service accounts','Service accounts only used for intended function','Passwords/keys rotated at least every 90 days','Interactive login disabled for service accounts where possible'],
    evidenceExamples: ['Service account inventory','Rotation schedule and records','Interactive login disabled configuration'],
    staticRemediation: [
      { order:1, title:'Service Account Inventory and Controls', description:'Document all service accounts. Disable interactive login. Rotate credentials at least every 90 days using a secrets manager.', effort:'medium', timeframe:'2–3 weeks' },
    ],
  },

  // ── REQ 9: Restrict Physical Access ──────────────────────────────────────
  {
    id: '9.1.1', requirement: 'req_9_physical_access', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Physical Security Controls Policy',
    description: 'Security policies and operational procedures for restricting physical access to cardholder data are documented.',
    objective: 'Maintain documented physical security policies and procedures.',
    guidance: ['Document physical access controls for all CDE locations','Procedures for granting, revoking, and reviewing physical access','Annual review required'],
    evidenceExamples: ['Physical security policy','Annual review record'],
    staticRemediation: [
      { order:1, title:'Document Physical Security Policy', description:'Create a physical security policy covering access controls, visitor management, and media handling for all CDE locations.', effort:'medium', timeframe:'1 week' },
    ],
  },
  {
    id: '9.2.1', requirement: 'req_9_physical_access', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Appropriate Physical Access Controls',
    description: 'Appropriate physical access controls manage entry into facilities containing the CDE.',
    objective: 'Implement badge/keycard access controls with logging for all CDE facilities.',
    guidance: ['Electronic badge/keycard access with audit logs','Visitors escorted at all times','Visitor access logs maintained for at least 3 months','Regular review of who has access'],
    evidenceExamples: ['Badge access system configuration','90-day visitor log','Physical access review records'],
    staticRemediation: [
      { order:1, title:'Implement Electronic Access Control', description:'Deploy badge/keycard readers with logging at all CDE entry points. Maintain visitor logs for 90 days.', effort:'high', timeframe:'2–4 weeks' },
    ],
  },
  {
    id: '9.4.5', requirement: 'req_9_physical_access', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Electronic Media Destruction',
    description: 'Electronic media with cardholder data is destroyed when no longer needed for business or legal reasons.',
    objective: 'Securely destroy all electronic media containing CHD when no longer needed.',
    guidance: ['Cross-cut shredding, degaussing, or incineration for physical media','Cryptographic erasure or physical destruction for digital media','Document all destruction','No dumpster-diving risk'],
    evidenceExamples: ['Media destruction policy','Certificates of destruction','Destruction log with dates and media descriptions'],
    staticRemediation: [
      { order:1, title:'Media Destruction Policy and Process', description:'Implement a formal media destruction process using NIST 800-88 methods. Use a certified ITAD vendor and obtain destruction certificates.', effort:'medium', timeframe:'1–2 weeks' },
    ],
  },

  // ── REQ 10: Log and Monitor All Access ────────────────────────────────────
  {
    id: '10.2.1', requirement: 'req_10_logging_monitoring', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Audit Log Events',
    description: 'Audit logs capture all individual user access to cardholder data, all actions taken by root/admin, invalid logical access attempts, use of identification/authentication mechanisms, initialization/stopping/pausing of audit logs, and creation/deletion of system-level objects.',
    objective: 'Log all security-relevant events across every CDE component.',
    guidance: ['Log all user access to CHD','Log all admin actions','Log failed access attempts','Log all audit log changes','Log all system changes','Timestamp all events with synchronized time'],
    evidenceExamples: ['Sample logs showing all required event types','SIEM or log aggregation configuration','NTP synchronization configuration'],
    staticRemediation: [
      { order:1, title:'Enable Comprehensive Logging', description:'Configure every CDE system to log: all CHD access, admin actions, failed logins, log changes, and system changes. Feed to centralized SIEM.', effort:'high', timeframe:'2–3 weeks' },
      { order:2, title:'Synchronize Time (NTP)', description:'Configure NTP on all CDE systems pointing to reliable time sources. Log time synchronization events.', effort:'low', timeframe:'1 day' },
    ],
  },
  {
    id: '10.3.2', requirement: 'req_10_logging_monitoring', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Audit Logs Protected from Destruction',
    description: 'Audit log files are protected from unauthorized modifications.',
    objective: 'Prevent tampering, modification, or deletion of audit logs.',
    guidance: ['Logs cannot be modified or deleted by regular users','Separate log servers or write-once storage','Integrity checking on logs','Alerts if log collection fails'],
    evidenceExamples: ['Log storage write-once configuration','Restricted access to logs','Alert for log collection failure','Integrity monitoring for logs'],
    staticRemediation: [
      { order:1, title:'Write-Once Log Storage', description:'Configure log storage as append-only or WORM (e.g., S3 Object Lock). Restrict delete permissions to a dedicated log admin role only.', effort:'medium', timeframe:'1 week' },
    ],
  },
  {
    id: '10.4.1', requirement: 'req_10_logging_monitoring', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Daily Log Review for Critical Logs',
    description: 'The following are reviewed at least once daily: all security events; logs of all system components that store, process, or transmit CHD.',
    objective: 'Review critical logs daily to detect anomalies and potential compromises.',
    guidance: ['Daily log review for all CHD-system logs and security events','Automated review tools (SIEM) preferred','Document all daily reviews','Escalate anomalies per incident response plan'],
    evidenceExamples: ['Daily log review records (SIEM dashboard screenshots, review log)','Alert rules for automated detection','30-day history of daily review completion'],
    staticRemediation: [
      { order:1, title:'Implement Automated Daily Log Review', description:'Configure SIEM with correlation rules to automatically alert on anomalies daily. Create a daily review dashboard for the security team. Document each daily review.', effort:'high', timeframe:'3–4 weeks' },
    ],
  },
  {
    id: '10.5.1', requirement: 'req_10_logging_monitoring', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Audit Log Retention — 12 Months',
    description: 'Retain audit log history for at least 12 months, with at least three months immediately available for analysis.',
    objective: 'Retain logs for 12 months — 3 months online, 12 months total.',
    guidance: ['3 months immediately accessible (hot/warm storage)','12 months total retention','Secure storage for all retained logs','Access logs must be retrievable quickly for forensics'],
    evidenceExamples: ['Log retention configuration showing 3-month hot + 12-month total','Storage policy documentation'],
    staticRemediation: [
      { order:1, title:'Configure 3-Month Online / 12-Month Total Retention', description:'Set log retention: 3 months in searchable storage (CloudWatch, Splunk), archive to cold storage for 9 more months to reach 12-month total.', effort:'low', timeframe:'1 day' },
    ],
  },

  // ── REQ 11: Test Security Regularly ──────────────────────────────────────
  {
    id: '11.3.1', requirement: 'req_11_security_testing', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'External Vulnerability Scanning — Quarterly',
    description: 'Internal and external vulnerability scans are performed quarterly and after any significant change. External scans must be performed by a PCI SSC Approved Scanning Vendor (ASV).',
    objective: 'Run quarterly external vulnerability scans by a PCI-approved ASV.',
    guidance: ['External scans by ASV quarterly','Pass requirements: no high-severity vulns unresolved','Rescans after significant changes','Retain scan results and pass documentation'],
    evidenceExamples: ['ASV scan reports (4 consecutive quarters, all passing)','ASV attestation letters','Rescan reports after changes'],
    staticRemediation: [
      { order:1, title:'Engage a PCI-Approved ASV', description:'Select an ASV from the PCI SSC list (qualys.com, rapid7.com, trustwave.com etc.). Schedule quarterly scans and obtain passing results.', effort:'high', timeframe:'2–4 weeks to engage' },
      { order:2, title:'Remediate All High/Critical Findings', description:'ASV scans must pass — no unresolved high or critical vulnerabilities. Remediate all findings before the next scan.', effort:'high', timeframe:'As needed' },
    ],
  },
  {
    id: '11.3.2', requirement: 'req_11_security_testing', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Internal Vulnerability Scanning — Quarterly',
    description: 'Internal vulnerability scans are performed quarterly and after significant changes. Vulnerabilities are addressed per Req 6.3.1.',
    objective: 'Run authenticated internal vulnerability scans quarterly across all in-scope systems.',
    guidance: ['Authenticated scans required','Quarterly at minimum','After any significant change','All high-risk vulnerabilities resolved before next scan'],
    evidenceExamples: ['Quarterly internal scan reports','Remediation evidence for critical/high findings','Authenticated scan configuration evidence'],
    staticRemediation: [
      { order:1, title:'Quarterly Internal Vulnerability Scans', description:'Schedule authenticated internal scans on all in-scope systems quarterly using Tenable, Qualys, or Rapid7. Remediate high/critical findings before the next scan.', effort:'high', timeframe:'1–2 weeks to set up' },
    ],
  },
  {
    id: '11.4.1', requirement: 'req_11_security_testing', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Penetration Testing — Annual',
    description: 'Penetration testing methodology is defined, and a penetration test is performed at least once every 12 months and after any significant change.',
    objective: 'Commission an annual penetration test of the CDE by a qualified internal or external tester.',
    guidance: ['Annual external pen test of CDE boundary','Annual internal pen test of CDE','After significant changes or infrastructure updates','Qualified tester with relevant certifications (OSCP, CEH, GPEN)','Must test application layer and network layer'],
    evidenceExamples: ['Annual penetration test report','Tester qualifications','Remediation evidence for exploitable findings','Restest confirmation'],
    staticRemediation: [
      { order:1, title:'Commission Annual Penetration Test', description:'Engage a qualified pen tester (OSCP/GPEN certified). Test both network and application layers of the CDE. Remediate all exploitable findings.', effort:'high', timeframe:'4–6 weeks' },
    ],
  },
  {
    id: '11.5.1', requirement: 'req_11_security_testing', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Intrusion Detection System (IDS/IPS)',
    description: 'Intrusion-detection and/or intrusion-prevention techniques are used to detect and/or prevent intrusions into the network.',
    objective: 'Deploy IDS/IPS to detect and alert on network intrusions into the CDE.',
    guidance: ['IDS/IPS monitoring all traffic at CDE perimeter','Alerts routed to security team','Rules/signatures kept current','Monitored 24/7 or with defined response times'],
    evidenceExamples: ['IDS/IPS deployment and configuration','Alert rule configuration','Recent alert log showing monitoring activity','Signature update records'],
    staticRemediation: [
      { order:1, title:'Deploy IDS/IPS for CDE', description:'Implement network IDS/IPS at the CDE perimeter. Configure alerting to the security team. Keep signatures updated.', effort:'high', timeframe:'3–4 weeks' },
    ],
  },

  // ── REQ 12: Support Information Security ─────────────────────────────────
  {
    id: '12.1.1', requirement: 'req_12_security_policy', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Comprehensive Information Security Policy',
    description: 'An overall information security policy is established, published, maintained, and disseminated to all relevant personnel.',
    objective: 'Maintain a comprehensive, published information security policy covering all PCI DSS areas.',
    guidance: ['Covers all PCI DSS areas and requirements','Annual review and update','Published and disseminated to all staff','Approved by executive management'],
    evidenceExamples: ['Information Security Policy document','Annual review record','Dissemination evidence (email, intranet)','Executive approval'],
    staticRemediation: [
      { order:1, title:'Create Comprehensive Information Security Policy', description:'Draft an ISP covering all PCI DSS control areas. Get executive approval. Publish to all staff and collect acknowledgments.', effort:'high', timeframe:'2–3 weeks' },
    ],
  },
  {
    id: '12.3.1', requirement: 'req_12_security_policy', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Targeted Risk Analysis',
    description: 'A targeted risk analysis is performed for each PCI DSS requirement that provides flexibility for how frequently it is performed.',
    objective: 'Perform and document formal risk analysis to support PCI DSS control decisions.',
    guidance: ['Annual targeted risk analysis for each applicable PCI DSS control','Identifies specific assets, threats, and mitigations','Approved by executive management','Retained for audit'],
    evidenceExamples: ['Risk analysis documentation','Annual review records','Management approval','Risk register with PCI-specific risks'],
    staticRemediation: [
      { order:1, title:'Conduct Annual Targeted Risk Analysis', description:'Perform a formal risk analysis covering all in-scope PCI DSS requirements. Document assets, threats, current controls, and residual risk.', effort:'high', timeframe:'3–4 weeks' },
    ],
  },
  {
    id: '12.5.2', requirement: 'req_12_security_policy', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'PCI DSS Scope Documented and Validated Annually',
    description: 'PCI DSS scope is documented and confirmed at least once every 12 months.',
    objective: 'Formally document, validate, and confirm the PCI DSS scope annually.',
    guidance: ['All in-scope systems identified','Connected-to systems and systems impacting security documented','Scope confirmed with QSA or internal team annually','Scope changes trigger a scope review'],
    evidenceExamples: ['Annual scope confirmation document','CDE network diagram','Data flow diagram showing CHD flows','Scope review sign-off'],
    staticRemediation: [
      { order:1, title:'Document and Confirm CDE Scope', description:'Create a network diagram and data flow diagram showing all CHD flows. Identify every in-scope system. Have the CISO confirm scope annually.', effort:'high', timeframe:'2–3 weeks' },
    ],
  },
  {
    id: '12.6.1', requirement: 'req_12_security_policy', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Formal Security Awareness Program',
    description: 'A formal security awareness program is implemented to make all personnel aware of the entity\'s information security policy and procedures.',
    objective: 'Run an ongoing security awareness program covering PCI DSS requirements.',
    guidance: ['Training at hire and annually thereafter','Must cover threats relevant to cardholder data','Include PCI DSS-specific content','Track completion records'],
    evidenceExamples: ['Security awareness training content','Completion records for all staff','Annual training schedule','PCI DSS-specific training topics'],
    staticRemediation: [
      { order:1, title:'Implement PCI-Focused Security Awareness Training', description:'Add PCI DSS-specific topics to your security awareness training: what CHD is, how to protect it, phishing awareness, and how to report incidents.', effort:'medium', timeframe:'2–3 weeks' },
    ],
  },
  {
    id: '12.8.1', requirement: 'req_12_security_policy', severity: 'high', applicableTo: ['merchant','service_provider'],
    title: 'Third-Party Service Provider (TPSP) Management Policy',
    description: 'A policy is implemented for engaging TPSPs including a list of all TPSPs and monitoring of their PCI DSS compliance.',
    objective: 'Manage all third-party vendors that touch or could impact cardholder data.',
    guidance: ['Maintain list of all TPSPs with description of services','Confirm TPSP PCI DSS compliance annually (AOC or equivalent)','Written agreements stating TPSPs will protect CHD','Defined process for engaging new TPSPs'],
    evidenceExamples: ['TPSP inventory list','TPSP AOCs or PCI DSS compliance attestations','Written contracts with security requirements','Annual compliance confirmation records'],
    staticRemediation: [
      { order:1, title:'Create TPSP Inventory', description:'List all third-party vendors that store, process, or transmit CHD or that could impact CDE security. Collect current AOC (Attestation of Compliance) from each.', effort:'medium', timeframe:'2–3 weeks' },
      { order:2, title:'Annual TPSP Compliance Monitoring', description:'Annually confirm each TPSP is still PCI DSS compliant. Obtain updated AOC or equivalent attestation.', effort:'medium', timeframe:'Ongoing' },
    ],
  },
  {
    id: '12.10.1', requirement: 'req_12_security_policy', severity: 'critical', applicableTo: ['merchant','service_provider'],
    title: 'Incident Response Plan for PCI DSS',
    description: 'An incident response plan exists and is ready to be activated in the event of a system breach.',
    objective: 'Maintain a tested incident response plan specifically addressing cardholder data breaches.',
    guidance: ['IRP must specifically address CHD breach scenarios','Cover: detection, containment, eradication, notification, recovery','Include payment brand notification procedures (Visa, Mastercard)','Test annually via tabletop exercise','Legal/forensics contacts included'],
    evidenceExamples: ['PCI-specific Incident Response Plan','Payment brand contact information','Annual tabletop exercise records','Legal and forensics vendor contacts'],
    staticRemediation: [
      { order:1, title:'Create PCI-Specific Incident Response Plan', description:'Update or create an IRP with PCI-specific scenarios: CHD breach, card data theft, unauthorized access to CDE. Include card brand notification procedures.', effort:'medium', timeframe:'2–3 weeks' },
      { order:2, title:'Annual IRP Test', description:'Conduct an annual tabletop exercise simulating a cardholder data breach. Include card brand notification steps.', effort:'medium', timeframe:'1–2 days' },
    ],
  },
  // Service provider specific
  {
    id: '12.4.1', requirement: 'req_12_security_policy', severity: 'high', applicableTo: ['service_provider'],
    title: 'PCI DSS Compliance Managed Throughout the Year (Service Providers)',
    description: 'Responsibility for protection of cardholder data and a PCI DSS compliance program is assigned to a Chief Information Security Officer or other security-knowledgeable member of executive management.',
    objective: 'Service providers must have executive ownership of PCI DSS compliance.',
    guidance: ['Named executive owns PCI DSS compliance','Documented program for maintaining compliance year-round','Quarterly reporting to executive management','Evidence of ongoing compliance activities'],
    evidenceExamples: ['Named CISO or exec responsible for PCI DSS','Quarterly compliance reports to leadership','Year-round compliance activity log'],
    staticRemediation: [
      { order:1, title:'Assign Executive PCI DSS Ownership', description:'Formally designate the CISO or equivalent as responsible for PCI DSS compliance. Document this in writing and create quarterly reporting cadence to leadership.', effort:'low', timeframe:'3 days' },
    ],
  },
];

// Merge examples
for (const control of PCI_DSS_CONTROLS) {
  const ex = PCI_DSS_EXAMPLES[control.id];
  if (ex) control.example = ex;
}

export function getPCIControlsByRequirement(req: PCIRequirement): PCIDSSControl[] {
  return PCI_DSS_CONTROLS.filter(c => c.requirement === req);
}

export function getPCIControlById(id: string): PCIDSSControl | undefined {
  return PCI_DSS_CONTROLS.find(c => c.id === id);
}

export function getPCIControlsForEntityType(type: PCIEntityType): PCIDSSControl[] {
  return PCI_DSS_CONTROLS.filter(c => c.applicableTo.includes(type));
}
