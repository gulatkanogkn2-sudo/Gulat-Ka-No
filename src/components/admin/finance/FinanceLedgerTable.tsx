import React, { useState } from 'react';
import { FinanceLedgerEntry } from '../../../types/finance';
import { ActionMenu } from '../../common/ActionMenu';
import { FileText, ArrowUpRight, ArrowDownLeft, Eye, ExternalLink, X } from 'lucide-react';

interface FinanceLedgerTableProps {
  entries: FinanceLedgerEntry[];
}

export const FinanceLedgerTable: React.FC<FinanceLedgerTableProps> = ({ entries }) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<FinanceLedgerEntry | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'source'>('details');

  const formatPhp = (val: number) => `₱${Math.round(val).toLocaleString('en-US')}`;

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Financial Ledger Logs
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Detailed transaction log for orders, direct costs, and recorded expenses
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
          {entries.length} Ledger Records
        </span>
      </div>

      {/* Table */}
      {entries.length === 0 ? (
        <div className="py-8 text-center text-slate-500 font-mono text-xs">
          No ledger transactions match the active filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-mono text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-widest bg-slate-950/60">
                <th className="py-3 px-3.5">Date</th>
                <th className="py-3 px-3.5">Ref # & Type</th>
                <th className="py-3 px-3.5">Store / Batch</th>
                <th className="py-3 px-3.5">Description</th>
                <th className="py-3 px-3.5 text-right">Revenue</th>
                <th className="py-3 px-3.5 text-right">Product / Procurement Cost</th>
                <th className="py-3 px-3.5 text-right">Business Expense</th>
                <th className="py-3 px-3.5 text-right">Net Profit</th>
                <th className="py-3 px-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((entry) => {
                const isRevenue = entry.type === 'Revenue';
                const isProfitPositive = entry.netProfitPhp >= 0;

                return (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3.5 text-slate-400 whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {isRevenue ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {entry.referenceNumber}
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border inline-block mt-0.5 ${
                          isRevenue
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="uppercase font-bold text-[11px] text-[#00D9FF]">
                        {entry.storeType}
                      </div>
                      <div className="text-[10px] text-slate-500">{entry.batchNumber}</div>
                    </td>
                    <td className="py-3 px-3.5 text-slate-300 truncate max-w-[200px]">
                      {entry.description}
                    </td>
                    <td className="py-3 px-3.5 text-right font-bold text-white">
                      {entry.revenuePhp > 0 ? formatPhp(entry.revenuePhp) : '—'}
                    </td>
                    <td className="py-3 px-3.5 text-right text-slate-400">
                      {entry.costPhp > 0 ? formatPhp(entry.costPhp) : '—'}
                    </td>
                    <td className="py-3 px-3.5 text-right text-amber-300">
                      {entry.expensePhp > 0 ? formatPhp(entry.expensePhp) : '—'}
                    </td>
                    <td
                      className={`py-3 px-3.5 text-right font-bold ${
                        isProfitPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatPhp(entry.netProfitPhp)}
                    </td>

                    {/* Standardized ACTIONS Dropdown */}
                    <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'View Entry Details',
                            icon: <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />,
                            onClick: () => {
                              setSelectedEntry(entry);
                              setModalMode('details');
                            },
                          },
                          {
                            label: 'View Source',
                            icon: <ExternalLink className="w-3.5 h-3.5 text-purple-400" />,
                            onClick: () => {
                              setSelectedEntry(entry);
                              setModalMode('source');
                            },
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

      {/* Ledger Entry / Source Traceability Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
          <div className="w-full max-w-md bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="p-4 bg-[#0A0F1D] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00D9FF]" />
                <h3 className="font-bold text-white text-sm">
                  {modalMode === 'details' ? 'LEDGER ENTRY DETAILS' : 'SOURCE TRACEABILITY'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                <div className="text-[10px] text-slate-500">Ref Number</div>
                <div className="font-bold text-white text-sm">{selectedEntry.referenceNumber}</div>
                <div className="text-[#00D9FF]">{selectedEntry.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Type: <strong className="text-white">{selectedEntry.type}</strong></div>
                <div>Date: <strong className="text-white">{selectedEntry.date}</strong></div>
                <div>Store: <strong className="text-white">{selectedEntry.storeType}</strong></div>
                <div>Batch: <strong className="text-white">{selectedEntry.batchNumber}</strong></div>
              </div>

              {modalMode === 'source' && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 space-y-1">
                  <div className="font-bold text-xs">Source Reference</div>
                  <div>Source Type: <strong>{selectedEntry.sourceType || 'Order Record'}</strong></div>
                  <div>Source ID: <strong>{selectedEntry.sourceId || selectedEntry.referenceNumber}</strong></div>
                  <div>Source Ref: <strong>{selectedEntry.sourceRef || selectedEntry.referenceNumber}</strong></div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1 text-right">
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue:</span>
                  <span className="font-bold text-white">{formatPhp(selectedEntry.revenuePhp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Direct Cost:</span>
                  <span className="text-slate-300">{formatPhp(selectedEntry.costPhp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expense:</span>
                  <span className="text-amber-300">{formatPhp(selectedEntry.expensePhp)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold">
                  <span className="text-slate-300">Net Profit:</span>
                  <span className={selectedEntry.netProfitPhp >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {formatPhp(selectedEntry.netProfitPhp)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0A0F1D] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 text-xs"
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

