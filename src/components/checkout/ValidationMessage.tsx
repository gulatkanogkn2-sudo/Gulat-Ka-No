import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ValidationMessageProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  message: string;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  type = 'error',
  message,
  className = '',
}) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-500/10 border-red-500/30 text-red-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    info: 'bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF]',
    success: 'bg-green-500/10 border-green-500/30 text-green-300',
  };

  const icons = {
    error: <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-[#00D9FF] flex-shrink-0" />,
    success: <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />,
  };

  return (
    <div
      className={`p-3 rounded-lg border text-xs font-mono flex items-start gap-2.5 transition-all ${styles[type]} ${className}`}
      role="alert"
    >
      {icons[type]}
      <span className="leading-tight">{message}</span>
    </div>
  );
};
