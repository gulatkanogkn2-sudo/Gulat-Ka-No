import React, { useState, useEffect } from 'react';
import { CustomerTierSettings, CustomerTierConfig } from '../../../../types/customerTier';
import { CustomerTierService } from '../../../../services/customerTierService';
import { CustomerManagementService } from '../../../../services/customerManagementService';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { Crown, RefreshCw, Save, ShieldAlert, Award, CheckCircle, Lock } from 'lucide-react';

export const CustomerTiersSettingsTab: React.FC = () => {
  const [tierSettings, setTierSettings] = useState<CustomerTierSettings>(() =>
    CustomerTierService.getTierSettings()
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const current = CustomerTierService.getTierSettings();
    setTierSettings(current);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGlobalToggle = (enabled: boolean) => {
    const updated = { ...tierSettings, enabled };
    setTierSettings(updated);
    CustomerTierService.saveTierSettings(updated);
    showToast(`Automatic customer tier calculation ${enabled ? 'ENABLED' : 'DISABLED'}.`);
  };

  const handleTierChange = (index: number, updates: Partial<CustomerTierConfig>) => {
    const newTiers = [...tierSettings.tiers];
    newTiers[index] = {
      ...newTiers[index],
      ...updates,
    };
    setTierSettings({
      ...tierSettings,
      tiers: newTiers,
    });
  };

  const handleSaveSettings = () => {
    CustomerTierService.saveTierSettings(tierSettings);
    // Automatically recalculate tiers with new thresholds
    CustomerManagementService.recalculateAllCustomerTiers();
    showToast('Customer tier configurations saved and customer directory recalculated successfully!');
  };

  const handleManualSyncAll = async () => {
    setIsSyncing(true);
    try {
      CustomerTierService.saveTierSettings(tierSettings);
      const updatedCount = await CustomerManagementService.recalculateAllCustomerTiers();
      showToast(`Tier sync complete! Evaluated ${updatedCount} customer records against current thresholds.`);
    } catch (err) {
      console.error('Failed to sync customer tiers:', err);
      showToast('Error syncing customer tiers.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Overview & Controls Header Card */}
      <SettingCard
        title="Automatic Customer Tier Thresholds & Engine"
        description="Configure purchase threshold levels in PHP (₱) required to automatically promote customer accounts. The tier engine evaluates qualifying finalized orders dynamically."
        icon={<Crown size={18} className="text-amber-400" />}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>Automatic Tier Progression Engine</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    tierSettings.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {tierSettings.enabled ? 'ACTIVE' : 'DISABLED'}
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                When enabled, customers are automatically promoted as their lifetime qualifying purchase spending reaches configured thresholds.
              </p>
            </div>

            <ToggleSwitch
              checked={tierSettings.enabled}
              onChange={handleGlobalToggle}
              label="Enable Auto-Tier Engine"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleManualSyncAll}
              disabled={isSyncing}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Evaluating Tiers...' : 'Sync & Recalculate All Customer Tiers'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>Save Tier Settings</span>
            </button>
          </div>
        </div>
      </SettingCard>

      {/* Tier Configuration List */}
      <SettingCard
        title="Configurable Tier Levels & Spending Requirements (PHP ₱)"
        description="Set minimum lifetime qualifying spending required for each tier. Spending is calculated strictly from finalized/paid orders."
        icon={<Award size={18} className="text-cyan-400" />}
      >
        <div className="space-y-4">
          {tierSettings.tiers.map((tier, idx) => {
            const isOwner = tier.id === 'OWNER';

            return (
              <div
                key={tier.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-cyan-400">
                      #{idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold font-mono text-white flex items-center gap-2">
                        <span>{tier.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase">({tier.id})</span>
                      </h5>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{tier.description}</p>
                    </div>
                  </div>

                  {isOwner ? (
                    <div className="px-3 py-1 rounded-lg bg-pink-950/50 border border-pink-500/30 text-pink-300 text-[11px] font-mono flex items-center gap-1.5 shrink-0">
                      <Lock size={12} />
                      <span>MANUAL ASSIGNMENT ONLY</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <ToggleSwitch
                        checked={tier.isActive}
                        onChange={(val) => handleTierChange(idx, { isActive: val })}
                        label="Tier Active"
                      />
                      <ToggleSwitch
                        checked={tier.isAutoAssignment}
                        onChange={(val) => handleTierChange(idx, { isAutoAssignment: val })}
                        label="Auto Assignment"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SettingInput
                    label="Tier Display Name"
                    value={tier.name}
                    onChange={(val) => handleTierChange(idx, { name: val })}
                    helperText="Customer-facing label rendered on badges, invoices, and profile headers."
                    exampleText="Gold Tier Researcher"
                  />

                  {isOwner ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Minimum Qualifying Spending (PHP ₱)
                      </label>
                      <div className="h-10 px-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-500 font-mono text-xs flex items-center gap-2">
                        <Lock size={14} className="text-pink-400" />
                        <span>Owner tier is not threshold-based (Manual Admin Assignment)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Owner accounts are designated explicitly by administrative choice.
                      </p>
                    </div>
                  ) : (
                    <SettingInput
                      label="Minimum Lifetime Qualifying Spend (PHP ₱)"
                      type="number"
                      min="0"
                      value={tier.minLifetimeSpendPhp}
                      onChange={(val) =>
                        handleTierChange(idx, {
                          minLifetimeSpendPhp: val === '' ? 0 : Math.max(0, isNaN(Number(val)) ? 0 : Number(val)),
                        })
                      }
                      helperText="Total finalized PHP order volume required for automatic promotion."
                      exampleText="50000"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SettingCard>

      {/* Rules Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
          <ShieldAlert size={15} className="text-amber-400" />
          <span>Qualifying Spending & Tier Calculation Rules</span>
        </h4>
        <ul className="text-[11px] font-mono text-slate-400 space-y-1 list-disc list-inside">
          <li>Order status must be finalized and paid to count towards qualifying lifetime spending.</li>
          <li>Cancelled, rejected, unpaid, or refunded orders are automatically excluded.</li>
          <li>
            Manual tier overrides set by administrators will remain intact and will not be overwritten by automatic recalculations.
          </li>
          <li>
            The OWNER tier is strictly reserved for manual admin assignment and is excluded from automatic spending triggers.
          </li>
        </ul>
      </div>
    </div>
  );
};
