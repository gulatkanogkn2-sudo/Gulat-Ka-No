export type PaymentVerificationStatus =
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'REQUIRES_MORE_INFO';

export type PaymentMethod =
  | 'CRYPTO_USDT'
  | 'CRYPTO_BTC'
  | 'BANK_TRANSFER'
  | 'WISE_TRANSFER'
  | 'ZELLE'
  | 'CREDIT_CARD'
  | 'OTHER';

export type StoreType = 'GroupBuy' | 'OnHand' | 'MOQ' | 'groupbuy' | 'onhand' | 'moq';

export interface PaymentVerificationHistoryEntry {
  id: string;
  timestamp: string;
  status: PaymentVerificationStatus;
  verifier: string;
  notes?: string;
  action: 'CREATED' | 'STATUS_CHANGED' | 'VERIFIER_ASSIGNED' | 'NOTE_ADDED' | 'INFO_REQUESTED';
}

export interface PaymentAdminNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface PaymentVerificationRecord {
  id: string;
  paymentReference: string; // e.g. "PAY-2026-8891"
  orderNumber: string; // e.g. "ORD-GB-9921"
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  storeType: StoreType;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  currency: string; // e.g. "USD", "USDT"
  paymentDate: string; // ISO date string
  transactionReference: string; // TX Hash or Bank Transfer Ref
  verificationStatus: PaymentVerificationStatus;
  assignedVerifier: string | null; // e.g., "Admin Sarah", "Admin Marcus"
  lastUpdated: string; // ISO date string

  // Uploaded Payment Proof Asset
  uploadedProofUrl: string;
  uploadedProofFileName: string;
  uploadedProofFileSize: string;
  proofThumbnailUrl?: string;

  // Extra Details & Audit Trails
  verificationHistory: PaymentVerificationHistoryEntry[];
  adminNotes: PaymentAdminNote[];
  rejectionReason?: string;
  additionalInfoRequested?: string;

  // Order Integration Architecture Hook
  associatedOrderStatus?: string; // e.g., "PAYMENT_VERIFICATION", "AWAITING_PAYMENT"
  orderTotalAmount?: number;
}

export interface PaymentFilterOptions {
  searchQuery?: string;
  storeFilter?: 'all' | 'groupbuy' | 'onhand' | 'moq' | 'GroupBuy' | 'OnHand' | 'MOQ' | string;
  batchFilter?: string;
  paymentMethodFilter?: 'all' | PaymentMethod;
  statusFilter?: 'all' | PaymentVerificationStatus;
  dateRange?: 'all' | 'today' | '7days' | '30days' | '90days' | 'year';
  customStartDate?: string;
  customEndDate?: string;
  sortBy?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'status_asc';
  page?: number;
  pageSize?: number;
}

export interface PaymentStats {
  totalPayments: number;
  pendingCount: number;
  underReviewCount: number;
  verifiedCount: number;
  rejectedCount: number;
  moreInfoCount: number;
  totalVolumeUSD: number;
  pendingVolumeUSD: number;
  verifiedVolumeUSD: number;
}
