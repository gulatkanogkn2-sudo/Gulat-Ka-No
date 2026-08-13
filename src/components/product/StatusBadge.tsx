import React from 'react';
import { StoreAccent } from '../store/StoreStatusBadge';

export type ProductStatusType =
  | 'Available'
  | 'Coming Soon'
  | 'Out of Stock'
  | 'Batch Open'
  | 'Batch Closed'
  | 'MOQ Open'
  | string;

export interface StatusBadgeProps {
  status: ProductStatusType;
  accent?: StoreAccent;
  glow?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  accent = 'cyan',
  glow = true,
  className = '',
}) => {
  // Determine color scheme based on status type or store accent fallback
  let accentClass = '';
  
  if (status === 'Out of Stock' || status === 'Batch Closed') {
    accentClass = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  } else if (status === 'Coming Soon') {
    accentClass = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  } else if (status === 'MOQ Achieved' || status === 'Completed') {
    accentClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
  } else if (status === 'Almost Reached') {
    accentClass = 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
  } else if (status === 'Production Scheduled') {
    accentClass = 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
  } else if (status === 'Manufacturing' || status === 'Quality Control') {
    accentClass = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
  } else {
    // Store accent matching
    const storeAccentMap: Record<StoreAccent, string> = {
      cyan: 'bg-[#00D9FF]/15 text-[#00D9FF] border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]',
      purple: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]',
      magenta: 'bg-[#FF2ED1]/15 text-[#FF2ED1] border-[#FF2ED1]/40 shadow-[0_0_10px_rgba(255,46,209,0.2)]',
    };
    accentClass = storeAccentMap[accent];
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${accentClass} ${
        glow ? '' : 'shadow-none'
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Out of Stock' || status === 'Batch Closed'
            ? 'bg-rose-400'
            : status === 'Coming Soon'
            ? 'bg-amber-400'
            : accent === 'cyan'
            ? 'bg-[#00D9FF] animate-pulse'
            : accent === 'purple'
            ? 'bg-[#8B5CF6] animate-pulse'
            : 'bg-[#FF2ED1] animate-pulse'
        }`}
      />
      {status}
    </span>
  );
};
