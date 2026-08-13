import React, { useState } from 'react';
import { MonthlyPerformance } from '../../../types/finance';
import { ActionMenu } from '../../common/ActionMenu';
import { Calendar, BarChart3, Eye, Download, X } from 'lucide-react';

interface MonthlyPerformanceTableProps {
  monthlyData: MonthlyPerformance[];
}

export const MonthlyPerformanceTable: React.FC<MonthlyPerformanceTableProps> = ({
  monthlyData,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyPerformance | null>(null);

  const formatPhp = (val: number) => {
    const roundVal = Math.round(val);
    if (roundVal < 0) {
      return `−₱${Math.abs(roundVal).toLocaleString('en-US')}`;
    }
    return `₱${roundVal.toLocaleString('en-US')}`;
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Monthly Performance Breakdown
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Monthly revenue, direct procurement costs, expenses, and margin trajectories
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Table */}
      {monthlyData.length === 0 ? (
        <div className="py-8 text-center text-slate-500 font-mono text-xs">
          No monthly financial activity recorded for the active date filter.
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-mono text-xs border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-widest bg-slate-950/60">
                <th className="py-3 px-3.5">Month</th>
                <th className="py-3 px-3.5 text-center">Orders</th>
                <th className="py-3 px-3.5 text-right">Revenue</th>
                <th className="py-3 px-3.5 text-right">Product / Procurement Costs</th>
                <th className="py-3 px-3.5 text-right">Business Expenses</th>
                <th className="py-3 px-3.5 text-right">Net Profit</th>
                <th className="py-3 px-3.5 text-right">Profit Margin</th>
                <th className="py-3 px-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {monthlyData.map((m) => {
                const isPositive = m.netProfitPhp >= 0;

                return (
                  <tr key={m.yearMonth} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3.5 font-bold text-white flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#00D9FF]" />
                      {m.label}
                    </td>
                    <td className="py-3.5 px-3.5 text-center text-slate-300 font-bold">
                      {m.orderCount}
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-bold text-white">
                      {formatPhp(m.revenuePhp)}
                    </td>
                    <td className="py-3.5 px-3.5 text-right text-slate-300">
                      {formatPhp(m.costsPhp)}
                    </td>
                    <td className="py-3.5 px-3.5 text-right text-amber-300/90">
                      {formatPhp(m.expensesPhp)}
                    </td>
                    <td
                      className={`py-3.5 px-3.5 text-right font-bold ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatPhp(m.netProfitPhp)}
                    </td>
                    <td className="py-3.5 px-3.5 text-right">
                      <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {m.revenuePhp > 0 ? `${m.marginPercent}%` : '—'}
                      </span>
                    </td>

                    {/* Standardized Actions Dropdown */}
                    <td className="py-3.5 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'View Month Details',
                            icon: <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />,
                            onClick: () => setSelectedMonth(m),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Month Details Modal */}
      {selectedMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
          <div className="w-full max-w-md bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="p-4 bg-[#0A0F1D] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm uppercase">
                  MONTHLY BREAKDOWN — {selectedMonth.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMonth(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-white/10">
                <div>
                  <div className="text-[10px] text-slate-500">Period</div>
                  <div className="font-bold text-white">{selectedMonth.label}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Total Orders</div>
                  <div className="font-bold text-white">{selectedMonth.orderCount} orders</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Revenue:</span>
                  <span className="font-bold text-white">{formatPhp(selectedMonth.revenuePhp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Direct Procurement Costs:</span>
                  <span className="text-slate-300">{formatPhp(selectedMonth.costsPhp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Business Expenses:</span>
                  <span className="text-amber-300">{formatPhp(selectedMonth.expensesPhp)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold">
                  <span className="text-slate-300">Net Month Profit:</span>
                  <span className={selectedMonth.netProfitPhp >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {formatPhp(selectedMonth.netProfitPhp)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Profit Yield:</span>
                  <span className="text-[#00D9FF] font-bold">
                    {selectedMonth.revenuePhp > 0 ? `${selectedMonth.marginPercent}%` : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0A0F1D] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedMonth(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

