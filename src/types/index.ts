export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'VIEWER';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  createdAt: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  badge?: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export type StoreType = 'groupbuy' | 'onhand' | 'moq' | 'GroupBuy' | 'OnHand' | 'MOQ';

export * from './paymentVerification';
export * from './shipping';
export * from './websiteManager';
export * from './finance';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
