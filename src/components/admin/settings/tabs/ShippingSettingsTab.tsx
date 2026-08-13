import React, { useState } from 'react';
import {
  ShippingSettings,
  ConfigurableShippingMethod,
  ConfigurableAdditionalFee,
  QuantityTierRule,
  RegionalRate,
  ShippingCalculationType,
  FeeCalculationType,
} from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { SettingSelect } from '../common/SettingSelect';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { ShippingFeeEngine } from '../../../../services/shippingFeeEngine';
import { formatPhpAmount, formatUsdAmount } from '../../../../utils/currencyUtils';
import {
  Truck,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  Calculator,
  Info,
  DollarSign,
  Package,
  CheckCircle2,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Box,
  Globe,
} from 'lucide-react';

export interface ShippingSettingsTabProps {
  settings: ShippingSettings;
  onChange: (updated: ShippingSettings) => void;
}

export const ShippingSettingsTab: React.FC<ShippingSettingsTabProps> = ({ settings, onChange }) => {
  // Editing state for Shipping Method Modal/Form
  const [editingMethod, setEditingMethod] = useState<ConfigurableShippingMethod | null>(null);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);

  // Editing state for Additional / Custom Fee Modal/Form
  const [editingFee, setEditingFee] = useState<ConfigurableAdditionalFee | null>(null);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

  // Filtering & tier unit calculation state
  const [activeStoreFilter, setActiveStoreFilter] = useState<'all' | 'groupbuy' | 'onhand' | 'moq'>('all');
  const [tierUnit, setTierUnit] = useState<'vials' | 'kits'>('vials');

  // Preview Calculator state
  const [previewStore, setPreviewStore] = useState<'groupbuy' | 'onhand' | 'moq'>('groupbuy');
  const [previewKits, setPreviewKits] = useState<number>(2);
  const [previewVials, setPreviewVials] = useState<number>(5);
  const [previewSubtotalPhp, setPreviewSubtotalPhp] = useState<number>(5000);
  const [previewSelectedMethodId, setPreviewSelectedMethodId] = useState<string>('');
  const [previewRegion, setPreviewRegion] = useState<string>('Luzon');

  // Update root settings helper
  const handleUpdate = (updates: Partial<ShippingSettings>) => {
    onChange({
      ...settings,
      ...updates,
    });
  };

  // --- VIAL UNIT CONFIG HANDLER ---
  const handleVialsPerKitChange = (val: number) => {
    const vialsPerKit = Math.max(1, Math.floor(val || 10));
    handleUpdate({
      vialUnitConfig: {
        ...settings.vialUnitConfig,
        vialsPerKit,
      },
    });
  };

  // --- SHIPPING METHODS CRUD ---
  const handleToggleMethod = (id: string, enabled: boolean) => {
    const updatedMethods = settings.methods.map((m) => (m.id === id ? { ...m, enabled } : m));
    handleUpdate({ methods: updatedMethods });
  };

  const handleDeleteMethod = (id: string) => {
    if (settings.methods.length <= 1) return;
    const updatedMethods = settings.methods.filter((m) => m.id !== id);
    handleUpdate({ methods: updatedMethods });
  };

  const handleMoveMethod = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= settings.methods.length) return;

    const list = [...settings.methods];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // re-assign display orders
    const reordered = list.map((m, idx) => ({ ...m, displayOrder: idx + 1 }));
    handleUpdate({ methods: reordered });
  };

  const handleOpenNewMethodModal = () => {
    setEditingMethod({
      id: `method_${Date.now()}`,
      name: 'New Shipping Method',
      description: 'Standard insured order dispatch.',
      enabled: true,
      displayOrder: settings.methods.length + 1,
      availableStores: ['all'],
      calculationType: 'fixed',
      baseFee: 150,
      minOrderAmount: 0,
      minQuantity: 0,
      tieredRules: [
        { id: `t_${Date.now()}_1`, minQty: 1, maxQty: 10, fee: 150 },
        { id: `t_${Date.now()}_2`, minQty: 11, maxQty: 20, fee: 250 },
      ],
      baseIncludedQty: 10,
      additionalPerVialFee: 10,
    });
    setIsMethodModalOpen(true);
  };

  const handleOpenEditMethodModal = (method: ConfigurableShippingMethod) => {
    setEditingMethod({ ...method });
    setIsMethodModalOpen(true);
  };

  const handleSaveMethod = () => {
    if (!editingMethod) return;

    const existingIdx = settings.methods.findIndex((m) => m.id === editingMethod.id);
    let updated: ConfigurableShippingMethod[];

    if (existingIdx >= 0) {
      updated = settings.methods.map((m) => (m.id === editingMethod.id ? editingMethod : m));
    } else {
      updated = [...settings.methods, editingMethod];
    }

    handleUpdate({ methods: updated });
    setIsMethodModalOpen(false);
    setEditingMethod(null);
  };

  // --- ADDITIONAL & CUSTOM FEES CRUD ---
  const handleToggleFee = (id: string, enabled: boolean) => {
    const updatedFees = settings.additionalFees.map((f) => (f.id === id ? { ...f, enabled } : f));
    handleUpdate({ additionalFees: updatedFees });
  };

  const handleDeleteFee = (id: string) => {
    const updatedFees = settings.additionalFees.filter((f) => f.id !== id);
    handleUpdate({ additionalFees: updatedFees });
  };

  const handleOpenNewFeeModal = () => {
    setEditingFee({
      id: `fee_${Date.now()}`,
      name: 'Custom Service Fee',
      displayName: 'Custom Packaging & Service Surcharge',
      description: 'Special handling and custom service allocation fee.',
      enabled: true,
      type: 'custom_fee',
      calculationType: 'fixed',
      amount: 50,
      availableStores: ['all'],
      tieredRules: [
        { id: `ft_${Date.now()}_1`, minQty: 1, maxQty: 10, fee: 50 },
        { id: `ft_${Date.now()}_2`, minQty: 11, maxQty: 20, fee: 100 },
      ],
      baseIncludedQty: 10,
      additionalPerVialFee: 5,
    });
    setIsFeeModalOpen(true);
  };

  const handleOpenEditFeeModal = (fee: ConfigurableAdditionalFee) => {
    setEditingFee({ ...fee });
    setIsFeeModalOpen(true);
  };

  const handleSaveFee = () => {
    if (!editingFee) return;

    const existingIdx = settings.additionalFees.findIndex((f) => f.id === editingFee.id);
    let updated: ConfigurableAdditionalFee[];

    if (existingIdx >= 0) {
      updated = settings.additionalFees.map((f) => (f.id === editingFee.id ? editingFee : f));
    } else {
      updated = [...settings.additionalFees, editingFee];
    }

    handleUpdate({ additionalFees: updated });
    setIsFeeModalOpen(false);
    setEditingFee(null);
  };

  // Filter methods and fees for display
  const filteredMethods = settings.methods.filter(
    (m) => activeStoreFilter === 'all' || m.availableStores.includes('all') || m.availableStores.includes(activeStoreFilter)
  );

  const filteredFees = settings.additionalFees.filter(
    (f) => activeStoreFilter === 'all' || f.availableStores.includes('all') || f.availableStores.includes(activeStoreFilter)
  );

  // Preview Calculation
  const previewCalculation = ShippingFeeEngine.calculateOrderTotals({
    storeType: previewStore,
    items: [
      { name: 'Research Kit', variantLabel: 'Kit', quantity: previewKits, price: 0, priceInPhp: 0 },
      { name: 'Research Vial', variantLabel: 'Vial', quantity: previewVials, price: 0, priceInPhp: 0 },
    ],
    selectedMethodId: previewSelectedMethodId || undefined,
    shippingRegion: previewRegion,
    settings,
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header Summary Banner */}
      <div className="p-5 rounded-2xl bg-[#070B14] border border-[#00D9FF]/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-lg font-black text-white uppercase tracking-wider font-mono">
              Shipping & Fees Manager
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-[10px] font-mono font-bold uppercase">
              Vial-Equivalent Logic
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Configure order shipping methods, quantity-based tier rules, administrative surcharges, and international procurement pass-through fees.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleOpenNewMethodModal}
            className="px-3.5 py-2 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shipping Method</span>
          </button>
          <button
            type="button"
            onClick={handleOpenNewFeeModal}
            className="px-3.5 py-2 rounded-xl bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Additional Fee</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: QUANTITY UNIT & CONVERSION RULES */}
      <SettingCard
        title="Product Unit Conversion Rule (Vials & Kits)"
        description="Defines the conversion factor used by the shipping engine to calculate vial-equivalent quantities."
        icon={<Box className="w-4 h-4 text-cyan-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <SettingInput
              label="1 Kit = Vial Equivalent Conversion"
              type="number"
              value={settings.vialUnitConfig?.vialsPerKit || 10}
              onChange={(val) => handleVialsPerKitChange(parseFloat(val) || 10)}
              helperText="Default standard: 1 Kit = 10 Vials. Shipping calculations automatically multiply Kit orders by this ratio."
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2 font-mono text-xs">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block tracking-wider">
              Automatic Quantity Conversion Examples:
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li className="flex items-center justify-between border-b border-white/5 pb-1">
                <span>2 Kits:</span>
                <span className="font-bold text-white">2 × {settings.vialUnitConfig?.vialsPerKit || 10} = 20 Vials</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/5 pb-1">
                <span>1 Kit + 5 Vials:</span>
                <span className="font-bold text-white">10 + 5 = 15 Vials</span>
              </li>
              <li className="flex items-center justify-between">
                <span>3 Kits + 7 Vials:</span>
                <span className="font-bold text-white">30 + 7 = 37 Vials</span>
              </li>
            </ul>
          </div>
        </div>
      </SettingCard>

      {/* Filter Bar for Methods & Fees */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">Filter View by Store:</span>
          {(['all', 'groupbuy', 'onhand', 'moq'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setActiveStoreFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeStoreFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {st === 'all' ? 'All Stores' : st.toUpperCase()}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredMethods.length} Methods, {filteredFees.length} Fees
        </span>
      </div>

      {/* SECTION 2: SHIPPING METHODS */}
      <SettingCard
        title="Shipping Methods & Quantity Rules"
        description="Configure available delivery methods, base rates, and tier limits."
        icon={<Truck className="w-4 h-4 text-cyan-400" />}
      >
        <div className="space-y-4">
          {filteredMethods.length === 0 ? (
            <div className="p-6 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
              No shipping methods configured for this store view.
            </div>
          ) : (
            filteredMethods.map((method, idx) => (
              <div
                key={method.id}
                className={`p-4 rounded-2xl border transition-all ${
                  method.enabled
                    ? 'bg-slate-950/70 border-white/10 hover:border-cyan-500/30'
                    : 'bg-slate-950/30 border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-bold text-white font-mono">{method.name}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase">
                        {method.calculationType.replace('_', ' ')}
                      </span>
                      {method.availableStores.map((st) => (
                        <span key={st} className="px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 text-[9px] font-mono uppercase">
                          {st}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-400">{method.description}</p>

                    {/* Calculation Details Rule Badge */}
                    <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-slate-300 flex-wrap">
                      {method.calculationType === 'free' && (
                        <span className="text-emerald-400 font-bold">
                          Fee: ₱0 {method.minOrderAmount ? `(Subtotal ≥ ${formatPhpAmount(method.minOrderAmount)})` : ''}
                        </span>
                      )}
                      {method.calculationType === 'fixed' && (
                        <span>
                          Base Rate: <strong className="text-cyan-400">{formatPhpAmount(method.baseFee)}</strong>
                        </span>
                      )}
                      {method.calculationType === 'per_vial' && (
                        <span>
                          Rate: <strong className="text-cyan-400">{formatPhpAmount(method.baseFee)}</strong> / Vial Equivalent
                        </span>
                      )}
                      {method.calculationType === 'tiered_quantity' && (
                        <span className="flex items-center gap-1.5">
                          Tiers: {method.tieredRules?.map((t) => `${t.minQty}-${t.maxQty || '∞'}: ${formatPhpAmount(t.fee)}`).join(' | ')}
                        </span>
                      )}
                      {method.calculationType === 'base_additional' && (
                        <span>
                          Base: {formatPhpAmount(method.baseFee)} (First {method.baseIncludedQty || 0} vials) + {formatPhpAmount(method.additionalPerVialFee || 0)}/extra vial
                        </span>
                      )}
                      {method.calculationType === 'fixed_region' && (
                        <span className="flex items-center gap-1.5 flex-wrap">
                          Regional Rates: {method.regionalRates?.map((r) => `${r.regionName}: ${formatPhpAmount(r.fee)}`).join(' | ') || `Base: ${formatPhpAmount(method.baseFee)}`}
                        </span>
                      )}
                      {method.calculationType === 'regional_base_additional' && (
                        <span className="flex items-center gap-1.5 flex-wrap">
                          Regional Base + Extra Vial: {method.regionalRates?.map((r) => `${r.regionName}: ${formatPhpAmount(r.fee)} (${r.includedVials ?? 10} incl. / +${formatPhpAmount(r.additionalFeePerVial ?? 0)}/extra)`).join(' | ') || `Base: ${formatPhpAmount(method.baseFee)}`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <ToggleSwitch
                      checked={method.enabled}
                      onChange={(val) => handleToggleMethod(method.id, val)}
                      size="sm"
                    />

                    <button
                      type="button"
                      onClick={() => handleOpenEditMethodModal(method)}
                      className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Method"
                    >
                      <Edit2 size={15} />
                    </button>

                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveMethod(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMethod(idx, 'down')}
                        disabled={idx === filteredMethods.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    {settings.methods.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMethod(method.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Method"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SettingCard>

      {/* SECTION 3: ADDITIONAL & CUSTOM FEES */}
      <SettingCard
        title="Additional Fees & Custom Surcharges"
        description="Configure admin, handling, and international procurement costs passed to customer order checkout."
        icon={<DollarSign className="w-4 h-4 text-purple-400" />}
      >
        <div className="space-y-4">
          {filteredFees.length === 0 ? (
            <div className="p-6 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
              No additional fees configured for this store view.
            </div>
          ) : (
            filteredFees.map((fee) => (
              <div
                key={fee.id}
                className={`p-4 rounded-2xl border transition-all ${
                  fee.enabled
                    ? 'bg-slate-950/70 border-white/10 hover:border-purple-500/30'
                    : 'bg-slate-950/30 border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-bold text-white font-mono">{fee.name}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono font-bold uppercase">
                        {fee.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono italic">
                        (Display: "{fee.displayName}")
                      </span>
                      {fee.availableStores.map((st) => (
                        <span key={st} className="px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 text-[9px] font-mono uppercase">
                          {st}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-400">{fee.description}</p>

                    <div className="pt-1 text-[11px] font-mono text-purple-300">
                      Calculation Mode: <strong className="uppercase">{fee.calculationType.replace('_', ' ')}</strong> —{' '}
                      {fee.calculationType === 'percentage'
                        ? `${fee.amount}% of Order Subtotal`
                        : fee.calculationType === 'per_vial'
                        ? `${formatPhpAmount(fee.amount)} / Vial`
                        : fee.calculationType === 'per_kit'
                        ? `${formatPhpAmount(fee.amount)} / Kit`
                        : formatPhpAmount(fee.amount)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <ToggleSwitch
                      checked={fee.enabled}
                      onChange={(val) => handleToggleFee(fee.id, val)}
                      size="sm"
                    />

                    <button
                      type="button"
                      onClick={() => handleOpenEditFeeModal(fee)}
                      className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Fee"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFee(fee.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Fee"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SettingCard>

      {/* SECTION 4: INTERACTIVE CHECKOUT PREVIEW TOOL */}
      <SettingCard
        title="Interactive Checkout Total Calculation Simulator"
        description="Live preview tool to verify shipping fees and surcharge breakdowns for customer cart scenarios."
        icon={<Calculator className="w-4 h-4 text-emerald-400" />}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Store Context
              </label>
              <select
                value={previewStore}
                onChange={(e) => setPreviewStore(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="groupbuy">GroupBuy Store</option>
                <option value="onhand">OnHand Vault Store</option>
                <option value="moq">MOQ Custom Store</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Destination Region
              </label>
              <select
                value={previewRegion}
                onChange={(e) => setPreviewRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Luzon">Luzon</option>
                <option value="Visayas">Visayas</option>
                <option value="Mindanao">Mindanao</option>
                <option value="NCR">NCR / Metro Manila</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Ordered Kits Count
              </label>
              <input
                type="number"
                min="0"
                value={previewKits}
                onChange={(e) => setPreviewKits(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Ordered Vials Count
              </label>
              <input
                type="number"
                min="0"
                value={previewVials}
                onChange={(e) => setPreviewVials(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Cart Subtotal (₱)
              </label>
              <input
                type="number"
                min="0"
                value={previewSubtotalPhp}
                onChange={(e) => setPreviewSubtotalPhp(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Quantity Conversion Formula Display */}
          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">
                Calculated Vial-Equivalent Unit:
              </span>
            </div>
            <div className="text-cyan-300 font-bold bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
              {previewKits} Kits ({previewKits * (settings.vialUnitConfig?.vialsPerKit || 10)} Vials) + {previewVials} Vials ={' '}
              <span className="text-white underline">{previewCalculation.totalVials} Vial Equivalent Units</span>
            </div>
          </div>

          {/* Simulated Checkout Receipt */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3 font-mono text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Checkout Breakdown Simulation</span>
              <span>Primary PHP / Secondary USD</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span className="font-bold text-white">
                  {formatPhpAmount(previewSubtotalPhp)} <span className="text-slate-500 font-normal">({formatUsdAmount(previewCalculation.subtotalUsd)})</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-cyan-400">
                <span>Shipping ({previewCalculation.shippingMethodName}):</span>
                <span className="font-bold">
                  {previewCalculation.shippingFeePhp === 0 ? '₱0.00 (FREE)' : formatPhpAmount(previewCalculation.shippingFeePhp)}{' '}
                  <span className="text-cyan-500/70 font-normal">({formatUsdAmount(previewCalculation.shippingFeeUsd)})</span>
                </span>
              </div>

              {previewCalculation.appliedFees.map((fee) => (
                <div key={fee.feeId} className="flex justify-between items-center text-purple-300 pl-3 border-l-2 border-purple-500/30">
                  <span>{fee.displayName}:</span>
                  <span className="font-bold">
                    {formatPhpAmount(fee.amountPhp)} <span className="text-purple-400/70 font-normal">({formatUsdAmount(fee.amountUsd)})</span>
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                <span className="text-white">Calculated Grand Total:</span>
                <div className="text-right">
                  <span className="text-emerald-400 text-base block">{formatPhpAmount(previewCalculation.grandTotalPhp)}</span>
                  <span className="text-slate-400 text-xs font-normal">({formatUsdAmount(previewCalculation.grandTotalUsd)})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* --- MODAL FOR EDITING / CREATING SHIPPING METHOD --- */}
      {isMethodModalOpen && editingMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#090D16] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold font-mono text-white uppercase">
                  {settings.methods.some((m) => m.id === editingMethod.id) ? 'Edit Shipping Method' : 'Add Shipping Method'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMethodModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <SettingInput
                label="Method Display Name"
                value={editingMethod.name}
                onChange={(val) => setEditingMethod({ ...editingMethod, name: val })}
                helperText="Public shipping method title shown to buyers at checkout."
                exampleText="LBC Express Insured"
              />

              <SettingInput
                label="Method Description"
                value={editingMethod.description}
                onChange={(val) => setEditingMethod({ ...editingMethod, description: val })}
                helperText="Detailed explanation of carrier dispatch, tracking features, and timeline."
                exampleText="Standard nationwide insured lab courier with online tracking."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingSelect
                  label="Calculation Type"
                  value={editingMethod.calculationType}
                  onChange={(val) => setEditingMethod({ ...editingMethod, calculationType: val as ShippingCalculationType })}
                  options={[
                    { value: 'free', label: 'FREE (₱0 Fee)', description: 'No shipping fee charged' },
                    { value: 'fixed', label: 'FIXED Base Fee', description: 'Flat rate charged regardless of quantity' },
                    { value: 'fixed_region', label: 'FIXED RATE BY REGION', description: 'Configurable regional rates (e.g. Luzon, Visayas, Mindanao)' },
                    { value: 'regional_base_additional', label: 'REGIONAL BASE + ADDITIONAL VIAL', description: 'Fixed regional base rate with additional fee for vials exceeding included quantity' },
                    { value: 'per_vial', label: 'PER VIAL Rate', description: 'Fee multiplies by total vial count' },
                    { value: 'tiered_quantity', label: 'TIERED QUANTITY Ranges', description: 'Different fees apply to different quantity ranges' },
                    { value: 'base_additional', label: 'BASE + ADDITIONAL Quantity', description: 'Base fee for first X vials + rate per extra vial' },
                  ]}
                  helperText="Determines how the shipping fee is calculated for customer orders."
                  exampleText="Regional Base + Additional Vial"
                />

                <SettingInput
                  label="Base Fee"
                  type="number"
                  value={editingMethod.baseFee}
                  onChange={(val) => setEditingMethod({ ...editingMethod, baseFee: parseFloat(val) || 0 })}
                  helperText="Initial base shipping amount applied before quantity surcharges."
                  exampleText="150"
                  prefixText="₱"
                  suffixText="PHP Fee"
                />
              </div>

              {/* Conditional parameters based on calculation type */}
              {editingMethod.calculationType === 'free' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20">
                  <SettingInput
                    label="Minimum Order Subtotal to Qualify"
                    type="number"
                    value={editingMethod.minOrderAmount || 0}
                    onChange={(val) => setEditingMethod({ ...editingMethod, minOrderAmount: parseFloat(val) || 0 })}
                    helperText="Cart subtotal threshold required for free shipping eligibility."
                    exampleText="5000"
                    prefixText="₱"
                    suffixText="PHP Subtotal"
                  />
                  <SettingInput
                    label="Minimum Vial Quantity to Qualify"
                    type="number"
                    value={editingMethod.minQuantity || 0}
                    onChange={(val) => setEditingMethod({ ...editingMethod, minQuantity: parseInt(val, 10) || 0 })}
                    helperText="Minimum item count required for free shipping eligibility."
                    exampleText="10"
                    suffixText="Vials"
                  />
                </div>
              )}

              {editingMethod.calculationType === 'base_additional' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20">
                  <SettingInput
                    label="First Included Vials Count"
                    type="number"
                    value={editingMethod.baseIncludedQty || 10}
                    onChange={(val) => setEditingMethod({ ...editingMethod, baseIncludedQty: parseInt(val, 10) || 0 })}
                    helperText="Number of vials covered under the initial base fee."
                    exampleText="10"
                    suffixText="Vials Covered"
                  />
                  <SettingInput
                    label="Fee per Additional Vial"
                    type="number"
                    value={editingMethod.additionalPerVialFee || 10}
                    onChange={(val) => setEditingMethod({ ...editingMethod, additionalPerVialFee: parseFloat(val) || 0 })}
                    helperText="Surcharge added for every vial beyond the base included count."
                    exampleText="15"
                    prefixText="₱"
                    suffixText="PHP / Extra Vial"
                  />
                </div>
              )}

              {/* QUANTITY TIER RANGES EDITOR */}
              {editingMethod.calculationType === 'tiered_quantity' && (
                <div className="space-y-4 p-4 rounded-2xl bg-[#030712] border border-cyan-500/30">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider">
                        Quantity Tier Ranges
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono">
                        Tiered Rate Editor
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Define how the shipping fee changes according to the customer's ordered quantity.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Shipping Calculation Unit:
                        </label>
                        <select
                          value={tierUnit}
                          onChange={(e) => setTierUnit(e.target.value as 'vials' | 'kits')}
                          className="w-full bg-[#050810] border border-cyan-500/30 text-cyan-300 text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-cyan-400"
                        >
                          <option value="vials">Vials (Individual Vials)</option>
                          <option value="kits">Kits (Boxed Kits - 1 Kit = 10 Vials)</option>
                        </select>
                      </div>

                      <div className="text-[11px] text-slate-300 font-mono bg-cyan-950/40 border border-cyan-500/20 p-2.5 rounded-lg">
                        <span className="text-cyan-400 font-bold block mb-0.5">Unit Helper Rule:</span>
                        Choose whether these quantity ranges count individual vials or kits.
                        <br />
                        <span className="text-white font-bold underline">IMPORTANT: 1 Kit = {settings.vialUnitConfig?.vialsPerKit || 10} Vials.</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {(editingMethod.tieredRules || []).map((t, tidx) => {
                      const minQty = t.minQty;
                      const maxQty = t.maxQty;
                      const fee = t.fee;
                      const unitLabel = tierUnit === 'kits' ? 'Kits' : 'Vials';
                      const singleUnitLabel = tierUnit === 'kits' ? 'Kit' : 'Vial';

                      return (
                        <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3 relative group hover:border-cyan-500/40 transition-colors">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
                                TIER {tidx + 1}
                              </span>
                              <span className="text-xs font-mono text-slate-400">
                                Quantity Bracket #{tidx + 1}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingMethod.tieredRules || []).filter((_, i) => i !== tidx);
                                setEditingMethod({ ...editingMethod, tieredRules: updated });
                              }}
                              className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span>Remove Tier</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Box 1: Minimum Quantity */}
                            <SettingInput
                              label={`Minimum ${unitLabel}`}
                              type="number"
                              value={minQty}
                              onChange={(val) => {
                                const updated = [...(editingMethod.tieredRules || [])];
                                updated[tidx].minQty = parseInt(val, 10) || 0;
                                setEditingMethod({ ...editingMethod, tieredRules: updated });
                              }}
                              helperText={`The smallest number of ${unitLabel.toLowerCase()} required for this shipping tier.`}
                              exampleText={tidx === 0 ? `1 ${singleUnitLabel.toLowerCase()}` : `${(editingMethod.tieredRules?.[tidx - 1]?.maxQty || 10) + 1} ${unitLabel.toLowerCase()}`}
                              suffixText={unitLabel}
                            />

                            {/* Box 2: Maximum Quantity */}
                            <SettingInput
                              label={`Maximum ${unitLabel}`}
                              type="number"
                              value={maxQty === null ? '' : maxQty}
                              onChange={(val) => {
                                const updated = [...(editingMethod.tieredRules || [])];
                                const trimmed = val.trim();
                                updated[tidx].maxQty = trimmed === '' ? null : parseInt(trimmed, 10) || null;
                                setEditingMethod({ ...editingMethod, tieredRules: updated });
                              }}
                              helperText={`The largest number of ${unitLabel.toLowerCase()} covered by this shipping tier. (Leave blank for ∞).`}
                              exampleText={maxQty === null ? 'Unlimited (∞)' : `${tidx === 0 ? 10 : (minQty + 9)} ${unitLabel.toLowerCase()}`}
                              suffixText={maxQty === null ? '∞ Unlimited' : unitLabel}
                            />

                            {/* Box 3: Shipping Fee */}
                            <SettingInput
                              label="Shipping Fee"
                              type="number"
                              value={fee}
                              onChange={(val) => {
                                const updated = [...(editingMethod.tieredRules || [])];
                                updated[tidx].fee = parseFloat(val) || 0;
                                setEditingMethod({ ...editingMethod, tieredRules: updated });
                              }}
                              helperText="The shipping fee charged when the order quantity falls within this range."
                              exampleText={tidx === 0 ? '₱150' : `₱${(tidx + 1) * 100 + 50}`}
                              prefixText="₱"
                              suffixText="PHP Fee"
                            />
                          </div>

                          {/* Live Calculated Summary Sentence */}
                          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs font-mono">
                            <span className="text-slate-400 font-bold uppercase text-[10px]">Tier {tidx + 1} Calculated Result:</span>
                            <span className="text-cyan-300 font-extrabold">
                              → Customers ordering {minQty}–{maxQty === null ? '∞' : maxQty} {unitLabel} pay {formatPhpAmount(fee)} shipping.
                              {tierUnit === 'kits' && ` (${minQty * (settings.vialUnitConfig?.vialsPerKit || 10)}–${maxQty === null ? '∞' : maxQty * (settings.vialUnitConfig?.vialsPerKit || 10)} Vial Equivalents)`}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        const current = editingMethod.tieredRules || [];
                        const lastMax = current.length > 0 ? (current[current.length - 1].maxQty || 20) : 0;
                        const newTier: QuantityTierRule = {
                          id: `t_${Date.now()}`,
                          minQty: lastMax + 1,
                          maxQty: lastMax + 10,
                          fee: (current.length + 1) * 100 + 50,
                        };
                        setEditingMethod({ ...editingMethod, tieredRules: [...current, newTier] });
                      }}
                      className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>+ Add Tier {((editingMethod.tieredRules || []).length + 1)}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* REGIONAL RATES EDITOR (FIXED REGION OR REGIONAL BASE + ADDITIONAL VIAL) */}
              {(editingMethod.calculationType === 'fixed_region' || editingMethod.calculationType === 'regional_base_additional') && (
                <div className="space-y-4 p-4 rounded-2xl bg-[#030712] border border-cyan-500/30">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider">
                        {editingMethod.calculationType === 'regional_base_additional'
                          ? 'Regional Base + Additional Fee Rates'
                          : 'Regional Shipping Rates'}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono">
                        {editingMethod.calculationType === 'regional_base_additional'
                          ? 'Regional Base + Extra Vial Rate'
                          : 'Fixed Rate By Region'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {editingMethod.calculationType === 'regional_base_additional'
                        ? 'Configure regional base fees, included vial allowances, and extra vial rates per destination region.'
                        : 'Configure custom shipping rates for different destination regions (e.g. Luzon, Visayas, Mindanao).'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {((editingMethod.regionalRates && editingMethod.regionalRates.length > 0)
                      ? editingMethod.regionalRates
                      : [
                          { id: 'reg_luzon', regionName: 'Luzon', fee: 150, includedVials: 10, additionalFeePerVial: 10 },
                          { id: 'reg_visayas', regionName: 'Visayas', fee: 200, includedVials: 10, additionalFeePerVial: 15 },
                          { id: 'reg_mindanao', regionName: 'Mindanao', fee: 250, includedVials: 10, additionalFeePerVial: 20 },
                        ]
                    ).map((r, ridx, currentArr) => (
                      <div
                        key={r.id || `reg_${ridx}`}
                        className="p-3 rounded-xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-center gap-3"
                      >
                        <div className="flex-1 w-full">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Region Name</label>
                          <input
                            type="text"
                            value={r.regionName}
                            onChange={(e) => {
                              const updated = [...currentArr];
                              updated[ridx] = { ...updated[ridx], regionName: e.target.value };
                              setEditingMethod({ ...editingMethod, regionalRates: updated });
                            }}
                            placeholder="e.g. Luzon"
                            className="w-full bg-[#050810] border border-slate-700 text-white text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div className="w-full sm:w-32">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Base Fee (₱)</label>
                          <input
                            type="number"
                            value={r.fee}
                            onChange={(e) => {
                              const updated = [...currentArr];
                              updated[ridx] = { ...updated[ridx], fee: parseFloat(e.target.value) || 0 };
                              setEditingMethod({ ...editingMethod, regionalRates: updated });
                            }}
                            className="w-full bg-[#050810] border border-slate-700 text-white text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        {editingMethod.calculationType === 'regional_base_additional' && (
                          <>
                            <div className="w-full sm:w-28">
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Included Vials</label>
                              <input
                                type="number"
                                min="0"
                                value={r.includedVials ?? 10}
                                onChange={(e) => {
                                  const updated = [...currentArr];
                                  updated[ridx] = {
                                    ...updated[ridx],
                                    includedVials: Math.max(0, parseInt(e.target.value, 10) || 0),
                                  };
                                  setEditingMethod({ ...editingMethod, regionalRates: updated });
                                }}
                                className="w-full bg-[#050810] border border-slate-700 text-white text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-cyan-400"
                              />
                            </div>

                            <div className="w-full sm:w-32">
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Extra / Vial (₱)</label>
                              <input
                                type="number"
                                min="0"
                                value={r.additionalFeePerVial ?? 10}
                                onChange={(e) => {
                                  const updated = [...currentArr];
                                  updated[ridx] = {
                                    ...updated[ridx],
                                    additionalFeePerVial: Math.max(0, parseFloat(e.target.value) || 0),
                                  };
                                  setEditingMethod({ ...editingMethod, regionalRates: updated });
                                }}
                                className="w-full bg-[#050810] border border-slate-700 text-white text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-cyan-400"
                              />
                            </div>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const updated = currentArr.filter((_, i) => i !== ridx);
                            setEditingMethod({ ...editingMethod, regionalRates: updated });
                          }}
                          className="self-end sm:self-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                          title="Remove Region"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const current = editingMethod.regionalRates || [
                          { id: 'reg_luzon', regionName: 'Luzon', fee: 150, includedVials: 10, additionalFeePerVial: 10 },
                          { id: 'reg_visayas', regionName: 'Visayas', fee: 200, includedVials: 10, additionalFeePerVial: 15 },
                          { id: 'reg_mindanao', regionName: 'Mindanao', fee: 250, includedVials: 10, additionalFeePerVial: 20 },
                        ];
                        const newRate: RegionalRate = {
                          id: `reg_${Date.now()}`,
                          regionName: '',
                          fee: 200,
                          includedVials: 10,
                          additionalFeePerVial: 10,
                        };
                        setEditingMethod({ ...editingMethod, regionalRates: [...current, newRate] });
                      }}
                      className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>+ Add Region Rate</span>
                    </button>

                    {/* Admin Verification Calculation Card */}
                    {editingMethod.calculationType === 'regional_base_additional' && (
                      <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2 font-mono text-[11px]">
                        <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider">
                          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Calculation Verification Examples:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-300">
                          {((editingMethod.regionalRates && editingMethod.regionalRates.length > 0)
                            ? editingMethod.regionalRates
                            : [
                                { id: 'reg_luzon', regionName: 'Luzon', fee: 150, includedVials: 10, additionalFeePerVial: 10 },
                                { id: 'reg_visayas', regionName: 'Visayas', fee: 200, includedVials: 10, additionalFeePerVial: 15 },
                                { id: 'reg_mindanao', regionName: 'Mindanao', fee: 250, includedVials: 10, additionalFeePerVial: 20 },
                              ]
                          )
                            .slice(0, 3)
                            .map((r) => {
                              const inc = r.includedVials ?? 10;
                              const extra = r.additionalFeePerVial ?? 10;
                              return (
                                <div key={r.id || r.regionName} className="p-2 rounded bg-black/50 border border-white/5 space-y-1">
                                  <span className="font-bold text-cyan-400 block">{r.regionName || 'Region'}:</span>
                                  <span className="text-[10px] text-slate-400 block">Base: ₱{r.fee} (First {inc} vials)</span>
                                  <span className="text-[10px] text-slate-400 block">+ Extra: ₱{extra}/vial above {inc}</span>
                                  <div className="pt-1 text-[10px] text-emerald-400 space-y-0.5 border-t border-white/5">
                                    <div>• {inc} vials → ₱{r.fee}</div>
                                    <div>• {inc + 1} vials → ₱{r.fee + extra}</div>
                                    <div>• {inc + 5} vials → ₱{r.fee + 5 * extra}</div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stores Applicable */}
              <div className="space-y-1">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Applicable Stores
                </label>
                <div className="flex items-center gap-3">
                  {(['all', 'groupbuy', 'onhand', 'moq'] as const).map((st) => {
                    const isSel = editingMethod.availableStores.includes(st);
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          let newStores: Array<'all' | 'groupbuy' | 'onhand' | 'moq'>;
                          if (st === 'all') {
                            newStores = ['all'];
                          } else {
                            const withoutAll = editingMethod.availableStores.filter((s) => s !== 'all');
                            if (isSel) {
                              newStores = withoutAll.filter((s) => s !== st);
                              if (newStores.length === 0) newStores = ['all'];
                            } else {
                              newStores = [...withoutAll, st];
                            }
                          }
                          setEditingMethod({ ...editingMethod, availableStores: newStores });
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors cursor-pointer ${
                          isSel ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-white/10'
                        }`}
                      >
                        {st.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-2 bg-slate-950">
              <button
                type="button"
                onClick={() => setIsMethodModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMethod}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold"
              >
                Save Shipping Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL FOR EDITING / CREATING ADDITIONAL FEE --- */}
      {isFeeModalOpen && editingFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#090D16] border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold font-mono text-white uppercase">
                  {settings.additionalFees.some((f) => f.id === editingFee.id) ? 'Edit Additional Fee' : 'Add Fee'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFeeModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <SettingInput
                label="Admin Internal Name"
                value={editingFee.name}
                onChange={(val) => setEditingFee({ ...editingFee, name: val })}
              />

              <SettingInput
                label="Checkout Display Label (Customer Visible)"
                value={editingFee.displayName}
                onChange={(val) => setEditingFee({ ...editingFee, displayName: val })}
                helperText="This display name appears as a separate line item on customer receipt."
              />

              <SettingInput
                label="Fee Description"
                value={editingFee.description}
                onChange={(val) => setEditingFee({ ...editingFee, description: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Fee Category Type
                  </label>
                  <select
                    value={editingFee.type}
                    onChange={(e) => setEditingFee({ ...editingFee, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="admin_fee">Admin Fee</option>
                    <option value="handling_fee">Handling Fee</option>
                    <option value="procurement_shipping">International Procurement Shipping</option>
                    <option value="custom_fee">Custom Fee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Calculation Type
                  </label>
                  <select
                    value={editingFee.calculationType}
                    onChange={(e) => setEditingFee({ ...editingFee, calculationType: e.target.value as FeeCalculationType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="fixed">Fixed Amount (₱)</option>
                    <option value="percentage">Percentage of Subtotal (%)</option>
                    <option value="per_vial">Per Vial Rate (₱)</option>
                    <option value="per_kit">Per Kit Rate (₱)</option>
                    <option value="tiered_quantity">Tiered Quantity Ranges</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                  Fee Amount ({editingFee.calculationType === 'percentage' ? '%' : '₱'})
                </label>
                <input
                  type="number"
                  value={editingFee.amount}
                  onChange={(e) => setEditingFee({ ...editingFee, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Applicable Stores */}
              <div className="space-y-1">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Applicable Stores
                </label>
                <div className="flex items-center gap-3">
                  {(['all', 'groupbuy', 'onhand', 'moq'] as const).map((st) => {
                    const isSel = editingFee.availableStores.includes(st);
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          let newStores: Array<'all' | 'groupbuy' | 'onhand' | 'moq'>;
                          if (st === 'all') {
                            newStores = ['all'];
                          } else {
                            const withoutAll = editingFee.availableStores.filter((s) => s !== 'all');
                            if (isSel) {
                              newStores = withoutAll.filter((s) => s !== st);
                              if (newStores.length === 0) newStores = ['all'];
                            } else {
                              newStores = [...withoutAll, st];
                            }
                          }
                          setEditingFee({ ...editingFee, availableStores: newStores });
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors cursor-pointer ${
                          isSel ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-900 text-slate-400 border-white/10'
                        }`}
                      >
                        {st.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-2 bg-slate-950">
              <button
                type="button"
                onClick={() => setIsFeeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFee}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold"
              >
                Save Fee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
