import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { StoreAccent } from '../store/StoreStatusBadge';
import { ProductImage } from './ProductImage';
import { StatusBadge, ProductStatusType } from './StatusBadge';
import { StockBadge } from './StockBadge';
import { PriceDisplay } from './PriceDisplay';
import { VariantSelector, ProductVariant } from './VariantSelector';
import { QuantitySelector } from './QuantitySelector';
import { AddToCartButton } from './AddToCartButton';
import { Eye, Truck, Snowflake, ShieldCheck, Factory } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getStoreQuantityConfig, snapToValidQuantity } from '../../utils/vialCalculation';

export interface ProductData {
  id?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  unitInfo?: string;
  sellingUnit?: 'vial' | 'kit';
  vialsPerKit?: number;
  groupBuySettings?: { sellingUnit?: 'vial' | 'kit'; vialsPerKit?: number; [key: string]: any };
  onHandSettings?: { sellingUnit?: 'vial' | 'kit'; vialsPerKit?: number; [key: string]: any };
  moqSettings?: { sellingUnit?: 'vial' | 'kit'; vialsPerKit?: number; [key: string]: any };
  storeSettings?: Record<string, { sellingUnit?: 'vial' | 'kit'; vialsPerKit?: number; [key: string]: any }>;
  imageUrl?: string;
  storeType?: 'groupbuy' | 'onhand' | 'moq';
  status?: ProductStatusType;
  stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Staging' | string;
  stockText?: string;
  variants?: (string | ProductVariant)[];
  minQuantity?: number;
  maxQuantity?: number;
  stepQuantity?: number;
  purity?: string;
  batchNumber?: string;
  category?: string;
  estimatedDispatchTime?: string;
  coldChainRequired?: boolean;
  storageTemperature?: string;
  laboratoryGrade?: string;
  moqTarget?: number;
  moqCurrent?: number;
  moqUnitLabel?: string;
  moqProgressPercent?: number;
  moqRemaining?: number;
  manufacturingStatus?: string;
  estimatedProductionStart?: string;
  estimatedCompletion?: string;
}

export interface ProductCardProps {
  product?: ProductData;
  accent?: StoreAccent;
  onAddToCart?: (product: ProductData, variantId: string, quantity: number) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  accent = 'cyan',
  onAddToCart,
  className = '',
}) => {
  const navigate = useNavigate();

  // Default sample product placeholder if no product provided
  const data: ProductData = product || {
    id: 'sample-001',
    name: 'GKN-77 Reference Peptide',
    description: 'Synthetic research sequence.',
    price: 149.0,
    originalPrice: 180.0,
    currency: '$',
    unitInfo: '/ 10 vials',
    status: 'Available',
    stockStatus: 'In Stock',
    stockText: 'Ready for Dispatch',
    variants: ['5mg', '10mg', '15mg', '20mg'],
    minQuantity: 1,
    maxQuantity: 10,
    stepQuantity: 1,
  };

  const isMoq = data.storeType === 'moq' || accent === 'magenta';
  const hasVariants = !isMoq && Boolean(data.variants && data.variants.length > 0);

  const [selectedVariant, setSelectedVariant] = useState<string>(() => {
    if (!hasVariants) return 'standard';
    const first = data.variants![0];
    return typeof first === 'string' ? first : first.id;
  });

  const targetStore = data.storeType || (accent === 'purple' ? 'onhand' : accent === 'magenta' ? 'moq' : 'groupbuy');
  const storeCfg = getStoreQuantityConfig(data, targetStore);

  const maxAllowedQty =
    isMoq && data.moqRemaining !== undefined
      ? Math.max(1, data.moqRemaining)
      : data.maxQuantity || 999;

  const [quantity, setQuantity] = useState<number>(storeCfg.minQuantity);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  useEffect(() => {
    setQuantity(snapToValidQuantity(storeCfg.minQuantity, storeCfg.minQuantity, storeCfg.stepQuantity, maxAllowedQty));
  }, [storeCfg.minQuantity, storeCfg.stepQuantity, maxAllowedQty]);

  // Compute active variant object and current active USD price
  const activeVariantObj = hasVariants
    ? data.variants
        ?.map((v) => (typeof v === 'string' ? { id: v, label: v, price: data.price } : v))
        .find((v) => v.id === selectedVariant) || null
    : null;

  const activePrice = activeVariantObj?.price ?? data.price;

  const cardBorder: Record<StoreAccent, string> = {
    cyan: 'border-[#00D9FF]/20 hover:border-[#00D9FF]/60 hover:shadow-[0_0_25px_rgba(0,217,255,0.18)]',
    purple: 'border-[#8B5CF6]/20 hover:border-[#8B5CF6]/60 hover:shadow-[0_0_25px_rgba(139,92,246,0.18)]',
    magenta: 'border-[#FF2ED1]/20 hover:border-[#FF2ED1]/60 hover:shadow-[0_0_25px_rgba(255,46,209,0.18)]',
  };

  const viewBtnStyle: Record<StoreAccent, string> = {
    cyan: 'border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/10 hover:border-[#00D9FF]',
    purple: 'border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]',
    magenta: 'border-[#FF2ED1]/30 text-[#FF2ED1] hover:bg-[#FF2ED1]/10 hover:border-[#FF2ED1]',
  };

  const { addItem } = useCart();

  const handleAddToCart = () => {
    setIsAdded(true);
    const validQty = snapToValidQuantity(quantity, storeCfg.minQuantity, storeCfg.stepQuantity, maxAllowedQty);
    if (onAddToCart) {
      onAddToCart(data, selectedVariant, validQty);
    }
    addItem({
      id: `${data.id || 'sample'}-${selectedVariant}`,
      productId: data.id || 'sample-001',
      name: data.name,
      variantId: selectedVariant,
      variantLabel: activeVariantObj?.label || (typeof selectedVariant === 'string' ? selectedVariant : 'Standard'),
      storeType: targetStore,
      price: activePrice,
      originalPrice: data.originalPrice,
      currency: data.currency || '$',
      unitInfo: data.unitInfo,
      sellingUnit: storeCfg.sellingUnit,
      vialsPerKit: storeCfg.vialsPerKit,
      imageUrl: data.imageUrl,
      quantity: validQty,
      minQuantity: storeCfg.minQuantity,
      maxQuantity: maxAllowedQty,
      stepQuantity: storeCfg.stepQuantity,
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isMoqReached =
    isMoq &&
    ((data.moqRemaining !== undefined && data.moqRemaining <= 0) ||
      (data.moqProgressPercent !== undefined && data.moqProgressPercent >= 100) ||
      data.manufacturingStatus === 'MOQ Achieved' ||
      data.manufacturingStatus === 'Ready To Order' ||
      data.manufacturingStatus === 'Target Reached');

  const isUnavailable =
    data.status === 'Out of Stock' ||
    data.status === 'Batch Closed' ||
    isMoqReached;

  const productPath = `/product/${data.id || 'sample-001'}`;
  const useCompactLayout =
    data.storeType === 'groupbuy' ||
    data.storeType === 'onhand' ||
    data.storeType === 'moq' ||
    accent === 'cyan' ||
    accent === 'purple' ||
    accent === 'magenta' ||
    !data.storeType;

  const hoverTitleColor: Record<StoreAccent, string> = {
    cyan: 'group-hover:text-[#00D9FF]',
    purple: 'group-hover:text-[#8B5CF6]',
    magenta: 'group-hover:text-[#FF2ED1]',
  };

  return (
    <Card
      variant="glass"
      noPadding
      className={`group border p-4 flex flex-col justify-between space-y-3 transition-all duration-300 hover:-translate-y-1.5 ${cardBorder[accent]} ${className}`}
    >
      {/* Product Image & Content */}
      <div className="space-y-3">
        {useCompactLayout ? (
          <div className="flex items-start gap-3">
            <div onClick={() => navigate(productPath)} className="cursor-pointer shrink-0">
              <ProductImage
                src={data.imageUrl}
                alt={data.name}
                accent={accent}
                compact={true}
              />
            </div>
            <div className="space-y-1 min-w-0 flex-1 pt-0.5">
              <Link
                to={productPath}
                className={`text-base font-bold text-white tracking-tight truncate ${hoverTitleColor[accent]} transition-colors block`}
                title={data.name}
              >
                {data.name}
              </Link>
              {data.description && (
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {data.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div onClick={() => navigate(productPath)} className="cursor-pointer block">
              <ProductImage
                src={data.imageUrl}
                alt={data.name}
                accent={accent}
                badgeOverlay={
                  data.status ? (
                    <StatusBadge status={data.status} accent={accent} glow />
                  ) : undefined
                }
              />
            </div>

            {/* Stock Status & Metadata Badge Area */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <StockBadge
                stockStatus={data.stockStatus}
                stockText={data.stockText}
                accent={accent}
              />
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                {data.purity && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                    Purity {data.purity}
                  </span>
                )}
                {data.batchNumber && (
                  <span className="px-1.5 py-0.5 rounded bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] font-bold uppercase">
                    {data.batchNumber}
                  </span>
                )}
                {!data.batchNumber && data.storeType && (
                  <span className="uppercase tracking-widest text-slate-400">
                    {data.storeType}
                  </span>
                )}
              </div>
            </div>

            {/* Product Title and Description */}
            <div className="space-y-1">
              <Link
                to={productPath}
                className="text-base font-bold text-white tracking-tight truncate group-hover:text-[#00D9FF] transition-colors block"
                title={data.name}
              >
                {data.name}
              </Link>
              {data.description && (
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {data.description}
                </p>
              )}
            </div>

            {/* Customer Inventory Specifications (OnHand / Direct Stores) */}
            {(data.estimatedDispatchTime || data.laboratoryGrade) && (
              <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-300">
                {data.estimatedDispatchTime && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300">
                    <Truck className="w-3 h-3 text-[#8B5CF6]" />
                    {data.estimatedDispatchTime}
                  </span>
                )}
                {data.laboratoryGrade && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {data.laboratoryGrade}
                  </span>
                )}
              </div>
            )}

            {/* MOQ Progress Bar & Manufacturing Metrics (MOQ Store) */}
            {(data.moqTarget !== undefined || data.moqProgressPercent !== undefined) && (
              <div className="pt-2.5 space-y-1.5 p-3 rounded-xl bg-slate-950/90 border border-[#FF2ED1]/30 font-mono">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Factory className="w-3 h-3 text-[#FF2ED1]" />
                    MOQ Progress:
                  </span>
                  <span className="text-[#FF2ED1]">
                    {data.moqCurrent ?? 0} / {data.moqTarget ?? 100} Kits ({data.moqProgressPercent ?? 0}%)
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF2ED1] via-[#8B5CF6] to-[#00D9FF] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,46,209,0.5)]"
                    style={{ width: `${Math.min(100, Math.max(0, data.moqProgressPercent ?? 0))}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                  <span>Remaining Needed: <strong className="text-white">{data.moqRemaining ?? 0} Kits</strong></span>
                  {data.estimatedProductionStart && (
                    <span className="text-[#00D9FF]">Est. Run: {data.estimatedProductionStart}</span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interactive Controls & Pricing */}
      <div className="space-y-4 pt-2 border-t border-white/5">
        {/* Variant and Quantity Selector Row */}
        {isMoq && (data.moqTarget !== undefined || data.moqProgressPercent !== undefined) && (
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/90 border border-[#FF2ED1]/30 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Factory className="w-3.5 h-3.5 text-[#FF2ED1]" />
                MOQ Progress
              </span>
              <span className="text-[#FF2ED1]">
                {data.moqCurrent ?? 0} / {data.moqTarget ?? 50} Kits ({data.moqProgressPercent ?? 0}%)
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
              <div
                className="h-full bg-gradient-to-r from-[#FF2ED1] via-[#8B5CF6] to-[#00D9FF] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,46,209,0.5)]"
                style={{ width: `${Math.min(100, Math.max(0, data.moqProgressPercent ?? 0))}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] pt-0.5">
              {isMoqReached ? (
                <span className="font-bold text-[#FF2ED1] tracking-wider">MOQ REACHED</span>
              ) : (
                <span className="text-slate-400">
                  <strong className="text-white">{data.moqRemaining ?? 0}</strong> Kits Remaining
                </span>
              )}
            </div>
          </div>
        )}

        {hasVariants ? (
          <div className="grid grid-cols-2 gap-3 items-end">
            <VariantSelector
              variants={data.variants}
              selectedVariant={selectedVariant}
              onChange={setSelectedVariant}
              accent={accent}
            />
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              min={storeCfg.minQuantity}
              max={maxAllowedQty}
              step={storeCfg.stepQuantity}
              accent={accent}
            />
          </div>
        ) : (
          <div className="flex items-end justify-between gap-3">
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              min={storeCfg.minQuantity}
              max={maxAllowedQty}
              step={storeCfg.stepQuantity}
              accent={accent}
            />
          </div>
        )}

        {/* Dual Currency Price Display */}
        <PriceDisplay
          price={activePrice}
          quantity={quantity}
          accent={accent}
        />

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={productPath}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${viewBtnStyle[accent]}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </Link>
          <AddToCartButton
            onClick={handleAddToCart}
            disabled={isUnavailable}
            accent={accent}
            label={isMoqReached ? 'MOQ REACHED' : 'Add to Cart'}
            isAdded={isAdded}
          />
        </div>
      </div>
    </Card>
  );
};
