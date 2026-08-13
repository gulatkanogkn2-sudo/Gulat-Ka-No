import React, { useState } from 'react';
import { X, AlertTriangle, HelpCircle, UserCheck, CheckCircle2 } from 'lucide-react';
import { PaymentVerificationRecord } from '../../../types/paymentVerification';

interface RejectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentVerificationRecord | null;
  onConfirm: (reason: string) => Promise<void>;
}

export const RejectPaymentModal: React.FC<RejectPaymentModalProps> = ({
  isOpen,
  onClose,
  payment,
  onConfirm,
}) => {
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
      setReason('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-lg p-6 shadow-[0_0_40px_rgba(244,63,94,0.15)] relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-400 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Reject Payment Submission</h3>
            <p className="text-xs font-mono text-slate-400">
              Ref #{payment.paymentReference} • Order #{payment.orderNumber}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Rejection Reason (Required for Customer & Audit Log)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              placeholder="e.g. Transaction reference invalid, name mismatch on bank transfer, or unconfirmed blockchain hash..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="bg-rose-950/40 border border-rose-800/50 rounded-lg p-3 text-[11px] font-mono text-rose-300">
            <strong>Warning:</strong> Rejecting this payment will log a formal rejection event, update order payment status to failed/cancelled, and notify administrative personnel.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-mono font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentVerificationRecord | null;
  onConfirm: (requestText: string) => Promise<void>;
}

export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  isOpen,
  onClose,
  payment,
  onConfirm,
}) => {
  const [requestText, setRequestText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    setIsSubmitting(true);
    try {
      await onConfirm(requestText.trim());
      setRequestText('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl w-full max-w-lg p-6 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 text-purple-400 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Request Additional Payment Proof</h3>
            <p className="text-xs font-mono text-slate-400">
              Ref #{payment.paymentReference} • Order #{payment.orderNumber}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Instructions for Customer / Support Representative
            </label>
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              required
              rows={4}
              placeholder="e.g. Please re-upload a full uncropped screenshot showing the TX hash or bank remittance slip displaying account holder name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !requestText.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Information Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ReassignVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentVerificationRecord | null;
  onConfirm: (newVerifier: string) => Promise<void>;
}

export const ReassignVerifierModal: React.FC<ReassignVerifierModalProps> = ({
  isOpen,
  onClose,
  payment,
  onConfirm,
}) => {
  const [selectedVerifier, setSelectedVerifier] = useState<string>('Admin Sarah');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const VERIFIERS = ['Admin Sarah', 'Admin Marcus', 'Admin Elena', 'Admin Alex', 'Admin System'];

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(selectedVerifier);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(0,217,255,0.15)] relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 text-cyan-400 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Reassign Verifier</h3>
            <p className="text-xs font-mono text-slate-400">
              Ref #{payment.paymentReference} • Current: {payment.assignedVerifier || 'Unassigned'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Select Lead Admin Verifier
            </label>
            <select
              value={selectedVerifier}
              onChange={(e) => setSelectedVerifier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {VERIFIERS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(0,217,255,0.3)]"
            >
              {isSubmitting ? 'Updating...' : 'Assign Verifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
