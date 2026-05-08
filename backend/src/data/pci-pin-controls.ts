import { PCI_PIN_EXAMPLES } from './pci-pin-examples';
import { ControlExample, RemediationStep, Severity } from './soc2-controls';

export type PCIPINDomain =
  | 'management'
  | 'physical_security'
  | 'logical_security'
  | 'key_management'
  | 'transaction_processing'
  | 'monitoring_testing';

export interface PCIPINControl {
  id: string;                   // e.g. "MGMT-1"
  domain: PCIPINDomain;
  title: string;
  description: string;
  objective: string;
  guidance: string[];
  evidenceExamples: string[];
  severity: Severity;
  requirementRef: string;       // Reference to PCI PIN v3.1 requirement section
  staticRemediation: RemediationStep[];
  example?: ControlExample;
}

export const PCI_PIN_DOMAIN_LABELS: Record<PCIPINDomain, { label: string; abbr: string; color: string; description: string }> = {
  management:            { label: 'Management & Administration',      abbr: 'MGMT',  color: '#6366f1', description: 'Policies, procedures, personnel security, and vendor management for PIN operations' },
  physical_security:     { label: 'Physical Security',               abbr: 'PHYS',  color: '#f97316', description: 'Physical protection of PIN entry devices (PEDs) and facilities' },
  logical_security:      { label: 'Logical Security',                abbr: 'LOGIC', color: '#22c55e', description: 'Access control, authentication, hardening, and audit logging for PIN systems' },
  key_management:        { label: 'Cryptographic Key Management',    abbr: 'KM',    color: '#ef4444', description: 'Full lifecycle management of cryptographic keys used in PIN encryption' },
  transaction_processing:{ label: 'Transaction Processing',          abbr: 'TXN',   color: '#f59e0b', description: 'Secure PIN capture, encryption, and transmission during payment transactions' },
  monitoring_testing:    { label: 'Monitoring & Testing',            abbr: 'MON',   color: '#8b5cf6', description: 'Audit logs, security testing, incident response, and continuous monitoring' },
};

export const PCI_PIN_CONTROLS: PCIPINControl[] = [

  // ── MANAGEMENT ────────────────────────────────────────────────────────────
  {
    id: 'MGMT-1', domain: 'management', severity: 'high', requirementRef: 'PCI PIN v3.1 §1.1',
    title: 'PIN Security Policy',
    description: 'A formal PIN security policy is documented, approved by management, disseminated, and reviewed annually.',
    objective: 'Establish management commitment to PIN security through a documented policy.',
    guidance: [
      'Policy must cover all PCI PIN requirement domains',
      'Reviewed and updated at least annually',
      'Signed by senior management or board',
      'Communicated to all personnel involved in PIN processing',
    ],
    evidenceExamples: ['PIN Security Policy document', 'Management approval signature', 'Annual review record', 'Staff acknowledgment records'],
    staticRemediation: [
      { order: 1, title: 'Draft PIN Security Policy', description: 'Create a policy covering: device management, key management, personnel requirements, incident response, and audit requirements for PIN operations.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 2, title: 'Get Executive Sign-Off', description: 'Obtain approval from the CISO or equivalent. Document date of approval.', effort: 'low', timeframe: '3 days' },
    ],
  },
  {
    id: 'MGMT-2', domain: 'management', severity: 'critical', requirementRef: 'PCI PIN v3.1 §1.2',
    title: 'Roles and Responsibilities for PIN Security',
    description: 'Roles and responsibilities for PIN security are clearly defined, documented, and assigned to named individuals.',
    objective: 'Ensure clear accountability for all PIN security functions.',
    guidance: [
      'Define a PIN Security Officer role',
      'Document responsibilities for: device management, key custodian, dual control positions',
      'Publish a PIN security RACI matrix',
      'Maintain succession plans for all critical roles',
    ],
    evidenceExamples: ['PIN security roles and responsibilities document', 'Named individuals for each role', 'Org chart showing PIN security function', 'Key custodian designation letters'],
    staticRemediation: [
      { order: 1, title: 'Designate PIN Security Officer', description: 'Formally designate a PIN Security Officer with documented responsibilities for the PIN security program.', effort: 'low', timeframe: '1 week' },
      { order: 2, title: 'Create Key Custodian Designations', description: 'Formally designate key custodians for all cryptographic key components. Require acceptance letters.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'MGMT-3', domain: 'management', severity: 'critical', requirementRef: 'PCI PIN v3.1 §1.3',
    title: 'Personnel Security and Background Checks',
    description: 'All personnel with access to PIN data, PIN systems, or cryptographic keys undergo background screening appropriate to their risk level.',
    objective: 'Ensure only trustworthy individuals have access to PIN operations.',
    guidance: [
      'Criminal background check required before access to PIN systems or keys',
      'Credit check for personnel with access to cryptographic keys',
      'Re-screening every 3 years for personnel in sensitive roles',
      'Immediate revocation of access upon termination or compromise',
    ],
    evidenceExamples: ['Background check policy', 'Completed background check records for PIN personnel', 'Re-screening schedule', 'Termination access revocation records'],
    staticRemediation: [
      { order: 1, title: 'Implement PIN Personnel Screening', description: 'Require criminal and credit background checks for all personnel with access to PIN systems, PEDs, or cryptographic keys before access is granted.', effort: 'high', timeframe: '3–4 weeks' },
    ],
  },
  {
    id: 'MGMT-4', domain: 'management', severity: 'high', requirementRef: 'PCI PIN v3.1 §1.4',
    title: 'PIN Security Training',
    description: 'All personnel involved in PIN operations receive role-appropriate security training before assignment and annually thereafter.',
    objective: 'Ensure staff understand PIN security responsibilities and recognize security threats.',
    guidance: [
      'Training before initial assignment to PIN-related duties',
      'Annual refresher training required',
      'Role-specific training for key custodians and device managers',
      'Training records retained for minimum 3 years',
      'Training must cover: social engineering, physical security, key handling procedures',
    ],
    evidenceExamples: ['PIN security training curriculum', 'Training completion records with dates', '3-year retention of records', 'Role-specific training materials'],
    staticRemediation: [
      { order: 1, title: 'Develop PIN Security Training Program', description: 'Create role-based training covering: device inspection, key ceremony procedures, social engineering awareness, and incident reporting for PIN operations.', effort: 'medium', timeframe: '2–3 weeks' },
      { order: 2, title: 'Track Completion', description: 'Implement LMS tracking or spreadsheet for all PIN personnel training completions. Retain for 3 years.', effort: 'low', timeframe: '1 week' },
    ],
  },
  {
    id: 'MGMT-5', domain: 'management', severity: 'high', requirementRef: 'PCI PIN v3.1 §1.5',
    title: 'Vendor and Third-Party Management',
    description: 'Third parties involved in PIN processing, key management, or device supply are subject to formal agreements and periodic assessments.',
    objective: 'Ensure third-party vendors meet PCI PIN requirements.',
    guidance: [
      'Contracts must include PCI PIN security requirements',
      'Verify third-party PCI PIN compliance before engagement',
      'Annual review of third-party compliance',
      'Immediate notification required from vendors on security incidents',
    ],
    evidenceExamples: ['Third-party contract with PIN security clauses', 'Vendor PCI PIN compliance evidence', 'Annual vendor review records', 'Incident notification requirements in contracts'],
    staticRemediation: [
      { order: 1, title: 'Update Vendor Contracts', description: 'Ensure all contracts with PIN processing vendors include: PCI PIN compliance requirements, audit rights, incident notification obligations, and right to terminate for non-compliance.', effort: 'medium', timeframe: '2–4 weeks' },
    ],
  },
  {
    id: 'MGMT-6', domain: 'management', severity: 'high', requirementRef: 'PCI PIN v3.1 §1.6',
    title: 'PIN Device Inventory Management',
    description: 'A complete and accurate inventory of all PIN entry devices (PEDs) is maintained and reviewed regularly.',
    objective: 'Track all PIN entry devices throughout their lifecycle.',
    guidance: [
      'Inventory includes: device type, serial number, location, assigned user, firmware version',
      'Updated within 24 hours of device changes (deployment, relocation, decommission)',
      'Physical reconciliation performed at least annually',
      'Devices must be on an approved device list (PCI SSC Approved PTS POI)',
    ],
    evidenceExamples: ['PED inventory spreadsheet or system', 'Annual physical reconciliation report', 'PCI SSC approved device list verification', 'Device change log'],
    staticRemediation: [
      { order: 1, title: 'Create PED Inventory', description: 'Build a complete inventory of all PEDs: serial number, model, PCI approval status, firmware version, location, and responsible custodian.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 2, title: 'Verify PCI SSC Approval', description: 'For each device in inventory, verify it appears on the PCI SSC Approved PTS POI Device list (pcisecuritystandards.org). Flag any non-listed devices.', effort: 'medium', timeframe: '1 week' },
    ],
  },
  {
    id: 'MGMT-7', domain: 'management', severity: 'high', requirementRef: 'PCI PIN v3.1 §1.7',
    title: 'Device Decommissioning',
    description: 'PEDs are decommissioned in a secure manner that prevents unauthorized access to PIN data or cryptographic keys.',
    objective: 'Ensure decommissioned devices cannot expose PIN data or keys.',
    guidance: [
      'Cryptographic keys must be zeroized (erased) before device disposal',
      'Devices returned to vendor or destroyed per documented procedure',
      'Decommission records retained for minimum 3 years',
      'Verify zeroization using manufacturer-approved process',
    ],
    evidenceExamples: ['Device decommissioning procedure', 'Decommission log with zeroization confirmation', 'Certificate of destruction (if applicable)', '3-year decommission records'],
    staticRemediation: [
      { order: 1, title: 'Document Decommissioning Procedure', description: 'Write a decommissioning procedure: retrieve device, zeroize keys per manufacturer process, update inventory, retain decommission record for 3 years.', effort: 'medium', timeframe: '1 week' },
    ],
  },

  // ── PHYSICAL SECURITY ──────────────────────────────────────────────────────
  {
    id: 'PHYS-1', domain: 'physical_security', severity: 'critical', requirementRef: 'PCI PIN v3.1 §2.1',
    title: 'Physical Security of PIN Entry Devices',
    description: 'PIN entry devices are protected against unauthorized physical access, tampering, and substitution.',
    objective: 'Prevent physical attacks against PEDs that could compromise PIN data.',
    guidance: [
      'PEDs must be physically secured at unattended locations (locked down, anti-theft cable)',
      'Personnel must inspect devices for tampering before use',
      'Tamper-evident seals on device compartments',
      'Cameras or physical security at PED deployment locations',
      'PEDs must never be left unattended without physical security',
    ],
    evidenceExamples: ['Physical security policy for PEDs', 'Device inspection checklist and records', 'Tamper-evident seal documentation', 'Physical security at deployment locations (photos, CCTV)'],
    staticRemediation: [
      { order: 1, title: 'Deploy Physical Security Controls', description: 'Secure all unattended PEDs with anti-theft cables or locked enclosures. Apply tamper-evident seals to device compartments. Install CCTV where PEDs are deployed.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 2, title: 'Implement Device Inspection Program', description: 'Train all personnel to inspect PEDs for tampering before use. Create a checklist and log inspection results daily.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'PHYS-2', domain: 'physical_security', severity: 'critical', requirementRef: 'PCI PIN v3.1 §2.2',
    title: 'Tamper Detection and Response',
    description: 'Procedures are in place to detect and respond to PED tampering or compromise.',
    objective: 'Quickly detect and respond to physical attacks against PEDs.',
    guidance: [
      'Define what constitutes evidence of tampering',
      'Immediate withdrawal of tampered devices from service',
      'Report tampered devices to PCI SSC and card brands',
      'Forensic preservation of tampered devices',
      'Notify affected cardholders if compromise confirmed',
    ],
    evidenceExamples: ['Tamper detection and response procedure', 'Tamper incident log', 'PCI SSC notification records (if applicable)', 'Training records on tamper identification'],
    staticRemediation: [
      { order: 1, title: 'Create Tamper Response Procedure', description: 'Document steps for suspected tamper: (1) Remove device from service immediately. (2) Do not attempt repair. (3) Notify PIN Security Officer. (4) Report to acquirer/card brand. (5) Preserve as evidence.', effort: 'medium', timeframe: '1 week' },
    ],
  },
  {
    id: 'PHYS-3', domain: 'physical_security', severity: 'high', requirementRef: 'PCI PIN v3.1 §2.3',
    title: 'Secure Key Loading Facility',
    description: 'Cryptographic key loading (injection) is performed in a physically secure environment with appropriate access controls.',
    objective: 'Protect key injection operations from physical compromise.',
    guidance: [
      'Key loading facility must have restricted physical access',
      'Dual control required: minimum two authorized persons present during key loading',
      'CCTV recording of key loading facility',
      'No wireless or network access during key loading',
      'Visitor log for key loading facility',
    ],
    evidenceExamples: ['Key loading facility description', 'Access control log for facility', 'Dual control policy', 'CCTV configuration', 'Key injection records with two-person sign-off'],
    staticRemediation: [
      { order: 1, title: 'Establish Secure Key Loading Facility', description: 'Designate a physically secure room for key injection. Install badge access and CCTV. Restrict access to authorized key custodians only.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Implement Dual Control for Key Loading', description: 'Require two authorized key custodians to be physically present for all key loading operations. Log each injection with both signatures.', effort: 'medium', timeframe: '1 week' },
    ],
  },
  {
    id: 'PHYS-4', domain: 'physical_security', severity: 'high', requirementRef: 'PCI PIN v3.1 §2.4',
    title: 'Shipping and Receiving Security',
    description: 'PIN entry devices and key materials are shipped and received using secure methods that prevent tampering and unauthorized access.',
    objective: 'Protect PEDs and key materials during transit.',
    guidance: [
      'Devices shipped in tamper-evident packaging',
      'Chain of custody documentation for all device shipments',
      'Recipient verifies packaging integrity before accepting',
      'Discrepancies reported to sender and security team immediately',
      'Key components shipped separately through different channels (split knowledge)',
    ],
    evidenceExamples: ['Shipping security procedure', 'Tamper-evident packaging records', 'Chain of custody forms', 'Shipping discrepancy log'],
    staticRemediation: [
      { order: 1, title: 'Implement Secure Shipping Procedures', description: 'Define procedures for shipping PEDs and key materials: tamper-evident packaging, secure courier, chain of custody documentation, and recipient verification checklist.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },

  // ── LOGICAL SECURITY ───────────────────────────────────────────────────────
  {
    id: 'LOGIC-1', domain: 'logical_security', severity: 'critical', requirementRef: 'PCI PIN v3.1 §3.1',
    title: 'Access Control for PIN Systems',
    description: 'Access to PIN processing systems, key management systems, and HSMs is strictly controlled and based on need-to-know.',
    objective: 'Prevent unauthorized logical access to PIN processing infrastructure.',
    guidance: [
      'Unique IDs for every user — no shared accounts',
      'Multi-factor authentication for all access to PIN systems',
      'Least privilege: access limited to functions required for job role',
      'Privileged access requires separate privileged accounts',
      'Access reviewed quarterly',
    ],
    evidenceExamples: ['Access control policy for PIN systems', 'User account inventory with roles', 'MFA configuration', 'Quarterly access reviews', 'Privileged account list'],
    staticRemediation: [
      { order: 1, title: 'Enforce MFA on All PIN Systems', description: 'Configure MFA for all user access to HSMs, key management systems, and PIN processing applications. No exceptions.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Quarterly Privilege Reviews', description: 'Review all accounts with access to PIN systems every quarter. Remove unnecessary access immediately.', effort: 'medium', timeframe: '1 week setup + ongoing' },
    ],
  },
  {
    id: 'LOGIC-2', domain: 'logical_security', severity: 'critical', requirementRef: 'PCI PIN v3.1 §3.2',
    title: 'System Hardening',
    description: 'All systems involved in PIN processing are hardened by removing unnecessary functionality and applying security configurations.',
    objective: 'Reduce attack surface of PIN processing systems.',
    guidance: [
      'Remove all unnecessary software, services, and ports',
      'Apply CIS Benchmarks or DISA STIGs',
      'Disable default credentials on all systems and devices',
      'Change all vendor-supplied default passwords before deployment',
      'Firmware on PEDs must be PCI PTS approved version',
    ],
    evidenceExamples: ['System hardening standard', 'Hardening scan results', 'Services and ports documentation', 'Default password change records', 'PED firmware version compliance report'],
    staticRemediation: [
      { order: 1, title: 'Apply Hardening Baselines', description: 'Apply CIS Level 1 benchmarks to all PIN processing servers and applications. Document all deviations. Scan and remediate monthly.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Verify PED Firmware', description: 'For all PEDs in inventory, verify the firmware version appears on the PCI SSC approved list. Upgrade firmware on any non-compliant devices.', effort: 'medium', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'LOGIC-3', domain: 'logical_security', severity: 'critical', requirementRef: 'PCI PIN v3.1 §3.3',
    title: 'Network Security for PIN Systems',
    description: 'PIN processing systems are isolated in a secure network segment with strict controls on inbound and outbound traffic.',
    objective: 'Protect PIN systems from network-based attacks.',
    guidance: [
      'PIN systems in a dedicated, isolated network segment (DMZ or dedicated VLAN)',
      'Firewall rules restrict traffic to only required connections',
      'No direct internet access from PIN processing networks',
      'All connections to PIN systems logged and monitored',
      'Encrypted communications for all PIN data in transit',
    ],
    evidenceExamples: ['Network diagram showing PIN system isolation', 'Firewall rules for PIN segment', 'No-internet-access verification', 'Network traffic monitoring configuration'],
    staticRemediation: [
      { order: 1, title: 'Isolate PIN Systems Network Segment', description: 'Move all PIN processing systems to a dedicated VLAN or network segment. Implement strict firewall rules: only required traffic permitted, default deny for all else.', effort: 'high', timeframe: '3–4 weeks' },
      { order: 2, title: 'Block Internet Access', description: 'Verify and document that PIN processing systems have no direct internet access. All outbound traffic must pass through a controlled proxy or gateway.', effort: 'medium', timeframe: '1 week' },
    ],
  },
  {
    id: 'LOGIC-4', domain: 'logical_security', severity: 'high', requirementRef: 'PCI PIN v3.1 §3.4',
    title: 'Patch Management for PIN Systems',
    description: 'Security patches for PIN processing systems and PED firmware are applied within defined timeframes.',
    objective: 'Maintain the security of PIN systems through timely patching.',
    guidance: [
      'Critical patches applied within 1 month of release',
      'High patches applied within 3 months',
      'Test patches in non-production before production deployment',
      'PED firmware updates approved by PCI SSC before deployment',
    ],
    evidenceExamples: ['Patch management policy with SLAs', 'Monthly patch compliance reports', 'Change tickets for patch deployments', 'PED firmware update records'],
    staticRemediation: [
      { order: 1, title: 'Implement PIN System Patch Management', description: 'Define SLAs: Critical patches ≤ 30 days, High ≤ 90 days. Track all PIN system patches in a change management log. Report monthly compliance to CISO.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'LOGIC-5', domain: 'logical_security', severity: 'high', requirementRef: 'PCI PIN v3.1 §3.5',
    title: 'Malware Protection for PIN Systems',
    description: 'Anti-malware protection is deployed on all PIN processing systems and kept up to date.',
    objective: 'Detect and prevent malware on PIN processing infrastructure.',
    guidance: [
      'Anti-malware on all servers and workstations in PIN environment',
      'Automatic signature updates at minimum daily',
      'Full system scan at minimum weekly',
      'Alerts on malware detection to security team',
    ],
    evidenceExamples: ['Anti-malware deployment report', 'Auto-update configuration', 'Weekly scan logs', 'Malware detection alert records'],
    staticRemediation: [
      { order: 1, title: 'Deploy EDR on PIN Systems', description: 'Install and configure EDR (Endpoint Detection and Response) on all PIN processing servers and workstations. Enable auto-updates and weekly full scans.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },

  // ── KEY MANAGEMENT ──────────────────────────────────────────────────────────
  {
    id: 'KM-1', domain: 'key_management', severity: 'critical', requirementRef: 'PCI PIN v3.1 §4.1',
    title: 'Cryptographic Key Policy',
    description: 'A comprehensive key management policy covers the entire lifecycle of all cryptographic keys used in PIN processing.',
    objective: 'Establish formal governance for all PIN-related cryptographic keys.',
    guidance: [
      'Policy covers: generation, distribution, storage, use, retirement, and destruction',
      'Key types must be documented: PEK, BDK, KEK, ZMK, ZPK, etc.',
      'Key lengths must meet minimum standards (AES-128 minimum, AES-256 preferred)',
      'Policy reviewed annually and after any key compromise',
    ],
    evidenceExamples: ['Key management policy', 'Key inventory with types and algorithms', 'Key length compliance verification', 'Annual policy review records'],
    staticRemediation: [
      { order: 1, title: 'Create Key Management Policy', description: 'Document policies for each key type in use: generation method, algorithm, key length, storage requirements, maximum key life, and destruction method.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 2, title: 'Build Key Inventory', description: 'Catalog all active cryptographic keys: key ID, type (ZMK, ZPK, BDK, etc.), algorithm, length, creation date, expiry date, and custodians.', effort: 'high', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'KM-2', domain: 'key_management', severity: 'critical', requirementRef: 'PCI PIN v3.1 §4.2',
    title: 'Key Generation',
    description: 'Cryptographic keys are generated using approved random number generators in a secure environment with dual control.',
    objective: 'Ensure keys are generated with sufficient randomness and under controlled conditions.',
    guidance: [
      'Use FIPS 140-2/3 validated HSM for key generation',
      'Random number generator must be ANSI X9.17 or equivalent',
      'Dual control: minimum two authorized key custodians must be present',
      'Key generation events logged with timestamps and custodian identities',
      'Never generate keys in software on general-purpose computers',
    ],
    evidenceExamples: ['HSM specifications showing FIPS 140-2 validation', 'Key generation procedure', 'Dual control policy', 'Key generation logs signed by two custodians'],
    staticRemediation: [
      { order: 1, title: 'Mandate HSM for Key Generation', description: 'All PIN cryptographic keys must be generated within a FIPS 140-2 Level 3 or higher validated HSM. Document the HSM model and its FIPS certificate.', effort: 'high', timeframe: '4–8 weeks' },
      { order: 2, title: 'Implement Dual Control for Key Generation', description: 'Require two authorized key custodians to physically sign all key generation records. No single person can generate keys alone.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'KM-3', domain: 'key_management', severity: 'critical', requirementRef: 'PCI PIN v3.1 §4.3',
    title: 'Key Distribution',
    description: 'Cryptographic keys are distributed securely using approved methods that protect against interception or substitution.',
    objective: 'Protect keys in transit between systems and devices.',
    guidance: [
      'Keys distributed under the protection of a Key Encrypting Key (KEK)',
      'Split knowledge: no single person has access to a full key',
      'Dual control: distribution witnessed by two authorized custodians',
      'Key distribution electronically: use TR-31 key block format',
      'Physical distribution: split key components, delivered via separate couriers',
    ],
    evidenceExamples: ['Key distribution procedure', 'TR-31 key block implementation documentation', 'Split knowledge procedure', 'Dual control records for key distributions', 'Key distribution log'],
    staticRemediation: [
      { order: 1, title: 'Implement TR-31 Key Blocks', description: 'Migrate all key exchange to TR-31 key block format which cryptographically binds the key type and usage to the key value, preventing misuse.', effort: 'high', timeframe: '4–8 weeks' },
      { order: 2, title: 'Enforce Split Knowledge', description: 'For all key components, ensure no single person ever has access to a complete key. Use a minimum of two key components each held by different custodians.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'KM-4', domain: 'key_management', severity: 'critical', requirementRef: 'PCI PIN v3.1 §4.4',
    title: 'Key Storage',
    description: 'Cryptographic keys are stored securely, protected against unauthorized disclosure and modification.',
    objective: 'Ensure keys cannot be accessed or extracted by unauthorized parties.',
    guidance: [
      'Keys at rest must be encrypted using another key (key encrypting key)',
      'Master keys stored in HSM only — never in cleartext outside HSM',
      'Working keys stored only in hardware security modules or tamper-resistant devices',
      'Key storage locations must meet physical security requirements',
      'No keys stored in application configuration files or databases in cleartext',
    ],
    evidenceExamples: ['HSM key storage configuration', 'Key storage policy', 'Application configuration review showing no cleartext keys', 'HSM audit logs'],
    staticRemediation: [
      { order: 1, title: 'Audit for Cleartext Keys', description: 'Search all application configs, databases, and code repositories for any cleartext cryptographic keys. Remove immediately and replace with HSM-managed keys.', effort: 'high', timeframe: '2–3 weeks' },
      { order: 2, title: 'Move All Keys to HSM', description: 'Migrate all PIN-related cryptographic key storage to the HSM. No keys should exist outside the HSM except when encrypted under another key.', effort: 'high', timeframe: '4–8 weeks' },
    ],
  },
  {
    id: 'KM-5', domain: 'key_management', severity: 'critical', requirementRef: 'PCI PIN v3.1 §4.5',
    title: 'Key Retirement and Destruction',
    description: 'Cryptographic keys are retired and securely destroyed when they reach the end of their cryptoperiod.',
    objective: 'Ensure expired or compromised keys are irreversibly destroyed.',
    guidance: [
      'Define maximum cryptoperiod for each key type (e.g., ZPK: 1 year)',
      'Keys must be zeroized (overwritten with zeros) in HSM at end of life',
      'Physical key components destroyed by shredding or similar',
      'Key destruction witnessed by two authorized custodians',
      'Key destruction logged and retained for minimum 7 years',
    ],
    evidenceExamples: ['Key retirement schedule per key type', 'Key destruction procedure', 'Key destruction logs with dual custodian sign-off', '7-year record retention evidence'],
    staticRemediation: [
      { order: 1, title: 'Define Key Cryptoperiods', description: 'Set maximum lifetimes for each key type: ZMK ≤ 2 years, ZPK ≤ 1 year, BDK ≤ 3 years, PEK per manufacturer recommendation. Automate key rotation alerts.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Implement Key Destruction Procedure', description: 'Document and implement: HSM zeroization commands for each key type, dual custodian sign-off, and 7-year retention of destruction records.', effort: 'medium', timeframe: '2 weeks' },
    ],
  },
  {
    id: 'KM-6', domain: 'key_management', severity: 'critical', requirementRef: 'PCI PIN v3.1 §4.6',
    title: 'Key Compromise Response',
    description: 'Procedures are in place to detect and respond to key compromise or suspected compromise.',
    objective: 'Minimize impact of key compromise through rapid detection and key replacement.',
    guidance: [
      'Define indicators of key compromise',
      'Immediate key replacement upon confirmed or suspected compromise',
      'Notify card brands within defined timeframe of confirmed compromise',
      'Forensic investigation procedure for key compromise events',
      'Test key compromise response procedures annually',
    ],
    evidenceExamples: ['Key compromise response procedure', 'Key compromise incident log', 'Card brand notification records', 'Annual compromise response drill records'],
    staticRemediation: [
      { order: 1, title: 'Create Key Compromise Response Plan', description: 'Document: how to detect compromise, who to notify (card brands, acquirer, PCI SSC), key replacement steps, and forensic preservation requirements.', effort: 'medium', timeframe: '2 weeks' },
      { order: 2, title: 'Annual Compromise Drill', description: 'Test the key compromise response procedure annually using a tabletop exercise. Time the response and verify notification procedures work.', effort: 'medium', timeframe: '1–2 days per year' },
    ],
  },
  {
    id: 'KM-7', domain: 'key_management', severity: 'high', requirementRef: 'PCI PIN v3.1 §4.7',
    title: 'Hardware Security Module (HSM) Management',
    description: 'HSMs used in PIN processing are managed securely, with access controls, audit logging, and regular health verification.',
    objective: 'Maintain the integrity and security of HSMs that protect PIN keys.',
    guidance: [
      'HSM must be FIPS 140-2 Level 3 or higher validated',
      'HSM access logged and reviewed',
      'HSM firmware updates authenticated before installation',
      'HSM initialization and master key loading require dual control',
      'HSM health checks performed regularly',
    ],
    evidenceExamples: ['HSM FIPS 140-2 validation certificate', 'HSM access logs', 'HSM firmware update records', 'HSM initialization records with dual control', 'HSM health check reports'],
    staticRemediation: [
      { order: 1, title: 'Verify HSM FIPS Certification', description: 'Confirm your HSM appears on the NIST CMVP validated modules list at csrc.nist.gov/projects/cryptographic-module-validation-program. Document the certificate number.', effort: 'low', timeframe: '1 day' },
      { order: 2, title: 'Enable HSM Audit Logging', description: 'Configure the HSM to log all administrative commands, key operations, and access attempts. Route logs to SIEM. Review weekly.', effort: 'medium', timeframe: '1 week' },
    ],
  },

  // ── TRANSACTION PROCESSING ─────────────────────────────────────────────────
  {
    id: 'TXN-1', domain: 'transaction_processing', severity: 'critical', requirementRef: 'PCI PIN v3.1 §5.1',
    title: 'PIN Entry Security',
    description: 'PIN entry is performed exclusively on PCI PTS-approved PIN entry devices (PEDs) that protect against observation and skimming.',
    objective: 'Ensure PINs are entered securely without possibility of capture.',
    guidance: [
      'Only PCI SSC-approved PEDs may be used for PIN entry',
      'PED keypad must be shielded to prevent shoulder surfing observation',
      'PIN buffer in device must be cleared after each transaction',
      'Anti-skimming features must be verified on all deployed PEDs',
    ],
    evidenceExamples: ['PCI SSC approved device list for all deployed PEDs', 'Anti-skimming verification records', 'PIN entry process documentation', 'Device placement guidelines'],
    staticRemediation: [
      { order: 1, title: 'Audit PED Approval Status', description: 'Verify every deployed PED appears on the current PCI SSC Approved PTS POI list. Replace any expired or non-listed devices immediately.', effort: 'high', timeframe: '2–4 weeks' },
    ],
  },
  {
    id: 'TXN-2', domain: 'transaction_processing', severity: 'critical', requirementRef: 'PCI PIN v3.1 §5.2',
    title: 'PIN Encryption',
    description: 'PINs are encrypted immediately upon entry at the PED using an approved algorithm and never exist in plaintext outside the PED.',
    objective: 'Ensure PINs are never exposed in cleartext at any point in the transaction flow.',
    guidance: [
      'PIN encrypted within the PED before leaving the device',
      'AES (128-bit minimum) or 3DES (double length, minimum) for PIN encryption',
      'EFTPOS PIN block formats: ISO 9564-1 Format 0, 1, 3, or 4',
      'PIN encryption key unique per device (unique PIN Encryption Key)',
      'PIN block must never be stored after transaction',
    ],
    evidenceExamples: ['PIN encryption specification document', 'HSM configuration showing PIN block decryption', 'Algorithm documentation (AES/3DES)', 'No-storage policy for PIN blocks'],
    staticRemediation: [
      { order: 1, title: 'Document PIN Encryption Architecture', description: 'Create a data flow diagram showing: PIN entered at PED → encrypted to PIN block → transmitted to acquirer → decrypted in HSM → re-encrypted for card brand. Document all algorithms and key types used.', effort: 'high', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'TXN-3', domain: 'transaction_processing', severity: 'critical', requirementRef: 'PCI PIN v3.1 §5.3',
    title: 'Dual Control and Split Knowledge in Transaction Processing',
    description: 'Critical PIN processing functions require dual control to prevent single-person fraud or error.',
    objective: 'Prevent any individual from having sufficient knowledge to compromise PIN operations.',
    guidance: [
      'No single person can process a complete PIN transaction without detection',
      'Separation of duties: key management separate from transaction authorization',
      'Administrative changes to PIN systems require two-person approval',
      'Dual control enforced technically where possible (HSM policies)',
    ],
    evidenceExamples: ['Dual control policy document', 'HSM configuration showing dual control policies', 'Separation of duties matrix for PIN operations', 'Administrative change approval records'],
    staticRemediation: [
      { order: 1, title: 'Configure HSM Dual Control Policies', description: 'Configure the HSM to require authorization from two distinct custodians for all sensitive operations: key loading, key export, configuration changes.', effort: 'medium', timeframe: '1–2 weeks' },
    ],
  },
  {
    id: 'TXN-4', domain: 'transaction_processing', severity: 'high', requirementRef: 'PCI PIN v3.1 §5.4',
    title: 'Secure PIN Transmission',
    description: 'Encrypted PIN blocks are transmitted between parties using secure channels that prevent interception or modification.',
    objective: 'Protect PIN blocks in transit between all processing nodes.',
    guidance: [
      'All PIN block transmission over encrypted channels (TLS 1.2+ minimum)',
      'Additional encryption: PIN block encrypted under transmission key separate from TLS',
      'Message authentication codes (MACs) on all PIN-containing messages',
      'No PIN blocks transmitted over untrusted networks without encryption',
    ],
    evidenceExamples: ['Transmission architecture documentation', 'TLS configuration (minimum v1.2)', 'MAC implementation documentation', 'Network encryption scan results'],
    staticRemediation: [
      { order: 1, title: 'Audit PIN Transmission Security', description: 'Map all paths where PIN blocks travel. Verify each uses TLS 1.2+ AND that PIN blocks are also encrypted at the application layer (not just transport). Document all findings.', effort: 'high', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'TXN-5', domain: 'transaction_processing', severity: 'high', requirementRef: 'PCI PIN v3.1 §5.5',
    title: 'Transaction Log Integrity',
    description: 'Transaction logs do not contain PINs, PIN blocks, or full PANs and are protected against tampering.',
    objective: 'Ensure transaction logs cannot be used to reconstruct PINs or card data.',
    guidance: [
      'Verify transaction logs never contain PIN data (cleartext or encrypted PIN blocks)',
      'Full PAN not stored in transaction logs (truncated or tokenized only)',
      'Transaction logs protected from modification (write-once storage or cryptographic signing)',
      'Access to transaction logs restricted to authorized personnel',
    ],
    evidenceExamples: ['Transaction log review showing no PIN data', 'Log protection configuration', 'Access control list for transaction logs', 'Log integrity verification results'],
    staticRemediation: [
      { order: 1, title: 'Audit Transaction Logs for PIN/PAN Data', description: 'Review all transaction logs for presence of PIN data or full PANs. Use automated scanning tools if log volume is high. Remediate any findings immediately.', effort: 'high', timeframe: '2 weeks' },
    ],
  },

  // ── MONITORING & TESTING ───────────────────────────────────────────────────
  {
    id: 'MON-1', domain: 'monitoring_testing', severity: 'critical', requirementRef: 'PCI PIN v3.1 §6.1',
    title: 'Audit Logging for PIN Systems',
    description: 'Comprehensive audit logs are maintained for all PIN-related systems, HSMs, and key management operations.',
    objective: 'Create an audit trail for all PIN security events.',
    guidance: [
      'Log all HSM operations: key generation, load, export, administrative access',
      'Log all access to PIN processing systems',
      'Log all PED inventory changes',
      'Logs must include: timestamp, user ID, action, outcome',
      'Logs retained for minimum 12 months (3 months immediately accessible)',
    ],
    evidenceExamples: ['HSM audit log configuration', 'PIN system access logs', 'Log retention configuration (12 months)', 'Sample audit log entries'],
    staticRemediation: [
      { order: 1, title: 'Enable Comprehensive Audit Logging', description: 'Configure audit logging on all PIN systems, HSMs, and key management applications. Include: timestamps, user IDs, actions, and outcomes. Route to SIEM.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Configure Log Retention', description: 'Set retention: 3 months immediately accessible (hot storage), 12 months total. Enable log integrity protection (append-only or WORM storage).', effort: 'low', timeframe: '3 days' },
    ],
  },
  {
    id: 'MON-2', domain: 'monitoring_testing', severity: 'critical', requirementRef: 'PCI PIN v3.1 §6.2',
    title: 'Audit Log Review',
    description: 'Audit logs for PIN systems are reviewed at least daily for anomalies and security events.',
    objective: 'Detect security incidents and policy violations through regular log review.',
    guidance: [
      'Daily automated review of security-relevant PIN system events',
      'Immediate investigation of anomalies',
      'Weekly manual review by PIN Security Officer',
      'Escalation procedures for suspicious activity',
    ],
    evidenceExamples: ['SIEM alert rules for PIN security events', 'Daily/weekly review records', 'Anomaly investigation records', 'Escalation procedure'],
    staticRemediation: [
      { order: 1, title: 'Configure PIN Security Alerts in SIEM', description: 'Create SIEM correlation rules for PIN-specific events: failed HSM access, after-hours PIN system access, multiple failed PIN entries, key loading events.', effort: 'high', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'MON-3', domain: 'monitoring_testing', severity: 'high', requirementRef: 'PCI PIN v3.1 §6.3',
    title: 'Vulnerability Assessments for PIN Systems',
    description: 'Regular vulnerability assessments and penetration tests are performed on PIN processing systems.',
    objective: 'Identify and remediate vulnerabilities in PIN infrastructure before they are exploited.',
    guidance: [
      'Authenticated vulnerability scans of PIN systems monthly',
      'Annual penetration test of PIN environment',
      'PED security assessment (physical inspection) annually',
      'Remediate critical vulnerabilities within 30 days',
    ],
    evidenceExamples: ['Monthly vulnerability scan reports for PIN systems', 'Annual penetration test report', 'PED physical security assessment report', 'Remediation records'],
    staticRemediation: [
      { order: 1, title: 'Establish PIN-Specific Vulnerability Scanning', description: 'Include all PIN processing servers and workstations in monthly authenticated vulnerability scans. Track findings in a separate queue for PIN systems.', effort: 'medium', timeframe: '1–2 weeks' },
      { order: 2, title: 'Annual PIN Environment Penetration Test', description: 'Commission an annual penetration test specifically targeting the PIN processing environment. Include HSM bypass attempts and key extraction scenarios.', effort: 'high', timeframe: '4–6 weeks' },
    ],
  },
  {
    id: 'MON-4', domain: 'monitoring_testing', severity: 'critical', requirementRef: 'PCI PIN v3.1 §6.4',
    title: 'Incident Response for PIN Security Events',
    description: 'A PIN security incident response plan exists and is tested, covering key compromise, device tampering, and data breach scenarios.',
    objective: 'Respond effectively and quickly to PIN security incidents.',
    guidance: [
      'IRP must include PIN-specific scenarios: key compromise, PED tampering, fraud detected',
      'Card brand notification procedures documented (Visa, Mastercard, etc.)',
      'Key replacement procedures as part of incident response',
      'Annual tabletop exercise for PIN security incidents',
    ],
    evidenceExamples: ['PIN Incident Response Plan', 'Card brand notification procedures', 'Annual tabletop exercise records', 'Incident response drills', 'Incident log'],
    staticRemediation: [
      { order: 1, title: 'Create PIN Security Incident Response Plan', description: 'Develop IRP covering: PED tamper detection, suspected key compromise, mass card fraud. Include card brand notification (Visa FRAUD/RISK contacts, Mastercard), timeline, and evidence preservation.', effort: 'high', timeframe: '2–3 weeks' },
    ],
  },
  {
    id: 'MON-5', domain: 'monitoring_testing', severity: 'high', requirementRef: 'PCI PIN v3.1 §6.5',
    title: 'Annual PIN Security Review',
    description: 'A comprehensive review of the entire PIN security program is conducted at least annually.',
    objective: 'Ensure the PIN security program remains effective and compliant.',
    guidance: [
      'Review all PIN security policies and procedures',
      'Verify all controls are operating effectively',
      'Review key inventory and confirm all keys are within their cryptoperiod',
      'Review personnel assignments and update as needed',
      'Document findings and track remediation',
    ],
    evidenceExamples: ['Annual PIN security review report', 'Key inventory review records', 'Personnel assignment review', 'Remediation tracking for review findings'],
    staticRemediation: [
      { order: 1, title: 'Schedule Annual PIN Security Review', description: 'Plan and conduct a comprehensive annual review: inventory audit, key lifecycle check, personnel review, policy updates, control testing, and vulnerability assessment summary.', effort: 'high', timeframe: '2–4 weeks per year' },
    ],
  },
];

// Merge examples
for (const control of PCI_PIN_CONTROLS) {
  const ex = PCI_PIN_EXAMPLES[control.id];
  if (ex) control.example = ex;
}

export function getPCIPINControlsByDomain(domain: PCIPINDomain): PCIPINControl[] {
  return PCI_PIN_CONTROLS.filter(c => c.domain === domain);
}

export function getPCIPINControlById(id: string): PCIPINControl | undefined {
  return PCI_PIN_CONTROLS.find(c => c.id === id);
}
