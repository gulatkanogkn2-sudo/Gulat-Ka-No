import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Calendar,
  MapPin,
  Barcode,
  QrCode,
  Printer,
  ShieldCheck,
  AlertCircle,
  ThermometerSnowflake,
  Package,
} from 'lucide-react';
import { ShipmentRecord, ShippingStatus, CourierName } from '../../../types/shipping';
import { ShippingManagementService } from '../../../services/shippingManagementService';

// ==========================================
// 1. Assign Courier & Tracking Modal
// ==========================================
interface AssignTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: ShipmentRecord;
  onSuccess: (msg: string) => void;
}

export const AssignTrackingModal: React.FC<AssignTrackingModalProps> = ({
  isOpen,
  onClose,
  shipment,
  onSuccess,
}) => {
  const [courier, setCourier] = useState<CourierName>(shipment.courier || 'DHL_EXPRESS');
  const [trackingNumber, setTrackingNumber] = useState<string>(shipment.trackingNumber || '');
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>(
    shipment.estimatedDelivery ? shipment.estimatedDelivery.slice(0, 10) : ''
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      alert('Please enter a valid tracking number.');
      return;
    }

    setLoading(true);
    try {
      await ShippingManagementService.assignCourierAndTracking(
        shipment.id,
        courier,
        trackingNumber.trim(),
        estimatedDelivery ? new Date(estimatedDelivery).toISOString() : undefined,
        'Admin User'
      );
      onSuccess(`Courier and Tracking Number ${trackingNumber} assigned successfully.`);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to assign tracking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Assign Courier & Tracking</h3>
            <p className="text-xs text-slate-400">
              Shipment {shipment.shipmentNumber} • Order {shipment.orderNumber}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Courier Carrier
            </label>
            <select
              value={courier}
              onChange={(e) => setCourier(e.target.value as CourierName)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
            >
              <option value="DHL_EXPRESS">DHL Express Courier</option>
              <option value="FEDEX_LAB_EXPRESS">FedEx Priority Air Express</option>
              <option value="UPS_COLD_CHAIN">UPS Next Day Air</option>
              <option value="USPS_PRIORITY">USPS Priority Express (Air)</option>
              <option value="LOCAL_COURIER">GKN Local Express Courier</option>
              <option value="OTHER">Other / Custom Transport</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. DHL-8839201941"
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Estimated Delivery Date
            </label>
            <input
              type="date"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              {loading ? 'Saving...' : 'Save Tracking Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. Update Shipping Status Modal
// ==========================================
interface UpdateShippingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: ShipmentRecord;
  onSuccess: (msg: string) => void;
}

export const UpdateShippingStatusModal: React.FC<UpdateShippingStatusModalProps> = ({
  isOpen,
  onClose,
  shipment,
  onSuccess,
}) => {
  const [status, setStatus] = useState<ShippingStatus>(shipment.shippingStatus);
  const [operatorNote, setOperatorNote] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ShippingManagementService.updateShipmentStatus(
        shipment.id,
        status,
        operatorNote.trim() || undefined,
        location.trim() || undefined,
        'Admin User'
      );
      onSuccess(`Shipment status updated to ${status.replace(/_/g, ' ')}.`);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Update Shipping Status</h3>
            <p className="text-xs text-slate-400">
              Shipment {shipment.shipmentNumber} • Current: {shipment.shippingStatus.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              New Shipping Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ShippingStatus)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
            >
              <option value="PENDING_PACKING">Pending Packing</option>
              <option value="PACKING">Packing In Progress</option>
              <option value="READY_FOR_PICKUP">Ready for Pickup</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="DELIVERY_FAILED">Delivery Failed</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Milestone Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Austin Regional Hub / Cambridge Station"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Milestone Operator Note (Optional)
            </label>
            <textarea
              value={operatorNote}
              onChange={(e) => setOperatorNote(e.target.value)}
              placeholder="Add details regarding this status milestone..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
            >
              {loading ? 'Updating...' : 'Update Status & Log Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. Print Packing Slip & Cold-Chain Label Modal
// ==========================================
interface PrintPackingSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: ShipmentRecord;
}

export const PrintPackingSlipModal: React.FC<PrintPackingSlipModalProps> = ({
  isOpen,
  onClose,
  shipment,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              Printable GKN Laboratory Packing Slip
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Document
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet (Cyberpunk Laboratory Aesthetic Document Layout) */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6 text-slate-200 font-sans print:bg-white print:text-black print:border-none print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 print:border-black pb-4">
            <div>
              <div className="text-xl font-extrabold tracking-wider text-cyan-400 print:text-black">
                GKN V2 LABS
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Precision Research Compounds & Express Logistics
              </p>
              <p className="text-[10px] text-slate-500 print:text-gray-500 font-mono mt-1">
                FACILITY CERTIFICATE: GKN-QC-2026-ALPHA
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block px-3 py-1 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold rounded print:border-black print:bg-gray-100 print:text-black">
                SLIP: {shipment.shipmentNumber}
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Order Ref: <span className="font-mono text-white print:text-black">{shipment.orderNumber}</span>
              </p>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Store: <span className="font-semibold text-cyan-300 print:text-black">{shipment.storeType}</span>
              </p>
            </div>
          </div>

          {/* Addresses & Courier */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg print:border-gray-300 print:bg-gray-50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-600">
                SHIP TO RECIPIENT
              </span>
              <p className="font-bold text-slate-100 print:text-black">{shipment.shippingAddress.fullName}</p>
              <p className="text-slate-300 print:text-gray-800">{shipment.shippingAddress.addressLine1}</p>
              {shipment.shippingAddress.addressLine2 && (
                <p className="text-slate-300 print:text-gray-800">{shipment.shippingAddress.addressLine2}</p>
              )}
              <p className="text-slate-300 print:text-gray-800">
                {shipment.shippingAddress.city}, {shipment.shippingAddress.stateProvince} {shipment.shippingAddress.postalCode}
              </p>
              <p className="text-slate-300 print:text-gray-800">{shipment.shippingAddress.country}</p>
              <p className="text-slate-400 print:text-gray-600 font-mono text-[11px] pt-1">
                Phone: {shipment.shippingAddress.phone}
              </p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg print:border-gray-300 print:bg-gray-50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-600">
                LOGISTICS & CARRIER
              </span>
              <p className="font-bold text-slate-100 print:text-black">{shipment.courierDisplayName}</p>
              <p className="font-mono text-cyan-300 print:text-black">
                Tracking: {shipment.trackingNumber || 'UNASSIGNED QUEUE'}
              </p>
              <p className="text-slate-300 print:text-gray-800">
                Dispatched: {shipment.dispatchDate ? new Date(shipment.dispatchDate).toLocaleDateString() : 'Pending'}
              </p>
              <p className="text-slate-300 print:text-gray-800">
                Packer Tech: {shipment.assignedPacker || 'Elena Vance'}
              </p>
              <p className="text-xs text-amber-400 print:text-gray-800 font-semibold flex items-center gap-1 pt-1">
                <ThermometerSnowflake className="w-3.5 h-3.5" /> Cold-Chain (-20°C Vault Spec)
              </p>
            </div>
          </div>

          {/* Shipped Products Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black">
              Verified Order Manifest Items
            </h4>
            <div className="border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 print:bg-gray-100 text-slate-400 print:text-gray-700 border-b border-slate-800 print:border-gray-300">
                  <tr>
                    <th className="p-2.5">SKU</th>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5">Lot Number</th>
                    <th className="p-2.5">Storage</th>
                    <th className="p-2.5 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                  {shipment.items.map((item) => (
                    <tr key={item.id} className="text-slate-200 print:text-black">
                      <td className="p-2.5 font-mono text-cyan-300 print:text-black font-semibold">
                        {item.sku}
                      </td>
                      <td className="p-2.5 font-medium">{item.name}</td>
                      <td className="p-2.5 font-mono text-slate-400 print:text-gray-700">
                        {item.lotNumber || 'GKN-LOT-2026'}
                      </td>
                      <td className="p-2.5 text-[11px] text-cyan-400 print:text-black">
                        {item.storageCondition || '-20°C'}
                      </td>
                      <td className="p-2.5 text-right font-bold text-white print:text-black">
                        {item.quantity} {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Barcode & Verification Footer */}
          <div className="pt-4 border-t border-slate-800 print:border-black flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <Barcode className="w-32 h-10 text-slate-300 print:text-black" />
                <span className="text-[10px] font-mono text-slate-400 print:text-gray-600">
                  *{shipment.shipmentNumber}*
                </span>
              </div>
              <div className="flex flex-col items-center">
                <QrCode className="w-10 h-10 text-slate-300 print:text-black" />
                <span className="text-[9px] font-mono text-slate-500 print:text-gray-500">
                  VERIFY GKN QC
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400 print:text-gray-600 space-y-0.5">
              <p className="font-bold text-slate-200 print:text-black">GKN LABORATORY QUALITY AUDIT</p>
              <p>Cleanroom Batch Clearance: PASS</p>
              <p className="font-mono">Timestamp: {new Date().toISOString().slice(0, 16)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. Print Shipping Label Modal
// ==========================================
interface PrintShippingLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: ShipmentRecord;
}

export const PrintShippingLabelModal: React.FC<PrintShippingLabelModalProps> = ({
  isOpen,
  onClose,
  shipment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Carrier Shipping Label Preview</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4x6 Label Format Container */}
        <div className="bg-white text-black p-4 rounded border-2 border-black space-y-3 font-sans text-xs">
          {/* Label Header */}
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <div>
              <div className="font-extrabold text-sm tracking-wider">GKN EXPRESS LOGISTICS</div>
              <div className="text-[10px]">DISPATCH BAY 4 • MANILA PH</div>
            </div>
            <div className="text-right font-bold text-sm">
              {shipment.courier === 'DHL_EXPRESS'
                ? 'DHL EXPRESS'
                : shipment.courier === 'FEDEX_LAB_EXPRESS'
                ? 'FEDEX AIR'
                : 'UPS EXPRESS'}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="py-2 border-b-2 border-black space-y-1">
            <div className="font-bold text-[10px] text-gray-700">DELIVER TO:</div>
            <div className="font-extrabold text-sm">{shipment.shippingAddress.fullName}</div>
            <div>{shipment.shippingAddress.addressLine1}</div>
            {shipment.shippingAddress.addressLine2 && <div>{shipment.shippingAddress.addressLine2}</div>}
            <div className="font-bold text-sm">
              {shipment.shippingAddress.city}, {shipment.shippingAddress.stateProvince} {shipment.shippingAddress.postalCode}
            </div>
            <div className="font-bold">{shipment.shippingAddress.country}</div>
          </div>

          {/* Barcode & Tracking */}
          <div className="py-2 text-center space-y-1">
            <div className="font-bold">TRACKING #: {shipment.trackingNumber || 'DHL-8839201941'}</div>
            <div className="flex justify-center my-1">
              <Barcode className="w-48 h-12 text-black" />
            </div>
            <div className="font-mono text-[10px]">*{shipment.trackingNumber || 'DHL-8839201941'}*</div>
          </div>

          {/* Express Priority Badge */}
          <div className="bg-black text-white p-2 text-center font-extrabold text-[11px] tracking-wider">
            FRAGILE - PRECISION RESEARCH MATERIALS - PRIORITY HANDLING
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={() => window.print()}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print 4x6 Thermal Label
          </button>
        </div>
      </div>
    </div>
  );
};
