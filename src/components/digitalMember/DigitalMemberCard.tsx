import React, { useState } from 'react';
import { DigitalMemberCardProfile, DigitalMemberIdSettings } from '../../types/digitalMember';
import { CustomerTierConfig } from '../../types/customerTier';
import { DigitalMemberCardFront } from './DigitalMemberCardFront';
import { DigitalMemberCardBack } from './DigitalMemberCardBack';
import { RotateCw, ShieldCheck, Download, FileText, Loader2, AlertCircle } from 'lucide-react';
import {
  exportDigitalMemberCardPng,
  exportDigitalMemberCardPdf,
} from '../../services/digitalMemberExportService';

interface DigitalMemberCardProps {
  profile: DigitalMemberCardProfile;
  settings: DigitalMemberIdSettings;
  avatarDisplayUrl?: string | null;
  tierConfig?: CustomerTierConfig | null;
  defaultSide?: 'front' | 'back';
  showFlipControls?: boolean;
  showExportControls?: boolean;
  className?: string;
}

/**
 * Shared Digital Member ID Card Renderer
 * Consumed by both Customer Account Page and Admin Settings Live Preview.
 */
export const DigitalMemberCard: React.FC<DigitalMemberCardProps> = ({
  profile,
  settings,
  avatarDisplayUrl,
  tierConfig,
  defaultSide = 'front',
  showFlipControls = true,
  showExportControls = false,
  className = '',
}) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>(defaultSide);
  const [exportState, setExportState] = useState<'idle' | 'png' | 'pdf'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSide = () => {
    setActiveSide((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleExportPng = async () => {
    if (exportState !== 'idle') return;
    setExportState('png');
    setErrorMessage(null);

    try {
      await exportDigitalMemberCardPng({
        profile,
        settings,
        avatarDisplayUrl,
        tierConfig,
        side: activeSide,
      });
    } catch (err) {
      console.error('[DigitalMemberCard] PNG Export Error:', err);
      setErrorMessage('Unable to generate member card. Please try again.');
    } finally {
      setExportState('idle');
    }
  };

  const handleExportPdf = async () => {
    if (exportState !== 'idle') return;
    setExportState('pdf');
    setErrorMessage(null);

    try {
      await exportDigitalMemberCardPdf({
        profile,
        settings,
        avatarDisplayUrl,
        tierConfig,
      });
    } catch (err) {
      console.error('[DigitalMemberCard] PDF Export Error:', err);
      setErrorMessage('Unable to generate member card. Please try again.');
    } finally {
      setExportState('idle');
    }
  };

  return (
    <div className={`flex flex-col items-center w-full max-w-md mx-auto space-y-3 ${className}`}>
      {/* Card Aspect Ratio Container */}
      <div className="w-full relative group">
        {activeSide === 'front' ? (
          <DigitalMemberCardFront
            profile={profile}
            settings={settings}
            avatarDisplayUrl={avatarDisplayUrl}
            tierConfig={tierConfig}
          />
        ) : (
          <DigitalMemberCardBack
            profile={profile}
            settings={settings}
          />
        )}
      </div>

      {/* Side Toggle Control Bar */}
      {showFlipControls && (
        <div className="flex items-center justify-between w-full px-1 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Viewing: <strong className="text-white uppercase">{activeSide}</strong></span>
          </div>

          <button
            type="button"
            onClick={toggleSide}
            disabled={exportState !== 'idle'}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-[#00D9FF]/20 hover:border-[#00D9FF]/50 text-[#00D9FF] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Flip to {activeSide === 'front' ? 'Back' : 'Front'}</span>
          </button>
        </div>
      )}

      {/* Export Controls Bar */}
      {showExportControls && (
        <div className="w-full space-y-2 pt-1 border-t border-white/10">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleExportPng}
              disabled={exportState !== 'idle'}
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 hover:bg-[#00D9FF]/20 text-[#00D9FF] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportState === 'png' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PNG…</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>SAVE PNG</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={exportState !== 'idle'}
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#FF2ED1]/10 border border-[#FF2ED1]/30 hover:bg-[#FF2ED1]/20 text-[#FF2ED1] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportState === 'pdf' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF2ED1]" />
                  <span>Generating PDF…</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>SAVE PDF</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-sans flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

