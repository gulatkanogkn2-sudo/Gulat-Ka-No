import React, { useState } from 'react';
import {
  CheckSquare,
  FileSpreadsheet,
  Printer,
  Tag,
  RefreshCw,
  X,
  ChevronDown,
} from 'lucide-react';
import { OrderStatus } from '../../../types/order';

interface OrderBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatusUpdate: (status: OrderStatus) => void;
  onBulkAssignBatch: (batchNumber: string) => void;
  onBulkExport: (format: 'csv' | 'excel' | 'sheets') => void;
  onBulkPrint: (type: 'packing_slip' | 'invoice') => void;
}

export const OrderBulkActions: React.FC<OrderBulkActionsProps> = ({
  selectedCount,
  onClearSelection,
  onBulkStatusUpdate,
  onBulkAssignBatch,
  onBulkExport,
  onBulkPrint,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchInput, setBatchInput] = useState('');

  if (selectedCount === 0) return null;

  const statuses: OrderStatus[] = [
    'PAYMENT_VERIFICATION',
    'CONFIRMED',
    'PROCESSING',
    'PACKING',
    'READY_TO_SHIP',
    'SHIPPED',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
  ];

  const handleApplyBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchInput.trim()) {
      onBulkAssignBatch(batchInput.trim());
      setShowBatchModal(false);
      setBatchInput('');
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border border-cyan-500/50 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 text-xs">
        {/* Selection Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/80 border border-cyan-500/40 rounded-lg text-cyan-300 font-mono font-bold">
          <CheckSquare className="h-4 w-4 text-cyan-400" />
          <span>{selectedCount} Selected</span>
        </div>

        {/* Bulk Status Update Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusMenu(!showStatusMenu);
              setShowExportMenu(false);
              setShowPrintMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 rounded-lg transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
            <span>Update Status</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showStatusMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 max-h-56 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase border-b border-slate-800">
                Set Status For All Selected
              </div>
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    onBulkStatusUpdate(st);
                    setShowStatusMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 font-mono text-[11px] border-b border-slate-800/50 last:border-0"
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Assign Batch */}
        <button
          onClick={() => {
            setShowBatchModal(true);
            setShowStatusMenu(false);
            setShowExportMenu(false);
            setShowPrintMenu(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 rounded-lg transition-all"
        >
          <Tag className="h-3.5 w-3.5 text-cyan-400" />
          <span>Assign Batch</span>
        </button>

        {/* Bulk Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowExportMenu(!showExportMenu);
              setShowStatusMenu(false);
              setShowPrintMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 rounded-lg transition-all"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export ({selectedCount})</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showExportMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase border-b border-slate-800">
                Choose Format
              </div>
              <button
                onClick={() => {
                  onBulkExport('csv');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 font-mono text-[11px]"
              >
                Export CSV (.csv)
              </button>
              <button
                onClick={() => {
                  onBulkExport('excel');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 font-mono text-[11px]"
              >
                Export Excel Compatible
              </button>
              <button
                onClick={() => {
                  onBulkExport('sheets');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 font-mono text-[11px]"
              >
                Google Sheets Format
              </button>
            </div>
          )}
        </div>

        {/* Bulk Print */}
        <div className="relative">
          <button
            onClick={() => {
              setShowPrintMenu(!showPrintMenu);
              setShowStatusMenu(false);
              setShowExportMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 rounded-lg transition-all"
          >
            <Printer className="h-3.5 w-3.5 text-indigo-400" />
            <span>Bulk Print</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showPrintMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
              <button
                onClick={() => {
                  onBulkPrint('packing_slip');
                  setShowPrintMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-950/60 hover:text-indigo-300 text-slate-300 font-mono text-[11px]"
              >
                Print Packing Slips
              </button>
              <button
                onClick={() => {
                  onBulkPrint('invoice');
                  setShowPrintMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-950/60 hover:text-indigo-300 text-slate-300 font-mono text-[11px]"
              >
                Print Invoices
              </button>
            </div>
          )}
        </div>

        {/* Clear Selection */}
        <button
          onClick={onClearSelection}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all ml-1"
          title="Clear Selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Assign Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-mono text-sm uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Bulk Assign Batch Code
              </h3>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Assign a batch code (e.g. <code className="text-cyan-300">GB-2026-08B</code>) to all{' '}
              <strong className="text-cyan-400">{selectedCount}</strong> selected orders.
            </p>

            <form onSubmit={handleApplyBatch} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Batch Code / Identifier
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GB-2026-08B or OH-VAULT-99"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold font-mono bg-cyan-600 hover:bg-cyan-500 text-black rounded-lg transition-all"
                >
                  Apply Batch to {selectedCount} Orders
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
