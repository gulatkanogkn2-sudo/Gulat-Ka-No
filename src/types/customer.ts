export type CustomerAccountStatus =
  | 'ACTIVE'
  | 'PENDING_VERIFICATION'
  | 'SUSPENDED'
  | 'DISABLED'
  | 'BANNED';

export type CustomerTier =
  | 'STANDARD'
  | 'SILVER'
  | 'GOLD'
  | 'VIP'
  | 'ADMINISTRATOR'
  | 'OWNER';

export type CustomerVerificationStatus =
  | 'VERIFIED'
  | 'UNVERIFIED'
  | 'PENDING_ID'
  | 'REJECTED';

export interface CustomerAddress {
  id: string;
  isDefault: boolean;
  type: 'SHIPPING' | 'BILLING' | 'BOTH';
  label?: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface CustomerBillingInfo {
  preferredPaymentMethod: string;
  taxId?: string;
  billingAddress?: CustomerAddress;
  currencyPreference: string;
}

export interface CustomerWishlistItem {
  id: string;
  productId: string;
  productName: string;
  casNumber?: string;
  addedDate: string;
  storeType: 'groupbuy' | 'onhand' | 'moq' | string;
  estimatedPrice?: number;
}

export interface CustomerRewardPoints {
  currentBalance: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  tierProgressPercentage: number;
  nextTier: CustomerTier | null;
}

export interface CustomerAdminNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface CustomerLoginActivity {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  status: 'SUCCESS' | 'FAILED' | '2FA_CHALLENGE';
}

export interface CustomerOrderSummary {
  id: string;
  referenceNumber: string;
  orderDate: string;
  status: string;
  grandTotal: number;
  storeType: 'groupbuy' | 'onhand' | 'moq' | 'mixed';
  itemCount: number;
  itemsSummary?: string;
}

export interface CustomerStats {
  lifetimeSpending: number;
  ordersCompleted: number;
  totalOrders: number;
  averageOrderValue: number;
  favoriteStore: 'GroupBuy' | 'OnHand Vault' | 'MOQ Bulk' | 'N/A';
  mostPurchasedProduct: string;
  lastPurchaseDate: string;
}

export interface CustomerDetail {
  id: string;
  customerCode: string;
  name: string;
  email: string;
  phone: string;
  companyOrInstitution?: string;
  avatarUrl?: string;
  registrationDate: string;
  lastLoginDate: string;
  status: CustomerAccountStatus;
  tier: CustomerTier;
  isManualTierOverride?: boolean;
  qualifyingLifetimeSpending?: number;
  verificationStatus: CustomerVerificationStatus;
  kycDocStatus?: string;
  addresses: CustomerAddress[];
  billingInfo: CustomerBillingInfo;
  wishlist: CustomerWishlistItem[];
  rewardPoints: CustomerRewardPoints;
  customerNotes?: string;
  adminNotes: CustomerAdminNote[];
  loginActivity: CustomerLoginActivity[];
  orders: CustomerOrderSummary[];
  stats: CustomerStats;
}

export interface CustomerFilterOptions {
  searchQuery?: string;
  statusFilter?: 'all' | CustomerAccountStatus;
  tierFilter?: 'all' | CustomerTier;
  verificationFilter?: 'all' | CustomerVerificationStatus;
  dateRange?: 'all' | '7days' | '30days' | '90days' | 'year' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  sortBy?:
    | 'registration_desc'
    | 'registration_asc'
    | 'spending_desc'
    | 'spending_asc'
    | 'orders_desc'
    | 'name_asc'
    | 'last_active_desc';
  page?: number;
  pageSize?: number;
}

export interface CustomerAggregateMetrics {
  totalCustomers: number;
  activeCustomers: number;
  vipGoldCount: number;
  pendingVerificationCount: number;
  suspendedCount: number;
  totalLifetimeRevenue: number;
  averageCustomerAOV: number;
  topFavoriteStore: string;
}

export interface CustomerExportData {
  filename: string;
  format: 'csv' | 'excel' | 'sheets';
  mimeType: string;
  content: string;
}
