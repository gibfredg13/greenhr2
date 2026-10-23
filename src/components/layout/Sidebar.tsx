import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Scale,
  CalendarDays,
  Clock,
  FolderLock,
  UserCheck,
  Sparkles,
  Hexagon,
  Building2,
  ChevronRight,
  Calendar,
  Target
} from 'lucide-react';
import { Company, UserRole } from '../../types';
import { CompanySwitcher } from './CompanySwitcher';
import { RoleSelector } from './RoleSelector';

export type DashboardTab =
  | 'overview'
  | 'employees'
  | 'calendar'
  | 'audits'
  | 'compliance'
  | 'disciplinary'
  | 'leave'
  | 'billing'
  | 'vault';

interface SidebarProps {
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  onAddCompany: (company: Partial<Company>) => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenAiAssistant: () => void;
  onReturnToPublic: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  onAddCompany,
  currentRole,
  onSelectRole,
  activeTab,
  onSelectTab,
  onOpenAiAssistant,
  onReturnToPublic
}) => {
  const navItems: { id: DashboardTab; label: string; icon: any; count?: number; badge?: string }[] = [
    { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Hub', icon: Users },
    { id: 'calendar', label: '1-on-1 Sessions Calendar', icon: Calendar, badge: 'Bookings' },
    { id: 'audits', label: 'Matrix Audits & Diagnostics', icon: Target, badge: 'Frameworks' },
    { id: 'compliance', label: 'Statutory Compliance', icon: CalendarCheck, badge: 'SA Law' },
    { id: 'disciplinary', label: 'CCMA & Labour Relations', icon: Scale },
    { id: 'leave', label: 'BCEA Leave Manager', icon: CalendarDays },
    { id: 'billing', label: 'Time Tracking & Billing', icon: Clock },
    { id: 'vault', label: 'Document Vault & Audit', icon: FolderLock }
  ];

  return (
    <aside className="w-72 bg-slate-950 text-slate-300 flex flex-col h-screen border-r border-slate-900 shrink-0 select-none">
      {/* Top Brand Header */}
      <div className="p-4 border-b border-slate-900 flex items-center justify-between">
        <button
          onClick={onReturnToPublic}
          className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
            <Hexagon className="w-5 h-5 text-emerald-100 fill-emerald-500/30" />
            <span className="absolute font-bold text-xs">G</span>
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-1">
              GreenHive<span className="text-emerald-500">HR</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Multi-Tenant Practice Hub
            </div>
          </div>
        </button>

        <button
          onClick={onReturnToPublic}
          className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 transition-colors"
          title="Back to Public Marketing Website"
        >
          Website
        </button>
      </div>

      {/* Switchers Section */}
      <div className="p-3 space-y-2.5 border-b border-slate-900">
        <CompanySwitcher
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          onSelectCompany={onSelectCompany}
          onAddCompany={onAddCompany}
        />

        <RoleSelector
          currentRole={currentRole}
          onSelectRole={onSelectRole}
        />
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-emerald-400'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Hive Assistant for HR Consultants to query companies & personnel */}
      {(currentRole === 'consultant' || currentRole === 'super_admin') && (
        <div className="p-3 border-t border-slate-900">
          <button
            onClick={onOpenAiAssistant}
            className="w-full p-3 rounded-xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400 transition-all text-left group shadow-lg"
            title="Launch Hive AI to query client companies, compliance and personnel records"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Hive AI Consultant Hub
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Query client companies, BCEA compliance &amp; personnel records.
            </p>
          </button>
        </div>
      )}
    </aside>
  );
};
