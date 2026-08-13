import React from 'react';
import { Truck } from 'lucide-react';
import { AdminOrdersPage } from './AdminOrdersPage';

/**
 * Production-safe fulfillment workspace.
 *
 * Shipment-specific persistence is not part of the current production schema, so
 * fulfillment is managed through the authoritative order and fulfillment statuses.
 * This deliberately avoids displaying or mutating the former demonstration shipment
 * records while retaining the existing order status workflow.
 */
export const AdminShippingPage: React.FC = () => (
  <div className="space-y-6">
    <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
      <div className="flex items-center gap-2 text-cyan-300">
        <Truck className="h-5 w-5" />
        <h2 className="font-semibold">Shipping &amp; Fulfillment</h2>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Manage packing, ready-to-ship, in-transit, delivered, and completed states using live production orders.
        Courier and tracking details remain blank until real shipment information is available.
      </p>
    </div>
    <AdminOrdersPage />
  </div>
);

