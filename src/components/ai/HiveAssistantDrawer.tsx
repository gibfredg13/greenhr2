import React, { useState } from 'react';
import { Company, Employee } from '../../types';
import { api } from '../../services/api';
import {
  Sparkles,
  X,
  Send,
  Copy,
  Check,
  Scale,
  FileText,
  ShieldAlert,
  HelpCircle,
  Loader2,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface HiveAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompany: Company;
  employees: Employee[];
  initialPrompt?: string;
  initialMode?: 'legal_advice' | 'draft_warning' | 'generate_contract' | 'policy_audit';
}

export const HiveAssistantDrawer: React.FC<HiveAssistantDrawerProps> = ({
  isOpen,
  onClose,
  selectedCompany,
  employees,
  initialPrompt = '',
  initialMode = 'legal_advice'
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [mode, setMode] = useState<'legal_advice' | 'draft_warning' | 'generate_contract' | 'policy_audit'>(initialMode);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const companyEmployees = employees.filter(e => e.companyId === selectedCompany.id);

  const quickPrompts = [
    {
      title: 'Written Warning (Insubordination)',
      text: 'Draft a CCMA-compliant Written Warning for repeated refusal to carry out lawful and reasonable instructions.',
      mode: 'draft_warning' as const
    },
    {
      title: 'BCEA Contract (Sec 29)',
      text: 'Draft a standard South African permanent employment contract with 3-month probation and 45h work week.',
      mode: 'generate_contract' as const
    },
    {
      title: 'Severance Pay Rules',
      text: 'What are the legal severance pay requirements under BCEA Section 41 during retrenchment?',
      mode: 'legal_advice' as const
    },
    {
      title: 'POPIA Employee Audit',
      text: 'Audit client employee records against POPIA Act 4 of 2013 data protection standards.',
      mode: 'policy_audit' as const
    }
  ];

  const handleAsk = async (queryText?: string, queryMode?: any) => {
    const textToQuery = queryText || prompt;
    const modeToUse = queryMode || mode;
    if (!textToQuery.trim()) return;

    setIsLoading(true);
    setResponseOutput(null);

    try {
      const res = await api.askHiveAssistant({
        prompt: textToQuery,
        mode: modeToUse,
        companyId: selectedCompany.id,
        employeeId: selectedEmpId || undefined
      });
      setResponseOutput(res.text);
    } catch (err: any) {
      setResponseOutput(`Unable to reach Gemini Assistant: ${err.message}. Please check connection.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(responseOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight">Hive AI Labour Assistant</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Context: {selectedCompany.name} ({selectedCompany.industry})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {[
              { id: 'legal_advice', label: 'Labour Law Advice', icon: Scale },
              { id: 'draft_warning', label: 'Warning Notice', icon: ShieldAlert },
              { id: 'generate_contract', label: 'BCEA Contract', icon: FileText },
              { id: 'policy_audit', label: 'POPIA / Policy Audit', icon: BookOpen }
            ].map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    mode === m.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Context Employee Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium whitespace-nowrap">Subject Personnel:</span>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">General Company Scope (No individual selected)</option>
              {companyEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.jobTitle})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Prompt Cards */}
        <div className="p-4 border-b border-slate-200 bg-emerald-50/40">
          <div className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider mb-2">
            South African Legal Templates
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map(qp => (
              <button
                key={qp.title}
                onClick={() => {
                  setPrompt(qp.text);
                  setMode(qp.mode);
                  handleAsk(qp.text, qp.mode);
                }}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-left transition-all text-xs space-y-1 shadow-2xs group"
              >
                <div className="font-bold text-slate-900 group-hover:text-emerald-700 flex items-center justify-between">
                  <span>{qp.title}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{qp.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Response Body Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-500 text-xs">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="font-semibold text-slate-700">Grounded in BCEA, LRA &amp; CCMA codes...</p>
              <p className="text-[11px] text-slate-400">Drafting legally compliant documentation</p>
            </div>
          ) : responseOutput ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Generated Output
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-800 max-h-[420px] overflow-y-auto">
                {responseOutput}
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 border border-slate-200">
                <strong>South African Labour Law Note: </strong>
                AI-drafted warnings and notices must be reviewed and signed by an authorized manager or registered labour relations practitioner before service to the employee.
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center space-y-2 text-center text-slate-400 text-xs p-6">
              <Scale className="w-10 h-10 text-slate-300 mb-1" />
              <p className="font-semibold text-slate-700">Enter a prompt or select a legal template</p>
              <p className="text-slate-500 max-w-xs">
                Ask any question regarding the Basic Conditions of Employment Act, LRA procedural fairness, or auto-generate contracts.
              </p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="e.g. Draft Notice of Disciplinary Inquiry for late coming..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
