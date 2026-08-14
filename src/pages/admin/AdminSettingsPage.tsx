import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SystemSettings } from '../../types/systemSettings';
import { systemSettingsService } from '../../services/systemSettingsService';

// Consolidated Tabs
import { GeneralSettingsTab } from '../../components/admin/settings/tabs/GeneralSettingsTab';
import { StoresAndProductsTab } from '../../components/admin/settings/tabs/StoresAndProductsTab';
import { CheckoutAndFeesTab } from '../../components/admin/settings/tabs/CheckoutAndFeesTab';
import { OrdersAndTimelinesTab } from '../../components/admin/settings/tabs/OrdersAndTimelinesTab';
import { ShippingSettingsTab } from '../../components/admin/settings/tabs/ShippingSettingsTab';
import { PaymentSettingsTab } from '../../components/admin/settings/tabs/PaymentSettingsTab';
import { AdminAndOwnerTab } from '../../components/admin/settings/tabs/AdminAndOwnerTab';
import { DeploymentAndAdvancedTab } from '../../components/admin/settings/tabs/DeploymentAndAdvancedTab';
import { ConfirmModal } from '../../components/common/ConfirmModal';

// Icons
import {
  Settings,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';

export type MainTabKey =
  | 'general'
  | 'stores'
  | 'checkout'
  | 'orders'
  | 'shipping'
  | 'payments'
  | 'adminOwner'
  | 'deployment';

/** Map raw tab parameter to canonical main tab and sub-tab parameter */
function resolveTabParam(rawParam: string | null): { mainTab: MainTabKey; subParam?: string } {
  if (!rawParam) return { mainTab: 'general' };

  switch (rawParam) {
    case 'general':
      return { mainTab: 'general' };

    case 'stores':
    case 'productAddons':
    case 'customerTiers':
      return { mainTab: 'stores', subParam: rawParam };

    case 'checkout':
    case 'accessories':
      return { mainTab: 'checkout', subParam: rawParam };

    case 'orders':
    case 'orderTimeline':
      return { mainTab: 'orders', subParam: rawParam };

    case 'shipping':
      return { mainTab: 'shipping' };

    case 'payments':
      return { mainTab: 'payments' };

    case 'adminOwner':
    case 'adminVisibility':
    case 'owner':
    case 'security':
    case 'roles':
    case 'activity':
      return { mainTab: 'adminOwner', subParam: rawParam };

    case 'deployment':
    case 'systemConfig':
    case 'notifications':
      return { mainTab: 'deployment', subParam: rawParam };

    default:
      return { mainTab: 'general' };
  }
}

export const AdminSettingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [settings, setSettings] = useState<SystemSettings>(() => systemSettingsService.getSettings());

  const rawTab = searchParams.get('tab');
  const { mainTab: resolvedTab, subParam } = resolveTabParam(rawTab);

  const [activeTab, setActiveTab] = useState<MainTabKey>(resolvedTab);
  const [activeSubParam, setActiveSubParam] = useState<string | undefined>(subParam);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const raw = searchParams.get('tab');
    const { mainTab, subParam } = resolveTabParam(raw);
    setActiveTab(mainTab);
    setActiveSubParam(subParam);
  }, [searchParams]);

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [isResetDefaultsConfirmOpen, setIsResetDefaultsConfirmOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = systemSettingsService.subscribe((latest) => {
      if (!isDirty) {
        setSettings(latest);
      }
    });
    return () => unsubscribe();
  }, [isDirty]);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const validateSettings = (systemSettings: SystemSettings): Record<string, string> => {
    const errors: Record<string, string> = {};
    const g = systemSettings.general;

    if (!g.websiteName || !g.websiteName.trim()) {
      errors.websiteName = 'Website Title Name is required.';
    } else if (g.websiteName.length > 120) {
      errors.websiteName = 'Website Title must be 120 characters or less.';
    }

    if (!g.brandName || !g.brandName.trim()) {
      errors.brandName = 'Brand Identifier is required.';
    } else if (g.brandName.length > 50) {
      errors.brandName = 'Brand Identifier must be 50 characters or less.';
    }

    const rate = Number(g.usdToPhpExchangeRate);
    if (isNaN(rate) || rate <= 0) {
      errors.usdToPhpExchangeRate = 'USD to PHP exchange rate must be a valid number greater than 0.';
    }

    return errors;
  };

  const handleUpdate = (updated: SystemSettings) => {
    setSettings(updated);
    setIsDirty(true);
    setSaveSuccess(false);
    setValidationErrors(validateSettings(updated));
  };

  const handleSaveChanges = () => {
    const errs = validateSettings(settings);
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      showToast('error', 'Please resolve form validation errors before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const saved = systemSettingsService.saveSettings(settings);
      setSettings(saved);
      setIsDirty(false);
      setIsSaving(false);
      setSaveSuccess(true);
      setValidationErrors({});
      showToast('success', 'System Settings saved successfully!');
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      setIsSaving(false);
      const msg = err instanceof Error ? err.message : 'Unknown error saving settings';
      showToast('error', `Failed to save settings: ${msg}`);
    }
  };

  const handleDiscardChanges = () => {
    const resetToSaved = systemSettingsService.getSettings();
    setSettings(resetToSaved);
    setIsDirty(false);
    showToast('info', 'Unsaved changes discarded.');
  };

  const handleResetDefaults = () => {
    setIsResetDefaultsConfirmOpen(true);
  };

  const confirmResetDefaults = () => {
    const defaults = systemSettingsService.resetDefaults();
    setSettings(defaults);
    setIsDirty(false);
    showToast('success', 'System Settings reset to factory defaults.');
    setIsResetDefaultsConfirmOpen(false);
  };

  const handleExportJSON = () => {
    systemSettingsService.exportSettings();
    showToast('success', 'Settings configuration exported to JSON file.');
  };

  const handleImportSubmit = () => {
    setImportError(null);
    if (!importJsonText.trim()) {
      setImportError('Please paste valid System Settings JSON text.');
      return;
    }

    const res = systemSettingsService.importSettings(importJsonText);
    if (res.success) {
      setSettings(systemSettingsService.getSettings());
      setIsDirty(false);
      setIsImportModalOpen(false);
      setImportJsonText('');
      showToast('success', 'System Settings imported successfully from JSON!');
    } else {
      setImportError(res.error || 'Failed to parse JSON.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Banner */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-xl border shadow-2xl flex items-center space-x-3 text-xs font-bold animate-fadeIn ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : toastMessage.type === 'error'
              ? 'bg-red-950/90 border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              : 'bg-cyan-950/90 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.3)]'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle size={18} />
          ) : toastMessage.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <Settings size={18} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Module Header */}
      <div className="glass-card p-6 border border-white/10 rounded-2xl bg-gradient-to-r from-[#0A0F1D] via-[#050810] to-[#0A0F1D] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/20 border border-[#00D9FF]/50 flex items-center justify-center text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.3)]">
              <Settings size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide font-mono">
                System Settings <span className="text-[#00D9FF] text-xs font-mono">V2.0</span>
              </h1>
              <p className="text-xs text-slate-400">
                Centralized configuration for GKN business rules, checkout, orders, security, and administration.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Export settings to downloadable JSON"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Import settings from JSON string"
          >
            <Upload size={14} />
            <span>Import</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Reset settings to factory defaults"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={!isDirty || isSaving || Object.keys(validationErrors).length > 0}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : isDirty && Object.keys(validationErrors).length === 0 && !isSaving
                ? 'bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-white shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:brightness-110'
                : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle size={15} />
                <span>Saved ✓</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>{isDirty ? 'Save Settings (Unsaved)' : 'Save Settings'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Settings Content Area - Expanded Full Width */}
      <div className="w-full space-y-6">
        {activeTab === 'general' && (
          <GeneralSettingsTab
            settings={settings.general}
            onChange={(updated) => handleUpdate({ ...settings, general: updated })}
            errors={validationErrors}
          />
        )}

        {activeTab === 'stores' && (
          <StoresAndProductsTab
            settings={settings.stores}
            onChange={(updated) => handleUpdate({ ...settings, stores: updated })}
            orderSettings={settings.orders}
            onChangeOrders={(updated) => handleUpdate({ ...settings, orders: updated })}
            subTabParam={activeSubParam}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutAndFeesTab
            orderSettings={settings.orders}
            shippingSettings={settings.shipping}
            onChangeOrders={(updated) => handleUpdate({ ...settings, orders: updated })}
            onChangeShipping={(updated) => handleUpdate({ ...settings, shipping: updated })}
            subTabParam={activeSubParam}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersAndTimelinesTab
            settings={settings.orders}
            onChange={(updated) => handleUpdate({ ...settings, orders: updated })}
            subTabParam={activeSubParam}
          />
        )}

        {activeTab === 'shipping' && (
          <ShippingSettingsTab
            settings={settings.shipping}
            onChange={(updated) => handleUpdate({ ...settings, shipping: updated })}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentSettingsTab
            settings={settings.payments}
            onChange={(updated) => handleUpdate({ ...settings, payments: updated })}
          />
        )}

        {activeTab === 'adminOwner' && (
          <AdminAndOwnerTab
            adminVisibility={settings.adminVisibility}
            owner={settings.owner}
            security={settings.security}
            onUpdateAdminVisibility={(updated) => handleUpdate({ ...settings, adminVisibility: updated })}
            onUpdateOwner={(updated) => handleUpdate({ ...settings, owner: updated })}
            onUpdateSecurity={(updated) => handleUpdate({ ...settings, security: updated })}
            subTabParam={activeSubParam}
          />
        )}

        {activeTab === 'deployment' && (
          <DeploymentAndAdvancedTab
            deployment={settings.deployment}
            subTabParam={activeSubParam}
          />
        )}
      </div>

      {/* Sticky Bottom Save Changes Banner */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 max-w-xl w-[90%] p-4 rounded-2xl glass-card bg-[#0A0F1D]/95 border border-[#00D9FF]/50 shadow-[0_0_30px_rgba(0,217,255,0.3)] flex items-center justify-between gap-4 animate-bounce-short">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-[#00D9FF] animate-ping" />
            <span className="text-xs font-bold text-white font-mono">
              Unsaved System Settings Changes Detected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDiscardChanges}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-white font-bold text-xs shadow-[0_0_15px_rgba(0,217,255,0.4)] hover:brightness-110 cursor-pointer"
            >
              Save Now
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-card bg-[#0A0F1D] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Upload size={18} className="text-[#00D9FF]" />
                <span>Import System Settings JSON</span>
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste a valid SystemSettings JSON object exported from GKN.
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON configuration text here..."
              className="w-full bg-[#050810] border border-white/10 text-white font-mono text-xs p-3 rounded-xl focus:outline-none focus:border-[#00D9FF]"
            />

            {importError && (
              <p className="text-xs text-red-400 font-mono bg-red-950/50 p-2 rounded-lg border border-red-500/30">
                {importError}
              </p>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 rounded-lg bg-[#00D9FF] text-black font-bold text-xs hover:brightness-110 cursor-pointer"
              >
                Apply Imported JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Defaults Confirm Modal */}
      <ConfirmModal
        isOpen={isResetDefaultsConfirmOpen}
        onClose={() => setIsResetDefaultsConfirmOpen(false)}
        onConfirm={confirmResetDefaults}
        title="Reset System Settings"
        message="Are you sure you want to reset all System Settings to factory defaults? All store preferences and system toggles will be restored to original values."
        confirmText="Reset to Defaults"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
};

