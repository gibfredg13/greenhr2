import React, { useState } from 'react';
import { Company, Employee, EmployeeDocument } from '../../types';
import {
  FolderLock,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  Calendar,
  Lock,
  X
} from 'lucide-react';

interface DocumentVaultModuleProps {
  selectedCompany: Company;
  employees: Employee[];
  documents: EmployeeDocument[];
  onUploadDocument: (doc: Partial<EmployeeDocument>) => void;
}

export const DocumentVaultModule: React.FC<DocumentVaultModuleProps> = ({
  selectedCompany,
  employees,
  documents,
  onUploadDocument
}) => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    category: 'Contract',
    title: '',
    fileSize: '1.2 MB',
    expiryDate: ''
  });

  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);
  const companyDocs = documents.filter(d => d.companyId === selectedCompany.id);

  const filteredDocs = companyDocs.filter(d => {
    if (categoryFilter === 'All') return true;
    return d.category === categoryFilter;
  });

  const categories = ['All', 'Contract', 'ID/Passport', 'POPIA Consent', 'Medical', 'Disciplinary', 'Performance', 'Tax/IRP5'];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = companyEmployees.find(em => em.id === formData.employeeId);
    if (!emp) return;

    onUploadDocument({
      companyId: selectedCompany.id,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      category: formData.category as any,
      title: formData.title,
      fileSize: formData.fileSize,
      expiryDate: formData.expiryDate || undefined,
      status: formData.expiryDate ? 'Valid' : 'Valid'
    });

    setIsUploadOpen(false);
    setFormData({
      employeeId: '',
      category: 'Contract',
      title: '',
      fileSize: '1.2 MB',
      expiryDate: ''
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
            <span className="font-mono text-emerald-700 font-bold">POPIA Section 19 Secure Storage</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Encrypted Document Vault &amp; Personnel Records
          </h1>
          <p className="text-xs text-slate-600">
            Secure audit vault storing employment contracts, ID copies, disciplinary records, and medical fitness certificates with automated expiry warnings.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Deposit Document
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              categoryFilter === c
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-3 p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400">
            <FolderLock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">No documents found in this category</p>
            <p className="text-xs text-slate-500 mt-1">Deposit files to complete employee personnel records.</p>
          </div>
        ) : (
          filteredDocs.map(doc => {
            const isExpiring = doc.status === 'Expiring Soon';
            return (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                      {doc.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isExpiring
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {doc.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Personnel: <span className="text-slate-800 font-semibold">{doc.employeeName}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span className="font-mono text-slate-700">{doc.uploadedAt}</span>
                    </div>
                    {doc.expiryDate && (
                      <div className="flex justify-between">
                        <span className={isExpiring ? 'text-amber-700 font-bold' : ''}>Expiry Date:</span>
                        <span className={`font-mono ${isExpiring ? 'text-amber-800 font-bold' : 'text-slate-700'}`}>
                          {doc.expiryDate}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span className="font-mono text-slate-700">{doc.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>256-Bit Encrypted</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading verified copy of ${doc.title}`)}
                    className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Deposit Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Deposit Employee Document
                </h3>
                <p className="text-xs text-slate-500">
                  Secure upload for {selectedCompany.name}.
                </p>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee *</label>
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select personnel record...</option>
                    {companyEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.jobTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Document Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Contract</option>
                      <option>ID/Passport</option>
                      <option>POPIA Consent</option>
                      <option>Medical</option>
                      <option>Disciplinary</option>
                      <option>Performance</option>
                      <option>Tax/IRP5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Expiry Date (If applicable)</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Document Title / File Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Certified Copy of Smart ID or Signed BCEA Agreement"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Deposit to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
