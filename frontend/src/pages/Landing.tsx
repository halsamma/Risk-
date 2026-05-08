import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Shield, CheckCircle2, AlertTriangle, BarChart3,
  FileSearch, Sparkles, Lock, Target, ArrowRight
} from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

// ── Static demo data ──────────────────────────────────────────────────────────
const DEMO_CATEGORIES = [
  { name: 'Security',        score: 62, total: 36, answered: 36, color: '#6366f1' },
  { name: 'Availability',    score: 75, total: 3,  answered: 3,  color: '#22c55e' },
  { name: 'Confidentiality', score: 50, total: 2,  answered: 2,  color: '#ef4444' },
  { name: 'Privacy',         score: 40, total: 8,  answered: 8,  color: '#8b5cf6' },
];

const DEMO_FINDINGS = [
  { severity: 'critical', title: 'No vulnerability management program',    control: 'CC7.1', status: 'open'        },
  { severity: 'critical', title: 'No incident response plan',              control: 'CC7.2', status: 'in_progress' },
  { severity: 'high',     title: 'MFA not enforced on all systems',        control: 'CC5.2', status: 'in_progress' },
  { severity: 'high',     title: 'No formal risk assessment performed',    control: 'CC3.2', status: 'open'        },
  { severity: 'medium',   title: 'Backup restore not tested',              control: 'A1.2',  status: 'open'        },
];

const DEMO_STEPS = [
  { order: 1, title: 'Enable phishing-resistant MFA', timeframe: '3 days',  effort: 'low',    done: true  },
  { order: 2, title: 'Configure RBAC in Okta & AWS IAM', timeframe: '1 week', effort: 'medium', done: true  },
  { order: 3, title: 'Deploy EDR on all endpoints',   timeframe: '1 week',  effort: 'medium', done: false },
  { order: 4, title: 'Launch vulnerability scan program', timeframe: '2 weeks', effort: 'high', done: false },
];

const SEV_CONFIG: Record<string, { cls: string; dot: string }> = {
  critical: { cls: 'badge-critical', dot: 'bg-red-500'    },
  high:     { cls: 'badge-high',     dot: 'bg-orange-500' },
  medium:   { cls: 'badge-medium',   dot: 'bg-yellow-500' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open:        { label: 'Open',        color: 'text-gray-400'   },
  in_progress: { label: 'In Progress', color: 'text-yellow-400' },
  resolved:    { label: 'Resolved',    color: 'text-green-400'  },
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ── Nav ── */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">SOC2 Compass</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm flex items-center gap-1.5">
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-900/40 border border-brand-800/60 rounded-full px-4 py-1.5 text-xs text-brand-400 font-medium mb-6">
          <Sparkles className="w-3 h-3" /> AI-powered SOC 2 compliance — from 10% to 95%
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
          SOC 2 compliance,<br />
          <span className="text-brand-400">without the guesswork</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg mt-4 max-w-xl mx-auto">
          Assess your current state across all 5 Trust Service Criteria, auto-generate findings,
          and get AI-tailored remediation plans — step by step.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-base px-6 py-3 flex items-center gap-2 w-full sm:w-auto justify-center">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-base px-6 py-3 flex items-center gap-2 w-full sm:w-auto justify-center">
                Start Free Assessment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-6 py-3 w-full sm:w-auto text-center">Sign in</Link>
            </>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-3">No credit card · Works with your existing stack</p>
      </div>

      {/* ── Live Demo Preview ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="text-center mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Live product preview</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">See exactly what you get</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Panel 1 — Score gauge */}
          <div className="card flex flex-col items-center py-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-medium">Overall Score</p>
            <DemoGauge score={58} />
            <div className="mt-6 w-full space-y-2">
              {DEMO_CATEGORIES.map(cat => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-28 truncate">{cat.name}</span>
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${cat.score}%`, backgroundColor: cat.color }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{cat.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2 — Findings */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">Open Findings</p>
              <span className="text-xs bg-red-900/40 text-red-400 border border-red-800/40 px-2 py-0.5 rounded-full">
                {DEMO_FINDINGS.filter(f => f.status !== 'resolved').length} open
              </span>
            </div>
            <div className="space-y-2">
              {DEMO_FINDINGS.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-800/50 border border-gray-800">
                  <span className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', SEV_CONFIG[f.severity]?.dot)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-200 leading-snug">{f.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{f.control}</p>
                  </div>
                  <span className={clsx('text-xs shrink-0', STATUS_CONFIG[f.status]?.color)}>
                    {STATUS_CONFIG[f.status]?.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 3 — Remediation plan */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <p className="text-sm font-semibold text-white">AI Remediation Plan</p>
            </div>
            <p className="text-xs text-gray-400 mb-4">CC6.1 — Logical Access Controls (High)</p>
            <div className="space-y-2.5">
              {DEMO_STEPS.map(step => (
                <div key={step.order} className={clsx('flex items-start gap-2.5', step.done && 'opacity-60')}>
                  <div className={clsx(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                    step.done ? 'bg-green-600 border-green-600' : 'border-gray-600'
                  )}>
                    {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-xs font-medium', step.done ? 'text-gray-500 line-through' : 'text-gray-200')}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{step.timeframe} · {step.effort} effort</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
              2 of 4 steps complete · Est. 2 weeks remaining
            </div>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="border-t border-gray-800 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">Everything you need for SOC 2</h2>
            <p className="text-gray-400 mt-2">Built for IT and GRC professionals who need results, not theory</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="card hover:border-gray-700 transition-colors">
                <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center mb-3', f.iconBg)}>
                  <f.Icon className={clsx('w-4 h-4', f.iconColor)} />
                </div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Ready to close your compliance gaps?</h2>
          <p className="text-gray-400 mt-3 text-lg">
            Create a free account and start your first assessment in under 5 minutes.
          </p>
          {user ? (
            <Link to="/dashboard" className="btn-primary mt-8 inline-flex items-center gap-2 text-base px-8 py-3">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link to="/register" className="btn-primary mt-8 inline-flex items-center gap-2 text-base px-8 py-3">
              Start Free Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            SOC2 Compass
          </div>
          <div>Covers all 5 Trust Service Criteria · 52 controls · OWASP-compliant</div>
        </div>
      </div>
    </div>
  );
}

// ── Demo gauge (lightweight, no full ScoreGauge import needed) ────────────────
function DemoGauge({ score }: { score: number }) {
  const color = score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative w-40 h-40">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%"
          barSize={12} data={[{ value: score, fill: color }]} startAngle={225} endAngle={-45}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: '#1f2937' }} dataKey="value" angleAxisId={0} cornerRadius={6} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-gray-400 -mt-0.5">/ 100</span>
        <span className="text-xs font-medium text-yellow-400 mt-0.5">Fair</span>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: 'Guided Questionnaire',
    description: 'Answer Yes / Partial / No for each control with inline guidance, evidence prompts, and examples.',
    Icon: BarChart3, iconBg: 'bg-indigo-900/40', iconColor: 'text-indigo-400',
  },
  {
    title: 'Document Analysis',
    description: 'Upload your policies and procedures — Claude reads them and maps coverage to controls automatically.',
    Icon: FileSearch, iconBg: 'bg-blue-900/40', iconColor: 'text-blue-400',
  },
  {
    title: 'AI Remediation Plans',
    description: 'Get step-by-step plans tailored to your stack. Context-aware — tells you exactly what to do in AWS, Okta, or GitHub.',
    Icon: Sparkles, iconBg: 'bg-brand-900/40', iconColor: 'text-brand-400',
  },
  {
    title: 'Prioritized Findings',
    description: 'Critical gaps surface first. Status tracking lets you mark progress without losing context.',
    Icon: AlertTriangle, iconBg: 'bg-orange-900/40', iconColor: 'text-orange-400',
  },
  {
    title: 'All 5 Trust Service Criteria',
    description: 'Security, Availability, Processing Integrity, Confidentiality, and Privacy — all 52 controls covered.',
    Icon: Target, iconBg: 'bg-green-900/40', iconColor: 'text-green-400',
  },
  {
    title: 'OWASP-Compliant',
    description: 'The platform itself is built to the OWASP Top 10 — rate limiting, JWT rotation, bcrypt, audit logs.',
    Icon: Lock, iconBg: 'bg-red-900/40', iconColor: 'text-red-400',
  },
];
