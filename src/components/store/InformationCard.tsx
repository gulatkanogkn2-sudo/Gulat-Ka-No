import React from 'react';
import { Card } from '../common/Card';
import { StoreAccent } from './StoreStatusBadge';

export interface InfoField {
  label: string;
  value: string | React.ReactNode;
  highlight?: boolean;
}

export interface InformationCardProps {
  title: string;
  description?: string;
  fields: InfoField[];
  accent?: StoreAccent;
  icon?: React.ReactNode;
  className?: string;
}

export const InformationCard: React.FC<InformationCardProps> = ({
  title,
  description,
  fields,
  accent = 'cyan',
  icon,
  className = '',
}) => {
  const accentBorder: Record<StoreAccent, string> = {
    cyan: 'border-[#00D9FF]/30 hover:border-[#00D9FF]/50 shadow-[0_0_20px_rgba(0,217,255,0.08)]',
    purple: 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]/50 shadow-[0_0_20px_rgba(139,92,246,0.08)]',
    magenta: 'border-[#FF2ED1]/30 hover:border-[#FF2ED1]/50 shadow-[0_0_20px_rgba(255,46,209,0.08)]',
  };

  const accentText: Record<StoreAccent, string> = {
    cyan: 'text-[#00D9FF]',
    purple: 'text-[#8B5CF6]',
    magenta: 'text-[#FF2ED1]',
  };

  const accentBg: Record<StoreAccent, string> = {
    cyan: 'bg-[#00D9FF]/10 border-[#00D9FF]/30',
    purple: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30',
    magenta: 'bg-[#FF2ED1]/10 border-[#FF2ED1]/30',
  };

  return (
    <Card variant="glass" className={`${accentBorder[accent]} p-5 relative overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
        {icon && (
          <div className={`p-2 rounded-lg border ${accentBg[accent]} ${accentText[accent]}`}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
            {title}
          </h3>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {fields.map((field, idx) => (
          <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              {field.label}
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                field.highlight ? accentText[accent] : 'text-white'
              }`}
            >
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
