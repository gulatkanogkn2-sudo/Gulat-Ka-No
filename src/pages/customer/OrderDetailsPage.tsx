import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { OrderDetail } from '../../types/order';
import { OrderService } from '../../services/orderService';
import {
  TrackingHeader,
  OrderTimeline,
  OrderProductsTable,
  OrderSummaryCard,
  TrackingEmptyState,
} from '../../components/tracking';
import { Button } from '../../components/common/Button';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import { OrderReceiptModal } from '../../components/receipt/OrderReceiptModal';

export const OrderDetailsPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  useEffect(() => {
    if (!reference) {
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const found = await OrderService.getOrderByReference(reference);
        if (found) {
          setOrder(found);
        } else {
          setError(`No research order found matching reference "${reference}".`);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to retrieve order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [reference]);

  if (isLoading) {
    return (
      <PageContainer
        title="Loading Order Record..."
        description="Decrypting batch allocation logs and ledger status..."
      >
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-3 border-[#00D9FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">
            Fetching order details and waybill data for {reference}...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer
        title="Order Allocation Details"
        description="Verify research allocation progress, batch threshold funding, and shipment status."
      >
        <TrackingEmptyState
          searchedRef={reference}
          onResetSearch={() => navigate('/order-tracker')}
        />
      </PageContainer>
    );
  }

  const timelineSteps = OrderService.getTimeline(order);

  return (
    <PageContainer
      title={`Order Allocation: ${order.referenceNumber}`}
      description="Live status breakdown, courier waybill, and allocation records."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="cyan"
            size="sm"
            onClick={() => setShowReceiptModal(true)}
            className="text-xs font-mono font-bold"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            View Receipt
          </Button>

          <Link to="/order-tracker">
            <Button variant="outline" size="sm" className="border-white/20 text-slate-300 text-xs font-mono">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Search Other Order
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Header Banner */}
        <TrackingHeader order={order} />

        {/* Visual Lifecycle Timeline */}
        <OrderTimeline steps={timelineSteps} />

        {/* Two-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Products Table & Notes (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <OrderProductsTable items={order.items} />
          </div>

          {/* Right Column: Order Summary, Shipping & Payment (5 columns) */}
          <div className="lg:col-span-5">
            <OrderSummaryCard order={order} />
          </div>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {showReceiptModal && (
        <OrderReceiptModal order={order} onClose={() => setShowReceiptModal(false)} />
      )}
    </PageContainer>
  );
};
