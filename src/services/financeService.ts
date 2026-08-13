import {
  ExpenseItem,
  FinanceOverview,
  GroupBuyBatchProfitability,
  MonthlyPerformance,
  FinanceLedgerEntry,
  FinanceFilterOptions,
} from '../types/finance';
import { OrderManagementService } from './orderManagementService';
import { systemSettingsService } from './systemSettingsService';
import { getSystemExchangeRate } from '../utils/currencyUtils';

const EXPENSES_STORAGE_KEY = 'gkn_finance_expenses_v2';

// Seed initial expenses if localStorage is empty
const INITIAL_SEED_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-101',
    name: 'LBC & DHL Cold-Chain Express Shipping',
    amountPhp: 12500,
    date: '2026-08-05',
    category: 'Shipping',
    notes: 'Batch #1 dispatch thermal boxes and courier express waybills',
    recordedBy: 'Admin Operations',
    batchNumber: 'GB-2026-08A',
    storeType: 'groupbuy',
  },
  {
    id: 'exp-102',
    name: 'Sterile Lyophilization Packaging & Thermal Liners',
    amountPhp: 18400,
    date: '2026-08-03',
    category: 'Packaging',
    notes: 'Vault insulation, argon gas seals & custom vial boxes',
    recordedBy: 'Inventory Manager',
    batchNumber: 'GB-2026-08A',
    storeType: 'groupbuy',
  },
  {
    id: 'exp-103',
    name: 'GCash & BDO Merchant Settlement Fees',
    amountPhp: 1510,
    date: '2026-08-02',
    category: 'Payment Fees',
    notes: 'Instant transfer verification and banking transaction charges',
    recordedBy: 'Finance Admin',
    batchNumber: 'all',
    storeType: 'all',
  },
  {
    id: 'exp-104',
    name: 'HPLC Analytical Purity Testing (Janoshik Lab)',
    amountPhp: 14500,
    date: '2026-07-28',
    category: 'Laboratory / Testing',
    notes: 'Mass spectrometry & HPLC purity verification COA report',
    recordedBy: 'QC Lead',
    batchNumber: 'GB-2026-07C',
    storeType: 'groupbuy',
  },
];

class FinanceService {
  private getUsdRate(): number {
    return getSystemExchangeRate();
  }

  /**
   * Fetch all stored admin expenses
   */
  public getExpenses(): ExpenseItem[] {
    try {
      const stored = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('[FinanceService] Error loading expenses from localStorage:', e);
    }
    // Fallback seed
    this.saveExpensesToStorage(INITIAL_SEED_EXPENSES);
    return [...INITIAL_SEED_EXPENSES];
  }

  /**
   * Save expenses array
   */
  private saveExpensesToStorage(expenses: ExpenseItem[]): void {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('[FinanceService] Error saving expenses:', e);
    }
  }

  /**
   * Add a new expense
   */
  public addExpense(expense: Omit<ExpenseItem, 'id'>): ExpenseItem {
    const current = this.getExpenses();
    const newItem: ExpenseItem = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    const updated = [newItem, ...current];
    this.saveExpensesToStorage(updated);
    return newItem;
  }

  /**
   * Update an existing expense
   */
  public updateExpense(id: string, updatedExpense: Partial<ExpenseItem>): ExpenseItem | null {
    const current = this.getExpenses();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem = { ...current[index], ...updatedExpense };
    current[index] = updatedItem;
    this.saveExpensesToStorage(current);
    return updatedItem;
  }

  /**
   * Delete an expense by ID
   */
  public deleteExpense(id: string): void {
    const current = this.getExpenses();
    const updated = current.filter((item) => item.id !== id);
    this.saveExpensesToStorage(updated);
  }

  /**
   * Helper to check if a date string falls inside the selected date range
   */
  private isDateInRange(dateStr: string, options: FinanceFilterOptions): boolean {
    if (options.dateRange === 'all_time') return true;

    const date = new Date(dateStr);
    const now = new Date('2026-08-08T12:00:00Z'); // Baseline app current date context
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (options.dateRange === 'today') {
      return date >= startOfDay;
    }

    if (options.dateRange === 'this_week') {
      const weekStart = new Date(startOfDay);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return date >= weekStart;
    }

    if (options.dateRange === 'this_month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return date >= monthStart;
    }

    if (options.dateRange === 'last_month') {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }

    if (options.dateRange === 'custom' && options.startDate) {
      const start = new Date(options.startDate);
      const end = options.endDate ? new Date(`${options.endDate}T23:59:59`) : new Date();
      return date >= start && date <= end;
    }

    return true;
  }

  /**
   * Get filtered orders based on options
   */
  private async getFilteredOrders(options: FinanceFilterOptions) {
    // If filtering purely for Expenses, return no orders
    if (options.transactionType === 'Expense') {
      return [];
    }

    const response = await OrderManagementService.getOrders({ pageSize: 1000 });
    const allOrders = response.orders || [];
    const rate = this.getUsdRate();

    const query = (options.search || '').trim().toLowerCase();

    return allOrders.filter((ord) => {
      // Payment verification check (only paid / confirmed orders count towards revenue)
      const isPaid =
        ord.paymentStatus === 'PAID' ||
        ord.status === 'CONFIRMED' ||
        ord.status === 'PROCESSING' ||
        ord.status === 'PACKING' ||
        ord.status === 'READY_TO_SHIP' ||
        ord.status === 'SHIPPED' ||
        ord.status === 'DELIVERED' ||
        ord.status === 'COMPLETED' ||
        ord.status === 'PAYMENT_VERIFICATION';

      if (!isPaid) return false;

      // Store filter
      if (options.storeType !== 'all' && ord.storeType !== options.storeType) {
        return false;
      }

      // Batch filter
      if (options.batchNumber !== 'all') {
        const orderBatch = ord.assignedBatch || ord.groupBuyData?.batchNumber || '';
        if (!orderBatch.toLowerCase().includes(options.batchNumber.toLowerCase())) {
          return false;
        }
      }

      // Date range filter
      if (!this.isDateInRange(ord.orderDate, options)) {
        return false;
      }

      // Search Filter
      if (query) {
        const itemNames = (ord.items || []).map((i: any) => i.name || i.productName || i.productTitle || '').join(' ').toLowerCase();
        const matchRef = (ord.referenceNumber || '').toLowerCase().includes(query);
        const matchId = (ord.id || '').toLowerCase().includes(query);
        const matchCustomer = (ord.customerName || '').toLowerCase().includes(query);
        const matchEmail = (ord.customerEmail || '').toLowerCase().includes(query);
        const matchBatch = (ord.assignedBatch || ord.groupBuyData?.batchNumber || '').toLowerCase().includes(query);
        const matchItems = itemNames.includes(query);

        if (!matchRef && !matchId && !matchCustomer && !matchEmail && !matchBatch && !matchItems) {
          return false;
        }
      }

      return true;
    }).map((ord) => {
      // Standardize order prices into PHP & USD
      let grandTotalPhp = ord.grandTotal;
      if (grandTotalPhp < 5000) {
        // Stored in USD, convert to PHP
        grandTotalPhp = ord.grandTotal * rate;
      }
      const grandTotalUsd = grandTotalPhp / rate;

      // Direct Product Procurement Cost estimated at ~42% of revenue
      const directCostPhp = grandTotalPhp * 0.42;
      const directCostUsd = directCostPhp / rate;

      return {
        ...ord,
        grandTotalPhp,
        grandTotalUsd,
        directCostPhp,
        directCostUsd,
      };
    });
  }

  /**
   * Get filtered expenses based on options
   */
  private getFilteredExpenses(options: FinanceFilterOptions): ExpenseItem[] {
    // If filtering purely for Revenue, return no expenses
    if (options.transactionType === 'Revenue' || options.transactionType === 'Refund') {
      return [];
    }

    const allExpenses = this.getExpenses();
    const query = (options.search || '').trim().toLowerCase();

    return allExpenses.filter((exp) => {
      // Category filter
      if (options.expenseCategory && options.expenseCategory !== 'all' && exp.category !== options.expenseCategory) {
        return false;
      }

      // Store filter
      if (
        options.storeType !== 'all' &&
        exp.storeType &&
        exp.storeType !== 'all' &&
        exp.storeType !== options.storeType
      ) {
        return false;
      }

      // Batch filter
      if (
        options.batchNumber !== 'all' &&
        exp.batchNumber &&
        exp.batchNumber !== 'all' &&
        !exp.batchNumber.toLowerCase().includes(options.batchNumber.toLowerCase())
      ) {
        return false;
      }

      // Date filter
      if (!this.isDateInRange(exp.date, options)) {
        return false;
      }

      // Search filter
      if (query) {
        const matchName = (exp.name || '').toLowerCase().includes(query);
        const matchId = (exp.id || '').toLowerCase().includes(query);
        const matchCat = (exp.category || '').toLowerCase().includes(query);
        const matchNotes = (exp.notes || '').toLowerCase().includes(query);
        const matchBatch = (exp.batchNumber || '').toLowerCase().includes(query);
        const matchRecorder = (exp.recordedBy || '').toLowerCase().includes(query);

        if (!matchName && !matchId && !matchCat && !matchNotes && !matchBatch && !matchRecorder) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get Comprehensive Financial Overview
   */
  public async getOverview(options: FinanceFilterOptions): Promise<{
    overview: FinanceOverview;
    batchProfitability: GroupBuyBatchProfitability[];
    monthlyPerformance: MonthlyPerformance[];
    ledgerEntries: FinanceLedgerEntry[];
    expenses: ExpenseItem[];
  }> {
    const rate = this.getUsdRate();
    const filteredOrders = await this.getFilteredOrders(options);
    const filteredExpenses = this.getFilteredExpenses(options);

    // Calculate totals
    const totalRevenuePhp = filteredOrders.reduce((sum, o) => sum + o.grandTotalPhp, 0);
    const totalRevenueUsd = totalRevenuePhp / rate;

    const totalCostsPhp = filteredOrders.reduce((sum, o) => sum + o.directCostPhp, 0);
    const totalCostsUsd = totalCostsPhp / rate;

    const totalExpensesPhp = filteredExpenses.reduce((sum, e) => sum + e.amountPhp, 0);
    const totalExpensesUsd = totalExpensesPhp / rate;

    const netProfitPhp = totalRevenuePhp - totalCostsPhp - totalExpensesPhp;
    const netProfitUsd = netProfitPhp / rate;

    const profitMarginPercent =
      totalRevenuePhp > 0 ? (netProfitPhp / totalRevenuePhp) * 100 : 0;

    // Calculate Store Profitability Comparison (GroupBuy, OnHand, MOQ)
    const storeTypes: Array<'groupbuy' | 'onhand' | 'moq'> = ['groupbuy', 'onhand', 'moq'];
    const storeProfitability = storeTypes.map((st) => {
      const storeOrders = filteredOrders.filter((o) => o.storeType === st);
      const storeExpenses = filteredExpenses.filter((e) => e.storeType === st);

      const stRev = storeOrders.reduce((sum, o) => sum + o.grandTotalPhp, 0);
      const stCosts = storeOrders.reduce((sum, o) => sum + o.directCostPhp, 0);
      const stExp = storeExpenses.reduce((sum, e) => sum + e.amountPhp, 0);
      const stNet = stRev - stCosts - stExp;
      const stMargin = stRev > 0 ? (stNet / stRev) * 100 : 0;

      const storeNameMap = {
        groupbuy: 'GroupBuy Channel',
        onhand: 'OnHand Channel',
        moq: 'MOQ Bulk Channel',
      };

      return {
        storeType: st,
        storeName: storeNameMap[st],
        orderCount: storeOrders.length,
        revenuePhp: Math.round(stRev),
        revenueUsd: Math.round(stRev / rate),
        directCostPhp: Math.round(stCosts),
        expensesPhp: Math.round(stExp),
        netProfitPhp: Math.round(stNet),
        profitMarginPercent: Math.round(stMargin * 10) / 10,
      };
    });

    const overview: FinanceOverview = {
      totalRevenuePhp,
      totalRevenueUsd,
      totalCostsPhp,
      totalCostsUsd,
      totalExpensesPhp,
      totalExpensesUsd,
      netProfitPhp,
      netProfitUsd,
      profitMarginPercent: Math.round(profitMarginPercent * 10) / 10,
      totalOrdersCount: filteredOrders.length,
      usdToPhpRate: rate,
      storeProfitability,
    };

    // Calculate GroupBuy Batch Profitability (MUST ONLY INCLUDE GroupBuy orders!)
    const groupBuyOrders = filteredOrders.filter((o) => o.storeType === 'groupbuy');
    const batchMap = new Map<string, GroupBuyBatchProfitability>();

    // Seed known batches
    const knownBatches = [
      {
        id: 'gb-batch-1',
        number: 'GB-2026-08A',
        title: 'Batch #1 Allocation',
        openingDate: '2026-08-01',
        closingDate: '2026-08-20',
        status: 'Open',
      },
      {
        id: 'gb-batch-2',
        number: 'GB-2026-08B',
        title: 'Batch #2 Special Run',
        openingDate: '2026-07-15',
        closingDate: '2026-07-31',
        status: 'Closed',
      },
      {
        id: 'gb-batch-3',
        number: 'GB-2026-07C',
        title: 'Batch #3 Vault Reserve',
        openingDate: '2026-07-01',
        closingDate: '2026-07-14',
        status: 'Closed',
      },
    ];

    knownBatches.forEach((b) => {
      batchMap.set(b.number, {
        batchId: b.id,
        batchNumber: b.number,
        batchTitle: b.title,
        openingDate: b.openingDate,
        closingDate: b.closingDate,
        status: b.status,
        orderCount: 0,
        vialsSold: 0,
        revenuePhp: 0,
        revenueUsd: 0,
        directCostPhp: 0,
        expensesPhp: 0,
        netProfitPhp: 0,
        profitMarginPercent: 0,
      });
    });

    // Populate batch orders (GroupBuy only)
    groupBuyOrders.forEach((o) => {
      const bKey = o.assignedBatch || o.groupBuyData?.batchNumber || 'GB-2026-08A';
      if (!batchMap.has(bKey)) {
        batchMap.set(bKey, {
          batchId: `gb-${bKey}`,
          batchNumber: bKey,
          batchTitle: `GroupBuy ${bKey}`,
          openingDate: '2026-08-01',
          closingDate: '2026-08-20',
          status: 'Active',
          orderCount: 0,
          vialsSold: 0,
          revenuePhp: 0,
          revenueUsd: 0,
          directCostPhp: 0,
          expensesPhp: 0,
          netProfitPhp: 0,
          profitMarginPercent: 0,
        });
      }

      const b = batchMap.get(bKey)!;
      b.orderCount += 1;
      const vialCount = (o.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
      b.vialsSold += vialCount;
      b.revenuePhp += o.grandTotalPhp;
      b.directCostPhp += o.directCostPhp;
    });

    // Populate batch expenses
    filteredExpenses.forEach((exp) => {
      if (exp.batchNumber && exp.batchNumber !== 'all') {
        const b = batchMap.get(exp.batchNumber);
        if (b) {
          b.expensesPhp += exp.amountPhp;
        }
      }
    });

    // Calculate net profits and margins per batch
    const batchProfitability: GroupBuyBatchProfitability[] = Array.from(batchMap.values()).map(
      (b) => {
        const revUsd = b.revenuePhp / rate;
        const netProfit = b.revenuePhp - b.directCostPhp - b.expensesPhp;
        const margin = b.revenuePhp > 0 ? (netProfit / b.revenuePhp) * 100 : 0;
        return {
          ...b,
          revenueUsd: Math.round(revUsd),
          netProfitPhp: Math.round(netProfit),
          profitMarginPercent: Math.round(margin * 10) / 10,
        };
      }
    );

    // Monthly Performance Grouping
    const monthlyMap = new Map<string, MonthlyPerformance>();

    filteredOrders.forEach((o) => {
      const dateObj = new Date(o.orderDate);
      const ym = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!monthlyMap.has(ym)) {
        monthlyMap.set(ym, {
          yearMonth: ym,
          label: monthName,
          revenuePhp: 0,
          costsPhp: 0,
          expensesPhp: 0,
          netProfitPhp: 0,
          marginPercent: 0,
          orderCount: 0,
        });
      }

      const m = monthlyMap.get(ym)!;
      m.revenuePhp += o.grandTotalPhp;
      m.costsPhp += o.directCostPhp;
      m.orderCount += 1;
    });

    filteredExpenses.forEach((exp) => {
      const dateObj = new Date(exp.date);
      const ym = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!monthlyMap.has(ym)) {
        monthlyMap.set(ym, {
          yearMonth: ym,
          label: monthName,
          revenuePhp: 0,
          costsPhp: 0,
          expensesPhp: 0,
          netProfitPhp: 0,
          marginPercent: 0,
          orderCount: 0,
        });
      }

      const m = monthlyMap.get(ym)!;
      m.expensesPhp += exp.amountPhp;
    });

    const monthlyPerformance: MonthlyPerformance[] = Array.from(monthlyMap.values())
      .sort((a, b) => b.yearMonth.localeCompare(a.yearMonth))
      .map((m) => {
        const netProfit = m.revenuePhp - m.costsPhp - m.expensesPhp;
        const margin = m.revenuePhp > 0 ? (netProfit / m.revenuePhp) * 100 : 0;
        return {
          ...m,
          netProfitPhp: Math.round(netProfit),
          marginPercent: Math.round(margin * 10) / 10,
        };
      });

    // Ledger Entries with full source traceability
    const ledgerEntries: FinanceLedgerEntry[] = [];

    filteredOrders.forEach((o) => {
      const netProfit = o.grandTotalPhp - o.directCostPhp;
      ledgerEntries.push({
        id: `led-ord-${o.id}`,
        date: o.orderDate.split('T')[0],
        referenceNumber: o.referenceNumber,
        type: 'Revenue',
        storeType: o.storeType === 'groupbuy' ? 'groupbuy' : o.storeType === 'onhand' ? 'onhand' : 'moq',
        batchNumber: o.assignedBatch || o.groupBuyData?.batchNumber || 'N/A',
        description: `Order ${o.referenceNumber} - ${o.customerName} (${(o.items || []).length} items)`,
        revenuePhp: Math.round(o.grandTotalPhp),
        costPhp: Math.round(o.directCostPhp),
        expensePhp: 0,
        netProfitPhp: Math.round(netProfit),
        status: o.paymentStatus || 'VERIFIED',
        sourceType: 'order',
        sourceId: o.id,
        sourceRef: o.referenceNumber,
        customerName: o.customerName,
      });
    });

    filteredExpenses.forEach((exp) => {
      ledgerEntries.push({
        id: `led-exp-${exp.id}`,
        date: exp.date,
        referenceNumber: `EXP-${exp.id.toUpperCase()}`,
        type: 'Expense',
        storeType: exp.storeType === 'groupbuy' ? 'groupbuy' : exp.storeType === 'onhand' ? 'onhand' : 'General',
        batchNumber: exp.batchNumber || 'General',
        description: `Expense: ${exp.name} [${exp.category}] - ${exp.notes || ''}`,
        revenuePhp: 0,
        costPhp: 0,
        expensePhp: Math.round(exp.amountPhp),
        netProfitPhp: Math.round(-exp.amountPhp),
        status: 'RECORDED',
        sourceType: 'expense',
        sourceId: exp.id,
        sourceRef: exp.id,
        customerName: exp.recordedBy || 'Admin Operations',
      });
    });

    ledgerEntries.sort((a, b) => b.date.localeCompare(a.date));

    return {
      overview,
      batchProfitability,
      monthlyPerformance,
      ledgerEntries,
      expenses: filteredExpenses,
    };
  }
}

export const financeService = new FinanceService();
