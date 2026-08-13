import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'glass' | 'panel' | 'outline';
  hoverEffect?: boolean;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  footer,
  variant = 'glass',
  hoverEffect = false,
  noPadding = false,
}) => {
  const variantClasses = {
    glass: 'glass-card text-slate-100 relative group border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]',
    panel: 'bg-[var(--bg-panel)] backdrop-blur-xl border border-white/10 text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative group transition-colors duration-300',
    outline: 'bg-transparent border border-white/15 text-slate-100',
  };

  const hoverClasses = hoverEffect
    ? 'transition-all duration-300 hover:bg-white/5 hover:border-[#00D9FF]/40 hover:shadow-[0_0_30px_rgba(0,217,255,0.15)] hover:-translate-y-1'
    : '';

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-xl flex flex-col ${variantClasses[variant]} ${hoverClasses} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-4 relative z-10">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-base font-semibold text-slate-100 tracking-wide">{title}</h3>
            ) : (
              title
            )}
            {typeof subtitle === 'string' ? (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            ) : (
              subtitle
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={`relative z-10 flex-1 flex flex-col ${noPadding ? '' : 'p-6'}`}>{children}</div>
      {footer && (
        <div className="px-6 py-3.5 bg-black/20 border-t border-white/5 relative z-10">{footer}</div>
      )}
    </div>
  );
};
