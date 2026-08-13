import React, { useState, useEffect, useCallback } from 'react';
import { Truck, RefreshCw, Download, Sparkles, CheckCircle2, Printer, ShieldCheck } from 'lucide-react';
import {
  ShipmentRecord,
  ShipmentFilterOptions,
  CourierName,
  ShippingStatus,
} from '../../types/shipping';
import { ShippingManagementService } from '../../services/shippingManagementService';
import { ShippingStatsHeader } from '../../components/admin/shipping/ShippingStatsHeader';
import { ShippingFilters } from '../../components/admin/shipping/ShippingFilters';
import { ShipmentTable } from '../../components/admin/shipping/ShipmentTable';
import { ShipmentDetailDrawer } from '../../components/admin/shipping/ShipmentDetailDrawer';
import {
  AssignTrackingModal,
  UpdateShippingStatusModal,
  PrintPackingSlipModal,
  PrintShippingLabelModal,
} from '../../components/admin/shipping/ShippingActionModals';
import { ShippingBulkActions } from '../../components/admin/shipping/ShippingBulkActions';

export const AdminShippingPage: React.FC = () => {
  // Filter & Queue State
  const [filters, setFilters] = useState<ShipmentFilterOptions>({
    searchQuery: '',
    storeFilter: 'all',
    courierFilter: 'all',
    shippingStatusFilter: 'all',
    packingStatusFilter: 'all',
    dateRange: 'all',
    sortBy: 'date_desc',
    page: 1,
    pageSize: 10,
  });

  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [stats, setStats] = useState({
    totalShipments: 0,
    pendingPackingCount: 0,
    inTransitCount: 0,
    deliveredCount: 0,
    failedReturnedCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drawers & Modals state
  const [drawerShipment, setDrawerShipment] = useState<ShipmentRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [assignTrackingShipment, setAssignTrackingShipment] = useState<ShipmentRecord | null>(null);
  const [isAssignTrackingOpen, setIsAssignTrackingOpen] = useState<boolean>(false);

  const [updateStatusShipment, setUpdateStatusShipment] = useState<ShipmentRecord | null>(null);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState<boolean>(false);

  const [packingSlipShipment, setPackingSlipShipment] = useState<ShipmentRecord | null>(null);
  const [isPackingSlipOpen, setIsPackingSlipOpen] = useState<boolean>(false);

  const [shippingLabelShipment, setShippingLabelShipment] = useState<ShipmentRecord | null>(null);
  const [isShippingLabelOpen, setIsShippingLabelOpen] = useState<boolean>(false);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Shipments
  const loadShipments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ShippingManagementService.getShipments(filters);
      setShipments(res.shipments);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
      setStats(res.stats);

      // Keep active drawer/modals synced if active
      if (drawerShipment) {
        const updated = res.shipments.find((s) => s.id === drawerShipment.id);
        if (updated) setDrawerShipment(updated);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, drawerShipment?.id]);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  useEffect(() => {
    const unsub = ShippingManagementService.subscribeToShipmentUpdates(() => {
      loadShipments();
    });
    return () => unsub();
  }, [loadShipments]);

  // Handle Selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(shipments.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Drawer handlers
  const handleOpenDrawer = (shipment: ShipmentRecord) => {
    setDrawerShipment(shipment);
    setIsDrawerOpen(true);
  };

  // Modal Open Handlers
  const handleOpenAssignTracking = (shipment: ShipmentRecord) => {
    setAssignTrackingShipment(shipment);
    setIsAssignTrackingOpen(true);
  };

  const handleOpenUpdateStatus = (shipment: ShipmentRecord) => {
    setUpdateStatusShipment(shipment);
    setIsUpdateStatusOpen(true);
  };

  const handleOpenPackingSlip = (shipment: ShipmentRecord) => {
    setPackingSlipShipment(shipment);
    setIsPackingSlipOpen(true);
  };

  const handleOpenShippingLabel = (shipment: ShipmentRecord) => {
    setShippingLabelShipment(shipment);
    setIsShippingLabelOpen(true);
  };

  // Bulk Actions
  const handleBulkAssignCourier = async (courier: CourierName) => {
    if (selectedIds.length === 0) return;
    const count = await ShippingManagementService.bulkAssignCourier(selectedIds, courier, 'Admin User');
    showToast(`Bulk assigned carrier to ${count} shipments.`);
    setSelectedIds([]);
  };

  const handleBulkUpdateStatus = async (status: ShippingStatus) => {
    if (selectedIds.length === 0) return;
    const count = await ShippingManagementService.bulkUpdateStatus(selectedIds, status, 'Admin User');
    showToast(`Bulk updated status to ${status.replace(/_/g, ' ')} for ${count} shipments.`);
    setSelectedIds([]);
  };

  const handleBulkPrintLabels = () => {
    if (selectedIds.length === 0) return;
    const firstSelected = shipments.find((s) => selectedIds.includes(s.id));
    if (firstSelected) {
      handleOpenShippingLabel(firstSelected);
    }
  };

  const handleBulkExport = (format: 'csv' | 'excel' | 'sheets') => {
    if (selectedIds.length === 0) return;
    ShippingManagementService.bulkExportShipments(selectedIds, format);
    showToast(`Exported ${selectedIds.length} shipments as ${format.toUpperCase()}.`);
  };

  // Export All
  const handleExportAll = () => {
    ShippingManagementService.exportShipments(shipments, 'csv');
    showToast(`Exported ${shipments.length} current shipments to CSV.`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      storeFilter: 'all',
      courierFilter: 'all',
      shippingStatusFilter: 'all',
      packingStatusFilter: 'all',
      dateRange: 'all',
      sortBy: 'date_desc',
      page: 1,
      pageSize: 10,
    });
    setSelectedIds([]);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-cyan-950 border border-cyan-500 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              Module 4.6 • Logistics & Cleanroom
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Operational Team Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-cyan-400" /> Fulfillment & Shipping Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage packing, courier assignment, tracking numbers, and shipping progress monitoring for GroupBuy, OnHand, and MOQ stores.
          </p>
        </div>

        {/* Global Action Header Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadShipments}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </button>
          <button
            onClick={handleExportAll}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" /> Export All (CSV)
          </button>
        </div>
      </div>

      {/* KPI Stats Header */}
      <ShippingStatsHeader stats={stats} loading={loading} />

      {/* Filter Options */}
      <ShippingFilters
        filters={filters}
        onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
        onResetFilters={handleResetFilters}
        onRefresh={loadShipments}
        totalResults={totalCount}
      />

      {/* Main Shipment Table */}
      <ShipmentTable
        shipments={shipments}
        loading={loading}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onViewDetail={handleOpenDrawer}
        onAssignTracking={handleOpenAssignTracking}
        onUpdateStatus={handleOpenUpdateStatus}
        page={filters.page}
        pageSize={filters.pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      />

      {/* Shipment Detail Drawer */}
      <ShipmentDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        shipment={drawerShipment}
        onOpenAssignTrackingModal={() => drawerShipment && handleOpenAssignTracking(drawerShipment)}
        onOpenUpdateStatusModal={() => drawerShipment && handleOpenUpdateStatus(drawerShipment)}
        onOpenPackingSlipModal={() => drawerShipment && handleOpenPackingSlip(drawerShipment)}
        onOpenLabelModal={() => drawerShipment && handleOpenShippingLabel(drawerShipment)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Assign Tracking Modal */}
      {assignTrackingShipment && (
        <AssignTrackingModal
          isOpen={isAssignTrackingOpen}
          onClose={() => setIsAssignTrackingOpen(false)}
          shipment={assignTrackingShipment}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Update Status Modal */}
      {updateStatusShipment && (
        <UpdateShippingStatusModal
          isOpen={isUpdateStatusOpen}
          onClose={() => setIsUpdateStatusOpen(false)}
          shipment={updateStatusShipment}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Print Packing Slip Modal */}
      {packingSlipShipment && (
        <PrintPackingSlipModal
          isOpen={isPackingSlipOpen}
          onClose={() => setIsPackingSlipOpen(false)}
          shipment={packingSlipShipment}
        />
      )}

      {/* Print Shipping Label Modal */}
      {shippingLabelShipment && (
        <PrintShippingLabelModal
          isOpen={isShippingLabelOpen}
          onClose={() => setIsShippingLabelOpen(false)}
          shipment={shippingLabelShipment}
        />
      )}

      {/* Floating Bulk Action Bar */}
      <ShippingBulkActions
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onBulkAssignCourier={handleBulkAssignCourier}
        onBulkUpdateStatus={handleBulkUpdateStatus}
        onBulkPrintLabels={handleBulkPrintLabels}
        onBulkExport={handleBulkExport}
      />
    </div>
  );
};
