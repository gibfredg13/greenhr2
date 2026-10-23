/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Company, Employee, ComplianceEvent, DisciplinaryCase, LeaveRequest, TimeEntry, Invoice, EmployeeDocument, UserRole } from './types';
import { api } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, DashboardTab } from './components/layout/Sidebar';
import { PublicWebsite } from './components/public/PublicWebsite';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { EmployeeModule } from './components/dashboard/EmployeeModule';
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
  INITIAL_DOCUMENTS
} from './data/seedData';

export default function App() {
  // Navigation view: start on 'public' as confirmed by user in Phase 1
  const [currentView, setCurrentView] = useState<'public' | 'dashboard'>('public');
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

  // AI Assistant Drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [aiInitialMode, setAiInitialMode] = useState<'legal_advice' | 'draft_warning' | 'generate_contract' | 'policy_audit'>('legal_advice');

  // Fetch from server on boot
  useEffect(() => {
    async function loadData() {
      try {
        const [cList, eList, compList, discList, lList, bData, dList] = await Promise.all([
          api.getCompanies(),
          api.getEmployees(),
          api.getComplianceEvents(),
          api.getDisciplinaryCases(),
          api.getLeaveRequests(),
          api.getBillingData(),
          api.getDocuments()
        ]);
        if (cList?.length) setCompanies(cList);
        if (eList?.length) setEmployees(eList);
        if (compList?.length) setComplianceEvents(compList);
        if (discList?.length) setDisciplinaryCases(discList);
        if (lList?.length) setLeaveRequests(lList);
        if (bData?.timeEntries) setTimeEntries(bData.timeEntries);
        if (bData?.invoices) setInvoices(bData.invoices);
        if (dList?.length) setDocuments(dList);
      } catch (err) {
        console.warn('Backend loading completed with seed data fallback:', err);
      }
    }
    loadData();
  }, []);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

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
      {currentView === 'public' ? (
        <PublicWebsite
          onLaunchWorkspace={() => setCurrentView('dashboard')}
          onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        />
      ) : (
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
              if (r === 'employee') setActiveTab('ess');
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
                  onAddEmployee={handleAddEmployee}
                  onUpdateEmployee={handleUpdateEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  onOpenAiAssistantWithContext={(empId, context) => {
                    handleOpenAiWithPrompt(context, 'draft_warning');
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

              {activeTab === 'ess' && (
                <EmployeeSelfService
                  selectedCompany={selectedCompany}
                  employees={employees}
                  leaveRequests={leaveRequests}
                  documents={documents}
                  onApplyLeave={handleAddLeave}
                  onUpdateEmployee={handleUpdateEmployee}
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
        employees={employees}
        initialPrompt={aiInitialPrompt}
        initialMode={aiInitialMode}
      />
    </div>
  );
}
