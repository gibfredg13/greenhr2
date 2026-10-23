import React from 'react';
import { Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
  onOpenBookDemo: () => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onSelectPlan, onOpenBookDemo }) => {
  const plans = [
    {
      name: 'HRaaS Foundation',
      badge: 'Platform + Essential HR Advisory',
      price: 'R2,499',
      period: '/month',
      description: 'Ideal for growing SMEs needing the full GreenHive platform plus a dedicated HR Advisor for compliance & contracts.',
      features: [
        'Full HR & Compliance Platform Included',
        'Named SABPP-Accredited HR Advisor',
        'Employee Self-Service (ESS) Portal',
        'BCEA Contract & Policy Drafting',
        'Monthly UIF & COIDA ROE Preparation',
        'Telephonic & Teams Disciplinary Advisory'
      ],
      popular: false,
      cta: 'Start HRaaS Foundation'
    },
    {
      name: 'HRaaS Complete Partner',
      badge: 'Most Popular Full-Service HRaaS',
      price: 'R5,999',
      period: '/month',
      description: 'Complete HR-as-a-Service delivery: we run your HR administration, chair hearings, and support your employees 1-on-1.',
      features: [
        'Dedicated Senior HR & Labour Partner',
        '1-on-1 Employee Care & Grievance Desk',
        'Chaired Disciplinary & Incapacity Hearings',
        '9-Box Matrix Audits & Standardized Testing',
        'Done-For-You EE (EEA2/EEA4) & WSP/ATR Filings',
        'Direct CCMA Conciliation & Advisory Support',
        'Full Multi-Entity Platform & Document Vault'
      ],
      popular: true,
      cta: 'Partner With Us'
    },
    {
      name: 'HRaaS Corporate Group',
      badge: 'Multi-Company & High-Touch HR',
      price: 'R12,999',
      period: '/month',
      description: 'Embedded HR department for multi-entity groups, franchises, and high-compliance industrial workforces.',
      features: [
        'Unlimited Group Entities & Branches',
        'On-Site & Virtual HR Partner Attendance',
        'Bargaining Council & Union Negotiations',
        'Quarterly Workforce Matrix & Talent Audits',
        'Full B-BBEE Verification Preparation',
        'Dedicated Industrial Relations Specialist',
        'Priority Employee Wellness & Care Line'
      ],
      popular: false,
      cta: 'Scale With HRaaS Group'
    },
    {
      name: 'Enterprise & BPO',
      badge: 'Custom Embedded HR Department',
      price: 'Custom',
      period: '',
      description: 'Tailored full-service HR outsourcing for large employers, national operations, and HR consulting groups.',
      features: [
        'Dedicated Embedded HR Team (On-Site/Hybrid)',
        'Direct Sage / Xero / SAP Payroll Integration',
        'Custom SLA & 24/7 Labour Relations Desk',
        'Custom Sectoral Determination Governance',
        'Full POPIA & ISO HR Compliance Auditing'
      ],
      popular: false,
      cta: 'Book Executive Consultation'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            All-Inclusive HRaaS Retainers (Platform + Professionals)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Less Than the Cost of a Single Junior Hire &mdash; Backed by an Entire HR Team
          </h2>
          <p className="text-base text-slate-600">
            Every plan includes the complete GreenHiveHR platform <strong>plus</strong> our experienced HR professionals, labour law knowledge, and direct employee support. Billed in ZAR with 15% VAT itemized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            return (
              <div
                key={p.name}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ${
                  p.popular
                    ? 'bg-slate-900 text-white shadow-xl ring-2 ring-emerald-500 relative'
                    : 'bg-slate-50 border border-slate-200 text-slate-900'
                }`}
              >
                <div>
                  {p.popular && (
                    <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500 text-slate-950 mb-3">
                      FULL-SERVICE HRaaS FAVORITE
                    </div>
                  )}

                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className={`text-xs mt-1 mb-4 ${p.popular ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                    {p.badge}
                  </p>

                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums">
                      {p.price}
                    </span>
                    <span className={`text-xs ${p.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                      {p.period}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed mb-6 ${p.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                    {p.description}
                  </p>

                  <div className={`space-y-2.5 pt-4 border-t ${p.popular ? 'border-slate-800' : 'border-slate-200'}`}>
                    {p.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-xs">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span className={p.popular ? 'text-slate-200' : 'text-slate-700'}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => {
                      if (p.name === 'Enterprise & BPO') {
                        onOpenBookDemo();
                      } else {
                        onSelectPlan(p.name);
                      }
                    }}
                    className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      p.popular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {p.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Service & Invoicing Guarantee strip */}
        <div className="mt-16 max-w-4xl mx-auto p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>The GreenHive HRaaS Promise: Technology + Dedicated Human Accountability</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Unlike self-service SaaS subscriptions that leave you stranded when a complex labour dispute or employee crisis arises, every GreenHiveHR retainer includes guaranteed practitioner support hours, direct employee care access, and SARS-compliant 15% VAT tax invoices (Section 11(a) deductible).
          </p>
        </div>
      </div>
    </section>
  );
};
