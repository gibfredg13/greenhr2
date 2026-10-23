import React, { useState } from 'react';
import { Company, ComplianceEvent, StatuteCategory } from '../../types';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Plus,
  Send,
  MessageSquare,
  Mail,
  Bell,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';

interface ComplianceModuleProps {
  selectedCompany: Company;
  complianceEvents: ComplianceEvent[];
  onToggleStatus: (id: string) => void;
  onAddEvent: (ev: Partial<ComplianceEvent>) => void;
}

export const ComplianceModule: React.FC<ComplianceModuleProps> = ({
  selectedCompany,
  complianceEvents,
  onToggleStatus,
  onAddEvent
}) => {
  const [selectedStatute, setSelectedStatute] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // New compliance obligation form state
  const [formData, setFormData] = useState<Partial<ComplianceEvent>>({
    statute: 'COIDA',
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    frequency: 'Annual',
    status: 'Action Required',
    penaltyRisk: 'Statutory non-compliance penalty under South African law.',
    responsiblePerson: 'Lead HR Consultant'
  });

  const companyEvents = complianceEvents.filter(e => e.companyId === selectedCompany.id);

  const filteredEvents = companyEvents.filter(e => {
    if (selectedStatute === 'All') return true;
    return e.statute === selectedStatute;
  });

  const statutes: ('All' | StatuteCategory)[] = [
    'All',
    'COIDA',
    'UIF',
    'Employment Equity',
    'Skills Development',
    'POPIA',
    'BCEA',
    'B-BBEE'
  ];

  const handleSendReminder = (eventTitle: string, method: 'WhatsApp' | 'Email') => {
    setReminderToast(`Dispatched ${method} statutory notice to ${selectedCompany.contactEmail} for ${eventTitle}`);
    setTimeout(() => {
      setReminderToast(null);
    }, 3500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent({
      ...formData,
      companyId: selectedCompany.id
    });
    setIsAddModalOpen(false);
    setFormData({
      statute: 'COIDA',
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      frequency: 'Annual',
      status: 'Action Required',
      penaltyRisk: 'Statutory non-compliance penalty under South African law.',
      responsiblePerson: 'Lead HR Consultant'
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {reminderToast && (
        <div className="p-3 bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-lg border border-emerald-500/50 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{reminderToast}</span>
          </div>
          <button onClick={() => setReminderToast(null)} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{selectedCompany.name}</span>
            <span>&middot;</span>
            <span className="text-emerald-700 font-bold">{selectedCompany.complianceScore}% Regulatory Score</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            South African Statutory Compliance Engine
          </h1>
          <p className="text-xs text-slate-600">
            Automates deadlines for COIDA W.As.8, UIF EMP201, Employment Equity EEA2/4, Skills Development WSP/ATR, and POPIA Act 4.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Compliance Task
        </button>
      </div>

      {/* Statute Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statutes.map(s => (
          <button
            key={s}
            onClick={() => setSelectedStatute(s)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              selectedStatute === s
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Compliance Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map(ev => {
          const isCompliant = ev.status === 'Compliant';
          return (
            <div
              key={ev.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isCompliant
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-amber-50/50 border-amber-300 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white font-mono uppercase tracking-wider">
                    {ev.statute}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Due: {ev.dueDate}
                    </span>
                    <button
                      onClick={() => onToggleStatus(ev.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                        isCompliant
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {isCompliant ? 'Compliant' : 'Mark Compliant'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ev.description}</p>
                </div>

                <div className="p-3 bg-slate-100/80 rounded-xl text-[11px] text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Statutory Penalty Risk:</span>
                  </div>
                  <p className="text-slate-600">{ev.penaltyRisk}</p>
                </div>
              </div>

              {/* Action Buttons: WhatsApp / Email Automated Reminder Simulation */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium text-[11px]">
                  Assigned: <strong>{ev.responsiblePerson}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendReminder(ev.title, 'WhatsApp')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200 transition-colors"
                    title="Send automated WhatsApp alert to client HR coordinator"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-600" />
                    WhatsApp
                  </button>

                  <button
                    onClick={() => handleSendReminder(ev.title, 'Email')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                    title="Send statutory alert email"
                  >
                    <Mail className="w-3 h-3 text-slate-500" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Compliance Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  New Statutory Compliance Requirement
                </h3>
                <p className="text-xs text-slate-500">
                  Track a statutory deadline for {selectedCompany.name}.
                </p>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Statute *</label>
                    <select
                      value={formData.statute}
                      onChange={(e) => setFormData({ ...formData, statute: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>COIDA</option>
                      <option>UIF</option>
                      <option>Employment Equity</option>
                      <option>Skills Development</option>
                      <option>POPIA</option>
                      <option>BCEA</option>
                      <option>B-BBEE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Filing / Task Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Return of Earnings Submission"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description &amp; Action Required</label>
                  <textarea
                    rows={2}
                    placeholder="Submit electronic declaration via relevant statutory portal..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penalty Risk for Non-Compliance</label>
                  <input
                    type="text"
                    placeholder="e.g. 10% penalty on assessment plus loss of Good Standing"
                    value={formData.penaltyRisk}
                    onChange={(e) => setFormData({ ...formData, penaltyRisk: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Responsible Practitioner</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Khanyile (Lead Consultant)"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Schedule Obligation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
