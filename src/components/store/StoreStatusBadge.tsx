import React from 'react';

export type StoreAccent = 'cyan' | 'purple' | 'magenta';

export interface StoreStatusBadgeProps {
  status: string;
  accent?: StoreAccent;
  glow?: boolean;
  className?: string;
}

export const StoreStatusBadge: React.FC<StoreStatusBadgeProps> = ({
  status,
  accent = 'cyan',
  glow = true,
  className = '',
}) => {
  const accentStyles: Record<StoreAccent, string> = {
    cyan: 'bg-[#00D9FF]/15 text-[#00D9FF] border-[#00D9FF]/40 shadow-[0_0_12px_rgba(0,217,255,0.25)]',
    purple: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]',
    magenta: 'bg-[#FF2ED1]/15 text-[#FF2ED1] border-[#FF2ED1]/40 shadow-[0_0_12px_rgba(255,46,209,0.25)]',
  };

  const nonGlowStyles: Record<StoreAccent, string> = {
    cyan: 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30',
    purple: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30',
    magenta: 'bg-[#FF2ED1]/10 text-[#FF2ED1] border-[#FF2ED1]/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${
        glow ? accentStyles[accent] : nonGlowStyles[accent]
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
        accent === 'cyan' ? 'bg-[#00D9FF]' : accent === 'purple' ? 'bg-[#8B5CF6]' : 'bg-[#FF2ED1]'
      }`} />
      {status}
    </span>
  );
};
