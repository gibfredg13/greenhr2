import React from 'react';
import {
  Building2,
  Users,
  CalendarCheck,
  Clock,
  Scale,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  FileText,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { Company, Employee, ComplianceEvent, DisciplinaryCase, TimeEntry } from '../../types';
import { DashboardTab } from '../layout/Sidebar';

interface ExecutiveDashboardProps {
  companies: Company[];
  selectedCompany: Company;
  employees: Employee[];
  complianceEvents: ComplianceEvent[];
  disciplinaryCases: DisciplinaryCase[];
  timeEntries: TimeEntry[];
  onNavigateTab: (tab: DashboardTab) => void;
  onOpenAiAssistant: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  companies,
  selectedCompany,
  employees,
  complianceEvents,
  disciplinaryCases,
  timeEntries,
  onNavigateTab,
  onOpenAiAssistant
}) => {
  // Calculations
  const totalEmployeesInClient = employees.filter(e => e.companyId === selectedCompany.id).length;
  const totalEmployeesAll = employees.length;
  const clientCompliance = complianceEvents.filter(c => c.companyId === selectedCompany.id);
  const actionRequiredEvents = clientCompliance.filter(c => c.status === 'Action Required' || c.status === 'Overdue');
  const openCases = disciplinaryCases.filter(c => c.companyId === selectedCompany.id && c.status !== 'Closed');
  const clientTimeEntries = timeEntries.filter(t => t.companyId === selectedCompany.id);
  const unbilledHours = clientTimeEntries.filter(t => !t.isBilled).reduce((sum, t) => sum + t.hours, 0);
  const unbilledRevenueZar = clientTimeEntries.filter(t => !t.isBilled).reduce((sum, t) => sum + (t.hours * t.rateZar), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Practice Context Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Client Workspace:</span>
            <span className="text-emerald-700 font-bold">{selectedCompany.name}</span>
            <span>&middot;</span>
            <span className="font-mono text-slate-600">{selectedCompany.registrationNumber}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            South African Practice Command Center
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time statutory compliance, labour relations, workforce roster, and consultant utilization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('billing')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
          >
            <Clock className="w-3.5 h-3.5" />
            Log Billable Time
          </button>
        </div>
      </div>

      {/* Dedicated Workspace Section for HR Consultant to Query Companies & Personnel */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/30 rounded-2xl p-4 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                Hive AI Consultant Intelligence Workspace
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                Consultant &amp; Superadmin
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Query multiple client companies, statutory compliance, contracts, and inspect personnel files with Gemini AI.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAiAssistant}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm shadow-emerald-400/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Query Companies &amp; Personnel with Hive AI
        </button>
      </div>

      {/* 6 Key Executive Metric Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Widget 1: Client Entities */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Client Entities</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {companies.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Active under contract
          </div>
        </div>

        {/* Widget 2: Staff Under Management */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Client Staff</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalEmployeesInClient}
          </div>
          <div className="text-[11px] text-slate-500">
            {totalEmployeesAll} across all clients
          </div>
        </div>

        {/* Widget 3: Compliance Risk Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Compliance Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {selectedCompany.complianceScore}%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            B-BBEE Level {selectedCompany.bbbeeLevel}
          </div>
        </div>

        {/* Widget 4: Pending Statutory Tasks */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Statutory Filings</span>
            <CalendarCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
            {actionRequiredEvents.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Requiring action
          </div>
        </div>

        {/* Widget 5: Open Labour Cases */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Labour Cases</span>
            <Scale className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {openCases.length}
          </div>
          <div className="text-[11px] text-slate-500">
            CCMA / internal inquiries
          </div>
        </div>

        {/* Widget 6: Unbilled Consultant Work */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Unbilled Work</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums truncate">
            R {(unbilledRevenueZar / 1000).toFixed(1)}k
          </div>
          <div className="text-[11px] text-slate-500 font-mono tabular-nums">
            {unbilledHours.toFixed(1)} hrs unbilled
          </div>
        </div>
      </div>

      {/* Main Grid: Compliance Alerts & Multi-Client Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Statutory Compliance Heatmap for Active Client */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Statutory Compliance Status — {selectedCompany.name}
              </h2>
              <p className="text-xs text-slate-500">
                Mandatory filings under South African Labour &amp; Revenue legislation
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('compliance')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View Calendar &rarr;
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {clientCompliance.map((ev) => {
              const isAction = ev.status === 'Action Required' || ev.status === 'Overdue';
              return (
                <div
                  key={ev.id}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                    isAction
                      ? 'bg-amber-50/70 border-amber-200 text-slate-900'
                      : 'bg-slate-50/70 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 font-mono">
                        {ev.statute}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{ev.description}</p>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-0.5">
                      <span>Due: <strong className="font-mono text-slate-700">{ev.dueDate}</strong></span>
                      <span>&middot;</span>
                      <span>Assigned: {ev.responsiblePerson}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 ${
                      ev.status === 'Compliant'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Multi-Company Practice Overview */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                All Client Portfolios
              </h2>
              <p className="text-xs text-slate-500">
                Multi-tenant health scores and billing models
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {companies.length} Clients
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {companies.map((comp) => {
              const isSelected = comp.id === selectedCompany.id;
              return (
                <div
                  key={comp.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-sm ring-1 ring-emerald-500/30'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">{comp.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{comp.industry}</span>
                      <span>&middot;</span>
                      <span className="font-mono">{comp.employeeCount} staff</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold font-mono text-emerald-700">
                      {comp.complianceScore}%
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      R {comp.monthlyRetainerZar.toLocaleString()}/mo
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Disciplinary / Case Alert */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-2 font-semibold">
              <span>Active Labour Relations Inquiries</span>
              <button
                onClick={() => onNavigateTab('disciplinary')}
                className="text-emerald-600 hover:text-emerald-700 font-bold"
              >
                CCMA Toolkit &rarr;
              </button>
            </div>

            {openCases.length > 0 ? (
              <div className="space-y-2">
                {openCases.slice(0, 2).map(c => (
                  <div key={c.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">{c.employeeName}</span>
                      <span className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded text-[10px] font-mono">{c.stage}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{c.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
                No open labour disputes for this client entity.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
