import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink } from 'lucide-react';
import { CartItem as CartItemType, useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';
import { QuantitySelector } from '../product/QuantitySelector';
import { StoreAccent } from '../store/StoreStatusBadge';
import { SafeImage } from '../../assets/branding';
import { convertUsdToPhp, formatPhpAmount, formatUsdAmount } from '../../utils/currencyUtils';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({ item, compact = false }) => {
  const { updateQuantity, removeItem } = useCart();

  const storeAccent: StoreAccent =
    item.storeType === 'onhand'
      ? 'purple'
      : item.storeType === 'moq'
      ? 'magenta'
      : 'cyan';

  const storePath =
    item.storeType === 'onhand'
      ? '/onhand'
      : item.storeType === 'moq'
      ? '/moq'
      : '/groupbuy';

  const accentBorder: Record<StoreAccent, string> = {
    cyan: 'border-[#00D9FF]/20 hover:border-[#00D9FF]/40',
    purple: 'border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40',
    magenta: 'border-[#FF2ED1]/20 hover:border-[#FF2ED1]/40',
  };

  const accentText: Record<StoreAccent, string> = {
    cyan: 'text-[#00D9FF]',
    purple: 'text-[#8B5CF6]',
    magenta: 'text-[#FF2ED1]',
  };

  const lineTotal = (item.price * item.quantity) + (item.excessFeeTotal || 0);
  const productUrl = `/product/${item.productId}`;

  if (compact) {
    // Mini cart drawer item layout
    return (
      <div className={`p-3 rounded-xl bg-[#090D16]/80 border ${accentBorder[storeAccent]} transition-all space-y-2`}>
        <div className="flex gap-3">
          {/* Thumbnail */}
          <Link to={productUrl} className="w-14 h-14 rounded-lg overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 relative group">
            <SafeImage
              src={item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-1">
              <Link to={productUrl} className="text-xs font-bold text-white hover:text-[#00D9FF] truncate transition-colors block">
                {item.name}
              </Link>
              <button
                onClick={() => removeItem(item.id)}
                className="text-slate-400 hover:text-red-400 p-0.5 rounded transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="truncate">{item.variantLabel}</span>
              <Badge variant={storeAccent} className="text-[9px] px-1.5 py-0">
                {item.storeType.toUpperCase()}
              </Badge>
            </div>

            {item.excessFeeTotal && item.excessFeeTotal > 0 ? (
              <p className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">
                +₱{item.excessFeeTotal.toLocaleString()} excess fee ({item.excessQuantity} extra @ ₱{item.excessUnitFee}/ea)
              </p>
            ) : null}

            <div className="flex flex-col items-end pt-1">
              <span className="text-xs font-mono font-bold text-[#FF2ED1]">
                {formatPhpAmount(convertUsdToPhp(lineTotal))}
              </span>
              <span className="text-[10px] font-mono text-[#00D9FF]">
                {formatUsdAmount(lineTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity bar in mini cart */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Qty</span>
          <QuantitySelector
            showLabel={false}
            value={item.quantity}
            onChange={(qty) => updateQuantity(item.id, qty)}
            min={item.minQuantity || 1}
            max={item.maxQuantity || 999}
            step={item.stepQuantity || 1}
            accent={storeAccent}
            size="sm"
          />
        </div>
      </div>
    );
  }

  // Full page CartItem layout
  return (
    <div className={`p-4 sm:p-5 rounded-xl bg-[#090D16]/90 border ${accentBorder[storeAccent]} transition-all space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-6`}>
      {/* Left section: Thumbnail & Product info */}
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
        <Link to={productUrl} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 relative group">
          <SafeImage
            src={item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </Link>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={storeAccent} glow>
              {item.storeType.toUpperCase()}
            </Badge>
            {item.purity && (
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                Purity: {item.purity}
              </span>
            )}
          </div>

          <Link to={productUrl} className="text-base font-bold text-white hover:text-[#00D9FF] transition-colors flex items-center gap-1.5 group">
            <span className="truncate">{item.name}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00D9FF]" />
          </Link>

          <p className="text-xs font-mono text-slate-400">
            Variant: <span className="text-slate-200">{item.variantLabel}</span>
            {item.sellingUnit && (
              <span className="ml-2 text-[10px] text-[#00D9FF] bg-[#00D9FF]/10 px-1.5 py-0.5 rounded border border-[#00D9FF]/20 font-bold">
                {item.sellingUnit === 'kit' ? `PER KIT (${item.vialsPerKit || 10} Vials)` : 'PER VIAL'}
              </span>
            )}
          </p>

          {item.excessFeeTotal && item.excessFeeTotal > 0 ? (
            <div className="inline-block text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <span className="font-bold">+₱{item.excessFeeTotal.toLocaleString()} Excess Unit Surcharge</span>
              <span className="text-slate-400 text-[11px] block sm:inline sm:ml-2">({item.excessQuantity} units above parent qty @ ₱{item.excessUnitFee}/unit)</span>
            </div>
          ) : null}

          <div className="text-xs font-mono text-slate-400 sm:hidden space-y-0.5">
            <div>Unit Price: <span className="text-[#FF2ED1] font-bold">{formatPhpAmount(convertUsdToPhp(item.price))}</span> <span className="text-[#00D9FF] font-semibold">({formatUsdAmount(item.price)})</span></div>
          </div>
        </div>
      </div>

      {/* Right section: Price, Quantity & Remove Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
        {/* Unit Price (Desktop) */}
        <div className="hidden sm:block text-right font-mono space-y-0.5 min-w-[110px]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Unit Price</span>
          <span className="text-sm font-bold text-[#FF2ED1] block">{formatPhpAmount(convertUsdToPhp(item.price))}</span>
          <span className="text-[10px] text-[#00D9FF] block">{formatUsdAmount(item.price)}</span>
        </div>

        {/* Quantity Selector */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block sm:hidden">Quantity</span>
          <QuantitySelector
            showLabel={false}
            value={item.quantity}
            onChange={(qty) => updateQuantity(item.id, qty)}
            min={item.minQuantity || 1}
            max={item.maxQuantity || 999}
            step={item.stepQuantity || 1}
            accent={storeAccent}
            size="md"
          />
        </div>

        {/* Line Total */}
        <div className="text-right font-mono space-y-0.5 min-w-[120px]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Line Total</span>
          <span className="text-base font-black text-[#FF2ED1] block drop-shadow-[0_0_10px_rgba(255,46,209,0.3)]">
            {formatPhpAmount(convertUsdToPhp(lineTotal))}
          </span>
          <span className="text-xs font-semibold text-[#00D9FF] block">
            {formatUsdAmount(lineTotal)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeItem(item.id)}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
          title="Remove item from allocation cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
