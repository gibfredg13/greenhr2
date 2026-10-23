import React, { useState } from 'react';
import {
  Company,
  Employee,
  ConsultantBooking,
  BlockedTimeSlot,
  SessionType,
  EmployeeMeetingRecord,
  FineGrainPermissionLevel,
  RecurringCadence,
  UserRole,
  SuperadminPermissionSettings
} from '../../types';
import { CONSULTANTS_LIST, AVAILABLE_TIME_SLOTS } from '../../data/seedData';
import {
  Calendar as CalendarIcon,
  Video,
  Phone,
  Users,
  Clock,
  Plus,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lock,
  Unlock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  FileText,
  Repeat,
  Paperclip,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  CheckSquare,
  Sparkles,
  Download
} from 'lucide-react';

interface ConsultantCalendarModuleProps {
  selectedCompany: Company;
  employees: Employee[];
  bookings: ConsultantBooking[];
  blockedSlots: BlockedTimeSlot[];
  meetingRecords: EmployeeMeetingRecord[];
  currentRole: UserRole;
  superadminSettings: SuperadminPermissionSettings;
  onAddBooking: (booking: Partial<ConsultantBooking>) => Promise<void>;
  onUpdateBookingStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled', notes?: string) => Promise<void>;
  onAddBlockedSlot: (slot: Partial<BlockedTimeSlot>) => Promise<void>;
  onDeleteBlockedSlot: (id: string) => Promise<void>;
  onAddMeetingRecord: (meeting: Partial<EmployeeMeetingRecord>) => Promise<void>;
  onUpdateMeetingRecord: (id: string, meeting: Partial<EmployeeMeetingRecord>) => Promise<void>;
  onUpdatePermissionSettings: (settings: Partial<SuperadminPermissionSettings>) => Promise<void>;
}

export const ConsultantCalendarModule: React.FC<ConsultantCalendarModuleProps> = ({
  selectedCompany,
  employees,
  bookings,
  blockedSlots,
  meetingRecords,
  currentRole,
  superadminSettings,
  onAddBooking,
  onUpdateBookingStatus,
  onAddBlockedSlot,
  onDeleteBlockedSlot,
  onAddMeetingRecord,
  onUpdateMeetingRecord,
  onUpdatePermissionSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'meetings_dossier' | 'recurring_setup' | 'permissions'>('calendar');
  const [selectedConsultant, setSelectedConsultant] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewScope, setViewScope] = useState<'current_company' | 'all_clients'>('current_company');

  // Modals
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ConsultantBooking | null>(null);
  const [selectedMeetingRecord, setSelectedMeetingRecord] = useState<EmployeeMeetingRecord | null>(null);

  // Block out form state
  const [blockForm, setBlockForm] = useState({
    consultantName: CONSULTANTS_LIST[0].name,
    date: selectedDate,
    timeSlot: AVAILABLE_TIME_SLOTS[0],
    reason: 'CCMA Arbitration Hearing'
  });

  // 1-on-1 Booking form state
  const [bookingForm, setBookingForm] = useState({
    employeeId: '',
    consultantName: CONSULTANTS_LIST[0].name,
    sessionType: 'teams' as SessionType,
    date: selectedDate,
    timeSlot: AVAILABLE_TIME_SLOTS[1],
    reasonWhy: 'Grievance & Labour Relations Consultation',
    detailsWhat: ''
  });

  // Recurring meetings form state
  const [recurringForm, setRecurringForm] = useState({
    employeeId: '',
    consultantName: CONSULTANTS_LIST[0].name,
    meetingTitle: 'Regular 1-on-1 Performance & Wellbeing Review',
    cadence: 'bi_weekly' as RecurringCadence,
    dayOfWeek: 'Wednesday',
    timeSlot: AVAILABLE_TIME_SLOTS[1],
    sessionFormat: 'teams' as SessionType,
    topicWhy: 'Continuous BCEA & Performance Feedback',
    agendaWhat: 'Regular sprint alignment, workload capacity, leave schedule review, and operational support.'
  });

  // Meeting Record / Transcript form state
  const [meetingForm, setMeetingForm] = useState({
    employeeId: '',
    consultantName: CONSULTANTS_LIST[0].name,
    meetingTitle: '',
    meetingType: '1_on_1_regular' as any,
    cadence: 'one_off' as RecurringCadence,
    date: new Date().toISOString().split('T')[0],
    timeSlot: AVAILABLE_TIME_SLOTS[0],
    sessionFormat: 'teams' as SessionType,
    topicWhy: '',
    agendaWhat: '',
    transcriptOrNotes: '',
    permissionLevel: superadminSettings.defaultMeetingPermission,
    attachmentFileName: '',
    attachmentFileSize: '1.2 MB',
    actionItem1: '',
    actionItem2: '',
    nextFollowUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesScope = viewScope === 'all_clients' || b.companyId === selectedCompany.id;
    const matchesConsultant = selectedConsultant === 'All' || b.consultantName === selectedConsultant;
    const matchesDate = b.date === selectedDate;
    return matchesScope && matchesConsultant && matchesDate && b.status !== 'cancelled';
  });

  const filteredBlocked = blockedSlots.filter(s => {
    const matchesConsultant = selectedConsultant === 'All' || s.consultantName === selectedConsultant;
    const matchesDate = s.date === selectedDate;
    return matchesConsultant && matchesDate;
  });

  // Filter meeting records with fine-grained permission rules
  const companyMeetings = meetingRecords.filter(m => {
    const matchesCompany = viewScope === 'all_clients' || m.companyId === selectedCompany.id;
    return matchesCompany;
  });

  // Permission evaluator based on active role
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

  const handleBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddBlockedSlot(blockForm);
      setFeedbackMsg({ type: 'success', text: `Time slot ${blockForm.timeSlot} blocked out successfully.` });
      setIsBlockModalOpen(false);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to block time.' });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(em => em.id === bookingForm.employeeId);
    if (!emp) return;

    try {
      await onAddBooking({
        companyId: selectedCompany.id,
        companyName: selectedCompany.name,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        employeeEmail: emp.email,
        employeeRole: emp.jobTitle,
        consultantName: bookingForm.consultantName,
        sessionType: bookingForm.sessionType,
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        reasonWhy: bookingForm.reasonWhy,
        detailsWhat: bookingForm.detailsWhat
      });
      setFeedbackMsg({ type: 'success', text: `1-on-1 session confirmed for ${emp.firstName} ${emp.lastName} on ${bookingForm.date} at ${bookingForm.timeSlot}.` });
      setIsNewBookingModalOpen(false);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Booking conflict or error occurred.' });
    }
  };

  const handleRecurringSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(em => em.id === recurringForm.employeeId);
    if (!emp) return;

    try {
      // Create series starting from next week
      const nextDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      await onAddBooking({
        companyId: selectedCompany.id,
        companyName: selectedCompany.name,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        employeeEmail: emp.email,
        employeeRole: emp.jobTitle,
        consultantName: recurringForm.consultantName,
        sessionType: recurringForm.sessionFormat,
        date: nextDate,
        timeSlot: recurringForm.timeSlot,
        reasonWhy: `${recurringForm.cadence.toUpperCase()} Regular 1-on-1: ${recurringForm.topicWhy}`,
        detailsWhat: `Recurring ${recurringForm.cadence} session every ${recurringForm.dayOfWeek}. Agenda: ${recurringForm.agendaWhat}`
      });

      // Also create an initial meeting dossier container
      await onAddMeetingRecord({
        companyId: selectedCompany.id,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        consultantName: recurringForm.consultantName,
        meetingTitle: recurringForm.meetingTitle,
        meetingType: '1_on_1_regular',
        cadence: recurringForm.cadence,
        date: nextDate,
        timeSlot: recurringForm.timeSlot,
        sessionFormat: recurringForm.sessionFormat,
        topicWhy: recurringForm.topicWhy,
        agendaWhat: recurringForm.agendaWhat,
        transcriptOrNotes: `RECURRING CADENCE CONFIGURED:
• Frequency: ${recurringForm.cadence.replace('_', '-')} series
• Designated Day: Every ${recurringForm.dayOfWeek} at ${recurringForm.timeSlot}
• Purpose: ${recurringForm.topicWhy}
• Notes: Session notes, agreed milestones, and action items will append to this employee record after each cycle.`,
        actionItems: [
          { id: 'act_rec_01', task: 'First recurring sprint alignment check', owner: `${emp.firstName} ${emp.lastName}`, dueDate: nextDate, completed: false }
        ],
        permissionLevel: 'superadmin_and_consultant',
        createdByRole: currentRole,
        nextFollowUpDate: nextDate
      });

      setFeedbackMsg({
        type: 'success',
        text: `Regular ${recurringForm.cadence} meeting cadence established with ${emp.firstName} ${emp.lastName}. Attached to personnel file.`
      });
      setIsRecurringModalOpen(false);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to setup recurring series.' });
    }
  };

  const handleMeetingDossierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(em => em.id === meetingForm.employeeId);
    if (!emp) return;

    const actionItems = [];
    if (meetingForm.actionItem1.trim()) {
      actionItems.push({
        id: `act_${Date.now()}_1`,
        task: meetingForm.actionItem1,
        owner: `${emp.firstName} ${emp.lastName}`,
        dueDate: meetingForm.nextFollowUpDate,
        completed: false
      });
    }
    if (meetingForm.actionItem2.trim()) {
      actionItems.push({
        id: `act_${Date.now()}_2`,
        task: meetingForm.actionItem2,
        owner: meetingForm.consultantName,
        dueDate: meetingForm.nextFollowUpDate,
        completed: false
      });
    }

    try {
      await onAddMeetingRecord({
        companyId: selectedCompany.id,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        consultantName: meetingForm.consultantName,
        meetingTitle: meetingForm.meetingTitle || `HR Interaction with ${emp.firstName} ${emp.lastName}`,
        meetingType: meetingForm.meetingType,
        cadence: meetingForm.cadence,
        date: meetingForm.date,
        timeSlot: meetingForm.timeSlot,
        sessionFormat: meetingForm.sessionFormat,
        topicWhy: meetingForm.topicWhy,
        agendaWhat: meetingForm.agendaWhat,
        transcriptOrNotes: meetingForm.transcriptOrNotes,
        actionItems,
        attachmentFileName: meetingForm.attachmentFileName ? meetingForm.attachmentFileName : undefined,
        attachmentFileSize: meetingForm.attachmentFileName ? meetingForm.attachmentFileSize : undefined,
        permissionLevel: meetingForm.permissionLevel,
        createdByRole: currentRole,
        nextFollowUpDate: meetingForm.nextFollowUpDate
      });

      setFeedbackMsg({
        type: 'success',
        text: `HR meeting notes & transcript attached to ${emp.firstName} ${emp.lastName}'s personnel file with date ${meetingForm.date}.`
      });
      setIsNewMeetingModalOpen(false);
      setMeetingForm({
        employeeId: '',
        consultantName: CONSULTANTS_LIST[0].name,
        meetingTitle: '',
        meetingType: '1_on_1_regular',
        cadence: 'one_off',
        date: new Date().toISOString().split('T')[0],
        timeSlot: AVAILABLE_TIME_SLOTS[0],
        sessionFormat: 'teams',
        topicWhy: '',
        agendaWhat: '',
        transcriptOrNotes: '',
        permissionLevel: superadminSettings.defaultMeetingPermission,
        attachmentFileName: '',
        attachmentFileSize: '1.2 MB',
        actionItem1: '',
        actionItem2: '',
        nextFollowUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to save meeting record.' });
    }
  };

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`p-3 text-xs font-semibold rounded-xl border flex items-center justify-between animate-in fade-in duration-150 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-500/50'
              : 'bg-red-900 text-white border-red-500/50'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Practice Scheduling &amp; Transcripts</span>
            <span>&middot;</span>
            <span className="text-emerald-700 font-bold">{selectedCompany.name}</span>
            <span>&middot;</span>
            <span className="font-mono text-slate-600">Active Role: {currentRole.replace('_', ' ').toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Consultant Calendar, Regular Meetings &amp; Transcripts
          </h1>
          <p className="text-xs text-slate-600">
            Book 1-on-1 sessions, schedule regular recurring meetings, and attach confidential meeting transcripts directly to employee files with superadmin fine-grained permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsRecurringModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all shadow-sm"
          >
            <Repeat className="w-3.5 h-3.5 text-emerald-600" />
            Setup Regular Cadence
          </button>

          <button
            onClick={() => setIsNewMeetingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            Attach Notes / Transcript to File
          </button>

          <button
            onClick={() => {
              setBlockForm(prev => ({ ...prev, date: selectedDate }));
              setIsBlockModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            Block Out Time
          </button>

          <button
            onClick={() => {
              setBookingForm(prev => ({ ...prev, date: selectedDate }));
              setIsNewBookingModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Book 1-on-1
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'calendar', label: 'Calendar Grid & Appointments', icon: CalendarIcon },
          { id: 'meetings_dossier', label: 'Employee Meeting Notes & Transcripts', icon: FileText, count: companyMeetings.length },
          { id: 'recurring_setup', label: 'Regular Meeting Cadence Series', icon: Repeat },
          { id: 'permissions', label: 'Superadmin Permissions Matrix', icon: ShieldCheck, restricted: currentRole !== 'super_admin' }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeSubTab === t.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-800">
                  {t.count}
                </span>
              )}
              {t.restricted && (
                <span className="text-[10px] text-amber-500 font-mono">(Admin)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: CALENDAR GRID & APPOINTMENTS */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-4">
          {/* Calendar Controls & Date Picker Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => shiftDate(-1)}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold font-mono px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <button
                onClick={() => shiftDate(1)}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg ml-1"
              >
                Today
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Consultant:</span>
                <select
                  value={selectedConsultant}
                  onChange={(e) => setSelectedConsultant(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Practice Consultants</option>
                  {CONSULTANTS_LIST.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Scope:</span>
                <select
                  value={viewScope}
                  onChange={(e) => setViewScope(e.target.value as any)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="current_company">Current Client ({selectedCompany.name})</option>
                  <option value="all_clients">All Practice Clients</option>
                </select>
              </div>
            </div>
          </div>

          {/* Time Slot Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Schedule for {new Date(selectedDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Teams
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Phone
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Person
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Blocked
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {AVAILABLE_TIME_SLOTS.map(slot => {
                const slotBookings = filteredBookings.filter(b => b.timeSlot === slot);
                const slotBlocks = filteredBlocked.filter(s => s.timeSlot === slot);
                const isAvailable = slotBookings.length === 0 && slotBlocks.length === 0;

                return (
                  <div key={slot} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                    <div className="w-36 shrink-0 font-mono text-xs font-bold text-slate-700 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{slot}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {slotBookings.map(b => (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBooking(b)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                            b.sessionType === 'teams'
                              ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                              : b.sessionType === 'phone'
                              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                              : 'bg-amber-50/80 border-amber-200 text-amber-950'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {b.sessionType === 'teams' ? (
                                <Video className="w-4 h-4 text-blue-600" />
                              ) : b.sessionType === 'phone' ? (
                                <Phone className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Users className="w-4 h-4 text-amber-600" />
                              )}
                              <span className="font-bold text-xs">
                                {b.employeeName} ({b.employeeRole})
                              </span>
                              <span className="text-[11px] opacity-75 font-medium">
                                &middot; {b.companyName}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/90 shadow-2xs font-mono uppercase">
                                {b.sessionType.replace('_', ' ')}
                              </span>
                              <span className="text-[11px] font-bold text-slate-700">
                                with {b.consultantName}
                              </span>
                            </div>
                          </div>

                          <div className="mt-1.5 text-xs text-slate-700 font-medium line-clamp-1">
                            <strong>Why:</strong> {b.reasonWhy} &mdash; <span className="opacity-80">{b.detailsWhat}</span>
                          </div>
                        </div>
                      ))}

                      {slotBlocks.map(blk => (
                        <div
                          key={blk.id}
                          className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900">Blocked: {blk.reason}</span>
                              <span className="text-slate-500 ml-1.5">({blk.consultantName})</span>
                            </div>
                          </div>

                          <button
                            onClick={() => onDeleteBlockedSlot(blk.id)}
                            className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                            title="Free up this time slot"
                          >
                            <Unlock className="w-3 h-3" />
                            Unblock Slot
                          </button>
                        </div>
                      ))}

                      {isAvailable && (
                        <div className="text-xs text-slate-400 italic flex items-center gap-1.5 py-1">
                          <span>Available for 1-on-1 employee bookings</span>
                        </div>
                      )}
                    </div>

                    {isAvailable && (
                      <button
                        onClick={() => {
                          setBookingForm(prev => ({
                            ...prev,
                            date: selectedDate,
                            timeSlot: slot
                          }));
                          setIsNewBookingModalOpen(true);
                        }}
                        className="shrink-0 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        + Book Slot
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EMPLOYEE MEETING NOTES & TRANSCRIPTS DOSSIER */}
      {activeSubTab === 'meetings_dossier' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Personnel Meeting Dossiers &amp; Transcripts Archive
              </h3>
              <p className="text-xs text-slate-500">
                All meeting minutes, recorded transcripts, and action items attached to employee personnel files with dates and Superadmin fine-grain permissions.
              </p>
            </div>
            <button
              onClick={() => setIsNewMeetingModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Write Notes or Upload Transcript
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {companyMeetings.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No meeting transcripts logged yet</p>
                <p className="text-xs text-slate-500 mt-1">Attach 1-on-1 minutes or audio transcripts directly to employee files.</p>
              </div>
            ) : (
              companyMeetings.map(m => {
                const isPermitted = canViewTranscript(m);
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMeetingRecord(m)}
                    className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-300 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white font-mono uppercase">
                          {m.meetingType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {m.meetingTitle}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          &middot; {m.employeeName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Permission Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            m.permissionLevel === 'superadmin_only'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : m.permissionLevel === 'superadmin_and_consultant'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : m.permissionLevel === 'superadmin_consultant_manager'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          <Lock className="w-3 h-3" />
                          {m.permissionLevel.replace(/_/g, ' ')}
                        </span>

                        <span className="text-xs font-mono text-slate-500 font-bold">
                          {m.date} ({m.timeSlot})
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700">
                      <strong>Why:</strong> {m.topicWhy} &middot; <span className="text-slate-500">{m.agendaWhat}</span>
                    </div>

                    {/* Transcript Teaser / Redaction Block */}
                    {isPermitted ? (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-wrap line-clamp-3">
                        {m.transcriptOrNotes}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-slate-400" />
                        <span className="italic">
                          Transcript redacted by Superadmin fine-grain security policy ({m.permissionLevel}).
                        </span>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span>Practitioner: <strong>{m.consultantName}</strong></span>
                        {m.attachmentFileName && (
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold font-mono">
                            <Paperclip className="w-3.5 h-3.5" />
                            {m.attachmentFileName} ({m.attachmentFileSize})
                          </span>
                        )}
                        <span>Actions: <strong>{m.actionItems?.length || 0} tasks</strong></span>
                      </div>

                      <span className="text-emerald-700 font-bold hover:underline">
                        Open Full Employee Dossier &rarr;
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: RECURRING CADENCE SETUP */}
      {activeSubTab === 'recurring_setup' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Regular Meeting Cadence Series
              </h3>
              <p className="text-xs text-slate-500">
                Setup scheduled check-in cycles (Weekly, Bi-Weekly, Monthly, Quarterly) that automatically block out consultant time and generate meeting dossiers.
              </p>
            </div>
            <button
              onClick={() => setIsRecurringModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Configure New Cadence
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                cadence: 'Weekly 1-on-1 Check-In',
                desc: '30-minute operational alignment, sprint blockers, and workplace wellbeing check.',
                recommendedFor: 'New hires during 3-month probation and operational drivers/operators.'
              },
              {
                cadence: 'Bi-Weekly Leadership Check-In',
                desc: '45-minute management coaching, BCEA overtime audit, and departmental compliance review.',
                recommendedFor: 'Supervisors, team leads, and fleet managers.'
              },
              {
                cadence: 'Monthly Performance & Review',
                desc: '60-minute formal milestone appraisal, PIP evaluation, and training plan update.',
                recommendedFor: 'Permanent salaried staff and executive appointments.'
              }
            ].map(card => (
              <div key={card.cadence} className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Repeat className="w-4 h-4 text-emerald-600" />
                  <span>{card.cadence}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {card.desc}
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-500">
                  <strong>Recommended for: </strong>{card.recommendedFor}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: SUPERADMIN PERMISSIONS MATRIX */}
      {activeSubTab === 'permissions' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Superadmin Fine-Grained Permissions &amp; Redaction Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Control which personnel levels can inspect employee meeting transcripts, investigation interviews, and attachments.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">
                Default Permission Level for Newly Attached Meeting Records:
              </label>
              <select
                disabled={currentRole !== 'super_admin'}
                value={superadminSettings.defaultMeetingPermission}
                onChange={(e) => onUpdatePermissionSettings({ defaultMeetingPermission: e.target.value as FineGrainPermissionLevel })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="superadmin_only">Strictly Confidential (Superadmin Only)</option>
                <option value="superadmin_and_consultant">Superadmin &amp; Lead HR Practitioner</option>
                <option value="superadmin_consultant_manager">Superadmin, Consultant &amp; Direct Manager</option>
                <option value="all_including_employee">Open Access (Employee, Manager, and HR)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Applies automatically when consultants attach notes, disciplinary records, or uploaded minutes to employee files.
              </p>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-2">Access Control Policies:</div>

              {[
                { key: 'allowConsultantsToChangePermissions', label: 'Allow Lead Consultants to customize permission level on individual meetings' },
                { key: 'allowManagersToViewTranscripts', label: 'Permit Direct Line Managers to view regular performance meeting notes' },
                { key: 'allowEmployeesToViewTheirActionItems', label: 'Display agreed action items & deadlines inside Employee Self-Service (ESS)' },
                { key: 'maskSensitiveGrievanceTranscripts', label: 'Automatically mask sensitive whistleblower / harassment transcripts for non-superadmins' }
              ].map(pol => (
                <div key={pol.key} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-700 font-medium">{pol.label}</span>
                  <input
                    type="checkbox"
                    disabled={currentRole !== 'super_admin'}
                    checked={(superadminSettings as any)[pol.key]}
                    onChange={(e) => onUpdatePermissionSettings({ [pol.key]: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                </div>
              ))}
            </div>

            {currentRole !== 'super_admin' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>You are currently simulating as {currentRole.replace('_', ' ').toUpperCase()}. Switch to Super Admin role in the sidebar to modify security rules.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MEETING RECORD DOSSIER MODAL */}
      {selectedMeetingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedMeetingRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white font-mono uppercase">
                  {selectedMeetingRecord.meetingType.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Ref: {selectedMeetingRecord.id}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" />
                  {selectedMeetingRecord.permissionLevel.replace(/_/g, ' ')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {selectedMeetingRecord.meetingTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Employee: <strong className="text-slate-800">{selectedMeetingRecord.employeeName}</strong> &middot; Consultant: <strong className="text-slate-800">{selectedMeetingRecord.consultantName}</strong>
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div><span className="text-slate-500">Date:</span> <strong className="font-mono text-slate-800">{selectedMeetingRecord.date}</strong></div>
                <div><span className="text-slate-500">Time:</span> <strong className="font-mono text-slate-800">{selectedMeetingRecord.timeSlot}</strong></div>
                <div><span className="text-slate-500">Cadence:</span> <strong className="capitalize text-slate-800">{selectedMeetingRecord.cadence.replace('_', ' ')}</strong></div>
                <div><span className="text-slate-500">Format:</span> <strong className="capitalize text-slate-800">{selectedMeetingRecord.sessionFormat.replace('_', ' ')}</strong></div>
              </div>

              <div>
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Context &amp; Why:</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {selectedMeetingRecord.topicWhy}
                </div>
              </div>

              {/* Transcript with Permission Gate */}
              <div>
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1 flex items-center justify-between">
                  <span>Meeting Transcript / Formal Minutes:</span>
                  <span className="text-[10px] font-mono text-emerald-700">Attached to Employee File</span>
                </div>
                {canViewTranscript(selectedMeetingRecord) ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                    {selectedMeetingRecord.transcriptOrNotes}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-100 rounded-xl border border-slate-200 text-center space-y-2">
                    <Lock className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-800">Transcript Access Restricted</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      This transcript is classified as <strong>{selectedMeetingRecord.permissionLevel}</strong>. Your current role ({currentRole}) does not have clearance to inspect confidential inquiry notes.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Items */}
              {selectedMeetingRecord.actionItems && selectedMeetingRecord.actionItems.length > 0 && (
                <div>
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Agreed Action Items &amp; Commitments:
                  </div>
                  <div className="space-y-1.5">
                    {selectedMeetingRecord.actionItems.map(item => (
                      <div key={item.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-slate-800">{item.task}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Owner: <strong>{item.owner}</strong> &middot; Due: {item.dueDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Attachment */}
              {selectedMeetingRecord.attachmentFileName && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-emerald-950">
                    <Paperclip className="w-4 h-4 text-emerald-700" />
                    <span>{selectedMeetingRecord.attachmentFileName} ({selectedMeetingRecord.attachmentFileSize})</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading verified attachment: ${selectedMeetingRecord.attachmentFileName}`)}
                    className="flex items-center gap-1 text-emerald-800 font-bold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              {currentRole === 'super_admin' && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">Security Clearance:</span>
                  <select
                    value={selectedMeetingRecord.permissionLevel}
                    onChange={async (e) => {
                      const updated = e.target.value as FineGrainPermissionLevel;
                      await onUpdateMeetingRecord(selectedMeetingRecord.id, { permissionLevel: updated });
                      setSelectedMeetingRecord({ ...selectedMeetingRecord, permissionLevel: updated });
                    }}
                    className="px-2 py-1 border border-slate-300 rounded font-bold text-slate-800"
                  >
                    <option value="superadmin_only">Superadmin Only</option>
                    <option value="superadmin_and_consultant">Superadmin &amp; Consultant</option>
                    <option value="superadmin_consultant_manager">Superadmin, Consultant &amp; Manager</option>
                    <option value="all_including_employee">All (Including Employee)</option>
                  </select>
                </div>
              )}

              <button
                onClick={() => setSelectedMeetingRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 ml-auto"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: WRITE NOTES / TRANSCRIPT OR UPLOAD MEETING FILE */}
      {isNewMeetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewMeetingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleMeetingDossierSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Attach Meeting Notes / Transcript to Employee File
                </h3>
                <p className="text-xs text-slate-500">
                  Record 1-on-1 minutes, inquiry transcripts, or upload audio/document attachments with date stamping and fine-grain permission controls.
                </p>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Employee File *</label>
                    <select
                      required
                      value={meetingForm.employeeId}
                      onChange={(e) => setMeetingForm({ ...meetingForm, employeeId: e.target.value })}
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

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Consultant / Interviewer *</label>
                    <select
                      value={meetingForm.consultantName}
                      onChange={(e) => setMeetingForm({ ...meetingForm, consultantName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {CONSULTANTS_LIST.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meeting Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Formal Grievance Review or Regular Monthly Check-In"
                    value={meetingForm.meetingTitle}
                    onChange={(e) => setMeetingForm({ ...meetingForm, meetingTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cadence</label>
                    <select
                      value={meetingForm.cadence}
                      onChange={(e) => setMeetingForm({ ...meetingForm, cadence: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="one_off">One-Off Session</option>
                      <option value="weekly">Weekly Cadence</option>
                      <option value="bi_weekly">Bi-Weekly Cadence</option>
                      <option value="monthly">Monthly Cadence</option>
                      <option value="quarterly">Quarterly Cadence</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Security Level *</label>
                    <select
                      value={meetingForm.permissionLevel}
                      onChange={(e) => setMeetingForm({ ...meetingForm, permissionLevel: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-emerald-800"
                    >
                      <option value="superadmin_only">Superadmin Only (Strict)</option>
                      <option value="superadmin_and_consultant">Superadmin &amp; Consultant</option>
                      <option value="superadmin_consultant_manager">Superadmin, Consultant &amp; Manager</option>
                      <option value="all_including_employee">Open (Includes Employee)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Why (Purpose / Subject Matter) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Investigation interview into overtime dispute under BCEA Sec 10"
                    value={meetingForm.topicWhy}
                    onChange={(e) => setMeetingForm({ ...meetingForm, topicWhy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Meeting Transcript / Notes (Written or Dictated) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write down the detailed notes, verbatim transcript, attendee statements, and findings..."
                    value={meetingForm.transcriptOrNotes}
                    onChange={(e) => setMeetingForm({ ...meetingForm, transcriptOrNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>

                {/* File Upload Simulation */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Upload Meeting Document or Audio Recording (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. inquiry_recording.mp3 or signed_meeting_minutes.pdf"
                      value={meetingForm.attachmentFileName}
                      onChange={(e) => setMeetingForm({ ...meetingForm, attachmentFileName: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setMeetingForm({ ...meetingForm, attachmentFileName: `meeting_recording_${Date.now()}.mp3` })}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                    >
                      Simulate Upload
                    </button>
                  </div>
                </div>

                {/* Action Items */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Action Items Agreed During Meeting:
                  </div>
                  <input
                    type="text"
                    placeholder="Action Item 1 (e.g. Employee to provide medical doctor certificate)"
                    value={meetingForm.actionItem1}
                    onChange={(e) => setMeetingForm({ ...meetingForm, actionItem1: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Action Item 2 (e.g. Consultant to calculate back-pay overtime)"
                    value={meetingForm.actionItem2}
                    onChange={(e) => setMeetingForm({ ...meetingForm, actionItem2: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewMeetingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all"
                >
                  Attach to Employee File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SETUP RECURRING REGULAR MEETINGS */}
      {isRecurringModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRecurringModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleRecurringSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Set Up Regular Meeting Cadence
                </h3>
                <p className="text-xs text-slate-500">
                  Establish a standing recurring 1-on-1 schedule with an employee.
                </p>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee *</label>
                  <select
                    required
                    value={recurringForm.employeeId}
                    onChange={(e) => setRecurringForm({ ...recurringForm, employeeId: e.target.value })}
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
                    <label className="block font-semibold text-slate-700 mb-1">Cadence *</label>
                    <select
                      value={recurringForm.cadence}
                      onChange={(e) => setRecurringForm({ ...recurringForm, cadence: e.target.value as RecurringCadence })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi_weekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Standing Day *</label>
                    <select
                      value={recurringForm.dayOfWeek}
                      onChange={(e) => setRecurringForm({ ...recurringForm, dayOfWeek: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                    <select
                      value={recurringForm.timeSlot}
                      onChange={(e) => setRecurringForm({ ...recurringForm, timeSlot: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    >
                      {AVAILABLE_TIME_SLOTS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Meeting Format *</label>
                    <select
                      value={recurringForm.sessionFormat}
                      onChange={(e) => setRecurringForm({ ...recurringForm, sessionFormat: e.target.value as SessionType })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="teams">Microsoft Teams</option>
                      <option value="phone">Direct Phone Call</option>
                      <option value="in_person">Face to Face Boardroom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standing Topic &amp; Focus *</label>
                  <input
                    type="text"
                    required
                    value={recurringForm.topicWhy}
                    onChange={(e) => setRecurringForm({ ...recurringForm, topicWhy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agenda Template</label>
                  <textarea
                    rows={2}
                    value={recurringForm.agendaWhat}
                    onChange={(e) => setRecurringForm({ ...recurringForm, agendaWhat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRecurringModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Confirm Standing Cadence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative space-y-5">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase font-mono">
                  {selectedBooking.status}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Ref: {selectedBooking.id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                1-on-1 with {selectedBooking.employeeName}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedBooking.employeeRole} &middot; {selectedBooking.companyName}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedBooking.date} ({selectedBooking.timeSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Consultant:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.consultantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Format:</span>
                  <span className="font-bold capitalize text-emerald-700">{selectedBooking.sessionType.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-950 space-y-1">
                <div className="font-bold text-[11px] uppercase tracking-wider text-blue-800">
                  Meeting Connection Details:
                </div>
                <div className="font-mono text-xs break-all font-semibold">
                  {selectedBooking.meetingLinkOrLocation}
                </div>
                {selectedBooking.sessionType === 'teams' && (
                  <a
                    href={selectedBooking.meetingLinkOrLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 mt-1"
                  >
                    Open Teams Meeting Room <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Why (Reason for Booking):
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800">
                  {selectedBooking.reasonWhy}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  What (Employee Agenda &amp; Background Notes):
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedBooking.detailsWhat}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={async () => {
                  await onUpdateBookingStatus(selectedBooking.id, 'cancelled');
                  setSelectedBooking(null);
                  setFeedbackMsg({ type: 'success', text: 'Booking was successfully cancelled.' });
                }}
                className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Cancel Appointment
              </button>

              <button
                onClick={async () => {
                  await onUpdateBookingStatus(selectedBooking.id, 'completed');
                  setSelectedBooking(null);
                  setFeedbackMsg({ type: 'success', text: 'Session marked as completed.' });
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
              >
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BLOCK OUT TIME MODAL */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsBlockModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleBlockSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Block Out Consultant Time
                </h3>
                <p className="text-xs text-slate-500">
                  Prevent employees from booking this time slot on the calendar.
                </p>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultant *</label>
                  <select
                    value={blockForm.consultantName}
                    onChange={(e) => setBlockForm({ ...blockForm, consultantName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {CONSULTANTS_LIST.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.title})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={blockForm.date}
                      onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                    <select
                      value={blockForm.timeSlot}
                      onChange={(e) => setBlockForm({ ...blockForm, timeSlot: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    >
                      {AVAILABLE_TIME_SLOTS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason for Blocking Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CCMA Arbitration Hearing (Case GAJB-1428)"
                    value={blockForm.reason}
                    onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all"
                >
                  Confirm Blocked Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW 1-ON-1 MODAL */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewBookingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Book 1-on-1 Consultation
                </h3>
                <p className="text-xs text-slate-500">
                  Schedule an appointment with an employee from {selectedCompany.name}.
                </p>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee *</label>
                  <select
                    required
                    value={bookingForm.employeeId}
                    onChange={(e) => setBookingForm({ ...bookingForm, employeeId: e.target.value })}
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
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Consultant *</label>
                    <select
                      value={bookingForm.consultantName}
                      onChange={(e) => setBookingForm({ ...bookingForm, consultantName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {CONSULTANTS_LIST.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Session Type *</label>
                    <select
                      value={bookingForm.sessionType}
                      onChange={(e) => setBookingForm({ ...bookingForm, sessionType: e.target.value as SessionType })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="teams">Microsoft Teams (Video)</option>
                      <option value="phone">Direct Phone Call</option>
                      <option value="in_person">Face to Face (Boardroom)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                    <select
                      value={bookingForm.timeSlot}
                      onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    >
                      {AVAILABLE_TIME_SLOTS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Why (Purpose / Category) *</label>
                  <select
                    value={bookingForm.reasonWhy}
                    onChange={(e) => setBookingForm({ ...bookingForm, reasonWhy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Grievance &amp; Labour Relations Consultation</option>
                    <option>BCEA Employment Contract &amp; Salary Clarification</option>
                    <option>Disciplinary Process &amp; Rights Guidance</option>
                    <option>Performance Review &amp; PIP Check-In</option>
                    <option>Workplace Wellness &amp; Confidential Support</option>
                    <option>Other Operational Matter</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">What (Agenda &amp; Discussion Points) *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide context on what will be covered during this 1-on-1 session..."
                    value={bookingForm.detailsWhat}
                    onChange={(e) => setBookingForm({ ...bookingForm, detailsWhat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Create &amp; Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
