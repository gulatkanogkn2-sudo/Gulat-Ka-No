import React from 'react';
import {
  Truck,
  ExternalLink,
  Copy,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  ThermometerSnowflake,
} from 'lucide-react';
import { ShipmentRecord, ShippingStatus, PackingStatus, StoreType } from '../../../types/shipping';
import { ActionMenu } from '../../common/ActionMenu';

interface ShipmentTableProps {
  shipments: ShipmentRecord[];
  loading: boolean;
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onViewDetail: (shipment: ShipmentRecord) => void;
  onAssignTracking: (shipment: ShipmentRecord) => void;
  onUpdateStatus: (shipment: ShipmentRecord) => void;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  loading,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onViewDetail,
  onAssignTracking,
  onUpdateStatus,
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
}) => {
  const allSelected = shipments.length > 0 && shipments.every((s) => selectedIds.includes(s.id));

  const getStatusBadgeClass = (status: ShippingStatus) => {
    switch (status) {
      case 'PENDING_PACKING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10';
      case 'PACKING':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-purple-500/10';
      case 'READY_FOR_PICKUP':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10';
      case 'PICKED_UP':
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-blue-500/10';
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10';
      case 'DELIVERY_FAILED':
      case 'RETURNED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStoreBadge = (storeType: StoreType) => {
    const st = storeType.toLowerCase();
    if (st === 'groupbuy') {
      return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80';
    } else if (st === 'onhand') {
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80';
    } else {
      return 'bg-purple-950/80 text-purple-300 border-purple-700/80';
    }
  };

  const handleCopyTracking = (e: React.MouseEvent, num: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(num);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md shadow-xl">
      {/* Table container with horizontal scrolling */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[950px] text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 select-none uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-3.5 text-center w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                />
              </th>
              <th className="p-3.5">Shipment & Order</th>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Store</th>
              <th className="p-3.5">Carrier & Tracking</th>
              <th className="p-3.5">Shipping Status</th>
              <th className="p-3.5">Packing</th>
              <th className="p-3.5">Dispatch / Est. Delivery</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Loading operational shipments...</span>
                  </div>
                </td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Truck className="w-8 h-8 text-slate-600" />
                    <p className="font-semibold text-slate-400">No shipments match the selected filters.</p>
                    <p className="text-xs text-slate-500">
                      Try clearing filters or searching with a different term.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              shipments.map((shipment) => {
                const isSelected = selectedIds.includes(shipment.id);
                return (
                  <tr
                    key={shipment.id}
                    onClick={() => onViewDetail(shipment)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-800/60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectRow(shipment.id, e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                      />
                    </td>

                    {/* Shipment & Order Number */}
                    <td className="p-3.5">
                      <div className="font-mono text-cyan-300 font-bold text-xs flex items-center gap-1.5">
                        {shipment.shipmentNumber}
                        {shipment.packingWorkspace.coldChainRequired && (
                          <span title="Cold Chain (-20°C Vault)">
                            <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {shipment.orderNumber}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5">
                      <div className="font-medium text-slate-100">{shipment.customerName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {shipment.customerEmail}
                      </div>
                    </td>

                    {/* Store */}
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getStoreBadge(
                          shipment.storeType
                        )}`}
                      >
                        {shipment.storeType}
                      </span>
                    </td>

                    {/* Carrier & Tracking */}
                    <td className="p-3.5">
                      <div className="text-slate-200 font-medium flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[140px]">{shipment.courierDisplayName}</span>
                      </div>
                      {shipment.trackingNumber ? (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                          <span className="truncate max-w-[120px]">{shipment.trackingNumber}</span>
                          <button
                            onClick={(e) => handleCopyTracking(e, shipment.trackingNumber!)}
                            className="p-0.5 hover:text-white"
                            title="Copy Tracking #"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Shipping Status */}
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${getStatusBadgeClass(
                          shipment.shippingStatus
                        )}`}
                      >
                        {shipment.shippingStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Packing Workspace Status */}
                    <td className="p-3.5">
                      {shipment.packingStatus === 'COMPLETED' ? (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-bold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Sealed
                        </span>
                      ) : shipment.packingStatus === 'IN_PROGRESS' ? (
                        <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded font-bold flex items-center gap-1 w-fit">
                          <Package className="w-3 h-3" /> Packing
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-bold flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Unpacked
                        </span>
                      )}
                    </td>

                    {/* Dispatch & Delivery Dates */}
                    <td className="p-3.5">
                      <div className="text-slate-300 text-[11px]">
                        Est: {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'TBD'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Dispatched: {shipment.dispatchDate ? new Date(shipment.dispatchDate).toLocaleDateString() : 'Pending'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'View Shipment Detail',
                            icon: <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />,
                            onClick: () => onViewDetail(shipment),
                          },
                          {
                            label: 'Assign Tracking Number',
                            icon: <Truck className="w-3.5 h-3.5 text-cyan-400" />,
                            onClick: () => onAssignTracking(shipment),
                          },
                          {
                            label: 'Update Shipping Status',
                            icon: <Edit3 className="w-3.5 h-3.5 text-purple-400" />,
                            onClick: () => onUpdateStatus(shipment),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing{' '}
          <span className="font-bold text-slate-200">
            {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-bold text-slate-200">
            {Math.min(page * pageSize, totalCount)}
          </span>{' '}
          of <span className="font-bold text-slate-200">{totalCount}</span> shipments
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg border border-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-300 font-mono">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg border border-slate-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
