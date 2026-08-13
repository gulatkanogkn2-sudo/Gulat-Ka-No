export type ShippingStatus =
  | 'PENDING_PACKING'
  | 'PACKING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_FAILED'
  | 'RETURNED';

export type PackingStatus = 'UNPACKED' | 'IN_PROGRESS' | 'COMPLETED';

export type CourierName =
  | 'DHL_EXPRESS'
  | 'FEDEX_LAB_EXPRESS'
  | 'UPS_COLD_CHAIN'
  | 'USPS_PRIORITY'
  | 'LOCAL_COURIER'
  | 'OTHER';

export type StoreType = 'GroupBuy' | 'OnHand' | 'MOQ' | 'groupbuy' | 'onhand' | 'moq';

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phone: string;
  deliveryNotes?: string;
}

export interface ShippedOrderItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unit: string; // e.g., 'vials', 'kits'
  lotNumber?: string;
  storageCondition?: string; // e.g. '-20°C Cryo Vault'
}

export interface PackingChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface PackingWorkspaceData {
  checklist: PackingChecklistItem[];
  coldChainRequired: boolean;
  icePackRequired: boolean;
  thermalPackaging: boolean;
  packageWeightKg: number;
  boxSizeDimensions: string;
  shippingLabelGenerated: boolean;
  packingCompleted: boolean;
  packerName?: string;
  packingNotes?: string;
}

export interface ShippingTimelineEvent {
  id: string;
  timestamp: string;
  status: ShippingStatus;
  title: string;
  description: string;
  location?: string;
  operator?: string;
}

export interface ShippingAdminNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ShipmentRecord {
  id: string; // e.g. "SHP-2026-9041"
  shipmentNumber: string;
  orderNumber: string; // e.g. "ORD-GB-9921"
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  storeType: StoreType;
  courier: CourierName;
  courierDisplayName: string;
  trackingNumber: string | null;
  trackingUrl?: string;
  shippingStatus: ShippingStatus;
  packingStatus: PackingStatus;
  dispatchDate: string | null; // ISO Date
  estimatedDelivery: string | null; // ISO Date
  actualDeliveryDate?: string | null;
  lastUpdated: string; // ISO Date
  assignedPacker?: string;
  items: ShippedOrderItem[];
  packingWorkspace: PackingWorkspaceData;
  timeline: ShippingTimelineEvent[];
  internalNotes: ShippingAdminNote[];
}

export interface ShipmentFilterOptions {
  searchQuery: string;
  storeFilter: StoreType | 'all';
  courierFilter: CourierName | 'all';
  shippingStatusFilter: ShippingStatus | 'all';
  packingStatusFilter: PackingStatus | 'all';
  dateRange: 'all' | 'today' | '7days' | '30days' | 'custom';
  startDate?: string;
  endDate?: string;
  sortBy: 'date_desc' | 'date_asc' | 'status' | 'order_number';
  page: number;
  pageSize: number;
}

export interface ShipmentStats {
  totalShipments: number;
  pendingPackingCount: number;
  inTransitCount: number;
  deliveredCount: number;
  failedReturnedCount: number;
}
