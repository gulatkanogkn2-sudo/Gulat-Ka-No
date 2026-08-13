import {
  OrderDetail,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
  TimelineStep,
  OrderFilterOptions,
  AdminOrderNote,
} from '../types/order';
import { calculateTotalVials, calculateTotalLabels, calculateItemVials } from '../utils/vialCalculation';
import { fetchOrders, updateProductionOrderStatus } from './productionService';

// Default mock orders database for Admin Order Management workspace
let ADMIN_MOCK_ORDERS: OrderDetail[] = [
  {
    id: 'ord_1001',
    referenceNumber: 'GB-000001',
    storeType: 'groupbuy',
    orderDate: '2026-08-04T14:32:00Z',
    status: 'PAYMENT_VERIFICATION',
    paymentStatus: 'VERIFICATION_PENDING',
    shippingStatus: 'PREPARING',
    paymentMethod: 'GCash Instant Transfer',
    paymentSummary: {
      paymentMethod: 'GCash Instant Transfer',
      amount: 579.97,
      paymentReference: 'GC-99481029381',
      paymentProofStatus: 'SUBMITTED',
      verificationStatus: 'PENDING',
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    },
    customerName: 'Dr. Alexander Vance',
    customerEmail: 'alexander.vance@gknlabs.org',
    customerPhone: '+63 917 123 4567',
    assignedBatch: 'GB-2026-08A',
    groupBuyData: {
      batchNumber: 'GB-2026-08A',
      batchStatus: 'LAB_SYNTHESIS',
      estimatedProduction: '2026-08-20',
    },
    shippingAddress: {
      recipientName: 'Dr. Alexander Vance',
      phone: '+63 917 123 4567',
      addressLine1: 'Suite 402, BioTech Innovation Tower',
      addressLine2: '32nd Street, Bonifacio Global City',
      city: 'Taguig City',
      province: 'Metro Manila',
      postalCode: '1634',
      country: 'Philippines',
    },
    items: [
      {
        id: 'item_1',
        productId: 'semaglutide-5mg',
        name: 'Semaglutide 5mg Standard Vial',
        variantLabel: 'Box of 10 Vials (Lyophilized)',
        quantity: 2,
        price: 249.99,
        storeType: 'groupbuy',
        purity: '99.4%',
        casNumber: '910463-68-2',
      },
      {
        id: 'item_2',
        productId: 'tirzepatide-10mg',
        name: 'Tirzepatide 10mg Standard Vial',
        variantLabel: 'Single 10mg Vial',
        quantity: 1,
        price: 89.99,
        storeType: 'groupbuy',
        purity: '99.8%',
        casNumber: '2023788-19-2',
      },
    ],
    subtotal: 589.97,
    shippingFee: 15.0,
    discount: 25.0,
    grandTotal: 579.97,
    trackingNumber: 'PENDING_DISPATCH',
    courier: 'LBC Express',
    estimatedDelivery: 'Aug 07, 2026',
    orderNotes: 'Please handle with care during transit.',
    adminNotes: 'Proof uploaded via GCash. Awaiting ledger check by Finance Admin.',
    adminNotesList: [
      {
        id: 'note_1',
        author: 'Admin Sarah',
        timestamp: '2026-08-04T15:10:00Z',
        text: 'Initial payment proof receipt logged. Assigned to GroupBuy Batch GB-2026-08A.',
      },
    ],
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'ord_1002',
    referenceNumber: 'OH-000001',
    storeType: 'onhand',
    orderDate: '2026-08-01T09:15:00Z',
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    shippingStatus: 'IN_TRANSIT',
    paymentMethod: 'Institutional Bank Wire (BDO)',
    paymentSummary: {
      paymentMethod: 'Institutional Bank Wire (BDO)',
      amount: 187.5,
      paymentReference: 'BDO-WIRE-8849201',
      paymentProofStatus: 'VERIFIED',
      verificationStatus: 'VERIFIED',
    },
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@bioresearch.io',
    customerPhone: '+63 928 987 6543',
    assignedBatch: 'OH-VAULT-42',
    onHandData: {
      dispatchPriority: 'URGENT',
      inventoryReservationStatus: 'ALLOCATED',
    },
    shippingAddress: {
      recipientName: 'Central Lab Receiving - Attn Elena',
      phone: '+63 928 987 6543',
      addressLine1: 'Building B, Technopark Complex',
      addressLine2: 'Santa Rosa Industrial Zone',
      city: 'Santa Rosa',
      province: 'Laguna',
      postalCode: '4026',
      country: 'Philippines',
    },
    items: [
      {
        id: 'item_3',
        productId: 'bpc157-5mg',
        name: 'BPC-157 5mg High-Purity Peptide',
        variantLabel: 'Single 5mg Vial',
        quantity: 5,
        price: 34.5,
        storeType: 'onhand',
        purity: '99.6%',
        casNumber: '137525-51-0',
      },
    ],
    subtotal: 172.5,
    shippingFee: 15.0,
    discount: 0.0,
    grandTotal: 187.5,
    trackingNumber: 'LBC-PH-883920194',
    courier: 'LBC Express Courier',
    estimatedDelivery: 'Aug 05, 2026',
    orderNotes: 'Gate pass required at industrial zone barrier.',
    adminNotes: 'Priority dispatch approved from OnHand Vault 42.',
    adminNotesList: [
      {
        id: 'note_2',
        author: 'Lead Warehouse Tech',
        timestamp: '2026-08-01T10:00:00Z',
        text: 'Inspected thermal insulation pack. Dispatched via LBC Express.',
      },
    ],
  },
  {
    id: 'ord_1003',
    referenceNumber: 'MOQ-000001',
    storeType: 'moq',
    orderDate: '2026-07-28T16:45:00Z',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    shippingStatus: 'DELIVERED',
    paymentMethod: 'Maya Business Wallet',
    paymentSummary: {
      paymentMethod: 'Maya Business Wallet',
      amount: 1750.0,
      paymentReference: 'MAYA-BIZ-773019',
      paymentProofStatus: 'VERIFIED',
      verificationStatus: 'VERIFIED',
    },
    customerName: 'Prof. Marcus Brody',
    customerEmail: 'm.brody@oxford-peptide.org',
    customerPhone: '+63 908 555 1212',
    assignedBatch: 'MOQ-RET-100G',
    moqData: {
      moqCampaign: 'Retatrutide 100g Bulk Synthesis Campaign',
      manufacturingProgress: 100,
      targetUnits: 50,
      committedUnits: 50,
    },
    shippingAddress: {
      recipientName: 'Prof. Marcus Brody',
      phone: '+63 908 555 1212',
      addressLine1: 'Suite 402, BioTech Innovation Tower',
      addressLine2: '32nd Street, Bonifacio Global City',
      city: 'Taguig City',
      province: 'Metro Manila',
      postalCode: '1634',
      country: 'Philippines',
    },
    items: [
      {
        id: 'item_4',
        productId: 'retatrutide-10mg',
        name: 'Retatrutide 10mg Lyophilized Batch',
        variantLabel: 'Bulk Pack (50 Vials)',
        quantity: 1,
        price: 1850.0,
        storeType: 'moq',
        purity: '99.9%',
        casNumber: '2381089-83-2',
      },
    ],
    subtotal: 1850.0,
    shippingFee: 0.0,
    discount: 100.0,
    grandTotal: 1750.0,
    trackingNumber: 'DHL-EX-992018341',
    courier: 'DHL Air Express',
    estimatedDelivery: 'Delivered Aug 02, 2026',
    orderNotes: 'Order receipt enclosed in pouch.',
    adminNotes: 'MOQ Campaign target reached 100%. COA attached.',
    adminNotesList: [
      {
        id: 'note_3',
        author: 'Quality Control Lead',
        timestamp: '2026-07-30T08:30:00Z',
        text: 'Quality report verified (>99.9% purity). Handed to DHL.',
      },
    ],
  },
  {
    id: 'ord_1004',
    referenceNumber: 'GB-000002',
    storeType: 'groupbuy',
    orderDate: '2026-08-04T18:20:00Z',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    shippingStatus: 'PREPARING',
    paymentMethod: 'Bank Transfer (BPI)',
    paymentSummary: {
      paymentMethod: 'Bank Transfer (BPI)',
      amount: 890.0,
      paymentReference: 'BPI-20260804-991',
      paymentProofStatus: 'VERIFIED',
      verificationStatus: 'VERIFIED',
    },
    customerName: 'Dr. Sofia Chen',
    customerEmail: 'sofia.chen@neurolabs.com',
    customerPhone: '+63 918 444 3322',
    assignedBatch: 'GB-2026-08A',
    groupBuyData: {
      batchNumber: 'GB-2026-08A',
      batchStatus: 'THRESHOLD_REACHED',
      estimatedProduction: '2026-08-20',
    },
    shippingAddress: {
      recipientName: 'Dr. Sofia Chen',
      phone: '+63 918 444 3322',
      addressLine1: 'Lab 12, Science Park IV',
      city: 'Cabuyao',
      province: 'Laguna',
      postalCode: '4025',
      country: 'Philippines',
    },
    items: [
      {
        id: 'item_5',
        productId: 'cjc-1295-dac',
        name: 'CJC-1295 DAC 2mg Research Peptide',
        variantLabel: 'Box of 5 Vials',
        quantity: 2,
        price: 445.0,
        storeType: 'groupbuy',
        purity: '99.2%',
        casNumber: '863288-34-0',
      },
    ],
    subtotal: 890.0,
    shippingFee: 0.0,
    discount: 0.0,
    grandTotal: 890.0,
    trackingNumber: 'PENDING_DISPATCH',
    courier: 'LBC Express',
    estimatedDelivery: 'Aug 10, 2026',
    orderNotes: 'Include sterility testing sheet.',
    adminNotes: 'Payment verified automatically via BPI API matcher.',
  },
  {
    id: 'ord_1005',
    referenceNumber: 'MOQ-000002',
    storeType: 'moq',
    orderDate: '2026-08-03T11:05:00Z',
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    shippingStatus: 'PREPARING',
    paymentMethod: 'Crypto Settlement (USDT-TRC20)',
    paymentSummary: {
      paymentMethod: 'Crypto Settlement (USDT-TRC20)',
      amount: 3200.0,
      paymentReference: '0x7f8a9...b2e4',
      paymentProofStatus: 'VERIFIED',
      verificationStatus: 'VERIFIED',
    },
    customerName: 'Klaus Reinhardt',
    customerEmail: 'klaus.r@peptidewerke.de',
    customerPhone: '+49 171 9988776',
    assignedBatch: 'MOQ-SEMA-500V',
    moqData: {
      moqCampaign: 'Semaglutide 500 Vials Bulk Campaign',
      manufacturingProgress: 65,
      targetUnits: 500,
      committedUnits: 450,
    },
    shippingAddress: {
      recipientName: 'Klaus Reinhardt - Direct Receiving',
      phone: '+49 171 9988776',
      addressLine1: 'Hansa Allee 120',
      city: 'Frankfurt',
      province: 'Hesse',
      postalCode: '60320',
      country: 'Germany',
    },
    items: [
      {
        id: 'item_6',
        productId: 'semaglutide-5mg',
        name: 'Semaglutide 5mg Standard Vial',
        variantLabel: 'Bulk Order (100 Vials)',
        quantity: 1,
        price: 3200.0,
        storeType: 'moq',
        purity: '99.7%',
        casNumber: '910463-68-2',
      },
    ],
    subtotal: 3200.0,
    shippingFee: 0.0,
    discount: 0.0,
    grandTotal: 3200.0,
    trackingNumber: 'PENDING_AIR_WAYBILL',
    courier: 'FedEx Custom Critical Cold',
    estimatedDelivery: 'Aug 18, 2026',
    orderNotes: 'Export documentation required for EU customs clearance.',
    adminNotes: 'USDT Blockchain confirmation 64 blocks. Custom clearance paperwork in progress.',
  },
  {
    id: 'ord_1006',
    referenceNumber: 'OH-000002',
    storeType: 'onhand',
    orderDate: '2026-08-05T02:14:00Z',
    status: 'AWAITING_PAYMENT',
    paymentStatus: 'AWAITING_PAYMENT',
    shippingStatus: 'UNFULFILLED',
    paymentMethod: 'GCash QR Transfer',
    paymentSummary: {
      paymentMethod: 'GCash QR Transfer',
      amount: 145.0,
      paymentReference: 'PENDING_CUSTOMER_UPLOAD',
      paymentProofStatus: 'NOT_SUBMITTED',
      verificationStatus: 'PENDING',
    },
    customerName: 'Maria Santos',
    customerEmail: 'm.santos@clinicare.ph',
    customerPhone: '+63 919 777 8899',
    onHandData: {
      dispatchPriority: 'STANDARD',
      inventoryReservationStatus: 'RESERVED',
    },
    shippingAddress: {
      recipientName: 'Maria Santos',
      phone: '+63 919 777 8899',
      addressLine1: 'Unit 8B, Horizon Condominium',
      addressLine2: 'Salcedo Village, Makati',
      city: 'Makati City',
      province: 'Metro Manila',
      postalCode: '1227',
      country: 'Philippines',
    },
    items: [
      {
        id: 'item_7',
        productId: 'tb500-2mg',
        name: 'TB-500 (Thymosin Beta-4) 2mg',
        variantLabel: 'Single Vial',
        quantity: 3,
        price: 45.0,
        storeType: 'onhand',
        purity: '99.5%',
        casNumber: '77591-33-4',
      },
    ],
    subtotal: 135.0,
    shippingFee: 10.0,
    discount: 0.0,
    grandTotal: 145.0,
    orderNotes: 'Deliver between 9am - 5pm weekdays.',
    adminNotes: 'Reservation placed. 24-hour payment window active.',
  },
  {
    id: 'ord_1007',
    referenceNumber: 'OH-000003',
    storeType: 'onhand',
    orderDate: '2026-08-02T13:40:00Z',
    status: 'CANCELLED',
    paymentStatus: 'FAILED',
    shippingStatus: 'UNFULFILLED',
    paymentMethod: 'Bank Wire',
    paymentSummary: {
      paymentMethod: 'Bank Wire',
      amount: 410.0,
      paymentReference: 'EXPIRED',
      paymentProofStatus: 'NOT_SUBMITTED',
      verificationStatus: 'FAILED',
    },
    customerName: 'Robert Vance',
    customerEmail: 'r.vance@vanceresearch.org',
    customerPhone: '+63 927 111 2233',
    onHandData: {
      dispatchPriority: 'STANDARD',
      inventoryReservationStatus: 'RELEASED',
    },
    shippingAddress: {
      recipientName: 'Robert Vance',
      phone: '+63 927 111 2233',
      addressLine1: '12 Pioneer St',
      city: 'Mandaluyong',
      province: 'Metro Manila',
      postalCode: '1550',
      country: 'Philippines',
    },
    items: [
      {
        id: 'item_8',
        productId: 'nad-plus-100mg',
        name: 'NAD+ 100mg Cellular Health Powder',
        variantLabel: 'Vial',
        quantity: 2,
        price: 200.0,
        storeType: 'onhand',
        purity: '99.1%',
      },
    ],
    subtotal: 400.0,
    shippingFee: 10.0,
    discount: 0.0,
    grandTotal: 410.0,
    adminNotes: 'Cancelled due to non-payment within 48h window. Stock released back to OnHand inventory.',
  },
  {
    id: 'ord_1008',
    referenceNumber: 'GB-000003',
    storeType: 'groupbuy',
    orderDate: '2026-08-04T08:10:00Z',
    status: 'PACKING',
    paymentStatus: 'PAID',
    shippingStatus: 'PACKED',
    paymentMethod: 'Maya Instant Pay',
    paymentSummary: {
      paymentMethod: 'Maya Instant Pay',
      amount: 380.0,
      paymentReference: 'MAYA-881920',
      paymentProofStatus: 'VERIFIED',
      verificationStatus: 'VERIFIED',
    },
    customerName: 'Dr. James H. Mercer',
    customerEmail: 'j.mercer@apexpeptides.com',
    customerPhone: '+63 915 888 1234',
    assignedBatch: 'GB-2026-07B',
    groupBuyData: {
      batchNumber: 'GB-2026-07B',
      batchStatus: 'INSPECTION',
      estimatedProduction: '2026-08-06',
    },
    shippingAddress: {
      recipientName: 'Dr. James H. Mercer',
      phone: '+63 915 888 1234',
      addressLine1: 'Lab Block 4, Cyberpark',
      city: 'Quezon City',
      province: 'Metro Manila',
      postalCode: '1109',
      country: 'Philippines',
    },
    items: [
      {
        id: 'item_9',
        productId: 'ipamorelin-5mg',
        name: 'Ipamorelin 5mg Vial',
        variantLabel: 'Box of 10 Vials',
        quantity: 1,
        price: 380.0,
        storeType: 'groupbuy',
        purity: '99.6%',
        casNumber: '170851-70-4',
      },
    ],
    subtotal: 380.0,
    shippingFee: 0.0,
    discount: 0.0,
    grandTotal: 380.0,
    trackingNumber: 'PREPARED_LBC_99102',
    courier: 'LBC Express',
    estimatedDelivery: 'Aug 07, 2026',
    adminNotes: 'Quality control verified vial sealing. Thermal gel pack inserted into box.',
  },
];

// All locked order status progression flow definition
export const ALL_ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'AWAITING_PAYMENT',
  'PAYMENT_VERIFICATION',
  'CONFIRMED',
  'PROCESSING',
  'PACKING',
  'READY_TO_SHIP',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
];

export const ORDER_STATUS_DETAILS: Record<
  OrderStatus,
  { label: string; description: string; stepOrder: number }
> = {
  PENDING: {
    label: 'Order Staged',
    description: 'Order reservation created in system.',
    stepOrder: 1,
  },
  AWAITING_PAYMENT: {
    label: 'Awaiting Payment',
    description: 'Customer notified to submit payment proof.',
    stepOrder: 2,
  },
  PAYMENT_VERIFICATION: {
    label: 'Payment Verification',
    description: 'Payment proof under review by finance team.',
    stepOrder: 3,
  },
  CONFIRMED: {
    label: 'Allocation Confirmed',
    description: 'Payment verified and batch quota locked.',
    stepOrder: 4,
  },
  PROCESSING: {
    label: 'Processing / Synthesis',
    description: 'Order in production or batch assembly.',
    stepOrder: 5,
  },
  PACKING: {
    label: 'Dispatch Packaging',
    description: 'Items securely packed for dispatch.',
    stepOrder: 6,
  },
  READY_TO_SHIP: {
    label: 'Ready to Ship',
    description: 'Waybill generated and staged for pickup.',
    stepOrder: 7,
  },
  SHIPPED: {
    label: 'Shipped / In Transit',
    description: 'En route via courier.',
    stepOrder: 8,
  },
  DELIVERED: {
    label: 'Delivered',
    description: 'Signed for at destination address.',
    stepOrder: 9,
  },
  COMPLETED: {
    label: 'Completed',
    description: 'Fulfillment finalized and closed.',
    stepOrder: 10,
  },
  CANCELLED: {
    label: 'Cancelled',
    description: 'Order reservation released or voided.',
    stepOrder: 99,
  },
  REFUNDED: {
    label: 'Refunded',
    description: 'Funds returned to customer account.',
    stepOrder: 100,
  },
};

// Listeners for real-time synchronization preparation
type OrderChangeListener = (orders: OrderDetail[]) => void;
const listeners: Set<OrderChangeListener> = new Set();

export class OrderManagementService {
  /**
   * Subscribe to real-time order updates (prepared architecture for WebSocket / Supabase)
   */
  static subscribeToOrderUpdates(listener: OrderChangeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  private static notifyListeners(): void {
    const ordersCopy = [...ADMIN_MOCK_ORDERS];
    listeners.forEach((listener) => listener(ordersCopy));
  }

  /**
   * Generate sequential order reference number with store-specific prefix
   * GroupBuy: GB-000001
   * OnHand: OH-000001
   * MOQ: MOQ-000001
   */
  static generateOrderReference(storeType: string): string {
    const norm = (storeType || 'groupbuy').toLowerCase();
    const key = `gkn_v2_order_seq_${norm}`;
    let seq = 1;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        seq = parseInt(saved, 10) || 1;
      } else {
        const existing = ADMIN_MOCK_ORDERS.filter((o) => (o.storeType || '').toLowerCase() === norm);
        seq = existing.length + 1;
      }
    } catch (e) {
      console.error('Error reading order sequence', e);
    }

    try {
      localStorage.setItem(key, (seq + 1).toString());
    } catch (e) {
      console.error('Error saving order sequence', e);
    }

    const prefixMap: Record<string, string> = {
      groupbuy: 'GB',
      onhand: 'OH',
      moq: 'MOQ',
    };
    const prefix = prefixMap[norm] || 'ORD';
    const padded = String(seq).padStart(6, '0');
    return `${prefix}-${padded}`;
  }

  /**
   * Add a newly submitted customer order into the order management system
   */
  static async createOrder(orderData: Partial<OrderDetail> & { storeType: string }): Promise<OrderDetail> {
    const norm = (orderData.storeType || 'groupbuy').toLowerCase();
    const referenceNumber = orderData.referenceNumber || OrderManagementService.generateOrderReference(norm);

    const processedItems = (orderData.items || []).map((item) => {
      const itemVials = calculateItemVials(item);
      return {
        ...item,
        totalVials: itemVials,
      };
    });

    const totalVials = calculateTotalVials(processedItems);
    const totalLabels = calculateTotalLabels(processedItems);

    const newOrder: OrderDetail = {
      id: orderData.id || `ord_${Date.now()}`,
      referenceNumber,
      storeType: norm as any,
      orderDate: orderData.orderDate || new Date().toISOString(),
      status: orderData.status || 'PAYMENT_VERIFICATION',
      paymentStatus: orderData.paymentStatus || 'VERIFICATION_PENDING',
      shippingStatus: orderData.shippingStatus || 'PREPARING',
      paymentMethod: orderData.paymentMethod || 'GCash Instant Transfer',
      customerName: orderData.customerName || 'Researcher',
      customerEmail: orderData.customerEmail || 'customer@gknlabs.org',
      customerPhone: orderData.customerPhone || '+63 917 000 0000',
      customerCompany: orderData.customerCompany,
      shippingAddress: orderData.shippingAddress || {
        recipientName: 'Researcher',
        phone: '+63 917 000 0000',
        addressLine1: 'Main Lab Building',
        city: 'Manila',
        province: 'Metro Manila',
        postalCode: '1000',
        country: 'Philippines',
      },
      items: processedItems,
      subtotal: orderData.subtotal || 0,
      shippingFee: orderData.shippingFee || 0,
      discount: orderData.discount || 0,
      grandTotal: orderData.grandTotal || 0,
      totalVials: orderData.totalVials ?? totalVials,
      totalLabels: orderData.totalLabels ?? totalLabels,
      orderNotes: orderData.orderNotes || '',
      paymentSummary: orderData.paymentSummary,
      selectedAccessories: orderData.selectedAccessories,
      appliedFees: orderData.appliedFees,
      exchangeRateUsed: orderData.exchangeRateUsed,
      groupBuyData: orderData.groupBuyData || (norm === 'groupbuy' ? { batchNumber: 'GB-2026-08A', batchStatus: 'POOLING_OPEN', estimatedProduction: '2026-09-01' } : undefined),
      onHandData: orderData.onHandData || (norm === 'onhand' ? { dispatchPriority: 'URGENT', inventoryReservationStatus: 'ALLOCATED' } : undefined),
      moqData: orderData.moqData || (norm === 'moq' ? { moqCampaign: 'Bulk Synthesis Campaign', manufacturingProgress: 20, targetUnits: 100, committedUnits: 20 } : undefined),
    };

    ADMIN_MOCK_ORDERS.unshift(newOrder);
    try {
      localStorage.setItem('gkn_v2_all_orders', JSON.stringify(ADMIN_MOCK_ORDERS));
    } catch (e) {
      console.error('Failed to save order to localStorage', e);
    }
    OrderManagementService.notifyListeners();
    return newOrder;
  }

  /**
   * Initialize orders from localStorage if available
   */
  private static initializeOrders(): void {
    try {
      const saved = localStorage.getItem('gkn_v2_all_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          ADMIN_MOCK_ORDERS = parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
  }

  /**
   * Get dynamic list of available assigned batches, store-aware
   */
  static getAvailableBatches(storeFilter?: string): string[] {
    OrderManagementService.initializeOrders();
    let orders = [...ADMIN_MOCK_ORDERS];
    if (storeFilter && storeFilter !== 'all') {
      orders = orders.filter((o) => o.storeType === storeFilter);
    }

    const batches = new Set<string>();
    orders.forEach((o) => {
      if (o.assignedBatch && o.assignedBatch.trim()) {
        batches.add(o.assignedBatch.trim());
      }
      if (o.groupBuyData?.batchNumber && o.groupBuyData.batchNumber.trim()) {
        batches.add(o.groupBuyData.batchNumber.trim());
      }
    });

    return Array.from(batches).sort();
  }

  /**
   * Fetch paginated and filtered list of orders
   */
  static async getOrders(filters: OrderFilterOptions = {}): Promise<{
    orders: OrderDetail[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    let filtered = await fetchOrders();
    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      filtered = filtered.filter((order) => [order.referenceNumber, order.customerName, order.customerEmail, order.customerPhone].some((value) => (value || '').toLowerCase().includes(q)) || order.items.some((item) => item.name.toLowerCase().includes(q)));
    }
    if (filters.storeFilter && filters.storeFilter !== 'all') filtered = filtered.filter((order) => order.storeType === filters.storeFilter);
    if (filters.orderStatusFilter && filters.orderStatusFilter !== 'all') filtered = filtered.filter((order) => order.status === filters.orderStatusFilter);
    if (filters.paymentStatusFilter && filters.paymentStatusFilter !== 'all') filtered = filtered.filter((order) => order.paymentStatus === filters.paymentStatusFilter);
    if (filters.shippingStatusFilter && filters.shippingStatusFilter !== 'all') filtered = filtered.filter((order) => order.shippingStatus === filters.shippingStatusFilter);

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const startIndex = (page - 1) * pageSize;
    const paginatedOrders = filtered.slice(startIndex, startIndex + pageSize);

    return {
      orders: paginatedOrders,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  /**
   * Core unpaginated filter logic used for both view table and filtered export
   */
  private static filterOrdersUnpaginated(filters: OrderFilterOptions = {}): OrderDetail[] {
    OrderManagementService.initializeOrders();
    let filtered = [...ADMIN_MOCK_ORDERS];

    // 1. Search query filter
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      filtered = filtered.filter((order) => {
        const matchRef = order.referenceNumber.toLowerCase().includes(q);
        const matchId = order.id.toLowerCase().includes(q);
        const matchCustomer = (order.customerName || '').toLowerCase().includes(q);
        const matchEmail = (order.customerEmail || '').toLowerCase().includes(q);
        const matchPhone = (order.customerPhone || '').toLowerCase().includes(q);
        const matchTracking = (order.trackingNumber || '').toLowerCase().includes(q);
        const matchBatch = (order.assignedBatch || '').toLowerCase().includes(q);
        const matchItem = order.items.some((item) =>
          item.name.toLowerCase().includes(q) || (item.casNumber || '').toLowerCase().includes(q)
        );
        return matchRef || matchId || matchCustomer || matchEmail || matchPhone || matchTracking || matchBatch || matchItem;
      });
    }

    // 2. Store type filter
    if (filters.storeFilter && filters.storeFilter !== 'all') {
      filtered = filtered.filter((order) => order.storeType === filters.storeFilter);
    }

    // 3. Batch filter (store-aware)
    if (filters.batchFilter && filters.batchFilter !== 'all') {
      if (filters.batchFilter === 'unassigned') {
        filtered = filtered.filter((o) => !o.assignedBatch || o.assignedBatch.trim() === '');
      } else {
        const b = filters.batchFilter.trim().toLowerCase();
        filtered = filtered.filter(
          (o) =>
            (o.assignedBatch || '').trim().toLowerCase() === b ||
            (o.groupBuyData?.batchNumber || '').trim().toLowerCase() === b
        );
      }
    }

    // 4. Order status filter
    if (filters.orderStatusFilter && filters.orderStatusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === filters.orderStatusFilter);
    }

    // 5. Payment status filter
    if (filters.paymentStatusFilter && filters.paymentStatusFilter !== 'all') {
      filtered = filtered.filter((order) => order.paymentStatus === filters.paymentStatusFilter);
    }

    // 6. Shipping status filter
    if (filters.shippingStatusFilter && filters.shippingStatusFilter !== 'all') {
      filtered = filtered.filter((order) => order.shippingStatus === filters.shippingStatusFilter);
    }

    // 7. Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      if (filters.dateRange === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        filtered = filtered.filter((o) => new Date(o.orderDate).getTime() >= startOfDay);
      } else if (filters.dateRange === 'yesterday') {
        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
        const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - 1;
        filtered = filtered.filter((o) => {
          const t = new Date(o.orderDate).getTime();
          return t >= startOfYesterday && t <= endOfYesterday;
        });
      } else if (filters.dateRange === '7days') {
        const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        filtered = filtered.filter((o) => new Date(o.orderDate).getTime() >= sevenDaysAgo);
      } else if (filters.dateRange === '30days') {
        const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
        filtered = filtered.filter((o) => new Date(o.orderDate).getTime() >= thirtyDaysAgo);
      } else if (filters.dateRange === 'custom' && filters.customStartDate && filters.customEndDate) {
        const start = new Date(filters.customStartDate).getTime();
        const end = new Date(filters.customEndDate).getTime() + 24 * 60 * 60 * 1000 - 1;
        filtered = filtered.filter((o) => {
          const t = new Date(o.orderDate).getTime();
          return t >= start && t <= end;
        });
      }
    }

    // 8. Sorting
    const sortBy = filters.sortBy || 'date_desc';
    filtered.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      }
      if (sortBy === 'total_desc') {
        return b.grandTotal - a.grandTotal;
      }
      if (sortBy === 'total_asc') {
        return a.grandTotal - b.grandTotal;
      }
      if (sortBy === 'ref_asc') {
        return a.referenceNumber.localeCompare(b.referenceNumber);
      }
      return 0;
    });

    return filtered;
  }

  /**
   * Get order by ID or Reference Code
   */
  static async getOrderById(idOrRef: string): Promise<OrderDetail | null> {
    const target = idOrRef.trim().toLowerCase();
    const found = (await fetchOrders()).find(
      (o) => o.id.toLowerCase() === target || o.referenceNumber.toLowerCase() === target
    );
    return found ? { ...found } : null;
  }

  /**
   * Update full or partial details of an order
   */
  static async updateOrder(id: string, updates: Partial<OrderDetail>): Promise<OrderDetail> {
    await new Promise((res) => setTimeout(res, 200));
    const index = ADMIN_MOCK_ORDERS.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Order with ID ${id} not found.`);
    }

    ADMIN_MOCK_ORDERS[index] = {
      ...ADMIN_MOCK_ORDERS[index],
      ...updates,
    };

    OrderManagementService.notifyListeners();
    return { ...ADMIN_MOCK_ORDERS[index] };
  }

  /**
   * Update single order status and optional internal note
   */
  static async updateOrderStatus(
    id: string,
    newStatus: OrderStatus,
    adminNoteText?: string
  ): Promise<OrderDetail> {
    const existing = await OrderManagementService.getOrderById(id);
    if (!existing) {
      throw new Error(`Order ${id} not found`);
    }

    const updates: Partial<OrderDetail> = { status: newStatus };

    // Automatically map status transitions to logical payment and shipping statuses
    if (newStatus === 'CONFIRMED' || newStatus === 'PROCESSING' || newStatus === 'SHIPPED' || newStatus === 'COMPLETED') {
      updates.paymentStatus = 'PAID';
      if (existing.paymentSummary) {
        updates.paymentSummary = {
          ...existing.paymentSummary,
          verificationStatus: 'VERIFIED',
          paymentProofStatus: 'VERIFIED',
        };
      }
    }

    if (newStatus === 'PACKING') {
      updates.shippingStatus = 'PACKED';
    } else if (newStatus === 'READY_TO_SHIP') {
      updates.shippingStatus = 'READY_TO_SHIP';
    } else if (newStatus === 'SHIPPED') {
      updates.shippingStatus = 'IN_TRANSIT';
    } else if (newStatus === 'DELIVERED' || newStatus === 'COMPLETED') {
      updates.shippingStatus = 'DELIVERED';
    } else if (newStatus === 'CANCELLED') {
      updates.shippingStatus = 'UNFULFILLED';
    }

    // Append admin note if provided
    if (adminNoteText && adminNoteText.trim()) {
      const noteItem: AdminOrderNote = {
        id: `note_${Date.now()}`,
        author: 'Current Administrator',
        timestamp: new Date().toISOString(),
        text: `Status changed to ${newStatus}. Note: ${adminNoteText.trim()}`,
      };
      updates.adminNotesList = [noteItem, ...(existing.adminNotesList || [])];
      updates.adminNotes = adminNoteText;
    }

    return updateProductionOrderStatus(id, newStatus);
  }

  /**
   * Add internal admin note to an order
   */
  static async addAdminNote(id: string, noteText: string, author = 'Admin'): Promise<OrderDetail> {
    const existing = await OrderManagementService.getOrderById(id);
    if (!existing) throw new Error(`Order ${id} not found`);

    const newNote: AdminOrderNote = {
      id: `note_${Date.now()}`,
      author,
      timestamp: new Date().toISOString(),
      text: noteText,
    };

    const updatedNotes = [newNote, ...(existing.adminNotesList || [])];
    return OrderManagementService.updateOrder(id, {
      adminNotesList: updatedNotes,
      adminNotes: noteText,
    });
  }

  /**
   * Bulk status update
   */
  static async bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<number> {
    await new Promise((res) => setTimeout(res, 300));
    let updatedCount = 0;
    for (const id of orderIds) {
      try {
        await OrderManagementService.updateOrderStatus(
          id,
          status,
          `Bulk status update applied to ${status}`
        );
        updatedCount++;
      } catch (err) {
        console.error(`Error in bulk update for order ${id}:`, err);
      }
    }
    return updatedCount;
  }

  /**
   * Bulk batch assignment
   */
  static async bulkAssignBatch(orderIds: string[], batchNumber: string): Promise<number> {
    await new Promise((res) => setTimeout(res, 250));
    let count = 0;
    for (const id of orderIds) {
      const order = await OrderManagementService.getOrderById(id);
      if (order) {
        const updates: Partial<OrderDetail> = { assignedBatch: batchNumber };
        if (order.storeType === 'groupbuy') {
          updates.groupBuyData = {
            ...(order.groupBuyData || {
              batchStatus: 'POOLING_OPEN',
              estimatedProduction: 'TBD',
            }),
            batchNumber,
          };
        }
        await OrderManagementService.updateOrder(id, updates);
        count++;
      }
    }
    return count;
  }

  /**
   * Generate visual timeline steps for an order based on current status
   */
  static getTimeline(order: OrderDetail): TimelineStep[] {
    const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';

    if (isCancelled) {
      return [
        {
          status: 'PENDING',
          label: 'Order Staged',
          description: 'Order created',
          timestamp: order.orderDate,
          isCompleted: true,
          isCurrent: false,
        },
        {
          status: order.status,
          label: order.status === 'CANCELLED' ? 'Order Cancelled' : 'Order Refunded',
          description: order.status === 'CANCELLED' ? 'Order reservation voided.' : 'Payment refunded to customer.',
          timestamp: new Date().toISOString(),
          isCompleted: true,
          isCurrent: true,
        },
      ];
    }

    const standardFlow: OrderStatus[] = [
      'PENDING',
      'AWAITING_PAYMENT',
      'PAYMENT_VERIFICATION',
      'CONFIRMED',
      'PROCESSING',
      'PACKING',
      'READY_TO_SHIP',
      'SHIPPED',
      'DELIVERED',
      'COMPLETED',
    ];

    const currentIdx = standardFlow.indexOf(order.status);

    return standardFlow.map((st, idx) => {
      const detail = ORDER_STATUS_DETAILS[st];
      const isCompleted = currentIdx >= 0 && idx <= currentIdx;
      const isCurrent = idx === currentIdx;

      let timestamp: string | undefined = undefined;
      if (isCompleted) {
        if (idx === 0) timestamp = order.orderDate;
        else if (idx === currentIdx) timestamp = 'Active Stage';
      }

      return {
        status: st,
        label: detail ? detail.label : st,
        description: detail ? detail.description : '',
        timestamp,
        isCompleted,
        isCurrent,
      };
    });
  }

  /**
   * Export order list to CSV, Excel, or Google Sheets compatible format
   */
  static exportOrders(
    orderIds?: string[],
    format: 'csv' | 'excel' | 'sheets' = 'csv'
  ): { filename: string; content: string } {
    const sourceOrders =
      orderIds && orderIds.length > 0
        ? ADMIN_MOCK_ORDERS.filter((o) => orderIds.includes(o.id))
        : ADMIN_MOCK_ORDERS;

    const headers = [
      'Order Reference',
      'Store Type',
      'Order Date',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Order Status',
      'Payment Status',
      'Payment Method',
      'Payment Proof Status',
      'Shipping Status',
      'Courier',
      'Tracking Number',
      'Assigned Batch',
      'Item Count',
      'Items Detail',
      'Subtotal',
      'Shipping Fee',
      'Discount',
      'Grand Total',
      'Shipping Address',
      'Customer Notes',
      'Admin Notes',
    ];

    const rows = sourceOrders.map((o) => [
      `"${o.referenceNumber}"`,
      `"${o.storeType.toUpperCase()}"`,
      `"${new Date(o.orderDate).toLocaleString()}"`,
      `"${o.customerName || ''}"`,
      `"${o.customerEmail || ''}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.status}"`,
      `"${o.paymentStatus}"`,
      `"${o.paymentMethod || ''}"`,
      `"${o.paymentSummary?.paymentProofStatus || 'N/A'}"`,
      `"${o.shippingStatus || 'N/A'}"`,
      `"${o.courier || ''}"`,
      `"${o.trackingNumber || ''}"`,
      `"${o.assignedBatch || ''}"`,
      o.items.length.toString(),
      `"${o.items.map((i) => `${i.name} x${i.quantity} (${i.variantLabel})`).join('; ')}"`,
      o.subtotal.toFixed(2),
      o.shippingFee.toFixed(2),
      o.discount.toFixed(2),
      o.grandTotal.toFixed(2),
      `"${o.shippingAddress.addressLine1}, ${o.shippingAddress.city}, ${o.shippingAddress.province} ${o.shippingAddress.postalCode}"`,
      `"${(o.orderNotes || '').replace(/"/g, '""')}"`,
      `"${(o.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `GKN_Orders_Export_${timestamp}.${format === 'excel' ? 'csv' : 'csv'}`;

    return {
      filename,
      content: csvContent,
    };
  }

  /**
   * Filter-aware order export function with dynamic contextual filenames
   */
  static exportFilteredOrders(
    filters: OrderFilterOptions = {},
    format: 'csv' | 'excel' | 'sheets' = 'csv'
  ): { success: boolean; count: number; message?: string; filename: string; content: string } {
    const matchingOrders = OrderManagementService.filterOrdersUnpaginated(filters);

    if (matchingOrders.length === 0) {
      return {
        success: false,
        count: 0,
        message: 'No orders match the current filters.',
        filename: '',
        content: '',
      };
    }

    const headers = [
      'Order Reference',
      'Store Type',
      'Order Date',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Order Status',
      'Payment Status',
      'Payment Method',
      'Payment Proof Status',
      'Shipping Status',
      'Courier',
      'Tracking Number',
      'Assigned Batch',
      'Item Count',
      'Items Detail',
      'Subtotal',
      'Shipping Fee',
      'Discount',
      'Grand Total',
      'Shipping Address',
      'Customer Notes',
      'Admin Notes',
    ];

    const rows = matchingOrders.map((o) => [
      `"${o.referenceNumber}"`,
      `"${o.storeType.toUpperCase()}"`,
      `"${new Date(o.orderDate).toLocaleString()}"`,
      `"${o.customerName || ''}"`,
      `"${o.customerEmail || ''}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.status}"`,
      `"${o.paymentStatus}"`,
      `"${o.paymentMethod || ''}"`,
      `"${o.paymentSummary?.paymentProofStatus || 'N/A'}"`,
      `"${o.shippingStatus || 'N/A'}"`,
      `"${o.courier || ''}"`,
      `"${o.trackingNumber || ''}"`,
      `"${o.assignedBatch || ''}"`,
      o.items.length.toString(),
      `"${o.items.map((i) => `${i.name} x${i.quantity} (${i.variantLabel})`).join('; ')}"`,
      o.subtotal.toFixed(2),
      o.shippingFee.toFixed(2),
      o.discount.toFixed(2),
      o.grandTotal.toFixed(2),
      `"${o.shippingAddress.addressLine1}, ${o.shippingAddress.city}, ${o.shippingAddress.province} ${o.shippingAddress.postalCode}"`,
      `"${(o.orderNotes || '').replace(/"/g, '""')}"`,
      `"${(o.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // Build dynamic filename
    let storePart = 'All-Stores';
    if (filters.storeFilter === 'groupbuy') storePart = 'GroupBuy';
    else if (filters.storeFilter === 'onhand') storePart = 'OnHand';
    else if (filters.storeFilter === 'moq') storePart = 'MOQ';

    let batchPart = '';
    if (filters.batchFilter && filters.batchFilter !== 'all') {
      batchPart = `_${filters.batchFilter.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    }

    let statusPart = '';
    if (filters.paymentStatusFilter && filters.paymentStatusFilter !== 'all') {
      statusPart = `_${filters.paymentStatusFilter}`;
    } else if (filters.orderStatusFilter && filters.orderStatusFilter !== 'all') {
      statusPart = `_${filters.orderStatusFilter}`;
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `GKN_${storePart}${batchPart}${statusPart}_${timestamp}.${format === 'excel' ? 'csv' : 'csv'}`;

    return {
      success: true,
      count: matchingOrders.length,
      filename,
      content: csvContent,
    };
  }

  /**
   * Helper to trigger browser download of CSV file
   */
  static downloadExport(exportData: { filename: string; content: string }) {
    const blob = new Blob([exportData.content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', exportData.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Helper summary statistics for the dashboard header
   */
  static getOrderStats() {
    const total = ADMIN_MOCK_ORDERS.length;
    const pendingVerification = ADMIN_MOCK_ORDERS.filter(
      (o) => o.status === 'PAYMENT_VERIFICATION' || o.paymentStatus === 'VERIFICATION_PENDING'
    ).length;
    const readyToShip = ADMIN_MOCK_ORDERS.filter(
      (o) => o.status === 'READY_TO_SHIP' || o.status === 'PACKING'
    ).length;
    const groupBuyCount = ADMIN_MOCK_ORDERS.filter((o) => o.storeType === 'groupbuy').length;
    const onHandCount = ADMIN_MOCK_ORDERS.filter((o) => o.storeType === 'onhand').length;
    const moqCount = ADMIN_MOCK_ORDERS.filter((o) => o.storeType === 'moq').length;
    const totalRevenue = ADMIN_MOCK_ORDERS.filter(
      (o) => o.paymentStatus === 'PAID'
    ).reduce((sum, o) => sum + o.grandTotal, 0);

    return {
      total,
      pendingVerification,
      readyToShip,
      groupBuyCount,
      onHandCount,
      moqCount,
      totalRevenue,
    };
  }
}
