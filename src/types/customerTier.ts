import { CustomerTier } from './customer';

export interface CustomerTierConfig {
  id: CustomerTier;
  name: string;
  minLifetimeSpendPhp: number;
  isActive: boolean;
  isAutoAssignment: boolean;
  isManualOnly?: boolean;
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
