import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronRight, CheckCircle2, Circle, Clock, Sparkles, BookOpen,
  Loader2, AlertTriangle, Target, Lightbulb, Shield
} from 'lucide-react';
import api from '../services/api';
import { RemediationPlan, PlanStatus } from '../types';
import clsx from 'clsx';

const EFFORT_COLOR: Record<string, string> = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-red-400',
};

export default function RemediationDetail() {
  const { id, planId } = useParams<{ id: string; planId: string }>();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [aiContext, setAiContext] = useState('');
  const [showAiForm, setShowAiForm] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const { data: plan, isLoading } = useQuery<RemediationPlan>({
    queryKey: ['remediation-plan', id, planId],
    queryFn: () => api.get(`/assessments/${id}/remediation/${planId}`).then(r => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: (status: PlanStatus) =>
      api.patch(`/assessments/${id}/remediation/${planId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['remediation-plan', id, planId] }),
  });

  const handleGenerateAI = async () => {
    if (!plan) return;
    setGenerating(true);
    try {
      await api.post(`/assessments/${id}/remediation/generate`, {
        findingId: plan.finding_id,
        context: aiContext,
      });
      queryClient.invalidateQueries({ queryKey: ['remediation-plan', id, planId] });
      queryClient.invalidateQueries({ queryKey: ['remediation', id] });
      setShowAiForm(false);
    } catch (err: any) {
      alert(err?.response?.data?.error ?? 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!plan) return (
    <div className="p-8 text-center text-gray-400">Plan not found</div>
  );

  const content = plan.content;
  const steps = content?.steps ?? [];

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-6 flex-wrap">
        <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/assessments/${id}`} className="hover:text-white">Assessment</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/assessments/${id}/remediation`} className="hover:text-white">Remediation</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white truncate max-w-xs">{plan.finding_title}</span>
      </div>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {plan.type === 'ai_generated'
                ? <span className="text-xs flex items-center gap-1 bg-brand-900/40 text-brand-400 border border-brand-800/40 px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> AI Generated</span>
                : <span className="text-xs flex items-center gap-1 bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full"><BookOpen className="w-3 h-3" /> Static Playbook</span>
              }
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded-full',
                plan.severity === 'critical' ? 'badge-critical' :
                plan.severity === 'high' ? 'badge-high' :
                plan.severity === 'medium' ? 'badge-medium' : 'badge-low'
              )}>
                {plan.severity}
              </span>
              <span className="text-xs text-gray-500 font-mono">{plan.control_id}</span>
            </div>
            <h1 className="text-xl font-bold text-white">{plan.finding_title}</h1>
            {content?.summary && (
              <p className="text-gray-400 text-sm mt-2">{content.summary}</p>
            )}
          </div>
        </div>

        {/* Meta info */}
        {(content?.priority || content?.estimatedEffort) && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-800">
            {content.priority && (
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <p className="text-sm text-white capitalize">{content.priority.replace('_', ' ')}</p>
              </div>
            )}
            {content.estimatedEffort && (
              <div>
                <p className="text-xs text-gray-500">Estimated Effort</p>
                <p className="text-sm text-white">{content.estimatedEffort}</p>
              </div>
            )}
            {content.objective && (
              <div className="flex-1">
                <p className="text-xs text-gray-500">Objective</p>
                <p className="text-sm text-white">{content.objective}</p>
              </div>
            )}
          </div>
        )}

        {/* Status control */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-800">
          <span className="text-sm text-gray-400">Status:</span>
          {(['pending', 'in_progress', 'completed'] as PlanStatus[]).map(s => (
            <button
              key={s}
              onClick={() => updateStatus.mutate(s)}
              className={clsx(
                'text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5',
                plan.status === s ? 'bg-brand-600 border-brand-600 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'
              )}
            >
              {s === 'pending' && <Circle className="w-3 h-3" />}
              {s === 'in_progress' && <Clock className="w-3 h-3" />}
              {s === 'completed' && <CheckCircle2 className="w-3 h-3" />}
              {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Remediation Steps</h2>
          <span className="text-sm text-gray-500">{completedSteps.size}/{steps.length} done</span>
        </div>

        <div className="space-y-3">
          {steps.map((step: any, i: number) => {
            const done = completedSteps.has(step.order ?? i);
            return (
              <div
                key={step.order ?? i}
                className={clsx(
                  'border rounded-xl p-4 transition-all',
                  done ? 'border-green-800/40 bg-green-950/20 opacity-80' : 'border-gray-800 bg-gray-900'
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setCompletedSteps(prev => {
                      const next = new Set(prev);
                      if (done) next.delete(step.order ?? i);
                      else next.add(step.order ?? i);
                      return next;
                    })}
                    className={clsx(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                      done ? 'bg-green-600 border-green-600' : 'border-gray-600 hover:border-gray-400'
                    )}
                  >
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={clsx('font-medium text-sm', done ? 'text-gray-500 line-through' : 'text-white')}>
                        Step {step.order}: {step.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {step.effort && (
                          <span className={clsx('text-xs', EFFORT_COLOR[step.effort] ?? 'text-gray-400')}>
                            {step.effort} effort
                          </span>
                        )}
                        {step.timeframe && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {step.timeframe}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>

                    {step.acceptanceCriteria && (
                      <div className="mt-2 flex items-start gap-2 bg-gray-800/60 rounded-lg p-2">
                        <Target className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-400"><span className="text-gray-300">Done when: </span>{step.acceptanceCriteria}</p>
                      </div>
                    )}

                    {step.tools?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {step.tools.map((tool: string, ti: number) => (
                          <span key={ti} className="text-xs bg-gray-800 border border-gray-700 rounded-full px-2 py-0.5 text-gray-400">{tool}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success metrics */}
      {(content?.successMetrics ?? []).length > 0 && (
        <div className="card mb-4">
          <h3 className="font-medium text-white flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-400" /> Success Metrics
          </h3>
          <ul className="space-y-1.5">
            {(content?.successMetrics ?? []).map((m: string, i: number) => (
              <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" /> {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks */}
      {(content?.risks ?? []).length > 0 && (
        <div className="card mb-6">
          <h3 className="font-medium text-white flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" /> Risks to Watch
          </h3>
          <ul className="space-y-1.5">
            {(content?.risks ?? []).map((r: string, i: number) => (
              <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" /> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Generate / Upgrade */}
      <div className="card border-brand-800/40">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-white">
              {plan.type === 'ai_generated' ? 'Regenerate with AI' : 'Upgrade to AI-Generated Plan'}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Get a tailored remediation plan from Claude, customized to your organization's context.
            </p>
            {!showAiForm ? (
              <button onClick={() => setShowAiForm(true)} className="btn-primary mt-3 text-sm flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                {plan.type === 'ai_generated' ? 'Regenerate' : 'Generate AI Plan'}
              </button>
            ) : (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="label text-xs">
                    <Lightbulb className="w-3 h-3 inline mr-1 text-yellow-400" />
                    Add context about your environment (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={aiContext}
                    onChange={e => setAiContext(e.target.value)}
                    className="input text-sm resize-none"
                    placeholder="e.g., We use AWS, have 50 employees, currently have no MFA solution deployed. We are a SaaS company handling healthcare data..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateAI}
                    disabled={generating}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {generating ? 'Generating…' : 'Generate'}
                  </button>
                  <button onClick={() => setShowAiForm(false)} className="btn-secondary text-sm">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
