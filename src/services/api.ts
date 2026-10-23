import {
  Company,
  Employee,
  ComplianceEvent,
  DisciplinaryCase,
  LeaveRequest,
  TimeEntry,
  Invoice,
  EmployeeDocument,
  ConsultantBooking,
  BlockedTimeSlot,
  EmployeeMeetingRecord,
  SuperadminPermissionSettings,
  MatrixAuditRecord,
  DiagnosticFrameworkTemplate,
  StandardizedTestResult
} from '../types';

export const api = {
  // Companies
  getCompanies: async (): Promise<Company[]> => {
    const res = await fetch('/api/companies');
    if (!res.ok) throw new Error('Failed to fetch companies');
    return res.json();
  },

  createCompany: async (company: Partial<Company>): Promise<Company> => {
    const res = await fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company)
    });
    if (!res.ok) throw new Error('Failed to create company');
    return res.json();
  },

  // Employees
  getEmployees: async (companyId?: string): Promise<Employee[]> => {
    const url = companyId ? `/api/employees?companyId=${companyId}` : '/api/employees';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  createEmployee: async (employee: Partial<Employee>): Promise<Employee> => {
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    if (!res.ok) throw new Error('Failed to create employee');
    return res.json();
  },

  updateEmployee: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const res = await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    if (!res.ok) throw new Error('Failed to update employee');
    return res.json();
  },

  deleteEmployee: async (id: string): Promise<void> => {
    const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete employee');
  },

  // Compliance
  getComplianceEvents: async (companyId?: string): Promise<ComplianceEvent[]> => {
    const url = companyId ? `/api/compliance?companyId=${companyId}` : '/api/compliance';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch compliance events');
    return res.json();
  },

  createComplianceEvent: async (event: Partial<ComplianceEvent>): Promise<ComplianceEvent> => {
    const res = await fetch('/api/compliance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!res.ok) throw new Error('Failed to create compliance event');
    return res.json();
  },

  toggleComplianceStatus: async (id: string): Promise<ComplianceEvent> => {
    const res = await fetch(`/api/compliance/${id}/toggle`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle compliance');
    return res.json();
  },

  // Disciplinary
  getDisciplinaryCases: async (companyId?: string): Promise<DisciplinaryCase[]> => {
    const url = companyId ? `/api/disciplinary?companyId=${companyId}` : '/api/disciplinary';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch disciplinary cases');
    return res.json();
  },

  createDisciplinaryCase: async (c: Partial<DisciplinaryCase>): Promise<DisciplinaryCase> => {
    const res = await fetch('/api/disciplinary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c)
    });
    if (!res.ok) throw new Error('Failed to create disciplinary case');
    return res.json();
  },

  // Leave
  getLeaveRequests: async (companyId?: string): Promise<LeaveRequest[]> => {
    const url = companyId ? `/api/leave?companyId=${companyId}` : '/api/leave';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch leave requests');
    return res.json();
  },

  createLeaveRequest: async (leave: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    const res = await fetch('/api/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leave)
    });
    if (!res.ok) throw new Error('Failed to submit leave request');
    return res.json();
  },

  updateLeaveStatus: async (id: string, status: 'Approved' | 'Declined', reviewedBy: string): Promise<LeaveRequest> => {
    const res = await fetch(`/api/leave/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewedBy })
    });
    if (!res.ok) throw new Error('Failed to update leave status');
    return res.json();
  },

  // Billing
  getBillingData: async (companyId?: string): Promise<{ timeEntries: TimeEntry[]; invoices: Invoice[] }> => {
    const url = companyId ? `/api/billing?companyId=${companyId}` : '/api/billing';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch billing data');
    return res.json();
  },

  createTimeEntry: async (entry: Partial<TimeEntry>): Promise<TimeEntry> => {
    const res = await fetch('/api/billing/time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to log time');
    return res.json();
  },

  generateInvoice: async (companyId: string): Promise<Invoice> => {
    const res = await fetch('/api/billing/generate-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId })
    });
    if (!res.ok) throw new Error('Failed to generate invoice');
    return res.json();
  },

  // Documents
  getDocuments: async (companyId?: string): Promise<EmployeeDocument[]> => {
    const url = companyId ? `/api/documents?companyId=${companyId}` : '/api/documents';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  uploadDocument: async (doc: Partial<EmployeeDocument>): Promise<EmployeeDocument> => {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  // 1-on-1 Sessions & Consultant Calendar
  getBookings: async (params?: { companyId?: string; employeeId?: string; consultantName?: string }): Promise<ConsultantBooking[]> => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.employeeId) query.append('employeeId', params.employeeId);
    if (params?.consultantName) query.append('consultantName', params.consultantName);
    const url = query.toString() ? `/api/bookings?${query.toString()}` : '/api/bookings';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  createBooking: async (booking: Partial<ConsultantBooking>): Promise<ConsultantBooking> => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to book 1-on-1 session');
    }
    return res.json();
  },

  updateBookingStatus: async (id: string, status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled', notes?: string): Promise<ConsultantBooking> => {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Failed to update booking status');
    return res.json();
  },

  getBlockedSlots: async (params?: { consultantName?: string; date?: string }): Promise<BlockedTimeSlot[]> => {
    const query = new URLSearchParams();
    if (params?.consultantName) query.append('consultantName', params.consultantName);
    if (params?.date) query.append('date', params.date);
    const url = query.toString() ? `/api/calendar/blocked-slots?${query.toString()}` : '/api/calendar/blocked-slots';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch blocked slots');
    return res.json();
  },

  createBlockedSlot: async (data: Partial<BlockedTimeSlot>): Promise<BlockedTimeSlot> => {
    const res = await fetch('/api/calendar/blocked-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to block time slot');
    return res.json();
  },

  deleteBlockedSlot: async (id: string): Promise<void> => {
    const res = await fetch(`/api/calendar/blocked-slots/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to unblock slot');
  },

  // Regular Meetings, Transcripts & Fine-Grain Permissions
  getMeetings: async (params?: { companyId?: string; employeeId?: string; role?: string }): Promise<EmployeeMeetingRecord[]> => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.employeeId) query.append('employeeId', params.employeeId);
    if (params?.role) query.append('role', params.role);
    const url = query.toString() ? `/api/meetings?${query.toString()}` : '/api/meetings';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch meeting records');
    return res.json();
  },

  createMeeting: async (meeting: Partial<EmployeeMeetingRecord>): Promise<EmployeeMeetingRecord> => {
    const res = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meeting)
    });
    if (!res.ok) throw new Error('Failed to save meeting record');
    return res.json();
  },

  updateMeeting: async (id: string, data: Partial<EmployeeMeetingRecord>): Promise<EmployeeMeetingRecord> => {
    const res = await fetch(`/api/meetings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update meeting record');
    return res.json();
  },

  deleteMeeting: async (id: string): Promise<void> => {
    const res = await fetch(`/api/meetings/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete meeting record');
  },

  getPermissionSettings: async (): Promise<SuperadminPermissionSettings> => {
    const res = await fetch('/api/permissions/settings');
    if (!res.ok) throw new Error('Failed to fetch permission settings');
    return res.json();
  },

  updatePermissionSettings: async (settings: Partial<SuperadminPermissionSettings>): Promise<SuperadminPermissionSettings> => {
    const res = await fetch('/api/permissions/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update permission settings');
    return res.json();
  },

  // Matrix & Grid-Based Frameworks Audits
  getMatrixAudits: async (params?: { companyId?: string; employeeId?: string }): Promise<MatrixAuditRecord[]> => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.employeeId) query.append('employeeId', params.employeeId);
    const url = query.toString() ? `/api/matrix-audits?${query.toString()}` : '/api/matrix-audits';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch matrix audits');
    return res.json();
  },

  createMatrixAudit: async (audit: Partial<MatrixAuditRecord>): Promise<MatrixAuditRecord> => {
    const res = await fetch('/api/matrix-audits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(audit)
    });
    if (!res.ok) throw new Error('Failed to record matrix audit');
    return res.json();
  },

  deleteMatrixAudit: async (id: string): Promise<void> => {
    const res = await fetch(`/api/matrix-audits/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete matrix audit');
  },

  // Standardized Testing and Diagnostic Frameworks
  getDiagnosticFrameworks: async (): Promise<DiagnosticFrameworkTemplate[]> => {
    const res = await fetch('/api/diagnostic-frameworks');
    if (!res.ok) throw new Error('Failed to fetch diagnostic frameworks catalog');
    return res.json();
  },

  getDiagnosticTests: async (params?: { companyId?: string; employeeId?: string }): Promise<StandardizedTestResult[]> => {
    const query = new URLSearchParams();
    if (params?.companyId) query.append('companyId', params.companyId);
    if (params?.employeeId) query.append('employeeId', params.employeeId);
    const url = query.toString() ? `/api/diagnostic-tests?${query.toString()}` : '/api/diagnostic-tests';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch diagnostic test results');
    return res.json();
  },

  createDiagnosticTest: async (result: Partial<StandardizedTestResult>): Promise<StandardizedTestResult> => {
    const res = await fetch('/api/diagnostic-tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });
    if (!res.ok) throw new Error('Failed to record standardized diagnostic test');
    return res.json();
  },

  // Gemini AI Assistant
  askHiveAssistant: async (data: {
    prompt: string;
    mode: 'legal_advice' | 'draft_warning' | 'generate_contract' | 'policy_audit';
    companyId?: string;
    employeeId?: string;
  }): Promise<{ text: string }> => {
    const res = await fetch('/api/gemini/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('AI Assistant request failed');
    return res.json();
  }
};
