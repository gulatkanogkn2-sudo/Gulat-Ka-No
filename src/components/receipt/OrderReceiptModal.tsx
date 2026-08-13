import React, { useEffect } from 'react';
import { OrderDetail } from '../../types/order';
import { OrderReceiptContent } from './OrderReceiptContent';
import { X, FileText } from 'lucide-react';

interface OrderReceiptModalProps {
  order: OrderDetail;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ order, onClose }) => {
  // Lock body scrolling and handle Escape key press for accessibility
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col h-screen h-[100dvh] w-screen w-[100dvw] overflow-hidden no-print animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Order Receipt Viewer"
    >
      {/* Fixed Sticky Viewer Header - Always accessible on all devices regardless of scroll position */}
      <header className="sticky top-0 z-30 shrink-0 w-full bg-[#090D16]/95 border-b border-white/10 backdrop-blur-lg px-4 py-3 sm:px-6 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wider uppercase truncate">
                RECEIPT VIEWER
              </span>
              <span className="text-[10px] font-mono text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/20 truncate shrink-0">
                {order.referenceNumber}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              GKN V2 Peptides • Official Research Allocation Record
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Always Available Touch-Friendly Close Button */}
          <button
            onClick={onClose}
            aria-label="Close receipt"
            className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-200 hover:text-red-400 border border-white/15 hover:border-red-500/40 text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            title="Close receipt (Esc)"
          >
            <X className="w-4 h-4 shrink-0 text-red-400 sm:text-current" />
            <span className="hidden sm:inline uppercase">Close</span>
          </button>
        </div>
      </header>

      {/* Main Independently Scrollable Container - Starts at top = 0 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 md:p-8 scroll-smooth">
        <div className="max-w-3xl mx-auto w-full pb-10">
          <OrderReceiptContent order={order} onClose={onClose} showCloseButton={true} />
        </div>
      </main>
    </div>
  );
};

