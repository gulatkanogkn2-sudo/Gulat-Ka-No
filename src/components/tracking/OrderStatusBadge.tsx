import React from 'react';
import { OrderStatus, PaymentStatus } from '../../types/order';
import { Badge } from '../common/Badge';
import {
  Clock,
  CheckCircle2,
  FileCheck,
  PackageCheck,
  Truck,
  AlertTriangle,
  XCircle,
  CreditCard,
  Box,
  ShieldCheck,
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  glow?: boolean;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className = '',
  glow = true,
}) => {
  const configs: Record<
    OrderStatus,
    { label: string; variant: 'cyan' | 'purple' | 'magenta' | 'default'; icon: React.ReactNode }
  > = {
    PENDING: {
      label: 'STAGED',
      variant: 'default',
      icon: <Clock className="w-3 h-3 text-slate-400" />,
    },
    AWAITING_PAYMENT: {
      label: 'AWAITING PAYMENT',
      variant: 'purple',
      icon: <CreditCard className="w-3 h-3 text-[#8B5CF6]" />,
    },
    PAYMENT_VERIFICATION: {
      label: 'VERIFYING PAYMENT',
      variant: 'purple',
      icon: <FileCheck className="w-3 h-3 text-[#8B5CF6]" />,
    },
    CONFIRMED: {
      label: 'ALLOCATION CONFIRMED',
      variant: 'cyan',
      icon: <ShieldCheck className="w-3 h-3 text-[#00D9FF]" />,
    },
    PROCESSING: {
      label: 'ORDER PROCESSING',
      variant: 'cyan',
      icon: <Box className="w-3 h-3 text-[#00D9FF]" />,
    },
    PACKING: {
      label: 'ORDER PACKAGING',
      variant: 'magenta',
      icon: <PackageCheck className="w-3 h-3 text-[#FF2ED1]" />,
    },
    READY_TO_SHIP: {
      label: 'READY TO SHIP',
      variant: 'cyan',
      icon: <Truck className="w-3 h-3 text-[#00D9FF]" />,
    },
    SHIPPED: {
      label: 'IN TRANSIT',
      variant: 'cyan',
      icon: <Truck className="w-3 h-3 text-[#00D9FF]" />,
    },
    DELIVERED: {
      label: 'DELIVERED',
      variant: 'cyan',
      icon: <CheckCircle2 className="w-3 h-3 text-green-400" />,
    },
    COMPLETED: {
      label: 'COMPLETED',
      variant: 'cyan',
      icon: <CheckCircle2 className="w-3 h-3 text-green-400" />,
    },
    CANCELLED: {
      label: 'CANCELLED',
      variant: 'default',
      icon: <XCircle className="w-3 h-3 text-red-400" />,
    },
    REFUNDED: {
      label: 'REFUNDED',
      variant: 'default',
      icon: <AlertTriangle className="w-3 h-3 text-red-400" />,
    },
  };

  const config = configs[status] || {
    label: status,
    variant: 'default',
    icon: <Clock className="w-3 h-3" />,
  };

  return (
    <Badge
      variant={config.variant}
      glow={glow}
      className={`font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5 ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const styles: Record<PaymentStatus, { label: string; color: string }> = {
    UNPAID: { label: 'UNPAID', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    AWAITING_PAYMENT: { label: 'AWAITING PAYMENT', color: 'text-amber-300 bg-amber-500/10 border-amber-500/30' },
    VERIFICATION_PENDING: {
      label: 'PENDING LEDGER CHECK',
      color: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/30',
    },
    PAID: { label: 'PAID & CLEARED', color: 'text-green-400 bg-green-500/10 border-green-500/30' },
    PARTIALLY_REFUNDED: { label: 'PARTIALLY REFUNDED', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    REFUNDED: { label: 'REFUNDED', color: 'text-slate-400 bg-white/5 border-white/10' },
    FAILED: { label: 'PAYMENT FAILED', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  };

  const conf = styles[status] || { label: status, color: 'text-slate-300 bg-white/5 border-white/10' };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono text-[10px] font-bold tracking-wider uppercase ${conf.color} ${className}`}
    >
      {conf.label}
    </span>
  );
};
