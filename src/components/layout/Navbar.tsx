import React from 'react';
import { Hexagon, ArrowRight, Layers, ShieldCheck, Building2, UserCheck, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentView: 'public' | 'dashboard' | 'ess';
  onNavigate: (view: 'public' | 'dashboard' | 'ess') => void;
  onOpenBookDemo: () => void;
  onOpenAiAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenBookDemo,
  onOpenAiAssistant
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (1 Primary Action) */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('public')}
              className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
            >
              <div className="relative w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
                <Hexagon className="w-5 h-5 text-emerald-100 fill-emerald-500/30" />
                <span className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white">G</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  GreenHive<span className="text-emerald-600 font-extrabold">HR</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          {currentView === 'public' ? (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <a href="#hraas-difference" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
                Why HRaaS
              </a>
              <a href="#features" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
                Managed HR Suite
              </a>
              <a href="#compliance" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
                SA Compliance
              </a>
              <a href="#how-it-works" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
                How We Support You
              </a>
              <a href="#pricing" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
                HRaaS Plans (ZAR)
              </a>
            </nav>
          ) : currentView === 'ess' ? (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                HRaaS Employee Experience Portal (ESS)
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>1-on-1 HR Specialist Care</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>BCEA Leave &amp; Dossier</span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                HRaaS Practice Hub: Platform + Dedicated SA Specialists
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>POPIA Certified</span>
            </div>
          )}

          {/* Zone 3: Primary Action / Mode Switch */}
          <div className="flex items-center gap-2.5 shrink-0">
            {currentView === 'public' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('ess')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  title="Open Dedicated Employee Self-Service Portal"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Employee Portal
                </button>
                <button
                  onClick={onOpenBookDemo}
                  className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
                >
                  Book Demo
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20 transition-all hover:shadow whitespace-nowrap shrink-0"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Launch Workspace
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            )}

            {currentView === 'dashboard' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('ess')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  title="Switch to standalone Employee Self-Service portal"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Employee Portal (ESS)
                </button>
                <button
                  onClick={() => onNavigate('public')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Public Website
                </button>
              </div>
            )}

            {currentView === 'ess' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Consultant Workspace
                </button>
                <button
                  onClick={() => onNavigate('public')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Website
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
