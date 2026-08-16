import { CustomerTier, CustomerOrderSummary } from '../types/customer';
import {
  CustomerTierConfig,
  CustomerTierSettings,
  CustomerTierProgressInfo,
  RESERVED_TIER_ROLE_NAMES,
} from '../types/customerTier';
import { systemSettingsService } from './systemSettingsService';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSystemSettings';

export class CustomerTierService {
  /**
   * Normalize an arbitrary string or custom tier name to a safe uppercase identifier
   * Example: "Platinum" -> "PLATINUM", "Elite Member" -> "ELITE_MEMBER"
   */
  static normalizeTierId(input: string): string {
    if (!input || !input.trim()) return 'STANDARD';
    return input
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Check if a proposed tier ID collides with reserved account authorization roles
   */
  static isReservedTierName(tierId: string): boolean {
    const normalized = this.normalizeTierId(tierId);
    return (RESERVED_TIER_ROLE_NAMES as readonly string[]).includes(normalized);
  }

  /**
   * Fetch current tier settings from systemSettingsService (authoritative Supabase-backed global settings)
   */
  static getTierSettings(): CustomerTierSettings {
    const sys = systemSettingsService.getSettings();
    return sys.customerTiers || DEFAULT_SYSTEM_SETTINGS.customerTiers!;
  }

  /**
   * Save updated tier settings to systemSettingsService (synced to Supabase system_settings table)
   */
  static saveTierSettings(updated: CustomerTierSettings): CustomerTierSettings {
    const saved = systemSettingsService.saveSettings({
      customerTiers: updated,
    });
    return saved.customerTiers || updated;
  }

  /**
   * Find configuration for a specific tier ID with safe fallback for unknown / custom tiers
   */
  static getTierConfig(tierId: CustomerTier, tierSettings?: CustomerTierSettings): CustomerTierConfig {
    const settings = tierSettings || this.getTierSettings();
    const normalized = this.normalizeTierId(tierId);
    const found = settings.tiers.find((t) => this.normalizeTierId(t.id) === normalized);

    if (found) {
      return found;
    }

    // Safe fallback presentation for unknown / future custom tier
    const readableName = tierId
      ? tierId
          .split('_')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ')
      : 'Standard';

    return {
      id: tierId || 'STANDARD',
      name: readableName,
      minLifetimeSpendPhp: 0,
      discountPercent: 0,
      isActive: true,
      isAutoAssignment: false,
      isManualOnly: true,
      description: `Tier ${readableName}`,
      badgeColor: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300',
    };
  }

  /**
   * Retrieve discount percentage for a given tier (safe fallback to 0%)
   */
  static getDiscountForTier(tierId: CustomerTier, tierSettings?: CustomerTierSettings): number {
    const config = this.getTierConfig(tierId, tierSettings);
    return typeof config.discountPercent === 'number' ? config.discountPercent : 0;
  }

  /**
   * Retrieve readable badge details for any tier safely
   */
  static getTierBadgeDetails(
    tierId: CustomerTier,
    tierSettings?: CustomerTierSettings
  ): { label: string; badgeColor: string; name: string } {
    const config = this.getTierConfig(tierId, tierSettings);
    return {
      label: config.id,
      name: config.name,
      badgeColor: config.badgeColor || 'border-slate-700 bg-slate-800 text-slate-300',
    };
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
   * 1. Manual Tier Override flag (if true, automatic engine will preserve current tier)
   * 2. Highest enabled qualifying tier threshold
   */
  static determineTierForSpending(
    spendingPhp: number,
    tierSettings?: CustomerTierSettings,
    currentTier: CustomerTier = 'STANDARD',
    isManualOverride: boolean = false
  ): CustomerTier {
    // Rule: Manual override is NEVER automatically overwritten
    if (isManualOverride) {
      return currentTier;
    }

    const settings = tierSettings || this.getTierSettings();
    if (!settings.enabled) {
      return currentTier;
    }

    // Filter active tiers that allow automatic assignment
    const activeAutoTiers = settings.tiers.filter(
      (t) => t.isActive && t.isAutoAssignment && !t.isManualOnly
    );

    // Sort descending by minLifetimeSpendPhp (highest qualifying first)
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
    const currentConfig = this.getTierConfig(currentTier, settings);

    // Manual override special handling
    if (isManualOverride) {
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
      .filter((t) => t.isActive && t.isAutoAssignment && !t.isManualOnly)
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
