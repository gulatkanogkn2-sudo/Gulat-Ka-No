import React from 'react';
import { Factory, Target } from 'lucide-react';
import { MoqHeaderInfo } from '../../types/moq';

interface MoqHeaderProps {
  info?: MoqHeaderInfo;
  moqKitLabel?: string;
  className?: string;
}

export const MoqHeader: React.FC<MoqHeaderProps> = ({
  moqKitLabel = 'PER KIT: 1 KIT = 10 VIALS',
  className = '',
}) => {
  return (
    <div
      className={`relative rounded-2xl bg-[#070B14]/90 border border-[#FF2ED1]/40 p-5 sm:p-6 backdrop-blur-md overflow-hidden shadow-[0_0_30px_rgba(255,46,209,0.12)] ${className}`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF2ED1]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Badges Container */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative z-10">
        <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2ED1]/10 border border-[#FF2ED1]/50 text-[#FF2ED1] font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(255,46,209,0.25)]">
          <Factory className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF2ED1]" />
          <span>MOQ</span>
        </span>

        <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2ED1]/10 border border-[#FF2ED1]/50 text-white font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(255,46,209,0.25)]">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF2ED1]" />
          <span>TARGET ORDER</span>
        </span>

        <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2ED1]/10 border border-[#FF2ED1]/50 text-white font-mono text-sm sm:text-base font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(255,46,209,0.25)]">
          <span>{moqKitLabel}</span>
        </span>
      </div>
    </div>
  );
};
