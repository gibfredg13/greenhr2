import React, { useState } from 'react';
import { Company, Employee, LeaveRequest } from '../../types';
import {
  CalendarDays,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
  AlertCircle,
  Clock,
  User,
  X
} from 'lucide-react';

interface LeaveModuleProps {
  selectedCompany: Company;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  onAddLeaveRequest: (leave: Partial<LeaveRequest>) => void;
  onUpdateLeaveStatus: (id: string, status: 'Approved' | 'Declined') => void;
}

export const LeaveModule: React.FC<LeaveModuleProps> = ({
  selectedCompany,
  employees,
  leaveRequests,
  onAddLeaveRequest,
  onUpdateLeaveStatus
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');

  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'Annual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    daysCount: 1,
    reason: '',
    hasMedicalCertificate: false
  });

  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);
  const companyLeave = leaveRequests.filter(l => l.companyId === selectedCompany.id);

  const filteredLeave = companyLeave.filter(l => {
    if (filterType === 'All') return true;
    return l.leaveType === filterType;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(em => em.id === formData.employeeId);
    if (!emp) return;

    const medRequired = formData.leaveType === 'Sick' && formData.daysCount > 2;

    onAddLeaveRequest({
      companyId: selectedCompany.id,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      leaveType: formData.leaveType as any,
      startDate: formData.startDate,
      endDate: formData.endDate,
      daysCount: Number(formData.daysCount),
      reason: formData.reason,
      medicalCertificateRequired: medRequired,
      hasMedicalCertificate: formData.hasMedicalCertificate
    });

    setIsApplyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{selectedCompany.name}</span>
            <span>&middot;</span>
            <span className="font-mono text-emerald-700 font-bold">BCEA Chapter 3 Leave Compliance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Leave &amp; Absence Management
          </h1>
          <p className="text-xs text-slate-600">
            Statutory leave cycle governance (Annual, 36-month Sick leave cycle, Family Responsibility, Parental, and Maternity).
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Submit Leave Request
        </button>
      </div>

      {/* BCEA Section 23 Medical Rule Banner */}
      <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs flex items-center gap-3 text-slate-800">
        <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
        <div>
          <span className="font-bold text-emerald-950">BCEA Proof of Incapacity Notice: </span>
          <span>
            Under Section 23 of the Basic Conditions of Employment Act, employers are not required to pay sick leave if the employee is absent for more than 2 consecutive days or on more than one occasion during an 8-week period without a registered medical certificate.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Annual', 'Sick', 'Family Responsibility', 'Parental', 'Maternity', 'Adoption', 'Study'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              filterType === type
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Leave Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Duration &amp; Dates</th>
                <th className="py-3.5 px-4">Reason / Notes</th>
                <th className="py-3.5 px-4 text-center">Medical Cert</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeave.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No leave applications match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLeave.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {l.employeeName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {l.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-800">{l.daysCount} days</div>
                      <div className="text-[11px] text-slate-500">{l.startDate} to {l.endDate}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {l.reason}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {l.medicalCertificateRequired ? (
                        l.hasMedicalCertificate ? (
                          <span className="text-emerald-700 font-bold text-[11px]">Verified</span>
                        ) : (
                          <span className="text-amber-800 font-bold text-[11px] bg-amber-100 px-2 py-0.5 rounded">Required</span>
                        )
                      ) : (
                        <span className="text-slate-400 text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : l.status === 'Declined'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {l.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onUpdateLeaveStatus(l.id, 'Approved')}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onUpdateLeaveStatus(l.id, 'Declined')}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {l.reviewedBy ? `Reviewed by ${l.reviewedBy}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Submit Leave Application
                </h3>
                <p className="text-xs text-slate-500">
                  Select staff member and leave category for {selectedCompany.name}.
                </p>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee *</label>
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select staff member...</option>
                    {companyEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.jobTitle}) &middot; Annual Bal: {emp.leaveBalances.annual}d
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Leave Type *</label>
                    <select
                      value={formData.leaveType}
                      onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Annual</option>
                      <option>Sick</option>
                      <option>Family Responsibility</option>
                      <option>Parental</option>
                      <option>Maternity</option>
                      <option>Adoption</option>
                      <option>Study</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Working Days Count *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={30}
                      value={formData.daysCount}
                      onChange={(e) => setFormData({ ...formData, daysCount: Number(e.target.value) })}
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
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason / Handover Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Details for manager approval..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {formData.leaveType === 'Sick' && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="medCert"
                      checked={formData.hasMedicalCertificate}
                      onChange={(e) => setFormData({ ...formData, hasMedicalCertificate: e.target.checked })}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="medCert" className="text-slate-700 font-medium">
                      Registered doctor's medical certificate attached
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
