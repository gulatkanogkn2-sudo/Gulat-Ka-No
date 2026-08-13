import React from 'react';
import { FinanceOverview } from '../../../types/finance';
import {
  TrendingUp,
  Package,
  Receipt,
  DollarSign,
  Percent,
  Store,
  PieChart,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

interface FinanceOverviewCardsProps {
  overview: FinanceOverview;
}

export const FinanceOverviewCards: React.FC<FinanceOverviewCardsProps> = ({ overview }) => {
  const formatPhp = (val: number) => `₱${Math.round(val).toLocaleString('en-US')}`;
  const formatUsd = (val: number) => `$${Math.round(val).toLocaleString('en-US')} USD`;

  const isProfitPositive = overview.netProfitPhp >= 0;

  return (
    <div className="space-y-5">
      {/* Overview Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
          Executive Financial Dashboard
        </h3>
        <span className="text-slate-400 text-[11px] bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
          {overview.totalOrdersCount} Total Verified Orders Analyzed
        </span>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Revenue */}
        <div className="p-4 rounded-2xl bg-[#0A0F1D]/90 border border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.05)] relative overflow-hidden group hover:border-[#00D9FF] transition-all">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
              {formatPhp(overview.totalRevenuePhp)}
            </div>
            <div className="text-xs font-mono font-semibold text-[#00D9FF]/90">
              {formatUsd(overview.totalRevenueUsd)}
            </div>
          </div>
          <p className="mt-3 text-[10px] font-mono text-slate-500 border-t border-white/5 pt-2">
            Gross customer receipts
          </p>
        </div>

        {/* 2. Total Direct Costs */}
        <div className="p-4 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 hover:border-white/20 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Product Costs
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
              {formatPhp(overview.totalCostsPhp)}
            </div>
            <div className="text-xs font-mono font-semibold text-purple-300/90">
              {formatUsd(overview.totalCostsUsd)}
            </div>
          </div>
          <p className="mt-3 text-[10px] font-mono text-slate-500 border-t border-white/5 pt-2">
            Direct product procurement
          </p>
        </div>

        {/* 3. Total Expenses */}
        <div className="p-4 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 hover:border-white/20 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Business Expenses
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
              {formatPhp(overview.totalExpensesPhp)}
            </div>
            <div className="text-xs font-mono font-semibold text-amber-300/90">
              {formatUsd(overview.totalExpensesUsd)}
            </div>
          </div>
          <p className="mt-3 text-[10px] font-mono text-slate-500 border-t border-white/5 pt-2">
            Operating & shipping costs
          </p>
        </div>

        {/* 4. Net Profit */}
        <div
          className={`p-4 rounded-2xl bg-[#0A0F1D]/90 border transition-all relative overflow-hidden ${
            isProfitPositive
              ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
              : 'border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Net Profit
            </span>
            <div
              className={`p-2 rounded-xl border ${
                isProfitPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div
              className={`text-xl sm:text-2xl font-extrabold font-mono tracking-tight ${
                isProfitPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatPhp(overview.netProfitPhp)}
            </div>
            <div
              className={`text-xs font-mono font-semibold ${
                isProfitPositive ? 'text-emerald-300/90' : 'text-rose-300/90'
              }`}
            >
              {formatUsd(overview.netProfitUsd)}
            </div>
          </div>
          <p className="mt-3 text-[10px] font-mono text-slate-500 border-t border-white/5 pt-2">
            Revenue - Costs - Expenses
          </p>
        </div>

        {/* 5. Profit Margin */}
        <div className="p-4 rounded-2xl bg-[#0A0F1D]/90 border border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.05)] relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Profit Margin
            </span>
            <div className="p-2 rounded-xl bg-[#FF2ED1]/10 text-[#FF2ED1] border border-[#FF2ED1]/30">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#00D9FF] tracking-tight">
              {overview.profitMarginPercent}%
            </div>
            <div className="text-xs font-mono font-semibold text-[#FF2ED1]">
              Yield on Gross Volume
            </div>
          </div>
          <p className="mt-3 text-[10px] font-mono text-slate-500 border-t border-white/5 pt-2">
            Percentage return
          </p>
        </div>
      </div>

      {/* Store Profitability Channel Breakdown */}
      {overview.storeProfitability && overview.storeProfitability.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#FF2ED1]/10 border border-[#FF2ED1]/30 text-[#FF2ED1]">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Store Channel Profitability Comparison
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  Performance metrics across GroupBuy, OnHand, and MOQ store channels
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {overview.storeProfitability.map((sp) => {
              const isStorePositive = sp.netProfitPhp >= 0;

              return (
                <div
                  key={sp.storeType}
                  className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3 font-mono"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
                      {sp.storeName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                      {sp.orderCount} Orders
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500">Revenue</div>
                      <div className="font-bold text-white">{formatPhp(sp.revenuePhp)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Direct Cost</div>
                      <div className="text-purple-300">{formatPhp(sp.directCostPhp)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Expenses</div>
                      <div className="text-amber-300">{formatPhp(sp.expensesPhp)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Margin</div>
                      <div className="font-bold text-[#00D9FF]">{sp.profitMarginPercent}%</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Net Channel Profit:</span>
                    <span
                      className={`font-bold text-xs ${
                        isStorePositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatPhp(sp.netProfitPhp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

