import React from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  Play,
  Scale,
  FileCheck2,
  AlertCircle,
  FileText
} from 'lucide-react';

interface HeroProps {
  onLaunchDemo: () => void;
  onOpenBookDemo: () => void;
  onOpenTour: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchDemo, onOpenBookDemo, onOpenTour }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 hive-pattern border-b border-slate-200">
      {/* Decorative ambient gradient blooms */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              South Africa's Premier Multi-Entity HR &amp; Compliance SaaS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              HR Management Built For <span className="text-emerald-600">South African</span> Business
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Manage employees, contracts, statutory compliance deadlines, leave, CCMA-ready disciplinary processes, and HR administration across multiple companies from a single secure platform.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLaunchDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
              >
                Launch Live Workspace
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBookDemo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all hover:border-slate-400"
              >
                Book a Demo
              </button>

              <button
                onClick={onOpenTour}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-emerald-700 text-emerald-700 ml-0.5" />
                </div>
                Platform Tour
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/80">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Built for South African Regulatory Standards
              </p>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  POPIA Ready
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Multi-Company Isolation
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  LRA &amp; BCEA Compliant
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  CCMA-Grade Toolkits
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Honeycomb Matrix Visualization */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-white overflow-hidden">
              {/* Honeycomb visual backdrop */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Top header within the terminal/card */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    GreenHive Multi-Tenant Hub
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Tenant Engine v2.4
                </span>
              </div>

              {/* Central Hexagonal Network Graphic */}
              <div className="my-6 relative flex flex-col items-center justify-center py-4">
                {/* SVG Interconnected Hexagon Grid */}
                <svg viewBox="0 0 400 240" className="w-full h-auto max-h-[220px]">
                  {/* Grid Lines */}
                  <line x1="80" y1="120" x2="200" y2="60" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="200" y1="60" x2="320" y2="120" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="80" y1="120" x2="200" y2="180" stroke="#16A34A" strokeWidth="1.5" opacity="0.7" />
                  <line x1="200" y1="180" x2="320" y2="120" stroke="#16A34A" strokeWidth="1.5" opacity="0.7" />
                  <line x1="200" y1="60" x2="200" y2="180" stroke="#22C55E" strokeWidth="2" />

                  {/* Node 1: Left - Cape Logistics */}
                  <g transform="translate(80, 120)">
                    <polygon points="0,-28 24,-14 24,14 0,28 -24,14 -24,-14" fill="#14532D" stroke="#22C55E" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Cape</text>
                  </g>

                  {/* Node 2: Center - GreenHive Core Hub */}
                  <g transform="translate(200, 120)">
                    <polygon points="0,-40 34,-20 34,20 0,40 -34,20 -34,-20" fill="#064E3B" stroke="#4ADE80" strokeWidth="3" />
                    <text x="0" y="-4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">HIVE</text>
                    <text x="0" y="10" textAnchor="middle" fill="#34D399" fontSize="9" fontWeight="bold">PRACTICE</text>
                  </g>

                  {/* Node 3: Top - Highveld Mining */}
                  <g transform="translate(200, 48)">
                    <polygon points="0,-24 20,-12 20,12 0,24 -20,12 -20,-12" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Highveld</text>
                  </g>

                  {/* Node 4: Right - Protea Lodges */}
                  <g transform="translate(320, 120)">
                    <polygon points="0,-28 24,-14 24,14 0,28 -24,14 -24,-14" fill="#14532D" stroke="#22C55E" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Protea</text>
                  </g>

                  {/* Node 5: Bottom - Apex FinTech */}
                  <g transform="translate(200, 192)">
                    <polygon points="0,-24 20,-12 20,12 0,24 -20,12 -20,-12" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Apex</text>
                  </g>
                </svg>
              </div>

              {/* Live Metric Cards Stacked */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>COIDA Return of Earnings</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-sm font-bold text-white">W.As.8 Submitted</div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">Letter of Good Standing Active</div>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>CCMA Disciplinary Warning</span>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-sm font-bold text-white">Written Warning Notice</div>
                  <div className="text-[11px] text-amber-300 mt-0.5">LRA Schedule 8 Verified</div>
                </div>
              </div>

              {/* Bottom Quick-Launch inside preview */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gemini AI Labour Engine Online</span>
                </div>
                <button
                  onClick={onLaunchDemo}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  Enter Practice Hub &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Stats Strip */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                1,400+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                Companies Managed
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tabular-nums">
                85,000+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                Employees Tracked
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                240,000+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                Compliance Tasks Filed
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tabular-nums">
                320,000+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                Consultant Hours Saved
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
