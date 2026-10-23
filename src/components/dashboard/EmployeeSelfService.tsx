import React, { useState } from 'react';
import { Company, Employee, LeaveRequest, EmployeeDocument } from '../../types';
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
  Home
} from 'lucide-react';

interface EmployeeSelfServiceProps {
  selectedCompany: Company;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  documents: EmployeeDocument[];
  onApplyLeave: (leave: Partial<LeaveRequest>) => void;
  onUpdateEmployee: (id: string, emp: Partial<Employee>) => void;
}

export const EmployeeSelfService: React.FC<EmployeeSelfServiceProps> = ({
  selectedCompany,
  employees,
  leaveRequests,
  documents,
  onApplyLeave,
  onUpdateEmployee
}) => {
  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(companyEmployees[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'apply_leave' | 'documents' | 'profile'>('overview');

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

  const empLeave = leaveRequests.filter(l => l.employeeId === activeEmp?.id);
  const empDocs = documents.filter(d => d.employeeId === activeEmp?.id);

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
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: 'My Balances & Status' },
          { id: 'apply_leave', label: 'Apply for Leave' },
          { id: 'documents', label: 'My Signed Documents' },
          { id: 'profile', label: 'Personal Information' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === t.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Balances */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
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
