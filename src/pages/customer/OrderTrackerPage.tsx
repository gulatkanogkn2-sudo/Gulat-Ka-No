import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Badge } from '../../components/common/Badge';
import { OrderDetail } from '../../types/order';
import { OrderService } from '../../services/orderService';
import {
  TrackingSearch,
  TrackingResult,
  TrackingEmptyState,
} from '../../components/tracking';
import { History } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const OrderTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentOrders, setRecentOrders] = useState<OrderDetail[]>([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const orders = await OrderService.getRecentOrders(user?.email);
        setRecentOrders(orders);
      } catch (err) {
        console.error('Error loading recent orders:', err);
      }
    };
    loadRecent();
  }, [user]);

  const handleSearch = (reference: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/order/${reference.trim().toUpperCase()}`);
    }, 400);
  };

  return (
    <PageContainer
      title="Order Tracker"
      description="Track order progress, payment status, and shipment status."
      actions={
        <Badge variant="cyan" glow>
          LIVE VERIFICATION SYSTEM
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Search Input Hero Box */}
        <TrackingSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Recent Orders List Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <History className="w-4 h-4 text-[#00D9FF]" />
              Recent Account Allocations ({recentOrders.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Auto-Linked to Account</span>
          </div>

          {recentOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentOrders.map((order) => (
                <TrackingResult key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <TrackingEmptyState />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

