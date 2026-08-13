import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  Crown,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { CustomerAggregateMetrics } from '../../../types/customer';
import { CustomerManagementService } from '../../../services/customerManagementService';

export const CustomerStatsHeader: React.FC = () => {
  const [stats, setStats] = useState<CustomerAggregateMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await CustomerManagementService.getAggregateStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load customer aggregate stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    const unsubscribe = CustomerManagementService.subscribeToCustomerUpdates(() => {
      fetchStats();
    });
    return () => unsubscribe();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Researchers',
      value: stats.totalCustomers.toString(),
      subtext: 'Registered Accounts',
      icon: Users,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      bgGlow: 'bg-cyan-500/5',
    },
    {
      title: 'Active Accounts',
      value: stats.activeCustomers.toString(),
      subtext: 'Authorized & Operating',
      icon: UserCheck,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgGlow: 'bg-emerald-500/5',
    },
    {
      title: 'VIP & Gold Tiers',
      value: stats.vipGoldCount.toString(),
      subtext: 'High-Volume VIPs',
      icon: Crown,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      bgGlow: 'bg-amber-500/5',
    },
    {
      title: 'Pending Verification',
      value: stats.pendingVerificationCount.toString(),
      subtext: 'Awaiting KYC ID Check',
      icon: Clock,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      bgGlow: 'bg-purple-500/5',
    },
    {
      title: 'Lifetime Revenue',
      value: `$${stats.totalLifetimeRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtext: 'Cumulative Volume',
      icon: DollarSign,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgGlow: 'bg-emerald-500/5',
    },
    {
      title: 'Suspended / Flagged',
      value: stats.suspendedCount.toString(),
      subtext: 'Requires Admin Audit',
      icon: AlertTriangle,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/20',
      bgGlow: 'bg-rose-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metricCards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`bg-slate-900/80 backdrop-blur border ${card.borderColor} rounded-xl p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all`}
          >
            <div className={`absolute -right-2 -bottom-2 w-16 h-16 ${card.bgGlow} rounded-full blur-xl pointer-events-none`} />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 font-medium uppercase tracking-wider">
                {card.title}
              </span>
              <IconComponent className={`h-4 w-4 ${card.color} opacity-80`} />
            </div>

            <div className="mt-2">
              <div className="text-lg font-bold font-mono text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
