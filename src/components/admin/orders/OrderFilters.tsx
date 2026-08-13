import React from 'react';
import { Search, Filter, RotateCcw, Calendar, ArrowUpDown, Layers } from 'lucide-react';
import { OrderFilterOptions, OrderStatus, PaymentStatus } from '../../../types/order';
import { OrderManagementService } from '../../../services/orderManagementService';

interface OrderFiltersProps {
  filters: OrderFilterOptions;
  onFilterChange: (newFilters: OrderFilterOptions) => void;
  onReset: () => void;
  totalResults: number;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const availableBatches = OrderManagementService.getAvailableBatches(filters.storeFilter);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value, page: 1 });
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStore = e.target.value as OrderFilterOptions['storeFilter'];
    onFilterChange({
      ...filters,
      storeFilter: newStore,
      batchFilter: 'all', // Reset batch filter when switching store context
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

  const handleOrderStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      orderStatusFilter: e.target.value as OrderFilterOptions['orderStatusFilter'],
      page: 1,
    });
  };

  const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      paymentStatusFilter: e.target.value as OrderFilterOptions['paymentStatusFilter'],
      page: 1,
    });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as OrderFilterOptions['dateRange'];
    onFilterChange({
      ...filters,
      dateRange: val,
      page: 1,
    });
  };

  const handleCustomDateChange = (field: 'customStartDate' | 'customEndDate', val: string) => {
    onFilterChange({
      ...filters,
      [field]: val,
      page: 1,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as OrderFilterOptions['sortBy'],
    });
  };

  const isFiltered =
    Boolean(filters.searchQuery) ||
    (filters.storeFilter && filters.storeFilter !== 'all') ||
    (filters.batchFilter && filters.batchFilter !== 'all') ||
    (filters.orderStatusFilter && filters.orderStatusFilter !== 'all') ||
    (filters.paymentStatusFilter && filters.paymentStatusFilter !== 'all') ||
    (filters.dateRange && filters.dateRange !== 'all') ||
    Boolean(filters.customStartDate) ||
    Boolean(filters.customEndDate) ||
    (filters.sortBy && filters.sortBy !== 'date_desc');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg backdrop-blur-md">
      {/* Primary Row: Search & Count */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            placeholder="Search by Order #, Customer, Email, Tracking #, Batch, CAS #..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '', page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results indicator & Reset */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-400 font-mono shrink-0">
          <span>
            Showing <strong className="text-cyan-400">{totalResults}</strong> records
          </span>

          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 px-2.5 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded transition-all cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Select Controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-800/80">
        {/* Store Filter */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Store Type
          </label>
          <select
            value={filters.storeFilter || 'all'}
            onChange={handleStoreChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Stores (3)</option>
            <option value="groupbuy">GroupBuy</option>
            <option value="onhand">OnHand Vault</option>
            <option value="moq">MOQ Bulk</option>
          </select>
        </div>

        {/* Batch Filter (Store-Aware) */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Layers className="h-3 w-3 text-cyan-400" /> Batch
          </label>
          <select
            value={filters.batchFilter || 'all'}
            onChange={handleBatchChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Batches</option>
            {availableBatches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

        {/* Order Status Filter */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Order Status
          </label>
          <select
            value={filters.orderStatusFilter || 'all'}
            onChange={handleOrderStatusChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Order Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="AWAITING_PAYMENT">Awaiting Payment</option>
            <option value="PAYMENT_VERIFICATION">Payment Verification</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PACKING">Packing</option>
            <option value="READY_TO_SHIP">Ready to Ship</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Payment Status
          </label>
          <select
            value={filters.paymentStatusFilter || 'all'}
            onChange={handlePaymentStatusChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Payment Statuses</option>
            <option value="UNPAID">Unpaid</option>
            <option value="AWAITING_PAYMENT">Awaiting Payment</option>
            <option value="VERIFICATION_PENDING">Verification Pending</option>
            <option value="PAID">Paid</option>
            <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
            <option value="REFUNDED">Refunded</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Date Range
          </label>
          <select
            value={filters.dateRange || 'all'}
            onChange={handleDateRangeChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Sorting */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3" /> Sort By
          </label>
          <select
            value={filters.sortBy || 'date_desc'}
            onChange={handleSortChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="total_desc">Highest Total</option>
            <option value="total_asc">Lowest Total</option>
            <option value="ref_asc">Order # (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Custom Date Range Row if selected */}
      {filters.dateRange === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/50 text-xs font-mono">
          <span className="text-slate-400">Custom Range:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Start</span>
            <input
              type="date"
              value={filters.customStartDate || ''}
              onChange={(e) => handleCustomDateChange('customStartDate', e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">End</span>
            <input
              type="date"
              value={filters.customEndDate || ''}
              onChange={(e) => handleCustomDateChange('customEndDate', e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
