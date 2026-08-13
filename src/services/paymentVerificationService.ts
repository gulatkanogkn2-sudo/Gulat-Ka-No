import {
  PaymentVerificationRecord,
  PaymentFilterOptions,
  PaymentStats,
  PaymentVerificationStatus,
  PaymentMethod,
  StoreType,
} from '../types/paymentVerification';
import { OrderManagementService } from './orderManagementService';

// Initial Mock Dataset for Payment Verification Queue
const MOCK_PAYMENTS: PaymentVerificationRecord[] = [
  {
    id: 'pay_001',
    paymentReference: 'PAY-2026-8891',
    orderNumber: 'ORD-GB-9921',
    orderId: 'ord_gb_9921',
    customerId: 'cust_001',
    customerName: 'Dr. Evelyn Vance',
    customerEmail: 'evelyn.vance@mit-labs.edu',
    customerPhone: '+1 (555) 234-8890',
    storeType: 'GroupBuy',
    paymentMethod: 'CRYPTO_USDT',
    amountPaid: 2450.00,
    currency: 'USDT (TRC-20)',
    paymentDate: '2026-08-04T18:30:00Z',
    transactionReference: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    verificationStatus: 'PENDING_REVIEW',
    assignedVerifier: 'Admin Sarah',
    lastUpdated: '2026-08-04T18:32:00Z',
    uploadedProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    uploadedProofFileName: 'usdt_receipt_ord_gb_9921.jpg',
    uploadedProofFileSize: '1.8 MB',
    proofThumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&auto=format&fit=crop',
    verificationHistory: [
      {
        id: 'hist_001',
        timestamp: '2026-08-04T18:30:00Z',
        status: 'PENDING_REVIEW',
        verifier: 'System Auto-Ingest',
        action: 'CREATED',
        notes: 'Payment proof screenshot submitted during checkout.',
      },
      {
        id: 'hist_002',
        timestamp: '2026-08-04T18:32:00Z',
        status: 'PENDING_REVIEW',
        verifier: 'Admin Sarah',
        action: 'VERIFIER_ASSIGNED',
        notes: 'Assigned to Admin Sarah for blockchain explorer verification.',
      },
    ],
    adminNotes: [
      {
        id: 'note_001',
        author: 'Admin Sarah',
        text: 'Awaiting TRON blockchain confirmation depth (currently 12/20 blocks).',
        timestamp: '2026-08-04T18:35:00Z',
      },
    ],
    associatedOrderStatus: 'PAYMENT_VERIFICATION',
    orderTotalAmount: 2450.00,
  },
  {
    id: 'pay_002',
    paymentReference: 'PAY-2026-8892',
    orderNumber: 'ORD-OH-4412',
    orderId: 'ord_oh_4412',
    customerId: 'cust_002',
    customerName: 'Marcus Sterling',
    customerEmail: 'marcus.sterling@apex-bio.com',
    customerPhone: '+1 (555) 876-1234',
    storeType: 'OnHand',
    paymentMethod: 'BANK_TRANSFER',
    amountPaid: 1820.50,
    currency: 'USD',
    paymentDate: '2026-08-04T15:10:00Z',
    transactionReference: 'WIRE-9938102-GS',
    verificationStatus: 'UNDER_REVIEW',
    assignedVerifier: 'Admin Marcus',
    lastUpdated: '2026-08-04T16:05:00Z',
    uploadedProofUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=1200&auto=format&fit=crop',
    uploadedProofFileName: 'fedwire_remittance_apex.pdf',
    uploadedProofFileSize: '2.4 MB',
    proofThumbnailUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=300&auto=format&fit=crop',
    verificationHistory: [
      {
        id: 'hist_003',
        timestamp: '2026-08-04T15:10:00Z',
        status: 'PENDING_REVIEW',
        verifier: 'System Auto-Ingest',
        action: 'CREATED',
        notes: 'Bank wire receipt uploaded.',
      },
      {
        id: 'hist_004',
        timestamp: '2026-08-04T16:05:00Z',
        status: 'UNDER_REVIEW',
        verifier: 'Admin Marcus',
        action: 'STATUS_CHANGED',
        notes: 'Cross-checking with Goldman Sachs treasury wire settlement statement.',
      },
    ],
    adminNotes: [
      {
        id: 'note_002',
        author: 'Admin Marcus',
        text: 'Wire reference matches Apex Bio account. Clearing expected by 17:00 EST.',
        timestamp: '2026-08-04T16:10:00Z',
      },
    ],
    associatedOrderStatus: 'PAYMENT_VERIFICATION',
    orderTotalAmount: 1820.50,
  },
  {
    id: 'pay_003',
    paymentReference: 'PAY-2026-8893',
    orderNumber: 'ORD-MQ-1092',
    orderId: 'ord_mq_1092',
    customerId: 'cust_003',
    customerName: 'Dr. Aris Thorne',
    customerEmail: 'aris.thorne@syntho-pharm.org',
    customerPhone: '+1 (555) 432-9900',
    storeType: 'MOQ',
    paymentMethod: 'WISE_TRANSFER',
    amountPaid: 5600.00,
    currency: 'USD',
    paymentDate: '2026-08-03T11:20:00Z',
    transactionReference: 'TRANSFERWISE-P90182-X',
    verificationStatus: 'VERIFIED',
    assignedVerifier: 'Admin Elena',
    lastUpdated: '2026-08-03T12:45:00Z',
    uploadedProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
    uploadedProofFileName: 'wise_confirmation_syntho.png',
    uploadedProofFileSize: '850 KB',
    proofThumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=300&auto=format&fit=crop',
    verificationHistory: [
      {
        id: 'hist_005',
        timestamp: '2026-08-03T11:20:00Z',
        status: 'PENDING_REVIEW',
        verifier: 'System Auto-Ingest',
        action: 'CREATED',
        notes: 'Wise confirmation receipt attached.',
      },
      {
        id: 'hist_006',
        timestamp: '2026-08-03T12:45:00Z',
        status: 'VERIFIED',
        verifier: 'Admin Elena',
        action: 'STATUS_CHANGED',
        notes: 'Funds deposited in Wise business USD account. Verification complete.',
      },
    ],
    adminNotes: [
      {
        id: 'note_003',
        author: 'Admin Elena',
        text: 'Full amount cleared into primary treasury. Ready for production allocation.',
        timestamp: '2026-08-03T12:46:00Z',
      },
    ],
    associatedOrderStatus: 'CONFIRMED',
    orderTotalAmount: 5600.00,
  },
  {
    id: 'pay_004',
    paymentReference: 'PAY-2026-8894',
    orderNumber: 'ORD-GB-9925',
    orderId: 'ord_gb_9925',
    customerId: 'cust_004',
    customerName: 'Kaitlyn Zheng',
    customerEmail: 'k.zheng@gene-helix.io',
    customerPhone: '+1 (555) 901-2233',
    storeType: 'GroupBuy',
    paymentMethod: 'CRYPTO_BTC',
    amountPaid: 3100.00,
    currency: 'BTC',
    paymentDate: '2026-08-03T09:15:00Z',
    transactionReference: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    verificationStatus: 'REQUIRES_MORE_INFO',
    assignedVerifier: 'Admin Sarah',
    lastUpdated: '2026-08-03T10:00:00Z',
    uploadedProofUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    uploadedProofFileName: 'btc_wallet_ss.png',
    uploadedProofFileSize: '1.2 MB',
    proofThumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop',
    additionalInfoRequested: 'Transaction reference is missing complete TX Hash. Please upload clear screenshot showing TX Hash or mempool link.',
    verificationHistory: [
      {
        id: 'hist_007',
        timestamp: '2026-08-03T09:15:00Z',
        status: 'PENDING_REVIEW',
        verifier: 'System Auto-Ingest',
        action: 'CREATED',
        notes: 'BTC wallet screenshot uploaded.',
      },
      {
        id: 'hist_008',
        timestamp: '2026-08-03T10:00:00Z',
        status: 'REQUIRES_MORE_INFO',
        verifier: 'Admin Sarah',
        action: 'INFO_REQUESTED',
        notes: 'Screenshot cropped out TX hash. Requested full screenshot or blockchain URL.',
      },
    ],
    adminNotes: [
      {
        id: 'note_004',
        author: 'Admin Sarah',
        text: 'Contacted customer via portal alert.',
        timestamp: '2026-08-03T10:02:00Z',
      },
    ],
    associatedOrderStatus: 'AWAITING_PAYMENT',
    orderTotalAmount: 3100.00,
  },
  {
    id: 'pay_005',
    paymentReference: 'PAY-2026-8895',
    orderNumber: 'ORD-OH-4418',
    orderId: 'ord_oh_4418',
    customerId: 'cust_005',
    customerName: 'David K. Miller',
    customerEmail: 'd.miller@neuro-vance.org',
    customerPhone: '+1 (555) 777-3344',
    storeType: 'OnHand',
    paymentMethod: 'ZELLE',
    amountPaid: 950.00,
    currency: 'USD',
    paymentDate: '2026-08-02T14:40:00Z',
    transactionReference: 'ZELLE-881902-Z',
    verificationStatus: 'REJECTED',
    assignedVerifier: 'Admin Marcus',
    lastUpdated: '2026-08-02T15:30:00Z',
    uploadedProofUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop',
    uploadedProofFileName: 'zelle_invalid_ref.jpg',
    uploadedProofFileSize: '620 KB',
    proofThumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=300&auto=format&fit=crop',
    rejectionReason: 'Zelle transfer was reversed by sender bank due to name mismatch with account holder.',
    verificationHistory: [
      {
        id: 'hist_009',
        timestamp: '2026-08-02T14:40:00Z',
        status: 'PENDING_REVIEW',
        verifier: 'System Auto-Ingest',
        action: 'CREATED',
        notes: 'Zelle transfer screenshot submitted.',
      },
      {
        id: 'hist_010',
        timestamp: '2026-08-02T15:30:00Z',
        status: 'REJECTED',
        verifier: 'Admin Marcus',
        action: 'STATUS_CHANGED',
        notes: 'Payment failed bank verification. Zelle transaction marked invalid.',
      },
    ],
    adminNotes: [
      {
        id: 'note_005',
        author: 'Admin Marcus',
        text: 'Zelle account holder name did not match customer profile.',
        timestamp: '2026-08-02T15:32:00Z',
      },
    ],
    associatedOrderStatus: 'CANCELLED',
    orderTotalAmount: 950.00,
  },
  {
    id: 'pay_006',
    paymentReference: 'PAY-2026-8896',
    orderNumber: 'ORD-MQ-1098',
    orderId: 'ord_mq_1098',
    customerId: 'cust_006',
    customerName: 'Dr. Helena Rostova',
    customerEmail: 'h.rostova@bio-synth.de',
    customerPhone: '+49 30 123456',
    storeType: 'MOQ',
    paymentMethod: 'BANK_TRANSFER',
    amountPaid: 12400.00,
    currency: 'USD',
    paymentDate: '2026-08-01T10:00:00Z',
    transactionReference: 'SWIFT-DEUTDE3B-99120',
    verificationStatus: 'VERIFIED',
    assignedVerifier: 'Admin Elena',
    lastUpdated: '2026-08-01T11:15:00Z',
    uploadedProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    uploadedProofFileName: 'swift_swift_de.pdf',
    uploadedProofFileSize: '3.1 MB',
    proofThumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&auto=format&fit=crop',
    verificationHistory: [
      {
        id: 'hist_011',
        timestamp: '2026-08-01T10:00:00Z',
        status: 'PENDING_REVIEW',
        verifier: 'System Auto-Ingest',
        action: 'CREATED',
        notes: 'International SWIFT receipt submitted.',
      },
      {
        id: 'hist_012',
        timestamp: '2026-08-01T11:15:00Z',
        status: 'VERIFIED',
        verifier: 'Admin Elena',
        action: 'STATUS_CHANGED',
        notes: 'SWIFT wire cleared in EUR/USD correspondent account.',
      },
    ],
    adminNotes: [
      {
        id: 'note_006',
        author: 'Admin Elena',
        text: 'Large institutional wire verified. VIP customer tier maintained.',
        timestamp: '2026-08-01T11:16:00Z',
      },
    ],
    associatedOrderStatus: 'CONFIRMED',
    orderTotalAmount: 12400.00,
  },
  {
    id: 'pay_007',
    paymentReference: 'PAY-2026-8897',
    orderNumber: 'ORD-GB-9930',
    orderId: 'ord_gb_9930',
    customerId: 'cust_007',
    customerName: 'Nathaniel Cole',
    customerEmail: 'n.cole@apex-labs.org',
    customerPhone: '+1 (555) 333-1122',
    storeType: 'GroupBuy',
    paymentMethod: 'CRYPTO_USDT',
    amountPaid: 1450.00,
    currency: 'USDT (TRC-20)',
    paymentDate: '2026-08-04T20:10:00Z',
    transactionReference: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
    verificationStatus: 'PENDING_REVIEW',
    assignedVerifier: 'Admin Sarah',
    lastUpdated: '2026-08-04T20:12:00Z',
    uploadedProofUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
    uploadedProofFileName: 'trc20_receipt_cole.png',
    uploadedProofFileSize: '1.1 MB',
    proofThumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=300&auto=format&fit=crop',
    verificationHistory: [
      {
        id: 'hist_013',
        timestamp: '2026-08-04T20:10:00Z',
        status: 'PENDING_REVIEW',
        verifier: 'System Auto-Ingest',
        action: 'CREATED',
        notes: 'TRC-20 USDT deposit submitted.',
      },
    ],
    adminNotes: [],
    associatedOrderStatus: 'PAYMENT_VERIFICATION',
    orderTotalAmount: 1450.00,
  },
];

// In-memory data store for the service
let paymentsStore: PaymentVerificationRecord[] = [...MOCK_PAYMENTS];
const subscribers: Array<() => void> = [];

function notifySubscribers() {
  subscribers.forEach((cb) => cb());
}

export class PaymentVerificationService {
  /**
   * Helper to look up assigned batch for a payment record via related order
   */
  static getAssignedBatchForPayment(p: PaymentVerificationRecord): string {
    // Attempt lookup in OrderManagementService
    if (p.orderNumber || p.orderId) {
      const q = (p.orderNumber || p.orderId).toLowerCase().trim();
      // Use OrderManagementService to query
      // Note: OrderManagementService filter helper or direct match
      const matchingOrder = OrderManagementService['ADMIN_MOCK_ORDERS']?.find(
        (o) =>
          o.id.toLowerCase() === q ||
          o.referenceNumber.toLowerCase() === q ||
          (o.paymentSummary && o.paymentSummary.paymentReference?.toLowerCase() === p.paymentReference.toLowerCase())
      );

      if (matchingOrder) {
        return matchingOrder.assignedBatch || matchingOrder.groupBuyData?.batchNumber || '';
      }
    }

    // Default mock fallback mapping based on payment ID / store type for sample data
    if (p.storeType.toLowerCase() === 'groupbuy') return 'GB-2026-08A';
    if (p.storeType.toLowerCase() === 'onhand') return 'OH-VAULT-42';
    if (p.storeType.toLowerCase() === 'moq') return 'MOQ-SEM-50V';
    return '';
  }

  /**
   * Get store-aware list of available batches
   */
  static getAvailableBatches(storeFilter?: string): string[] {
    return OrderManagementService.getAvailableBatches(storeFilter);
  }

  /**
   * Fetch payment verification records matching given filter options.
   */
  static async getPayments(filters: PaymentFilterOptions = {}): Promise<{
    payments: PaymentVerificationRecord[];
    totalCount: number;
    totalPages: number;
  }> {
    await new Promise((res) => setTimeout(res, 80));

    const filtered = PaymentVerificationService.filterPaymentsUnpaginated(filters);

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedPayments = filtered.slice(startIndex, startIndex + pageSize);

    return {
      payments: paginatedPayments,
      totalCount,
      totalPages,
    };
  }

  /**
   * Core unpaginated payment filter logic
   */
  static filterPaymentsUnpaginated(filters: PaymentFilterOptions = {}): PaymentVerificationRecord[] {
    let filtered = [...paymentsStore];

    // 1. Search filter
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const batch = PaymentVerificationService.getAssignedBatchForPayment(p).toLowerCase();
        return (
          p.paymentReference.toLowerCase().includes(q) ||
          p.orderNumber.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.customerEmail.toLowerCase().includes(q) ||
          p.transactionReference.toLowerCase().includes(q) ||
          batch.includes(q) ||
          (p.assignedVerifier && p.assignedVerifier.toLowerCase().includes(q))
        );
      });
    }

    // 2. Store filter (case-insensitive)
    if (filters.storeFilter && filters.storeFilter !== 'all') {
      const s = filters.storeFilter.toLowerCase();
      filtered = filtered.filter((p) => p.storeType.toLowerCase() === s);
    }

    // 3. Batch filter (store-aware)
    if (filters.batchFilter && filters.batchFilter !== 'all') {
      if (filters.batchFilter === 'unassigned') {
        filtered = filtered.filter((p) => {
          const b = PaymentVerificationService.getAssignedBatchForPayment(p);
          return !b || b.trim() === '';
        });
      } else {
        const targetBatch = filters.batchFilter.toLowerCase().trim();
        filtered = filtered.filter((p) => {
          const b = PaymentVerificationService.getAssignedBatchForPayment(p).toLowerCase().trim();
          return b === targetBatch;
        });
      }
    }

    // 4. Payment method filter
    if (filters.paymentMethodFilter && filters.paymentMethodFilter !== 'all') {
      filtered = filtered.filter((p) => p.paymentMethod === filters.paymentMethodFilter);
    }

    // 5. Verification status filter
    if (filters.statusFilter && filters.statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.verificationStatus === filters.statusFilter);
    }

    // 6. Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      if (filters.dateRange === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        filtered = filtered.filter((p) => new Date(p.paymentDate).getTime() >= startOfDay);
      } else if (filters.dateRange === '7days') {
        const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((p) => new Date(p.paymentDate) >= cutoff);
      } else if (filters.dateRange === '30days') {
        const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((p) => new Date(p.paymentDate) >= cutoff);
      } else if (filters.dateRange === '90days') {
        const cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((p) => new Date(p.paymentDate) >= cutoff);
      } else if (filters.dateRange === 'year') {
        const cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        filtered = filtered.filter((p) => new Date(p.paymentDate) >= cutoff);
      } else if (filters.dateRange === 'custom') {
        if (filters.customStartDate) {
          const start = new Date(filters.customStartDate).getTime();
          filtered = filtered.filter((p) => new Date(p.paymentDate).getTime() >= start);
        }
        if (filters.customEndDate) {
          const end = new Date(filters.customEndDate).getTime() + 24 * 60 * 60 * 1000 - 1;
          filtered = filtered.filter((p) => new Date(p.paymentDate).getTime() <= end);
        }
      }
    }

    // 7. Sorting
    const sortBy = filters.sortBy || 'date_desc';
    filtered.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
      }
      if (sortBy === 'amount_desc') {
        return b.amountPaid - a.amountPaid;
      }
      if (sortBy === 'amount_asc') {
        return a.amountPaid - b.amountPaid;
      }
      if (sortBy === 'status_asc') {
        return a.verificationStatus.localeCompare(b.verificationStatus);
      }
      return 0;
    });

    return filtered;
  }

  /**
   * Retrieve single payment record by ID
   */
  static async getPaymentById(id: string): Promise<PaymentVerificationRecord | null> {
    await new Promise((res) => setTimeout(res, 50));
    const found = paymentsStore.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  /**
   * Get aggregate statistics for the Payment Verification Dashboard Header
   */
  static async getStats(): Promise<PaymentStats> {
    await new Promise((res) => setTimeout(res, 50));

    const totalPayments = paymentsStore.length;
    const pendingCount = paymentsStore.filter((p) => p.verificationStatus === 'PENDING_REVIEW').length;
    const underReviewCount = paymentsStore.filter((p) => p.verificationStatus === 'UNDER_REVIEW').length;
    const verifiedCount = paymentsStore.filter((p) => p.verificationStatus === 'VERIFIED').length;
    const rejectedCount = paymentsStore.filter((p) => p.verificationStatus === 'REJECTED').length;
    const moreInfoCount = paymentsStore.filter((p) => p.verificationStatus === 'REQUIRES_MORE_INFO').length;

    const totalVolumeUSD = paymentsStore.reduce((sum, p) => sum + p.amountPaid, 0);
    const pendingVolumeUSD = paymentsStore
      .filter((p) => p.verificationStatus === 'PENDING_REVIEW' || p.verificationStatus === 'UNDER_REVIEW')
      .reduce((sum, p) => sum + p.amountPaid, 0);
    const verifiedVolumeUSD = paymentsStore
      .filter((p) => p.verificationStatus === 'VERIFIED')
      .reduce((sum, p) => sum + p.amountPaid, 0);

    return {
      totalPayments,
      pendingCount,
      underReviewCount,
      verifiedCount,
      rejectedCount,
      moreInfoCount,
      totalVolumeUSD,
      pendingVolumeUSD,
      verifiedVolumeUSD,
    };
  }

  /**
   * Verify Payment
   */
  static async verifyPayment(
    id: string,
    verifierName: string = 'Admin User',
    notes?: string
  ): Promise<PaymentVerificationRecord | null> {
    const payment = paymentsStore.find((p) => p.id === id);
    if (!payment) return null;

    const nowIso = new Date().toISOString();
    payment.verificationStatus = 'VERIFIED';
    payment.assignedVerifier = verifierName;
    payment.lastUpdated = nowIso;
    payment.associatedOrderStatus = 'CONFIRMED'; // Connection hook to Order Status Architecture

    payment.verificationHistory.unshift({
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      status: 'VERIFIED',
      verifier: verifierName,
      action: 'STATUS_CHANGED',
      notes: notes || 'Payment verified. Funds confirmed in treasury.',
    });

    if (notes) {
      payment.adminNotes.unshift({
        id: `note_${Date.now()}`,
        author: verifierName,
        text: notes,
        timestamp: nowIso,
      });
    }

    notifySubscribers();
    return { ...payment };
  }

  /**
   * Reject Payment
   */
  static async rejectPayment(
    id: string,
    reason: string,
    verifierName: string = 'Admin User'
  ): Promise<PaymentVerificationRecord | null> {
    const payment = paymentsStore.find((p) => p.id === id);
    if (!payment) return null;

    const nowIso = new Date().toISOString();
    payment.verificationStatus = 'REJECTED';
    payment.rejectionReason = reason;
    payment.assignedVerifier = verifierName;
    payment.lastUpdated = nowIso;
    payment.associatedOrderStatus = 'CANCELLED';

    payment.verificationHistory.unshift({
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      status: 'REJECTED',
      verifier: verifierName,
      action: 'STATUS_CHANGED',
      notes: `Rejected: ${reason}`,
    });

    payment.adminNotes.unshift({
      id: `note_${Date.now()}`,
      author: verifierName,
      text: `Payment rejected. Reason: ${reason}`,
      timestamp: nowIso,
    });

    notifySubscribers();
    return { ...payment };
  }

  /**
   * Request Additional Information
   */
  static async requestAdditionalInfo(
    id: string,
    requestText: string,
    verifierName: string = 'Admin User'
  ): Promise<PaymentVerificationRecord | null> {
    const payment = paymentsStore.find((p) => p.id === id);
    if (!payment) return null;

    const nowIso = new Date().toISOString();
    payment.verificationStatus = 'REQUIRES_MORE_INFO';
    payment.additionalInfoRequested = requestText;
    payment.assignedVerifier = verifierName;
    payment.lastUpdated = nowIso;

    payment.verificationHistory.unshift({
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      status: 'REQUIRES_MORE_INFO',
      verifier: verifierName,
      action: 'INFO_REQUESTED',
      notes: `Requested Info: ${requestText}`,
    });

    payment.adminNotes.unshift({
      id: `note_${Date.now()}`,
      author: verifierName,
      text: `Info requested from customer: ${requestText}`,
      timestamp: nowIso,
    });

    notifySubscribers();
    return { ...payment };
  }

  /**
   * Update Verification Status generically
   */
  static async updateVerificationStatus(
    id: string,
    newStatus: PaymentVerificationStatus,
    verifierName: string = 'Admin User',
    notes?: string
  ): Promise<PaymentVerificationRecord | null> {
    const payment = paymentsStore.find((p) => p.id === id);
    if (!payment) return null;

    const nowIso = new Date().toISOString();
    payment.verificationStatus = newStatus;
    payment.assignedVerifier = verifierName;
    payment.lastUpdated = nowIso;

    payment.verificationHistory.unshift({
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      status: newStatus,
      verifier: verifierName,
      action: 'STATUS_CHANGED',
      notes: notes || `Status updated to ${newStatus}`,
    });

    if (notes) {
      payment.adminNotes.unshift({
        id: `note_${Date.now()}`,
        author: verifierName,
        text: notes,
        timestamp: nowIso,
      });
    }

    notifySubscribers();
    return { ...payment };
  }

  /**
   * Add internal admin note to a payment record
   */
  static async addAdminNote(
    id: string,
    text: string,
    author: string = 'Admin User'
  ): Promise<PaymentVerificationRecord | null> {
    const payment = paymentsStore.find((p) => p.id === id);
    if (!payment) return null;

    const nowIso = new Date().toISOString();
    payment.adminNotes.unshift({
      id: `note_${Date.now()}`,
      author,
      text,
      timestamp: nowIso,
    });

    payment.verificationHistory.unshift({
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      status: payment.verificationStatus,
      verifier: author,
      action: 'NOTE_ADDED',
      notes: `Admin note added: ${text.substring(0, 40)}...`,
    });

    notifySubscribers();
    return { ...payment };
  }

  /**
   * Reassign verifier for a payment record
   */
  static async reassignVerifier(
    id: string,
    newVerifier: string,
    author: string = 'Admin User'
  ): Promise<PaymentVerificationRecord | null> {
    const payment = paymentsStore.find((p) => p.id === id);
    if (!payment) return null;

    const oldVerifier = payment.assignedVerifier || 'Unassigned';
    const nowIso = new Date().toISOString();
    payment.assignedVerifier = newVerifier;
    payment.lastUpdated = nowIso;

    payment.verificationHistory.unshift({
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      status: payment.verificationStatus,
      verifier: author,
      action: 'VERIFIER_ASSIGNED',
      notes: `Reassigned verifier from ${oldVerifier} to ${newVerifier}`,
    });

    notifySubscribers();
    return { ...payment };
  }

  /**
   * Bulk update status for multiple payments
   */
  static async bulkUpdateStatus(
    ids: string[],
    newStatus: PaymentVerificationStatus,
    verifierName: string = 'Admin User'
  ): Promise<number> {
    let count = 0;
    const nowIso = new Date().toISOString();

    for (const id of ids) {
      const payment = paymentsStore.find((p) => p.id === id);
      if (payment) {
        payment.verificationStatus = newStatus;
        payment.assignedVerifier = verifierName;
        payment.lastUpdated = nowIso;

        payment.verificationHistory.unshift({
          id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          timestamp: nowIso,
          status: newStatus,
          verifier: verifierName,
          action: 'STATUS_CHANGED',
          notes: `Bulk status update to ${newStatus}`,
        });

        count++;
      }
    }

    notifySubscribers();
    return count;
  }

  /**
   * Export currently filtered payment records
   */
  static exportFilteredPayments(
    filters: PaymentFilterOptions = {},
    format: 'csv' | 'excel' | 'sheets' = 'csv'
  ): {
    success: boolean;
    count: number;
    message?: string;
    filename: string;
    content: string;
    mimeType: string;
  } {
    const matchingPayments = PaymentVerificationService.filterPaymentsUnpaginated(filters);

    if (matchingPayments.length === 0) {
      return {
        success: false,
        count: 0,
        message: 'No payment records match the current filters.',
        filename: '',
        content: '',
        mimeType: 'text/csv;charset=utf-8;',
      };
    }

    const headers = [
      'Payment Reference',
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Store Type',
      'Payment Method',
      'Amount Paid',
      'Currency',
      'Payment Date',
      'Transaction Ref',
      'Verification Status',
      'Assigned Verifier',
      'Assigned Batch',
      'Last Updated',
      'Proof File Name',
      'Proof URL',
    ];

    const rows = matchingPayments.map((p) => {
      const batch = PaymentVerificationService.getAssignedBatchForPayment(p);
      return [
        `"${p.paymentReference}"`,
        `"${p.orderNumber}"`,
        `"${p.customerName.replace(/"/g, '""')}"`,
        `"${p.customerEmail}"`,
        `"${p.storeType}"`,
        `"${p.paymentMethod}"`,
        p.amountPaid.toFixed(2),
        `"${p.currency}"`,
        `"${new Date(p.paymentDate).toISOString()}"`,
        `"${p.transactionReference.replace(/"/g, '""')}"`,
        `"${p.verificationStatus}"`,
        `"${p.assignedVerifier || 'Unassigned'}"`,
        `"${batch}"`,
        `"${new Date(p.lastUpdated).toISOString()}"`,
        `"${p.uploadedProofFileName}"`,
        `"${p.uploadedProofUrl}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // Filename construction
    let storeSegment = 'All-Stores';
    if (filters.storeFilter && filters.storeFilter !== 'all') {
      const s = filters.storeFilter.toLowerCase();
      if (s === 'groupbuy') storeSegment = 'GroupBuy';
      else if (s === 'onhand') storeSegment = 'OnHand';
      else if (s === 'moq') storeSegment = 'MOQ';
      else storeSegment = filters.storeFilter;
    }

    let batchSegment = '';
    if (filters.batchFilter && filters.batchFilter !== 'all') {
      batchSegment = `_${filters.batchFilter}`;
    }

    let statusSegment = '';
    if (filters.statusFilter && filters.statusFilter !== 'all') {
      statusSegment = `_${filters.statusFilter}`;
    }

    const filename = `GKN_${storeSegment}${batchSegment}${statusSegment}_Payments.csv`;

    return {
      success: true,
      count: matchingPayments.length,
      filename,
      content: csvContent,
      mimeType: 'text/csv;charset=utf-8;',
    };
  }

  /**
   * Export payment verification records (CSV, Excel, Google Sheets compatible format)
   */
  static exportPayments(
    ids: string[] = [],
    format: 'csv' | 'excel' | 'sheets' = 'csv'
  ): { filename: string; content: string; mimeType: string } {
    const targetPayments =
      ids.length > 0 ? paymentsStore.filter((p) => ids.includes(p.id)) : paymentsStore;

    const headers = [
      'Payment Reference',
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Store Type',
      'Payment Method',
      'Amount Paid',
      'Currency',
      'Payment Date',
      'Transaction Ref',
      'Verification Status',
      'Assigned Verifier',
      'Last Updated',
      'Proof File Name',
      'Proof URL',
    ];

    const rows = targetPayments.map((p) => [
      `"${p.paymentReference}"`,
      `"${p.orderNumber}"`,
      `"${p.customerName.replace(/"/g, '""')}"`,
      `"${p.customerEmail}"`,
      `"${p.storeType}"`,
      `"${p.paymentMethod}"`,
      p.amountPaid.toFixed(2),
      `"${p.currency}"`,
      `"${new Date(p.paymentDate).toISOString()}"`,
      `"${p.transactionReference.replace(/"/g, '""')}"`,
      `"${p.verificationStatus}"`,
      `"${p.assignedVerifier || 'Unassigned'}"`,
      `"${new Date(p.lastUpdated).toISOString()}"`,
      `"${p.uploadedProofFileName}"`,
      `"${p.uploadedProofUrl}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    const extension = format === 'excel' ? 'csv' : format === 'sheets' ? 'csv' : 'csv';
    const mimeType = 'text/csv;charset=utf-8;';

    return {
      filename: `gkn_payment_verifications_${timestamp}.${extension}`,
      content: csvContent,
      mimeType,
    };
  }

  /**
   * Trigger browser file download for exported data
   */
  static downloadExport(exportResult: { filename: string; content: string; mimeType: string }) {
    const blob = new Blob([exportResult.content], { type: exportResult.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportResult.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Subscribe to real-time updates for Payment Verification records
   */
  static subscribeToPaymentUpdates(callback: () => void): () => void {
    subscribers.push(callback);
    return () => {
      const idx = subscribers.indexOf(callback);
      if (idx !== -1) subscribers.splice(idx, 1);
    };
  }
}
