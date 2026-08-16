import { CustomerTierSettings } from './customerTier';
import { DigitalMemberIdSettings } from './digitalMember';

export interface GeneralSettings {
  websiteName: string;
  companyName: string;
  brandName: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  currencySymbol: string;
  language: string;
  maintenanceMode: boolean;
  maintenanceTitle?: string;
  maintenanceMessage?: string;
  maintenanceReturnText?: string;
  applicationVersion: string;
  usdToPhpExchangeRate?: number;
  currencyMarkupPercent?: number;
}

export type StoreTypeKey = 'groupbuy' | 'onhand' | 'moq' | string;

export interface StoreCapabilities {
  openCloseControl: boolean; // Store Open / Close Control [ ON / OFF ]
  inventoryManagement: boolean; // Inventory Management [ ON / OFF ]
  variantInventory: boolean; // Variant Inventory [ ON / OFF ]
}

export type ScheduleMode = 'manual' | 'weekly' | 'specific_days' | 'specific_dates';

export interface WeeklyDaySchedule {
  enabled: boolean;
  openTime: string; // e.g. "09:00"
  closeTime: string; // e.g. "18:00"
}

export interface WeeklyScheduleConfig {
  monday: WeeklyDaySchedule;
  tuesday: WeeklyDaySchedule;
  wednesday: WeeklyDaySchedule;
  thursday: WeeklyDaySchedule;
  friday: WeeklyDaySchedule;
  saturday: WeeklyDaySchedule;
  sunday: WeeklyDaySchedule;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface SpecificDaysConfig {
  days: DayOfWeek[];
  openTime: string;
  closeTime: string;
}

export interface SpecificDateRange {
  id: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string; // YYYY-MM-DD
  endTime: string; // HH:mm
  label?: string;
}

export type ScheduleOverride = 'NONE' | 'TEMPORARY_OPEN' | 'TEMPORARY_CLOSED';

export interface StoreAvailabilitySettings {
  openCloseControlEnabled: boolean;
  manualStatus: 'OPEN' | 'CLOSED';
  scheduleMode: ScheduleMode;
  override: ScheduleOverride;
  timezone: string;
  weeklySchedule: WeeklyScheduleConfig;
  specificDays: SpecificDaysConfig;
  specificDateRanges: SpecificDateRange[];
}

export interface StoreConfig {
  key: string;
  code: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  enabled: boolean;
  visibility: 'public' | 'private' | 'vip_only';
  order: number;
  accentColor: string;
  capabilities: StoreCapabilities;
  availability: StoreAvailabilitySettings;
  openingSchedule?: string; // Legacy fallback
  closingSchedule?: string; // Legacy fallback
  moqKitLabel?: string;
  notes?: string;
}

export interface StoreSettings {
  groupbuy: StoreConfig;
  onhand: StoreConfig;
  moq: StoreConfig;
  [key: string]: StoreConfig;
}

export interface CheckoutOptions {
  allowGuestCheckout: boolean;
  requireResearchWaiver: boolean;
  enableOrderNotes: boolean;
  requirePhoneNumber: boolean;
}

export interface OrderSettings {
  defaultOrderStatus: string;
  autoOrderPrefix: string;
  rewardPointMultiplier: number;
  minOrderAmount: number;
  maxOrderAmount: number;
  checkoutOptions: CheckoutOptions;
}

export type PaymentMethodType = 'E_WALLET' | 'BANK_TRANSFER' | 'CRYPTOCURRENCY' | 'CUSTOM';

export interface ConfigurablePaymentMethod {
  id: string;
  methodType: PaymentMethodType;
  displayName: string;
  subtitle?: string;
  description?: string;
  enabled: boolean;
  sortOrder: number;

  // Type-specific fields
  providerBrand?: string; // e.g. GCash, Maya
  accountName?: string; // Registered account name / holder name
  accountNumber?: string; // Mobile / Bank / Wallet account number or address
  bankName?: string; // e.g. BDO, BPI, UnionBank
  branchDetails?: string; // e.g. Commercial Branch, Makati
  asset?: string; // e.g. USDT, BTC, ETH
  network?: string; // e.g. TRC20, ERC20
  recipientDetails?: string; // for CUSTOM type

  qrCodeMediaId?: string;
  qrCodeUrl?: string;
  instructions?: string;
  availableStores?: Array<'groupbuy' | 'onhand' | 'moq' | 'all'>;
  accent?: 'cyan' | 'purple' | 'magenta' | 'green';
  badge?: string;
  requiresProof?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentMethodKey = 'gcash' | 'maya' | 'bankTransfer' | 'cryptoUsdt';

export interface PaymentMethodConfig {
  id: PaymentMethodKey;
  name: string;
  enabled: boolean;
  accountName: string;
  accountNumber: string;
  qrCodeMediaId?: string;
  qrCodeUrl?: string;
  instructions: string;
  network?: string;
}

export interface PaymentSettings {
  methods: ConfigurablePaymentMethod[];
  gcash?: PaymentMethodConfig;
  maya?: PaymentMethodConfig;
  bankTransfer?: PaymentMethodConfig;
  cryptoUsdt?: PaymentMethodConfig;
}

export type ShippingCalculationType =
  | 'free'
  | 'fixed'
  | 'per_vial'
  | 'tiered_quantity'
  | 'base_additional'
  | 'fixed_region'
  | 'regional_base_additional'
  | 'custom';

export type FeeCalculationType =
  | 'fixed'
  | 'percentage'
  | 'per_vial'
  | 'per_kit'
  | 'tiered_quantity'
  | 'base_additional';

export interface QuantityTierRule {
  id: string;
  minQty: number;
  maxQty: number | null;
  fee: number;
}

export interface RegionalRate {
  id: string;
  regionName: string;
  fee: number;
  includedVials?: number;
  additionalFeePerVial?: number;
}

export interface ConfigurableShippingMethod {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  displayOrder: number;
  availableStores: Array<'groupbuy' | 'onhand' | 'moq' | 'all'>;
  calculationType: ShippingCalculationType;
  baseFee: number; // in PHP
  minOrderAmount?: number; // min subtotal in PHP
  minQuantity?: number; // min vial-equivalent quantity
  tieredRules?: QuantityTierRule[];
  baseIncludedQty?: number;
  additionalPerVialFee?: number;
  regionalRates?: RegionalRate[];
}

export interface ConfigurableAdditionalFee {
  id: string;
  name: string;
  displayName: string;
  description: string;
  enabled: boolean;
  type: 'admin_fee' | 'handling_fee' | 'procurement_shipping' | 'custom_fee';
  calculationType: FeeCalculationType;
  amount: number; // fixed PHP or percentage
  availableStores: Array<'groupbuy' | 'onhand' | 'moq' | 'all'>;
  displayOrder?: number;
  tieredRules?: QuantityTierRule[];
  baseIncludedQty?: number;
  additionalPerVialFee?: number;
}

export interface ProductUnitConfig {
  vialsPerKit: number; // Default: 10
}

export interface ShippingSettings {
  vialUnitConfig: ProductUnitConfig;
  methods: ConfigurableShippingMethod[];
  additionalFees: ConfigurableAdditionalFee[];
  defaultDeliveryTimeframe: string;
}

export interface NotificationChannels {
  email: boolean;
  sms: boolean;
  telegram: boolean;
  inApp: boolean;
}

export interface NotificationEventConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  channels: NotificationChannels;
  template?: string;
}

export interface NotificationSettings {
  orderCreated: NotificationEventConfig;
  paymentReceived: NotificationEventConfig;
  paymentVerified: NotificationEventConfig;
  paymentRejected?: NotificationEventConfig;
  shipmentDispatched: NotificationEventConfig;
  delivered: NotificationEventConfig;
  adminAlerts: NotificationEventConfig;
  adminEmailRecipient: string;
  adminTelegramChatId: string;
}

export interface TwoFactorAuthConfig {
  enabled: boolean;
  requiredForAdmins: boolean;
  method: 'authenticator_app' | 'email_otp' | 'hardware_key';
}

export interface SecuritySettings {
  sessionTimeoutMinutes: number;
  passwordPolicy: 'flexible' | 'standard' | 'strict' | 'cyberpunk_hardened';
  maxLoginAttempts: number;
  adminIpWhitelistEnabled: boolean;
  whitelistedIps: string[];
  twoFactorAuth: TwoFactorAuthConfig;
}

export interface SystemHealthStatus {
  database: 'healthy' | 'degraded' | 'offline';
  storage: 'healthy' | 'degraded' | 'offline';
  api: 'healthy' | 'degraded' | 'offline';
  lastCacheReset: string;
  dbLatencyMs: number;
  storageUsedMb: number;
}

export interface SystemConfig {
  debugMode: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  cacheEnabled: boolean;
  healthStatus: SystemHealthStatus;
}

export interface DeploymentSettings {
  environment: 'production' | 'staging' | 'development';
  domain: string;
  pwaStatus: 'active' | 'inactive' | 'building';
  version: string;
  buildNumber: string;
  lastDeployedAt: string;
  region: string;
}

export interface AdminVisibilitySettings {
  showAdminButton: boolean;
}

export interface OwnerRoleConfig {
  roleId: string;
  roleName: string;
  userCount: number;
  permissions: string[];
  isSystemDefault: boolean;
}

export interface OwnerSettings {
  ownerAccountEmail: string;
  superAdminEmail: string;
  roles: OwnerRoleConfig[];
  auditLogEnabled: boolean;
}

export interface SystemSettings {
  general: GeneralSettings;
  stores: StoreSettings;
  orders: OrderSettings;
  payments: PaymentSettings;
  shipping: ShippingSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  systemConfig: SystemConfig;
  deployment: DeploymentSettings;
  adminVisibility: AdminVisibilitySettings;
  owner: OwnerSettings;
  customerTiers?: CustomerTierSettings;
  digitalMemberId?: DigitalMemberIdSettings;
  updatedAt: string;
  updatedBy: string;
}
