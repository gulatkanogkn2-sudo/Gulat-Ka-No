import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Trash2, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { Button } from '../common/Button';
import { convertUsdToPhp, formatPhpAmount, formatUsdAmount } from '../../utils/currencyUtils';
import { StoreType } from '../../types';

export const CartDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, activeStore, setActiveStore, items, subtotal, totalItemCount, getItemCountForStore, clearCart } = useCart();
  const navigate = useNavigate();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#050810] border-l border-white/10 shadow-2xl flex flex-col justify-between animate-slideInRight">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF]">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Allocation Cart</h2>
                <p className="text-[11px] font-mono text-slate-400">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} staged
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={() => clearCart(activeStore)}
                  className="p-1.5 text-xs font-mono text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1"
                  title="Clear all cart items"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              <button
                onClick={closeDrawer}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Store Selector Tabs for Multi-Store Isolated Carts */}
          <div className="flex items-center gap-1.5 p-2 bg-black/60 border-b border-white/10 font-mono text-xs">
            {(['groupbuy', 'onhand', 'moq'] as StoreType[]).map((st) => {
              const count = getItemCountForStore(st);
              const isActive = activeStore === st;
              const label = st === 'groupbuy' ? 'GroupBuy' : st === 'onhand' ? 'OnHand' : 'MOQ';
              return (
                <button
                  key={st}
                  onClick={() => setActiveStore(st)}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/50 font-bold shadow-[0_0_8px_rgba(0,217,255,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span>{label}</span>
                  {count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                        isActive ? 'bg-[#00D9FF] text-black' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Cart Item Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    No active batch allocations staged in your session yet.
                  </p>
                </div>
                <Button
                  variant="cyan"
                  size="sm"
                  onClick={() => {
                    closeDrawer();
                    navigate('/groupbuy');
                  }}
                  className="font-mono text-xs"
                >
                  Browse Store Portals
                </Button>
              </div>
            ) : (
              items.map((item) => <CartItem key={item.id} item={item} compact />)
            )}
          </div>

          {/* Footer Summary & Action Buttons */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-white/10 bg-[#090D16] space-y-4">
              {/* Subtotal Display */}
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Estimated Subtotal</span>
                <div className="text-right">
                  <div className="text-xl font-black text-[#FF2ED1] drop-shadow-[0_0_8px_rgba(255,46,209,0.3)]">
                    {formatPhpAmount(convertUsdToPhp(subtotal))}
                  </div>
                  <div className="text-xs font-semibold text-[#00D9FF]">
                    {formatUsdAmount(subtotal)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {/* View Full Cart Button */}
                <Button
                  variant="cyan"
                  size="md"
                  onClick={() => {
                    closeDrawer();
                    navigate('/cart');
                  }}
                  className="w-full font-mono text-xs font-bold uppercase tracking-wider justify-between"
                >
                  <span>View Full Cart ({items.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate(`/checkout?store=${activeStore}`);
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-xs font-mono font-bold text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>

              {/* Security Tag */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                <span>Encrypted Batch Reservation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
