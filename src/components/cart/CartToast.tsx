import React, { useEffect } from 'react';
import { ShoppingBag, ArrowRight, X, Check } from 'lucide-react';
import { StoreType } from '../../types';

export interface ToastNotification {
  id: string;
  message: string;
  productName: string;
  storeType: StoreType;
}

interface CartToastProps {
  toast: ToastNotification | null;
  onClose: () => void;
  onViewCart: (storeType: StoreType) => void;
}

export const CartToast: React.FC<CartToastProps> = ({ toast, onClose, onViewCart }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const storeLabels: Record<string, string> = {
    groupbuy: 'GroupBuy',
    onhand: 'OnHand',
    moq: 'MOQ',
  };

  const storeLabel = storeLabels[toast.storeType.toLowerCase()] || 'Store';

  const storeAccentColors: Record<string, string> = {
    groupbuy: '#00D9FF',
    onhand: '#8B5CF6',
    moq: '#FF2ED1',
  };

  const accentColor = storeAccentColors[toast.storeType.toLowerCase()] || '#00D9FF';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full px-4 animate-slideInRight">
      <div
        className="p-3.5 sm:p-4 rounded-xl bg-[#050810]/95 border shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center justify-between gap-3"
        style={{ borderColor: `${accentColor}60` }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            <Check className="w-5 h-5 stroke-[3]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-white">
              <span className="truncate">{toast.productName}</span>
            </div>
            <p className="text-[10px] font-mono text-slate-300">
              Added to <span className="font-bold" style={{ color: accentColor }}>{storeLabel} Cart</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 font-mono">
          <button
            type="button"
            onClick={() => {
              onViewCart(toast.storeType);
              onClose();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3 h-3 text-[#00D9FF]" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
