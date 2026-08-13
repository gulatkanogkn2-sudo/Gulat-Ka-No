import React from 'react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Alert',
  message = 'An unexpected anomaly occurred while processing this module data.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-red-500/30 bg-[#0A0F1D]/80 backdrop-blur-md rounded-xl my-4">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 mb-3 text-lg font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        ⚠️
      </div>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-xs text-slate-400 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="mt-4">
          Retry Operation
        </Button>
      )}
    </div>
  );
};
