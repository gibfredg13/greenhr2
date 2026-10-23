import { Company, Employee, ComplianceEvent, DisciplinaryCase, LeaveRequest, TimeEntry, Invoice, EmployeeDocument } from '../types';

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
