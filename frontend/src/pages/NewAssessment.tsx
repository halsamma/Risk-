import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Shield, ChevronRight, AlertCircle, Check, Flag,
  FileSearch, Pencil, Upload, Loader2, X, FileText
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';
import { Framework, FedRAMPImpactLevel, CreationMode } from '../types';
import clsx from 'clsx';

// ── Framework definitions ─────────────────────────────────────────────────
const FRAMEWORKS = [
  { value: 'soc2',        label: 'SOC 2',          sub: 'AICPA Trust Service Criteria',        icon: '🔐' },
  { value: 'fedramp',     label: 'FedRAMP',         sub: 'NIST 800-53 / Federal Cloud',         icon: '🦅' },
  { value: 'pci_dss',     label: 'PCI DSS v4',      sub: 'Payment Card Industry Data Security', icon: '💳' },
  { value: 'pci_pin',     label: 'PCI PIN',          sub: 'PIN Transaction Security Requirements', icon: '🔑' },
  { value: 'nist_ai_rmf', label: 'NIST AI RMF',     sub: 'AI Risk Management Framework',        icon: '🤖' },
] as const;

// ── SOC 2 scopes ──────────────────────────────────────────────────────────
const SOC2_SCOPES = [
  { value: 'security',             label: 'Security (CC)',           description: 'Required for all SOC 2 reports', required: true },
  { value: 'availability',         label: 'Availability (A)',         description: 'Uptime meets commitments' },
  { value: 'processing_integrity', label: 'Processing Integrity (PI)', description: 'Processing is complete and accurate' },
  { value: 'confidentiality',      label: 'Confidentiality (C)',      description: 'Confidential data is protected' },
  { value: 'privacy',              label: 'Privacy (P)',              description: 'Personal info managed per commitments' },
];

// ── FedRAMP families ──────────────────────────────────────────────────────
const FEDRAMP_FAMILIES = [
  { value: 'access_control',                label: 'AC – Access Control',                       count: 8 },
  { value: 'awareness_training',            label: 'AT – Awareness & Training',                 count: 4 },
  { value: 'audit_accountability',          label: 'AU – Audit & Accountability',               count: 6 },
  { value: 'assessment_authorization',      label: 'CA – Assessment, Authorization & Monitoring', count: 4 },
  { value: 'configuration_management',      label: 'CM – Configuration Management',             count: 4 },
  { value: 'contingency_planning',          label: 'CP – Contingency Planning',                 count: 3 },
  { value: 'identification_authentication', label: 'IA – Identification & Authentication',      count: 4 },
  { value: 'incident_response',             label: 'IR – Incident Response',                    count: 4 },
  { value: 'maintenance',                   label: 'MA – Maintenance',                          count: 2 },
  { value: 'media_protection',              label: 'MP – Media Protection',                     count: 2 },
  { value: 'physical_environmental',        label: 'PE – Physical & Environmental',             count: 3 },
  { value: 'planning',                      label: 'PL – Planning',                             count: 2 },
  { value: 'program_management',            label: 'PM – Program Management',                   count: 2 },
  { value: 'personnel_security',            label: 'PS – Personnel Security',                   count: 3 },
  { value: 'pii_processing',               label: 'PT – PII Processing',                       count: 2 },
  { value: 'risk_assessment',               label: 'RA – Risk Assessment',                      count: 3 },
  { value: 'system_acquisition',            label: 'SA – System Acquisition',                   count: 3 },
  { value: 'system_communications',         label: 'SC – System & Communications',              count: 6 },
  { value: 'system_integrity',              label: 'SI – System Integrity',                     count: 5 },
  { value: 'supply_chain',                  label: 'SR – Supply Chain',                         count: 2 },
];

// ── PCI DSS requirements ──────────────────────────────────────────────────
const PCI_REQUIREMENTS = [
  { value: 'req_1_network_security',    label: 'Req 1 – Network Security Controls',           count: 8 },
  { value: 'req_2_secure_config',       label: 'Req 2 – Secure Configurations',               count: 6 },
  { value: 'req_3_protect_stored_data', label: 'Req 3 – Protect Stored Account Data',         count: 7 },
  { value: 'req_4_protect_transmission',label: 'Req 4 – Protect Data in Transmission',        count: 4 },
  { value: 'req_5_anti_malware',        label: 'Req 5 – Anti-Malware Protection',             count: 5 },
  { value: 'req_6_secure_development',  label: 'Req 6 – Secure Systems & Software',           count: 7 },
  { value: 'req_7_restrict_access',     label: 'Req 7 – Restrict Access by Business Need',    count: 4 },
  { value: 'req_8_authentication',      label: 'Req 8 – Identify Users & Authenticate',       count: 7 },
  { value: 'req_9_physical_access',     label: 'Req 9 – Restrict Physical Access',            count: 5 },
  { value: 'req_10_logging_monitoring', label: 'Req 10 – Log and Monitor Access',              count: 6 },
  { value: 'req_11_security_testing',   label: 'Req 11 – Test Security Systems',              count: 6 },
  { value: 'req_12_security_policy',    label: 'Req 12 – Security Policy',                    count: 7 },
];

// ── PCI PIN domains ───────────────────────────────────────────────────────
const PCI_PIN_DOMAINS = [
  { value: 'management',             label: 'Management & Administration',    description: 'Policies, personnel, vendor management',                          count: 7 },
  { value: 'physical_security',      label: 'Physical Security',              description: 'PED physical protection, tamper detection, shipping',             count: 4 },
  { value: 'logical_security',       label: 'Logical Security',               description: 'Access control, hardening, network security, patching',           count: 5 },
  { value: 'key_management',         label: 'Cryptographic Key Management',   description: 'Full key lifecycle: generation, distribution, storage, destruction', count: 7 },
  { value: 'transaction_processing', label: 'Transaction Processing',          description: 'PIN entry, encryption, dual control, transmission security',      count: 5 },
  { value: 'monitoring_testing',     label: 'Monitoring & Testing',           description: 'Audit logs, log review, vulnerability testing, incident response', count: 5 },
];

// ── NIST AI RMF functions ──────────────────────────────────────────────────
const NIST_AI_FUNCTIONS = [
  { value: 'govern',  label: 'GOVERN (GV)', description: 'Policies, accountability, culture, and org risk management for AI', count: 13, color: '#6366f1' },
  { value: 'map',     label: 'MAP (MP)',    description: 'Identify AI context, intended uses, potential harms, and risk categorization', count: 9, color: '#22c55e' },
  { value: 'measure', label: 'MEASURE (MS)',description: 'Analyze, test, evaluate, and monitor AI risk with tools and metrics', count: 11, color: '#f59e0b' },
  { value: 'manage',  label: 'MANAGE (MG)', description: 'Prioritize, respond to, and recover from AI risks through defined processes', count: 8, color: '#ef4444' },
];

// ── FedRAMP impact levels ──────────────────────────────────────────────────
const IMPACT_LEVELS: { value: FedRAMPImpactLevel; label: string; description: string }[] = [
  { value: 'low',      label: 'Low',      description: 'Limited adverse effect on operations, assets, or individuals' },
  { value: 'moderate', label: 'Moderate', description: 'Serious adverse effect — most SaaS targets Moderate' },
  { value: 'high',     label: 'High',     description: 'Severe or catastrophic effect — healthcare, finance, national security' },
];

const schema = z.object({
  name: z.string().min(1, 'Assessment name is required').max(200),
  description: z.string().max(1000).optional(),
});
type FormData = z.infer<typeof schema>;

const DEFAULT_NAMES: Record<Framework, string> = {
  soc2:        'SOC 2 Readiness Assessment',
  fedramp:     'FedRAMP Moderate Readiness Assessment',
  pci_dss:     'PCI DSS v4 Readiness Assessment',
  pci_pin:     'PCI PIN Security Readiness Assessment',
  nist_ai_rmf: 'NIST AI RMF Readiness Assessment',
};

export default function NewAssessment() {
  const navigate = useNavigate();

  const [framework, setFramework]     = useState<Framework>('soc2');
  const [impactLevel, setImpactLevel] = useState<FedRAMPImpactLevel>('moderate');
  const [scope, setScope]             = useState<string[]>(['security']);
  const [mode, setMode]               = useState<CreationMode>('scratch');
  const [findingsText, setFindingsText] = useState('');
  const [uploading, setUploading]     = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [error, setError]             = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: DEFAULT_NAMES.soc2 },
  });

  function handleFrameworkChange(fw: Framework) {
    setFramework(fw);
    setValue('name', DEFAULT_NAMES[fw]);
    if (fw === 'fedramp')          setScope(FEDRAMP_FAMILIES.map(f => f.value));
    else if (fw === 'pci_dss')     setScope(PCI_REQUIREMENTS.map(r => r.value));
    else if (fw === 'pci_pin')     setScope(PCI_PIN_DOMAINS.map(d => d.value));
    else if (fw === 'nist_ai_rmf') setScope(NIST_AI_FUNCTIONS.map(f => f.value));
    else setScope(['security']);
  }

  function toggleScope(val: string, required?: boolean) {
    if (required) return;
    setScope(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }

  // File drop for findings mode
  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    try {
      const text = await file.text();
      setFindingsText(text.slice(0, 100000));
      setUploadedFileName(file.name);
    } catch {
      setError('Failed to read file');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'], 'text/markdown': ['.md'],
              'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const totalControls =
    framework === 'fedramp'     ? FEDRAMP_FAMILIES.filter(f => scope.includes(f.value)).reduce((s, f) => s + f.count, 0) :
    framework === 'pci_dss'     ? PCI_REQUIREMENTS.filter(r => scope.includes(r.value)).reduce((s, r) => s + r.count, 0) :
    framework === 'pci_pin'     ? PCI_PIN_DOMAINS.filter(d => scope.includes(d.value)).reduce((s, d) => s + d.count, 0) :
    framework === 'nist_ai_rmf' ? NIST_AI_FUNCTIONS.filter(f => scope.includes(f.value)).reduce((s, f) => s + f.count, 0) :
    SOC2_SCOPES.filter(s => scope.includes(s.value)).reduce((sum, s) => {
      const counts: Record<string, number> = { security: 36, availability: 3, processing_integrity: 3, confidentiality: 2, privacy: 8 };
      return sum + (counts[s.value] ?? 0);
    }, 0);

  const onSubmit = async (data: FormData) => {
    setError('');
    if (mode === 'findings' && !findingsText.trim()) {
      setError('Please upload or paste your audit findings document first');
      return;
    }
    try {
      const payload: Record<string, unknown> = {
        ...data, framework, impact_level: impactLevel, scope,
        creation_mode: mode,
        ...(mode === 'findings' && findingsText ? { findings_document_text: findingsText } : {}),
      };
      const { data: assessment } = await api.post('/assessments', payload);
      navigate(`/assessments/${assessment.id}`);
    } catch (err: any) {
      const responseData = err?.response?.data;
      const message = responseData?.error ?? 'Failed to create assessment';
      const hint = responseData?.hint;
      setError(hint ? `${message}\n\n${hint}` : message);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">New Assessment</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Create Assessment</h1>
        <p className="text-gray-400 mt-1">Choose your framework and how you want to start</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-900/30 border border-red-800/60 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-2 text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="space-y-1">
                {error.split('\n\n').map((line, i) => (
                  <p key={i} className={i === 0 ? 'font-medium' : 'text-red-300'}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Framework ── */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-white">1. Compliance Framework</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FRAMEWORKS.map(fw => (
              <button key={fw.value} type="button" onClick={() => handleFrameworkChange(fw.value)}
                className={clsx(
                  'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  framework === fw.value ? 'border-brand-500 bg-brand-600/10' : 'border-gray-700 hover:border-gray-600'
                )}>
                <span className="text-2xl shrink-0">{fw.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm">{fw.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-snug">{fw.sub}</div>
                </div>
                {framework === fw.value && <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* ── STEP 2: Starting Mode ── */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-white">2. How would you like to start?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={() => setMode('scratch')}
              className={clsx(
                'flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all',
                mode === 'scratch' ? 'border-brand-500 bg-brand-600/10' : 'border-gray-700 hover:border-gray-600'
              )}>
              <div className="flex items-center gap-2 w-full">
                <Pencil className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="font-semibold text-white text-sm">Start from scratch</span>
                {mode === 'scratch' && <Check className="w-4 h-4 text-brand-400 ml-auto shrink-0" />}
              </div>
              <p className="text-xs text-gray-400 leading-snug">
                Answer the questionnaire control by control. Best for initial assessments.
              </p>
            </button>

            <button type="button" onClick={() => setMode('findings')}
              className={clsx(
                'flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all',
                mode === 'findings' ? 'border-green-600 bg-green-900/10' : 'border-gray-700 hover:border-gray-600'
              )}>
              <div className="flex items-center gap-2 w-full">
                <FileSearch className="w-4 h-4 text-green-400 shrink-0" />
                <span className="font-semibold text-white text-sm">Upload audit findings</span>
                {mode === 'findings' && <Check className="w-4 h-4 text-green-400 ml-auto shrink-0" />}
              </div>
              <p className="text-xs text-gray-400 leading-snug">
                Upload a report from an auditor or 3rd party. AI extracts findings and pre-populates the assessment.
              </p>
            </button>
          </div>

          {/* Findings upload area */}
          {mode === 'findings' && (
            <div className="space-y-3 pt-1">
              {!uploadedFileName ? (
                <div {...getRootProps()}
                  className={clsx(
                    'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
                    isDragActive ? 'border-green-500 bg-green-900/20' : 'border-gray-700 hover:border-gray-500'
                  )}>
                  <input {...getInputProps()} />
                  <Upload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> Reading file…
                    </div>
                  ) : isDragActive ? (
                    <p className="text-green-400 text-sm">Drop it here</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-300 font-medium">Drop audit report here or click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOCX, TXT, MD · Max 10 MB</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-green-900/20 border border-green-800/40 rounded-lg p-3">
                  <FileText className="w-5 h-5 text-green-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-green-300 font-medium truncate">{uploadedFileName}</p>
                    <p className="text-xs text-gray-500">{(findingsText.length / 1000).toFixed(1)}k characters read</p>
                  </div>
                  <button type="button" onClick={() => { setUploadedFileName(''); setFindingsText(''); }}
                    className="text-gray-500 hover:text-gray-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Or paste text */}
              {!uploadedFileName && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-800" />
                    <span className="text-xs text-gray-600">or paste text</span>
                    <div className="flex-1 h-px bg-gray-800" />
                  </div>
                  <textarea
                    rows={5}
                    value={findingsText}
                    onChange={e => setFindingsText(e.target.value)}
                    className="input text-sm resize-none"
                    placeholder="Paste the content of your audit findings, gap assessment, or auditor report here…"
                  />
                </>
              )}

              <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-400">
                <span className="text-green-400 font-medium">How it works:</span> Claude reads your document, identifies every compliance gap or finding, maps each one to the specific control ID, and pre-populates the assessment with findings. You can then review and refine each one.
              </div>
            </div>
          )}
        </div>

        {/* ── STEP 3: Assessment details ── */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-white">3. Assessment Details</h2>
          <div>
            <label className="label">Assessment name</label>
            <input {...register('name')} type="text" className="input" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Description <span className="text-gray-500">(optional)</span></label>
            <textarea {...register('description')} rows={2} className="input resize-none"
              placeholder={`e.g., ${framework === 'nist_ai_rmf' ? 'AI risk governance assessment for our recommendation engine' :
                framework === 'fedramp' ? 'FedRAMP Moderate readiness for Agency XYZ sponsorship' :
                framework === 'pci_dss' ? 'PCI DSS v4 readiness before QSA audit' :
                framework === 'pci_pin' ? 'PCI PIN readiness assessment for PIN transaction operations' :
                'Annual SOC 2 Type 1 readiness assessment'}`} />
          </div>
        </div>

        {/* ── STEP 4: Scope ── */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">4. Scope</h2>
            {framework !== 'soc2' && (
              <div className="flex gap-2">
                <button type="button" onClick={() => {
                  if (framework === 'fedramp') setScope(FEDRAMP_FAMILIES.map(f => f.value));
                  else if (framework === 'pci_dss') setScope(PCI_REQUIREMENTS.map(r => r.value));
                  else if (framework === 'nist_ai_rmf') setScope(NIST_AI_FUNCTIONS.map(f => f.value));
                }} className="text-xs text-brand-400 hover:text-brand-300">All</button>
                <span className="text-gray-600">·</span>
                <button type="button" onClick={() => setScope([])} className="text-xs text-gray-500 hover:text-gray-300">None</button>
              </div>
            )}
          </div>

          {/* SOC 2 */}
          {framework === 'soc2' && (
            <div className="space-y-2">
              {SOC2_SCOPES.map(opt => {
                const selected = scope.includes(opt.value);
                return (
                  <button key={opt.value} type="button" onClick={() => toggleScope(opt.value, opt.required)}
                    className={clsx('w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all',
                      selected ? 'border-brand-600/60 bg-brand-600/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600',
                      opt.required && 'cursor-default')}>
                    <div className={clsx('w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center border-2',
                      selected ? 'bg-brand-600 border-brand-600' : 'border-gray-600')}>
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{opt.label}</span>
                        {opt.required && <span className="text-xs bg-brand-900/60 text-brand-400 px-2 py-0.5 rounded-full">Required</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* FedRAMP */}
          {framework === 'fedramp' && (
            <>
              <div className="space-y-2 mb-3">
                <p className="text-sm text-gray-400">Impact Level</p>
                <div className="grid grid-cols-3 gap-2">
                  {IMPACT_LEVELS.map(lvl => (
                    <button key={lvl.value} type="button" onClick={() => setImpactLevel(lvl.value)}
                      className={clsx('p-2 rounded-lg border text-left transition-all',
                        impactLevel === lvl.value ? 'border-brand-500 bg-brand-600/10' : 'border-gray-700 hover:border-gray-600')}>
                      <div className="text-sm font-medium text-white">{lvl.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-snug">{lvl.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {FEDRAMP_FAMILIES.map(fam => {
                  const selected = scope.includes(fam.value);
                  return (
                    <button key={fam.value} type="button" onClick={() => toggleScope(fam.value)}
                      className={clsx('flex items-center gap-2 p-2 rounded-lg border text-left transition-all',
                        selected ? 'border-brand-700/60 bg-brand-900/20' : 'border-gray-800 hover:border-gray-700')}>
                      <div className={clsx('w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0',
                        selected ? 'bg-brand-600 border-brand-600' : 'border-gray-600')}>
                        {selected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="text-xs text-gray-300 flex-1 truncate">{fam.label}</span>
                      <span className="text-xs text-gray-600 shrink-0">{fam.count}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* PCI DSS */}
          {framework === 'pci_dss' && (
            <div className="grid grid-cols-2 gap-1.5">
              {PCI_REQUIREMENTS.map(req => {
                const selected = scope.includes(req.value);
                return (
                  <button key={req.value} type="button" onClick={() => toggleScope(req.value)}
                    className={clsx('flex items-center gap-2 p-2 rounded-lg border text-left transition-all',
                      selected ? 'border-green-700/60 bg-green-900/20' : 'border-gray-800 hover:border-gray-700')}>
                    <div className={clsx('w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0',
                      selected ? 'bg-green-600 border-green-600' : 'border-gray-600')}>
                      {selected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-xs text-gray-300 flex-1 truncate">{req.label}</span>
                    <span className="text-xs text-gray-600 shrink-0">{req.count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* PCI PIN */}
          {framework === 'pci_pin' && (
            <div className="space-y-2">
              {PCI_PIN_DOMAINS.map(dom => {
                const selected = scope.includes(dom.value);
                return (
                  <button key={dom.value} type="button" onClick={() => toggleScope(dom.value)}
                    className={clsx('w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all',
                      selected ? 'border-yellow-700/60 bg-yellow-900/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600')}>
                    <div className={clsx('w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center border-2',
                      selected ? 'bg-yellow-600 border-yellow-600' : 'border-gray-600')}>
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-white">{dom.label}</span>
                        <span className="text-xs text-gray-500">{dom.count} controls</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{dom.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* NIST AI RMF */}
          {framework === 'nist_ai_rmf' && (
            <div className="space-y-2">
              {NIST_AI_FUNCTIONS.map(fn => {
                const selected = scope.includes(fn.value);
                return (
                  <button key={fn.value} type="button" onClick={() => toggleScope(fn.value)}
                    className={clsx('w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all',
                      selected ? 'border-purple-700/60 bg-purple-900/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600')}>
                    <div className={clsx('w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center border-2',
                      selected ? 'bg-purple-600 border-purple-600' : 'border-gray-600')}>
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-white">{fn.label}</span>
                        <span className="text-xs text-gray-500">{fn.count} controls</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{fn.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-sm flex items-center gap-3">
          <Flag className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="text-gray-300">
            <span className="font-medium">
              {FRAMEWORKS.find(f => f.value === framework)?.label}
            </span>
            {framework === 'fedramp' && ` ${impactLevel.charAt(0).toUpperCase() + impactLevel.slice(1)}`}
            {' · '}~{totalControls} controls · {scope.length} {
              framework === 'nist_ai_rmf' ? 'function' + (scope.length === 1 ? '' : 's') :
              framework === 'pci_pin'     ? 'domain' + (scope.length === 1 ? '' : 's') :
              framework === 'soc2'        ? 'criteri' + (scope.length === 1 ? 'on' : 'a') :
              'categor' + (scope.length === 1 ? 'y' : 'ies')
            }
            {mode === 'findings' && <span className="text-green-400 ml-2">· Pre-populated from audit findings</span>}
          </span>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={isSubmitting || scope.length === 0}
            className="btn-primary flex-1 flex items-center justify-center gap-2">
            {isSubmitting
              ? <><Loader2 className="w-4 h-4 animate-spin" />{mode === 'findings' ? 'Analyzing…' : 'Creating…'}</>
              : <><Shield className="w-4 h-4" />{mode === 'findings' ? 'Create & Analyze Findings' : 'Create Assessment'}</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
