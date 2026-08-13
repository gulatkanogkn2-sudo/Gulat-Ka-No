import React, { useState, useEffect } from 'react';
import {
  PackageCheck,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag,
  Box,
  Snowflake,
  Shield,
  Sparkles,
  Layers,
  Factory,
  Save,
  X,
  AlertTriangle,
} from 'lucide-react';
import { accessoryService } from '../../../../services/accessoryService';
import { CheckoutAccessory, AccessoryCalculationMode } from '../../../../types/checkout';
import { StoreType } from '../../../../types';
import { convertUsdToPhp, formatPhpAmount, formatUsdAmount } from '../../../../utils/currencyUtils';
import { ConfirmModal } from '../../../common/ConfirmModal';

export const AccessoriesSettingsTab: React.FC = () => {
  const [accessories, setAccessories] = useState<CheckoutAccessory[]>(() => accessoryService.getAccessories());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Partial<CheckoutAccessory> | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<{ id: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    description: string;
    priceUsd: number;
    calculationMode: AccessoryCalculationMode;
    enabled: boolean;
    displayOrder: number;
    availableStores: string[];
  }>({
    name: '',
    description: '',
    priceUsd: 1.0,
    calculationMode: 'manual',
    enabled: true,
    displayOrder: 1,
    availableStores: ['groupbuy', 'onhand', 'moq'],
  });

  useEffect(() => {
    setAccessories(accessoryService.getAccessories());
    const unsubscribe = accessoryService.subscribe((updated) => {
      setAccessories(updated);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingAccessory(null);
    setFormData({
      name: '',
      description: '',
      priceUsd: 1.0,
      calculationMode: 'manual',
      enabled: true,
      displayOrder: accessories.length + 1,
      availableStores: ['groupbuy', 'onhand', 'moq'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc: CheckoutAccessory) => {
    setEditingAccessory(acc);
    setFormData({
      id: acc.id,
      name: acc.name,
      description: acc.description || '',
      priceUsd: acc.priceUsd,
      calculationMode: (acc.calculationMode || (acc as any).calculationType || 'manual').toLowerCase() as AccessoryCalculationMode,
      enabled: acc.enabled ?? true,
      displayOrder: acc.displayOrder || 1,
      availableStores: acc.availableStores ? [...acc.availableStores] : ['groupbuy', 'onhand', 'moq'],
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string, current: boolean) => {
    accessoryService.updateAccessory(id, { enabled: !current });
    showToast(`Accessory ${!current ? 'activated' : 'deactivated'}.`);
  };

  const handleDeleteAccessory = (id: string, name: string) => {
    setDeletingTarget({ id, name });
  };

  const confirmDeleteAccessory = () => {
    if (!deletingTarget) return;
    const ok = accessoryService.deleteAccessory(deletingTarget.id);
    if (ok) {
      showToast(`Deleted accessory "${deletingTarget.name}".`);
      setAccessories(accessoryService.getAccessories());
    } else {
      showToast(`Failed to delete accessory.`, 'error');
    }
    setDeletingTarget(null);
  };

  const handleStoreCheckboxChange = (storeKey: string) => {
    setFormData((prev) => {
      const current = prev.availableStores;
      if (storeKey === 'all') {
        return { ...prev, availableStores: ['groupbuy', 'onhand', 'moq'] };
      }
      if (current.includes(storeKey)) {
        const next = current.filter((s) => s !== storeKey);
        return { ...prev, availableStores: next.length === 0 ? ['groupbuy'] : next };
      } else {
        return { ...prev, availableStores: [...current, storeKey] };
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Accessory name is required.', 'error');
      return;
    }
    if (formData.priceUsd < 0) {
      showToast('Price cannot be negative.', 'error');
      return;
    }

    if (formData.id) {
      // Update
      accessoryService.updateAccessory(formData.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        priceUsd: formData.priceUsd,
        calculationMode: formData.calculationMode,
        enabled: formData.enabled,
        displayOrder: formData.displayOrder,
        availableStores: formData.availableStores as StoreType[],
      });
      showToast(`Updated "${formData.name}".`);
    } else {
      // Create
      accessoryService.addAccessory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        priceUsd: formData.priceUsd,
        calculationMode: formData.calculationMode,
        enabled: formData.enabled,
        displayOrder: formData.displayOrder,
        availableStores: formData.availableStores as StoreType[],
      });
      showToast(`Added new accessory "${formData.name}".`);
    }

    setIsModalOpen(false);
  };

  const getIconForAcc = (id: string, name: string) => {
    const lname = name.toLowerCase();
    if (id.includes('label') || lname.includes('label') || lname.includes('sticker'))
      return <Tag className="w-5 h-5 text-[#00D9FF]" />;
    if (id.includes('sleeve') || lname.includes('sleeve') || lname.includes('pack'))
      return <Box className="w-5 h-5 text-[#FF2ED1]" />;
    if (id.includes('ice') || lname.includes('ice') || lname.includes('gel') || lname.includes('cold'))
      return <Snowflake className="w-5 h-5 text-[#00D9FF]" />;
    if (id.includes('box') || lname.includes('box') || lname.includes('shield'))
      return <Shield className="w-5 h-5 text-[#8B5CF6]" />;
    return <PackageCheck className="w-5 h-5 text-[#FF2ED1]" />;
  };

  return (
    <div className="space-y-6 font-sans text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border font-mono text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF]'
              : 'bg-red-500/20 border-red-500 text-red-400'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span className="font-bold">{toast.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#090D16] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-base font-bold font-mono text-white uppercase tracking-wider">
              Checkout Accessories Manager
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30">
              {accessories.length} Items
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Configure optional packaging, custom labels, and fulfillment accessories presented during customer checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,217,255,0.3)] flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Checkout Accessory
        </button>
      </div>

      {/* Accessories Grid / Table */}
      <div className="space-y-3">
        {accessories.map((acc) => {
          const mode = (acc.calculationMode || (acc as any).calculationType || 'manual').toLowerCase();
          const stores = acc.availableStores || ['all'];
          const pricePhp = convertUsdToPhp(acc.priceUsd);

          return (
            <div
              key={acc.id}
              className={`p-5 rounded-2xl border transition-all ${
                acc.enabled
                  ? 'bg-[#090D16]/90 border-white/10 hover:border-[#00D9FF]/40'
                  : 'bg-[#090D16]/40 border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left: Icon & Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex-shrink-0">
                    {getIconForAcc(acc.id, acc.name)}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        Rank #{acc.displayOrder}
                      </span>
                      <h3 className="text-sm font-bold font-mono text-white">{acc.name}</h3>

                      {/* Calculation Mode Badge */}
                      {mode === 'per_vial' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          PER_VIAL (Auto Vial Count)
                        </span>
                      )}
                      {mode === 'per_kit' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF2ED1]/15 text-[#FF2ED1] border border-[#FF2ED1]/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          PER_KIT (Auto Kit Count)
                        </span>
                      )}
                      {mode === 'manual' && (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          MANUAL (Customer Selects)
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-mono text-slate-400 leading-relaxed">{acc.description}</p>

                    {/* Store Badges */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-500">Available In:</span>
                      {stores.includes('all') ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          All Stores
                        </span>
                      ) : (
                        <>
                          {stores.includes('groupbuy') && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 flex items-center gap-1">
                              <Layers className="w-2.5 h-2.5" />
                              GroupBuy
                            </span>
                          )}
                          {stores.includes('onhand') && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30 flex items-center gap-1">
                              <Box className="w-2.5 h-2.5" />
                              OnHand
                            </span>
                          )}
                          {stores.includes('moq') && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF2ED1]/15 text-[#FF2ED1] border border-[#FF2ED1]/30 flex items-center gap-1">
                              <Factory className="w-2.5 h-2.5" />
                              MOQ
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Price & Admin Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                  <div className="text-left md:text-right font-mono">
                    <div className="text-sm font-bold text-[#00D9FF]">
                      {formatUsdAmount(acc.priceUsd)}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      ≈ {formatPhpAmount(pricePhp)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(acc.id, acc.enabled)}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        acc.enabled
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                      }`}
                    >
                      {acc.enabled ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Disabled
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(acc)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00D9FF] border border-white/10 transition-colors cursor-pointer"
                      title="Edit Accessory"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAccessory(acc.id, acc.name)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                      title="Delete Accessory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Editor Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#090D16] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#00D9FF]" />
                <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider">
                  {editingAccessory ? 'Edit Checkout Accessory' : 'Create New Checkout Accessory'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* 1. Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 font-mono">
                  ACCESSORY NAME
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Custom Sticker Labels (Vials)"
                  className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-xs font-mono text-white focus:border-[#00D9FF] focus:outline-none"
                  required
                />
                <p className="text-[10px] font-mono text-slate-500">
                  Display title for customer checkout.
                </p>
              </div>

              {/* 2. Description */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 font-mono">
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Custom waterproof peptide vial labels with batch & lot info."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-xs font-mono text-white focus:border-[#00D9FF] focus:outline-none"
                />
                <p className="text-[10px] font-mono text-slate-500">
                  Detailed explanation of what is included with this accessory option.
                </p>
              </div>

              {/* 3. Price USD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 font-mono">
                    UNIT PRICE (USD $)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.priceUsd}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceUsd: e.target.value === '' ? 0 : isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-xs font-mono text-white focus:border-[#00D9FF] focus:outline-none"
                    required
                  />
                  <p className="text-[10px] font-mono text-slate-500">
                    Base price per unit (~{formatPhpAmount(convertUsdToPhp(formData.priceUsd))}).
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 font-mono">
                    DISPLAY ORDER RANK
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: e.target.value === '' ? 0 : isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-xs font-mono text-white focus:border-[#00D9FF] focus:outline-none"
                  />
                  <p className="text-[10px] font-mono text-slate-500">
                    Sorting order index in checkout list.
                  </p>
                </div>
              </div>

              {/* 4. Calculation Method */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 font-mono">
                  CALCULATION METHOD
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, calculationMode: 'per_vial' })}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      formData.calculationMode === 'per_vial'
                        ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)]'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>PER_VIAL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, calculationMode: 'per_kit' })}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      formData.calculationMode === 'per_kit'
                        ? 'bg-[#FF2ED1]/20 border-[#FF2ED1] text-[#FF2ED1] shadow-[0_0_10px_rgba(255,46,209,0.2)]'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <Box className="w-4 h-4" />
                    <span>PER_KIT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, calculationMode: 'manual' })}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      formData.calculationMode === 'manual'
                        ? 'bg-white/20 border-white text-white'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>MANUAL</span>
                  </button>
                </div>
                <p className="text-[10px] font-mono text-slate-500">
                  {formData.calculationMode === 'per_vial' &&
                    'PER_VIAL: Accessory quantity automatically equals the order calculated total vial count.'}
                  {formData.calculationMode === 'per_kit' &&
                    'PER_KIT: Accessory quantity automatically equals the order calculated total kit count.'}
                  {formData.calculationMode === 'manual' &&
                    'MANUAL: Customer can manually choose the desired accessory quantity.'}
                </p>
              </div>

              {/* 5. Store Availability */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 font-mono">
                  STORE AVAILABILITY
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono cursor-pointer hover:border-[#00D9FF]/50">
                    <input
                      type="checkbox"
                      checked={formData.availableStores.includes('groupbuy')}
                      onChange={() => handleStoreCheckboxChange('groupbuy')}
                      className="rounded bg-black border-white/20 text-[#00D9FF] focus:ring-[#00D9FF]"
                    />
                    <span className="text-[#8B5CF6] font-bold">GroupBuy</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono cursor-pointer hover:border-[#00D9FF]/50">
                    <input
                      type="checkbox"
                      checked={formData.availableStores.includes('onhand')}
                      onChange={() => handleStoreCheckboxChange('onhand')}
                      className="rounded bg-black border-white/20 text-[#00D9FF] focus:ring-[#00D9FF]"
                    />
                    <span className="text-[#00D9FF] font-bold">OnHand</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono cursor-pointer hover:border-[#00D9FF]/50">
                    <input
                      type="checkbox"
                      checked={formData.availableStores.includes('moq')}
                      onChange={() => handleStoreCheckboxChange('moq')}
                      className="rounded bg-black border-white/20 text-[#00D9FF] focus:ring-[#00D9FF]"
                    />
                    <span className="text-[#FF2ED1] font-bold">MOQ</span>
                  </label>
                </div>
                <p className="text-[10px] font-mono text-slate-500">
                  Select which storefronts will offer this accessory during checkout.
                </p>
              </div>

              {/* 6. Active Toggle */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 font-mono">
                  STATUS
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                    className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      formData.enabled
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-rose-500/20 border-rose-500 text-rose-400'
                    }`}
                  >
                    {formData.enabled ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{formData.enabled ? 'ACTIVE / ENABLED' : 'DISABLED'}</span>
                  </button>
                </div>
                <p className="text-[10px] font-mono text-slate-500">
                  Only active accessories will be rendered during customer checkout.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,217,255,0.3)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Accessory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingTarget}
        onClose={() => setDeletingTarget(null)}
        onConfirm={confirmDeleteAccessory}
        title="Delete Checkout Accessory"
        message={`Are you sure you want to permanently delete "${deletingTarget?.name || 'this accessory'}"? This action cannot be undone.`}
        confirmText="Delete Accessory"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
