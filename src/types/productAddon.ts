import { StoreType } from './index';

export type AddonRuleType =
  | 'RULE_A' // Related add-on quantity cannot exceed parent quantity
  | 'RULE_B' // Related add-on quantity can be equal to or less than parent quantity
  | 'RULE_C' // Related add-on quantity can exceed parent quantity up to max
  | 'RULE_D' // No quantity constraint
  | 'RULE_E'; // Add-on quantity can exceed parent quantity, but excess units incur additional fee

export type AddonScopeType = 'SPECIFIC_PRODUCTS' | 'ENTIRE_STORE';

export type AddonExtraPricingBehavior =
  | 'NORMAL' // Normal product price for every unit
  | 'ADDITIONAL_FEE' // Additional fee for units beyond the included/allowed quantity
  | 'CUSTOM_PRICE'; // Configurable additional-unit price for excess units

export interface ProductAddonRelationship {
  id: string;
  enabled: boolean;
  name?: string; // Optional relationship label / name
  
  // Link Scope
  scope: AddonScopeType; // 'SPECIFIC_PRODUCTS' or 'ENTIRE_STORE'
  parentProductId?: string; // Legacy / primary parent product ID
  parentProductIds?: string[]; // Array of selected parent product IDs when scope === 'SPECIFIC_PRODUCTS'
  excludedProductIds?: string[]; // Array of excluded parent product IDs when scope === 'ENTIRE_STORE'

  // Add-On Target Product & Variant
  relatedProductId: string;
  relatedProductName?: string;
  defaultVariantId?: string; // Preselected variant ID (if any)

  // Store Isolation
  store: StoreType | 'all'; // 'groupbuy' | 'onhand' | 'moq' | 'all'

  // Quantity Rules
  minRelatedQty: number;
  maxRelatedQty: number;
  ruleType: AddonRuleType;

  // Rule E / Pricing behavior
  extraPricingBehavior: AddonExtraPricingBehavior;
  extraUnitPricePhp?: number; // Fee per excess unit
  excessUnitFeePhp?: number; // Alias for excess unit fee (Rule E)
  
  notes?: string;
}

export interface AddonValidationResult {
  valid: boolean;
  maxAllowed: number;
  reason?: string;
  excessQuantity?: number;
  excessFeeTotal?: number;
  excessFeePerUnit?: number;
}
