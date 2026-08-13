import { CustomerTier, CustomerOrderSummary } from '../types/customer';
import {
  CustomerTierConfig,
  CustomerTierSettings,
  CustomerTierProgressInfo,
} from '../types/customerTier';
import { systemSettingsService } from './systemSettingsService';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSystemSettings';

export class CustomerTierService {
  /**
   * Fetch current tier settings from systemSettingsService
   */
  static getTierSettings(): CustomerTierSettings {
    const sys = systemSettingsService.getSettings();
    return sys.customerTiers || DEFAULT_SYSTEM_SETTINGS.customerTiers!;
  }

  /**
   * Save updated tier settings
   */
  static saveTierSettings(updated: CustomerTierSettings): CustomerTierSettings {
    const saved = systemSettingsService.saveSettings({
      customerTiers: updated,
    });
    return saved.customerTiers || updated;
  }

  /**
   * Calculate qualifying lifetime spending in PHP from customer's order history.
   * EXCLUDES: Cancelled, Refunded, Unpaid, Awaiting Payment, or Failed orders.
   */
  static calculateQualifyingSpending(orders: CustomerOrderSummary[]): number {
    if (!orders || orders.length === 0) return 0;

    const qualifyingOrders = orders.filter((o) => {
      const statusUpper = (o.status || '').toUpperCase();
      // Exclude cancelled or refunded statuses
      if (
        statusUpper.includes('CANCEL') ||
        statusUpper.includes('REFUND') ||
        statusUpper.includes('REJECT') ||
        statusUpper.includes('UNPAID') ||
        statusUpper.includes('FAILED')
      ) {
        return false;
      }
      return true;
    });

    return qualifyingOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  }

  /**
   * Dynamically evaluate automatic customer tier based on qualifying spending and active tier thresholds.
   * Strictly respects:
   * 1. Manual Tier Override flag (if true, automatic engine will not overwrite)
   * 2. OWNER tier (strictly manual only)
   */
  static determineTierForSpending(
    spendingPhp: number,
    tierSettings?: CustomerTierSettings,
    currentTier: CustomerTier = 'STANDARD',
    isManualOverride: boolean = false
  ): CustomerTier {
    // Rule: Manual override or OWNER tier is NEVER automatically overwritten
    if (isManualOverride || currentTier === 'OWNER') {
      return currentTier;
    }

    const settings = tierSettings || this.getTierSettings();
    if (!settings.enabled) {
      return currentTier;
    }

    // Filter active tiers that allow automatic assignment (exclude manual-only like OWNER)
    const activeAutoTiers = settings.tiers.filter(
      (t) => t.isActive && t.isAutoAssignment && !t.isManualOnly && t.id !== 'OWNER'
    );

    // Sort descending by minLifetimeSpendPhp
    activeAutoTiers.sort((a, b) => b.minLifetimeSpendPhp - a.minLifetimeSpendPhp);

    for (const tierConfig of activeAutoTiers) {
      if (spendingPhp >= tierConfig.minLifetimeSpendPhp) {
        return tierConfig.id;
      }
    }

    return 'STANDARD';
  }

  /**
   * Calculate detailed progress info towards next tier
   */
  static getTierProgressInfo(
    spendingPhp: number,
    currentTier: CustomerTier,
    tierSettings?: CustomerTierSettings,
    isManualOverride: boolean = false
  ): CustomerTierProgressInfo {
    const settings = tierSettings || this.getTierSettings();
    const allTiers = settings.tiers;

    const currentConfig =
      allTiers.find((t) => t.id === currentTier) || {
        id: currentTier,
        name: currentTier,
        minLifetimeSpendPhp: 0,
        isActive: true,
        isAutoAssignment: true,
      };

    // Owner or manual override special handling
    if (currentTier === 'OWNER' || isManualOverride) {
      return {
        currentTier,
        currentTierConfig: currentConfig,
        nextTierConfig: null,
        spendingPhp,
        nextTierThresholdPhp: currentConfig.minLifetimeSpendPhp,
        remainingSpendPhp: 0,
        progressPercentage: 100,
        isHighestTier: true,
        isManualOrOwner: true,
      };
    }

    // Active auto tiers sorted ascending by spending threshold
    const activeAutoTiers = allTiers
      .filter((t) => t.isActive && t.isAutoAssignment && !t.isManualOnly && t.id !== 'OWNER')
      .sort((a, b) => a.minLifetimeSpendPhp - b.minLifetimeSpendPhp);

    // Find next higher tier threshold
    const nextTierConfig = activeAutoTiers.find((t) => t.minLifetimeSpendPhp > spendingPhp) || null;

    if (!nextTierConfig) {
      // Reached highest automatic tier
      return {
        currentTier,
        currentTierConfig: currentConfig,
        nextTierConfig: null,
        spendingPhp,
        nextTierThresholdPhp: currentConfig.minLifetimeSpendPhp,
        remainingSpendPhp: 0,
        progressPercentage: 100,
        isHighestTier: true,
        isManualOrOwner: false,
      };
    }

    const nextTierThresholdPhp = nextTierConfig.minLifetimeSpendPhp;
    const remainingSpendPhp = Math.max(0, nextTierThresholdPhp - spendingPhp);
    const progressPercentage = Math.min(
      100,
      Math.max(0, (spendingPhp / nextTierThresholdPhp) * 100)
    );

    return {
      currentTier,
      currentTierConfig: currentConfig,
      nextTierConfig,
      spendingPhp,
      nextTierThresholdPhp,
      remainingSpendPhp,
      progressPercentage,
      isHighestTier: false,
      isManualOrOwner: false,
    };
  }
}
