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

      {/* The GreenHive HRaaS Difference: Software + Human Expertise */}
      <section id="hraas-difference" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              Why HR as a Service (HRaaS) Beats Standalone Software
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
              We Don't Just Give You Tools &amp; Leave &mdash; We Deliver a Fully Supported HR Department
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Most HR vendors hand you a login, charge a monthly license, and leave you to figure out South African labour law, employee grievances, and talent diagnostics on your own. GreenHiveHR combines enterprise software with dedicated HR professionals who do the heavy lifting with you.
            </p>
          </div>

          {/* Side-by-Side Comparison: Traditional SaaS vs GreenHive HRaaS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Traditional Software-Only Vendors */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-1 rounded bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
                  Traditional HR Software (DIY SaaS)
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  "Here is your login. Good luck."
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  You get blank templates and dashboards, but the legal risk, administrative burden, and employee care fall entirely on your shoulders.
                </p>

                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                    <span><strong>Self-Managed Compliance Risk:</strong> You receive calendar alerts, but you still have to prepare and file COIDA ROE, EEA2/EEA4, and WSP/ATR reports yourself.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                    <span><strong>Unassisted Disciplinary Hearings:</strong> Software gives you a warning template, but nobody chairs the hearing or ensures LRA Schedule 8 procedural fairness.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                    <span><strong>Cold, Impersonal Employee Experience:</strong> Employees log leave in an app, but have no qualified HR confidant for grievances, wellness, or career growth.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                    <span><strong>Raw Data Without Professional Interpretation:</strong> You can run a review, but have no industrial psychologist or HR partner to calibrate 9-Box Talent Grids.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
                Result: Managers spend hours firefighting HR issues while employees feel unsupported.
              </div>
            </div>

            {/* Right: GreenHive HRaaS Full-Service Model */}
            <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-emerald-500 relative flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded bg-emerald-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
                    GreenHive HRaaS (Platform + Dedicated Professionals)
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    SABPP &amp; CCMA Accredited Practice
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-2">
                  The Tools, The Knowledge &amp; The Professionals &mdash; Fully Supported
                </h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  We pair our enterprise HR platform with an assigned team of South African HR &amp; Labour Relations specialists who actively run your HR function and care for every employee.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>1. Dedicated HR Partner Team</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Every client company is assigned a named Senior HR Practitioner &amp; Labour Advisor who knows your industry, organizational culture, and workforce by name.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>2. Best-in-Class Employee Care</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Through our standalone Employee Self-Service (ESS) portal, your staff can book confidential 1-on-1 video, phone, or in-person sessions directly with our HR specialists.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>3. Chaired Hearings &amp; Filings</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      We don't just generate warning letters &mdash; our practitioners draft charges, chair disciplinary inquiries, represent you at the CCMA, and submit your statutory returns.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>4. Expert-Facilitated Diagnostics</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Our specialists run 9-Box Talent Matrices, Skill-Will Grids, BCEA readiness audits, and psychometric diagnostics for each employee and save verified action plans to their dossier.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-emerald-300 font-medium">
                  Give your employees a human, empathetic, and legally sound HR experience from Day 1.
                </div>
                <button
                  onClick={onLaunchWorkspace}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0 shadow-md shadow-emerald-500/20"
                >
                  Experience the HRaaS Workspace
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* South African Compliance Section */}
      <ComplianceTimeline />

      {/* Honeycomb Features Bento & Industries */}
      <FeaturesHoneycomb />

      {/* How GreenHive HRaaS Works (4-Step Full-Service Lifecycle) */}
      <section id="how-it-works" className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950 border border-emerald-700 text-xs font-semibold text-emerald-400">
              Full-Lifecycle HRaaS Delivery
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How Our HR-as-a-Service Partnership Works
            </h2>
            <p className="text-slate-400 text-base">
              We combine onboarding technology with dedicated human specialists so you never feel left alone with software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Dedicated HR Partner Assignment',
                desc: 'We assign a SABPP-accredited Lead HR Partner and Labour Specialist to your business, audit your existing contracts, and configure your company vault.'
              },
              {
                step: '02',
                title: 'Guided Employee Onboarding & ESS',
                desc: 'Every employee receives access to the standalone Employee Self-Service Portal for BCEA leave, payslips, and direct 1-on-1 consultations with our HR team.'
              },
              {
                step: '03',
                title: 'Proactive Audits & Diagnostics',
                desc: 'Our specialists conduct 9-Box Talent Matrices, Skill-Will calibrations, and standardized behavioural & compliance diagnostics saved directly to personnel files.'
              },
              {
                step: '04',
                title: 'Ongoing Statutory & CCMA Care',
                desc: 'We manage your COIDA, UIF, and Employment Equity filings, chair disciplinary hearings, and provide continuous professional advisory.'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 relative flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
              >
                <div>
                  <span className="text-3xl font-extrabold font-mono text-emerald-400/90 block mb-4">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Managed by GreenHive Experts</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing in ZAR */}
      <PricingSection
        onSelectPlan={(plan) => {
          setDemoForm(prev => ({ ...prev, companyName: `${prev.companyName} (${plan} Tier)`.trim() }));
          setIsDemoModalOpen(true);
        }}
        onOpenBookDemo={() => setIsDemoModalOpen(true)}
      />

      {/* Final Conversion Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Give Your Employees the Best HR Experience Possible?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              We don't just give you tools and leave. Partner with GreenHiveHR for the knowledge, dedicated professionalism, and hands-on support your South African workforce deserves.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onLaunchWorkspace}
                className="px-6 py-3.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                Launch Live HRaaS Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-3.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all"
              >
                Speak with a Senior HR Partner
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
                South Africa's premier <strong>HR as a Service (HRaaS)</strong> partner. We combine enterprise HR &amp; compliance technology with dedicated SABPP-accredited professionals so your business and employees are fully supported.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>GreenHive HRaaS Practice &amp; Technologies (Pty) Ltd</p>
                <p>Registration No: 2021/489102/07</p>
                <p>Sandton City, Johannesburg &middot; Century City, Cape Town</p>
              </div>
            </div>

            {/* Platform links */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                HRaaS Model
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#hraas-difference" className="hover:text-emerald-400 transition-colors">Why HRaaS vs Software</a></li>
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Managed HR Suite</a></li>
                <li><a href="#compliance" className="hover:text-emerald-400 transition-colors">Done-For-You Compliance</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">4-Step HR Partnership</a></li>
                <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">HRaaS Retainers (ZAR)</a></li>
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
                Advisory Desk &amp; Connect
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span>advisory@greenhivehr.co.za</span>
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
