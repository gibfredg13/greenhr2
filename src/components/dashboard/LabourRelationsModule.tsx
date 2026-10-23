import React, { useState } from 'react';
import { Company, DisciplinaryCase, Employee } from '../../types';
import {
  Scale,
  AlertTriangle,
  Plus,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  Calendar,
  User,
  ShieldAlert,
  X,
  Download,
  CheckCircle2
} from 'lucide-react';

interface LabourRelationsModuleProps {
  selectedCompany: Company;
  employees: Employee[];
  disciplinaryCases: DisciplinaryCase[];
  onAddCase: (c: Partial<DisciplinaryCase>) => void;
  onOpenAiAssistantWithPrompt: (prompt: string, mode: 'draft_warning' | 'legal_advice') => void;
}

export const LabourRelationsModule: React.FC<LabourRelationsModuleProps> = ({
  selectedCompany,
  employees,
  disciplinaryCases,
  onAddCase,
  onOpenAiAssistantWithPrompt
}) => {
  const [selectedCase, setSelectedCase] = useState<DisciplinaryCase | null>(null);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  // New case form state
  const [formData, setFormData] = useState({
    employeeId: '',
    type: 'Misconduct',
    stage: 'Written Warning',
    incidentDate: new Date().toISOString().split('T')[0],
    summary: '',
    proceduralChecklist: {
      writtenNoticeGiven48HoursPrior: true,
      chargesClearlyDetailed: true,
      rightsExplainedToEmployee: true,
      rightToShopStewardOrColleague: true,
      interpreterProvidedIfRequired: true,
      evidencePresentedAndCrossExamined: true,
      mitigatingFactorsConsidered: true
    }
  });

  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);
  const companyCases = disciplinaryCases.filter(c => c.companyId === selectedCompany.id);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(em => em.id === formData.employeeId);
    if (!emp) return;

    onAddCase({
      ...formData,
      companyId: selectedCompany.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      status: formData.stage === 'Notice of Hearing' ? 'Hearing Scheduled' : 'Sanctioned',
      evidenceFiles: ['incident_report.pdf', 'employee_statement.pdf'],
      type: formData.type as any,
      stage: formData.stage as any
    });
    setIsNewCaseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{selectedCompany.name}</span>
            <span>&middot;</span>
            <span className="font-mono text-emerald-700 font-bold">LRA 66 of 1995 &amp; CCMA Standard</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            CCMA-Ready Labour Relations &amp; Disciplinary Toolkit
          </h1>
          <p className="text-xs text-slate-600">
            Procedurally and substantively fair management of warnings, hearings, incapacity inquiries, and CCMA dispute documentation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenAiAssistantWithPrompt(
              `Draft a formal CCMA-compliant Written Warning notice for an employee at ${selectedCompany.name}`,
              'draft_warning'
            )}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            AI Warning Generator
          </button>

          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Disciplinary Incident
          </button>
        </div>
      </div>

      {/* Procedural Fairness Guarantee Strip */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <strong className="block text-emerald-900">Schedule 8 Code of Good Practice on Dismissal Enforcement</strong>
            <span className="text-slate-600 text-[11px]">
              Every case logs strict 48-hour prior notice, right to representation (shop steward/colleague), and mitigation assessment to prevent unfair dismissal awards at CCMA.
            </span>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companyCases.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400">
            <Scale className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">No active disciplinary cases or warnings</p>
            <p className="text-xs text-slate-500 mt-1">This client entity currently has a clean labour record.</p>
          </div>
        ) : (
          companyCases.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white font-mono uppercase">
                    {c.type}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                    {c.stage}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{c.employeeName}</h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>Incident Date: <strong className="font-mono text-slate-700">{c.incidentDate}</strong></span>
                    {c.validUntil && (
                      <>
                        <span>&middot;</span>
                        <span>Valid until: <strong className="font-mono text-emerald-700">{c.validUntil}</strong></span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {c.summary}
                  </p>
                </div>

                {/* Checklist mini indicators */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider">
                    CCMA Procedural Checkpoint:
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 48h Notice
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Rights Explained
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Representative Allowed
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  Status: <strong>{c.status}</strong>
                </span>
                <span className="text-emerald-700 font-bold hover:underline">
                  View Dossier &rarr;
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Case Dossier Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedCase.stage} — {selectedCase.employeeName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Case Category: {selectedCase.type} &middot; Incident Date: {selectedCase.incidentDate}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Incident Allegations &amp; Charge Summary
              </h4>
              <p className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                {selectedCase.summary}
              </p>
            </div>

            {/* Procedural Fairness Checklist */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                LRA Schedule 8 Procedural Fairness Audit
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'Written notice given $\\ge$ 48 hours prior', val: selectedCase.proceduralChecklist.writtenNoticeGiven48HoursPrior },
                  { label: 'Charges clearly detailed in simple language', val: selectedCase.proceduralChecklist.chargesClearlyDetailed },
                  { label: 'Statutory rights explained to employee', val: selectedCase.proceduralChecklist.rightsExplainedToEmployee },
                  { label: 'Right to shop steward or colleague', val: selectedCase.proceduralChecklist.rightToShopStewardOrColleague },
                  { label: 'Interpreter provided if required', val: selectedCase.proceduralChecklist.interpreterProvidedIfRequired },
                  { label: 'Evidence presented and cross-examined', val: selectedCase.proceduralChecklist.evidencePresentedAndCrossExamined },
                  { label: 'Mitigating factors considered', val: selectedCase.proceduralChecklist.mitigatingFactorsConsidered }
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-slate-700">{item.label}</span>
                    <CheckCircle2 className={`w-4 h-4 ${item.val ? 'text-emerald-600' : 'text-slate-300'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Locker */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Attached Evidence Files
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.evidenceFiles.map(file => (
                  <div key={file} className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-[11px] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <button
                onClick={() => {
                  onOpenAiAssistantWithPrompt(
                    `Review CCMA procedural fairness and draft an outcome letter for employee ${selectedCase.employeeName} regarding ${selectedCase.summary}`,
                    'draft_warning'
                  );
                  setSelectedCase(null);
                }}
                className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Draft Outcome Notice with AI
              </button>

              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Incident Modal */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsNewCaseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Log Disciplinary Incident
                </h3>
                <p className="text-xs text-slate-500">
                  Initiate a formal labour relations record for {selectedCompany.name}.
                </p>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee in Focus *</label>
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select staff member...</option>
                    {companyEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.jobTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Misconduct</option>
                      <option>Poor Work Performance</option>
                      <option>Incapacity (Ill Health)</option>
                      <option>Insubordination</option>
                      <option>Breach of Confidentiality/POPIA</option>
                      <option>Gross Dishonesty</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sanction Stage *</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Verbal Warning</option>
                      <option>Written Warning</option>
                      <option>Final Written Warning</option>
                      <option>Notice of Hearing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Incident Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Summary of Allegations / Misconduct *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Clearly detail date, time, operational policy breach, and impact..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all"
                >
                  Save Disciplinary Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
