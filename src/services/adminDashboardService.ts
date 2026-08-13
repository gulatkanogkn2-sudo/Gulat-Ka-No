import {
  AdminDashboardData,
  AdminHeaderData,
  AdminSummaryMetric,
  AdminQuickActionItem,
  AdminActivityItem,
  AdminAlertItem,
  AdminSystemHealth,
} from '../types/admin';
import { financeService } from './financeService';

let currentAlerts: AdminAlertItem[] = [
  {
    id: 'alt-1',
    type: 'Pending Payment',
    title: '14 Unverified Payments',
    description: '14 customer payment proofs submitted awaiting admin verification.',
    timestamp: '10 mins ago',
    isRead: false,
    linkPath: '/admin/payments',
    severity: 'urgent',
  },
  {
    id: 'alt-2',
    type: 'New Order',
    title: 'New Order #GKN-8924',
    description: 'Order placed for Tirzepatide 10mg Box & BPC-157 Vials (₱24,500.00).',
    timestamp: '25 mins ago',
    isRead: false,
    linkPath: '/admin/orders',
    severity: 'info',
  },
  {
    id: 'alt-3',
    type: 'Low OnHand Stock',
    title: 'Retatrutide 10mg Low Stock',
    description: 'OnHand inventory is down to 12 vials remaining in Cold Vault A3.',
    timestamp: '1 hour ago',
    isRead: false,
    linkPath: '/admin/stores/onhand',
    severity: 'warning',
  },
  {
    id: 'alt-4',
    type: 'GroupBuy Batch Update',
    title: 'GroupBuy Batch #1 at 82%',
    description: 'Current Batch #1 is reaching target capacity (82% fulfilled).',
    timestamp: '2 hours ago',
    isRead: true,
    linkPath: '/admin/stores/groupbuy',
    severity: 'info',
  },
  {
    id: 'alt-5',
    type: 'MOQ Target Reached',
    title: 'MOQ BPC-157 Target Reached',
    description: 'MOQ order threshold fulfilled (100/100 Trays). Ready for processing.',
    timestamp: '3 hours ago',
    isRead: true,
    linkPath: '/admin/stores/moq',
    severity: 'success',
  },
];

// In-memory admin state model prepared for future live DB / API integration
let currentHeaderData: AdminHeaderData = {
  welcomeMessage: 'Welcome back, Administrator',
  adminUser: {
    name: 'GKN Admin Team',
    role: 'Operations Administrator',
    level: 'System Admin',
  },
  unreadNotificationsCount: currentAlerts.filter(a => !a.isRead).length,
  systemStatus: 'operational',
  lastBackupTime: 'Today at 02:00 UTC',
};

const defaultSummaryMetrics: AdminSummaryMetric[] = [
  {
    id: 'total-orders',
    title: 'Total Orders',
    subtitle: 'Cumulative store orders',
    value: '1,248',
    subValue: '18 new today',
    trend: { value: '+14.2%', isPositive: true, period: 'vs last month' },
    iconName: 'ShoppingCart',
    accent: 'cyan',
    path: '/admin/orders',
  },
  {
    id: 'pending-payments',
    title: 'Pending Payments',
    subtitle: 'Awaiting verification',
    value: '14',
    subValue: '₱242,500.00 unconfirmed',
    trend: { value: '-3 items', isPositive: true, period: 'since yesterday' },
    iconName: 'CreditCard',
    accent: 'amber',
    path: '/admin/payments',
  },
  {
    id: 'active-groupbuy',
    title: 'Active GroupBuy Batch',
    subtitle: 'Batch Run',
    value: '82%',
    subValue: 'Batch #GB-2026-08',
    trend: { value: '+8% today', isPositive: true, period: 'towards target' },
    iconName: 'Layers',
    accent: 'purple',
    path: '/admin/stores/groupbuy',
  },
  {
    id: 'onhand-inventory',
    title: 'OnHand Inventory',
    subtitle: 'In-stock inventory',
    value: '3,450',
    subValue: '48 SKUs available',
    trend: { value: '99.8%', isPositive: true, period: 'fulfillment rate' },
    iconName: 'Box',
    accent: 'cyan',
    path: '/admin/stores/onhand',
  },
  {
    id: 'moq-campaigns',
    title: 'MOQ Orders',
    subtitle: 'Minimum order thresholds',
    value: '8',
    subValue: '74% avg completion',
    trend: { value: '2 reaching 100%', isPositive: true, period: 'this week' },
    iconName: 'Factory',
    accent: 'magenta',
    path: '/admin/stores/moq',
  },
  {
    id: 'total-customers',
    title: 'Total Customers',
    subtitle: 'Registered customer accounts',
    value: '832',
    subValue: '12 new registrations',
    trend: { value: '+9.4%', isPositive: true, period: 'this month' },
    iconName: 'Users',
    accent: 'emerald',
    path: '/admin/customers',
  },
  {
    id: 'revenue-summary',
    title: 'Revenue Summary',
    subtitle: 'Gross sales & revenue',
    value: '₱1,245,800',
    subValue: 'Primary revenue tracker',
    trend: { value: '+18.6%', isPositive: true, period: 'vs target' },
    iconName: 'DollarSign',
    accent: 'emerald',
    path: '/admin/finance?tab=overview',
  },
  {
    id: 'recent-expenses',
    title: 'Recent Expenses',
    subtitle: 'Recorded business expenses',
    value: '₱46,910',
    subValue: 'Shipping, packaging & fees',
    trend: { value: 'Managed', isPositive: true, period: 'recorded' },
    iconName: 'TrendingDown',
    accent: 'rose',
    path: '/admin/finance?tab=expenses',
  },
];

const defaultQuickActions: AdminQuickActionItem[] = [
  {
    id: 'action-products',
    title: 'Products',
    description: 'Manage GroupBuy, OnHand & MOQ inventory catalogs',
    category: 'Inventory',
    iconName: 'Package',
    path: '/admin/stores',
    badge: '3 Stores',
    accent: 'purple',
  },
  {
    id: 'action-orders',
    title: 'Orders',
    description: 'Process, fulfill & track orders',
    category: 'Sales',
    iconName: 'ShoppingCart',
    path: '/admin/orders',
    badge: '14 Pending',
    accent: 'cyan',
  },
  {
    id: 'action-customers',
    title: 'Customers',
    description: 'Review accounts & profiles',
    category: 'Users',
    iconName: 'Users',
    path: '/admin/customers',
    badge: '832 Total',
    accent: 'emerald',
  },
  {
    id: 'action-payments',
    title: 'Payments',
    description: 'Verify payment proofs and logs',
    category: 'Finance',
    iconName: 'CreditCard',
    path: '/admin/payments',
    badge: 'Action Needed',
    accent: 'amber',
  },
  {
    id: 'action-shipping',
    title: 'Shipping',
    description: 'Dispatch & courier tracking dispatch',
    category: 'Logistics',
    iconName: 'Truck',
    path: '/admin/shipping',
    badge: 'Cold Chain',
    accent: 'cyan',
  },
  {
    id: 'action-website',
    title: 'Website',
    description: 'Update banners, announcements & CMS',
    category: 'CMS',
    iconName: 'Globe',
    path: '/admin/website',
    badge: 'Live',
    accent: 'magenta',
  },
  {
    id: 'action-research',
    title: 'Research Library',
    description: 'Upload COA certificates & protocols',
    category: 'Documentation',
    iconName: 'BookOpen',
    path: '/admin/research-library',
    badge: 'COA Vault',
    accent: 'purple',
  },
  {
    id: 'action-media',
    title: 'Media Library',
    description: 'Manage branding assets & product images',
    category: 'Assets',
    iconName: 'Folder',
    path: '/admin/media',
    badge: 'Assets',
    accent: 'cyan',
  },
  {
    id: 'action-finance',
    title: 'Finance',
    description: 'Revenue analysis & expense logs',
    category: 'Accounting',
    iconName: 'TrendingUp',
    path: '/admin/finance',
    badge: 'Reports',
    accent: 'emerald',
  },
];

const defaultRecentActivities: AdminActivityItem[] = [
  {
    id: 'act-101',
    eventType: 'New Order',
    title: 'New Research Order #GKN-8924 Placed',
    detail: 'Order for 1x Tirzepatide 10mg Box & 2x BPC-157 Vials (₱24,500.00)',
    timestamp: '5 minutes ago',
    actor: 'Dr. Sarah Lin',
    status: 'info',
    linkPath: '/admin/orders',
  },
  {
    id: 'act-102',
    eventType: 'Payment Uploaded',
    title: 'USDT Crypto Payment Proof Uploaded',
    detail: 'TxID: 0x8aef...41b2 attached to Order #GKN-8919 (₱12,500.00)',
    timestamp: '18 minutes ago',
    actor: 'Research Lab #402',
    status: 'warning',
    linkPath: '/admin/payments',
  },
  {
    id: 'act-103',
    eventType: 'MOQ Target Reached',
    title: 'MOQ Campaign #MOQ-BPC-100 Reached 100%',
    detail: 'Quota fulfilled (100/100 Trays). Synthesis run scheduled.',
    timestamp: '1 hour ago',
    actor: 'System Automated Engine',
    status: 'success',
    linkPath: '/admin/stores/moq',
  },
  {
    id: 'act-104',
    eventType: 'Inventory Updated',
    title: 'OnHand Cold Vault Stock Restocked',
    detail: '+250 Vials Retatrutide 10mg verified and cataloged in Vault A3',
    timestamp: '2 hours ago',
    actor: 'Vault Supervisor Mark R.',
    status: 'success',
    linkPath: '/admin/stores/onhand',
  },
  {
    id: 'act-105',
    eventType: 'Customer Registered',
    title: 'New Account Verified',
    detail: 'Apex BioLabs LLC approved for purchasing tier',
    timestamp: '3 hours ago',
    actor: 'Admin Team',
    status: 'success',
    linkPath: '/admin/customers',
  },
  {
    id: 'act-106',
    eventType: 'Website Updated',
    title: 'Homepage Banner Announcement Updated',
    detail: 'Published notice: "Batch Run #GB-2026-08 closing in 48 hours"',
    timestamp: '5 hours ago',
    actor: 'Dr. Alex Vance',
    status: 'info',
    linkPath: '/admin/website',
  },
];

const defaultSystemHealth: AdminSystemHealth = {
  database: {
    name: 'PostgreSQL Engine',
    status: 'operational',
    latencyMs: 14,
    provider: 'Cloud SQL Engine',
    details: 'Primary replica synchronized, zero replication lag.',
  },
  storage: {
    name: 'High-Speed Object Storage',
    status: 'operational',
    usedGb: 4.2,
    totalGb: 100,
    percentUsed: 4.2,
    provider: 'S3 Cold Storage & Asset Vault',
  },
  authentication: {
    name: 'Identity & JWT Auth Service',
    status: 'operational',
    activeSessions: 42,
    provider: 'GKN Identity Provider v2',
  },
  realtime: {
    name: 'WebSocket Engine & Event Bus',
    status: 'operational',
    connections: 18,
    channel: 'gkn-system-bus-live',
  },
  version: {
    appName: 'GKN V2 Operations Suite',
    version: '2.0.0-foundation',
    buildEnvironment: 'Production Cloud Container',
    lastDeployed: 'Aug 05, 2026 – 02:45 UTC',
  },
};

export const AdminDashboardService = {
  /**
   * Get all Admin Dashboard data in a single call
   */
  async getDashboardData(): Promise<AdminDashboardData> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const unreadCount = currentAlerts.filter(a => !a.isRead).length;
    currentHeaderData.unreadNotificationsCount = unreadCount;

    let computedMetrics = [...defaultSummaryMetrics];
    try {
      const finData = await financeService.getOverview({
        dateRange: 'all_time',
        storeType: 'all',
        batchNumber: 'all',
        transactionType: 'all',
        expenseCategory: 'all',
        search: '',
      });

      computedMetrics = defaultSummaryMetrics.map((m) => {
        if (m.id === 'revenue-summary') {
          return {
            ...m,
            value: `₱${Math.round(finData.overview.totalRevenuePhp).toLocaleString('en-US')}`,
            subValue: `$${Math.round(finData.overview.totalRevenueUsd).toLocaleString('en-US')} USD revenue`,
            path: '/admin/finance?tab=overview',
          };
        }
        if (m.id === 'recent-expenses') {
          return {
            ...m,
            value: `₱${Math.round(finData.overview.totalExpensesPhp).toLocaleString('en-US')}`,
            subValue: `$${Math.round(finData.overview.totalExpensesUsd).toLocaleString('en-US')} USD recorded expenses`,
            path: '/admin/finance?tab=expenses',
          };
        }
        return m;
      });
    } catch (err) {
      console.error('[AdminDashboardService] Error fetching finance overview:', err);
    }

    return {
      header: { ...currentHeaderData },
      metrics: computedMetrics,
      quickActions: [...defaultQuickActions],
      activities: [...defaultRecentActivities],
      alerts: [...currentAlerts],
      systemHealth: { ...defaultSystemHealth },
    };
  },

  async getAlerts(): Promise<AdminAlertItem[]> {
    return [...currentAlerts];
  },

  async markAlertAsRead(id: string): Promise<AdminAlertItem[]> {
    currentAlerts = currentAlerts.map(a => a.id === id ? { ...a, isRead: true } : a);
    currentHeaderData.unreadNotificationsCount = currentAlerts.filter(a => !a.isRead).length;
    return [...currentAlerts];
  },

  async markAllAlertsAsRead(): Promise<AdminAlertItem[]> {
    currentAlerts = currentAlerts.map(a => ({ ...a, isRead: true }));
    currentHeaderData.unreadNotificationsCount = 0;
    return [...currentAlerts];
  },

  /**
   * Get Header Info
   */
  async getHeaderInfo(): Promise<AdminHeaderData> {
    const unreadCount = currentAlerts.filter(a => !a.isRead).length;
    currentHeaderData.unreadNotificationsCount = unreadCount;
    return { ...currentHeaderData };
  },

  /**
   * Get Summary Metrics
   */
  async getMetrics(): Promise<AdminSummaryMetric[]> {
    return [...defaultSummaryMetrics];
  },

  /**
   * Get Quick Actions
   */
  async getQuickActions(): Promise<AdminQuickActionItem[]> {
    return [...defaultQuickActions];
  },

  /**
   * Get Recent Activities
   */
  async getRecentActivities(): Promise<AdminActivityItem[]> {
    return [...defaultRecentActivities];
  },

  /**
   * Get System Health Status
   */
  async getSystemHealth(): Promise<AdminSystemHealth> {
    return { ...defaultSystemHealth };
  },

  async updateAdminHeader(updates: Partial<AdminHeaderData>): Promise<AdminHeaderData> {
    currentHeaderData = { ...currentHeaderData, ...updates };
    return { ...currentHeaderData };
  },
};

