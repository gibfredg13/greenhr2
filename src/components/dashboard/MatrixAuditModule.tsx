import React, { useState } from 'react';
import {
  Company,
  Employee,
  MatrixAuditRecord,
  MatrixFrameworkType,
  StandardizedTestResult,
  DiagnosticFrameworkTemplate,
  DiagnosticTestType,
  UserRole
} from '../../types';
import { DIAGNOSTIC_FRAMEWORKS_CATALOG } from '../../data/seedData';
import {
  Target,
  Grid,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  Play,
  Award,
  Search,
  Filter,
  Users,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  Sparkles,
  Download,
  Sliders,
  BarChart3,
  Scale,
  Clock,
  Layers
} from 'lucide-react';

interface MatrixAuditModuleProps {
  selectedCompany: Company;
  employees: Employee[];
  matrixAudits: MatrixAuditRecord[];
  diagnosticResults: StandardizedTestResult[];
  currentRole?: UserRole;
  onAddMatrixAudit: (audit: Partial<MatrixAuditRecord>) => Promise<void>;
  onUpdateMatrixAudit?: (id: string, data: Partial<MatrixAuditRecord>) => Promise<void>;
  onAddDiagnosticTest: (result: Partial<StandardizedTestResult>) => Promise<void>;
  onOpenAiAssistantWithContext?: (context: string) => void;
}

export const MatrixAuditModule: React.FC<MatrixAuditModuleProps> = ({
  selectedCompany,
  employees,
  matrixAudits,
  diagnosticResults,
  currentRole = 'consultant',
  onAddMatrixAudit,
  onUpdateMatrixAudit,
  onAddDiagnosticTest,
  onOpenAiAssistantWithContext
}) => {
  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);
  const companyAudits = matrixAudits.filter(a => a.companyId === selectedCompany.id);
  const companyDiagnostics = diagnosticResults.filter(d => d.companyId === selectedCompany.id);

  // Sub-tabs
  const [activeTab, setActiveTab] = useState<'nine_box' | 'heatmaps' | 'diagnostics' | 'registry'>('nine_box');

  // Modals
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);
  const [selectedAuditForInspection, setSelectedAuditForInspection] = useState<MatrixAuditRecord | null>(null);
  const [selectedTestForInspection, setSelectedTestForInspection] = useState<StandardizedTestResult | null>(null);

  // Filter state for Registry
  const [searchQuery, setSearchQuery] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('All');

  // ---------------- KICK OFF MATRIX AUDIT FORM STATE ---------------- //
  const [auditForm, setAuditForm] = useState({
    employeeId: companyEmployees[0]?.id || '',
    frameworkType: 'nine_box_grid' as MatrixFrameworkType,
    auditTitle: '2026 Comprehensive Talent & Competency Audit',
    auditDate: new Date().toISOString().split('T')[0],
    auditorName: 'Naledi Sithole',
    auditorRole: 'Lead HR Consultant',
    xScore: 4.0, // Performance or Primary Skill
    yScore: 4.2, // Potential or Criticality
    comp1Name: 'Statutory & BCEA Compliance',
    comp1Score: 4,
    comp2Name: 'Operational Execution & Quality',
    comp2Score: 4,
    comp3Name: 'Leadership & Conflict Agility',
    comp3Score: 4,
    comp4Name: 'Continuous Skills Growth',
    comp4Score: 5,
    findingsAndStrengths: 'Demonstrates exemplary role consistency, prompt statutory adherence, and high peer reliability.',
    developmentAreas: 'Needs further cross-training in advanced supply-chain ERP tools and senior supervisory delegation.',
    recommendedAction: 'Place on accelerated succession talent bench; sponsor NQF Level 6 credential via Workplace Skills Plan.',
    nextAuditDueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Finalized' as const,
    assignedToEmployee: true,
    optionalEvaluationEnabled: true,
    evaluationPrompt: 'Provide your self-reflection on your current performance metrics, key achievements, and areas where you would like additional HRaaS coaching.'
  });

  // Calculate 9-box quadrant name dynamically based on X and Y
  const calculate9BoxQuadrant = (x: number, y: number, framework: MatrixFrameworkType): string => {
    if (framework === 'nine_box_grid') {
      if (y >= 3.8 && x >= 3.8) return 'High Potential Star (Top Right)';
      if (y >= 3.8 && x >= 2.6) return 'High Potential Contender';
      if (y >= 3.8) return 'Enigma / High Potential Dilemma';
      if (y >= 2.6 && x >= 3.8) return 'Consistent High Performer';
      if (y >= 2.6 && x >= 2.6) return 'Core Performer (Center)';
      if (y >= 2.6) return 'Effective / Developing Performer';
      if (x >= 3.8) return 'Trusted Professional / Specialist';
      if (x >= 2.6) return 'Adequate Performer';
      return 'Underperformer / Action Required';
    } else if (framework === 'retention_risk_matrix') {
      if (y >= 3.5 && x >= 3.5) return 'Critical Risk / High Impact of Loss';
      if (y >= 3.5) return 'High Flight Risk';
      if (x >= 3.5) return 'High Impact Pillar';
      return 'Low Risk / Stable';
    } else if (framework === 'bbee_skills_audit') {
      return y >= 3.8 ? 'Priority Employment Equity Trainee' : 'Core Developmental Contender';
    }
    return 'Proficient Specialist';
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(e => e.id === auditForm.employeeId) || companyEmployees[0];
    const quadrant = calculate9BoxQuadrant(auditForm.xScore, auditForm.yScore, auditForm.frameworkType);
    const overallPercent = Math.round(((auditForm.xScore + auditForm.yScore) / 10) * 100);

    const competencyRatings: Record<string, number> = {
      [auditForm.comp1Name]: auditForm.comp1Score,
      [auditForm.comp2Name]: auditForm.comp2Score,
      [auditForm.comp3Name]: auditForm.comp3Score,
      [auditForm.comp4Name]: auditForm.comp4Score
    };

    await onAddMatrixAudit({
      companyId: selectedCompany.id,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      auditorName: auditForm.auditorName,
      auditorRole: auditForm.auditorRole,
      frameworkType: auditForm.frameworkType,
      auditTitle: auditForm.auditTitle,
      auditDate: auditForm.auditDate,
      xScore: auditForm.xScore,
      yScore: auditForm.yScore,
      quadrantOrCategory: quadrant,
      overallRatingPercent: overallPercent,
      competencyRatings,
      findingsAndStrengths: auditForm.findingsAndStrengths,
      developmentAreas: auditForm.developmentAreas,
      recommendedAction: auditForm.recommendedAction,
      nextAuditDueDate: auditForm.nextAuditDueDate,
      status: auditForm.status,
      assignedToEmployee: auditForm.assignedToEmployee,
      optionalEvaluationEnabled: auditForm.optionalEvaluationEnabled,
      evaluationPrompt: auditForm.evaluationPrompt
    });

    setIsAuditModalOpen(false);
  };

  // ---------------- STANDARDIZED DIAGNOSTIC TEST RUNNER STATE ---------------- //
  const [selectedTestTemplateId, setSelectedTestTemplateId] = useState<DiagnosticTestType>('compliance_bcea_popia');
  const [testEmployeeId, setTestEmployeeId] = useState<string>(companyEmployees[0]?.id || '');
  const [evaluatorName, setEvaluatorName] = useState<string>('Naledi Sithole');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { optionId: string; score: number }>>({});
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [completedTestResult, setCompletedTestResult] = useState<StandardizedTestResult | null>(null);

  const activeTemplate = DIAGNOSTIC_FRAMEWORKS_CATALOG.find(t => t.id === selectedTestTemplateId) || DIAGNOSTIC_FRAMEWORKS_CATALOG[0];

  const handleStartTest = (templateId: DiagnosticTestType) => {
    setSelectedTestTemplateId(templateId);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTestCompleted(false);
    setCompletedTestResult(null);
    setIsTestRunnerOpen(true);
  };

  const handleSelectOption = (questionId: string, optionId: string, score: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: { optionId, score }
    }));
  };

  const handleFinishTest = async () => {
    const emp = companyEmployees.find(e => e.id === testEmployeeId) || companyEmployees[0];
    let totalScoreAchieved = 0;
    let totalPossible = activeTemplate.questions.length * 10;

    activeTemplate.questions.forEach(q => {
      const answer = selectedAnswers[q.id];
      if (answer) {
        totalScoreAchieved += answer.score;
      }
    });

    const scorePercentage = Math.round((totalScoreAchieved / (totalPossible || 1)) * 100);
    const percentileRank = Math.min(99, Math.max(30, Math.round(scorePercentage * 0.98 + (Math.random() * 4 - 2))));

    let proficiencyBand: 'Exemplary' | 'Proficient' | 'Needs Development' | 'Critical Compliance Gap' = 'Needs Development';
    if (scorePercentage >= 90) proficiencyBand = 'Exemplary';
    else if (scorePercentage >= 75) proficiencyBand = 'Proficient';
    else if (scorePercentage >= 50) proficiencyBand = 'Needs Development';
    else proficiencyBand = 'Critical Compliance Gap';

    // Category breakdown
    const categoryBreakdown = activeTemplate.categories.map(cat => {
      const catQuestions = activeTemplate.questions.filter(q => q.category === cat);
      let catScore = 0;
      catQuestions.forEach(q => {
        catScore += (selectedAnswers[q.id]?.score || 0);
      });
      const maxScore = Math.max(10, catQuestions.length * 10);
      return {
        category: cat,
        score: catScore,
        maxScore,
        percentage: Math.round((catScore / maxScore) * 100)
      };
    });

    const certNumber = `GH-DIAG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const resultPayload: StandardizedTestResult = {
      id: `diag_res_${Date.now()}`,
      companyId: selectedCompany.id,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      evaluatorName,
      testType: activeTemplate.id,
      testTitle: activeTemplate.title,
      testDate: new Date().toISOString().split('T')[0],
      durationMinutes: activeTemplate.estimatedMinutes,
      scoreAchieved: totalScoreAchieved,
      totalPossibleScore: totalPossible,
      scorePercentage,
      percentileRank,
      proficiencyBand,
      categoryBreakdown,
      diagnosticAnalysis: `${emp.firstName} completed the ${activeTemplate.title} achieving a score of ${scorePercentage}% (${percentileRank}th national normative percentile). Demonstrates ${proficiencyBand.toLowerCase()} aptitude across South African statutory benchmarks.`,
      prescribedInterventions: [
        `File formal Diagnostic Certificate ${certNumber} in employee personnel vault`,
        scorePercentage >= 80 ? 'Fast-track for statutory compliance leadership tasks' : 'Schedule refresher 1-on-1 counseling within 30 days'
      ],
      certificateNumber: certNumber,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCompletedTestResult(resultPayload);
    setTestCompleted(true);
    await onAddDiagnosticTest(resultPayload);
  };

  // 9-Box Grid coordinate map (3 rows x 3 cols)
  // Rows: High Potential (3), Medium Potential (2), Low Potential (1)
  // Cols: Low Performance (1), Medium Performance (2), High Performance (3)
  const nineBoxGridCells = [
    { row: 3, col: 1, label: 'Enigma / Rough Diamond', sub: 'High Potential · Low Perf', bg: 'bg-amber-50/70 border-amber-200' },
    { row: 3, col: 2, label: 'Growth Contender', sub: 'High Potential · Med Perf', bg: 'bg-emerald-50/60 border-emerald-200' },
    { row: 3, col: 3, label: '★ High Potential Star', sub: 'High Potential · High Perf', bg: 'bg-emerald-100/80 border-emerald-300 font-bold' },
    { row: 2, col: 1, label: 'Dilemma / Inconsistent', sub: 'Med Potential · Low Perf', bg: 'bg-slate-50 border-slate-200' },
    { row: 2, col: 2, label: 'Core Performer', sub: 'Med Potential · Med Perf', bg: 'bg-slate-100/80 border-slate-300' },
    { row: 2, col: 3, label: 'High Performer', sub: 'Med Potential · High Perf', bg: 'bg-emerald-50/60 border-emerald-200' },
    { row: 1, col: 1, label: 'Risk / Underperformer', sub: 'Low Potential · Low Perf', bg: 'bg-rose-50/60 border-rose-200 text-rose-900' },
    { row: 1, col: 2, label: 'Adequate Performer', sub: 'Low Potential · Med Perf', bg: 'bg-slate-50 border-slate-200' },
    { row: 1, col: 3, label: 'Trusted Specialist', sub: 'Low Potential · High Perf', bg: 'bg-slate-100/80 border-slate-300' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Title and Kick-Off CTAs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{selectedCompany.name}</span>
            <span>&middot;</span>
            <span className="text-emerald-700 font-mono font-bold">HR Practice Diagnostics &amp; Frameworks</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Matrix &amp; Grid-Based Frameworks Audits
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Administer 9-Box grids, EE skills matrices, and standardized diagnostic test batteries attached directly to employee personal files.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Kick Off Matrix Audit
          </button>
          <button
            onClick={() => handleStartTest('compliance_bcea_popia')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
            Perform Diagnostic Test
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1">
        {[
          { id: 'nine_box', label: '9-Box Talent & Succession Grid', icon: Grid },
          { id: 'heatmaps', label: 'Competency & EE Heatmaps', icon: Sliders },
          { id: 'diagnostics', label: 'Standardized Diagnostic Catalog', icon: Award },
          { id: 'registry', label: `Personnel Audit & Test Registry (${companyAudits.length + companyDiagnostics.length})`, icon: Layers }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 9-BOX TALENT & SUCCESSION GRID */}
      {activeTab === 'nine_box' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive 9-Box Talent &amp; Potential Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Plot employees by Performance (X-Axis) vs. Potential (Y-Axis). Click any quadrant to inspect placed personnel.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  High Potential
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Core Bench
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  Development Gap
                </span>
              </div>
            </div>

            {/* Visual 3x3 Canvas Grid */}
            <div className="grid grid-cols-3 gap-3 min-h-[460px]">
              {nineBoxGridCells.map((cell, idx) => {
                // Find audits belonging in this quadrant
                const matchedAudits = companyAudits.filter(a => {
                  if (a.frameworkType !== 'nine_box_grid') return false;
                  const x = a.xScore ?? a.xAxisScore ?? 3;
                  const y = a.yScore ?? a.yAxisScore ?? 3;
                  // Map X (1-5) to 1,2,3
                  const colIdx = x >= 3.8 ? 3 : x >= 2.6 ? 2 : 1;
                  // Map Y (1-5) to 1,2,3
                  const rowIdx = y >= 3.8 ? 3 : y >= 2.6 ? 2 : 1;
                  return colIdx === cell.col && rowIdx === cell.row;
                });

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between ${cell.bg} transition-all hover:shadow-xs`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                          {cell.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold bg-white/70 px-1.5 py-0.2 rounded">
                          {matchedAudits.length} staff
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{cell.sub}</p>
                    </div>

                    {/* Placed Employees */}
                    <div className="space-y-1.5 my-2">
                      {matchedAudits.map(a => (
                        <button
                          key={a.id}
                          onClick={() => setSelectedAuditForInspection(a)}
                          className="w-full p-2 bg-white/95 rounded-lg border border-slate-200 hover:border-emerald-500 text-left transition-all shadow-2xs group flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                              {a.employeeName}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Score: {a.overallRatingPercent}% &middot; {a.auditDate}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono text-right">
                      Col {cell.col} &middot; Row {cell.row}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Axis Labels */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1 font-mono">
                &larr; Low Sustained Performance (X-Axis)
              </span>
              <span className="text-emerald-800 uppercase tracking-wider text-[11px]">
                BCEA &amp; NQF Evaluated
              </span>
              <span className="flex items-center gap-1 font-mono">
                High Sustained Performance (X-Axis) &rarr;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPETENCY & EE HEATMAPS */}
      {activeTab === 'heatmaps' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Employment Equity &amp; Skills Audit Heatmaps
                </h3>
                <p className="text-xs text-slate-500">
                  Multi-dimension scoring matrix aligned with South African EEA designated targets and scarce technical skills.
                </p>
              </div>

              <button
                onClick={() => {
                  setAuditForm(prev => ({ ...prev, frameworkType: 'bbee_skills_audit' }));
                  setIsAuditModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                Conduct EE Skills Audit
              </button>
            </div>

            <div className="space-y-3">
              {companyEmployees.map(emp => {
                const audit = companyAudits.find(a => a.employeeId === emp.id);

                return (
                  <div
                    key={emp.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 text-xs">{emp.firstName} {emp.lastName}</strong>
                          <span className="text-[11px] text-slate-500 font-mono">({emp.jobTitle})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          ID: {emp.idNumber} &middot; Ref: {emp.employeeNumber}
                        </p>
                      </div>

                      {audit ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {audit.quadrantOrCategory} ({audit.overallRatingPercent}%)
                          </span>
                          <button
                            onClick={() => setSelectedAuditForInspection(audit)}
                            className="text-xs text-emerald-700 hover:underline font-semibold"
                          >
                            Inspect Dossier &rarr;
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAuditForm(prev => ({ ...prev, employeeId: emp.id }));
                            setIsAuditModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg"
                        >
                          + Kick Off Audit for {emp.firstName}
                        </button>
                      )}
                    </div>

                    {/* Competency Ratings Heatmap Bar */}
                    {audit && audit.competencyRatings && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                        {Object.entries(audit.competencyRatings).map(([dim, score]) => (
                          <div key={dim} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                            <div className="text-[11px] font-semibold text-slate-600 truncate">{dim}</div>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span
                                    key={star}
                                    className={`w-3.5 h-1.5 rounded-full ${star <= score ? 'bg-emerald-600' : 'bg-slate-200'}`}
                                  />
                                ))}
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-800">{score}/5</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STANDARDIZED DIAGNOSTIC TESTS CATALOG & RUNNER */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DIAGNOSTIC_FRAMEWORKS_CATALOG.map(t => (
              <div
                key={t.id}
                className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Award className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {t.estimatedMinutes} Mins Norm
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">{t.title}</h4>
                    <p className="text-[11px] font-bold text-emerald-700 font-mono mt-0.5">{t.standardNorm}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{t.description}</p>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Evaluated Dimensions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {t.categories.map(c => (
                        <span key={c} className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    {t.questions.length} Scenarios &middot; Auto-certifies
                  </span>
                  <button
                    onClick={() => handleStartTest(t.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-slate-950 text-slate-950" />
                    Administer Battery
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PERSONNEL AUDIT & TEST REGISTRY */}
      {activeTab === 'registry' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by employee name or certificate ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Framework:</span>
              <select
                value={frameworkFilter}
                onChange={(e) => setFrameworkFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
              >
                <option value="All">All Frameworks &amp; Batteries</option>
                <option value="nine_box_grid">9-Box Talent Grid</option>
                <option value="bbee_skills_audit">B-BBEE Skills Audit</option>
                <option value="retention_risk_matrix">Retention Risk Matrix</option>
                <option value="compliance_bcea_popia">BCEA / POPIA Diagnostic</option>
                <option value="operational_aptitude">Operational Benchmark</option>
              </select>
            </div>
          </div>

          {/* Registry Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Subject Employee</th>
                  <th className="py-3 px-4">Framework / Diagnostic</th>
                  <th className="py-3 px-4">Audit Date</th>
                  <th className="py-3 px-4">Score / Benchmark</th>
                  <th className="py-3 px-4">Classification / Placement</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Matrix Audits */}
                {companyAudits.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{a.employeeName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Auditor: {a.auditorName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{a.auditTitle}</span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-slate-500 uppercase">{a.frameworkType.replace(/_/g, ' ')}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateMatrixAudit?.(a.id, { assignedToEmployee: !a.assignedToEmployee })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                            a.assignedToEmployee
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          Assigned to Employee: {a.assignedToEmployee ? 'ON' : 'OFF'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateMatrixAudit?.(a.id, { optionalEvaluationEnabled: !a.optionalEvaluationEnabled })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                            a.optionalEvaluationEnabled
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          Optional Evaluation: {a.optionalEvaluationEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{a.auditDate}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold font-mono text-emerald-700">{a.overallRatingPercent}%</span>
                      {a.employeeSelfEvaluationResponse && (
                        <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                          Self-Eval Submitted
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        {a.quadrantOrCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAuditForInspection(a)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Diagnostic Tests */}
                {companyDiagnostics.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{d.employeeName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Ref: {d.certificateNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-indigo-900">{d.testTitle}</span>
                      <div className="text-[10px] text-indigo-600 uppercase">Standardized Diagnostic Battery</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{d.testDate}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold font-mono text-indigo-700">{d.scorePercentage}%</div>
                      <div className="text-[10px] text-slate-500 font-mono">{d.percentileRank}th percentile</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-200">
                        {d.proficiencyBand}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedTestForInspection(d)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        View Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 1: KICK OFF MATRIX AUDIT ---------------- */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setIsAuditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleAuditSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Kick Off Employee Matrix &amp; Grid Audit
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluates performance, potential, and compliance. Results are permanently attached to the personnel file dossier.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Employee *</label>
                  <select
                    value={auditForm.employeeId}
                    onChange={(e) => setAuditForm({ ...auditForm, employeeId: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {companyEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} &middot; {emp.jobTitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Framework Model *</label>
                  <select
                    value={auditForm.frameworkType}
                    onChange={(e) => setAuditForm({ ...auditForm, frameworkType: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold text-emerald-800"
                  >
                    <option value="nine_box_grid">9-Box Talent &amp; Succession Grid</option>
                    <option value="bbee_skills_audit">B-BBEE / EEA Skills Development Audit</option>
                    <option value="retention_risk_matrix">Retention Risk vs Criticality Matrix</option>
                    <option value="competency_heatmap">Competency &amp; Performance Heatmap</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Audit Title *</label>
                  <input
                    type="text"
                    required
                    value={auditForm.auditTitle}
                    onChange={(e) => setAuditForm({ ...auditForm, auditTitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Audit Date *</label>
                  <input
                    type="date"
                    required
                    value={auditForm.auditDate}
                    onChange={(e) => setAuditForm({ ...auditForm, auditDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Auditor / Practitioner *</label>
                  <input
                    type="text"
                    required
                    value={auditForm.auditorName}
                    onChange={(e) => setAuditForm({ ...auditForm, auditorName: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Matrix Coordinate Sliders */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <span>Grid Placement Coordinates</span>
                  <span className="text-emerald-700 font-mono">
                    {calculate9BoxQuadrant(auditForm.xScore, auditForm.yScore, auditForm.frameworkType)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Performance / Primary Metric (X):</span>
                      <strong className="font-mono text-emerald-700">{auditForm.xScore.toFixed(1)} / 5.0</strong>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={auditForm.xScore}
                      onChange={(e) => setAuditForm({ ...auditForm, xScore: parseFloat(e.target.value) })}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Potential / Criticality Metric (Y):</span>
                      <strong className="font-mono text-emerald-700">{auditForm.yScore.toFixed(1)} / 5.0</strong>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={auditForm.yScore}
                      onChange={(e) => setAuditForm({ ...auditForm, yScore: parseFloat(e.target.value) })}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Rubric Findings */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Key Findings &amp; Strengths *</label>
                  <textarea
                    rows={2}
                    required
                    value={auditForm.findingsAndStrengths}
                    onChange={(e) => setAuditForm({ ...auditForm, findingsAndStrengths: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Growth Gaps &amp; Development Areas *</label>
                  <textarea
                    rows={2}
                    required
                    value={auditForm.developmentAreas}
                    onChange={(e) => setAuditForm({ ...auditForm, developmentAreas: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recommended Action &amp; Statutory Trajectory *</label>
                  <input
                    type="text"
                    required
                    value={auditForm.recommendedAction}
                    onChange={(e) => setAuditForm({ ...auditForm, recommendedAction: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                {/* Assignable to Employee & Click ON/OFF Optional Evaluation */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-emerald-950 text-xs">
                        Assign Matrix Framework to Employee Portal &amp; Optional Evaluation
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        Click ON or OFF to assign this framework to the employee and optionally request their self-evaluation.
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAuditForm(prev => ({ ...prev, assignedToEmployee: !prev.assignedToEmployee }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          auditForm.assignedToEmployee
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-white text-slate-600 border-slate-300'
                        }`}
                      >
                        Assign to Employee: {auditForm.assignedToEmployee ? 'ON' : 'OFF'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setAuditForm(prev => ({ ...prev, optionalEvaluationEnabled: !prev.optionalEvaluationEnabled }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          auditForm.optionalEvaluationEnabled
                            ? 'bg-amber-500 text-slate-950 border-amber-600'
                            : 'bg-white text-slate-600 border-slate-300'
                        }`}
                      >
                        Optional Evaluation: {auditForm.optionalEvaluationEnabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>

                  {auditForm.optionalEvaluationEnabled && (
                    <div>
                      <label className="block font-semibold text-emerald-950 mb-1 text-[11px]">
                        Employee Self-Evaluation Prompt / Question:
                      </label>
                      <input
                        type="text"
                        value={auditForm.evaluationPrompt}
                        onChange={(e) => setAuditForm({ ...auditForm, evaluationPrompt: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-emerald-300 rounded-lg bg-white text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all"
                >
                  Finalize, Assign &amp; Save to Personnel File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: STANDARDIZED DIAGNOSTIC TEST RUNNER ---------------- */}
      {isTestRunnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setIsTestRunnerOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {!testCompleted ? (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                      Standardized Diagnostic Battery
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Step {currentQuestionIndex + 1} of {activeTemplate.questions.length}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{activeTemplate.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">{activeTemplate.standardNorm}</p>
                </div>

                {/* Candidate Selector */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Test Candidate:</label>
                    <select
                      value={testEmployeeId}
                      onChange={(e) => setTestEmployeeId(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-medium"
                    >
                      {companyEmployees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName} &middot; {emp.jobTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Evaluator / Invigilator:</label>
                    <input
                      type="text"
                      value={evaluatorName}
                      onChange={(e) => setEvaluatorName(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-medium"
                    />
                  </div>
                </div>

                {/* Question Prompt Card */}
                {(() => {
                  const currentQ = activeTemplate.questions[currentQuestionIndex];
                  const chosen = selectedAnswers[currentQ.id];

                  return (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {currentQ.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {currentQ.prompt}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2 pt-2">
                        {currentQ.options.map((opt) => {
                          const isSelected = chosen?.optionId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectOption(currentQ.id, opt.id, opt.score)}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                                isSelected
                                  ? 'bg-emerald-50/90 border-emerald-500 text-slate-900 shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400'
                              }`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <div>
                                <span className="font-medium">{opt.text}</span>
                                {isSelected && opt.rationale && (
                                  <p className="text-[10px] text-emerald-800 mt-1 font-mono">
                                    Statutory Rationale: {opt.rationale}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Navigation Next / Prev */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 disabled:opacity-30"
                  >
                    &larr; Previous Question
                  </button>

                  {currentQuestionIndex < activeTemplate.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                    >
                      Next Question &rarr;
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishTest}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                    >
                      Complete Diagnostic &amp; Generate Certificate &rarr;
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Diagnostic Result Summary & Certificate */
              completedTestResult && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-950 text-white rounded-xl space-y-2 border border-emerald-800 text-center">
                    <Award className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h3 className="text-xl font-bold tracking-tight">
                      Standardized Diagnostic Certified
                    </h3>
                    <p className="text-xs text-emerald-200 font-mono">
                      Ref: {completedTestResult.certificateNumber} &middot; Evaluated under {activeTemplate.standardNorm}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-xl font-bold font-mono text-emerald-700">{completedTestResult.scorePercentage}%</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Raw Score</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-xl font-bold font-mono text-indigo-700">{completedTestResult.percentileRank}th</div>
                      <div className="text-[10px] text-slate-500 font-semibold">National Percentile</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-xs font-bold text-slate-800 mt-1">{completedTestResult.proficiencyBand}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Proficiency Band</div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  {completedTestResult.categoryBreakdown && completedTestResult.categoryBreakdown.length > 0 && (
                    <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                        Diagnostic Category Scores
                      </div>
                      {completedTestResult.categoryBreakdown.map(cat => (
                        <div key={cat.category} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-700 font-medium">{cat.category}</span>
                            <span className="font-mono font-bold text-slate-900">{cat.percentage}% ({cat.score}/{cat.maxScore})</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-1.5 rounded-full"
                              style={{ width: `${cat.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {completedTestResult.prescribedInterventions && completedTestResult.prescribedInterventions.length > 0 && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-950">
                      <strong>Prescribed Interventions:</strong>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-emerald-900">
                        {completedTestResult.prescribedInterventions.map((int, i) => (
                          <li key={i}>{int}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => setIsTestRunnerOpen(false)}
                      className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
                    >
                      Close &amp; View in Registry
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: INSPECT AUDIT REPORT DOSSIER ---------------- */}
      {selectedAuditForInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAuditForInspection(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-slate-200 pb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                {selectedAuditForInspection.frameworkType.replace(/_/g, ' ').toUpperCase()}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{selectedAuditForInspection.auditTitle}</h3>
              <p className="text-xs text-slate-500 font-mono">
                Candidate: {selectedAuditForInspection.employeeName} &middot; Audited: {selectedAuditForInspection.auditDate}
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between font-bold text-emerald-950">
                <span>Placement Classification:</span>
                <span className="font-mono">{selectedAuditForInspection.quadrantOrCategory}</span>
              </div>
              <div className="flex justify-between text-emerald-800 text-[11px]">
                <span>Overall Rating Score:</span>
                <span className="font-mono font-bold">{selectedAuditForInspection.overallRatingPercent}%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <strong className="text-slate-800">Key Strengths &amp; Findings:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{selectedAuditForInspection.findingsAndStrengths}</p>
              </div>
              <div>
                <strong className="text-slate-800">Development Areas:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{selectedAuditForInspection.developmentAreas}</p>
              </div>
              <div>
                <strong className="text-slate-800">Recommended Action:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{selectedAuditForInspection.recommendedAction}</p>
              </div>
              {selectedAuditForInspection.employeeSelfEvaluationResponse && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-950">
                    Employee Submitted Self-Evaluation (Self Score: {selectedAuditForInspection.employeeSelfScoreX || 4}/5 &amp; {selectedAuditForInspection.employeeSelfScoreY || 4}/5):
                  </div>
                  <p className="text-amber-900 text-[11px] italic">
                    "{selectedAuditForInspection.employeeSelfEvaluationResponse}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                Next Review: {selectedAuditForInspection.nextAuditDueDate || 'N/A'}
              </span>
              <button
                onClick={() => setSelectedAuditForInspection(null)}
                className="px-4 py-1.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 4: INSPECT TEST CERTIFICATE ---------------- */}
      {selectedTestForInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTestForInspection(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 bg-indigo-950 text-white rounded-xl text-center space-y-1">
              <Award className="w-8 h-8 text-indigo-400 mx-auto" />
              <h3 className="text-base font-bold">Standardized Diagnostic Certificate</h3>
              <p className="text-[11px] text-indigo-200 font-mono">
                Ref: {selectedTestForInspection.certificateNumber}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Employee:</span>
                <strong className="text-slate-900">{selectedTestForInspection.employeeName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Diagnostic Battery:</span>
                <span className="text-slate-800 font-semibold">{selectedTestForInspection.testTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Evaluator:</span>
                <span className="text-slate-800">{selectedTestForInspection.evaluatorName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Percentage &amp; Percentile:</span>
                <strong className="font-mono text-indigo-700">
                  {selectedTestForInspection.scorePercentage}% &middot; {selectedTestForInspection.percentileRank}th Percentile
                </strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Proficiency Band:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
                  {selectedTestForInspection.proficiencyBand}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <strong className="text-slate-800">Diagnostic Analysis:</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {selectedTestForInspection.diagnosticAnalysis}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedTestForInspection(null)}
                className="px-4 py-1.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg text-xs"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
