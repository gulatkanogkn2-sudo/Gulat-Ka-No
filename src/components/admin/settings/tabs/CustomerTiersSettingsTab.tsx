import React, { useState } from 'react';
import { CustomerTierSettings, CustomerTierConfig } from '../../../../types/customerTier';
import { CustomerTierService } from '../../../../services/customerTierService';
import { CustomerManagementService } from '../../../../services/customerManagementService';
import { SettingCard } from '../common/SettingCard';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { TierModal } from './TierModal';
import { ConfirmModal } from '../../../common/ConfirmModal';
import {
  Award,
  ShieldAlert,
  CheckCircle2,
  RotateCw,
  Plus,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export const CustomerTiersSettingsTab: React.FC = () => {
  const [tierSettings, setTierSettings] = useState<CustomerTierSettings>(() =>
    CustomerTierService.getTierSettings()
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalcSummary, setRecalcSummary] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<CustomerTierConfig | null>(null);

  // Disable / Enable confirm state
  const [toggleConfirmTier, setToggleConfirmTier] = useState<{
    tier: CustomerTierConfig;
    targetState: boolean;
  } | null>(null);

  const handleToggleGlobal = (enabled: boolean) => {
    const current = CustomerTierService.getTierSettings();
    const updated: CustomerTierSettings = {
      ...current,
      enabled,
    };
    setTierSettings(updated);
    CustomerTierService.saveTierSettings(updated);
  };

  const handleToggleAutoRecalc = (autoRecalculateOnOrderChange: boolean) => {
    const current = CustomerTierService.getTierSettings();
    const updated: CustomerTierSettings = {
      ...current,
      autoRecalculateOnOrderChange,
    };
    setTierSettings(updated);
    CustomerTierService.saveTierSettings(updated);
  };

  const handleSaveTier = (savedTier: CustomerTierConfig) => {
    const existingIndex = tierSettings.tiers.findIndex(
      (t) => CustomerTierService.normalizeTierId(t.id) === CustomerTierService.normalizeTierId(savedTier.id)
    );

    let updatedTiers: CustomerTierConfig[];
    if (existingIndex >= 0) {
      // Update existing tier
      updatedTiers = [...tierSettings.tiers];
      updatedTiers[existingIndex] = savedTier;
    } else {
      // Add new tier
      updatedTiers = [...tierSettings.tiers, savedTier];
    }

    const updated: CustomerTierSettings = {
      ...tierSettings,
      tiers: updatedTiers,
    };

    setTierSettings(updated);
    CustomerTierService.saveTierSettings(updated);
    CustomerManagementService.recalculateAllCustomerTiers();

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleConfirmToggleActive = () => {
    if (!toggleConfirmTier) return;
    const { tier, targetState } = toggleConfirmTier;

    const updatedTiers = tierSettings.tiers.map((t) =>
      CustomerTierService.normalizeTierId(t.id) === CustomerTierService.normalizeTierId(tier.id)
        ? { ...t, isActive: targetState }
        : t
    );

    const updated: CustomerTierSettings = {
      ...tierSettings,
      tiers: updatedTiers,
    };

    setTierSettings(updated);
    CustomerTierService.saveTierSettings(updated);
    CustomerManagementService.recalculateAllCustomerTiers();
    setToggleConfirmTier(null);
  };

  const handleRecalculateAll = async () => {
    setIsRecalculating(true);
    setRecalcSummary(null);
    try {
      CustomerTierService.saveTierSettings(tierSettings);
      const updatedCount = await CustomerManagementService.recalculateAllCustomerTiers();
      setRecalcSummary(
        `Recalculation complete. ${updatedCount} customer account tiers updated based on lifetime qualifying spend.`
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to recalculate tiers:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  // Sort tiers ascending by minimum spend threshold for clean display
  const sortedTiers = [...tierSettings.tiers].sort(
    (a, b) => (a.minLifetimeSpendPhp || 0) - (b.minLifetimeSpendPhp || 0)
  );

  return (
    <div className="space-y-6">
      {/* Save / Status Toast */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Tier rules saved and customer directory synchronized successfully.</span>
          </div>
          {recalcSummary && <span className="text-[11px] text-emerald-400 font-bold">{recalcSummary}</span>}
        </div>
      )}

      {/* Global Tier Settings */}
      <SettingCard
        title="Customer Tier Automation & Engine"
        description="Enable automatic customer tier assignment based on qualifying lifetime spending in PHP (₱). Excludes cancelled or refunded orders."
        icon={<Award size={18} className="text-cyan-400" />}
      >
        <div className="space-y-4">
          <ToggleSwitch
            label="Enable Customer Tier Engine"
            checked={tierSettings.enabled}
            onChange={handleToggleGlobal}
            helperText="When enabled, customer accounts qualify for tiered benefits automatically upon reaching spending thresholds."
          />

          <ToggleSwitch
            label="Automatic Recalculation on Order Finalization"
            checked={tierSettings.autoRecalculateOnOrderChange}
            onChange={handleToggleAutoRecalc}
            helperText="Automatically re-evaluate customer tier whenever a new order is marked as paid or completed."
          />

          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-200 font-mono block">Recalculate All Customer Accounts</span>
              <span className="text-[11px] text-slate-400 font-mono">
                Re-evaluates every registered customer against current spending thresholds.
              </span>
            </div>
            <button
              onClick={handleRecalculateAll}
              disabled={isRecalculating || !tierSettings.enabled}
              className="px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
            >
              <RotateCw size={14} className={isRecalculating ? 'animate-spin' : ''} />
              <span>{isRecalculating ? 'Recalculating...' : 'Recalculate Directory'}</span>
            </button>
          </div>
        </div>
      </SettingCard>

      {/* Tier Configuration Table & Add Tier Action */}
      <SettingCard
        title="Configurable Tier Levels & Spending Requirements (PHP ₱)"
        description="Define customer tiers, qualification spending thresholds, discount incentives, and badge colors."
        icon={<Award size={18} className="text-cyan-400" />}
      >
        <div className="space-y-4">
          {/* Header Action Button */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-white font-mono">
                Configured Tiers ({sortedTiers.length})
              </span>
              <span className="text-[11px] text-slate-400 font-mono block">
                Tiers are evaluated from highest spending threshold to lowest.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingTier(null);
                setIsModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:brightness-110 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Custom Tier</span>
            </button>
          </div>

          {/* Tier Cards Grid */}
          <div className="space-y-3">
            {sortedTiers.map((tier, idx) => {
              const isBaseTier = tier.id === 'STANDARD' || tier.minLifetimeSpendPhp === 0;

              return (
                <div
                  key={tier.id}
                  className={`p-4 rounded-xl border transition-all ${
                    tier.isActive
                      ? 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Tier Info Left */}
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-cyan-400 shrink-0">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-xs font-bold font-mono text-white">
                            {tier.name}
                          </h5>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${tier.badgeColor || 'border-slate-700 bg-slate-800 text-slate-300'}`}>
                            {tier.id}
                          </span>
                          {!tier.isActive && (
                            <span className="px-1.5 py-0.2 bg-red-950/80 text-red-400 border border-red-500/40 rounded text-[9px] font-mono font-bold">
                              DISABLED
                            </span>
                          )}
                          {tier.isAutoAssignment && !tier.isManualOnly ? (
                            <span className="px-1.5 py-0.2 bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 rounded text-[9px] font-mono">
                              AUTO
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 bg-amber-950/60 text-amber-300 border border-amber-500/30 rounded text-[9px] font-mono">
                              MANUAL ONLY
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {tier.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    {/* Spend & Discount Metrics */}
                    <div className="flex items-center gap-4 sm:gap-6 self-start md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">
                          Qualifying Spend
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          ₱{(tier.minLifetimeSpendPhp || 0).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">
                          Discount Rate
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {tier.discountPercent ? `${tier.discountPercent}%` : '0%'}
                        </span>
                      </div>

                      {/* Action Tools */}
                      <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTier(tier);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00D9FF] border border-white/10 transition-colors cursor-pointer"
                          title={`Edit ${tier.name}`}
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setToggleConfirmTier({
                              tier,
                              targetState: !tier.isActive,
                            })
                          }
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            tier.isActive
                              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 hover:bg-red-950/30 hover:text-red-400 hover:border-red-500/30'
                              : 'bg-red-950/30 text-red-400 border-red-500/30 hover:bg-emerald-950/30 hover:text-emerald-400 hover:border-emerald-500/30'
                          }`}
                          title={tier.isActive ? 'Disable Tier' : 'Enable Tier'}
                        >
                          {tier.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SettingCard>

      {/* Rules Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
          <ShieldAlert size={15} className="text-amber-400" />
          <span>Customer Tier Integrity & Security Rules</span>
        </h4>
        <ul className="text-[11px] font-mono text-slate-400 space-y-1 list-disc list-inside">
          <li>
            Customer tiers are strictly commercial loyalty designations and NEVER grant staff, admin, or owner system authorization.
          </li>
          <li>
            Reserved role identifiers (OWNER, ADMIN, STAFF, CUSTOMER) cannot be used as customer tier names.
          </li>
          <li>
            Disabling a tier prevents new auto-assignments to that tier while preserving existing customer records safely.
          </li>
          <li>
            Manual tier overrides set on specific customer profiles are preserved and will not be overwritten by automatic spending recalculation engines.
          </li>
        </ul>
      </div>

      {/* Add / Edit Tier Modal */}
      <TierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTier(null);
        }}
        onSave={handleSaveTier}
        initialTier={editingTier}
        existingTierIds={tierSettings.tiers.map((t) => t.id)}
      />

      {/* Disable / Enable Confirmation Modal */}
      <ConfirmModal
        isOpen={!!toggleConfirmTier}
        title={
          toggleConfirmTier?.targetState
            ? `Enable Tier: ${toggleConfirmTier?.tier.name}?`
            : `Disable Tier: ${toggleConfirmTier?.tier.name}?`
        }
        message={
          toggleConfirmTier?.targetState
            ? `Enabling "${toggleConfirmTier?.tier.name}" will allow customers to be automatically assigned to this tier upon reaching ₱${(
                toggleConfirmTier?.tier.minLifetimeSpendPhp || 0
              ).toLocaleString()} in qualifying purchases.`
            : `Disabling "${toggleConfirmTier?.tier.name}" will prevent automatic promotion of customer accounts to this tier. Existing customers in this tier will retain their tier until manually changed.`
        }
        confirmText={toggleConfirmTier?.targetState ? 'Enable Tier' : 'Disable Tier'}
        confirmVariant={toggleConfirmTier?.targetState ? 'success' : 'danger'}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => setToggleConfirmTier(null)}
      />
    </div>
  );
};
