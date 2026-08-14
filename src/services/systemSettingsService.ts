import {
  SystemSettings,
  StoreConfig,
  ConfigurableShippingMethod,
  ConfigurableAdditionalFee,
  ConfigurablePaymentMethod,
  PaymentMethodType,
} from '../types/systemSettings';
import { DEFAULT_SYSTEM_SETTINGS } from '../data/defaultSystemSettings';
import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';
import { Json } from '../types/supabase';
import { writeCompactJsonCache } from '../utils/safeLocalStorage';

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
      if (typeof localStorage !== 'undefined') {
        try {
          const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as SystemSettings;
            if (parsed.general?.companyName === 'GKN Research Group Ltd.') {
              parsed.general.companyName = 'GKN V2';
            }
            parsed.general.websiteName = 'GKN V2';
            parsed.general.brandName = 'GKN V2';
            // Deep merge with defaults to ensure any newly added setting keys exist
            this.cachedSettings = this.mergeWithDefaults(parsed);
          }
        } catch (error) {
          console.error('[SystemSettingsService] Error reading settings from localStorage:', error);
        }
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
   * Fetch store configurations, shipping methods, additional fees, payment methods, and system settings from Supabase
   */
  public async syncFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured || this.isSupabaseSyncing) return;
    const client = getSupabaseClient();
    if (!client) return;

    this.isSupabaseSyncing = true;
    try {
      const currentSettings = this.cachedSettings || this.getSettings();
      let hasUpdates = false;
      const newSettings: SystemSettings = { ...currentSettings };

      // 1. Sync store_configs
      const { data: storeData, error: storeError } = await client.from('store_configs').select('*');
      if (!storeError && storeData && storeData.length > 0) {
        const updatedStores = { ...newSettings.stores };
        storeData.forEach((row) => {
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
        newSettings.stores = updatedStores;
        hasUpdates = true;
      }

      // 2. Sync shipping_methods
      const { data: shippingData, error: shippingError } = await client.from('shipping_methods').select('*').order('created_at');
      if (!shippingError && shippingData && shippingData.length > 0) {
        const mappedMethods: ConfigurableShippingMethod[] = shippingData.map((row: any, idx: number) => ({
          id: row.id,
          name: row.name,
          description: (row.settings_jsonb as any)?.description || 'Standard Insured Dispatch',
          enabled: Boolean(row.is_enabled),
          displayOrder: row.sort_order || idx + 1,
          availableStores: row.available_stores || ['all'],
          calculationType: (Number(row.base_included_qty) > 0 || Number(row.additional_per_vial_fee_php) > 0) ? 'base_additional' : 'fixed',
          baseFee: Number(row.base_fee_php || 0),
          baseIncludedQty: Number(row.base_included_qty || 0),
          additionalPerVialFee: Number(row.additional_per_vial_fee_php || 0),
          regionalRates: Array.isArray(row.regional_rates_jsonb) ? row.regional_rates_jsonb : [],
          minOrderAmount: 0,
          minQuantity: 0,
        }));
        newSettings.shipping = {
          ...newSettings.shipping,
          methods: mappedMethods,
        };
        hasUpdates = true;
      }

      // 3. Sync additional_fees
      const { data: feeData, error: feeError } = await client.from('additional_fees').select('*').order('created_at');
      if (!feeError && feeData && feeData.length > 0) {
        const mappedFees: ConfigurableAdditionalFee[] = feeData.map((row: any, idx: number) => ({
          id: row.id,
          name: row.name,
          displayName: row.name,
          description: row.description || '',
          enabled: Boolean(row.is_enabled),
          type: 'custom_fee',
          calculationType: (row.fee_type || 'fixed').toLowerCase() as any,
          amount: Number(row.amount_php || 0),
          availableStores: row.available_stores || ['all'],
          displayOrder: row.sort_order || idx + 1,
        }));
        newSettings.shipping = {
          ...newSettings.shipping,
          additionalFees: mappedFees,
        };
        hasUpdates = true;
      }

      // 4. Sync payment_methods
      const { data: paymentData, error: paymentError } = await client.from('payment_methods').select('*').order('sort_order');
      if (!paymentError && paymentData && paymentData.length > 0) {
        const mappedPayments: ConfigurablePaymentMethod[] = paymentData.map((row: any, idx: number) => ({
          id: row.id,
          methodType: (row.method_type || 'E_WALLET') as PaymentMethodType,
          displayName: row.name,
          subtitle: (row.method_type || '').replaceAll('_', ' '),
          description: row.instructions || '',
          enabled: Boolean(row.is_enabled),
          sortOrder: row.sort_order || idx + 1,
          accountName: row.account_name || '',
          accountNumber: row.account_number || row.wallet_address || '',
          qrCodeUrl: row.qr_code_storage_path || undefined,
          instructions: row.instructions || '',
          accent: (['cyan', 'purple', 'magenta', 'green'] as const)[idx % 4],
          badge: row.method_type || 'INSTANT',
          requiresProof: (row.settings_jsonb as any)?.requires_proof !== false,
          availableStores: row.available_stores || ['all'],
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        newSettings.payments = {
          ...newSettings.payments,
          methods: mappedPayments,
        };
        hasUpdates = true;
      }

      // 5. Sync system_settings (global categories)
      const { data: sysData, error: sysError } = await client.from('system_settings').select('*');
      if (!sysError && sysData && sysData.length > 0) {
        sysData.forEach((row: any) => {
          const key = row.setting_key as keyof SystemSettings;
          if (key && row.setting_value && typeof row.setting_value === 'object') {
            (newSettings as any)[key] = {
              ...(newSettings as any)[key],
              ...row.setting_value,
            };
            hasUpdates = true;
          }
        });
      }

      if (hasUpdates) {
        this.cachedSettings = newSettings;
        this.saveToStorage(newSettings);
        this.notifyListeners(newSettings);
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
      const payload = {
        store_type: storeType,
        display_name: config.name || `${storeType.toUpperCase()} Store`,
        status_override: (config.availability?.manualStatus === 'CLOSED' ? 'CLOSED' : 'OPEN') as 'OPEN' | 'CLOSED',
        schedule_enabled: Boolean(config.availability?.openCloseControlEnabled ?? true),
        schedule_config_jsonb: config as unknown as Json,
        updated_at: new Date().toISOString(),
      };

      const { error } = await client
        .from('store_configs')
        .upsert(payload, { onConflict: 'store_type' });

      if (error) {
        console.warn(`[SystemSettingsService] Notice saving store_config for ${storeType}:`, error.message);
      }
    } catch (err) {
      console.error(`[SystemSettingsService] Failed to save store_config for ${storeType}:`, err);
    }
  }

  /**
   * Asynchronously upsert shipping methods to Supabase shipping_methods table
   */
  private async saveShippingMethodsToSupabase(methods: ConfigurableShippingMethod[]): Promise<void> {
    if (!isSupabaseConfigured) return;
    const client = getSupabaseClient();
    if (!client) return;

    try {
      for (const method of methods) {
        const payload: any = {
          name: method.name,
          method_type: (method as any).methodType || 'STANDARD',
          base_fee_php: method.baseFee || 0,
          base_included_qty: method.baseIncludedQty || 0,
          additional_per_vial_fee_php: method.additionalPerVialFee || 0,
          available_stores: method.availableStores || ['all'],
          regional_rates_jsonb: method.regionalRates || [],
          is_enabled: method.enabled ?? true,
          sort_order: method.displayOrder || 1,
          settings_jsonb: { description: method.description },
          updated_at: new Date().toISOString(),
        };

        if (method.id && method.id.includes('-') && method.id.length >= 30) {
          payload.id = method.id;
        }

        const { error } = await client.from('shipping_methods').upsert(payload);
        if (error) {
          console.warn('[SystemSettingsService] Notice saving shipping_method:', error.message);
        }
      }
    } catch (err) {
      console.error('[SystemSettingsService] Failed to save shipping methods to Supabase:', err);
    }
  }

  /**
   * Asynchronously upsert additional fees to Supabase additional_fees table
   */
  private async saveAdditionalFeesToSupabase(fees: ConfigurableAdditionalFee[]): Promise<void> {
    if (!isSupabaseConfigured) return;
    const client = getSupabaseClient();
    if (!client) return;

    try {
      for (const fee of fees) {
        const payload: any = {
          name: fee.displayName || fee.name,
          description: fee.description || null,
          fee_type: (fee.calculationType || 'FIXED').toUpperCase(),
          amount_php: fee.amount || 0,
          available_stores: fee.availableStores || ['all'],
          is_enabled: fee.enabled ?? true,
          sort_order: fee.displayOrder || 1,
          settings_jsonb: {},
          updated_at: new Date().toISOString(),
        };

        if (fee.id && fee.id.includes('-') && fee.id.length >= 30) {
          payload.id = fee.id;
        }

        const { error } = await client.from('additional_fees').upsert(payload);
        if (error) {
          console.warn('[SystemSettingsService] Notice saving additional_fee:', error.message);
        }
      }
    } catch (err) {
      console.error('[SystemSettingsService] Failed to save additional fees to Supabase:', err);
    }
  }

  /**
   * Asynchronously upsert payment methods to Supabase payment_methods table
   */
  private async savePaymentMethodsToSupabase(methods: ConfigurablePaymentMethod[]): Promise<void> {
    if (!isSupabaseConfigured) return;
    const client = getSupabaseClient();
    if (!client) return;

    try {
      for (const method of methods) {
        const payload: any = {
          name: method.displayName,
          method_type: method.methodType || 'E_WALLET',
          account_name: method.accountName || null,
          account_number: method.accountNumber || null,
          wallet_address: method.methodType === 'CRYPTOCURRENCY' ? method.accountNumber || null : null,
          qr_code_storage_path: method.qrCodeUrl || null,
          instructions: method.instructions || null,
          available_stores: method.availableStores || ['all'],
          is_enabled: method.enabled ?? true,
          sort_order: method.sortOrder || 1,
          settings_jsonb: {
            bank_or_network: method.bankName || method.network || method.providerBrand || undefined,
            requires_proof: method.requiresProof !== false,
          },
          updated_at: new Date().toISOString(),
        };

        if (method.id && method.id.includes('-') && method.id.length >= 30) {
          payload.id = method.id;
        }

        const { error } = await client.from('payment_methods').upsert(payload);
        if (error) {
          console.warn('[SystemSettingsService] Notice saving payment_method:', error.message);
        }
      }
    } catch (err) {
      console.error('[SystemSettingsService] Failed to save payment methods to Supabase:', err);
    }
  }

  /**
   * Asynchronously upsert global system settings categories to Supabase system_settings table
   */
  private async saveSystemSettingsToSupabase(updates: Partial<SystemSettings>): Promise<void> {
    if (!isSupabaseConfigured) return;
    const client = getSupabaseClient();
    if (!client) return;

    const globalKeys: Array<keyof SystemSettings> = [
      'general',
      'orders',
      'notifications',
      'security',
      'systemConfig',
      'deployment',
      'adminVisibility',
      'owner',
      'customerTiers',
    ];

    try {
      for (const key of globalKeys) {
        if (updates[key]) {
          const payload = {
            setting_key: key,
            setting_value: updates[key] as unknown as Json,
            category: 'global',
            updated_at: new Date().toISOString(),
          };

          const { error } = await client
            .from('system_settings')
            .upsert(payload, { onConflict: 'setting_key' });

          if (error) {
            console.warn(`[SystemSettingsService] Notice saving system_setting for ${key}:`, error.message);
          }
        }
      }
    } catch (err) {
      console.error('[SystemSettingsService] Failed to save system settings to Supabase:', err);
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

    // Persist to dedicated Supabase tables asynchronously
    if (isSupabaseConfigured) {
      if (updates.stores) {
        const storeKeys = Object.keys(updates.stores) as Array<'groupbuy' | 'onhand' | 'moq'>;
        storeKeys.forEach((storeKey) => {
          if (['groupbuy', 'onhand', 'moq'].includes(storeKey) && updated.stores[storeKey]) {
            this.saveStoreConfigToSupabase(storeKey, updated.stores[storeKey]);
          }
        });
      }

      if (updates.shipping?.methods) {
        this.saveShippingMethodsToSupabase(updated.shipping.methods);
      }

      if (updates.shipping?.additionalFees) {
        this.saveAdditionalFeesToSupabase(updated.shipping.additionalFees);
      }

      if (updates.payments?.methods) {
        this.savePaymentMethodsToSupabase(updated.payments.methods);
      }

      this.saveSystemSettingsToSupabase(updates);
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
    writeCompactJsonCache(SETTINGS_STORAGE_KEY, settings);
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

