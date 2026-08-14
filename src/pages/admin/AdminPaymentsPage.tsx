import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  PaymentVerificationRecord,
  PaymentFilterOptions,
} from '../../types/paymentVerification';
import { PaymentVerificationService } from '../../services/paymentVerificationService';
import { PaymentStatsHeader } from '../../components/admin/payments/PaymentStatsHeader';
import { PaymentFilters } from '../../components/admin/payments/PaymentFilters';
import { PaymentTable } from '../../components/admin/payments/PaymentTable';
import { PaymentDetailDrawer } from '../../components/admin/payments/PaymentDetailDrawer';
import { PaymentProofViewerModal } from '../../components/admin/payments/PaymentProofViewerModal';
import {
  RejectPaymentModal,
  RequestInfoModal,
  ReassignVerifierModal,
} from '../../components/admin/payments/PaymentActionModals';
import { PaymentBulkActions } from '../../components/admin/payments/PaymentBulkActions';

export const AdminPaymentsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderIdParam = new URLSearchParams(location.search).get('orderId');
  const openedFromOrderParam = useRef(false);
  // Filter & Queue State
  const [filters, setFilters] = useState<PaymentFilterOptions>({
    searchQuery: '',
    storeFilter: 'all',
    paymentMethodFilter: 'all',
    statusFilter: 'all',
    dateRange: 'all',
    sortBy: 'date_desc',
    page: 1,
    pageSize: 10,
  });

  const [payments, setPayments] = useState<PaymentVerificationRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drawer & Modal States
  const [drawerPayment, setDrawerPayment] = useState<PaymentVerificationRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [proofViewerPayment, setProofViewerPayment] = useState<PaymentVerificationRecord | null>(null);
  const [isProofViewerOpen, setIsProofViewerOpen] = useState<boolean>(false);

  const [rejectModalPayment, setRejectModalPayment] = useState<PaymentVerificationRecord | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);

  const [infoModalPayment, setInfoModalPayment] = useState<PaymentVerificationRecord | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  const [reassignModalPayment, setReassignModalPayment] = useState<PaymentVerificationRecord | null>(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState<boolean>(false);

  // Helper for floating notification toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch payments list
  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await PaymentVerificationService.getPayments(filters);
      setPayments(res.payments);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);

      // If drawer or proof viewer is active, sync updated object
      if (drawerPayment) {
        const updated = res.payments.find((p) => p.id === drawerPayment.id);
        if (updated) setDrawerPayment(updated);
      }
      if (proofViewerPayment) {
        const updated = res.payments.find((p) => p.id === proofViewerPayment.id);
        if (updated) setProofViewerPayment(updated);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, drawerPayment?.id, proofViewerPayment?.id]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    if (!orderIdParam) {
      if (openedFromOrderParam.current) {
        openedFromOrderParam.current = false;
        setDrawerPayment(null);
        setIsDrawerOpen(false);
      }
      return;
    }
    if (loading) return;
    const exactPayment = payments.find((payment) => payment.orderId === orderIdParam);
    if (exactPayment) {
      openedFromOrderParam.current = true;
      setDrawerPayment(exactPayment);
      setIsDrawerOpen(true);
    }
  }, [orderIdParam, payments, loading]);

  const closePaymentDrawer = useCallback(() => {
    openedFromOrderParam.current = false;
    setDrawerPayment(null);
    setIsDrawerOpen(false);
    const params = new URLSearchParams(location.search);
    if (params.has('orderId')) {
      params.delete('orderId');
      const nextSearch = params.toString();
      navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' }, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    const unsub = PaymentVerificationService.subscribeToPaymentUpdates(() => {
      loadPayments();
    });
    return () => unsub();
  }, [loadPayments]);

  // Handle Selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(payments.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Single Actions
  const handleVerifyPayment = async (p: PaymentVerificationRecord) => {
    await PaymentVerificationService.verifyPayment(p.id, 'Admin Sarah');
    showToast(`Payment ${p.paymentReference} verified successfully! Order status set to CONFIRMED.`);
    closePaymentDrawer();
    await loadPayments();
  };

  const handleOpenRejectModal = (p: PaymentVerificationRecord) => {
    setRejectModalPayment(p);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectModalPayment) return;
    await PaymentVerificationService.rejectPayment(
      rejectModalPayment.id,
      reason,
      'Admin Sarah'
    );
    showToast(`Payment ${rejectModalPayment.paymentReference} rejected. Reason logged.`);
    setIsRejectModalOpen(false);
    closePaymentDrawer();
    await loadPayments();
  };

  const handleOpenInfoModal = (p: PaymentVerificationRecord) => {
    setInfoModalPayment(p);
    setIsInfoModalOpen(true);
  };

  const handleConfirmRequestInfo = async (requestText: string) => {
    if (!infoModalPayment) return;
    await PaymentVerificationService.requestAdditionalInfo(
      infoModalPayment.id,
      requestText,
      'Admin Sarah'
    );
    showToast(`Information request sent for ${infoModalPayment.paymentReference}.`);
    setIsInfoModalOpen(false);
    closePaymentDrawer();
    await loadPayments();
  };

  const handleOpenReassignModal = (p: PaymentVerificationRecord) => {
    setReassignModalPayment(p);
    setIsReassignModalOpen(true);
  };

  const handleConfirmReassign = async (newVerifier: string) => {
    if (!reassignModalPayment) return;
    await PaymentVerificationService.reassignVerifier(
      reassignModalPayment.id,
      newVerifier,
      'Admin Sarah'
    );
    showToast(`Payment ${reassignModalPayment.paymentReference} reassigned to ${newVerifier}.`);
    loadPayments();
  };

  // Bulk Actions
  const handleBulkVerify = async () => {
    if (selectedIds.length === 0) return;
    const count = await PaymentVerificationService.bulkUpdateStatus(
      selectedIds,
      'VERIFIED',
      'Admin Sarah'
    );
    showToast(`Successfully verified ${count} payment submissions in bulk.`);
    setSelectedIds([]);
    loadPayments();
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    const count = await PaymentVerificationService.bulkUpdateStatus(
      selectedIds,
      'REJECTED',
      'Admin Sarah'
    );
    showToast(`Successfully marked ${count} payment submissions as rejected in bulk.`);
    setSelectedIds([]);
    loadPayments();
  };

  const handleBulkExport = () => {
    if (selectedIds.length > 0) {
      const exportResult = PaymentVerificationService.exportPayments(selectedIds, 'csv');
      PaymentVerificationService.downloadExport(exportResult);
      showToast(`Exported ${selectedIds.length} selected payment verification records.`);
    } else {
      const exportResult = PaymentVerificationService.exportFilteredPayments(filters, 'csv');
      if (!exportResult.success) {
        showToast(exportResult.message || 'No payment records match the current filters.');
        return;
      }
      PaymentVerificationService.downloadExport(exportResult);
      showToast(`Exported ${exportResult.count} filtered payment verification records.`);
    }
  };

  // Proof Inspector Navigation
  const proofViewerIndex = payments.findIndex((p) => p.id === proofViewerPayment?.id);
  const hasNextProof = proofViewerIndex >= 0 && proofViewerIndex < payments.length - 1;
  const hasPrevProof = proofViewerIndex > 0;

  const handleNextProof = () => {
    if (hasNextProof) {
      setProofViewerPayment(payments[proofViewerIndex + 1]);
    }
  };

  const handlePrevProof = () => {
    if (hasPrevProof) {
      setProofViewerPayment(payments[proofViewerIndex - 1]);
    }
  };

  // Selected volume math
  const totalSelectedVolume = payments
    .filter((p) => selectedIds.includes(p.id))
    .reduce((sum, p) => sum + p.amountPaid, 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-300 font-mono text-xs px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.3)] flex items-center gap-2 animate-slideDown">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold text-white flex items-center gap-2">
                Payment Verification Queue
                <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                  Payments
                </span>
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Central workspace for administrators to verify customer payment proofs across GroupBuy, OnHand, and MOQ stores.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadPayments()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-semibold transition-colors"
            title="Refresh Queue Data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleBulkExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded-xl text-xs font-mono font-bold transition-colors shadow-[0_0_15px_rgba(0,217,255,0.15)] cursor-pointer"
            title={`Export ${selectedIds.length > 0 ? selectedIds.length + ' selected' : totalCount + ' filtered'} payment records`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Queue ({selectedIds.length > 0 ? selectedIds.length : totalCount})</span>
          </button>
        </div>
      </div>

      {/* Stats KPI Header */}
      <PaymentStatsHeader />

      {/* Queue Filters */}
      <PaymentFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            searchQuery: '',
            storeFilter: 'all',
            batchFilter: 'all',
            paymentMethodFilter: 'all',
            statusFilter: 'all',
            dateRange: 'all',
            customStartDate: undefined,
            customEndDate: undefined,
            sortBy: 'date_desc',
            page: 1,
            pageSize: 10,
          })
        }
        totalResults={totalCount}
      />

      {/* Responsive Verification Table */}
      <PaymentTable
        payments={payments}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onOpenDrawer={(p) => {
          setDrawerPayment(p);
          setIsDrawerOpen(true);
        }}
        onOpenProofViewer={(p) => {
          setProofViewerPayment(p);
          setIsProofViewerOpen(true);
        }}
        onVerify={handleVerifyPayment}
        onReject={handleOpenRejectModal}
        onReassign={handleOpenReassignModal}
        currentPage={filters.page || 1}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
      />

      {/* Detail Sliding Drawer */}
      <PaymentDetailDrawer
        isOpen={isDrawerOpen}
        onClose={closePaymentDrawer}
        payment={drawerPayment}
        onOpenProofViewer={(p) => {
          setProofViewerPayment(p);
          setIsProofViewerOpen(true);
        }}
        onVerify={handleVerifyPayment}
        onReject={handleOpenRejectModal}
        onRequestInfo={handleOpenInfoModal}
        onReassign={handleOpenReassignModal}
        onRefresh={loadPayments}
      />

      {/* Fullscreen Proof Inspector Modal */}
      <PaymentProofViewerModal
        isOpen={isProofViewerOpen}
        onClose={() => setIsProofViewerOpen(false)}
        payment={proofViewerPayment}
        onNext={handleNextProof}
        onPrev={handlePrevProof}
        hasNext={hasNextProof}
        hasPrev={hasPrevProof}
      />

      {/* Rejection Modal */}
      <RejectPaymentModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        payment={rejectModalPayment}
        onConfirm={handleConfirmReject}
      />

      {/* Additional Info Modal */}
      <RequestInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        payment={infoModalPayment}
        onConfirm={handleConfirmRequestInfo}
      />

      {/* Reassign Verifier Modal */}
      <ReassignVerifierModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        payment={reassignModalPayment}
        onConfirm={handleConfirmReassign}
      />

      {/* Floating Bulk Action Bar */}
      <PaymentBulkActions
        selectedCount={selectedIds.length}
        totalSelectedVolume={totalSelectedVolume}
        onBulkVerify={handleBulkVerify}
        onBulkReject={handleBulkReject}
        onBulkExport={handleBulkExport}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  );
};

