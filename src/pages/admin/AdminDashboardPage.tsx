import React, { useState, useEffect } from 'react';
import { AdminDashboardService } from '../../services/adminDashboardService';
import { AdminDashboardData } from '../../types/admin';
import {
  AdminHeaderWidget,
  AdminStatCard,
  AdminQuickActions,
  AdminActivityList,
  AdminAlertsModal,
} from '../../components/admin';
import { Loader2 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    AdminDashboardService.getDashboardData().then((data) => {
      if (isMounted) {
        setDashboardData(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAlertRead = async (id: string) => {
    const updatedAlerts = await AdminDashboardService.markAlertAsRead(id);
    const unreadCount = updatedAlerts.filter((a) => !a.isRead).length;
    setDashboardData((prev) =>
      prev
        ? {
            ...prev,
            alerts: updatedAlerts,
            header: { ...prev.header, unreadNotificationsCount: unreadCount },
          }
        : null
    );
  };

  const handleMarkAllAlertsRead = async () => {
    const updatedAlerts = await AdminDashboardService.markAllAlertsAsRead();
    setDashboardData((prev) =>
      prev
        ? {
            ...prev,
            alerts: updatedAlerts,
            header: { ...prev.header, unreadNotificationsCount: 0 },
          }
        : null
    );
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#00D9FF] animate-spin" />
        <p className="font-mono text-xs text-slate-400 tracking-widest uppercase">
          Initializing GKN Admin Operations Console...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8 max-w-[1600px] mx-auto">
      {/* 1. Dashboard Header Widget */}
      <AdminHeaderWidget
        data={dashboardData.header}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />

      {/* 2. Business Overview (8 Core Operational Metrics) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
            Business Overview & Metrics
          </h2>
          <span className="text-slate-400 text-[11px]">
            Live Store Data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {dashboardData.metrics.map((metric) => (
            <AdminStatCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      {/* 3. Quick Action Console Navigation Grid */}
      <AdminQuickActions actions={dashboardData.quickActions} />

      {/* 4. Recent Activity Log */}
      <div className="grid grid-cols-1 gap-6">
        <AdminActivityList activities={dashboardData.activities} />
      </div>

      {/* Alerts Slide-over / Modal Panel */}
      <AdminAlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={dashboardData.alerts}
        onMarkRead={handleMarkAlertRead}
        onMarkAllRead={handleMarkAllAlertsRead}
      />
    </div>
  );
};
