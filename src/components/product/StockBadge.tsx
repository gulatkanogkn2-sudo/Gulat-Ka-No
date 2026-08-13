import React from 'react';
import { StoreAccent } from '../store/StoreStatusBadge';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Layers } from 'lucide-react';

export interface StockBadgeProps {
  stockStatus?: 'In Stock' | 'Ready' | 'Ready for Dispatch' | 'Low Stock' | 'Almost Sold Out' | 'Out of Stock' | 'Recently Restocked' | 'Staging' | string;
  stockText?: string;
  accent?: StoreAccent;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  stockStatus = 'In Stock',
  stockText,
  accent = 'purple',
  className = '',
}) => {
  const renderContent = () => {
    const statusLower = stockStatus.toLowerCase();

    if (statusLower.includes('recently restocked') || statusLower.includes('restocked')) {
      return (
        <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{stockText || 'Recently Restocked'}</span>
        </div>
      );
    }

    if (statusLower.includes('ready') || statusLower === 'in stock') {
      return (
        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{stockText || 'Ready to Ship'}</span>
        </div>
      );
    }

    if (statusLower.includes('low') || statusLower.includes('almost sold out')) {
      return (
        <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{stockText || (statusLower.includes('almost') ? 'Almost Sold Out' : 'Low Inventory')}</span>
        </div>
      );
    }

    if (statusLower.includes('out of stock') || statusLower.includes('sold out')) {
      return (
        <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] font-semibold">
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>{stockText || 'Out of Stock'}</span>
        </div>
      );
    }

    if (statusLower.includes('staging') || statusLower.includes('batch')) {
      return (
        <div className="flex items-center gap-1.5 text-[#00D9FF] font-mono text-[11px] font-semibold">
          <Layers className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>{stockText || 'Batch Funding'}</span>
        </div>
      );
    }

    const accentText: Record<StoreAccent, string> = {
      cyan: 'text-[#00D9FF]',
      purple: 'text-[#8B5CF6]',
      magenta: 'text-[#FF2ED1]',
    };

    return (
      <div className={`flex items-center gap-1.5 ${accentText[accent]} font-mono text-[11px] font-semibold`}>
        <Clock className="w-3.5 h-3.5" />
        <span>{stockText || stockStatus}</span>
      </div>
    );
  };

  return (
    <div className={`px-2.5 py-1 rounded-md bg-white/5 border border-white/10 inline-flex items-center ${className}`}>
      {renderContent()}
    </div>
  );
};
