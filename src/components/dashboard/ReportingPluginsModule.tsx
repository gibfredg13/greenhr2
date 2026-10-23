import React, { useState } from 'react';
import {
  Company,
  Employee,
  ReportingPluginId,
  BeeRaceGroup,
  OccupationalLevel,
  DisciplinaryCase,
  LeaveRequest,
  EmployeeDocument,
  SetaTrainingRecord,
  BbbeeScorecardProfile
} from '../../types';
import { ALL_REPORTING_PLUGINS } from '../../data/seedData';
import {
  Blocks,
  Users,
  Clock,
  ShieldCheck,
  CalendarDays,
  Scale,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Download,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Search,
  Sparkles,
  Building2,
  UserCheck,
  X
} from 'lucide-react';

interface ReportingPluginsModuleProps {
  selectedCompany: Company;
  employees: Employee[];
  disciplinaryCases: DisciplinaryCase[];
  leaveRequests: LeaveRequest[];
  documents: EmployeeDocument[];
  setaRecords: SetaTrainingRecord[];
  bbbeeScorecards: BbbeeScorecardProfile[];
  onUpdateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  onUpdateEmployee: (id: string, data: Partial<Employee>) => void;
  onAddDisciplinaryCase: (newCase: Partial<DisciplinaryCase>) => Promise<void>;
  onAddSetaRecord: (rec: Partial<SetaTrainingRecord>) => Promise<void>;
  onUpdateSetaRecord: (id: string, data: Partial<SetaTrainingRecord>) => Promise<void>;
  onUpdateBbbeeScorecard: (companyId: string, data: Partial<BbbeeScorecardProfile>) => Promise<void>;
  onUploadDocument: (doc: Partial<EmployeeDocument>) => Promise<void>;
  onOpenAiAssistantWithPrompt: (prompt: string, mode: 'legal_advice' | 'draft_warning' | 'generate_contract' | 'policy_audit') => void;
}

export const PLUGIN_CATALOG: {
  id: ReportingPluginId;
  number: string;
  title: string;
  shortTitle: string;
  statute: string;
  valueProp: string;
  features: string[];
  icon: any;
}[] = [
  {
    id: 'employment_equity',
    number: '01',
    title: 'Employment Equity (EE) Management',
    shortTitle: '1. Employment Equity (EE)',
    statute: 'Employment Equity Act 55 of 1998',
    valueProp: 'Saves HR managers weeks of manual EEA2 & EEA4 reporting.',
    features: [
      'Workforce demographic tracking & B-BBEE Race Scores',
      'EEA2 and EEA4 statutory report generation',
      'Equity targets vs National/Provincial EAP dashboard',
      'Promotion and recruitment pipeline tracking',
      'Audit trail for Department of Employment and Labour inspections'
    ],
    icon: Users
  },
  {
    id: 'bcea_compliance',
    number: '02',
    title: 'BCEA Compliance Engine',
    shortTitle: '2. BCEA Compliance Engine',
    statute: 'Basic Conditions of Employment Act 75 of 1997',
    valueProp: 'Automatically flags illegal shift rosters & overtime breaches in real time.',
    features: [
      'Ordinary working hours audit (45h/week statutory cap)',
      'Overtime limits check (10h/week & 40h/month cap)',
      'Leave balances & statutory accrual verification',
      'Public holiday (2.0x) & Sunday shift calculations',
      'Automated HR alert when a manager schedules staff outside legal limits'
    ],
    icon: Clock
  },
  {
    id: 'popia_compliance',
    number: '03',
    title: 'POPIA Data Governance & Compliance',
    shortTitle: '3. POPIA Compliance',
    statute: 'Protection of Personal Information Act 4 of 2013',
    valueProp: 'Protects SMEs from Information Regulator penalties up to R10 million.',
    features: [
      'Employee Section 11 consent management',
      'Encrypted personnel document storage & classification',
      'Statutory retention policies (BCEA 3yr / SARS 5yr / COIDA 40yr)',
      'Automatic document expiry reminders',
      'Information Officer inspection audit logs'
    ],
    icon: ShieldCheck
  },
  {
    id: 'integrated_leave',
    number: '04',
    title: 'Integrated SA Leave Entitlement Engine',
    shortTitle: '4. Integrated Leave Engine',
    statute: 'BCEA Chapter 3 (Sections 20–27)',
    valueProp: 'Automatically calculates all 6 South African statutory leave entitlements.',
    features: [
      'Annual leave (21 consecutive / 15 working days)',
      'Sick leave (30 days per 36-month cycle)',
      'Family responsibility leave (3 paid days/year)',
      'Maternity leave (4 consecutive months)',
      'Adoption leave (10 consecutive weeks — Sec 25B)',
      'Parental leave (10 consecutive days — Sec 25A)'
    ],
    icon: CalendarDays
  },
  {
    id: 'disciplinary_labour',
    number: '05',
    title: 'Disciplinary & Labour Relations Suite',
    shortTitle: '5. Disciplinary & Labour',
    statute: 'Labour Relations Act 66 of 1995 (Schedule 8)',
    valueProp: 'Eliminates procedural unfairness awards at the CCMA.',
    features: [
      'Written warning & final warning generator templates',
      'Formal disciplinary hearing scheduling (48h notice check)',
      'Chronological workplace incident logging',
      'CCMA case tracking (7.11 Conciliation, Con-Arb & Arbitration)',
      'Employer & employee witness management registry'
    ],
    icon: Scale
  },
  {
    id: 'skills_seta',
    number: '06',
    title: 'Skills Development & SETA Tracking',
    shortTitle: '6. Skills & SETA (WSP/ATR)',
    statute: 'Skills Development Act 97 of 1998 & SDL Act',
    valueProp: 'Unlocks 20% Mandatory SETA Grants and maximizes B-BBEE Skills points.',
    features: [
      'Training courses & NQF skills matrices',
      'Workplace Skills Plans (WSP) & Annual Training Reports (ATR)',
      'Section 18.1 & 18.2 SETA Learnerships registry',
      'SDL Training grant claim calculator',
      'B-BBEE Category A–D skills spend breakdown'
    ],
    icon: GraduationCap
  },
  {
    id: 'bbbee_support',
    number: '07',
    title: 'B-BBEE Support & Live Scorecard Estimator',
    shortTitle: '7. B-BBEE Support Dashboard',
    statute: 'Broad-Based Black Economic Empowerment Act 53 of 2003',
    valueProp: 'Live B-BBEE level estimator, gap analyzer, and SANAS verification vault.',
    features: [
      'Management control & Employment Equity point aggregation',
      'Skills development & Preferential procurement tracking',
      'Enterprise & Supplier Development (ESD) tracker',
      'Live B-BBEE score & contributor level estimator',
      'Areas needing improvement & supporting evidence storage'
    ],
    icon: Award
  }
];

// Standard DTIC B-BBEE Race Recognition Points calculator helper
export function calculateDefaultBeePoints(
  race: BeeRaceGroup,
  gender: 'Male' | 'Female',
  hasDisability: boolean,
  level: OccupationalLevel
): number {
  if (race === 'Foreign National') return 0.0;
  if (race === 'White') {
    if (hasDisability) return 5.0;
    return gender === 'Female' ? 3.5 : 2.0;
  }
  // Black Designated Groups (African, Coloured, Indian)
  let base = race === 'African' ? 8.5 : race === 'Coloured' ? 8.0 : 7.5;
  if (gender === 'Female') base += 1.0;
  if (hasDisability) base += 0.5;
  if (level === 'Top Management' || level === 'Senior Management') base += 0.5;
  return Math.min(10.0, Number(base.toFixed(1)));
}

export const ReportingPluginsModule: React.FC<ReportingPluginsModuleProps> = ({
  selectedCompany,
  employees,
  disciplinaryCases,
  leaveRequests,
  documents,
  setaRecords,
  bbbeeScorecards,
  onUpdateCompany,
  onUpdateEmployee,
  onAddDisciplinaryCase,
  onAddSetaRecord,
  onUpdateSetaRecord,
  onUpdateBbbeeScorecard,
  onUploadDocument,
  onOpenAiAssistantWithPrompt
}) => {
  const [activeView, setActiveView] = useState<'plugin_matrix' | ReportingPluginId>('plugin_matrix');
  const [employeeFilterId, setEmployeeFilterId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedReportModal, setGeneratedReportModal] = useState<{
    title: string;
    subtitle: string;
    content: string;
  } | null>(null);

  // Plugin 5 (Disciplinary) local state for Witness & Template Generator
  const [witnesses, setWitnesses] = useState<
    { id: string; caseId: string; witnessName: string; role: string; side: 'Employer' | 'Employee'; statementStatus: 'Signed Affidavit' | 'Pending Statement' | 'Subpoenaed' }[]
  >([
    {
      id: 'wit_01',
      caseId: 'case_01',
      witnessName: 'Sipho Dlamini',
      role: 'Senior Logistics Controller',
      side: 'Employer',
      statementStatus: 'Signed Affidavit'
    },
    {
      id: 'wit_02',
      caseId: 'case_01',
      witnessName: 'Bongani Sithole (Shop Steward)',
      role: 'NUMSA / SATAWU Representative',
      side: 'Employee',
      statementStatus: 'Signed Affidavit'
    }
  ]);
  const [newWitnessName, setNewWitnessName] = useState('');
  const [newWitnessRole, setNewWitnessRole] = useState('');
  const [newWitnessSide, setNewWitnessSide] = useState<'Employer' | 'Employee'>('Employer');

  // Plugin 6 (SETA) local form state
  const [isAddingSeta, setIsAddingSeta] = useState(false);
  const [setaForm, setSetaForm] = useState({
    employeeId: '',
    courseOrProgramTitle: '',
    programType: 'SETA Learnership (18.1 Employed)' as SetaTrainingRecord['programType'],
    nqfLevel: 'NQF Level 5',
    setaCode: 'TETA-LRN-2026',
    costSpendZar: 35000,
    bbbeeCategoryCode: 'Category C (Learnerships)' as SetaTrainingRecord['bbbeeCategoryCode']
  });

  // Plugin 3 (POPIA) Audit Log state
  const [popiaAuditLogs, setPopiaAuditLogs] = useState([
    {
      id: 'plog_01',
      timestamp: '2026-10-22 14:15',
      actor: 'Naledi Sithole (Deputy Information Officer)',
      action: 'Verified Section 11 Employee Biometric & Payroll Consent Register',
      scope: 'Company-Wide',
      outcome: 'Compliant'
    },
    {
      id: 'plog_02',
      timestamp: '2026-10-19 09:40',
      actor: 'Automated POPIA Retention Engine',
      action: 'Flagged 1 Driver File (Keagan Naidoo) for Telematics Tracking Consent Renewal',
      scope: 'Employee CL-0199',
      outcome: 'Action Required'
    },
    {
      id: 'plog_03',
      timestamp: '2026-10-12 16:05',
      actor: 'Andre Venter (GM Operations)',
      action: 'Exported Encrypted SARS IRP5 & EMP501 Tax Archive',
      scope: '5-Year Statutory Retention Vault',
      outcome: 'Compliant'
    }
  ]);

  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);
  const enabledCompanyPlugins: ReportingPluginId[] =
    selectedCompany.enabledReportingPlugins || ALL_REPORTING_PLUGINS;

  // Filter employees by selected employee (if needed) and search query
  const scopedEmployees = companyEmployees.filter(emp => {
    const matchesTarget = employeeFilterId === 'ALL' || emp.id === employeeFilterId;
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTarget && matchesSearch;
  });

  // Toggle plugin for entire company
  const handleToggleCompanyPlugin = async (pluginId: ReportingPluginId) => {
    const exists = enabledCompanyPlugins.includes(pluginId);
    const updated = exists
      ? enabledCompanyPlugins.filter(id => id !== pluginId)
      : [...enabledCompanyPlugins, pluginId];
    await onUpdateCompany(selectedCompany.id, { enabledReportingPlugins: updated });
  };

  // Toggle plugin for specific employee
  const handleToggleEmployeePlugin = (emp: Employee, pluginId: ReportingPluginId) => {
    const current = emp.enabledReportingPlugins || ALL_REPORTING_PLUGINS;
    const exists = current.includes(pluginId);
    const updated = exists ? current.filter(id => id !== pluginId) : [...current, pluginId];
    onUpdateEmployee(emp.id, { enabledReportingPlugins: updated });
  };

  // Update employee B-BBEE Race Group or Score
  const handleUpdateEmployeeBee = (
    emp: Employee,
    updates: Partial<Pick<Employee, 'beeRaceGroup' | 'gender' | 'hasDisability' | 'occupationalLevel' | 'beeRaceScorePoints'>>
  ) => {
    const nextRace = updates.beeRaceGroup ?? emp.beeRaceGroup ?? 'African';
    const nextGender = updates.gender ?? emp.gender ?? 'Male';
    const nextDisability = updates.hasDisability ?? emp.hasDisability ?? false;
    const nextLevel = updates.occupationalLevel ?? emp.occupationalLevel ?? 'Skilled Technical';

    const nextScore =
      updates.beeRaceScorePoints !== undefined
        ? updates.beeRaceScorePoints
        : calculateDefaultBeePoints(nextRace, nextGender, nextDisability, nextLevel);

    onUpdateEmployee(emp.id, {
      ...updates,
      beeRaceGroup: nextRace,
      gender: nextGender,
      hasDisability: nextDisability,
      occupationalLevel: nextLevel,
      beeRaceScorePoints: nextScore
    });
  };

  // Compute B-BBEE summary metrics for the company
  const totalEmployeesCount = companyEmployees.length || 1;
  const blackDesignatedEmployees = companyEmployees.filter(e =>
    ['African', 'Coloured', 'Indian'].includes(e.beeRaceGroup || 'African')
  );
  const blackRepresentationPct = Math.round((blackDesignatedEmployees.length / totalEmployeesCount) * 100);
  const averageBeeRaceScore = (
    companyEmployees.reduce((sum, e) => sum + (e.beeRaceScorePoints ?? 8.0), 0) / totalEmployeesCount
  ).toFixed(1);

  // Active B-BBEE Scorecard for this company
  const currentScorecard: BbbeeScorecardProfile = bbbeeScorecards.find(
    s => s.companyId === selectedCompany.id
  ) || {
    companyId: selectedCompany.id,
    financialYear: '2025 / 2026 Verification Period',
    enterpriseCategory: 'Generic Enterprise (>R50m)',
    ownershipScore: 22.0,
    managementControlScore: 15.0,
    skillsDevelopmentScore: 17.5,
    enterpriseSupplierDevScore: 34.0,
    socioEconomicDevScore: 5.0,
    yesInitiativeBonus: 0,
    priorityElementsSubminimumMet: true,
    verifiedEvidenceItems: []
  };

  const totalBbbeePoints = Number(
    (
      currentScorecard.ownershipScore +
      currentScorecard.managementControlScore +
      currentScorecard.skillsDevelopmentScore +
      currentScorecard.enterpriseSupplierDevScore +
      currentScorecard.socioEconomicDevScore +
      currentScorecard.yesInitiativeBonus
    ).toFixed(1)
  );

  const getBbbeeLevelFromPoints = (pts: number): { level: string; recognition: string } => {
    if (pts >= 100) return { level: 'Level 1 Contributor', recognition: '135% Procurement Recognition' };
    if (pts >= 95) return { level: 'Level 2 Contributor', recognition: '125% Procurement Recognition' };
    if (pts >= 90) return { level: 'Level 3 Contributor', recognition: '110% Procurement Recognition' };
    if (pts >= 80) return { level: 'Level 4 Contributor', recognition: '100% Procurement Recognition' };
    if (pts >= 75) return { level: 'Level 5 Contributor', recognition: '80% Procurement Recognition' };
    if (pts >= 70) return { level: 'Level 6 Contributor', recognition: '60% Procurement Recognition' };
    if (pts >= 55) return { level: 'Level 7 Contributor', recognition: '50% Procurement Recognition' };
    if (pts >= 40) return { level: 'Level 8 Contributor', recognition: '10% Procurement Recognition' };
    return { level: 'Non-Compliant', recognition: '0% Recognition' };
  };

  const bbbeeStanding = getBbbeeLevelFromPoints(totalBbbeePoints);

  // Generate EEA2 or EEA4 statutory report modal
  const handleGenerateEeaReport = (formType: 'EEA2' | 'EEA4') => {
    const dateStr = new Date().toISOString().split('T')[0];
    if (formType === 'EEA2') {
      const content = `DEPARTMENT OF EMPLOYMENT AND LABOUR — FORM EEA2
ANNUAL EMPLOYMENT EQUITY WORKFORCE PROFILE REPORT (SECTION 21)
========================================================================
Employer Name: ${selectedCompany.name}
Trading Name: ${selectedCompany.tradingName || selectedCompany.name}
Registration No: ${selectedCompany.registrationNumber} | PAYE: ${selectedCompany.payeNumber}
SETA Sector: ${selectedCompany.setaName || selectedCompany.industry}
Reporting Date: ${dateStr}

1. WORKFORCE DEMOGRAPHIC PROFILE & B-BBEE RACE SCORES (${scopedEmployees.length} Staff Included):
------------------------------------------------------------------------
${scopedEmployees
  .map(
    e =>
      `• ${e.firstName} ${e.lastName} (${e.employeeNumber}) | Level: ${
        e.occupationalLevel || 'Skilled Technical'
      } | Race: ${e.beeRaceGroup || 'African'} | Gender: ${e.gender || 'Male'} | Disability: ${
        e.hasDisability ? 'Yes' : 'No'
      } | B-BBEE Race Score: ${(e.beeRaceScorePoints ?? 8.0).toFixed(1)} / 10.0 pts`
  )
  .join('\n')}

2. DESIGNATED GROUP REPRESENTATION SUMMARY:
------------------------------------------------------------------------
• Designated Black Representation (African, Coloured, Indian): ${blackRepresentationPct}% (Target EAP: 85%)
• Average Individual B-BBEE Recognition Score: ${averageBeeRaceScore} / 10.0 pts
• Top & Senior Management Black Representation: ${
        companyEmployees.filter(
          e =>
            ['Top Management', 'Senior Management'].includes(e.occupationalLevel || '') &&
            ['African', 'Coloured', 'Indian'].includes(e.beeRaceGroup || 'African')
        ).length
      } of ${
        companyEmployees.filter(e =>
          ['Top Management', 'Senior Management'].includes(e.occupationalLevel || '')
        ).length || 1
      } incumbents

3. DEPARTMENT OF EMPLOYMENT & LABOUR INSPECTION AUDIT DECLARATION:
------------------------------------------------------------------------
Signed off electronically via GreenHive HRaaS Statutory Engine. Ready for DEL Online Portal upload.`;

      setGeneratedReportModal({
        title: `Form EEA2 — Workforce Demographic & Equity Report`,
        subtitle: `${selectedCompany.name} · Generated ${dateStr}`,
        content
      });
    } else {
      const totalPayroll = scopedEmployees.reduce((s, e) => s + e.salaryZar, 0);
      const content = `DEPARTMENT OF EMPLOYMENT AND LABOUR — FORM EEA4
INCOME DIFFERENTIAL STATEMENT (SECTION 27 OF THE EMPLOYMENT EQUITY ACT)
========================================================================
Employer Name: ${selectedCompany.name}
PAYE Reference: ${selectedCompany.payeNumber} | SDL Reference: ${selectedCompany.sdlNumber}
Reporting Period: 2025/2026 Statutory Cycle

1. REMUNERATION BY OCCUPATIONAL LEVEL & RACE CLASSIFICATION:
------------------------------------------------------------------------
${scopedEmployees
  .map(
    e =>
      `• ${e.occupationalLevel || 'Skilled Technical'} | ${e.firstName} ${e.lastName} | ${
        e.beeRaceGroup || 'African'
      } (${e.gender || 'Male'}) | Monthly Gross: R${e.salaryZar.toLocaleString()} | Annualized: R${(
        e.salaryZar * 12
      ).toLocaleString()} | B-BBEE Score: ${(e.beeRaceScorePoints ?? 8.0).toFixed(1)} pts`
  )
  .join('\n')}

2. EQUAL PAY FOR WORK OF EQUAL VALUE (SECTION 6(4)) ANALYSIS:
------------------------------------------------------------------------
• Total Monthly Gross Payroll Scoped: R${totalPayroll.toLocaleString()}
• Annualized Remuneration Base: R${(totalPayroll * 12).toLocaleString()}
• Wage Gap Ratio (Highest to Median Earner): ${(
        Math.max(...scopedEmployees.map(e => e.salaryZar), 1) /
        Math.max(scopedEmployees[Math.floor(scopedEmployees.length / 2)]?.salaryZar || 25000, 1)
      ).toFixed(2)}:1
• Status: Verified Compliant with EEA Section 27 & National Minimum Wage Act.`;

      setGeneratedReportModal({
        title: `Form EEA4 — Statutory Income Differential Statement`,
        subtitle: `${selectedCompany.name} · Section 27 Remuneration Audit`,
        content
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <Blocks className="w-4 h-4" />
            <span>Modular HRaaS Statutory Reporting Plugins &amp; B-BBEE Race Score Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Statutory Reporting Plugins &amp; B-BBEE Suite
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Enable or disable the 7 statutory reporting plugins per company or per individual employee, and manage individual B-BBEE Race Recognition Scores for{' '}
            <span className="font-semibold text-slate-900">{selectedCompany.name}</span>.
          </p>
        </div>

        {/* Scope Filter: Company-Wide vs Specific Employee */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[10px] font-semibold text-slate-500">
                Report Scope (Company or Employee)
              </div>
              <select
                value={employeeFilterId}
                onChange={e => setEmployeeFilterId(e.target.value)}
                className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">All {companyEmployees.length} Employees ({selectedCompany.name})</option>
                {companyEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.beeRaceGroup || 'African'} · {(emp.beeRaceScorePoints ?? 8.0).toFixed(1)} pts)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setActiveView('plugin_matrix')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeView === 'plugin_matrix'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Plugin Selector &amp; B-BBEE Race Matrix
          </button>
        </div>
      </div>

      {/* Top KPI Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">Active Company Plugins</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {enabledCompanyPlugins.length} / 7
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            Configurable per company &amp; employee
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">Designated B-BBEE Representation</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {blackRepresentationPct}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {blackDesignatedEmployees.length} of {companyEmployees.length} staff in designated groups
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">Avg Employee B-BBEE Race Score</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
            {averageBeeRaceScore} <span className="text-sm font-normal text-slate-500">/ 10.0 pts</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Weighted by Race, Gender, Disability &amp; Tier
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">Live B-BBEE Scorecard Estimate</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {totalBbbeePoints} pts
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            {bbbeeStanding.level} · {bbbeeStanding.recognition}
          </div>
        </div>
      </div>

      {/* Navigation Bar for the 7 Plugins */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveView('plugin_matrix')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeView === 'plugin_matrix'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Plugin &amp; B-BBEE Race Matrix
        </button>

        {PLUGIN_CATALOG.map(plugin => {
          const Icon = plugin.icon;
          const isCompanyEnabled = enabledCompanyPlugins.includes(plugin.id);
          const isActive = activeView === plugin.id;
          return (
            <button
              key={plugin.id}
              onClick={() => setActiveView(plugin.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white'
                  : isCompanyEnabled
                  ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{plugin.shortTitle}</span>
              {!isCompanyEnabled && (
                <span className="text-[10px] font-normal opacity-75">(Off)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* VIEW 0: PLUGIN CONFIGURATION MATRIX (PER COMPANY & PER EMPLOYEE) + B-BBEE RACE SCORES */}
      {/* ===================================================================== */}
      {activeView === 'plugin_matrix' && (
        <div className="space-y-6">
          {/* Section A: Company-Level Plugin Toggles */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  01. Company-Level Reporting Plugins ({selectedCompany.name})
                </h2>
                <p className="text-xs text-slate-600">
                  Click any plugin toggle to activate or deactivate that statutory reporting engine for {selectedCompany.name}, or click &ldquo;Open Plugin&rdquo; to launch its dashboard.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onUpdateCompany(selectedCompany.id, {
                      enabledReportingPlugins: [...ALL_REPORTING_PLUGINS]
                    })
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
                >
                  Enable All 7 Plugins
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLUGIN_CATALOG.map(plugin => {
                const Icon = plugin.icon;
                const isEnabled = enabledCompanyPlugins.includes(plugin.id);
                return (
                  <div
                    key={plugin.id}
                    className={`border rounded-xl p-4 flex flex-col justify-between transition-colors ${
                      isEnabled ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50/70 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 font-mono">
                              Plugin {plugin.number} · {plugin.statute.split(' ')[0]}
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">{plugin.title}</h3>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleCompanyPlugin(plugin.id)}
                          className={`p-1 rounded-lg transition-colors ${
                            isEnabled ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                          }`}
                          title={isEnabled ? 'Click to turn OFF for company' : 'Click to turn ON for company'}
                        >
                          {isEnabled ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                        </button>
                      </div>

                      <p className="text-xs text-emerald-800 font-medium mt-3">{plugin.valueProp}</p>

                      <ul className="mt-2.5 space-y-1 text-xs text-slate-600">
                        {plugin.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">·</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Status: <strong className={isEnabled ? 'text-emerald-700' : 'text-slate-500'}>{isEnabled ? 'Active' : 'Disabled'}</strong>
                      </span>
                      <button
                        onClick={() => setActiveView(plugin.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                      >
                        Open Plugin &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Employee-Level B-BBEE Race Score & Per-Employee Plugin Selection Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  02. Employee B-BBEE Race Scores &amp; Per-Employee Plugin Assignment Matrix
                </h2>
                <p className="text-xs text-slate-600">
                  Assign each employee a B-BBEE Race Classification, Gender, Disability status, Occupational Level, and individual B-BBEE Race Score (0–10 pts), and toggle which of the 7 reporting plugins apply to each employee.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search employee or role..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 bg-slate-50">
                    <th className="py-3 px-3">Employee &amp; Role</th>
                    <th className="py-3 px-3">B-BBEE Race Group</th>
                    <th className="py-3 px-3">Gender &amp; Disability</th>
                    <th className="py-3 px-3">EE Occupational Level</th>
                    <th className="py-3 px-3 text-right">B-BBEE Race Score</th>
                    <th className="py-3 px-3">Assigned Reporting Plugins (Click to Toggle Per Employee)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {scopedEmployees.map(emp => {
                    const empPlugins = emp.enabledReportingPlugins || ALL_REPORTING_PLUGINS;
                    const raceScore = emp.beeRaceScorePoints ?? 8.0;
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-slate-500">
                            {emp.employeeNumber} · {emp.jobTitle}
                          </div>
                        </td>

                        {/* B-BBEE Race Classification Selector */}
                        <td className="py-3 px-3">
                          <select
                            value={emp.beeRaceGroup || 'African'}
                            onChange={e =>
                              handleUpdateEmployeeBee(emp, {
                                beeRaceGroup: e.target.value as BeeRaceGroup
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                          >
                            <option value="African">African (Black Designated)</option>
                            <option value="Coloured">Coloured (Black Designated)</option>
                            <option value="Indian">Indian (Black Designated)</option>
                            <option value="White">White</option>
                            <option value="Foreign National">Foreign National (Non-Designated)</option>
                          </select>
                        </td>

                        {/* Gender & Disability */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={emp.gender || 'Male'}
                              onChange={e =>
                                handleUpdateEmployeeBee(emp, {
                                  gender: e.target.value as 'Male' | 'Female'
                                })
                              }
                              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>

                            <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(emp.hasDisability)}
                                onChange={e =>
                                  handleUpdateEmployeeBee(emp, {
                                    hasDisability: e.target.checked
                                  })
                                }
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span>Disability</span>
                            </label>
                          </div>
                        </td>

                        {/* Occupational Level */}
                        <td className="py-3 px-3">
                          <select
                            value={emp.occupationalLevel || 'Skilled Technical'}
                            onChange={e =>
                              handleUpdateEmployeeBee(emp, {
                                occupationalLevel: e.target.value as OccupationalLevel
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
                          >
                            <option value="Top Management">Top Management</option>
                            <option value="Senior Management">Senior Management</option>
                            <option value="Professionally Qualified">Professionally Qualified</option>
                            <option value="Skilled Technical">Skilled Technical</option>
                            <option value="Semi-Skilled">Semi-Skilled</option>
                            <option value="Unskilled">Unskilled</option>
                          </select>
                        </td>

                        {/* Editable B-BBEE Race Score (0 - 10 pts) */}
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.5}
                              value={raceScore}
                              onChange={e =>
                                handleUpdateEmployeeBee(emp, {
                                  beeRaceScorePoints: Math.min(10, Math.max(0, Number(e.target.value)))
                                })
                              }
                              className="w-16 px-2 py-1 text-right font-mono tabular-nums font-bold text-emerald-700 border border-slate-200 rounded-lg bg-emerald-50/50"
                            />
                            <span className="text-slate-400 font-mono text-[11px]">/10</span>
                          </div>
                        </td>

                        {/* Per-Employee Reporting Plugin Toggle Buttons */}
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {PLUGIN_CATALOG.map(p => {
                              const activeForEmp = empPlugins.includes(p.id);
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => handleToggleEmployeePlugin(emp, p.id)}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                                    activeForEmp
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                  title={`${p.title}: Click to toggle ON/OFF for ${emp.firstName}`}
                                >
                                  {p.number}. {p.shortTitle.split('. ')[1]}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 1: EMPLOYMENT EQUITY (EE) MANAGEMENT PLUGIN                      */}
      {/* ===================================================================== */}
      {activeView === 'employment_equity' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700">
                Plugin 01 · Employment Equity Act 55 of 1998
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Employment Equity (EE) Workforce Profile, Targets &amp; EEA2 / EEA4 Generator
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Saves HR managers weeks of manual reporting with automated EEA2 workforce matrices, EEA4 income differential statements, and Department of Employment and Labour inspection audit trails.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleGenerateEeaReport('EEA2')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                Generate EEA2 Report
              </button>
              <button
                onClick={() => handleGenerateEeaReport('EEA4')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Generate EEA4 Statement
              </button>
            </div>
          </div>

          {/* Workforce Demographic Matrix by Occupational Level & B-BBEE Race */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              EEA2 Workforce Demographic Matrix by Occupational Level &amp; B-BBEE Race Group
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Occupational Level</th>
                    <th className="py-2.5 px-3 text-right">African</th>
                    <th className="py-2.5 px-3 text-right">Coloured</th>
                    <th className="py-2.5 px-3 text-right">Indian</th>
                    <th className="py-2.5 px-3 text-right">White</th>
                    <th className="py-2.5 px-3 text-right">Foreign National</th>
                    <th className="py-2.5 px-3 text-right">Persons w/ Disability</th>
                    <th className="py-2.5 px-3 text-right">Avg B-BBEE Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                  {(
                    [
                      'Top Management',
                      'Senior Management',
                      'Professionally Qualified',
                      'Skilled Technical',
                      'Semi-Skilled',
                      'Unskilled'
                    ] as OccupationalLevel[]
                  ).map(level => {
                    const inLevel = scopedEmployees.filter(
                      e => (e.occupationalLevel || 'Skilled Technical') === level
                    );
                    const countRace = (r: BeeRaceGroup) =>
                      inLevel.filter(e => (e.beeRaceGroup || 'African') === r).length;
                    const disCount = inLevel.filter(e => e.hasDisability).length;
                    const avgScore =
                      inLevel.length > 0
                        ? (
                            inLevel.reduce((s, e) => s + (e.beeRaceScorePoints ?? 8.0), 0) /
                            inLevel.length
                          ).toFixed(1)
                        : '—';
                    return (
                      <tr key={level} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{level}</td>
                        <td className="py-2.5 px-3 text-right">{countRace('African')}</td>
                        <td className="py-2.5 px-3 text-right">{countRace('Coloured')}</td>
                        <td className="py-2.5 px-3 text-right">{countRace('Indian')}</td>
                        <td className="py-2.5 px-3 text-right">{countRace('White')}</td>
                        <td className="py-2.5 px-3 text-right">{countRace('Foreign National')}</td>
                        <td className="py-2.5 px-3 text-right">{disCount}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{avgScore}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Equity Targets vs EAP + Promotion/Recruitment + DEL Inspection Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                5-Year Employment Equity Numerical Targets vs. Economically Active Population (EAP)
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Black Designated Representation (African, Coloured, Indian)', actual: blackRepresentationPct, target: 85 },
                  {
                    label: 'Female Workforce Representation',
                    actual: Math.round(
                      (scopedEmployees.filter(e => e.gender === 'Female').length /
                        Math.max(scopedEmployees.length, 1)) *
                        100
                    ),
                    target: 46
                  },
                  {
                    label: 'Persons with Disabilities Target (Statutory 2%+)',
                    actual: Math.round(
                      (scopedEmployees.filter(e => e.hasDisability).length /
                        Math.max(scopedEmployees.length, 1)) *
                        100
                    ),
                    target: 3
                  }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-medium text-slate-700">
                      <span>{item.label}</span>
                      <span className="font-mono tabular-nums">
                        Actual: <strong>{item.actual}%</strong> · Target: <strong>{item.target}%</strong>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${Math.min(100, item.actual)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Promotion, Recruitment &amp; Department of Employment and Labour (DEL) Audit Trail
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">Promotion: Zainab Abrahams &rarr; Top Management</div>
                    <div className="text-slate-500">Coloured Female · B-BBEE Score: 9.5 pts · Aligned with EE Plan Goal #1</div>
                  </div>
                  <span className="font-mono text-emerald-700 font-semibold">Verified</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">Recruitment: Lerato Khumalo (OHS Safety Officer)</div>
                    <div className="text-slate-500">African Female with Disability · B-BBEE Score: 10.0 pts</div>
                  </div>
                  <span className="font-mono text-emerald-700 font-semibold">Verified</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">DEL Section 16 EE Consultative Forum Minutes</div>
                    <div className="text-slate-500">Signed by Assigned Senior EE Manager (Section 24 Appointment Letter on file)</div>
                  </div>
                  <span className="font-mono text-emerald-700 font-semibold">Inspection Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: BCEA COMPLIANCE ENGINE PLUGIN                                 */}
      {/* ===================================================================== */}
      {activeView === 'bcea_compliance' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-semibold text-emerald-700">
              Plugin 02 · Basic Conditions of Employment Act 75 of 1997
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Automated BCEA Working Hours, Overtime, Shift &amp; Public Holiday Compliance Engine
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Automatically checks ordinary weekly hours (max 45h under Section 9), monthly overtime limits (max 40h under Section 10), Sunday/Public Holiday pay multipliers (Sections 16 &amp; 18), and alerts HR immediately if a manager schedules staff outside legal limits.
            </p>
          </div>

          {/* Live BCEA Alerts Banner */}
          {scopedEmployees.some(
            e => (e.weeklyHoursScheduled ?? 40) > 45 || (e.monthlyOvertimeHours ?? 0) > 40
          ) && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <div className="font-bold text-sm">
                  BCEA Statutory Scheduling Alert — Manager Roster Breach Detected
                </div>
                <p>
                  One or more employees are scheduled above the statutory <strong>45 ordinary hours/week</strong> (BCEA Section 9) or <strong>40 overtime hours/month</strong> (BCEA Section 10). Adjust their roster hours in the table below to restore compliance.
                </p>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Live Employee Working Hours, Overtime &amp; Public Holiday Roster Check (Editable Simulator)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3 text-right">Ordinary Weekly Hours (Max 45h)</th>
                    <th className="py-2.5 px-3 text-right">Monthly Overtime (Max 40h)</th>
                    <th className="py-2.5 px-3 text-right">Public Holiday / Sunday Shifts (2.0x)</th>
                    <th className="py-2.5 px-3 text-right">Annual Leave Balance</th>
                    <th className="py-2.5 px-3">BCEA Statutory Status &amp; Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scopedEmployees.map(emp => {
                    const weeklyHrs = emp.weeklyHoursScheduled ?? 42;
                    const monthlyOt = emp.monthlyOvertimeHours ?? 8;
                    const holidayShifts = emp.sundayPublicHolidayShifts ?? 0;
                    const weeklyBreach = weeklyHrs > 45;
                    const otBreach = monthlyOt > 40;
                    const hasBreach = weeklyBreach || otBreach;

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-slate-500">{emp.jobTitle}</div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            min={0}
                            max={80}
                            value={weeklyHrs}
                            onChange={e =>
                              onUpdateEmployee(emp.id, {
                                weeklyHoursScheduled: Number(e.target.value)
                              })
                            }
                            className={`w-20 px-2 py-1 text-right font-mono tabular-nums font-bold rounded border ${
                              weeklyBreach
                                ? 'border-red-400 bg-red-50 text-red-700'
                                : 'border-slate-200 bg-white text-slate-900'
                            }`}
                          />
                          <span className="ml-1 text-slate-400 font-mono">h/wk</span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={monthlyOt}
                            onChange={e =>
                              onUpdateEmployee(emp.id, {
                                monthlyOvertimeHours: Number(e.target.value)
                              })
                            }
                            className={`w-20 px-2 py-1 text-right font-mono tabular-nums font-bold rounded border ${
                              otBreach
                                ? 'border-red-400 bg-red-50 text-red-700'
                                : 'border-slate-200 bg-white text-slate-900'
                            }`}
                          />
                          <span className="ml-1 text-slate-400 font-mono">h/mo</span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            min={0}
                            max={15}
                            value={holidayShifts}
                            onChange={e =>
                              onUpdateEmployee(emp.id, {
                                sundayPublicHolidayShifts: Number(e.target.value)
                              })
                            }
                            className="w-16 px-2 py-1 text-right font-mono tabular-nums border border-slate-200 rounded bg-white text-slate-900"
                          />
                          <span className="ml-1 text-slate-500 font-mono">shifts</span>
                        </td>

                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-800">
                          {emp.leaveBalances.annual} days
                        </td>

                        <td className="py-3 px-3">
                          {hasBreach ? (
                            <div className="text-red-700 font-semibold flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span>
                                {weeklyBreach && `Exceeds 45h/wk (${weeklyHrs}h) `}
                                {otBreach && `Exceeds 40h/mo OT (${monthlyOt}h)`}
                              </span>
                            </div>
                          ) : (
                            <div className="text-emerald-700 font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>BCEA Sections 9, 10, 15 &amp; 18 Compliant</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 3: POPIA COMPLIANCE PLUGIN                                       */}
      {/* ===================================================================== */}
      {activeView === 'popia_compliance' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-semibold text-emerald-700">
              Plugin 03 · Protection of Personal Information Act 4 of 2013
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              POPIA Employee Consent Management, Retention Policies &amp; Expiry Audit Engine
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Manage employee Section 11 data processing consents, enforce statutory document retention schedules, track expiring permits/visas/medicals, and maintain an Information Regulator audit log.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Consent Management */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Employee Section 11 Personal Information Consent Register
              </h3>
              <div className="divide-y divide-slate-200 text-xs">
                {scopedEmployees.map(emp => {
                  const signed = emp.popiaConsentSigned ?? true;
                  return (
                    <div key={emp.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">
                          {emp.firstName} {emp.lastName} ({emp.employeeNumber})
                        </div>
                        <div className="text-slate-500">
                          Biometric, Payroll, Medical &amp; Telematics Processing Addendum ·{' '}
                          {signed ? `Signed ${emp.popiaConsentDate || '2025-01-15'}` : 'Consent Renewal Required'}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const nextState = !signed;
                          onUpdateEmployee(emp.id, {
                            popiaConsentSigned: nextState,
                            popiaConsentDate: nextState ? new Date().toISOString().split('T')[0] : undefined
                          });
                          setPopiaAuditLogs(prev => [
                            {
                              id: `plog_${Date.now()}`,
                              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
                              actor: 'Practice HR Consultant',
                              action: `${nextState ? 'Recorded Signed' : 'Revoked'} Section 11 POPIA Consent for ${emp.firstName} ${emp.lastName}`,
                              scope: `Employee ${emp.employeeNumber}`,
                              outcome: nextState ? 'Compliant' : 'Action Required'
                            },
                            ...prev
                          ]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          signed
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        }`}
                      >
                        {signed ? 'Consent Verified (Toggle)' : 'Mark Consent Signed'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Retention Policies & Document Expiry Reminders */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Statutory Retention Policies &amp; Automatic Document Expiry Reminders
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">BCEA Section 31 Personnel &amp; Time Records</div>
                    <div className="text-slate-500">Mandatory retention period: 3 Years from date of last entry</div>
                  </div>
                  <span className="font-mono text-emerald-700 font-semibold">Auto-Enforced</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">SARS Tax / IRP5 / EMP501 Payroll Certificates</div>
                    <div className="text-slate-500">Mandatory retention period: 5 Years from tax submission</div>
                  </div>
                  <span className="font-mono text-emerald-700 font-semibold">Auto-Enforced</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">OHSA &amp; COIDA Health / Medical Surveillance Files</div>
                    <div className="text-slate-500">Mandatory retention period: 40 Years (Hazardous / Mining exposure)</div>
                  </div>
                  <span className="font-mono text-emerald-700 font-semibold">Auto-Enforced</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900 mb-2">
                  Document Vault Expiry Monitor ({documents.filter(d => d.companyId === selectedCompany.id).length} Indexed Files)
                </div>
                <div className="space-y-1.5 text-xs">
                  {documents
                    .filter(d => d.companyId === selectedCompany.id)
                    .slice(0, 4)
                    .map(doc => (
                      <div key={doc.id} className="flex items-center justify-between py-1">
                        <span className="text-slate-700 truncate max-w-xs">{doc.title}</span>
                        <span className="font-mono text-slate-500">
                          {doc.status} · {doc.expiryDate ? `Exp: ${doc.expiryDate}` : 'No Expiry'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* POPIA Audit Logs */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Information Officer &amp; POPIA Section 19 Security Audit Logs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Information Officer / Actor</th>
                    <th className="py-2 px-3">Audit Event</th>
                    <th className="py-2 px-3">Scope</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {popiaAuditLogs.map(log => (
                    <tr key={log.id}>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{log.timestamp}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{log.actor}</td>
                      <td className="py-2.5 px-3 text-slate-700">{log.action}</td>
                      <td className="py-2.5 px-3 text-slate-500">{log.scope}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-700">{log.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 4: INTEGRATED LEAVE MANAGEMENT PLUGIN                            */}
      {/* ===================================================================== */}
      {activeView === 'integrated_leave' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-xs font-semibold text-emerald-700">
              Plugin 04 · BCEA Chapter 3 Statutory Leave Entitlements
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Integrated South African Statutory Leave Entitlement Calculator
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Automatically calculates statutory entitlements across all 6 South African leave categories: Annual Leave, Sick Leave, Family Responsibility Leave, Maternity Leave, Adoption Leave, and Parental Leave.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Employee Statutory Leave Entitlements &amp; Live Accrual Ledger
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3 text-right">Annual Leave (Min 15d / 21 consec.)</th>
                    <th className="py-2.5 px-3 text-right">Sick Leave (30d / 36-mo cycle)</th>
                    <th className="py-2.5 px-3 text-right">Family Resp. (3d / year)</th>
                    <th className="py-2.5 px-3 text-right">Maternity (4 consec. months)</th>
                    <th className="py-2.5 px-3 text-right">Adoption (10 consec. weeks)</th>
                    <th className="py-2.5 px-3 text-right">Parental (10 consec. days)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                  {scopedEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-sans">
                        <div className="font-bold text-slate-900">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-slate-500">
                          Started {emp.startDate} · Monthly Accrual: +1.25 days/mo
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">
                        {emp.leaveBalances.annual} days
                      </td>
                      <td className="py-3 px-3 text-right">{emp.leaveBalances.sick} days</td>
                      <td className="py-3 px-3 text-right">{emp.leaveBalances.familyResponsibility} days</td>
                      <td className="py-3 px-3 text-right">4 Months (120d UIF)</td>
                      <td className="py-3 px-3 text-right">{emp.leaveBalances.adoption ?? 10} Weeks (Sec 25B)</td>
                      <td className="py-3 px-3 text-right">{emp.leaveBalances.parental} Days (Sec 25A)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 5: DISCIPLINARY & LABOUR RELATIONS MODULE PLUGIN                 */}
      {/* ===================================================================== */}
      {activeView === 'disciplinary_labour' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700">
                Plugin 05 · Labour Relations Act 66 of 1995 (Schedule 8 Code of Good Practice)
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Disciplinary Templates, Hearing Workflows, CCMA Case Tracker &amp; Witness Registry
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Generate CCMA-defensible Written Warnings, Final Written Warnings, and 48-hour Hearing Notices, log workplace incidents, and manage hearing witnesses.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  onOpenAiAssistantWithPrompt(
                    `Draft a formal LRA Schedule 8 Written Warning template and Final Written Warning workflow for ${selectedCompany.name}.`,
                    'draft_warning'
                  )
                }
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Draft Warning / Hearing Notice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Written Warning, Final Warning & Hearing Notice Instant Templates */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Instant LRA Schedule 8 Disciplinary Document Templates
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  {
                    title: 'Template 1: Formal Written Warning (6-Month Validity)',
                    desc: 'Includes charge particulars, employee explanation summary, corrective steps, and refusal-to-sign witness block.',
                    body: `FORMAL WRITTEN WARNING (LRA SCHEDULE 8)\nEmployer: ${selectedCompany.name}\nValidity: 6 Months\n\n1. Charge / Misconduct Details\n2. Employee Representations & Mitigating Factors\n3. Corrective Action Required\n4. Employer & Witness Signatures`
                  },
                  {
                    title: 'Template 2: Final Written Warning (12-Month Validity)',
                    desc: 'Comprehensive final sanction prior to dismissal inquiry with mandatory union/colleague representation confirmation.',
                    body: `FINAL WRITTEN WARNING NOTICE\nEmployer: ${selectedCompany.name}\nValidity: 12 Months\n\nNotice that any further breach of company rules or incapacity standards within 12 months will lead to a formal Disciplinary Inquiry and potential dismissal.`
                  },
                  {
                    title: 'Template 3: Notice to Attend Disciplinary Hearing (48-Hour Statutory Notice)',
                    desc: 'Includes full charge sheet, date/time/venue, right to interpreter, right to call witnesses, and right to shop steward representation.',
                    body: `NOTICE TO ATTEND DISCIPLINARY INQUIRY\nMinimum 48 Hours Clear Notice Checked\nRights Explained: Fellow Employee / Trade Union Representative, Interpreter, Cross-Examination of Employer Witnesses.`
                  }
                ].map((tpl, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">{tpl.title}</div>
                      <div className="text-slate-500 mt-0.5">{tpl.desc}</div>
                    </div>
                    <button
                      onClick={() =>
                        setGeneratedReportModal({
                          title: tpl.title,
                          subtitle: `${selectedCompany.name} · LRA Schedule 8 Template`,
                          content: tpl.body
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      Preview Template
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Witness Management Registry */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Disciplinary &amp; CCMA Hearing Witness Management Registry
              </h3>

              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={newWitnessName}
                  onChange={e => setNewWitnessName(e.target.value)}
                  placeholder="Witness full name..."
                  className="flex-1 min-w-[140px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  value={newWitnessRole}
                  onChange={e => setNewWitnessRole(e.target.value)}
                  placeholder="Role / Capacity..."
                  className="flex-1 min-w-[120px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
                <select
                  value={newWitnessSide}
                  onChange={e => setNewWitnessSide(e.target.value as 'Employer' | 'Employee')}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Employer">Employer Witness</option>
                  <option value="Employee">Employee Witness</option>
                </select>
                <button
                  onClick={() => {
                    if (!newWitnessName.trim()) return;
                    setWitnesses(prev => [
                      ...prev,
                      {
                        id: `wit_${Date.now()}`,
                        caseId: disciplinaryCases[0]?.id || 'case_01',
                        witnessName: newWitnessName.trim(),
                        role: newWitnessRole.trim() || 'Corroborating Witness',
                        side: newWitnessSide,
                        statementStatus: 'Signed Affidavit'
                      }
                    ]);
                    setNewWitnessName('');
                    setNewWitnessRole('');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0"
                >
                  + Add Witness
                </button>
              </div>

              <div className="divide-y divide-slate-200 text-xs">
                {witnesses.map(w => (
                  <div key={w.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{w.witnessName}</div>
                      <div className="text-slate-500">
                        {w.role} · {w.side} Witness
                      </div>
                    </div>
                    <span className="font-mono text-emerald-700 font-semibold">{w.statementStatus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 6: SKILLS DEVELOPMENT & SETA TRACKING PLUGIN                     */}
      {/* ===================================================================== */}
      {activeView === 'skills_seta' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700">
                Plugin 06 · Skills Development Act 97 of 1998 &amp; {selectedCompany.setaName || 'SETA'}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Workplace Skills Plan (WSP), Annual Training Report (ATR) &amp; Learnerships Tracker
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Track training courses, NQF skills matrices, and Section 18.1 / 18.2 SETA Learnerships, and generate reports for SETA Mandatory Grant claims and B-BBEE Skills Development scorecards.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingSeta(!isAddingSeta)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Log Training / Learnership
              </button>
              <button
                onClick={() => {
                  const compRecs = setaRecords.filter(r => r.companyId === selectedCompany.id);
                  const totalSpend = compRecs.reduce((s, r) => s + r.costSpendZar, 0);
                  const totalGrant = compRecs.reduce((s, r) => s + r.MandatoryGrantClaimableZar, 0);
                  setGeneratedReportModal({
                    title: `SETA WSP / ATR & B-BBEE Skills Grant Submission Report`,
                    subtitle: `${selectedCompany.name} · ${selectedCompany.setaName || 'SETA'} · SDL No: ${selectedCompany.sdlNumber}`,
                    content: `WORKPLACE SKILLS PLAN (WSP) & ANNUAL TRAINING REPORT (ATR)
========================================================================
Employer: ${selectedCompany.name} | SDL Number: ${selectedCompany.sdlNumber}
Registered SETA: ${selectedCompany.setaName || 'Sector Education and Training Authority'}
Total Verified Training Spend: R${totalSpend.toLocaleString()}
Estimated 20% Mandatory SETA Grant Claimable: R${totalGrant.toLocaleString()}

REGISTERED TRAINING & LEARNERSHIP INTERVENTIONS:
------------------------------------------------------------------------
${compRecs
  .map(
    r =>
      `• ${r.employeeName} (${r.beeRaceGroup}, ${r.gender}) | ${r.courseOrProgramTitle} | ${r.programType} (${r.nqfLevel}) | Spend: R${r.costSpendZar.toLocaleString()} | ${r.bbbeeCategoryCode} | Status: ${r.status}`
  )
  .join('\n')}`
                  });
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                Generate WSP/ATR &amp; Grant Report
              </button>
            </div>
          </div>

          {isAddingSeta && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Register New SETA Training / Learnership Record</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee</label>
                  <select
                    value={setaForm.employeeId}
                    onChange={e => setSetaForm({ ...setaForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="">Select Employee...</option>
                    {companyEmployees.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.firstName} {e.lastName} ({e.beeRaceGroup || 'African'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course / Learnership Title</label>
                  <input
                    type="text"
                    value={setaForm.courseOrProgramTitle}
                    onChange={e => setSetaForm({ ...setaForm, courseOrProgramTitle: e.target.value })}
                    placeholder="e.g. National Certificate: Supply Chain NQF 5"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Intervention Type</label>
                  <select
                    value={setaForm.programType}
                    onChange={e => setSetaForm({ ...setaForm, programType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="SETA Learnership (18.1 Employed)">SETA Learnership (18.1 Employed)</option>
                    <option value="SETA Learnership (18.2 Unemployed)">SETA Learnership (18.2 Unemployed)</option>
                    <option value="Accredited Course">Accredited Course</option>
                    <option value="Workplace Bursary">Workplace Bursary</option>
                    <option value="Skills Matrix Intervention">Skills Matrix Intervention</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NQF Level</label>
                  <input
                    type="text"
                    value={setaForm.nqfLevel}
                    onChange={e => setSetaForm({ ...setaForm, nqfLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Training Cost Spend (ZAR)</label>
                  <input
                    type="number"
                    value={setaForm.costSpendZar}
                    onChange={e => setSetaForm({ ...setaForm, costSpendZar: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={async () => {
                      const emp = companyEmployees.find(e => e.id === setaForm.employeeId) || companyEmployees[0];
                      if (!emp || !setaForm.courseOrProgramTitle.trim()) return;
                      await onAddSetaRecord({
                        companyId: selectedCompany.id,
                        employeeId: emp.id,
                        employeeName: `${emp.firstName} ${emp.lastName}`,
                        beeRaceGroup: emp.beeRaceGroup || 'African',
                        gender: emp.gender || 'Male',
                        courseOrProgramTitle: setaForm.courseOrProgramTitle.trim(),
                        programType: setaForm.programType,
                        nqfLevel: setaForm.nqfLevel,
                        setaCode: setaForm.setaCode,
                        costSpendZar: setaForm.costSpendZar,
                        MandatoryGrantClaimableZar: Math.round(setaForm.costSpendZar * 0.4),
                        includedInWsp: true,
                        completedForAtr: false,
                        bbbeeCategoryCode: setaForm.bbbeeCategoryCode,
                        status: 'In Progress'
                      });
                      setIsAddingSeta(false);
                      setSetaForm({ ...setaForm, courseOrProgramTitle: '' });
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    Save to WSP/ATR Register
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Active WSP / ATR Training &amp; Learnership Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Learner &amp; B-BBEE Profile</th>
                    <th className="py-2.5 px-3">Course / Learnership Programme</th>
                    <th className="py-2.5 px-3">NQF &amp; B-BBEE Matrix Category</th>
                    <th className="py-2.5 px-3 text-right">Skills Spend (ZAR)</th>
                    <th className="py-2.5 px-3 text-right">SETA Grant Claim</th>
                    <th className="py-2.5 px-3">WSP / ATR Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {setaRecords
                    .filter(r => r.companyId === selectedCompany.id)
                    .map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{rec.employeeName}</div>
                          <div className="text-slate-500">
                            {rec.beeRaceGroup} · {rec.gender}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{rec.courseOrProgramTitle}</div>
                          <div className="text-slate-500">
                            {rec.programType} · Code: {rec.setaCode}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">{rec.nqfLevel}</div>
                          <div className="text-slate-500">{rec.bbbeeCategoryCode}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                          R{rec.costSpendZar.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-emerald-700">
                          R{rec.MandatoryGrantClaimableZar.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() =>
                              onUpdateSetaRecord(rec.id, {
                                status: rec.status === 'Completed' ? 'In Progress' : 'Completed',
                                completedForAtr: rec.status !== 'Completed'
                              })
                            }
                            className={`px-2.5 py-1 rounded text-xs font-semibold ${
                              rec.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {rec.status} (WSP {rec.completedForAtr ? '+ ATR Verified' : 'Logged'})
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 7: B-BBEE SUPPORT DASHBOARD & LIVE SCORE ESTIMATOR PLUGIN        */}
      {/* ===================================================================== */}
      {activeView === 'bbbee_support' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-700">
                Plugin 07 · DTIC Amended B-BBEE Codes of Good Practice
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                B-BBEE Support Dashboard, Live Scorecard Estimator &amp; Evidence Vault
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Track Ownership, Management Control &amp; Employment Equity (linked to employee B-BBEE race scores), Skills Development, Enterprise &amp; Supplier Development, and Socio-Economic Development.
              </p>
            </div>
            <div className="text-right font-mono tabular-nums">
              <div className="text-xs text-slate-500">Live Estimated Score</div>
              <div className="text-2xl font-bold text-emerald-700">
                {totalBbbeePoints} pts · {bbbeeStanding.level}
              </div>
              <div className="text-xs text-slate-600">{bbbeeStanding.recognition}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive 5-Element Live Score Estimator */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Live B-BBEE 5-Element Score Estimator (Adjust Sliders to Simulate Level Upgrade)
              </h3>

              {[
                {
                  key: 'ownershipScore' as const,
                  label: '1. Ownership (Voting Rights & Economic Interest)',
                  max: 25,
                  val: currentScorecard.ownershipScore
                },
                {
                  key: 'managementControlScore' as const,
                  label: `2. Management Control & Employment Equity (Avg Employee Race Score: ${averageBeeRaceScore}/10)`,
                  max: 19,
                  val: currentScorecard.managementControlScore
                },
                {
                  key: 'skillsDevelopmentScore' as const,
                  label: '3. Skills Development (WSP/ATR & Learnerships)',
                  max: 25,
                  val: currentScorecard.skillsDevelopmentScore
                },
                {
                  key: 'enterpriseSupplierDevScore' as const,
                  label: '4. Preferential Procurement, Enterprise & Supplier Development (ESD)',
                  max: 44,
                  val: currentScorecard.enterpriseSupplierDevScore
                },
                {
                  key: 'socioEconomicDevScore' as const,
                  label: '5. Socio-Economic Development (SED)',
                  max: 5,
                  val: currentScorecard.socioEconomicDevScore
                }
              ].map(el => (
                <div key={el.key} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{el.label}</span>
                    <span className="font-mono tabular-nums text-emerald-700">
                      {el.val.toFixed(1)} / {el.max} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={el.max}
                    step={0.5}
                    value={el.val}
                    onChange={e =>
                      onUpdateBbbeeScorecard(selectedCompany.id, {
                        ...currentScorecard,
                        [el.key]: Number(e.target.value)
                      })
                    }
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Areas Needing Improvement + Supporting Evidence Storage */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Strategic Areas Needing Improvement &amp; Supporting Evidence Storage
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                  <div className="font-bold">1. Management Control &amp; Senior EE Representation (+2.2 pts available)</div>
                  <p className="mt-0.5">
                    Promoting or appointing 1 additional Black Female candidate into Senior Management will increase Management Control from {currentScorecard.managementControlScore} to {(currentScorecard.managementControlScore + 2.2).toFixed(1)} pts.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <div className="font-bold">2. Skills Development Learnership Bonus (+3.5 pts available)</div>
                  <p className="mt-0.5">
                    Absorbing unemployed 18.2 SETA learners into permanent roles upon completion unlocks the 5 bonus points under the Skills Development element.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    SANAS Verification Supporting Evidence Vault
                  </span>
                  <button
                    onClick={() =>
                      onUploadDocument({
                        companyId: selectedCompany.id,
                        employeeId: companyEmployees[0]?.id || 'emp_01',
                        title: `B-BBEE Verification Pack (${currentScorecard.financialYear})`,
                        category: 'Statutory_Record',
                        fileType: 'PDF',
                        fileSize: '3.4 MB'
                      })
                    }
                    className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
                  >
                    + Archive Evidence to Vault
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {currentScorecard.verifiedEvidenceItems.map(item => (
                    <div key={item.id} className="py-2 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900">{item.documentTitle}</div>
                        <div className="text-slate-500">
                          {item.element} · Updated {item.updatedAt}
                        </div>
                      </div>
                      <span className="font-mono text-emerald-700 font-semibold shrink-0">
                        {item.verificationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable / Exportable Statutory Report Modal */}
      {generatedReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{generatedReportModal.title}</h3>
                <p className="text-xs text-slate-500">{generatedReportModal.subtitle}</p>
              </div>
              <button
                onClick={() => setGeneratedReportModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {generatedReportModal.content}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  onUploadDocument({
                    companyId: selectedCompany.id,
                    employeeId: companyEmployees[0]?.id || 'emp_01',
                    title: generatedReportModal.title,
                    category: 'Statutory_Record',
                    fileType: 'PDF',
                    fileSize: '1.6 MB'
                  });
                  setGeneratedReportModal(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Save Official Copy to Document Vault
              </button>
              <button
                onClick={() => setGeneratedReportModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
