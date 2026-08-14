import React, { useState } from 'react';
import {
  X,
  Printer,
  FileSpreadsheet,
  Edit3,
  RefreshCw,
  Ban,
  User,
  MapPin,
  CreditCard,
  FileText,
  ShieldCheck,
  Layers,
  Package,
  Factory,
  MessageSquare,
  Plus,
  Send,
  ExternalLink,
  Tag,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { OrderDetail, OrderStatus } from '../../../types/order';
import { ConfirmModal } from '../../common/ConfirmModal';
import { calculateItemVials, calculateTotalVials, calculateTotalLabels } from '../../../utils/vialCalculation';
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  ShippingStatusBadge,
  StoreTypeBadge,
} from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';
import { OrderManagementService } from '../../../services/orderManagementService';

interface OrderDetailDrawerProps {
  order: OrderDetail | null;
  onClose: () => void;
  onUpdateStatus: (order: OrderDetail) => void;
  onPrintSlip: (order: OrderDetail) => void;
  onPrintInvoice: (order: OrderDetail) => void;
  onOrderUpdated: (updatedOrder: OrderDetail) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onPrintSlip,
  onPrintInvoice,
  onOrderUpdated,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [courier, setCourier] = useState(order?.courier || '');
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'notes'>('details');
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  if (!order) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setIsSubmittingNote(true);
    try {
      const updated = await OrderManagementService.addAdminNote(
        order.id,
        newNoteText.trim(),
        'Admin Operator'
      );
      onOrderUpdated(updated);
      setNewNoteText('');
    } catch (err) {
      console.error('Error adding admin note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleSaveTracking = async () => {
    try {
      const updated = await OrderManagementService.updateOrder(order.id, {
        trackingNumber: trackingNumber.trim(),
        courier: courier.trim(),
      });
      onOrderUpdated(updated);
      setIsEditingTracking(false);
    } catch (err) {
      console.error('Error saving tracking info:', err);
    }
  };

  const handleExportSingle = () => {
    const exportResult = OrderManagementService.exportOrders([order.id], 'csv');
    OrderManagementService.downloadExport(exportResult);
  };

  const handleCancelOrder = () => {
    setIsCancelConfirmOpen(true);
  };

  const confirmCancelOrder = async () => {
    const updated = await OrderManagementService.updateOrderStatus(
      order.id,
      'CANCELLED',
      'Order cancelled manually by administrator.'
    );
    onOrderUpdated(updated);
    setIsCancelConfirmOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end transition-opacity animate-in fade-in duration-200">
      {/* Drawer Container */}
      <div className="bg-slate-900 border-l border-cyan-500/30 w-full max-w-3xl h-full flex flex-col shadow-2xl relative overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-slate-950/90 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <StoreTypeBadge storeType={order.storeType} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-lg font-bold text-slate-100">
                  {order.referenceNumber}
                </h2>
                <OrderStatusBadge status={order.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Placed on {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Header Ribbon */}
        <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateStatus(order)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono font-medium transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Update Status
            </button>

            <button
              onClick={() => onPrintSlip(order)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono transition-all"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" /> Packing Slip
            </button>

            <button
              onClick={() => onPrintInvoice(order)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono transition-all"
            >
              <FileText className="h-3.5 w-3.5 text-slate-400" /> Invoice
            </button>

            <button
              onClick={handleExportSingle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-slate-700 rounded-lg text-xs font-mono transition-all"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
            </button>
          </div>

          {order.status !== 'CANCELLED' && (
            <button
              onClick={handleCancelOrder}
              className="flex items-center gap-1 px-2.5 py-1.5 text-rose-400 hover:bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs font-mono transition-all ml-auto"
            >
              <Ban className="h-3.5 w-3.5" /> Cancel Order
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 flex items-center gap-4 text-xs font-mono shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2.5 border-b-2 font-semibold transition-all ${
              activeTab === 'details'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Order Overview & Items
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2.5 border-b-2 font-semibold transition-all ${
              activeTab === 'timeline'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Timeline
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2.5 border-b-2 font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Admin Notes ({order.adminNotesList?.length || (order.adminNotes ? 1 : 0)})
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'timeline' && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
              <OrderTimeline order={order} />
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Add Internal Admin Note
                </label>
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Enter internal fulfillment, batch, or ledger verification notes..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !newNoteText.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs rounded-lg disabled:opacity-50 transition-all"
                  >
                    <Send className="h-3.5 w-3.5" /> Save Admin Note
                  </button>
                </div>
              </form>

              {/* Note History List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Internal Audit Log
                </h4>
                {order.adminNotesList && order.adminNotesList.length > 0 ? (
                  order.adminNotesList.map((n) => (
                    <div
                      key={n.id}
                      className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-cyan-400 font-semibold">{n.author}</span>
                        <span className="text-slate-500">
                          {new Date(n.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{n.text}</p>
                    </div>
                  ))
                ) : order.adminNotes ? (
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-3">
                    <p className="text-xs text-slate-300">{order.adminNotes}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No admin notes logged yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <>
              {/* STORE-SPECIFIC INFORMATION CARD */}
              {order.storeType === 'groupbuy' && order.groupBuyData && (
                <div className="bg-cyan-950/30 border border-cyan-500/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <Layers className="h-4 w-4" /> GroupBuy Store Operations
                    </h3>
                    <span className="text-xs font-mono text-cyan-300 font-semibold">
                      Batch #{order.groupBuyData.batchNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Batch Status
                      </span>
                      <span className="font-mono font-bold text-cyan-300">
                        {order.groupBuyData.batchStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Estimated Production
                      </span>
                      <span className="font-mono text-slate-200">
                        {order.groupBuyData.estimatedProduction}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Assigned Vault Batch
                      </span>
                      <span className="font-mono text-cyan-300">
                        {order.assignedBatch || order.groupBuyData.batchNumber}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {order.storeType === 'onhand' && order.onHandData && (
                <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <Package className="h-4 w-4" /> OnHand Vault Logistics
                    </h3>
                    <span className="text-xs font-mono text-emerald-300 font-semibold">
                      Priority: {order.onHandData.dispatchPriority}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Dispatch Priority
                      </span>
                      <span className="font-mono font-bold text-emerald-300">
                        {order.onHandData.dispatchPriority}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Inventory Reservation Status
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        {order.onHandData.inventoryReservationStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {order.storeType === 'moq' && order.moqData && (
                <div className="bg-purple-950/30 border border-purple-500/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                      <Factory className="h-4 w-4" /> MOQ Bulk Campaign Progress
                    </h3>
                    <span className="text-xs font-mono text-purple-300 font-semibold">
                      {order.moqData.manufacturingProgress}% Complete
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>{order.moqData.moqCampaign}</span>
                      <span>{order.moqData.manufacturingProgress}%</span>
                    </div>

                    {/* Manufacturing Progress Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-purple-500/30">
                      <div
                        className="bg-purple-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        style={{ width: `${order.moqData.manufacturingProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CUSTOMER & SHIPPING ADDRESS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Information */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-cyan-400" /> Customer Information
                  </h3>
                  <div className="text-xs space-y-1 pt-1">
                    <div className="font-semibold text-slate-100">{order.customerName || 'N/A'}</div>
                    <div className="text-slate-400 font-mono">{order.customerEmail}</div>
                    {order.customerPhone && (
                      <div className="text-slate-400 font-mono">{order.customerPhone}</div>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" /> Shipping Destination
                  </h3>
                  <div className="text-xs space-y-1 pt-1 text-slate-300">
                    <div className="font-semibold">{order.shippingAddress.recipientName}</div>
                    <div>{order.shippingAddress.addressLine1}</div>
                    {order.shippingAddress.addressLine2 && (
                      <div>{order.shippingAddress.addressLine2}</div>
                    )}
                    <div>
                      {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                      {order.shippingAddress.postalCode}
                    </div>
                    <div className="font-mono text-slate-400">{order.shippingAddress.country}</div>
                  </div>
                </div>
              </div>

              {/* LOGISTICS & DISPATCH INFO */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-cyan-400" /> Dispatch & Courier Tracking
                  </h3>
                  {!isEditingTracking && (
                    <button
                      onClick={() => setIsEditingTracking(true)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                    >
                      <Edit3 className="h-3 w-3" /> Edit Tracking
                    </button>
                  )}
                </div>

                {isEditingTracking ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                        Courier Name
                      </label>
                      <input
                        type="text"
                        value={courier}
                        onChange={(e) => setCourier(e.target.value)}
                        placeholder="e.g. LBC Express"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. LBC-PH-991823"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setIsEditingTracking(false)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveTracking}
                        className="px-3 py-1 text-xs font-bold font-mono bg-cyan-600 hover:bg-cyan-500 text-black rounded"
                      >
                        Save Logistics Info
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Courier
                      </span>
                      <span className="font-semibold text-slate-200">
                        {order.courier || 'Not Assigned'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Waybill / Tracking #
                      </span>
                      <span className="font-mono text-cyan-300 font-semibold">
                        {order.trackingNumber || 'Pending Dispatch'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Est. Delivery
                      </span>
                      <span className="text-slate-300">
                        {order.estimatedDelivery || 'TBD'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* PAYMENT SUMMARY (PREPARED FOR MODULE 4.5) */}
              <div className="bg-slate-950/80 border border-purple-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                  <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" /> Payment Summary
                  </h3>
                  <span className="text-[10px] font-mono text-purple-300/70 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded">
                    Verification managed in Module 4.5
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Payment Method
                    </span>
                    <span className="font-semibold text-slate-200">{order.paymentMethod}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Amount Paid
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      ${(order.paymentSummary?.amount || order.grandTotal).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Reference Code
                    </span>
                    <span className="font-mono text-purple-300">
                      {order.paymentSummary?.paymentReference || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Proof Status
                    </span>
                    <span className="font-mono text-slate-300">
                      {order.paymentSummary?.paymentProofStatus || 'SUBMITTED'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-500/20 flex justify-end">
                  {order.paymentSummary?.paymentReference || order.proofUrl ? (
                    <a
                      href={`/admin/payment-verification?orderId=${encodeURIComponent(order.id)}`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/15 border border-purple-400/40 text-purple-200 hover:bg-purple-500/25 font-mono text-[11px] font-bold"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {order.paymentSummary?.paymentProofStatus === 'VERIFIED' ? 'VIEW VERIFIED PAYMENT' : 'VERIFY PAYMENT'}
                    </a>
                  ) : (
                    <span className="px-3 py-2 rounded-lg border border-slate-700 text-slate-500 font-mono text-[11px] font-bold">
                      NO PAYMENT SUBMITTED
                    </span>
                  )}
                </div>

                {order.proofUrl && (
                  <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Proof Image Uploaded:</span>
                    <a
                      href={order.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      View Payment Proof <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* ORDERED PRODUCTS LIST */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Allocated Products ({order.items.length})
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/20">
                    {order.totalVials ?? calculateTotalVials(order.items)} Vials ({order.totalLabels ?? calculateTotalLabels(order.items)} Labels)
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {order.items.map((item) => {
                    const itemVials = calculateItemVials(item);
                    return (
                      <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-cyan-400 shrink-0 font-bold">
                            {item.purity || 'LAB'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 flex items-center gap-2">
                              <span>{item.name}</span>
                              {item.sellingUnit && (
                                <span className="text-[9px] font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-1.5 py-0.2 rounded border border-[#00D9FF]/20">
                                  {item.sellingUnit === 'kit' ? `PER KIT (${item.vialsPerKit || 10} Vials)` : 'PER VIAL'}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {item.variantLabel} {item.casNumber ? `â€¢ CAS ${item.casNumber}` : ''} â€¢ <span className="text-[#00D9FF] font-bold">{itemVials} Vials</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <div className="text-slate-300 font-medium">
                            {item.quantity} Ã— ${item.price.toFixed(2)}
                          </div>
                          <div className="font-bold text-emerald-400">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing Summary Breakdown */}
                <div className="bg-slate-950 p-4 border-t border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping Cost:</span>
                    <span>${order.shippingFee.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Research Discount:</span>
                      <span>-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-100 text-sm pt-2 border-t border-slate-800">
                    <span>Grand Total:</span>
                    <span className="text-emerald-400">${order.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* CUSTOMER NOTES */}
              {order.orderNotes && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
                  <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Customer Notes
                  </h4>
                  <p className="text-xs text-slate-300 italic">"{order.orderNotes}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Cancel Order Confirm Modal */}
      <ConfirmModal
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={confirmCancelOrder}
        title="Cancel Order"
        message={`Are you sure you want to cancel order ${order.referenceNumber}? This will mark the order status as CANCELLED.`}
        confirmText="Cancel Order"
        cancelText="Back"
        variant="danger"
      />
    </div>
  );
};

