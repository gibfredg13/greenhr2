import React, { useState } from 'react';
import {
  Company,
  Employee,
  LeaveRequest,
  EmployeeDocument,
  ConsultantBooking,
  BlockedTimeSlot,
  SessionType,
  PortalUserAccount,
  CompanyPropertyAssignment,
  EmployeeKpiItem,
  EmployeeOnboardingTask,
  OrgChartNode,
  MatrixAuditRecord
} from '../../types';
import { CONSULTANTS_LIST, AVAILABLE_TIME_SLOTS } from '../../data/seedData';
import {
  UserCheck,
  CalendarDays,
  FileText,
  Download,
  CheckCircle,
  ShieldCheck,
  Phone,
  Video,
  Users,
  ExternalLink,
  Calendar,
  AlertCircle,
  X,
  Sparkles,
  Target,
  ClipboardCheck,
  Laptop,
  Lock,
  GitBranch,
  Grid,
  Eye
} from 'lucide-react';

interface EmployeeSelfServiceProps {
  selectedCompany: Company;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  documents: EmployeeDocument[];
  bookings: ConsultantBooking[];
  blockedSlots: BlockedTimeSlot[];
  portalUsers: PortalUserAccount[];
  companyProperties: CompanyPropertyAssignment[];
  employeeKpis: EmployeeKpiItem[];
  onboardingTasks: EmployeeOnboardingTask[];
  orgChartNodes: OrgChartNode[];
  matrixAudits: MatrixAuditRecord[];
  onApplyLeave: (leave: Partial<LeaveRequest>) => void;
  onUpdateEmployee: (id: string, emp: Partial<Employee>) => void;
  onBookSession: (booking: Partial<ConsultantBooking>) => Promise<void>;
  onCancelBooking: (id: string) => Promise<void>;
  onUpdateEmployeeKpi: (id: string, data: Partial<EmployeeKpiItem>) => Promise<void>;
  onUpdateOnboardingTask: (id: string, data: Partial<EmployeeOnboardingTask>) => Promise<void>;
  onAcknowledgeProperty: (id: string) => Promise<void>;
  onSubmitMatrixSelfEvaluation: (auditId: string, data: Partial<MatrixAuditRecord>) => Promise<void>;
}

export const EmployeeSelfService: React.FC<EmployeeSelfServiceProps> = ({
  selectedCompany,
  employees,
  leaveRequests,
  documents,
  bookings,
  blockedSlots,
  portalUsers,
  companyProperties,
  employeeKpis,
  onboardingTasks,
  orgChartNodes,
  matrixAudits,
  onApplyLeave,
  onUpdateEmployee,
  onBookSession,
  onCancelBooking,
  onUpdateEmployeeKpi,
  onUpdateOnboardingTask,
  onAcknowledgeProperty,
  onSubmitMatrixSelfEvaluation
}) => {
  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(companyEmployees[0]?.id || '');
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'kpi_onboarding'
    | 'matrix_evals'
    | 'company_property'
    | 'org_chart'
    | 'book_session'
    | 'apply_leave'
    | 'documents'
    | 'profile'
  >('overview');

  const activeEmp = companyEmployees.find(e => e.id === selectedEmpId) || companyEmployees[0];

  // Lookup assigned portal user account & click ON/OFF optional extras for this employee
  const activePortalUser = portalUsers.find(u => u.employeeId === activeEmp?.id);
  const extras = activePortalUser?.optionalExtras || {
    enableKpi: true,
    enableOnboarding: true,
    enableMatrixEvaluation: true,
    enableCompanyProperty: true,
    enableOrgChart: true,
    enableOneOnOneBooking: true,
    enableLeaveApplication: true
  };

  // Filtered employee data
  const empLeave = leaveRequests.filter(l => l.employeeId === activeEmp?.id);
  const empDocs = documents.filter(d => d.employeeId === activeEmp?.id);
  const empBookings = bookings.filter(b => b.employeeId === activeEmp?.id && b.status !== 'cancelled');
  const empKpis = employeeKpis.filter(k => k.employeeId === activeEmp?.id);
  const empOnboarding = onboardingTasks.filter(t => t.employeeId === activeEmp?.id);
  const empProperties = companyProperties.filter(p => p.employeeId === activeEmp?.id);
  const empAssignedMatrices = matrixAudits.filter(
    m => m.employeeId === activeEmp?.id && m.assignedToEmployee !== false
  );
  const companyOrgNodes = orgChartNodes.filter(n => n.companyId === selectedCompany.id);

  // Toast feedback
  const [portalNotice, setPortalNotice] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setPortalNotice(msg);
    setTimeout(() => setPortalNotice(null), 3500);
  };

  // KPI & Onboarding local input states
  const [kpiDrafts, setKpiDrafts] = useState<Record<string, { rating: number; answer: string }>>({});
  const [onboardingDrafts, setOnboardingDrafts] = useState<Record<string, string>>({});

  // Matrix Optional Evaluation input states
  const [matrixEvalDrafts, setMatrixEvalDrafts] = useState<
    Record<string, { scoreX: number; scoreY: number; response: string }>
  >({});

  // Read-only Company Property Agreement modal
  const [viewingLockedProperty, setViewingLockedProperty] = useState<CompanyPropertyAssignment | null>(null);

  // Leave form state
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [daysCount, setDaysCount] = useState(2);
  const [reason, setReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // Address update state
  const [newAddress, setNewAddress] = useState(activeEmp ? activeEmp.address : '');
  const [addressSaved, setAddressSaved] = useState(false);

  // 1-on-1 Booking form state
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [bookingForm, setBookingForm] = useState({
    sessionType: 'teams' as SessionType,
    consultantName: CONSULTANTS_LIST[0].name,
    date: tomorrow,
    timeSlot: AVAILABLE_TIME_SLOTS[1],
    reasonWhy: 'Grievance & Workplace Conflict Consultation',
    detailsWhat: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingFeedback, setBookingFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) return;

    onApplyLeave({
      companyId: selectedCompany.id,
      employeeId: activeEmp.id,
      employeeName: `${activeEmp.firstName} ${activeEmp.lastName}`,
      leaveType: leaveType as any,
      startDate,
      endDate,
      daysCount: Number(daysCount),
      reason,
      medicalCertificateRequired: leaveType === 'Sick' && daysCount > 2,
      hasMedicalCertificate: false
    });

    setLeaveSubmitted(true);
    setTimeout(() => {
      setLeaveSubmitted(false);
      setActiveTab('overview');
    }, 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) return;
    onUpdateEmployee(activeEmp.id, { address: newAddress });
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2500);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) return;
    if (!bookingForm.detailsWhat.trim()) {
      setBookingFeedback({ type: 'error', message: 'Please describe what you would like to discuss during the session.' });
      return;
    }

    setBookingLoading(true);
    setBookingFeedback(null);

    try {
      await onBookSession({
        companyId: selectedCompany.id,
        companyName: selectedCompany.name,
        employeeId: activeEmp.id,
        employeeName: `${activeEmp.firstName} ${activeEmp.lastName}`,
        employeeEmail: activeEmp.email,
        employeeRole: activeEmp.jobTitle,
        consultantName: bookingForm.consultantName,
        sessionType: bookingForm.sessionType,
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        reasonWhy: bookingForm.reasonWhy,
        detailsWhat: bookingForm.detailsWhat
      });

      setBookingFeedback({
        type: 'success',
        message: `1-on-1 session confirmed with ${bookingForm.consultantName} for ${bookingForm.date} at ${bookingForm.timeSlot}. An invite has been generated!`
      });

      setBookingForm(prev => ({
        ...prev,
        detailsWhat: ''
      }));
    } catch (err: any) {
      setBookingFeedback({
        type: 'error',
        message: err.message || 'Unable to book session. The requested time slot may be unavailable or blocked.'
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (!activeEmp) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400">
        No employees in this company yet.
      </div>
    );
  }

  // Build visible navigation tabs based on Admin's Click ON/OFF Optional Extras
  const availableTabs: { id: string; label: string; icon?: any; highlight?: boolean }[] = [
    { id: 'overview', label: 'My Balances & Status' },
    ...(extras.enableKpi || extras.enableOnboarding
      ? [{ id: 'kpi_onboarding', label: 'My KPIs & Onboarding', icon: Target, highlight: true }]
      : []),
    ...(extras.enableMatrixEvaluation
      ? [{ id: 'matrix_evals', label: 'Assigned Matrix & Evaluations', icon: Grid }]
      : []),
    ...(extras.enableCompanyProperty
      ? [{ id: 'company_property', label: `Company Property (${empProperties.length})`, icon: Laptop }]
      : []),
    ...(extras.enableOrgChart
      ? [{ id: 'org_chart', label: 'Company Hierarchy Chart', icon: GitBranch }]
      : []),
    ...(extras.enableOneOnOneBooking
      ? [{ id: 'book_session', label: 'Book 1-on-1 Session', icon: Calendar }]
      : []),
    ...(extras.enableLeaveApplication
      ? [{ id: 'apply_leave', label: 'Apply for Leave' }]
      : []),
    { id: 'documents', label: 'My Signed Documents' },
    { id: 'profile', label: 'Personal Information' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Employee Persona Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Employee Self-Service (ESS)</span>
            <span>&middot;</span>
            <span className="text-emerald-700 font-bold">{selectedCompany.name}</span>
            {activePortalUser && (
              <>
                <span>&middot;</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px]">
                  Portal Account: {activePortalUser.usernameOrEmail}
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome, {activeEmp.firstName} {activeEmp.lastName}
          </h1>
          <p className="text-xs text-slate-600">
            {activeEmp.jobTitle} &middot; {activeEmp.department} &middot; SA ID: {activeEmp.idNumber}
          </p>
        </div>

        {/* Switch Persona */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Log in as:</span>
          <select
            value={activeEmp.id}
            onChange={(e) => {
              setSelectedEmpId(e.target.value);
              const found = companyEmployees.find(emp => emp.id === e.target.value);
              if (found) setNewAddress(found.address);
              setActiveTab('overview');
            }}
            className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {companyEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.jobTitle})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dedicated HRaaS Employee Support Guarantee Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-5 shadow-md border border-emerald-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>GreenHive HRaaS &mdash; Your Dedicated Human HR Support Team</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            More Than Self-Service Tools: Real HR Professionals Here to Support You
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            At <strong>{selectedCompany.name}</strong>, you are never left alone with a software portal. Our accredited GreenHive HR &amp; Labour Specialists (<strong>{CONSULTANTS_LIST.map(c => c.name).join(', ')}</strong>) provide confidential 1-on-1 guidance on career growth, BCEA leave rights, workplace grievances, and personal wellbeing.
          </p>
        </div>
        {extras.enableOneOnOneBooking && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('book_session')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-sm transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              Speak 1-on-1 With Your HR Specialist
            </button>
          </div>
        )}
      </div>

      {/* Portal Toast Notice */}
      {portalNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-900 text-white border border-emerald-500/50 flex items-center justify-between text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{portalNotice}</span>
          </div>
          <button onClick={() => setPortalNotice(null)} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ESS Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {availableTabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : t.highlight
                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${activeTab === t.id ? 'text-emerald-400' : 'text-emerald-600'}`} />}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ---------------- TAB: MY KPIs & ONBOARDING ---------------- */}
      {activeTab === 'kpi_onboarding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Employee KPI Self-Assessments & Answers */}
          {extras.enableKpi && (
            <div className={`${extras.enableOnboarding ? 'lg:col-span-6' : 'lg:col-span-12'} bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      My KPI Objectives &amp; Self-Evaluation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Answer your KPI progress questions and submit your self-rating
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {empKpis.length} Assigned KPIs
                </span>
              </div>

              {empKpis.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  No KPIs assigned for this review period yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {empKpis.map(kpi => {
                    const draft = kpiDrafts[kpi.id] ?? {
                      rating: kpi.employeeSelfRating || 4,
                      answer: kpi.employeeAnswerAndEvidence || ''
                    };

                    return (
                      <div key={kpi.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {kpi.period} &middot; Weight: {kpi.weightPercent}%
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">{kpi.kpiTitle}</h4>
                            <p className="text-slate-600 mt-0.5">
                              <strong>Target Metric:</strong> {kpi.targetMetric}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            kpi.status === 'Submitted by Employee'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {kpi.status}
                          </span>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-slate-700">My Self-Rating (1 to 5):</label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(num => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() =>
                                    setKpiDrafts(prev => ({
                                      ...prev,
                                      [kpi.id]: { ...draft, rating: num }
                                    }))
                                  }
                                  className={`w-7 h-7 rounded-lg font-mono font-bold text-xs border transition-all ${
                                    draft.rating === num
                                      ? 'bg-emerald-600 text-white border-emerald-700'
                                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              My KPI Answer &amp; Supporting Evidence:
                            </label>
                            <textarea
                              rows={2}
                              placeholder="Describe your results, milestones achieved, and evidence for this KPI..."
                              value={draft.answer}
                              onChange={e =>
                                setKpiDrafts(prev => ({
                                  ...prev,
                                  [kpi.id]: { ...draft, answer: e.target.value }
                                }))
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={async () => {
                                await onUpdateEmployeeKpi(kpi.id, {
                                  employeeSelfRating: draft.rating,
                                  employeeAnswerAndEvidence: draft.answer,
                                  status: 'Submitted by Employee'
                                });
                                showNotice(`Saved your KPI answer & self-rating (${draft.rating}/5) for "${kpi.kpiTitle}".`);
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all"
                            >
                              Submit KPI Answer &amp; Rating
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Right Column: Employee Onboarding Checklist & Answers */}
          {extras.enableOnboarding && (
            <div className={`${extras.enableKpi ? 'lg:col-span-6' : 'lg:col-span-12'} bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      My Onboarding Checklist &amp; Declarations
                    </h3>
                    <p className="text-xs text-slate-500">
                      Complete your statutory induction steps and submit required answers
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-700">
                  {empOnboarding.filter(t => t.completed).length} / {empOnboarding.length} Completed
                </span>
              </div>

              {empOnboarding.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  All onboarding tasks are complete.
                </div>
              ) : (
                <div className="space-y-4">
                  {empOnboarding.map(task => {
                    const currentAnswer = onboardingDrafts[task.id] ?? (task.employeeAnswer || '');

                    return (
                      <div key={task.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                              {task.stepCategory}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">{task.title}</h4>
                            <p className="text-slate-600 mt-0.5 leading-relaxed">{task.instructions}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            task.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {task.completed ? `Completed (${task.completedAt})` : 'Action Required'}
                          </span>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              Your Onboarding Answer / Declaration:
                            </label>
                            <textarea
                              rows={2}
                              placeholder="Type your confirmation or answer here..."
                              value={currentAnswer}
                              onChange={e =>
                                setOnboardingDrafts(prev => ({
                                  ...prev,
                                  [task.id]: e.target.value
                                }))
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={async () => {
                                await onUpdateOnboardingTask(task.id, {
                                  employeeAnswer: currentAnswer,
                                  completed: true
                                });
                                showNotice(`Onboarding step "${task.title}" completed and saved to your personnel file.`);
                              }}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-all"
                            >
                              {task.completed ? 'Update Answer' : 'Submit Answer & Mark Complete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB: ASSIGNED MATRIX & GRID EVALUATIONS ---------------- */}
      {activeTab === 'matrix_evals' && extras.enableMatrixEvaluation && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                My Assigned Matrix &amp; Grid-Based Frameworks
              </h3>
              <p className="text-xs text-slate-500">
                View your 9-Box Talent Grid, Competency Heatmaps, and B-BBEE Skills Audits assigned by your HRaaS specialist, and complete any enabled self-evaluations.
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              {empAssignedMatrices.length} Assigned Framework(s)
            </span>
          </div>

          {empAssignedMatrices.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              No Matrix or Grid-Based Frameworks have been assigned to your profile yet.
            </div>
          ) : (
            <div className="space-y-4">
              {empAssignedMatrices.map(audit => {
                const draft = matrixEvalDrafts[audit.id] ?? {
                  scoreX: audit.employeeSelfScoreX || 4,
                  scoreY: audit.employeeSelfScoreY || 4,
                  response: audit.employeeSelfEvaluationResponse || ''
                };

                return (
                  <div key={audit.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 text-xs">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold text-[10px] uppercase">
                            {audit.frameworkType.replace(/_/g, ' ')}
                          </span>
                          <span className="text-slate-500 font-mono">Audited: {audit.auditDate} by {audit.auditorName}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{audit.auditTitle}</h4>
                        <div className="text-emerald-800 font-semibold mt-0.5">
                          Calibrated Placement: <strong>{audit.quadrantOrCategory}</strong> ({audit.overallRatingPercent}%)
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                        audit.optionalEvaluationEnabled
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {audit.optionalEvaluationEnabled ? 'Optional Employee Evaluation: ENABLED' : 'View-Only Matrix Summary'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
                      <div>
                        <strong className="text-slate-800">Strengths &amp; Findings:</strong>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{audit.findingsAndStrengths}</p>
                      </div>
                      <div>
                        <strong className="text-slate-800">Recommended Growth Action:</strong>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{audit.recommendedAction}</p>
                      </div>
                    </div>

                    {/* Optional Evaluation Section (shown if enabled for this Matrix) */}
                    {audit.optionalEvaluationEnabled && (
                      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-emerald-950 text-sm">
                            Complete Your Optional Matrix Self-Evaluation
                          </div>
                          {audit.employeeEvaluationSubmittedAt && (
                            <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                              Last Submitted: {audit.employeeEvaluationSubmittedAt}
                            </span>
                          )}
                        </div>

                        <p className="text-emerald-900">
                          <strong>Prompt from {audit.auditorName}:</strong> {audit.evaluationPrompt || 'Share your self-evaluation on your performance, growth potential, and support needed.'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-emerald-950 mb-1">
                              My Self-Score: Execution / Performance (1-5): <strong>{draft.scoreX}</strong>
                            </label>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={0.5}
                              value={draft.scoreX}
                              onChange={e =>
                                setMatrixEvalDrafts(prev => ({
                                  ...prev,
                                  [audit.id]: { ...draft, scoreX: parseFloat(e.target.value) }
                                }))
                              }
                              className="w-full accent-emerald-600"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-emerald-950 mb-1">
                              My Self-Score: Growth &amp; Potential (1-5): <strong>{draft.scoreY}</strong>
                            </label>
                            <input
                              type="range"
                              min={1}
                              max={5}
                              step={0.5}
                              value={draft.scoreY}
                              onChange={e =>
                                setMatrixEvalDrafts(prev => ({
                                  ...prev,
                                  [audit.id]: { ...draft, scoreY: parseFloat(e.target.value) }
                                }))
                              }
                              className="w-full accent-emerald-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-emerald-950 mb-1">
                            Your Self-Evaluation Response &amp; Career Goals:
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Write your reflection and evaluation notes here..."
                            value={draft.response}
                            onChange={e =>
                              setMatrixEvalDrafts(prev => ({
                                ...prev,
                                [audit.id]: { ...draft, response: e.target.value }
                              }))
                            }
                            className="w-full px-3 py-2 border border-emerald-300 rounded-xl bg-white"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={async () => {
                              await onSubmitMatrixSelfEvaluation(audit.id, {
                                employeeSelfScoreX: draft.scoreX,
                                employeeSelfScoreY: draft.scoreY,
                                employeeSelfEvaluationResponse: draft.response,
                                employeeEvaluationSubmittedAt: new Date().toISOString().split('T')[0]
                              });
                              showNotice(`Your self-evaluation for "${audit.auditTitle}" has been saved to your personnel dossier!`);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                          >
                            Submit Matrix Self-Evaluation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB: COMPANY PROPERTY (READ-ONLY FOR EMPLOYEE) ---------------- */}
      {activeTab === 'company_property' && extras.enableCompanyProperty && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  My Assigned Company Property &amp; Asset Agreements
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  View-Only &mdash; Non-Editable
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                View company equipment assigned to you, including official Insurance Asset Tags, Length of Use, and locked BCEA Section 34 custody agreements.
              </p>
            </div>
          </div>

          {empProperties.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              No company property or equipment is currently assigned to your profile.
            </div>
          ) : (
            <div className="space-y-4">
              {empProperties.map(prop => (
                <div key={prop.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 text-xs">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold">
                          Asset Tag: {prop.assetTag}
                        </span>
                        <span className="text-slate-500 font-semibold">{prop.category}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{prop.itemName}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewingLockedProperty(prop)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        View Locked Agreement
                      </button>

                      {!prop.acknowledgedByEmployee ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await onAcknowledgeProperty(prop.id);
                            showNotice(`Receipt acknowledged for ${prop.itemName} (${prop.assetTag}).`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          Acknowledge Receipt
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                          Acknowledged ({prop.acknowledgedAt})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white border border-slate-200">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">Length of Use</div>
                      <div className="font-semibold text-slate-900 mt-0.5">{prop.lengthOfUse}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">Insurance &amp; Policy Reference</div>
                      <div className="font-semibold text-slate-900 mt-0.5">{prop.insurancePolicyAndCoverage}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">Insured Value (ZAR)</div>
                      <div className="font-mono font-bold text-emerald-700 mt-0.5">
                        R{prop.insuredValueZar.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Read-only preview of agreement */}
                  <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] whitespace-pre-wrap leading-relaxed select-none">
                    {prop.agreementText}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB: COMPANY HIERARCHICAL ORG CHART (READ-ONLY FOR EMPLOYEE) ---------------- */}
      {activeTab === 'org_chart' && extras.enableOrgChart && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCompany.name} &mdash; Company Hierarchical Chart
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Employee Read-Only View
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official organizational reporting structure maintained by your Super Admin. Your position is highlighted in emerald.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4].map(tier => {
              const tierNodes = companyOrgNodes.filter(n => n.tierLevel === tier);
              if (tierNodes.length === 0) return null;
              const tierTitles: Record<number, string> = {
                1: 'Tier 1 — Executive Leadership & Board',
                2: 'Tier 2 — General Management & Embedded GreenHive HRaaS Partner',
                3: 'Tier 3 — Departmental Controllers, Line Managers & Specialists',
                4: 'Tier 4 — Operational Workforce & Field Specialists'
              };

              return (
                <div key={tier} className="space-y-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {tierTitles[tier]}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-4 border-l-2 border-emerald-500/40">
                    {tierNodes.map(node => {
                      const manager = companyOrgNodes.find(m => m.id === node.reportsToNodeId);
                      const isCurrentEmployee =
                        node.employeeId === activeEmp.id ||
                        node.name.toLowerCase().includes(activeEmp.firstName.toLowerCase());

                      return (
                        <div
                          key={node.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isCurrentEmployee
                              ? 'bg-emerald-950 text-white border-emerald-400 ring-2 ring-emerald-500/40 shadow-md'
                              : tier === 1
                              ? 'bg-slate-900 text-white border-slate-800'
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold">{node.name}</span>
                            {isCurrentEmployee && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-extrabold text-[10px]">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className={`text-xs font-semibold mt-0.5 ${
                            isCurrentEmployee || tier === 1 ? 'text-emerald-400' : 'text-emerald-700'
                          }`}>
                            {node.jobTitle}
                          </div>
                          <div className={`text-[11px] mt-1 ${
                            isCurrentEmployee || tier === 1 ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            {node.department} &middot; {node.location}
                          </div>
                          {manager && (
                            <div className={`text-[11px] mt-1.5 pt-1.5 border-t font-mono ${
                              isCurrentEmployee || tier === 1
                                ? 'border-slate-800 text-slate-300'
                                : 'border-slate-200 text-slate-600'
                            }`}>
                              &uarr; Reports to: <strong>{manager.name}</strong>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Book 1-on-1 Session */}
      {activeTab === 'book_session' && extras.enableOneOnOneBooking && (
        <div className="space-y-6">
          {bookingFeedback && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                bookingFeedback.type === 'success'
                  ? 'bg-emerald-900 text-white border-emerald-500/50'
                  : 'bg-red-900 text-white border-red-500/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {bookingFeedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{bookingFeedback.message}</span>
              </div>
              <button onClick={() => setBookingFeedback(null)} className="text-slate-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Booked Sessions for this Employee */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  My Booked 1-on-1 Sessions
                </h3>
                <p className="text-xs text-slate-500">
                  Upcoming consultations with GreenHiveHR practitioners
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {empBookings.length} Active {empBookings.length === 1 ? 'Booking' : 'Bookings'}
              </span>
            </div>

            {empBookings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-xs">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No scheduled 1-on-1 sessions</p>
                <p className="text-slate-500 mt-0.5">Use the booking form below to arrange a confidential session.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {empBookings.map(b => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono uppercase">
                          {b.status}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          {b.sessionType === 'teams' ? (
                            <Video className="w-3.5 h-3.5 text-blue-600" />
                          ) : b.sessionType === 'phone' ? (
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Users className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span className="capitalize">{b.sessionType.replace('_', ' ')} Consultation</span>
                        </div>
                        <span className="text-slate-400">&middot;</span>
                        <span className="text-xs font-semibold text-slate-700">with {b.consultantName}</span>
                      </div>

                      <div className="text-xs text-slate-600">
                        Date: <strong className="font-mono text-slate-800">{b.date}</strong> &middot; Time: <strong className="font-mono text-slate-800">{b.timeSlot}</strong>
                      </div>

                      <div className="text-xs text-slate-700">
                        <span className="font-bold">Why:</span> {b.reasonWhy}
                      </div>

                      <div className="text-xs text-slate-600 italic">
                        <span className="font-bold not-italic text-slate-700">What:</span> "{b.detailsWhat}"
                      </div>

                      {b.meetingLinkOrLocation && (
                        <div className="pt-1 text-xs">
                          <span className="font-semibold text-slate-500">Access: </span>
                          {b.sessionType === 'teams' ? (
                            <a
                              href={b.meetingLinkOrLocation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                            >
                              Join Microsoft Teams Meeting <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="font-mono font-semibold text-slate-800">{b.meetingLinkOrLocation}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline px-3 py-1.5 rounded-lg border border-red-200 bg-white"
                    >
                      Cancel Booking
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Booking Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Book a One-on-One Session with an HR Consultant
              </h3>
              <p className="text-xs text-slate-500">
                Choose your preferred consultation format (Face-to-Face, Phone, or Teams) and tell us the context.
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Consultation Format *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'teams', label: 'Teams', icon: Video, desc: 'Video Meeting' },
                      { id: 'phone', label: 'Phone', icon: Phone, desc: 'Direct Call' },
                      { id: 'in_person', label: 'In Person', icon: Users, desc: 'Boardroom' }
                    ].map(fmt => {
                      const Icon = fmt.icon;
                      const isSelected = bookingForm.sessionType === fmt.id;
                      return (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setBookingForm({ ...bookingForm, sessionType: fmt.id as SessionType })}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                          <div className="text-xs">{fmt.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{fmt.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Select Assigned Consultant *
                  </label>
                  <select
                    value={bookingForm.consultantName}
                    onChange={(e) => setBookingForm({ ...bookingForm, consultantName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {CONSULTANTS_LIST.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name} &mdash; {c.title}
                      </option>
                    ))}
                  </select>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Specialties: BCEA, Labour Relations, CCMA, and Dispute Resolution.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Time Slot *
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {AVAILABLE_TIME_SLOTS.map(slot => {
                      const isBlocked = blockedSlots.some(
                        s => s.consultantName === bookingForm.consultantName && s.date === bookingForm.date && s.timeSlot === slot
                      );
                      const isTaken = bookings.some(
                        b => b.consultantName === bookingForm.consultantName && b.date === bookingForm.date && b.timeSlot === slot && b.status !== 'cancelled'
                      );
                      const isUnavailable = isBlocked || isTaken;
                      const isSelected = bookingForm.timeSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isUnavailable}
                          onClick={() => setBookingForm({ ...bookingForm, timeSlot: slot })}
                          className={`px-2 py-1.5 rounded-lg text-xs font-mono transition-all text-center ${
                            isUnavailable
                              ? 'bg-slate-200/70 text-slate-400 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-emerald-600 text-white font-bold shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
                          }`}
                        >
                          {slot} {isUnavailable && '(Busy)'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Why are you booking this session? (Select Topic) *
                </label>
                <select
                  value={bookingForm.reasonWhy}
                  onChange={(e) => setBookingForm({ ...bookingForm, reasonWhy: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option>Grievance &amp; Workplace Conflict Consultation</option>
                  <option>BCEA Employment Contract &amp; Salary Clarification</option>
                  <option>Disciplinary Process &amp; Rights Guidance</option>
                  <option>Leave Policy &amp; Incapacity Medical Discussion</option>
                  <option>Performance Review &amp; PIP Check-In</option>
                  <option>Workplace Wellness &amp; Confidential Support</option>
                  <option>Other Operational Matter</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  What would you like to discuss? (Agenda &amp; Context for the Consultant) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide a quick overview of what you need help with so the consultant can prepare relevant documents, policies, or legal references ahead of time..."
                  value={bookingForm.detailsWhat}
                  onChange={(e) => setBookingForm({ ...bookingForm, detailsWhat: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {bookingLoading ? 'Reserving Consultant Calendar Slot...' : 'Confirm 1-on-1 Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 1: Overview & Balances */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action Summary Cards for KPI, Onboarding, Property, and Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {extras.enableKpi && (
              <button
                type="button"
                onClick={() => setActiveTab('kpi_onboarding')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-left shadow-sm transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>My KPI Self-Reviews</span>
                  <Target className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">{empKpis.length}</div>
                <div className="text-[11px] text-slate-500">Click to answer &amp; rate KPIs &rarr;</div>
              </button>
            )}

            {extras.enableOnboarding && (
              <button
                type="button"
                onClick={() => setActiveTab('kpi_onboarding')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-left shadow-sm transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
                  <span>Onboarding Steps</span>
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">
                  {empOnboarding.filter(t => t.completed).length}/{empOnboarding.length}
                </div>
                <div className="text-[11px] text-slate-500">Complete induction tasks &rarr;</div>
              </button>
            )}

            {extras.enableCompanyProperty && (
              <button
                type="button"
                onClick={() => setActiveTab('company_property')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-left shadow-sm transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>Assigned Company Assets</span>
                  <Laptop className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">{empProperties.length}</div>
                <div className="text-[11px] text-slate-500">View locked agreements &rarr;</div>
              </button>
            )}

            {extras.enableOrgChart && (
              <button
                type="button"
                onClick={() => setActiveTab('org_chart')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-left shadow-sm transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-sky-700">
                  <span>Company Hierarchy</span>
                  <GitBranch className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">{companyOrgNodes.length}</div>
                <div className="text-[11px] text-slate-500">View reporting chart &rarr;</div>
              </button>
            )}
          </div>

          {/* Statutory Leave Balances */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
              <div className="text-xs text-slate-500 font-medium">Annual Leave Available</div>
              <div className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
                {activeEmp.leaveBalances.annual}
              </div>
              <div className="text-[11px] text-slate-500">Days (BCEA min 15 working days)</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
              <div className="text-xs text-slate-500 font-medium">Sick Leave Available</div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {activeEmp.leaveBalances.sick}
              </div>
              <div className="text-[11px] text-slate-500">Days in current 3-year cycle</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
              <div className="text-xs text-slate-500 font-medium">Family Responsibility</div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {activeEmp.leaveBalances.familyResponsibility}
              </div>
              <div className="text-[11px] text-slate-500">Days per annual cycle</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
              <div className="text-xs text-slate-500 font-medium">Parental Leave</div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {activeEmp.leaveBalances.parental}
              </div>
              <div className="text-[11px] text-slate-500">Consecutive days</div>
            </div>
          </div>

          {/* Recent Leave History */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                My Recent Leave History
              </h3>
              {extras.enableLeaveApplication && (
                <button
                  onClick={() => setActiveTab('apply_leave')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  + New Leave Request
                </button>
              )}
            </div>

            {empLeave.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No leave requests filed yet.
              </div>
            ) : (
              <div className="space-y-2">
                {empLeave.map(l => (
                  <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{l.leaveType} Leave</span>
                        <span className="font-mono text-slate-500">({l.daysCount} days)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {l.startDate} to {l.endDate} &middot; {l.reason}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        l.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : l.status === 'Declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Apply for Leave */}
      {activeTab === 'apply_leave' && extras.enableLeaveApplication && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Apply for Leave
            </h3>
            <p className="text-xs text-slate-500">
              Submitted requests route to your direct line manager for sign-off.
            </p>
          </div>

          {leaveSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Leave request submitted successfully for approval!</span>
            </div>
          ) : (
            <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Leave Type *</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Annual</option>
                    <option>Sick</option>
                    <option>Family Responsibility</option>
                    <option>Parental</option>
                    <option>Maternity</option>
                    <option>Study</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Days Count *</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={daysCount}
                    onChange={(e) => setDaysCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Handover Plan *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail tasks covered and coverage arrangements..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all"
              >
                Submit Application
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              My Personnel Documents &amp; Contracts
            </h3>
            <p className="text-xs text-slate-500">
              Access signed agreements, POPIA notices, and tax documentation.
            </p>
          </div>

          {empDocs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No personal documents uploaded for this profile yet.
            </div>
          ) : (
            <div className="space-y-3">
              {empDocs.map(d => (
                <div key={d.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{d.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        Category: {d.category} &middot; Size: {d.fileSize}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotice(`Verified read-only copy of "${d.title}" prepared for download.`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 font-bold shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile & Address */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Update Personal Address &amp; Contact
            </h3>
            <p className="text-xs text-slate-500">
              Keep company records accurate for tax and emergency purposes.
            </p>
          </div>

          {addressSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Personal details updated in company HR records!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Residential Address *</label>
              <textarea
                required
                rows={3}
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Tax Reference</div>
                <div className="font-mono font-semibold text-slate-700">{activeEmp.taxNumber}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Medical Aid</div>
                <div className="font-semibold text-slate-700">{activeEmp.medicalAidScheme || 'None'}</div>
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Modal: View Locked Read-Only Company Property Agreement */}
      {viewingLockedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Read-Only Employee Document (Cannot Be Edited)
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">{viewingLockedProperty.assetTag}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{viewingLockedProperty.agreementTitle}</h3>
                <p className="text-xs text-slate-500">
                  Item: <strong>{viewingLockedProperty.itemName}</strong> &middot; Length of Use: {viewingLockedProperty.lengthOfUse}
                </p>
              </div>
              <button onClick={() => setViewingLockedProperty(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto select-none">
              {viewingLockedProperty.agreementText}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>Insured Value: R{viewingLockedProperty.insuredValueZar.toLocaleString()} ({viewingLockedProperty.insurancePolicyAndCoverage})</span>
              <button
                onClick={() => setViewingLockedProperty(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
