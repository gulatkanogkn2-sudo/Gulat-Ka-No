import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, RefreshCw, FileSpreadsheet, Plus, AlertCircle } from 'lucide-react';

import { OrderDetail, OrderFilterOptions, OrderStatus } from '../../types/order';
import { OrderManagementService } from '../../services/orderManagementService';
import { OrderStatsHeader } from '../../components/admin/orders/OrderStatsHeader';
import { OrderFilters } from '../../components/admin/orders/OrderFilters';
import { OrderTable } from '../../components/admin/orders/OrderTable';
import { OrderBulkActions } from '../../components/admin/orders/OrderBulkActions';
import { OrderDetailDrawer } from '../../components/admin/orders/OrderDetailDrawer';
import { UpdateStatusModal } from '../../components/admin/orders/UpdateStatusModal';
import { PrintPreviewModal } from '../../components/admin/orders/PrintPreviewModal';

export const AdminOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial filter options derived from URL params if present
  const initialStore = (searchParams.get('store') as OrderFilterOptions['storeFilter']) || 'all';
  const initialStatus = (searchParams.get('status') as OrderFilterOptions['orderStatusFilter']) || 'all';

  const [filters, setFilters] = useState<OrderFilterOptions>({
    searchQuery: '',
    storeFilter: initialStore,
    orderStatusFilter: initialStatus,
    paymentStatusFilter: 'all',
    shippingStatusFilter: 'all',
    dateRange: 'all',
    sortBy: 'date_desc',
    page: 1,
    pageSize: 10,
  });

  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Selected order IDs for bulk operations
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Modals & Drawers state
  const [activeDetailOrder, setActiveDetailOrder] = useState<OrderDetail | null>(null);
  const [updateStatusOrder, setUpdateStatusOrder] = useState<OrderDetail | null>(null);

  // Print modal state
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    orders: OrderDetail[];
    documentType: 'packing_slip' | 'invoice';
  }>({
    isOpen: false,
    orders: [],
    documentType: 'packing_slip',
  });

  // Load orders using OrderManagementService
  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await OrderManagementService.getOrders(filters);
      setOrders(result.orders);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Subscribe to real-time order updates preparation
  useEffect(() => {
    const unsubscribe = OrderManagementService.subscribeToOrderUpdates(() => {
      loadOrders();
    });
    return () => unsubscribe();
  }, [loadOrders]);

  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filter change handler
  const handleFilterChange = (newFilters: OrderFilterOptions) => {
    setFilters(newFilters);

    // Sync store filter to URL search params for bookmarking
    const params: Record<string, string> = {};
    if (newFilters.storeFilter && newFilters.storeFilter !== 'all') {
      params.store = newFilters.storeFilter;
    }
    if (newFilters.orderStatusFilter && newFilters.orderStatusFilter !== 'all') {
      params.status = newFilters.orderStatusFilter;
    }
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      storeFilter: 'all',
      batchFilter: 'all',
      orderStatusFilter: 'all',
      paymentStatusFilter: 'all',
      shippingStatusFilter: 'all',
      dateRange: 'all',
      customStartDate: undefined,
      customEndDate: undefined,
      sortBy: 'date_desc',
      page: 1,
      pageSize: 10,
    });
    setSearchParams({}, { replace: true });
  };

  // Selection handlers
  const handleSelectOrder = (orderId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedOrderIds((prev) => [...prev, orderId]);
    } else {
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const currentPageIds = orders.map((o) => o.id);
      setSelectedOrderIds(Array.from(new Set([...selectedOrderIds, ...currentPageIds])));
    } else {
      const currentPageIds = new Set(orders.map((o) => o.id));
      setSelectedOrderIds(selectedOrderIds.filter((id) => !currentPageIds.has(id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedOrderIds([]);
  };

  // Bulk Actions
  const handleBulkStatusUpdate = async (status: OrderStatus) => {
    if (selectedOrderIds.length === 0) return;
    await OrderManagementService.bulkUpdateStatus(selectedOrderIds, status);
    setSelectedOrderIds([]);
    await loadOrders();
    if (activeDetailOrder && selectedOrderIds.includes(activeDetailOrder.id)) {
      const updated = await OrderManagementService.getOrderById(activeDetailOrder.id);
      if (updated) setActiveDetailOrder(updated);
    }
  };

  const handleBulkAssignBatch = async (batchNumber: string) => {
    if (selectedOrderIds.length === 0) return;
    await OrderManagementService.bulkAssignBatch(selectedOrderIds, batchNumber);
    setSelectedOrderIds([]);
    await loadOrders();
    if (activeDetailOrder && selectedOrderIds.includes(activeDetailOrder.id)) {
      const updated = await OrderManagementService.getOrderById(activeDetailOrder.id);
      if (updated) setActiveDetailOrder(updated);
    }
  };

  const handleBulkExport = (format: 'csv' | 'excel' | 'sheets') => {
    const exportResult = OrderManagementService.exportOrders(selectedOrderIds, format);
    OrderManagementService.downloadExport(exportResult);
  };

  const handleBulkPrint = (type: 'packing_slip' | 'invoice') => {
    const selectedOrdersList = orders.filter((o) => selectedOrderIds.includes(o.id));
    setPrintModalState({
      isOpen: true,
      orders: selectedOrdersList.length > 0 ? selectedOrdersList : orders,
      documentType: type,
    });
  };

  // Individual Order Actions
  const handleConfirmStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
    noteText: string
  ) => {
    await OrderManagementService.updateOrderStatus(orderId, newStatus, noteText);
    await loadOrders();
    if (activeDetailOrder && activeDetailOrder.id === orderId) {
      const updated = await OrderManagementService.getOrderById(orderId);
      if (updated) setActiveDetailOrder(updated);
    }
  };

  const handleExportAllFiltered = () => {
    const exportResult = OrderManagementService.exportFilteredOrders(filters, 'csv');
    if (!exportResult.success) {
      setExportNotice(exportResult.message || 'No orders match the current filters.');
      setTimeout(() => setExportNotice(null), 4000);
      return;
    }
    OrderManagementService.downloadExport(exportResult);
  };

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Toast Notice for Export Feedback */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-950/90 border border-amber-500/50 text-amber-300 px-4 py-3 rounded-xl text-xs font-mono shadow-2xl flex items-center gap-2.5 animate-bounce">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Top Title & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-white uppercase">
              Order Management
            </h1>
            <span className="px-2.5 py-0.5 bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-semibold rounded">
              Module 4.3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Central workspace for customer order fulfillment across GroupBuy, OnHand Vault, and MOQ Bulk stores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-mono transition-all cursor-pointer"
            title="Refresh Order List"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportAllFiltered}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.08)]"
            title={`Export all ${totalCount} filtered orders`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export View ({totalCount})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <OrderStatsHeader orders={orders} />

      {/* Independent Store Order Queues Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-xl font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleFilterChange({ ...filters, storeFilter: 'all', batchFilter: 'all', page: 1 })}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filters.storeFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>All Orders Queue</span>
          </button>
          <button
            onClick={() => handleFilterChange({ ...filters, storeFilter: 'groupbuy', batchFilter: 'all', page: 1 })}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filters.storeFilter === 'groupbuy'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>GroupBuy Queue (GB-)</span>
          </button>
          <button
            onClick={() => handleFilterChange({ ...filters, storeFilter: 'onhand', batchFilter: 'all', page: 1 })}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filters.storeFilter === 'onhand'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>OnHand Queue (OH-)</span>
          </button>
          <button
            onClick={() => handleFilterChange({ ...filters, storeFilter: 'moq', batchFilter: 'all', page: 1 })}
            className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filters.storeFilter === 'moq'
                ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.2)]'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
            <span>MOQ Queue (MOQ-)</span>
          </button>
        </div>
        <div className="text-[11px] text-slate-400 px-2">
          Isolated Order Sequences & Daily Operations
        </div>
      </div>

      {/* Filters Bar */}
      <OrderFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Main Order Table */}
      <OrderTable
        orders={orders}
        selectedOrderIds={selectedOrderIds}
        onSelectOrder={handleSelectOrder}
        onSelectAll={handleSelectAll}
        onViewDetail={(order) => setActiveDetailOrder(order)}
        onUpdateStatus={(order) => setUpdateStatusOrder(order)}
        currentPage={filters.page || 1}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(page) => handleFilterChange({ ...filters, page })}
      />

      {/* Floating Bulk Actions Bar */}
      <OrderBulkActions
        selectedCount={selectedOrderIds.length}
        onClearSelection={handleClearSelection}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkAssignBatch={handleBulkAssignBatch}
        onBulkExport={handleBulkExport}
        onBulkPrint={handleBulkPrint}
      />

      {/* Sliding Order Detail Drawer */}
      {activeDetailOrder && (
        <OrderDetailDrawer
          order={activeDetailOrder}
          onClose={() => setActiveDetailOrder(null)}
          onUpdateStatus={(order) => setUpdateStatusOrder(order)}
          onPrintSlip={(order) =>
            setPrintModalState({ isOpen: true, orders: [order], documentType: 'packing_slip' })
          }
          onPrintInvoice={(order) =>
            setPrintModalState({ isOpen: true, orders: [order], documentType: 'invoice' })
          }
          onOrderUpdated={(updated) => {
            setActiveDetailOrder(updated);
            loadOrders();
          }}
        />
      )}

      {/* Update Status Modal */}
      {updateStatusOrder && (
        <UpdateStatusModal
          order={updateStatusOrder}
          onClose={() => setUpdateStatusOrder(null)}
          onConfirm={handleConfirmStatusChange}
        />
      )}

      {/* Printable Document Modal */}
      {printModalState.isOpen && (
        <PrintPreviewModal
          orders={printModalState.orders}
          documentType={printModalState.documentType}
          onClose={() =>
            setPrintModalState({ isOpen: false, orders: [], documentType: 'packing_slip' })
          }
        />
      )}
    </div>
  );
};

