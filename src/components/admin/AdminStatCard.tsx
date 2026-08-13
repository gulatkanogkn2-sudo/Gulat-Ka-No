import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { AdminSummaryMetric } from '../../types/admin';
import {
  ShoppingCart,
  CreditCard,
  Layers,
  Box,
  Factory,
  Users,
  DollarSign,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

interface AdminStatCardProps {
  metric: AdminSummaryMetric;
  className?: string;
}

const iconMap = {
  ShoppingCart,
  CreditCard,
  Layers,
  Box,
  Factory,
  Users,
  DollarSign,
  TrendingDown,
};

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  metric,
  className = '',
}) => {
  const IconComponent = iconMap[metric.iconName] || Box;

  // Accent Color Mapping
  const accentStyles = {
    cyan: {
      border: 'border-[#00D9FF]/25 hover:border-[#00D9FF]/50',
      text: 'text-[#00D9FF]',
      bgIcon: 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30',
      shadow: 'shadow-[0_0_15px_rgba(0,217,255,0.15)]',
      glow: 'group-hover:text-[#00D9FF]',
    },
    purple: {
      border: 'border-[#8B5CF6]/25 hover:border-[#8B5CF6]/50',
      text: 'text-[#8B5CF6]',
      bgIcon: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30',
      shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]',
      glow: 'group-hover:text-[#8B5CF6]',
    },
    magenta: {
      border: 'border-[#FF2ED1]/25 hover:border-[#FF2ED1]/50',
      text: 'text-[#FF2ED1]',
      bgIcon: 'bg-[#FF2ED1]/10 text-[#FF2ED1] border-[#FF2ED1]/30',
      shadow: 'shadow-[0_0_15px_rgba(255,46,209,0.15)]',
      glow: 'group-hover:text-[#FF2ED1]',
    },
    emerald: {
      border: 'border-emerald-500/25 hover:border-emerald-500/50',
      text: 'text-emerald-400',
      bgIcon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      glow: 'group-hover:text-emerald-400',
    },
    amber: {
      border: 'border-amber-500/25 hover:border-amber-500/50',
      text: 'text-amber-400',
      bgIcon: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      glow: 'group-hover:text-amber-400',
    },
    rose: {
      border: 'border-rose-500/25 hover:border-rose-500/50',
      text: 'text-rose-400',
      bgIcon: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
      glow: 'group-hover:text-rose-400',
    },
  }[metric.accent];

  const content = (
    <Card
      variant="panel"
      noPadding
      className={`h-full flex flex-col justify-between relative overflow-hidden transition-all duration-300 group ${accentStyles.border} ${accentStyles.shadow} ${className}`}
      hoverEffect
    >
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between h-full space-y-3">
        {/* Top Area: Category Eyebrow, Title & Standardized Icon */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="space-y-1 min-w-0 flex-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block truncate">
              {metric.subtitle}
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 tracking-tight group-hover:text-white transition-colors line-clamp-2 min-h-[2.25rem] flex items-center">
              {metric.title}
            </h3>
          </div>

          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${accentStyles.bgIcon}`}
          >
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Middle Area: Primary Value */}
        <div className="my-auto py-1">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-baseline gap-2">
            <span className={`${accentStyles.glow} transition-colors truncate`}>{metric.value}</span>
          </div>
        </div>

        {/* Bottom Area: Divider, Trend / SubValue Comparison text */}
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono mt-auto">
          {metric.trend ? (
            <span
              className={`flex items-center gap-1 font-bold min-w-0 truncate ${
                metric.trend.isPositive ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              <TrendingUp className="w-3 h-3 flex-shrink-0" />
              <span className="flex-shrink-0">{metric.trend.value}</span>
              <span className="text-slate-400 font-normal truncate ml-0.5">{metric.trend.period}</span>
            </span>
          ) : (
            <span className="text-slate-400 truncate">{metric.subValue}</span>
          )}

          {metric.path && (
            <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-500 group-hover:text-white transition-colors ml-1" />
          )}
        </div>
      </div>
    </Card>
  );

  if (metric.path) {
    return (
      <Link to={metric.path} className="h-full block group focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
