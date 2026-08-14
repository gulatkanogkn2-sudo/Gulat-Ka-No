import React from 'react';
import { ShoppingBag, Clock, Truck, DollarSign, Layers, Package, ShieldCheck } from 'lucide-react';
import { OrderManagementService } from '../../../services/orderManagementService';
import { OrderDetail } from '../../../types/order';

interface OrderStatsHeaderProps {
  orders: OrderDetail[];
}

export const OrderStatsHeader: React.FC<OrderStatsHeaderProps> = ({ orders }) => {
  const stats = OrderManagementService.getOrderStats(orders);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
      {/* Total Orders */}
      <div className="bg-slate-900/80 border border-blue-500/20 rounded-lg p-3 relative overflow-hidden group hover:border-blue-500/40 transition-all">
        <div className="flex items-center justify-between text-blue-400 mb-1">
          <span className="text-xs uppercase tracking-wider font-mono">Total Allocations</span>
          <ShoppingBag className="h-4 w-4 text-blue-400" />
        </div>
        <div className="text-xl font-bold font-mono text-slate-100">{stats.total}</div>
        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Across all 3 stores</div>
      </div>

      {/* Pending Verification */}
      <div className="bg-slate-900/80 border border-amber-500/30 rounded-lg p-3 relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-[0_0_15px_rgba(245,158,11,0.05)]">
        <div className="flex items-center justify-between text-amber-400 mb-1">
          <span className="text-xs uppercase tracking-wider font-mono">Pending Verification</span>
          <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
        </div>
        <div className="text-xl font-bold font-mono text-amber-300">{stats.pendingVerification}</div>
        <div className="text-[10px] text-amber-400/70 font-mono mt-0.5">Payment Review Queue</div>
      </div>

      {/* Ready to Ship */}
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-lg p-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between text-cyan-400 mb-1">
          <span className="text-xs uppercase tracking-wider font-mono">Packing / Dispatch</span>
          <Truck className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-xl font-bold font-mono text-cyan-300">{stats.readyToShip}</div>
        <div className="text-[10px] text-cyan-400/70 font-mono mt-0.5">Order staging</div>
      </div>

      {/* GroupBuy Active */}
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-lg p-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between text-cyan-400 mb-1">
          <span className="text-xs uppercase tracking-wider font-mono">GroupBuy</span>
          <Layers className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-xl font-bold font-mono text-cyan-300">{stats.groupBuyCount}</div>
        <div className="text-[10px] text-cyan-400/70 font-mono mt-0.5">Pooled orders</div>
      </div>

      {/* OnHand / MOQ breakdown */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs uppercase tracking-wider font-mono">OnHand / MOQ</span>
          <Package className="h-4 w-4 text-slate-400" />
        </div>
        <div className="text-xl font-bold font-mono text-slate-200 flex items-center gap-1.5">
          <span className="text-emerald-400" title="OnHand Stock Orders">{stats.onHandCount}</span>
          <span className="text-xs text-slate-500 font-normal">/</span>
          <span className="text-purple-400" title="MOQ Campaign Orders">{stats.moqCount}</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Vault & Bulk campaigns</div>
      </div>

      {/* Total Revenue */}
      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-lg p-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between text-emerald-400 mb-1">
          <span className="text-xs uppercase tracking-wider font-mono">Verified Revenue</span>
          <DollarSign className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-xl font-bold font-mono text-emerald-300">
          ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div className="text-[10px] text-emerald-400/70 font-mono mt-0.5">Settled allocations</div>
      </div>
    </div>
  );
};


