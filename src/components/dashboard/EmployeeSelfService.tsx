import React, { useState } from 'react';
import { Company, Employee, LeaveRequest, EmployeeDocument, ConsultantBooking, BlockedTimeSlot, SessionType } from '../../types';
import { CONSULTANTS_LIST, AVAILABLE_TIME_SLOTS } from '../../data/seedData';
import {
  UserCheck,
  CalendarDays,
  FileText,
  Download,
  FileSignature,
  CheckCircle,
  Plus,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  Home,
  Video,
  Users,
  ExternalLink,
  Calendar,
  AlertCircle,
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface EmployeeSelfServiceProps {
  selectedCompany: Company;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  documents: EmployeeDocument[];
  bookings: ConsultantBooking[];
  blockedSlots: BlockedTimeSlot[];
  onApplyLeave: (leave: Partial<LeaveRequest>) => void;
  onUpdateEmployee: (id: string, emp: Partial<Employee>) => void;
  onBookSession: (booking: Partial<ConsultantBooking>) => Promise<void>;
  onCancelBooking: (id: string) => Promise<void>;
}

export const EmployeeSelfService: React.FC<EmployeeSelfServiceProps> = ({
  selectedCompany,
  employees,
  leaveRequests,
  documents,
  bookings,
  blockedSlots,
  onApplyLeave,
  onUpdateEmployee,
  onBookSession,
  onCancelBooking
}) => {
  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(companyEmployees[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'book_session' | 'apply_leave' | 'documents' | 'profile'>('overview');

  const activeEmp = companyEmployees.find(e => e.id === selectedEmpId) || companyEmployees[0];

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
    reasonWhy: 'Grievance / Workplace Conflict Consultation',
    detailsWhat: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingFeedback, setBookingFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const empLeave = leaveRequests.filter(l => l.employeeId === activeEmp?.id);
  const empDocs = documents.filter(d => d.employeeId === activeEmp?.id);
  const empBookings = bookings.filter(b => b.employeeId === activeEmp?.id && b.status !== 'cancelled');

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

  return (
    <div className="space-y-6">
      {/* Top Banner & Employee Persona Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Employee Self-Service (ESS)</span>
            <span>&middot;</span>
            <span className="text-emerald-700 font-bold">{selectedCompany.name}</span>
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

      {/* ESS Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'My Balances & Status' },
          { id: 'book_session', label: 'Book 1-on-1 Session', highlight: true },
          { id: 'apply_leave', label: 'Apply for Leave' },
          { id: 'documents', label: 'My Signed Documents' },
          { id: 'profile', label: 'Personal Information' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === t.id
                ? 'bg-slate-900 text-white shadow-sm'
                : t.highlight
                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.highlight && <Calendar className="w-3.5 h-3.5 text-emerald-600" />}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Book 1-on-1 Session */}
      {activeTab === 'book_session' && (
        <div className="space-y-6">
          {/* Feedback Toast */}
          {bookingFeedback && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-150 ${
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

                      {/* Connection details */}
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
              {/* Step 1: Format & Consultant Selection */}
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

              {/* Step 2: Date & Available Time Slot */}
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

              {/* Step 3: Quick WHY */}
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

              {/* Step 4: Quick WHAT */}
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
          {/* 1-on-1 Quick Action Callout */}
          <div className="p-4 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Confidential HR Support
              </div>
              <h3 className="text-base font-bold">
                Need guidance on a workplace matter, contract, or grievance?
              </h3>
              <p className="text-xs text-slate-300">
                Book a direct 1-on-1 session with our senior labour practitioners via Teams, phone, or face-to-face.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('book_session')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book 1-on-1 Now
            </button>
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
              <button
                onClick={() => setActiveTab('apply_leave')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                + New Leave Request
              </button>
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
      {activeTab === 'apply_leave' && (
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
                    onClick={() => alert(`Downloading verified copy of ${d.title}`)}
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

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
              <div><strong className="text-slate-800">Phone:</strong> {activeEmp.phone}</div>
              <div><strong className="text-slate-800">Work Email:</strong> {activeEmp.email}</div>
              <div><strong className="text-slate-800">Next of Kin:</strong> {activeEmp.emergencyContact.name} ({activeEmp.emergencyContact.phone})</div>
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
    </div>
  );
};
