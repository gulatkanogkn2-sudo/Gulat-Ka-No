import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, RefreshCw, FileSpreadsheet, Check, AlertCircle, Crown } from 'lucide-react';

import {
  CustomerDetail,
  CustomerFilterOptions,
  CustomerAccountStatus,
  CustomerTier,
} from '../../types/customer';
import { CustomerManagementService } from '../../services/customerManagementService';
import { CustomerStatsHeader } from '../../components/admin/customers/CustomerStatsHeader';
import { CustomerFilters } from '../../components/admin/customers/CustomerFilters';
import { CustomerTable } from '../../components/admin/customers/CustomerTable';
import { CustomerBulkActions } from '../../components/admin/customers/CustomerBulkActions';
import { CustomerDetailDrawer } from '../../components/admin/customers/CustomerDetailDrawer';
import { CustomerEditModal } from '../../components/admin/customers/CustomerEditModal';
import { CustomerNotificationModal } from '../../components/admin/customers/CustomerNotificationModal';

export const AdminCustomersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial filter options derived from URL query parameters if present
  const initialStatus = (searchParams.get('status') as CustomerFilterOptions['statusFilter']) || 'all';
  const initialTier = (searchParams.get('tier') as CustomerFilterOptions['tierFilter']) || 'all';

  const [filters, setFilters] = useState<CustomerFilterOptions>({
    searchQuery: '',
    statusFilter: initialStatus,
    tierFilter: initialTier,
    verificationFilter: 'all',
    dateRange: 'all',
    sortBy: 'registration_desc',
    page: 1,
    pageSize: 10,
  });

  const [customers, setCustomers] = useState<CustomerDetail[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Selected customer IDs for bulk operations
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Modals & Drawers state
  const [activeProfileCustomer, setActiveProfileCustomer] = useState<CustomerDetail | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDetail | null>(null);
  const [notifyingCustomer, setNotifyingCustomer] = useState<CustomerDetail | null>(null);

  // Notification / Toast Feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch customers from service
  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await CustomerManagementService.getCustomers(filters);
      setCustomers(result.customers);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = CustomerManagementService.subscribeToCustomerUpdates(() => {
      loadCustomers();
    });
    return () => unsubscribe();
  }, [loadCustomers]);

  // Handle filter changes
  const handleFilterChange = (newFilters: CustomerFilterOptions) => {
    setFilters(newFilters);

    const params: Record<string, string> = {};
    if (newFilters.statusFilter && newFilters.statusFilter !== 'all') {
      params.status = newFilters.statusFilter;
    }
    if (newFilters.tierFilter && newFilters.tierFilter !== 'all') {
      params.tier = newFilters.tierFilter;
    }
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      statusFilter: 'all',
      tierFilter: 'all',
      verificationFilter: 'all',
      dateRange: 'all',
      sortBy: 'registration_desc',
      page: 1,
      pageSize: 10,
    });
    setSearchParams({}, { replace: true });
  };

  // Selection handlers
  const handleSelectCustomer = (customerId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCustomerIds((prev) => [...prev, customerId]);
    } else {
      setSelectedCustomerIds((prev) => prev.filter((id) => id !== customerId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const currentPageIds = customers.map((c) => c.id);
      setSelectedCustomerIds(Array.from(new Set([...selectedCustomerIds, ...currentPageIds])));
    } else {
      const currentPageIds = new Set(customers.map((c) => c.id));
      setSelectedCustomerIds(selectedCustomerIds.filter((id) => !currentPageIds.has(id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedCustomerIds([]);
  };

  // Bulk Actions
  const handleBulkStatusUpdate = async (status: CustomerAccountStatus) => {
    if (selectedCustomerIds.length === 0) return;
    const count = await CustomerManagementService.bulkUpdateStatus(selectedCustomerIds, status);
    setSelectedCustomerIds([]);
    await loadCustomers();
    showToast(`Successfully updated account status to ${status} for ${count} customer(s).`);
  };

  const handleBulkTierUpdate = async (tier: CustomerTier) => {
    if (selectedCustomerIds.length === 0) return;
    const count = await CustomerManagementService.bulkUpdateTier(selectedCustomerIds, tier);
    setSelectedCustomerIds([]);
    await loadCustomers();
    showToast(`Assigned ${tier} tier to ${count} customer(s).`);
  };

  const handleBulkExport = (format: 'csv' | 'excel' | 'sheets') => {
    const exportResult = CustomerManagementService.exportCustomers(selectedCustomerIds, format);
    CustomerManagementService.downloadExport(exportResult);
    showToast(`Exported ${selectedCustomerIds.length || totalCount} customer record(s).`);
  };

  // Individual Actions
  const handleQuickStatusChange = async (
    customer: CustomerDetail,
    newStatus: CustomerAccountStatus
  ) => {
    const updated = await CustomerManagementService.updateCustomerStatus(
      customer.id,
      newStatus,
      `Quick status change trigger to ${newStatus}`
    );
    if (updated) {
      await loadCustomers();
      showToast(`Account ${customer.customerCode} status set to ${newStatus}.`);
      if (activeProfileCustomer && activeProfileCustomer.id === customer.id) {
        setActiveProfileCustomer(updated);
      }
    }
  };

  const handleResetPassword = (customer: CustomerDetail) => {
    showToast(`🔑 Security reset link generated and dispatched to ${customer.email}.`);
  };

  const handleSaveCustomerProfile = async (updates: Partial<CustomerDetail>) => {
    if (!editingCustomer) return;
    const updated = await CustomerManagementService.updateCustomer(editingCustomer.id, updates);
    if (updated) {
      await loadCustomers();
      showToast(`Profile for ${updated.name} updated successfully.`);
      if (activeProfileCustomer && activeProfileCustomer.id === updated.id) {
        setActiveProfileCustomer(updated);
      }
    }
  };

  const handleSendNotification = (
    customerName: string,
    channel: string,
    subject: string,
    message: string
  ) => {
    showToast(`📨 Administrative ${channel} notification dispatched to ${customerName}.`);
  };

  const handleRecalculateTiers = () => {
    const updatedCount = CustomerManagementService.recalculateAllCustomerTiers();
    loadCustomers();
    showToast(`Recalculated customer tiers across directory (${updatedCount} account(s) updated).`);
  };

  const handleExportFiltered = () => {
    const exportResult = CustomerManagementService.exportCustomers(
      customers.map((c) => c.id),
      'csv'
    );
    CustomerManagementService.downloadExport(exportResult);
  };

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-300 font-mono text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-white uppercase">
              Customer Management
            </h1>
            <span className="px-2.5 py-0.5 bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-semibold rounded">
              Registered Customers
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Customer accounts, verification status, delivery details, tiers, and order history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecalculateTiers}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
            title="Evaluate Spending & Update Tiers Automatically"
          >
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>Recalculate Tiers</span>
          </button>

          <button
            onClick={loadCustomers}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-mono transition-all cursor-pointer"
            title="Refresh Directory List"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportFiltered}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-medium transition-all"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export View</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics Metric Cards */}
      <CustomerStatsHeader />

      {/* Filter and Search Bar */}
      <CustomerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Responsive Customer Table */}
      <CustomerTable
        customers={customers}
        selectedCustomerIds={selectedCustomerIds}
        onSelectCustomer={handleSelectCustomer}
        onSelectAll={handleSelectAll}
        onViewProfile={(cust) => setActiveProfileCustomer(cust)}
        onEditCustomer={(cust) => setEditingCustomer(cust)}
        onQuickStatusChange={handleQuickStatusChange}
        onResetPassword={handleResetPassword}
        onSendNotification={(cust) => setNotifyingCustomer(cust)}
        currentPage={filters.page || 1}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(page) => handleFilterChange({ ...filters, page })}
      />

      {/* Floating Bulk Actions Bar */}
      <CustomerBulkActions
        selectedCount={selectedCustomerIds.length}
        onClearSelection={handleClearSelection}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkTierUpdate={handleBulkTierUpdate}
        onBulkExport={handleBulkExport}
      />

      {/* Reusable Customer Profile Sliding Drawer */}
      {activeProfileCustomer && (
        <CustomerDetailDrawer
          customer={activeProfileCustomer}
          onClose={() => setActiveProfileCustomer(null)}
          onEditCustomer={(cust) => setEditingCustomer(cust)}
          onResetPassword={handleResetPassword}
          onSendNotification={(cust) => setNotifyingCustomer(cust)}
          onCustomerUpdated={(updated) => {
            setActiveProfileCustomer(updated);
            loadCustomers();
          }}
        />
      )}

      {/* Edit Customer Profile Modal */}
      {editingCustomer && (
        <CustomerEditModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={handleSaveCustomerProfile}
        />
      )}

      {/* Send Notification Modal */}
      {notifyingCustomer && (
        <CustomerNotificationModal
          customer={notifyingCustomer}
          onClose={() => setNotifyingCustomer(null)}
          onSend={handleSendNotification}
        />
      )}
    </div>
  );
};

