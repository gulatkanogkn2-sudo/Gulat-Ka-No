import { ProductAddonRelationship, AddonValidationResult } from '../types/productAddon';
import { StoreType } from '../types';
import { ProductManagementService } from './productManagementService';

const STORAGE_KEY = 'gkn_product_addons_v2';

const DEFAULT_ADDONS: ProductAddonRelationship[] = [
  {
    id: 'addon-001',
    enabled: true,
    name: 'GroupBuy Store-Wide Bac Water Pairing',
    scope: 'ENTIRE_STORE',
    store: 'groupbuy',
    relatedProductId: 'prod-bac-water',
    relatedProductName: 'Bacteriostatic Water (Bac Water)',
    minRelatedQty: 1,
    maxRelatedQty: 20,
    ruleType: 'RULE_E', // Excess units charged extra fee
    extraPricingBehavior: 'ADDITIONAL_FEE',
    extraUnitPricePhp: 50,
    excessUnitFeePhp: 50,
    excludedProductIds: [],
    notes: 'Automatically links Bacteriostatic Water to every GroupBuy product (including future products). Excess units above parent quantity incur +₱50/unit.',
  },
  {
    id: 'addon-002',
    enabled: true,
    name: 'Tirzepatide Syringe Pack Add-On',
    scope: 'SPECIFIC_PRODUCTS',
    store: 'groupbuy',
    parentProductId: 'prod-gb-001',
    parentProductIds: ['prod-gb-001'],
    relatedProductId: 'prod-syringe-pack',
    relatedProductName: 'Sterile U-100 Syringes (10-Pack)',
    minRelatedQty: 1,
    maxRelatedQty: 10,
    ruleType: 'RULE_B', // Less than or equal to parent quantity
    extraPricingBehavior: 'NORMAL',
    extraUnitPricePhp: 0,
    notes: 'Optional syringe pack paired specifically with Tirzepatide pre-orders.',
  },
  {
    id: 'addon-003',
    enabled: true,
    name: 'OnHand Semaglutide Bac Water Cap',
    scope: 'SPECIFIC_PRODUCTS',
    store: 'onhand',
    parentProductId: 'prod-oh-001',
    parentProductIds: ['prod-oh-001'],
    relatedProductId: 'prod-bac-water',
    relatedProductName: 'Bacteriostatic Water (Bac Water)',
    minRelatedQty: 1,
    maxRelatedQty: 5,
    ruleType: 'RULE_A', // Cannot exceed parent quantity
    extraPricingBehavior: 'NORMAL',
    extraUnitPricePhp: 0,
    notes: 'Strict 1:1 max ratio for OnHand Semaglutide cold vault dispatches.',
  },
];

function normalizeAddon(addon: any): ProductAddonRelationship {
  const scope = addon.scope || (addon.parentProductId ? 'SPECIFIC_PRODUCTS' : 'ENTIRE_STORE');
  const parentProductIds = addon.parentProductIds || (addon.parentProductId ? [addon.parentProductId] : []);

  return {
    ...addon,
    scope,
    parentProductIds,
    excludedProductIds: addon.excludedProductIds || [],
    excessUnitFeePhp: addon.excessUnitFeePhp ?? addon.extraUnitPricePhp ?? 0,
  };
}

function loadAddonsFromStorage(): ProductAddonRelationship[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADDONS));
      return DEFAULT_ADDONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(normalizeAddon);
    }
    return DEFAULT_ADDONS;
  } catch (err) {
    console.error('Failed to load product addons from storage:', err);
    return DEFAULT_ADDONS;
  }
}

function saveAddonsToStorage(addons: ProductAddonRelationship[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addons));
  } catch (err) {
    console.error('Failed to save product addons to storage:', err);
  }
}

function getValidProductIds(): Set<string> {
  try {
    const rawProds = ProductManagementService.getRawProducts();
    const valid = new Set<string>();
    for (const p of rawProds) {
      if (!ProductManagementService.isProductDeleted(p.id, 'all') && p.status !== 'Archived') {
        valid.add(p.id);
      }
    }
    return valid;
  } catch (err) {
    return new Set<string>();
  }
}

let cachedAddons: ProductAddonRelationship[] = loadAddonsFromStorage();

export const productAddonService = {
  purgeOrphanedAddons(explicitValidProductIds?: string[]): ProductAddonRelationship[] {
    let validSet: Set<string>;
    if (explicitValidProductIds && explicitValidProductIds.length > 0) {
      validSet = new Set(explicitValidProductIds);
    } else {
      validSet = getValidProductIds();
    }

    if (validSet.size === 0) {
      if (explicitValidProductIds && explicitValidProductIds.length === 0) {
        cachedAddons = [];
        saveAddonsToStorage(cachedAddons);
        return cachedAddons;
      }
      return cachedAddons;
    }

    const initialLen = cachedAddons.length;
    cachedAddons = cachedAddons
      .filter((a) => validSet.has(a.relatedProductId))
      .map((a) => {
        const parentProductIds = (a.parentProductIds || []).filter((id) => validSet.has(id));
        const excludedProductIds = (a.excludedProductIds || []).filter((id) => validSet.has(id));
        return {
          ...a,
          parentProductIds,
          excludedProductIds,
        };
      })
      .filter((a) => {
        if (a.scope === 'SPECIFIC_PRODUCTS' && (!a.parentProductIds || a.parentProductIds.length === 0)) {
          return false;
        }
        return true;
      });

    if (cachedAddons.length !== initialLen) {
      saveAddonsToStorage(cachedAddons);
    }
    return cachedAddons;
  },

  deleteAddonsByRelatedProductId(relatedProductId: string): void {
    const initialLen = cachedAddons.length;
    cachedAddons = cachedAddons.filter((a) => a.relatedProductId !== relatedProductId);
    cachedAddons = cachedAddons.map((a) => ({
      ...a,
      parentProductIds: (a.parentProductIds || []).filter((id) => id !== relatedProductId),
      excludedProductIds: (a.excludedProductIds || []).filter((id) => id !== relatedProductId),
    }));
    saveAddonsToStorage(cachedAddons);
  },

  getAddons(explicitValidProductIds?: string[]): ProductAddonRelationship[] {
    return this.purgeOrphanedAddons(explicitValidProductIds);
  },

  getAddonsForStore(store: StoreType): ProductAddonRelationship[] {
    const activeAddons = this.getAddons();
    const normalizedStore = store.toLowerCase();
    return activeAddons.filter((a) => a.enabled && (a.store === 'all' || a.store.toLowerCase() === normalizedStore));
  },

  getAddonsForProduct(productId: string, store: StoreType): ProductAddonRelationship[] {
    const activeAddons = this.getAddons();
    const normalizedStore = store.toLowerCase();
    return activeAddons.filter((a) => {
      if (!a.enabled) return false;

      // Store isolation check
      const storeMatch = a.store === 'all' || a.store.toLowerCase() === normalizedStore;
      if (!storeMatch) return false;

      if (a.scope === 'ENTIRE_STORE') {
        // Exclusions check
        if (a.excludedProductIds && a.excludedProductIds.includes(productId)) {
          return false;
        }
        return true;
      } else {
        // Specific product check
        const parentIds = a.parentProductIds || (a.parentProductId ? [a.parentProductId] : []);
        return parentIds.some((pId) => pId === productId || productId.includes(pId));
      }
    });
  },

  getAddonForParentAndRelated(
    parentProductId: string,
    relatedProductId: string,
    store: StoreType
  ): ProductAddonRelationship | undefined {
    const addonsForProd = this.getAddonsForProduct(parentProductId, store);
    return addonsForProd.find((a) => a.relatedProductId === relatedProductId || relatedProductId.includes(a.relatedProductId));
  },

  saveAddon(addon: ProductAddonRelationship): ProductAddonRelationship {
    const normalized = normalizeAddon(addon);
    const existingIndex = cachedAddons.findIndex((a) => a.id === normalized.id);
    if (existingIndex >= 0) {
      cachedAddons[existingIndex] = normalized;
    } else {
      cachedAddons.push(normalized);
    }
    saveAddonsToStorage(cachedAddons);
    return normalized;
  },

  deleteAddon(id: string): boolean {
    const initialLen = cachedAddons.length;
    cachedAddons = cachedAddons.filter((a) => a.id !== id);
    saveAddonsToStorage(cachedAddons);
    return cachedAddons.length < initialLen;
  },

  validateAddonQuantity(
    parentQty: number,
    requestedRelatedQty: number,
    addon: ProductAddonRelationship
  ): AddonValidationResult {
    if (!addon || !addon.enabled) {
      return { valid: true, maxAllowed: 9999, excessQuantity: 0, excessFeeTotal: 0, excessFeePerUnit: 0 };
    }

    let maxAllowed = addon.maxRelatedQty || 9999;
    let excessQuantity = 0;
    let excessFeePerUnit = addon.excessUnitFeePhp ?? addon.extraUnitPricePhp ?? 0;
    let excessFeeTotal = 0;

    switch (addon.ruleType) {
      case 'RULE_A': // Cannot exceed parent quantity
        maxAllowed = parentQty;
        if (requestedRelatedQty > parentQty) {
          return {
            valid: false,
            maxAllowed,
            reason: `Add-on quantity cannot exceed parent product quantity (${parentQty} units).`,
          };
        }
        break;

      case 'RULE_B': // Less than or equal to parent quantity
        maxAllowed = Math.min(parentQty, addon.maxRelatedQty || parentQty);
        if (requestedRelatedQty > maxAllowed) {
          return {
            valid: false,
            maxAllowed,
            reason: `Add-on quantity cannot exceed ${maxAllowed} units for this order.`,
          };
        }
        break;

      case 'RULE_C': // Can exceed parent quantity up to maxRelatedQty
        maxAllowed = addon.maxRelatedQty || 9999;
        if (requestedRelatedQty > maxAllowed) {
          return {
            valid: false,
            maxAllowed,
            reason: `Add-on quantity cannot exceed maximum limit of ${maxAllowed} units.`,
          };
        }
        break;

      case 'RULE_D': // No quantity constraint
        maxAllowed = addon.maxRelatedQty || 9999;
        break;

      case 'RULE_E': // Can exceed parent quantity, but excess units incur additional fee
        maxAllowed = addon.maxRelatedQty || 9999;
        if (requestedRelatedQty > maxAllowed) {
          return {
            valid: false,
            maxAllowed,
            reason: `Add-on quantity cannot exceed maximum limit of ${maxAllowed} units.`,
          };
        }

        // Calculate excess units above parent quantity
        if (requestedRelatedQty > parentQty) {
          excessQuantity = requestedRelatedQty - parentQty;
          excessFeeTotal = excessQuantity * excessFeePerUnit;
        }
        break;
    }

    if (addon.minRelatedQty && requestedRelatedQty < addon.minRelatedQty) {
      return {
        valid: false,
        maxAllowed,
        reason: `Minimum required add-on quantity is ${addon.minRelatedQty}.`,
      };
    }

    return {
      valid: true,
      maxAllowed,
      excessQuantity,
      excessFeeTotal,
      excessFeePerUnit,
    };
  },
};
