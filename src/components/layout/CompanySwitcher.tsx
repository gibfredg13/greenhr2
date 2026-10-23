import React, { useState } from 'react';
import { Company } from '../../types';
import { Building2, ChevronDown, Plus, Check, MapPin, ShieldCheck, X } from 'lucide-react';

interface CompanySwitcherProps {
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  onAddCompany: (company: Partial<Company>) => void;
}

export const CompanySwitcher: React.FC<CompanySwitcherProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  onAddCompany
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New client form state
  const [formData, setFormData] = useState({
    name: '',
    tradingName: '',
    registrationNumber: '',
    industry: 'Manufacturing',
    payeNumber: '',
    uifNumber: '',
    coidaNumber: '',
    sdlNumber: '',
    bbbeeLevel: 2,
    city: 'Johannesburg',
    province: 'Gauteng',
    contactEmail: '',
    contactPhone: '',
    monthlyRetainerZar: 15000,
    hourlyRateZar: 1250
  });

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCompany(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      tradingName: '',
      registrationNumber: '',
      industry: 'Manufacturing',
      payeNumber: '',
      uifNumber: '',
      coidaNumber: '',
      sdlNumber: '',
      bbbeeLevel: 2,
      city: 'Johannesburg',
      province: 'Gauteng',
      contactEmail: '',
      contactPhone: '',
      monthlyRetainerZar: 15000,
      hourlyRateZar: 1250
    });
  };

  return (
    <div className="relative">
      {/* Current Company Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-slate-700 transition-all text-white group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 font-bold text-xs">
            {selectedCompany ? selectedCompany.name.slice(0, 2).toUpperCase() : 'GH'}
          </div>
          <div className="truncate min-w-0">
            <div className="text-xs font-bold truncate text-slate-100 group-hover:text-emerald-400 transition-colors">
              {selectedCompany?.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
              <span>{selectedCompany?.industry}</span>
              <span>&middot;</span>
              <span className="text-emerald-400 font-mono font-semibold">{selectedCompany?.complianceScore}% Compliant</span>
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in duration-100">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              Client Entities ({companies.length})
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {companies.map((c) => {
                const isCurrent = c.id === selectedCompanyId;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCompany(c.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                      isCurrent ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="min-w-0 truncate">
                      <div className="text-xs font-semibold truncate text-slate-100">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span>{c.city}, {c.province}</span>
                        <span>&middot;</span>
                        <span className="font-mono text-slate-400">{c.employeeCount} staff</span>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Client Company
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add New Client Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  <Building2 className="w-4 h-4" />
                  <span>New Client Onboarding</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Register South African Client Company
                </h3>
                <p className="text-xs text-slate-500">
                  Creates an isolated tenant environment for employees, contracts, and statutory compliance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Registered Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ubuntu Industrial Technologies (Pty) Ltd"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CIPC Registration Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="2022/104928/07"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry Sector *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Logistics &amp; Warehousing</option>
                    <option>Mining &amp; Heavy Engineering</option>
                    <option>Hospitality &amp; Tourism</option>
                    <option>Agriculture &amp; Processing</option>
                    <option>Manufacturing</option>
                    <option>Financial Services &amp; FinTech</option>
                    <option>Construction &amp; Civils</option>
                    <option>Retail &amp; FMCG</option>
                    <option>Security &amp; Facilities</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SARS PAYE Number</label>
                  <input
                    type="text"
                    placeholder="7900184920"
                    value={formData.payeNumber}
                    onChange={(e) => setFormData({ ...formData, payeNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">COIDA Compensation Fund No</label>
                  <input
                    type="text"
                    placeholder="9900018492"
                    value={formData.coidaNumber}
                    onChange={(e) => setFormData({ ...formData, coidaNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="Cape Town"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Province</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Gauteng</option>
                    <option>Western Cape</option>
                    <option>KwaZulu-Natal</option>
                    <option>Eastern Cape</option>
                    <option>Limpopo</option>
                    <option>Mpumalanga</option>
                    <option>Free State</option>
                    <option>North West</option>
                    <option>Northern Cape</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly HR Retainer (ZAR)</label>
                  <input
                    type="number"
                    value={formData.monthlyRetainerZar}
                    onChange={(e) => setFormData({ ...formData, monthlyRetainerZar: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consulting Hourly Rate (ZAR)</label>
                  <input
                    type="number"
                    value={formData.hourlyRateZar}
                    onChange={(e) => setFormData({ ...formData, hourlyRateZar: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Create Client Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
