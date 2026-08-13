import React from 'react';

export interface SettingCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const SettingCard: React.FC<SettingCardProps> = ({
  title,
  description,
  icon,
  badge,
  children,
  className = '',
  actions,
}) => {
  return (
    <div className={`glass-card p-5 border border-white/10 rounded-xl bg-[#0A0F1D]/80 hover:border-white/20 transition-all ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-9 h-9 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
              {badge}
            </div>
            {description && (
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center space-x-2 flex-shrink-0">{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};
