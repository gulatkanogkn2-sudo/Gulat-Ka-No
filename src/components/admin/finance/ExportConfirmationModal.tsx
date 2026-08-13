import React from 'react';
import { FinanceFilterOptions } from '../../../types/finance';
import { Download, X, FileSpreadsheet, CheckCircle2, Filter } from 'lucide-react';

interface ExportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  exportMode: 'filtered' | 'all';
  activeTab: string;
  matchingCount: number;
  filters: FinanceFilterOptions;
  filename: string;
}

export const ExportConfirmationModal: React.FC<ExportConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  exportMode,
  activeTab,
  matchingCount,
  filters,
  filename,
}) => {
  if (!isOpen) return null;

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Executive Overview Summary';
      case 'batches':
        return 'GroupBuy Batch Profitability';
      case 'monthly':
        return 'Monthly Financial Performance';
      case 'expenses':
        return 'Recorded Business Expenses';
      case 'ledger':
        return 'Financial Ledger Transactions';
      default:
        return 'Finance Report';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0A0F1D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {exportMode === 'filtered' ? 'Export Filtered Data' : 'Export All Data'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {getTabLabel(activeTab)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 font-mono text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Export Scope:</span>
              <span className="font-bold text-[#00D9FF] uppercase">
                {exportMode === 'filtered' ? 'Active Filter Scope' : 'Full Dataset (Unfiltered)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Matching Records:</span>
              <span className="font-bold text-white px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {matchingCount} Records
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Format:</span>
              <span className="font-bold text-slate-200">CSV (.csv)</span>
            </div>
          </div>

          {/* Active Filter Summary if Filtered Mode */}
          {exportMode === 'filtered' && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <Filter className="w-3.5 h-3.5 text-[#00D9FF]" />
                Applied Filters Summary
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5 space-y-1 text-[11px] text-slate-400">
                <div>• Date Range: <strong className="text-white">{filters.dateRange.replace('_', ' ').toUpperCase()}</strong></div>
                <div>• Store Channel: <strong className="text-white">{filters.storeType.toUpperCase()}</strong></div>
                <div>• Batch: <strong className="text-white">{filters.batchNumber}</strong></div>
                <div>• Transaction Type: <strong className="text-white">{filters.transactionType}</strong></div>
                {filters.expenseCategory !== 'all' && (
                  <div>• Category: <strong className="text-white">{filters.expenseCategory}</strong></div>
                )}
                {filters.search && (
                  <div>• Search Query: <strong className="text-[#00D9FF]">"{filters.search}"</strong></div>
                )}
              </div>
            </div>
          )}

          {/* File Output Name */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 uppercase">Generated File Name</div>
            <div className="p-2.5 rounded-xl bg-black border border-white/10 text-slate-300 text-[11px] font-mono break-all text-ellipsis">
              {filename}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-[#0A0F1D] border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-10 px-5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,217,255,0.3)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};
