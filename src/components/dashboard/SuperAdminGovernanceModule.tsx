import React, { useState } from 'react';
import {
  Company,
  Employee,
  PortalUserAccount,
  EmployeePortalFeatureFlags,
  CompanyPropertyAssignment,
  EmployeeKpiItem,
  EmployeeOnboardingTask,
  OrgChartNode
} from '../../types';
import {
  ShieldCheck,
  KeyRound,
  UserPlus,
  ToggleLeft,
  ToggleRight,
  Laptop,
  FileLock2,
  GitBranch,
  Target,
  ClipboardCheck,
  Plus,
  CheckCircle2,
  Lock,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  Tag,
  CalendarClock,
  Shield,
  Users,
  X
} from 'lucide-react';

interface SuperAdminGovernanceModuleProps {
  selectedCompany: Company;
  employees: Employee[];
  portalUsers: PortalUserAccount[];
  companyProperties: CompanyPropertyAssignment[];
  employeeKpis: EmployeeKpiItem[];
  onboardingTasks: EmployeeOnboardingTask[];
  orgChartNodes: OrgChartNode[];
  onAddPortalUser: (user: Partial<PortalUserAccount>) => Promise<void>;
  onUpdatePortalUser: (id: string, data: Partial<PortalUserAccount>) => Promise<void>;
  onAddCompanyProperty: (prop: Partial<CompanyPropertyAssignment>) => Promise<void>;
  onAddEmployeeKpi: (kpi: Partial<EmployeeKpiItem>) => Promise<void>;
  onAddOnboardingTask: (task: Partial<EmployeeOnboardingTask>) => Promise<void>;
  onAddOrgChartNode: (node: Partial<OrgChartNode>) => Promise<void>;
  onUpdateOrgChartNode: (id: string, data: Partial<OrgChartNode>) => Promise<void>;
  onDeleteOrgChartNode: (id: string) => Promise<void>;
}

export const SuperAdminGovernanceModule: React.FC<SuperAdminGovernanceModuleProps> = ({
  selectedCompany,
  employees,
  portalUsers,
  companyProperties,
  employeeKpis,
  onboardingTasks,
  orgChartNodes,
  onAddPortalUser,
  onUpdatePortalUser,
  onAddCompanyProperty,
  onAddEmployeeKpi,
  onAddOnboardingTask,
  onAddOrgChartNode,
  onUpdateOrgChartNode,
  onDeleteOrgChartNode
}) => {
  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);
  const companyPortalUsers = portalUsers.filter(u => u.companyId === selectedCompany.id);
  const companyProps = companyProperties.filter(p => p.companyId === selectedCompany.id);
  const companyKpis = employeeKpis.filter(k => k.companyId === selectedCompany.id);
  const companyOnboarding = onboardingTasks.filter(t => t.companyId === selectedCompany.id);
  const companyOrgNodes = orgChartNodes.filter(n => n.companyId === selectedCompany.id);

  const [activeSubTab, setActiveSubTab] = useState<'users_extras' | 'company_property' | 'org_chart' | 'kpi_onboarding_admin'>('users_extras');
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackBanner(msg);
    setTimeout(() => setFeedbackBanner(null), 3500);
  };

  // ---------------- 1. PORTAL USERS, PASSWORDS & CLICK ON/OFF EXTRAS STATE ---------------- //
  const [newUserEmpId, setNewUserEmpId] = useState<string>(companyEmployees[0]?.id || '');
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('GreenHive#2026!');
  const [passwordEditMap, setPasswordEditMap] = useState<Record<string, string>>({});

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(x => x.id === newUserEmpId) || companyEmployees[0];
    if (!emp) return;

    await onAddPortalUser({
      companyId: selectedCompany.id,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      usernameOrEmail: newUsername.trim() || emp.email,
      portalPassword: newPassword.trim() || 'GreenHive#2026!',
      accountStatus: 'Active',
      optionalExtras: {
        enableKpi: true,
        enableOnboarding: true,
        enableMatrixEvaluation: true,
        enableCompanyProperty: true,
        enableOrgChart: true,
        enableOneOnOneBooking: true,
        enableLeaveApplication: true
      }
    });

    setNewUsername('');
    showToast(`Portal user assigned to ${emp.firstName} ${emp.lastName} with full optional extras enabled.`);
  };

  const handleChangePassword = async (user: PortalUserAccount) => {
    const updatedPass = passwordEditMap[user.id];
    if (!updatedPass || !updatedPass.trim()) return;
    await onUpdatePortalUser(user.id, {
      portalPassword: updatedPass.trim(),
      lastPasswordReset: new Date().toISOString().split('T')[0]
    });
    setPasswordEditMap(prev => ({ ...prev, [user.id]: '' }));
    showToast(`Portal password updated for ${user.employeeName}.`);
  };

  const handleToggleExtra = async (user: PortalUserAccount, key: keyof EmployeePortalFeatureFlags) => {
    const updatedExtras: EmployeePortalFeatureFlags = {
      ...user.optionalExtras,
      [key]: !user.optionalExtras[key]
    };
    await onUpdatePortalUser(user.id, { optionalExtras: updatedExtras });
    showToast(`${key.replace('enable', '')} toggled ${updatedExtras[key] ? 'ON' : 'OFF'} for ${user.employeeName}.`);
  };

  // ---------------- 2. COMPANY PROPERTY ASSIGNMENT STATE ---------------- //
  const [propForm, setPropForm] = useState({
    employeeId: companyEmployees[0]?.id || '',
    itemName: 'MacBook Pro 16" M3 Pro & Encrypted Biometric Security Key',
    category: 'Laptop / IT Hardware' as CompanyPropertyAssignment['category'],
    assetTag: `GH-ASSET-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    insurancePolicyAndCoverage: 'Santam Commercial All-Risk Policy #SNT-884920 (Accidental & Transit Cover)',
    insuredValueZar: 42500,
    lengthOfUse: '24 Months (2026-10-23 to 2028-10-23 / Duration of Employment)',
    assignedDate: new Date().toISOString().split('T')[0],
    returnDueDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    agreementTitle: 'BCEA Section 34 Company Property & Asset Custody Agreement',
    agreementText: `COMPANY PROPERTY CUSTODY & RESPONSIBILITY AGREEMENT (READ-ONLY EMPLOYEE RECORD)

1. ASSET PARTICULARS & CUSTODIAN:
This asset is issued by the Employer for official business operations. The assigned employee is the sole custodian of the item bearing the official Asset Tag and Insurance Policy listed above.

2. LENGTH OF USE & RETURN OBLIGATION:
The property is assigned for the specified Length of Use or until termination of employment, whichever occurs first. Upon request or exit clearance, the asset must be returned in good working condition (fair wear and tear excepted).

3. INSURANCE & SAPS REPORTING REQUIREMENT:
The asset is covered under the Employer's commercial all-risk insurance policy. Any theft, hijacking, or loss must be reported to the South African Police Service (SAPS) within 24 hours with a valid CAS number provided to HR.

4. BCEA SECTION 34 DEDUCTION CLAUSE:
In accordance with Section 34 of the Basic Conditions of Employment Act 75 of 1997, reimbursement for damage or loss arising from gross negligence may only follow a fair disciplinary/damage inquiry and shall not exceed 25% of net remuneration.

[LOCKED DOCUMENT — VIEWABLE TO ASSIGNED EMPLOYEE ONLY — NON-EDITABLE BY EMPLOYEE]`
  });
  const [viewingPropertyDoc, setViewingPropertyDoc] = useState<CompanyPropertyAssignment | null>(null);

  const handleAssignProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(x => x.id === propForm.employeeId) || companyEmployees[0];
    if (!emp) return;

    await onAddCompanyProperty({
      companyId: selectedCompany.id,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      itemName: propForm.itemName,
      category: propForm.category,
      assetTag: propForm.assetTag,
      insurancePolicyAndCoverage: propForm.insurancePolicyAndCoverage,
      insuredValueZar: Number(propForm.insuredValueZar),
      lengthOfUse: propForm.lengthOfUse,
      assignedDate: propForm.assignedDate,
      returnDueDate: propForm.returnDueDate,
      agreementTitle: propForm.agreementTitle,
      agreementText: propForm.agreementText,
      assignedByAdmin: 'Super Admin (GreenHive HRaaS)'
    });

    setPropForm(prev => ({
      ...prev,
      assetTag: `GH-ASSET-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    }));
    showToast(`Company property (${propForm.assetTag}) assigned to ${emp.firstName} ${emp.lastName} as a read-only employee document.`);
  };

  // ---------------- 3. HIERARCHICAL ORG CHART BUILDER STATE ---------------- //
  const [orgForm, setOrgForm] = useState({
    employeeId: '',
    name: '',
    jobTitle: '',
    department: 'Fleet Operations',
    tierLevel: 3 as 1 | 2 | 3 | 4,
    reportsToNodeId: companyOrgNodes[0]?.id || '',
    location: selectedCompany.city
  });
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editNodeTitle, setEditNodeTitle] = useState('');
  const [editNodeDept, setEditNodeDept] = useState('');
  const [editNodeReportsTo, setEditNodeReportsTo] = useState<string>('');

  const handleAddOrgNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.name.trim() || !orgForm.jobTitle.trim()) return;
    await onAddOrgChartNode({
      companyId: selectedCompany.id,
      employeeId: orgForm.employeeId || undefined,
      name: orgForm.name.trim(),
      jobTitle: orgForm.jobTitle.trim(),
      department: orgForm.department.trim(),
      tierLevel: orgForm.tierLevel,
      reportsToNodeId: orgForm.tierLevel === 1 ? null : (orgForm.reportsToNodeId || null),
      location: orgForm.location.trim() || selectedCompany.city
    });
    setOrgForm(prev => ({ ...prev, name: '', jobTitle: '' }));
    showToast('New position node added to the company Hierarchical Chart.');
  };

  const handleSaveOrgNodeEdit = async (nodeId: string) => {
    await onUpdateOrgChartNode(nodeId, {
      jobTitle: editNodeTitle,
      department: editNodeDept,
      reportsToNodeId: editNodeReportsTo || null
    });
    setEditingNodeId(null);
    showToast('Hierarchical chart node updated. Changes are now live in read-only mode for employees.');
  };

  // ---------------- 4. ASSIGN KPI & ONBOARDING ITEMS STATE ---------------- //
  const [kpiForm, setKpiForm] = useState({
    employeeId: companyEmployees[0]?.id || '',
    period: '2026 Q4 Performance Cycle',
    kpiTitle: '',
    targetMetric: '',
    weightPercent: 25
  });

  const [onbForm, setOnbForm] = useState({
    employeeId: companyEmployees[0]?.id || '',
    stepCategory: 'Statutory & POPIA' as EmployeeOnboardingTask['stepCategory'],
    title: '',
    instructions: '',
    requiresAnswer: true
  });

  const handleAssignKpi = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(x => x.id === kpiForm.employeeId) || companyEmployees[0];
    if (!emp || !kpiForm.kpiTitle.trim()) return;
    await onAddEmployeeKpi({
      companyId: selectedCompany.id,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      period: kpiForm.period,
      kpiTitle: kpiForm.kpiTitle.trim(),
      targetMetric: kpiForm.targetMetric.trim(),
      weightPercent: Number(kpiForm.weightPercent),
      employeeSelfRating: 4,
      employeeAnswerAndEvidence: '',
      status: 'Pending Employee Input'
    });
    setKpiForm(prev => ({ ...prev, kpiTitle: '', targetMetric: '' }));
    showToast(`KPI assigned to ${emp.firstName} ${emp.lastName} for employee self-evaluation.`);
  };

  const handleAssignOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(x => x.id === onbForm.employeeId) || companyEmployees[0];
    if (!emp || !onbForm.title.trim()) return;
    await onAddOnboardingTask({
      companyId: selectedCompany.id,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      stepCategory: onbForm.stepCategory,
      title: onbForm.title.trim(),
      instructions: onbForm.instructions.trim(),
      requiresAnswer: onbForm.requiresAnswer
    });
    setOnbForm(prev => ({ ...prev, title: '', instructions: '' }));
    showToast(`Onboarding task assigned to ${emp.firstName} ${emp.lastName}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Admin Governance &amp; Employee Portal Configuration
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Super Admin Control Center &mdash; {selectedCompany.name}
          </h1>
          <p className="text-xs text-slate-300">
            Assign portal users, reset passwords, click ON/OFF optional employee extras, issue read-only Company Property agreements, and edit the company Hierarchical Org Chart.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center shrink-0">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2">
            <div className="text-lg font-extrabold text-emerald-400 font-mono">{companyPortalUsers.length}</div>
            <div className="text-[10px] text-slate-400">Assigned Users</div>
          </div>
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2">
            <div className="text-lg font-extrabold text-amber-400 font-mono">{companyProps.length}</div>
            <div className="text-[10px] text-slate-400">Assigned Assets</div>
          </div>
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2">
            <div className="text-lg font-extrabold text-sky-400 font-mono">{companyOrgNodes.length}</div>
            <div className="text-[10px] text-slate-400">Org Chart Nodes</div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-900 text-white border border-emerald-500/50 flex items-center justify-between text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
          <button onClick={() => setFeedbackBanner(null)} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'users_extras', label: 'Portal Users, Passwords & Click On/Off Extras', icon: KeyRound },
          { id: 'company_property', label: 'Company Property & Asset Agreements', icon: Laptop },
          { id: 'org_chart', label: 'Editable Hierarchical Org Chart', icon: GitBranch },
          { id: 'kpi_onboarding_admin', label: 'Assign KPIs & Onboarding Tasks', icon: Target }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: PORTAL USERS, PASSWORDS & CLICK ON/OFF OPTIONAL EXTRAS */}
      {activeSubTab === 'users_extras' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Add / Assign Portal User */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Employee Portal User</h3>
                <p className="text-xs text-slate-500">Provision credentials &amp; default optional extras</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Employee *</label>
                <select
                  value={newUserEmpId}
                  onChange={e => {
                    setNewUserEmpId(e.target.value);
                    const found = companyEmployees.find(x => x.id === e.target.value);
                    if (found) setNewUsername(found.email);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {companyEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Portal Username / Login Email *</label>
                <input
                  type="text"
                  placeholder="e.g. sipho.d@capelogistics.co.za"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Portal Password *</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Assign User to Employee Portal
              </button>
            </form>
          </div>

          {/* Right List: Assigned Users, Password Reset & Click ON/OFF Optional Extras */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Assigned Portal Users &amp; Click On/Off Optional Extras
                </h3>
                <p className="text-xs text-slate-500">
                  Click any optional extra switch ON or OFF to immediately control what each employee sees in their Employee Self-Service (ESS) Portal.
                </p>
              </div>

              <div className="space-y-4">
                {companyPortalUsers.map(u => {
                  const toggleItems: { key: keyof EmployeePortalFeatureFlags; label: string }[] = [
                    { key: 'enableKpi', label: 'KPI Self-Evaluation' },
                    { key: 'enableOnboarding', label: 'Onboarding Checklist' },
                    { key: 'enableMatrixEvaluation', label: 'Matrix & Grid Evaluations' },
                    { key: 'enableCompanyProperty', label: 'Company Property (View-Only)' },
                    { key: 'enableOrgChart', label: 'Hierarchical Org Chart' },
                    { key: 'enableOneOnOneBooking', label: '1-on-1 Consultant Booking' },
                    { key: 'enableLeaveApplication', label: 'BCEA Leave Application' }
                  ];

                  return (
                    <div key={u.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{u.employeeName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {u.accountStatus}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            Login: {u.usernameOrEmail} &middot; Current Password: <strong className="text-slate-800">{u.portalPassword}</strong> (Reset: {u.lastPasswordReset})
                          </div>
                        </div>

                        {/* Change Password Inline Control */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="New portal password..."
                            value={passwordEditMap[u.id] || ''}
                            onChange={e => setPasswordEditMap(prev => ({ ...prev, [u.id]: e.target.value }))}
                            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono w-40"
                          />
                          <button
                            type="button"
                            onClick={() => handleChangePassword(u)}
                            className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1 shrink-0"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Change Password
                          </button>
                        </div>
                      </div>

                      {/* Click ON / OFF Optional Extras Grid */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Click On / Off Optional Portal Extras for {u.employeeName}:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {toggleItems.map(item => {
                            const isOn = u.optionalExtras[item.key];
                            return (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => handleToggleExtra(u, item.key)}
                                className={`px-3 py-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                                  isOn
                                    ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 shadow-2xs'
                                    : 'bg-white border-slate-200 text-slate-400'
                                }`}
                              >
                                <span className="truncate pr-2">{item.label}</span>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  isOn ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {isOn ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                                  {isOn ? 'ON' : 'OFF'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COMPANY PROPERTY ASSIGNED TO EMPLOYEE (READ-ONLY FOR EMPLOYEE) */}
      {activeSubTab === 'company_property' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Assign Company Property */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Assign Company Property to Employee
                </h3>
                <p className="text-xs text-slate-500">
                  Includes Agreement, Length of Use &amp; Insurance Asset Tag
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                Employee Read-Only
              </span>
            </div>

            <form onSubmit={handleAssignProperty} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Employee *</label>
                <select
                  value={propForm.employeeId}
                  onChange={e => setPropForm({ ...propForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {companyEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Category *</label>
                  <select
                    value={propForm.category}
                    onChange={e => setPropForm({ ...propForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option>Laptop / IT Hardware</option>
                    <option>Company Vehicle</option>
                    <option>Mobile Device / SIM</option>
                    <option>Tools &amp; Machinery</option>
                    <option>Access &amp; Security Card</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Insurance Asset Tag *</label>
                  <input
                    type="text"
                    required
                    value={propForm.assetTag}
                    onChange={e => setPropForm({ ...propForm, assetTag: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property / Asset Description *</label>
                <input
                  type="text"
                  required
                  value={propForm.itemName}
                  onChange={e => setPropForm({ ...propForm, itemName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Length of Use *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24 Months / Duration of Role"
                    value={propForm.lengthOfUse}
                    onChange={e => setPropForm({ ...propForm, lengthOfUse: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Insured Value (ZAR) *</label>
                  <input
                    type="number"
                    required
                    value={propForm.insuredValueZar}
                    onChange={e => setPropForm({ ...propForm, insuredValueZar: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Insurance Policy &amp; Coverage Details *</label>
                <input
                  type="text"
                  required
                  value={propForm.insurancePolicyAndCoverage}
                  onChange={e => setPropForm({ ...propForm, insurancePolicyAndCoverage: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Property Custody Agreement (Viewable to Employee Only &mdash; Non-Editable by Employee) *
                </label>
                <textarea
                  rows={5}
                  required
                  value={propForm.agreementText}
                  onChange={e => setPropForm({ ...propForm, agreementText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <FileLock2 className="w-4 h-4" />
                Assign Property &amp; Lock Employee Agreement
              </button>
            </form>
          </div>

          {/* Right List: Assigned Company Property Registry */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Assigned Company Property Registry ({companyProps.length})
              </h3>
              <p className="text-xs text-slate-500">
                Each agreement below is strictly isolated to the assigned employee in read-only mode (cannot be edited by the employee).
              </p>
            </div>

            <div className="space-y-3">
              {companyProps.map(prop => (
                <div key={prop.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono">
                          {prop.assetTag}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{prop.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{prop.itemName}</h4>
                      <div className="text-xs text-slate-600">
                        Assigned to: <strong className="text-slate-900">{prop.employeeName}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prop.acknowledgedByEmployee
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {prop.acknowledgedByEmployee ? `Receipt Acknowledged (${prop.acknowledgedAt})` : 'Awaiting Employee Receipt Sign-Off'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewingPropertyDoc(prop)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        Inspect Agreement
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span><strong>Length of Use:</strong> {prop.lengthOfUse}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span><strong>Insured Value:</strong> R{prop.insuredValueZar.toLocaleString()} ({prop.insurancePolicyAndCoverage})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: EDITABLE HIERARCHICAL ORG CHART (ADMIN EDITABLE, EMPLOYEE READ-ONLY) */}
      {activeSubTab === 'org_chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Add Position Node to Hierarchy */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 mb-1">
                Admin Hierarchy Builder
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Add Position to Hierarchical Chart
              </h3>
              <p className="text-xs text-slate-500">
                Editable by Admin here; rendered strictly as a read-only visual hierarchy chart inside the Employee Portal.
              </p>
            </div>

            <form onSubmit={handleAddOrgNode} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Link to Existing Employee (Optional)</label>
                <select
                  value={orgForm.employeeId}
                  onChange={e => {
                    const emp = companyEmployees.find(x => x.id === e.target.value);
                    setOrgForm({
                      ...orgForm,
                      employeeId: e.target.value,
                      name: emp ? `${emp.firstName} ${emp.lastName}` : orgForm.name,
                      jobTitle: emp ? emp.jobTitle : orgForm.jobTitle,
                      department: emp ? emp.department : orgForm.department
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="">-- Custom / Executive Role --</option>
                  {companyEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Person Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zanele Mokoena"
                  value={orgForm.name}
                  onChange={e => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Regional Operations Manager"
                  value={orgForm.jobTitle}
                  onChange={e => setOrgForm({ ...orgForm, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hierarchy Tier *</label>
                  <select
                    value={orgForm.tierLevel}
                    onChange={e => setOrgForm({ ...orgForm, tierLevel: Number(e.target.value) as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value={1}>Tier 1: Executive / CEO</option>
                    <option value={2}>Tier 2: Director / GM / HRaaS</option>
                    <option value={3}>Tier 3: Line Manager / Specialist</option>
                    <option value={4}>Tier 4: Operational Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={orgForm.department}
                    onChange={e => setOrgForm({ ...orgForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {orgForm.tierLevel > 1 && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reports To (Manager Node)</label>
                  <select
                    value={orgForm.reportsToNodeId}
                    onChange={e => setOrgForm({ ...orgForm, reportsToNodeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="">-- Top Level (No Direct Manager) --</option>
                    {companyOrgNodes.map(n => (
                      <option key={n.id} value={n.id}>
                        {n.name} &mdash; {n.jobTitle} (Tier {n.tierLevel})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Node to Company Hierarchy
              </button>
            </form>
          </div>

          {/* Right Column: Interactive Visual Hierarchy Tree (Editable by Admin) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedCompany.name} &mdash; Interactive Hierarchical Chart (Admin Editor)
                </h3>
                <p className="text-xs text-slate-500">
                  Click <strong>Edit</strong> on any position card to adjust title, department, or reporting line. Employees view this chart in locked Read-Only mode.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 text-emerald-400 text-[11px] font-mono font-bold">
                Admin Edit Mode Active
              </span>
            </div>

            {[1, 2, 3, 4].map(tier => {
              const tierNodes = companyOrgNodes.filter(n => n.tierLevel === tier);
              if (tierNodes.length === 0) return null;
              const tierLabels: Record<number, string> = {
                1: 'Tier 1 — Executive Leadership & Board',
                2: 'Tier 2 — General Management & Embedded GreenHive HRaaS Partner',
                3: 'Tier 3 — Departmental Controllers, Line Managers & Specialists',
                4: 'Tier 4 — Operational Workforce & Field Specialists'
              };

              return (
                <div key={tier} className="space-y-3 relative">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {tierLabels[tier]}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-emerald-500/40">
                    {tierNodes.map(node => {
                      const managerNode = companyOrgNodes.find(m => m.id === node.reportsToNodeId);
                      const isEditing = editingNodeId === node.id;

                      return (
                        <div
                          key={node.id}
                          className={`p-4 rounded-xl border transition-all ${
                            tier === 1
                              ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        >
                          {isEditing ? (
                            <div className="space-y-2.5 text-xs text-slate-900 bg-white p-3 rounded-lg border border-emerald-300">
                              <div className="font-bold text-emerald-800">Editing: {node.name}</div>
                              <input
                                type="text"
                                value={editNodeTitle}
                                onChange={e => setEditNodeTitle(e.target.value)}
                                placeholder="Job Title"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                              />
                              <input
                                type="text"
                                value={editNodeDept}
                                onChange={e => setEditNodeDept(e.target.value)}
                                placeholder="Department"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                              />
                              <select
                                value={editNodeReportsTo}
                                onChange={e => setEditNodeReportsTo(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                              >
                                <option value="">No Direct Manager (Root)</option>
                                {companyOrgNodes
                                  .filter(m => m.id !== node.id)
                                  .map(m => (
                                    <option key={m.id} value={m.id}>
                                      Reports to: {m.name} ({m.jobTitle})
                                    </option>
                                  ))}
                              </select>
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingNodeId(null)}
                                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveOrgNodeEdit(node.id)}
                                  className="px-3 py-1 bg-emerald-600 text-white font-bold rounded text-xs"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-sm font-bold">{node.name}</div>
                                <div className={`text-xs font-semibold ${tier === 1 ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                  {node.jobTitle}
                                </div>
                                <div className={`text-[11px] mt-1 ${tier === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
                                  Dept: {node.department} &middot; {node.location}
                                </div>
                                {managerNode && (
                                  <div className={`text-[11px] mt-1 font-mono ${tier === 1 ? 'text-slate-400' : 'text-slate-600'}`}>
                                    &uarr; Reports to: <strong>{managerNode.name}</strong>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingNodeId(node.id);
                                    setEditNodeTitle(node.jobTitle);
                                    setEditNodeDept(node.department);
                                    setEditNodeReportsTo(node.reportsToNodeId || '');
                                  }}
                                  className={`p-1.5 rounded-lg border text-xs ${
                                    tier === 1
                                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                                      : 'border-slate-200 text-slate-600 hover:bg-white'
                                  }`}
                                  title="Edit Position Node"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteOrgChartNode(node.id)}
                                  className={`p-1.5 rounded-lg border text-xs ${
                                    tier === 1
                                      ? 'border-slate-700 text-red-400 hover:bg-slate-800'
                                      : 'border-slate-200 text-red-600 hover:bg-white'
                                  }`}
                                  title="Remove Node"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ASSIGN EMPLOYEE KPIs & ONBOARDING TASKS */}
      {activeSubTab === 'kpi_onboarding_admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assign KPI Goal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Employee KPI Objective</h3>
                <p className="text-xs text-slate-500">Employees answer &amp; submit self-ratings in the ESS Portal</p>
              </div>
            </div>

            <form onSubmit={handleAssignKpi} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee *</label>
                  <select
                    value={kpiForm.employeeId}
                    onChange={e => setKpiForm({ ...kpiForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    {companyEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Review Cycle &amp; Weight % *</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={kpiForm.weightPercent}
                    onChange={e => setKpiForm({ ...kpiForm, weightPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">KPI Objective Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zero COIDA Workplace Safety Incidents & Monthly Toolbox Talks"
                  value={kpiForm.kpiTitle}
                  onChange={e => setKpiForm({ ...kpiForm, kpiTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Measurable Target Metric *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% OHSA checklist completion & 0 lost-time injuries"
                  value={kpiForm.targetMetric}
                  onChange={e => setKpiForm({ ...kpiForm, targetMetric: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                + Assign KPI to Employee Portal
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700">Active Assigned KPIs ({companyKpis.length})</div>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {companyKpis.map(k => (
                  <div key={k.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{k.employeeName} ({k.weightPercent}%)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{k.status}</span>
                    </div>
                    <div className="text-slate-700 mt-0.5">{k.kpiTitle}</div>
                    {k.employeeAnswerAndEvidence && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded mt-1.5">
                        <strong>Employee Answer (Self-Rating {k.employeeSelfRating}/5):</strong> "{k.employeeAnswerAndEvidence}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assign Onboarding Question / Task */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Employee Onboarding Task</h3>
                <p className="text-xs text-slate-500">Employees complete &amp; answer onboarding steps in the ESS Portal</p>
              </div>
            </div>

            <form onSubmit={handleAssignOnboarding} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee *</label>
                  <select
                    value={onbForm.employeeId}
                    onChange={e => setOnbForm({ ...onbForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    {companyEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Onboarding Category *</label>
                  <select
                    value={onbForm.stepCategory}
                    onChange={e => setOnbForm({ ...onbForm, stepCategory: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option>Statutory &amp; POPIA</option>
                    <option>Contract &amp; Policies</option>
                    <option>Role &amp; Safety Induction</option>
                    <option>IT &amp; Systems</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Onboarding Step Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SARS Tax Number & Medical Aid Beneficiary Confirmation"
                  value={onbForm.title}
                  onChange={e => setOnbForm({ ...onbForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question / Instructions for Employee *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain what the employee needs to answer or confirm..."
                  value={onbForm.instructions}
                  onChange={e => setOnbForm({ ...onbForm, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
              >
                + Assign Onboarding Step to Employee
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700">Assigned Onboarding Steps ({companyOnboarding.length})</div>
              <div className="max-h-56 overflow-y-auto space-y-2">
                {companyOnboarding.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{t.employeeName} &mdash; {t.stepCategory}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${t.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {t.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-slate-700 mt-0.5">{t.title}</div>
                    {t.employeeAnswer && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded mt-1.5">
                        <strong>Employee Response:</strong> "{t.employeeAnswer}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Inspect Read-Only Property Agreement */}
      {viewingPropertyDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Employee View-Only Document (Non-Editable)
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">{viewingPropertyDoc.assetTag}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{viewingPropertyDoc.agreementTitle}</h3>
                <p className="text-xs text-slate-500">
                  Assigned Exclusively to: <strong>{viewingPropertyDoc.employeeName}</strong> &middot; Length of Use: {viewingPropertyDoc.lengthOfUse}
                </p>
              </div>
              <button onClick={() => setViewingPropertyDoc(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {viewingPropertyDoc.agreementText}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>Insurance: {viewingPropertyDoc.insurancePolicyAndCoverage} (R{viewingPropertyDoc.insuredValueZar.toLocaleString()})</span>
              <button
                onClick={() => setViewingPropertyDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
