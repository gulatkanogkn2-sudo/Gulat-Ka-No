import React from 'react';

export interface BadgeProps {
  variant?: 'cyan' | 'purple' | 'magenta' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'cyan',
  children,
  className = '',
  glow = false,
}) => {
  const variantStyles = {
    cyan: 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/40 shadow-[inset_0_0_8px_rgba(0,217,255,0.1)]',
    purple: 'bg-[#8B5CF6]/10 text-[#a78bfa] border-[#8B5CF6]/40 shadow-[inset_0_0_8px_rgba(139,92,246,0.1)]',
    magenta: 'bg-[#FF2ED1]/10 text-[#ff7ce4] border-[#FF2ED1]/40 shadow-[inset_0_0_8px_rgba(255,46,209,0.1)]',
    success: 'bg-[#00E676]/10 text-[#34d399] border-[#00E676]/40 shadow-[inset_0_0_8px_rgba(0,230,118,0.1)]',
    warning: 'bg-[#FBBF24]/10 text-[#fbbf24] border-[#FBBF24]/40 shadow-[inset_0_0_8px_rgba(251,191,36,0.1)]',
    danger: 'bg-[#EF4444]/10 text-[#f87171] border-[#EF4444]/40 shadow-[inset_0_0_8px_rgba(239,68,68,0.1)]',
    info: 'bg-[#3B82F6]/10 text-[#60a5fa] border-[#3B82F6]/40 shadow-[inset_0_0_8px_rgba(59,130,246,0.1)]',
    neutral: 'bg-white/5 text-slate-300 border-white/10',
  };

  const glowStyles = glow ? 'shadow-[0_0_10px_currentColor]' : '';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border uppercase tracking-wider ${variantStyles[variant]} ${glowStyles} ${className}`}
    >
      {children}
    </span>
  );
};
