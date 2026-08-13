import React from 'react';
import { Truck, PackageCheck, Clock, CheckCircle2, AlertTriangle, ThermometerSnowflake } from 'lucide-react';
import { ShipmentStats } from '../../../types/shipping';

interface ShippingStatsHeaderProps {
  stats: ShipmentStats;
  loading?: boolean;
}

export const ShippingStatsHeader: React.FC<ShippingStatsHeaderProps> = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Shipments */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Shipments</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-white tracking-tight">
            {loading ? '...' : stats.totalShipments}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <ThermometerSnowflake className="w-3 h-3 text-cyan-400" /> Cryo-Vault
          </span>
        </div>
      </div>

      {/* Pending Packing */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-amber-500/30 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pending Packing</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-amber-400 tracking-tight">
            {loading ? '...' : stats.pendingPackingCount}
          </span>
          <span className="text-xs text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Cleanroom Queue
          </span>
        </div>
      </div>

      {/* In Transit */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-blue-500/30 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">In Transit / Active</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-blue-400 tracking-tight">
            {loading ? '...' : stats.inTransitCount}
          </span>
          <span className="text-xs text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            Live Tracked
          </span>
        </div>
      </div>

      {/* Delivered */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Delivered</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-emerald-400 tracking-tight">
            {loading ? '...' : stats.deliveredCount}
          </span>
          <span className="text-xs text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Verified Handed
          </span>
        </div>
      </div>

      {/* Delivery Failed / Returned */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-rose-500/30 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Exceptions / Failed</span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-rose-400 tracking-tight">
            {loading ? '...' : stats.failedReturnedCount}
          </span>
          <span className="text-xs text-rose-400/80 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            Action Required
          </span>
        </div>
      </div>
    </div>
  );
};
