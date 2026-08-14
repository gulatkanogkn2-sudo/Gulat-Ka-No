import React from 'react';
import { OrderItem } from '../../types/order';
import { Badge } from '../common/Badge';
import { Package, ShieldCheck, TestTube } from 'lucide-react';
import { calculateItemVials, calculateTotalVials } from '../../utils/vialCalculation';

interface OrderProductsTableProps {
  items: OrderItem[];
  className?: string;
}

export const OrderProductsTable: React.FC<OrderProductsTableProps> = ({
  items,
  className = '',
}) => {
  return (
    <div className={`p-4 sm:p-6 rounded-2xl bg-[#090D16]/90 border border-white/10 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Package className="w-4 h-4 text-[#00D9FF]" />
          Order Items ({items.length})
        </h3>
        <span className="text-xs font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2.5 py-1 rounded border border-[#00D9FF]/20">
          Total: {calculateTotalVials(items)} Vials
        </span>
      </div>

      <div className="divide-y divide-white/5">
        {items.map((item) => {
          const storeAccent =
            item.storeType === 'onhand'
              ? 'purple'
              : item.storeType === 'moq'
              ? 'magenta'
              : 'cyan';

          return (
            <div key={item.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white tracking-tight">{item.name}</span>
                  <Badge variant={storeAccent} className="text-[9px] px-1.5 py-0">
                    {item.storeType.toUpperCase()}
                  </Badge>
                  {item.purity && (
                    <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {item.purity}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Variant: <strong className="text-slate-200">{item.variantLabel}</strong></span>
                  {item.casNumber && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <TestTube className="w-3 h-3" />
                      CAS: {item.casNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 border-white/5 pt-2 sm:pt-0">
                <div className="text-left sm:text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Unit Price</span>
                  <span className="text-slate-200">${item.price.toFixed(2)}</span>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Qty</span>
                  <span className="text-white font-bold">{item.quantity}</span>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Subtotal</span>
                  <span className="text-[#00D9FF] font-bold text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

