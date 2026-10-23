import React from 'react';
import { Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
  onOpenBookDemo: () => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onSelectPlan, onOpenBookDemo }) => {
  const plans = [
    {
      name: 'Solo Consultant',
      badge: 'For Independent Practitioners',
      price: 'R499',
      period: '/month',
      description: 'Ideal for independent HR advisors managing a focused client base with automated statutory deadlines.',
      features: [
        'Up to 3 Client Companies',
        'Up to 50 Employees Total',
        'South African Compliance Calendar',
        'CCMA-Ready Disciplinary Toolkit',
        'Time Tracking & ZAR Invoicing',
        'Standard Document Vault'
      ],
      popular: false,
      cta: 'Start with Solo'
    },
    {
      name: 'Professional',
      badge: 'Most Popular for HR Firms',
      price: 'R1,499',
      period: '/month',
      description: 'For growing HR consulting firms needing multi-client practice management and AI labour advisory.',
      features: [
        'Up to 20 Client Companies',
        'Up to 500 Employees Total',
        'Gemini AI Hive Assistant Included',
        'Automated Employment Equity & UIF',
        'Employee Self-Service (ESS) Portal',
        'Multi-Consultant Timesheet Approvals',
        'WhatsApp Reminder Engine'
      ],
      popular: true,
      cta: 'Get Professional'
    },
    {
      name: 'Business',
      badge: 'For Established Outsource Providers',
      price: 'R4,999',
      period: '/month',
      description: 'Complete practice engine for established HR outsourcing firms and corporate groups.',
      features: [
        'Unlimited Client Companies',
        'Unlimited Employees Tracked',
        'Priority Gemini AI Legal Support',
        'Automated B-BBEE Audit Workflows',
        'Custom Bargaining Council Rules',
        'Branded Client Portal & Domain',
        'Dedicated Practice Onboarding Specialist'
      ],
      popular: false,
      cta: 'Scale Your Business'
    },
    {
      name: 'Enterprise',
      badge: 'BPO & Large Organizations',
      price: 'Custom',
      period: '',
      description: 'Tailored for large BPO operators, multinational corporate groups, and industry employer associations.',
      features: [
        'Dedicated Cloud Infrastructure',
        'Direct Sage / Xero / SAP Payroll Sync',
        'Custom SLA & 24/7 Labour Support',
        'Custom Sectoral Agreements',
        'Enterprise Security & POPIA ISO Audit'
      ],
      popular: false,
      cta: 'Contact Enterprise Sales'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            Transparent South African Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Predictable ZAR Pricing That Grows With Your Practice
          </h2>
          <p className="text-base text-slate-600">
            No unexpected currency fluctuations. Billed in South African Rands (ZAR) with 15% VAT itemized on tax invoices.
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
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className={`text-xs mt-1 mb-4 ${p.popular ? 'text-slate-400' : 'text-slate-500'}`}>
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
                      if (p.name === 'Enterprise') {
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

        {/* FAQ strip */}
        <div className="mt-16 max-w-3xl mx-auto p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>South African Tax &amp; Invoicing Guarantee</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All GreenHiveHR subscriptions generate valid SARS-compliant Tax Invoices displaying our registered VAT number and your company details for seamless input tax deductions. Cancel or adjust company quotas at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
