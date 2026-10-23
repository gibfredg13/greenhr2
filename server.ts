import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_COMPANIES,
  INITIAL_EMPLOYEES,
  INITIAL_COMPLIANCE_EVENTS,
  INITIAL_DISCIPLINARY_CASES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_TIME_ENTRIES,
  INITIAL_INVOICES,
  INITIAL_DOCUMENTS,
  INITIAL_BOOKINGS,
  INITIAL_BLOCKED_SLOTS,
  INITIAL_MEETING_RECORDS,
  INITIAL_SUPERADMIN_SETTINGS,
  INITIAL_MATRIX_AUDITS,
  INITIAL_DIAGNOSTIC_TEST_RESULTS,
  DIAGNOSTIC_FRAMEWORKS_CATALOG,
  INITIAL_PORTAL_USERS,
  INITIAL_COMPANY_PROPERTIES,
  INITIAL_EMPLOYEE_KPIS,
  INITIAL_ONBOARDING_TASKS,
  INITIAL_ORG_CHART_NODES,
  INITIAL_SETA_RECORDS,
  INITIAL_BBBEE_SCORECARDS
} from './src/data/seedData.ts';
import type {
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
  StandardizedTestResult,
  PortalUserAccount,
  CompanyPropertyAssignment,
  EmployeeKpiItem,
  EmployeeOnboardingTask,
  OrgChartNode,
  SetaTrainingRecord,
  BbbeeScorecardProfile
} from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory Relational PostgreSQL data simulation store with pre-seeded data
let companies: Company[] = [...INITIAL_COMPANIES];
let employees: Employee[] = [...INITIAL_EMPLOYEES];
let complianceEvents: ComplianceEvent[] = [...INITIAL_COMPLIANCE_EVENTS];
let disciplinaryCases: DisciplinaryCase[] = [...INITIAL_DISCIPLINARY_CASES];
let leaveRequests: LeaveRequest[] = [...INITIAL_LEAVE_REQUESTS];
let timeEntries: TimeEntry[] = [...INITIAL_TIME_ENTRIES];
let invoices: Invoice[] = [...INITIAL_INVOICES];
let documents: EmployeeDocument[] = [...INITIAL_DOCUMENTS];
let bookings: ConsultantBooking[] = [...INITIAL_BOOKINGS];
let blockedSlots: BlockedTimeSlot[] = [...INITIAL_BLOCKED_SLOTS];
let meetingRecords: EmployeeMeetingRecord[] = [...INITIAL_MEETING_RECORDS];
let superadminSettings: SuperadminPermissionSettings = { ...INITIAL_SUPERADMIN_SETTINGS };
let matrixAudits: MatrixAuditRecord[] = [...INITIAL_MATRIX_AUDITS];
let diagnosticTestResults: StandardizedTestResult[] = [...INITIAL_DIAGNOSTIC_TEST_RESULTS];
let portalUsers: PortalUserAccount[] = [...INITIAL_PORTAL_USERS];
let companyProperties: CompanyPropertyAssignment[] = [...INITIAL_COMPANY_PROPERTIES];
let employeeKpis: EmployeeKpiItem[] = [...INITIAL_EMPLOYEE_KPIS];
let onboardingTasks: EmployeeOnboardingTask[] = [...INITIAL_ONBOARDING_TASKS];
let orgChartNodes: OrgChartNode[] = [...INITIAL_ORG_CHART_NODES];
let setaRecords: SetaTrainingRecord[] = [...INITIAL_SETA_RECORDS];
let bbbeeScorecards: BbbeeScorecardProfile[] = [...INITIAL_BBBEE_SCORECARDS];

// Gemini AI Client setup
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// ----------------- API ROUTES ----------------- //

// Companies
app.get('/api/companies', (req: Request, res: Response) => {
  res.json(companies);
});

app.post('/api/companies', (req: Request, res: Response) => {
  const newCompany: Company = {
    ...req.body,
    id: `comp_${Date.now()}`,
    complianceScore: 100,
    employeeCount: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
  companies.push(newCompany);
  res.status(201).json(newCompany);
});

app.patch('/api/companies/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = companies.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Company not found' });
  companies[idx] = { ...companies[idx], ...req.body };
  res.json(companies[idx]);
});

// Employees
app.get('/api/employees', (req: Request, res: Response) => {
  const { companyId } = req.query;
  if (companyId) {
    return res.json(employees.filter(e => e.companyId === companyId));
  }
  res.json(employees);
});

app.post('/api/employees', (req: Request, res: Response) => {
  const newEmployee: Employee = {
    ...req.body,
    id: `emp_${Date.now()}`,
    fileCompletenessScore: 80,
    status: 'Active'
  };
  employees.push(newEmployee);
  
  // Update company employee count
  const comp = companies.find(c => c.id === newEmployee.companyId);
  if (comp) {
    comp.employeeCount += 1;
  }

  res.status(201).json(newEmployee);
});

app.put('/api/employees/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  employees[index] = { ...employees[index], ...req.body };
  res.json(employees[index]);
});

app.delete('/api/employees/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const target = employees.find(e => e.id === id);
  if (target) {
    const comp = companies.find(c => c.id === target.companyId);
    if (comp && comp.employeeCount > 0) comp.employeeCount -= 1;
  }
  employees = employees.filter(e => e.id !== id);
  res.json({ success: true });
});

// Compliance
app.get('/api/compliance', (req: Request, res: Response) => {
  const { companyId } = req.query;
  if (companyId) {
    return res.json(complianceEvents.filter(e => e.companyId === companyId));
  }
  res.json(complianceEvents);
});

app.post('/api/compliance', (req: Request, res: Response) => {
  const newEvent: ComplianceEvent = {
    ...req.body,
    id: `comp_ev_${Date.now()}`,
    reminderSent: false
  };
  complianceEvents.push(newEvent);
  res.status(201).json(newEvent);
});

app.post('/api/compliance/:id/toggle', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = complianceEvents.find(e => e.id === id);
  if (!item) return res.status(404).json({ error: 'Event not found' });

  item.status = item.status === 'Compliant' ? 'Action Required' : 'Compliant';
  res.json(item);
});

// Disciplinary & Labour Relations
app.get('/api/disciplinary', (req: Request, res: Response) => {
  const { companyId } = req.query;
  if (companyId) {
    return res.json(disciplinaryCases.filter(c => c.companyId === companyId));
  }
  res.json(disciplinaryCases);
});

app.post('/api/disciplinary', (req: Request, res: Response) => {
  const newCase: DisciplinaryCase = {
    ...req.body,
    id: `case_${Date.now()}`
  };
  disciplinaryCases.push(newCase);
  res.status(201).json(newCase);
});

// Leave
app.get('/api/leave', (req: Request, res: Response) => {
  const { companyId } = req.query;
  if (companyId) {
    return res.json(leaveRequests.filter(l => l.companyId === companyId));
  }
  res.json(leaveRequests);
});

app.post('/api/leave', (req: Request, res: Response) => {
  const newLeave: LeaveRequest = {
    ...req.body,
    id: `leave_${Date.now()}`,
    status: 'Pending',
    appliedDate: new Date().toISOString().split('T')[0]
  };
  leaveRequests.push(newLeave);
  res.status(201).json(newLeave);
});

app.patch('/api/leave/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reviewedBy } = req.body;
  const item = leaveRequests.find(l => l.id === id);
  if (!item) return res.status(404).json({ error: 'Leave request not found' });

  item.status = status;
  if (reviewedBy) item.reviewedBy = reviewedBy;

  // Deduct balance if approved
  if (status === 'Approved') {
    const emp = employees.find(e => e.id === item.employeeId);
    if (emp) {
      if (item.leaveType === 'Annual') {
        emp.leaveBalances.annual = Math.max(0, emp.leaveBalances.annual - item.daysCount);
      } else if (item.leaveType === 'Sick') {
        emp.leaveBalances.sick = Math.max(0, emp.leaveBalances.sick - item.daysCount);
      } else if (item.leaveType === 'Family Responsibility') {
        emp.leaveBalances.familyResponsibility = Math.max(0, emp.leaveBalances.familyResponsibility - item.daysCount);
      }
    }
  }

  res.json(item);
});

// Time & Billing
app.get('/api/billing', (req: Request, res: Response) => {
  const { companyId } = req.query;
  const filteredTime = companyId ? timeEntries.filter(t => t.companyId === companyId) : timeEntries;
  const filteredInvoices = companyId ? invoices.filter(i => i.companyId === companyId) : invoices;
  res.json({ timeEntries: filteredTime, invoices: filteredInvoices });
});

app.post('/api/billing/time', (req: Request, res: Response) => {
  const entry: TimeEntry = {
    ...req.body,
    id: `time_${Date.now()}`,
    isBilled: false
  };
  timeEntries.push(entry);
  res.status(201).json(entry);
});

app.post('/api/billing/generate-invoice', (req: Request, res: Response) => {
  const { companyId } = req.body;
  const targetCompany = companies.find(c => c.id === companyId);
  if (!targetCompany) return res.status(404).json({ error: 'Company not found' });

  const unbilled = timeEntries.filter(t => t.companyId === companyId && !t.isBilled);
  const items = unbilled.map(u => ({
    description: `${u.project}: ${u.description}`,
    hours: u.hours,
    rateZar: u.rateZar,
    amountZar: u.hours * u.rateZar
  }));

  // Add monthly retainer if configured
  if (targetCompany.monthlyRetainerZar > 0) {
    items.unshift({
      description: `Monthly HR & Compliance Retainer - ${targetCompany.name}`,
      hours: 1,
      rateZar: targetCompany.monthlyRetainerZar,
      amountZar: targetCompany.monthlyRetainerZar
    });
  }

  const subtotalZar = items.reduce((sum, item) => sum + item.amountZar, 0);
  const vatZar = Math.round(subtotalZar * 0.15); // 15% South African VAT
  const totalZar = subtotalZar + vatZar;

  const invoiceNumber = `GH-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`;
  const today = new Date().toISOString().split('T')[0];
  const due = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const newInvoice: Invoice = {
    id: `inv_${Date.now()}`,
    invoiceNumber,
    companyId,
    companyName: targetCompany.name,
    date: today,
    dueDate: due,
    items,
    subtotalZar,
    vatZar,
    totalZar,
    status: 'Sent'
  };

  invoices.unshift(newInvoice);

  // Mark entries as billed
  unbilled.forEach(u => {
    u.isBilled = true;
    u.invoiceId = newInvoice.id;
  });

  res.status(201).json(newInvoice);
});

// Document Vault
app.get('/api/documents', (req: Request, res: Response) => {
  const { companyId } = req.query;
  if (companyId) {
    return res.json(documents.filter(d => d.companyId === companyId));
  }
  res.json(documents);
});

app.post('/api/documents', (req: Request, res: Response) => {
  const newDoc: EmployeeDocument = {
    ...req.body,
    id: `doc_${Date.now()}`,
    uploadedAt: new Date().toISOString().split('T')[0],
    status: 'Valid'
  };
  documents.push(newDoc);
  res.status(201).json(newDoc);
});

// ----------------- 1-ON-1 SESSIONS & CONSULTANT CALENDAR ----------------- //

// Get bookings (filter by company, employee, or consultant)
app.get('/api/bookings', (req: Request, res: Response) => {
  const { companyId, employeeId, consultantName } = req.query;
  let result = bookings;
  if (companyId) result = result.filter(b => b.companyId === companyId);
  if (employeeId) result = result.filter(b => b.employeeId === employeeId);
  if (consultantName) result = result.filter(b => b.consultantName === consultantName);
  res.json(result);
});

// Book a new 1-on-1 session
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    companyId,
    companyName,
    employeeId,
    employeeName,
    employeeEmail,
    employeeRole,
    consultantId,
    consultantName,
    sessionType,
    date,
    timeSlot,
    reasonWhy,
    detailsWhat
  } = req.body;

  if (!date || !timeSlot || !reasonWhy || !detailsWhat) {
    return res.status(400).json({ error: 'Please provide all required session booking details.' });
  }

  // Check if slot is already blocked out by the consultant
  const isBlocked = blockedSlots.some(
    s => s.consultantName === consultantName && s.date === date && s.timeSlot === timeSlot
  );
  if (isBlocked) {
    return res.status(409).json({ error: 'This time slot is blocked out by the consultant on their calendar.' });
  }

  // Check if consultant is already booked for this slot
  const isBooked = bookings.some(
    b => b.consultantName === consultantName && b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled'
  );
  if (isBooked) {
    return res.status(409).json({ error: 'This time slot is already reserved with this consultant.' });
  }

  // Generate meeting link or physical location
  let meetingLinkOrLocation = '';
  if (sessionType === 'teams') {
    meetingLinkOrLocation = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_greenhive_${Date.now()}%40thread.v2/0`;
  } else if (sessionType === 'phone') {
    meetingLinkOrLocation = `Dedicated Direct Dial: +27 (0)10 880 4920 (Pin: ${Math.floor(1000 + Math.random() * 9000)})`;
  } else {
    meetingLinkOrLocation = `${companyName || 'Client Entity'} Executive Consultation Suite A`;
  }

  const newBooking: ConsultantBooking = {
    id: `book_${Date.now()}`,
    companyId,
    companyName: companyName || 'Client Company',
    employeeId,
    employeeName,
    employeeEmail: employeeEmail || '',
    employeeRole: employeeRole || 'Team Member',
    consultantId: consultantId || 'cons_01',
    consultantName: consultantName || 'Sarah Khanyile',
    sessionType,
    date,
    timeSlot,
    reasonWhy,
    detailsWhat,
    status: 'confirmed',
    meetingLinkOrLocation,
    createdAt: new Date().toISOString().split('T')[0]
  };

  bookings.unshift(newBooking);
  res.status(201).json(newBooking);
});

// Update booking status or notes (completed, cancelled, rescheduled)
app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const item = bookings.find(b => b.id === id);
  if (!item) return res.status(404).json({ error: 'Booking not found' });

  if (status) item.status = status;
  if (notes !== undefined) item.notes = notes;
  res.json(item);
});

// Get blocked time slots
app.get('/api/calendar/blocked-slots', (req: Request, res: Response) => {
  const { consultantName, date } = req.query;
  let result = blockedSlots;
  if (consultantName) result = result.filter(b => b.consultantName === consultantName);
  if (date) result = result.filter(b => b.date === date);
  res.json(result);
});

// Block out time on consultant calendar
app.post('/api/calendar/blocked-slots', (req: Request, res: Response) => {
  const { consultantName, date, timeSlot, reason } = req.body;
  if (!consultantName || !date || !timeSlot || !reason) {
    return res.status(400).json({ error: 'All fields are required to block time.' });
  }

  const newBlock: BlockedTimeSlot = {
    id: `block_${Date.now()}`,
    consultantName,
    date,
    timeSlot,
    reason,
    createdAt: new Date().toISOString().split('T')[0]
  };

  blockedSlots.push(newBlock);
  res.status(201).json(newBlock);
});

// Unblock a time slot
app.delete('/api/calendar/blocked-slots/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  blockedSlots = blockedSlots.filter(b => b.id !== id);
  res.json({ success: true });
});

// ----------------- REGULAR MEETINGS & CONFIDENTIAL TRANSCRIPTS ----------------- //

// Get meeting records with fine-grain role permission checks
app.get('/api/meetings', (req: Request, res: Response) => {
  const { companyId, employeeId, role } = req.query;
  let results = meetingRecords;
  if (companyId) results = results.filter(m => m.companyId === companyId);
  if (employeeId) results = results.filter(m => m.employeeId === employeeId);

  // If a role is passed, enforce Superadmin Fine-Grain Permissions:
  // - 'superadmin': full unredacted access
  // - 'consultant': access if permissionLevel is 'superadmin_and_consultant', 'superadmin_consultant_manager', or 'all_including_employee'
  // - 'company_admin' / 'manager': access if permissionLevel is 'superadmin_consultant_manager' or 'all_including_employee'
  // - 'employee': access ONLY if permissionLevel is 'all_including_employee'
  if (role) {
    const userRole = String(role);
    if (userRole === 'super_admin') {
      return res.json(results);
    } else if (userRole === 'consultant') {
      const allowed = results.filter(m => m.permissionLevel !== 'superadmin_only');
      return res.json(allowed);
    } else if (userRole === 'company_admin' || userRole === 'manager') {
      const allowed = results.filter(m =>
        m.permissionLevel === 'superadmin_consultant_manager' || m.permissionLevel === 'all_including_employee'
      );
      return res.json(allowed);
    } else if (userRole === 'employee') {
      const allowed = results.filter(m => m.permissionLevel === 'all_including_employee');
      return res.json(allowed);
    }
  }

  res.json(results);
});

// Create meeting record / transcript
app.post('/api/meetings', (req: Request, res: Response) => {
  const newMeeting: EmployeeMeetingRecord = {
    ...req.body,
    id: `meet_${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    actionItems: req.body.actionItems || []
  };

  meetingRecords.unshift(newMeeting);

  // Also add to the employee's document vault as a confidential meeting record
  const emp = employees.find(e => e.id === newMeeting.employeeId);
  if (emp) {
    const docTitle = `${newMeeting.meetingTitle} (${newMeeting.date}) - Transcript & Actions`;
    documents.push({
      id: `doc_meet_${Date.now()}`,
      companyId: newMeeting.companyId,
      employeeId: newMeeting.employeeId,
      employeeName: newMeeting.employeeName,
      category: newMeeting.meetingType === 'disciplinary_inquiry' ? 'Disciplinary' : 'Performance',
      title: docTitle,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Valid',
      fileSize: newMeeting.attachmentFileSize || '850 KB'
    });
  }

  res.status(201).json(newMeeting);
});

// Update meeting record (e.g., action items or permission level)
app.patch('/api/meetings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = meetingRecords.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Meeting record not found' });

  meetingRecords[index] = { ...meetingRecords[index], ...req.body };
  res.json(meetingRecords[index]);
});

// Delete meeting record
app.delete('/api/meetings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  meetingRecords = meetingRecords.filter(m => m.id !== id);
  res.json({ success: true });
});

// Superadmin permission settings
app.get('/api/permissions/settings', (req: Request, res: Response) => {
  res.json(superadminSettings);
});

app.post('/api/permissions/settings', (req: Request, res: Response) => {
  superadminSettings = { ...superadminSettings, ...req.body };
  res.json(superadminSettings);
});

// ----------------- MATRIX & GRID-BASED AUDITS ----------------- //
app.get('/api/matrix-audits', (req: Request, res: Response) => {
  const { companyId, employeeId } = req.query;
  let results = [...matrixAudits];
  if (companyId) {
    results = results.filter(a => a.companyId === companyId);
  }
  if (employeeId) {
    results = results.filter(a => a.employeeId === employeeId);
  }
  res.json(results);
});

app.post('/api/matrix-audits', (req: Request, res: Response) => {
  const newAudit: MatrixAuditRecord = {
    ...req.body,
    id: `mat_audit_${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  matrixAudits.unshift(newAudit);

  // Auto-index into the employee's document vault as an Audit Dossier
  const emp = employees.find(e => e.id === newAudit.employeeId);
  if (emp) {
    documents.push({
      id: `doc_audit_${Date.now()}`,
      companyId: newAudit.companyId,
      employeeId: newAudit.employeeId,
      employeeName: newAudit.employeeName,
      category: 'Performance',
      title: `Matrix Audit Report: ${newAudit.auditTitle} (${newAudit.quadrantOrCategory})`,
      fileType: 'PDF',
      uploadedAt: newAudit.auditDate || new Date().toISOString().split('T')[0],
      fileSize: '1.8 MB',
      status: 'Valid'
    });
  }

  res.status(201).json(newAudit);
});

app.patch('/api/matrix-audits/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = matrixAudits.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Matrix audit not found' });
  matrixAudits[idx] = { ...matrixAudits[idx], ...req.body };
  res.json(matrixAudits[idx]);
});

app.delete('/api/matrix-audits/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  matrixAudits = matrixAudits.filter(a => a.id !== id);
  res.json({ success: true });
});

// ----------------- PORTAL USERS, PASSWORDS & OPTIONAL EXTRAS ----------------- //
app.get('/api/portal-users', (req: Request, res: Response) => {
  const { companyId, employeeId } = req.query;
  let results = [...portalUsers];
  if (companyId) results = results.filter(u => u.companyId === companyId);
  if (employeeId) results = results.filter(u => u.employeeId === employeeId);
  res.json(results);
});

app.post('/api/portal-users', (req: Request, res: Response) => {
  const newUser: PortalUserAccount = {
    ...req.body,
    id: `puser_${Date.now()}`,
    lastPasswordReset: new Date().toISOString().split('T')[0]
  };
  portalUsers.unshift(newUser);
  res.status(201).json(newUser);
});

app.patch('/api/portal-users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = portalUsers.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Portal user not found' });
  portalUsers[idx] = { ...portalUsers[idx], ...req.body };
  res.json(portalUsers[idx]);
});

// ----------------- COMPANY PROPERTY ASSIGNMENTS (READ-ONLY TO EMPLOYEE) ----------------- //
app.get('/api/company-properties', (req: Request, res: Response) => {
  const { companyId, employeeId } = req.query;
  let results = [...companyProperties];
  if (companyId) results = results.filter(p => p.companyId === companyId);
  if (employeeId) results = results.filter(p => p.employeeId === employeeId);
  res.json(results);
});

app.post('/api/company-properties', (req: Request, res: Response) => {
  const newProp: CompanyPropertyAssignment = {
    ...req.body,
    id: `prop_${Date.now()}`,
    acknowledgedByEmployee: false
  };
  companyProperties.unshift(newProp);

  // Also index as a read-only document in the employee's personnel vault
  documents.unshift({
    id: `doc_prop_${Date.now()}`,
    companyId: newProp.companyId,
    employeeId: newProp.employeeId,
    employeeName: newProp.employeeName,
    category: 'Contract',
    title: `[View-Only Property Agreement] ${newProp.itemName} (Tag: ${newProp.assetTag})`,
    fileType: 'PDF',
    uploadedAt: newProp.assignedDate || new Date().toISOString().split('T')[0],
    fileSize: '1.1 MB',
    status: 'Valid'
  });

  res.status(201).json(newProp);
});

app.patch('/api/company-properties/:id/acknowledge', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = companyProperties.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Property assignment not found' });
  companyProperties[idx] = {
    ...companyProperties[idx],
    acknowledgedByEmployee: true,
    acknowledgedAt: new Date().toISOString().split('T')[0]
  };
  res.json(companyProperties[idx]);
});

// ----------------- EMPLOYEE KPIS & SELF-ASSESSMENT ----------------- //
app.get('/api/kpis', (req: Request, res: Response) => {
  const { companyId, employeeId } = req.query;
  let results = [...employeeKpis];
  if (companyId) results = results.filter(k => k.companyId === companyId);
  if (employeeId) results = results.filter(k => k.employeeId === employeeId);
  res.json(results);
});

app.post('/api/kpis', (req: Request, res: Response) => {
  const newKpi: EmployeeKpiItem = {
    ...req.body,
    id: `kpi_${Date.now()}`,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  employeeKpis.unshift(newKpi);
  res.status(201).json(newKpi);
});

app.patch('/api/kpis/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = employeeKpis.findIndex(k => k.id === id);
  if (idx === -1) return res.status(404).json({ error: 'KPI item not found' });
  employeeKpis[idx] = {
    ...employeeKpis[idx],
    ...req.body,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  res.json(employeeKpis[idx]);
});

// ----------------- EMPLOYEE ONBOARDING TASKS & ANSWERS ----------------- //
app.get('/api/onboarding-tasks', (req: Request, res: Response) => {
  const { companyId, employeeId } = req.query;
  let results = [...onboardingTasks];
  if (companyId) results = results.filter(t => t.companyId === companyId);
  if (employeeId) results = results.filter(t => t.employeeId === employeeId);
  res.json(results);
});

app.post('/api/onboarding-tasks', (req: Request, res: Response) => {
  const newTask: EmployeeOnboardingTask = {
    ...req.body,
    id: `onb_${Date.now()}`,
    completed: false
  };
  onboardingTasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/onboarding-tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = onboardingTasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Onboarding task not found' });
  onboardingTasks[idx] = {
    ...onboardingTasks[idx],
    ...req.body,
    completedAt: req.body.completed ? new Date().toISOString().split('T')[0] : onboardingTasks[idx].completedAt
  };
  res.json(onboardingTasks[idx]);
});

// ----------------- HIERARCHICAL ORG CHART (ADMIN EDITABLE, EMPLOYEE READ-ONLY) ----------------- //
app.get('/api/org-chart', (req: Request, res: Response) => {
  const { companyId } = req.query;
  let results = [...orgChartNodes];
  if (companyId) results = results.filter(n => n.companyId === companyId);
  res.json(results);
});

app.post('/api/org-chart', (req: Request, res: Response) => {
  const newNode: OrgChartNode = {
    ...req.body,
    id: `org_${Date.now()}`
  };
  orgChartNodes.push(newNode);
  res.status(201).json(newNode);
});

app.patch('/api/org-chart/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = orgChartNodes.findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Org chart node not found' });
  orgChartNodes[idx] = { ...orgChartNodes[idx], ...req.body };
  res.json(orgChartNodes[idx]);
});

app.delete('/api/org-chart/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  orgChartNodes = orgChartNodes.filter(n => n.id !== id);
  // Re-parent any child nodes whose parent was deleted
  orgChartNodes = orgChartNodes.map(n => n.reportsToNodeId === id ? { ...n, reportsToNodeId: null } : n);
  res.json({ success: true });
});

// ----------------- SKILLS DEVELOPMENT & SETA TRACKING (WSP / ATR / LEARNERSHIPS) ----------------- //
app.get('/api/seta-records', (req: Request, res: Response) => {
  const { companyId, employeeId } = req.query;
  let results = [...setaRecords];
  if (companyId) results = results.filter(r => r.companyId === companyId);
  if (employeeId) results = results.filter(r => r.employeeId === employeeId);
  res.json(results);
});

app.post('/api/seta-records', (req: Request, res: Response) => {
  const newRec: SetaTrainingRecord = {
    ...req.body,
    id: `seta_${Date.now()}`
  };
  setaRecords.unshift(newRec);
  res.status(201).json(newRec);
});

app.patch('/api/seta-records/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = setaRecords.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'SETA record not found' });
  setaRecords[idx] = { ...setaRecords[idx], ...req.body };
  res.json(setaRecords[idx]);
});

// ----------------- B-BBEE 5-ELEMENT SCORECARD & EVIDENCE ----------------- //
app.get('/api/bbbee-scorecards', (req: Request, res: Response) => {
  const { companyId } = req.query;
  if (companyId) {
    return res.json(bbbeeScorecards.filter(s => s.companyId === companyId));
  }
  res.json(bbbeeScorecards);
});

app.put('/api/bbbee-scorecards/:companyId', (req: Request, res: Response) => {
  const { companyId } = req.params;
  const idx = bbbeeScorecards.findIndex(s => s.companyId === companyId);
  if (idx === -1) {
    const created: BbbeeScorecardProfile = {
      companyId: String(companyId),
      ...req.body
    };
    bbbeeScorecards.push(created);
    return res.json(created);
  }
  bbbeeScorecards[idx] = { ...bbbeeScorecards[idx], ...req.body };
  res.json(bbbeeScorecards[idx]);
});

// ----------------- STANDARDIZED DIAGNOSTIC FRAMEWORKS & TESTING ----------------- //
app.get('/api/diagnostic-frameworks', (req: Request, res: Response) => {
  res.json(DIAGNOSTIC_FRAMEWORKS_CATALOG);
});

app.get('/api/diagnostic-tests', (req: Request, res: Response) => {
  const { companyId, employeeId } = req.query;
  let results = [...diagnosticTestResults];
  if (companyId) {
    results = results.filter(t => t.companyId === companyId);
  }
  if (employeeId) {
    results = results.filter(t => t.employeeId === employeeId);
  }
  res.json(results);
});

app.post('/api/diagnostic-tests', (req: Request, res: Response) => {
  const newResult: StandardizedTestResult = {
    ...req.body,
    id: `diag_res_${Date.now()}`,
    certificateNumber: req.body.certificateNumber || `GH-DIAG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  diagnosticTestResults.unshift(newResult);

  // Auto-index into employee file vault as a Diagnostic Certificate
  const emp = employees.find(e => e.id === newResult.employeeId);
  if (emp) {
    documents.push({
      id: `doc_diag_${Date.now()}`,
      companyId: newResult.companyId,
      employeeId: newResult.employeeId,
      employeeName: newResult.employeeName,
      category: 'Performance',
      title: `Diagnostic Certificate: ${newResult.testTitle} (${newResult.proficiencyBand})`,
      fileType: 'PDF',
      uploadedAt: newResult.testDate || new Date().toISOString().split('T')[0],
      fileSize: '1.2 MB',
      status: 'Valid'
    });
  }

  res.status(201).json(newResult);
});

// ----------------- AI HIVE ASSISTANT (GEMINI) ----------------- //
app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  const { prompt, mode, companyId, employeeId } = req.body;

  const currentCompany = companies.find(c => c.id === companyId);
  const currentEmployee = employees.find(e => e.id === employeeId);

  const systemInstruction = `You are the GreenHiveHR AI Hive Assistant, a top-tier South African Labour Relations and HR Legal Expert.
You provide advice, documentation, and compliance analysis strictly grounded in South African legislation:
1. Basic Conditions of Employment Act (BCEA 75 of 1997): hours of work, 45h normal week, overtime at 1.5x, meal intervals, leave rights (21 consecutive days / 15 working days annual, 30 days sick per 3-year cycle with doctor's notes for >2 days or Mondays/Fridays, 3 days family responsibility, 10 days parental, 4 months maternity).
2. Labour Relations Act (LRA 66 of 1995): procedural and substantive fairness, Schedule 8 Code of Good Practice on Dismissals (misconduct, poor performance, incapacity), CCMA dispute procedures, written hearing notice with at least 48 hours notice, right to representation by a colleague or trade union shop steward (legal practitioners generally excluded unless complex).
3. Protection of Personal Information Act (POPIA Act 4 of 2013): lawful processing of employee personal information and special personal information, operator agreements.
4. Compensation for Occupational Injuries and Diseases Act (COIDA) and Unemployment Insurance Act (UIF).
5. Employment Equity Act (EEA 55 of 1998) and Broad-Based Black Economic Empowerment (B-BBEE).

Context:
- Company: ${currentCompany ? `${currentCompany.name} (Industry: ${currentCompany.industry}, Location: ${currentCompany.city}, ${currentCompany.province})` : 'South African Employer'}
- Employee in focus: ${currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName} (Role: ${currentEmployee.jobTitle}, Department: ${currentEmployee.department})` : 'General Workforce'}

Instructions for format:
- Answer in clear, highly professional, actionable language.
- Structure responses with clean headings, bullet points, and statutory references.
- If drafting a document (Warning Notice, Hearing Notice, or Employment Contract), produce a complete, formal, CCMA-defensible document ready for immediate employer signature with all standard clauses.
- Avoid generic US or European terms (use 'CCMA', 'BCEA', 'LRA', 'UIF', 'COIDA', 'Department of Employment and Labour', 'ZAR / Rands').`;

  if (!ai) {
    // High-quality statutory fallback if GEMINI_API_KEY is not yet provisioned in development
    const sampleResponses: Record<string, string> = {
      draft_warning: `FORMAL WRITTEN WARNING NOTICE (LRA Schedule 8 Compliant)

COMPANY: ${currentCompany ? currentCompany.name : 'Cape Logistics (Pty) Ltd'}
EMPLOYEE NAME: ${currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : 'Employee'}
JOB TITLE: ${currentEmployee ? currentEmployee.jobTitle : 'Operational Staff'}
DATE OF ISSUE: ${new Date().toISOString().split('T')[0]}
VALIDITY PERIOD: 6 Months (Expires: ${new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]})

1. NATURE OF OFFENCE / CHARGE:
Under the Company Disciplinary Code and Schedule 8 of the Labour Relations Act 66 of 1995, you are hereby issued with a formal Written Warning for:
"${prompt || 'Unauthorised absence from workstation without prior notification or approval'}"

2. PROCEDURAL FAIRNESS AUDIT:
• The employee was provided an opportunity to state their case and tender an explanation.
• Mitigating circumstances were considered by management prior to imposing this sanction.
• The employee was advised of their right to representation by a fellow employee or recognized trade union representative.

3. REQUIRED CORRECTIVE ACTION:
You are required to immediately conform to company operational standards and notify your line manager within 1 hour of any unplanned workplace disruptions.

4. CONSEQUENCES OF RECURRENCE:
Failure to remediate performance or any repetition of similar misconduct during the 6-month validity period may result in elevated disciplinary action, including a Final Written Warning or a Formal Disciplinary Hearing with potential dismissal.

EMPLOYEE SIGNATURE: _______________________ DATE: _________
(Signature acknowledges receipt of this notice without admitting guilt)
ISSUING MANAGER: ___________________________ DATE: _________`,

      generate_contract: `STANDARD PERMANENT EMPLOYMENT AGREEMENT (BCEA Section 29)

ENTERED INTO BETWEEN:
1. THE EMPLOYER: ${currentCompany ? currentCompany.name : 'The Company'} (Registration No: ${currentCompany ? currentCompany.registrationNumber : '2023/000000/07'})
2. THE EMPLOYEE: ${currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : 'The Employee'} (ID Number: ${currentEmployee ? currentEmployee.idNumber : '________________'})

1. APPOINTMENT & COMMENCEMENT
The Employer appoints the Employee as ${currentEmployee ? currentEmployee.jobTitle : 'Team Member'} commencing on ${currentEmployee ? currentEmployee.startDate : 'mutual agreed date'}.

2. PROBATIONARY PERIOD
In accordance with Item 8 of Schedule 8 of the LRA, employment is subject to a 3-month probation period to evaluate work performance and compatibility. Regular feedback sessions will be conducted.

3. ORDINARY HOURS OF WORK & REMUNERATION
3.1 In terms of Section 9 of the BCEA, normal working hours shall not exceed 45 hours per week.
3.2 The Employee shall receive a monthly basic gross remuneration of R${currentEmployee ? currentEmployee.salaryZar.toLocaleString() : '30,000.00'}, payable on the 25th of each month via electronic transfer.
3.3 Statutory deductions (PAYE, UIF, and SDL) shall be deducted in accordance with South African fiscal statutes.

4. STATUTORY LEAVE ENTITLEMENTS (BCEA Compliant)
4.1 Annual Leave: 21 consecutive days (or 15 working days) per 12-month annual leave cycle.
4.2 Sick Leave: 30 days paid sick leave during every 36-month cycle. Medical certificate required for absences >2 consecutive days or on Fridays/Mondays.
4.3 Family Responsibility Leave: 3 days per 12-month cycle for qualifying events.
4.4 Parental Leave: 10 consecutive days unpaid or UIF-funded parental leave.

5. POPIA CONFIDENTIALITY & DATA PROTECTION
The Employee agrees to comply with the Protection of Personal Information Act 4 of 2013 regarding employer, client, and coworker data.

SIGNED AT ${currentCompany ? currentCompany.city : 'JOHANNESBURG'} ON THIS _____ DAY OF ____________ 2026.

_____________________________           _____________________________
FOR AND ON BEHALF OF EMPLOYER           EMPLOYEE SIGNATURE`,

      legal_advice: `SOUTH AFRICAN LABOUR LAW ADVISORY (BCEA & LRA GUIDANCE)

Regarding your query: "${prompt}"

1. STATUTORY FRAMEWORK:
Under South African Labour Law, dismissal for misconduct requires both substantive fairness (a fair and valid reason) and procedural fairness (a fair process in terms of Item 4 of Schedule 8 to the Labour Relations Act 66 of 1995).

2. KEY CCMA REQUIREMENTS:
• Notice: The employee must be notified of the allegations using clear, concise language at least 48 hours before the inquiry.
• Representation: The employee is entitled to be assisted by a workplace trade union representative (shop steward) or a fellow employee. External legal representation is not an automatic right at internal company proceedings unless the chairperson exercises discretion.
• Opportunity to be heard: The employee must be given a genuine opportunity to state their case, question company witnesses, and present documentary evidence.
• Mitigating Factors: Prior disciplinary record, length of service, personal circumstances, and consistency of discipline must be weighed before deciding on a sanction.

3. RECOMMENDED NEXT ACTION FOR GREENHIVE CONSULTANTS:
1. Ensure all telematics/documentary evidence is paginated.
2. Issue a formal Notice to Attend Disciplinary Inquiry with the employee's signed acknowledgment.
3. If dismissed, ensure UI-19 documentation is properly marked code '04' (Dismissal) and filed electronically.`,

      policy_audit: `POPIA & STATUTORY WORKPLACE AUDIT REPORT

CLIENT ENTITY: ${currentCompany ? currentCompany.name : 'Target Client'}
SECTOR: ${currentCompany ? currentCompany.industry : 'South African Commercial'}

1. POPIA AUDIT FINDINGS (Act 4 of 2013):
• Employee Consent: All employee files must contain an updated Employee Personal Information Consent Addendum covering processing of ID numbers, banking records, and biometric logs.
• Operator Agreements: Service Level Agreements with external payroll, medical aid, and IT providers must incorporate Section 21 Operator terms.

2. BCEA / LABOUR AUDIT:
• Overtime threshold: Verify employees earning above the current ministerial earnings threshold are excluded from mandatory overtime pay under Section 6(3).
• Leave Register: Statutory leave balances are compliant with BCEA Section 20.`
    };

    const text = sampleResponses[mode] || sampleResponses['legal_advice'];
    return res.json({ text });
  }

  try {
    const userPromptText = mode === 'draft_warning'
      ? `Draft a formal, CCMA-compliant Written Warning notice for: ${prompt}. Details: Company: ${currentCompany?.name}, Employee: ${currentEmployee?.firstName} ${currentEmployee?.lastName}, Role: ${currentEmployee?.jobTitle}.`
      : mode === 'generate_contract'
      ? `Draft a South African Basic Conditions of Employment Act (BCEA) compliant permanent employment contract for: ${prompt}. Company: ${currentCompany?.name}, Employee: ${currentEmployee?.firstName} ${currentEmployee?.lastName}, Salary: R${currentEmployee?.salaryZar}.`
      : mode === 'policy_audit'
      ? `Perform an HR and statutory compliance audit check for: ${prompt}. Company: ${currentCompany?.name}, Sector: ${currentCompany?.industry}. Cite relevant South African legislation (POPIA, BCEA, LRA, COIDA, UIF).`
      : `Provide South African labour relations advisory for: ${prompt}. Reference relevant BCEA, LRA, and CCMA guidelines.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPromptText,
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: err.message || 'Error processing AI request' });
  }
});

// Setup Vite dev server or static dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`GreenHiveHR server running on http://localhost:${PORT}`);
  });
}

startServer();
