import React from 'react';
import { OnHandHeaderInfo } from '../../types/onHand';
import { Zap, Truck } from 'lucide-react';

interface OnHandHeaderProps {
  info?: OnHandHeaderInfo;
  className?: string;
}

export const OnHandHeader: React.FC<OnHandHeaderProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`relative rounded-2xl bg-[#070B14]/90 border border-[#8B5CF6]/40 p-5 sm:p-6 backdrop-blur-md overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.12)] ${className}`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Badges Container */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative z-10">
        <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/50 text-[#8B5CF6] font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.25)]">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
          <span>ON HAND</span>
        </span>

        <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/50 text-white font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.25)]">
          <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
          <span>IMMEDIATE DISPATCH</span>
        </span>
      </div>
    </div>
  );
};
