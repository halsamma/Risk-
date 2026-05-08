import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, CheckCircle2, Clock, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import api from '../services/api';
import { RemediationPlan } from '../types';
import clsx from 'clsx';

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low'];

const PLAN_STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending:     { label: 'Pending',     icon: <AlertCircle  className="w-4 h-4" />, color: 'text-gray-400'   },
  in_progress: { label: 'In Progress', icon: <Clock        className="w-4 h-4" />, color: 'text-yellow-400' },
  completed:   { label: 'Completed',   icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-400'  },
};

export default function Remediation() {
  const { id } = useParams<{ id: string }>();

  const { data: plans = [], isLoading } = useQuery<RemediationPlan[]>({
    queryKey: ['remediation', id],
    queryFn: () => api.get(`/assessments/${id}/remediation`).then(r => r.data),
  });

  const { data: assessment } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => api.get(`/assessments/${id}`).then(r => r.data),
  });

  const grouped = SEVERITY_ORDER.reduce<Record<string, RemediationPlan[]>>((acc, sev) => {
    acc[sev] = plans.filter(p => p.severity === sev);
    return acc;
  }, {});

  const stats = {
    total: plans.length,
    pending: plans.filter(p => p.status === 'pending').length,
    inProgress: plans.filter(p => p.status === 'in_progress').length,
    completed: plans.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
        <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/assessments/${id}`} className="hover:text-white max-w-xs truncate">{assessment?.name}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">Remediation</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Remediation Plans</h1>
          <p className="text-gray-400 mt-1">Step-by-step guidance to close compliance gaps</p>
        </div>
        <Link to={`/assessments/${id}/findings`} className="btn-secondary text-sm">
          View Findings
        </Link>
      </div>

      {/* Progress bar */}
      {plans.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">Overall Remediation Progress</span>
            <span className="text-sm text-gray-400">{stats.completed}/{stats.total} plans completed</span>
          </div>
          <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-green-500 rounded-full transition-all"
              style={{ width: `${stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span>{stats.pending} pending</span>
            <span>{stats.inProgress} in progress</span>
            <span className="text-green-400">{stats.completed} completed</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <p className="text-white font-medium">No remediation plans yet</p>
          <p className="text-gray-500 text-sm mt-1">Complete the assessment questionnaire to auto-generate plans for gaps</p>
          <Link to={`/assessments/${id}`} className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
            Go to Assessment
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {SEVERITY_ORDER.map(sev => {
            const items = grouped[sev] ?? [];
            if (!items.length) return null;
            return (
              <div key={sev}>
                <h2 className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                  <span className={`badge-${sev}`}>{sev.charAt(0).toUpperCase() + sev.slice(1)}</span>
                  <span>{items.length} plan{items.length !== 1 ? 's' : ''}</span>
                </h2>
                <div className="space-y-2">
                  {items.map(plan => (
                    <PlanCard key={plan.id} plan={plan} assessmentId={id!} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlanCard({ plan, assessmentId }: { plan: RemediationPlan; assessmentId: string }) {
  const statusCfg = PLAN_STATUS_CONFIG[plan.status] ?? PLAN_STATUS_CONFIG.pending;
  const content = typeof plan.content === 'string' ? JSON.parse(plan.content as any) : plan.content;

  return (
    <Link
      to={`/assessments/${assessmentId}/remediation/${plan.id}`}
      className="card flex items-start gap-4 hover:border-gray-700 transition-all group"
    >
      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
        {plan.type === 'ai_generated'
          ? <Sparkles className="w-5 h-5 text-brand-400" />
          : <BookOpen className="w-5 h-5 text-brand-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium text-white group-hover:text-brand-300 transition-colors text-sm">{plan.finding_title}</span>
          <span className={clsx('text-xs font-mono shrink-0 text-gray-500')}>{plan.control_id}</span>
        </div>
        {content?.summary && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{content.summary}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className={clsx('flex items-center gap-1 text-xs', statusCfg.color)}>
            {statusCfg.icon} {statusCfg.label}
          </span>
          <span className="text-xs text-gray-500">
            {content?.steps?.length ?? 0} steps
          </span>
          {plan.type === 'ai_generated' && (
            <span className="text-xs text-brand-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI-generated
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 shrink-0 mt-1" />
    </Link>
  );
}
