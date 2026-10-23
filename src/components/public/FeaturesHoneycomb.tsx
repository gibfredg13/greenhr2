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
      title: 'Employee Management',
      desc: 'Centralized South African employee records with 13-digit ID verification, tax numbers, and contract tracking.'
    },
    {
      icon: CalendarDays,
      title: 'BCEA Leave Management',
      desc: 'Statutory leave cycles (annual, sick, family, parental) with approval workflows and medical certificate validation.'
    },
    {
      icon: ShieldCheck,
      title: 'Compliance Monitoring',
      desc: 'Automated tracking of COIDA ROE, UIF declarations, Employment Equity (EEA2/4), and B-BBEE audits.'
    },
    {
      icon: FolderLock,
      title: 'Secure Document Vault',
      desc: 'Encrypted storage for contracts, POPIA consent forms, IDs, medical certificates, and disciplinary history.'
    },
    {
      icon: Scale,
      title: 'CCMA Disciplinary Toolkit',
      desc: 'Procedurally fair warning notices, hearing notifications, and investigation dossiers compliant with LRA Schedule 8.'
    },
    {
      icon: Briefcase,
      title: 'HR Case Management',
      desc: 'Track grievances, misconduct investigations, incapacity inquiries, and CCMA arbitrations from open to close.'
    },
    {
      icon: Clock,
      title: 'Consultant Time & Billing',
      desc: 'Log billable hours against client companies, projects, or retainers, with automatic 15% South African VAT invoicing.'
    },
    {
      icon: TrendingUp,
      title: 'Performance & Reviews',
      desc: 'Structured scorecards, 3-month probation check-ins, KPI goal tracking, and performance improvement plans.'
    },
    {
      icon: UserCheck,
      title: 'Automated Onboarding',
      desc: 'Digital employee intake forms, POPIA privacy notices, and standard BCEA employment agreements.'
    },
    {
      icon: FileSignature,
      title: 'Digital Signatures',
      desc: 'Paperless electronic approvals on warnings, contracts, and company policies with tamper-evident audit trails.'
    },
    {
      icon: Sparkles,
      title: 'Gemini AI Hive Assistant',
      desc: 'Instant South African labour law legal advisory, warning letter drafter, and automated employee file completeness checks.'
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
            Enterprise Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for the Complexity of South African Labour
          </h2>
          <p className="text-base text-slate-600">
            A complete suite of practice management, compliance, and labour relations tools built specifically for independent HR consultants and multi-company administrators.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            const isSpecial = feat.title.includes('Gemini');
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
