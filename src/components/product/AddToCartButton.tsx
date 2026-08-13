import React from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { StoreAccent } from '../store/StoreStatusBadge';

export interface AddToCartButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  accent?: StoreAccent;
  label?: string;
  isAdded?: boolean;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  onClick,
  disabled = false,
  accent = 'cyan',
  label = 'Add to Cart',
  isAdded = false,
  className = '',
}) => {
  const accentGlow: Record<StoreAccent, string> = {
    cyan: 'bg-[#00D9FF] text-slate-950 hover:bg-[#33E2FF] hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] border-[#00D9FF]',
    purple: 'bg-[#8B5CF6] text-white hover:bg-[#9D72F8] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] border-[#8B5CF6]',
    magenta: 'bg-[#FF2ED1] text-slate-950 hover:bg-[#FF5BE1] hover:shadow-[0_0_20px_rgba(255,46,209,0.4)] border-[#FF2ED1]',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-black uppercase tracking-wider border flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none ${
        disabled
          ? 'bg-white/5 border-white/10 text-slate-500'
          : isAdded
          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
          : accentGlow[accent]
      } ${className}`}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Added to Order</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span>{disabled ? 'Unavailable' : label}</span>
        </>
      )}
    </button>
  );
};
