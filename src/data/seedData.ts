import { Company, Employee, ComplianceEvent, DisciplinaryCase, LeaveRequest, TimeEntry, Invoice, EmployeeDocument } from '../types';

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
    createdAt: '2023-02-14'
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
    createdAt: '2022-08-01'
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
    createdAt: '2023-06-19'
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
    createdAt: '2023-11-05'
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
    createdAt: '2024-01-10'
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
      study: 2
    },
    fileCompletenessScore: 100,
    status: 'Active'
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
      maternity: 0,
      study: 4
    },
    fileCompletenessScore: 92,
    status: 'Active'
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
      study: 0
    },
    fileCompletenessScore: 85,
    status: 'Active'
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
      study: 5
    },
    fileCompletenessScore: 98,
    status: 'Active'
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
      maternity: 0,
      study: 3
    },
    fileCompletenessScore: 95,
    status: 'Active'
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
      maternity: 0,
      study: 2
    },
    fileCompletenessScore: 94,
    status: 'Active'
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
      study: 5
    },
    fileCompletenessScore: 100,
    status: 'Active'
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
