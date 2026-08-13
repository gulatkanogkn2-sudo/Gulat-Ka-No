import { OrderDetail, OrderStatus, TimelineStep } from '../types/order';
import { TimelineConfigService } from './timelineConfigService';

export const MOCK_ORDERS: OrderDetail[] = [
  {
    id: 'ord_1001',
    referenceNumber: 'GB-000001',
    storeType: 'groupbuy',
    assignedBatch: 'GB-BATCH-001',
    groupBuyData: {
      batchNumber: 'GB-BATCH-001',
      batchStatus: 'POOLING_OPEN',
      estimatedProduction: 'Aug 20, 2026',
    },
    orderDate: '2026-08-04T14:32:00Z',
    status: 'PAYMENT_VERIFICATION',
    paymentStatus: 'VERIFICATION_PENDING',
    paymentMethod: 'GCash Instant Transfer',
    customerName: 'Dr. Alexander Vance',
    customerEmail: 'alexander.vance@gknlabs.org',
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
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'ord_1002',
    referenceNumber: 'OH-000001',
    storeType: 'onhand',
    orderDate: '2026-08-01T09:15:00Z',
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    paymentMethod: 'Institutional Bank Wire (BDO)',
    customerName: 'Dr. Alexander Vance',
    customerEmail: 'alexander.vance@gknlabs.org',
    shippingAddress: {
      recipientName: 'Central Lab Receiving',
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
    courier: 'LBC Express Same-Day',
    estimatedDelivery: 'Aug 05, 2026 (Today)',
    orderNotes: 'Gate pass required at industrial zone barrier.',
  },
  {
    id: 'ord_1003',
    referenceNumber: 'MOQ-000001',
    storeType: 'moq',
    orderDate: '2026-07-28T16:45:00Z',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'Maya Business Wallet',
    customerName: 'Dr. Alexander Vance',
    customerEmail: 'alexander.vance@gknlabs.org',
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
    courier: 'DHL Express Air',
    estimatedDelivery: 'Delivered Aug 02, 2026',
    orderNotes: 'Order receipt enclosed in pouch.',
  },
];

export const ORDER_STATUS_FLOW: { status: OrderStatus; label: string; description: string }[] = [
  {
    status: 'PENDING',
    label: 'Order Staged',
    description: 'Order reservation placed into queue.',
  },
  {
    status: 'PAYMENT_VERIFICATION',
    label: 'Payment Verification',
    description: 'Bank or wallet payment proof sent for ledger matching.',
  },
  {
    status: 'CONFIRMED',
    label: 'Allocation Confirmed',
    description: 'Payment verified and batch quota secured.',
  },
  {
    status: 'PROCESSING',
    label: 'Processing & Batching',
    description: 'Batch items prepared for dispatch.',
  },
  {
    status: 'PACKING',
    label: 'Dispatch Packaging',
    description: 'Sealed with protective packaging and docs.',
  },
  {
    status: 'READY_TO_SHIP',
    label: 'Ready for Courier',
    description: 'Waybill generated and awaiting carrier pickup.',
  },
  {
    status: 'SHIPPED',
    label: 'In Transit',
    description: 'Handed to courier with active waybill.',
  },
  {
    status: 'DELIVERED',
    label: 'Delivered',
    description: 'Package received and signed at destination address.',
  },
  {
    status: 'COMPLETED',
    label: 'Completed',
    description: 'Order fulfilled and research rewards credited.',
  },
];

export class OrderService {
  /**
   * Retrieves order details by reference code.
   * If code is not in mock list, checks if it follows GKN reference format and generates a live staged order record.
   */
  static async getOrderByReference(referenceNumber: string): Promise<OrderDetail | null> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanRef = referenceNumber.trim().toUpperCase();

    // Check exact match in mock database
    const found = MOCK_ORDERS.find(
      (o) => o.referenceNumber.toUpperCase() === cleanRef || o.id.toUpperCase() === cleanRef
    );

    if (found) {
      return found;
    }

    // If it's a freshly generated checkout reference format like GKN-2026-XXXXXX
    if (cleanRef.startsWith('GKN-')) {
      return {
        id: `ord_${Date.now()}`,
        referenceNumber: cleanRef,
        storeType: 'groupbuy',
        orderDate: new Date().toISOString(),
        status: 'PAYMENT_VERIFICATION',
        paymentStatus: 'VERIFICATION_PENDING',
        paymentMethod: 'GCash / Wire Instant Settlement',
        customerName: 'Dr. Alexander Vance',
        customerEmail: 'alexander.vance@gknlabs.org',
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
            id: 'item_dynamic_1',
            productId: 'semaglutide-5mg',
            name: 'Semaglutide 5mg Standard Vial',
            variantLabel: 'Box of 10 Vials (Lyophilized)',
            quantity: 1,
            price: 249.99,
            storeType: 'groupbuy',
            purity: '99.4%',
            casNumber: '910463-68-2',
          },
        ],
        subtotal: 249.99,
        shippingFee: 15.0,
        discount: 0.0,
        grandTotal: 264.99,
        trackingNumber: 'PENDING_ASSIGNMENT',
        courier: 'LBC Express',
        estimatedDelivery: '24-48 Hours Post Verification',
        orderNotes: 'Newly submitted order via GKN Checkout.',
      };
    }

    return null;
  }

  /**
   * Retrieves recent orders for the customer
   */
  static async getRecentOrders(email?: string): Promise<OrderDetail[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_ORDERS;
  }

  /**
   * Constructs the timeline steps array based on store-specific configuration
   */
  static getTimeline(order: OrderDetail): TimelineStep[] {
    return TimelineConfigService.mapOrderToTimelineSteps(order);
  }
}
