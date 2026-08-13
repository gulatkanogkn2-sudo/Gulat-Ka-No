import React, { useState, useEffect } from 'react';
import { PackageCheck, Tag, Snowflake, Shield, Sparkles, Check, Trash2, Box } from 'lucide-react';
import { accessoryService } from '../../services/accessoryService';
import { CheckoutAccessory } from '../../types/checkout';
import { StoreType } from '../../types';
import { convertUsdToPhp, formatPhpAmount, formatUsdAmount } from '../../utils/currencyUtils';

interface AccessoriesSelectorProps {
  totalVialsCount: number;
  totalKitsCount?: number;
  storeType?: StoreType | string;
  selectedAccessoriesState: Record<string, number>;
  onAccessoryQuantityChange: (accessoryId: string, quantity: number) => void;
  className?: string;
}

export const AccessoriesSelector: React.FC<AccessoriesSelectorProps> = ({
  totalVialsCount,
  totalKitsCount = 1,
  storeType = 'groupbuy',
  selectedAccessoriesState,
  onAccessoryQuantityChange,
  className = '',
}) => {
  const [allAccessories, setAllAccessories] = useState<CheckoutAccessory[]>(() =>
    accessoryService.getAccessories()
  );

  useEffect(() => {
    setAllAccessories(accessoryService.getAccessories());
    const unsubscribe = accessoryService.subscribe((updated) => {
      setAllAccessories(updated);
    });
    return () => unsubscribe();
  }, []);

  const normStore = (storeType || 'groupbuy').toLowerCase();
  const availableAccessories = allAccessories.filter((acc) => {
    const isEnabled = acc.enabled ?? (acc as any).active ?? true;
    if (!isEnabled) return false;

    const stores = acc.availableStores || ['all'];
    if (stores.includes('all')) return true;

    return stores.some((s) => s.toLowerCase() === normStore);
  });

  const getIcon = (id: string) => {
    if (id.includes('label')) return <Tag className="w-4 h-4 text-[#00D9FF]" />;
    if (id.includes('sleeve') || id.includes('packaging')) return <Box className="w-4 h-4 text-[#FF2ED1]" />;
    if (id.includes('ice') || id.includes('cold')) return <Snowflake className="w-4 h-4 text-[#00D9FF]" />;
    if (id.includes('box') || id.includes('thermal')) return <Shield className="w-4 h-4 text-[#8B5CF6]" />;
    return <PackageCheck className="w-4 h-4 text-[#FF2ED1]" />;
  };

  const handleToggleAccessory = (accId: string) => {
    const currentQty = selectedAccessoriesState[accId] || 0;
    if (currentQty > 0) {
      // Deselect
      onAccessoryQuantityChange(accId, 0);
    } else {
      // Select
      onAccessoryQuantityChange(accId, 1);
    }
  };

  if (availableAccessories.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-[#00D9FF]" />
          4. Staging Accessories & Packaging (Optional)
        </h3>
        <span className="text-[10px] font-mono text-slate-400">Add-On Options</span>
      </div>

      <div className="space-y-3">
        {availableAccessories.map((acc) => {
          const isSelected = (selectedAccessoriesState[acc.id] || 0) > 0;
          const mode = (acc.calculationMode || (acc as any).calculationType || 'manual').toLowerCase();
          const multiplier = acc.multiplier ?? 1;

          // Calculate quantity based on calculation mode
          let calculatedQuantity = 0;
          if (mode === 'per_vial') {
            calculatedQuantity = Math.max(1, totalVialsCount * multiplier);
          } else if (mode === 'per_kit') {
            calculatedQuantity = Math.max(1, totalKitsCount * multiplier);
          } else {
            calculatedQuantity = selectedAccessoriesState[acc.id] || 0;
          }

          const unitPricePhp = convertUsdToPhp(acc.priceUsd);
          const activeQty = isSelected ? calculatedQuantity : 0;
          const totalPriceUsd = acc.priceUsd * activeQty;
          const totalPricePhp = convertUsdToPhp(totalPriceUsd);

          return (
            <div
              key={acc.id}
              className={`p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-[#090D16]/90 border-[#00D9FF]/40 shadow-[0_0_15px_rgba(0,217,255,0.1)]'
                  : 'bg-[#090D16]/50 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Toggle Checkbox / Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleAccessory(acc.id)}
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#00D9FF] border-[#00D9FF] text-black font-bold'
                        : 'border-white/30 hover:border-[#00D9FF]/60 bg-black/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="p-2 rounded-lg bg-black/60 border border-white/10 flex-shrink-0">
                    {getIcon(acc.id)}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-white font-mono">{acc.name}</h4>

                      {/* Calculation Mode Badge */}
                      {mode === 'per_vial' && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Per Vial ({totalVialsCount} total vials × {multiplier})
                        </span>
                      )}
                      {mode === 'per_kit' && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF2ED1]/10 text-[#FF2ED1] border border-[#FF2ED1]/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Per Kit ({totalKitsCount} total kits × {multiplier})
                        </span>
                      )}
                      {mode === 'manual' && (
                        <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                          Manual Quantity
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 font-mono leading-relaxed">{acc.description}</p>

                    {/* Unit price display */}
                    <div className="text-[10px] font-mono text-slate-400">
                      Unit Price: <span className="text-white font-bold">{formatPhpAmount(unitPricePhp)}</span>
                      <span className="text-slate-500"> ({formatUsdAmount(acc.priceUsd)} / unit)</span>
                    </div>

                    {/* Auto-calculated summary text when selected */}
                    {isSelected && mode !== 'manual' && (
                      <div className="text-[10px] font-mono text-[#00D9FF] pt-0.5 flex items-center gap-1.5">
                        <span>⚡ Automatically calculated:</span>
                        <span className="font-bold bg-[#00D9FF]/10 px-1.5 py-0.5 rounded border border-[#00D9FF]/30">
                          {calculatedQuantity} units @ {formatUsdAmount(acc.priceUsd)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Controls & Subtotal */}
                <div className="text-right flex-shrink-0 font-mono space-y-2">
                  {isSelected ? (
                    <>
                      <div className="text-xs font-bold text-[#00D9FF]">
                        {formatPhpAmount(totalPricePhp)}
                        <span className="text-[10px] font-normal text-slate-400 block">
                          ({formatUsdAmount(totalPriceUsd)})
                        </span>
                      </div>

                      {mode === 'manual' ? (
                        /* Manual Quantity Controls */
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onAccessoryQuantityChange(acc.id, Math.max(0, calculatedQuantity - 1))}
                            className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={calculatedQuantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              onAccessoryQuantityChange(acc.id, isNaN(val) ? 0 : Math.max(0, val));
                            }}
                            className="w-10 text-center bg-black/80 border border-white/20 rounded text-xs font-bold text-white py-0.5 focus:border-[#00D9FF] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => onAccessoryQuantityChange(acc.id, calculatedQuantity + 1)}
                            className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        /* Automatic Calculation - No quantity editing controls */
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-2 py-1 rounded border border-white/10">
                            Qty: {calculatedQuantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAccessoryQuantityChange(acc.id, 0)}
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                            title="Remove accessory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleAccessory(acc.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00D9FF]/10 hover:border-[#00D9FF]/40 border border-white/10 text-xs text-slate-300 font-bold transition-all cursor-pointer"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
