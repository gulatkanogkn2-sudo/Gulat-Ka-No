import {
  ShipmentRecord,
  ShipmentFilterOptions,
  ShipmentStats,
  ShippingStatus,
  PackingStatus,
  CourierName,
  PackingWorkspaceData,
  ShippingTimelineEvent,
  ShippingAdminNote,
  StoreType,
} from '../types/shipping';

// Default initial seed mock shipments for GKN V2 Laboratory operations
const MOCK_SHIPMENTS: ShipmentRecord[] = [
  {
    id: 'SHP-2026-9041',
    shipmentNumber: 'SHP-9041',
    orderNumber: 'ORD-GB-9921',
    orderId: 'ord-gb-9921',
    customerId: 'cust-101',
    customerName: 'Dr. Alexander Vance',
    customerEmail: 'a.vance@neurotech-labs.org',
    storeType: 'GroupBuy',
    courier: 'DHL_EXPRESS',
    courierDisplayName: 'DHL Express',
    trackingNumber: 'DHL-8839201941',
    trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=DHL-8839201941',
    shippingStatus: 'IN_TRANSIT',
    packingStatus: 'COMPLETED',
    dispatchDate: '2026-08-04T09:30:00Z',
    estimatedDelivery: '2026-08-06T14:00:00Z',
    lastUpdated: '2026-08-05T02:15:00Z',
    assignedPacker: 'Tech Elena Vance',
    shippingAddress: {
      fullName: 'Dr. Alexander Vance',
      addressLine1: '742 Evergreen Research Pkwy',
      addressLine2: 'Suite 402 - Cryo Lab',
      city: 'Austin',
      stateProvince: 'TX',
      postalCode: '78701',
      country: 'United States',
      phone: '+1 (512) 555-0192',
      deliveryNotes: 'Leave with lab receptionist. Requires cold storage immediately.',
    },
    items: [
      {
        id: 'item-1',
        sku: 'BPC-157-5MG',
        name: 'BPC-157 5mg Lyophilized Peptide Vial',
        quantity: 10,
        unit: 'vials',
        lotNumber: 'GKN-LOT-2026-X9',
        storageCondition: '-20°C Cryo Storage',
      },
      {
        id: 'item-2',
        sku: 'TB-500-10MG',
        name: 'TB-500 (Thymosin Beta-4) 10mg Vial',
        quantity: 5,
        unit: 'vials',
        lotNumber: 'GKN-LOT-2026-T4',
        storageCondition: '-20°C Cryo Storage',
      },
    ],
    packingWorkspace: {
      checklist: [
        { id: 'c1', label: 'Verify Lot Numbers against QC Certificate', completed: true },
        { id: 'c2', label: 'Inspect Vial Seals and Rubber Stoppers', completed: true },
        { id: 'c3', label: 'Insert Temperature Indicator Tag (-20°C Cryo-Logger)', completed: true },
        { id: 'c4', label: 'Pack Dry Ice / Gel Ice Packs in Insulation Liner', completed: true },
        { id: 'c5', label: 'Attach Bio-Hazard & Temperature Sensitive Warning Label', completed: true },
      ],
      coldChainRequired: true,
      icePackRequired: true,
      thermalPackaging: true,
      packageWeightKg: 1.85,
      boxSizeDimensions: '25x20x15 cm - Thermal Shield Box B2',
      shippingLabelGenerated: true,
      packingCompleted: true,
      packerName: 'Tech Elena Vance',
      packingNotes: 'Packed with 2x Cryo Gel Ice Packs and temp monitoring RFID tag.',
    },
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2026-08-03T16:00:00Z',
        status: 'PENDING_PACKING',
        title: 'Order Approved for Shipment',
        description: 'Payment verified. Order queued for packing in Cleanroom Alpha.',
        operator: 'Admin Sarah',
      },
      {
        id: 'tl-2',
        timestamp: '2026-08-04T08:15:00Z',
        status: 'PACKING',
        title: 'Packing In Progress',
        description: 'Items pulled and protective box assembled.',
        operator: 'Tech Elena Vance',
      },
      {
        id: 'tl-3',
        timestamp: '2026-08-04T09:10:00Z',
        status: 'READY_FOR_PICKUP',
        title: 'Package Sealed & Labeled',
        description: 'Tracking DHL-8839201941 created. Package staged in Outbound Cold Bay.',
        operator: 'Tech Elena Vance',
      },
      {
        id: 'tl-4',
        timestamp: '2026-08-04T11:45:00Z',
        status: 'PICKED_UP',
        title: 'Picked Up by DHL Express',
        description: 'Courier scanned package at Central Logistics Facility.',
        location: 'Austin Regional Logistics Hub',
        operator: 'DHL Carrier #402',
      },
      {
        id: 'tl-5',
        timestamp: '2026-08-05T02:15:00Z',
        status: 'IN_TRANSIT',
        title: 'In Transit - Sort Facility',
        description: 'Processed through DHL Express Regional Sorting Facility.',
        location: 'DFW Sort Hub, TX',
      },
    ],
    internalNotes: [
      {
        id: 'n-1',
        author: 'Tech Elena Vance',
        text: 'Added extra thermal insulation sleeve due to summer heat wave in TX.',
        timestamp: '2026-08-04T09:05:00Z',
      },
    ],
  },
  {
    id: 'SHP-2026-9042',
    shipmentNumber: 'SHP-9042',
    orderNumber: 'ORD-OH-7712',
    orderId: 'ord-oh-7712',
    customerId: 'cust-104',
    customerName: 'Sophia Lin',
    customerEmail: 'sophia.lin@bioprep.io',
    storeType: 'OnHand',
    courier: 'FEDEX_LAB_EXPRESS',
    courierDisplayName: 'FedEx Lab Priority Express',
    trackingNumber: 'FDX-9948210332',
    trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=FDX-9948210332',
    shippingStatus: 'OUT_FOR_DELIVERY',
    packingStatus: 'COMPLETED',
    dispatchDate: '2026-08-04T14:00:00Z',
    estimatedDelivery: '2026-08-05T16:30:00Z',
    lastUpdated: '2026-08-05T07:10:00Z',
    assignedPacker: 'Tech Marcus Reed',
    shippingAddress: {
      fullName: 'Sophia Lin',
      addressLine1: '120 Science Park Drive',
      addressLine2: 'Building 3, Floor 2',
      city: 'Cambridge',
      stateProvince: 'MA',
      postalCode: '02142',
      country: 'United States',
      phone: '+1 (617) 555-0821',
      deliveryNotes: 'Signature required upon delivery.',
    },
    items: [
      {
        id: 'item-3',
        sku: 'SEMA-10MG',
        name: 'Semaglutide 10mg Research Peptide',
        quantity: 6,
        unit: 'vials',
        lotNumber: 'GKN-LOT-2026-S10',
        storageCondition: '-20°C Cryo Storage',
      },
    ],
    packingWorkspace: {
      checklist: [
        { id: 'c1', label: 'Verify Lot Numbers against QC Certificate', completed: true },
        { id: 'c2', label: 'Inspect Vial Seals and Rubber Stoppers', completed: true },
        { id: 'c3', label: 'Insert Temperature Indicator Tag (-20°C Cryo-Logger)', completed: true },
        { id: 'c4', label: 'Pack Dry Ice / Gel Ice Packs in Insulation Liner', completed: true },
        { id: 'c5', label: 'Attach Bio-Hazard & Temperature Sensitive Warning Label', completed: true },
      ],
      coldChainRequired: true,
      icePackRequired: true,
      thermalPackaging: true,
      packageWeightKg: 1.2,
      boxSizeDimensions: '20x15x15 cm - Standard Cryo Box',
      shippingLabelGenerated: true,
      packingCompleted: true,
      packerName: 'Tech Marcus Reed',
      packingNotes: 'Includes reconstituted sterile water diluent ampoules.',
    },
    timeline: [
      {
        id: 'tl-10',
        timestamp: '2026-08-04T10:00:00Z',
        status: 'PENDING_PACKING',
        title: 'Order Received',
        description: 'OnHand inventory order verified.',
        operator: 'Admin Marcus',
      },
      {
        id: 'tl-11',
        timestamp: '2026-08-04T13:00:00Z',
        status: 'PACKING',
        title: 'Packed & Vacuum Sealed',
        description: 'Cleanroom seal completed.',
        operator: 'Tech Marcus Reed',
      },
      {
        id: 'tl-12',
        timestamp: '2026-08-04T14:00:00Z',
        status: 'IN_TRANSIT',
        title: 'In Transit via FedEx Air',
        description: 'Departed Logan Airport Logistics Depot.',
      },
      {
        id: 'tl-13',
        timestamp: '2026-08-05T07:10:00Z',
        status: 'OUT_FOR_DELIVERY',
        title: 'Out For Delivery',
        description: 'On courier vehicle for delivery to Cambridge facility.',
        location: 'Cambridge Distribution Center',
      },
    ],
    internalNotes: [],
  },
  {
    id: 'SHP-2026-9043',
    shipmentNumber: 'SHP-9043',
    orderNumber: 'ORD-MOQ-5531',
    orderId: 'ord-moq-5531',
    customerId: 'cust-108',
    customerName: 'Quantum Bio Labs (Dr. David Sterling)',
    customerEmail: 'd.sterling@quantumbio.com',
    storeType: 'MOQ',
    courier: 'UPS_COLD_CHAIN',
    courierDisplayName: 'UPS Next Day Air Cryo-Saver',
    trackingNumber: null,
    trackingUrl: undefined,
    shippingStatus: 'PENDING_PACKING',
    packingStatus: 'UNPACKED',
    dispatchDate: null,
    estimatedDelivery: '2026-08-08T17:00:00Z',
    lastUpdated: '2026-08-05T04:10:00Z',
    assignedPacker: 'Tech Elena Vance',
    shippingAddress: {
      fullName: 'Dr. David Sterling',
      addressLine1: '88 Innovation Way',
      addressLine2: 'BioTech Park - Wing C',
      city: 'San Diego',
      stateProvince: 'CA',
      postalCode: '92121',
      country: 'United States',
      phone: '+1 (858) 555-3419',
      deliveryNotes: 'Bulk MOQ Order. Heavy freight pallet box.',
    },
    items: [
      {
        id: 'item-4',
        sku: 'TIRZEP-15MG',
        name: 'Tirzepatide 15mg Research Peptide (Bulk 50-Pack)',
        quantity: 50,
        unit: 'vials',
        lotNumber: 'GKN-LOT-2026-TZ15',
        storageCondition: '-20°C Cryo Storage',
      },
      {
        id: 'item-5',
        sku: 'BAC-WATER-10ML',
        name: 'Bacteriostatic Water 10ml Bottles',
        quantity: 50,
        unit: 'bottles',
        lotNumber: 'GKN-LOT-2026-BW10',
        storageCondition: 'Room Temp (15-25°C)',
      },
    ],
    packingWorkspace: {
      checklist: [
        { id: 'c1', label: 'Verify Lot Numbers against QC Certificate', completed: false },
        { id: 'c2', label: 'Inspect Vial Seals and Rubber Stoppers', completed: false },
        { id: 'c3', label: 'Insert Temperature Indicator Tag (-20°C Cryo-Logger)', completed: false },
        { id: 'c4', label: 'Pack Dry Ice / Gel Ice Packs in Insulation Liner', completed: false },
        { id: 'c5', label: 'Attach Bio-Hazard & Temperature Sensitive Warning Label', completed: false },
      ],
      coldChainRequired: true,
      icePackRequired: true,
      thermalPackaging: true,
      packageWeightKg: 8.5,
      boxSizeDimensions: '45x35x30 cm - Large Cryo Pallet Box',
      shippingLabelGenerated: false,
      packingCompleted: false,
      packerName: undefined,
      packingNotes: 'Pending QC sign-off on bulk batch TZ15.',
    },
    timeline: [
      {
        id: 'tl-20',
        timestamp: '2026-08-05T04:10:00Z',
        status: 'PENDING_PACKING',
        title: 'MOQ Bulk Order Queued',
        description: 'Bulk order threshold met and payment verified.',
        operator: 'Admin Sarah',
      },
    ],
    internalNotes: [
      {
        id: 'n-2',
        author: 'Admin Sarah',
        text: 'Customer requested temperature log printout included inside container.',
        timestamp: '2026-08-05T04:12:00Z',
      },
    ],
  },
  {
    id: 'SHP-2026-9044',
    shipmentNumber: 'SHP-9044',
    orderNumber: 'ORD-GB-9925',
    orderId: 'ord-gb-9925',
    customerId: 'cust-112',
    customerName: 'Prof. Jonathan Vance',
    customerEmail: 'j.vance@apexresearch.edu',
    storeType: 'GroupBuy',
    courier: 'DHL_EXPRESS',
    courierDisplayName: 'DHL Express International',
    trackingNumber: 'DHL-1102938491',
    trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=DHL-1102938491',
    shippingStatus: 'DELIVERED',
    packingStatus: 'COMPLETED',
    dispatchDate: '2026-08-01T10:00:00Z',
    estimatedDelivery: '2026-08-03T18:00:00Z',
    actualDeliveryDate: '2026-08-03T15:42:00Z',
    lastUpdated: '2026-08-03T15:42:00Z',
    assignedPacker: 'Tech Marcus Reed',
    shippingAddress: {
      fullName: 'Prof. Jonathan Vance',
      addressLine1: '14 University Plaza',
      addressLine2: 'Department of Molecular Biology',
      city: 'Seattle',
      stateProvince: 'WA',
      postalCode: '98105',
      country: 'United States',
      phone: '+1 (206) 555-8812',
    },
    items: [
      {
        id: 'item-6',
        sku: 'CJC-1295-NODAC',
        name: 'CJC-1295 No DAC 5mg Vial',
        quantity: 12,
        unit: 'vials',
        lotNumber: 'GKN-LOT-2026-CJC',
        storageCondition: '-20°C Cryo Storage',
      },
      {
        id: 'item-7',
        sku: 'IPAMORELIN-5MG',
        name: 'Ipamorelin 5mg Research Vial',
        quantity: 12,
        unit: 'vials',
        lotNumber: 'GKN-LOT-2026-IPA',
        storageCondition: '-20°C Cryo Storage',
      },
    ],
    packingWorkspace: {
      checklist: [
        { id: 'c1', label: 'Verify Lot Numbers against QC Certificate', completed: true },
        { id: 'c2', label: 'Inspect Vial Seals and Rubber Stoppers', completed: true },
        { id: 'c3', label: 'Insert Temperature Indicator Tag (-20°C Cryo-Logger)', completed: true },
        { id: 'c4', label: 'Pack Dry Ice / Gel Ice Packs in Insulation Liner', completed: true },
        { id: 'c5', label: 'Attach Bio-Hazard & Temperature Sensitive Warning Label', completed: true },
      ],
      coldChainRequired: true,
      icePackRequired: true,
      thermalPackaging: true,
      packageWeightKg: 2.1,
      boxSizeDimensions: '30x20x15 cm - Cryo Shield Box B3',
      shippingLabelGenerated: true,
      packingCompleted: true,
      packerName: 'Tech Marcus Reed',
    },
    timeline: [
      {
        id: 'tl-30',
        timestamp: '2026-08-01T08:00:00Z',
        status: 'PENDING_PACKING',
        title: 'Order Approved',
        description: 'Queued for shipping.',
      },
      {
        id: 'tl-31',
        timestamp: '2026-08-01T09:30:00Z',
        status: 'READY_FOR_PICKUP',
        title: 'Package Packed',
        description: 'Ready for courier pickup.',
      },
      {
        id: 'tl-32',
        timestamp: '2026-08-01T10:00:00Z',
        status: 'IN_TRANSIT',
        title: 'Dispatched via DHL',
        description: 'Tracking DHL-1102938491 active.',
      },
      {
        id: 'tl-33',
        timestamp: '2026-08-03T15:42:00Z',
        status: 'DELIVERED',
        title: 'Delivered',
        description: 'Signed for by J. Vance (Receiver). Temperature tag verified OK.',
        location: 'Seattle, WA',
      },
    ],
    internalNotes: [],
  },
  {
    id: 'SHP-2026-9045',
    shipmentNumber: 'SHP-9045',
    orderNumber: 'ORD-OH-7719',
    orderId: 'ord-oh-7719',
    customerId: 'cust-115',
    customerName: 'Elena Rostova',
    customerEmail: 'e.rostova@synapsebio.de',
    storeType: 'OnHand',
    courier: 'USPS_PRIORITY',
    courierDisplayName: 'USPS Priority Express (Air)',
    trackingNumber: '9405511202039481029341',
    trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9405511202039481029341',
    shippingStatus: 'DELIVERY_FAILED',
    packingStatus: 'COMPLETED',
    dispatchDate: '2026-08-02T11:00:00Z',
    estimatedDelivery: '2026-08-04T15:00:00Z',
    lastUpdated: '2026-08-04T17:30:00Z',
    assignedPacker: 'Tech Elena Vance',
    shippingAddress: {
      fullName: 'Elena Rostova',
      addressLine1: '450 Silicon Avenue',
      addressLine2: 'Suite 12',
      city: 'San Jose',
      stateProvince: 'CA',
      postalCode: '95110',
      country: 'United States',
      phone: '+1 (408) 555-9031',
      deliveryNotes: 'Business address closed on weekends.',
    },
    items: [
      {
        id: 'item-8',
        sku: 'MOTS-C-10MG',
        name: 'MOTS-c 10mg Mitochondrial Peptide',
        quantity: 5,
        unit: 'vials',
        lotNumber: 'GKN-LOT-2026-M10',
        storageCondition: '-20°C Cryo Storage',
      },
    ],
    packingWorkspace: {
      checklist: [
        { id: 'c1', label: 'Verify Lot Numbers against QC Certificate', completed: true },
        { id: 'c2', label: 'Inspect Vial Seals and Rubber Stoppers', completed: true },
        { id: 'c3', label: 'Insert Temperature Indicator Tag (-20°C Cryo-Logger)', completed: true },
        { id: 'c4', label: 'Pack Dry Ice / Gel Ice Packs in Insulation Liner', completed: true },
        { id: 'c5', label: 'Attach Bio-Hazard & Temperature Sensitive Warning Label', completed: true },
      ],
      coldChainRequired: true,
      icePackRequired: true,
      thermalPackaging: true,
      packageWeightKg: 1.1,
      boxSizeDimensions: '20x15x15 cm - Standard Cryo Box',
      shippingLabelGenerated: true,
      packingCompleted: true,
      packerName: 'Tech Elena Vance',
    },
    timeline: [
      {
        id: 'tl-40',
        timestamp: '2026-08-02T11:00:00Z',
        status: 'IN_TRANSIT',
        title: 'Dispatched via USPS Priority',
        description: 'Departed San Jose Sorting Center.',
      },
      {
        id: 'tl-41',
        timestamp: '2026-08-04T17:30:00Z',
        status: 'DELIVERY_FAILED',
        title: 'Delivery Attempt Failed',
        description: 'Facility closed / No recipient available to sign. Held at local Post Office.',
        location: 'San Jose Main Post Office',
      },
    ],
    internalNotes: [
      {
        id: 'n-3',
        author: 'Admin Marcus',
        text: 'Contacted customer via email regarding pickup from post office depot.',
        timestamp: '2026-08-04T18:00:00Z',
      },
    ],
  },
  {
    id: 'SHP-2026-9046',
    shipmentNumber: 'SHP-9046',
    orderNumber: 'ORD-GB-9930',
    orderId: 'ord-gb-9930',
    customerId: 'cust-120',
    customerName: 'Marcus Thorne',
    customerEmail: 'm.thorne@titanlabs.com',
    storeType: 'GroupBuy',
    courier: 'DHL_EXPRESS',
    courierDisplayName: 'DHL Express',
    trackingNumber: null,
    trackingUrl: undefined,
    shippingStatus: 'PACKING',
    packingStatus: 'IN_PROGRESS',
    dispatchDate: null,
    estimatedDelivery: '2026-08-07T12:00:00Z',
    lastUpdated: '2026-08-05T04:45:00Z',
    assignedPacker: 'Tech Marcus Reed',
    shippingAddress: {
      fullName: 'Marcus Thorne',
      addressLine1: '300 Frontier Tech Way',
      city: 'Denver',
      stateProvince: 'CO',
      postalCode: '80202',
      country: 'United States',
      phone: '+1 (303) 555-4920',
    },
    items: [
      {
        id: 'item-9',
        sku: 'RETATRUTA-10MG',
        name: 'Retatrutide 10mg Triple Agonist Vial',
        quantity: 8,
        unit: 'vials',
        lotNumber: 'GKN-LOT-2026-RE10',
        storageCondition: '-20°C Cryo Storage',
      },
    ],
    packingWorkspace: {
      checklist: [
        { id: 'c1', label: 'Verify Lot Numbers against QC Certificate', completed: true },
        { id: 'c2', label: 'Inspect Vial Seals and Rubber Stoppers', completed: true },
        { id: 'c3', label: 'Insert Temperature Indicator Tag (-20°C Cryo-Logger)', completed: true },
        { id: 'c4', label: 'Pack Dry Ice / Gel Ice Packs in Insulation Liner', completed: false },
        { id: 'c5', label: 'Attach Bio-Hazard & Temperature Sensitive Warning Label', completed: false },
      ],
      coldChainRequired: true,
      icePackRequired: true,
      thermalPackaging: true,
      packageWeightKg: 1.5,
      boxSizeDimensions: '25x20x15 cm - Thermal Shield Box B2',
      shippingLabelGenerated: false,
      packingCompleted: false,
      packerName: 'Tech Marcus Reed',
      packingNotes: 'Currently assembling ice packs in cold room.',
    },
    timeline: [
      {
        id: 'tl-50',
        timestamp: '2026-08-05T04:00:00Z',
        status: 'PENDING_PACKING',
        title: 'Queued for Packing',
        description: 'Payment confirmed. Assigned to Tech Marcus Reed.',
      },
      {
        id: 'tl-51',
        timestamp: '2026-08-05T04:45:00Z',
        status: 'PACKING',
        title: 'Packing Started',
        description: 'Vials loaded into insulated cryo box.',
        operator: 'Tech Marcus Reed',
      },
    ],
    internalNotes: [],
  },
];

// In-memory persistent state for simulated live service environment
let currentShipments: ShipmentRecord[] = JSON.parse(JSON.stringify(MOCK_SHIPMENTS));
const listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach((fn) => fn());
};

export class ShippingManagementService {
  /**
   * Fetch shipments with filtering, sorting, searching, date filtering, and pagination
   */
  static async getShipments(filters: ShipmentFilterOptions): Promise<{
    shipments: ShipmentRecord[];
    totalCount: number;
    totalPages: number;
    stats: ShipmentStats;
  }> {
    // Calculate global stats before filtering
    const stats: ShipmentStats = {
      totalShipments: currentShipments.length,
      pendingPackingCount: currentShipments.filter(
        (s) => s.shippingStatus === 'PENDING_PACKING' || s.shippingStatus === 'PACKING'
      ).length,
      inTransitCount: currentShipments.filter(
        (s) => s.shippingStatus === 'IN_TRANSIT' || s.shippingStatus === 'OUT_FOR_DELIVERY' || s.shippingStatus === 'READY_FOR_PICKUP' || s.shippingStatus === 'PICKED_UP'
      ).length,
      deliveredCount: currentShipments.filter((s) => s.shippingStatus === 'DELIVERED').length,
      failedReturnedCount: currentShipments.filter(
        (s) => s.shippingStatus === 'DELIVERY_FAILED' || s.shippingStatus === 'RETURNED'
      ).length,
    };

    let result = [...currentShipments];

    // Search Query (Shipment ID, Order Number, Customer Name, Customer Email, Tracking #)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.shipmentNumber.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.orderNumber.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.customerEmail.toLowerCase().includes(q) ||
          (s.trackingNumber && s.trackingNumber.toLowerCase().includes(q))
      );
    }

    // Store Filter
    if (filters.storeFilter && filters.storeFilter !== 'all') {
      const sf = filters.storeFilter.toLowerCase();
      result = result.filter((s) => s.storeType.toLowerCase() === sf);
    }

    // Courier Filter
    if (filters.courierFilter && filters.courierFilter !== 'all') {
      result = result.filter((s) => s.courier === filters.courierFilter);
    }

    // Shipping Status Filter
    if (filters.shippingStatusFilter && filters.shippingStatusFilter !== 'all') {
      result = result.filter((s) => s.shippingStatus === filters.shippingStatusFilter);
    }

    // Packing Status Filter
    if (filters.packingStatusFilter && filters.packingStatusFilter !== 'all') {
      result = result.filter((s) => s.packingStatus === filters.packingStatusFilter);
    }

    // Date Range Filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      if (filters.dateRange === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        result = result.filter((s) => new Date(s.lastUpdated).getTime() >= startOfDay);
      } else if (filters.dateRange === '7days') {
        const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        result = result.filter((s) => new Date(s.lastUpdated).getTime() >= sevenDaysAgo);
      } else if (filters.dateRange === '30days') {
        const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
        result = result.filter((s) => new Date(s.lastUpdated).getTime() >= thirtyDaysAgo);
      } else if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate).getTime();
        const end = new Date(filters.endDate).getTime() + 86400000; // include end date
        result = result.filter((s) => {
          const t = new Date(s.lastUpdated).getTime();
          return t >= start && t <= end;
        });
      }
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'date_desc') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      } else if (filters.sortBy === 'date_asc') {
        return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      } else if (filters.sortBy === 'order_number') {
        return a.orderNumber.localeCompare(b.orderNumber);
      } else if (filters.sortBy === 'status') {
        return a.shippingStatus.localeCompare(b.shippingStatus);
      }
      return 0;
    });

    const totalCount = result.length;
    const pageSize = filters.pageSize || 10;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const page = Math.min(Math.max(1, filters.page || 1), totalPages);

    const paginatedShipments = result.slice((page - 1) * pageSize, page * pageSize);

    return {
      shipments: paginatedShipments,
      totalCount,
      totalPages,
      stats,
    };
  }

  /**
   * Fetch single shipment by ID
   */
  static async getShipmentById(id: string): Promise<ShipmentRecord | null> {
    const found = currentShipments.find((s) => s.id === id || s.shipmentNumber === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  /**
   * Update Shipping Status with optional milestone detail and timeline event
   */
  static async updateShipmentStatus(
    id: string,
    newStatus: ShippingStatus,
    operatorNote?: string,
    location?: string,
    operator: string = 'Admin User'
  ): Promise<ShipmentRecord> {
    const idx = currentShipments.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Shipment with ID ${id} not found.`);

    const record = currentShipments[idx];
    const oldStatus = record.shippingStatus;
    const nowISO = new Date().toISOString();

    record.shippingStatus = newStatus;
    record.lastUpdated = nowISO;

    // Update dispatch/delivery timestamps appropriately
    if (newStatus === 'IN_TRANSIT' && !record.dispatchDate) {
      record.dispatchDate = nowISO;
    }
    if (newStatus === 'DELIVERED') {
      record.actualDeliveryDate = nowISO;
    }

    // Sync packing status if status updated
    if (newStatus === 'PACKING') {
      record.packingStatus = 'IN_PROGRESS';
    } else if (newStatus === 'READY_FOR_PICKUP' || newStatus === 'IN_TRANSIT' || newStatus === 'DELIVERED') {
      record.packingStatus = 'COMPLETED';
      record.packingWorkspace.packingCompleted = true;
    }

    // Append to visual timeline
    const titleMap: Record<ShippingStatus, string> = {
      PENDING_PACKING: 'Queued for Packing',
      PACKING: 'Packing in Cleanroom',
      READY_FOR_PICKUP: 'Package Ready & Labeled',
      PICKED_UP: 'Picked Up by Courier',
      IN_TRANSIT: 'In Transit',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered to Destination',
      DELIVERY_FAILED: 'Delivery Attempt Failed',
      RETURNED: 'Returned to Facility',
    };

    const newEvent: ShippingTimelineEvent = {
      id: `tl-${Date.now()}`,
      timestamp: nowISO,
      status: newStatus,
      title: titleMap[newStatus] || `Status updated to ${newStatus}`,
      description: operatorNote || `Shipping status changed from ${oldStatus} to ${newStatus}.`,
      location: location || undefined,
      operator: operator,
    };

    record.timeline.push(newEvent);

    // Prepare connection payload for Customer Order Tracker
    this.prepareOrderTrackerIntegrationPayload(record.id);

    notifyListeners();
    return JSON.parse(JSON.stringify(record));
  }

  /**
   * Assign Courier and Tracking Number
   */
  static async assignCourierAndTracking(
    id: string,
    courier: CourierName,
    trackingNumber: string,
    estimatedDelivery?: string,
    operator: string = 'Admin User'
  ): Promise<ShipmentRecord> {
    const idx = currentShipments.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Shipment with ID ${id} not found.`);

    const record = currentShipments[idx];
    const nowISO = new Date().toISOString();

    record.courier = courier;
    const courierNames: Record<CourierName, string> = {
      DHL_EXPRESS: 'DHL Express',
      FEDEX_LAB_EXPRESS: 'FedEx Priority Express',
      UPS_COLD_CHAIN: 'UPS Next Day Air',
      USPS_PRIORITY: 'USPS Priority Express',
      LOCAL_COURIER: 'GKN Local Transport',
      OTHER: 'Specialist Express Courier',
    };
    record.courierDisplayName = courierNames[courier] || courier;
    record.trackingNumber = trackingNumber;
    
    // Generate tracking URL based on carrier
    if (courier === 'DHL_EXPRESS') {
      record.trackingUrl = `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
    } else if (courier === 'FEDEX_LAB_EXPRESS') {
      record.trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
    } else if (courier === 'UPS_COLD_CHAIN') {
      record.trackingUrl = `https://www.ups.com/track?tracknum=${trackingNumber}`;
    } else if (courier === 'USPS_PRIORITY') {
      record.trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
    } else {
      record.trackingUrl = undefined;
    }

    if (estimatedDelivery) {
      record.estimatedDelivery = estimatedDelivery;
    }
    record.lastUpdated = nowISO;

    // Automatically mark label generated
    record.packingWorkspace.shippingLabelGenerated = true;

    // Add timeline milestone
    record.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: nowISO,
      status: record.shippingStatus,
      title: 'Courier & Tracking Assigned',
      description: `Carrier ${record.courierDisplayName} assigned with Tracking #${trackingNumber}.`,
      operator: operator,
    });

    notifyListeners();
    return JSON.parse(JSON.stringify(record));
  }

  /**
   * Update Packing Workspace (Checklist items, weight, cold chain toggles, notes)
   */
  static async updatePackingWorkspace(
    id: string,
    packingData: Partial<PackingWorkspaceData>,
    operator: string = 'Tech Elena Vance'
  ): Promise<ShipmentRecord> {
    const idx = currentShipments.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Shipment with ID ${id} not found.`);

    const record = currentShipments[idx];
    const nowISO = new Date().toISOString();

    record.packingWorkspace = {
      ...record.packingWorkspace,
      ...packingData,
      packerName: operator,
    };

    // If packing completed toggle turned on
    if (packingData.packingCompleted) {
      record.packingStatus = 'COMPLETED';
      if (record.shippingStatus === 'PENDING_PACKING' || record.shippingStatus === 'PACKING') {
        record.shippingStatus = 'READY_FOR_PICKUP';
      }
      // Add milestone
      record.timeline.push({
        id: `tl-${Date.now()}`,
        timestamp: nowISO,
        status: record.shippingStatus,
        title: 'Packing Completed & Sealed',
        description: `Verified by ${operator}. Package ready for courier collection.`,
        operator: operator,
      });
    } else if (packingData.checklist && packingData.checklist.some((c) => c.completed)) {
      record.packingStatus = 'IN_PROGRESS';
      if (record.shippingStatus === 'PENDING_PACKING') {
        record.shippingStatus = 'PACKING';
      }
    }

    record.lastUpdated = nowISO;
    notifyListeners();
    return JSON.parse(JSON.stringify(record));
  }

  /**
   * Add internal administrative note to shipment record
   */
  static async addInternalNote(
    id: string,
    text: string,
    author: string = 'Admin User'
  ): Promise<ShipmentRecord> {
    const idx = currentShipments.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Shipment with ID ${id} not found.`);

    const record = currentShipments[idx];
    const newNote: ShippingAdminNote = {
      id: `note-${Date.now()}`,
      author,
      text,
      timestamp: new Date().toISOString(),
    };

    record.internalNotes.unshift(newNote);
    record.lastUpdated = new Date().toISOString();

    notifyListeners();
    return JSON.parse(JSON.stringify(record));
  }

  /**
   * Bulk Assign Courier
   */
  static async bulkAssignCourier(
    shipmentIds: string[],
    courier: CourierName,
    operator: string = 'Admin User'
  ): Promise<number> {
    let count = 0;
    const nowISO = new Date().toISOString();
    const courierNames: Record<CourierName, string> = {
      DHL_EXPRESS: 'DHL Express',
      FEDEX_LAB_EXPRESS: 'FedEx Priority Express',
      UPS_COLD_CHAIN: 'UPS Next Day Air',
      USPS_PRIORITY: 'USPS Priority Express',
      LOCAL_COURIER: 'GKN Local Transport',
      OTHER: 'Specialist Express Courier',
    };

    currentShipments.forEach((record) => {
      if (shipmentIds.includes(record.id)) {
        record.courier = courier;
        record.courierDisplayName = courierNames[courier] || courier;
        record.lastUpdated = nowISO;
        record.timeline.push({
          id: `tl-bulk-${Date.now()}-${count}`,
          timestamp: nowISO,
          status: record.shippingStatus,
          title: 'Courier Reassigned via Bulk Action',
          description: `Assigned carrier ${record.courierDisplayName}.`,
          operator,
        });
        count++;
      }
    });

    notifyListeners();
    return count;
  }

  /**
   * Bulk Update Shipping Status
   */
  static async bulkUpdateStatus(
    shipmentIds: string[],
    newStatus: ShippingStatus,
    operator: string = 'Admin User'
  ): Promise<number> {
    let count = 0;
    const nowISO = new Date().toISOString();

    currentShipments.forEach((record) => {
      if (shipmentIds.includes(record.id)) {
        record.shippingStatus = newStatus;
        record.lastUpdated = nowISO;
        if (newStatus === 'IN_TRANSIT' && !record.dispatchDate) {
          record.dispatchDate = nowISO;
        }
        if (newStatus === 'DELIVERED') {
          record.actualDeliveryDate = nowISO;
        }
        record.timeline.push({
          id: `tl-bulk-${Date.now()}-${count}`,
          timestamp: nowISO,
          status: newStatus,
          title: `Bulk Status Update to ${newStatus}`,
          description: `Updated status to ${newStatus} via administrative bulk action.`,
          operator,
        });
        count++;
      }
    });

    notifyListeners();
    return count;
  }

  /**
   * Export shipments to CSV / Excel / Sheets format
   */
  static exportShipments(
    shipmentsToExport: ShipmentRecord[],
    format: 'csv' | 'excel' | 'sheets' = 'csv'
  ): string {
    const headers = [
      'Shipment ID',
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Store',
      'Courier',
      'Tracking Number',
      'Shipping Status',
      'Packing Status',
      'Dispatch Date',
      'Estimated Delivery',
      'Recipient Address',
      'Total Items',
      'Cold Chain Required',
      'Last Updated',
    ];

    const rows = shipmentsToExport.map((s) => [
      s.id,
      s.orderNumber,
      `"${s.customerName.replace(/"/g, '""')}"`,
      s.customerEmail,
      s.storeType,
      `"${s.courierDisplayName.replace(/"/g, '""')}"`,
      s.trackingNumber || 'N/A',
      s.shippingStatus,
      s.packingStatus,
      s.dispatchDate ? new Date(s.dispatchDate).toLocaleDateString() : 'N/A',
      s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : 'N/A',
      `"${s.shippingAddress.addressLine1}, ${s.shippingAddress.city}, ${s.shippingAddress.stateProvince} ${s.shippingAddress.postalCode}, ${s.shippingAddress.country}"`.replace(/"/g, '""'),
      s.items.reduce((acc, item) => acc + item.quantity, 0),
      s.packingWorkspace.coldChainRequired ? 'YES (-20°C)' : 'NO',
      new Date(s.lastUpdated).toLocaleString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // Create browser download blob trigger
    if (typeof window !== 'undefined') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `GKN_Shipments_Export_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xls' : 'csv'}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return csvContent;
  }

  /**
   * Bulk Export by IDs
   */
  static async bulkExportShipments(
    shipmentIds: string[],
    format: 'csv' | 'excel' | 'sheets' = 'csv'
  ): Promise<string> {
    const records = currentShipments.filter((s) => shipmentIds.includes(s.id));
    return this.exportShipments(records, format);
  }

  /**
   * Prepared Connection Payload for future Customer Order Tracker integration
   * (Architecture requirement from blueprint)
   */
  static prepareOrderTrackerIntegrationPayload(shipmentId: string): {
    shipmentId: string;
    orderId: string;
    orderNumber: string;
    shippingStatus: ShippingStatus;
    courier: string;
    trackingNumber: string | null;
    estimatedDelivery: string | null;
    syncTimestamp: string;
  } | null {
    const shipment = currentShipments.find((s) => s.id === shipmentId);
    if (!shipment) return null;

    const payload = {
      shipmentId: shipment.id,
      orderId: shipment.orderId,
      orderNumber: shipment.orderNumber,
      shippingStatus: shipment.shippingStatus,
      courier: shipment.courierDisplayName,
      trackingNumber: shipment.trackingNumber,
      estimatedDelivery: shipment.estimatedDelivery,
      syncTimestamp: new Date().toISOString(),
    };

    // Ready to be consumed by Supabase / Order Tracking Event Bus
    return payload;
  }

  /**
   * Subscribe to real-time state updates
   */
  static subscribeToShipmentUpdates(listener: () => void): () => void {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }
}
