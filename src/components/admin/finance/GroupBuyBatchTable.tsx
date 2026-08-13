import React, { useState } from 'react';
import { GroupBuyBatchProfitability } from '../../../types/finance';
import { ActionMenu } from '../../common/ActionMenu';
import { Layers, CheckCircle2, Clock, DollarSign, TrendingUp, ShoppingBag, Eye, FileText, X } from 'lucide-react';

interface GroupBuyBatchTableProps {
  batches: GroupBuyBatchProfitability[];
}

export const GroupBuyBatchTable: React.FC<GroupBuyBatchTableProps> = ({ batches }) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<GroupBuyBatchProfitability | null>(null);

  const formatPhp = (val: number) => `₱${Math.round(val).toLocaleString('en-US')}`;
  const formatUsd = (val: number) => `$${Math.round(val).toLocaleString('en-US')}`;

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              GroupBuy Batch Profitability
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Per-batch revenue, direct procurement costs, associated expenses, and net profit
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-xl">
          {batches.length} GroupBuy Batches
        </span>
      </div>

      {/* Batches Table */}
      {batches.length === 0 ? (
        <div className="py-8 text-center text-slate-500 font-mono text-xs">
          No GroupBuy batch financial data recorded for the selected filter.
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-mono text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-widest bg-slate-950/60">
                <th className="py-3 px-3.5">Batch Details</th>
                <th className="py-3 px-3.5">Schedule & Status</th>
                <th className="py-3 px-3.5 text-center">Orders / Vials</th>
                <th className="py-3 px-3.5 text-right">Revenue</th>
                <th className="py-3 px-3.5 text-right">Product / Procurement Cost</th>
                <th className="py-3 px-3.5 text-right">Business Expenses</th>
                <th className="py-3 px-3.5 text-right">Net Profit</th>
                <th className="py-3 px-3.5 text-right">Profit Margin</th>
                <th className="py-3 px-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {batches.map((batch) => {
                const isPositive = batch.netProfitPhp >= 0;

                return (
                  <tr
                    key={batch.batchNumber}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Batch Name & Number */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                        {batch.batchNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {batch.batchTitle}
                      </div>
                    </td>

                    {/* Schedule & Status */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            batch.status.toLowerCase() === 'open'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {batch.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#00D9FF]" />
                        {batch.openingDate} – {batch.closingDate}
                      </div>
                    </td>

                    {/* Orders / Vials */}
                    <td className="py-3.5 px-3.5 text-center">
                      <div className="text-white font-bold">{batch.orderCount} orders</div>
                      <div className="text-[10px] text-slate-400">{batch.vialsSold} vials sold</div>
                    </td>

                    {/* Revenue */}
                    <td className="py-3.5 px-3.5 text-right font-bold text-white">
                      <div>{formatPhp(batch.revenuePhp)}</div>
                      <div className="text-[10px] text-[#00D9FF] font-semibold">
                        {formatUsd(batch.revenueUsd)}
                      </div>
                    </td>

                    {/* Direct Cost */}
                    <td className="py-3.5 px-3.5 text-right text-slate-300">
                      {formatPhp(batch.directCostPhp)}
                    </td>

                    {/* Expenses */}
                    <td className="py-3.5 px-3.5 text-right text-amber-300/90">
                      {formatPhp(batch.expensesPhp)}
                    </td>

                    {/* Net Profit */}
                    <td
                      className={`py-3.5 px-3.5 text-right font-bold ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatPhp(batch.netProfitPhp)}
                    </td>

                    {/* Margin % */}
                    <td className="py-3.5 px-3.5 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border inline-block ${
                          batch.profitMarginPercent >= 40
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : batch.profitMarginPercent > 0
                            ? 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {batch.profitMarginPercent}%
                      </span>
                    </td>

                    {/* Standardized Actions Dropdown */}
                    <td className="py-3.5 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'View Batch Details',
                            icon: <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />,
                            onClick: () => setSelectedBatch(batch),
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

      {/* Batch Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto font-mono">
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0A0F1D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {selectedBatch.batchNumber}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedBatch.batchTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-white/10">
                <div>
                  <div className="text-[10px] text-slate-500">Opening Date</div>
                  <div className="font-bold text-white">{selectedBatch.openingDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Closing Date</div>
                  <div className="font-bold text-white">{selectedBatch.closingDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Orders Count</div>
                  <div className="font-bold text-white">{selectedBatch.orderCount} orders</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Vials Allocated</div>
                  <div className="font-bold text-white">{selectedBatch.vialsSold} vials</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue:</span>
                  <span className="font-bold text-white">{formatPhp(selectedBatch.revenuePhp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Direct Cost:</span>
                  <span className="text-purple-300">{formatPhp(selectedBatch.directCostPhp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expenses:</span>
                  <span className="text-amber-300">{formatPhp(selectedBatch.expensesPhp)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold">
                  <span className="text-slate-300">Net Batch Profit:</span>
                  <span className={selectedBatch.netProfitPhp >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {formatPhp(selectedBatch.netProfitPhp)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Profit Margin:</span>
                  <span className="text-[#00D9FF] font-bold">{selectedBatch.profitMarginPercent}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0A0F1D] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedBatch(null)}
                className="h-9 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs cursor-pointer"
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

