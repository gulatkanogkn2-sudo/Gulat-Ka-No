import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { StoreType } from '../../types';
import { convertUsdToPhp, formatPhpAmount, formatUsdAmount } from '../../utils/currencyUtils';

interface StoreCartSummaryProps {
  storeType: StoreType;
  className?: string;
}

export const StoreCartSummary: React.FC<StoreCartSummaryProps> = ({ storeType, className = '' }) => {
  const { getCartForStore, openDrawer } = useCart();
  const navigate = useNavigate();

  const normalizedStore = (storeType && typeof storeType === 'string') ? (storeType.toLowerCase() as StoreType) : 'groupbuy';
  const summary = getCartForStore(normalizedStore);
  const { items, subtotal, itemCount } = summary;

  const storeMeta: Record<
    string,
    { label: string; storeName: string; accentColor: string; borderColor: string; bgBadge: string; checkoutUrl: string }
  > = {
    groupbuy: {
      label: 'GROUPBUY CART',
      storeName: 'GroupBuy',
      accentColor: '#00D9FF',
      borderColor: 'border-[#00D9FF]/30 hover:border-[#00D9FF]/60',
      bgBadge: 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30',
      checkoutUrl: '/checkout?store=groupbuy',
    },
    onhand: {
      label: 'ONHAND CART',
      storeName: 'OnHand',
      accentColor: '#8B5CF6',
      borderColor: 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60',
      bgBadge: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30',
      checkoutUrl: '/checkout?store=onhand',
    },
    moq: {
      label: 'MOQ CART',
      storeName: 'MOQ',
      accentColor: '#FF2ED1',
      borderColor: 'border-[#FF2ED1]/30 hover:border-[#FF2ED1]/60',
      bgBadge: 'bg-[#FF2ED1]/10 text-[#FF2ED1] border-[#FF2ED1]/30',
      checkoutUrl: '/checkout?store=moq',
    },
  };

  const meta = storeMeta[normalizedStore] || storeMeta.groupbuy;
  const phpSubtotal = convertUsdToPhp(subtotal);

  if (items.length === 0) {
    return (
      <div
        className={`p-4 rounded-xl bg-[#070B14]/80 border ${meta.borderColor} backdrop-blur-md font-mono text-xs transition-all ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4" style={{ color: meta.accentColor }} />
            <span className="font-bold text-white uppercase tracking-wider">{meta.label}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-mono">
              0 Products
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Your {meta.storeName} cart is empty.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl bg-[#070B14]/95 border ${meta.borderColor} shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-md space-y-4 transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
        <div className="flex items-center gap-2.5">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: meta.accentColor }} />
          <h3 className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">{meta.label}</h3>
          <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border ${meta.bgBadge}`}>
            {itemCount} {itemCount === 1 ? 'PRODUCT' : 'PRODUCTS'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:inline-block">
          Active Store Cart
        </span>
      </div>

      {/* Product Items List */}
      <div className="space-y-2 font-mono text-xs max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
        {items.map((item) => {
          const itemPhp = convertUsdToPhp(item.price * item.quantity);
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-black/50 border border-white/5 gap-2 hover:border-white/10 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-white font-bold text-xs sm:text-sm truncate">{item.name}</p>
                {item.variantLabel && (
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.variantLabel}</p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <span className="text-xs font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Qty: {item.quantity}
                </span>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    {formatPhpAmount(itemPhp)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {formatUsdAmount(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtotal & Action Controls */}
      <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono">
        <div>
          <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider block">SUBTOTAL</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-white">{formatPhpAmount(phpSubtotal)}</span>
            <span className="text-xs font-semibold text-slate-400">({formatUsdAmount(subtotal)})</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:w-auto">
          <button
            type="button"
            onClick={() => openDrawer(normalizedStore)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-slate-200 transition-all cursor-pointer whitespace-nowrap text-center tracking-wider"
          >
            VIEW CART
          </button>
          <button
            type="button"
            onClick={() => navigate(meta.checkoutUrl)}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold text-black transition-all shadow-[0_0_15px_rgba(0,217,255,0.3)] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap tracking-wider"
            style={{ backgroundColor: meta.accentColor }}
          >
            <span>CHECKOUT</span>
            <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
