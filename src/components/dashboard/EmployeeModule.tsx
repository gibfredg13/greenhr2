import React, { useState } from 'react';
import { Employee, Company } from '../../types';
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
  Download
} from 'lucide-react';

interface EmployeeModuleProps {
  selectedCompany: Company;
  employees: Employee[];
  onAddEmployee: (emp: Partial<Employee>) => void;
  onUpdateEmployee: (id: string, emp: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  onOpenAiAssistantWithContext: (employeeId: string, context: string) => void;
}

export const EmployeeModule: React.FC<EmployeeModuleProps> = ({
  selectedCompany,
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onOpenAiAssistantWithContext
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

            {/* Profile Details Grid */}
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

            {/* BCEA Leave Balance Matrix */}
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

            {/* File Completeness Audit */}
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
