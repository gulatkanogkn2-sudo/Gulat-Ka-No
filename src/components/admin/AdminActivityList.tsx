import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { AdminActivityItem, ActivityEventType } from '../../types/admin';
import {
  Activity,
  ShoppingCart,
  CreditCard,
  Box,
  UserCheck,
  Globe,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface AdminActivityListProps {
  activities: AdminActivityItem[];
  className?: string;
}

export const AdminActivityList: React.FC<AdminActivityListProps> = ({
  activities,
  className = '',
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'all') return true;
    return act.eventType === filterType;
  });

  const getEventBadge = (type: ActivityEventType) => {
    switch (type) {
      case 'New Order':
        return {
          icon: ShoppingCart,
          color: 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30',
        };
      case 'Payment Uploaded':
        return {
          icon: CreditCard,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        };
      case 'Inventory Updated':
        return {
          icon: Box,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
      case 'Customer Registered':
        return {
          icon: UserCheck,
          color: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/30',
        };
      case 'Website Updated':
        return {
          icon: Globe,
          color: 'text-[#FF2ED1] bg-[#FF2ED1]/10 border-[#FF2ED1]/30',
        };
      case 'MOQ Target Reached':
      case 'GroupBuy Batch Closed':
        return {
          icon: Activity,
          color: 'text-[#FF2ED1] bg-[#FF2ED1]/10 border-[#FF2ED1]/30',
        };
      default:
        return {
          icon: Activity,
          color: 'text-slate-300 bg-white/10 border-white/20',
        };
    }
  };

  return (
    <Card
      title="Recent Activity Log"
      subtitle="Live audit trail & operational updates"
      variant="panel"
      className={`border-white/10 ${className}`}
      headerAction={
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 text-xs font-mono text-slate-300 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-[#00D9FF]"
          >
            <option value="all">All Events</option>
            <option value="New Order">New Order</option>
            <option value="Payment Uploaded">Payment Uploaded</option>
            <option value="Inventory Updated">Inventory Updated</option>
            <option value="Customer Registered">Customer Registered</option>
            <option value="Website Updated">Website Updated</option>
          </select>
        </div>
      }
    >
      <div className="space-y-3 font-sans">
        {filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-slate-500">
            No recent activity recorded for this event filter.
          </div>
        ) : (
          filteredActivities.map((act) => {
            const badge = getEventBadge(act.eventType);
            const IconComp = badge.icon;

            return (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 hover:border-[#00D9FF]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-lg border flex-shrink-0 flex items-center justify-center ${badge.color}`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                        {act.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                        {act.eventType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-sans">
                      {act.detail}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                      <span className="text-[#00D9FF]">By: {act.actor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-right font-mono text-xs border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                  <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock className="w-3 h-3 text-[#FF2ED1]" />
                    <span>{act.timestamp}</span>
                  </div>

                  {act.linkPath && (
                    <Link
                      to={act.linkPath}
                      className="text-xs font-bold text-[#00D9FF] hover:underline inline-flex items-center gap-1"
                    >
                      View
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
