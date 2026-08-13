import React from 'react';
import { StoreAccent } from '../store/StoreStatusBadge';
import { ChevronDown } from 'lucide-react';
import { convertUsdToPhp, formatPhpAmount } from '../../utils/currencyUtils';

export interface ProductVariant {
  id: string;
  label: string;
  price?: number;
}

export interface VariantSelectorProps {
  variants?: (string | ProductVariant)[];
  selectedVariant?: string;
  onChange?: (variantId: string) => void;
  accent?: StoreAccent;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onChange,
  accent = 'cyan',
  className = '',
}) => {
  // If no variants provided or empty array, return null so selector is hidden
  if (!variants || variants.length === 0) {
    return null;
  }

  const normalizedVariants: ProductVariant[] = variants.map((v) =>
    typeof v === 'string' ? { id: v, label: v } : v
  );

  if (normalizedVariants.length === 0) {
    return null;
  }

  const activeId = selectedVariant || normalizedVariants[0]?.id || '';

  const focusBorder: Record<StoreAccent, string> = {
    cyan: 'focus:border-[#00D9FF] focus:shadow-[0_0_12px_rgba(0,217,255,0.2)]',
    purple: 'focus:border-[#8B5CF6] focus:shadow-[0_0_12px_rgba(139,92,246,0.2)]',
    magenta: 'focus:border-[#FF2ED1] focus:shadow-[0_0_12px_rgba(255,46,209,0.2)]',
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
        Select Variant
      </label>
      <div className="relative">
        <select
          value={activeId}
          onChange={(e) => onChange && onChange(e.target.value)}
          aria-label="Select Variant"
          className={`w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 pr-8 text-xs font-mono font-semibold text-white focus:outline-none transition-all cursor-pointer ${focusBorder[accent]}`}
        >
          {normalizedVariants.map((v) => (
            <option key={v.id} value={v.id} className="bg-[#090D16] text-white">
              {v.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
