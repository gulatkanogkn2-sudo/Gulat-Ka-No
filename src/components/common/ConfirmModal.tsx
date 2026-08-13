import React, { useState } from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Trash2, Info } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Confirmation action error:', err);
      setIsSubmitting(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-rose-400" />,
          iconBg: 'bg-rose-500/10 border-rose-500/20',
          confirmBtn:
            'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          iconBg: 'bg-amber-500/10 border-amber-500/20',
          confirmBtn:
            'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-6 h-6 text-[#00D9FF]" />,
          iconBg: 'bg-[#00D9FF]/10 border-[#00D9FF]/20',
          confirmBtn:
            'bg-[#00D9FF] hover:bg-[#33E2FF] text-slate-950 font-bold shadow-[0_0_15px_rgba(0,217,255,0.3)]',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-5 font-sans">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${styles.iconBg}`}
          >
            {styles.icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${styles.confirmBtn}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
