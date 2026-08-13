import React, { useState } from 'react';
import {
  Users,
  X,
  FileSpreadsheet,
  ShieldCheck,
  Crown,
  ChevronDown,
  Check,
} from 'lucide-react';
import { CustomerAccountStatus, CustomerTier } from '../../../types/customer';

interface CustomerBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatusUpdate: (status: CustomerAccountStatus) => void;
  onBulkTierUpdate: (tier: CustomerTier) => void;
  onBulkExport: (format: 'csv' | 'excel' | 'sheets') => void;
}

export const CustomerBulkActions: React.FC<CustomerBulkActionsProps> = ({
  selectedCount,
  onClearSelection,
  onBulkStatusUpdate,
  onBulkTierUpdate,
  onBulkExport,
}) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md rounded-2xl px-5 py-3 flex flex-wrap items-center gap-4 text-xs font-mono animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Selected Indicator */}
      <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
        <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-bold text-slate-100">
          <span className="text-cyan-400 font-extrabold text-sm">{selectedCount}</span> Selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-slate-400 hover:text-white ml-2 p-1 rounded hover:bg-slate-800"
          title="Clear Selection"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Bulk Status Update */}
      <div className="relative">
        <button
          onClick={() => {
            setStatusDropdownOpen(!statusDropdownOpen);
            setTierDropdownOpen(false);
            setExportDropdownOpen(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 transition-colors"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
          <span>Set Account Status</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>

        {statusDropdownOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
            <button
              onClick={() => {
                onBulkStatusUpdate('ACTIVE');
                setStatusDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 text-emerald-400 text-xs flex items-center justify-between"
            >
              <span>Set Active</span>
              <Check className="h-3 w-3" />
            </button>
            <button
              onClick={() => {
                onBulkStatusUpdate('PENDING_VERIFICATION');
                setStatusDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 text-amber-400 text-xs"
            >
              Set Pending Verification
            </button>
            <button
              onClick={() => {
                onBulkStatusUpdate('SUSPENDED');
                setStatusDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 text-rose-400 text-xs"
            >
              Set Suspended
            </button>
            <button
              onClick={() => {
                onBulkStatusUpdate('DISABLED');
                setStatusDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-400 text-xs"
            >
              Set Disabled
            </button>
            <button
              onClick={() => {
                onBulkStatusUpdate('BANNED');
                setStatusDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 text-red-500 text-xs"
            >
              Set Banned
            </button>
          </div>
        )}
      </div>

      {/* Bulk Tier Update */}
      <div className="relative">
        <button
          onClick={() => {
            setTierDropdownOpen(!tierDropdownOpen);
            setStatusDropdownOpen(false);
            setExportDropdownOpen(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 transition-colors"
        >
          <Crown className="h-3.5 w-3.5 text-amber-400" />
          <span>Assign Customer Tier</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>

        {tierDropdownOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-44 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
            <button
              onClick={() => {
                onBulkTierUpdate('STANDARD');
                setTierDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300 text-xs"
            >
              Standard Tier
            </button>
            <button
              onClick={() => {
                onBulkTierUpdate('SILVER');
                setTierDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-cyan-300 text-xs"
            >
              Silver Tier
            </button>
            <button
              onClick={() => {
                onBulkTierUpdate('GOLD');
                setTierDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-yellow-400 text-xs"
            >
              Gold Tier
            </button>
            <button
              onClick={() => {
                onBulkTierUpdate('VIP');
                setTierDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-amber-300 text-xs font-bold"
            >
              VIP Tier
            </button>
          </div>
        )}
      </div>

      {/* Bulk Export */}
      <div className="relative">
        <button
          onClick={() => {
            setExportDropdownOpen(!exportDropdownOpen);
            setStatusDropdownOpen(false);
            setTierDropdownOpen(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg font-bold transition-colors"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span>Export Selected</span>
          <ChevronDown className="h-3 w-3 text-emerald-400" />
        </button>

        {exportDropdownOpen && (
          <div className="absolute bottom-full mb-2 right-0 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
            <button
              onClick={() => {
                onBulkExport('csv');
                setExportDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 text-xs"
            >
              Export as CSV (.csv)
            </button>
            <button
              onClick={() => {
                onBulkExport('excel');
                setExportDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 text-xs"
            >
              Export as Excel (.xlsx)
            </button>
            <button
              onClick={() => {
                onBulkExport('sheets');
                setExportDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 text-xs"
            >
              Export for Google Sheets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
