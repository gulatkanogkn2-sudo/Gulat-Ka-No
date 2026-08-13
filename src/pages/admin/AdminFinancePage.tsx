import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FinanceFilterOptions,
  FinanceOverview,
  GroupBuyBatchProfitability,
  MonthlyPerformance,
  FinanceLedgerEntry,
  ExpenseItem,
} from '../../types/finance';
import { financeService } from '../../services/financeService';
import {
  FinanceFilterBar,
  FinanceOverviewCards,
  GroupBuyBatchTable,
  MonthlyPerformanceTable,
  ExpenseListModal,
  FinanceLedgerTable,
  ExportConfirmationModal,
} from '../../components/admin/finance';
import { Loader2, DollarSign, PieChart, Layers, RefreshCw, Activity, ArrowUpRight } from 'lucide-react';

export const AdminFinancePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [filters, setFilters] = useState<FinanceFilterOptions>({
    dateRange: 'all_time',
    storeType: 'all',
    batchNumber: 'all',
    transactionType: 'all',
    expenseCategory: 'all',
    search: '',
  });

  // Finance Data States
  const [overview, setOverview] = useState<FinanceOverview | null>(null);
  const [batchProfitability, setBatchProfitability] = useState<
    GroupBuyBatchProfitability[]
  >([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState<
    MonthlyPerformance[]
  >([]);
  const [ledgerEntries, setLedgerEntries] = useState<FinanceLedgerEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // Export Modal State
  const [exportModalType, setExportModalType] = useState<'filtered' | 'all' | null>(null);

  // Active View Tab
  const tabFromUrl = searchParams.get('tab');
  const validTab = (tabFromUrl && ['overview', 'batches', 'monthly', 'expenses', 'ledger'].includes(tabFromUrl))
    ? (tabFromUrl as 'overview' | 'batches' | 'monthly' | 'expenses' | 'ledger')
    : 'overview';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'batches' | 'monthly' | 'expenses' | 'ledger'
  >(validTab);

  useEffect(() => {
    if (tabFromUrl && ['overview', 'batches', 'monthly', 'expenses', 'ledger'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl as any);
    }
  }, [tabFromUrl]);

  const handleTabSelect = (tab: 'overview' | 'batches' | 'monthly' | 'expenses' | 'ledger') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await financeService.getOverview(filters);
      setOverview(data.overview);
      setBatchProfitability(data.batchProfitability);
      setMonthlyPerformance(data.monthlyPerformance);
      setLedgerEntries(data.ledgerEntries);
      setExpenses(data.expenses);
    } catch (err) {
      console.error('[AdminFinancePage] Failed to calculate financial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      dateRange: 'all_time',
      storeType: 'all',
      batchNumber: 'all',
      transactionType: 'all',
      expenseCategory: 'all',
      search: '',
    });
  };

  const handleAddExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    financeService.addExpense(expense);
    loadData();
  };

  const handleUpdateExpense = (expense: ExpenseItem) => {
    financeService.updateExpense(expense.id, expense);
    loadData();
  };

  const handleDeleteExpense = (id: string) => {
    financeService.deleteExpense(id);
    loadData();
  };

  // CSV Export Download Generator
  const handleConfirmExport = () => {
    if (!exportModalType) return;

    let exportEntries: FinanceLedgerEntry[] = ledgerEntries;
    if (exportModalType === 'all') {
      // Get unfiltered entries
      financeService.getOverview({
        dateRange: 'all_time',
        storeType: 'all',
        batchNumber: 'all',
        transactionType: 'all',
        expenseCategory: 'all',
        search: '',
      }).then((res) => {
        downloadCsv(res.ledgerEntries, 'all');
      });
    } else {
      downloadCsv(exportEntries, 'filtered');
    }

    setExportModalType(null);
  };

  const downloadCsv = (data: FinanceLedgerEntry[], mode: string) => {
    const headers = ['ID', 'Reference #', 'Date', 'Type', 'Store Channel', 'Batch #', 'Description', 'Revenue (PHP)', 'Product Cost (PHP)', 'Expense (PHP)', 'Net Profit (PHP)'];
    
    const rows = data.map((item) => [
      item.id,
      `"${item.referenceNumber}"`,
      item.date,
      item.type,
      item.storeType,
      item.batchNumber,
      `"${item.description.replace(/"/g, '""')}"`,
      item.revenuePhp,
      item.costPhp,
      item.expensePhp,
      item.netProfitPhp,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `GKN_V2_Finance_Ledger_${mode}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading && !overview) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#00D9FF] animate-spin" />
        <p className="text-xs font-mono text-slate-400">
          Calculating financial ledger, costs & batch margins...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Top Page Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#070B14] via-[#0A0F1D] to-[#0D1527] border border-[#00D9FF]/30 shadow-[0_0_30px_rgba(0,217,255,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 uppercase tracking-wider">
              Internal Profitability Engine
            </span>
            <span className="text-slate-500 text-xs hidden sm:inline">•</span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              GKN V2 Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Finance Overview
          </h1>
          <p className="text-xs text-slate-400 font-sans max-w-2xl">
            Track business profitability, GroupBuy batch margins, store revenue channels, and recorded operational expenses.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 font-mono text-xs">
          <div className="px-4 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-right">
            <span className="text-slate-400 block text-[10px] uppercase">
              Primary Currency
            </span>
            <span className="text-[#00D9FF] font-bold text-sm">PHP (₱)</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-right">
            <span className="text-slate-400 block text-[10px] uppercase">
              Secondary Currency
            </span>
            <span className="text-[#FF2ED1] font-bold text-sm">USD ($)</span>
          </div>
        </div>
      </div>

      {/* 1. Global Filter Toolbar */}
      {overview && (
        <FinanceFilterBar
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          onRefresh={loadData}
          onExportFiltered={() => setExportModalType('filtered')}
          onExportAll={() => setExportModalType('all')}
          matchingCount={ledgerEntries.length}
          totalCount={overview.totalOrdersCount + expenses.length}
          usdToPhpRate={overview.usdToPhpRate}
        />
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2 font-mono text-xs">
        <button
          onClick={() => handleTabSelect('overview')}
          className={`px-4 py-2 rounded-xl transition-all font-bold cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[inset_0_0_8px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => handleTabSelect('batches')}
          className={`px-4 py-2 rounded-xl transition-all font-bold cursor-pointer ${
            activeTab === 'batches'
              ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[inset_0_0_8px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Batch Profit ({batchProfitability.length})
        </button>
        <button
          onClick={() => handleTabSelect('monthly')}
          className={`px-4 py-2 rounded-xl transition-all font-bold cursor-pointer ${
            activeTab === 'monthly'
              ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[inset_0_0_8px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Monthly Performance
        </button>
        <button
          onClick={() => handleTabSelect('expenses')}
          className={`px-4 py-2 rounded-xl transition-all font-bold cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[inset_0_0_8px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Recorded Expenses ({expenses.length})
        </button>
        <button
          onClick={() => handleTabSelect('ledger')}
          className={`px-4 py-2 rounded-xl transition-all font-bold cursor-pointer ${
            activeTab === 'ledger'
              ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[inset_0_0_8px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Ledger Logs ({ledgerEntries.length})
        </button>
      </div>

      {/* Main Content Sections based on Active Tab */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          {/* Executive Dashboard Cards */}
          <FinanceOverviewCards overview={overview} />

          {/* Recent Financial Activity Feed */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 shadow-lg space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Recent Financial Activity Stream
                  </h3>
                  <p className="text-xs text-slate-400">
                    Latest verified customer order revenues and operating expenses
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleTabSelect('ledger')}
                className="text-xs text-[#00D9FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Ledger</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {ledgerEntries.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                No recent activity records found matching filters.
              </div>
            ) : (
              <div className="space-y-2">
                {ledgerEntries.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-white/5 hover:border-white/10 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400 text-[11px] font-mono">{entry.date}</div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{entry.referenceNumber}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                              entry.type === 'Revenue'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {entry.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[300px]">
                          {entry.description}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-bold ${
                          entry.netProfitPhp >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        ₱{Math.round(entry.netProfitPhp).toLocaleString('en-US')}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">{entry.storeType}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'batches' && (
        <GroupBuyBatchTable batches={batchProfitability} />
      )}

      {activeTab === 'monthly' && (
        <MonthlyPerformanceTable monthlyData={monthlyPerformance} />
      )}

      {activeTab === 'expenses' && overview && (
        <ExpenseListModal
          expenses={expenses}
          onAddExpense={handleAddExpense}
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={handleDeleteExpense}
          usdToPhpRate={overview.usdToPhpRate}
        />
      )}

      {activeTab === 'ledger' && (
        <FinanceLedgerTable entries={ledgerEntries} />
      )}

      {/* Export Confirmation Modal */}
      {exportModalType && (
        <ExportConfirmationModal
          isOpen={true}
          exportType={exportModalType}
          recordCount={exportModalType === 'filtered' ? ledgerEntries.length : (overview?.totalOrdersCount || 0) + expenses.length}
          activeFilterSummary={`${filters.storeType.toUpperCase()} store | ${filters.batchNumber} batch | ${filters.dateRange.replace('_', ' ')}`}
          onConfirm={handleConfirmExport}
          onClose={() => setExportModalType(null)}
        />
      )}
    </div>
  );
};

