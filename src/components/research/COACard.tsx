import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { COARecord } from '../../services/researchService';
import { Eye, ShieldCheck, Microscope, Lock } from 'lucide-react';
import { FullscreenImageViewer } from './FullscreenImageViewer';

export interface COACardProps {
  coa: COARecord;
}

export const COACard: React.FC<COACardProps> = ({ coa }) => {
  const [isFullscreenViewerOpen, setIsFullscreenViewerOpen] = useState(false);

  // Fallback high-res report preview image
  const displayImageUrl =
    coa.reportUrl ||
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      <Card
        variant="glass"
        hoverEffect
        className="border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60 p-5 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
      >
        <div className="space-y-4">
          {/* Header Row: Lot Number & Status */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 px-2.5 py-1 rounded-md tracking-wider">
              {coa.lotNumber}
            </span>
            <Badge variant="purple" glow>
              {coa.status}
            </Badge>
          </div>

          {/* Document Preview Thumbnail Box */}
          <div
            onClick={() => setIsFullscreenViewerOpen(true)}
            onContextMenu={(e) => e.preventDefault()}
            className="relative h-36 w-full rounded-xl bg-black/60 border border-white/10 overflow-hidden cursor-pointer group/img select-none"
          >
            <img
              src={displayImageUrl}
              alt={coa.productName}
              draggable={false}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 opacity-80 group-hover/img:opacity-100"
            />
            {/* Watermark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3 pointer-events-none">
              <div className="flex justify-end">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/70 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> PROTECTED
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-xl bg-[#8B5CF6]/80 text-white font-mono text-xs font-bold shadow-lg backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> FULLSCREEN VIEW
                </span>
              </div>
              <div className="text-[9px] font-mono text-slate-400 truncate">
                JANOSHIK LABS • VERIFIED HPLC SPECTRUM
              </div>
            </div>
          </div>

          {/* Product Name & Category */}
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-[#8B5CF6] transition-colors leading-snug">
              {coa.productName}
            </h3>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              {coa.category} • {coa.testingLab}
            </p>
          </div>

          {/* Purity Badge Matrix */}
          <div className="p-3 rounded-xl bg-[#050810]/80 border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Verified Purity</span>
              <p className="text-lg font-black font-mono text-[#00D9FF] drop-shadow-[0_0_8px_rgba(0,217,255,0.4)]">
                {coa.purity.toFixed(2)}%
              </p>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Testing Date</span>
              <p className="text-xs font-mono text-slate-200">{coa.testDate}</p>
            </div>
          </div>

          {/* Short Summary */}
          <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
            {coa.summary}
          </p>
        </div>

        {/* Action Button: View Fullscreen Only (NO DOWNLOAD) */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreenViewerOpen(true)}
            className="w-full border-[#8B5CF6]/50 text-[#8B5CF6] hover:bg-[#8B5CF6]/15 font-bold tracking-wider text-xs gap-1.5 py-2.5"
          >
            <Eye className="w-4 h-4" />
            <span>OPEN COA REPORT VIEWER</span>
          </Button>
        </div>
      </Card>

      {/* Fullscreen Protected Image Viewer */}
      <FullscreenImageViewer
        isOpen={isFullscreenViewerOpen}
        onClose={() => setIsFullscreenViewerOpen(false)}
        imageUrl={displayImageUrl}
        title={coa.productName}
        subtitle={`Lot #${coa.lotNumber} • Purity: ${coa.purity}% • ${coa.testingLab}`}
        category={coa.category}
        badgeText="COA REPORT"
      />
    </>
  );
};
