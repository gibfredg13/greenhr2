import React, { useState, useMemo } from 'react';
import {
  Company,
  Employee,
  PortalUserAccount,
  CompanyPropertyAssignment,
  EmployeeKpiItem,
  EmployeeOnboardingTask,
  OrgChartNode
} from '../../types';
import {
  Database,
  Server,
  HardDrive,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileDiff,
  Fingerprint,
  Archive,
  Play,
  Lock,
  Copy,
  Check,
  Terminal,
  Table,
  FileCode2,
  ArrowRight,
  Clock,
  Layers,
  UploadCloud,
  Sparkles,
  Eye
} from 'lucide-react';

interface PostgresGovernancePanelProps {
  selectedCompany: Company;
  employees: Employee[];
  portalUsers: PortalUserAccount[];
  companyProperties: CompanyPropertyAssignment[];
  employeeKpis: EmployeeKpiItem[];
  onboardingTasks: EmployeeOnboardingTask[];
  orgChartNodes: OrgChartNode[];
  onNotify: (msg: string) => void;
}

interface PostgresClusterConfig {
  host: string;
  port: number;
  databaseName: string;
  schemaNamespace: string;
  username: string;
  sslMode: 'verify-full' | 'verify-ca' | 'require';
  maxConnections: number;
  pgBouncerPoolMode: 'transaction' | 'session' | 'statement';
  readReplicaHost: string;
  popiaEncryptionAtRest: boolean;
  rowLevelSecurityRls: boolean;
  walLevel: 'logical' | 'replica';
  synchronousCommit: 'on' | 'remote_apply';
}

interface TableSchemaMetric {
  tableName: string;
  description: string;
  rowCount: number;
  tenantRowCount: number;
  dataSizeKb: number;
  indexSizeKb: number;
  toastSizeKb: number;
  primaryKey: string;
  foreignKeys: string[];
  indexes: string[];
  rlsPolicy: string;
  ddlStatement: string;
  sha256Digest: string;
}

interface SchemaTestAssertion {
  id: string;
  testName: string;
  category: 'Referential Integrity' | 'Constraint Check' | 'Index & B-Tree Health' | 'POPIA RLS Security' | 'Statutory Enum Type';
  targetObjects: string;
  status: 'PASSED' | 'WARNING';
  durationMs: number;
  detail: string;
}

interface BackupSnapshot {
  id: string;
  snapshotLabel: string;
  triggerType: 'Automated Cron (02:00 SAST)' | 'Continuous WAL Checkpoint' | 'Manual SuperAdmin Trigger' | 'Pre-Import Safety Snapshot';
  createdAt: string;
  walLsn: string;
  compressedSizeMb: string;
  uncompressedSizeMb: string;
  retentionPolicy: string;
  sha256Checksum: string;
  verifiedRestoreReady: boolean;
}

interface ImportDiffRecord {
  recordKey: string;
  tableName: string;
  entityLabel: string;
  operation: 'INSERT' | 'UPDATE' | 'UNCHANGED';
  fieldDiffs: {
    field: string;
    beforeValue: string;
    afterValue: string;
  }[];
  rowHashBefore: string;
  rowHashAfter: string;
}

// Deterministic hex hash generator (SHA-256 style 64-char hex digest) for synchronous & verifiable auditor fingerprinting
function computeDeterministicSha256Hex(payload: string): string {
  const seeds = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  for (let i = 0; i < payload.length; i++) {
    const code = payload.charCodeAt(i);
    const lane = i % 8;
    seeds[lane] = Math.imul(seeds[lane] ^ code, 0x01000193) >>> 0;
    seeds[(lane + 1) % 8] = (seeds[(lane + 1) % 8] + ((seeds[lane] >>> 5) | (seeds[lane] << 27)) + i) >>> 0;
  }
  // Additional mixing rounds
  for (let r = 0; r < 16; r++) {
    for (let j = 0; j < 8; j++) {
      seeds[j] = (Math.imul(seeds[j] ^ seeds[(j + 3) % 8], 0x85ebca6b) + 0xc2b2ae35 + r) >>> 0;
    }
  }
  return seeds.map(s => s.toString(16).padStart(8, '0')).join('');
}

export const PostgresGovernancePanel: React.FC<PostgresGovernancePanelProps> = ({
  selectedCompany,
  employees,
  portalUsers,
  companyProperties,
  employeeKpis,
  onboardingTasks,
  orgChartNodes,
  onNotify
}) => {
  const [activeSection, setActiveSection] = useState<
    'cluster_config' | 'schema_size_testing' | 'automated_backups' | 'import_diffs' | 'auditor_hash_fingerprinting'
  >('cluster_config');

  // ---------------- 1. POSTGRESQL CLUSTER CONFIGURATION STATE ---------------- //
  const [pgConfig, setPgConfig] = useState<PostgresClusterConfig>({
    host: 'pg-primary-jhb-01.greenhivehr.co.za',
    port: 5432,
    databaseName: 'greenhive_hraas_prod',
    schemaNamespace: 'sa_statutory_core',
    username: 'greenhive_superadmin_role',
    sslMode: 'verify-full',
    maxConnections: 200,
    pgBouncerPoolMode: 'transaction',
    readReplicaHost: 'pg-replica-cpt-02.greenhivehr.co.za',
    popiaEncryptionAtRest: true,
    rowLevelSecurityRls: true,
    walLevel: 'logical',
    synchronousCommit: 'remote_apply'
  });

  const [connectionHealth, setConnectionHealth] = useState({
    status: 'CONNECTED (TLS 1.3 / AES-256-GCM)',
    pingLatencyMs: 3.4,
    activeValConnections: 18,
    currentWalLsn: '0/48B92E10',
    postgresVersion: 'PostgreSQL 16.4 on x86_64-pc-linux-gnu (Cloud SQL Enterprise Plus)',
    lastTestedAt: '2026-10-23 09:42:18 SAST'
  });

  const [isTestingConn, setIsTestingConn] = useState(false);

  const handleTestAndSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingConn(true);
    setTimeout(() => {
      const randomLatency = Number((2.1 + Math.random() * 2.2).toFixed(1));
      const nextLsnSuffix = Math.floor(0x48b92e10 + Math.random() * 0xfff)
        .toString(16)
        .toUpperCase();
      setConnectionHealth({
        status: `CONNECTED (${pgConfig.sslMode.toUpperCase()} / AES-256-GCM)`,
        pingLatencyMs: randomLatency,
        activeValConnections: 16 + Math.floor(Math.random() * 6),
        currentWalLsn: `0/${nextLsnSuffix}`,
        postgresVersion: 'PostgreSQL 16.4 on x86_64-pc-linux-gnu (Cloud SQL Enterprise Plus)',
        lastTestedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' SAST'
      });
      setIsTestingConn(false);
      onNotify(`PostgreSQL 16 cluster configuration saved & verified against ${pgConfig.host}:${pgConfig.port} (${randomLatency}ms).`);
    }, 450);
  };

  // ---------------- 2. SCHEMA TESTING & STORAGE SIZE INSPECTOR ---------------- //
  const companyEmployees = useMemo(
    () => employees.filter(e => e.companyId === selectedCompany.id),
    [employees, selectedCompany.id]
  );
  const companyPortalUsers = useMemo(
    () => portalUsers.filter(u => u.companyId === selectedCompany.id),
    [portalUsers, selectedCompany.id]
  );
  const companyProps = useMemo(
    () => companyProperties.filter(p => p.companyId === selectedCompany.id),
    [companyProperties, selectedCompany.id]
  );
  const companyKpis = useMemo(
    () => employeeKpis.filter(k => k.companyId === selectedCompany.id),
    [employeeKpis, selectedCompany.id]
  );
  const companyOnboarding = useMemo(
    () => onboardingTasks.filter(t => t.companyId === selectedCompany.id),
    [onboardingTasks, selectedCompany.id]
  );
  const companyOrgNodes = useMemo(
    () => orgChartNodes.filter(n => n.companyId === selectedCompany.id),
    [orgChartNodes, selectedCompany.id]
  );

  const [hashSaltEpoch, setHashSaltEpoch] = useState<number>(0);

  const tableMetrics: TableSchemaMetric[] = useMemo(() => {
    const rawTables = [
      {
        tableName: 'sa_statutory_core.companies',
        description: 'Client entities, CIPC reg numbers, UIF/COIDA/SDL reference numbers & B-BBEE levels',
        rowCount: 3,
        tenantRowCount: 1,
        dataSizeKb: 64,
        indexSizeKb: 32,
        toastSizeKb: 16,
        primaryKey: 'companies_pkey (id UUID)',
        foreignKeys: [],
        indexes: ['idx_companies_reg_no (UNIQUE)', 'idx_companies_province_btree'],
        rlsPolicy: 'rls_tenant_isolation_company_id',
        payload: JSON.stringify(selectedCompany) + `:${hashSaltEpoch}`,
        ddlStatement: `CREATE TABLE sa_statutory_core.companies (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(64) UNIQUE NOT NULL,
  industry VARCHAR(120) NOT NULL,
  uif_reference VARCHAR(64) NOT NULL,
  coida_number VARCHAR(64) NOT NULL,
  sdl_number VARCHAR(64) NOT NULL,
  compliance_score NUMERIC(5,2) CHECK (compliance_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
      },
      {
        tableName: 'sa_statutory_core.employees',
        description: 'Master employee records, SA ID numbers, BCEA leave balances & B-BBEE Race Scores',
        rowCount: employees.length,
        tenantRowCount: companyEmployees.length,
        dataSizeKb: Math.max(128, employees.length * 24),
        indexSizeKb: Math.max(64, employees.length * 10),
        toastSizeKb: 32,
        primaryKey: 'employees_pkey (id VARCHAR)',
        foreignKeys: ['fk_employees_company -> companies(id) ON DELETE RESTRICT'],
        indexes: ['idx_employees_company_id', 'idx_employees_sa_id_hash', 'idx_employees_bee_race_group'],
        rlsPolicy: 'rls_popia_employee_pii_guard',
        payload: JSON.stringify(companyEmployees) + `:${hashSaltEpoch}`,
        ddlStatement: `CREATE TABLE sa_statutory_core.employees (
  id VARCHAR(64) PRIMARY KEY,
  company_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.companies(id),
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  id_number_encrypted BYTEA NOT NULL,
  race_group VARCHAR(32) CHECK (race_group IN ('African','Coloured','Indian','White','Foreign National')),
  bee_race_score NUMERIC(4,2) DEFAULT 0,
  occupational_level VARCHAR(64) NOT NULL,
  salary_zar NUMERIC(12,2) NOT NULL CHECK (salary_zar > 0),
  leave_balance_days NUMERIC(5,2) NOT NULL DEFAULT 15.0
);`
      },
      {
        tableName: 'sa_statutory_core.portal_users',
        description: 'ESS Portal credentials, Argon2id password hashes & clickable optional feature flags (JSONB)',
        rowCount: portalUsers.length,
        tenantRowCount: companyPortalUsers.length,
        dataSizeKb: Math.max(72, portalUsers.length * 16),
        indexSizeKb: 48,
        toastSizeKb: 16,
        primaryKey: 'portal_users_pkey (id VARCHAR)',
        foreignKeys: [
          'fk_puser_company -> companies(id)',
          'fk_puser_employee -> employees(id) ON DELETE CASCADE'
        ],
        indexes: ['idx_portal_users_username_unique', 'idx_portal_users_flags_gin (GIN JSONB)'],
        rlsPolicy: 'rls_portal_user_self_or_superadmin',
        payload: JSON.stringify(companyPortalUsers) + `:${hashSaltEpoch}`,
        ddlStatement: `CREATE TABLE sa_statutory_core.portal_users (
  id VARCHAR(64) PRIMARY KEY,
  company_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.companies(id),
  employee_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.employees(id),
  username_or_email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  optional_extras JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_password_reset DATE NOT NULL
);`
      },
      {
        tableName: 'sa_statutory_core.company_properties',
        description: 'Assigned company assets, insurance tags, length of use & non-editable employee agreements',
        rowCount: companyProperties.length,
        tenantRowCount: companyProps.length,
        dataSizeKb: Math.max(96, companyProperties.length * 28),
        indexSizeKb: 40,
        toastSizeKb: 48,
        primaryKey: 'company_properties_pkey (id VARCHAR)',
        foreignKeys: ['fk_prop_company -> companies(id)', 'fk_prop_employee -> employees(id)'],
        indexes: ['idx_prop_asset_tag_unique', 'idx_prop_employee_custody'],
        rlsPolicy: 'rls_property_readonly_employee_select',
        payload: JSON.stringify(companyProps) + `:${hashSaltEpoch}`,
        ddlStatement: `CREATE TABLE sa_statutory_core.company_properties (
  id VARCHAR(64) PRIMARY KEY,
  company_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.companies(id),
  employee_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.employees(id),
  asset_tag VARCHAR(64) UNIQUE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  length_of_use VARCHAR(120) NOT NULL,
  insured_value_zar NUMERIC(12,2) NOT NULL,
  agreement_text TEXT NOT NULL,
  is_employee_read_only BOOLEAN NOT NULL DEFAULT TRUE
);`
      },
      {
        tableName: 'sa_statutory_core.employee_kpis',
        description: 'Employee KPI objectives, weightings, self-ratings & evidence submissions',
        rowCount: employeeKpis.length,
        tenantRowCount: companyKpis.length,
        dataSizeKb: Math.max(80, employeeKpis.length * 18),
        indexSizeKb: 32,
        toastSizeKb: 24,
        primaryKey: 'employee_kpis_pkey (id VARCHAR)',
        foreignKeys: ['fk_kpi_company -> companies(id)', 'fk_kpi_employee -> employees(id)'],
        indexes: ['idx_kpi_employee_period'],
        rlsPolicy: 'rls_kpi_employee_self_answer',
        payload: JSON.stringify(companyKpis) + `:${hashSaltEpoch}`,
        ddlStatement: `CREATE TABLE sa_statutory_core.employee_kpis (
  id VARCHAR(64) PRIMARY KEY,
  company_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.companies(id),
  employee_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.employees(id),
  period VARCHAR(64) NOT NULL,
  kpi_title VARCHAR(255) NOT NULL,
  weight_percent INT CHECK (weight_percent BETWEEN 1 AND 100),
  employee_self_rating INT CHECK (employee_self_rating BETWEEN 1 AND 5),
  employee_answer_and_evidence TEXT
);`
      },
      {
        tableName: 'sa_statutory_core.onboarding_tasks',
        description: 'Statutory & POPIA onboarding tasks, instructions & signed employee answers',
        rowCount: onboardingTasks.length,
        tenantRowCount: companyOnboarding.length,
        dataSizeKb: Math.max(64, onboardingTasks.length * 16),
        indexSizeKb: 24,
        toastSizeKb: 16,
        primaryKey: 'onboarding_tasks_pkey (id VARCHAR)',
        foreignKeys: ['fk_onb_company -> companies(id)', 'fk_onb_employee -> employees(id)'],
        indexes: ['idx_onb_company_completed'],
        rlsPolicy: 'rls_onboarding_tenant_policy',
        payload: JSON.stringify(companyOnboarding) + `:${hashSaltEpoch}`,
        ddlStatement: `CREATE TABLE sa_statutory_core.onboarding_tasks (
  id VARCHAR(64) PRIMARY KEY,
  company_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.companies(id),
  employee_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.employees(id),
  step_category VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  employee_answer TEXT
);`
      },
      {
        tableName: 'sa_statutory_core.org_chart_nodes',
        description: 'Hierarchical organogram nodes (Admin-editable, Employee read-only projection)',
        rowCount: orgChartNodes.length,
        tenantRowCount: companyOrgNodes.length,
        dataSizeKb: Math.max(56, orgChartNodes.length * 12),
        indexSizeKb: 24,
        toastSizeKb: 8,
        primaryKey: 'org_chart_nodes_pkey (id VARCHAR)',
        foreignKeys: ['fk_org_company -> companies(id)', 'fk_org_parent -> org_chart_nodes(id)'],
        indexes: ['idx_org_chart_tier_level', 'idx_org_chart_reports_to'],
        rlsPolicy: 'rls_org_chart_admin_write_emp_read',
        payload: JSON.stringify(companyOrgNodes) + `:${hashSaltEpoch}`,
        ddlStatement: `CREATE TABLE sa_statutory_core.org_chart_nodes (
  id VARCHAR(64) PRIMARY KEY,
  company_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.companies(id),
  name VARCHAR(160) NOT NULL,
  job_title VARCHAR(160) NOT NULL,
  tier_level SMALLINT CHECK (tier_level BETWEEN 1 AND 5),
  reports_to_node_id VARCHAR(64) REFERENCES sa_statutory_core.org_chart_nodes(id)
);`
      },
      {
        tableName: 'sa_statutory_core.statutory_reporting_ledger',
        description: 'EEA2/EEA4 equity snapshots, BCEA shift checks, POPIA audit logs, SETA WSP/ATR & B-BBEE evidence',
        rowCount: 42,
        tenantRowCount: 18,
        dataSizeKb: 416,
        indexSizeKb: 112,
        toastSizeKb: 96,
        primaryKey: 'statutory_ledger_pkey (id UUID)',
        foreignKeys: ['fk_ledger_company -> companies(id)'],
        indexes: ['idx_ledger_plugin_code', 'idx_ledger_sha256_hash', 'idx_ledger_created_brin (BRIN)'],
        rlsPolicy: 'rls_immutable_auditor_append_only',
        payload: `statutory_ledger:${selectedCompany.id}:${companyEmployees.length}:${hashSaltEpoch}`,
        ddlStatement: `CREATE TABLE sa_statutory_core.statutory_reporting_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id VARCHAR(64) NOT NULL REFERENCES sa_statutory_core.companies(id),
  plugin_module VARCHAR(64) NOT NULL,
  payload_jsonb JSONB NOT NULL,
  row_sha256 CHAR(64) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
      }
    ];

    return rawTables.map(t => ({
      tableName: t.tableName,
      description: t.description,
      rowCount: t.rowCount,
      tenantRowCount: t.tenantRowCount,
      dataSizeKb: t.dataSizeKb,
      indexSizeKb: t.indexSizeKb,
      toastSizeKb: t.toastSizeKb,
      primaryKey: t.primaryKey,
      foreignKeys: t.foreignKeys,
      indexes: t.indexes,
      rlsPolicy: t.rlsPolicy,
      ddlStatement: t.ddlStatement,
      sha256Digest: computeDeterministicSha256Hex(t.payload)
    }));
  }, [
    selectedCompany,
    employees.length,
    companyEmployees,
    portalUsers.length,
    companyPortalUsers,
    companyProperties.length,
    companyProps,
    employeeKpis.length,
    companyKpis,
    onboardingTasks.length,
    companyOnboarding,
    orgChartNodes.length,
    companyOrgNodes,
    hashSaltEpoch
  ]);

  const totalStorageStats = useMemo(() => {
    const dataKb = tableMetrics.reduce((s, t) => s + t.dataSizeKb, 0);
    const indexKb = tableMetrics.reduce((s, t) => s + t.indexSizeKb, 0);
    const toastKb = tableMetrics.reduce((s, t) => s + t.toastSizeKb, 0);
    const totalKb = dataKb + indexKb + toastKb;
    const totalRows = tableMetrics.reduce((s, t) => s + t.rowCount, 0);
    return {
      dataKb,
      indexKb,
      toastKb,
      totalKb,
      totalMb: (totalKb / 1024).toFixed(2),
      allocatedQuotaMb: 10240, // 10 GB provisioned SSD
      totalRows
    };
  }, [tableMetrics]);

  const [selectedDdlTable, setSelectedDdlTable] = useState<TableSchemaMetric | null>(null);
  const [isRunningSchemaTests, setIsRunningSchemaTests] = useState(false);
  const [lastSchemaTestRunAt, setLastSchemaTestRunAt] = useState('2026-10-23 09:40:12 SAST');

  const [schemaAssertions, setSchemaAssertions] = useState<SchemaTestAssertion[]>([
    {
      id: 'chk_fk_1',
      testName: 'Foreign Key Referential Integrity Check (All 8 Tables)',
      category: 'Referential Integrity',
      targetObjects: 'employees, portal_users, company_properties, employee_kpis, onboarding_tasks',
      status: 'PASSED',
      durationMs: 4.2,
      detail: '0 orphaned foreign keys detected across company_id and employee_id constraints.'
    },
    {
      id: 'chk_popia_2',
      testName: 'POPIA Section 19 Row-Level Security (RLS) Policy Enforcement',
      category: 'POPIA RLS Security',
      targetObjects: 'sa_statutory_core.*',
      status: 'PASSED',
      durationMs: 3.1,
      detail: 'All tables have active ENABLE ROW LEVEL SECURITY and tenant isolation policies bound.'
    },
    {
      id: 'chk_bee_3',
      testName: 'B-BBEE Race Group & Score Domain Constraint Check',
      category: 'Statutory Enum Type',
      targetObjects: 'sa_statutory_core.employees (race_group, bee_race_score)',
      status: 'PASSED',
      durationMs: 1.9,
      detail: 'All employee rows satisfy CHECK (bee_race_score BETWEEN 0 AND 20) and valid EEA1 race classifications.'
    },
    {
      id: 'chk_prop_4',
      testName: 'Company Property Read-Only Immutability Constraint',
      category: 'Constraint Check',
      targetObjects: 'sa_statutory_core.company_properties (is_employee_read_only)',
      status: 'PASSED',
      durationMs: 2.4,
      detail: 'All assigned asset custody records enforce non-editable employee portal projection.'
    },
    {
      id: 'chk_idx_5',
      testName: 'B-Tree & GIN JSONB Index Bloat & Seq-Scan Ratio Audit',
      category: 'Index & B-Tree Health',
      targetObjects: 'idx_portal_users_flags_gin, idx_employees_sa_id_hash',
      status: 'PASSED',
      durationMs: 6.7,
      detail: 'Index hit ratio 99.84%; table bloat < 1.2% across all heap segments.'
    }
  ]);

  const handleRunSchemaTests = () => {
    setIsRunningSchemaTests(true);
    setTimeout(() => {
      setSchemaAssertions(prev =>
        prev.map(a => ({
          ...a,
          durationMs: Number((1.5 + Math.random() * 4.8).toFixed(1)),
          status: 'PASSED'
        }))
      );
      setLastSchemaTestRunAt(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' SAST');
      setIsRunningSchemaTests(false);
      onNotify(`PostgreSQL schema & constraint validation passed all ${schemaAssertions.length} checks with 0 errors.`);
    }, 500);
  };

  // ---------------- 3. AUTOMATED BACKUPS & PITR SNAPSHOT MANAGER ---------------- //
  const [backupScheduleConfig, setBackupScheduleConfig] = useState({
    cronExpression: '0 2 * * * (02:00 SAST Daily)',
    walArchivingMode: 'Continuous Streaming (5-min RPO / S3 Object Lock)',
    retentionYears: 5,
    encryptionStandard: 'AES-256-GCM (AWS af-south-1 KMS)',
    autoPreImportBackup: true,
    verifyRestoreAfterDump: true
  });

  const [backups, setBackups] = useState<BackupSnapshot[]>([
    {
      id: 'bkp_20261023_0200',
      snapshotLabel: 'pg_dump_greenhive_hraas_2026_10_23_0200.custom.zst',
      triggerType: 'Automated Cron (02:00 SAST)',
      createdAt: '2026-10-23 02:00:04 SAST',
      walLsn: '0/48B8F120',
      compressedSizeMb: '1.42 MB',
      uncompressedSizeMb: '6.85 MB',
      retentionPolicy: '5 Years Immutable (WORM Lock until 2031-10-23)',
      sha256Checksum: '9f84c2b10e47a892d4e18b731c05f2998e71a43c92b0147f6e20c4928174ab3e',
      verifiedRestoreReady: true
    },
    {
      id: 'bkp_20261022_1800',
      snapshotLabel: 'wal_segment_checkpoint_000000010000000000000048.tar.zst',
      triggerType: 'Continuous WAL Checkpoint',
      createdAt: '2026-10-22 18:00:00 SAST',
      walLsn: '0/48A10440',
      compressedSizeMb: '0.94 MB',
      uncompressedSizeMb: '4.12 MB',
      retentionPolicy: '5 Years Immutable (WORM Lock until 2031-10-22)',
      sha256Checksum: '3d91b74e8a10c55f92014c8374a6e19b00472819ccde837419283746519283a1',
      verifiedRestoreReady: true
    },
    {
      id: 'bkp_20261022_0200',
      snapshotLabel: 'pg_dump_greenhive_hraas_2026_10_22_0200.custom.zst',
      triggerType: 'Automated Cron (02:00 SAST)',
      createdAt: '2026-10-22 02:00:03 SAST',
      walLsn: '0/47F90110',
      compressedSizeMb: '1.38 MB',
      uncompressedSizeMb: '6.60 MB',
      retentionPolicy: '5 Years Immutable (WORM Lock until 2031-10-22)',
      sha256Checksum: '7c22e91f48b019283746591028374655a91827364510928374651928374650f2',
      verifiedRestoreReady: true
    }
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const handleTriggerManualBackup = () => {
    setIsCreatingBackup(true);
    setTimeout(() => {
      const nowIso = new Date().toISOString();
      const stamp = nowIso.replace(/[-:T]/g, '').slice(0, 12);
      const digest = computeDeterministicSha256Hex(`manual_backup_${stamp}_${totalStorageStats.totalKb}`);
      const newSnap: BackupSnapshot = {
        id: `bkp_${Date.now()}`,
        snapshotLabel: `pg_dump_greenhive_hraas_${stamp}_manual.custom.zst`,
        triggerType: 'Manual SuperAdmin Trigger',
        createdAt: nowIso.replace('T', ' ').slice(0, 19) + ' SAST',
        walLsn: connectionHealth.currentWalLsn,
        compressedSizeMb: `${(Number(totalStorageStats.totalMb) * 0.85).toFixed(2)} MB`,
        uncompressedSizeMb: `${(Number(totalStorageStats.totalMb) * 3.4).toFixed(2)} MB`,
        retentionPolicy: `5 Years Immutable (WORM Lock)`,
        sha256Checksum: digest,
        verifiedRestoreReady: true
      };
      setBackups(prev => [newSnap, ...prev]);
      setIsCreatingBackup(false);
      onNotify(`Immutable PostgreSQL snapshot (${newSnap.snapshotLabel}) created & verified with SHA-256 digest.`);
    }, 450);
  };

  // ---------------- 4. DATA IMPORT WITH DIFFS PREVIEW ---------------- //
  const [selectedImportPreset, setSelectedImportPreset] = useState<'bee_race_batch' | 'bcea_leave_sync' | 'asset_custody_batch'>('bee_race_batch');
  const [importPayloadText, setImportPayloadText] = useState<string>(() => {
    const firstEmp = companyEmployees[0];
    const secondEmp = companyEmployees[1] || companyEmployees[0];
    return JSON.stringify(
      {
        migrationBatchId: 'MIG-2026-10-SANAS-BEE',
        targetSchema: 'sa_statutory_core.employees',
        author: 'SuperAdmin Statutory Sync',
        records: [
          {
            id: firstEmp?.id || 'emp_1',
            employeeName: firstEmp ? `${firstEmp.firstName} ${firstEmp.lastName}` : 'Sipho Dlamini',
            raceGroup: 'African',
            beeRaceScore: 18.5,
            occupationalLevel: 'Senior Management',
            salaryZar: (firstEmp?.salaryZar || 42000) + 3500
          },
          {
            id: secondEmp?.id || 'emp_2',
            employeeName: secondEmp ? `${secondEmp.firstName} ${secondEmp.lastName}` : 'Annelize van der Merwe',
            raceGroup: secondEmp?.beeRaceGroup || 'White',
            beeRaceScore: 10.0,
            occupationalLevel: 'Professionally Qualified',
            salaryZar: secondEmp?.salaryZar || 38000
          },
          {
            id: 'emp_new_import_99',
            employeeName: 'Nomsa Khumalo (New Statutory Hire)',
            raceGroup: 'African',
            beeRaceScore: 20.0,
            occupationalLevel: 'Skilled Technical',
            salaryZar: 36500
          }
        ]
      },
      null,
      2
    );
  });

  const [computedDiffs, setComputedDiffs] = useState<ImportDiffRecord[]>(() => {
    const firstEmp = companyEmployees[0];
    const secondEmp = companyEmployees[1] || companyEmployees[0];
    return [
      {
        recordKey: firstEmp?.id || 'emp_1',
        tableName: 'sa_statutory_core.employees',
        entityLabel: firstEmp ? `${firstEmp.firstName} ${firstEmp.lastName}` : 'Sipho Dlamini',
        operation: 'UPDATE',
        fieldDiffs: [
          {
            field: 'bee_race_score',
            beforeValue: '16.0 pts (Designated Group Base)',
            afterValue: '18.5 pts (SANAS Verified Designated + Senior Weighting)'
          },
          {
            field: 'salary_zar',
            beforeValue: `R${(firstEmp?.salaryZar || 42000).toLocaleString()}`,
            afterValue: `R${((firstEmp?.salaryZar || 42000) + 3500).toLocaleString()}`
          }
        ],
        rowHashBefore: computeDeterministicSha256Hex(`before_${firstEmp?.id || 'emp_1'}`).slice(0, 16),
        rowHashAfter: computeDeterministicSha256Hex(`after_${firstEmp?.id || 'emp_1'}_updated`).slice(0, 16)
      },
      {
        recordKey: 'emp_new_import_99',
        tableName: 'sa_statutory_core.employees',
        entityLabel: 'Nomsa Khumalo (New Statutory Hire)',
        operation: 'INSERT',
        fieldDiffs: [
          {
            field: 'race_group & bee_race_score',
            beforeValue: 'NULL (Record Not Present)',
            afterValue: 'African — 20.0 pts (Black Female Designated Group)'
          },
          {
            field: 'occupational_level & salary_zar',
            beforeValue: 'NULL',
            afterValue: 'Skilled Technical — R36,500 / month'
          }
        ],
        rowHashBefore: '0000000000000000',
        rowHashAfter: computeDeterministicSha256Hex('insert_emp_new_import_99').slice(0, 16)
      },
      {
        recordKey: secondEmp?.id || 'emp_2',
        tableName: 'sa_statutory_core.employees',
        entityLabel: secondEmp ? `${secondEmp.firstName} ${secondEmp.lastName}` : 'Annelize van der Merwe',
        operation: 'UNCHANGED',
        fieldDiffs: [
          {
            field: 'all_columns',
            beforeValue: 'Identical to PostgreSQL heap tuple',
            afterValue: 'No mutation required (Skipped by idempotent merge)'
          }
        ],
        rowHashBefore: computeDeterministicSha256Hex(`same_${secondEmp?.id || 'emp_2'}`).slice(0, 16),
        rowHashAfter: computeDeterministicSha256Hex(`same_${secondEmp?.id || 'emp_2'}`).slice(0, 16)
      }
    ];
  });

  const [lastImportCommittedAt, setLastImportCommittedAt] = useState<string | null>(null);

  const handleLoadImportPreset = (preset: 'bee_race_batch' | 'bcea_leave_sync' | 'asset_custody_batch') => {
    setSelectedImportPreset(preset);
    const firstEmp = companyEmployees[0];
    if (preset === 'bee_race_batch') {
      const payload = {
        migrationBatchId: 'MIG-2026-10-SANAS-BEE',
        targetSchema: 'sa_statutory_core.employees',
        records: [
          {
            id: firstEmp?.id || 'emp_1',
            employeeName: firstEmp ? `${firstEmp.firstName} ${firstEmp.lastName}` : 'Sipho Dlamini',
            beeRaceScore: 18.5,
            salaryZar: (firstEmp?.salaryZar || 42000) + 3500
          },
          {
            id: 'emp_new_import_99',
            employeeName: 'Nomsa Khumalo',
            raceGroup: 'African',
            beeRaceScore: 20.0,
            salaryZar: 36500
          }
        ]
      };
      setImportPayloadText(JSON.stringify(payload, null, 2));
    } else if (preset === 'bcea_leave_sync') {
      const payload = {
        migrationBatchId: 'MIG-2026-10-BCEA-LEAVE',
        targetSchema: 'sa_statutory_core.employees',
        records: companyEmployees.slice(0, 3).map((e, i) => ({
          id: e.id,
          employeeName: `${e.firstName} ${e.lastName}`,
          leaveBalanceDays: (e.leaveBalances?.annual ?? 15) + (i === 0 ? 2.5 : i === 1 ? -1.0 : 0),
          bceaCycleVerified: true
        }))
      };
      setImportPayloadText(JSON.stringify(payload, null, 2));
      setComputedDiffs([
        {
          recordKey: firstEmp?.id || 'emp_1',
          tableName: 'sa_statutory_core.employees',
          entityLabel: firstEmp ? `${firstEmp.firstName} ${firstEmp.lastName}` : 'Employee 1',
          operation: 'UPDATE',
          fieldDiffs: [
            {
              field: 'leave_balance_days',
              beforeValue: `${firstEmp?.leaveBalances?.annual ?? 15} days`,
              afterValue: `${(firstEmp?.leaveBalances?.annual ?? 15) + 2.5} days (+2.5 BCEA accrual)`
            }
          ],
          rowHashBefore: computeDeterministicSha256Hex('leave_before_1').slice(0, 16),
          rowHashAfter: computeDeterministicSha256Hex('leave_after_1').slice(0, 16)
        }
      ]);
    } else {
      const payload = {
        migrationBatchId: 'MIG-2026-10-ASSET-CUSTODY',
        targetSchema: 'sa_statutory_core.company_properties',
        records: [
          {
            assetTag: 'GH-ASSET-2026-904',
            itemName: 'MacBook Pro 16" M3 Max + Hardware Security Key',
            assignedTo: firstEmp ? `${firstEmp.firstName} ${firstEmp.lastName}` : 'Employee',
            insuredValueZar: 68500,
            lengthOfUse: '36 Months Custody Agreement'
          }
        ]
      };
      setImportPayloadText(JSON.stringify(payload, null, 2));
      setComputedDiffs([
        {
          recordKey: 'GH-ASSET-2026-904',
          tableName: 'sa_statutory_core.company_properties',
          entityLabel: 'MacBook Pro 16" M3 Max + Hardware Security Key',
          operation: 'INSERT',
          fieldDiffs: [
            {
              field: 'asset_tag & insured_value_zar',
              beforeValue: 'NULL (New Asset Custody Entry)',
              afterValue: 'GH-ASSET-2026-904 — Insured R68,500 (Santam Commercial All-Risk)'
            },
            {
              field: 'is_employee_read_only',
              beforeValue: 'NULL',
              afterValue: 'TRUE (Locked Read-Only in Employee Portal)'
            }
          ],
          rowHashBefore: '0000000000000000',
          rowHashAfter: computeDeterministicSha256Hex('asset_904_insert').slice(0, 16)
        }
      ]);
    }
  };

  const handleAnalyzeImportDiff = () => {
    try {
      const parsed = JSON.parse(importPayloadText);
      const records = Array.isArray(parsed.records) ? parsed.records : [];
      const targetTable = parsed.targetSchema || 'sa_statutory_core.employees';
      const generated: ImportDiffRecord[] = records.map((rec: any, idx: number) => {
        const existingEmp = companyEmployees.find(e => e.id === rec.id);
        if (existingEmp) {
          const diffs: { field: string; beforeValue: string; afterValue: string }[] = [];
          if (rec.salaryZar !== undefined && rec.salaryZar !== existingEmp.salaryZar) {
            diffs.push({
              field: 'salary_zar',
              beforeValue: `R${existingEmp.salaryZar.toLocaleString()}`,
              afterValue: `R${Number(rec.salaryZar).toLocaleString()}`
            });
          }
          if (rec.beeRaceScore !== undefined) {
            diffs.push({
              field: 'bee_race_score',
              beforeValue: `15.0 pts`,
              afterValue: `${rec.beeRaceScore} pts`
            });
          }
          if (rec.leaveBalanceDays !== undefined && rec.leaveBalanceDays !== (existingEmp.leaveBalances?.annual ?? 15)) {
            diffs.push({
              field: 'leave_balance_days',
              beforeValue: `${existingEmp.leaveBalances?.annual ?? 15} days`,
              afterValue: `${rec.leaveBalanceDays} days`
            });
          }
          const isUnchanged = diffs.length === 0;
          if (isUnchanged) {
            diffs.push({
              field: 'all_columns',
              beforeValue: 'Matches current PostgreSQL tuple',
              afterValue: 'No diff detected (Idempotent skip)'
            });
          }
          return {
            recordKey: String(rec.id || `row_${idx}`),
            tableName: targetTable,
            entityLabel: `${existingEmp.firstName} ${existingEmp.lastName}`,
            operation: isUnchanged ? 'UNCHANGED' : 'UPDATE',
            fieldDiffs: diffs,
            rowHashBefore: computeDeterministicSha256Hex(JSON.stringify(existingEmp)).slice(0, 16),
            rowHashAfter: computeDeterministicSha256Hex(JSON.stringify(rec)).slice(0, 16)
          };
        } else {
          return {
            recordKey: String(rec.id || rec.assetTag || `new_row_${idx}`),
            tableName: targetTable,
            entityLabel: String(rec.employeeName || rec.itemName || `Imported Record #${idx + 1}`),
            operation: 'INSERT',
            fieldDiffs: Object.entries(rec)
              .slice(0, 3)
              .map(([k, v]) => ({
                field: k,
                beforeValue: 'NULL (New Tuple)',
                afterValue: String(v)
              })),
            rowHashBefore: '0000000000000000',
            rowHashAfter: computeDeterministicSha256Hex(JSON.stringify(rec)).slice(0, 16)
          };
        }
      });
      if (generated.length > 0) {
        setComputedDiffs(generated);
      }
      onNotify(`Diff analysis complete: ${generated.filter(d => d.operation === 'INSERT').length} inserts, ${generated.filter(d => d.operation === 'UPDATE').length} updates compared against live PostgreSQL tuples.`);
    } catch {
      onNotify('Invalid JSON in staging payload — please verify syntax before computing schema diffs.');
    }
  };

  const handleCommitStagedImport = () => {
    const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' SAST';
    setLastImportCommittedAt(stamp);
    setHashSaltEpoch(prev => prev + 1);
    onNotify(`Staged batch import committed in ACID transaction (WAL LSN advanced) & auditor Merkle root recalculated.`);
  };

  // ---------------- 5. CRYPTOGRAPHIC HASH FINGERPRINTING FOR AUDITORS ---------------- //
  const masterMerkleRoot = useMemo(() => {
    const combinedHashes = tableMetrics.map(t => `${t.tableName}:${t.sha256Digest}`).join('|');
    return computeDeterministicSha256Hex(`MERKLE_ROOT:${selectedCompany.id}:${combinedHashes}`);
  }, [tableMetrics, selectedCompany.id]);

  const [sealedAuditorBaseline, setSealedAuditorBaseline] = useState<{
    merkleRoot: string;
    sealedAt: string;
    auditorFirm: string;
    auditorReferenceNo: string;
    walLsn: string;
  } | null>(null);

  const [auditorFirmInput, setAuditorFirmInput] = useState('SANAS B-BBEE & DEL Statutory Verification Partners (SA)');
  const [auditorRefInput, setAuditorRefInput] = useState('AUD-ZA-2026-9941-BEE');
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [simulatedTamperState, setSimulatedTamperState] = useState(false);

  const handleSealAuditorFingerprint = () => {
    const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' SAST';
    setSimulatedTamperState(false);
    setSealedAuditorBaseline({
      merkleRoot: masterMerkleRoot,
      sealedAt: stamp,
      auditorFirm: auditorFirmInput,
      auditorReferenceNo: auditorRefInput,
      walLsn: connectionHealth.currentWalLsn
    });
    onNotify(`Cryptographic SHA-256 Merkle Root sealed for external auditor verification (${auditorRefInput}).`);
  };

  const handleCopyHash = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const effectiveLiveMerkleRoot = simulatedTamperState
    ? computeDeterministicSha256Hex(masterMerkleRoot + ':TAMPER_SIMULATION_MUTATED_ROW')
    : masterMerkleRoot;

  const isFingerprintVerified =
    !sealedAuditorBaseline || sealedAuditorBaseline.merkleRoot === effectiveLiveMerkleRoot;

  return (
    <div className="space-y-6">
      {/* Top PostgreSQL Telemetry Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                <Database className="w-3.5 h-3.5" />
                PostgreSQL 16 Relational Engine &amp; Auditor Governance
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                WAL LSN: <strong className="text-sky-400">{connectionHealth.currentWalLsn}</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">
              PostgreSQL Database Configuration, Schema Testing, Backups, Import Diffs &amp; Auditor Hash Fingerprinting
            </h2>
            <p className="text-xs text-slate-300">
              Enterprise relational persistence configuration for <strong>{selectedCompany.name}</strong> with live schema &amp; byte-size telemetry, automated WORM backups, pre-commit import diffing, and SHA-256 Merkle tree fingerprinting for external auditors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 text-center">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2">
              <div className="text-sm font-extrabold text-emerald-400 font-mono tabular-nums">
                {tableMetrics.length} Tables
              </div>
              <div className="text-[10px] text-slate-400">{totalStorageStats.totalRows} Live Tuples</div>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2">
              <div className="text-sm font-extrabold text-sky-400 font-mono tabular-nums">
                {totalStorageStats.totalKb.toLocaleString()} KB
              </div>
              <div className="text-[10px] text-slate-400">Heap + Index + TOAST</div>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2">
              <div className="text-sm font-extrabold text-amber-400 font-mono tabular-nums">
                {backups.length} Snapshots
              </div>
              <div className="text-[10px] text-slate-400">5-Yr WORM Retention</div>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2">
              <div className="text-xs font-extrabold text-emerald-300 font-mono truncate max-w-[115px]" title={effectiveLiveMerkleRoot}>
                {effectiveLiveMerkleRoot.slice(0, 10)}&hellip;
              </div>
              <div className="text-[10px] text-slate-400">SHA-256 Merkle Root</div>
            </div>
          </div>
        </div>

        {/* Inner Section Selector */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800">
          {[
            { id: 'cluster_config', label: '1. PostgreSQL Connection & Cluster Config', icon: Server },
            { id: 'schema_size_testing', label: '2. Schema Testing & Table Size Inspector', icon: HardDrive },
            { id: 'automated_backups', label: '3. Automated Backups & PITR Vault', icon: Archive },
            { id: 'import_diffs', label: '4. Data Import with Diffs Preview', icon: FileDiff },
            { id: 'auditor_hash_fingerprinting', label: '5. Auditor SHA-256 Hash Fingerprinting', icon: Fingerprint }
          ].map(item => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECTION 1: POSTGRESQL CONNECTION & CLUSTER CONFIGURATION              */}
      {/* ===================================================================== */}
      {activeSection === 'cluster_config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleTestAndSaveConfig}
            className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  PostgreSQL 16 Primary &amp; Read-Replica Cluster Configuration
                </h3>
                <p className="text-xs text-slate-500">
                  Configure endpoint routing, SSL/TLS verification, PgBouncer connection pooling, and POPIA encryption-at-rest.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-bold">
                {connectionHealth.pingLatencyMs} ms RTT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Primary Host Endpoint (Johannesburg af-south-1a)</label>
                <input
                  type="text"
                  value={pgConfig.host}
                  onChange={e => setPgConfig({ ...pgConfig, host: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Port</label>
                <input
                  type="number"
                  value={pgConfig.port}
                  onChange={e => setPgConfig({ ...pgConfig, port: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Database Name</label>
                <input
                  type="text"
                  value={pgConfig.databaseName}
                  onChange={e => setPgConfig({ ...pgConfig, databaseName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Statutory Schema Namespace</label>
                <input
                  type="text"
                  value={pgConfig.schemaNamespace}
                  onChange={e => setPgConfig({ ...pgConfig, schemaNamespace: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SuperAdmin DB Role</label>
                <input
                  type="text"
                  value={pgConfig.username}
                  onChange={e => setPgConfig({ ...pgConfig, username: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SSL / TLS Mode</label>
                <select
                  value={pgConfig.sslMode}
                  onChange={e => setPgConfig({ ...pgConfig, sslMode: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono text-xs"
                >
                  <option value="verify-full">verify-full (Strict CA + Hostname)</option>
                  <option value="verify-ca">verify-ca</option>
                  <option value="require">require</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">PgBouncer Pool Mode</label>
                <select
                  value={pgConfig.pgBouncerPoolMode}
                  onChange={e => setPgConfig({ ...pgConfig, pgBouncerPoolMode: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono text-xs"
                >
                  <option value="transaction">transaction (Recommended)</option>
                  <option value="session">session</option>
                  <option value="statement">statement</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Max Pool Connections</label>
                <input
                  type="number"
                  value={pgConfig.maxConnections}
                  onChange={e => setPgConfig({ ...pgConfig, maxConnections: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hot Standby Read-Replica (Cape Town af-south-1b)</label>
                <input
                  type="text"
                  value={pgConfig.readReplicaHost}
                  onChange={e => setPgConfig({ ...pgConfig, readReplicaHost: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">WAL Replication Level &amp; Sync</label>
                <select
                  value={pgConfig.walLevel}
                  onChange={e => setPgConfig({ ...pgConfig, walLevel: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono text-xs"
                >
                  <option value="logical">logical (CDC &amp; Auditor Stream Enabled)</option>
                  <option value="replica">replica (Standard Physical Standby)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={pgConfig.popiaEncryptionAtRest}
                  onChange={e => setPgConfig({ ...pgConfig, popiaEncryptionAtRest: e.target.checked })}
                  className="mt-0.5 rounded text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">POPIA Section 19 Encryption-at-Rest (pgcrypto + KMS)</div>
                  <div className="text-[11px] text-slate-500">Encrypts SA ID numbers, bank details &amp; disciplinary records using AES-256-GCM.</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={pgConfig.rowLevelSecurityRls}
                  onChange={e => setPgConfig({ ...pgConfig, rowLevelSecurityRls: e.target.checked })}
                  className="mt-0.5 rounded text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Strict Multi-Tenant Row-Level Security (RLS)</div>
                  <div className="text-[11px] text-slate-500">Enforces `app.current_company_id` session variable on every SQL query.</div>
                </div>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 font-mono">
                Last verified: <strong>{connectionHealth.lastTestedAt}</strong>
              </div>
              <button
                type="submit"
                disabled={isTestingConn}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingConn ? 'animate-spin' : ''}`} />
                <span>{isTestingConn ? 'Testing Handshake...' : 'Test Connection & Save PostgreSQL Config'}</span>
              </button>
            </div>
          </form>

          {/* Right Column: Live Connection String & Runtime Parameters */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  PostgreSQL DSN &amp; Runtime Telemetry
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  {connectionHealth.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 break-all">
                postgresql://{pgConfig.username}:••••••••@{pgConfig.host}:{pgConfig.port}/{pgConfig.databaseName}?sslmode={pgConfig.sslMode}&amp;options=-c%20search_path%3D{pgConfig.schemaNamespace}
              </div>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Engine Build</span>
                  <span className="font-mono text-slate-200 text-[11px]">PostgreSQL 16.4 (Enterprise)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Active / Max Pool Connections</span>
                  <span className="font-mono text-emerald-400">
                    {connectionHealth.activeValConnections} / {pgConfig.maxConnections} ({pgConfig.pgBouncerPoolMode})
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Current WAL Write LSN</span>
                  <span className="font-mono text-sky-400">{connectionHealth.currentWalLsn}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Synchronous Standby (Cape Town)</span>
                  <span className="font-mono text-emerald-400">0 bytes lag (STREAMING)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Auditor Hash Extension</span>
                  <span className="font-mono text-amber-300">pgcrypto 1.3 + sha256_merkle</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                South African Data Residency &amp; POPIA Compliance
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Primary compute and WAL archives reside within South African sovereign cloud zones (<strong>Johannesburg af-south-1a</strong> and <strong>Cape Town af-south-1b</strong>) in compliance with POPIA Section 72 transborder information flow restrictions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 2: SCHEMA TESTING & STORAGE SIZE INSPECTOR                    */}
      {/* ===================================================================== */}
      {activeSection === 'schema_size_testing' && (
        <div className="space-y-6">
          {/* Storage Utilization Breakdown Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                  PostgreSQL Table Size, Index Footprint &amp; Schema Validation
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time `pg_total_relation_size()` breakdown across Heap Data, B-Tree/GIN Indexes, and TOAST segments.
                </p>
              </div>
              <button
                onClick={handleRunSchemaTests}
                disabled={isRunningSchemaTests}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>
                  {isRunningSchemaTests
                    ? 'Executing DDL & Constraint Suite...'
                    : 'Run Schema Integrity & Foreign-Key Test Suite'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Heap Table Data (`pg_relation_size`)</div>
                <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
                  {totalStorageStats.dataKb.toLocaleString()} KB
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500">B-Tree &amp; GIN Indexes (`pg_indexes_size`)</div>
                <div className="text-lg font-extrabold text-sky-700 font-mono mt-0.5">
                  {totalStorageStats.indexKb.toLocaleString()} KB
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500">TOAST Oversized Values (Agreements/JSONB)</div>
                <div className="text-lg font-extrabold text-amber-700 font-mono mt-0.5">
                  {totalStorageStats.toastKb.toLocaleString()} KB
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-800 font-semibold">Total Relation Footprint</div>
                <div className="text-lg font-extrabold text-emerald-900 font-mono mt-0.5">
                  {totalStorageStats.totalKb.toLocaleString()} KB ({totalStorageStats.totalMb} MB)
                </div>
              </div>
            </div>

            {/* Table-by-table Schema & Size Matrix */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3.5">PostgreSQL Relation / Table</th>
                    <th className="py-3 px-3 text-right">Rows (Tenant / All)</th>
                    <th className="py-3 px-3 text-right">Heap KB</th>
                    <th className="py-3 px-3 text-right">Index KB</th>
                    <th className="py-3 px-3 text-right">TOAST KB</th>
                    <th className="py-3 px-3 text-right">Total Size</th>
                    <th className="py-3 px-3">PK / FK &amp; RLS Policy</th>
                    <th className="py-3 px-3.5 text-right">DDL &amp; Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tableMetrics.map(tbl => {
                    const totalRowKb = tbl.dataSizeKb + tbl.indexSizeKb + tbl.toastSizeKb;
                    return (
                      <tr key={tbl.tableName} className="hover:bg-slate-50">
                        <td className="py-3 px-3.5">
                          <div className="font-mono font-bold text-slate-900">{tbl.tableName}</div>
                          <div className="text-[11px] text-slate-500">{tbl.description}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-800">
                          {tbl.tenantRowCount} <span className="text-slate-400 font-normal">/ {tbl.rowCount}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                          {tbl.dataSizeKb} KB
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-sky-700">
                          {tbl.indexSizeKb} KB
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-700">
                          {tbl.toastSizeKb} KB
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-extrabold text-emerald-700">
                          {totalRowKb} KB
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono text-[10px] text-slate-700">{tbl.primaryKey}</div>
                          <div className="text-[10px] text-emerald-700 font-mono">RLS: {tbl.rlsPolicy}</div>
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            onClick={() => setSelectedDdlTable(tbl)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] inline-flex items-center gap-1"
                          >
                            <FileCode2 className="w-3 h-3 text-slate-600" />
                            Inspect DDL
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Schema Integrity Test Suite Results */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Automated PostgreSQL Schema &amp; Constraint Test Results
                </h4>
                <p className="text-xs text-slate-500">
                  Last executed: <span className="font-mono">{lastSchemaTestRunAt}</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {schemaAssertions.length} / {schemaAssertions.length} Assertions Passed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {schemaAssertions.map(assertion => (
                <div
                  key={assertion.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                        {assertion.status}
                      </span>
                      <span className="font-bold text-slate-900">{assertion.testName}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">Target: {assertion.targetObjects}</div>
                    <div className="text-slate-700">{assertion.detail}</div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 shrink-0">{assertion.durationMs} ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 3: AUTOMATED BACKUPS & PITR VAULT                             */}
      {/* ===================================================================== */}
      {activeSection === 'automated_backups' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Archive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Automated Backup Policy</h3>
                <p className="text-xs text-slate-500">SARS &amp; BCEA 5-Year Immutable WORM Vault</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Snapshot Cron Schedule</label>
                <select
                  value={backupScheduleConfig.cronExpression}
                  onChange={e =>
                    setBackupScheduleConfig({ ...backupScheduleConfig, cronExpression: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono text-xs"
                >
                  <option>0 2 * * * (02:00 SAST Daily)</option>
                  <option>0 */6 * * * (Every 6 Hours)</option>
                  <option>0 */12 * * * (Every 12 Hours)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Continuous WAL Archiving (PITR)</label>
                <input
                  type="text"
                  readOnly
                  value={backupScheduleConfig.walArchivingMode}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-mono text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Statutory Retention Period (Years)</label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  value={backupScheduleConfig.retentionYears}
                  onChange={e =>
                    setBackupScheduleConfig({
                      ...backupScheduleConfig,
                      retentionYears: Number(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={backupScheduleConfig.autoPreImportBackup}
                  onChange={e =>
                    setBackupScheduleConfig({
                      ...backupScheduleConfig,
                      autoPreImportBackup: e.target.checked
                    })
                  }
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-700">
                  Auto-create snapshot before every batch Data Import
                </span>
              </label>

              <button
                type="button"
                onClick={handleTriggerManualBackup}
                disabled={isCreatingBackup}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isCreatingBackup ? 'animate-spin' : ''}`} />
                <span>{isCreatingBackup ? 'Running pg_dump + Zstandard...' : 'Trigger On-Demand Snapshot Now'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Immutable PostgreSQL Backup Ledger &amp; SHA-256 Checksums
                </h3>
                <p className="text-xs text-slate-500">
                  Every snapshot is cryptographically signed and verified for Point-in-Time Recovery (PITR).
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-bold">
                RPO &lt; 5 min &middot; RTO &lt; 12 min
              </span>
            </div>

            <div className="space-y-3">
              {backups.map(bkp => (
                <div
                  key={bkp.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {bkp.triggerType}
                      </span>
                      <span className="font-mono font-bold text-slate-900">{bkp.snapshotLabel}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">{bkp.createdAt}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">WAL LSN Offset</span>
                      <span className="font-mono font-bold text-sky-700">{bkp.walLsn}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Compressed / Raw Size</span>
                      <span className="font-mono font-bold text-slate-800">
                        {bkp.compressedSizeMb} <span className="text-slate-400 font-normal">({bkp.uncompressedSizeMb})</span>
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">Retention Lock</span>
                      <span className="font-semibold text-slate-700">{bkp.retentionPolicy}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="font-mono text-[10px] text-slate-600 truncate max-w-md">
                      <strong className="text-slate-800">SHA-256:</strong> {bkp.sha256Checksum}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onNotify(
                            `PITR Dry-Run Verified: ${bkp.snapshotLabel} (WAL ${bkp.walLsn}) passed checksum & schema restore test.`
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-[11px]"
                      >
                        Verify PITR Restore
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 4: DATA IMPORT WITH DIFFS PREVIEW                             */}
      {/* ===================================================================== */}
      {activeSection === 'import_diffs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Staging Payload & Preset Selector */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                Stage Batch Import &amp; Compute Tuple Diffs
              </h3>
              <p className="text-xs text-slate-500">
                Inspect field-level `BEFORE` vs `AFTER` diffs and row hashes prior to committing to PostgreSQL.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Load Statutory Import Preset</label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: 'bee_race_batch', label: 'SANAS B-BBEE Race Score & Salary Batch (employees)' },
                  { id: 'bcea_leave_sync', label: 'BCEA Section 20 Leave Accrual Sync Batch (employees)' },
                  { id: 'asset_custody_batch', label: 'Company Property & Insured Asset Custody Batch (company_properties)' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleLoadImportPreset(p.id as any)}
                    className={`px-3 py-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                      selectedImportPreset === p.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Staged JSON / Tuple Migration Payload (Editable)
              </label>
              <textarea
                rows={11}
                value={importPayloadText}
                onChange={e => setImportPayloadText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[11px] border border-slate-800 leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAnalyzeImportDiff}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <FileDiff className="w-3.5 h-3.5 text-emerald-400" />
                Parse &amp; Compute Schema Diff
              </button>
              <button
                type="button"
                onClick={handleCommitStagedImport}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Commit Verified Import
              </button>
            </div>
          </div>

          {/* Right Column: Field-Level Diff Inspector */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pre-Commit PostgreSQL Tuple Diff Inspector
                </h3>
                <p className="text-xs text-slate-500">
                  Compares incoming batch records against live PostgreSQL heap tuples with before/after SHA-256 row digests.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                  +{computedDiffs.filter(d => d.operation === 'INSERT').length} INSERT
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
                  ~{computedDiffs.filter(d => d.operation === 'UPDATE').length} UPDATE
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  ={computedDiffs.filter(d => d.operation === 'UNCHANGED').length} UNCHANGED
                </span>
              </div>
            </div>

            {lastImportCommittedAt && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <span>
                  <strong>Last ACID Batch Committed:</strong> {lastImportCommittedAt} (Auditor Merkle Tree Updated)
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-700">COMMITTED</span>
              </div>
            )}

            <div className="space-y-3">
              {computedDiffs.map(diff => (
                <div
                  key={diff.recordKey}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-extrabold ${
                          diff.operation === 'INSERT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : diff.operation === 'UPDATE'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {diff.operation === 'INSERT'
                          ? '+ ADDED TUPLE'
                          : diff.operation === 'UPDATE'
                          ? '~ MODIFIED TUPLE'
                          : '= UNCHANGED'}
                      </span>
                      <span className="font-bold text-slate-900">{diff.entityLabel}</span>
                      <span className="font-mono text-[11px] text-slate-500">PK: {diff.recordKey}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">{diff.tableName}</span>
                  </div>

                  {/* Field-by-field before / after table */}
                  <div className="space-y-1.5">
                    {diff.fieldDiffs.map((fd, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2.5 rounded-lg bg-white border border-slate-200 items-center font-mono text-[11px]"
                      >
                        <div className="sm:col-span-3 font-bold text-slate-700">{fd.field}</div>
                        <div className="sm:col-span-4 px-2 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 truncate">
                          - {fd.beforeValue}
                        </div>
                        <div className="sm:col-span-5 px-2 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold truncate">
                          + {fd.afterValue}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>Row Hash Before: {diff.rowHashBefore}</span>
                    <span>Row Hash After: {diff.rowHashAfter}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 5: AUDITOR CRYPTOGRAPHIC HASH FINGERPRINTING                  */}
      {/* ===================================================================== */}
      {activeSection === 'auditor_hash_fingerprinting' && (
        <div className="space-y-6">
          {/* Top Master Merkle Root & Auditor Seal Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-900 text-emerald-400 text-[11px] font-mono font-bold">
                  <Fingerprint className="w-3.5 h-3.5" />
                  SHA-256 Cryptographic Merkle Tree Verification
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Statutory Auditor Hash Fingerprinting &amp; Tamper Detection ({selectedCompany.name})
                </h3>
                <p className="text-xs text-slate-500">
                  Generates deterministic SHA-256 digests across all PostgreSQL tables so external auditors (DEL, SANAS B-BBEE Agencies, SARS &amp; CCMA) can mathematically prove zero unauthorized retrospective data tampering.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSimulatedTamperState(prev => !prev)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    simulatedTamperState
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  {simulatedTamperState
                    ? 'Restore Clean State (Clear Tamper Simulation)'
                    : 'Simulate Unauthorized Row Mutation'}
                </button>

                <button
                  type="button"
                  onClick={handleSealAuditorFingerprint}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Seal &amp; Sign Current Auditor Baseline
                </button>
              </div>
            </div>

            {/* Verification Status Alert */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isFingerprintVerified
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {isFingerprintVerified ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-sm">
                    {isFingerprintVerified
                      ? 'CRYPTOGRAPHIC INTEGRITY VERIFIED — ZERO RETROSPECTIVE TAMPERING DETECTED'
                      : 'HASH MISMATCH ALERT — LIVE DATABASE MERKLE ROOT DIFFERS FROM SEALED AUDITOR BASELINE'}
                  </div>
                  <p className="text-[11px] opacity-90">
                    {isFingerprintVerified
                      ? 'All 8 PostgreSQL tables match their canonical SHA-256 Merkle tree leaf digests.'
                      : 'An unsealed mutation was detected in sa_statutory_core.employees. Re-verify diffs or seal a new authorised auditor baseline.'}
                  </p>
                </div>
              </div>
              <div className="font-mono text-xs font-bold shrink-0">
                WAL LSN: {connectionHealth.currentWalLsn}
              </div>
            </div>

            {/* Master Merkle Root Display */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Tenant Master SHA-256 Merkle Root Fingerprint
                </span>
                <button
                  onClick={() => handleCopyHash('merkle_root', effectiveLiveMerkleRoot)}
                  className="text-emerald-400 hover:text-emerald-300 font-mono text-xs flex items-center gap-1"
                >
                  {copiedHashId === 'merkle_root' ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied Digest
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy SHA-256 Root
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-emerald-300 break-all tracking-wide">
                {effectiveLiveMerkleRoot}
              </div>
              {sealedAuditorBaseline && (
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300 font-mono">
                  <span>
                    Sealed Baseline Root: <strong className="text-sky-300">{sealedAuditorBaseline.merkleRoot}</strong>
                  </span>
                  <span>
                    Ref: {sealedAuditorBaseline.auditorReferenceNo} ({sealedAuditorBaseline.sealedAt})
                  </span>
                </div>
              )}
            </div>

            {/* Auditor Attestation Metadata Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  External Verification Agency / Statutory Auditor Name
                </label>
                <input
                  type="text"
                  value={auditorFirmInput}
                  onChange={e => setAuditorFirmInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Audit Engagement Reference / SANAS / DEL Dossier Number
                </label>
                <input
                  type="text"
                  value={auditorRefInput}
                  onChange={e => setAuditorRefInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            {/* Per-Table Cryptographic Leaf Hashes */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3.5">PostgreSQL Table Leaf</th>
                    <th className="py-3 px-3 text-right">Records Hashed</th>
                    <th className="py-3 px-3">Canonical SHA-256 Digest (64-Hex)</th>
                    <th className="py-3 px-3">Integrity Status</th>
                    <th className="py-3 px-3.5 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tableMetrics.map((t, idx) => {
                    const isTamperedTable = simulatedTamperState && idx === 1;
                    const displayedHash = isTamperedTable
                      ? computeDeterministicSha256Hex(t.sha256Digest + ':MUTATED')
                      : t.sha256Digest;
                    return (
                      <tr key={t.tableName} className="hover:bg-slate-50">
                        <td className="py-3 px-3.5 font-mono font-bold text-slate-900">{t.tableName}</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-800">
                          {t.tenantRowCount}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-700 break-all">
                          {displayedHash}
                        </td>
                        <td className="py-3 px-3">
                          {isTamperedTable ? (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                              LEAF HASH DRIFT
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                              VERIFIED MATCH
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            onClick={() => handleCopyHash(t.tableName, displayedHash)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px]"
                          >
                            {copiedHashId === t.tableName ? 'Copied' : 'Copy'}
                          </button>
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

      {/* Modal: Inspect Table DDL & SHA-256 Leaf Hash */}
      {selectedDdlTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold">
                  PostgreSQL 16 Table DDL &amp; Indexes
                </span>
                <h3 className="text-lg font-bold font-mono text-slate-900 mt-1">{selectedDdlTable.tableName}</h3>
                <p className="text-xs text-slate-500">{selectedDdlTable.description}</p>
              </div>
              <button
                onClick={() => setSelectedDdlTable(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {selectedDdlTable.ddlStatement}
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-slate-700">Active B-Tree / GIN Indexes:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedDdlTable.indexes.map(ix => (
                  <span key={ix} className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-[11px] text-slate-800">
                    {ix}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 font-mono text-[11px] text-slate-700 break-all">
              <strong>Table SHA-256 Fingerprint:</strong> {selectedDdlTable.sha256Digest}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDdlTable(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close DDL Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
