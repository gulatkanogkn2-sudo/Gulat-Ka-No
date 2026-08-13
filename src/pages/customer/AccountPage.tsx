import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { OrderService } from '../../services/orderService';
import { OrderDetail } from '../../types/order';
import { TrackingResult } from '../../components/tracking/TrackingResult';
import {
  User,
  Mail,
  MapPin,
  Package,
  Clock,
  ShieldCheck,
  Zap,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [recentOrders, setRecentOrders] = useState<OrderDetail[]>([]);
  const activeDeliveries = recentOrders.filter((order) =>
    !['DELIVERED', 'CANCELLED'].includes(String(order.fulfillmentStatus || order.status).toUpperCase())
  ).length;

  useEffect(() => {
    const loadOrders = async () => {
      const orders = await OrderService.getRecentOrders(user?.email);
      setRecentOrders(orders);
    };
    loadOrders();
  }, [user]);

  return (
    <PageContainer
      title="Researcher Profile & Orders"
      description="Manage institutional credentials, shipping destinations, and research batch allocations."
    >
      <div className="space-y-8">
        {/* Profile Header Card */}
        <Card variant="glass" className="p-6 border-[#00D9FF]/30 font-mono space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF]">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {user?.fullName || 'Customer'}
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {user?.email || ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED RESEARCHER
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-white/20 text-slate-300 hover:text-white text-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Logout
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 block">Total Allocations</span>
              <span className="text-lg font-bold text-white">{recentOrders.length} Batches</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 block">Active Deliveries</span>
              <span className="text-lg font-bold text-[#00D9FF]">{activeDeliveries} In Transit</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 block">Reward Points</span>
              <span className="text-lg font-bold text-[#FF2ED1] flex items-center gap-1">
                <Zap className="w-4 h-4 fill-[#FF2ED1]" />
                0 PTS
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 block">Member Status</span>
              <span className="text-lg font-bold text-[#8B5CF6]">Standard</span>
            </div>
          </div>
        </Card>

        {/* Order History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#00D9FF]" />
              Recent Order Allocations ({recentOrders.length})
            </h3>
            <Link
              to="/order-tracker"
              className="text-xs text-[#00D9FF] hover:underline flex items-center gap-1"
            >
              <span>Open Tracker Search</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentOrders.map((order) => (
              <TrackingResult key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
