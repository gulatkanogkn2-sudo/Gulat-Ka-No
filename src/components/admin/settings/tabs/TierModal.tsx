import React, { useState, useEffect } from 'react';
import { CustomerTierConfig, RESERVED_TIER_ROLE_NAMES } from '../../../../types/customerTier';
import { CustomerTierService } from '../../../../services/customerTierService';
import { X, Save, AlertCircle, Sparkles, Award } from 'lucide-react';

interface TierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tier: CustomerTierConfig) => void;
  initialTier?: CustomerTierConfig | null;
  existingTierIds: string[];
}

const BADGE_PRESETS = [
  {
    name: 'Slate Dark (Base)',
    badgeColor: 'border-slate-700 bg-slate-800 text-slate-300',
  },
  {
    name: 'Silver Glow',
    badgeColor: 'border-slate-500 bg-slate-800 text-slate-200',
  },
  {
    name: 'Gold Amber',
    badgeColor: 'border-amber-500/50 bg-amber-950/40 text-amber-300',
  },
  {
    name: 'VIP Yellow',
    badgeColor: 'border-amber-400/50 bg-amber-500/15 text-amber-300',
  },
  {
    name: 'Cyan Cyber',
    badgeColor: 'border-[#00D9FF]/50 bg-[#00D9FF]/10 text-[#00D9FF]',
  },
  {
    name: 'Neon Pink',
    badgeColor: 'border-[#FF2ED1]/50 bg-[#FF2ED1]/10 text-[#FF2ED1]',
  },
  {
    name: 'Violet Neon',
    badgeColor: 'border-purple-500/50 bg-purple-950/40 text-purple-300',
  },
  {
    name: 'Emerald Green',
    badgeColor: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300',
  },
  {
    name: 'Laser Red',
    badgeColor: 'border-red-500/50 bg-red-950/40 text-red-300',
  },
];

export const TierModal: React.FC<TierModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTier,
  existingTierIds,
}) => {
  const isEditing = !!initialTier;

  const [rawId, setRawId] = useState('');
  const [name, setName] = useState('');
  const [minLifetimeSpendPhp, setMinLifetimeSpendPhp] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isAutoAssignment, setIsAutoAssignment] = useState<boolean>(true);
  const [description, setDescription] = useState('');
  const [badgeColor, setBadgeColor] = useState(BADGE_PRESETS[0].badgeColor);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTier) {
      setRawId(initialTier.id);
      setName(initialTier.name);
      setMinLifetimeSpendPhp(initialTier.minLifetimeSpendPhp || 0);
      setDiscountPercent(initialTier.discountPercent || 0);
      setIsActive(initialTier.isActive !== false);
      setIsAutoAssignment(initialTier.isAutoAssignment !== false && !initialTier.isManualOnly);
      setDescription(initialTier.description || '');
      setBadgeColor(initialTier.badgeColor || BADGE_PRESETS[0].badgeColor);
      setError(null);
    } else {
      setRawId('');
      setName('');
      setMinLifetimeSpendPhp(0);
      setDiscountPercent(0);
      setIsActive(true);
      setIsAutoAssignment(true);
      setDescription('');
      setBadgeColor(BADGE_PRESETS[4].badgeColor); // Default cyan for new tiers
      setError(null);
    }
  }, [initialTier, isOpen]);

  if (!isOpen) return null;

  const normalizedId = CustomerTierService.normalizeTierId(rawId || name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalId = isEditing ? initialTier.id : normalizedId;

    if (!finalId || !finalId.trim()) {
      setError('Tier Identifier is required.');
      return;
    }

    if (!name.trim()) {
      setError('Tier Display Name is required.');
      return;
    }

    // Reserved name check
    if (CustomerTierService.isReservedTierName(finalId)) {
      setError(
        `"${finalId}" is a reserved system authorization role and cannot be used as a customer tier. Reserved roles: ${RESERVED_TIER_ROLE_NAMES.join(
          ', '
        )}`
      );
      return;
    }

    // Duplicate ID check when creating new tier
    if (!isEditing) {
      const isDuplicate = existingTierIds.some(
        (id) => CustomerTierService.normalizeTierId(id) === finalId
      );
      if (isDuplicate) {
        setError(`A customer tier with identifier "${finalId}" already exists.`);
        return;
      }
    }

    if (minLifetimeSpendPhp < 0) {
      setError('Minimum qualifying spend cannot be negative.');
      return;
    }

    if (discountPercent < 0 || discountPercent > 100) {
      setError('Discount percentage must be between 0% and 100%.');
      return;
    }

    const payload: CustomerTierConfig = {
      id: finalId,
      name: name.trim(),
      minLifetimeSpendPhp: Number(minLifetimeSpendPhp) || 0,
      discountPercent: Number(discountPercent) || 0,
      isActive,
      isAutoAssignment,
      isManualOnly: !isAutoAssignment,
      description: description.trim() || undefined,
      badgeColor,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0F1D] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF]">
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                {isEditing ? `Edit Customer Tier — ${initialTier.name}` : 'Create New Customer Tier'}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                {isEditing
                  ? 'Update tier parameters, thresholds, and styling.'
                  : 'Define a custom commercial membership tier.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Validation Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono flex items-start gap-2 animate-shake">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Tier ID */}
          <div>
            <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
              Tier Identifier (Code) *
            </label>
            {isEditing ? (
              <div className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-400 font-bold flex items-center justify-between">
                <span>{initialTier.id}</span>
                <span className="text-[10px] text-slate-500 font-normal">Immutable ID</span>
              </div>
            ) : (
              <input
                type="text"
                required
                value={rawId}
                onChange={(e) => setRawId(e.target.value)}
                placeholder="e.g. PLATINUM, DIAMOND, VIP_PLUS"
                className="w-full bg-[#050810] border border-white/10 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00D9FF] uppercase tracking-wider font-bold"
              />
            )}
            <p className="mt-1 text-[10px] text-slate-500 font-mono">
              Unique programmatic identifier. Cannot match reserved roles (OWNER, ADMIN, STAFF, CUSTOMER).
            </p>
          </div>

          {/* Tier Display Name */}
          <div>
            <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
              Tier Display Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Platinum Tier, Diamond Partner"
              className="w-full bg-[#050810] border border-white/10 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00D9FF]"
            />
            <p className="mt-1 text-[10px] text-slate-500 font-mono">
              Customer-facing title displayed on account profiles, badges, and orders.
            </p>
          </div>

          {/* Spend & Discount Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Min Lifetime Spend (₱) *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={minLifetimeSpendPhp}
                onChange={(e) => setMinLifetimeSpendPhp(Math.max(0, Number(e.target.value) || 0))}
                className="w-full bg-[#050810] border border-white/10 rounded-xl px-3.5 py-2 text-emerald-400 font-bold focus:outline-none focus:border-[#00D9FF]"
              />
              <p className="mt-1 text-[10px] text-slate-500 font-mono">
                Qualifying finalized order volume required.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Store Discount Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                className="w-full bg-[#050810] border border-white/10 rounded-xl px-3.5 py-2 text-cyan-400 font-bold focus:outline-none focus:border-[#00D9FF]"
              />
              <p className="mt-1 text-[10px] text-slate-500 font-mono">
                Automatic customer discount applied at checkout.
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
              Description & Qualification Criteria
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Automatically assigned upon reaching ₱100,000 in lifetime finalized orders."
              className="w-full bg-[#050810] border border-white/10 rounded-xl px-3.5 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00D9FF] font-sans"
            />
            <p className="mt-1 text-[10px] text-slate-500 font-mono">
              Internal documentation and customer tooltip description.
            </p>
          </div>

          {/* Badge Color Preset Selection */}
          <div>
            <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
              Badge Styling & Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BADGE_PRESETS.map((preset) => {
                const isSelected = badgeColor === preset.badgeColor;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setBadgeColor(preset.badgeColor)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
                        : 'border-white/5 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-mono truncate">{preset.name}</span>
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold border ${preset.badgeColor}`}>
                        {name.trim() ? name.toUpperCase() : 'PREVIEW'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignment & Status Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#050810] border border-white/10 cursor-pointer hover:border-white/20">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-[#00D9FF] focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-white block">Active Tier</span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  Tier is operational in the system.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#050810] border border-white/10 cursor-pointer hover:border-white/20">
              <input
                type="checkbox"
                checked={isAutoAssignment}
                onChange={(e) => setIsAutoAssignment(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-[#00D9FF] focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-white block">Auto Assignment</span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  Assigned by spend calculation engine.
                </span>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-white rounded-xl shadow-[0_0_15px_rgba(0,217,255,0.4)] hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save size={15} />
              <span>{isEditing ? 'Save Tier Changes' : 'Create Tier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
