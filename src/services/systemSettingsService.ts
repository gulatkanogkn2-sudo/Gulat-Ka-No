import { SystemSettings } from '../types/systemSettings';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSystemSettings';

const SETTINGS_STORAGE_KEY = 'gkn_system_settings_v2';

type SettingsListener = (settings: SystemSettings) => void;

class SystemSettingsService {
  private listeners: Set<SettingsListener> = new Set();
  private cachedSettings: SystemSettings | null = null;

  /**
   * Load current system settings from localStorage or fallback to defaults
   */
  public getSettings(): SystemSettings {
    if (this.cachedSettings) {
      return this.cachedSettings;
    }

    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SystemSettings;
        // Deep merge with defaults to ensure any newly added setting keys exist
        this.cachedSettings = this.mergeWithDefaults(parsed);
        return this.cachedSettings;
      }
    } catch (error) {
      console.error('[SystemSettingsService] Error reading settings from localStorage:', error);
    }

    this.cachedSettings = { ...DEFAULT_SYSTEM_SETTINGS };
    this.saveToStorage(this.cachedSettings);
    return this.cachedSettings;
  }

  /**
   * Save setting updates (partial or full)
   */
  public saveSettings(updates: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated: SystemSettings = {
      ...current,
      ...updates,
      general: {
        ...current.general,
        ...(updates.general || {}),
      },
      stores: {
        ...current.stores,
        ...(updates.stores || {}),
      },
      orders: {
        ...current.orders,
        ...(updates.orders || {}),
      },
      payments: {
        ...current.payments,
        ...(updates.payments || {}),
      },
      shipping: {
        ...current.shipping,
        ...(updates.shipping || {}),
      },
      notifications: {
        ...current.notifications,
        ...(updates.notifications || {}),
      },
      security: {
        ...current.security,
        ...(updates.security || {}),
      },
      systemConfig: {
        ...current.systemConfig,
        ...(updates.systemConfig || {}),
      },
      deployment: {
        ...current.deployment,
        ...(updates.deployment || {}),
      },
      adminVisibility: {
        ...current.adminVisibility,
        ...(updates.adminVisibility || {}),
      },
      owner: {
        ...current.owner,
        ...(updates.owner || {}),
      },
      customerTiers: updates.customerTiers
        ? updates.customerTiers
        : current.customerTiers || DEFAULT_SYSTEM_SETTINGS.customerTiers,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin User',
    };

    this.cachedSettings = updated;
    this.saveToStorage(updated);
    this.notifyListeners(updated);
    return updated;
  }

  /**
   * Reset all settings to default baseline values
   */
  public resetDefaults(): SystemSettings {
    const reset = {
      ...DEFAULT_SYSTEM_SETTINGS,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin User (Defaults Reset)',
    };
    this.cachedSettings = reset;
    this.saveToStorage(reset);
    this.notifyListeners(reset);
    return reset;
  }

  /**
   * Import settings from a JSON string payload
   */
  public importSettings(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object' || !parsed.general || !parsed.stores) {
        return { success: false, error: 'Invalid System Settings schema format.' };
      }

      const merged = this.mergeWithDefaults(parsed as SystemSettings);
      merged.updatedAt = new Date().toISOString();
      merged.updatedBy = 'Admin User (Imported JSON)';

      this.cachedSettings = merged;
      this.saveToStorage(merged);
      this.notifyListeners(merged);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'JSON parse error';
      return { success: false, error: message };
    }
  }

  /**
   * Export settings as a downloadable JSON file
   */
  public exportSettings(): void {
    const settings = this.getSettings();
    const jsonStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `GKN_System_Settings_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Convenience getter for Admin Portal Visibility
   */
  public getAdminPortalVisibility(): boolean {
    const settings = this.getSettings();
    return settings.adminVisibility?.showAdminButton ?? true;
  }

  /**
   * Convenience setter for Admin Portal Visibility
   */
  public setAdminPortalVisibility(showAdminButton: boolean): SystemSettings {
    return this.saveSettings({
      adminVisibility: { showAdminButton },
    });
  }

  /**
   * Reset/Flush cached system data simulation
   */
  public flushSystemCache(): SystemSettings {
    const settings = this.getSettings();
    const updatedSystemConfig = {
      ...settings.systemConfig,
      healthStatus: {
        ...settings.systemConfig.healthStatus,
        lastCacheReset: new Date().toISOString(),
      },
    };
    return this.saveSettings({ systemConfig: updatedSystemConfig });
  }

  /**
   * Subscribe to settings changes reactively
   */
  public subscribe(listener: SettingsListener): () => void {
    this.listeners.add(listener);
    // Immediately emit current state
    listener(this.getSettings());

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Prepare settings object in format ready for Supabase row upsert
   */
  public prepareForSupabase(): Record<string, unknown> {
    const s = this.getSettings();
    return {
      id: 'system_settings_singleton',
      general: s.general,
      stores: s.stores,
      orders: s.orders,
      payments: s.payments,
      shipping: s.shipping,
      notifications: s.notifications,
      security: s.security,
      system_config: s.systemConfig,
      deployment: s.deployment,
      admin_visibility: s.adminVisibility,
      owner: s.owner,
      updated_at: s.updatedAt,
      updated_by: s.updatedBy,
    };
  }

  private saveToStorage(settings: SystemSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('[SystemSettingsService] Error saving settings to localStorage:', e);
    }
  }

  private notifyListeners(settings: SystemSettings): void {
    this.listeners.forEach((listener) => {
      try {
        listener(settings);
      } catch (err) {
        console.error('[SystemSettingsService] Error in settings listener:', err);
      }
    });
  }

  private mergeWithDefaults(stored: Partial<SystemSettings>): SystemSettings {
    return {
      ...DEFAULT_SYSTEM_SETTINGS,
      ...stored,
      general: { ...DEFAULT_SYSTEM_SETTINGS.general, ...(stored.general || {}) },
      stores: { ...DEFAULT_SYSTEM_SETTINGS.stores, ...(stored.stores || {}) },
      orders: { ...DEFAULT_SYSTEM_SETTINGS.orders, ...(stored.orders || {}) },
      payments: {
        ...DEFAULT_SYSTEM_SETTINGS.payments,
        ...(stored.payments || {}),
        methods: Array.isArray(stored.payments?.methods)
          ? stored.payments.methods
          : DEFAULT_SYSTEM_SETTINGS.payments.methods,
      },
      shipping: {
        ...DEFAULT_SYSTEM_SETTINGS.shipping,
        ...(stored.shipping || {}),
        vialUnitConfig: {
          ...DEFAULT_SYSTEM_SETTINGS.shipping.vialUnitConfig,
          ...(stored.shipping?.vialUnitConfig || {}),
        },
        methods: Array.isArray(stored.shipping?.methods) && stored.shipping.methods.length > 0
          ? stored.shipping.methods
          : DEFAULT_SYSTEM_SETTINGS.shipping.methods,
        additionalFees: Array.isArray(stored.shipping?.additionalFees)
          ? stored.shipping.additionalFees
          : DEFAULT_SYSTEM_SETTINGS.shipping.additionalFees,
      },
      notifications: { ...DEFAULT_SYSTEM_SETTINGS.notifications, ...(stored.notifications || {}) },
      security: { ...DEFAULT_SYSTEM_SETTINGS.security, ...(stored.security || {}) },
      systemConfig: { ...DEFAULT_SYSTEM_SETTINGS.systemConfig, ...(stored.systemConfig || {}) },
      deployment: { ...DEFAULT_SYSTEM_SETTINGS.deployment, ...(stored.deployment || {}) },
      adminVisibility: { ...DEFAULT_SYSTEM_SETTINGS.adminVisibility, ...(stored.adminVisibility || {}) },
      owner: { ...DEFAULT_SYSTEM_SETTINGS.owner, ...(stored.owner || {}) },
      customerTiers: stored.customerTiers
        ? { ...DEFAULT_SYSTEM_SETTINGS.customerTiers!, ...stored.customerTiers }
        : DEFAULT_SYSTEM_SETTINGS.customerTiers,
    };
  }
}

export const systemSettingsService = new SystemSettingsService();
