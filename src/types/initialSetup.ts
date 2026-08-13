export type HealthStatusLevel = 'pass' | 'warning' | 'error' | 'pending';

export interface HealthCheckResult {
  id: string;
  name: string;
  category: 'database' | 'auth' | 'storage' | 'policies' | 'tables' | 'buckets' | 'realtime';
  status: HealthStatusLevel;
  latencyMs?: number;
  message: string;
  details?: string;
  recommendation?: string;
}

export interface DataInitCheckResult {
  module: string;
  name: string;
  count: number;
  status: 'initialized' | 'empty' | 'warning';
  description: string;
}

export interface SecurityCheckResult {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'error';
  description: string;
  details: string;
}

export interface DeploymentCheckItem {
  id: string;
  title: string;
  category:
    | 'auth'
    | 'database'
    | 'storage'
    | 'media'
    | 'website'
    | 'research'
    | 'orders'
    | 'products'
    | 'payments'
    | 'shipping'
    | 'settings'
    | 'env'
    | 'build';
  status: 'completed' | 'pending' | 'warning' | 'error';
  description: string;
  isRequired: boolean;
}

export interface RoleDefinition {
  roleId: string;
  roleName: string;
  description: string;
  level: number;
  permissions: string[];
  userCount: number;
  isSystemDefault: boolean;
}

export interface SetupData {
  companyName: string;
  brandName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword?: string;
  defaultCurrency: string;
  defaultTimezone: string;
  defaultLanguage: string;
  initialStores: {
    groupBuyEnabled: boolean;
    onHandEnabled: boolean;
    moqEnabled: boolean;
  };
  initializedAt?: string;
  version?: string;
}

export interface ReadinessReport {
  scorePercentage: number;
  overallStatus: 'ready' | 'warning' | 'error';
  passedCount: number;
  warningCount: number;
  errorCount: number;
  totalChecks: number;
  timestamp: string;
  checks: Array<{
    id: string;
    name: string;
    category: string;
    status: 'pass' | 'warning' | 'error';
    message: string;
    recommendation?: string;
  }>;
  summaryText: string;
}

export interface SupabaseConnectionStatus {
  authConnected: boolean;
  dbConnected: boolean;
  storageConnected: boolean;
  realtimeConnected: boolean;
  envValidated: boolean;
  supabaseUrl: string;
  anonKeyPresent: boolean;
  serviceRoleKeyPresent: boolean;
  details: {
    authMessage: string;
    dbMessage: string;
    storageMessage: string;
    realtimeMessage: string;
    envMessage: string;
  };
}
