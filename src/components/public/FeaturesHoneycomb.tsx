import React from 'react';
import {
  Users,
  CalendarDays,
  ShieldCheck,
  FolderLock,
  Scale,
  Briefcase,
  Clock,
  TrendingUp,
  UserCheck,
  FileSignature,
  Sparkles,
  Building,
  Pickaxe,
  HardHat,
  Tractor,
  Coffee,
  ShoppingBag,
  BriefcaseBusiness,
  Stethoscope,
  Truck,
  ShieldAlert
} from 'lucide-react';

interface FeaturesHoneycombProps {
  onSelectFeature?: (featureName: string) => void;
}

export const FeaturesHoneycomb: React.FC<FeaturesHoneycombProps> = ({ onSelectFeature }) => {
  const features = [
    {
      icon: Users,
      title: 'Managed Employee Lifecycle & Records',
      desc: 'Centralized South African personnel files with 13-digit ID verification, contracts, and active dossier management by your assigned HR partner.'
    },
    {
      icon: UserCheck,
      title: '1-on-1 Employee Care & Advisory Desk',
      desc: 'We don’t leave employees talking to chatbots. Staff book confidential video, phone, or in-person sessions with our accredited HR specialists.'
    },
    {
      icon: TrendingUp,
      title: 'Matrix Audits & Standardized Diagnostics',
      desc: 'Expert-calibrated 9-Box Talent Matrices, Skill-Will Grids, leadership readiness, and BCEA literacy diagnostics saved directly to employee files.'
    },
    {
      icon: Scale,
      title: 'Hands-On CCMA & Disciplinary Support',
      desc: 'Beyond LRA Schedule 8 warning templates — our labour practitioners draft charges, chair disciplinary inquiries, and represent you at the CCMA.'
    },
    {
      icon: ShieldCheck,
      title: 'Done-For-You Statutory Compliance',
      desc: 'Proactive preparation and submission of COIDA Return of Earnings, UIF declarations, Employment Equity (EEA2/EEA4), and B-BBEE audits.'
    },
    {
      icon: CalendarDays,
      title: 'Guided BCEA Leave Administration',
      desc: 'Statutory leave cycles (annual, sick, family responsibility, parental) with medical certificate verification and complex incapacity guidance.'
    },
    {
      icon: Briefcase,
      title: 'Grievance & Incapacity Case Management',
      desc: 'End-to-end professional handling of workplace grievances, poor work performance (PIP) processes, and medical incapacity investigations.'
    },
    {
      icon: FolderLock,
      title: 'POPIA-Audited Document Vault',
      desc: 'Encrypted storage for employment contracts, POPIA consent notices, qualifications, and signed audit trails verified by our compliance desk.'
    },
    {
      icon: FileSignature,
      title: 'Tailored Contracts & Policy Drafting',
      desc: 'Custom-drafted South African employment agreements, disciplinary codes, and workplace policies with tamper-evident digital signatures.'
    },
    {
      icon: Clock,
      title: 'Transparent Retainer & SLA Tracking',
      desc: 'Real-time visibility into every hour our HR specialists invest in your company, with SARS-compliant 15% VAT invoicing.'
    },
    {
      icon: Sparkles,
      title: 'Human Expertise + Hive AI Intelligence',
      desc: 'Our senior HR practitioners combine decades of South African labour experience with instant AI legal research for rapid, rock-solid advice.'
    }
  ];

  const industries = [
    { icon: Building, name: 'Manufacturing' },
    { icon: Pickaxe, name: 'Mining' },
    { icon: HardHat, name: 'Construction' },
    { icon: Tractor, name: 'Agriculture' },
    { icon: Coffee, name: 'Hospitality' },
    { icon: ShoppingBag, name: 'Retail' },
    { icon: BriefcaseBusiness, name: 'Professional Services' },
    { icon: Stethoscope, name: 'Healthcare' },
    { icon: Truck, name: 'Logistics' },
    { icon: ShieldAlert, name: 'Security Services' }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            Complete HRaaS Capability Suite
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Powerful HR Tools Backed by Dedicated Professionals
          </h2>
          <p className="text-base text-slate-600">
            Every module in GreenHiveHR is supported by real South African HR &amp; Labour practitioners who bring the knowledge, empathy, and professionalism needed to give your employees an exceptional HR experience.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            const isSpecial = feat.title.includes('Human Expertise');
            return (
              <div
                key={feat.title}
                className={`rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  isSpecial
                    ? 'bg-gradient-to-br from-emerald-900 to-slate-900 text-white border border-emerald-600/40 md:col-span-2 lg:col-span-1 shadow-lg'
                    : 'bg-white border border-slate-200 text-slate-900 shadow-sm'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                    isSpecial
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {feat.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isSpecial ? 'text-slate-300' : 'text-slate-600'}`}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Industries Served Section */}
        <div id="industries" className="mt-24 pt-16 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-slate-900">
              Industries Served Across South Africa
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Sectoral determinations and bargaining council support tailored to every major industry.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {industries.map(ind => {
              const IndIcon = ind.icon;
              return (
                <div
                  key={ind.name}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-emerald-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                    <IndIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {ind.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
