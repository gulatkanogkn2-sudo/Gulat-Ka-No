import React from 'react';
import { Lock, ShieldCheck, Zap, ShoppingBag, ArrowRight, CheckCircle2, Tag, Truck } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CheckoutBreakdownResult } from '../../types/checkout';
import { formatPhpAmount, formatUsdAmount, convertUsdToPhp } from '../../utils/currencyUtils';

interface CheckoutSidebarProps {
  breakdown: CheckoutBreakdownResult;
  items: Array<{
    id: string;
    name: string;
    variantLabel: string;
    quantity: number;
    price: number; // in USD
    storeType: string;
  }>;
  onPlaceOrder: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export const CheckoutSidebar: React.FC<CheckoutSidebarProps> = ({
  breakdown,
  items,
  onPlaceOrder,
  isSubmitting = false,
  className = '',
}) => {
  return (
    <Card variant="glass" className={`p-6 space-y-6 border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 font-mono">
          <ShoppingBag className="w-5 h-5 text-[#00D9FF]" />
          Order Summary
        </h3>
        <span className="text-xs font-mono text-slate-400">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {/* Item List Preview */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
        {items.map((item) => {
          const storeAccent =
            item.storeType === 'onhand'
              ? 'purple'
              : item.storeType === 'moq'
              ? 'magenta'
              : 'cyan';

          const lineUsd = item.price * item.quantity;
          const linePhp = convertUsdToPhp(lineUsd);

          return (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white truncate">{item.name}</span>
                  <Badge variant={storeAccent} className="text-[9px] px-1 py-0 flex-shrink-0">
                    {item.storeType.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {item.variantLabel} × {item.quantity}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-bold text-[#00D9FF] block">
                  {formatPhpAmount(linePhp)}
                </span>
                <span className="text-[10px] text-slate-400 block font-normal">
                  ({formatUsdAmount(lineUsd)})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2.5 font-mono text-xs pt-3 border-t border-white/10">
        {/* Batch Subtotal */}
        <div className="flex justify-between items-center text-slate-300">
          <span className="text-slate-400">Batch Subtotal</span>
          <div className="text-right">
            <span className="font-bold text-white block">
              {formatPhpAmount(breakdown.subtotalPhp || convertUsdToPhp(breakdown.subtotalUsd))}
            </span>
            <span className="text-[10px] text-slate-500 font-normal">
              ({formatUsdAmount(breakdown.subtotalUsd)})
            </span>
          </div>
        </div>

        {/* Shipping Fee */}
        <div className="flex justify-between items-center text-cyan-400">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping ({breakdown.shippingMethodName || 'Standard'})</span>
          </span>
          <div className="text-right">
            <span className="font-bold block">
              {(breakdown.shippingFeePhp || 0) === 0 ? 'FREE' : formatPhpAmount(breakdown.shippingFeePhp || 0)}
            </span>
            <span className="text-[10px] text-cyan-500/70 font-normal">
              ({formatUsdAmount(breakdown.shippingFeeUsd || 0)})
            </span>
          </div>
        </div>

        {/* Applied Configured Store Fees */}
        {breakdown.appliedFees.map((fee) => (
          <div key={fee.feeId} className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 text-[11px] truncate max-w-[200px]">{fee.displayName}</span>
            <div className="text-right">
              <span className={fee.amountUsd === 0 ? 'text-green-400 font-bold block' : 'text-white font-bold block'}>
                {fee.amountUsd === 0 ? 'FREE' : formatPhpAmount(fee.amountPhp || convertUsdToPhp(fee.amountUsd))}
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                ({formatUsdAmount(fee.amountUsd)})
              </span>
            </div>
          </div>
        ))}

        {/* Selected Accessories */}
        {breakdown.accessories.map((acc) => (
          <div key={acc.accessoryId} className="flex justify-between items-center text-slate-300">
            <div className="flex flex-col">
              <span className="text-slate-300 text-[11px] font-bold truncate max-w-[200px]">
                + {acc.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {acc.quantity}× @ {formatPhpAmount(convertUsdToPhp(acc.unitPriceUsd))}
              </span>
            </div>
            <div className="text-right">
              <span className={acc.totalPriceUsd === 0 ? 'text-green-400 font-bold block' : 'text-white font-bold block'}>
                {acc.totalPriceUsd === 0 ? 'INCLUDED' : formatPhpAmount(convertUsdToPhp(acc.totalPriceUsd))}
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                ({formatUsdAmount(acc.totalPriceUsd)})
              </span>
            </div>
          </div>
        ))}

        {/* Campaign Discount */}
        {breakdown.discountUsd > 0 && (
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Campaign Discount</span>
            <div className="text-right">
              <span className="text-green-400 font-bold block">
                -{formatPhpAmount(breakdown.discountPhp || convertUsdToPhp(breakdown.discountUsd))}
              </span>
              <span className="text-[10px] text-green-500/70 font-normal">
                (-{formatUsdAmount(breakdown.discountUsd)})
              </span>
            </div>
          </div>
        )}

        {/* Reward Points */}
        <div className="p-2 rounded-lg bg-[#00D9FF]/5 border border-[#00D9FF]/20 flex justify-between items-center text-[#00D9FF]">
          <span className="flex items-center gap-1.5 font-sans font-medium text-xs">
            <Zap className="w-3.5 h-3.5 fill-[#00D9FF]" />
            GKN Reward Points
          </span>
          <span className="font-mono font-bold">+{breakdown.earnedPoints} PTS</span>
        </div>

        {/* Total Vials & Labels Allocation Badge */}
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-[#00D9FF]/20 flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400">Total Vial Allocation:</span>
          <span className="font-bold text-[#00D9FF]">{breakdown.totalVialsCount} Vials / {breakdown.totalVialsCount} Labels</span>
        </div>

        {/* Grand Total (Primary PHP, Secondary USD) */}
        <div className="pt-3 border-t border-white/10 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Grand Total</span>
            <span className="text-[10px] text-slate-500 font-mono block">PHP / USD Settlement</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#00D9FF] tracking-tight block">
              {formatPhpAmount(breakdown.grandTotalPhp)}
            </span>
            <span className="text-xs font-bold text-slate-400 block font-mono">
              ({formatUsdAmount(breakdown.grandTotalUsd)} USD)
            </span>
          </div>
        </div>
      </div>

      {/* Submit Order Button */}
      <div className="pt-2 space-y-2">
        <Button
          variant="cyan"
          size="lg"
          onClick={onPlaceOrder}
          disabled={isSubmitting || items.length === 0}
          className="w-full font-mono text-xs font-bold uppercase tracking-wider py-4 shadow-[0_0_25px_rgba(0,217,255,0.3)] hover:shadow-[0_0_35px_rgba(0,217,255,0.5)] cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Verifying & Allocating Order...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Submit & Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>

        <p className="text-[10px] font-mono text-center text-slate-400 pt-1">
          By clicking Place Order, your batch allocation is reserved for 24 hours pending verification.
        </p>
      </div>

      {/* Trust guarantees */}
      <div className="pt-4 border-t border-white/5 space-y-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 text-green-400">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Verified Batch Allocation Guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-[#00D9FF] flex-shrink-0" />
          <span>Automated SMS / Email Order Tracking</span>
        </div>
      </div>
    </Card>
  );
};

