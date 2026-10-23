import React, { useState } from 'react';
import { Company, TimeEntry, Invoice } from '../../types';
import {
  Clock,
  Receipt,
  Plus,
  CheckCircle2,
  Download,
  Building2,
  FileText,
  DollarSign,
  ArrowRight,
  X
} from 'lucide-react';

interface BillingModuleProps {
  selectedCompany: Company;
  timeEntries: TimeEntry[];
  invoices: Invoice[];
  onAddTimeEntry: (entry: Partial<TimeEntry>) => void;
  onGenerateInvoice: (companyId: string) => void;
}

export const BillingModule: React.FC<BillingModuleProps> = ({
  selectedCompany,
  timeEntries,
  invoices,
  onAddTimeEntry,
  onGenerateInvoice
}) => {
  const [isLogTimeOpen, setIsLogTimeOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New time entry form state
  const [formData, setFormData] = useState({
    consultantName: 'Sarah Khanyile (Lead HR Practitioner)',
    date: new Date().toISOString().split('T')[0],
    hours: 2.0,
    rateZar: selectedCompany.hourlyRateZar || 1200,
    project: 'Statutory Compliance Audit',
    description: ''
  });

  const companyTime = timeEntries.filter(t => t.companyId === selectedCompany.id);
  const companyInvoices = invoices.filter(i => i.companyId === selectedCompany.id);

  const unbilledEntries = companyTime.filter(t => !t.isBilled);
  const unbilledHours = unbilledEntries.reduce((sum, t) => sum + t.hours, 0);
  const unbilledAmountZar = unbilledEntries.reduce((sum, t) => sum + (t.hours * t.rateZar), 0);

  const handleTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTimeEntry({
      ...formData,
      companyId: selectedCompany.id,
      hours: Number(formData.hours),
      rateZar: Number(formData.rateZar)
    });
    setIsLogTimeOpen(false);
    setFormData({
      consultantName: 'Sarah Khanyile (Lead HR Practitioner)',
      date: new Date().toISOString().split('T')[0],
      hours: 2.0,
      rateZar: selectedCompany.hourlyRateZar || 1200,
      project: 'Statutory Compliance Audit',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{selectedCompany.name}</span>
            <span>&middot;</span>
            <span className="font-mono text-emerald-700 font-bold">Billing Currency: ZAR (Rands)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Consultant Time Tracking &amp; Invoicing
          </h1>
          <p className="text-xs text-slate-600">
            Automated billing for monthly retainers, ad-hoc labour representations, CCMA arbitrations, and SARS-compliant 15% VAT tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onGenerateInvoice(selectedCompany.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all shadow-sm"
          >
            <Receipt className="w-4 h-4 text-emerald-600" />
            Generate Monthly Tax Invoice
          </button>

          <button
            onClick={() => setIsLogTimeOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Consulting Hours
          </button>
        </div>
      </div>

      {/* Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Monthly Practice Retainer</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            R {selectedCompany.monthlyRetainerZar.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Fixed monthly HR advisory fee</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Unbilled Ad-Hoc Hours</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {unbilledHours.toFixed(1)} hrs
          </div>
          <div className="text-[11px] text-slate-500">Rate: R {selectedCompany.hourlyRateZar}/hr</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Accrued Unbilled Amount</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            R {unbilledAmountZar.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">Ready for invoice generation</div>
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Consultant Activity Log — {selectedCompany.name}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {companyTime.length} logged entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Practitioner</th>
                <th className="py-3 px-4">Project / Scope</th>
                <th className="py-3 px-4">Task Description</th>
                <th className="py-3 px-4 text-right">Hours</th>
                <th className="py-3 px-4 text-right">Rate (ZAR)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companyTime.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No consulting hours logged for this client yet.
                  </td>
                </tr>
              ) : (
                companyTime.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {t.date}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {t.consultantName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">
                      {t.project}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm truncate">
                      {t.description}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {t.hours}h
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      R {t.rateZar}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.isBilled
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {t.isBilled ? 'Invoiced' : 'Unbilled'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generated Invoices Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              SARS-Compliant Tax Invoices
            </h3>
            <p className="text-xs text-slate-500">
              Generated invoices including 15% South African Value Added Tax
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700">
            {companyInvoices.length} Invoices
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {companyInvoices.map(inv => (
            <div
              key={inv.id}
              onClick={() => setSelectedInvoice(inv)}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {inv.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Date: <span className="font-mono text-slate-800">{inv.date}</span> &middot; Due: <span className="font-mono text-slate-800">{inv.dueDate}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {inv.items.length} line items (retainer + ad-hoc)
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Total (incl. 15% VAT)</div>
                  <div className="text-base font-bold font-mono text-slate-900">
                    R {inv.totalZar.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInvoice(inv);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-slate-200 rounded-lg shadow-sm"
                >
                  View Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Detail / Print Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  TAX INVOICE
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
                  {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Issued: {selectedInvoice.date} &middot; Payment Due: {selectedInvoice.dueDate}
                </p>
              </div>

              <div className="text-right text-xs text-slate-500">
                <div className="font-bold text-slate-900">GreenHive Technologies (Pty) Ltd</div>
                <div>VAT Reg: 4920194829</div>
                <div>Sandton, Johannesburg</div>
              </div>
            </div>

            {/* Billed To */}
            <div className="text-xs p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                Billed Client:
              </div>
              <div className="font-bold text-sm text-slate-900">{selectedInvoice.companyName}</div>
              <div className="text-slate-600 font-mono mt-0.5">Company ID: {selectedInvoice.companyId}</div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Hours</th>
                    <th className="py-2.5 px-3 text-right">Rate</th>
                    <th className="py-2.5 px-3 text-right">Amount (ZAR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-sans text-slate-900 font-medium">{item.description}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">{item.hours}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">R {item.rateZar.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">R {item.amountZar.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold">R {selectedInvoice.subtotalZar.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>South African VAT (15%):</span>
                  <span className="font-mono font-bold">R {selectedInvoice.vatZar.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                  <span>Total Amount Due:</span>
                  <span className="font-mono text-emerald-700">R {selectedInvoice.totalZar.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Banking Details Note */}
            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800">EFT Settlement Instructions:</div>
              <div>Bank: Standard Bank of South Africa &middot; Account No: 028491028 &middot; Branch: 051001</div>
              <div>Reference: {selectedInvoice.invoiceNumber}</div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Time Modal */}
      {isLogTimeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsLogTimeOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleTimeSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Log Billable Consulting Hours
                </h3>
                <p className="text-xs text-slate-500">
                  Record practitioner work for {selectedCompany.name}.
                </p>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HR Practitioner *</label>
                  <input
                    type="text"
                    required
                    value={formData.consultantName}
                    onChange={(e) => setFormData({ ...formData, consultantName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hours Spent *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="24"
                      required
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Project / Scope</label>
                    <input
                      type="text"
                      required
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hourly Rate (ZAR)</label>
                    <input
                      type="number"
                      required
                      value={formData.rateZar}
                      onChange={(e) => setFormData({ ...formData, rateZar: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Detailed Description of Work Done *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Conducted disciplinary investigation interview, reviewed CCTV footage, and drafted notice of inquiry..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLogTimeOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all"
                >
                  Save Time Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
