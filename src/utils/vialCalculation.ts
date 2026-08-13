/**
 * GKN V2 — Centralized Vial & Label Calculation Utility
 * Single Source of Truth for Selling Unit, Vial Quantity, and Label Count calculations.
 */

export interface VialCalculableItem {
  quantity: number;
  sellingUnit?: 'vial' | 'kit' | 'per_vial' | 'per_kit' | string;
  vialsPerKit?: number;
  isAccessory?: boolean;
  category?: string;
  variantLabel?: string;
  name?: string;
}

/**
 * Normalizes selling unit string to 'vial' or 'kit'.
 */
export function normalizeSellingUnit(
  unit?: string,
  variantLabel?: string,
  name?: string
): 'vial' | 'kit' {
  if (unit) {
    const u = unit.toLowerCase().trim();
    if (u === 'kit' || u === 'per_kit' || u === 'per kit') return 'kit';
    if (u === 'vial' || u === 'per_vial' || u === 'per vial') return 'vial';
  }

  // Fallback heuristic for legacy items without explicit sellingUnit property
  const text = `${variantLabel || ''} ${name || ''}`.toLowerCase();
  if (text.includes('kit') || text.includes('box')) {
    return 'kit';
  }
  return 'vial';
}

export interface ProductWithStoreSettings {
  storeType?: string;
  sellingUnit?: 'vial' | 'kit' | string;
  vialsPerKit?: number;
  minQuantity?: number;
  stepQuantity?: number;
  minOrder?: number;
  orderStep?: number;
  variants?: any[];
  groupBuySettings?: { sellingUnit?: 'vial' | 'kit' | string; vialsPerKit?: number; minQuantity?: number; stepQuantity?: number; minOrder?: number; orderStep?: number };
  onHandSettings?: { sellingUnit?: 'vial' | 'kit' | string; vialsPerKit?: number; minQuantity?: number; stepQuantity?: number; minOrder?: number; orderStep?: number };
  moqSettings?: { sellingUnit?: 'vial' | 'kit' | string; vialsPerKit?: number; minQuantity?: number; stepQuantity?: number; minOrder?: number; orderStep?: number };
  storeSettings?: Record<string, { sellingUnit?: 'vial' | 'kit' | string; vialsPerKit?: number; minQuantity?: number; stepQuantity?: number; minOrder?: number; orderStep?: number }>;
}

export interface StoreQuantityConfig {
  sellingUnit: 'vial' | 'kit';
  vialsPerKit: number;
  minQuantity: number;
  stepQuantity: number;
}

/**
 * Resolves full store-specific quantity configuration (sellingUnit, vialsPerKit, minQuantity, stepQuantity)
 */
export function getStoreQuantityConfig(
  product?: ProductWithStoreSettings | null,
  targetStoreType?: string
): StoreQuantityConfig {
  if (!product) {
    return { sellingUnit: 'kit', vialsPerKit: 10, minQuantity: 1, stepQuantity: 1 };
  }

  const store = (targetStoreType || product.storeType || 'groupbuy').toLowerCase().trim();

  let storeConfig: any = undefined;
  if (store === 'groupbuy') {
    storeConfig = product.groupBuySettings;
  } else if (store === 'onhand') {
    storeConfig = product.onHandSettings;
  } else if (store === 'moq') {
    storeConfig = product.moqSettings;
  } else if (product.storeSettings?.[store]) {
    storeConfig = product.storeSettings[store];
  }

  const normUnit = storeConfig?.sellingUnit
    ? normalizeSellingUnit(storeConfig.sellingUnit)
    : product.sellingUnit
    ? normalizeSellingUnit(product.sellingUnit)
    : store === 'onhand'
    ? 'vial'
    : 'kit';

  const vPerKit =
    typeof storeConfig?.vialsPerKit === 'number' && storeConfig.vialsPerKit > 0
      ? storeConfig.vialsPerKit
      : typeof product.vialsPerKit === 'number' && product.vialsPerKit > 0
      ? product.vialsPerKit
      : 10;

  const rawMin = storeConfig?.minQuantity ?? storeConfig?.minOrder ?? product.minQuantity ?? product.minOrder ?? product.variants?.[0]?.minOrder ?? 1;
  const rawStep = storeConfig?.stepQuantity ?? storeConfig?.orderStep ?? product.stepQuantity ?? product.orderStep ?? product.variants?.[0]?.orderStep ?? 1;

  const minQuantity = Math.max(1, typeof rawMin === 'number' && !isNaN(rawMin) ? rawMin : 1);
  const stepQuantity = Math.max(1, typeof rawStep === 'number' && !isNaN(rawStep) ? rawStep : 1);

  return {
    sellingUnit: normUnit,
    vialsPerKit: vPerKit,
    minQuantity,
    stepQuantity,
  };
}

/**
 * Resolves the store-specific selling unit configuration for a product.
 * Prioritizes store-specific settings (e.g. groupBuySettings, onHandSettings, moqSettings, or storeSettings[storeType])
 * over global fallbacks.
 */
export function getStoreSellingUnitConfig(
  product?: ProductWithStoreSettings | null,
  targetStoreType?: string
): { sellingUnit: 'vial' | 'kit'; vialsPerKit: number; minQuantity: number; stepQuantity: number } {
  return getStoreQuantityConfig(product, targetStoreType);
}

/**
 * Snaps a raw quantity to a valid quantity based on minQuantity and stepQuantity.
 * Ensures quantity >= minQuantity and (quantity - minQuantity) % stepQuantity === 0.
 */
export function snapToValidQuantity(
  rawQty: number,
  minQty: number = 1,
  stepQty: number = 1,
  maxQty: number = 999
): number {
  const min = Math.max(1, minQty);
  const step = Math.max(1, stepQty);
  let q = Number(rawQty);
  if (isNaN(q) || q < min) return min;
  if (q > maxQty) q = maxQty;
  const k = Math.round((q - min) / step);
  return min + k * step;
}

/**
 * Validates if a given quantity complies with minQuantity and stepQuantity constraints.
 */
export function isValidQuantity(
  qty: number,
  minQty: number = 1,
  stepQty: number = 1
): boolean {
  const min = Math.max(1, minQty);
  const step = Math.max(1, stepQty);
  if (qty < min) return false;
  return (qty - min) % step === 0;
}

/**
 * Calculates total vials for a single line item.
 * Rule:
 * - If isAccessory is true -> returns 0 vials.
 * - If sellingUnit is 'vial' -> returns quantity.
 * - If sellingUnit is 'kit' -> returns quantity * (vialsPerKit || 10).
 */
export function calculateItemVials(item: VialCalculableItem): number {
  if (item.isAccessory) {
    return 0;
  }

  const category = (item.category || '').toLowerCase();
  if (category.includes('accessory') || category.includes('packaging')) {
    return 0;
  }

  const qty = Math.max(0, item.quantity || 0);
  if (qty === 0) return 0;

  const unit = normalizeSellingUnit(item.sellingUnit, item.variantLabel, item.name);

  if (unit === 'kit') {
    const vPerKit = typeof item.vialsPerKit === 'number' && item.vialsPerKit > 0 ? item.vialsPerKit : 10;
    return qty * vPerKit;
  }

  // Per Vial
  return qty;
}

/**
 * Calculates total vials across an array of calculable items.
 * Excludes accessories automatically.
 */
export function calculateTotalVials(items: VialCalculableItem[]): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + calculateItemVials(item), 0);
}

/**
 * Calculates total labels required from total vials.
 * Business Rule: 1 Vial = 1 Label.
 * Labels = Total Vials.
 */
export function calculateTotalLabels(items: VialCalculableItem[]): number {
  return calculateTotalVials(items);
}

/**
 * Calculates total kits count from items where sellingUnit === 'kit'.
 */
export function calculateTotalKits(items: VialCalculableItem[]): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    if (item.isAccessory) return sum;
    const unit = normalizeSellingUnit(item.sellingUnit, item.variantLabel, item.name);
    return unit === 'kit' ? sum + Math.max(0, item.quantity || 0) : sum;
  }, 0);
}

/**
 * Helper to generate human-scannable unit text for UI displays.
 * E.g. "5 Vials" or "5 Kits (10 Vials/Kit = 50 Vials)"
 */
export function formatItemUnitSummary(item: VialCalculableItem): string {
  if (item.isAccessory) {
    return `${item.quantity} Unit${item.quantity > 1 ? 's' : ''}`;
  }

  const unit = normalizeSellingUnit(item.sellingUnit, item.variantLabel, item.name);
  const qty = Math.max(0, item.quantity || 0);

  if (unit === 'kit') {
    const vPerKit = typeof item.vialsPerKit === 'number' && item.vialsPerKit > 0 ? item.vialsPerKit : 10;
    const totalV = qty * vPerKit;
    return `${qty} Kit${qty > 1 ? 's' : ''} (${vPerKit} Vials/Kit • ${totalV} Total Vials)`;
  }

  return `${qty} Vial${qty > 1 ? 's' : ''}`;
}
