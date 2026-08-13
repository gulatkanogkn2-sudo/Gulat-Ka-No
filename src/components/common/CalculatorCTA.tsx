import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Syringe } from 'lucide-react';

export interface CalculatorCTAProps {
  className?: string;
  showIcons?: boolean;
}

export const CalculatorCTA: React.FC<CalculatorCTAProps> = ({
  className = '',
  showIcons = false,
}) => {
  return (
    <div className={`grid grid-cols-2 gap-2.5 sm:gap-4 w-full ${className}`}>
      {/* Peptide Calculator Button */}
      <Link
        to="/research/calculators/peptide"
        className="group relative flex-1 w-full h-[58px] xs:h-[62px] sm:h-[66px] lg:h-[70px] px-2.5 sm:px-6 py-2 flex items-center justify-center rounded-xl sm:rounded-2xl border-2 border-[#00D9FF]/50 bg-gradient-to-r from-[#00D9FF]/20 via-[#00D9FF]/10 to-[#0284C7]/20 hover:from-[#00D9FF]/30 hover:to-[#0284C7]/30 hover:border-[#00D9FF] text-white shadow-[0_0_15px_rgba(0,217,255,0.25)] hover:shadow-[0_0_25px_rgba(0,217,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] overflow-hidden cursor-pointer"
        aria-label="Open Peptide Calculator"
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none rounded-xl sm:rounded-2xl" />
        <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2.5 w-full text-center">
          {showIcons && (
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-[#00D9FF] flex-shrink-0 group-hover:scale-110 transition-transform" />
          )}
          <div className="flex flex-col items-center justify-center leading-tight tracking-wider font-bold text-[11px] xs:text-xs sm:text-sm lg:text-base text-center">
            <span>Peptide</span>
            <span>Calculator</span>
          </div>
        </div>
      </Link>

      {/* Peptide Cycle Calculator Button */}
      <Link
        to="/research/calculators/cycle"
        className="group relative flex-1 w-full h-[58px] xs:h-[62px] sm:h-[66px] lg:h-[70px] px-2.5 sm:px-6 py-2 flex items-center justify-center rounded-xl sm:rounded-2xl border-2 border-[#FF2ED1]/50 bg-gradient-to-r from-[#FF2ED1]/20 via-[#FF2ED1]/10 to-[#BE185D]/20 hover:from-[#FF2ED1]/30 hover:to-[#BE185D]/30 hover:border-[#FF2ED1] text-white shadow-[0_0_15px_rgba(255,46,209,0.25)] hover:shadow-[0_0_25px_rgba(255,46,209,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] overflow-hidden cursor-pointer"
        aria-label="Open Peptide Cycle Calculator"
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none rounded-xl sm:rounded-2xl" />
        <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2.5 w-full text-center">
          {showIcons && (
            <Syringe className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF2ED1] flex-shrink-0 group-hover:scale-110 transition-transform" />
          )}
          <div className="flex flex-col items-center justify-center leading-tight tracking-wider font-bold text-[11px] xs:text-xs sm:text-sm lg:text-base text-center">
            <span>Peptide Cycle</span>
            <span>Calculator</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
