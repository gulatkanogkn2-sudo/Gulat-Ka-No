import React, { useState, useRef, useEffect } from 'react';
import { FinanceFilterOptions, DateFilterOption, TransactionType, ExpenseCategory } from '../../../types/finance';
import { ActionMenu } from '../../common/ActionMenu';
import { Calendar, Filter, Layers, Store, RefreshCw, Search, X, Download, RotateCcw } from 'lucide-react';

interface FinanceFilterBarProps {
  filters: FinanceFilterOptions;
  onChange: (newFilters: FinanceFilterOptions) => void;
  onReset: () => void;
  onRefresh: () => void;
  onExportFiltered: () => void;
  onExportAll: () => void;
  matchingCount: number;
  totalCount: number;
  usdToPhpRate: number;
}

export const FinanceFilterBar: React.FC<FinanceFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  onRefresh,
  onExportFiltered,
  onExportAll,
  matchingCount,
  totalCount,
  usdToPhpRate,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute active chips
  const activeChips: Array<{ key: keyof FinanceFilterOptions; label: string; resetVal: any }> = [];

  if (filters.search) {
    activeChips.push({ key: 'search', label: `Search: "${filters.search}"`, resetVal: '' });
  }
  if (filters.dateRange !== 'all_time') {
    activeChips.push({ key: 'dateRange', label: `Date: ${filters.dateRange.replace('_', ' ')}`, resetVal: 'all_time' });
  }
  if (filters.storeType !== 'all') {
    activeChips.push({ key: 'storeType', label: `Store: ${filters.storeType.toUpperCase()}`, resetVal: 'all' });
  }
  if (filters.batchNumber !== 'all') {
    activeChips.push({ key: 'batchNumber', label: `Batch: ${filters.batchNumber}`, resetVal: 'all' });
  }
  if (filters.transactionType !== 'all') {
    activeChips.push({ key: 'transactionType', label: `Type: ${filters.transactionType}`, resetVal: 'all' });
  }
  if (filters.expenseCategory !== 'all') {
    activeChips.push({ key: 'expenseCategory', label: `Category: ${filters.expenseCategory}`, resetVal: 'all' });
  }

  const removeChip = (key: keyof FinanceFilterOptions, resetVal: any) => {
    onChange({
      ...filters,
      [key]: resetVal,
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 shadow-lg space-y-4">
      {/* Top Bar: Title, Currency Info, Refresh, Reset, Export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              Financial Filter Engine
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 font-normal">
                {matchingCount} of {totalCount} records matching
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Filter financial overview, profit batch analytics, expenses & ledger transactions
            </p>
          </div>
        </div>

        {/* Action Controls & Currency */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-white/10 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Rate:</span>
            <strong className="text-white">₱{usdToPhpRate.toFixed(2)} / $1 USD</strong>
          </span>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Recalculate financial data from current sources"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Refresh</span>
          </button>

          {/* Reset Filters Button */}
          <button
            onClick={onReset}
            className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset all filters to default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          {/* Export Dropdown */}
          <ActionMenu
            label="EXPORT"
            icon={<Download className="w-3.5 h-3.5" />}
            triggerClassName="h-9 px-3.5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,217,255,0.2)] cursor-pointer"
            items={[
              {
                label: (
                  <span className="flex items-center justify-between w-full">
                    <span>Export Filtered</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono ml-2">
                      {matchingCount}
                    </span>
                  </span>
                ),
                onClick: () => onExportFiltered(),
              },
              {
                label: (
                  <span className="flex items-center justify-between w-full">
                    <span>Export All Data</span>
                    <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-mono ml-2">
                      All
                    </span>
                  </span>
                ),
                onClick: () => onExportAll(),
              },
            ]}
          />
        </div>
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* 1. Global Search */}
        <div className="space-y-1 col-span-1 sm:col-span-2 lg:col-span-2">
          <label className="block text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#00D9FF]" />
            SEARCH QUERY
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ref #, ID, customer, batch, item..."
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="w-full h-10 pl-3.5 pr-8 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => onChange({ ...filters, search: '' })}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="block text-[10px] font-mono text-slate-500">
            Search orders, expenses, or ledger records
          </span>
        </div>

        {/* 2. Date Range Select */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#00D9FF]" />
            DATE RANGE
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) =>
              onChange({ ...filters, dateRange: e.target.value as DateFilterOption })
            }
            className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
          >
            <option value="all_time">All Time</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="custom">Custom Date Range</option>
          </select>
          <span className="block text-[10px] font-mono text-slate-500">
            Select time period
          </span>
        </div>

        {/* 3. Store Channel */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#FF2ED1]" />
            STORE CHANNEL
          </label>
          <select
            value={filters.storeType}
            onChange={(e) =>
              onChange({
                ...filters,
                storeType: e.target.value as 'all' | 'groupbuy' | 'onhand' | 'moq',
              })
            }
            className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
          >
            <option value="all">All Stores</option>
            <option value="groupbuy">GroupBuy Channel</option>
            <option value="onhand">OnHand Channel</option>
            <option value="moq">MOQ Bulk Channel</option>
          </select>
          <span className="block text-[10px] font-mono text-slate-500">
            Fulfillment store channel
          </span>
        </div>

        {/* 4. GroupBuy Batch */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            GROUPBUY BATCH
          </label>
          <select
            value={filters.batchNumber}
            onChange={(e) => onChange({ ...filters, batchNumber: e.target.value })}
            className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
          >
            <option value="all">All Batches</option>
            <option value="GB-2026-08A">Batch #1 (GB-2026-08A)</option>
            <option value="GB-2026-08B">Batch #2 (GB-2026-08B)</option>
            <option value="GB-2026-07C">Batch #3 (GB-2026-07C)</option>
          </select>
          <span className="block text-[10px] font-mono text-slate-500">
            Filter batch allocation
          </span>
        </div>

        {/* 5. Transaction Type & Category */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            TRANSACTION TYPE
          </label>
          <select
            value={filters.transactionType}
            onChange={(e) =>
              onChange({ ...filters, transactionType: e.target.value as TransactionType })
            }
            className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
          >
            <option value="all">All Types</option>
            <option value="Revenue">Revenue Only</option>
            <option value="Expense">Expense Only</option>
            <option value="Adjustment">Adjustment</option>
            <option value="Refund">Refund</option>
          </select>
          <span className="block text-[10px] font-mono text-slate-500">
            Ledger entry type
          </span>
        </div>
      </div>

      {/* Custom Date Bounds if Selected */}
      {filters.dateRange === 'custom' && (
        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
          <label className="block text-xs font-mono font-semibold text-slate-300">
            CUSTOM DATE BOUNDS
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">START DATE</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
                className="w-full h-10 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">END DATE</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
                className="w-full h-10 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips & Clear Control */}
      {activeChips.length > 0 && (
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
            Active Filters ({activeChips.length}):
          </span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] font-mono text-[11px]"
            >
              <span>{chip.label}</span>
              <button
                onClick={() => removeChip(chip.key, chip.resetVal)}
                className="hover:text-white transition-colors cursor-pointer"
                title="Remove filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={onReset}
            className="text-[10px] font-mono text-slate-400 hover:text-white underline ml-auto transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

