import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Tag, Zap, Lock, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { convertUsdToPhp, formatPhpAmount, formatUsdAmount } from '../../utils/currencyUtils';

interface CartSummaryProps {
  className?: string;
  onProceedToCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ className = '', onProceedToCheckout }) => {
  const navigate = useNavigate();
  const { subtotal, estimatedShipping, estimatedDiscount, earnedPoints, grandTotal, items, activeStore } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === 'GKN2026' || promoCode.trim().toUpperCase() === 'VIP50') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid campaign promo code');
    }
  };

  const isCartEmpty = items.length === 0;

  return (
    <Card variant="glass" className={`p-6 space-y-6 border-white/10 ${className}`}>
      {/* Summary Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#00D9FF]" />
          Order Summary
        </h3>
        <span className="text-xs font-mono text-slate-400">
          {items.length} {items.length === 1 ? 'Line Item' : 'Line Items'}
        </span>
      </div>

      {/* Financial Breakdown Table */}
      <div className="space-y-3 font-mono text-xs">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-slate-300">
          <span className="text-slate-400">Subtotal</span>
          <div className="text-right">
            <span className="font-bold text-[#FF2ED1] text-sm block">{formatPhpAmount(convertUsdToPhp(subtotal))}</span>
            <span className="text-[10px] text-[#00D9FF] block">{formatUsdAmount(subtotal)}</span>
          </div>
        </div>

        {/* Estimated Shipping */}
        <div className="flex justify-between items-center text-slate-300">
          <span className="text-slate-400 flex items-center gap-1">
            Est. Shipping & Delivery
            <span className="text-[10px] text-slate-500 hover:text-slate-300" title="Standard dispatch packaging">(Standard)</span>
          </span>
          <span className="text-white">${estimatedShipping.toFixed(2)}</span>
        </div>

        {/* Promo Discount */}
        <div className="flex justify-between items-center text-slate-300">
          <span className="text-slate-400">Campaign Discount</span>
          <span className={promoApplied ? 'text-green-400 font-bold' : 'text-slate-400'}>
            {promoApplied ? '-$15.00 (VIP Promo)' : `-$${estimatedDiscount.toFixed(2)}`}
          </span>
        </div>

        {/* Earned GKN Points */}
        <div className="p-2.5 rounded-lg bg-[#00D9FF]/5 border border-[#00D9FF]/20 flex justify-between items-center text-[#00D9FF]">
          <span className="flex items-center gap-1.5 font-sans font-medium text-xs">
            <Zap className="w-3.5 h-3.5 fill-[#00D9FF]" />
            GKN Reward Points
          </span>
          <span className="font-mono font-bold">+{earnedPoints} PTS</span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-white/10 flex justify-between items-end">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-white block">Grand Total</span>
            <span className="text-[10px] text-slate-400 block font-normal">Includes tax & dispatch staging</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#FF2ED1] tracking-tight block drop-shadow-[0_0_12px_rgba(255,46,209,0.3)]">
              {formatPhpAmount(convertUsdToPhp(promoApplied ? Math.max(0, grandTotal - 15) : grandTotal))}
            </span>
            <span className="text-xs font-semibold text-[#00D9FF] block">
              {formatUsdAmount(promoApplied ? Math.max(0, grandTotal - 15) : grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-white/5">
        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          Campaign Promo Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setPromoError('');
              }}
              placeholder="Enter code (e.g. GKN2026)"
              className="w-full bg-[#090D16] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
              disabled={promoApplied}
            />
          </div>
          <button
            type="submit"
            disabled={promoApplied || !promoCode.trim()}
            className="px-3.5 py-2 rounded-lg bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {promoApplied ? 'Applied' : 'Apply'}
          </button>
        </div>
        {promoError && <p className="text-[11px] text-red-400 font-mono">{promoError}</p>}
        {promoApplied && <p className="text-[11px] text-green-400 font-mono">✓ Code GKN2026 applied (-$15.00)</p>}
      </form>

      {/* Primary Action Button: Proceed to Checkout */}
      <div className="space-y-2 pt-2">
        <Button
          variant="cyan"
          size="lg"
          disabled={isCartEmpty}
          onClick={() => {
            if (onProceedToCheckout) {
              onProceedToCheckout();
            } else {
              navigate(`/checkout?store=${activeStore}`);
            }
          }}
          className="w-full font-mono text-xs font-bold uppercase tracking-wider py-3.5 shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)]"
        >
          <Lock className="w-4 h-4 mr-2" />
          <span>Proceed to Order Allocation</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 pt-1">
          <Info className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>No payment charged until allocation review</span>
        </div>
      </div>

      {/* Security Assurance */}
      <div className="pt-4 border-t border-white/5 space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-300 font-mono">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>256-Bit SSL Encrypted Allocation</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          Batch allocation records managed securely.
        </p>
      </div>
    </Card>
  );
};
