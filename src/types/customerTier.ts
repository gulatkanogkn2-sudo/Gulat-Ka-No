import { CustomerTier } from './customer';

/**
 * Reserved role identifiers that must never be used as customer tier IDs.
 */
export const RESERVED_TIER_ROLE_NAMES = [
  'OWNER',
  'ADMIN',
  'STAFF',
  'CUSTOMER',
  'ADMINISTRATOR',
  'VIEWER',
] as const;

export interface CustomerTierConfig {
  id: CustomerTier;
  name: string;
  minLifetimeSpendPhp: number;
  discountPercent?: number;
  isActive: boolean;
  isAutoAssignment: boolean;
  isManualOnly?: boolean;
  sortOrder?: number;
  description?: string;
  badgeColor?: string;
}

export interface CustomerTierSettings {
  enabled: boolean;
  autoRecalculateOnOrderChange: boolean;
  tiers: CustomerTierConfig[];
}

export interface CustomerTierProgressInfo {
  currentTier: CustomerTier;
  currentTierConfig: CustomerTierConfig;
  nextTierConfig: CustomerTierConfig | null;
  spendingPhp: number;
  nextTierThresholdPhp: number;
  remainingSpendPhp: number;
  progressPercentage: number;
  isHighestTier: boolean;
  isManualOrOwner: boolean;
}
