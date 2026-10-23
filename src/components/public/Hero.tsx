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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              HRaaS &mdash; True Human Resources as a Service for South Africa
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]" style={{ textWrap: 'balance' }}>
              We Don't Just Hand You HR Tools &amp; Leave. <span className="text-emerald-600">We Walk With You.</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              GreenHiveHR is a complete <strong>HR as a Service (HRaaS)</strong> partner. Alongside our South African HR &amp; compliance platform, we embed certified labour specialists, hands-on legal knowledge, and dedicated employee support so your workforce receives the best HR experience possible.
            </p>

            {/* Key HRaaS Promise Strip */}
            <div className="bg-white/90 border border-emerald-200 rounded-xl p-4 shadow-xs space-y-2 max-w-xl">
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                The GreenHive HRaaS Guarantee
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Software alone doesn't chair a CCMA hearing, counsel a distressed employee, or interpret sectoral determinations. We pair enterprise tools with <strong>dedicated SABPP-accredited HR professionals</strong> who actively manage your compliance and care for your people.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onLaunchDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
              >
                Explore Live HRaaS Workspace
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBookDemo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all hover:border-slate-400"
              >
                Speak to an HR Partner
              </button>

              <button
                onClick={onOpenTour}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-emerald-700 text-emerald-700 ml-0.5" />
                </div>
                How HRaaS Works
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-5 border-t border-slate-200/80">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Full-Service HR Delivery + South African Statutory Protection
              </p>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Dedicated HR Practitioners
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  Hands-On CCMA &amp; LRA Advisory
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  1-on-1 Employee Care Desk
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  Managed COIDA, UIF &amp; EE Filings
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive HRaaS Service + Platform Matrix Visualization */}
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
                    GreenHive HRaaS Managed Practice Hub
                  </span>
                </div>
                <span className="text-xs text-emerald-300 bg-emerald-950/90 border border-emerald-700/60 px-2.5 py-0.5 rounded font-mono">
                  Human Experts + Platform
                </span>
              </div>

              {/* Central Hexagonal Network Graphic */}
              <div className="my-5 relative flex flex-col items-center justify-center py-2">
                {/* SVG Interconnected Hexagon Grid */}
                <svg viewBox="0 0 400 240" className="w-full h-auto max-h-[210px]">
                  {/* Grid Lines */}
                  <line x1="80" y1="120" x2="200" y2="60" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="200" y1="60" x2="320" y2="120" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="80" y1="120" x2="200" y2="180" stroke="#16A34A" strokeWidth="1.5" opacity="0.7" />
                  <line x1="200" y1="180" x2="320" y2="120" stroke="#16A34A" strokeWidth="1.5" opacity="0.7" />
                  <line x1="200" y1="60" x2="200" y2="180" stroke="#22C55E" strokeWidth="2" />

                  {/* Node 1: Left - Dedicated HR Specialists */}
                  <g transform="translate(80, 120)">
                    <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="#14532D" stroke="#22C55E" strokeWidth="2" />
                    <text x="0" y="-2" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">HR Experts</text>
                    <text x="0" y="9" textAnchor="middle" fill="#86EFAC" fontSize="7.5">SABPP Team</text>
                  </g>

                  {/* Node 2: Center - GreenHive HRaaS Core */}
                  <g transform="translate(200, 120)">
                    <polygon points="0,-42 36,-21 36,21 0,42 -36,21 -36,-21" fill="#064E3B" stroke="#4ADE80" strokeWidth="3" />
                    <text x="0" y="-5" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">HRaaS</text>
                    <text x="0" y="9" textAnchor="middle" fill="#34D399" fontSize="8.5" fontWeight="bold">FULL SUPPORT</text>
                  </g>

                  {/* Node 3: Top - Statutory & CCMA Care */}
                  <g transform="translate(200, 46)">
                    <polygon points="0,-25 22,-13 22,13 0,25 -22,13 -22,-13" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.5" />
                    <text x="0" y="-1" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold">CCMA &amp; Law</text>
                    <text x="0" y="9" textAnchor="middle" fill="#FDE68A" fontSize="7">Chaired Live</text>
                  </g>

                  {/* Node 4: Right - Employee Experience */}
                  <g transform="translate(320, 120)">
                    <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="#14532D" stroke="#22C55E" strokeWidth="2" />
                    <text x="0" y="-2" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Employees</text>
                    <text x="0" y="9" textAnchor="middle" fill="#86EFAC" fontSize="7.5">1-on-1 Care</text>
                  </g>

                  {/* Node 5: Bottom - Diagnostics & Audits */}
                  <g transform="translate(200, 194)">
                    <polygon points="0,-25 22,-13 22,13 0,25 -22,13 -22,-13" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                    <text x="0" y="-1" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold">9-Box &amp; Tests</text>
                    <text x="0" y="9" textAnchor="middle" fill="#BAE6FD" fontSize="7">Guided Audits</text>
                  </g>
                </svg>
              </div>

              {/* Live Managed Service Cards Stacked */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Assigned Lead HR Partner</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-sm font-bold text-white">Nomsa Dlamini (SABPP)</div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">Active 1-on-1 Employee Care &amp; Advisory</div>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Managed Statutory &amp; CCMA</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-sm font-bold text-white">Done-For-You Compliance</div>
                  <div className="text-[11px] text-amber-300 mt-0.5">Hearings Chaired &amp; ROE/EE Submitted</div>
                </div>
              </div>

              {/* Bottom Quick-Launch inside preview */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Backed by Senior SA Labour Practitioners</span>
                </div>
                <button
                  onClick={onLaunchDemo}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  Enter HRaaS Hub &rarr;
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
                South African Businesses Supported
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tabular-nums">
                85,000+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                Employees Cared For 1-on-1
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                99.4%
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                CCMA Procedural Fairness Rate
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tabular-nums">
                100%
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
                Human-Guided HR &amp; Compliance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
