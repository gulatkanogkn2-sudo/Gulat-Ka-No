import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  UserCheck,
  FileText,
  Clock,
  MessageSquare,
  Send,
  Download,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  User,
  ShoppingBag,
  CreditCard,
  Building,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { PaymentVerificationRecord } from '../../../types/paymentVerification';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PaymentVerificationService } from '../../../services/paymentVerificationService';
import { formatPhpAmount } from '../../../utils/currencyUtils';

interface PaymentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentVerificationRecord | null;
  onOpenProofViewer: (payment: PaymentVerificationRecord) => void;
  onVerify: (payment: PaymentVerificationRecord) => void;
  onReject: (payment: PaymentVerificationRecord) => void;
  onRequestInfo: (payment: PaymentVerificationRecord) => void;
  onReassign: (payment: PaymentVerificationRecord) => void;
  onRefresh: () => void;
}

export const PaymentDetailDrawer: React.FC<PaymentDetailDrawerProps> = ({
  isOpen,
  onClose,
  payment,
  onOpenProofViewer,
  onVerify,
  onReject,
  onRequestInfo,
  onReassign,
  onRefresh,
}) => {
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  if (!isOpen || !payment) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setIsAddingNote(true);
    try {
      await PaymentVerificationService.addAdminNote(
        payment.id,
        newNoteText.trim(),
        'Admin Sarah'
      );
      setNewNoteText('');
      onRefresh();
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Drawer Header */}
          <div className="bg-slate-900 border-b border-slate-800 p-5 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold text-white">
                    {payment.paymentReference}
                  </span>
                  <PaymentStatusBadge status={payment.verificationStatus} size="sm" />
                  <span className="text-[11px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold">
                    {payment.storeType} Store
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Order Reference:{' '}
                  <strong className="text-cyan-400">{payment.orderNumber}</strong> • Submitted{' '}
                  {new Date(payment.paymentDate).toLocaleString()}
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close payment drawer"
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Action Buttons Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => onVerify(payment)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)]"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verify</span>
              </button>

              <button
                onClick={() => onReject(payment)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(244,63,94,0.15)]"
              >
                <XCircle className="h-3.5 w-3.5 text-rose-400" />
                <span>Reject</span>
              </button>

              <button
                onClick={() => onRequestInfo(payment)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-mono font-bold transition-all"
              >
                <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
                <span>Req. Info</span>
              </button>

              <button
                onClick={() => onReassign(payment)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-bold transition-all"
              >
                <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
                <span>Reassign</span>
              </button>
            </div>
          </div>

          {/* Drawer Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
            {/* Section 1: Customer & Order Overview Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-cyan-400" />
                <span>Customer & Account Info</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Customer Name</span>
                  <span className="text-slate-200 font-bold">{payment.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Email Address</span>
                  <span className="text-cyan-400">{payment.customerEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Phone Number</span>
                  <span className="text-slate-300">{payment.customerPhone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Assigned Verifier</span>
                  <span className="text-amber-400 font-semibold">
                    {payment.assignedVerifier || 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Payment & Financial Details Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span>Financial Transaction Summary</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Amount Paid</span>
                  <span className="text-emerald-400 font-bold text-base">
                    {formatPhpAmount(payment.amountPaid)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Currency / Network</span>
                  <span className="text-slate-200 font-semibold">{payment.currency}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Payment Method</span>
                  <span className="text-slate-200 font-semibold">
                    {payment.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Payment Date</span>
                  <span className="text-slate-300">
                    {new Date(payment.paymentDate).toLocaleString()}
                  </span>
                </div>
                <div className="sm:col-span-2 bg-slate-950 p-2.5 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">
                    Transaction Ref / TX Hash
                  </span>
                  <span className="text-amber-300 font-mono text-xs break-all">
                    {payment.transactionReference}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Proof Asset Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Uploaded Payment Proof</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500">
                  {payment.uploadedProofFileSize}
                </span>
              </div>

              <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div
                  onClick={() => onOpenProofViewer(payment)}
                  className="w-20 h-20 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex-shrink-0 relative group cursor-pointer"
                >
                  <img
                    src={payment.uploadedProofUrl}
                    alt="Proof thumbnail"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Maximize2 className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-xs font-mono">
                  <div className="text-slate-200 font-bold truncate">
                    {payment.uploadedProofFileName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Click image or inspector button to launch full viewer with zoom/rotate/fullscreen.
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onOpenProofViewer(payment)}
                      className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Maximize2 className="h-3 w-3" />
                      <span>Launch Inspector</span>
                    </button>
                    <a
                      href={payment.uploadedProofUrl}
                      download={payment.uploadedProofFileName}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Internal Admin Notes */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
                <span>Internal Admin Notes</span>
              </h4>

              {/* Note Submission Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add an internal note or verification remark..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={isAddingNote || !newNoteText.trim()}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </form>

              {/* Note Log List */}
              <div className="space-y-2 pt-2">
                {payment.adminNotes.length === 0 ? (
                  <p className="text-xs font-mono text-slate-500 italic">
                    No internal notes posted yet.
                  </p>
                ) : (
                  payment.adminNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="text-purple-400 font-bold">{note.author}</span>
                        <span>{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section 5: Verification Audit History Timeline */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Verification Audit Trail</span>
              </h4>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-800 pl-6">
                {payment.verificationHistory.map((hist) => (
                  <div key={hist.id} className="relative space-y-1">
                    <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-slate-950" />
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-300 font-bold">{hist.verifier}</span>
                      <span className="text-slate-500">
                        {new Date(hist.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <PaymentStatusBadge status={hist.status} size="sm" />
                      {hist.notes && <span className="text-slate-300">{hist.notes}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="bg-slate-900 border-t border-slate-800 p-4 flex items-center justify-between flex-shrink-0 text-xs font-mono text-slate-400">
            <span className="text-[11px] text-slate-500">
              Payment Verification • GKN
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

