export type UserRole = 'super_admin' | 'consultant' | 'company_admin' | 'manager' | 'employee';

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
    study: number;
  };
  fileCompletenessScore: number; // 0 - 100%
  status: 'Active' | 'On Leave' | 'Suspended' | 'Resigned' | 'Terminated';
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
  leaveType: 'Annual' | 'Sick' | 'Family Responsibility' | 'Parental' | 'Maternity' | 'Study';
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
  employeeName: string;
  category: 'Contract' | 'ID/Passport' | 'POPIA Consent' | 'Medical' | 'Disciplinary' | 'Performance' | 'Tax/IRP5';
  title: string;
  uploadedAt: string;
  expiryDate?: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  fileSize: string;
}
