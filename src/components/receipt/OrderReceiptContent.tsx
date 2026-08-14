import React, { useState } from 'react';
import { OrderDetail } from '../../types/order';
import { formatPhpAmount, formatUsdAmount, convertUsdToPhp } from '../../utils/currencyUtils';
import { systemSettingsService } from '../../services/systemSettingsService';
import jsPDF from 'jspdf';
import {
  FileText,
  Download,
  X,
  Building2,
  MapPin,
  Package,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface OrderReceiptContentProps {
  order: OrderDetail;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const OrderReceiptContent: React.FC<OrderReceiptContentProps> = ({
  order,
  onClose,
  showCloseButton = true,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Use exchange rate captured on order snapshot, or fallback to current rate
  const rate = order.exchangeRateUsed || convertUsdToPhp(1);

  // Store Type Display Configuration
  const getStoreBadge = () => {
    const store = (order.storeType || 'groupbuy').toLowerCase();
    switch (store) {
      case 'onhand':
        return {
          label: 'ONHAND STORE',
          prefix: 'ON',
          color: 'text-[#8B5CF6]',
          bgColor: 'bg-[#8B5CF6]/10',
          borderColor: 'border-[#8B5CF6]/30',
        };
      case 'moq':
        return {
          label: 'MOQ STORE',
          prefix: 'MOQ',
          color: 'text-[#FF2ED1]',
          bgColor: 'bg-[#FF2ED1]/10',
          borderColor: 'border-[#FF2ED1]/30',
        };
      case 'groupbuy':
      default:
        return {
          label: 'GROUPBUY STORE',
          prefix: 'GB',
          color: 'text-[#00D9FF]',
          bgColor: 'bg-[#00D9FF]/10',
          borderColor: 'border-[#00D9FF]/30',
        };
    }
  };

  const storeBadge = getStoreBadge();
  const sysSettings = systemSettingsService.getSettings()?.general;
  const receiptTitle = (sysSettings?.companyName || sysSettings?.brandName || 'GKN V2 PEPTIDES').toUpperCase();

  // Helper calculation for PHP amounts based on order snapshot rate
  const toPhp = (usdAmount: number) => usdAmount * rate;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Dedicated PDF currency formatters to prevent jsPDF font metric unicode spacing issues
  const formatPdfPhp = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'PHP 0.00';
    const rounded = Math.round(amount * 100) / 100;
    return `PHP ${rounded.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPdfUsd = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00 USD';
    const rounded = Math.round(amount * 100) / 100;
    return `$${rounded.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setPdfError(null);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const marginX = 15;
      let currentY = 15;

      // 1. Header Section Box (Dark Slate accent)
      pdf.setFillColor(15, 23, 42); // #0f172a
      pdf.rect(marginX, currentY, 180, 22, 'F');

      // Title & Subtitle
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text(receiptTitle, marginX + 6, currentY + 9);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184); // Slate 400
      pdf.text('Official Order Receipt', marginX + 6, currentY + 16);

      // Store Badge Box
      pdf.setFillColor(2, 132, 199); // Sky Blue #0284c7
      pdf.rect(marginX + 128, currentY + 5, 46, 12, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text(storeBadge.label, marginX + 151, currentY + 12.5, { align: 'center' });

      currentY += 28;

      // 2. Order Metadata Grid Box
      pdf.setFillColor(248, 250, 252); // Slate 50
      pdf.setDrawColor(203, 213, 225); // Slate 300
      pdf.rect(marginX, currentY, 180, 20, 'FD');

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139); // Slate 500
      pdf.text('ORDER REFERENCE', marginX + 5, currentY + 6);
      pdf.text('DATE & TIME', marginX + 50, currentY + 6);
      pdf.text('PAYMENT METHOD', marginX + 100, currentY + 6);
      pdf.text('PAYMENT STATUS', marginX + 145, currentY + 6);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(2, 132, 199);
      pdf.text(order.referenceNumber, marginX + 5, currentY + 13);

      pdf.setTextColor(15, 23, 42);
      pdf.text(formatDate(order.orderDate), marginX + 50, currentY + 13);
      pdf.text(order.paymentMethod || 'N/A', marginX + 100, currentY + 13);
      pdf.text(order.paymentStatus || 'Pending Verification', marginX + 145, currentY + 13);

      currentY += 26;

      // 3. Customer & Shipping Info (2-column layout - both crisp white background)
      const colWidth = 87;

      // Calculate dynamic card height to fit content nicely
      const cardHeight = 32;

      // Left Box: Customer Details
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(marginX, currentY, colWidth, cardHeight, 'FD');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 116, 139);
      pdf.text('CUSTOMER DETAILS', marginX + 4, currentY + 6);
      pdf.setDrawColor(226, 232, 240);
      pdf.line(marginX + 4, currentY + 8, marginX + colWidth - 4, currentY + 8);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(order.customerName || 'Customer', marginX + 4, currentY + 14);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      let custY = currentY + 19;
      if (order.customerEmail) {
        pdf.text(order.customerEmail, marginX + 4, custY);
        custY += 4.5;
      }
      if (order.customerPhone) {
        pdf.text(order.customerPhone, marginX + 4, custY);
        custY += 4.5;
      }
      if (order.customerCompany) {
        pdf.text(order.customerCompany, marginX + 4, custY);
      }

      // Right Box: Shipping Destination (Crisp White Background matching Customer card)
      const rightX = marginX + colWidth + 6;
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(rightX, currentY, colWidth, cardHeight, 'FD');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 116, 139);
      pdf.text('SHIPPING DESTINATION', rightX + 4, currentY + 6);
      pdf.line(rightX + 4, currentY + 8, rightX + colWidth - 4, currentY + 8);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(order.shippingAddress.recipientName || 'Recipient', rightX + 4, currentY + 14);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      let shipY = currentY + 19;
      if (order.shippingAddress.addressLine1) {
        pdf.text(order.shippingAddress.addressLine1, rightX + 4, shipY);
        shipY += 4.5;
      }
      if (order.shippingAddress.addressLine2) {
        pdf.text(order.shippingAddress.addressLine2, rightX + 4, shipY);
        shipY += 4.5;
      }
      const cityLine = `${order.shippingAddress.city || ''}, ${order.shippingAddress.province || ''} ${order.shippingAddress.postalCode || ''}`.trim();
      if (cityLine) {
        pdf.text(cityLine, rightX + 4, shipY);
        shipY += 4.5;
      }
      if (order.shippingAddress.country) {
        pdf.text(order.shippingAddress.country, rightX + 4, shipY);
      }

      currentY += cardHeight + 6;

      // 4. Allocated Line Items Table Header
      pdf.setFillColor(15, 23, 42);
      pdf.rect(marginX, currentY, 180, 8, 'F');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('PRODUCT / ITEM', marginX + 4, currentY + 5.5, { align: 'left' });
      pdf.text('QTY', marginX + 95, currentY + 5.5, { align: 'center' });
      pdf.text('UNIT PRICE', marginX + 140, currentY + 5.5, { align: 'right' });
      pdf.text('SUBTOTAL', marginX + 176, currentY + 5.5, { align: 'right' });

      currentY += 8;

      // Product Rows
      order.items.forEach((item) => {
        const unitPhp = toPhp(item.price);
        const linePhp = toPhp(item.price * item.quantity);

        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(226, 232, 240);
        pdf.rect(marginX, currentY, 180, 11, 'FD');

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(15, 23, 42);
        pdf.text(item.name, marginX + 4, currentY + 4.5);

        if (item.variantLabel) {
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 116, 139);
          pdf.text(`(${item.variantLabel})`, marginX + 4, currentY + 8.5);
        }

        // Qty centered at 95mm
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(15, 23, 42);
        pdf.text(String(item.quantity), marginX + 95, currentY + 6.5, { align: 'center' });

        // Unit Price right-aligned at 140mm
        pdf.text(formatPdfPhp(unitPhp), marginX + 140, currentY + 4.5, { align: 'right' });
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139);
        pdf.text(formatPdfUsd(item.price), marginX + 140, currentY + 8.5, { align: 'right' });

        // Subtotal right-aligned at 176mm
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(2, 132, 199);
        pdf.text(formatPdfPhp(linePhp), marginX + 176, currentY + 4.5, { align: 'right' });
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 116, 139);
        pdf.text(formatPdfUsd(item.price * item.quantity), marginX + 176, currentY + 8.5, { align: 'right' });

        currentY += 11;
      });

      // Accessory Rows
      if (order.selectedAccessories && order.selectedAccessories.length > 0) {
        order.selectedAccessories.forEach((acc) => {
          const unitPhp = toPhp(acc.unitPriceUsd);
          const linePhp = toPhp(acc.totalPriceUsd);

          pdf.setFillColor(245, 243, 255);
          pdf.setDrawColor(226, 232, 240);
          pdf.rect(marginX, currentY, 180, 11, 'FD');

          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(109, 40, 217);
          pdf.text(`[Accessory] ${acc.name}`, marginX + 4, currentY + 6.5);

          pdf.setTextColor(15, 23, 42);
          pdf.text(String(acc.quantity), marginX + 95, currentY + 6.5, { align: 'center' });

          pdf.text(formatPdfPhp(unitPhp), marginX + 140, currentY + 4.5, { align: 'right' });
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 116, 139);
          pdf.text(formatPdfUsd(acc.unitPriceUsd), marginX + 140, currentY + 8.5, { align: 'right' });

          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(109, 40, 217);
          pdf.text(formatPdfPhp(linePhp), marginX + 176, currentY + 4.5, { align: 'right' });
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 116, 139);
          pdf.text(formatPdfUsd(acc.totalPriceUsd), marginX + 176, currentY + 8.5, { align: 'right' });

          currentY += 11;
        });
      }

      currentY += 6;

      // 5. Financial Summary Box
      const extraFeesCount = order.appliedFees ? order.appliedFees.length : 0;
      const hasDiscount = order.discount > 0;
      const summaryBoxHeight = 36 + extraFeesCount * 8 + (hasDiscount ? 8 : 0);

      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(203, 213, 225);
      pdf.rect(marginX, currentY, 180, summaryBoxHeight, 'FD');

      let sumY = currentY + 6;

      // Subtotal
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(71, 85, 105);
      pdf.text('Products Subtotal', marginX + 6, sumY);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(formatPdfPhp(toPhp(order.subtotal)), marginX + 174, sumY, { align: 'right' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`(${formatPdfUsd(order.subtotal)})`, marginX + 174, sumY + 3.8, { align: 'right' });
      sumY += 8;

      // Shipping
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Shipping & Delivery Fee', marginX + 6, sumY);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(formatPdfPhp(toPhp(order.shippingFee)), marginX + 174, sumY, { align: 'right' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`(${formatPdfUsd(order.shippingFee)})`, marginX + 174, sumY + 3.8, { align: 'right' });
      sumY += 8;

      // Extra Fees
      if (order.appliedFees && order.appliedFees.length > 0) {
        order.appliedFees.forEach((fee) => {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(71, 85, 105);
          pdf.text(fee.displayName, marginX + 6, sumY);

          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(15, 23, 42);
          pdf.text(formatPdfPhp(toPhp(fee.amountUsd)), marginX + 174, sumY, { align: 'right' });

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(7);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`(${formatPdfUsd(fee.amountUsd)})`, marginX + 174, sumY + 3.8, { align: 'right' });
          sumY += 8;
        });
      }

      // Discount
      if (order.discount > 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(22, 101, 52);
        pdf.text('Campaign Discount', marginX + 6, sumY);

        pdf.setFont('helvetica', 'bold');
        pdf.text(`-${formatPdfPhp(toPhp(order.discount))}`, marginX + 174, sumY, { align: 'right' });

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(22, 101, 52);
        pdf.text(`(-${formatPdfUsd(order.discount)})`, marginX + 174, sumY + 3.8, { align: 'right' });
        sumY += 8;
      }

      // Grand Total Line
      pdf.setDrawColor(203, 213, 225);
      pdf.line(marginX + 6, sumY, marginX + 174, sumY);
      sumY += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text('GRAND TOTAL', marginX + 6, sumY);

      pdf.setFontSize(12);
      pdf.setTextColor(2, 132, 199);
      pdf.text(formatPdfPhp(toPhp(order.grandTotal)), marginX + 174, sumY, { align: 'right' });

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      pdf.text(`(${formatPdfUsd(order.grandTotal)})`, marginX + 174, sumY + 4.5, { align: 'right' });

      // Calculate filename format: GKN-GB-000004.pdf or GKN-ON-000004.pdf or GKN-MOQ-000004.pdf
      let refPart = order.referenceNumber || '000000';
      if (!refPart.toUpperCase().startsWith('GKN')) {
        refPart = `GKN-${storeBadge.prefix}-${refPart}`;
      }
      const filename = `${refPart.replace(/[^a-zA-Z0-9-]/g, '')}.pdf`;

      // Save output as real vector PDF file
      pdf.save(filename);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setPdfError(err?.message || 'Failed to generate PDF document. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      id="gkn-printable-receipt"
      className="bg-[#090D16] border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 text-left font-mono relative overflow-hidden shadow-2xl max-w-3xl mx-auto w-full"
    >
      {/* Top Header & Store Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF]">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-white tracking-wider uppercase">
              {receiptTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400">Official Order Receipt</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wider ${storeBadge.bgColor} ${storeBadge.color} ${storeBadge.borderColor}`}
          >
            {storeBadge.label}
          </span>

          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              aria-label="Close receipt"
              className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/15 flex items-center justify-center transition-all cursor-pointer no-print shadow-sm active:scale-95"
              title="Close Receipt"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Action Bar (Real PDF Download Button) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 no-print">
        <div className="text-xs text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00D9FF]" />
          <span>Receipt Snapshot Saved</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 rounded-lg bg-[#00D9FF]/20 hover:bg-[#00D9FF]/30 text-[#00D9FF] border border-[#00D9FF]/40 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#00D9FF]" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'DOWNLOAD PDF'}</span>
          </button>
        </div>
      </div>

      {/* PDF Generation Error Banner if any */}
      {pdfError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 no-print">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{pdfError}</span>
        </div>
      )}

      {/* Metadata Key-Value Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-black/40 border border-white/5 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Order Ref</span>
          <span className="font-bold text-[#00D9FF] text-sm tracking-wide">
            {order.referenceNumber}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Date & Time</span>
          <span className="font-semibold text-slate-200">{formatDate(order.orderDate)}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Payment Method</span>
          <span className="font-semibold text-slate-200">{order.paymentMethod}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Payment Status</span>
          <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
            {order.paymentStatus || 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* Customer & Destination Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] pb-1 border-b border-white/5">
            <Building2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Customer Details</span>
          </div>
          <p className="font-bold text-white text-sm">{order.customerName || 'Customer'}</p>
          {order.customerEmail && <p className="text-slate-400">{order.customerEmail}</p>}
          {order.customerPhone && <p className="text-slate-400">{order.customerPhone}</p>}
          {order.customerCompany && (
            <p className="text-slate-300 font-semibold">{order.customerCompany}</p>
          )}
        </div>

        <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] pb-1 border-b border-white/5">
            <MapPin className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Shipping Destination</span>
          </div>
          <p className="font-bold text-white">{order.shippingAddress.recipientName}</p>
          <p className="text-slate-300">{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && (
            <p className="text-slate-400">{order.shippingAddress.addressLine2}</p>
          )}
          <p className="text-slate-400">
            {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>
      </div>

      {/* Allocated Line Items Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Package className="w-4 h-4 text-[#00D9FF]" />
          <span>Allocated Batch Items</span>
        </h4>

        <div className="rounded-xl border border-white/10 overflow-x-auto bg-black/30">
          <table className="w-full min-w-[440px] sm:min-w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/5 text-slate-400 border-b border-white/10 text-[10px] uppercase">
                <th className="p-3">Product / Item</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {order.items.map((item, idx) => {
                const lineUsd = item.price * item.quantity;
                const unitPhp = toPhp(item.price);
                const linePhp = toPhp(lineUsd);

                return (
                  <tr key={item.id || idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-white">{item.name}</p>
                      {item.variantLabel && (
                        <p className="text-[11px] text-slate-400">{item.variantLabel}</p>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold text-white">{item.quantity}</td>
                    <td className="p-3 text-right">
                      <p className="font-bold text-slate-200">{formatPhpAmount(unitPhp)}</p>
                      <p className="text-[10px] text-slate-400">{formatUsdAmount(item.price)}</p>
                    </td>
                    <td className="p-3 text-right">
                      <p className="font-bold text-[#00D9FF]">{formatPhpAmount(linePhp)}</p>
                      <p className="text-[10px] text-slate-400">{formatUsdAmount(lineUsd)}</p>
                    </td>
                  </tr>
                );
              })}

              {/* Accessories / Add-ons if present */}
              {order.selectedAccessories &&
                order.selectedAccessories.map((acc, idx) => {
                  const unitPhp = toPhp(acc.unitPriceUsd);
                  const linePhp = toPhp(acc.totalPriceUsd);

                  return (
                    <tr key={idx} className="bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10 transition-colors">
                      <td className="p-3">
                        <p className="font-bold text-[#8B5CF6]">[Accessory] {acc.name}</p>
                      </td>
                      <td className="p-3 text-center font-bold text-white">{acc.quantity}</td>
                      <td className="p-3 text-right">
                        <p className="font-bold text-slate-200">{formatPhpAmount(unitPhp)}</p>
                        <p className="text-[10px] text-slate-400">{formatUsdAmount(acc.unitPriceUsd)}</p>
                      </td>
                      <td className="p-3 text-right">
                        <p className="font-bold text-[#8B5CF6]">{formatPhpAmount(linePhp)}</p>
                        <p className="text-[10px] text-slate-400">{formatUsdAmount(acc.totalPriceUsd)}</p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary Box */}
      <div className="p-4 sm:p-5 rounded-xl bg-black/50 border border-[#00D9FF]/30 space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-300">
          <span className="text-slate-400">Products Subtotal</span>
          <div className="text-right">
            <span className="font-bold text-white">{formatPhpAmount(toPhp(order.subtotal))}</span>
            <span className="text-[10px] text-slate-400 ml-2">({formatUsdAmount(order.subtotal)})</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-300">
          <span className="text-slate-400">Shipping & Delivery Fee</span>
          <div className="text-right">
            <span className="font-bold text-white">{formatPhpAmount(toPhp(order.shippingFee))}</span>
            <span className="text-[10px] text-slate-400 ml-2">({formatUsdAmount(order.shippingFee)})</span>
          </div>
        </div>

        {order.appliedFees &&
          order.appliedFees.map((fee, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs text-slate-300">
              <span className="text-slate-400">{fee.displayName}</span>
              <div className="text-right">
                <span className="font-bold text-white">{formatPhpAmount(toPhp(fee.amountUsd))}</span>
                <span className="text-[10px] text-slate-400 ml-2">({formatUsdAmount(fee.amountUsd)})</span>
              </div>
            </div>
          ))}

        {order.discount > 0 && (
          <div className="flex justify-between items-center text-xs text-green-400">
            <span>Campaign Discount</span>
            <div className="text-right">
              <span className="font-bold">-{formatPhpAmount(toPhp(order.discount))}</span>
              <span className="text-[10px] text-green-300 ml-2">(-{formatUsdAmount(order.discount)})</span>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-white/10 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Grand Total
            </span>
            <span className="text-[10px] text-slate-400 block">PHP Primary / USD Secondary</span>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-[#00D9FF] tracking-tight">
              {formatPhpAmount(toPhp(order.grandTotal))}
            </div>
            <div className="text-xs font-semibold text-slate-400">
              {formatUsdAmount(order.grandTotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


