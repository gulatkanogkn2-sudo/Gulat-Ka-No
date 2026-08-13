import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { StoreAccent } from '../store/StoreStatusBadge';

export interface QuantitySelectorProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  accent?: StoreAccent;
  className?: string;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value = 1,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  accent = 'cyan',
  className = '',
  showLabel = true,
  label = 'Quantity',
}) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    if (onChange) onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    if (onChange) onChange(newValue);
  };

  const hoverAccent: Record<StoreAccent, string> = {
    cyan: 'hover:border-[#00D9FF] hover:text-[#00D9FF] hover:bg-[#00D9FF]/10',
    purple: 'hover:border-[#8B5CF6] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10',
    magenta: 'hover:border-[#FF2ED1] hover:text-[#FF2ED1] hover:bg-[#FF2ED1]/10',
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease quantity"
          className={`w-6 h-6 rounded flex items-center justify-center text-slate-300 border border-transparent transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${hoverAccent[accent]}`}
        >
          <Minus className="w-3 h-3" />
        </button>

        <span className="w-8 text-center text-xs font-mono font-bold text-white select-none">
          {value}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase quantity"
          className={`w-6 h-6 rounded flex items-center justify-center text-slate-300 border border-transparent transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${hoverAccent[accent]}`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
