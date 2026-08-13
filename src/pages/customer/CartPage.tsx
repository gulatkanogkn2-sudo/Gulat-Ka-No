import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Button } from '../../components/common/Button';
import { CartItem } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { EmptyCart } from '../../components/cart/EmptyCart';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, Trash2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { StoreType } from '../../types';

export const CartPage: React.FC = () => {
  const { items, clearCart, totalItemCount, activeStore, setActiveStore, getItemCountForStore, allCartsTotalCount } = useCart();
  const navigate = useNavigate();

  return (
    <PageContainer
      title="Allocation Cart"
      description={`Review and manage staged allocations across independent store carts.`}
      actions={
        <div className="flex items-center gap-3">
          <Link to={`/${activeStore}`}>
            <Button variant="outline" size="sm" className="border-white/20 text-slate-300 hover:bg-white/10 text-xs font-mono">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Continue Shopping
            </Button>
          </Link>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearCart(activeStore)}
              className="text-slate-400 hover:text-red-400 text-xs font-mono"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear Store Cart
            </Button>
          )}
        </div>
      }
    >
      {/* Store Navigation Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#090D16] border border-white/10 font-mono text-xs">
        {(['groupbuy', 'onhand', 'moq'] as StoreType[]).map((st) => {
          const count = getItemCountForStore(st);
          const isActive = activeStore === st;
          const labelMap: Record<string, string> = {
            groupbuy: 'GroupBuy Store Cart',
            onhand: 'OnHand Store Cart',
            moq: 'MOQ Store Cart',
          };
          return (
            <button
              key={st}
              onClick={() => setActiveStore(st)}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/50 font-bold shadow-[0_0_12px_rgba(0,217,255,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{labelMap[st]}</span>
              <span
                className={`px-2 py-0.5 text-[11px] rounded-full font-bold ${
                  isActive ? 'bg-[#00D9FF] text-black' : 'bg-white/10 text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Line Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Staged Line Items ({items.length})
              </span>
              <span className="text-xs font-mono text-[#00D9FF]">
                Order Staged ({activeStore.toUpperCase()})
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Bottom Actions Row for Cart items list */}
            <div className="pt-4 flex items-center justify-between border-t border-white/5">
              <Link
                to={`/${activeStore}`}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#00D9FF] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Add More {activeStore.toUpperCase()} Allocations</span>
              </Link>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="hidden sm:inline">Order Allocation Staged</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Promo Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-20">
              <CartSummary />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
