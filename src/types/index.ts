export type UserRole = 'super_admin' | 'consultant' | 'company_admin' | 'manager' | 'employee';

export type ReportingPluginId =
  | 'employment_equity'
  | 'bcea_compliance'
  | 'popia_compliance'
  | 'integrated_leave'
  | 'disciplinary_labour'
  | 'skills_seta'
  | 'bbbee_support';

export type BeeRaceGroup = 'African' | 'Coloured' | 'Indian' | 'White' | 'Foreign National';

export type OccupationalLevel =
  | 'Top Management'
  | 'Senior Management'
  | 'Professionally Qualified'
  | 'Skilled Technical'
  | 'Semi-Skilled'
  | 'Unskilled';

export interface Company {
  id: string;
  name: string;
  tradingName?: string;
  registrationNumber: string;
  industry: string;
  payeNumber: string;
  uifNumber: string;
  coidaNumber: string;
  sdlNumber: string;
  bbbeeLevel: number;
  complianceScore: number;
  employeeCount: number;
  contactEmail: string;
  contactPhone: string;
  city: string;
  province: string;
  monthlyRetainerZar: number;
  hourlyRateZar: number;
  createdAt: string;
  enabledReportingPlugins?: ReportingPluginId[];
  setaName?: string;
}

export interface Employee {
  id: string;
  companyId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string; // 13-digit SA ID
  passportNumber?: string;
  taxNumber: string;
  department: string;
  jobTitle: string;
  managerName?: string;
  contractType: 'Permanent' | 'Fixed-Term' | 'Temporary' | 'Executive';
  startDate: string;
  probationEndDate?: string;
  salaryZar: number;
  salaryFrequency: 'Monthly' | 'Bi-Weekly' | 'Weekly';
  medicalAidScheme?: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  leaveBalances: {
    annual: number; // In days (BCEA min 21 days consecutive / 15 working days)
    sick: number; // In days (30 days per 36-month cycle)
    familyResponsibility: number; // 3 days per annual cycle
    parental: number; // 10 consecutive days
    maternity: number; // 4 consecutive months
    adoption?: number; // 10 consecutive weeks (BCEA Section 25B)
    study: number;
  };
  fileCompletenessScore: number; // 0 - 100%
  status: 'Active' | 'On Leave' | 'Suspended' | 'Resigned' | 'Terminated';

  // B-BBEE Race Classification & Recognition Score + Employment Equity & Plugin Overrides
  beeRaceGroup?: BeeRaceGroup;
  gender?: 'Male' | 'Female';
  hasDisability?: boolean;
  occupationalLevel?: OccupationalLevel;
  beeRaceScorePoints?: number; // Individual B-BBEE Scorecard Recognition Points (0 - 10 scale)
  weeklyHoursScheduled?: number; // BCEA max 45 ordinary hours/week
  monthlyOvertimeHours?: number; // BCEA max 10 hours/week (~40/month)
  sundayPublicHolidayShifts?: number;
  popiaConsentSigned?: boolean;
  popiaConsentDate?: string;
  enabledReportingPlugins?: ReportingPluginId[];
}

export type StatuteCategory = 'BCEA' | 'LRA' | 'Labour Relations Act' | 'POPIA' | 'COIDA' | 'UIF' | 'Employment Equity' | 'Skills Development' | 'B-BBEE';

export interface ComplianceEvent {
  id: string;
  companyId: string;
  statute: StatuteCategory;
  title: string;
  description: string;
  dueDate: string;
  frequency: 'Monthly' | 'Annual' | 'Ad-hoc' | 'Bi-Annual';
  status: 'Compliant' | 'Pending' | 'Action Required' | 'Overdue';
  penaltyRisk: string;
  responsiblePerson: string;
  reminderSent: boolean;
  notes?: string;
}

export type DisciplinaryType = 'Misconduct' | 'Poor Work Performance' | 'Incapacity (Ill Health)' | 'Insubordination' | 'Breach of Confidentiality/POPIA' | 'Gross Dishonesty';
export type DisciplinaryStage = 'Verbal Warning' | 'Written Warning' | 'Final Written Warning' | 'Notice of Hearing' | 'Sanction Issued' | 'CCMA Referral';

export interface DisciplinaryCase {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  type: DisciplinaryType;
  stage: DisciplinaryStage;
  incidentDate: string;
  hearingDate?: string;
  hearingOfficer?: string;
  summary: string;
  validUntil?: string; // Warnings typically valid for 3 or 6 months under SA law
  evidenceFiles: string[];
  status: 'Open' | 'Investigation' | 'Hearing Scheduled' | 'Sanctioned' | 'Closed' | 'CCMA Dispute';
  proceduralChecklist: {
    writtenNoticeGiven48HoursPrior: boolean;
    chargesClearlyDetailed: boolean;
    rightsExplainedToEmployee: boolean;
    rightToShopStewardOrColleague: boolean;
    interpreterProvidedIfRequired: boolean;
    evidencePresentedAndCrossExamined: boolean;
    mitigatingFactorsConsidered: boolean;
  };
}

export interface LeaveRequest {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Annual' | 'Sick' | 'Family Responsibility' | 'Parental' | 'Maternity' | 'Adoption' | 'Study';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
  medicalCertificateRequired: boolean;
  hasMedicalCertificate: boolean;
  appliedDate: string;
  reviewedBy?: string;
}

export interface TimeEntry {
  id: string;
  companyId: string;
  consultantName: string;
  date: string;
  hours: number;
  rateZar: number;
  project: string;
  description: string;
  isBilled: boolean;
  invoiceId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  date: string;
  dueDate: string;
  items: {
    description: string;
    hours: number;
    rateZar: number;
    amountZar: number;
  }[];
  subtotalZar: number;
  vatZar: number; // 15% South African VAT
  totalZar: number;
  status: 'Draft' | 'Sent' | 'Paid';
}

export interface EmployeeDocument {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName?: string;
  category: 'Contract' | 'ID/Passport' | 'POPIA Consent' | 'Medical' | 'Disciplinary' | 'Performance' | 'Tax/IRP5' | 'Statutory_Record' | string;
  title: string;
  fileType?: string;
  uploadedAt: string;
  expiryDate?: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  fileSize: string;
}

export type SessionType = 'teams' | 'phone' | 'in_person';

export interface ConsultantBooking {
  id: string;
  companyId: string;
  companyName?: string;
  employeeId: string;
  employeeName?: string;
  employeeEmail?: string;
  employeeRole?: string;
  consultantId?: string;
  consultantName: string;
  sessionType: SessionType;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 - 09:45"
  reasonWhy: string;
  detailsWhat?: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  meetingLinkOrLocation?: string;
  createdAt: string;
  notes?: string;
}

export interface BlockedTimeSlot {
  id: string;
  consultantName: string;
  date: string;
  timeSlot: string;
  reason: string;
  createdAt: string;
}

export type RecurringCadence = 'one_off' | 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly';

export type FineGrainPermissionLevel =
  | 'superadmin_only'
  | 'superadmin_and_consultant'
  | 'superadmin_consultant_manager'
  | 'all_including_employee';

export interface MeetingActionItem {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  completed: boolean;
  description?: string;
  assignee?: string;
}

export interface EmployeeMeetingRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName?: string;
  consultantName: string;
  meetingTitle: string;
  meetingType: '1_on_1_regular' | 'disciplinary_inquiry' | 'performance_review' | 'grievance' | 'wellness' | 'check_in';
  cadence: RecurringCadence;
  date: string;
  timeSlot: string;
  sessionFormat: SessionType;
  topicWhy: string;
  agendaWhat: string;
  transcriptOrNotes: string;
  actionItems?: MeetingActionItem[];
  attachmentFileName?: string;
  attachmentFileSize?: string;
  permissionLevel: FineGrainPermissionLevel;
  createdByRole?: string;
  createdAt?: string;
  nextFollowUpDate?: string;
  attendees?: string[];
  signedOffByConsultant?: boolean;
  signedOffDate?: string;
}

export interface SuperadminPermissionSettings {
  defaultMeetingPermission: FineGrainPermissionLevel;
  allowConsultantsToChangePermissions: boolean;
  allowManagersToViewTranscripts: boolean;
  allowEmployeesToViewTheirActionItems: boolean;
  maskSensitiveGrievanceTranscripts: boolean;
}

// Matrix & Grid-Based Frameworks Audits
export type MatrixFrameworkType =
  | 'nine_box_grid'
  | 'competency_heatmap'
  | 'bbee_skills_audit'
  | 'retention_risk_matrix';

export interface MatrixAuditRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName?: string;
  auditorName: string;
  auditorRole?: string;
  frameworkType: MatrixFrameworkType;
  auditTitle?: string;
  auditDate: string; // YYYY-MM-DD
  xScore?: number; // 1-5 (e.g. Performance / Technical Skills)
  yScore?: number; // 1-5 (e.g. Potential / Leadership / Flight Risk)
  quadrantOrCategory?: string; // e.g. "High Potential Star", "Core Pillar", "High Flight Risk"
  overallRatingPercent?: number; // 0-100%
  competencyRatings?: Record<string, number>; // Dimension name -> score (1-5)
  findingsAndStrengths?: string;
  developmentAreas?: string;
  recommendedAction?: string;
  nextAuditDueDate?: string;
  status: 'Draft' | 'Finalized' | 'Approved' | 'completed' | string;
  createdAt: string;

  // Convenient aliases
  frameworkName?: string;
  xAxisScore?: number;
  yAxisScore?: number;
  ratingPlacement?: string;
  statutoryBasis?: string;
  notes?: string;
  actionPlan?: string;

  // Assignable to Employee with Optional Evaluation
  assignedToEmployee?: boolean;
  optionalEvaluationEnabled?: boolean;
  evaluationPrompt?: string;
  employeeSelfEvaluationResponse?: string;
  employeeSelfScoreX?: number;
  employeeSelfScoreY?: number;
  employeeEvaluationSubmittedAt?: string;
}

// Standardized Testing and Diagnostic Frameworks
export type DiagnosticTestType =
  | 'compliance_bcea_popia'
  | 'situational_judgment_lra'
  | 'operational_aptitude'
  | 'leadership_readiness';

export interface DiagnosticQuestionOption {
  id: string;
  text: string;
  score: number; // e.g. 1-5 or 0/10
  rationale?: string;
}

export interface DiagnosticQuestion {
  id: string;
  category: string;
  prompt: string;
  options: DiagnosticQuestionOption[];
}

export interface DiagnosticFrameworkTemplate {
  id: DiagnosticTestType;
  title: string;
  subtitle: string;
  standardNorm: string; // e.g. "SA National Labour Law Standard 2026"
  description: string;
  estimatedMinutes: number;
  categories: string[];
  questions: DiagnosticQuestion[];
}

export interface StandardizedTestResult {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName?: string;
  evaluatorName?: string;
  testType?: DiagnosticTestType;
  testTitle?: string;
  testDate?: string; // YYYY-MM-DD
  durationMinutes?: number;
  scoreAchieved?: number;
  totalPossibleScore?: number;
  scorePercentage?: number;
  percentileRank?: number; // 1-99
  proficiencyBand?: 'Exemplary' | 'Proficient' | 'Needs Development' | 'Critical Compliance Gap';
  categoryBreakdown?: {
    category: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
  diagnosticAnalysis?: string;
  prescribedInterventions?: string[];
  certificateNumber: string;
  createdAt: string;

  // Convenient aliases
  frameworkId?: string;
  frameworkName?: string;
  dateCompleted?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  normativePercentile?: number;
  passed?: boolean;
  summaryFeedback?: string;
  categoryScores?: Record<string, number>;
  administeredBy?: string;
}

// Click On/Off Optional Extras per Employee in Portal
export interface EmployeePortalFeatureFlags {
  enableKpi: boolean;
  enableOnboarding: boolean;
  enableMatrixEvaluation: boolean;
  enableCompanyProperty: boolean;
  enableOrgChart: boolean;
  enableOneOnOneBooking: boolean;
  enableLeaveApplication: boolean;
}

// Portal User Account & Credentials assigned to an Employee
export interface PortalUserAccount {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  usernameOrEmail: string;
  portalPassword: string;
  lastPasswordReset: string;
  accountStatus: 'Active' | 'Suspended' | 'Pending Activation';
  optionalExtras: EmployeePortalFeatureFlags;
}

// Company Property Assigned to an Employee (Viewable to Employee Only, Non-Editable by Employee)
export interface CompanyPropertyAssignment {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  itemName: string;
  category: 'Laptop / IT Hardware' | 'Company Vehicle' | 'Mobile Device / SIM' | 'Tools & Machinery' | 'Access & Security Card';
  assetTag: string;
  insurancePolicyAndCoverage: string;
  insuredValueZar: number;
  lengthOfUse: string;
  assignedDate: string;
  returnDueDate: string;
  agreementTitle: string;
  agreementText: string;
  acknowledgedByEmployee: boolean;
  acknowledgedAt?: string;
  assignedByAdmin: string;
}

// Employee KPI & Self-Evaluation Item
export interface EmployeeKpiItem {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  period: string;
  kpiTitle: string;
  targetMetric: string;
  weightPercent: number;
  employeeSelfRating: number;
  employeeAnswerAndEvidence: string;
  managerScore?: number;
  status: 'Pending Employee Input' | 'Submitted by Employee' | 'Calibrated & Signed Off';
  updatedAt: string;
}

// Employee Onboarding Task & Question Item
export interface EmployeeOnboardingTask {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  stepCategory: 'Statutory & POPIA' | 'Contract & Policies' | 'Role & Safety Induction' | 'IT & Systems';
  title: string;
  instructions: string;
  requiresAnswer: boolean;
  employeeAnswer?: string;
  completed: boolean;
  completedAt?: string;
}

// Hierarchical Org Chart Node (Editable by Admin, Read-Only for Employee)
export interface OrgChartNode {
  id: string;
  companyId: string;
  employeeId?: string;
  name: string;
  jobTitle: string;
  department: string;
  tierLevel: 1 | 2 | 3 | 4;
  reportsToNodeId: string | null;
  location: string;
}

// Skills Development & SETA Tracking (WSP / ATR / Learnerships)
export interface SetaTrainingRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  beeRaceGroup: BeeRaceGroup;
  gender: 'Male' | 'Female';
  courseOrProgramTitle: string;
  programType: 'Accredited Course' | 'SETA Learnership (18.1 Employed)' | 'SETA Learnership (18.2 Unemployed)' | 'Skills Matrix Intervention' | 'Workplace Bursary';
  nqfLevel: string;
  setaCode: string;
  costSpendZar: number;
  MandatoryGrantClaimableZar: number;
  includedInWsp: boolean;
  completedForAtr: boolean;
  bbbeeCategoryCode: 'Category A (Bursaries)' | 'Category B (Internships)' | 'Category C (Learnerships)' | 'Category D (Short Courses)';
  status: 'Completed' | 'In Progress' | 'Planned (WSP)';
  completionDate?: string;
}

// B-BBEE 5-Element Scorecard & Evidence Record per Company
export interface BbbeeScorecardProfile {
  companyId: string;
  financialYear: string;
  enterpriseCategory: 'Generic Enterprise (>R50m)' | 'Qualifying Small Enterprise (QSE R10m-R50m)' | 'Exempted Micro Enterprise (EME <R10m)';
  ownershipScore: number; // Max 25
  managementControlScore: number; // Max 19 (includes Employment Equity)
  skillsDevelopmentScore: number; // Max 20 (+5 bonus)
  enterpriseSupplierDevScore: number; // Max 40 (Preferential Procurement + Enterprise/Supplier Dev)
  socioEconomicDevScore: number; // Max 5
  yesInitiativeBonus: number; // 0 - 5
  priorityElementsSubminimumMet: boolean;
  verifiedEvidenceItems: {
    id: string;
    element: 'Ownership' | 'Management Control & EE' | 'Skills Development' | 'Preferential Procurement & ESD' | 'Socio-Economic Development';
    documentTitle: string;
    verificationStatus: 'Verified for Audit' | 'Pending SANAS Review' | 'Action Required';
    updatedAt: string;
  }[];
}


