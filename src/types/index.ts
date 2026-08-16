export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'VIEWER';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  preferredName?: string;
  phone?: string;
  birthDate?: string;
  primaryAddress?: string;
  cityProvince?: string;
  avatarUrl?: string;
  role: UserRole;
  status?: string;
  tier?: string;
  customerCode?: string;
  verificationStatus?: string;
  qualifyingLifetimeSpendingPhp?: number;
  rewardPoints?: number;
  createdAt: string;
  updatedAt?: string;
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
