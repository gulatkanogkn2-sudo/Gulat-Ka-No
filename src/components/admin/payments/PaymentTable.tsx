import React from 'react';
import {
  Maximize2,
  Eye,
  CheckCircle2,
  XCircle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileImage,
} from 'lucide-react';
import { PaymentVerificationRecord } from '../../../types/paymentVerification';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentTableProps {
  payments: PaymentVerificationRecord[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onOpenDrawer: (payment: PaymentVerificationRecord) => void;
  onOpenProofViewer: (payment: PaymentVerificationRecord) => void;
  onVerify: (payment: PaymentVerificationRecord) => void;
  onReject: (payment: PaymentVerificationRecord) => void;
  onReassign: (payment: PaymentVerificationRecord) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onOpenDrawer,
  onOpenProofViewer,
  onVerify,
  onReject,
  onReassign,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}) => {
  const isAllSelected =
    payments.length > 0 && payments.every((p) => selectedIds.includes(p.id));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Table Shell */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[950px] text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                />
              </th>
              <th className="py-3 px-4">Payment Ref</th>
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Store Vault</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4">Submission Date</th>
              <th className="py-3 px-4">Verification Status</th>
              <th className="py-3 px-4">Verifier</th>
              <th className="py-3 px-4">Proof File</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-slate-500 font-mono text-xs">
                  No payment verification records matched the selected criteria.
                </td>
              </tr>
            ) : (
              payments.map((p) => {
                const isSelected = selectedIds.includes(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectOne(p.id, e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                      />
                    </td>

                    {/* Payment Ref */}
                    <td className="py-3 px-4 font-bold text-white">
                      <button
                        onClick={() => onOpenDrawer(p)}
                        className="hover:text-cyan-400 transition-colors flex items-center gap-1 group text-left"
                      >
                        <span>{p.paymentReference}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                      </button>
                    </td>

                    {/* Order # */}
                    <td className="py-3 px-4 text-cyan-400 font-semibold">
                      {p.orderNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-semibold">{p.customerName}</div>
                      <div className="text-[10px] text-slate-500">{p.customerEmail}</div>
                    </td>

                    {/* Store Vault */}
                    <td className="py-3 px-4">
                      <span className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {p.storeType}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4 text-slate-300">
                      <div>{p.paymentMethod.replace('_', ' ')}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[120px]" title={p.transactionReference}>
                        {p.transactionReference}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      ${p.amountPaid.toFixed(2)}
                    </td>

                    {/* Payment Date */}
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(p.paymentDate).toLocaleDateString()}
                      <span className="block text-[10px] text-slate-500">
                        {new Date(p.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="py-3 px-4">
                      <PaymentStatusBadge status={p.verificationStatus} size="sm" />
                    </td>

                    {/* Verifier */}
                    <td className="py-3 px-4 text-slate-300 font-semibold">
                      {p.assignedVerifier || <span className="text-slate-500 italic">Unassigned</span>}
                    </td>

                    {/* Proof File Preview Thumbnail */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onOpenProofViewer(p)}
                        className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded transition-colors group"
                        title="Click to view payment proof fullscreen"
                      >
                        <FileImage className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="text-[10px] text-slate-400 group-hover:text-cyan-300 truncate max-w-[80px]">
                          {p.uploadedProofFileName}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Open Drawer */}
                        <button
                          onClick={() => onOpenDrawer(p)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                          title="View Details Drawer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Open Proof Inspector */}
                        <button
                          onClick={() => onOpenProofViewer(p)}
                          className="p-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded transition-colors"
                          title="Inspect Proof Fullscreen"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Quick Verify */}
                        {p.verificationStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => onVerify(p)}
                            className="p-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded transition-colors"
                            title="Quick Verify Payment"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Quick Reject */}
                        {p.verificationStatus !== 'REJECTED' && (
                          <button
                            onClick={() => onReject(p)}
                            className="p-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-3 flex items-center justify-between text-xs font-mono text-slate-400">
        <div>
          Showing page <strong className="text-cyan-400">{currentPage}</strong> of{' '}
          <strong className="text-slate-200">{totalPages}</strong> ({totalCount} total verifications)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 rounded text-slate-300 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>

          <span className="px-2 font-bold text-slate-300">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 rounded text-slate-300 transition-colors flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
