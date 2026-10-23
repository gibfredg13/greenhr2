import React, { useState } from 'react';
import { Hero } from './Hero';
import { ComplianceTimeline } from './ComplianceTimeline';
import { FeaturesHoneycomb } from './FeaturesHoneycomb';
import { PricingSection } from './PricingSection';
import {
  Hexagon,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  X,
  Play,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface PublicWebsiteProps {
  onLaunchWorkspace: () => void;
  onOpenAiAssistant: () => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  onLaunchWorkspace,
  onOpenAiAssistant
}) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Demo booking form state
  const [demoForm, setDemoForm] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    clientCount: '1-5 Companies',
    phone: ''
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setIsDemoModalOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Hero Section */}
      <Hero
        onLaunchDemo={onLaunchWorkspace}
        onOpenBookDemo={() => setIsDemoModalOpen(true)}
        onOpenTour={() => setIsTourModalOpen(true)}
      />

      {/* South African Compliance Section */}
      <ComplianceTimeline />

      {/* Honeycomb Features Bento & Industries */}
      <FeaturesHoneycomb />

      {/* Pricing in ZAR */}
      <PricingSection
        onSelectPlan={(plan) => {
          setIsDemoModalOpen(true);
        }}
        onOpenBookDemo={() => setIsDemoModalOpen(true)}
      />

      {/* Final Conversion Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your South African HR Practice?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Join forward-thinking labour practitioners, HR consultancies, and growing businesses managing compliance from a single intelligent workspace.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onLaunchWorkspace}
                className="px-6 py-3.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                Launch Live HR Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-3.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all"
              >
                Schedule Guided Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
            {/* Brand column */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Hexagon className="w-4 h-4 text-emerald-100 fill-emerald-500/30" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  GreenHive<span className="text-emerald-500">HR</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Where People, Compliance &amp; Growth Work Together. South Africa's premier multi-tenant practice management, labour relations, and statutory compliance SaaS platform.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>GreenHive Technologies (Pty) Ltd</p>
                <p>Registration No: 2021/489102/07</p>
                <p>Sandton City, Johannesburg &middot; Century City, Cape Town</p>
              </div>
            </div>

            {/* Platform links */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Employee Hub</a></li>
                <li><a href="#compliance" className="hover:text-emerald-400 transition-colors">SA Compliance Calendar</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">CCMA Disciplinary Kit</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Time &amp; Billing</a></li>
                <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing in ZAR</a></li>
              </ul>
            </div>

            {/* Compliance & Legislation */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                SA Labour Statutes
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#compliance" className="hover:text-emerald-400 transition-colors">Basic Conditions of Employment (BCEA)</a></li>
                <li><a href="#compliance" className="hover:text-emerald-400 transition-colors">Labour Relations Act (LRA) Schedule 8</a></li>
                <li><a href="#compliance" className="hover:text-emerald-400 transition-colors">Compensation Fund (COIDA) W.As.8</a></li>
                <li><a href="#compliance" className="hover:text-emerald-400 transition-colors">Employment Equity (EEA2 &amp; EEA4)</a></li>
                <li><a href="#compliance" className="hover:text-emerald-400 transition-colors">POPIA Act 4 of 2013 Compliance</a></li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Contact &amp; Connect
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span>support@greenhivehr.co.za</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>+27 (0)10 880 4920</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Johannesburg &middot; Cape Town &middot; Durban</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
                <span aria-hidden="true" className="text-slate-700">&middot;</span>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <span aria-hidden="true" className="text-slate-700">&middot;</span>
                <button
                  onClick={onOpenAiAssistant}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Hive AI Legal Assistant
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & POPIA Assurance */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} GreenHiveHR. All rights reserved. Registered in the Republic of South Africa.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Notice</span>
              <span>&middot;</span>
              <span className="hover:text-slate-400 cursor-pointer">POPIA Data Manual (PAIA)</span>
              <span>&middot;</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Book Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Demo Request Confirmed!
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  A GreenHive practice specialist will contact you to demonstrate multi-tenant workflows and South African compliance automation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    Book a Platform Demo
                  </h3>
                  <p className="text-xs text-slate-500">
                    See how GreenHiveHR simplifies multi-company labour management.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Khanyile"
                      value={demoForm.fullName}
                      onChange={(e) => setDemoForm({ ...demoForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@khanyile-hr.co.za"
                      value={demoForm.workEmail}
                      onChange={(e) => setDemoForm({ ...demoForm, workEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Company or Practice Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Khanyile &amp; Associates HR"
                      value={demoForm.companyName}
                      onChange={(e) => setDemoForm({ ...demoForm, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Client Entities
                      </label>
                      <select
                        value={demoForm.clientCount}
                        onChange={(e) => setDemoForm({ ...demoForm, clientCount: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option>1-5 Companies</option>
                        <option>6-20 Companies</option>
                        <option>20+ Companies</option>
                        <option>Single Business</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+27 82 000 0000"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20"
                  >
                    Confirm Demo Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Platform Tour Modal */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative">
            <button
              onClick={() => setIsTourModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    GreenHiveHR Platform Interactive Overview
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-level architectural tour of key modules
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Multi-Tenant Company Switcher</h4>
                    <p className="text-slate-300 mt-0.5">
                      Effortlessly navigate between diverse clients (Cape Logistics, Highveld Engineering, Protea Lodges) with 100% data partition.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white">South African Statutory Engine</h4>
                    <p className="text-slate-300 mt-0.5">
                      Automated calculations for COIDA ROE, Employment Equity thresholds, monthly UIF EMP201, and B-BBEE scorecard tasks.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white">CCMA Disciplinary Toolkit &amp; AI Hive Assistant</h4>
                    <p className="text-slate-300 mt-0.5">
                      Generate legally airtight written warnings, notice of hearings, and standard contracts using server-side Gemini 3.8.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsTourModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsTourModalOpen(false);
                    onLaunchWorkspace();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5"
                >
                  Launch Workspace Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
