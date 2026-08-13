import React from 'react';
import { OrderStatus, PaymentStatus, ShippingStatus } from '../../../types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md' | 'lg';
}

interface ShippingStatusBadgeProps {
  status?: ShippingStatus;
  size?: 'sm' | 'md' | 'lg';
}

interface StoreTypeBadgeProps {
  storeType: 'groupbuy' | 'onhand' | 'moq' | 'mixed' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size];

  const getStyle = (st: OrderStatus) => {
    switch (st) {
      case 'PENDING':
        return 'bg-amber-950/40 text-amber-400 border-amber-500/30';
      case 'AWAITING_PAYMENT':
        return 'bg-amber-900/40 text-amber-300 border-amber-400/40 animate-pulse';
      case 'PAYMENT_VERIFICATION':
        return 'bg-amber-950/50 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
      case 'CONFIRMED':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40';
      case 'PROCESSING':
        return 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40';
      case 'PACKING':
        return 'bg-sky-950/50 text-sky-300 border-sky-400/40';
      case 'READY_TO_SHIP':
        return 'bg-blue-950/50 text-blue-300 border-blue-400/40';
      case 'SHIPPED':
        return 'bg-indigo-950/50 text-indigo-300 border-indigo-400/40';
      case 'DELIVERED':
        return 'bg-teal-950/50 text-teal-300 border-teal-400/40';
      case 'COMPLETED':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.2)]';
      case 'CANCELLED':
        return 'bg-slate-900/60 text-slate-400 border-slate-700/50 line-through';
      case 'REFUNDED':
        return 'bg-rose-950/40 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const formatLabel = (st: OrderStatus) => {
    return st.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border tracking-wide uppercase transition-all ${getStyle(
        status
      )} ${sizeClasses}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      {formatLabel(status)}
    </span>
  );
};

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size];

  const getStyle = (st: PaymentStatus) => {
    switch (st) {
      case 'UNPAID':
        return 'bg-rose-950/40 text-rose-400 border-rose-500/30';
      case 'AWAITING_PAYMENT':
        return 'bg-amber-950/40 text-amber-300 border-amber-500/30';
      case 'VERIFICATION_PENDING':
        return 'bg-amber-950/40 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.15)]';
      case 'PAID':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
      case 'PARTIALLY_REFUNDED':
        return 'bg-amber-950/30 text-amber-300 border-amber-400/30';
      case 'REFUNDED':
        return 'bg-slate-900 text-slate-400 border-slate-700';
      case 'FAILED':
        return 'bg-rose-950/60 text-rose-300 border-rose-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border tracking-wide uppercase ${getStyle(
        status
      )} ${sizeClasses}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export const ShippingStatusBadge: React.FC<ShippingStatusBadgeProps> = ({
  status = 'UNFULFILLED',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size];

  const currentStatus: ShippingStatus = (status as ShippingStatus) || 'UNFULFILLED';

  const getStyle = (st: ShippingStatus) => {
    switch (st) {
      case 'UNFULFILLED':
        return 'bg-slate-800/60 text-slate-400 border-slate-700';
      case 'PREPARING':
        return 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30';
      case 'PACKED':
        return 'bg-sky-950/40 text-sky-300 border-sky-400/30';
      case 'READY_TO_SHIP':
        return 'bg-indigo-950/40 text-indigo-300 border-indigo-400/30';
      case 'IN_TRANSIT':
        return 'bg-purple-950/40 text-purple-300 border-purple-400/30';
      case 'DELIVERED':
        return 'bg-emerald-950/40 text-emerald-300 border-emerald-400/30';
      case 'RETURNED':
        return 'bg-amber-950/40 text-amber-400 border-amber-500/30';
      case 'FAILED_DELIVERY':
        return 'bg-rose-950/40 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border tracking-wide uppercase ${getStyle(
        currentStatus
      )} ${sizeClasses}`}
    >
      {currentStatus.replace(/_/g, ' ')}
    </span>
  );
};

export const StoreTypeBadge: React.FC<StoreTypeBadgeProps> = ({ storeType, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-bold',
    lg: 'px-3 py-1.5 text-sm font-bold',
  }[size];

  const normalized = storeType.toLowerCase();

  switch (normalized) {
    case 'groupbuy':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded border bg-cyan-950/70 text-cyan-400 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.15)] uppercase tracking-wider ${sizeClasses}`}
        >
          GroupBuy
        </span>
      );
    case 'onhand':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded border bg-emerald-950/70 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.15)] uppercase tracking-wider ${sizeClasses}`}
        >
          OnHand
        </span>
      );
    case 'moq':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded border bg-purple-950/70 text-purple-400 border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.15)] uppercase tracking-wider ${sizeClasses}`}
        >
          MOQ Bulk
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded border bg-slate-800 text-slate-300 border-slate-700 uppercase tracking-wider ${sizeClasses}`}
        >
          {storeType}
        </span>
      );
  }
};
