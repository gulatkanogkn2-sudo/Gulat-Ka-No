import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderDetail } from '../../types/order';
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { ArrowRight, Package, Calendar, MapPin, FileText, Layers } from 'lucide-react';
import { formatPhpAmount, formatUsdAmount, convertUsdToPhp } from '../../utils/currencyUtils';
import { OrderReceiptModal } from '../receipt/OrderReceiptModal';

interface TrackingResultProps {
  order: OrderDetail;
  className?: string;
}

export const TrackingResult: React.FC<TrackingResultProps> = ({ order, className = '' }) => {
  const [showReceipt, setShowReceipt] = useState(false);

  const storeAccent =
    order.storeType === 'onhand'
      ? 'purple'
      : order.storeType === 'moq'
      ? 'magenta'
      : 'cyan';

  const formattedDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const rate = order.exchangeRateUsed || convertUsdToPhp(1);
  const phpGrandTotal = order.grandTotal * rate;

  // Extract real batch number if available
  const batchNumber =
    order.assignedBatch ||
    order.groupBuyData?.batchNumber ||
    (order.moqData as any)?.batchNumber;

  return (
    <>
      <Card
        variant="glass"
        className={`p-5 border-white/10 hover:border-[#00D9FF]/40 transition-all space-y-4 group flex flex-col justify-between ${className}`}
      >
        <div className="space-y-4">
          {/* Top Bar: Reference, Store Badge, Batch & Status */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-black font-mono text-white tracking-wider group-hover:text-[#00D9FF] transition-colors">
                {order.referenceNumber}
              </span>
              <Badge variant={storeAccent} className="text-[9px] px-1.5 py-0">
                {order.storeType.toUpperCase()}
              </Badge>

              {/* Real Batch Number (displayed only if batch exists) */}
              {batchNumber && (
                <span className="text-[10px] font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/30 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>Batch: {batchNumber}</span>
                </span>
              )}
            </div>

            <OrderStatusBadge status={order.status} glow={false} />
          </div>

          {/* Middle: Items summary & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                <Package className="w-3 h-3 text-[#00D9FF]" />
                Products ({order.items.length})
              </span>
              <p className="font-bold text-white truncate">
                {order.items.map((i) => `${i.name} (${i.quantity}x)`).join(', ')}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Destination
              </span>
              <p className="text-slate-300 truncate">
                {order.shippingAddress.city}, {order.shippingAddress.province}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Date, Grand Total & Consistent Action Buttons */}
        <div className="pt-3 border-t border-white/5 space-y-3 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formattedDate}
            </span>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-left">
              <span className="text-sm font-black text-[#00D9FF] block leading-tight">
                {formatPhpAmount(phpGrandTotal)}
              </span>
              <span className="text-[10px] text-slate-400 block font-semibold">
                {formatUsdAmount(order.grandTotal)}
              </span>
            </div>

            {/* Receipt & Details Action Buttons — Standardized height & alignment */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowReceipt(true)}
                className="h-9 min-w-[95px] px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20 font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="View Receipt"
              >
                <FileText className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Receipt</span>
              </button>

              <Link
                to={`/order/${order.referenceNumber}`}
                className="h-9 min-w-[95px] px-3.5 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF] text-[#00D9FF] hover:text-black border border-[#00D9FF]/30 font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Receipt Modal Trigger */}
      {showReceipt && <OrderReceiptModal order={order} onClose={() => setShowReceipt(false)} />}
    </>
  );
};


