import React from 'react';
import { OrderDetail } from '../../types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Badge } from '../common/Badge';
import { Calendar, Share2, ArrowLeft, ShieldCheck, FileText, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrackingHeaderProps {
  order: OrderDetail;
  className?: string;
}

export const TrackingHeader: React.FC<TrackingHeaderProps> = ({ order, className = '' }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `GKN Order Tracker - ${order.referenceNumber}`,
        text: `Track allocation status for ${order.referenceNumber}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tracking link copied to clipboard!');
    }
  };

  const storeAccent =
    order.storeType === 'onhand'
      ? 'purple'
      : order.storeType === 'moq'
      ? 'magenta'
      : 'cyan';

  const formattedDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const batchNumber =
    order.assignedBatch ||
    order.groupBuyData?.batchNumber ||
    (order.moqData as any)?.batchNumber;

  return (
    <div className={`p-6 rounded-2xl bg-[#090D16]/90 border border-[#00D9FF]/30 space-y-4 ${className}`}>
      {/* Top Action & Portal Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <Link
          to="/order-tracker"
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>Back to Tracker Search</span>
        </Link>

        <div className="flex items-center gap-2">
          {batchNumber && (
            <span className="text-xs font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2.5 py-0.5 rounded-lg border border-[#00D9FF]/30 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Batch: {batchNumber}</span>
            </span>
          )}

          <Badge variant={storeAccent} className="text-[10px] px-2 py-0.5">
            {order.storeType.toUpperCase()} PORTAL
          </Badge>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Share Tracking Link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reference & Status Title Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
              {order.referenceNumber}
            </h1>
            <OrderStatusBadge status={order.status} glow={true} />
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Placed: {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-green-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Order
            </span>
          </div>
        </div>

        {order.orderNotes && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs font-mono text-slate-300 max-w-sm">
            <span className="text-[10px] text-[#00D9FF] font-bold block flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Special Delivery Note:
            </span>
            <p className="text-[11px] text-slate-400 line-clamp-2">{order.orderNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
