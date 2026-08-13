import React, { useState } from 'react';
import { X, Store, Check, Shield, Layers, Calendar, Package } from 'lucide-react';
import { StoreConfig } from '../../../types/systemSettings';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStore: StoreConfig) => void;
}

export const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<'groupbuy' | 'onhand' | 'moq' | 'custom'>('groupbuy');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [accentColor, setAccentColor] = useState('#00D9FF');

  // Store Capabilities
  const [openCloseControl, setOpenCloseControl] = useState(true);
  const [inventoryManagement, setInventoryManagement] = useState(false);
  const [variantInventory, setVariantInventory] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const storeKey = type === 'custom' ? code.toLowerCase().replace(/[^a-z0-9]/g, '_') : type;

    const newStore: StoreConfig = {
      key: storeKey,
      code: code.toUpperCase().trim(),
      name: name.trim(),
      description: description.trim(),
      status,
      enabled: status === 'Active',
      visibility: 'public',
      order: 4,
      accentColor,
      capabilities: {
        openCloseControl,
        inventoryManagement,
        variantInventory: inventoryManagement ? variantInventory : false,
      },
      availability: {
        openCloseControlEnabled: openCloseControl,
        manualStatus: 'OPEN',
        scheduleMode: 'manual',
        override: 'NONE',
        timezone: 'Asia/Manila',
        weeklySchedule: {
          monday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
          tuesday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
          wednesday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
          thursday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
          friday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
          saturday: { enabled: false, openTime: '09:00', closeTime: '18:00' },
          sunday: { enabled: false, openTime: '09:00', closeTime: '18:00' },
        },
        specificDays: {
          days: ['monday', 'wednesday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
        specificDateRanges: [],
      },
      notes: 'Newly provisioned store.',
    };

    onSave(newStore);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090D16] border border-[#00D9FF]/30 rounded-2xl shadow-[0_0_50px_rgba(0,217,255,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide uppercase font-mono">
                CREATE NEW STORE
              </h2>
              <p className="text-xs text-slate-400">
                Define basic store metadata & capabilities. Detailed schedules are configured in Store Settings.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Store Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-[#00D9FF] tracking-wider uppercase border-b border-slate-800 pb-2">
              1. BASIC STORE INFORMATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  STORE NAME <span className="text-[#00D9FF]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. VIP Custom Reserve Store"
                  className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00D9FF] transition-colors"
                />
                <p className="mt-1 text-[11px] font-mono text-slate-500">
                  Public title displayed on store navigation tabs.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  STORE CODE <span className="text-[#00D9FF]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VIP-STORE"
                  className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#00D9FF] transition-colors"
                />
                <p className="mt-1 text-[11px] font-mono text-slate-500">
                  Unique internal code identifier.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  STORE TYPE
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    const newType = e.target.value as any;
                    setType(newType);
                    if (newType === 'groupbuy') {
                      setOpenCloseControl(true);
                      setInventoryManagement(false);
                      setVariantInventory(false);
                      setAccentColor('#00D9FF');
                    } else if (newType === 'onhand') {
                      setOpenCloseControl(false);
                      setInventoryManagement(true);
                      setVariantInventory(true);
                      setAccentColor('#8B5CF6');
                    } else if (newType === 'moq') {
                      setOpenCloseControl(false);
                      setInventoryManagement(false);
                      setVariantInventory(false);
                      setAccentColor('#FF2ED1');
                    }
                  }}
                  className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
                >
                  <option value="groupbuy">GroupBuy (Pre-Order Store)</option>
                  <option value="onhand">OnHand (Ready Inventory)</option>
                  <option value="moq">MOQ (Wholesale Bulk)</option>
                  <option value="custom">Custom Store Model</option>
                </select>
                <p className="mt-1 text-[11px] font-mono text-slate-500">
                  Select default operational pattern preset.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  INITIAL STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
                >
                  <option value="Active">Active (Enabled)</option>
                  <option value="Inactive">Inactive (Disabled)</option>
                </select>
                <p className="mt-1 text-[11px] font-mono text-slate-500">
                  Active stores are visible to customers according to visibility rules.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                DESCRIPTION
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary of store purpose..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00D9FF] transition-colors resize-none"
              />
              <p className="mt-1 text-[11px] font-mono text-slate-500">
                Optional description displayed on store header.
              </p>
            </div>
          </div>

          {/* Store Capabilities Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-mono font-bold text-[#00D9FF] tracking-wider uppercase border-b border-slate-800 pb-2">
              2. STORE CAPABILITIES (FEATURE TOGGLES)
            </h3>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              {/* Capability 1: Store Open/Close Control */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      STORE OPEN / CLOSE CONTROL
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Enable schedule and manual open/close controls. (If OFF, store runs continuously without open/close notices).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenCloseControl(!openCloseControl)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    openCloseControl ? 'bg-[#00D9FF]' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      openCloseControl ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Capability 2: Inventory Management */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      INVENTORY MANAGEMENT
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Track inventory quantities. (If OFF, product forms hide stock count fields completely).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !inventoryManagement;
                    setInventoryManagement(next);
                    if (!next) setVariantInventory(false);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    inventoryManagement ? 'bg-purple-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      inventoryManagement ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Capability 3: Variant Inventory */}
              <div
                className={`flex items-center justify-between gap-4 pt-3 border-t border-slate-800 transition-opacity ${
                  inventoryManagement ? 'opacity-100' : 'opacity-40 pointer-events-none'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      VARIANT INVENTORY
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Track inventory per variant strength (e.g. 5mg vs 10mg). Requires Inventory Management = ON.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!inventoryManagement}
                  onClick={() => setVariantInventory(!variantInventory)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    variantInventory ? 'bg-pink-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      variantInventory ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,217,255,0.3)]"
            >
              <Check className="w-4 h-4" />
              <span>CREATE STORE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
