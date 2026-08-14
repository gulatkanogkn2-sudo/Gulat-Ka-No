import React from 'react';
import { Link } from 'react-router-dom';

export interface HeaderIconButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  to?: string;
  variant?: 'cyan' | 'purple' | 'amber' | 'green';
  badgeCount?: number | string;
  ariaLabel?: string;
  className?: string;
}

export const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({
  icon,
  tooltip,
  onClick,
  to,
  variant = 'cyan',
  badgeCount,
  ariaLabel,
  className = '',
}) => {
  const variantStyles = {
    cyan: 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30 hover:bg-[#00D9FF]/20 hover:border-[#00D9FF] hover:shadow-[0_0_12px_rgba(0,217,255,0.35)]',
    purple: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6] hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500 hover:shadow-[0_0_12px_rgba(245,158,11,0.35)]',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500 hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]',
  };

  const baseClasses = `relative w-10 h-10 sm:w-11 sm:h-11 min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      <span className="flex items-center justify-center transition-transform group-hover:scale-105">
        {icon}
      </span>

      {badgeCount !== undefined && badgeCount !== null && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-black text-black bg-[#00D9FF] rounded-full shadow-[0_0_8px_rgba(0,217,255,0.8)]">
          {badgeCount}
        </span>
      )}
    </>
  );

  return (
    <div className="relative group/tooltip flex items-center">
      {to ? (
        <Link
          to={to}
          className={`${baseClasses} group`}
          aria-label={ariaLabel || tooltip}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={`${baseClasses} group`}
          aria-label={ariaLabel || tooltip}
        >
          {content}
        </button>
      )}

      {/* Desktop Hover Tooltip (Hidden on Mobile) */}
      <div className="hidden md:group-hover/tooltip:flex pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 px-2.5 py-1 rounded-md bg-[#070B15]/95 border border-white/20 text-[11px] font-mono text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.8)] whitespace-nowrap items-center gap-1.5 animate-fadeIn backdrop-blur-md">
        <span>{tooltip}</span>
      </div>
    </div>
  );
};
