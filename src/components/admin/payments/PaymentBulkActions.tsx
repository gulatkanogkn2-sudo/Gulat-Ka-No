import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Download,
  X,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface PaymentBulkActionsProps {
  selectedCount: number;
  totalSelectedVolume: number;
  onBulkVerify: () => void;
  onBulkReject: () => void;
  onBulkExport: () => void;
  onClearSelection: () => void;
}

export const PaymentBulkActions: React.FC<PaymentBulkActionsProps> = ({
  selectedCount,
  totalSelectedVolume,
  onBulkVerify,
  onBulkReject,
  onBulkExport,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-4 animate-slideUp">
      <div className="bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,217,255,0.25)] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Left: Selected Counter & Volume */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-sm font-bold">
            {selectedCount}
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white">
              {selectedCount} Payment Proof{selectedCount === 1 ? '' : 's'} Selected
            </div>
            <div className="text-[11px] font-mono text-cyan-400">
              Total Volume: ${totalSelectedVolume.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onBulkVerify}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Bulk Verify</span>
          </button>

          <button
            onClick={onBulkReject}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-950/90 hover:bg-rose-900 border border-rose-500/50 text-rose-300 rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(244,63,94,0.2)]"
          >
            <XCircle className="h-4 w-4 text-rose-400" />
            <span>Bulk Reject</span>
          </button>

          <button
            onClick={onBulkExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono font-bold transition-all"
          >
            <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <div className="w-px h-6 bg-slate-800 mx-1" />

          <button
            onClick={onClearSelection}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Clear Selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
