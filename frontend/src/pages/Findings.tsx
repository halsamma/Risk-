import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ChevronRight, Filter, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import api from '../services/api';
import { Finding, Severity, FindingStatus } from '../types';
import clsx from 'clsx';

const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low'];

const SEVERITY_CONFIG: Record<Severity, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'badge-critical' },
  high:     { label: 'High',     className: 'badge-high' },
  medium:   { label: 'Medium',   className: 'badge-medium' },
  low:      { label: 'Low',      className: 'badge-low' },
};

const STATUS_CONFIG: Record<FindingStatus, { label: string; icon: React.ReactNode; color: string }> = {
  open:        { label: 'Open',        icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-400' },
  in_progress: { label: 'In Progress', icon: <Clock className="w-3.5 h-3.5" />,         color: 'text-yellow-400' },
  resolved:    { label: 'Resolved',    icon: <CheckCircle2 className="w-3.5 h-3.5" />,  color: 'text-green-400' },
};

export default function Findings() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<FindingStatus | 'all'>('all');

  const { data: findings = [], isLoading } = useQuery<Finding[]>({
    queryKey: ['findings', id],
    queryFn: () => api.get(`/assessments/${id}/findings`).then(r => r.data),
  });

  const { data: assessment } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => api.get(`/assessments/${id}`).then(r => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ findingId, status }: { findingId: string; status: FindingStatus }) =>
      api.patch(`/assessments/${id}/findings/${findingId}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['findings', id] }),
  });

  const filtered = findings.filter(f =>
    (severityFilter === 'all' || f.severity === severityFilter) &&
    (statusFilter === 'all' || f.status === statusFilter)
  );

  const grouped = SEVERITY_ORDER.reduce<Record<Severity, Finding[]>>((acc, sev) => {
    acc[sev] = filtered.filter(f => f.severity === sev);
    return acc;
  }, { critical: [], high: [], medium: [], low: [] });

  const counts = {
    total: findings.length,
    open: findings.filter(f => f.status === 'open').length,
    inProgress: findings.filter(f => f.status === 'in_progress').length,
    resolved: findings.filter(f => f.status === 'resolved').length,
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
        <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/assessments/${id}`} className="hover:text-white truncate max-w-xs">{assessment?.name}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">Findings</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Findings</h1>
          <p className="text-gray-400 mt-1">
            {counts.open} open · {counts.inProgress} in progress · {counts.resolved} resolved
          </p>
        </div>
        <Link to={`/assessments/${id}/remediation`} className="btn-primary flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4" /> View Remediation Plans
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {SEVERITY_ORDER.map(sev => {
          const count = findings.filter(f => f.severity === sev).length;
          return (
            <button
              key={sev}
              onClick={() => setSeverityFilter(severityFilter === sev ? 'all' : sev)}
              className={clsx(
                'card text-left transition-all hover:border-gray-600',
                severityFilter === sev && 'ring-2 ring-brand-500'
              )}
            >
              <div className={SEVERITY_CONFIG[sev].className + ' inline-block mb-2'}>{SEVERITY_CONFIG[sev].label}</div>
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-xs text-gray-500">findings</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-gray-500" />
        <div className="flex gap-2">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={clsx(
                'text-xs px-3 py-1 rounded-full border transition-colors',
                statusFilter === s ? 'bg-brand-600 border-brand-600 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'
              )}
            >
              {s === 'all' ? 'All Status' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <p className="text-white font-medium">
            {findings.length === 0 ? 'No findings yet' : 'No findings match the current filters'}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {findings.length === 0 ? 'Complete the questionnaire to identify gaps' : 'Try clearing the filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {SEVERITY_ORDER.map(sev => {
            const items = grouped[sev];
            if (!items.length) return null;
            return (
              <div key={sev}>
                <h2 className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                  <span className={SEVERITY_CONFIG[sev].className}>{SEVERITY_CONFIG[sev].label}</span>
                  <span>{items.length} finding{items.length !== 1 ? 's' : ''}</span>
                </h2>
                <div className="space-y-2">
                  {items.map(finding => (
                    <FindingCard
                      key={finding.id}
                      finding={finding}
                      assessmentId={id!}
                      onStatusChange={(status) => updateStatus.mutate({ findingId: finding.id, status })}
                    />
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

function FindingCard({ finding, assessmentId, onStatusChange }: {
  finding: Finding;
  assessmentId: string;
  onStatusChange: (s: FindingStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[finding.status];

  return (
    <div className={clsx(
      'border rounded-xl overflow-hidden transition-all',
      finding.status === 'resolved' ? 'border-green-900/40 opacity-70' : 'border-gray-800'
    )}>
      <div
        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-800/30"
        onClick={() => setExpanded(e => !e)}
      >
        <span className={clsx('mt-0.5 shrink-0', statusCfg.color)}>{statusCfg.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-white">{finding.title}</span>
            <span className="text-xs text-gray-500 shrink-0 font-mono">{finding.control_id}</span>
          </div>
          {finding.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{finding.description}</p>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800/60 pt-3 space-y-3">
          {finding.description && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-gray-300">{finding.description}</p>
            </div>
          )}
          {finding.recommendation && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Recommendation</p>
              <p className="text-sm text-gray-300">{finding.recommendation}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              {(['open', 'in_progress', 'resolved'] as FindingStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={clsx(
                    'text-xs px-2.5 py-1 rounded-full border transition-colors',
                    finding.status === s ? 'bg-brand-600 border-brand-600 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  )}
                >
                  {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            {finding.plan_id && (
              <Link
                to={`/assessments/${assessmentId}/remediation/${finding.plan_id}`}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <TrendingUp className="w-3 h-3" /> View Plan
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
