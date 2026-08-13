import React from 'react';
import { Badge } from '../common/Badge';
import { LucideIcon } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  badgeText?: string;
  badgeVariant?: 'cyan' | 'purple' | 'magenta' | 'amber';
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  badgeText,
  badgeVariant = 'cyan',
  icon: Icon,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF]">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h2 className="text-2xl font-bold text-white tracking-wide">{title}</h2>
          {badgeText && <Badge variant={badgeVariant} glow>{badgeText}</Badge>}
        </div>
        {description && (
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
