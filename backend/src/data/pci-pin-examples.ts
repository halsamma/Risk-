import { ControlExample } from './soc2-controls';

export const PCI_PIN_EXAMPLES: Record<string, ControlExample> = {

  'MGMT-1': {
    scenario: 'PaySecure Corp maintains a PIN Security Policy (v2.3, signed by the CRO on January 8). The policy references PCI PIN v3.1 requirements, covers all six domains, and is reviewed each January. All PIN operations staff receive the policy at onboarding and sign an acknowledgment. Policy changes are communicated within 5 business days via email to all PIN personnel.',
    evidence: 'PIN Security Policy PDF with CRO signature, version number, and date. Annual review calendar entry with completion sign-off. Staff acknowledgment records from HR system.',
    quickWin: 'Copy your existing Information Security Policy. Add a section titled "PIN Security" referencing PCI PIN v3.1. List your six control domains. Get the CISO or CRO to sign it. That\'s a compliant PIN security policy in under 2 hours.',
  },

  'MGMT-2': {
    scenario: 'TransactPay Inc. formally designated a PIN Security Officer (PSO) with a signed appointment letter. A PIN security RACI matrix in Confluence maps every PCI PIN requirement to a named owner. Four key custodians signed formal designation letters accepting their responsibilities for ZMK component custody. The PSO reports directly to the CRO and presents monthly to the risk committee.',
    evidence: 'PSO appointment letter with signature. PIN security RACI matrix. Four key custodian designation letters. Org chart showing PSO reporting line. Monthly risk committee meeting minutes referencing PIN security.',
    quickWin: 'Draft a one-paragraph letter: "Effective [date], [Name] is designated as PIN Security Officer responsible for [your organization]\'s PCI PIN security program." Get it signed by the CEO. That\'s your PSO designation — done in 15 minutes.',
  },

  'MGMT-3': {
    scenario: 'CardProcessor LLC requires criminal and credit background checks for all personnel before access to PIN systems or keys. The background check uses a third-party screener (HireRight). All 12 PIN operations staff were screened before initial assignment. Key custodians are rescreened every 3 years. When one custodian resigned, access was revoked within 2 hours and a new custodian was designated and screened within 30 days.',
    evidence: 'Personnel screening policy for PIN roles. Background check completion records for all PIN personnel (redacted for privacy). 3-year rescreening calendar. Termination access revocation records with timestamps.',
    quickWin: 'For your current PIN operations staff, document that background checks were performed (even commercial checks through HireRight or Checkr). Create a spreadsheet: Name | Role | Check Date | Check Type. This is your initial PIN personnel screening inventory.',
  },

  'MGMT-4': {
    scenario: 'KeyVault Payments runs a 4-hour "PIN Security Fundamentals" training for all new PIN personnel before initial assignment. The curriculum covers: identifying tampered PEDs, key ceremony procedures, social engineering awareness, and incident reporting. Key custodians receive an additional 2-hour "Key Management Deep Dive" covering split knowledge, dual control, and HSM operation. LMS completion rates: 100% for current staff.',
    evidence: 'Training curriculum documents. LMS completion report with dates for all PIN personnel. Role-specific training matrix showing who needs what training. 3-year archived training records.',
    quickWin: 'Create a 30-minute "PIN Security Essentials" document covering: what a tampered PED looks like, never reveal your key component to anyone, report suspicious activity immediately, and your incident reporting contact. Require all PIN staff to read and sign it. That\'s a compliant first training.',
  },

  'MGMT-6': {
    scenario: 'Merchant Services Corp maintains a PED inventory in ServiceNow with 247 deployed devices. Each record shows: serial number, manufacturer, model, PCI PTS approval number, firmware version, deployment location, assigned merchant, and last physical inspection date. When a device is deployed or relocated, inventory is updated within 24 hours. Annual physical reconciliation in Q1 found zero discrepancies last year.',
    evidence: 'ServiceNow PED inventory export. PCI SSC approval list cross-reference for all devices. Annual reconciliation report. Device change log showing 24-hour update compliance.',
    quickWin: 'Open a spreadsheet. List every PED: Serial Number | Model | PCI SSC Approval Number | Location | Last Inspection Date. Go to pcisecuritystandards.org/approved_companies_providers and verify each device model is on the Approved PTS POI list. That\'s a compliant starter inventory.',
  },

  'MGMT-7': {
    scenario: 'TechPay Corp decommissions PEDs by triggering the manufacturer\'s zeroization command sequence via a pinpad test utility, verified by two key custodians who sign the decommission form. A serial number photo is taken before and after zeroization. The form is scanned and filed for 3 years. Hardware is returned to the manufacturer with a chain-of-custody document.',
    evidence: 'Device decommission procedure. Last 12 decommission records with dual custodian signatures. Serial number photos. Chain-of-custody documents. 3-year record retention evidence.',
    quickWin: 'Look up your PED manufacturer\'s decommissioning guide (e.g., Verifone, Ingenico, PAX all publish these). Create a one-page checklist: (1) Trigger zeroization, (2) Verify no key material remains, (3) Update inventory, (4) Two custodians sign the form, (5) File record. That\'s a compliant decommission procedure.',
  },

  'PHYS-1': {
    scenario: 'RetailPay installed anti-theft cable locks on all attended checkout PEDs and locked enclosures for all unattended kiosk PEDs. Tamper-evident PCI security labels are applied to the battery compartments and port covers. Staff complete a daily visual inspection checklist before opening. CCTV cameras cover all PED locations with 90-day footage retention. In Q3, one PED showed a disturbed security label — it was immediately removed and reported.',
    evidence: 'Physical security policy for PEDs. Daily inspection checklist forms (last 90 days). Tamper-evident label application records and photos. CCTV coverage map. Q3 tamper incident report.',
    quickWin: 'Print a one-page "Daily PED Inspection Checklist": (1) Check for unusual attachments on card slot. (2) Verify tamper-evident seal is intact. (3) Check keypad for abnormalities. (4) Verify device serial number matches inventory. Require staff to complete it before opening daily.',
  },

  'PHYS-2': {
    scenario: 'GasPay Corp\'s tamper response procedure states: if tampering is suspected, the attendant immediately powers off the PED and contacts the supervisor. The supervisor removes the device from service and calls the PSO. The PSO logs the incident, quarantines the device in a sealed evidence bag, notifies the acquirer within 4 hours, and the acquirer notifies Visa/Mastercard. In 2 years of operation, one tamper incident was handled per this procedure.',
    evidence: 'Tamper detection and response procedure. One tamper incident record showing: detection time, device removal time, PSO notification time, acquirer notification time. Training records showing staff were trained on tamper recognition.',
    quickWin: 'Write a laminated card for every PED location: "If you see ANYTHING unusual about this device — call [name/number] IMMEDIATELY. Do NOT use the device. Do NOT try to fix it." Tape it near each PED. That visual instruction is your tamper response procedure evidence.',
  },

  'PHYS-3': {
    scenario: 'SecureKeyLoad LLC performs all key injection in a dedicated 15-square-meter room with badge-only access limited to 4 authorized key custodians. CCTV covers the entire room with 90-day retention. During a key injection session, at least two custodians are present and each logs their identity in the key injection record. The room has no WiFi and all network cables are disconnected during key ceremonies.',
    evidence: 'Key loading facility access log (badge entry). CCTV configuration for the facility. Key injection records showing two custodian signatures per session. Network disconnection checklist. Access list showing only 4 authorized custodians.',
    quickWin: 'Designate any room with a lock as your key loading area. Install a badge reader or key lock. Create a log book: Date | Time | Custodian 1 | Custodian 2 | Key Type | Operation. Require two signatures for every key loading entry. That\'s a compliant key loading facility for initial assessment.',
  },

  'KM-1': {
    scenario: 'AcquireFirst Bank maintains a Key Inventory Register listing: 3 ZMK components (AES-256, valid for 2 years, held by separate custodians), 8 ZPK keys (AES-128, annual rotation), 1 master BDK (AES-256, 3-year life), and 4 KEKs (AES-256). Each entry shows creation date, expiry date, algorithm, HSM slot, and custodian names. The inventory is audited quarterly by the PSO.',
    evidence: 'Key Management Policy covering all key types. Key Inventory Register with required fields. Quarterly inventory audit records. Algorithm compliance verification (AES-256 for master keys, AES-128 minimum for working keys).',
    quickWin: 'Create a spreadsheet: Key Name | Type (ZMK/ZPK/KEK/BDK) | Algorithm | Key Length | Creation Date | Expiry Date | Custodian(s) | Storage (HSM slot). Fill in all your active keys. That\'s your key inventory — one of the most important artifacts for a PCI PIN assessment.',
  },

  'KM-2': {
    scenario: 'PayCrypt Corp uses a Thales payShield 10K HSM (FIPS 140-2 Level 3 validated, certificate #3982) for all key generation. Key generation ceremonies require two of four designated custodians to present their physical smart card tokens. The HSM logs every generation event with timestamp, operator IDs, and key reference. Key generation records are signed by both custodians and retained for 7 years.',
    evidence: 'Thales payShield 10K FIPS 140-2 validation certificate. HSM key generation logs. Key generation records with dual custodian signatures. Smart card token inventory for authorized custodians.',
    quickWin: 'Verify your HSM appears on the NIST CMVP list at csrc.nist.gov/projects/cryptographic-module-validation-program. Search by vendor name (Thales, Utimaco, Safenet, etc.). Screenshot the entry showing "Level 3" validation. That\'s your KM-2 HSM qualification evidence.',
  },

  'KM-3': {
    scenario: 'SwitchPay Inc. migrated all key exchange to TR-31 key blocks in Q2. The TR-31 block header cryptographically binds the key type (ZPK, not usable as KEK) to the key value, preventing misuse. Key components are split into three parts, each delivered by a different courier to three separate custodians. No single person ever has access to a complete key outside the HSM.',
    evidence: 'TR-31 key block implementation documentation. HSM TR-31 configuration. Split key ceremony records with three custodian signatures. Courier delivery confirmations for each component. No-single-person-key-access policy.',
    quickWin: 'If you\'re still using legacy key exchange formats, contact your HSM vendor (Thales, Utimaco, etc.) about enabling TR-31 key block support. Get a quote. Document that TR-31 migration is on your roadmap with a target date. That\'s your gap acknowledgment with remediation plan.',
  },

  'KM-4': {
    scenario: 'VaultKey Corp stores all PIN keys in their Utimaco SecurityServer HSM. Master keys are in the HSM\'s internal battery-backed memory — never exported. Working keys are stored encrypted under KEKs within the HSM. An application configuration audit confirmed zero instances of cryptographic keys in config files, databases, or environment variables. The HSM generates a log entry every time a key is used or accessed.',
    evidence: 'HSM specification showing key storage in FIPS-protected memory. Application configuration scan results showing no cleartext keys. HSM key access audit logs. Key storage policy document.',
    quickWin: 'Run a grep search across all your application configs and code: grep -r "-----BEGIN\|SECRET\|PRIVATE KEY\|ZMK\|ZPK" /path/to/app. If any cryptographic keys appear in config files, those are critical findings. Document the search and its results as your cleartext key audit.',
  },

  'KM-5': {
    scenario: 'KeyLife Payments enforces automatic key expiry: ZPKs rotate every 12 months, ZMKs every 24 months, BDKs every 36 months. The HSM management system sends 60-day advance warnings. Key retirement events require two custodians to execute the HSM zeroization command. Both custodians sign a Key Destruction Certificate. Certificates are scanned and retained in a restricted SharePoint folder for 7 years.',
    evidence: 'Key cryptoperiod policy document. HSM key expiry configuration. Last 6 Key Destruction Certificates with dual custodian signatures. 7-year retention configuration. Key rotation log for last 2 years.',
    quickWin: 'Check the creation date of each key in your inventory. Calculate: are any past their maximum life (ZPK > 1 year, ZMK > 2 years, BDK > 3 years)? If yes, schedule immediate replacement. This analysis IS your key retirement control in action — document the exercise.',
  },

  'KM-6': {
    scenario: 'PayGuard Corp\'s key compromise response was triggered when unusual transaction volumes suggested a possible ZPK compromise. Within 2 hours: the potentially compromised ZPK was quarantined in the HSM; a replacement ZPK was generated under dual control; Visa was notified per their FRAUD reporting process; and a forensic investigation was initiated. The compromise was ruled inconclusive but the key was replaced as a precaution. Total response time: 4 hours 12 minutes.',
    evidence: 'Key Compromise Response Plan. Incident ticket showing timeline. HSM log showing key quarantine and replacement. Visa notification confirmation email. Forensic investigation report.',
    quickWin: 'Add one page to your Incident Response Plan: "If key compromise is suspected: (1) Immediately quarantine the key in HSM (do not delete yet — preserve for forensics). (2) Generate replacement key under dual control. (3) Notify PSO and CRO within 1 hour. (4) Notify [acquirer/card brand] within 4 hours. (5) Open forensic investigation." That\'s a compliant key compromise procedure.',
  },

  'KM-7': {
    scenario: 'ProcessKey Inc. operates two Thales payShield 9000 HSMs (active-passive cluster). Each HSM has FIPS 140-2 Level 3 certification (certificates on file). HSM admin access requires inserting a physical admin smart card plus a 6-digit PIN — no single card holder can administer the HSM alone. All HSM commands are logged to a syslog server. Firmware updates are verified against Thales\'s digital signature before installation.',
    evidence: 'Thales payShield FIPS 140-2 certificates. HSM admin access log (90 days). HSM firmware update records with digital signature verification. Dual-admin policy for HSM configuration changes. HSM cluster health monitoring dashboard.',
    quickWin: 'Pull the last 30 days of HSM admin access logs. Verify: are all accesses by authorized personnel only? Are there any accesses outside business hours without a change ticket? This review exercise IS your KM-7 monitoring control. Document the findings.',
  },

  'TXN-1': {
    scenario: 'TerminalPay Ltd. deploys only PCI PTS POI-approved devices: Verifone VX520 (PTS 4.x approved) and Ingenico iCT250 (PTS 5.x approved). Both appear on the current PCI SSC approved list. A quarterly check verifies no devices have been added to the "removed from approved" list. Device placement guidelines require PEDs to face the customer (away from staff) to prevent shoulder surfing. Anti-skimming overlays are verified absent at each inspection.',
    evidence: 'PCI SSC approved device list printout for all deployed models. Quarterly approval status check records. Device placement policy. Daily inspection checklist verifying no skimming overlays.',
    quickWin: 'Go to pcisecuritystandards.org, click "Approved PTS POI Devices," search for your PED model. If it appears, screenshot the entry — that\'s your device approval evidence. If it\'s expired, document it as a finding requiring device replacement.',
  },

  'TXN-2': {
    scenario: 'EncryptPay Corp\'s architecture uses AES-128 PIN Encryption Keys (PEKs) unique to each PED, generated within the device during key injection. PINs are formatted as ISO 9564-1 Format 0 PIN blocks before leaving the PED. PIN blocks are immediately processed by the acquirer HSM after receipt — never stored. Transaction processing architecture diagram shows the PIN block path: PED → encrypted channel → HSM → card scheme. No PIN data exists anywhere in the system after processing.',
    evidence: 'PIN encryption architecture diagram. HSM configuration showing PIN block processing and immediate destruction. ISO 9564-1 format specification in integration docs. No-PIN-storage policy with database scan confirmation.',
    quickWin: 'Ask your development team: "Where does the PIN block go after it leaves the PED?" Draw a flow diagram: PED → [point A] → [point B] → HSM → card scheme. Annotate each arrow with the encryption key protecting the PIN block at that step. That diagram is your PIN encryption architecture documentation.',
  },

  'TXN-5': {
    scenario: 'LogClean Corp runs a quarterly automated scan of all transaction log samples using a PAN/PIN detection tool (custom Python script using Luhn algorithm + PIN pattern detection). The last scan of 500,000 log entries found zero PINs and zero full PANs. Transaction IDs reference a token vault. All logs are stored in an S3 bucket with write-once (Object Lock) protection. Access requires a dedicated log-reader role separate from PIN operations.',
    evidence: 'Quarterly log scan reports showing zero PIN/PAN findings. Log scanning tool specification. S3 Object Lock configuration. Log access control policy. Last 4 quarterly scan records.',
    quickWin: 'Pull 100 random transaction log entries. Manually search for: any 4-digit sequences that could be PINs, any 16-digit sequences that could be PANs, and any "PIN=" or "card=" fields. If clean, document the review. If not clean, that\'s a critical finding for immediate remediation.',
  },

  'MON-1': {
    scenario: 'AuditPay Corp configured their Splunk SIEM to ingest HSM syslog, PIN application access logs, and PED management system events. Ninety days of logs are immediately searchable; 12 months total are retained in S3. Splunk alerts on: HSM admin access outside business hours, failed HSM authentication >3 attempts, and key operations without a matching change ticket. The PSO reviews the PIN security dashboard every morning.',
    evidence: 'Splunk data source configuration showing HSM, PIN app, and PED management logs. S3 log retention policy (12 months). Alert rule configuration. PSO daily review log. Sample audit log entries showing all required fields.',
    quickWin: 'Enable syslog export on your HSM (every FIPS-validated HSM supports this). Point it at your SIEM or a log server. Even a text file of HSM events is better than nothing. Document that HSM logging is enabled with a screenshot of the syslog configuration. That\'s your starting point for MON-1.',
  },

  'MON-4': {
    scenario: 'SecurityFirst Payments\'s PIN IRP includes Scenario B: "HSM compromise suspected." Steps: (1) Isolate HSM from network within 15 minutes. (2) Notify PSO and CRO immediately. (3) Activate backup HSM. (4) Notify Visa (compromiseadmin@visa.com) and Mastercard (securityalert@mastercard.com) within 4 hours. (5) Preserve HSM for forensics — do not reset. Their last annual tabletop in Q4 completed Scenario B in 47 minutes, meeting the 1-hour SLA.',
    evidence: 'PIN Incident Response Plan with PCI PIN-specific scenarios. Card brand notification contact list. Annual tabletop exercise report showing 47-minute completion. IRP update based on tabletop findings.',
    quickWin: 'Add these two contacts to your IRP right now: Visa Fraud Control: 1-650-432-7500 (US) and Mastercard Global Security: 1-636-722-7111. Then add a line: "If PIN data compromise is suspected, notify card brands within 4 hours." That\'s the most critical addition to your PIN IRP.',
  },

  'MON-5': {
    scenario: 'AnnualReview Payments completes a structured PIN security review each February. The 3-day review covers: (Day 1) key inventory verification — confirm all keys are within cryptoperiod; (Day 2) policy review — update 3 procedures based on new PCI PIN FAQ guidance; (Day 3) control testing — test 10 controls by sampling evidence. The review produces a written report presented to the CRO, with remediation items tracked in Jira.',
    evidence: 'Annual PIN security review report (last 2 years). Key inventory review records. Policy update history. Control test results. Jira remediation tickets with completion records. CRO sign-off on review.',
    quickWin: 'Schedule a 2-hour "PIN Security Annual Review" meeting for next month. Agenda: (1) Is the key inventory current? (2) Are all policies up to date? (3) Were all PIN security controls met this year? (4) What needs to improve? Document the discussion and decisions. That\'s your first annual PIN security review.',
  },
};
