import React from 'react';
import { Eye, Edit, ChevronLeft, ChevronRight, Tag, ArrowUpRight } from 'lucide-react';
import { OrderDetail, OrderStatus } from '../../../types/order';
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  ShippingStatusBadge,
  StoreTypeBadge,
} from './OrderStatusBadge';

interface OrderTableProps {
  orders: OrderDetail[];
  selectedOrderIds: string[];
  onSelectOrder: (orderId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onViewDetail: (order: OrderDetail) => void;
  onUpdateStatus: (order: OrderDetail) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  selectedOrderIds,
  onSelectOrder,
  onSelectAll,
  onViewDetail,
  onUpdateStatus,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}) => {
  const allSelected =
    orders.length > 0 && orders.every((o) => selectedOrderIds.includes(o.id));
  const someSelected =
    orders.some((o) => selectedOrderIds.includes(o.id)) && !allSelected;

  if (orders.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center space-y-3">
        <div className="inline-flex p-4 bg-slate-800/60 rounded-full text-slate-500 mb-2">
          <Eye className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">No Orders Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No order records match your selected filters. Try broadening your search or resetting filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
      {/* Table view for md+ screens */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[1000px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 font-semibold">Order #</th>
              <th className="py-3 px-3 font-semibold">Customer</th>
              <th className="py-3 px-3 font-semibold">Store</th>
              <th className="py-3 px-3 font-semibold">Order Date</th>
              <th className="py-3 px-3 font-semibold text-center">Items</th>
              <th className="py-3 px-3 font-semibold text-right">Grand Total</th>
              <th className="py-3 px-3 font-semibold">Payment Status</th>
              <th className="py-3 px-3 font-semibold">Order Status</th>
              <th className="py-3 px-3 font-semibold">Shipping</th>
              <th className="py-3 px-3 font-semibold">Assigned Batch</th>
              <th className="py-3 px-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {orders.map((order) => {
              const isSelected = selectedOrderIds.includes(order.id);
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <tr
                  key={order.id}
                  className={`hover:bg-slate-850/60 transition-colors ${
                    isSelected ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectOrder(order.id, e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950 cursor-pointer"
                    />
                  </td>

                  {/* Order Reference */}
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => onViewDetail(order)}
                      className="font-mono font-bold text-slate-100 hover:text-cyan-400 transition-colors text-left flex items-center gap-1 group"
                    >
                      {order.referenceNumber}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                    </button>
                  </td>

                  {/* Customer Info */}
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-200">{order.customerName || 'N/A'}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                      {order.customerEmail}
                    </div>
                  </td>

                  {/* Store Type */}
                  <td className="py-3.5 px-3">
                    <StoreTypeBadge storeType={order.storeType} size="sm" />
                  </td>

                  {/* Order Date */}
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(order.orderDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Item Count */}
                  <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-200 font-semibold">
                      {itemCount}
                    </span>
                  </td>

                  {/* Grand Total */}
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                    ${order.grandTotal.toFixed(2)}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3.5 px-3">
                    <PaymentStatusBadge status={order.paymentStatus} size="sm" />
                  </td>

                  {/* Order Status */}
                  <td className="py-3.5 px-3">
                    <OrderStatusBadge status={order.status} size="sm" />
                  </td>

                  {/* Shipping Status */}
                  <td className="py-3.5 px-3">
                    <ShippingStatusBadge status={order.shippingStatus} size="sm" />
                  </td>

                  {/* Assigned Batch */}
                  <td className="py-3.5 px-3">
                    {order.assignedBatch ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                        <Tag className="h-2.5 w-2.5" />
                        {order.assignedBatch}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-mono text-[10px]">—</span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetail(order)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-all"
                        title="View Order Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(order)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-all"
                        title="Update Status"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (< md screens) */}
      <div className="md:hidden divide-y divide-slate-800">
        {orders.map((order) => {
          const isSelected = selectedOrderIds.includes(order.id);
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div
              key={order.id}
              className={`p-4 space-y-3 ${isSelected ? 'bg-cyan-950/20' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectOrder(order.id, e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />
                  <div>
                    <button
                      onClick={() => onViewDetail(order)}
                      className="font-mono font-bold text-slate-100 hover:text-cyan-400 text-sm"
                    >
                      {order.referenceNumber}
                    </button>
                    <div className="text-xs text-slate-400">{order.customerName}</div>
                  </div>
                </div>
                <StoreTypeBadge storeType={order.storeType} size="sm" />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="space-y-1">
                  <OrderStatusBadge status={order.status} size="sm" />
                  <div>
                    <PaymentStatusBadge status={order.paymentStatus} size="sm" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-base">
                    ${order.grandTotal.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {itemCount} item(s) • {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {order.assignedBatch && (
                <div className="text-[11px] font-mono text-cyan-300">
                  Batch: {order.assignedBatch}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => onViewDetail(order)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-cyan-400 text-xs rounded font-medium flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" /> View Detail
                </button>
                <button
                  onClick={() => onUpdateStatus(order)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-amber-400 text-xs rounded font-medium flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" /> Status
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="bg-slate-950/80 border-t border-slate-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono">
          Page <strong className="text-slate-200">{currentPage}</strong> of{' '}
          <strong className="text-slate-200">{totalPages}</strong> ({totalCount} total orders)
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-1.5 rounded border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 font-mono rounded border transition-all ${
                p === currentPage
                  ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1.5 rounded border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
