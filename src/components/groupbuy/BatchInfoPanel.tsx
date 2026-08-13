import React from 'react';
import { GroupBuyBatch } from '../../types/groupBuy';
import { ShieldAlert, FlaskConical, Info, FileText, CheckCircle2 } from 'lucide-react';

interface BatchInfoPanelProps {
  batch: GroupBuyBatch;
  className?: string;
  hidden?: boolean;
}

export const BatchInfoPanel: React.FC<BatchInfoPanelProps> = ({
  batch,
  className = '',
  hidden = false,
}) => {
  if (hidden) return null;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Main Batch Description & Research Allocation Notice (2 Columns) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Batch Overview Description Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#070B14]/80 border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 font-mono text-xs font-bold text-white uppercase tracking-wider">
            <FlaskConical className="w-4 h-4 text-[#00D9FF]" />
            <span>Active Batch Research Overview & Objective</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {batch.description}
          </p>
        </div>

        {/* Research Allocation Notice Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Research Allocation & Compliance Notice</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed font-mono">
            {batch.researchAllocationNotice}
          </p>
        </div>
      </div>

      {/* GroupBuy Rules & Campaign Parameters Panel (1 Column) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#070B14]/90 border border-[#00D9FF]/30 backdrop-blur-md space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 font-mono text-xs font-bold text-[#00D9FF] uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#00D9FF]" />
            <span>GroupBuy Rules & Specifications</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Current Batch</span>
              <span className="text-[#00D9FF] font-bold">{batch.batchNumber}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Batch Status</span>
              <span className="text-white font-bold bg-[#00D9FF]/20 px-2 py-0.5 rounded border border-[#00D9FF]/40 text-[10px]">
                {batch.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Closing Date</span>
              <span className="text-white font-medium">
                {new Date(batch.closingDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Min Allocation</span>
              <span className="text-white font-medium text-right max-w-[150px] truncate">
                {batch.minBatchAllocation}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Expected Dispatch</span>
              <span className="text-[#00D9FF] font-bold">{batch.estimatedShipDate}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className="text-slate-400">Lab Fulfillment</span>
              <span className="text-white font-medium">{batch.estimatedLabFulfillment}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00D9FF] flex-shrink-0" />
          <span>Products belong strictly to active batch allocation.</span>
        </div>
      </div>
    </div>
  );
};
