import React, { useState } from 'react';
import {
  Employee,
  Company,
  EmployeeMeetingRecord,
  ConsultantBooking,
  SuperadminPermissionSettings,
  UserRole,
  SessionType,
  RecurringCadence,
  FineGrainPermissionLevel,
  MatrixAuditRecord,
  StandardizedTestResult
} from '../../types';
import { CONSULTANTS_LIST, AVAILABLE_TIME_SLOTS } from '../../data/seedData';
import {
  Users,
  Search,
  Plus,
  Filter,
  FileCheck,
  Calendar,
  Briefcase,
  UserCheck,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  X,
  Sparkles,
  Download,
  Video,
  Lock,
  Unlock,
  FileText,
  CheckCircle2,
  Paperclip,
  Repeat,
  Clock,
  ChevronRight,
  ShieldCheck,
  Target,
  Award,
  BarChart3
} from 'lucide-react';

interface EmployeeModuleProps {
  selectedCompany: Company;
  employees: Employee[];
  meetingRecords?: EmployeeMeetingRecord[];
  bookings?: ConsultantBooking[];
  matrixAudits?: MatrixAuditRecord[];
  diagnosticResults?: StandardizedTestResult[];
  currentRole?: UserRole;
  superadminSettings?: SuperadminPermissionSettings;
  onAddEmployee: (emp: Partial<Employee>) => void;
  onUpdateEmployee: (id: string, emp: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  onOpenAiAssistantWithContext: (employeeId: string, context: string) => void;
  onAddMeetingRecord?: (meeting: Partial<EmployeeMeetingRecord>) => Promise<void>;
  onNavigateToAudits?: () => void;
}

export const EmployeeModule: React.FC<EmployeeModuleProps> = ({
  selectedCompany,
  employees,
  meetingRecords = [],
  bookings = [],
  matrixAudits = [],
  diagnosticResults = [],
  currentRole = 'consultant',
  superadminSettings,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onOpenAiAssistantWithContext,
  onAddMeetingRecord,
  onNavigateToAudits
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'profile' | 'leave' | 'interactions' | 'audits'>('profile');
  const [isLoggingInteraction, setIsLoggingInteraction] = useState(false);

  // Interaction logging form state
  const [interactionForm, setInteractionForm] = useState({
    sessionFormat: 'teams' as SessionType,
    meetingTitle: '',
    meetingType: '1_on_1_regular' as any,
    cadence: 'one_off' as RecurringCadence,
    consultantName: CONSULTANTS_LIST[0].name,
    date: new Date().toISOString().split('T')[0],
    timeSlot: AVAILABLE_TIME_SLOTS[0],
    topicWhy: '',
    agendaWhat: '',
    transcriptOrNotes: '',
    permissionLevel: (superadminSettings?.defaultMeetingPermission || 'superadmin_and_consultant') as FineGrainPermissionLevel,
    attachmentFileName: '',
    actionItem1: '',
    actionItem2: ''
  });

  // New employee form state
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    taxNumber: '',
    department: 'Operations',
    jobTitle: '',
    contractType: 'Permanent',
    startDate: new Date().toISOString().split('T')[0],
    salaryZar: 25000,
    salaryFrequency: 'Monthly',
    address: '',
    emergencyContact: {
      name: '',
      relationship: 'Spouse',
      phone: ''
    },
    leaveBalances: {
      annual: 15,
      sick: 30,
      familyResponsibility: 3,
      parental: 10,
      maternity: 0,
      study: 2
    }
  });

  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);

  const departments = ['All', ...Array.from(new Set(companyEmployees.map(e => e.department)))];

  const filteredEmployees = companyEmployees.filter(e => {
    const matchesSearch =
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.idNumber.includes(searchQuery) ||
      e.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || e.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const canViewTranscript = (meeting: EmployeeMeetingRecord): boolean => {
    if (currentRole === 'super_admin') return true;
    if (currentRole === 'consultant') {
      return meeting.permissionLevel !== 'superadmin_only';
    }
    if (currentRole === 'company_admin' || currentRole === 'manager') {
      return (
        meeting.permissionLevel === 'superadmin_consultant_manager' ||
        meeting.permissionLevel === 'all_including_employee'
      );
    }
    if (currentRole === 'employee') {
      return meeting.permissionLevel === 'all_including_employee';
    }
    return false;
  };

  const handleSaveInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !onAddMeetingRecord) return;

    const actionItems = [];
    if (interactionForm.actionItem1.trim()) {
      actionItems.push({
        id: `act_${Date.now()}_1`,
        task: interactionForm.actionItem1.trim(),
        description: interactionForm.actionItem1.trim(),
        owner: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        assignee: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        dueDate: interactionForm.date,
        completed: false
      });
    }
    if (interactionForm.actionItem2.trim()) {
      actionItems.push({
        id: `act_${Date.now()}_2`,
        task: interactionForm.actionItem2.trim(),
        description: interactionForm.actionItem2.trim(),
        owner: interactionForm.consultantName,
        assignee: interactionForm.consultantName,
        dueDate: interactionForm.date,
        completed: false
      });
    }

    await onAddMeetingRecord({
      employeeId: selectedEmployee.id,
      companyId: selectedCompany.id,
      consultantName: interactionForm.consultantName,
      meetingTitle: interactionForm.meetingTitle || 'HR 1-on-1 Consultation',
      meetingType: interactionForm.meetingType,
      cadence: interactionForm.cadence,
      date: interactionForm.date,
      timeSlot: interactionForm.timeSlot,
      sessionFormat: interactionForm.sessionFormat,
      topicWhy: interactionForm.topicWhy || 'Workforce & Labour Relations Review',
      agendaWhat: interactionForm.agendaWhat || 'General consultation agenda',
      transcriptOrNotes: interactionForm.transcriptOrNotes,
      permissionLevel: interactionForm.permissionLevel,
      attachmentFileName: interactionForm.attachmentFileName || undefined,
      attachmentFileSize: interactionForm.attachmentFileName ? '1.4 MB' : undefined,
      actionItems: actionItems.length > 0 ? actionItems : undefined,
      attendees: [`${selectedEmployee.firstName} ${selectedEmployee.lastName}`, interactionForm.consultantName],
      signedOffByConsultant: true,
      signedOffDate: interactionForm.date
    });

    setIsLoggingInteraction(false);
    setInteractionForm({
      sessionFormat: 'teams',
      meetingTitle: '',
      meetingType: '1_on_1_regular',
      cadence: 'one_off',
      consultantName: CONSULTANTS_LIST[0].name,
      date: new Date().toISOString().split('T')[0],
      timeSlot: AVAILABLE_TIME_SLOTS[0],
      topicWhy: '',
      agendaWhat: '',
      transcriptOrNotes: '',
      permissionLevel: (superadminSettings?.defaultMeetingPermission || 'superadmin_and_consultant'),
      attachmentFileName: '',
      actionItem1: '',
      actionItem2: ''
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEmployee({
      ...formData,
      companyId: selectedCompany.id,
      employeeNumber: `${selectedCompany.name.slice(0, 2).toUpperCase()}-${String(companyEmployees.length + 101)}`,
      fileCompletenessScore: 85,
      status: 'Active'
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{selectedCompany.name}</span>
            <span>&middot;</span>
            <span className="font-mono">{companyEmployees.length} registered staff</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            South African Employee Roster
          </h1>
          <p className="text-xs text-slate-600">
            Compliant with BCEA Section 29 requirements, South African 13-digit ID verification, and statutory leave allocations.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Onboard Employee
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, SA ID, or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee High-Density Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">SA ID / Tax No</th>
                <th className="py-3.5 px-4">Role &amp; Department</th>
                <th className="py-3.5 px-4">Contract</th>
                <th className="py-3.5 px-4 text-right">Gross Salary (ZAR)</th>
                <th className="py-3.5 px-4 text-center">File Health</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No employee records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.firstName} {emp.lastName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{emp.employeeNumber} &middot; {emp.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="text-slate-800 font-semibold">{emp.idNumber}</div>
                      <div className="text-slate-400">SARS: {emp.taxNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900 font-medium">{emp.jobTitle}</div>
                      <div className="text-slate-500 text-[11px]">{emp.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {emp.contractType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      R {emp.salaryZar.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold font-mono text-emerald-700">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {emp.fileCompletenessScore}%
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(emp);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        Inspect File
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {selectedEmployee.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Ref: {selectedEmployee.employeeNumber} &middot; {selectedEmployee.jobTitle} ({selectedEmployee.department})
                </p>
              </div>

              <button
                onClick={() => {
                  onOpenAiAssistantWithContext(
                    selectedEmployee.id,
                    `Draft a formal disciplinary warning or BCEA contract review for ${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                  );
                  setSelectedEmployee(null);
                }}
                className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                AI Assistant Review
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
              <button
                onClick={() => setModalTab('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  modalTab === 'profile'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Statutory &amp; Profile
              </button>
              <button
                onClick={() => setModalTab('leave')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  modalTab === 'leave'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                BCEA Leave &amp; Audit
              </button>
              <button
                onClick={() => setModalTab('interactions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  modalTab === 'interactions'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>HR Interactions &amp; Attached Files</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${
                  modalTab === 'interactions' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {meetingRecords.filter(m => m.employeeId === selectedEmployee.id).length +
                    bookings.filter(b => b.employeeId === selectedEmployee.id).length}
                </span>
              </button>
              <button
                onClick={() => setModalTab('audits')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  modalTab === 'audits'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Matrix Audits &amp; Tests</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${
                  modalTab === 'audits' ? 'bg-amber-700 text-amber-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {matrixAudits.filter(a => a.employeeId === selectedEmployee.id).length +
                    diagnosticResults.filter(d => d.employeeId === selectedEmployee.id).length}
                </span>
              </button>
            </div>

            {/* TAB 1: Profile & Statutory */}
            {modalTab === 'profile' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Statutory &amp; Identity Details
                  </h4>
                  <div className="space-y-1.5">
                    <div><span className="text-slate-500">RSA ID Number:</span> <strong className="font-mono text-slate-800">{selectedEmployee.idNumber}</strong></div>
                    <div><span className="text-slate-500">SARS Tax Ref:</span> <strong className="font-mono text-slate-800">{selectedEmployee.taxNumber}</strong></div>
                    <div><span className="text-slate-500">Contract Type:</span> <strong className="text-slate-800">{selectedEmployee.contractType}</strong></div>
                    <div><span className="text-slate-500">Commencement Date:</span> <strong className="text-slate-800">{selectedEmployee.startDate}</strong></div>
                    <div><span className="text-slate-500">Gross Remuneration:</span> <strong className="font-mono text-emerald-700">R {selectedEmployee.salaryZar.toLocaleString()} / mo</strong></div>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Contact &amp; Emergency Next of Kin
                  </h4>
                  <div className="space-y-1.5">
                    <div><span className="text-slate-500">Email:</span> <span className="text-slate-800">{selectedEmployee.email}</span></div>
                    <div><span className="text-slate-500">Cell:</span> <span className="text-slate-800">{selectedEmployee.phone}</span></div>
                    <div><span className="text-slate-500">Address:</span> <span className="text-slate-800">{selectedEmployee.address}</span></div>
                    <div className="pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Emergency Contact:</span>
                      <div className="font-semibold text-slate-800">{selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.relationship}) &middot; {selectedEmployee.emergencyContact.phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BCEA Leave & Completeness Audit */}
            {modalTab === 'leave' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    BCEA Statutory Leave Balances
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="text-lg font-bold font-mono text-emerald-800">{selectedEmployee.leaveBalances.annual}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Annual Days</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-lg font-bold font-mono text-slate-800">{selectedEmployee.leaveBalances.sick}</div>
                      <div className="text-[10px] text-slate-600">Sick Days</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-lg font-bold font-mono text-slate-800">{selectedEmployee.leaveBalances.familyResponsibility}</div>
                      <div className="text-[10px] text-slate-600">Family Days</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-lg font-bold font-mono text-slate-800">{selectedEmployee.leaveBalances.parental}</div>
                      <div className="text-[10px] text-slate-600">Parental</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-lg font-bold font-mono text-slate-800">{selectedEmployee.leaveBalances.maternity}</div>
                      <div className="text-[10px] text-slate-600">Maternity (Mos)</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-lg font-bold font-mono text-slate-800">{selectedEmployee.leaveBalances.study}</div>
                      <div className="text-[10px] text-slate-600">Study Days</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>Employee File Completeness Audit</span>
                    <span className="font-mono text-emerald-700">{selectedEmployee.fileCompletenessScore}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${selectedEmployee.fileCompletenessScore}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ID Copy Verified</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contract Signed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>POPIA Consent On File</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Medical Fit Form</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HR Interactions, Meetings, Transcripts & Attached Files */}
            {modalTab === 'interactions' && (
              <div className="space-y-4 text-xs">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Official HR Interaction &amp; Meeting Record File
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      All meetings, 1-on-1s, CCMA notes &amp; transcripts permanently attached with timestamps.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsLoggingInteraction(!isLoggingInteraction)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {isLoggingInteraction ? 'Cancel Form' : '+ Log HR Interaction to File'}
                  </button>
                </div>

                {/* In-Modal Form: Log Interaction / Upload Transcript */}
                {isLoggingInteraction && (
                  <form onSubmit={handleSaveInteraction} className="p-4 bg-emerald-50/50 border border-emerald-300 rounded-xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                      <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        Log Interaction / Attach Meeting to {selectedEmployee.firstName}'s Personnel File
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Session Format *</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'teams', label: 'Teams', icon: Video },
                            { id: 'phone', label: 'Phone', icon: Phone },
                            { id: 'in_person', label: 'In Person', icon: Users }
                          ].map(f => {
                            const Icon = f.icon;
                            return (
                              <button
                                type="button"
                                key={f.id}
                                onClick={() => setInteractionForm({ ...interactionForm, sessionFormat: f.id as any })}
                                className={`py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 font-semibold text-xs transition-all ${
                                  interactionForm.sessionFormat === f.id
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                                {f.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Cadence / Regularity *</label>
                        <select
                          value={interactionForm.cadence}
                          onChange={(e) => setInteractionForm({ ...interactionForm, cadence: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="one_off">One-Off Session</option>
                          <option value="weekly">Weekly Regular Meeting</option>
                          <option value="bi_weekly">Bi-Weekly Regular Meeting</option>
                          <option value="monthly">Monthly Check-in</option>
                          <option value="quarterly">Quarterly Review</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Interaction Date *</label>
                        <input
                          type="date"
                          required
                          value={interactionForm.date}
                          onChange={(e) => setInteractionForm({ ...interactionForm, date: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                        <select
                          value={interactionForm.timeSlot}
                          onChange={(e) => setInteractionForm({ ...interactionForm, timeSlot: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                        >
                          {AVAILABLE_TIME_SLOTS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">Title / Meeting Matter *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Schedule 8 Incapacity Hearing, Grievance Alignment, Regular 1-on-1"
                          value={interactionForm.meetingTitle}
                          onChange={(e) => setInteractionForm({ ...interactionForm, meetingTitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Why (Purpose / Matter) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Attendance & Operational Counseling"
                          value={interactionForm.topicWhy}
                          onChange={(e) => setInteractionForm({ ...interactionForm, topicWhy: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Fine-Grain Access Permission (Superadmin policy)</label>
                        <select
                          value={interactionForm.permissionLevel}
                          onChange={(e) => setInteractionForm({ ...interactionForm, permissionLevel: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold text-emerald-800"
                        >
                          <option value="superadmin_only">Superadmin Only (Strictly Confidential)</option>
                          <option value="superadmin_and_consultant">Superadmin &amp; Consultant</option>
                          <option value="superadmin_consultant_manager">Superadmin, Consultant &amp; Line Manager</option>
                          <option value="all_including_employee">Open (Visible to Employee in ESS)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">What (Agenda / Discussion Points) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Reviewed 3 unnotified absences; employee provided medical note; discussed workload."
                          value={interactionForm.agendaWhat}
                          onChange={(e) => setInteractionForm({ ...interactionForm, agendaWhat: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Meeting Notes, Full Transcript or Uploaded Minutes *
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Type or paste verbatim/summary minutes, employee representations, witness statements, or consultant findings here..."
                          value={interactionForm.transcriptOrNotes}
                          onChange={(e) => setInteractionForm({ ...interactionForm, transcriptOrNotes: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Attach File / Signed Transcript (Optional)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Signed_Incapacity_Minutes.pdf"
                            value={interactionForm.attachmentFileName}
                            onChange={(e) => setInteractionForm({ ...interactionForm, attachmentFileName: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Key Action Item</label>
                        <input
                          type="text"
                          placeholder="e.g. Employee to submit medical specialist report by Friday"
                          value={interactionForm.actionItem1}
                          onChange={(e) => setInteractionForm({ ...interactionForm, actionItem1: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-emerald-200">
                      <button
                        type="button"
                        onClick={() => setIsLoggingInteraction(false)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                      >
                        Save &amp; Attach to Employee File
                      </button>
                    </div>
                  </form>
                )}

                {/* Timeline of Attached Meetings & Interactions */}
                {(() => {
                  const empMeetings = meetingRecords.filter(m => m.employeeId === selectedEmployee.id);
                  const empBookings = bookings.filter(b => b.employeeId === selectedEmployee.id);

                  if (empMeetings.length === 0 && empBookings.length === 0) {
                    return (
                      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                        <h5 className="font-bold text-slate-700">No HR interactions logged yet</h5>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                          Click "+ Log HR Interaction to File" above to attach 1-on-1 notes, regular check-in transcripts, or disciplinary records.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {/* Attached Meeting Records */}
                      {empMeetings.map(m => {
                        const hasAccess = canViewTranscript(m);
                        const formatIcon = m.sessionFormat === 'teams' ? Video : m.sessionFormat === 'phone' ? Phone : Users;
                        const FormatIcon = formatIcon;

                        return (
                          <div
                            key={m.id}
                            className="p-4 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl shadow-2xs space-y-2.5 transition-all"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <FormatIcon className="w-3.5 h-3.5" />
                                </span>
                                <div>
                                  <h5 className="font-bold text-slate-900 text-xs">{m.meetingTitle}</h5>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                                    <span>Date: {m.date}</span>
                                    <span>&middot;</span>
                                    <span>Time: {m.timeSlot}</span>
                                    <span>&middot;</span>
                                    <span className="capitalize">{m.sessionFormat.replace('_', ' ')}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  m.permissionLevel === 'superadmin_only'
                                    ? 'bg-rose-100 text-rose-800'
                                    : m.permissionLevel === 'superadmin_and_consultant'
                                    ? 'bg-amber-100 text-amber-800'
                                    : m.permissionLevel === 'superadmin_consultant_manager'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {m.permissionLevel.replace(/_/g, ' ')}
                                </span>
                                {m.cadence !== 'one_off' && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                                    <Repeat className="w-3 h-3" />
                                    {m.cadence.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Why & What */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <div>
                                <span className="text-slate-500 font-semibold">Why:</span>{' '}
                                <span className="text-slate-800">{m.topicWhy}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 font-semibold">What:</span>{' '}
                                <span className="text-slate-800">{m.agendaWhat}</span>
                              </div>
                            </div>

                            {/* Transcript with Fine-Grain Permission Check */}
                            {hasAccess ? (
                              <div className="space-y-2">
                                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] font-mono whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed border border-slate-800">
                                  {m.transcriptOrNotes}
                                </div>

                                {m.attachmentFileName && (
                                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px]">
                                    <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                                      <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Attached File: {m.attachmentFileName}</span>
                                      <span className="text-slate-500 font-mono">({m.attachmentFileSize || '1.2 MB'})</span>
                                    </div>
                                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      Indexed in Personnel Vault
                                    </span>
                                  </div>
                                )}

                                {m.actionItems && m.actionItems.length > 0 && (
                                  <div className="space-y-1 pt-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                      Agreed Next Steps:
                                    </div>
                                    {m.actionItems.map(act => (
                                      <div key={act.id} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>{act.task || act.description}</span>
                                        <span className="text-slate-400 font-mono text-[10px]">({act.owner || act.assignee})</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-900">
                                <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                <div className="text-[11px]">
                                  <strong>Confidential HR Interaction Record</strong>
                                  <p className="text-rose-700 text-[10px] mt-0.5">
                                    Transcript and sensitive file attachments are redacted under Superadmin Fine-Grain Security Policy (Level: <span className="font-mono">{m.permissionLevel}</span>). You do not have clearance to view full notes.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* 1-on-1 Calendar Bookings */}
                      {empBookings.map(b => (
                        <div
                          key={b.id}
                          className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="p-1 bg-slate-100 rounded text-slate-700">
                                {b.sessionType === 'teams' ? <Video className="w-3 h-3 text-indigo-600" /> : b.sessionType === 'phone' ? <Phone className="w-3 h-3 text-emerald-600" /> : <Users className="w-3 h-3 text-amber-600" />}
                              </span>
                              <strong className="text-slate-900">1-on-1 Consultation with {b.consultantName}</strong>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold capitalize bg-emerald-100 text-emerald-800">
                              {b.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-3 font-mono">
                            <span>Date: {b.date}</span>
                            <span>Time: {b.timeSlot}</span>
                            <span className="capitalize">Format: {b.sessionType}</span>
                          </div>
                          <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                            <div><strong className="text-slate-500">Why:</strong> {b.reasonWhy}</div>
                            {b.detailsWhat && <div><strong className="text-slate-500">What:</strong> {b.detailsWhat}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 4: Matrix & Grid Audits and Standardized Diagnostics */}
            {modalTab === 'audits' && (
              <div className="space-y-4 text-xs">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 rounded-xl">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-600" />
                      Employee Matrix Audits &amp; Diagnostic Framework Dossier
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Standardized assessments, 9-Box calibrations, statutory diagnostics, and certificates on file.
                    </p>
                  </div>

                  {onNavigateToAudits && (
                    <button
                      onClick={() => {
                        setSelectedEmployee(null);
                        onNavigateToAudits();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-all shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Launch Matrix Audit Hub
                    </button>
                  )}
                </div>

                {(() => {
                  const empAudits = matrixAudits.filter(a => a.employeeId === selectedEmployee.id);
                  const empTests = diagnosticResults.filter(d => d.employeeId === selectedEmployee.id);

                  if (empAudits.length === 0 && empTests.length === 0) {
                    return (
                      <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                          <Target className="w-6 h-6" />
                        </div>
                        <h5 className="font-bold text-slate-800 text-sm">No Audits or Diagnostic Tests on Record</h5>
                        <p className="text-slate-500 max-w-md mx-auto text-xs">
                          {selectedEmployee.firstName} {selectedEmployee.lastName} has not yet been calibrated on a Matrix Framework or completed a Standardized Statutory Diagnostic.
                        </p>
                        {onNavigateToAudits && (
                          <button
                            onClick={() => {
                              setSelectedEmployee(null);
                              onNavigateToAudits();
                            }}
                            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Kick Off Evaluation in Audit Hub
                          </button>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-5">
                      {/* Section 1: Matrix & Grid Audits */}
                      {empAudits.length > 0 && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                              Calibrated Grid &amp; Matrix Audits ({empAudits.length})
                            </span>
                          </div>

                          <div className="space-y-3">
                            {empAudits.map(audit => (
                              <div
                                key={audit.id}
                                className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5 hover:border-amber-300 transition-all"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                                        {audit.frameworkType.replace(/_/g, ' ')}
                                      </span>
                                      <h5 className="font-bold text-slate-900 text-xs">{audit.ratingPlacement}</h5>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                                      <span>Date: {audit.auditDate}</span>
                                      <span>&middot;</span>
                                      <span>Auditor: {audit.auditorName}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <div className="px-2 py-1 bg-slate-100 rounded text-[11px] font-mono text-slate-700">
                                      Coord: ({audit.xAxisScore}, {audit.yAxisScore})
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      {audit.status}
                                    </span>
                                  </div>
                                </div>

                                {audit.statutoryBasis && (
                                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                                    <FileCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span><strong>Statutory / Governance Context:</strong> {audit.statutoryBasis}</span>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                  <div>
                                    <span className="text-slate-500 font-semibold block mb-0.5">Auditor Observations:</span>
                                    <p className="text-slate-800">{audit.notes}</p>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 font-semibold block mb-0.5">90-Day Action &amp; Growth Plan:</span>
                                    <p className="text-slate-800">{audit.actionPlan}</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                                  <span>Framework: {audit.frameworkName}</span>
                                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                    <Paperclip className="w-3 h-3" /> Sealed in Employee Vault
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section 2: Standardized Diagnostic Tests */}
                      {empTests.length > 0 && (
                        <div className="space-y-2.5 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              Diagnostic Framework Certificates &amp; Scores ({empTests.length})
                            </span>
                          </div>

                          <div className="space-y-3">
                            {empTests.map(test => (
                              <div
                                key={test.id}
                                className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5 hover:border-emerald-300 transition-all"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-bold text-slate-900 text-xs">{test.frameworkName}</h5>
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        {test.certificateNumber}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                                      <span>Completed: {test.dateCompleted}</span>
                                      <span>&middot;</span>
                                      <span>Proctored By: {test.administeredBy}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <div className="text-right">
                                      <div className="text-xs font-bold font-mono text-emerald-700">
                                        {test.score} / {test.maxScore} ({test.percentage}%)
                                      </div>
                                      <div className="text-[10px] font-mono text-slate-500">
                                        {test.normativePercentile}th SA Percentile
                                      </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                      test.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      <CheckCircle2 className="w-3 h-3" />
                                      {test.passed ? 'Statutory Pass' : 'Review Required'}
                                    </span>
                                  </div>
                                </div>

                                {/* Category Breakdown */}
                                {test.categoryScores && (
                                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-700 block">
                                      Statutory Knowledge Competency Breakdown:
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                      {Object.entries(test.categoryScores).map(([cat, rawScore]) => {
                                        const score = Number(rawScore) || 0;
                                        return (
                                          <div key={cat} className="space-y-0.5">
                                            <div className="flex justify-between text-slate-600 font-mono">
                                              <span>{cat}:</span>
                                              <span className="font-bold text-slate-800">{score}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                              <div
                                                className={`h-1.5 rounded-full ${
                                                  score >= 80 ? 'bg-emerald-600' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                                }`}
                                                style={{ width: `${score}%` }}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                <div className="text-[11px] text-slate-700 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                                  <strong>Diagnostic Summary:</strong> {test.summaryFeedback}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onboard Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  Onboard Employee to {selectedCompany.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Register new staff member with South African statutory leave entitlements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sipho"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dlamini"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">RSA 13-Digit ID Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={13}
                    placeholder="e.g. 8804125894083"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SARS Tax Number</label>
                  <input
                    type="text"
                    placeholder="9184920184"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quality Assurance Specialist"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="Operations"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contract Type</label>
                  <select
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Permanent</option>
                    <option>Fixed-Term</option>
                    <option>Temporary</option>
                    <option>Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Basic Gross (ZAR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.salaryZar}
                    onChange={(e) => setFormData({ ...formData, salaryZar: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="staff@company.co.za"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Confirm &amp; Generate Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
