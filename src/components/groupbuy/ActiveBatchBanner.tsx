import React from 'react';
import { GroupBuyBatch, GroupBuyBatchStatus } from '../../types/groupBuy';
import { GroupBuyCountdown } from './GroupBuyCountdown';
import { Badge } from '../common/Badge';
import { Layers } from 'lucide-react';

interface ActiveBatchBannerProps {
  batch: GroupBuyBatch;
  className?: string;
  simplified?: boolean;
}

export const ActiveBatchBanner: React.FC<ActiveBatchBannerProps> = ({
  batch,
  className = '',
}) => {
  const getStatusBadgeVariant = (status: GroupBuyBatchStatus) => {
    switch (status) {
      case 'Open':
        return 'cyan';
      case 'Closing Soon':
        return 'magenta';
      case 'Processing':
        return 'purple';
      case 'Completed':
        return 'emerald';
      case 'Closed':
        return 'rose';
      default:
        return 'cyan';
    }
  };

  return (
    <div
      className={`relative rounded-2xl bg-[#070B14]/90 border border-[#00D9FF]/40 p-5 sm:p-6 backdrop-blur-md overflow-hidden shadow-[0_0_30px_rgba(0,217,255,0.12)] ${className}`}
    >
      {/* Background Accent Grid / Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Batch Number, Status Badge & Live Countdown Timer */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/50 text-[#00D9FF] font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-[0_0_12px_rgba(0,217,255,0.2)]">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#00D9FF]" />
            {batch.batchNumber}
          </span>
          <Badge
            variant={getStatusBadgeVariant(batch.status)}
            glow
            className="px-5 py-2.5 text-sm sm:text-base font-extrabold tracking-wide"
          >
            STATUS: {batch.status.toUpperCase()}
          </Badge>
        </div>

        {/* Live Countdown Timer */}
        <GroupBuyCountdown
          isOpen={batch.status === 'Open' || batch.status === 'Closing Soon'}
          closingDate={batch.closingDate}
          openingDate={batch.openingDate}
          status={batch.status}
        />
      </div>
    </div>
  );
};
