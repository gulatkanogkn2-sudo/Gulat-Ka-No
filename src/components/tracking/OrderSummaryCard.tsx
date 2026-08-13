import React, { useState } from 'react';
import { OrderDetail } from '../../types/order';
import { PaymentStatusBadge } from './OrderStatusBadge';
import { MapPin, CreditCard, Truck, ShieldCheck, Eye, X, FileText } from 'lucide-react';
import { formatPhpAmount, formatUsdAmount, convertUsdToPhp } from '../../utils/currencyUtils';
import { OrderReceiptModal } from '../receipt/OrderReceiptModal';

interface OrderSummaryCardProps {
  order: OrderDetail;
  className?: string;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  order,
  className = '',
}) => {
  const [showProofModal, setShowProofModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const rate = order.exchangeRateUsed || convertUsdToPhp(1);
  const toPhp = (usd: number) => usd * rate;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 0. Primary Action: View Official Receipt */}
      <button
        type="button"
        onClick={() => setShowReceiptModal(true)}
        className="w-full py-3 px-4 rounded-2xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/40 text-[#00D9FF] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,217,255,0.15)] cursor-pointer"
      >
        <FileText className="w-4 h-4" />
        <span>View Official Receipt</span>
      </button>
      {/* 1. Destination Shipping Address */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D16]/90 border border-white/10 space-y-3 font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#00D9FF]" />
            Shipping Destination
          </h4>
          <span className="text-[10px] text-slate-400">Secure Container</span>
        </div>

        <div className="text-xs space-y-1 text-slate-300">
          <p className="font-bold text-white">{order.shippingAddress.recipientName}</p>
          <p className="text-slate-400">{order.shippingAddress.phone}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && (
            <p className="text-slate-400">{order.shippingAddress.addressLine2}</p>
          )}
          <p className="text-slate-400">
            {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>
      </div>

      {/* 2. Settlement & Payment Information */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D16]/90 border border-white/10 space-y-3 font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#8B5CF6]" />
            Settlement Method
          </h4>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Method:</span>
            <span className="font-bold text-white">{order.paymentMethod}</span>
          </div>

          {order.proofUrl && (
            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <span className="text-slate-400 text-[11px]">Payment Proof Image:</span>
              <button
                type="button"
                onClick={() => setShowProofModal(true)}
                className="px-2.5 py-1 rounded bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Staged Receipt</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Courier & Tracking Details */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D16]/90 border border-white/10 space-y-3 font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#FF2ED1]" />
            Courier & Logistics
          </h4>
          <span className="text-[10px] text-slate-400">Active Waybill</span>
        </div>

        <div className="space-y-2 text-xs">
          {order.assignedBatch || order.groupBuyData?.batchNumber || (order.moqData as any)?.batchNumber ? (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Batch Number:</span>
              <span className="font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/30">
                {order.assignedBatch || order.groupBuyData?.batchNumber || (order.moqData as any)?.batchNumber}
              </span>
            </div>
          ) : null}

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Carrier:</span>
            <span className="font-bold text-white">{order.courier || 'LBC Express'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Waybill No.:</span>
            <span className="font-mono font-bold text-[#00D9FF] bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {order.trackingNumber || 'STAGING_PENDING'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Est. Arrival:</span>
            <span className="text-slate-200 font-bold">{order.estimatedDelivery || '24-48 Hours'}</span>
          </div>
        </div>
      </div>

      {/* 4. Financial Order Totals */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D16]/90 border border-[#00D9FF]/30 space-y-2.5 font-mono">
        <div className="flex justify-between items-center text-xs text-slate-300">
          <span className="text-slate-400">Subtotal</span>
          <div className="text-right">
            <span className="font-bold text-white">{formatPhpAmount(toPhp(order.subtotal))}</span>
            <span className="text-[10px] text-slate-400 block">{formatUsdAmount(order.subtotal)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-300">
          <span className="text-slate-400">Shipping Fee</span>
          <div className="text-right">
            <span className="text-white font-bold">{formatPhpAmount(toPhp(order.shippingFee))}</span>
            <span className="text-[10px] text-slate-400 block">{formatUsdAmount(order.shippingFee)}</span>
          </div>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between items-center text-xs text-green-400">
            <span>Campaign Discount</span>
            <div className="text-right">
              <span className="font-bold">-{formatPhpAmount(toPhp(order.discount))}</span>
              <span className="text-[10px] text-green-300 block">(-{formatUsdAmount(order.discount)})</span>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-white/10 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-white block">Grand Total</span>
            <span className="text-[9px] text-slate-400 block">PHP Primary / USD Secondary</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-[#00D9FF] tracking-tight block">
              {formatPhpAmount(toPhp(order.grandTotal))}
            </span>
            <span className="text-xs text-slate-400 block">{formatUsdAmount(order.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Proof Modal */}
      {showProofModal && order.proofUrl && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#090D16] border border-[#00D9FF]/40 p-5 rounded-2xl max-w-lg w-full space-y-4 relative shadow-[0_0_30px_rgba(0,217,255,0.2)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold font-mono text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />
                Uploaded Payment Proof Screenshot
              </span>
              <button
                onClick={() => setShowProofModal(false)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 max-h-96 flex items-center justify-center bg-black">
              <img
                src={order.proofUrl}
                alt="Payment proof receipt"
                className="max-h-80 w-auto object-contain"
              />
            </div>

            <p className="text-[10px] font-mono text-slate-400 text-center">
              Image staged for ledger clearing officer in Phase 3 Admin verification.
            </p>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {showReceiptModal && (
        <OrderReceiptModal order={order} onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};
