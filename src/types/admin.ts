export type SystemHealthStatus = 'operational' | 'degraded' | 'maintenance' | 'offline';

export interface AdminHeaderData {
  welcomeMessage: string;
  adminUser: {
    name: string;
    role: string;
    avatarUrl?: string;
    level: string;
  };
  unreadNotificationsCount: number;
  systemStatus: SystemHealthStatus;
  lastBackupTime: string;
}

export interface AdminSummaryMetric {
  id: string;
  title: string;
  subtitle: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    period: string;
  };
  iconName: 'ShoppingCart' | 'CreditCard' | 'Layers' | 'Box' | 'Factory' | 'Users' | 'DollarSign' | 'TrendingDown';
  accent: 'cyan' | 'purple' | 'magenta' | 'emerald' | 'amber' | 'rose';
  path?: string;
}

export interface AdminQuickActionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: 'Package' | 'ShoppingCart' | 'Users' | 'CreditCard' | 'Truck' | 'Globe' | 'BookOpen' | 'Folder' | 'TrendingUp';
  path: string;
  badge?: string;
  accent: 'cyan' | 'purple' | 'magenta' | 'emerald' | 'amber';
}

export type ActivityEventType =
  | 'New Order'
  | 'Payment Uploaded'
  | 'Inventory Updated'
  | 'Customer Registered'
  | 'Website Updated'
  | 'MOQ Target Reached'
  | 'GroupBuy Batch Closed';

export interface AdminActivityItem {
  id: string;
  eventType: ActivityEventType;
  title: string;
  detail: string;
  timestamp: string;
  actor: string;
  status?: 'success' | 'warning' | 'info' | 'pending';
  linkPath?: string;
}

export interface AdminSystemHealth {
  database: {
    name: string;
    status: SystemHealthStatus;
    latencyMs: number;
    provider: string;
    details: string;
  };
  storage: {
    name: string;
    status: SystemHealthStatus;
    usedGb: number;
    totalGb: number;
    percentUsed: number;
    provider: string;
  };
  authentication: {
    name: string;
    status: SystemHealthStatus;
    activeSessions: number;
    provider: string;
  };
  realtime: {
    name: string;
    status: SystemHealthStatus;
    connections: number;
    channel: string;
  };
  version: {
    appName: string;
    version: string;
    buildEnvironment: string;
    lastDeployed: string;
  };
}

export interface AdminAlertItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  linkPath: string;
  severity: 'warning' | 'info' | 'urgent' | 'success';
}

export interface AdminDashboardData {
  header: AdminHeaderData;
  metrics: AdminSummaryMetric[];
  quickActions: AdminQuickActionItem[];
  activities: AdminActivityItem[];
  alerts: AdminAlertItem[];
  systemHealth: AdminSystemHealth;
}
