import React from 'react';
import { CreditCard, CheckCircle2, Copy, Check, QrCode, Building2, Wallet, DollarSign } from 'lucide-react';
import { PaymentMethodOption } from '../../types/checkout';
import { Badge } from '../common/Badge';

interface PaymentMethodCardProps {
  method: PaymentMethodOption;
  isSelected: boolean;
  onSelect: () => void;
  onOpenQrModal?: (method: PaymentMethodOption) => void;
  className?: string;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isSelected,
  onSelect,
  onOpenQrModal,
  className = '',
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(method.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const icons: Record<string, React.ReactNode> = {
    gcash: <QrCode className="w-5 h-5 text-[#00D9FF]" />,
    bank_transfer: <Building2 className="w-5 h-5 text-[#8B5CF6]" />,
    maya: <Wallet className="w-5 h-5 text-[#FF2ED1]" />,
    crypto_usdt: <DollarSign className="w-5 h-5 text-[#00D9FF]" />,
  };

  const accentBorder = {
    cyan: 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_15px_rgba(0,217,255,0.15)]',
    purple: 'border-[#8B5CF6] bg-[#8B5CF6]/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]',
    magenta: 'border-[#FF2ED1] bg-[#FF2ED1]/10 shadow-[0_0_15px_rgba(255,46,209,0.15)]',
    green: 'border-[#10B981] bg-[#10B981]/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
        isSelected
          ? accentBorder[method.accent]
          : 'bg-[#090D16]/80 border-white/10 hover:border-white/30 hover:bg-white/5'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-black/50 border border-white/10 flex-shrink-0">
            {icons[method.id] || <CreditCard className="w-5 h-5 text-[#00D9FF]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">{method.name}</h4>
              <Badge variant={method.accent} className="text-[9px] px-1.5 py-0">
                {method.badge}
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-400">{method.subtitle}</p>
          </div>
        </div>

        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
            isSelected
              ? 'border-[#00D9FF] bg-[#00D9FF] text-black'
              : 'border-white/20 bg-black/40'
          }`}
        >
          {isSelected && <CheckCircle2 className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Account Details when selected */}
      {isSelected && (
        <div className="pt-3 border-t border-white/10 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            {/* Account Details Box */}
            <div className="flex-1 p-3 rounded-lg bg-black/60 border border-white/10 space-y-2 justify-center flex flex-col">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Account Name:</span>
                <span className="font-bold text-white">{method.accountName}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  {method.bankOrNetwork || 'Account Number'}:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#00D9FF] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {method.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                    title="Copy account number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Thumbnail Trigger */}
            {method.qrCodeUrl && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQrModal?.(method);
                }}
                className="p-2 rounded-lg bg-black/80 border border-[#00D9FF]/40 hover:border-[#00D9FF] transition-all cursor-pointer flex flex-col items-center justify-center text-center group sm:w-28 flex-shrink-0"
              >
                <img
                  src={method.qrCodeUrl}
                  alt="QR Thumbnail"
                  className="w-16 h-16 object-contain rounded border border-white/10 group-hover:scale-105 transition-transform"
                />
                <span className="text-[9px] font-mono text-[#00D9FF] font-bold mt-1 group-hover:underline flex items-center gap-0.5">
                  <QrCode className="w-2.5 h-2.5" /> Enlarge / Download
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] font-mono text-slate-300 bg-white/5 p-2.5 rounded-lg border border-white/5 leading-relaxed">
            <span className="font-bold text-[#00D9FF]">Instructions: </span>
            {method.instructions}
          </p>

          <p className="text-[10px] font-mono text-[#00D9FF]/80 italic">
            * Tap the QR Code to enlarge or download for easier payment.
          </p>
        </div>
      )}
    </div>
  );
};
