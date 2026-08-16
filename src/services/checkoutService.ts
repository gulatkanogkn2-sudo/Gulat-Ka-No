import {
  PaymentMethodOption,
  ShippingAddress,
  CustomerFormFieldDefinition,
  CheckoutAccessory,
  CheckoutFeeRule,
  SelectedAccessory,
  AppliedFee,
  CheckoutBreakdownResult,
  OrderSubmissionPayload,
  OrderSubmissionResult,
} from '../types/checkout';
import { StoreType } from '../types';
import { OrderManagementService } from './orderManagementService';
import { convertUsdToPhp } from '../utils/currencyUtils';
import { ShippingFeeEngine } from './shippingFeeEngine';
import { calculateTotalVials, calculateTotalKits } from '../utils/vialCalculation';
import { createProductionOrder } from './productionService';

/**
 * Generate a crisp SVG QR code Data URI with brand accents
 */
const generateSvgQrDataUri = (title: string, accentColor: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">
    <rect width="200" height="200" fill="#090D16" rx="16"/>
    <rect x="10" y="10" width="180" height="180" fill="none" stroke="${accentColor}" stroke-width="2" rx="12" stroke-dasharray="8 4"/>
    
    <!-- Outer Position Pattern Top-Left -->
    <rect x="25" y="25" width="45" height="45" fill="none" stroke="${accentColor}" stroke-width="5" rx="4"/>
    <rect x="35" y="35" width="25" height="25" fill="${accentColor}" rx="2"/>
    
    <!-- Outer Position Pattern Top-Right -->
    <rect x="130" y="25" width="45" height="45" fill="none" stroke="${accentColor}" stroke-width="5" rx="4"/>
    <rect x="140" y="35" width="25" height="25" fill="${accentColor}" rx="2"/>
    
    <!-- Outer Position Pattern Bottom-Left -->
    <rect x="25" y="130" width="45" height="45" fill="none" stroke="${accentColor}" stroke-width="5" rx="4"/>
    <rect x="35" y="140" width="25" height="25" fill="${accentColor}" rx="2"/>
    
    <!-- Random-looking QR Matrix Dots -->
    <rect x="80" y="25" width="10" height="10" fill="${accentColor}"/>
    <rect x="95" y="25" width="10" height="10" fill="#ffffff"/>
    <rect x="110" y="25" width="10" height="10" fill="${accentColor}"/>
    
    <rect x="80" y="40" width="10" height="10" fill="#ffffff"/>
    <rect x="95" y="40" width="10" height="10" fill="${accentColor}"/>
    <rect x="110" y="40" width="10" height="10" fill="#ffffff"/>

    <rect x="25" y="80" width="10" height="10" fill="${accentColor}"/>
    <rect x="40" y="80" width="10" height="10" fill="#ffffff"/>
    <rect x="55" y="80" width="10" height="10" fill="${accentColor}"/>
    <rect x="70" y="80" width="10" height="10" fill="${accentColor}"/>
    <rect x="85" y="80" width="10" height="10" fill="#ffffff"/>
    <rect x="100" y="80" width="10" height="10" fill="${accentColor}"/>
    <rect x="115" y="80" width="10" height="10" fill="#ffffff"/>
    <rect x="130" y="80" width="10" height="10" fill="${accentColor}"/>
    <rect x="145" y="80" width="10" height="10" fill="#ffffff"/>
    <rect x="160" y="80" width="10" height="10" fill="${accentColor}"/>

    <rect x="25" y="95" width="10" height="10" fill="#ffffff"/>
    <rect x="40" y="95" width="10" height="10" fill="${accentColor}"/>
    <rect x="55" y="95" width="10" height="10" fill="#ffffff"/>
    <rect x="70" y="95" width="10" height="10" fill="${accentColor}"/>
    <rect x="100" y="95" width="10" height="10" fill="#ffffff"/>
    <rect x="115" y="95" width="10" height="10" fill="${accentColor}"/>
    <rect x="130" y="95" width="10" height="10" fill="#ffffff"/>
    <rect x="145" y="95" width="10" height="10" fill="${accentColor}"/>
    <rect x="160" y="95" width="10" height="10" fill="#ffffff"/>

    <rect x="80" y="110" width="10" height="10" fill="${accentColor}"/>
    <rect x="95" y="110" width="10" height="10" fill="#ffffff"/>
    <rect x="110" y="110" width="10" height="10" fill="${accentColor}"/>
    <rect x="125" y="110" width="10" height="10" fill="${accentColor}"/>
    <rect x="140" y="110" width="10" height="10" fill="#ffffff"/>

    <rect x="80" y="130" width="10" height="10" fill="#ffffff"/>
    <rect x="95" y="130" width="10" height="10" fill="${accentColor}"/>
    <rect x="110" y="130" width="10" height="10" fill="#ffffff"/>
    <rect x="125" y="130" width="10" height="10" fill="${accentColor}"/>
    <rect x="140" y="130" width="10" height="10" fill="${accentColor}"/>
    <rect x="155" y="130" width="10" height="10" fill="#ffffff"/>

    <rect x="80" y="145" width="10" height="10" fill="${accentColor}"/>
    <rect x="95" y="145" width="10" height="10" fill="${accentColor}"/>
    <rect x="110" y="145" width="10" height="10" fill="#ffffff"/>
    <rect x="125" y="145" width="10" height="10" fill="#ffffff"/>
    <rect x="140" y="145" width="10" height="10" fill="${accentColor}"/>
    <rect x="155" y="145" width="10" height="10" fill="${accentColor}"/>

    <rect x="80" y="160" width="10" height="10" fill="#ffffff"/>
    <rect x="95" y="160" width="10" height="10" fill="${accentColor}"/>
    <rect x="110" y="160" width="10" height="10" fill="${accentColor}"/>
    <rect x="125" y="160" width="10" height="10" fill="${accentColor}"/>
    <rect x="140" y="160" width="10" height="10" fill="#ffffff"/>
    <rect x="155" y="160" width="10" height="10" fill="${accentColor}"/>

    <!-- Center Brand Emblem Box -->
    <rect x="75" y="75" width="50" height="50" rx="8" fill="#090D16" stroke="${accentColor}" stroke-width="2"/>
    <text x="100" y="104" font-family="monospace" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">GKN</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Default Customer Form Field Definitions for Checkout Form Builder compatibility
 */
export const DEFAULT_CUSTOMER_FIELDS: CustomerFormFieldDefinition[] = [
  {
    id: 'fullName',
    name: 'fullName',
    label: 'Full Name',
    placeholder: 'Dr. Alexander Vance',
    type: 'text',
    required: true,
    visible: true,
    order: 1,
    helpText: 'Name of the person receiving the order',
  },
  {
    id: 'email',
    name: 'email',
    label: 'Email Address (Order Tracking)',
    placeholder: 'you@example.com',
    type: 'email',
    required: true,
    visible: true,
    order: 2,
    helpText: 'Encrypted updates and dispatch notifications will be sent here',
  },
  {
    id: 'phone',
    name: 'phone',
    label: 'Contact Mobile Phone',
    placeholder: '+63 917 123 4567',
    type: 'tel',
    required: true,
    visible: true,
    order: 3,
    helpText: 'Required for courier delivery SMS and order confirmation',
  },
  {
    id: 'companyOrInstitution',
    name: 'companyOrInstitution',
    label: 'Company (Optional)',
    placeholder: 'e.g. Apex BioTech / St. Jude Research Lab',
    type: 'text',
    required: false,
    visible: true,
    order: 4,
  },
];

import { systemSettingsService } from './systemSettingsService';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSystemSettings';

/**
 * Dynamically fetch active Configurable Payment Methods from System Settings
 */
export function getCheckoutPaymentMethods(): PaymentMethodOption[] {
  const settings = systemSettingsService.getSettings();
  let rawMethods = settings.payments?.methods;

  if (!rawMethods || rawMethods.length === 0) {
    rawMethods = DEFAULT_SYSTEM_SETTINGS.payments.methods;
  }

  return rawMethods
    .filter((m) => m.enabled)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((m) => {
      let bankOrNetwork = '';
      if (m.methodType === 'E_WALLET') {
        bankOrNetwork = m.providerBrand ? `${m.providerBrand} Mobile Wallet` : m.displayName;
      } else if (m.methodType === 'BANK_TRANSFER') {
        bankOrNetwork = [m.bankName, m.branchDetails].filter(Boolean).join(' - ') || 'Bank Wire';
      } else if (m.methodType === 'CRYPTOCURRENCY') {
        bankOrNetwork = [m.asset, m.network ? `${m.network} Network` : ''].filter(Boolean).join(' ') || 'Crypto Wallet';
      } else {
        bankOrNetwork = m.recipientDetails || 'Custom Clearing';
      }

      const accent =
        m.accent ||
        (m.methodType === 'E_WALLET'
          ? 'cyan'
          : m.methodType === 'BANK_TRANSFER'
          ? 'purple'
          : m.methodType === 'CRYPTOCURRENCY'
          ? 'magenta'
          : 'green');

      return {
        id: m.id,
        name: m.displayName,
        subtitle: m.subtitle || m.description || bankOrNetwork,
        badge:
          m.badge ||
          (m.methodType === 'E_WALLET'
            ? 'E-WALLET'
            : m.methodType === 'BANK_TRANSFER'
            ? 'BANK'
            : m.methodType === 'CRYPTOCURRENCY'
            ? 'CRYPTO'
            : 'CUSTOM'),
        accountName: m.accountName || m.recipientDetails || 'GKN Research',
        accountNumber: m.accountNumber || '',
        bankOrNetwork,
        instructions: m.instructions || 'Follow checkout instructions to complete payment.',
        accent,
        requiresProof: m.requiresProof !== false,
        qrCodeUrl: m.qrCodeUrl,
        enabled: m.enabled,
        displayOrder: m.sortOrder,
        availableStores: m.availableStores || ['all'],
      };
    });
}

/**
 * Backwards compatibility fallback getter & export
 */
export const CONFIGURABLE_PAYMENT_METHODS: PaymentMethodOption[] = getCheckoutPaymentMethods();
export const PAYMENT_METHODS = CONFIGURABLE_PAYMENT_METHODS;

/**
 * Configurable Accessories with General Calculation Engine
 */
import { accessoryService } from './accessoryService';

// Backwards compatibility getter export
export const getCheckoutAccessories = (): CheckoutAccessory[] => accessoryService.getAccessories();
export const CONFIGURABLE_ACCESSORIES: CheckoutAccessory[] = accessoryService.getAccessories();

/**
 * Store-Specific Delivery & Fee Rules Engine
 */
export const CONFIGURABLE_FEE_RULES: Record<string, CheckoutFeeRule[]> = {
  groupbuy: [
    {
      id: 'fee-gb-cold-shipping',
      displayName: 'Express Dispatch Shipping',
      enabled: true,
      calculationType: 'free_shipping_threshold',
      value: 8.0, // $8.00 base fee
      threshold: 250.0, // Free if order >= $250
      availableStores: ['groupbuy'],
    },
    {
      id: 'fee-gb-mfr-freight',
      displayName: 'Manufacturer → PH Import Logistics',
      enabled: true,
      calculationType: 'fixed',
      value: 5.0,
      availableStores: ['groupbuy'],
    },
    {
      id: 'fee-gb-admin',
      displayName: 'Order Batch Allocation Admin Fee',
      enabled: true,
      calculationType: 'fixed',
      value: 2.0,
      availableStores: ['groupbuy'],
    },
  ],
  onhand: [
    {
      id: 'fee-oh-express-shipping',
      displayName: 'Express Courier Cold Shipping',
      enabled: true,
      calculationType: 'free_shipping_threshold',
      value: 10.0,
      threshold: 200.0,
      availableStores: ['onhand'],
    },
    {
      id: 'fee-oh-handling',
      displayName: 'Immediate Lab Staging & Handling',
      enabled: true,
      calculationType: 'fixed',
      value: 2.0,
      availableStores: ['onhand'],
    },
  ],
  moq: [
    {
      id: 'fee-moq-bulk-freight',
      displayName: 'Bulk Cargo & Customs Clearing Logistics',
      enabled: true,
      calculationType: 'fixed',
      value: 25.0,
      availableStores: ['moq'],
    },
    {
      id: 'fee-moq-compliance',
      displayName: 'Import Compliance & Verification Fee',
      enabled: true,
      calculationType: 'fixed',
      value: 15.0,
      availableStores: ['moq'],
    },
  ],
};

export const SAVED_ADDRESSES_MOCK: ShippingAddress[] = [
  {
    id: 'addr-primary',
    recipientName: 'Dr. Alexander Vance',
    phone: '+63 917 123 4567',
    email: 'alexander.vance@gknlabs.org',
    companyOrInstitution: 'Apex BioTech Research',
    customerFields: {
      whatsapp: '+63 917 123 4567',
      researchInstitution: 'Apex BioTech Research',
    },
    addressLine1: 'Suite 402, BioTech Innovation Tower',
    addressLine2: '32nd Street, Bonifacio Global City',
    city: 'Taguig City',
    province: 'Metro Manila',
    region: 'Luzon',
    postalCode: '1634',
    country: 'Philippines',
    isDefault: true,
  },
  {
    id: 'addr-secondary',
    recipientName: 'Central Lab Receiving',
    phone: '+63 928 987 6543',
    email: 'receiving@centrallab.ph',
    companyOrInstitution: 'Central Bio-Medical Laboratory',
    customerFields: {
      whatsapp: '+63 928 987 6543',
      researchInstitution: 'Central Bio-Medical Laboratory',
    },
    addressLine1: 'Building B, Technopark Complex',
    addressLine2: 'Santa Rosa Industrial Zone',
    city: 'Santa Rosa',
    province: 'Laguna',
    region: 'Luzon',
    postalCode: '4026',
    country: 'Philippines',
    isDefault: false,
  },
];

export class CheckoutService {
  /**
   * Helper to parse and calculate total vials count from items
   * Leverages centralized vialCalculation logic
   */
  static calculateTotalVials(items: Array<{ variantLabel?: string; quantity: number; sellingUnit?: string; vialsPerKit?: number; isAccessory?: boolean; category?: string; name?: string }>): number {
    return calculateTotalVials(items);
  }

  /**
   * Helper to calculate total kits / item boxes count from cart items
   */
  static calculateTotalKits(items: Array<{ variantLabel?: string; quantity: number; sellingUnit?: string; isAccessory?: boolean; category?: string; name?: string }>): number {
    return calculateTotalKits(items);
  }

  /**
   * Calculates comprehensive order summary breakdown including automatic label calculations,
   * user accessories, and store-specific fee engine rules.
   */
  static calculateCheckoutBreakdown(
    storeType: StoreType,
    items: Array<{ id: string; variantLabel?: string; quantity: number; price: number; priceInPhp?: number }>,
    selectedAccessoriesState: Record<string, number> = {},
    campaignDiscount: number = 0,
    selectedShippingMethodId?: string,
    shippingRegion?: string
  ): CheckoutBreakdownResult {
    // 1. Core calculation via ShippingFeeEngine
    const engineResult = ShippingFeeEngine.calculateOrderTotals({
      storeType,
      items,
      selectedMethodId: selectedShippingMethodId,
      shippingRegion,
      customDiscountUsd: campaignDiscount,
    });

    // 2. Process optional Accessories
    const accessories: SelectedAccessory[] = [];
    const allAccs = accessoryService.getAccessories();
    const availableAccs = allAccs.filter(
      (acc) =>
        acc.enabled &&
        (acc.availableStores.includes('all') ||
          acc.availableStores.includes(storeType) ||
          acc.availableStores.includes(storeType.toLowerCase() as StoreType))
    );

    for (const acc of availableAccs) {
      const userState = selectedAccessoriesState[acc.id] || 0;
      if (userState > 0) {
        let derivedQty = 0;
        let isAuto = false;

        const calcMode = (acc.calculationMode || (acc as any).calculationType || '').toLowerCase();

        if (calcMode === 'per_vial') {
          const mult = acc.multiplier ?? 1;
          derivedQty = Math.max(1, engineResult.totalVials * mult);
          isAuto = true;
        } else if (calcMode === 'per_kit') {
          const mult = acc.multiplier ?? 1;
          derivedQty = Math.max(1, engineResult.totalKits * mult);
          isAuto = true;
        } else {
          derivedQty = userState;
          isAuto = false;
        }

        if (derivedQty > 0) {
          accessories.push({
            accessoryId: acc.id,
            name: acc.name,
            quantity: derivedQty,
            unitPriceUsd: acc.priceUsd,
            totalPriceUsd: acc.priceUsd * derivedQty,
            isAutoCalculated: isAuto,
          });
        }
      }
    }

    const accessoriesTotalUsd = accessories.reduce((sum, acc) => sum + acc.totalPriceUsd, 0);

    // Map applied fees
    const appliedFees: AppliedFee[] = engineResult.appliedFees.map((f) => ({
      feeId: f.feeId,
      displayName: f.displayName,
      amountUsd: f.amountUsd,
      amountPhp: f.amountPhp,
      calculationType: f.calculationType,
      description: f.description,
    }));

    const totalFeesUsd = engineResult.totalFeesUsd + engineResult.shippingFeeUsd;
    const totalFeesPhp = engineResult.totalFeesPhp + engineResult.shippingFeePhp;

    const grandTotalUsd = engineResult.subtotalUsd + totalFeesUsd + accessoriesTotalUsd - engineResult.discountUsd;
    const grandTotalPhp = engineResult.subtotalPhp + totalFeesPhp + convertUsdToPhp(accessoriesTotalUsd) - engineResult.discountPhp;

    const earnedPoints = Math.floor(engineResult.subtotalUsd * 10);

    return {
      storeType,
      subtotalUsd: engineResult.subtotalUsd,
      subtotalPhp: engineResult.subtotalPhp,
      totalVialsCount: engineResult.totalVials,
      totalKitsCount: engineResult.totalKits,
      shippingMethodId: engineResult.shippingMethodId,
      shippingMethodName: engineResult.shippingMethodName,
      shippingFeeUsd: engineResult.shippingFeeUsd,
      shippingFeePhp: engineResult.shippingFeePhp,
      accessories,
      accessoriesTotalUsd,
      appliedFees,
      totalFeesUsd,
      totalFeesPhp,
      discountUsd: engineResult.discountUsd,
      discountPhp: engineResult.discountPhp,
      earnedPoints,
      grandTotalUsd: Math.max(0, grandTotalUsd),
      grandTotalPhp: Math.max(0, grandTotalPhp),
    };
  }

  /**
   * Simulates processing order submission and generating store-specific reference number
   */
  static async submitOrder(payload: OrderSubmissionPayload): Promise<OrderSubmissionResult> {
    return createProductionOrder(payload, payload.paymentProofFile || null);

    /* Legacy local adapter retained below for UI reference only; production returns above. */

    // Validate MOQ and Order Step for each item
    for (const item of payload.items || []) {
      const min = item.minQuantity || 1;
      const step = item.stepQuantity || 1;
      if (item.quantity < min) {
        throw new Error(`Item "${item.name}" requires a minimum order quantity of ${min}.`);
      }
      if ((item.quantity - min) % step !== 0) {
        throw new Error(`Item "${item.name}" quantity (${item.quantity}) must increase in steps of ${step} starting from minimum ${min}.`);
      }
    }

    const rawStore = (payload.storeType || (payload.items && payload.items[0]?.storeType) || 'groupbuy').toLowerCase();
    const targetStore: 'groupbuy' | 'onhand' | 'moq' =
      rawStore === 'moq' ? 'moq' : rawStore === 'onhand' ? 'onhand' : 'groupbuy';

    const paymentMethodLabel =
      CONFIGURABLE_PAYMENT_METHODS.find((m) => m.id === payload.paymentMethodId)?.name ||
      'GCash Instant Transfer';

    const orderRecord = await OrderManagementService.createOrder({
      storeType: targetStore,
      customerName: payload.customerInfo.fullName,
      customerEmail: payload.customerInfo.email,
      customerPhone: payload.customerInfo.phone,
      shippingAddress: {
        recipientName: payload.shippingAddress.recipientName,
        phone: payload.shippingAddress.phone,
        addressLine1: payload.shippingAddress.addressLine1,
        addressLine2: payload.shippingAddress.addressLine2,
        city: payload.shippingAddress.city,
        province: payload.shippingAddress.province,
        region: payload.shippingAddress.region || 'Luzon',
        postalCode: payload.shippingAddress.postalCode,
        country: payload.shippingAddress.country || 'Philippines',
      },
      items: (payload.items || []).map((i, idx) => ({
        id: `item_${Date.now()}_${idx}`,
        productId: i.productId,
        name: i.name,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
        price: i.price,
        storeType: targetStore as any,
        sellingUnit: (i.sellingUnit as 'vial' | 'kit') || 'vial',
        vialsPerKit: i.vialsPerKit,
        isAccessory: i.isAccessory,
        category: (i as any).category,
      })),
      selectedAccessories: payload.selectedAccessories,
      appliedFees: payload.appliedFees,
      exchangeRateUsed: convertUsdToPhp(1),
      customerCompany: payload.customerInfo.companyOrInstitution,
      subtotal: payload.subtotal,
      shippingFee: payload.shippingFee,
      discount: payload.discount,
      grandTotal: payload.grandTotal,
      paymentMethod: paymentMethodLabel,
      orderNotes: payload.orderNotes || '',
      proofUrl: payload.paymentProofUrl,
      paymentSummary: {
        paymentMethod: paymentMethodLabel,
        amount: payload.grandTotal,
        paymentReference: 'SUBMITTED_BY_CUSTOMER',
        paymentProofStatus: payload.paymentProofUrl ? 'SUBMITTED' : 'NOT_SUBMITTED',
        verificationStatus: 'PENDING',
        proofUrl: payload.paymentProofUrl,
      },
    });

    return {
      orderId: orderRecord.id,
      referenceNumber: orderRecord.referenceNumber,
      createdAt: orderRecord.orderDate,
      status: 'PENDING_VERIFICATION',
      estimatedDispatch: '24-48 Hours (Express Staged)',
      totalAmount: payload.grandTotal,
    };
  }
}


