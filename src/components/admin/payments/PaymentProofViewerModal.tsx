import React, { useState, useEffect } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  ShoppingBag,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { PaymentVerificationRecord } from '../../../types/paymentVerification';

interface PaymentProofViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentVerificationRecord | null;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const PaymentProofViewerModal: React.FC<PaymentProofViewerModalProps> = ({
  isOpen,
  onClose,
  payment,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Reset zoom & rotation when active payment changes
  useEffect(() => {
    setZoom(100);
    setRotation(0);
  }, [payment?.id]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        onPrev();
      } else if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(z + 25, 400));
      } else if (e.key === '-') {
        setZoom((z) => Math.max(z - 25, 50));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasNext, hasPrev, onNext, onPrev, onClose]);

  if (!isOpen || !payment) return null;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 400));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));
  const handleResetZoom = () => {
    setZoom(100);
    setRotation(0);
  };

  const handleRotateCw = () => setRotation((r) => (r + 90) % 360);
  const handleRotateCcw = () => setRotation((r) => (r - 90 + 360) % 360);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = payment.uploadedProofUrl;
    link.download = payment.uploadedProofFileName || `proof_${payment.paymentReference}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
      {/* Container Panel */}
      <div
        className={`bg-slate-950 border border-cyan-500/30 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,217,255,0.15)] transition-all ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[90vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-white">
                  Payment Proof Inspection
                </span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
                  {payment.paymentReference}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3 text-slate-500" />
                  Order: <strong className="text-slate-200">{payment.orderNumber}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-500" />
                  Customer: <strong className="text-slate-200">{payment.customerName}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 space-x-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono text-cyan-400 px-2 min-w-[45px] text-center font-semibold">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 py-1 text-[10px] font-mono text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded transition-colors"
                title="Reset Zoom to 100%"
              >
                Reset
              </button>
            </div>

            {/* Rotation Controls */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 space-x-1">
              <button
                onClick={handleRotateCcw}
                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                title="Rotate 90° Counter-Clockwise"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={handleRotateCw}
                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>

            {/* Fullscreen & Export Controls */}
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-2 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 rounded-lg transition-colors"
              title="Download Original Proof File"
            >
              <Download className="h-4 w-4" />
            </button>

            <a
              href={payment.uploadedProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors"
              title="Open Proof Image in New Browser Tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            <div className="w-px h-6 bg-slate-800 mx-1" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-slate-900 border border-slate-700 hover:bg-rose-950 hover:border-rose-500 hover:text-rose-400 text-slate-400 rounded-lg transition-colors"
              title="Close Proof Inspector"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Center Display Area */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center p-6 select-none">
          {/* Previous Button */}
          {hasPrev && onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-4 z-20 p-3 bg-slate-900/80 border border-slate-700 hover:border-cyan-500 hover:bg-slate-900 text-slate-200 hover:text-cyan-400 rounded-full transition-all shadow-xl"
              title="Previous Payment Proof (Left Arrow)"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next Button */}
          {hasNext && onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 z-20 p-3 bg-slate-900/80 border border-slate-700 hover:border-cyan-500 hover:bg-slate-900 text-slate-200 hover:text-cyan-400 rounded-full transition-all shadow-xl"
              title="Next Payment Proof (Right Arrow)"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Image Canvas Viewport */}
          <div className="w-full h-full flex items-center justify-center overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-800">
            <div
              className="transition-transform duration-200 ease-out flex items-center justify-center"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            >
              <img
                src={payment.uploadedProofUrl}
                alt={`Proof for ${payment.paymentReference}`}
                className="max-w-[75vw] max-h-[70vh] object-contain rounded border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Details Footer */}
        <div className="bg-slate-900 border-t border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-3 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div>
              File: <strong className="text-slate-200">{payment.uploadedProofFileName}</strong>
            </div>
            <div>
              Size: <strong className="text-slate-200">{payment.uploadedProofFileSize}</strong>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              Uploaded: <strong className="text-slate-200">{new Date(payment.paymentDate).toLocaleString()}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              Payment Method:{' '}
              <strong className="text-cyan-400">{payment.paymentMethod.replace('_', ' ')}</strong>
            </div>
            <div>
              TX Ref: <strong className="text-amber-300">{payment.transactionReference}</strong>
            </div>
            <div>
              Amount: <strong className="text-emerald-400">${payment.amountPaid.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
