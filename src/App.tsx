/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Company,
  Employee,
  ComplianceEvent,
  DisciplinaryCase,
  LeaveRequest,
  TimeEntry,
  Invoice,
  EmployeeDocument,
  UserRole,
  ConsultantBooking,
  BlockedTimeSlot,
  EmployeeMeetingRecord,
  SuperadminPermissionSettings,
  MatrixAuditRecord,
  StandardizedTestResult
} from './types';
import { api } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, DashboardTab } from './components/layout/Sidebar';
import { PublicWebsite } from './components/public/PublicWebsite';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { EmployeeModule } from './components/dashboard/EmployeeModule';
import { ConsultantCalendarModule } from './components/dashboard/ConsultantCalendarModule';
import { MatrixAuditModule } from './components/dashboard/MatrixAuditModule';
import { ComplianceModule } from './components/dashboard/ComplianceModule';
import { LabourRelationsModule } from './components/dashboard/LabourRelationsModule';
import { LeaveModule } from './components/dashboard/LeaveModule';
import { BillingModule } from './components/dashboard/BillingModule';
import { DocumentVaultModule } from './components/dashboard/DocumentVaultModule';
import { EmployeeSelfService } from './components/dashboard/EmployeeSelfService';
import { HiveAssistantDrawer } from './components/ai/HiveAssistantDrawer';
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
  INITIAL_DIAGNOSTIC_TEST_RESULTS
} from './data/seedData';

export default function App() {
  // Navigation view: start on 'public' as confirmed by user in Phase 1
  const [currentView, setCurrentView] = useState<'public' | 'dashboard' | 'ess'>('public');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('consultant');

  // Application Data State
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(INITIAL_COMPANIES[0].id);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [complianceEvents, setComplianceEvents] = useState<ComplianceEvent[]>(INITIAL_COMPLIANCE_EVENTS);
  const [disciplinaryCases, setDisciplinaryCases] = useState<DisciplinaryCase[]>(INITIAL_DISCIPLINARY_CASES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(INITIAL_TIME_ENTRIES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [documents, setDocuments] = useState<EmployeeDocument[]>(INITIAL_DOCUMENTS);

  // Calendar, 1-on-1 Sessions, Transcripts & Superadmin Fine-Grain Permissions
  const [bookings, setBookings] = useState<ConsultantBooking[]>(INITIAL_BOOKINGS);
  const [blockedSlots, setBlockedSlots] = useState<BlockedTimeSlot[]>(INITIAL_BLOCKED_SLOTS);
  const [meetingRecords, setMeetingRecords] = useState<EmployeeMeetingRecord[]>(INITIAL_MEETING_RECORDS);
  const [superadminSettings, setSuperadminSettings] = useState<SuperadminPermissionSettings>(INITIAL_SUPERADMIN_SETTINGS);

  // Matrix & Grid Framework Audits and Standardized Diagnostic Results
  const [matrixAudits, setMatrixAudits] = useState<MatrixAuditRecord[]>(INITIAL_MATRIX_AUDITS);
  const [diagnosticResults, setDiagnosticResults] = useState<StandardizedTestResult[]>(INITIAL_DIAGNOSTIC_TEST_RESULTS);

  // AI Assistant Drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [aiInitialMode, setAiInitialMode] = useState<'legal_advice' | 'draft_warning' | 'generate_contract' | 'policy_audit'>('legal_advice');

  // Fetch from server on boot
  useEffect(() => {
    async function loadData() {
      try {
        const [cList, eList, compList, discList, lList, bData, dList, bkList, blkList, mList, pSettings, maList, dtList] = await Promise.all([
          api.getCompanies(),
          api.getEmployees(),
          api.getComplianceEvents(),
          api.getDisciplinaryCases(),
          api.getLeaveRequests(),
          api.getBillingData(),
          api.getDocuments(),
          api.getBookings(),
          api.getBlockedSlots(),
          api.getMeetings({ role: currentRole }),
          api.getPermissionSettings(),
          api.getMatrixAudits(),
          api.getDiagnosticTests()
        ]);
        if (cList?.length) setCompanies(cList);
        if (eList?.length) setEmployees(eList);
        if (compList?.length) setComplianceEvents(compList);
        if (discList?.length) setDisciplinaryCases(discList);
        if (lList?.length) setLeaveRequests(lList);
        if (bData?.timeEntries) setTimeEntries(bData.timeEntries);
        if (bData?.invoices) setInvoices(bData.invoices);
        if (dList?.length) setDocuments(dList);
        if (bkList?.length) setBookings(bkList);
        if (blkList?.length) setBlockedSlots(blkList);
        if (mList?.length) setMeetingRecords(mList);
        if (pSettings) setSuperadminSettings(pSettings);
        if (maList?.length) setMatrixAudits(maList);
        if (dtList?.length) setDiagnosticResults(dtList);
      } catch (err) {
        console.warn('Backend loading completed with seed data fallback:', err);
      }
    }
    loadData();
  }, [currentRole]);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  // Calendar, 1-on-1 Sessions, Blocked Timeslots & Transcripts Handlers
  const handleAddBooking = async (bData: Partial<ConsultantBooking>) => {
    try {
      const created = await api.createBooking(bData);
      setBookings(prev => [created, ...prev]);
    } catch (err: any) {
      console.warn('Booking API error, using optimistic local creation:', err);
      const fallback: ConsultantBooking = {
        id: `bk_${Date.now()}`,
        employeeId: bData.employeeId || '',
        companyId: bData.companyId || selectedCompany.id,
        consultantName: bData.consultantName || 'Naledi Sithole',
        date: bData.date || new Date().toISOString().split('T')[0],
        timeSlot: bData.timeSlot || '09:00 - 09:45',
        sessionType: bData.sessionType || 'teams',
        reasonWhy: bData.reasonWhy || 'General Consultation',
        detailsWhat: bData.detailsWhat || '',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      setBookings(prev => [fallback, ...prev]);
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled', notes?: string) => {
    try {
      const updated = await api.updateBookingStatus(id, status, notes);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
    } catch {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status, notes: notes || b.notes } : b));
    }
  };

  const handleAddBlockedSlot = async (slotData: Partial<BlockedTimeSlot>) => {
    try {
      const created = await api.createBlockedSlot(slotData);
      setBlockedSlots(prev => [...prev, created]);
    } catch {
      const fallback: BlockedTimeSlot = {
        id: `blk_${Date.now()}`,
        consultantName: slotData.consultantName || 'Naledi Sithole',
        date: slotData.date || new Date().toISOString().split('T')[0],
        timeSlot: slotData.timeSlot || '14:00 - 14:45',
        reason: slotData.reason || 'Blocked',
        createdAt: new Date().toISOString()
      };
      setBlockedSlots(prev => [...prev, fallback]);
    }
  };

  const handleDeleteBlockedSlot = async (id: string) => {
    try {
      await api.deleteBlockedSlot(id);
    } catch {}
    setBlockedSlots(prev => prev.filter(s => s.id !== id));
  };

  const handleAddMeetingRecord = async (mData: Partial<EmployeeMeetingRecord>) => {
    try {
      const created = await api.createMeeting(mData);
      setMeetingRecords(prev => [created, ...prev]);
      // Also automatically register as indexed employee document in vault
      if (mData.attachmentFileName) {
        const autoDoc: EmployeeDocument = {
          id: `doc_meet_${Date.now()}`,
          employeeId: mData.employeeId || '',
          companyId: mData.companyId || selectedCompany.id,
          title: `Attached: ${mData.meetingTitle} (${mData.date})`,
          category: 'Disciplinary',
          fileType: 'PDF',
          uploadedAt: mData.date || new Date().toISOString().split('T')[0],
          fileSize: mData.attachmentFileSize || '1.4 MB',
          status: 'Valid'
        };
        setDocuments(prev => [autoDoc, ...prev]);
      }
    } catch {
      const fallback: EmployeeMeetingRecord = {
        id: `meet_${Date.now()}`,
        employeeId: mData.employeeId || '',
        companyId: mData.companyId || selectedCompany.id,
        consultantName: mData.consultantName || 'Naledi Sithole',
        meetingTitle: mData.meetingTitle || 'HR Consultation',
        meetingType: mData.meetingType || '1_on_1_regular',
        cadence: mData.cadence || 'one_off',
        date: mData.date || new Date().toISOString().split('T')[0],
        timeSlot: mData.timeSlot || '09:00 - 09:45',
        sessionFormat: mData.sessionFormat || 'teams',
        topicWhy: mData.topicWhy || 'Discussion',
        agendaWhat: mData.agendaWhat || 'Agenda',
        transcriptOrNotes: mData.transcriptOrNotes || '',
        permissionLevel: mData.permissionLevel || 'superadmin_and_consultant',
        attachmentFileName: mData.attachmentFileName,
        attachmentFileSize: mData.attachmentFileSize,
        actionItems: mData.actionItems || [],
        attendees: mData.attendees || [],
        signedOffByConsultant: true,
        signedOffDate: mData.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      setMeetingRecords(prev => [fallback, ...prev]);
    }
  };

  const handleUpdateMeetingRecord = async (id: string, mData: Partial<EmployeeMeetingRecord>) => {
    try {
      const updated = await api.updateMeeting(id, mData);
      setMeetingRecords(prev => prev.map(m => m.id === id ? updated : m));
    } catch {
      setMeetingRecords(prev => prev.map(m => m.id === id ? { ...m, ...mData } : m));
    }
  };

  const handleUpdatePermissionSettings = async (settings: Partial<SuperadminPermissionSettings>) => {
    try {
      const updated = await api.updatePermissionSettings(settings);
      setSuperadminSettings(updated);
    } catch {
      setSuperadminSettings(prev => ({ ...prev, ...settings }));
    }
  };

  // Matrix Audits & Standardized Diagnostic Handlers
  const handleAddMatrixAudit = async (auditData: Partial<MatrixAuditRecord>) => {
    try {
      const created = await api.createMatrixAudit(auditData);
      setMatrixAudits(prev => [created, ...prev]);
      // Auto-index into employee document vault
      const vaultDoc: EmployeeDocument = {
        id: `doc_audit_${Date.now()}`,
        employeeId: auditData.employeeId || '',
        companyId: auditData.companyId || selectedCompany.id,
        title: `Matrix Audit: ${auditData.frameworkName || '9-Box Grid'} (${auditData.ratingPlacement})`,
        category: 'Performance',
        fileType: 'PDF',
        uploadedAt: auditData.auditDate || new Date().toISOString().split('T')[0],
        fileSize: '1.8 MB',
        status: 'Valid'
      };
      setDocuments(prev => [vaultDoc, ...prev]);
    } catch {
      const fallback: MatrixAuditRecord = {
        id: `ma_${Date.now()}`,
        employeeId: auditData.employeeId || '',
        companyId: auditData.companyId || selectedCompany.id,
        frameworkType: auditData.frameworkType || 'nine_box_grid',
        frameworkName: auditData.frameworkName || '9-Box Performance vs Potential Grid',
        auditDate: auditData.auditDate || new Date().toISOString().split('T')[0],
        auditorName: auditData.auditorName || 'Naledi Sithole',
        xAxisScore: auditData.xAxisScore ?? 4,
        yAxisScore: auditData.yAxisScore ?? 4,
        ratingPlacement: auditData.ratingPlacement || 'High Performer / Growth Track',
        statutoryBasis: auditData.statutoryBasis || 'King IV Governance & Talent Succession',
        notes: auditData.notes || 'Calibrated under standard matrix framework.',
        actionPlan: auditData.actionPlan || '90-day growth roadmap.',
        status: 'completed',
        createdAt: new Date().toISOString()
      };
      setMatrixAudits(prev => [fallback, ...prev]);
    }
  };

  const handleAddDiagnosticTest = async (testData: Partial<StandardizedTestResult>) => {
    try {
      const created = await api.createDiagnosticTest(testData);
      setDiagnosticResults(prev => [created, ...prev]);
      const certDoc: EmployeeDocument = {
        id: `doc_diag_${Date.now()}`,
        employeeId: testData.employeeId || '',
        companyId: testData.companyId || selectedCompany.id,
        title: `Certificate: ${testData.frameworkName} (${testData.certificateNumber})`,
        category: 'Statutory_Record',
        fileType: 'PDF',
        uploadedAt: testData.dateCompleted || new Date().toISOString().split('T')[0],
        fileSize: '2.1 MB',
        status: 'Valid'
      };
      setDocuments(prev => [certDoc, ...prev]);
    } catch {
      const fallback: StandardizedTestResult = {
        id: `tr_${Date.now()}`,
        employeeId: testData.employeeId || '',
        companyId: testData.companyId || selectedCompany.id,
        frameworkId: testData.frameworkId || 'bcea_popia_statutory_diagnostic',
        frameworkName: testData.frameworkName || 'BCEA & POPIA Statutory Compliance Diagnostic',
        dateCompleted: testData.dateCompleted || new Date().toISOString().split('T')[0],
        score: testData.score ?? 18,
        maxScore: testData.maxScore ?? 20,
        percentage: testData.percentage ?? 90,
        normativePercentile: testData.normativePercentile ?? 88,
        passed: testData.passed ?? true,
        certificateNumber: testData.certificateNumber || `GH-DIAG-${Date.now().toString().slice(-4)}`,
        summaryFeedback: testData.summaryFeedback || 'High proficiency demonstrated across all statutory categories.',
        categoryScores: testData.categoryScores || {},
        administeredBy: testData.administeredBy || 'Proctored by GreenHive Statutory Engine',
        createdAt: new Date().toISOString()
      };
      setDiagnosticResults(prev => [fallback, ...prev]);
    }
  };

  // Handlers for state mutations
  const handleAddCompany = async (newComp: Partial<Company>) => {
    try {
      const created = await api.createCompany(newComp);
      setCompanies(prev => [...prev, created]);
      setSelectedCompanyId(created.id);
    } catch {
      const fallback: Company = {
        ...newComp as any,
        id: `comp_${Date.now()}`,
        complianceScore: 100,
        employeeCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCompanies(prev => [...prev, fallback]);
      setSelectedCompanyId(fallback.id);
    }
  };

  const handleAddEmployee = async (newEmp: Partial<Employee>) => {
    try {
      const created = await api.createEmployee(newEmp);
      setEmployees(prev => [created, ...prev]);
    } catch {
      const fallback: Employee = {
        ...newEmp as any,
        id: `emp_${Date.now()}`
      };
      setEmployees(prev => [fallback, ...prev]);
    }
  };

  const handleUpdateEmployee = async (id: string, empData: Partial<Employee>) => {
    try {
      const updated = await api.updateEmployee(id, empData);
      setEmployees(prev => prev.map(e => e.id === id ? updated : e));
    } catch {
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...empData } : e));
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await api.deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
    } catch {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleToggleCompliance = async (id: string) => {
    try {
      const toggled = await api.toggleComplianceStatus(id);
      setComplianceEvents(prev => prev.map(ev => ev.id === id ? toggled : ev));
    } catch {
      setComplianceEvents(prev => prev.map(ev => {
        if (ev.id === id) {
          return {
            ...ev,
            status: ev.status === 'Compliant' ? 'Action Required' : 'Compliant'
          };
        }
        return ev;
      }));
    }
  };

  const handleAddCompliance = async (newEvent: Partial<ComplianceEvent>) => {
    try {
      const created = await api.createComplianceEvent(newEvent);
      setComplianceEvents(prev => [created, ...prev]);
    } catch {
      const fallback: ComplianceEvent = {
        ...newEvent as any,
        id: `comp_ev_${Date.now()}`,
        reminderSent: false
      };
      setComplianceEvents(prev => [fallback, ...prev]);
    }
  };

  const handleAddDisciplinaryCase = async (newCase: Partial<DisciplinaryCase>) => {
    try {
      const created = await api.createDisciplinaryCase(newCase);
      setDisciplinaryCases(prev => [created, ...prev]);
    } catch {
      const fallback: DisciplinaryCase = {
        ...newCase as any,
        id: `case_${Date.now()}`
      };
      setDisciplinaryCases(prev => [fallback, ...prev]);
    }
  };

  const handleAddLeave = async (newLeave: Partial<LeaveRequest>) => {
    try {
      const created = await api.createLeaveRequest(newLeave);
      setLeaveRequests(prev => [created, ...prev]);
    } catch {
      const fallback: LeaveRequest = {
        ...newLeave as any,
        id: `leave_${Date.now()}`,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      };
      setLeaveRequests(prev => [fallback, ...prev]);
    }
  };

  const handleUpdateLeaveStatus = async (id: string, status: 'Approved' | 'Declined') => {
    try {
      const updated = await api.updateLeaveStatus(id, status, 'Practice Admin');
      setLeaveRequests(prev => prev.map(l => l.id === id ? updated : l));
    } catch {
      setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    }
  };

  const handleAddTimeEntry = async (entry: Partial<TimeEntry>) => {
    try {
      const created = await api.createTimeEntry(entry);
      setTimeEntries(prev => [created, ...prev]);
    } catch {
      const fallback: TimeEntry = {
        ...entry as any,
        id: `time_${Date.now()}`,
        isBilled: false
      };
      setTimeEntries(prev => [fallback, ...prev]);
    }
  };

  const handleGenerateInvoice = async (compId: string) => {
    try {
      const invoice = await api.generateInvoice(compId);
      setInvoices(prev => [invoice, ...prev]);
      setTimeEntries(prev => prev.map(t => t.companyId === compId ? { ...t, isBilled: true } : t));
    } catch {
      const unbilled = timeEntries.filter(t => t.companyId === compId && !t.isBilled);
      const items = unbilled.map(u => ({
        description: `${u.project}: ${u.description}`,
        hours: u.hours,
        rateZar: u.rateZar,
        amountZar: u.hours * u.rateZar
      }));
      items.unshift({
        description: `Monthly HR & Compliance Retainer - ${selectedCompany.name}`,
        hours: 1,
        rateZar: selectedCompany.monthlyRetainerZar,
        amountZar: selectedCompany.monthlyRetainerZar
      });
      const subtotal = items.reduce((s, i) => s + i.amountZar, 0);
      const vat = Math.round(subtotal * 0.15);
      const invoice: Invoice = {
        id: `inv_${Date.now()}`,
        invoiceNumber: `GH-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
        companyId: compId,
        companyName: selectedCompany.name,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items,
        subtotalZar: subtotal,
        vatZar: vat,
        totalZar: subtotal + vat,
        status: 'Sent'
      };
      setInvoices(prev => [invoice, ...prev]);
      setTimeEntries(prev => prev.map(t => t.companyId === compId ? { ...t, isBilled: true } : t));
    }
  };

  const handleUploadDocument = async (doc: Partial<EmployeeDocument>) => {
    try {
      const created = await api.uploadDocument(doc);
      setDocuments(prev => [created, ...prev]);
    } catch {
      const fallback: EmployeeDocument = {
        ...doc as any,
        id: `doc_${Date.now()}`,
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'Valid'
      };
      setDocuments(prev => [fallback, ...prev]);
    }
  };

  // Helper to open AI Assistant with pre-filled context
  const handleOpenAiWithPrompt = (prompt: string, mode: 'legal_advice' | 'draft_warning' | 'generate_contract' | 'policy_audit') => {
    setAiInitialPrompt(prompt);
    setAiInitialMode(mode);
    setIsAiDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        onOpenBookDemo={() => {
          if (currentView === 'public') {
            const demoBtn = document.querySelector('button');
            demoBtn?.click();
          } else {
            setCurrentView('public');
          }
        }}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
      />

      {/* Main Content Area */}
      {currentView === 'public' && (
        <PublicWebsite
          onLaunchWorkspace={() => setCurrentView('dashboard')}
          onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        />
      )}

      {/* Standalone Employee Self-Service (ESS) Portal - Completely Outside Workspace Area */}
      {currentView === 'ess' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Standalone ESS Banner & Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-2xl shadow-lg border border-emerald-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  ESS
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Employee Self-Service Portal
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                      External Employee Area
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300">
                    Confidential portal for {selectedCompany.name} staff to book 1-on-1 sessions, request statutory leave, and view verified payslips.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('public')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
                >
                  &larr; Public Website
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5"
                >
                  Consultant Workspace &rarr;
                </button>
              </div>
            </div>

            {/* Standalone ESS Component */}
            <EmployeeSelfService
              selectedCompany={selectedCompany}
              employees={employees}
              leaveRequests={leaveRequests}
              documents={documents}
              bookings={bookings}
              blockedSlots={blockedSlots}
              onApplyLeave={handleAddLeave}
              onUpdateEmployee={handleUpdateEmployee}
              onBookSession={handleAddBooking}
              onCancelBooking={(id) => handleUpdateBookingStatus(id, 'cancelled')}
            />
          </div>
        </div>
      )}

      {/* Multi-Tenant HR Consultant Workspace */}
      {currentView === 'dashboard' && (
        <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
          {/* Dashboard Left Sidebar */}
          <Sidebar
            companies={companies}
            selectedCompanyId={selectedCompanyId}
            onSelectCompany={(id) => setSelectedCompanyId(id)}
            onAddCompany={handleAddCompany}
            currentRole={currentRole}
            onSelectRole={(r) => {
              setCurrentRole(r);
              if (r === 'employee') setCurrentView('ess');
            }}
            activeTab={activeTab}
            onSelectTab={(t) => setActiveTab(t)}
            onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
            onReturnToPublic={() => setCurrentView('public')}
          />

          {/* Main Dashboard Viewport */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/60">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'overview' && (
                <ExecutiveDashboard
                  companies={companies}
                  selectedCompany={selectedCompany}
                  employees={employees}
                  complianceEvents={complianceEvents}
                  disciplinaryCases={disciplinaryCases}
                  timeEntries={timeEntries}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
                />
              )}

              {activeTab === 'employees' && (
                <EmployeeModule
                  selectedCompany={selectedCompany}
                  employees={employees}
                  meetingRecords={meetingRecords}
                  bookings={bookings}
                  matrixAudits={matrixAudits}
                  diagnosticResults={diagnosticResults}
                  currentRole={currentRole}
                  superadminSettings={superadminSettings}
                  onAddEmployee={handleAddEmployee}
                  onUpdateEmployee={handleUpdateEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  onOpenAiAssistantWithContext={(empId, context) => {
                    handleOpenAiWithPrompt(context, 'draft_warning');
                  }}
                  onAddMeetingRecord={handleAddMeetingRecord}
                  onNavigateToAudits={() => setActiveTab('audits')}
                />
              )}

              {activeTab === 'calendar' && (
                <ConsultantCalendarModule
                  selectedCompany={selectedCompany}
                  employees={employees}
                  bookings={bookings}
                  blockedSlots={blockedSlots}
                  meetingRecords={meetingRecords}
                  currentRole={currentRole}
                  superadminSettings={superadminSettings}
                  onAddBooking={handleAddBooking}
                  onUpdateBookingStatus={handleUpdateBookingStatus}
                  onAddBlockedSlot={handleAddBlockedSlot}
                  onDeleteBlockedSlot={handleDeleteBlockedSlot}
                  onAddMeetingRecord={handleAddMeetingRecord}
                  onUpdateMeetingRecord={handleUpdateMeetingRecord}
                  onUpdatePermissionSettings={handleUpdatePermissionSettings}
                />
              )}

              {activeTab === 'audits' && (
                <MatrixAuditModule
                  selectedCompany={selectedCompany}
                  employees={employees}
                  matrixAudits={matrixAudits}
                  diagnosticResults={diagnosticResults}
                  currentRole={currentRole}
                  onAddMatrixAudit={handleAddMatrixAudit}
                  onAddDiagnosticTest={handleAddDiagnosticTest}
                  onOpenAiAssistantWithContext={(context: string) => {
                    handleOpenAiWithPrompt(context, 'policy_audit');
                  }}
                />
              )}

              {activeTab === 'compliance' && (
                <ComplianceModule
                  selectedCompany={selectedCompany}
                  complianceEvents={complianceEvents}
                  onToggleStatus={handleToggleCompliance}
                  onAddEvent={handleAddCompliance}
                />
              )}

              {activeTab === 'disciplinary' && (
                <LabourRelationsModule
                  selectedCompany={selectedCompany}
                  employees={employees}
                  disciplinaryCases={disciplinaryCases}
                  onAddCase={handleAddDisciplinaryCase}
                  onOpenAiAssistantWithPrompt={(prompt, mode) => {
                    handleOpenAiWithPrompt(prompt, mode);
                  }}
                />
              )}

              {activeTab === 'leave' && (
                <LeaveModule
                  selectedCompany={selectedCompany}
                  employees={employees}
                  leaveRequests={leaveRequests}
                  onAddLeaveRequest={handleAddLeave}
                  onUpdateLeaveStatus={handleUpdateLeaveStatus}
                />
              )}

              {activeTab === 'billing' && (
                <BillingModule
                  selectedCompany={selectedCompany}
                  timeEntries={timeEntries}
                  invoices={invoices}
                  onAddTimeEntry={handleAddTimeEntry}
                  onGenerateInvoice={handleGenerateInvoice}
                />
              )}

              {activeTab === 'vault' && (
                <DocumentVaultModule
                  selectedCompany={selectedCompany}
                  employees={employees}
                  documents={documents}
                  onUploadDocument={handleUploadDocument}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {/* Hive AI Assistant Drawer */}
      <HiveAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        selectedCompany={selectedCompany}
        companies={companies}
        onSelectCompany={(id) => setSelectedCompanyId(id)}
        employees={employees}
        initialPrompt={aiInitialPrompt}
        initialMode={aiInitialMode}
      />
    </div>
  );
}
