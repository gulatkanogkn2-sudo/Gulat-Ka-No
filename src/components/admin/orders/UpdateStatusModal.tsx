import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle } from 'lucide-react';
import { OrderDetail, OrderStatus } from '../../../types/order';
import { ALL_ORDER_STATUSES, ORDER_STATUS_DETAILS } from '../../../services/orderManagementService';
import { OrderStatusBadge } from './OrderStatusBadge';

interface UpdateStatusModalProps {
  order: OrderDetail | null;
  onClose: () => void;
  onConfirm: (orderId: string, status: OrderStatus, noteText: string) => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  order,
  onClose,
  onConfirm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order?.status || 'PENDING'
  );
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(order.id, selectedStatus, noteText.trim());
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-amber-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
              Update Order Status
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Order Identifier */}
        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <div>
            <div className="font-mono font-bold text-cyan-400">{order.referenceNumber}</div>
            <div className="text-[10px] text-slate-400 font-mono">{order.customerName}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-mono">Current Status</div>
            <OrderStatusBadge status={order.status} size="sm" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 font-semibold">
              Select Target Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {ALL_ORDER_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')} — {ORDER_STATUS_DETAILS[st]?.label || st}
                </option>
              ))}
            </select>
            {ORDER_STATUS_DETAILS[selectedStatus] && (
              <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
                ℹ️ {ORDER_STATUS_DETAILS[selectedStatus].description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1 font-semibold">
              Internal Admin Note (Optional)
            </label>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Payment verified via BPI online. Allocation assigned to vault..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold font-mono bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-all shadow-lg"
            >
              Confirm Status Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
