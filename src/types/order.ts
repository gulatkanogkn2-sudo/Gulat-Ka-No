export type OrderStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_VERIFICATION'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKING'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'UNPAID'
  | 'AWAITING_PAYMENT'
  | 'VERIFICATION_PENDING'
  | 'PAID'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'FAILED';

export type ShippingStatus =
  | 'UNFULFILLED'
  | 'PREPARING'
  | 'PACKED'
  | 'READY_TO_SHIP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'RETURNED'
  | 'FAILED_DELIVERY';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  variantLabel: string;
  quantity: number;
  price: number;
  storeType: 'groupbuy' | 'onhand' | 'moq' | string;
  imageUrl?: string;
  purity?: string;
  casNumber?: string;
  sellingUnit?: 'vial' | 'kit';
  vialsPerKit?: number;
  totalVials?: number;
  isAccessory?: boolean;
}

export interface ShippingAddressDetail {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  region?: 'Luzon' | 'Visayas' | 'Mindanao' | string;
  postalCode: string;
  country?: string;
}

export interface GroupBuyOrderData {
  batchNumber: string;
  batchStatus: 'POOLING_OPEN' | 'THRESHOLD_REACHED' | 'LAB_SYNTHESIS' | 'INSPECTION' | 'DISPATCHED_TO_HUB';
  estimatedProduction: string;
}

export interface OnHandOrderData {
  dispatchPriority: 'URGENT' | 'HIGH' | 'STANDARD';
  inventoryReservationStatus: 'RESERVED' | 'ALLOCATED' | 'RELEASED' | 'BACKORDERED';
}

export interface MOQOrderData {
  moqCampaign: string;
  manufacturingProgress: number; // 0 to 100 percentage
  targetUnits?: number;
  committedUnits?: number;
}

export interface PaymentSummary {
  paymentMethod: string;
  amount: number;
  paymentReference: string;
  paymentProofStatus: 'SUBMITTED' | 'NOT_SUBMITTED' | 'VERIFIED' | 'REJECTED';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | 'MANUAL_REVIEW';
  proofUrl?: string;
}

export interface AdminOrderNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface OrderDetail {
  id: string;
  referenceNumber: string;
  storeType: 'groupbuy' | 'onhand' | 'moq' | 'mixed';
  orderDate: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus?: ShippingStatus;
  paymentMethod: string;
  paymentSummary?: PaymentSummary;
  shippingAddress: ShippingAddressDetail;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  totalVials?: number;
  totalLabels?: number;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
  orderNotes?: string; // Customer notes
  adminNotes?: string; // Internal admin notes
  adminNotesList?: AdminOrderNote[];
  proofUrl?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerCompany?: string;
  assignedBatch?: string;
  groupBuyData?: GroupBuyOrderData;
  onHandData?: OnHandOrderData;
  moqData?: MOQOrderData;
  selectedAccessories?: Array<{
    accessoryId?: string;
    name: string;
    quantity: number;
    unitPriceUsd: number;
    totalPriceUsd: number;
  }>;
  appliedFees?: Array<{
    feeId?: string;
    displayName: string;
    amountUsd: number;
    calculationType?: string;
  }>;
  exchangeRateUsed?: number;
}

export interface TimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface OrderFilterOptions {
  searchQuery?: string;
  storeFilter?: 'all' | 'groupbuy' | 'onhand' | 'moq';
  batchFilter?: string;
  orderStatusFilter?: 'all' | OrderStatus;
  paymentStatusFilter?: 'all' | PaymentStatus;
  shippingStatusFilter?: 'all' | ShippingStatus;
  dateRange?: 'all' | 'today' | 'yesterday' | '7days' | '30days' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  sortBy?: 'date_desc' | 'date_asc' | 'total_desc' | 'total_asc' | 'ref_asc';
  page?: number;
  pageSize?: number;
}

export interface ExportFormat {
  type: 'csv' | 'excel' | 'sheets';
}

