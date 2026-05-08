import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Shield, AlertTriangle, CheckCircle2, Clock, ChevronRight, TrendingUp, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { Assessment, Framework } from '../types';
import { useAuth } from '../hooks/useAuth';
import ScoreGauge from '../components/ScoreGauge';
import clsx from 'clsx';

const CATEGORY_COLORS: Record<string, string> = {
  security: 'bg-indigo-500',
  availability: 'bg-green-500',
  processing_integrity: 'bg-yellow-500',
  confidentiality: 'bg-red-500',
  privacy: 'bg-purple-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  security: 'Security',
  availability: 'Availability',
  processing_integrity: 'Processing Integrity',
  confidentiality: 'Confidentiality',
  privacy: 'Privacy',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: assessments = [], isLoading } = useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: () => api.get('/assessments').then(r => r.data),
  });

  const deleteAssessment = useMutation({
    mutationFn: (id: string) => api.delete(`/assessments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assessments'] }),
  });

  const latestAssessment = assessments[0];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 sm:mb-8 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-gray-400 mt-1 text-sm truncate">
            {user?.companyName ? `${user.companyName} — ` : ''}Technology Risk Assessment
          </p>
        </div>
        <button
          onClick={() => navigate('/assessments/new')}
          className="btn-primary flex items-center gap-2 shrink-0 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Assessment</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : assessments.length === 0 ? (
        <EmptyState onNew={() => navigate('/assessments/new')} />
      ) : (
        <div className="space-y-6">
          {/* Hero card — latest assessment */}
          {latestAssessment && (
            <LatestAssessmentCard
              assessment={latestAssessment}
              onDelete={(id) => deleteAssessment.mutate(id)}
              deleting={deleteAssessment.isPending}
            />
          )}

          {/* All assessments */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">All Assessments</h2>
            <div className="grid gap-4">
              {assessments.map(a => (
                <AssessmentCard
                  key={a.id}
                  assessment={a}
                  onDelete={(id) => deleteAssessment.mutate(id)}
                  deleting={deleteAssessment.isPending && deleteAssessment.variables === a.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LatestAssessmentCard({ assessment, onDelete, deleting }: {
  assessment: Assessment;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const scope = Array.isArray(assessment.scope) ? assessment.scope : [];

  return (
    <div className="card bg-gradient-to-br from-gray-900 to-gray-900/50 border-brand-800/40">
      <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
        <div className="min-w-0">
          <div className="text-xs text-brand-400 font-medium uppercase tracking-wider mb-1">Latest Assessment</div>
          <h2 className="text-base sm:text-xl font-bold text-white truncate">{assessment.name}</h2>
          {assessment.description && <p className="text-gray-400 text-sm mt-1 hidden sm:block">{assessment.description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to={`/assessments/${assessment.id}`} className="btn-secondary flex items-center gap-1 text-sm">
            <span className="hidden sm:inline">Continue</span> <ChevronRight className="w-4 h-4" />
          </Link>
          <DeleteButton
            id={assessment.id}
            confirmId={confirmId}
            setConfirmId={setConfirmId}
            onDelete={onDelete}
            deleting={deleting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-center">
        {/* Score gauge */}
        <div className="flex justify-center">
          <ScoreGauge score={Math.round(assessment.overall_score)} label="Compliance Score" />
        </div>

        {/* Scope badges */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Scope</p>
            <div className="flex flex-wrap gap-2">
              {scope.map((cat) => (
                <span key={cat} className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs text-gray-300">
                  <span className={clsx('w-2 h-2 rounded-full', CATEGORY_COLORS[cat] ?? 'bg-gray-500')} />
                  {CATEGORY_LABELS[cat] ?? cat}
                </span>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatChip
              icon={<CheckCircle2 className="w-4 h-4 text-green-400" />}
              label="Answered"
              value={`${assessment.responded_controls ?? 0} controls`}
            />
            <StatChip
              icon={<AlertTriangle className="w-4 h-4 text-orange-400" />}
              label="Open Findings"
              value={`${assessment.open_findings ?? 0}`}
            />
            <StatChip
              icon={<Clock className="w-4 h-4 text-blue-400" />}
              label="Status"
              value={assessment.status === 'completed' ? 'Completed' : 'In Progress'}
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link to={`/assessments/${assessment.id}/findings`} className="btn-secondary text-sm flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              View Findings
            </Link>
            <Link to={`/assessments/${assessment.id}/remediation`} className="btn-secondary text-sm flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Remediation Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700/50">
      <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-xs text-gray-500">{label}</span></div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function AssessmentCard({ assessment, onDelete, deleting }: {
  assessment: Assessment;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const score = Math.round(assessment.overall_score);
  const scoreColor = score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="card flex items-center gap-4 hover:border-gray-700 transition-colors group">
      <Link to={`/assessments/${assessment.id}`} className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-medium text-white group-hover:text-brand-300 transition-colors truncate">{assessment.name}</div>
            <FrameworkBadge framework={assessment.framework ?? 'soc2'} impactLevel={assessment.impact_level} />
          </div>
          <div className="text-sm text-gray-500 mt-0.5">
            {new Date(assessment.updated_at).toLocaleDateString()} · {assessment.open_findings ?? 0} open findings
          </div>
        </div>
        <div className={clsx('text-2xl font-bold tabular-nums shrink-0', scoreColor)}>{score}%</div>
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
      </Link>
      <DeleteButton
        id={assessment.id}
        confirmId={confirmId}
        setConfirmId={setConfirmId}
        onDelete={onDelete}
        deleting={deleting}
      />
    </div>
  );
}

function DeleteButton({ id, confirmId, setConfirmId, onDelete, deleting }: {
  id: string;
  confirmId: string | null;
  setConfirmId: (id: string | null) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const isConfirming = confirmId === id;

  if (isConfirming) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-gray-400">Delete?</span>
        <button
          onClick={() => { onDelete(id); setConfirmId(null); }}
          disabled={deleting}
          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
        >
          {deleting ? '…' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirmId(null)}
          className="text-gray-500 hover:text-gray-300 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); setConfirmId(id); }}
      className="shrink-0 p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
      title="Delete assessment"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

function FrameworkBadge({ framework, impactLevel }: { framework: Framework; impactLevel?: string }) {
  if (framework === 'fedramp') {
    const level = impactLevel ? impactLevel.charAt(0).toUpperCase() + impactLevel.slice(1) : 'Moderate';
    return (
      <span className="text-xs bg-blue-900/40 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
        🦅 FedRAMP {level}
      </span>
    );
  }
  if (framework === 'pci_dss') {
    const entity = impactLevel === 'service_provider' ? 'Svc Provider' : 'Merchant';
    return (
      <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
        💳 PCI DSS {entity}
      </span>
    );
  }
  if (framework === 'nist_ai_rmf') {
    return (
      <span className="text-xs bg-purple-900/40 text-purple-400 border border-purple-800/40 px-2 py-0.5 rounded-full shrink-0">
        🤖 NIST AI RMF
      </span>
    );
  }
  if (framework === 'pci_pin') {
    return (
      <span className="text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-800/40 px-2 py-0.5 rounded-full shrink-0">
        🔑 PCI PIN
      </span>
    );
  }
  return (
    <span className="text-xs bg-brand-900/40 text-brand-400 border border-brand-800/40 px-2 py-0.5 rounded-full shrink-0">
      🔐 SOC 2
    </span>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="card text-center py-16">
      <div className="w-16 h-16 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-brand-400" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Start your first assessment</h2>
      <p className="text-gray-400 max-w-md mx-auto mb-6">
        Assess your current SOC 2 compliance posture across all Trust Service Criteria and get
        AI-powered remediation guidance to close the gaps.
      </p>
      <button onClick={onNew} className="btn-primary inline-flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Create Assessment
      </button>
    </div>
  );
}
