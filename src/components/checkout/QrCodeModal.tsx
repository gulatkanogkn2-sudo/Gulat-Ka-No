import React from 'react';
import { X, Download, QrCode, CheckCircle2 } from 'lucide-react';
import { PaymentMethodOption } from '../../types/checkout';
import { Button } from '../common/Button';

interface QrCodeModalProps {
  method: PaymentMethodOption;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ method, onClose }) => {
  const handleDownload = () => {
    if (!method.qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = method.qrCodeUrl;
    link.download = `${method.id}_gkn_qr_code.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#090D16] border border-[#00D9FF]/40 p-6 space-y-5 shadow-[0_0_50px_rgba(0,217,255,0.25)] text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pt-2">
          <div className="w-10 h-10 mx-auto rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] mb-2">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">{method.name}</h3>
          <p className="text-xs text-slate-400 font-mono">{method.bankOrNetwork || 'Payment Account QR'}</p>
        </div>

        {/* Enlarged QR Code Image */}
        <div className="p-4 rounded-xl bg-black border border-white/10 shadow-inner flex flex-col items-center justify-center relative group">
          {method.qrCodeUrl ? (
            <img
              src={method.qrCodeUrl}
              alt={`${method.name} QR Code`}
              className="w-64 h-64 object-contain rounded-lg border border-white/5"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center text-slate-500 font-mono text-xs">
              No QR Code image available
            </div>
          )}
          <p className="text-[10px] font-mono text-[#00D9FF] pt-2">
            Tap the QR Code to enlarge or download for easier payment.
          </p>
        </div>

        {/* Account Details Box */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left font-mono text-xs space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Account Name:</span>
            <span className="font-bold text-white truncate max-w-[180px]">{method.accountName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Account Number:</span>
            <span className="font-bold text-[#00D9FF]">{method.accountNumber}</span>
          </div>
        </div>

        {/* Download Action Button */}
        <div className="pt-1 flex gap-2">
          <Button
            variant="cyan"
            size="md"
            onClick={handleDownload}
            className="w-full font-mono text-xs font-bold uppercase flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        </div>
      </div>
    </div>
  );
};
