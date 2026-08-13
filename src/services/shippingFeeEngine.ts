import { StoreType } from '../types';
import {
  ShippingSettings,
  ConfigurableShippingMethod,
  ConfigurableAdditionalFee,
  QuantityTierRule,
} from '../types/systemSettings';
import { systemSettingsService } from './systemSettingsService';
import { convertUsdToPhp, convertPhpToUsd, getSystemExchangeRate } from '../utils/currencyUtils';
import { calculateItemVials, calculateTotalVials, calculateTotalKits } from '../utils/vialCalculation';

export interface CartItemForCalculation {
  id?: string;
  name?: string;
  variantLabel?: string;
  quantity: number;
  price: number; // in USD or PHP depending on context (defaults to USD)
  priceInPhp?: number;
  sellingUnit?: string;
  vialsPerKit?: number;
  isAccessory?: boolean;
  category?: string;
}

export interface CalculatedAppliedFee {
  feeId: string;
  name: string;
  displayName: string;
  description?: string;
  amountPhp: number;
  amountUsd: number;
  calculationType: string;
  type?: string;
}

export interface OrderCalculationResult {
  storeType: StoreType;
  subtotalPhp: number;
  subtotalUsd: number;
  totalVials: number;
  totalKits: number;
  vialsPerKitUsed: number;
  shippingMethodId: string;
  shippingMethodName: string;
  shippingFeePhp: number;
  shippingFeeUsd: number;
  appliedFees: CalculatedAppliedFee[];
  totalFeesPhp: number;
  totalFeesUsd: number;
  discountPhp: number;
  discountUsd: number;
  grandTotalPhp: number;
  grandTotalUsd: number;
  exchangeRateUsed: number;
}

export class ShippingFeeEngine {
  /**
   * Retrieves vials per kit conversion rule from settings (default = 10)
   */
  static getVialsPerKit(settings?: ShippingSettings): number {
    const s = settings || systemSettingsService.getSettings().shipping;
    const v = s?.vialUnitConfig?.vialsPerKit;
    return typeof v === 'number' && v > 0 ? v : 10;
  }

  /**
   * Calculates actual vial-equivalent quantity and kit count from items.
   * Business Rule: 1 Kit = X Vials (default 10)
   */
  static calculateVialEquivalentQuantity(
    items: CartItemForCalculation[],
    vialsPerKit?: number
  ): { totalVials: number; totalKits: number } {
    const totalVials = calculateTotalVials(items);
    const totalKits = calculateTotalKits(items);

    return {
      totalVials: Math.max(0, totalVials),
      totalKits: Math.max(0, totalKits),
    };
  }

  /**
   * Evaluates a quantity tier array against a target vial quantity
   */
  static matchTierFee(tieredRules: QuantityTierRule[] | undefined, totalVials: number, defaultFee: number = 0): number {
    if (!tieredRules || tieredRules.length === 0) return defaultFee;

    // Sort tiers by minQty ascending
    const sorted = [...tieredRules].sort((a, b) => a.minQty - b.minQty);

    for (const tier of sorted) {
      const min = tier.minQty ?? 0;
      const max = tier.maxQty;
      if (totalVials >= min && (max === null || max === undefined || totalVials <= max)) {
        return tier.fee;
      }
    }

    // Fallback if exceeding highest tier: use the highest tier's fee
    const highest = sorted[sorted.length - 1];
    return highest ? highest.fee : defaultFee;
  }

  /**
   * Calculates shipping fee in PHP for a given shipping method
   */
  static calculateShippingFee(
    method: ConfigurableShippingMethod,
    totalVials: number,
    subtotalPhp: number,
    shippingRegion?: string
  ): number {
    if (!method || !method.enabled) return 0;

    switch (method.calculationType) {
      case 'free': {
        const minAmt = method.minOrderAmount || 0;
        const minQty = method.minQuantity || 0;
        const qualifiesAmt = minAmt > 0 ? subtotalPhp >= minAmt : true;
        const qualifiesQty = minQty > 0 ? totalVials >= minQty : true;

        if (qualifiesAmt && qualifiesQty) {
          return 0;
        }
        return method.baseFee || 0;
      }

      case 'fixed':
        return Math.max(0, method.baseFee || 0);

      case 'fixed_region': {
        if (method.regionalRates && method.regionalRates.length > 0) {
          if (shippingRegion) {
            const match = method.regionalRates.find(
              (r) => r.regionName.toLowerCase().trim() === shippingRegion.toLowerCase().trim()
            );
            if (match) {
              const base = match.fee;
              const included = match.includedVials ?? 0;
              const extraFee = match.additionalFeePerVial ?? 0;
              const extraQty = Math.max(0, totalVials - included);
              return Math.max(0, base + extraQty * extraFee);
            }
          }
          // Fallback to first regional rate
          const first = method.regionalRates[0];
          const base = first.fee;
          const included = first.includedVials ?? 0;
          const extraFee = first.additionalFeePerVial ?? 0;
          const extraQty = Math.max(0, totalVials - included);
          return Math.max(0, base + extraQty * extraFee);
        }
        return Math.max(0, method.baseFee || 0);
      }

      case 'regional_base_additional': {
        if (method.regionalRates && method.regionalRates.length > 0) {
          let match: typeof method.regionalRates[0] | undefined;
          if (shippingRegion) {
            match = method.regionalRates.find(
              (r) => r.regionName.toLowerCase().trim() === shippingRegion.toLowerCase().trim()
            );
          }
          if (!match) {
            match = method.regionalRates[0];
          }

          if (match) {
            const base = typeof match.fee === 'number' ? match.fee : (method.baseFee || 0);
            const included = typeof match.includedVials === 'number' ? match.includedVials : (method.baseIncludedQty || 0);
            const extraPerVial = typeof match.additionalFeePerVial === 'number' ? match.additionalFeePerVial : (method.additionalPerVialFee || 0);
            const extraQty = Math.max(0, totalVials - included);
            return Math.max(0, base + extraQty * extraPerVial);
          }
        }

        // Fallback to method-level defaults
        const base = method.baseFee || 0;
        const included = method.baseIncludedQty || 0;
        const extraPerVial = method.additionalPerVialFee || 0;
        const extraQty = Math.max(0, totalVials - included);
        return Math.max(0, base + extraQty * extraPerVial);
      }

      case 'per_vial':
        return Math.max(0, (method.baseFee || 0) * totalVials);

      case 'tiered_quantity':
        return Math.max(0, this.matchTierFee(method.tieredRules, totalVials, method.baseFee || 0));

      case 'base_additional': {
        const base = method.baseFee || 0;
        const included = method.baseIncludedQty || 0;
        const extraPerVial = method.additionalPerVialFee || 0;
        const extraQty = Math.max(0, totalVials - included);
        return Math.max(0, base + extraQty * extraPerVial);
      }

      case 'custom':
      default:
        return Math.max(0, method.baseFee || 0);
    }
  }

  /**
   * Calculates fee amount in PHP for an additional / custom fee
   */
  static calculateFeeAmount(
    fee: ConfigurableAdditionalFee,
    totalVials: number,
    totalKits: number,
    subtotalPhp: number,
    vialsPerKit: number
  ): number {
    if (!fee || !fee.enabled) return 0;

    switch (fee.calculationType) {
      case 'fixed':
        return Math.max(0, fee.amount || 0);

      case 'percentage': {
        const pct = fee.amount || 0;
        return Math.max(0, (subtotalPhp * pct) / 100);
      }

      case 'per_vial':
        return Math.max(0, (fee.amount || 0) * totalVials);

      case 'per_kit': {
        const calculatedKitCount = totalKits > 0 ? totalKits : Math.max(1, Math.ceil(totalVials / vialsPerKit));
        return Math.max(0, (fee.amount || 0) * calculatedKitCount);
      }

      case 'tiered_quantity':
        return Math.max(0, this.matchTierFee(fee.tieredRules, totalVials, fee.amount || 0));

      case 'base_additional': {
        const base = fee.amount || 0;
        const included = fee.baseIncludedQty || 0;
        const extraFee = fee.additionalPerVialFee || 0;
        const extraQty = Math.max(0, totalVials - included);
        return Math.max(0, base + extraQty * extraFee);
      }

      default:
        return Math.max(0, fee.amount || 0);
    }
  }

  /**
   * Master function: calculates entire order totals, shipping fee, applied fees, and grand totals
   */
  static calculateOrderTotals(params: {
    storeType: StoreType;
    items: CartItemForCalculation[];
    selectedMethodId?: string;
    shippingRegion?: string;
    customDiscountUsd?: number;
    settings?: ShippingSettings;
    customRate?: number;
  }): OrderCalculationResult {
    const { storeType, items, selectedMethodId, shippingRegion, customDiscountUsd = 0, customRate } = params;
    const rate = typeof customRate === 'number' && customRate > 0 ? customRate : getSystemExchangeRate();

    const fullSettings = params.settings
      ? { ...systemSettingsService.getSettings(), shipping: params.settings }
      : systemSettingsService.getSettings();

    const shippingSettings = fullSettings.shipping;
    const vialsPerKit = this.getVialsPerKit(shippingSettings);

    // 1. Calculate Vial-Equivalent Quantity & Subtotal
    const { totalVials, totalKits } = this.calculateVialEquivalentQuantity(items, vialsPerKit);

    // Calculate Subtotal
    let subtotalUsd = 0;
    let subtotalPhp = 0;

    for (const item of items) {
      const qty = item.quantity || 1;
      if (typeof item.priceInPhp === 'number' && item.priceInPhp > 0) {
        subtotalPhp += item.priceInPhp * qty;
        subtotalUsd += convertPhpToUsd(item.priceInPhp * qty, rate);
      } else {
        const lineUsd = (item.price || 0) * qty;
        subtotalUsd += lineUsd;
        subtotalPhp += convertUsdToPhp(lineUsd, rate);
      }
    }

    // 2. Determine Shipping Method
    const normStore = (storeType || 'groupbuy').toLowerCase();
    const availableMethods = (shippingSettings.methods || []).filter(
      (m) =>
        m.enabled &&
        (m.availableStores.includes('all') || m.availableStores.includes(normStore as any))
    );

    let selectedMethod = availableMethods.find((m) => m.id === selectedMethodId);

    // If selected method not found or disabled, pick Free Shipping if qualified, or first method
    if (!selectedMethod && availableMethods.length > 0) {
      const freeMethod = availableMethods.find((m) => m.calculationType === 'free');
      if (
        freeMethod &&
        ((freeMethod.minOrderAmount && subtotalPhp >= freeMethod.minOrderAmount) ||
          (freeMethod.minQuantity && totalVials >= freeMethod.minQuantity))
      ) {
        selectedMethod = freeMethod;
      } else {
        selectedMethod = availableMethods.sort((a, b) => a.displayOrder - b.displayOrder)[0];
      }
    }

    const shippingFeePhp = selectedMethod
      ? this.calculateShippingFee(selectedMethod, totalVials, subtotalPhp, shippingRegion)
      : 0;
    const shippingFeeUsd = convertPhpToUsd(shippingFeePhp, rate);

    // 3. Calculate Additional & Custom Fees
    const availableFees = (shippingSettings.additionalFees || []).filter(
      (f) =>
        f.enabled &&
        (f.availableStores.includes('all') || f.availableStores.includes(normStore as any))
    );

    const appliedFees: CalculatedAppliedFee[] = [];
    let totalFeesPhp = 0;

    for (const fee of availableFees) {
      const feePhp = this.calculateFeeAmount(fee, totalVials, totalKits, subtotalPhp, vialsPerKit);
      if (feePhp >= 0) {
        const feeUsd = convertPhpToUsd(feePhp, rate);
        appliedFees.push({
          feeId: fee.id,
          name: fee.name,
          displayName: fee.displayName || fee.name,
          description: fee.description,
          amountPhp: feePhp,
          amountUsd: feeUsd,
          calculationType: fee.calculationType,
          type: fee.type,
        });
        totalFeesPhp += feePhp;
      }
    }

    const totalFeesUsd = convertPhpToUsd(totalFeesPhp, rate);

    // 4. Calculate Discount
    const discountUsd = customDiscountUsd || 0;
    const discountPhp = convertUsdToPhp(discountUsd, rate);

    // 5. Calculate Grand Total
    const grandTotalPhp = Math.max(0, subtotalPhp + shippingFeePhp + totalFeesPhp - discountPhp);
    const grandTotalUsd = convertPhpToUsd(grandTotalPhp, rate);

    return {
      storeType,
      subtotalPhp,
      subtotalUsd,
      totalVials,
      totalKits,
      vialsPerKitUsed: vialsPerKit,
      shippingMethodId: selectedMethod?.id || '',
      shippingMethodName: selectedMethod?.name || 'Standard Shipping',
      shippingFeePhp,
      shippingFeeUsd,
      appliedFees,
      totalFeesPhp,
      totalFeesUsd,
      discountPhp,
      discountUsd,
      grandTotalPhp,
      grandTotalUsd,
      exchangeRateUsed: rate,
    };
  }
}
