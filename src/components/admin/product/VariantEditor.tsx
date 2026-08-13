import React from 'react';
import { AdminProductVariant, AdminStoreType } from '../../../types/adminProduct';
import { Plus, Trash2, Layers, Package } from 'lucide-react';
import { convertUsdToPhp, formatPhpAmount } from '../../../utils/currencyUtils';

interface VariantEditorProps {
  variants: AdminProductVariant[];
  onChange: (variants: AdminProductVariant[]) => void;
  currency?: string;
  storeType?: AdminStoreType;
  hasVariantInventory?: boolean;
  productName?: string;
}

const generateSkuCode = (pName: string, vName: string) => {
  const cleanP = (pName || 'PROD').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3) || 'GKN';
  const cleanV = (vName || '10MG').replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || '10MG';
  return `${cleanP}-${cleanV}`;
};

export const VariantEditor: React.FC<VariantEditorProps> = ({
  variants,
  onChange,
  currency = '$',
  storeType = 'groupbuy',
  hasVariantInventory,
  productName = '',
}) => {
  const showInventory = hasVariantInventory ?? (storeType !== 'groupbuy');

  const handleAddVariant = () => {
    const defaultName = '10mg';
    const autoSku = generateSkuCode(productName, defaultName);
    const newVariant: AdminProductVariant = {
      id: `var-${Date.now().toString().slice(-4)}`,
      name: defaultName,
      price: 100.0,
      costPrice: 50.0,
      minOrder: 1,
      orderStep: 1,
      sku: autoSku,
    };
    onChange([...variants, newVariant]);
  };

  const handleUpdateVariant = (index: number, field: keyof AdminProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      alert('A product must contain at least one variant.');
      return;
    }
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00D9FF]" />
          <h4 className="text-sm font-bold text-white font-mono tracking-tight uppercase">
            Product Variants ({variants.length})
          </h4>
        </div>
        <button
          type="button"
          onClick={handleAddVariant}
          className="px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/40 text-[#00D9FF] hover:bg-[#00D9FF]/20 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD VARIANT
        </button>
      </div>

      <div className="space-y-3">
        {variants.map((variant, index) => {
          const margin =
            variant.price && variant.costPrice
              ? (((variant.price - variant.costPrice) / variant.price) * 100).toFixed(1)
              : null;

          return (
            <div
              key={variant.id || index}
              className="p-4 rounded-xl bg-slate-950/90 border border-white/10 hover:border-white/20 transition-all space-y-3 font-mono text-xs"
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                <span className="text-slate-400 font-bold text-[11px] uppercase flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-[#00D9FF]" />
                  Variant #{index + 1}
                </span>

                <div className="flex items-center gap-3">
                  {margin !== null && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      Margin: {margin}%
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="p-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="Remove Variant"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Variant Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    VARIANT NAME / LABEL (STRENGTH) *
                  </label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => handleUpdateVariant(index, 'name', e.target.value)}
                    placeholder="e.g., 5mg, 10mg, 15mg"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:border-[#00D9FF]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    The variant name represents the strength (e.g., 5mg, 10mg).
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-400 block">
                      SKU CODE (OPTIONAL / AUTO-GENERATED)
                    </label>
                    {!variant.sku && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateVariant(
                            index,
                            'sku',
                            generateSkuCode(productName, variant.name)
                          )
                        }
                        className="text-[9px] text-[#00D9FF] hover:underline font-mono"
                      >
                        Auto-fill
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={variant.sku || ''}
                    onChange={(e) => handleUpdateVariant(index, 'sku', e.target.value)}
                    placeholder={`e.g., ${generateSkuCode(productName, variant.name || '10mg')}`}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:border-[#00D9FF]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Internal Stock Keeping Unit identifier.</p>
                </div>
              </div>

              {/* Inventory Quantity (rendered when variantInventory capability is ON) */}
              {showInventory && (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    INVENTORY QUANTITY
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variant.inventoryQuantity ?? 0}
                    onChange={(e) =>
                      handleUpdateVariant(index, 'inventoryQuantity', e.target.value === '' ? 0 : isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-[#00D9FF] font-bold font-mono focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>
              )}

              {/* Price, Cost Price, Min Order, Order Step */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    USD RETAIL PRICE ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-slate-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) =>
                        handleUpdateVariant(index, 'price', e.target.value === '' ? 0 : isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))
                      }
                      className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-emerald-400 font-bold font-mono focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-[#FF2ED1] font-bold">
                    Auto PHP: {formatPhpAmount(convertUsdToPhp(variant.price || 0))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Authoritative selling price.</p>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    MANUFACTURER COST ({currency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-slate-500">{currency}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.costPrice ?? 0}
                      onChange={(e) =>
                        handleUpdateVariant(index, 'costPrice', e.target.value === '' ? 0 : isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))
                      }
                      className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-amber-400 font-mono focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Cost per unit from factory.</p>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">MIN ORDER</label>
                  <input
                    type="number"
                    value={variant.minOrder ?? 1}
                    onChange={(e) =>
                      handleUpdateVariant(index, 'minOrder', parseInt(e.target.value) || 1)
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:border-[#00D9FF]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Minimum purchase units.</p>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">ORDER STEP</label>
                  <input
                    type="number"
                    value={variant.orderStep ?? 1}
                    onChange={(e) =>
                      handleUpdateVariant(index, 'orderStep', parseInt(e.target.value) || 1)
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:border-[#00D9FF]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Quantity increment.</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
