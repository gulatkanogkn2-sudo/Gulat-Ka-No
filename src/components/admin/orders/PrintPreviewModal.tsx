import React from 'react';
import { X, Printer, FileText, Check } from 'lucide-react';
import { OrderDetail } from '../../../types/order';
import { calculateTotalVials, calculateTotalLabels, calculateItemVials } from '../../../utils/vialCalculation';

interface PrintPreviewModalProps {
  orders: OrderDetail[];
  documentType: 'packing_slip' | 'invoice';
  onClose: () => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  orders,
  documentType,
  onClose,
}) => {
  if (orders.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPackingSlip = documentType === 'packing_slip';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-indigo-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
              {isPackingSlip ? 'Print Packing Slip' : 'Print Invoice'} ({orders.length}{' '}
              {orders.length === 1 ? 'Order' : 'Orders'})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs rounded-lg transition-all"
            >
              <Printer className="h-4 w-4" /> Trigger Browser Print
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-950/50">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white text-slate-900 p-8 rounded-lg shadow-xl max-w-3xl mx-auto space-y-6 border border-slate-200 print:shadow-none print:border-none font-sans"
            >
              {/* Document Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase font-mono">
                    GKN LABS V2
                  </h1>
                  <p className="text-xs text-slate-500 font-mono">
                    RESEARCH ALLOCATION & PHARMA-GRADE LOGISTICS
                  </p>
                  <p className="text-xs text-slate-500">BGC Innovation Tower, Taguig, Philippines</p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded uppercase tracking-wider">
                    {isPackingSlip ? 'PACKING SLIP' : 'INVOICE & RECEIPT'}
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-2">
                    {order.referenceNumber}
                  </div>
                  <div className="text-xs text-slate-500">
                    Date: {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-4">
                <div>
                  <h4 className="font-bold text-slate-700 uppercase font-mono mb-1">
                    Customer Details
                  </h4>
                  <div className="font-semibold text-slate-900">{order.customerName}</div>
                  <div className="text-slate-600 font-mono">{order.customerEmail}</div>
                  <div className="text-slate-600 font-mono">{order.customerPhone}</div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 uppercase font-mono mb-1">
                    Shipping Destination
                  </h4>
                  <div className="font-semibold text-slate-900">
                    {order.shippingAddress.recipientName}
                  </div>
                  <div className="text-slate-600">{order.shippingAddress.addressLine1}</div>
                  {order.shippingAddress.addressLine2 && (
                    <div className="text-slate-600">{order.shippingAddress.addressLine2}</div>
                  )}
                  <div className="text-slate-600">
                    {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                    {order.shippingAddress.postalCode}
                  </div>
                  <div className="text-slate-600 font-mono">{order.shippingAddress.country}</div>
                </div>
              </div>

              {/* Order Meta Bar */}
              <div className="bg-slate-100 p-3 rounded flex flex-wrap justify-between gap-2 text-xs font-mono border border-slate-200">
                <div>
                  Store: <strong className="uppercase">{order.storeType}</strong>
                </div>
                <div>
                  Payment: <strong>{order.paymentMethod}</strong>
                </div>
                <div>
                  Total Vials: <strong className="text-slate-900">{order.totalVials ?? calculateTotalVials(order.items)} Vials</strong>
                </div>
                <div>
                  Total Labels: <strong className="text-slate-900">{order.totalLabels ?? calculateTotalLabels(order.items)} Labels</strong>
                </div>
                <div>
                  Courier: <strong>{order.courier || 'LBC Express'}</strong>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-slate-600 uppercase font-mono text-[11px]">
                    <th className="py-2">Item Description</th>
                    <th className="py-2">Variant</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-center">Vials</th>
                    {!isPackingSlip && <th className="py-2 text-right">Unit Price</th>}
                    {!isPackingSlip && <th className="py-2 text-right">Total</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {order.items.map((item) => {
                    const lineVials = calculateItemVials(item);
                    return (
                      <tr key={item.id}>
                        <td className="py-2 font-medium text-slate-900">
                          {item.name}
                          {item.casNumber && (
                            <div className="text-[10px] text-slate-500 font-mono">
                              CAS: {item.casNumber} | Purity: {item.purity}
                            </div>
                          )}
                        </td>
                        <td className="py-2 font-mono text-slate-600">
                          {item.variantLabel}
                          {item.sellingUnit && (
                            <div className="text-[10px] text-slate-500 font-bold uppercase">
                              {item.sellingUnit === 'kit' ? `Per Kit (${item.vialsPerKit || 10} V/Kit)` : 'Per Vial'}
                            </div>
                          )}
                        </td>
                        <td className="py-2 text-center font-mono font-bold text-slate-800">
                          {item.quantity}
                        </td>
                        <td className="py-2 text-center font-mono font-bold text-slate-800">
                          {lineVials} Vials
                        </td>
                        {!isPackingSlip && (
                          <td className="py-2 text-right font-mono text-slate-700">
                            ${item.price.toFixed(2)}
                          </td>
                        )}
                        {!isPackingSlip && (
                          <td className="py-2 text-right font-mono font-bold text-slate-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals for Invoice */}
              {!isPackingSlip && (
                <div className="flex justify-end pt-2 border-t border-slate-200">
                  <div className="w-64 space-y-1 text-xs font-mono text-right">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping Fee:</span>
                      <span>${order.shippingFee.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount:</span>
                        <span>-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
                      <span>Grand Total:</span>
                      <span>${order.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Stamp / Sign-off */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <p className="font-semibold text-slate-700">QC & Verification Notice:</p>
                  <p>Packaging inspected prior to courier dispatch.</p>
                </div>
                <div className="text-right font-mono">
                  <div className="h-8 border-b border-slate-400 w-36 mb-1"></div>
                  <span>Authorized Lab Sign-off</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
