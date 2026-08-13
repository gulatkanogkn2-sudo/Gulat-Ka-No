import { SystemSettings, StoreConfig } from '../types/systemSettings';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSystemSettings';
import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';
import { Json } from '../types/supabase';

const SETTINGS_STORAGE_KEY = 'gkn_system_settings_v2';

type SettingsListener = (settings: SystemSettings) => void;

class SystemSettingsService {
  private listeners: Set<SettingsListener> = new Set();
  private cachedSettings: SystemSettings | null = null;
  private isSupabaseSyncing = false;
  private isSupabaseInitialized = false;

  /**
   * Load current system settings from localStorage or fallback to defaults,
   * triggering async Supabase sync if configured.
   */
  public getSettings(): SystemSettings {
    if (!this.cachedSettings) {
      try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as SystemSettings;
          // Deep merge with defaults to ensure any newly added setting keys exist
          this.cachedSettings = this.mergeWithDefaults(parsed);
        }
      } catch (error) {
        console.error('[SystemSettingsService] Error reading settings from localStorage:', error);
      }

      if (!this.cachedSettings) {
        this.cachedSettings = { ...DEFAULT_SYSTEM_SETTINGS };
        this.saveToStorage(this.cachedSettings);
      }
    }

    if (isSupabaseConfigured && !this.isSupabaseInitialized && !this.isSupabaseSyncing) {
      this.syncFromSupabase();
    }

    return this.cachedSettings;
  }

  /**
   * Fetch store configurations from Supabase store_configs table and merge into cached settings
   */
  public async syncFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured || this.isSupabaseSyncing) return;
    const client = getSupabaseClient();
    if (!client) return;

    this.isSupabaseSyncing = true;
    try {
      const { data, error } = await client.from('store_configs').select('*');
      if (error) {
        console.error('[SystemSettingsService] Error fetching store_configs:', error);
        return;
      }

      if (data && data.length > 0) {
        const currentSettings = this.cachedSettings || this.getSettings();
        const updatedStores = { ...currentSettings.stores };

        data.forEach((row) => {
          const storeKey = row.store_type as 'groupbuy' | 'onhand' | 'moq';
          if (!['groupbuy', 'onhand', 'moq'].includes(storeKey)) return;

          const defaultStore = DEFAULT_SYSTEM_SETTINGS.stores[storeKey];
          const currentStore = updatedStores[storeKey] || defaultStore;

          let jsonConfig: Partial<StoreConfig> = {};
          if (row.schedule_config_jsonb && typeof row.schedule_config_jsonb === 'object') {
            jsonConfig = row.schedule_config_jsonb as Partial<StoreConfig>;
          }

          updatedStores[storeKey] = {
            ...defaultStore,
            ...currentStore,
            ...jsonConfig,
            name: row.display_name || jsonConfig.name || currentStore.name || defaultStore.name,
            availability: {
              ...defaultStore.availability,
              ...currentStore.availability,
              ...(jsonConfig.availability || {}),
              manualStatus: (row.status_override as 'OPEN' | 'CLOSED') || currentStore.availability?.manualStatus || 'OPEN',
              openCloseControlEnabled: row.schedule_enabled ?? currentStore.availability?.openCloseControlEnabled ?? true,
            },
          };
        });

        this.cachedSettings = {
          ...currentSettings,
          stores: updatedStores,
        };
        this.saveToStorage(this.cachedSettings);
        this.notifyListeners(this.cachedSettings);
      } else {
        // Seed default store configurations to Supabase if table is empty
        const currentSettings = this.cachedSettings || this.getSettings();
        const storeKeys: Array<'groupbuy' | 'onhand' | 'moq'> = ['groupbuy', 'onhand', 'moq'];
        for (const storeKey of storeKeys) {
          if (currentSettings.stores[storeKey]) {
            await this.saveStoreConfigToSupabase(storeKey, currentSettings.stores[storeKey]);
          }
        }
      }
    } catch (err) {
      console.error('[SystemSettingsService] Exception during syncFromSupabase:', err);
    } finally {
      this.isSupabaseSyncing = false;
      this.isSupabaseInitialized = true;
    }
  }

  /**
   * Asynchronously upsert a single store configuration into Supabase store_configs table
   */
  private async saveStoreConfigToSupabase(
    storeType: 'groupbuy' | 'onhand' | 'moq',
    config: StoreConfig
  ): Promise<void> {
    if (!isSupabaseConfigured) return;
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const { data: { session } } = await client.auth.getSession();
      if (!session?.user?.id) {
        // Database security policies (RLS) require an authenticated admin/owner Supabase Auth session to write store configs.
        // When running under development mode bypass or unauthenticated client, skip remote writes and maintain local state.
        console.info(`[SystemSettingsService] Skipping Supabase store_config write for ${storeType}: A real authenticated Supabase Auth session (admin/owner) is required by RLS.`);
        return;
      }

      const updatedBy = session.user.id;

      const payload = {
        store_type: storeType,
        display_name: config.name || `${storeType.toUpperCase()} Store`,
        status_override: (config.availability?.manualStatus === 'CLOSED' ? 'CLOSED' : 'OPEN') as 'OPEN' | 'CLOSED',
        schedule_enabled: Boolean(config.availability?.openCloseControlEnabled ?? true),
        schedule_config_jsonb: config as unknown as Json,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      };

      const { error } = await client
        .from('store_configs')
        .upsert(payload, { onConflict: 'store_type' });

      if (error) {
        if (error.code === '42501') {
          console.warn(`[SystemSettingsService] RLS policy blocked saving store_config for ${storeType}: User ${updatedBy} must have an authorized admin/owner profile role in Supabase.`);
        } else {
          console.error(`[SystemSettingsService] Error saving store_config for ${storeType}:`, error);
        }
      }
    } catch (err) {
      console.error(`[SystemSettingsService] Failed to save store_config for ${storeType}:`, err);
    }
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

    // If store configs were updated, persist ONLY those modified store records to Supabase store_configs table
    if (updates.stores && isSupabaseConfigured) {
      const storeKeys = Object.keys(updates.stores) as Array<'groupbuy' | 'onhand' | 'moq'>;
      storeKeys.forEach((storeKey) => {
        if (['groupbuy', 'onhand', 'moq'].includes(storeKey) && updated.stores[storeKey]) {
          this.saveStoreConfigToSupabase(storeKey, updated.stores[storeKey]);
        }
      });
    }

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

    if (isSupabaseConfigured) {
      (['groupbuy', 'onhand', 'moq'] as const).forEach((storeKey) => {
        this.saveStoreConfigToSupabase(storeKey, reset.stores[storeKey]);
      });
    }

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

      if (isSupabaseConfigured && merged.stores) {
        (['groupbuy', 'onhand', 'moq'] as const).forEach((storeKey) => {
          if (merged.stores[storeKey]) {
            this.saveStoreConfigToSupabase(storeKey, merged.stores[storeKey]);
          }
        });
      }

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

