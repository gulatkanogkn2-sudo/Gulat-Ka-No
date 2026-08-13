import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Copy, Check, ArrowRight, Truck, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { OrderSubmissionResult } from '../../types/checkout';
import { OrderDetail } from '../../types/order';
import { OrderService } from '../../services/orderService';
import { OrderReceiptModal } from '../receipt/OrderReceiptModal';

interface SuccessModalProps {
  orderResult: OrderSubmissionResult;
  onClose?: () => void;
  className?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  orderResult,
  onClose,
  className = '',
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadOrder = async () => {
      try {
        const found = await OrderService.getOrderByReference(orderResult.referenceNumber);
        if (isMounted && found) {
          setOrderDetail(found);
        }
      } catch (err) {
        console.error('Error fetching order for receipt:', err);
      }
    };
    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [orderResult.referenceNumber]);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(orderResult.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print">
        <Card
          variant="glass"
          className={`w-full max-w-xl p-6 sm:p-8 space-y-6 text-center border-[#00D9FF]/40 shadow-[0_0_50px_rgba(0,217,255,0.25)] relative overflow-hidden ${className}`}
        >
          {/* Glow ambient background */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#00D9FF]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Success Icon Badge */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-[#00D9FF]/20 rounded-2xl blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-[#090D16] border-2 border-[#00D9FF] flex items-center justify-center text-[#00D9FF] shadow-[0_0_25px_rgba(0,217,255,0.4)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>

          {/* Title & Message */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Order Received Successfully
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-mono">
              Your order has been submitted and registered in the GKN ledger.
            </p>
          </div>

          {/* Reference & Payment Status Box */}
          <div className="p-4 rounded-xl bg-[#090D16] border border-white/10 space-y-3 text-left font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Order Reference:</span>
              <span className="text-sm font-black text-[#00D9FF] tracking-wider">
                {orderResult.referenceNumber}
              </span>
              <button
                onClick={handleCopyRef}
                className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                title="Copy Reference Number"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Payment Status:</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                Pending Verification
              </span>
            </div>
          </div>

          {/* Action Buttons including VIEW RECEIPT */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {orderDetail && (
              <Button
                variant="cyan"
                size="md"
                onClick={() => setShowReceipt(true)}
                className="w-full sm:w-auto font-mono text-xs font-bold uppercase tracking-wider py-3"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span>View Receipt</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={() => {
                if (onClose) onClose();
                navigate('/order-tracker');
              }}
              className="w-full sm:w-auto font-mono text-xs text-slate-300 border-white/20 hover:bg-white/10 py-3"
            >
              <Truck className="w-4 h-4 mr-2" />
              <span>Track Order Status</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => {
                if (onClose) onClose();
                navigate('/groupbuy');
              }}
              className="w-full sm:w-auto font-mono text-xs text-slate-300 border-white/20 hover:bg-white/10 py-3"
            >
              <span>Continue Shopping</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Receipt Modal Trigger */}
      {showReceipt && orderDetail && (
        <OrderReceiptModal order={orderDetail} onClose={() => setShowReceipt(false)} />
      )}
    </>
  );
};

