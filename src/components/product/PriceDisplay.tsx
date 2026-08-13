import React, { useState, useEffect } from 'react';
import { StoreAccent } from '../store/StoreStatusBadge';
import { systemSettingsService } from '../../services/systemSettingsService';
import { convertUsdToPhp, formatPhpAmount, formatUsdAmount } from '../../utils/currencyUtils';

export interface PriceDisplayProps {
  price: number; // USD base/unit price
  quantity?: number; // Selected quantity (defaults to 1)
  originalPrice?: number;
  currency?: string;
  unitInfo?: string;
  accent?: StoreAccent;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  quantity = 1,
  size = 'md',
  className = '',
}) => {
  const [, setRateVersion] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = systemSettingsService.subscribe(() => {
      setRateVersion((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  const unitUsd = typeof price === 'number' && !isNaN(price) ? price : 0;
  const qty = Math.max(1, typeof quantity === 'number' && !isNaN(quantity) ? quantity : 1);

  const unitPhp = convertUsdToPhp(unitUsd);
  const totalPhp = unitPhp * qty;
  const totalUsd = unitUsd * qty;

  const primarySizeClasses = {
    sm: 'text-lg font-bold',
    md: 'text-2xl sm:text-3xl font-black',
    lg: 'text-3xl sm:text-4xl font-black',
  };

  return (
    <div className={`flex flex-col items-start text-left space-y-0.5 ${className}`}>
      {/* Primary Price: PHP Total (Neon Pink, Large Font) */}
      <div className="flex items-baseline">
        <span className={`font-mono tracking-tight text-[#FF2ED1] drop-shadow-[0_0_12px_rgba(255,46,209,0.3)] ${primarySizeClasses[size]}`}>
          {formatPhpAmount(totalPhp)}
        </span>
      </div>

      {/* Price Breakdown: Multiplier */}
      <div className="font-mono text-xs text-slate-300 font-semibold">
        {qty} × {formatPhpAmount(unitPhp)}
      </div>

      {/* Secondary Price: USD Total (Neon Cyan, Smaller Font) */}
      <div className="font-mono text-xs font-semibold text-[#00D9FF]">
        {formatUsdAmount(totalUsd)}
      </div>
    </div>
  );
};
