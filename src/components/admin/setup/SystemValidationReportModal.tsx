import React from 'react';
import { ReadinessReport } from '../../../types/initialSetup';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Sparkles, X, Download } from 'lucide-react';

export interface SystemValidationReportModalProps {
  report: ReadinessReport;
  isOpen: boolean;
  onClose: () => void;
}

export const SystemValidationReportModal: React.FC<SystemValidationReportModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: 'pass' | 'warning' | 'error') => {
    if (status === 'pass') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
          PASSED
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
          WARNING
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
        ERROR
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card bg-[#0A0F1D] border border-white/10 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/20 border border-[#00D9FF]/50 flex items-center justify-center text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.3)]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                System Infrastructure Validation Report
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Generated: {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Readiness Score Badge & Banner */}
        <div className="p-5 rounded-xl border border-white/10 bg-gradient-to-r from-[#050810] via-white/5 to-[#050810] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Overall System Readiness Score
            </span>
            <p className="text-xs text-slate-300 max-w-md">{report.summaryText}</p>
          </div>

          <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-slate-900 border border-[#00D9FF]/40 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
            <span className="text-2xl font-bold font-mono text-[#00D9FF]">
              {report.scorePercentage}%
            </span>
            <span className="text-[9px] font-mono uppercase text-slate-400">READY</span>
          </div>
        </div>

        {/* Metrics Counter Pill Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-xs font-bold text-emerald-400 font-mono block">
              {report.passedCount} Passed
            </span>
            <span className="text-[10px] text-slate-400">Verified Checks</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
            <span className="text-xs font-bold text-amber-400 font-mono block">
              {report.warningCount} Warnings
            </span>
            <span className="text-[10px] text-slate-400">Non-blocking</span>
          </div>

          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
            <span className="text-xs font-bold text-red-400 font-mono block">
              {report.errorCount} Errors
            </span>
            <span className="text-[10px] text-slate-400">Action Required</span>
          </div>
        </div>

        {/* Check Details List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            Detailed Diagnostic Audit Checks ({report.totalChecks})
          </h4>

          <div className="space-y-2">
            {report.checks.map((chk) => (
              <div
                key={chk.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white font-mono">{chk.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                      {chk.category}
                    </span>
                  </div>
                  {getStatusBadge(chk.status)}
                </div>

                <p className="text-[11px] text-slate-300">{chk.message}</p>

                {chk.recommendation && (
                  <p className="text-[10px] text-amber-400 font-mono bg-amber-500/10 p-2 rounded border border-amber-500/20">
                    💡 Recommendation: {chk.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00D9FF] text-black font-bold text-xs hover:brightness-110 cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
