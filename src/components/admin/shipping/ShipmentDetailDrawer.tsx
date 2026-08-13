import React, { useState } from 'react';
import {
  X,
  Truck,
  Package,
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Printer,
  FileText,
  User,
  Mail,
  Phone,
  Layers,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { ShipmentRecord, ShippingStatus, PackingWorkspaceData } from '../../../types/shipping';
import { ShippingManagementService } from '../../../services/shippingManagementService';
import { PackingWorkspacePanel } from './PackingWorkspacePanel';
import { ShippingTimelineVisualizer } from './ShippingTimelineVisualizer';

interface ShipmentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: ShipmentRecord | null;
  onOpenAssignTrackingModal: () => void;
  onOpenUpdateStatusModal: () => void;
  onOpenPackingSlipModal: () => void;
  onOpenLabelModal: () => void;
  onSuccess: (msg: string) => void;
}

export const ShipmentDetailDrawer: React.FC<ShipmentDetailDrawerProps> = ({
  isOpen,
  onClose,
  shipment,
  onOpenAssignTrackingModal,
  onOpenUpdateStatusModal,
  onOpenPackingSlipModal,
  onOpenLabelModal,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'packing' | 'timeline' | 'notes'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!isOpen || !shipment) return null;

  const getStatusBadgeClass = (status: ShippingStatus) => {
    switch (status) {
      case 'PENDING_PACKING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'PACKING':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'READY_FOR_PICKUP':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'PICKED_UP':
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'DELIVERY_FAILED':
      case 'RETURNED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleCopyAddress = () => {
    const addr = `${shipment.shippingAddress.fullName}\n${shipment.shippingAddress.addressLine1}${
      shipment.shippingAddress.addressLine2 ? ', ' + shipment.shippingAddress.addressLine2 : ''
    }\n${shipment.shippingAddress.city}, ${shipment.shippingAddress.stateProvince} ${shipment.shippingAddress.postalCode}\n${shipment.shippingAddress.country}\nPhone: ${shipment.shippingAddress.phone}`;
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setAddingNote(true);
    try {
      await ShippingManagementService.addInternalNote(shipment.id, newNoteText.trim(), 'Admin User');
      setNewNoteText('');
      onSuccess('Internal shipping note added.');
    } catch (err: any) {
      alert(err.message || 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleUpdatePackingData = async (updated: Partial<PackingWorkspaceData>) => {
    try {
      await ShippingManagementService.updatePackingWorkspace(shipment.id, updated, 'Tech Elena Vance');
      onSuccess('Packing workspace updated.');
    } catch (err: any) {
      alert(err.message || 'Failed to update packing workspace');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
                  {shipment.shipmentNumber}
                </span>
                <span className="text-xs font-mono text-slate-400">Order: {shipment.orderNumber}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${getStatusBadgeClass(
                    shipment.shippingStatus
                  )}`}
                >
                  {shipment.shippingStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">{shipment.customerName}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> {shipment.customerEmail}
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-semibold">{shipment.storeType} Store</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Bar */}
          <div className="px-5 py-3 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAssignTrackingModal}
                className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-medium border border-cyan-800/80 flex items-center gap-1.5 transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-cyan-400" /> Assign Tracking
              </button>
              <button
                onClick={onOpenUpdateStatusModal}
                className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-300 rounded-lg text-xs font-medium border border-purple-800/80 flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Update Status
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPackingSlipModal}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" /> Packing Slip
              </button>
              <button
                onClick={onOpenLabelModal}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" /> Label
              </button>
            </div>
          </div>

          {/* Drawer Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/30 px-5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-cyan-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Overview & Address
            </button>
            <button
              onClick={() => setActiveTab('packing')}
              className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'packing'
                  ? 'border-purple-400 text-purple-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Packing Workspace
              {shipment.packingWorkspace.packingCompleted && (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'border-blue-400 text-blue-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Timeline ({shipment.timeline.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Admin Notes ({shipment.internalNotes.length})
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Courier & Tracking Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-cyan-400" /> Carrier & Dispatch Status
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {shipment.courierDisplayName}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Tracking Number</span>
                      {shipment.trackingNumber ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white text-sm font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
                            {shipment.trackingNumber}
                          </span>
                          {shipment.trackingUrl && (
                            <a
                              href={shipment.trackingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 p-1 bg-cyan-950/60 rounded border border-cyan-800/60"
                              title="Open Carrier Live Tracking"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-amber-400 italic">No Tracking Number Assigned</span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Estimated Delivery</span>
                      <span className="text-slate-200 font-medium">
                        {shipment.estimatedDelivery
                          ? new Date(shipment.estimatedDelivery).toLocaleDateString() +
                            ' (' +
                            new Date(shipment.estimatedDelivery).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            }) +
                            ')'
                          : 'Pending Dispatch'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Dispatch Date</span>
                      <span className="text-slate-200">
                        {shipment.dispatchDate
                          ? new Date(shipment.dispatchDate).toLocaleString()
                          : 'Not Dispatched Yet'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Assigned Pack Technician</span>
                      <span className="text-slate-200 font-medium">
                        {shipment.assignedPacker || 'Cleanroom Tech Elena Vance'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-cyan-400" /> Destination Address
                    </span>
                    <button
                      onClick={handleCopyAddress}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/80 transition-colors"
                    >
                      <Copy className="w-3 h-3" /> {copiedAddress ? 'Copied!' : 'Copy Address'}
                    </button>
                  </div>

                  <div className="text-xs space-y-1 text-slate-200 leading-relaxed font-mono">
                    <p className="font-bold text-white">{shipment.shippingAddress.fullName}</p>
                    <p>{shipment.shippingAddress.addressLine1}</p>
                    {shipment.shippingAddress.addressLine2 && (
                      <p>{shipment.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {shipment.shippingAddress.city}, {shipment.shippingAddress.stateProvince}{' '}
                      {shipment.shippingAddress.postalCode}
                    </p>
                    <p className="font-bold text-cyan-300">{shipment.shippingAddress.country}</p>

                    <div className="pt-2 flex items-center gap-4 text-slate-400 border-t border-slate-800/60 mt-2">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Phone className="w-3 h-3 text-cyan-400" /> {shipment.shippingAddress.phone}
                      </span>
                    </div>

                    {shipment.shippingAddress.deliveryNotes && (
                      <div className="mt-2 p-2 bg-slate-900 border border-slate-800 rounded text-amber-300 text-[11px]">
                        <strong>Delivery Instructions:</strong> {shipment.shippingAddress.deliveryNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipped Products Manifest */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-cyan-400" /> Shipped Package Manifest
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {shipment.items.reduce((sum, item) => sum + item.quantity, 0)} Total Units
                    </span>
                  </div>

                  <div className="space-y-2">
                    {shipment.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                            {item.sku}
                          </span>
                          <h4 className="font-bold text-slate-100">{item.name}</h4>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            {item.lotNumber && (
                              <span className="font-mono text-purple-300">Lot: {item.lotNumber}</span>
                            )}
                            {item.storageCondition && (
                              <span className="text-cyan-400">{item.storageCondition}</span>
                            )}
                          </div>
                        </div>

                        <div className="text-right font-mono font-bold text-slate-100 text-sm bg-slate-950 px-3 py-1 rounded border border-slate-800">
                          {item.quantity} {item.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Order Tracker Architecture Sync Hook */}
                <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Customer Order Tracker Integration
                    </span>
                    <p className="text-[11px] text-cyan-200/80">
                      Real-time webhook and event bus sync target prepared for live status streaming.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 bg-cyan-900/80 text-cyan-200 border border-cyan-700 rounded font-bold">
                    SYNC READY
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'packing' && (
              <PackingWorkspacePanel
                packingData={shipment.packingWorkspace}
                onUpdatePacking={handleUpdatePackingData}
                onOpenLabelModal={onOpenLabelModal}
                onOpenPackingSlipModal={onOpenPackingSlipModal}
              />
            )}

            {activeTab === 'timeline' && (
              <ShippingTimelineVisualizer
                timeline={shipment.timeline}
                currentStatus={shipment.shippingStatus}
              />
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Add Internal Administrative Note
                  </label>
                  <div className="flex items-start gap-2">
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Enter internal shipping note, courier updates, or packing observations..."
                      rows={3}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={addingNote || !newNoteText.trim()}
                      className="px-4 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Post
                    </button>
                  </div>
                </form>

                {/* Notes History */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Internal Note Audit History
                  </h4>

                  {shipment.internalNotes.length === 0 ? (
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-lg text-center text-xs text-slate-500">
                      No internal notes recorded for this shipment.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {shipment.internalNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-semibold text-amber-400 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" /> {note.author}
                            </span>
                            <span className="font-mono">{new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
