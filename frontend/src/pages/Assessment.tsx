import { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2, XCircle, MinusCircle, HelpCircle, ChevronRight,
  AlertTriangle, Upload, BookOpen, MessageSquare, Loader2, FileText,
  TrendingUp, X, Lightbulb, ListChecks, Zap, Clock, Menu
} from 'lucide-react';
import api from '../services/api';
import { SOC2Control, ControlResponse, AssessmentProgress, ControlStatus, Framework } from '../types';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';

const SOC2_LABELS: Record<string, { label: string; short: string }> = {
  security:             { label: 'Security (Common Criteria)', short: 'Security' },
  availability:         { label: 'Availability',               short: 'Availability' },
  processing_integrity: { label: 'Processing Integrity',       short: 'PI' },
  confidentiality:      { label: 'Confidentiality',            short: 'Confidentiality' },
  privacy:              { label: 'Privacy',                    short: 'Privacy' },
};

const FEDRAMP_LABELS: Record<string, { label: string; short: string }> = {
  access_control:               { label: 'Access Control',                           short: 'AC' },
  awareness_training:           { label: 'Awareness & Training',                     short: 'AT' },
  audit_accountability:         { label: 'Audit & Accountability',                   short: 'AU' },
  assessment_authorization:     { label: 'Assessment, Authorization & Monitoring',   short: 'CA' },
  configuration_management:     { label: 'Configuration Management',                 short: 'CM' },
  contingency_planning:         { label: 'Contingency Planning',                     short: 'CP' },
  identification_authentication:{ label: 'Identification & Authentication',          short: 'IA' },
  incident_response:            { label: 'Incident Response',                        short: 'IR' },
  maintenance:                  { label: 'Maintenance',                              short: 'MA' },
  media_protection:             { label: 'Media Protection',                         short: 'MP' },
  physical_environmental:       { label: 'Physical & Environmental',                 short: 'PE' },
  planning:                     { label: 'Planning',                                 short: 'PL' },
  program_management:           { label: 'Program Management',                       short: 'PM' },
  personnel_security:           { label: 'Personnel Security',                       short: 'PS' },
  pii_processing:               { label: 'PII Processing & Transparency',            short: 'PT' },
  risk_assessment:              { label: 'Risk Assessment',                          short: 'RA' },
  system_acquisition:           { label: 'System & Services Acquisition',            short: 'SA' },
  system_communications:        { label: 'System & Communications Protection',       short: 'SC' },
  system_integrity:             { label: 'System & Information Integrity',           short: 'SI' },
  supply_chain:                 { label: 'Supply Chain Risk Management',             short: 'SR' },
};

const PCI_LABELS: Record<string, { label: string; short: string }> = {
  req_1_network_security:     { label: 'Req 1 – Network Security Controls',          short: 'Req 1'  },
  req_2_secure_config:        { label: 'Req 2 – Secure Configurations',              short: 'Req 2'  },
  req_3_protect_stored_data:  { label: 'Req 3 – Protect Stored Account Data',        short: 'Req 3'  },
  req_4_protect_transmission: { label: 'Req 4 – Protect Data in Transmission',       short: 'Req 4'  },
  req_5_anti_malware:         { label: 'Req 5 – Protect Against Malware',            short: 'Req 5'  },
  req_6_secure_development:   { label: 'Req 6 – Develop Secure Systems',             short: 'Req 6'  },
  req_7_restrict_access:      { label: 'Req 7 – Restrict Access',                    short: 'Req 7'  },
  req_8_authentication:       { label: 'Req 8 – Identify Users & Authenticate',      short: 'Req 8'  },
  req_9_physical_access:      { label: 'Req 9 – Restrict Physical Access',           short: 'Req 9'  },
  req_10_logging_monitoring:  { label: 'Req 10 – Log and Monitor All Access',        short: 'Req 10' },
  req_11_security_testing:    { label: 'Req 11 – Test Security Regularly',           short: 'Req 11' },
  req_12_security_policy:     { label: 'Req 12 – Support with Policy',               short: 'Req 12' },
};

const NIST_AI_LABELS: Record<string, { label: string; short: string }> = {
  govern:  { label: 'GOVERN – Policies, Accountability & Culture',  short: 'GOVERN'  },
  map:     { label: 'MAP – Context, Use Cases & Risk Identification', short: 'MAP'    },
  measure: { label: 'MEASURE – Testing, Evaluation & Monitoring',   short: 'MEASURE' },
  manage:  { label: 'MANAGE – Response, Recovery & Treatment',      short: 'MANAGE'  },
};

const PCI_PIN_LABELS: Record<string, { label: string; short: string }> = {
  management:             { label: 'Management & Administration',    short: 'MGMT'  },
  physical_security:      { label: 'Physical Security',              short: 'PHYS'  },
  logical_security:       { label: 'Logical Security',               short: 'LOGIC' },
  key_management:         { label: 'Cryptographic Key Management',   short: 'KM'    },
  transaction_processing: { label: 'Transaction Processing',          short: 'TXN'   },
  monitoring_testing:     { label: 'Monitoring & Testing',           short: 'MON'   },
};

function getCategoryLabel(framework: Framework, cat: string): { label: string; short: string } {
  const map = framework === 'fedramp'     ? FEDRAMP_LABELS :
              framework === 'pci_dss'     ? PCI_LABELS :
              framework === 'nist_ai_rmf' ? NIST_AI_LABELS :
              framework === 'pci_pin'     ? PCI_PIN_LABELS :
              SOC2_LABELS;
  return map[cat] ?? { label: cat, short: cat };
}

function getControlCategory(framework: Framework, control: SOC2Control): string {
  if (framework === 'fedramp')     return (control as any).family;
  if (framework === 'pci_dss')     return (control as any).requirement;
  if (framework === 'nist_ai_rmf') return (control as any).function;
  if (framework === 'pci_pin')     return (control as any).domain;
  return (control as any).category;
}

const STATUS_CONFIG: Record<ControlStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  yes:     { label: 'Implemented',      icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-400',  bg: 'bg-green-900/40 border-green-700' },
  partial: { label: 'Partial',          icon: <MinusCircle  className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-900/40 border-yellow-700' },
  no:      { label: 'Not Implemented',  icon: <XCircle      className="w-4 h-4" />, color: 'text-red-400',    bg: 'bg-red-900/40 border-red-700' },
  na:      { label: 'Not Applicable',   icon: <HelpCircle   className="w-4 h-4" />, color: 'text-gray-400',   bg: 'bg-gray-800 border-gray-700' },
};

export default function Assessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedControl, setExpandedControl] = useState<string | null>(null);
  const [guidanceControlId, setGuidanceControlId] = useState<string | null>(null);
  const [guidanceQuestion, setGuidanceQuestion] = useState('');
  const [guidanceAnswer, setGuidanceAnswer] = useState('');
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const { data: assessment } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => api.get(`/assessments/${id}`).then(r => r.data),
  });

  const { data: progress } = useQuery<AssessmentProgress>({
    queryKey: ['assessment-progress', id],
    queryFn: () => api.get(`/assessments/${id}/progress`).then(r => r.data),
    refetchInterval: 10000,
  });

  const fw: Framework = assessment?.framework ?? 'soc2';

  const { data: controls = [] } = useQuery<SOC2Control[]>({
    queryKey: ['controls', fw],
    queryFn: () => api.get(`/controls?framework=${fw}`).then(r => r.data),
    enabled: !!assessment,
  });

  const responseMutation = useMutation({
    mutationFn: (payload: { controlId: string; status: ControlStatus; evidence?: string; notes?: string }) =>
      api.put(`/assessments/${id}/responses`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-progress', id] });
      queryClient.invalidateQueries({ queryKey: ['assessment', id] });
    },
  });

  const scope: string[] = assessment?.scope ?? [];
  const responses: ControlResponse[] = assessment?.responses ?? [];
  const responseMap = new Map(responses.map((r: ControlResponse) => [r.control_id, r]));

  const categoriesInScope = scope;
  const currentCategory = activeCategory ?? categoriesInScope[0];

  const controlsForCategory = controls.filter(c => getControlCategory(fw, c) === currentCategory);

  const catProgress = progress?.categoryScores?.find((cs: any) => cs.category === currentCategory);

  const handleResponse = (controlId: string, status: ControlStatus) => {
    responseMutation.mutate({ controlId, status });
  };

  const handleAskGuidance = async (controlId: string) => {
    if (!guidanceQuestion.trim()) return;
    setGuidanceLoading(true);
    setGuidanceAnswer('');
    try {
      const { data } = await api.post('/guidance/ask', { controlId, question: guidanceQuestion });
      setGuidanceAnswer(data.answer);
    } catch {
      setGuidanceAnswer('Unable to get guidance right now. Please try again.');
    } finally {
      setGuidanceLoading(false);
    }
  };

  if (!assessment) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex h-full relative">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Left sidebar — categories */}
      <div className={clsx(
        'bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 transition-transform duration-200',
        'fixed inset-y-0 left-0 z-40 w-72 lg:relative lg:w-64 lg:translate-x-0',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Assessment</div>
            <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="font-semibold text-white text-sm truncate mt-1">{assessment.name}</div>
          {progress && (
            <div className="mt-3 flex items-center gap-3">
              <div className="text-2xl font-bold text-white">{Math.round(assessment.overall_score)}%</div>
              <div className="flex-1">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${progress.completionPct}%` }} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{progress.completionPct}% complete</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {categoriesInScope.map(cat => {
            const catScore = progress?.categoryScores?.find((cs: any) => cs.category === cat);
            const isActive = currentCategory === cat;
            const catLabel = getCategoryLabel(fw, cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={clsx(
                  'w-full text-left p-3 rounded-lg mb-1 transition-colors',
                  isActive ? 'bg-brand-600/20 text-brand-300' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                )}
              >
                <div className="text-sm font-medium">{catLabel.short}</div>
                {catScore && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-current rounded-full opacity-60" style={{ width: `${catScore.score}%` }} />
                    </div>
                    <span className="text-xs">{catScore.score}%</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          <button onClick={() => setShowUpload(true)} className="btn-secondary w-full text-sm flex items-center justify-center gap-2">
            <Upload className="w-3.5 h-3.5" /> Upload Documents
          </button>
          <Link to={`/assessments/${id}/findings`} className="btn-secondary w-full text-sm flex items-center justify-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" /> View Findings
          </Link>
          <Link to={`/assessments/${id}/remediation`} className="btn-secondary w-full text-sm flex items-center justify-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> Remediation
          </Link>
        </div>
      </div>

      {/* Main — controls questionnaire */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {/* Mobile category switcher bar */}
        <div className="flex items-center gap-2 mb-4 lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white"
          >
            <Menu className="w-4 h-4" />
            {getCategoryLabel(fw, currentCategory)?.short ?? 'Categories'}
          </button>
          {progress && (
            <div className="flex items-center gap-2 text-sm">
              <div className="h-1.5 w-20 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full" style={{ width: `${progress.completionPct}%` }} />
              </div>
              <span className="text-gray-500 text-xs">{progress.completionPct}%</span>
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Category header */}
          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 hidden sm:flex items-center gap-2">
              <button onClick={() => navigate('/dashboard')} className="hover:text-white">Dashboard</button>
              <ChevronRight className="w-3 h-3" />
              <span className="truncate max-w-xs">{assessment.name}</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-white">{getCategoryLabel(fw, currentCategory)?.label}</h1>
            {catProgress && (
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span>{catProgress.answered} / {catProgress.total} answered</span>
                <span>·</span>
                <span>Score: <span className="text-white font-medium">{catProgress.score}%</span></span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {controlsForCategory.map(control => {
              const response = responseMap.get(control.id);
              const isExpanded = expandedControl === control.id;
              const isMutating = responseMutation.isPending && responseMutation.variables?.controlId === control.id;

              return (
                <div key={control.id} className={clsx(
                  'border rounded-xl overflow-hidden transition-all',
                  response?.status === 'yes' ? 'border-green-800/60 bg-green-950/20' :
                  response?.status === 'partial' ? 'border-yellow-800/60 bg-yellow-950/20' :
                  response?.status === 'no' ? 'border-red-800/60 bg-red-950/20' :
                  'border-gray-800 bg-gray-900'
                )}>
                  {/* Control header */}
                  <div
                    className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
                    onClick={() => setExpandedControl(isExpanded ? null : control.id)}
                  >
                    <div className="shrink-0 mt-0.5">
                      {response?.status ? (
                        <span className={STATUS_CONFIG[response.status].color}>
                          {STATUS_CONFIG[response.status].icon}
                        </span>
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
                        <span className={clsx(
                          'text-xs px-2 py-0.5 rounded-full shrink-0',
                          control.severity === 'critical' ? 'badge-critical' :
                          control.severity === 'high' ? 'badge-high' :
                          control.severity === 'medium' ? 'badge-medium' : 'badge-low'
                        )}>
                          {control.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail — tabbed */}
                  {isExpanded && (
                    <ControlDetail
                      control={control}
                      response={response}
                      onSaveEvidence={(evidence) =>
                        response?.status && responseMutation.mutate({ controlId: control.id, status: response.status, evidence })
                      }
                      guidanceControlId={guidanceControlId}
                      setGuidanceControlId={setGuidanceControlId}
                      guidanceQuestion={guidanceQuestion}
                      setGuidanceQuestion={setGuidanceQuestion}
                      guidanceAnswer={guidanceAnswer}
                      guidanceLoading={guidanceLoading}
                      onAskGuidance={() => handleAskGuidance(control.id)}
                    />
                  )}

                  {/* Response buttons */}
                  <div className="flex border-t border-gray-800/60">
                    {(['yes', 'partial', 'no', 'na'] as ControlStatus[]).map(status => {
                      const cfg = STATUS_CONFIG[status];
                      const selected = response?.status === status;
                      return (
                        <button
                          key={status}
                          disabled={isMutating}
                          onClick={() => handleResponse(control.id, status)}
                          className={clsx(
                            'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all',
                            selected ? `${cfg.color} ${cfg.bg} border-0` : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50',
                            isMutating && 'opacity-50 cursor-wait'
                          )}
                        >
                          {selected && isMutating ? <Loader2 className="w-3 h-3 animate-spin" /> : cfg.icon}
                          <span className="hidden sm:inline">{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category navigation */}
          <div className="flex justify-between mt-6">
            {(() => {
              const idx = categoriesInScope.indexOf(currentCategory);
              const prev = categoriesInScope[idx - 1];
              const next = categoriesInScope[idx + 1];
              return (
                <>
                  {prev ? (
                    <button onClick={() => setActiveCategory(prev)} className="btn-secondary flex items-center gap-2 text-sm">
                      ← {getCategoryLabel(fw, prev).short}
                    </button>
                  ) : <div />}
                  {next ? (
                    <button onClick={() => setActiveCategory(next)} className="btn-primary flex items-center gap-2 text-sm">
                      {getCategoryLabel(fw, next).short} →
                    </button>
                  ) : (
                    <Link to={`/assessments/${id}/findings`} className="btn-primary flex items-center gap-2 text-sm">
                      View Findings <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Document upload modal */}
      {showUpload && (
        <DocumentUploadModal
          assessmentId={id!}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
}

// ── Tabbed control detail panel ───────────────────────────────────────────────
type DetailTab = 'overview' | 'how_to_fix' | 'example';

function ControlDetail({
  control, response, onSaveEvidence,
  guidanceControlId, setGuidanceControlId,
  guidanceQuestion, setGuidanceQuestion,
  guidanceAnswer, guidanceLoading, onAskGuidance,
}: {
  control: SOC2Control;
  response: ControlResponse | undefined;
  onSaveEvidence: (evidence: string) => void;
  guidanceControlId: string | null;
  setGuidanceControlId: (id: string | null) => void;
  guidanceQuestion: string;
  setGuidanceQuestion: (q: string) => void;
  guidanceAnswer: string;
  guidanceLoading: boolean;
  onAskGuidance: () => void;
}) {
  const [tab, setTab] = useState<DetailTab>('overview');
  const isGuidanceOpen = guidanceControlId === control.id;

  const TABS: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',    label: 'Overview',    icon: <BookOpen    className="w-3.5 h-3.5" /> },
    { id: 'how_to_fix',  label: 'How to Fix',  icon: <ListChecks  className="w-3.5 h-3.5" /> },
    { id: 'example',     label: 'Example',     icon: <Lightbulb   className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="border-t border-gray-800/60">
      {/* Tab bar */}
      <div className="flex border-b border-gray-800/60">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px',
              tab === t.id
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <>
            <div>
              <p className="text-sm text-gray-300">{control.description}</p>
              <div className="mt-3 bg-gray-800/60 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Objective</p>
                <p className="text-sm text-gray-300">{control.objective}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> What to look for
              </p>
              <ul className="space-y-1">
                {control.guidance.map((g, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-brand-500 mt-1 shrink-0">·</span>{g}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Evidence to collect</p>
              <div className="flex flex-wrap gap-2">
                {control.evidenceExamples.map((e, i) => (
                  <span key={i} className="text-xs bg-gray-800 border border-gray-700 rounded-full px-2.5 py-1 text-gray-400">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            {(response?.status === 'partial' || response?.status === 'yes') && (
              <div>
                <label className="label text-xs">Your evidence / notes</label>
                <textarea
                  rows={2}
                  defaultValue={response?.evidence ?? ''}
                  onBlur={(e) => { if (e.target.value !== response?.evidence) onSaveEvidence(e.target.value); }}
                  className="input text-sm resize-none"
                  placeholder="Describe the evidence you have for this control…"
                />
              </div>
            )}
          </>
        )}

        {/* ── HOW TO FIX ── */}
        {tab === 'how_to_fix' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">Step-by-step remediation path for this control:</p>
            {control.staticRemediation.map((step, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3 border border-gray-800">
                <div className="w-6 h-6 rounded-full bg-brand-600/30 border border-brand-600/50 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0 mt-0.5">
                  {step.order}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-white">{step.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={clsx(
                        'text-xs',
                        step.effort === 'low' ? 'text-green-400' : step.effort === 'medium' ? 'text-yellow-400' : 'text-red-400'
                      )}>
                        {step.effort} effort
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />{step.timeframe}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}

            {/* Ask Claude for tailored plan */}
            <div className="border-t border-gray-800/60 pt-3">
              <button
                onClick={() => setGuidanceControlId(isGuidanceOpen ? null : control.id)}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3 h-3" />
                Ask Claude for a plan tailored to your environment
              </button>
              {isGuidanceOpen && (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={2}
                    value={guidanceQuestion}
                    onChange={e => setGuidanceQuestion(e.target.value)}
                    className="input text-sm resize-none"
                    placeholder="e.g., We use Okta + AWS + GitHub. We have 40 employees. Where do we start?"
                  />
                  <button
                    onClick={onAskGuidance}
                    disabled={guidanceLoading || !guidanceQuestion.trim()}
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    {guidanceLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquare className="w-3 h-3" />}
                    {guidanceLoading ? 'Getting guidance…' : 'Ask Claude'}
                  </button>
                  {guidanceAnswer && (
                    <div className="bg-brand-900/20 border border-brand-800/40 rounded-lg p-3 text-sm text-gray-300 whitespace-pre-wrap">
                      {guidanceAnswer}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EXAMPLE ── */}
        {tab === 'example' && (
          control.example ? (
            <div className="space-y-4">
              {/* Quick win banner */}
              <div className="bg-green-900/20 border border-green-800/40 rounded-lg p-3 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-1">Quick Win</p>
                  <p className="text-sm text-gray-300">{control.example.quickWin}</p>
                </div>
              </div>

              {/* Scenario */}
              <div className="bg-gray-800/40 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3 h-3 text-yellow-400" /> Real-World Example
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{control.example.scenario}</p>
              </div>

              {/* What evidence looks like */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" /> What the evidence looks like
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">{control.example.evidence}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No example available for this control yet.
            </div>
          )
        )}
      </div>
    </div>
  );
}

function DocumentUploadModal({ assessmentId, onClose }: { assessmentId: string; onClose: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setUploading(true);
    setResult('');
    try {
      const formData = new FormData();
      acceptedFiles.forEach(f => formData.append('files', f));
      await api.post(`/assessments/${assessmentId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(`${acceptedFiles.length} document(s) uploaded. AI analysis is running in the background — check back shortly.`);
    } catch (err: any) {
      setResult(`Upload failed: ${err?.response?.data?.error ?? 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  }, [assessmentId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'], 'text/markdown': ['.md'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h3 className="font-semibold text-white">Upload Policy Documents</h3>
            <p className="text-xs text-gray-400 mt-0.5">AI will analyze documents and suggest control responses</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">
          <div
            {...getRootProps()}
            className={clsx(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-brand-500 bg-brand-900/20' : 'border-gray-700 hover:border-gray-500'
            )}
          >
            <input {...getInputProps()} />
            <FileText className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
              </div>
            ) : isDragActive ? (
              <p className="text-brand-400">Drop files here</p>
            ) : (
              <>
                <p className="text-gray-300 font-medium">Drop files here or click to select</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOCX, TXT, MD · Max 10MB each · Up to 5 files</p>
              </>
            )}
          </div>
          {result && (
            <div className={clsx('mt-3 text-sm rounded-lg p-3', result.startsWith('Upload failed') ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400')}>
              {result}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-3">
            Upload your security policies, procedures, and other compliance documents.
            Claude will analyze them and identify which SOC 2 controls they cover.
          </p>
        </div>
      </div>
    </div>
  );
}
