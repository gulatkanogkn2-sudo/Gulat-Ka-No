import { StoreType } from './index';
export type { StoreType };

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  companyOrInstitution?: string;
  [key: string]: string | undefined;
}

export interface CustomerFormFieldDefinition {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required: boolean;
  visible: boolean;
  order: number;
  options?: string[];
  helpText?: string;
}

export interface ShippingAddress {
  id?: string;
  recipientName: string;
  phone: string;
  email?: string;
  companyOrInstitution?: string;
  customerFields?: Record<string, string>;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  region?: 'Luzon' | 'Visayas' | 'Mindanao' | string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export type PaymentMethodId = 'gcash' | 'bank_transfer' | 'maya' | 'crypto_usdt' | string;

export interface PaymentMethodOption {
  id: PaymentMethodId;
  name: string;
  subtitle: string;
  badge: string;
  accountName: string;
  accountNumber: string;
  bankOrNetwork?: string;
  instructions: string;
  accent: 'cyan' | 'purple' | 'magenta' | 'green';
  requiresProof: boolean;
  qrCodeUrl?: string;
  enabled: boolean;
  displayOrder: number;
  availableStores: Array<StoreType | 'all'>;
}

export interface PaymentProofFile {
  file: File | null;
  previewUrl: string | null;
  fileName: string | null;
  fileSize: string | null;
}

export type AccessoryCalculationMode = 'per_vial' | 'per_kit' | 'manual';

export interface CheckoutAccessory {
  id: string;
  name: string;
  description: string;
  priceUsd: number; // base price in USD per unit
  enabled: boolean;
  displayOrder: number;
  availableStores: Array<StoreType | 'all'>;
  calculationMode: AccessoryCalculationMode;
  multiplier?: number; // default 1 (e.g. 20 vials x 1 = 20 accessories, or 5 kits x 1 = 5)
  autoCalculateType?: 'vials_recommended' | 'vials_count' | 'items_count' | 'manual';
  vialsPerUnit?: number;
  defaultQuantityBehavior?: 'unselected' | 'recommended' | 'fixed';
}

export interface SelectedAccessory {
  accessoryId: string;
  name: string;
  quantity: number;
  unitPriceUsd: number;
  totalPriceUsd: number;
  isAutoCalculated: boolean;
}

export interface CheckoutFeeRule {
  id: string;
  displayName: string;
  enabled: boolean;
  calculationType: 'fixed' | 'by_region' | 'by_weight' | 'by_quantity' | 'by_purchase_amount' | 'free_shipping_threshold';
  value: number; // USD amount or percentage
  threshold?: number; // e.g. Free shipping above $200
  availableStores: Array<StoreType | 'all'>;
}

export interface AppliedFee {
  feeId: string;
  displayName: string;
  amountUsd: number;
  amountPhp?: number;
  calculationType: string;
  description?: string;
}

export interface CheckoutBreakdownResult {
  storeType: StoreType;
  subtotalUsd: number;
  subtotalPhp?: number;
  totalVialsCount: number;
  totalKitsCount?: number;
  shippingMethodId?: string;
  shippingMethodName?: string;
  shippingFeeUsd?: number;
  shippingFeePhp?: number;
  accessories: SelectedAccessory[];
  accessoriesTotalUsd: number;
  appliedFees: AppliedFee[];
  totalFeesUsd: number;
  totalFeesPhp?: number;
  discountUsd: number;
  discountPhp?: number;
  earnedPoints: number;
  grandTotalUsd: number;
  grandTotalPhp: number;
}

export interface OrderSubmissionPayload {
  storeType?: string;
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  paymentMethodId: PaymentMethodId;
  paymentProofFile?: File | null;
  paymentProofUrl?: string;
  orderNotes?: string;
  items: Array<{
    id: string;
    productId: string;
    variantId?: string;
    name: string;
    variantLabel: string;
    quantity: number;
    price: number;
    storeType: string;
    sellingUnit?: string;
    vialsPerKit?: number;
    minQuantity?: number;
    stepQuantity?: number;
    isAccessory?: boolean;
  }>;
  selectedAccessories?: SelectedAccessory[];
  appliedFees?: AppliedFee[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  earnedPoints: number;
  grandTotal: number;
}

export interface OrderSubmissionResult {
  orderId: string;
  referenceNumber: string;
  createdAt: string;
  status: 'PENDING_VERIFICATION' | 'ALLOCATED' | 'PROCESSING';
  estimatedDispatch: string;
  totalAmount: number;
}

