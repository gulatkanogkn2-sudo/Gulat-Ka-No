import React, { useState, useEffect } from 'react';
import { ProductAddonRelationship } from '../../types/productAddon';
import { productAddonService } from '../../services/productAddonService';
import { ProductManagementService } from '../../services/productManagementService';
import { AdminProduct, AdminProductVariant } from '../../types/adminProduct';
import { useCart } from '../../context/CartContext';
import { StoreType } from '../../types';
import { Plus, Check, Link2, ShoppingBag, Info, ChevronDown } from 'lucide-react';

interface StoreProductAddonWidgetProps {
  productId: string;
  storeType: StoreType;
  parentQuantity?: number;
}

export const StoreProductAddonWidget: React.FC<StoreProductAddonWidgetProps> = ({
  productId,
  storeType,
  parentQuantity = 1,
}) => {
  const { addItem } = useCart();
  const [matchingAddons, setMatchingAddons] = useState<ProductAddonRelationship[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Record<string, AdminProduct>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadAddons();
  }, [productId, storeType]);

  const loadAddons = async () => {
    const matches = productAddonService.getAddonsForProduct(productId, storeType);
    setMatchingAddons(matches);

    if (matches.length > 0) {
      const res = await ProductManagementService.getProducts({});
      const prodMap: Record<string, AdminProduct> = {};
      res.products.forEach((p) => {
        prodMap[p.id] = p;
      });
      setRelatedProducts(prodMap);

      // Initialize default variants & quantities
      const initialVarMap: Record<string, string> = {};
      const initialQtyMap: Record<string, number> = {};

      matches.forEach((addon) => {
        const prod = prodMap[addon.relatedProductId];
        if (prod && prod.variants && prod.variants.length > 0) {
          const matchedVar = addon.defaultVariantId
            ? prod.variants.find((v) => v.id === addon.defaultVariantId) || prod.variants[0]
            : prod.variants[0];
          initialVarMap[addon.id] = matchedVar.id;
        } else {
          initialVarMap[addon.id] = 'default';
        }

        initialQtyMap[addon.id] = Math.max(addon.minRelatedQty || 1, 1);
      });

      setSelectedVariants(initialVarMap);
      setSelectedQuantities(initialQtyMap);
    }
  };

  if (matchingAddons.length === 0) return null;

  const handleQtyChange = (addonId: string, delta: number, addon: ProductAddonRelationship) => {
    const current = selectedQuantities[addonId] || 1;
    const min = addon.minRelatedQty || 1;
    const max = addon.maxRelatedQty || 999;
    const next = Math.max(min, Math.min(max, current + delta));
    setSelectedQuantities((prev) => ({ ...prev, [addonId]: next }));
  };

  const handleVariantChange = (addonId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [addonId]: variantId }));
  };

  const handleAddRelatedToCart = (addon: ProductAddonRelationship) => {
    const targetProd = relatedProducts[addon.relatedProductId];
    const targetName = targetProd ? targetProd.name : addon.relatedProductName || 'Related Product';
    
    // Determine selected variant
    const selectedVarId = selectedVariants[addon.id];
    let selectedVar: AdminProductVariant | undefined;
    if (targetProd && targetProd.variants && targetProd.variants.length > 0) {
      selectedVar = targetProd.variants.find((v) => v.id === selectedVarId) || targetProd.variants[0];
    }

    const pricePhp = selectedVar ? selectedVar.price : targetProd ? targetProd.price : 100;
    const variantLabel = selectedVar ? selectedVar.name : 'Standard Unit';
    const reqQty = selectedQuantities[addon.id] || 1;

    // Validate using productAddonService
    const validation = productAddonService.validateAddonQuantity(parentQuantity, reqQty, addon);

    if (!validation.valid) {
      alert(validation.reason || 'Cannot add requested quantity.');
      return;
    }

    addItem({
      productId: addon.relatedProductId,
      name: targetName,
      variantId: selectedVar ? selectedVar.id : 'default',
      variantLabel,
      storeType: storeType,
      price: pricePhp,
      currency: '₱',
      quantity: reqQty,
      imageUrl: targetProd?.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      isAddon: true,
      parentProductId: productId,
      addonRelationshipId: addon.id,
      excessUnitFee: validation.excessFeePerUnit || 0,
      excessQuantity: validation.excessQuantity || 0,
      excessFeeTotal: validation.excessFeeTotal || 0,
    });

    setAddedMap((prev) => ({ ...prev, [addon.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [addon.id]: false }));
    }, 2500);
  };

  const getRuleBadge = (addon: ProductAddonRelationship) => {
    switch (addon.ruleType) {
      case 'RULE_A':
        return 'Max Qty = Parent Qty';
      case 'RULE_B':
        return 'Max Qty ≤ Parent Qty';
      case 'RULE_C':
        return `Max Limit: ${addon.maxRelatedQty || 'Unlimited'}`;
      case 'RULE_D':
        return 'Unrestricted Qty';
      case 'RULE_E':
        const fee = addon.excessUnitFeePhp ?? addon.extraUnitPricePhp ?? 0;
        return `Rule E: Units > ${parentQuantity} incur +₱${fee}/unit extra fee`;
      default:
        return 'Add-On';
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#050810] border border-[#00D9FF]/30 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-[#00D9FF] uppercase font-mono tracking-wider flex items-center gap-2">
          <Link2 size={16} className="text-[#FF2ED1]" />
          <span>Recommended Store Add-Ons & Supplies</span>
        </h4>
        <span className="px-2.5 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 text-[10px] font-mono font-bold uppercase">
          {storeType.toUpperCase()} STORE
        </span>
      </div>

      <div className="space-y-3">
        {matchingAddons.map((addon) => {
          const targetProd = relatedProducts[addon.relatedProductId];
          const isAdded = addedMap[addon.id];
          const reqQty = selectedQuantities[addon.id] || 1;
          const selectedVarId = selectedVariants[addon.id];

          // Compute validation state live
          const validation = productAddonService.validateAddonQuantity(parentQuantity, reqQty, addon);

          let selectedVar: AdminProductVariant | undefined;
          if (targetProd && targetProd.variants && targetProd.variants.length > 0) {
            selectedVar = targetProd.variants.find((v) => v.id === selectedVarId) || targetProd.variants[0];
          }

          const unitPrice = selectedVar ? selectedVar.price : targetProd ? targetProd.price : 100;
          const baseSubtotal = unitPrice * reqQty;
          const excessSurcharge = validation.excessFeeTotal || 0;
          const totalLinePrice = baseSubtotal + excessSurcharge;

          return (
            <div
              key={addon.id}
              className="p-3.5 sm:p-4 rounded-xl bg-[#090D16] border border-white/10 space-y-3 hover:border-[#00D9FF]/40 transition-all"
            >
              {/* Top Row: Thumbnail, Name, Price & Rule Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-black/60 border border-[#00D9FF]/20 overflow-hidden shrink-0 flex items-center justify-center">
                    {targetProd?.imageUrl ? (
                      <img src={targetProd.imageUrl} alt={targetProd.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag size={20} className="text-slate-500" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h5 className="text-sm font-bold text-white truncate">
                      {targetProd ? targetProd.name : addon.relatedProductName}
                    </h5>
                    <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                      <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {getRuleBadge(addon)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Price Display */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-[#FF2ED1] font-mono">
                    ₱{totalLinePrice.toLocaleString()}
                  </div>
                  {excessSurcharge > 0 && (
                    <div className="text-[9px] font-mono text-amber-300">
                      (Includes +₱{excessSurcharge} fee)
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Row: Variant Selector (if product has variants) */}
              {targetProd && targetProd.variants && targetProd.variants.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 font-mono uppercase tracking-wider block">
                    Select Add-On Size / Variant:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVarId || targetProd.variants[0].id}
                      onChange={(e) => handleVariantChange(addon.id, e.target.value)}
                      className="w-full bg-[#050810] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono appearance-none focus:outline-none focus:border-[#00D9FF] cursor-pointer"
                    >
                      {targetProd.variants.map((v) => (
                        <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                          {v.name} — ₱{v.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Excess Fee Warning / Notice for Rule E */}
              {addon.ruleType === 'RULE_E' && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info size={13} className="text-amber-400 shrink-0" />
                    <span>Included Basis: {parentQuantity} units (Matches Parent Quantity)</span>
                  </div>
                  {validation.excessQuantity ? (
                    <p className="text-amber-200">
                      Notice: You selected {reqQty} units ({validation.excessQuantity} excess units above parent quantity). Additional surcharge = {validation.excessQuantity} × ₱{validation.excessFeePerUnit} = <span className="font-bold text-amber-300">+₱{validation.excessFeeTotal}</span>.
                    </p>
                  ) : (
                    <p className="text-slate-400 text-[10px]">
                      Selecting more than {parentQuantity} units will incur an additional fee of ₱{addon.excessUnitFeePhp || addon.extraUnitPricePhp || 50}/excess unit.
                    </p>
                  )}
                </div>
              )}

              {/* Bottom Row: Quantity Controls & Add Button */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Qty:</span>
                  <div className="flex items-center bg-[#050810] border border-cyan-500/30 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(addon.id, -1, addon)}
                      className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 font-mono text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-mono text-xs text-[#00D9FF] font-bold">
                      {reqQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(addon.id, 1, addon)}
                      className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 font-mono text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddRelatedToCart(addon)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : 'bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-slate-950 shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      <span>Added To Order</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Add Add-On (₱{totalLinePrice.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
