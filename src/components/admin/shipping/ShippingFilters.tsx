import React from 'react';
import { Search, Filter, RotateCcw, Calendar, ArrowUpDown, ChevronDown } from 'lucide-react';
import { ShipmentFilterOptions, ShippingStatus, CourierName, PackingStatus, StoreType } from '../../../types/shipping';

interface ShippingFiltersProps {
  filters: ShipmentFilterOptions;
  onFilterChange: (newFilters: Partial<ShipmentFilterOptions>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  totalResults: number;
}

export const ShippingFilters: React.FC<ShippingFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onRefresh,
  totalResults,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 space-y-4 backdrop-blur-md">
      {/* Top Search & Actions Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Instant Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value, page: 1 })}
            placeholder="Search Shipment ID, Order #, Customer name/email, or Tracking #..."
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '', page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right side controls: Sort & Reset */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-cyan-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any, page: 1 })}
              className="bg-transparent text-slate-200 text-xs focus:outline-none pr-4 cursor-pointer"
            >
              <option value="date_desc">Latest Updated First</option>
              <option value="date_asc">Oldest First</option>
              <option value="order_number">Order Number</option>
              <option value="status">Shipping Status</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={onResetFilters}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset
          </button>
        </div>
      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-800/60">
        {/* Store Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Store Type
          </label>
          <select
            value={filters.storeFilter}
            onChange={(e) => onFilterChange({ storeFilter: e.target.value as StoreType | 'all', page: 1 })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Stores</option>
            <option value="GroupBuy">GroupBuy Store</option>
            <option value="OnHand">OnHand Store</option>
            <option value="MOQ">MOQ Store</option>
          </select>
        </div>

        {/* Courier Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Courier Carrier</label>
          <select
            value={filters.courierFilter}
            onChange={(e) => onFilterChange({ courierFilter: e.target.value as CourierName | 'all', page: 1 })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Carriers</option>
            <option value="DHL_EXPRESS">DHL Express Cold Chain</option>
            <option value="FEDEX_LAB_EXPRESS">FedEx Lab Express</option>
            <option value="UPS_COLD_CHAIN">UPS Next Day Air Cryo</option>
            <option value="USPS_PRIORITY">USPS Priority Express</option>
            <option value="LOCAL_COURIER">GKN Local Courier</option>
            <option value="OTHER">Other / Specialist</option>
          </select>
        </div>

        {/* Shipping Status Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Shipping Status</label>
          <select
            value={filters.shippingStatusFilter}
            onChange={(e) =>
              onFilterChange({ shippingStatusFilter: e.target.value as ShippingStatus | 'all', page: 1 })
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING_PACKING">Pending Packing</option>
            <option value="PACKING">Packing In Progress</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="DELIVERY_FAILED">Delivery Failed</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>

        {/* Packing Status Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Packing Workspace</label>
          <select
            value={filters.packingStatusFilter}
            onChange={(e) =>
              onFilterChange({ packingStatusFilter: e.target.value as PackingStatus | 'all', page: 1 })
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Packing States</option>
            <option value="UNPACKED">Unpacked</option>
            <option value="IN_PROGRESS">Packing In Progress</option>
            <option value="COMPLETED">Packing Completed</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-400" /> Date Updated
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ dateRange: e.target.value as any, page: 1 })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
};
