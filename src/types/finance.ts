export type ExpenseCategory =
  | 'Shipping'
  | 'Procurement'
  | 'Packaging'
  | 'Laboratory / Testing'
  | 'Payment Fees'
  | 'Other';

export interface ExpenseItem {
  id: string;
  name: string;
  amountPhp: number;
  date: string;
  category: ExpenseCategory;
  notes?: string;
  recordedBy?: string;
  batchNumber?: string;
  storeType?: 'groupbuy' | 'onhand' | 'moq' | 'all';
}

export interface FinanceOverview {
  totalRevenuePhp: number;
  totalRevenueUsd: number;
  totalCostsPhp: number;
  totalCostsUsd: number;
  totalExpensesPhp: number;
  totalExpensesUsd: number;
  netProfitPhp: number;
  netProfitUsd: number;
  profitMarginPercent: number;
  totalOrdersCount: number;
  usdToPhpRate: number;
  storeProfitability: StoreProfitability[];
}

export interface StoreProfitability {
  storeType: 'groupbuy' | 'onhand' | 'moq';
  storeName: string;
  orderCount: number;
  revenuePhp: number;
  revenueUsd: number;
  directCostPhp: number;
  expensesPhp: number;
  netProfitPhp: number;
  profitMarginPercent: number;
}

export interface GroupBuyBatchProfitability {
  batchId: string;
  batchNumber: string;
  batchTitle: string;
  openingDate: string;
  closingDate: string;
  status: string;
  orderCount: number;
  vialsSold: number;
  revenuePhp: number;
  revenueUsd: number;
  directCostPhp: number;
  expensesPhp: number;
  netProfitPhp: number;
  profitMarginPercent: number;
}

export interface MonthlyPerformance {
  yearMonth: string; // e.g. "2026-08"
  label: string; // e.g. "August 2026"
  revenuePhp: number;
  costsPhp: number;
  expensesPhp: number;
  netProfitPhp: number;
  marginPercent: number;
  orderCount: number;
}

export type TransactionType = 'all' | 'Revenue' | 'Expense' | 'Adjustment' | 'Refund';

export interface FinanceLedgerEntry {
  id: string;
  date: string;
  referenceNumber: string;
  type: 'Revenue' | 'Expense' | 'Adjustment' | 'Refund';
  storeType: 'groupbuy' | 'onhand' | 'moq' | 'General';
  batchNumber?: string;
  description: string;
  revenuePhp: number;
  costPhp: number;
  expensePhp: number;
  netProfitPhp: number;
  status: string;
  sourceType?: 'order' | 'expense' | 'system';
  sourceId?: string;
  sourceRef?: string;
  customerName?: string;
}

export type DateFilterOption = 'today' | 'this_week' | 'this_month' | 'last_month' | 'all_time' | 'custom';

export interface FinanceFilterOptions {
  dateRange: DateFilterOption;
  startDate?: string;
  endDate?: string;
  storeType: 'all' | 'groupbuy' | 'onhand' | 'moq';
  batchNumber: 'all' | string;
  transactionType: TransactionType;
  expenseCategory: 'all' | ExpenseCategory;
  search: string;
}

