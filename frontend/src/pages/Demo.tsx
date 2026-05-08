import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle2, XCircle, MinusCircle, HelpCircle, ChevronRight,
  BookOpen, Lightbulb, ListChecks, Zap, Clock, X, Sparkles, AlertTriangle, TrendingUp
} from 'lucide-react';
import clsx from 'clsx';

// ── Static SOC2 controls for demo (no API needed) ─────────────────────────────
const DEMO_CONTROLS = [
  {
    id: 'CC1.1', category: 'security', severity: 'high',
    title: 'Commitment to Integrity and Ethical Values',
    description: 'The entity demonstrates a commitment to integrity and ethical values.',
    objective: 'Establish tone at the top and communicate ethical standards across the organization.',
    guidance: ['Document a formal code of conduct or ethics policy', 'Require all employees to acknowledge the code annually', 'Establish a whistleblower/ethics hotline', 'Leadership must visibly model ethical behavior'],
    evidenceExamples: ['Signed code of conduct acknowledgments', 'Ethics policy document', 'Training completion records'],
    quickWin: 'Use Google Forms or DocuSign to collect signed acknowledgments from all current employees this week. It takes about 2 hours to set up.',
    scenario: 'Acme SaaS requires every employee to read and sign a Code of Conduct on their first day and again every January. An anonymous ethics hotline is shared in the employee handbook.',
    howToFix: [{ order: 1, title: 'Draft a Code of Conduct', description: 'Create a formal code of conduct covering conflicts of interest, data handling, acceptable use, and reporting obligations.', effort: 'medium', timeframe: '2–3 weeks' }, { order: 2, title: 'Obtain Employee Acknowledgments', description: 'Distribute the policy and collect signed acknowledgments from all employees.', effort: 'low', timeframe: '1 week' }],
  },
  {
    id: 'CC5.2', category: 'security', severity: 'critical',
    title: 'General Technology Controls — MFA & Patching',
    description: 'The entity selects and develops general technology controls to support the achievement of objectives.',
    objective: 'Implement foundational technology security controls including MFA, endpoint protection, and patch management.',
    guidance: ['Enforce multi-factor authentication (MFA) for all systems', 'Deploy endpoint protection on all company devices', 'Patch operating systems within defined SLAs', 'Use encrypted communications (TLS 1.2+)'],
    evidenceExamples: ['MFA configuration screenshots', 'Endpoint protection dashboard', 'Patch management reports', 'TLS scan results'],
    quickWin: 'In Okta, go to Security → Authentication Policies → require MFA for every sign-in. This takes 10 minutes and immediately satisfies the MFA portion of CC5.2.',
    scenario: 'NodeFlow enforces MFA for all employees via Okta. An authentication policy blocks access to all apps if the user lacks an enrolled MFA factor. GitHub and AWS console SSO through Okta — no direct IAM user logins allowed.',
    howToFix: [{ order: 1, title: 'Enforce MFA Everywhere', description: 'Enable MFA for all user accounts on all systems. Phishing-resistant MFA (FIDO2/WebAuthn) preferred.', effort: 'medium', timeframe: '1–2 weeks' }, { order: 2, title: 'Deploy Endpoint Protection', description: 'Install and configure EDR/antivirus on all managed endpoints. Enable auto-updates.', effort: 'medium', timeframe: '1–2 weeks' }],
  },
  {
    id: 'CC6.1', category: 'security', severity: 'critical',
    title: 'Logical Access Security Controls',
    description: 'The entity implements logical access security software, infrastructure, and architectures.',
    objective: 'Control logical access to all systems and data using RBAC and least privilege.',
    guidance: ['Implement role-based access control (RBAC)', 'Enforce the principle of least privilege', 'Use an identity provider / SSO for centralized access management', 'Formalize access provisioning and deprovisioning'],
    evidenceExamples: ['RBAC configuration', 'Access provisioning workflow', 'User access review records', 'SSO configuration'],
    quickWin: 'In Okta, create three groups: admin, developer, read-only. Move all users into the appropriate group. This takes 30 minutes and is the foundation of RBAC.',
    scenario: 'FluxAPI uses Okta as their IdP with SSO connected to GitHub, AWS, Snowflake, Salesforce, and Slack. Three roles are defined. No shared service accounts exist.',
    howToFix: [{ order: 1, title: 'Implement RBAC', description: 'Define roles for all systems and assign permissions based on job function. Eliminate shared accounts.', effort: 'high', timeframe: '3–4 weeks' }, { order: 2, title: 'Formalize Provisioning', description: 'Create a workflow requiring manager and ISSO approval before accounts are created.', effort: 'medium', timeframe: '2 weeks' }],
  },
  {
    id: 'CC7.2', category: 'security', severity: 'critical',
    title: 'Security Incident Management',
    description: 'The entity monitors system components and the operation of those components for anomalies indicative of malicious acts.',
    objective: 'Detect, respond to, and learn from security incidents through a formal incident response program.',
    guidance: ['Maintain a formal incident response plan (IRP)', 'Define incident severity classifications', 'Conduct tabletop exercises at least annually', 'Maintain incident log and post-mortem process'],
    evidenceExamples: ['Incident Response Plan', 'Incident log', 'Tabletop exercise records', 'Post-incident reports'],
    quickWin: 'Write a 1-page IRP: (1) Definition of incident. (2) Who to call first (CTO/CISO). (3) How to contain it. (4) How to notify customers. Get your CTO to approve it via email.',
    scenario: 'RailsFast has a documented IRP stored in Confluence. It defines 4 severity levels with response time SLAs. The IRP includes contact trees and playbooks for 5 common incident types.',
    howToFix: [{ order: 1, title: 'Create Incident Response Plan', description: 'Document an IRP covering identification, containment, eradication, recovery, and lessons learned. Include contact trees and escalation procedures.', effort: 'medium', timeframe: '2–3 weeks' }, { order: 2, title: 'Conduct Annual Tabletop', description: 'Run a tabletop exercise simulating a realistic incident. Document outcomes and update IRP.', effort: 'medium', timeframe: '2 weeks' }],
  },
  {
    id: 'A1.2', category: 'availability', severity: 'critical',
    title: 'Environmental Protections and Backup',
    description: 'The entity authorizes, designs, develops, and implements procedures to protect against environmental events and back up data.',
    objective: 'Protect against data loss with automated backups tested regularly.',
    guidance: ['Implement automated daily backups', 'Test backups by restoring from them at least quarterly', 'Store backups off-site or in a separate cloud region', 'Define and document RTO and RPO'],
    evidenceExamples: ['Backup configuration screenshots', 'Restore test records', 'Off-site backup confirmation', 'RTO/RPO documentation'],
    quickWin: 'In AWS RDS console, verify automated backups are enabled with 7-day minimum retention. Screenshot it. Then restore the latest snapshot to a test instance. Two screenshots = A1.2 evidence.',
    scenario: 'DataPulse RDS databases have automated daily snapshots with 35-day retention stored in a separate AWS region. Every quarter, an engineer runs a restore drill and logs the result.',
    howToFix: [{ order: 1, title: 'Configure Automated Backups', description: 'Enable automated daily backups for all production databases. Verify retention meets RPO.', effort: 'medium', timeframe: '1 week' }, { order: 2, title: 'Test Restores Quarterly', description: 'Perform a documented restore test each quarter. Measure restore time vs RPO.', effort: 'medium', timeframe: 'Ongoing' }],
  },
];

const CATEGORY_LABELS: Record<string, { label: string; short: string }> = {
  security: { label: 'Security (Common Criteria)', short: 'Security' },
  availability: { label: 'Availability', short: 'Availability' },
};

const STATUS_CONFIG = {
  yes:     { label: 'Implemented',     icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-400',  bg: 'bg-green-900/40 border-green-700' },
  partial: { label: 'Partial',         icon: <MinusCircle  className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-900/40 border-yellow-700' },
  no:      { label: 'Not Implemented', icon: <XCircle      className="w-4 h-4" />, color: 'text-red-400',    bg: 'bg-red-900/40 border-red-700' },
  na:      { label: 'Not Applicable',  icon: <HelpCircle   className="w-4 h-4" />, color: 'text-gray-400',   bg: 'bg-gray-800 border-gray-700' },
};

type Status = 'yes' | 'partial' | 'no' | 'na';
type Tab = 'overview' | 'how_to_fix' | 'example';

export default function Demo() {
  const [activeCategory, setActiveCategory] = useState('security');
  const [expandedControl, setExpandedControl] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, Status>>({});
  const [activeTab, setActiveTab] = useState<Record<string, Tab>>({});
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const categories = ['security', 'availability'];
  const controlsForCategory = DEMO_CONTROLS.filter(c => c.category === activeCategory);

  const totalAnswered = Object.keys(responses).length;
  const score = totalAnswered === 0 ? 0 : Math.round(
    Object.values(responses).reduce((sum, s) => sum + (s === 'yes' ? 100 : s === 'partial' ? 50 : 0), 0) / DEMO_CONTROLS.length
  );

  function handleResponse(controlId: string, status: Status) {
    setResponses(prev => ({ ...prev, [controlId]: status }));
    // After answering 2 controls, gently nudge toward sign up
    if (Object.keys(responses).length === 2) {
      setTimeout(() => setShowSignupPrompt(true), 800);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* ── Demo banner ── */}
      {!dismissedBanner && (
        <div className="bg-brand-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span><strong>Demo mode</strong> — explore freely. Create a free account to save your assessment and get full access.</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/register" className="bg-white text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Create Free Account
            </Link>
            <button onClick={() => setDismissedBanner(true)} className="text-white/70 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden lg:flex w-64 bg-gray-900 border-r border-gray-800 flex-col shrink-0">
          <div className="p-4 border-b border-gray-800">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">TechRisk</span>
            </Link>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Demo Assessment</div>
            <div className="font-semibold text-white text-sm">SOC 2 Type 1 Preview</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="text-2xl font-bold text-white">{score}%</div>
              <div className="flex-1">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${(totalAnswered / DEMO_CONTROLS.length) * 100}%` }} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{totalAnswered}/{DEMO_CONTROLS.length} answered</div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-2">
            {categories.map(cat => {
              const catControls = DEMO_CONTROLS.filter(c => c.category === cat);
              const answered = catControls.filter(c => responses[c.id]).length;
              const catScore = answered === 0 ? 0 : Math.round(
                catControls.reduce((sum, c) => sum + (responses[c.id] === 'yes' ? 100 : responses[c.id] === 'partial' ? 50 : 0), 0) / catControls.length
              );
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={clsx('w-full text-left p-3 rounded-lg mb-1 transition-colors',
                    activeCategory === cat ? 'bg-brand-600/20 text-brand-300' : 'text-gray-400 hover:bg-gray-800')}>
                  <div className="text-sm font-medium">{CATEGORY_LABELS[cat].short}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-current rounded-full opacity-60" style={{ width: `${catScore}%` }} />
                    </div>
                    <span className="text-xs">{catScore}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar CTA */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            <p className="text-xs text-gray-400 text-center">Real assessments have 52+ controls across all 5 criteria</p>
            <Link to="/register" className="btn-primary w-full text-sm flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Save My Assessment
            </Link>
            <Link to="/login" className="btn-secondary w-full text-sm text-center block">Sign in</Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Mobile nav */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">TechRisk Demo</span>
            </Link>
            <Link to="/register" className="btn-primary text-xs">Create Account</Link>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1 flex-wrap">
                {categories.map((cat, i) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={clsx('px-2 py-1 rounded-full border transition-colors text-xs',
                      activeCategory === cat ? 'border-brand-500 text-brand-400 bg-brand-900/20' : 'border-gray-700 hover:border-gray-600')}>
                    {CATEGORY_LABELS[cat].short}
                  </button>
                ))}
              </div>
              <h1 className="text-xl font-bold text-white">{CATEGORY_LABELS[activeCategory]?.label}</h1>
              <p className="text-sm text-gray-400 mt-1">Try answering these controls — just like the real assessment</p>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              {controlsForCategory.map(control => {
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
                    {/* Header */}
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

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-gray-800/60">
                        {/* Tab bar */}
                        <div className="flex border-b border-gray-800/60">
                          {([['overview','Overview',<BookOpen className="w-3.5 h-3.5"/>],['how_to_fix','How to Fix',<ListChecks className="w-3.5 h-3.5"/>],['example','Example',<Lightbulb className="w-3.5 h-3.5"/>]] as const).map(([t, label, icon]) => (
                            <button key={t} onClick={() => setActiveTab(prev => ({ ...prev, [control.id]: t as Tab }))}
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
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">What to look for</p>
                                <ul className="space-y-1">
                                  {control.guidance.map((g, i) => (
                                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                      <span className="text-brand-500 mt-1 shrink-0">·</span>{g}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {control.evidenceExamples.map((e, i) => (
                                  <span key={i} className="text-xs bg-gray-800 border border-gray-700 rounded-full px-2.5 py-1 text-gray-400">{e}</span>
                                ))}
                              </div>
                            </>
                          )}

                          {tab === 'how_to_fix' && (
                            <div className="space-y-3">
                              {control.howToFix.map((step, i) => (
                                <div key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3 border border-gray-800">
                                  <div className="w-6 h-6 rounded-full bg-brand-600/30 border border-brand-600/50 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0 mt-0.5">{step.order}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <p className="text-sm font-medium text-white">{step.title}</p>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className={clsx('text-xs', step.effort === 'low' ? 'text-green-400' : step.effort === 'medium' ? 'text-yellow-400' : 'text-red-400')}>{step.effort} effort</span>
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

                    {/* Response buttons */}
                    <div className="flex border-t border-gray-800/60">
                      {(['yes','partial','no','na'] as Status[]).map(status => {
                        const cfg = STATUS_CONFIG[status];
                        const selected = response === status;
                        return (
                          <button key={status} onClick={() => handleResponse(control.id, status)}
                            className={clsx('flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all',
                              selected ? `${cfg.color} ${cfg.bg} border-0` : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50')}>
                            {cfg.icon}
                            <span className="hidden sm:inline">{cfg.label}</span>
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
                <Shield className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to assess your full compliance posture?</h3>
              <p className="text-gray-400 text-sm mb-5 max-w-md mx-auto">
                The real assessment has <strong className="text-white">52 SOC 2 controls</strong>, 5 frameworks (SOC 2, FedRAMP, PCI DSS, PCI PIN, NIST AI RMF), auto-generated findings, and step-by-step remediation plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" /> Create Free Account
                </Link>
                <Link to="/login" className="btn-secondary">Already have an account? Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign up nudge modal */}
      {showSignupPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-brand-600/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-400" />
              </div>
              <button onClick={() => setShowSignupPrompt(false)} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">You're making good progress!</h3>
            <p className="text-gray-400 text-sm mb-5">
              Create a free account to save your assessment, get the full 52-control SOC 2 questionnaire, auto-generated findings, and remediation plans.
            </p>
            <div className="space-y-2">
              <Link to="/register" className="btn-primary w-full flex items-center justify-center gap-2">
                Create Free Account — it takes 1 minute
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
