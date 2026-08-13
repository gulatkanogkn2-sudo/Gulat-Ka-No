import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { AdminQuickActionItem } from '../../types/admin';
import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  Globe,
  BookOpen,
  Folder,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AdminQuickActionsProps {
  actions: AdminQuickActionItem[];
  className?: string;
}

const iconMap = {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  Globe,
  BookOpen,
  Folder,
  TrendingUp,
};

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({
  actions,
  className = '',
}) => {
  return (
    <Card
      title="Quick Action Console"
      subtitle="Direct shortcuts to core business modules"
      variant="panel"
      className={`border-white/10 ${className}`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-2.5 sm:gap-3">
        {actions.map((item) => {
          const IconComponent = iconMap[item.iconName] || Package;

          const accentClasses = {
            cyan: 'border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/10 hover:border-[#00D9FF]/60',
            purple: 'border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/60',
            magenta: 'border-[#FF2ED1]/30 text-[#FF2ED1] hover:bg-[#FF2ED1]/10 hover:border-[#FF2ED1]/60',
            emerald: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60',
            amber: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/60',
          }[item.accent];

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`p-3.5 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col justify-between transition-all duration-200 group hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-lg border flex items-center justify-center transition-all ${accentClasses}`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-1">
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white flex items-center gap-1">
                  {item.title}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#00D9FF]" />
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
