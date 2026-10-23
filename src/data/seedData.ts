import type {
  Company,
  Employee,
  ComplianceEvent,
  DisciplinaryCase,
  LeaveRequest,
  TimeEntry,
  Invoice,
  EmployeeDocument,
  MatrixAuditRecord,
  DiagnosticFrameworkTemplate,
  StandardizedTestResult,
  PortalUserAccount,
  CompanyPropertyAssignment,
  EmployeeKpiItem,
  EmployeeOnboardingTask,
  OrgChartNode,
  SetaTrainingRecord,
  BbbeeScorecardProfile,
  ReportingPluginId
} from '../types/index.ts';

export const ALL_REPORTING_PLUGINS: ReportingPluginId[] = [
  'employment_equity',
  'bcea_compliance',
  'popia_compliance',
  'integrated_leave',
  'disciplinary_labour',
  'skills_seta',
  'bbbee_support'
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp_cape_logistics',
    name: 'Cape Logistics (Pty) Ltd',
    tradingName: 'Cape Express Freight',
    registrationNumber: '2018/394102/07',
    industry: 'Logistics & Warehousing',
    payeNumber: '7920184491',
    uifNumber: 'U19842109',
    coidaNumber: '9900014287',
    sdlNumber: 'L792018449',
    bbbeeLevel: 2,
    complianceScore: 96,
    employeeCount: 48,
    contactEmail: 'operations@capelogistics.co.za',
    contactPhone: '+27 (0)21 550 4900',
    city: 'Cape Town',
    province: 'Western Cape',
    monthlyRetainerZar: 12500,
    hourlyRateZar: 1150,
    createdAt: '2023-02-14',
    setaName: 'TETA (Transport Education Training Authority)',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'disciplinary_labour',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'comp_highveld_eng',
    name: 'Highveld Mining & Heavy Engineering',
    tradingName: 'Highveld Industrial Works',
    registrationNumber: '2014/198234/07',
    industry: 'Mining & Heavy Engineering',
    payeNumber: '7100492811',
    uifNumber: 'U88294102',
    coidaNumber: '9900084729',
    sdlNumber: 'L710049281',
    bbbeeLevel: 4,
    complianceScore: 88,
    employeeCount: 112,
    contactEmail: 'hr@highveld-industrial.co.za',
    contactPhone: '+27 (0)11 845 2200',
    city: 'Germiston',
    province: 'Gauteng',
    monthlyRetainerZar: 22000,
    hourlyRateZar: 1400,
    createdAt: '2022-08-01',
    setaName: 'MERSETA (Manufacturing, Engineering and Related Services SETA)',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'disciplinary_labour',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'comp_protea_lodges',
    name: 'Protea Luxury Lodges & Hospitality',
    tradingName: 'Protea Wilderness Collection',
    registrationNumber: '2019/521094/07',
    industry: 'Hospitality & Tourism',
    payeNumber: '7440192837',
    uifNumber: 'U44920184',
    coidaNumber: '9900039104',
    sdlNumber: 'L744019283',
    bbbeeLevel: 1,
    complianceScore: 92,
    employeeCount: 65,
    contactEmail: 'gm@protealodges.co.za',
    contactPhone: '+27 (0)32 946 8000',
    city: 'Ballito',
    province: 'KwaZulu-Natal',
    monthlyRetainerZar: 16000,
    hourlyRateZar: 1200,
    createdAt: '2023-06-19',
    setaName: 'CATHSSETA (Culture, Art, Tourism, Hospitality, and Sport SETA)',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'comp_solis_agro',
    name: 'Solis Agro-Processing Group',
    tradingName: 'Solis Orchards & Cold Chain',
    registrationNumber: '2016/409182/07',
    industry: 'Agriculture & Processing',
    payeNumber: '7829104829',
    uifNumber: 'U77291048',
    coidaNumber: '9900049102',
    sdlNumber: 'L782910482',
    bbbeeLevel: 3,
    complianceScore: 91,
    employeeCount: 84,
    contactEmail: 'compliance@solisagro.co.za',
    contactPhone: '+27 (0)15 297 3340',
    city: 'Polokwane',
    province: 'Limpopo',
    monthlyRetainerZar: 14500,
    hourlyRateZar: 1100,
    createdAt: '2023-11-05',
    setaName: 'AgriSETA (Agricultural Sector Education Training Authority)',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'integrated_leave',
      'disciplinary_labour',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'comp_apex_fintech',
    name: 'Apex Digital Financial Services',
    tradingName: 'Apex Pay Solutions',
    registrationNumber: '2021/847291/07',
    industry: 'Financial Technology (FinTech)',
    payeNumber: '7990184729',
    uifNumber: 'U99018472',
    coidaNumber: '9900091847',
    sdlNumber: 'L799018472',
    bbbeeLevel: 1,
    complianceScore: 98,
    employeeCount: 32,
    contactEmail: 'people@apexfintech.co.za',
    contactPhone: '+27 (0)10 590 1200',
    city: 'Rosebank',
    province: 'Gauteng',
    monthlyRetainerZar: 18000,
    hourlyRateZar: 1650,
    createdAt: '2024-01-10',
    setaName: 'MICT SETA (Media, Information and Communication Technologies)',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'skills_seta',
      'bbbee_support'
    ]
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp_01',
    companyId: 'comp_cape_logistics',
    employeeNumber: 'CL-0104',
    firstName: 'Sipho',
    lastName: 'Dlamini',
    email: 'sipho.d@capelogistics.co.za',
    phone: '+27 82 459 1042',
    idNumber: '8604125894083',
    taxNumber: '9184920184',
    department: 'Fleet Operations',
    jobTitle: 'Senior Logistics Controller',
    managerName: 'Andre Venter',
    contractType: 'Permanent',
    startDate: '2020-03-01',
    salaryZar: 38500,
    salaryFrequency: 'Monthly',
    medicalAidScheme: 'Discovery Health Classic Saver',
    address: '14 Atlantic Boulevard, Milnerton, Cape Town, 7441',
    emergencyContact: {
      name: 'Nomsa Dlamini',
      relationship: 'Spouse',
      phone: '+27 82 555 9012'
    },
    leaveBalances: {
      annual: 16.5,
      sick: 24,
      familyResponsibility: 3,
      parental: 10,
      maternity: 0,
      adoption: 10,
      study: 2
    },
    fileCompletenessScore: 100,
    status: 'Active',
    beeRaceGroup: 'African',
    gender: 'Male',
    hasDisability: false,
    occupationalLevel: 'Professionally Qualified',
    beeRaceScorePoints: 9.5,
    weeklyHoursScheduled: 45,
    monthlyOvertimeHours: 14,
    sundayPublicHolidayShifts: 1,
    popiaConsentSigned: true,
    popiaConsentDate: '2025-01-15',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'disciplinary_labour',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'emp_02',
    companyId: 'comp_cape_logistics',
    employeeNumber: 'CL-0148',
    firstName: 'Ansie',
    lastName: 'van der Merwe',
    email: 'ansie.v@capelogistics.co.za',
    phone: '+27 83 710 4920',
    idNumber: '9211050182087',
    taxNumber: '9482910482',
    department: 'Finance & Compliance',
    jobTitle: 'Payroll & Freight Administrator',
    managerName: 'Andre Venter',
    contractType: 'Permanent',
    startDate: '2022-07-15',
    salaryZar: 29000,
    salaryFrequency: 'Monthly',
    medicalAidScheme: 'Bonitas Primary Plus',
    address: '28 Durban Road, Bellville, Cape Town, 7530',
    emergencyContact: {
      name: 'Kobus van der Merwe',
      relationship: 'Brother',
      phone: '+27 83 400 1982'
    },
    leaveBalances: {
      annual: 12.0,
      sick: 28,
      familyResponsibility: 2,
      parental: 10,
      maternity: 120,
      adoption: 70,
      study: 4
    },
    fileCompletenessScore: 92,
    status: 'Active',
    beeRaceGroup: 'White',
    gender: 'Female',
    hasDisability: false,
    occupationalLevel: 'Skilled Technical',
    beeRaceScorePoints: 3.5,
    weeklyHoursScheduled: 40,
    monthlyOvertimeHours: 6,
    sundayPublicHolidayShifts: 0,
    popiaConsentSigned: true,
    popiaConsentDate: '2025-02-10',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'emp_03',
    companyId: 'comp_cape_logistics',
    employeeNumber: 'CL-0199',
    firstName: 'Keagan',
    lastName: 'Naidoo',
    email: 'keagan.n@capelogistics.co.za',
    phone: '+27 76 991 4028',
    idNumber: '9508205492081',
    taxNumber: '9558291048',
    department: 'Cross-Border Transport',
    jobTitle: 'Heavy Vehicle Code 14 Driver',
    managerName: 'Sipho Dlamini',
    contractType: 'Permanent',
    startDate: '2023-01-10',
    salaryZar: 22500,
    salaryFrequency: 'Monthly',
    address: '9 Voortrekker Road, Goodwood, Cape Town, 7460',
    emergencyContact: {
      name: 'Pravina Naidoo',
      relationship: 'Mother',
      phone: '+27 76 301 9840'
    },
    leaveBalances: {
      annual: 8.5,
      sick: 18,
      familyResponsibility: 1,
      parental: 10,
      maternity: 0,
      adoption: 10,
      study: 0
    },
    fileCompletenessScore: 85,
    status: 'Active',
    beeRaceGroup: 'Indian',
    gender: 'Male',
    hasDisability: false,
    occupationalLevel: 'Semi-Skilled',
    beeRaceScorePoints: 8.0,
    weeklyHoursScheduled: 49, // Exceeds 45h BCEA ordinary limit -> triggers BCEA alert
    monthlyOvertimeHours: 46, // Exceeds 40h monthly BCEA cap -> triggers BCEA alert
    sundayPublicHolidayShifts: 3,
    popiaConsentSigned: false, // Pending telematics consent -> triggers POPIA alert
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'disciplinary_labour',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'emp_04',
    companyId: 'comp_highveld_eng',
    employeeNumber: 'HE-0301',
    firstName: 'Thabo',
    lastName: 'Mokoena',
    email: 'thabo.m@highveld-industrial.co.za',
    phone: '+27 81 334 9018',
    idNumber: '8005165910082',
    taxNumber: '9004928192',
    department: 'Engineering & Smelting',
    jobTitle: 'Chief Mechanical Artisan (Red Seal)',
    managerName: 'Pieter Botha',
    contractType: 'Permanent',
    startDate: '2017-09-01',
    salaryZar: 46000,
    salaryFrequency: 'Monthly',
    medicalAidScheme: 'Discovery Health Essential Delta',
    address: '42 Main Reef Road, Boksburg, 1459',
    emergencyContact: {
      name: 'Joyce Mokoena',
      relationship: 'Spouse',
      phone: '+27 81 992 0184'
    },
    leaveBalances: {
      annual: 19.0,
      sick: 30,
      familyResponsibility: 3,
      parental: 10,
      maternity: 0,
      adoption: 10,
      study: 5
    },
    fileCompletenessScore: 98,
    status: 'Active',
    beeRaceGroup: 'African',
    gender: 'Male',
    hasDisability: false,
    occupationalLevel: 'Skilled Technical',
    beeRaceScorePoints: 9.0,
    weeklyHoursScheduled: 45,
    monthlyOvertimeHours: 22,
    sundayPublicHolidayShifts: 2,
    popiaConsentSigned: true,
    popiaConsentDate: '2024-11-20',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'disciplinary_labour',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'emp_05',
    companyId: 'comp_highveld_eng',
    employeeNumber: 'HE-0388',
    firstName: 'Lerato',
    lastName: 'Khumalo',
    email: 'lerato.k@highveld-industrial.co.za',
    phone: '+27 79 402 1849',
    idNumber: '9403190291084',
    taxNumber: '9671928401',
    department: 'SHEQ (Safety, Health, Environment)',
    jobTitle: 'OHS Safety Officer (MHSA / OHSA)',
    managerName: 'Pieter Botha',
    contractType: 'Permanent',
    startDate: '2021-11-01',
    salaryZar: 34000,
    salaryFrequency: 'Monthly',
    address: '108 Lake Avenue, Benoni, 1501',
    emergencyContact: {
      name: 'Mandla Khumalo',
      relationship: 'Father',
      phone: '+27 79 310 9940'
    },
    leaveBalances: {
      annual: 11.5,
      sick: 26,
      familyResponsibility: 3,
      parental: 10,
      maternity: 120,
      adoption: 70,
      study: 3
    },
    fileCompletenessScore: 95,
    status: 'Active',
    beeRaceGroup: 'African',
    gender: 'Female',
    hasDisability: true,
    occupationalLevel: 'Professionally Qualified',
    beeRaceScorePoints: 10.0, // Black Female with Disability = Maximum B-BBEE Priority Points
    weeklyHoursScheduled: 42,
    monthlyOvertimeHours: 8,
    sundayPublicHolidayShifts: 0,
    popiaConsentSigned: true,
    popiaConsentDate: '2025-01-08',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'disciplinary_labour',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'emp_06',
    companyId: 'comp_protea_lodges',
    employeeNumber: 'PW-0042',
    firstName: 'Chantal',
    lastName: 'Hendricks',
    email: 'chantal.h@protealodges.co.za',
    phone: '+27 84 502 9184',
    idNumber: '9009120491089',
    taxNumber: '9384910284',
    department: 'Guest Experience & Front Office',
    jobTitle: 'Hospitality Operations Lead',
    managerName: 'David Meyer',
    contractType: 'Permanent',
    startDate: '2022-04-01',
    salaryZar: 27500,
    salaryFrequency: 'Monthly',
    address: '5 Ocean Breeze Way, Zimbali, Ballito, 4399',
    emergencyContact: {
      name: 'Trevor Hendricks',
      relationship: 'Spouse',
      phone: '+27 84 901 2849'
    },
    leaveBalances: {
      annual: 14.0,
      sick: 25,
      familyResponsibility: 3,
      parental: 10,
      maternity: 120,
      adoption: 70,
      study: 2
    },
    fileCompletenessScore: 94,
    status: 'Active',
    beeRaceGroup: 'Coloured',
    gender: 'Female',
    hasDisability: false,
    occupationalLevel: 'Senior Management',
    beeRaceScorePoints: 9.0,
    weeklyHoursScheduled: 45,
    monthlyOvertimeHours: 16,
    sundayPublicHolidayShifts: 2,
    popiaConsentSigned: true,
    popiaConsentDate: '2025-02-01',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'emp_07',
    companyId: 'comp_apex_fintech',
    employeeNumber: 'AP-0012',
    firstName: 'Farai',
    lastName: 'Chikwamba',
    email: 'farai.c@apexfintech.co.za',
    phone: '+27 72 881 9204',
    idNumber: '8910045819183',
    passportNumber: 'FN4829104',
    taxNumber: '9784910294',
    department: 'Product & Engineering',
    jobTitle: 'Principal Cloud Systems Architect',
    contractType: 'Permanent',
    startDate: '2023-03-01',
    salaryZar: 85000,
    salaryFrequency: 'Monthly',
    medicalAidScheme: 'Discovery Executive Plan',
    address: '77 Oxford Road, Rosebank, Johannesburg, 2196',
    emergencyContact: {
      name: 'Ruvimbo Chikwamba',
      relationship: 'Spouse',
      phone: '+27 72 400 9182'
    },
    leaveBalances: {
      annual: 21.0,
      sick: 30,
      familyResponsibility: 3,
      parental: 10,
      maternity: 0,
      adoption: 10,
      study: 5
    },
    fileCompletenessScore: 100,
    status: 'Active',
    beeRaceGroup: 'Foreign National',
    gender: 'Male',
    hasDisability: false,
    occupationalLevel: 'Senior Management',
    beeRaceScorePoints: 0.0, // Non-SA Citizen excluded from B-BBEE Designated Group recognition
    weeklyHoursScheduled: 40,
    monthlyOvertimeHours: 4,
    sundayPublicHolidayShifts: 0,
    popiaConsentSigned: true,
    popiaConsentDate: '2025-01-20',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'skills_seta',
      'bbbee_support'
    ]
  },
  {
    id: 'emp_08',
    companyId: 'comp_cape_logistics',
    employeeNumber: 'CL-0215',
    firstName: 'Zainab',
    lastName: 'Abrahams',
    email: 'zainab.a@capelogistics.co.za',
    phone: '+27 82 910 3841',
    idNumber: '9106180291085',
    taxNumber: '9210492817',
    department: 'Executive & Supply Chain',
    jobTitle: 'Head of Supply Chain & Compliance',
    managerName: 'Hendrik Pretorius',
    contractType: 'Executive',
    startDate: '2021-05-01',
    salaryZar: 64000,
    salaryFrequency: 'Monthly',
    medicalAidScheme: 'Discovery Health Comprehensive',
    address: '19 Kloof Nek Road, Gardens, Cape Town, 8001',
    emergencyContact: {
      name: 'Tariq Abrahams',
      relationship: 'Spouse',
      phone: '+27 82 391 0482'
    },
    leaveBalances: {
      annual: 18.0,
      sick: 29,
      familyResponsibility: 3,
      parental: 10,
      maternity: 120,
      adoption: 70,
      study: 5
    },
    fileCompletenessScore: 100,
    status: 'Active',
    beeRaceGroup: 'Coloured',
    gender: 'Female',
    hasDisability: false,
    occupationalLevel: 'Top Management',
    beeRaceScorePoints: 9.5,
    weeklyHoursScheduled: 42,
    monthlyOvertimeHours: 5,
    sundayPublicHolidayShifts: 0,
    popiaConsentSigned: true,
    popiaConsentDate: '2025-01-12',
    enabledReportingPlugins: [
      'employment_equity',
      'bcea_compliance',
      'popia_compliance',
      'integrated_leave',
      'disciplinary_labour',
      'skills_seta',
      'bbbee_support'
    ]
  }
];

export const INITIAL_COMPLIANCE_EVENTS: ComplianceEvent[] = [
  {
    id: 'comp_ev_01',
    companyId: 'comp_cape_logistics',
    statute: 'COIDA',
    title: 'COIDA Annual Return of Earnings (W.As.8)',
    description: 'Submission of actual worker remuneration for past tax year and estimate for upcoming year to the Compensation Fund.',
    dueDate: '2026-03-31',
    frequency: 'Annual',
    status: 'Compliant',
    penaltyRisk: '10% penalty on assessment plus loss of Letter of Good Standing needed for tenders.',
    responsiblePerson: 'Ansie van der Merwe',
    reminderSent: true
  },
  {
    id: 'comp_ev_02',
    companyId: 'comp_cape_logistics',
    statute: 'UIF',
    title: 'UIF Monthly Declaration (UI-19 & EMP201)',
    description: 'Monthly electronic declaration of all staff changes and 2% statutory contribution (1% employer, 1% employee).',
    dueDate: '2026-11-07',
    frequency: 'Monthly',
    status: 'Compliant',
    penaltyRisk: '10% SARS late payment penalty and 1% monthly interest accrual.',
    responsiblePerson: 'GreenHive Practice Team',
    reminderSent: true
  },
  {
    id: 'comp_ev_03',
    companyId: 'comp_cape_logistics',
    statute: 'POPIA',
    title: 'POPIA Annual Employee Records Audit',
    description: 'Verify employee consent forms, clean up redundant biometric and ID scans, and audit security access per Section 19.',
    dueDate: '2026-11-30',
    frequency: 'Annual',
    status: 'Action Required',
    penaltyRisk: 'Information Regulator administrative fines up to R10 million or imprisonment.',
    responsiblePerson: 'Consultant Lead',
    reminderSent: false,
    notes: 'Driver personal files need updated consent forms for telematics tracking.'
  },
  {
    id: 'comp_ev_04',
    companyId: 'comp_highveld_eng',
    statute: 'Employment Equity',
    title: 'EE Online Report (EEA2 & EEA4 Submissions)',
    description: 'Mandatory online reporting for designated employers (>50 employees) reporting workforce demographics and income differentials.',
    dueDate: '2026-12-15',
    frequency: 'Annual',
    status: 'Action Required',
    penaltyRisk: 'Labour Court fines ranging from R1.5 million up to 10% of annual turnover for repeat non-compliance.',
    responsiblePerson: 'Pieter Botha & Consultant',
    reminderSent: true,
    notes: 'Artisan occupational level currently undergoing consultative committee sign-off.'
  },
  {
    id: 'comp_ev_05',
    companyId: 'comp_highveld_eng',
    statute: 'Skills Development',
    title: 'Workplace Skills Plan (WSP) & Annual Training Report (ATR)',
    description: 'Submit annual workplace skills plan to merSETA to claim 20% Mandatory Grant levy back.',
    dueDate: '2026-04-30',
    frequency: 'Annual',
    status: 'Pending',
    penaltyRisk: 'Forfeiture of 20% SDL mandatory grant and zero points on B-BBEE Skills Development priority element.',
    responsiblePerson: 'GreenHive Consultant',
    reminderSent: false
  },
  {
    id: 'comp_ev_06',
    companyId: 'comp_protea_lodges',
    statute: 'BCEA',
    title: 'BCEA Hospitality Sectoral Determination Review',
    description: 'Audit overtime, Sunday work pay (1.5x / 2x rate), and uniform allowances against Sectoral Determination 14.',
    dueDate: '2026-11-15',
    frequency: 'Bi-Annual',
    status: 'Compliant',
    penaltyRisk: 'Department of Employment and Labour compliance order with back-pay enforcement.',
    responsiblePerson: 'Chantal Hendricks',
    reminderSent: true
  },
  {
    id: 'comp_ev_07',
    companyId: 'comp_apex_fintech',
    statute: 'B-BBEE',
    title: 'B-BBEE ICT Sector Verification Audit',
    description: 'Annual verification on Ownership, Management Control, Skills, Enterprise Development, and Socio-Economic Development.',
    dueDate: '2026-12-10',
    frequency: 'Annual',
    status: 'Pending',
    penaltyRisk: 'Drop in B-BBEE recognition level resulting in commercial partner RFP disqualification.',
    responsiblePerson: 'GreenHive Lead Partner',
    reminderSent: true
  }
];

export const INITIAL_DISCIPLINARY_CASES: DisciplinaryCase[] = [
  {
    id: 'case_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_03',
    employeeName: 'Keagan Naidoo',
    type: 'Misconduct',
    stage: 'Written Warning',
    incidentDate: '2026-10-14',
    summary: 'Unauthorized deviation from designated freight route Cape Town - Beaufort West without notifying fleet operations.',
    validUntil: '2027-04-14',
    evidenceFiles: ['telematics_gps_log.pdf', 'driver_explanation_statement.pdf'],
    status: 'Sanctioned',
    proceduralChecklist: {
      writtenNoticeGiven48HoursPrior: true,
      chargesClearlyDetailed: true,
      rightsExplainedToEmployee: true,
      rightToShopStewardOrColleague: true,
      interpreterProvidedIfRequired: true,
      evidencePresentedAndCrossExamined: true,
      mitigatingFactorsConsidered: true
    }
  },
  {
    id: 'case_02',
    companyId: 'comp_highveld_eng',
    employeeId: 'emp_04',
    employeeName: 'Thabo Mokoena',
    type: 'Incapacity (Ill Health)',
    stage: 'Notice of Hearing',
    incidentDate: '2026-09-28',
    hearingDate: '2026-11-04',
    hearingOfficer: 'Advocate J. Sithole (Independent CCMA Accredited Panel)',
    summary: 'Investigation into ongoing medical incapacity preventing high-heat furnace operations; medical boarding and alternative placement assessment.',
    evidenceFiles: ['occupational_medical_report.pdf', 'ergonomic_assessment.pdf'],
    status: 'Hearing Scheduled',
    proceduralChecklist: {
      writtenNoticeGiven48HoursPrior: true,
      chargesClearlyDetailed: true,
      rightsExplainedToEmployee: true,
      rightToShopStewardOrColleague: true,
      interpreterProvidedIfRequired: true,
      evidencePresentedAndCrossExamined: false,
      mitigatingFactorsConsidered: true
    }
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_02',
    employeeName: 'Ansie van der Merwe',
    leaveType: 'Annual',
    startDate: '2026-12-21',
    endDate: '2027-01-04',
    daysCount: 9,
    reason: 'Year-end family recess in Garden Route',
    status: 'Approved',
    medicalCertificateRequired: false,
    hasMedicalCertificate: false,
    appliedDate: '2026-10-18',
    reviewedBy: 'Andre Venter'
  },
  {
    id: 'leave_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    leaveType: 'Sick',
    startDate: '2026-10-19',
    endDate: '2026-10-21',
    daysCount: 3,
    reason: 'Acute respiratory infection and bronchitic symptoms',
    status: 'Approved',
    medicalCertificateRequired: true,
    hasMedicalCertificate: true,
    appliedDate: '2026-10-19',
    reviewedBy: 'Andre Venter'
  },
  {
    id: 'leave_03',
    companyId: 'comp_protea_lodges',
    employeeId: 'emp_06',
    employeeName: 'Chantal Hendricks',
    leaveType: 'Family Responsibility',
    startDate: '2026-11-02',
    endDate: '2026-11-03',
    daysCount: 2,
    reason: 'Child illness and specialist paediatrician consultation',
    status: 'Pending',
    medicalCertificateRequired: false,
    hasMedicalCertificate: false,
    appliedDate: '2026-10-22'
  }
];

export const INITIAL_TIME_ENTRIES: TimeEntry[] = [
  {
    id: 'time_01',
    companyId: 'comp_cape_logistics',
    consultantName: 'Sarah Khanyile (Lead HR Practitioner)',
    date: '2026-10-20',
    hours: 3.5,
    rateZar: 1150,
    project: 'Disciplinary Advisory & Warning',
    description: 'Chaired investigation interview with Driver Naidoo, drafted CCMA-compliant Written Warning, and updated personnel file.',
    isBilled: false
  },
  {
    id: 'time_02',
    companyId: 'comp_cape_logistics',
    consultantName: 'Sarah Khanyile (Lead HR Practitioner)',
    date: '2026-10-17',
    hours: 4.0,
    rateZar: 1150,
    project: 'POPIA Compliance Audit',
    description: 'Audited HR data storage systems, driver telemetry logs, and revised employee confidentiality addendums.',
    isBilled: false
  },
  {
    id: 'time_03',
    companyId: 'comp_highveld_eng',
    consultantName: 'Markus Steyn (Labour Relations Specialist)',
    date: '2026-10-19',
    hours: 6.0,
    rateZar: 1400,
    project: 'Incapacity Inquiry Preparation',
    description: 'Prepared bundle of documents, consulted occupational health doctor, and issued formal Notice of Incapacity Hearing.',
    isBilled: true,
    invoiceId: 'inv_2026_091'
  },
  {
    id: 'time_04',
    companyId: 'comp_apex_fintech',
    consultantName: 'Sarah Khanyile (Lead HR Practitioner)',
    date: '2026-10-21',
    hours: 2.5,
    rateZar: 1650,
    project: 'Executive Employment Contracts',
    description: 'Drafted tailored Section 198 BCEA executive contract with IP assignment and restraint of trade covenants.',
    isBilled: false
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_2026_091',
    invoiceNumber: 'GH-2026-0091',
    companyId: 'comp_highveld_eng',
    companyName: 'Highveld Mining & Heavy Engineering',
    date: '2026-10-01',
    dueDate: '2026-10-31',
    items: [
      {
        description: 'Monthly Labour Relations & Employment Equity Retainer (October 2026)',
        hours: 1,
        rateZar: 22000,
        amountZar: 22000
      },
      {
        description: 'CCMA Disciplinary Arbitration Representation (Case GAJB-1428)',
        hours: 5.5,
        rateZar: 1400,
        amountZar: 7700
      }
    ],
    subtotalZar: 29700,
    vatZar: 4455,
    totalZar: 34155,
    status: 'Sent'
  }
];

export const INITIAL_DOCUMENTS: EmployeeDocument[] = [
  {
    id: 'doc_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    category: 'Contract',
    title: 'Signed Permanent Employment Agreement (BCEA Sec 29)',
    uploadedAt: '2020-03-01',
    status: 'Valid',
    fileSize: '1.4 MB'
  },
  {
    id: 'doc_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    category: 'ID/Passport',
    title: 'Certified RSA Smart ID Card Copy',
    uploadedAt: '2020-03-01',
    status: 'Valid',
    fileSize: '820 KB'
  },
  {
    id: 'doc_03',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    category: 'POPIA Consent',
    title: 'Employee POPIA Personal Information Consent Form',
    uploadedAt: '2021-07-01',
    status: 'Valid',
    fileSize: '450 KB'
  },
  {
    id: 'doc_04',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_03',
    employeeName: 'Keagan Naidoo',
    category: 'Disciplinary',
    title: 'Written Warning Notice - Unauthorized Route Deviation',
    uploadedAt: '2026-10-14',
    expiryDate: '2027-04-14',
    status: 'Valid',
    fileSize: '320 KB'
  },
  {
    id: 'doc_05',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_03',
    employeeName: 'Keagan Naidoo',
    category: 'Medical',
    title: 'Professional Driving Permit (PrDP) Medical Fitness Certificate',
    uploadedAt: '2024-11-10',
    expiryDate: '2026-11-10',
    status: 'Expiring Soon',
    fileSize: '950 KB'
  }
];

export const CONSULTANTS_LIST = [
  {
    id: 'cons_01',
    name: 'Sarah Khanyile',
    title: 'Lead HR Practitioner & Practice Director',
    email: 'sarah.k@greenhivehr.co.za',
    phone: '+27 82 890 1420',
    specialties: ['BCEA Compliance', 'Executive Contracts', 'Employment Equity', 'POPIA Audits']
  },
  {
    id: 'cons_02',
    name: 'Markus Steyn',
    title: 'Senior Labour Relations Specialist',
    email: 'markus.s@greenhivehr.co.za',
    phone: '+27 83 410 9920',
    specialties: ['CCMA Arbitrations', 'Disciplinary Hearings', 'Strike Management', 'Union Negotiations']
  },
  {
    id: 'cons_03',
    name: 'Nandi Sithole',
    title: 'Workforce Wellness & Grievance Counsellor',
    email: 'nandi.s@greenhivehr.co.za',
    phone: '+27 71 500 2341',
    specialties: ['Workplace Mediation', 'Grievance Resolution', 'Harassment Inquiries', 'Employee Wellbeing']
  }
];

export const AVAILABLE_TIME_SLOTS = [
  '08:30 - 09:15',
  '09:30 - 10:15',
  '10:30 - 11:15',
  '11:30 - 12:15',
  '13:30 - 14:15',
  '14:30 - 15:15',
  '15:30 - 16:15'
];

export const INITIAL_BOOKINGS: any[] = [
  {
    id: 'book_01',
    companyId: 'comp_cape_logistics',
    companyName: 'Cape Logistics (Pty) Ltd',
    employeeId: 'emp_03',
    employeeName: 'Keagan Naidoo',
    employeeEmail: 'keagan.n@capelogistics.co.za',
    employeeRole: 'Heavy Vehicle Code 14 Driver',
    consultantId: 'cons_02',
    consultantName: 'Markus Steyn',
    sessionType: 'teams',
    date: '2026-10-24',
    timeSlot: '09:30 - 10:15',
    reasonWhy: 'Disciplinary Process & Appeal Rights',
    detailsWhat: 'Need guidance on the Written Warning issued for route deviation, mitigating factors regarding weather on the N1, and understanding my appeal rights under company policy.',
    status: 'confirmed',
    meetingLinkOrLocation: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_greenhive_knaidoo%40thread.v2/0',
    createdAt: '2026-10-21'
  },
  {
    id: 'book_02',
    companyId: 'comp_cape_logistics',
    companyName: 'Cape Logistics (Pty) Ltd',
    employeeId: 'emp_02',
    employeeName: 'Ansie van der Merwe',
    employeeEmail: 'ansie.v@capelogistics.co.za',
    employeeRole: 'Payroll & Freight Administrator',
    consultantId: 'cons_01',
    consultantName: 'Sarah Khanyile',
    sessionType: 'in_person',
    date: '2026-10-25',
    timeSlot: '11:30 - 12:15',
    reasonWhy: 'BCEA Contract & Maternity Policy Review',
    detailsWhat: 'Discussion regarding statutory maternity benefits under BCEA Section 25, company top-up policy, and UIF maternity claim documentation.',
    status: 'confirmed',
    meetingLinkOrLocation: 'Cape Logistics Head Office - Executive Consultation Room B',
    createdAt: '2026-10-22'
  },
  {
    id: 'book_03',
    companyId: 'comp_highveld_eng',
    companyName: 'Highveld Mining & Heavy Engineering',
    employeeId: 'emp_04',
    employeeName: 'Thabo Mokoena',
    employeeEmail: 'thabo.m@highveld-industrial.co.za',
    employeeRole: 'Chief Mechanical Artisan',
    consultantId: 'cons_02',
    consultantName: 'Markus Steyn',
    sessionType: 'phone',
    date: '2026-10-26',
    timeSlot: '14:30 - 15:15',
    reasonWhy: 'Incapacity & Medical Board Preparation',
    detailsWhat: 'Pre-hearing confidential check-in to review doctor recommendations, alternative placement in maintenance logistics, and pension ill-health options.',
    status: 'confirmed',
    meetingLinkOrLocation: 'Direct Call: +27 83 410 9920 (Markus Steyn)',
    createdAt: '2026-10-22'
  }
];

export const INITIAL_BLOCKED_SLOTS: any[] = [
  {
    id: 'block_01',
    consultantName: 'Sarah Khanyile',
    date: '2026-10-24',
    timeSlot: '13:30 - 14:15',
    reason: 'CCMA Conciliation Hearing (Case GAJB-1428)',
    createdAt: '2026-10-20'
  },
  {
    id: 'block_02',
    consultantName: 'Markus Steyn',
    date: '2026-10-25',
    timeSlot: '10:30 - 11:15',
    reason: 'Department of Employment and Labour Site Audit',
    createdAt: '2026-10-21'
  }
];

export const INITIAL_SUPERADMIN_SETTINGS: any = {
  defaultMeetingPermission: 'superadmin_and_consultant',
  allowConsultantsToChangePermissions: true,
  allowManagersToViewTranscripts: false,
  allowEmployeesToViewTheirActionItems: true,
  maskSensitiveGrievanceTranscripts: true
};

export const INITIAL_MEETING_RECORDS: any[] = [
  {
    id: 'meet_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    consultantName: 'Sarah Khanyile',
    meetingTitle: 'Bi-Weekly Operations Leadership & Fleet OHS Check-In',
    meetingType: '1_on_1_regular',
    cadence: 'bi_weekly',
    date: '2026-10-18',
    timeSlot: '09:30 - 10:15',
    sessionFormat: 'teams',
    topicWhy: 'Fleet Safety & Cross-Border Driver Fatigue Management',
    agendaWhat: 'Review of driver logbook telematics, overtime thresholds under BCEA Sectoral Determination 9, and rest stop compliance along N1 corridor.',
    transcriptOrNotes: `TRANSCRIPT & MEETING SUMMARY:
• Consultant Sarah Khanyile reviewed telematics logs for October cross-border routes (Cape Town - Windhoek).
• Sipho noted 2 instances where port clearing delays caused driver waiting periods exceeding 14 hours.
• Agreed that waiting time at border posts must be classified as non-driving work hours under BCEA Section 9 to ensure compliance with compulsory 12-hour daily rest intervals.
• Discussed mental wellness and fatigue alerts on long-haul routes.
• Next scheduled meeting confirmed for November 1st at 09:30.`,
    actionItems: [
      { id: 'act_01', task: 'Revise driver border clearing rest protocol', owner: 'Sipho Dlamini', dueDate: '2026-10-30', completed: true },
      { id: 'act_02', task: 'Issue BCEA overtime guidance circular to dispatchers', owner: 'Sarah Khanyile', dueDate: '2026-11-05', completed: false }
    ],
    attachmentFileName: 'border_fatigue_telematics_audit.pdf',
    attachmentFileSize: '1.8 MB',
    permissionLevel: 'superadmin_and_consultant',
    createdByRole: 'Consultant',
    createdAt: '2026-10-18',
    nextFollowUpDate: '2026-11-01'
  },
  {
    id: 'meet_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_03',
    employeeName: 'Keagan Naidoo',
    consultantName: 'Markus Steyn',
    meetingTitle: 'Formal Disciplinary Inquiry & Fact-Finding Interview',
    meetingType: 'disciplinary_inquiry',
    cadence: 'one_off',
    date: '2026-10-14',
    timeSlot: '14:30 - 15:30',
    sessionFormat: 'in_person',
    topicWhy: 'Investigation into Route Deviation & Telematics Inconsistency',
    agendaWhat: 'Investigatory inquiry under Schedule 8 of LRA 66 of 1995 regarding unapproved Beaufort West detour.',
    transcriptOrNotes: `CONFIDENTIAL CCMA INVESTIGATION TRANSCRIPT:
[STRICTLY RESTRICTED BY SUPERADMIN ORDER - LRA INQUIRY EVIDENCE]
• Presiding Practitioner: Markus Steyn (Accredited Labour Relations Specialist).
• In Attendance: Keagan Naidoo (Employee), Nomsa Ndlovu (Peer Workplace Representative).
• Opening Statement: Employee was informed of rights under LRA Schedule 8, including right to representation, interpretation, and non-incrimination.
• Employee Statement: Keagan stated: "On October 12 at 22:15, torrential rain on Hex River Pass caused localized flash flooding. Road signs recommended heavy vehicles divert via R46. My cellular signal dropped in the valley, preventing immediate contact with dispatch."
• Evidence Checked: Telematics GPS confirms detour commenced at 22:19. Weather bureau flash warning verified.
• Finding: Substantive breach of communications protocol, but mitigating safety factors present. Sanction recommended: Written Warning rather than Final Warning.`,
    actionItems: [
      { id: 'act_03', task: 'Attach weather service meteorological alert to file', owner: 'Markus Steyn', dueDate: '2026-10-16', completed: true },
      { id: 'act_04', task: 'Issue formal LRA Written Warning notice', owner: 'Markus Steyn', dueDate: '2026-10-17', completed: true }
    ],
    attachmentFileName: 'inquiry_recording_audio_notes.mp3',
    attachmentFileSize: '14.2 MB',
    permissionLevel: 'superadmin_only',
    createdByRole: 'Super Admin',
    createdAt: '2026-10-14'
  },
  {
    id: 'meet_03',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_02',
    employeeName: 'Ansie van der Merwe',
    consultantName: 'Sarah Khanyile',
    meetingTitle: 'Monthly 1-on-1: Maternity Transition & BCEA Entitlements',
    meetingType: '1_on_1_regular',
    cadence: 'monthly',
    date: '2026-10-22',
    timeSlot: '11:00 - 11:45',
    sessionFormat: 'teams',
    topicWhy: 'BCEA Maternity Leave Schedule & Department Handover',
    agendaWhat: 'Review of statutory maternity leave dates, UIF UI-19 documentation, and freight ledger handover schedule.',
    transcriptOrNotes: `MEETING TRANSCRIPT & EMPLOYEE COPY:
• Discussed BCEA Section 25: 4 consecutive months maternity leave commencement date.
• Handover Plan: Ansie will train backup clerk on SARS eFiling EMP201 submissions and monthly UI-19 declarations.
• Communication Preferences: Ansie confirmed she would like company newsletters sent to personal email during leave.
• Both parties signed the maternity leave arrangement memorandum.`,
    actionItems: [
      { id: 'act_05', task: 'Complete UI-19 and UI-2.7 UIF maternity application forms', owner: 'Ansie van der Merwe', dueDate: '2026-11-15', completed: false },
      { id: 'act_06', task: 'Confirm temporary payroll contractor onboarding', owner: 'Sarah Khanyile', dueDate: '2026-11-20', completed: false }
    ],
    attachmentFileName: 'maternity_transition_handover_plan.pdf',
    attachmentFileSize: '920 KB',
    permissionLevel: 'all_including_employee',
    createdByRole: 'Consultant',
    createdAt: '2026-10-22',
    nextFollowUpDate: '2026-11-12'
  }
];

export const DIAGNOSTIC_FRAMEWORKS_CATALOG: DiagnosticFrameworkTemplate[] = [
  {
    id: 'compliance_bcea_popia',
    title: 'BCEA & POPIA Statutory Compliance Diagnostic',
    subtitle: 'South African Regulatory Readiness & Data Protection Audit',
    standardNorm: 'BCEA 75 of 1997 & POPIA Act 4 of 2013 National Standard',
    description: 'Evaluates employee understanding of statutory working time (BCEA Sec 9), overtime consent, sick leave certification requirements, and POPIA special personal information handling.',
    estimatedMinutes: 15,
    categories: [
      'BCEA Working Hours & Overtime',
      'Statutory Leave Verification',
      'POPIA Data Safeguards',
      'Health & Safety Reporting'
    ],
    questions: [
      {
        id: 'q_comp_1',
        category: 'BCEA Working Hours & Overtime',
        prompt: 'Under BCEA Section 9 & 10, what is the statutory ordinary weekly limit and overtime requirement for employees earning below the ministerial earnings threshold (R254,371.67/yr)?',
        options: [
          { id: 'opt_1_a', text: '45 hours ordinary weekly maximum; overtime requires agreement and is capped at 10 hours per week paid at minimum 1.5x.', score: 10, rationale: 'Strictly compliant with BCEA Sec 9 and Sec 10.' },
          { id: 'opt_1_b', text: '50 hours ordinary weekly maximum; overtime is unpaid if included in basic salary.', score: 0, rationale: 'Violates basic statutory ceilings.' },
          { id: 'opt_1_c', text: '40 hours ordinary maximum; overtime requires 24 hours written notice.', score: 4, rationale: 'Misquotes statutory ceiling.' }
        ]
      },
      {
        id: 'q_comp_2',
        category: 'Statutory Leave Verification',
        prompt: 'An employee is absent on Friday and Monday claiming sudden illness. Under BCEA Section 23, when may an employer legitimately withhold sick pay pending medical certificate?',
        options: [
          { id: 'opt_2_a', text: 'If absent for more than 2 consecutive days, or on more than 2 occasions during an 8-week period without a registered medical practitioner certificate.', score: 10, rationale: 'Exact wording of BCEA Section 23(1).' },
          { id: 'opt_2_b', text: 'Only if the employee has been absent for at least 5 consecutive business days.', score: 2, rationale: 'Incorrect statutory threshold.' },
          { id: 'opt_2_c', text: 'Employers may never withhold sick pay under any circumstances.', score: 0, rationale: 'Incorrect under SA Labour Law.' }
        ]
      },
      {
        id: 'q_comp_3',
        category: 'POPIA Data Safeguards',
        prompt: 'Under POPIA Section 19, what measure must an employee take when processing sensitive workforce records (ID copies, medical certificates, biometric data)?',
        options: [
          { id: 'opt_3_a', text: 'Maintain reasonable organizational and technical measures, store strictly in encrypted vault, and prevent unauthorized third-party access.', score: 10, rationale: 'Conforms to POPIA Information Officer protocol.' },
          { id: 'opt_3_b', text: 'Keep physical printouts openly on office desks for quick filing access.', score: 0, rationale: 'Direct breach of POPIA Section 19.' },
          { id: 'opt_3_c', text: 'Share employee medical details freely with departmental peers.', score: 0, rationale: 'Serious privacy infraction punishable under Section 107.' }
        ]
      },
      {
        id: 'q_comp_4',
        category: 'Health & Safety Reporting',
        prompt: 'Under OHSA Section 24 & COIDA, within what timeframe must a workplace injury resulting in medical treatment or lost workdays be recorded and submitted to the Compensation Commissioner?',
        options: [
          { id: 'opt_4_a', text: 'Formal internal incident log immediately; statutory W.Cl.2 employer report submitted within 7 days to Compensation Fund.', score: 10, rationale: 'Conforms to COIDA statutory guidelines.' },
          { id: 'opt_4_b', text: 'Submit within 6 months at annual financial year-end.', score: 0, rationale: 'Severe penalty risk for delayed reporting.' },
          { id: 'opt_4_c', text: 'Only report if the employee takes formal civil legal action.', score: 0, rationale: 'Completely non-compliant.' }
        ]
      }
    ]
  },
  {
    id: 'situational_judgment_lra',
    title: 'CCMA & LRA Schedule 8 Situational Judgment Battery',
    subtitle: 'Fair Labour Practice, Progressive Discipline & Procedural Due Process',
    standardNorm: 'CCMA Code of Good Practice on Dismissal (LRA 66 of 1995)',
    description: 'Assesses line supervisors and staff on dealing with performance incapacity, workplace grievances, insubordination, and ensuring substantive and procedural fairness.',
    estimatedMinutes: 20,
    categories: [
      'Substantive Fairness',
      'Procedural Due Process',
      'Progressive Discipline',
      'Union & Shop Steward Engagement'
    ],
    questions: [
      {
        id: 'q_lra_1',
        category: 'Substantive Fairness',
        prompt: 'A staff member arrives 15 minutes late twice in one month with valid public transit delays. What is the lawful and balanced HR response under LRA Schedule 8?',
        options: [
          { id: 'opt_lra_1a', text: 'Conduct an informal verbal counseling session, review operational transport options, and document discussion without punitive disciplinary sanction.', score: 10, rationale: 'Follows progressive discipline and corrective counseling.' },
          { id: 'opt_lra_1b', text: 'Immediately issue an unappealable Final Written Warning.', score: 0, rationale: 'Disproportionate sanction; vulnerable at CCMA.' },
          { id: 'opt_lra_1c', text: 'Dismiss employee on the spot for gross dereliction of duty.', score: 0, rationale: 'Gross substantive unfairness leading to CCMA reinstatement order.' }
        ]
      },
      {
        id: 'q_lra_2',
        category: 'Procedural Due Process',
        prompt: 'Before convening a formal disciplinary hearing for alleged serious misconduct, what procedural rights must be guaranteed to the employee under Item 4 of Schedule 8?',
        options: [
          { id: 'opt_lra_2a', text: 'At least 48 hours written notice with specific charges, right to representation (colleague or trade union official), interpreter if requested, and right to cross-examine.', score: 10, rationale: 'Gold-standard procedural compliance for CCMA defense.' },
          { id: 'opt_lra_2b', text: '10 minutes verbal notice without formal charge sheet.', score: 0, rationale: 'Fatal procedural flaw.' },
          { id: 'opt_lra_2c', text: 'Right to legal advocate in all cases regardless of collective agreements.', score: 4, rationale: 'Misunderstands representation rules under Schedule 8.' }
        ]
      },
      {
        id: 'q_lra_3',
        category: 'Progressive Discipline',
        prompt: 'How long do standard written warning sanctions normally remain valid under prevailing South African labour practice guidelines before expiring?',
        options: [
          { id: 'opt_lra_3a', text: 'Typically 6 months (or 3 months for minor infractions; 12 months for final written warnings), after which the record lapses.', score: 10, rationale: 'Standard South African progressive discipline doctrine.' },
          { id: 'opt_lra_3b', text: 'Warnings remain permanently active for the employee entire lifetime.', score: 0, rationale: 'Deemed unfair and unconstitutional practice at CCMA.' },
          { id: 'opt_lra_3c', text: 'Warnings automatically expire after 7 business days.', score: 2, rationale: 'Too short to serve progressive disciplinary purpose.' }
        ]
      }
    ]
  },
  {
    id: 'operational_aptitude',
    title: 'Operational & Workflow Aptitude Benchmark',
    subtitle: 'NQF Operational Execution, Accuracy & Systematic Thinking',
    standardNorm: 'National Qualifications Framework (NQF) Level 5/6 Competency',
    description: 'Tests operational speed, resource allocation, inventory/freight reconciliation accuracy, and workplace task prioritization.',
    estimatedMinutes: 20,
    categories: [
      'Workflow Prioritization',
      'Quantitative Accuracy',
      'Process Escalation',
      'Risk Mitigation'
    ],
    questions: [
      {
        id: 'q_ops_1',
        category: 'Workflow Prioritization',
        prompt: 'Three critical issues occur simultaneously: a customer freight manifest discrepancy, an urgent OHS wet-floor spill, and routine email replies. What is the correct priority sequence?',
        options: [
          { id: 'opt_ops_1a', text: '1. OHS wet floor safety hazard; 2. Customer freight manifest; 3. Routine email correspondence.', score: 10, rationale: 'Physical human safety always takes legal precedence under OHSA.' },
          { id: 'opt_ops_1b', text: '1. Routine emails; 2. Customer manifest; 3. OHS spill.', score: 0, rationale: 'Severe negligence and safety violation.' },
          { id: 'opt_ops_1c', text: 'Ignore all until end of shift.', score: 0, rationale: 'Unacceptable operational behavior.' }
        ]
      },
      {
        id: 'q_ops_2',
        category: 'Quantitative Accuracy',
        prompt: 'A shipment has 40 pallets valued at R12,500 each. A 15% South African VAT rate applies. What is the total invoiced value including VAT?',
        options: [
          { id: 'opt_ops_2a', text: 'R 575,000 (Subtotal R500,000 + 15% VAT R75,000).', score: 10, rationale: 'Accurate commercial mathematical calculation.' },
          { id: 'opt_ops_2b', text: 'R 500,000.', score: 2, rationale: 'Omitted mandatory 15% VAT.' },
          { id: 'opt_ops_2c', text: 'R 620,000.', score: 0, rationale: 'Incorrect math.' }
        ]
      }
    ]
  },
  {
    id: 'leadership_readiness',
    title: 'King IV Leadership & Supervisory Readiness Index',
    subtitle: 'Ethical Governance, Delegation & Workplace Conflict Resolution',
    standardNorm: 'King IV Report on Corporate Governance & Supervisory Standard',
    description: 'Diagnoses readiness for managerial promotion, delegative accountability, inclusive team motivation, and ethical workplace governance.',
    estimatedMinutes: 25,
    categories: [
      'Ethical Decision Making',
      'Inclusive Team Motivation',
      'Performance Coaching',
      'Change Management'
    ],
    questions: [
      {
        id: 'q_lead_1',
        category: 'Performance Coaching',
        prompt: 'An experienced team member demonstrates a sudden decline in weekly productivity. As a prospective supervisor, how do you handle the 1-on-1?',
        options: [
          { id: 'opt_lead_1a', text: 'Schedule a private supportive 1-on-1, explore root causes (workload, burnout, or personal factors), co-create a realistic 30-day performance roadmap, and set weekly check-ins.', score: 10, rationale: 'Exemplary servant leadership and constructive coaching.' },
          { id: 'opt_lead_1b', text: 'Reprimand the employee publicly in front of the team to set an example.', score: 0, rationale: 'Toxic leadership leading to grievances and high turnover.' },
          { id: 'opt_lead_1c', text: 'Reassign all their tasks to other team members without speaking to them.', score: 2, rationale: 'Avoids accountability and demoralizes the team.' }
        ]
      },
      {
        id: 'q_lead_2',
        category: 'Ethical Decision Making',
        prompt: 'A line manager asks you to alter a timesheet or document audit to conceal a missed statutory deadline. How should an ethical leader respond?',
        options: [
          { id: 'opt_lead_2a', text: 'Respectfully refuse, report the accurate data in line with King IV code of conduct, and assist with legitimate remediation plans.', score: 10, rationale: 'Maintains integrity and protects organization from fraud liability.' },
          { id: 'opt_lead_2b', text: 'Comply with the alteration to avoid conflict with the senior manager.', score: 0, rationale: 'Complicity in fraudulent reporting.' },
          { id: 'opt_lead_2c', text: 'Post about the incident anonymously on social media.', score: 0, rationale: 'Violates confidentiality policies and employment contract.' }
        ]
      }
    ]
  }
];

export const INITIAL_MATRIX_AUDITS: MatrixAuditRecord[] = [
  {
    id: 'mat_audit_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    auditorName: 'Naledi Sithole',
    auditorRole: 'Lead HR Consultant',
    frameworkType: 'nine_box_grid',
    auditTitle: '2026 Q3 9-Box Talent & Succession Audit',
    auditDate: '2026-10-18',
    xScore: 4.5,
    yScore: 4.8,
    quadrantOrCategory: 'High Potential Star (Top Right)',
    overallRatingPercent: 93,
    competencyRatings: {
      'Fleet Logistics Delivery': 5,
      'Safety & BCEA Compliance': 5,
      'Team Leadership': 4,
      'Operational Problem Solving': 5,
      'Continuous Learning & Agility': 5
    },
    findingsAndStrengths: 'Sipho consistently outperforms regional delivery benchmarks with zero road safety infringements over 36 consecutive months. Excellent peer respect and strong understanding of Cape Town arterial freight routes.',
    developmentAreas: 'Prepare for formal promotion to Fleet Operations Supervisor; needs advanced ERP inventory reporting and logistics dispatch software certifications.',
    recommendedAction: 'Enroll in NQF Level 6 Supervisory Logistics Program; designate as primary successor for retiring Depot Manager.',
    nextAuditDueDate: '2027-04-18',
    status: 'Finalized',
    createdAt: '2026-10-18',
    assignedToEmployee: true,
    optionalEvaluationEnabled: true,
    evaluationPrompt: 'Reflect on your Q3 Fleet Logistics performance, safety record, and readiness to mentor junior drivers over the next 6 months.',
    employeeSelfEvaluationResponse: 'Maintained 100% on-time dispatch across Cape Town arterial routes and mentored two new drivers on BCEA logbook compliance.',
    employeeSelfScoreX: 4.5,
    employeeSelfScoreY: 4.5,
    employeeEvaluationSubmittedAt: '2026-10-19'
  },
  {
    id: 'mat_audit_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_03',
    employeeName: 'Keagan Naidoo',
    auditorName: 'Markus Steyn',
    auditorRole: 'Labour Relations Specialist',
    frameworkType: 'retention_risk_matrix',
    auditTitle: 'Retention Risk vs Criticality Evaluation',
    auditDate: '2026-10-15',
    xScore: 3.2,
    yScore: 4.5,
    quadrantOrCategory: 'High Criticality / Medium Flight Risk',
    overallRatingPercent: 77,
    competencyRatings: {
      'Long-Haul Specialized Freight': 5,
      'Hazchem Certified Handling': 5,
      'Protocol Adherence': 3,
      'Communication Transparency': 3
    },
    findingsAndStrengths: 'Holds scarce PrDP and Hazchem cross-border certifications critical to national freight routes. High commercial value to client contracts.',
    developmentAreas: 'Needs improved alignment on telematics protocol adherence following recent investigatory inquiry.',
    recommendedAction: 'Implement bi-weekly check-in schedule, re-engage on career milestones, and review retention incentive allowance.',
    nextAuditDueDate: '2027-01-15',
    status: 'Approved',
    createdAt: '2026-10-15',
    assignedToEmployee: true,
    optionalEvaluationEnabled: true,
    evaluationPrompt: 'Please share your self-evaluation regarding long-haul route support, telematics adherence, and what support you need from management.'
  },
  {
    id: 'mat_audit_03',
    companyId: 'comp_highveld_eng',
    employeeId: 'emp_04',
    employeeName: 'Lerato Khumalo',
    auditorName: 'Naledi Sithole',
    auditorRole: 'HR Strategy Director',
    frameworkType: 'bbee_skills_audit',
    auditTitle: 'Employment Equity & Skills Development Audit',
    auditDate: '2026-10-05',
    xScore: 4.2,
    yScore: 4.6,
    quadrantOrCategory: 'Designated Group Star / Priority EEA Trainee',
    overallRatingPercent: 88,
    competencyRatings: {
      'Precision Quality Auditing': 5,
      'ISO 9001 Compliance': 4,
      'Engineering Principles': 4,
      'Mentorship & Guidance': 4
    },
    findingsAndStrengths: 'Exemplary analytical accuracy in heavy mechanical component tolerance testing. Perfect fit for company Employment Equity succession plan in Senior Technician tier.',
    developmentAreas: 'Needs project management credential to oversee full production line turnarounds.',
    recommendedAction: 'Submit training allocation to merSETA Workplace Skills Plan for bursary funding; formalize management development trajectory.',
    nextAuditDueDate: '2027-03-30',
    status: 'Finalized',
    createdAt: '2026-10-05',
    assignedToEmployee: true,
    optionalEvaluationEnabled: true,
    evaluationPrompt: 'Provide your input on your merSETA engineering skills goals and supervisory readiness for 2027.'
  }
];

export const INITIAL_DIAGNOSTIC_TEST_RESULTS: StandardizedTestResult[] = [
  {
    id: 'diag_res_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    evaluatorName: 'Naledi Sithole',
    testType: 'compliance_bcea_popia',
    testTitle: 'BCEA & POPIA Statutory Compliance Diagnostic',
    testDate: '2026-10-16',
    durationMinutes: 14,
    scoreAchieved: 38,
    totalPossibleScore: 40,
    scorePercentage: 95,
    percentileRank: 96,
    proficiencyBand: 'Exemplary',
    categoryBreakdown: [
      { category: 'BCEA Working Hours & Overtime', score: 10, maxScore: 10, percentage: 100 },
      { category: 'Statutory Leave Verification', score: 10, maxScore: 10, percentage: 100 },
      { category: 'POPIA Data Safeguards', score: 10, maxScore: 10, percentage: 100 },
      { category: 'Health & Safety Reporting', score: 8, maxScore: 10, percentage: 80 }
    ],
    diagnosticAnalysis: 'Exceptional mastery of statutory labour provisions, BCEA maximum hours, and POPIA privacy constraints. Demonstrates highest tier compliance readiness.',
    prescribedInterventions: [
      'Appoint as Departmental Health & Safety Workplace Representative (OHSA Sec 17)',
      'Authorize to mentor incoming junior drivers on logbook compliance'
    ],
    certificateNumber: 'GH-DIAG-2026-0941',
    createdAt: '2026-10-16'
  },
  {
    id: 'diag_res_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_02',
    employeeName: 'Ansie van der Merwe',
    evaluatorName: 'Sarah Khanyile',
    testType: 'operational_aptitude',
    testTitle: 'Operational & Workflow Aptitude Benchmark',
    testDate: '2026-10-19',
    durationMinutes: 18,
    scoreAchieved: 20,
    totalPossibleScore: 20,
    scorePercentage: 100,
    percentileRank: 99,
    proficiencyBand: 'Exemplary',
    categoryBreakdown: [
      { category: 'Workflow Prioritization', score: 10, maxScore: 10, percentage: 100 },
      { category: 'Quantitative Accuracy', score: 10, maxScore: 10, percentage: 100 }
    ],
    diagnosticAnalysis: 'Flawless quantitative precision and prompt hazard prioritization under pressure. High attention to billing ledgers and freight dispatch manifests.',
    prescribedInterventions: [
      'Promote to Senior Freight Billing Administrator upon return from maternity leave',
      'Authorize for secondary audit sign-off on electronic invoices'
    ],
    certificateNumber: 'GH-DIAG-2026-1182',
    createdAt: '2026-10-19'
  }
];

export const INITIAL_PORTAL_USERS: PortalUserAccount[] = [
  {
    id: 'puser_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    usernameOrEmail: 'sipho.d@capelogistics.co.za',
    portalPassword: 'Cape#2026!Sipho',
    lastPasswordReset: '2026-10-01',
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
  },
  {
    id: 'puser_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_02',
    employeeName: 'Ansie van der Merwe',
    usernameOrEmail: 'ansie.v@capelogistics.co.za',
    portalPassword: 'Cape#2026!Ansie',
    lastPasswordReset: '2026-09-18',
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
  },
  {
    id: 'puser_03',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_03',
    employeeName: 'Keagan Naidoo',
    usernameOrEmail: 'keagan.n@capelogistics.co.za',
    portalPassword: 'Cape#2026!Keagan',
    lastPasswordReset: '2026-10-10',
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
  },
  {
    id: 'puser_04',
    companyId: 'comp_highveld_eng',
    employeeId: 'emp_04',
    employeeName: 'Lerato Khumalo',
    usernameOrEmail: 'lerato.k@highveld-industrial.co.za',
    portalPassword: 'Highveld#2026!LK',
    lastPasswordReset: '2026-10-05',
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
  }
];

export const INITIAL_COMPANY_PROPERTIES: CompanyPropertyAssignment[] = [
  {
    id: 'prop_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    itemName: 'Dell Latitude 5540 Rugged Fleet Laptop & LTE Router',
    category: 'Laptop / IT Hardware',
    assetTag: 'GH-ASSET-CL-2026-0104',
    insurancePolicyAndCoverage: 'Santam Commercial All-Risk Policy #SNT-884920 (Full Accidental & Transit Cover)',
    insuredValueZar: 28500,
    lengthOfUse: '24 Months (2025-03-01 to 2027-03-01 / Duration of Role)',
    assignedDate: '2025-03-01',
    returnDueDate: '2027-03-01',
    agreementTitle: 'BCEA Section 34 Company Property & Asset Custody Agreement',
    agreementText: `COMPANY PROPERTY CUSTODY & RESPONSIBILITY AGREEMENT (READ-ONLY EMPLOYEE RECORD)

1. ASSET IDENTIFICATION & CUSTODIAN:
• Assigned Employee: Sipho Dlamini (SA ID: 8604125894083)
• Employer Entity: Cape Logistics (Pty) Ltd
• Equipment Description: Dell Latitude 5540 Rugged Fleet Laptop & LTE Router
• Official Asset Tag: GH-ASSET-CL-2026-0104
• Insured Replacement Value: R28,500.00 (Santam Policy #SNT-884920)
• Authorized Length of Use: 24 Months (2025-03-01 to 2027-03-01)

2. CONDITIONS OF USE & SAFEKEEPING:
The Employee acknowledges receipt of the above company property in good working order. The asset remains the sole property of Cape Logistics (Pty) Ltd and is issued strictly for official operational duties.

3. INSURANCE & THEFT REPORTING:
In the event of theft, hijacking, or accidental damage, the Employee must report the incident to the South African Police Service (SAPS) within 24 hours to obtain a CAS Case Number and notify HR & Fleet Risk immediately for insurance claim processing.

4. BCEA SECTION 34 LAWFUL DEDUCTION ACKNOWLEDGMENT:
In terms of Section 34(1) and 34(2) of the Basic Conditions of Employment Act 75 of 1997, any reimbursement for loss or damage caused by gross negligence may only be instituted following a fair inquiry and may not exceed 25% of the Employee's net remuneration in any single pay period.

[LOCKED DOCUMENT — VIEWABLE TO ASSIGNED EMPLOYEE ONLY — NON-EDITABLE]`,
    acknowledgedByEmployee: true,
    acknowledgedAt: '2025-03-02',
    assignedByAdmin: 'Naledi Sithole (Super Admin)'
  },
  {
    id: 'prop_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    itemName: 'Toyota Hilux 2.4 GD-6 Double Cab Fleet Patrol Vehicle (Reg: CAA 482-910)',
    category: 'Company Vehicle',
    assetTag: 'GH-ASSET-CL-VEH-019',
    insurancePolicyAndCoverage: 'Hollard Commercial Fleet Comprehensive #HLD-FLT-9921 (Includes Roadside & MiWay Telematics)',
    insuredValueZar: 645000,
    lengthOfUse: '12 Months Renewable Operational Assignment (2026-01-01 to 2026-12-31)',
    assignedDate: '2026-01-01',
    returnDueDate: '2026-12-31',
    agreementTitle: 'Commercial Fleet Vehicle Custody & Telematics Policy Agreement',
    agreementText: `COMMERCIAL FLEET VEHICLE CUSTODY AGREEMENT (READ-ONLY EMPLOYEE RECORD)

1. VEHICLE & INSURANCE PARTICULARS:
• Assigned Custodian: Sipho Dlamini (Senior Logistics Controller)
• Vehicle Description: Toyota Hilux 2.4 GD-6 Double Cab (Registration: CAA 482-910)
• Asset Tag & Telematics ID: GH-ASSET-CL-VEH-019
• Insurance Coverage: Hollard Commercial Fleet Comprehensive #HLD-FLT-9921 (Insured Value: R645,000.00)
• Length of Use: 12 Months Renewable (2026-01-01 to 2026-12-31)

2. STATUTORY & ROAD TRAFFIC COMPLIANCE:
The Employee must maintain a valid South African Driving Licence and PrDP where applicable, adhere to AARTO / National Road Traffic Act speed limits, and log all business vs private kilometres for SARS travel logbook compliance.

[LOCKED DOCUMENT — VIEWABLE TO ASSIGNED EMPLOYEE ONLY — NON-EDITABLE]`,
    acknowledgedByEmployee: false,
    assignedByAdmin: 'Naledi Sithole (Super Admin)'
  },
  {
    id: 'prop_03',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_02',
    employeeName: 'Ansie van der Merwe',
    itemName: 'Apple MacBook Air M3 15" & Encrypted Payroll Token',
    category: 'Laptop / IT Hardware',
    assetTag: 'GH-ASSET-CL-FIN-042',
    insurancePolicyAndCoverage: 'Santam Electronic Equipment Policy #SNT-884920-IT',
    insuredValueZar: 34900,
    lengthOfUse: '36 Months IT Refresh Cycle (2024-06-01 to 2027-06-01)',
    assignedDate: '2024-06-01',
    returnDueDate: '2027-06-01',
    agreementTitle: 'POPIA Encrypted Financial Hardware & Asset Custody Agreement',
    agreementText: `POPIA ENCRYPTED HARDWARE & ASSET CUSTODY AGREEMENT (READ-ONLY EMPLOYEE RECORD)

• Assigned Employee: Ansie van der Merwe (Payroll & Freight Administrator)
• Asset Tag: GH-ASSET-CL-FIN-042
• Insurance: Santam Electronic Equipment Policy #SNT-884920-IT (R34,900.00)
• Length of Use: 36 Months (2024-06-01 to 2027-06-01)

The Employee agrees to maintain FileVault disk encryption at all times in compliance with POPIA Section 19 security safeguards for payroll data.

[LOCKED DOCUMENT — VIEWABLE TO ASSIGNED EMPLOYEE ONLY — NON-EDITABLE]`,
    acknowledgedByEmployee: true,
    acknowledgedAt: '2024-06-02',
    assignedByAdmin: 'Naledi Sithole (Super Admin)'
  }
];

export const INITIAL_EMPLOYEE_KPIS: EmployeeKpiItem[] = [
  {
    id: 'kpi_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    period: '2026 Q4 Performance Cycle',
    kpiTitle: 'On-Time Regional Freight Dispatch & Turnaround (< 15 min delay)',
    targetMetric: '98.5% On-Time Western Cape Corridor Dispatch',
    weightPercent: 40,
    employeeSelfRating: 5,
    employeeAnswerAndEvidence: 'Achieved 99.1% on-time dispatch across 410 scheduled trips in Q3/Q4. Zero cold-chain temperature excursions.',
    managerScore: 5,
    status: 'Submitted by Employee',
    updatedAt: '2026-10-18'
  },
  {
    id: 'kpi_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    period: '2026 Q4 Performance Cycle',
    kpiTitle: 'BCEA Driver Fatigue & Logbook Compliance Audit Score',
    targetMetric: '100% Statutory Rest Interval & AARTO Zero-Defect Logbooks',
    weightPercent: 35,
    employeeSelfRating: 4,
    employeeAnswerAndEvidence: '',
    status: 'Pending Employee Input',
    updatedAt: '2026-10-20'
  },
  {
    id: 'kpi_03',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    period: '2026 Q4 Performance Cycle',
    kpiTitle: 'Junior Driver Safety Mentorship & Fuel Efficiency',
    targetMetric: 'Reduce fleet diesel consumption variance by 4% & mentor 2 new hires',
    weightPercent: 25,
    employeeSelfRating: 4,
    employeeAnswerAndEvidence: '',
    status: 'Pending Employee Input',
    updatedAt: '2026-10-20'
  },
  {
    id: 'kpi_04',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_02',
    employeeName: 'Ansie van der Merwe',
    period: '2026 Q4 Performance Cycle',
    kpiTitle: 'SARS EMP201 & UIF Monthly Reconciliation Accuracy',
    targetMetric: '100% On-Time Filing Before the 7th of Every Month',
    weightPercent: 50,
    employeeSelfRating: 5,
    employeeAnswerAndEvidence: 'All EMP201 and uFiling declarations submitted 3 business days ahead of statutory deadline.',
    managerScore: 5,
    status: 'Submitted by Employee',
    updatedAt: '2026-10-15'
  }
];

export const INITIAL_ONBOARDING_TASKS: EmployeeOnboardingTask[] = [
  {
    id: 'onb_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    stepCategory: 'Statutory & POPIA',
    title: 'POPIA Personal Information Processing & Biometric Consent',
    instructions: 'Confirm that you have read the POPIA Section 18 Privacy Notice and consent to payroll, SARS, UIF, and biometric access processing.',
    requiresAnswer: true,
    employeeAnswer: 'I confirm receipt and consent to POPIA personal data processing for statutory employment purposes.',
    completed: true,
    completedAt: '2026-01-10'
  },
  {
    id: 'onb_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    stepCategory: 'Role & Safety Induction',
    title: 'OHSA Section 14 Workplace Health & Safety Emergency Protocol Questionnaire',
    instructions: 'State your designated assembly point at the Milnerton Depot and confirm you have inspected the fleet fire extinguisher & first-aid kit protocol.',
    requiresAnswer: true,
    employeeAnswer: '',
    completed: false
  },
  {
    id: 'onb_03',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    stepCategory: 'Contract & Policies',
    title: 'BCEA Section 29 Employment Terms & Disciplinary Code Acknowledgment',
    instructions: 'Confirm your understanding of the company working hours, overtime policy, and LRA Schedule 8 disciplinary code.',
    requiresAnswer: true,
    employeeAnswer: '',
    completed: false
  },
  {
    id: 'onb_04',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_02',
    employeeName: 'Ansie van der Merwe',
    stepCategory: 'Statutory & POPIA',
    title: 'Finance & Payroll POPIA Operator Confidentiality Declaration',
    instructions: 'Provide your declaration confirming strict confidentiality over employee payslips, banking details, and medical aid disclosures.',
    requiresAnswer: true,
    employeeAnswer: '',
    completed: false
  }
];

export const INITIAL_ORG_CHART_NODES: OrgChartNode[] = [
  {
    id: 'org_cape_01',
    companyId: 'comp_cape_logistics',
    name: 'Hendrik Pretorius',
    jobTitle: 'Managing Director & CEO',
    department: 'Executive Board',
    tierLevel: 1,
    reportsToNodeId: null,
    location: 'Cape Town HQ'
  },
  {
    id: 'org_cape_02',
    companyId: 'comp_cape_logistics',
    name: 'Andre Venter',
    jobTitle: 'General Manager: Operations & Finance',
    department: 'Operations & Finance',
    tierLevel: 2,
    reportsToNodeId: 'org_cape_01',
    location: 'Milnerton Depot'
  },
  {
    id: 'org_cape_03',
    companyId: 'comp_cape_logistics',
    name: 'Naledi Sithole (GreenHive HRaaS)',
    jobTitle: 'Embedded Lead HR & Labour Partner',
    department: 'GreenHive HRaaS Practice',
    tierLevel: 2,
    reportsToNodeId: 'org_cape_01',
    location: 'Hybrid / Cape Town'
  },
  {
    id: 'org_cape_04',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    name: 'Sipho Dlamini',
    jobTitle: 'Senior Logistics Controller',
    department: 'Fleet Operations',
    tierLevel: 3,
    reportsToNodeId: 'org_cape_02',
    location: 'Milnerton Depot'
  },
  {
    id: 'org_cape_05',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_02',
    name: 'Ansie van der Merwe',
    jobTitle: 'Payroll & Freight Administrator',
    department: 'Finance & Compliance',
    tierLevel: 3,
    reportsToNodeId: 'org_cape_02',
    location: 'Bellville Office'
  },
  {
    id: 'org_cape_06',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_03',
    name: 'Keagan Naidoo',
    jobTitle: 'Long-Haul Heavy Vehicle Operator',
    department: 'Fleet Operations',
    tierLevel: 4,
    reportsToNodeId: 'org_cape_04',
    location: 'National N1 Corridor'
  }
];

export const INITIAL_SETA_RECORDS: SetaTrainingRecord[] = [
  {
    id: 'seta_01',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_01',
    employeeName: 'Sipho Dlamini',
    beeRaceGroup: 'African',
    gender: 'Male',
    courseOrProgramTitle: 'National Certificate: Supply Chain & Freight Transport Management',
    programType: 'SETA Learnership (18.1 Employed)',
    nqfLevel: 'NQF Level 5',
    setaCode: 'TETA-LRN-59201',
    costSpendZar: 42000,
    MandatoryGrantClaimableZar: 18500,
    includedInWsp: true,
    completedForAtr: true,
    bbbeeCategoryCode: 'Category C (Learnerships)',
    status: 'Completed',
    completionDate: '2025-11-18'
  },
  {
    id: 'seta_02',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_03',
    employeeName: 'Keagan Naidoo',
    beeRaceGroup: 'Indian',
    gender: 'Male',
    courseOrProgramTitle: 'Hazchem Dangerous Goods & Defensive Heavy Vehicle Driving Certification',
    programType: 'Accredited Course',
    nqfLevel: 'NQF Level 4',
    setaCode: 'TETA-SKL-10492',
    costSpendZar: 16500,
    MandatoryGrantClaimableZar: 6600,
    includedInWsp: true,
    completedForAtr: false,
    bbbeeCategoryCode: 'Category D (Short Courses)',
    status: 'In Progress'
  },
  {
    id: 'seta_03',
    companyId: 'comp_cape_logistics',
    employeeId: 'emp_08',
    employeeName: 'Zainab Abrahams',
    beeRaceGroup: 'Coloured',
    gender: 'Female',
    courseOrProgramTitle: 'Postgraduate Diploma in Strategic Logistics & Customs Governance',
    programType: 'Workplace Bursary',
    nqfLevel: 'NQF Level 8',
    setaCode: 'TETA-BUR-88102',
    costSpendZar: 58000,
    MandatoryGrantClaimableZar: 24000,
    includedInWsp: true,
    completedForAtr: true,
    bbbeeCategoryCode: 'Category A (Bursaries)',
    status: 'Completed',
    completionDate: '2025-12-04'
  },
  {
    id: 'seta_04',
    companyId: 'comp_highveld_eng',
    employeeId: 'emp_04',
    employeeName: 'Thabo Mokoena',
    beeRaceGroup: 'African',
    gender: 'Male',
    courseOrProgramTitle: 'MERSETA Master Artisan Automated CNC & Robotics Upskilling',
    programType: 'SETA Learnership (18.1 Employed)',
    nqfLevel: 'NQF Level 6',
    setaCode: 'MER-LRN-30918',
    costSpendZar: 54000,
    MandatoryGrantClaimableZar: 22000,
    includedInWsp: true,
    completedForAtr: true,
    bbbeeCategoryCode: 'Category C (Learnerships)',
    status: 'Completed',
    completionDate: '2025-10-22'
  },
  {
    id: 'seta_05',
    companyId: 'comp_highveld_eng',
    employeeId: 'emp_05',
    employeeName: 'Lerato Khumalo',
    beeRaceGroup: 'African',
    gender: 'Female',
    courseOrProgramTitle: 'Advanced Mine Health & Safety Act (MHSA) Lead Auditor Programme',
    programType: 'Accredited Course',
    nqfLevel: 'NQF Level 6',
    setaCode: 'MER-OHS-77120',
    costSpendZar: 29500,
    MandatoryGrantClaimableZar: 12500,
    includedInWsp: true,
    completedForAtr: true,
    bbbeeCategoryCode: 'Category B (Internships)',
    status: 'Completed',
    completionDate: '2026-01-15'
  }
];

export const INITIAL_BBBEE_SCORECARDS: BbbeeScorecardProfile[] = [
  {
    companyId: 'comp_cape_logistics',
    financialYear: '2025 / 2026 Verification Period',
    enterpriseCategory: 'Generic Enterprise (>R50m)',
    ownershipScore: 23.5,
    managementControlScore: 15.8,
    skillsDevelopmentScore: 18.4,
    enterpriseSupplierDevScore: 36.2,
    socioEconomicDevScore: 5.0,
    yesInitiativeBonus: 3.0,
    priorityElementsSubminimumMet: true,
    verifiedEvidenceItems: [
      {
        id: 'ev_01',
        element: 'Ownership',
        documentTitle: 'Share Register & Black Women Ownership Trust Deed (51% Black Owned)',
        verificationStatus: 'Verified for Audit',
        updatedAt: '2026-01-14'
      },
      {
        id: 'ev_02',
        element: 'Management Control & EE',
        documentTitle: 'Submitted Department of Employment & Labour EEA2 / EEA4 Stamped Acknowledgment',
        verificationStatus: 'Verified for Audit',
        updatedAt: '2026-01-15'
      },
      {
        id: 'ev_03',
        element: 'Skills Development',
        documentTitle: 'TETA Approved WSP & ATR 2025/2026 + Section 18.1 Learnership Agreements',
        verificationStatus: 'Verified for Audit',
        updatedAt: '2026-02-02'
      },
      {
        id: 'ev_04',
        element: 'Preferential Procurement & ESD',
        documentTitle: 'TMPS Supplier B-BBEE Certificates & Enterprise Development Loan Agreements',
        verificationStatus: 'Pending SANAS Review',
        updatedAt: '2026-02-19'
      },
      {
        id: 'ev_05',
        element: 'Socio-Economic Development',
        documentTitle: 'Section 18A Receipts — Township STEM & Driver Youth Academy Sponsorship',
        verificationStatus: 'Verified for Audit',
        updatedAt: '2026-01-28'
      }
    ]
  },
  {
    companyId: 'comp_highveld_eng',
    financialYear: '2025 / 2026 Verification Period',
    enterpriseCategory: 'Generic Enterprise (>R50m)',
    ownershipScore: 19.0,
    managementControlScore: 13.2,
    skillsDevelopmentScore: 16.5,
    enterpriseSupplierDevScore: 31.8,
    socioEconomicDevScore: 4.5,
    yesInitiativeBonus: 0,
    priorityElementsSubminimumMet: true,
    verifiedEvidenceItems: [
      {
        id: 'ev_he_01',
        element: 'Management Control & EE',
        documentTitle: 'EEA2 Workforce Profile & Senior Artisan Transformation Plan',
        verificationStatus: 'Verified for Audit',
        updatedAt: '2026-01-18'
      },
      {
        id: 'ev_he_02',
        element: 'Skills Development',
        documentTitle: 'MERSETA WSP/ATR Submission & Red Seal Trade Test Invoices',
        verificationStatus: 'Pending SANAS Review',
        updatedAt: '2026-02-11'
      }
    ]
  }
];



