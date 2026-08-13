import React from 'react';
import { Search, Filter, RotateCcw, SortAsc } from 'lucide-react';
import {
  PaymentFilterOptions,
  PaymentVerificationStatus,
  PaymentMethod,
  StoreType,
} from '../../../types/paymentVerification';
import { PaymentVerificationService } from '../../../services/paymentVerificationService';

interface PaymentFiltersProps {
  filters: PaymentFilterOptions;
  onFilterChange: (newFilters: PaymentFilterOptions) => void;
  onReset: () => void;
  totalResults: number;
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const availableBatches = PaymentVerificationService.getAvailableBatches(filters.storeFilter);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchQuery: e.target.value,
      page: 1,
    });
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      storeFilter: e.target.value as 'all' | StoreType,
      batchFilter: 'all', // Reset batch filter when store changes to avoid invalid batch selection
      page: 1,
    });
  };

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      batchFilter: e.target.value,
      page: 1,
    });
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      paymentMethodFilter: e.target.value as 'all' | PaymentMethod,
      page: 1,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      statusFilter: e.target.value as 'all' | PaymentVerificationStatus,
      page: 1,
    });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      dateRange: e.target.value as PaymentFilterOptions['dateRange'],
      page: 1,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as PaymentFilterOptions['sortBy'],
      page: 1,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
      {/* Primary Row: Search and Core Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2.5">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            placeholder="Search ref, order #, customer, batch, TX..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Store Filter */}
        <div>
          <select
            value={filters.storeFilter || 'all'}
            onChange={handleStoreChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Store: All Stores</option>
            <option value="GroupBuy">GroupBuy Store</option>
            <option value="OnHand">OnHand Store</option>
            <option value="MOQ">MOQ Store</option>
          </select>
        </div>

        {/* Batch Filter (Store-Aware) */}
        <div>
          <select
            value={filters.batchFilter || 'all'}
            onChange={handleBatchChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Batch: All Batches</option>
            {availableBatches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value="unassigned">Unassigned Batch</option>
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <select
            value={filters.paymentMethodFilter || 'all'}
            onChange={handleMethodChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Method: All Methods</option>
            <option value="CRYPTO_USDT">Crypto: USDT</option>
            <option value="CRYPTO_BTC">Crypto: BTC</option>
            <option value="BANK_TRANSFER">Bank Wire / SWIFT</option>
            <option value="WISE_TRANSFER">Wise Transfer</option>
            <option value="ZELLE">Zelle Transfer</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="OTHER">Other Custom</option>
          </select>
        </div>

        {/* Verification Status Filter */}
        <div>
          <select
            value={filters.statusFilter || 'all'}
            onChange={handleStatusChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Status: All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="VERIFIED">Verified</option>
            <option value="REQUIRES_MORE_INFO">Requires Info</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <select
            value={filters.sortBy || 'date_desc'}
            onChange={handleSortChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="date_desc">Sort: Newest First</option>
            <option value="date_asc">Sort: Oldest First</option>
            <option value="amount_desc">Sort: Highest Amount</option>
            <option value="amount_asc">Sort: Lowest Amount</option>
            <option value="status_asc">Sort: Status Code</option>
          </select>
        </div>
      </div>

      {/* Secondary Bar: Date Range, Reset, and Queue Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Submission Date:
            </span>
          </div>

          <select
            value={filters.dateRange || 'all'}
            onChange={handleDateRangeChange}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today Only</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Past Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {filters.dateRange === 'custom' && (
            <div className="flex items-center gap-1.5 text-xs">
              <input
                type="date"
                value={filters.customStartDate || ''}
                onChange={(e) =>
                  onFilterChange({ ...filters, customStartDate: e.target.value, page: 1 })
                }
                className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={filters.customEndDate || ''}
                onChange={(e) =>
                  onFilterChange({ ...filters, customEndDate: e.target.value, page: 1 })
                }
                className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/70 hover:bg-slate-800 text-slate-300 rounded text-xs transition-colors cursor-pointer"
            title="Reset All Filters"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="text-slate-400 text-xs">
          Queue matches <strong className="text-cyan-400">{totalResults}</strong> payment proof
          {totalResults === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
};
