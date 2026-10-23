# GreenHiveHR — Multi-Tenant SaaS HR & Compliance Platform (South Africa)

GreenHiveHR is an enterprise-grade multi-tenant HR management, labour relations compliance, and practice management platform built specifically for South African HR consultants, labour practitioners, outsourcing firms, and SMBs. It allows a single HR practitioner to manage multiple client companies from a unified command center with complete data isolation, automated statutory compliance engines, CCMA-ready disciplinary toolkits, billing & time tracking, and an integrated real-time Gemini AI Labour Law Assistant.

***

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions below incorporate the user's confirmed choices from Phase 1 clarifications:
> - **Entry Experience**: The application starts on the high-conversion public SaaS marketing, compliance timeline, and interactive demo portal, with seamless 1-click access to the multi-company HR Consultant workspace and role switchers (Super Admin, Consultant, Client Admin, Manager, Employee).
> - **AI Hive Assistant**: Live server-side Gemini 3.8 model integration (`@google/genai` with streaming and structured JSON guidance) grounded in South African labour legislation: BCEA, Labour Relations Act (LRA), CCMA guidelines, POPIA data governance, COIDA, UIF, and Employment Equity.
> - **Data & Backend Architecture**: Robust relational multi-tenant PostgreSQL schema and hybrid local-first database engine with pre-seeded realistic South African business tenants (e.g., Cape Logistics Ltd, Highveld Engineering, Protea Hospitality Group), realistic employee records (South African ID numbers, tax numbers, leave allocations), and full CRUD operations.

- **Confirmed Decision 1**: Starting view is the public SaaS website with quick-launch switches to the Multi-Tenant Workspace and live role simulation.
- **Confirmed Decision 2**: Gemini AI powers the Hive Assistant with South African legal knowledge, disciplinary notice drafters, and contract verification.
- **Confirmed Decision 3**: Hybrid PostgreSQL relational architecture with multi-tenant data isolation and realistic South African demo data.

***

## 1. Overview & Core Concept

### What It Does
GreenHiveHR provides independent HR consultants, labour relations specialists, and multi-entity HR directors a single pane of glass to oversee multiple client companies. Each tenant has isolated employee rosters, statutory compliance status (BCEA, LRA, POPIA, COIDA, UIF, EE, B-BBEE, WSP/ATR), leave balances, CCMA-grade disciplinary incident logs, and consultant billable time tracking with automated invoicing.

### Target Audience & Persona
- **Independent HR Consultants & Practitioners**: Managing 3 to 30 client businesses who need automated compliance monitoring, time billing, and rapid document drafting.
- **Labour Relations Consultants**: Drafting legally compliant hearing notices, written warnings, and CCMA dispute records.
- **South African SMB Employers & HR Managers**: Needing error-free leave calculations, UIF/COIDA compliance calendars, and POPIA employee file governance.
- **Employees**: Self-service portal to submit leave requests, sign policies, and inspect payslips/records.

### Key Value Delivered
Eliminates fragmented spreadsheets and high legal compliance risks by automating South African statutory deadlines, enforcing CCMA procedural fairness, tracking billable consulting hours, and providing instant AI-assisted labour law advisory.

***

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC SAAS PORTAL                              │
│  [Hero with 3D Hexagon Matrix]  [SA Compliance Timeline]  [Pricing]    │
│  [Interactive Tour] ──> [Launch Live Consultant Workspace Button]       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     MULTI-TENANT HR WORKSPACE                          │
│  ┌───────────────────────────┐  ┌────────────────────────────────────┐ │
│  │   Company Switcher        │  │  Global Executive KPI Bar          │ │
│  │  - Cape Logistics (Pty)   │  │  • Companies Managed: 8            │ │
│  │  - Highveld Mining & Eng  │  │  • Employees Tracked: 412          │ │
│  │  - Protea Hospitality     │  │  • Compliance Risk Score: 94%      │ │
│  │  - + Add New Client       │  │  • Unbilled Time: R 48,250         │ │
│  └───────────────────────────┘  └────────────────────────────────────┘ │
│                                                                        │
│  Tab Navigation:                                                       │
│  [Dashboard] [Employees] [Compliance Calendar] [Labour & CCMA]         │
│  [Leave Management] [Time & Billing] [Document Vault] [Self-Service]   │
│                                                                        │
│  Floating Dock:                                                        │
│  [🐝 Hive AI Assistant Drawer - SA Labour Law & Contract/Warning Gen]  │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Public Marketing & Conversion Flow**:
   - Sticky glassmorphic top navigation with logo, nav links (`Features`, `Compliance`, `Pricing`, `Industries`, `About`), and primary CTA `Launch Demo Workspace`.
   - Hero banner with geometric hexagon mesh, dynamic animated connected nodes, headline *"HR Management Built For South African Business"*, and quantitative metrics strip.
   - Interactive South African Compliance interactive timeline highlighting BCEA, LRA, POPIA, COIDA, UIF, Employment Equity, Skills Development, and B-BBEE.
   - Honeycomb Bento feature grid displaying Employee Hub, Disciplinary Toolkit, Document Vault, Time Billing, and AI Hive Assistant.
   - South African ZAR pricing cards (`Solo Consultant R499/mo`, `Professional R1,499/mo`, `Business R4,999/mo`, `Enterprise Custom`).

2. **HR Consultant Multi-Company Workspace Flow**:
   - Instant Tenant Switcher in header: seamlessly swap between client entities with independent employee rosters, risk scores, and documents.
   - Executive Dashboard with compliance heatmaps, pending contract renewals, probation expirations, and billable hours.
   - Employee Management Module: comprehensive SA employee profiles (SA ID number validation, passport/visa expiration, tax/UIF numbers, medical aid, remuneration, contract type, and emergency contacts).
   - South African Labour Relations & CCMA Toolkit: generate warnings (verbal, written, final, hearing notice, outcome letter) with procedural fairness checklists and evidence lockers.
   - Statutory Compliance Engine: calendar tracking annual COIDA Return of Earnings (ROE), Employment Equity submissions, UIF monthly declarations, and B-BBEE scorecard tasks with WhatsApp/email notification simulations.
   - Time Tracking & Client Billing: log consulting hours per client/project, configure hourly or retainer rates, and export itemized invoices in ZAR.
   - Document Vault & Completeness Score: audit employee files for required documents (ID copy, signed employment contract, POPIA consent, medical declaration).
   - Employee Self-Service (ESS) simulation view: submit leave requests, view leave balances (Annual, Sick, Family Responsibility, Maternity, Parental, Study), and download company policies.

3. **Live AI Hive Assistant Flow**:
   - Slide-over or floating AI drawer powered by server-side Gemini 3.8 (`@google/genai`).
   - Capabilities:
     1. *Labour Law Advisory*: queries on BCEA working hours, overtime rules, severance pay calculations, and CCMA dismissal procedures.
     2. *Disciplinary Warning Drafter*: generate legally enforceable written warnings citing South African labour codes.
     3. *Employment Contract Generator*: draft compliant SA permanent/fixed-term contracts with standard probationary clauses.
     4. *File Audit & Policy Assistant*: evaluate client compliance gaps and generate company policies (POPIA privacy, workplace grievance policy).

### Visual Identity & Theme
- **Aesthetic Direction**: Enterprise Corporate & Modern Tech, inspired by Linear, Hive, and Monday.com, elevated with subtle South African motifs and clean geometric hexagon accents.
- **Palette Tokens**:
  - Primary Green: `#22C55E` (Emerald 500)
  - Secondary Green: `#16A34A` (Emerald 600)
  - Dark Slate Green: `#14532D` (Emerald 900)
  - Accent Honey/Gold: `#F59E0B` / `#FBBF24` (Amber 500)
  - Background Neutral: `#F8FAFC` (Slate 50)
  - Dark Headings / Text: `#0F172A` / `#1E293B` (Slate 900/800)
  - Border Hairlines: `rgba(0, 0, 0, 0.08)` / `#E2E8F0`
- **Typography**:
  - Headings: `Plus Jakarta Sans` (weights 600, 700)
  - Body Prose: `Plus Jakarta Sans` / `DM Sans` (weights 400, 500)
  - Numerics & Metrics: Monospace tabular numerals (`tabular-nums font-mono`) for ZAR currencies, dates, employee IDs, and hours.
- **Design Constitution Compliance**:
  - Strict Top Bar Contract: 3 zones separated by `gap-8`, single-line text brand mark, single-line links, one clear CTA.
  - Zero-Pill Metadata: metadata rendered with unboxed typographic separators (`·`, `/`).
  - No AI-slop mechanical prefixes (no `// 01_CORE`, no decorative pulsing green dots).

***

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Featured Hybrid PostgreSQL State Engine with Express API**
  - *Chosen Approach*: Implement an Express backend with PostgreSQL-compatible schema and in-memory persistent relational store with realistic multi-company seed data, backed by REST endpoints (`/api/companies`, `/api/employees`, `/api/compliance`, `/api/cases`, `/api/billing`, `/api/gemini/assistant`).
  - *Why*: Delivers instantaneous zero-setup boot in the AI Studio preview while maintaining 100% relational data integrity, tenant isolation, and full mutation support.
- **Decision 2: Server-Side Gemini API Client (`@google/genai`)**
  - *Chosen Approach*: Server-side endpoint (`/api/gemini/assistant` & `/api/gemini/generate-document`) initialized with `process.env.GEMINI_API_KEY` and `User-Agent: 'aistudio-build'`.
  - *Why*: Adheres strictly to AI Studio security guidelines (never exposing API keys to the browser) and provides fast streaming answers for legal inquiries and document generation.
- **Decision 3: Seamless Dual Navigation (Public SaaS + Multi-Tenant Workspace)**
  - *Chosen Approach*: Clean toggle bar and quick-access buttons allowing the evaluator to view the public conversion website, or jump into any client company as an HR Consultant, Client Admin, or Employee.
  - *Why*: Meets all user requirements for both the public-facing brand presence and the in-depth multi-tenant application dashboard.

***

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          VITE + REACT CLIENT                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Navigation & Layout                                              │  │
│  │  • TopBar (Top Bar Contract: Brand — Links — CTA)               │  │
│  │  • CompanySwitcher & RoleSelector                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────┬──────────────────────────────────┐  │
│  │ Public Marketing View         │ Multi-Tenant SaaS Workspace      │  │
│  │  • Hero & Hexagon Grid        │  • Executive Dashboard & KPIs    │  │
│  │  • SA Statutory Timeline      │  • Employee Roster & Profiles    │  │
│  │  • Bento Feature Cards        │  • Compliance Calendar & Engine  │  │
│  │  • Pricing in ZAR             │  • CCMA Disciplinary Toolkit     │  │
│  │  • Book Demo Modal            │  • Leave & Absence Management    │  │
│  │                               │  • Time Tracking & Billing       │  │
│  │                               │  • Document Vault & Audit        │  │
│  │                               │  • Employee Self-Service (ESS)   │  │
│  └───────────────────────────────┴──────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Hive AI Assistant (Gemini Drawer)                                │  │
│  │  • BCEA/LRA Legal Q&A · Warning Drafter · Contract Generator     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (/api/*)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS BACKEND (Node.js)                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Server API Endpoints                                             │  │
│  │  • GET/POST /api/companies (Multi-tenant company management)    │  │
│  │  • GET/POST/PUT /api/employees (SA employee CRUD & documents)    │  │
│  │  • GET/POST /api/compliance (Deadlines: COIDA, UIF, EE, B-BBEE)  │  │
│  │  • GET/POST /api/disciplinary (CCMA cases, warnings, hearings)   │  │
│  │  • GET/POST /api/leave (Leave requests & balances)               │  │
│  │  • GET/POST /api/billing (Timesheets & client invoice generator) │  │
│  │  • POST /api/gemini/assistant (GoogleGenAI server integration)   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────┬─────────────────────────────────┐  │
│  │ Relational PostgreSQL Engine   │ Gemini 3.8 Flash SDK            │  │
│  │  • Tenant-isolated tables      │  • @google/genai                │  │
│  │  • Foreign key constraints     │  • Telemetry headers            │  │
│  │  • Realistic SA seed dataset   │  • SA Legal System Prompt       │  │
│  └────────────────────────────────┴─────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Overview (PostgreSQL Relational Tables)
1. **tenants / companies**:
   - `id`, `name`, `registration_number` (e.g. 2021/148920/07), `industry`, `paye_number`, `uif_number`, `coida_number`, `compliance_score`, `created_at`.
2. **employees**:
   - `id`, `company_id`, `employee_number`, `first_name`, `last_name`, `email`, `phone`, `id_number` (13-digit SA ID), `passport_number`, `department`, `job_title`, `manager_id`, `start_date`, `contract_type` (Permanent, Fixed-Term, Contractor), `salary_cents`, `leave_balance_annual`, `leave_balance_sick`, `leave_balance_family`, `status`.
3. **compliance_events**:
   - `id`, `company_id`, `title`, `statute` (BCEA, LRA, POPIA, COIDA, UIF, EE, B-BBEE, WSP/ATR), `due_date`, `status` (Pending, In Progress, Compliant, Overdue), `description`, `penalty_risk`.
4. **disciplinary_cases**:
   - `id`, `company_id`, `employee_id`, `type` (Misconduct, Poor Performance, Incapacity), `stage` (Verbal Warning, Written Warning, Final Written Warning, Notice of Hearing, Sanction), `incident_date`, `summary`, `status` (Open, Hearing Scheduled, Resolved, CCMA Referred).
5. **leave_requests**:
   - `id`, `company_id`, `employee_id`, `leave_type` (Annual, Sick, Family Responsibility, Maternity, Parental, Study), `start_date`, `end_date`, `days_count`, `reason`, `status` (Pending, Approved, Rejected).
6. **time_entries & invoices**:
   - `id`, `company_id`, `consultant_name`, `date`, `hours`, `hourly_rate_cents`, `project`, `description`, `is_billed`, `invoice_id`.
7. **documents**:
   - `id`, `company_id`, `employee_id`, `title`, `category` (Contract, Policy, Disciplinary, Medical, Tax), `file_size`, `uploaded_at`, `status`.

***

## 5. Implementation Sequence & Execution Steps

1. **Step 1: Express Server & Relational PostgreSQL Multi-Tenant Backend**
   - Create `server.ts` with Express, configuring API routes for companies, employees, compliance, disciplinary cases, leave, timesheets, and Gemini integration.
   - Seed realistic South African entities, compliant with BCEA and LRA statutory rules.
2. **Step 2: Core Design System & Top Bar Navigation**
   - Configure Tailwind typography and design tokens matching GreenHiveHR branding (`#22C55E`, `#16A34A`, `#14532D`, `#F59E0B`).
   - Implement the Top Bar Contract adhering to zero-pill discipline and single-line affordances.
3. **Step 3: Public SaaS Landing & Compliance Portal**
   - Build high-conversion Hero with animated honeycomb node matrix, South African statutory timeline, feature Bento grid, and interactive ZAR pricing tiers.
4. **Step 4: Multi-Tenant HR Consultant Workspace & Company Switcher**
   - Executive Dashboard with compliance risk score, employee metrics, unbilled hours, and upcoming renewal alerts.
   - Roster Management with South African employee profiles and validation.
5. **Step 5: South African Labour Relations & CCMA Toolkit**
   - Warning letter generation, formal hearing notices, and procedural fairness compliance checklists.
6. **Step 6: Time Tracking & Client Invoicing Module**
   - Consultant hour logging, billable rate calculations in ZAR, and professional invoice generation.
7. **Step 7: Real-Time Gemini AI Hive Assistant**
   - Integrated floating assistant for South African labour law inquiries, employment contract generation, and compliance checks.
8. **Step 8: Verification & Compilation**
   - Run `compile_applet` and test full interactions across all modules.
