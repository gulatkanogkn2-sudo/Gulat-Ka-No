import React from 'react';
import {
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { PaymentVerificationStatus } from '../../../types/paymentVerification';

interface PaymentStatusBadgeProps {
  status: PaymentVerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2 font-bold',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  switch (status) {
    case 'PENDING_REVIEW':
      return (
        <span
          className={`inline-flex items-center font-mono rounded-md font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)] ${sizeClasses[size]}`}
        >
          <Clock className={`${iconSizes[size]} text-amber-400 animate-pulse`} />
          <span>Pending Review</span>
        </span>
      );

    case 'UNDER_REVIEW':
      return (
        <span
          className={`inline-flex items-center font-mono rounded-md font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)] ${sizeClasses[size]}`}
        >
          <Eye className={`${iconSizes[size]} text-cyan-400`} />
          <span>Under Review</span>
        </span>
      );

    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center font-mono rounded-md font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)] ${sizeClasses[size]}`}
        >
          <CheckCircle2 className={`${iconSizes[size]} text-emerald-400`} />
          <span>Verified</span>
        </span>
      );

    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center font-mono rounded-md font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.25)] ${sizeClasses[size]}`}
        >
          <XCircle className={`${iconSizes[size]} text-rose-400`} />
          <span>Rejected</span>
        </span>
      );

    case 'REQUIRES_MORE_INFO':
      return (
        <span
          className={`inline-flex items-center font-mono rounded-md font-semibold bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.25)] ${sizeClasses[size]}`}
        >
          <HelpCircle className={`${iconSizes[size]} text-purple-400`} />
          <span>Requires Info</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center font-mono rounded-md font-semibold bg-slate-900 text-slate-300 border border-slate-700 ${sizeClasses[size]}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};
