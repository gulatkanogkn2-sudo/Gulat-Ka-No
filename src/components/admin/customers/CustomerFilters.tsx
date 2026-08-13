import React from 'react';
import { Search, Filter, RotateCcw, SortAsc } from 'lucide-react';
import {
  CustomerAccountStatus,
  CustomerFilterOptions,
  CustomerTier,
  CustomerVerificationStatus,
} from '../../../types/customer';

interface CustomerFiltersProps {
  filters: CustomerFilterOptions;
  onFilterChange: (newFilters: CustomerFilterOptions) => void;
  onReset: () => void;
  totalResults: number;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchQuery: e.target.value,
      page: 1,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      statusFilter: e.target.value as 'all' | CustomerAccountStatus,
      page: 1,
    });
  };

  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      tierFilter: e.target.value as 'all' | CustomerTier,
      page: 1,
    });
  };

  const handleVerificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      verificationFilter: e.target.value as 'all' | CustomerVerificationStatus,
      page: 1,
    });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      dateRange: e.target.value as CustomerFilterOptions['dateRange'],
      page: 1,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as CustomerFilterOptions['sortBy'],
      page: 1,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
      {/* Search and Primary Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            placeholder="Search name, email, ID, institution, phone..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Account Status Filter */}
        <div>
          <select
            value={filters.statusFilter || 'all'}
            onChange={handleStatusChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Status: All</option>
            <option value="ACTIVE">Status: Active</option>
            <option value="PENDING_VERIFICATION">Status: Pending Verification</option>
            <option value="SUSPENDED">Status: Suspended</option>
            <option value="DISABLED">Status: Disabled</option>
            <option value="BANNED">Status: Banned</option>
          </select>
        </div>

        {/* Customer Tier Filter */}
        <div>
          <select
            value={filters.tierFilter || 'all'}
            onChange={handleTierChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tier: All Tiers</option>
            <option value="STANDARD">Standard</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
            <option value="VIP">VIP</option>
            <option value="ADMINISTRATOR">Administrator</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>

        {/* Registration Date Filter */}
        <div>
          <select
            value={filters.dateRange || 'all'}
            onChange={handleDateRangeChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Reg Date: All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Past Year</option>
          </select>
        </div>

        {/* Sorting */}
        <div>
          <select
            value={filters.sortBy || 'registration_desc'}
            onChange={handleSortChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="registration_desc">Sort: Newest First</option>
            <option value="registration_asc">Sort: Oldest First</option>
            <option value="spending_desc">Sort: Highest Spending</option>
            <option value="spending_asc">Sort: Lowest Spending</option>
            <option value="orders_desc">Sort: Most Orders</option>
            <option value="name_asc">Sort: Name (A-Z)</option>
            <option value="last_active_desc">Sort: Recently Active</option>
          </select>
        </div>
      </div>

      {/* Secondary Bar: Verification Filter & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Verification Filter:
            </span>
          </div>

          <select
            value={filters.verificationFilter || 'all'}
            onChange={handleVerificationChange}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Verification Statuses</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="PENDING_ID">Pending ID</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="REJECTED">Rejected / Flagged</option>
          </select>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/70 hover:bg-slate-800 text-slate-300 rounded text-xs transition-colors"
            title="Reset All Filters"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="text-slate-400 text-xs">
          Showing <strong className="text-cyan-400">{totalResults}</strong> customer account
          {totalResults === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
};
