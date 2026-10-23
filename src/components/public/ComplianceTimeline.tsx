import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { StatuteCategory } from '../../types';

interface ComplianceTimelineItem {
  statute: StatuteCategory;
  actTitle: string;
  frequency: string;
  deadlineDescription: string;
  riskSummary: string;
  practicalTip: string;
}

const SA_COMPLIANCE_ITEMS: ComplianceTimelineItem[] = [
  {
    statute: 'UIF',
    actTitle: 'Unemployment Insurance Act (Act 63 of 2001)',
    frequency: 'Monthly (By 7th)',
    deadlineDescription: 'Submit monthly UI-19 declarations and electronic EMP201 payment via SARS eFiling/uFiling.',
    riskSummary: '10% SARS late filing penalty plus 1% compounding monthly interest.',
    practicalTip: 'GreenHiveHR auto-reconciles headcount changes directly against payroll schedules.'
  },
  {
    statute: 'COIDA',
    actTitle: 'Compensation for Occupational Injuries & Diseases Act (Act 130 of 1993)',
    frequency: 'Annual (By 31 March)',
    deadlineDescription: 'Submission of W.As.8 Return of Earnings (ROE) on actual wages paid and next year estimated wages.',
    riskSummary: '10% penalty on assessment and forfeiture of Letter of Good Standing required for commercial contracts and tenders.',
    practicalTip: 'Store verified assessment notices and Letters of Good Standing directly in the client Document Vault.'
  },
  {
    statute: 'Skills Development',
    actTitle: 'Skills Development Act (Act 97 of 1998)',
    frequency: 'Annual (By 30 April)',
    deadlineDescription: 'Submit Workplace Skills Plan (WSP) and Annual Training Report (ATR) to the designated SETA.',
    riskSummary: 'Permanent forfeiture of 20% Mandatory Grant levy rebate and 0 points for B-BBEE Skills Development.',
    practicalTip: 'Track internal employee training hours and artisan development continuously across clients.'
  },
  {
    statute: 'Employment Equity',
    actTitle: 'Employment Equity Act (Act 55 of 1998)',
    frequency: 'Annual (By 15 January online)',
    deadlineDescription: 'Designated employers (>50 staff or turnover threshold) must submit EEA2 demographic report and EEA4 income differential statement.',
    riskSummary: 'Department of Employment and Labour court penalties from R1.5M up to 10% of annual turnover for repeat non-compliance.',
    practicalTip: 'Pre-formatted occupational category tables with consultative committee sign-off logs.'
  },
  {
    statute: 'POPIA',
    actTitle: 'Protection of Personal Information Act (Act 4 of 2013)',
    frequency: 'Continuous / Annual Audit',
    deadlineDescription: 'Lawful processing of employee records (ID numbers, health data, criminal checks), Operator agreements, and Section 19 security safeguard audits.',
    riskSummary: 'Information Regulator administrative fines up to R10 million or criminal liability.',
    practicalTip: 'Built-in employee POPIA consent manager with automated document expiry tracking.'
  },
  {
    statute: 'Labour Relations Act',
    actTitle: 'Labour Relations Act (Act 66 of 1995)',
    frequency: 'Ad-hoc (Disciplinary Matters)',
    deadlineDescription: 'Adherence to Schedule 8 Code of Good Practice on Dismissal: procedural fairness (48h notice, representation, hearing) and substantive fairness.',
    riskSummary: 'CCMA arbitration awards up to 12 months salary for unfair dismissals and 24 months for automatically unfair dismissals.',
    practicalTip: 'CCMA-ready disciplinary templates, warning registers, and digital evidence binders.'
  },
  {
    statute: 'BCEA',
    actTitle: 'Basic Conditions of Employment Act (Act 75 of 1997)',
    frequency: 'Ongoing Operations',
    deadlineDescription: 'Strict compliance with 45-hour normal work weeks, 1.5x overtime, meal intervals, Section 20 annual leave, and Section 22 sick leave.',
    riskSummary: 'Labour Inspectorate compliance orders, back-pay directives, and CCMA wage enforcement.',
    practicalTip: 'Automated 36-month sick leave cycle tracking and 3-day family responsibility allocations.'
  },
  {
    statute: 'B-BBEE',
    actTitle: 'Broad-Based Black Economic Empowerment Act (Act 53 of 2003)',
    frequency: 'Annual Verification',
    deadlineDescription: 'Annual scorecard audit covering Ownership, Management Control, Skills Development, Enterprise & Supplier Development, and Socio-Economic Development.',
    riskSummary: 'Downgraded procurement recognition level resulting in loss of corporate supply chain tenders.',
    practicalTip: 'Synchronized workforce headcount data directly feeds B-BBEE Management Control points.'
  }
];

export const ComplianceTimeline: React.FC = () => {
  const [activeStatute, setActiveStatute] = useState<StatuteCategory>('COIDA');

  const selectedItem = SA_COMPLIANCE_ITEMS.find(item => item.statute === activeStatute) || SA_COMPLIANCE_ITEMS[0];

  return (
    <section id="compliance" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            South African Regulatory Calendar
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Stay Compliant Without Spreadsheets, Calendars, or Manual Reminders
          </h2>
          <p className="text-base text-slate-600">
            South African labour and fiscal laws have severe penalties for missed statutory deadlines. GreenHiveHR automates deadlines across all client entities.
          </p>
        </div>

        {/* Statute Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {SA_COMPLIANCE_ITEMS.map(item => (
            <button
              key={item.statute}
              onClick={() => setActiveStatute(item.statute)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeStatute === item.statute
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.statute}
            </button>
          ))}
        </div>

        {/* Detailed Timeline Feature Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Cadence: {selectedItem.frequency}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {selectedItem.statute} — {selectedItem.actTitle}
                </h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Statutory Requirement
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedItem.deadlineDescription}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  GreenHive Automated Workflow
                </h4>
                <p className="text-sm text-emerald-900 font-medium bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-3">
                  {selectedItem.practicalTip}
                </p>
              </div>
            </div>

            {/* Non-compliance penalty risk box */}
            <div className="md:col-span-4 bg-amber-50/80 border border-amber-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Statutory Penalty Risk</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {selectedItem.riskSummary}
              </p>
              <div className="pt-2 border-t border-amber-200/70 text-[11px] text-amber-800 font-semibold">
                Protected by GreenHive automated WhatsApp &amp; Email reminder engine.
              </div>
            </div>
          </div>
        </div>

        {/* How It Works 5-Step Process */}
        <div id="how-it-works" className="mt-20 pt-16 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-slate-900">
              How GreenHiveHR Works
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Five streamlined steps connecting your HR consulting practice with every client.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Create Company', desc: 'Add isolated client profile with industry, PAYE, and COIDA numbers.' },
              { step: '02', title: 'Import Employees', desc: 'Import roster with 13-digit SA ID validation and leave balances.' },
              { step: '03', title: 'Configure Reminders', desc: 'Auto-schedule BCEA, UIF, and COIDA compliance alerts.' },
              { step: '04', title: 'Manage HR Operations', desc: 'Execute CCMA-ready warnings, approve leave, and log billables.' },
              { step: '05', title: 'Track Compliance', desc: 'Monitor real-time compliance score and export audit bundles.' }
            ].map((s, idx) => (
              <div key={s.step} className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center relative hover:border-emerald-300 transition-all">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-mono font-bold text-sm flex items-center justify-center mx-auto mb-3 shadow-sm shadow-emerald-600/30">
                  {s.step}
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
