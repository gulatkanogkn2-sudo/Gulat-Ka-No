import React from 'react';
import {
  CheckCircle2,
  Clock,
  Ban,
  UserX,
  ShieldAlert,
  Shield,
  Crown,
  Award,
  Star,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import {
  CustomerAccountStatus,
  CustomerTier,
  CustomerVerificationStatus,
} from '../../../types/customer';
import { CustomerTierService } from '../../../services/customerTierService';

interface StatusBadgeProps {
  status: CustomerAccountStatus;
  size?: 'sm' | 'md';
}

export const CustomerAccountStatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  }[size];

  switch (status) {
    case 'ACTIVE':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded border bg-emerald-950/40 border-emerald-500/30 text-emerald-400 ${sizeClasses}`}
        >
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          <span>Active</span>
        </span>
      );
    case 'PENDING_VERIFICATION':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded border bg-amber-950/40 border-amber-500/30 text-amber-300 ${sizeClasses}`}
        >
          <Clock className="h-3 w-3 text-amber-400" />
          <span>Pending</span>
        </span>
      );
    case 'SUSPENDED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded border bg-rose-950/40 border-rose-500/30 text-rose-400 ${sizeClasses}`}
        >
          <ShieldAlert className="h-3 w-3 text-rose-400" />
          <span>Suspended</span>
        </span>
      );
    case 'DISABLED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded border bg-slate-900 border-slate-700 text-slate-400 ${sizeClasses}`}
        >
          <UserX className="h-3 w-3 text-slate-500" />
          <span>Disabled</span>
        </span>
      );
    case 'BANNED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded border bg-red-950/80 border-red-600/50 text-red-400 ${sizeClasses}`}
        >
          <Ban className="h-3 w-3 text-red-500" />
          <span>Banned</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded-md border bg-slate-900 border-slate-800 text-slate-400 ${sizeClasses}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};

interface TierBadgeProps {
  tier: CustomerTier;
  size?: 'sm' | 'md' | 'lg';
}

export const CustomerTierBadge: React.FC<TierBadgeProps> = ({ tier, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size];

  const normalized = (tier || 'STANDARD').toUpperCase();

  switch (normalized) {
    case 'VIP':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded-md border font-bold bg-amber-500/15 border-amber-400/50 text-amber-300 shadow-sm ${sizeClasses}`}
        >
          <Crown className="h-3 w-3 text-amber-400" />
          <span>VIP</span>
        </span>
      );
    case 'GOLD':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded-md border font-semibold bg-yellow-500/10 border-yellow-500/40 text-yellow-400 ${sizeClasses}`}
        >
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400/20" />
          <span>GOLD</span>
        </span>
      );
    case 'SILVER':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded-md border font-semibold bg-cyan-950/50 border-cyan-500/40 text-cyan-300 ${sizeClasses}`}
        >
          <Award className="h-3 w-3 text-cyan-400" />
          <span>SILVER</span>
        </span>
      );
    case 'STANDARD':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded-md border font-normal bg-slate-900 border-slate-700 text-slate-300 ${sizeClasses}`}
        >
          <Shield className="h-3 w-3 text-slate-400" />
          <span>STANDARD</span>
        </span>
      );
    default: {
      // Dynamic fallback for custom / future tiers (e.g. PLATINUM, DIAMOND)
      const badgeDetails = CustomerTierService.getTierBadgeDetails(tier);
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded-md border font-semibold ${badgeDetails.badgeColor} ${sizeClasses}`}
        >
          <Sparkles className="h-3 w-3 text-cyan-400" />
          <span>{badgeDetails.name || tier}</span>
        </span>
      );
    }
  }
};

interface VerificationBadgeProps {
  status: CustomerVerificationStatus;
  size?: 'sm' | 'md';
}

export const CustomerVerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  }[size];

  switch (status) {
    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded border bg-emerald-950/40 border-emerald-500/30 text-emerald-400 ${sizeClasses}`}
        >
          <UserCheck className="h-3 w-3 text-emerald-400" />
          <span>Verified</span>
        </span>
      );
    case 'PENDING_ID':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded border bg-amber-950/40 border-amber-500/30 text-amber-300 ${sizeClasses}`}
        >
          <Clock className="h-3 w-3 text-amber-400" />
          <span>Pending ID</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded border bg-rose-950/40 border-rose-500/30 text-rose-400 ${sizeClasses}`}
        >
          <ShieldAlert className="h-3 w-3 text-rose-400" />
          <span>Rejected</span>
        </span>
      );
    case 'UNVERIFIED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono rounded border bg-slate-900 border-slate-700 text-slate-400 ${sizeClasses}`}
        >
          <Shield className="h-3 w-3 text-slate-500" />
          <span>Unverified</span>
        </span>
      );
  }
};
