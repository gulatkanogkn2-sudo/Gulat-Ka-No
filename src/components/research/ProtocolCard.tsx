import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ProtocolRecord } from '../../services/researchService';
import { FlaskConical, BookOpen, Clock, CheckCircle2, Lock, Eye, X } from 'lucide-react';
import { FullscreenImageViewer } from './FullscreenImageViewer';

export interface ProtocolCardProps {
  protocol: ProtocolRecord;
}

export const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol }) => {
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
  const [isFullscreenViewerOpen, setIsFullscreenViewerOpen] = useState(false);

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Reconstitution':
        return 'cyan' as const;
      case 'Storage & Handling':
        return 'purple' as const;
      case 'Assay Standards':
        return 'magenta' as const;
      default:
        return 'amber' as const;
    }
  };

  // Dedicated visual SOP card image
  const sopImageUrl =
    protocol.pdfUrl ||
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      <Card
        variant="glass"
        hoverEffect
        className="border-[#FF2ED1]/30 hover:border-[#FF2ED1]/60 p-5 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
      >
        <div className="space-y-4">
          {/* Top Row: Category Badge & Estimated Time */}
          <div className="flex items-center justify-between">
            <Badge variant={getCategoryBadgeVariant(protocol.category)}>
              {protocol.category}
            </Badge>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
              <Clock className="w-3 h-3 text-[#FF2ED1]" />
              <span>{protocol.estimatedTime}</span>
            </div>
          </div>

          {/* Protocol SOP Document Thumbnail Preview */}
          <div
            onClick={() => setIsFullscreenViewerOpen(true)}
            onContextMenu={(e) => e.preventDefault()}
            className="relative h-36 w-full rounded-xl bg-black/60 border border-white/10 overflow-hidden cursor-pointer group/img select-none"
          >
            <img
              src={sopImageUrl}
              alt={protocol.title}
              draggable={false}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 opacity-80 group-hover/img:opacity-100"
            />
            {/* Watermark & Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3 pointer-events-none">
              <div className="flex justify-end">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/70 text-[#FF2ED1] border border-[#FF2ED1]/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> SOP REFERENCE
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-xl bg-[#FF2ED1]/80 text-white font-mono text-xs font-bold shadow-lg backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> FULLSCREEN SOP VIEW
                </span>
              </div>
              <div className="text-[9px] font-mono text-slate-400 truncate">
                GKN METHODOLOGY DOCUMENT • {protocol.difficulty}
              </div>
            </div>
          </div>

          {/* Title & Short Description */}
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-[#FF2ED1] transition-colors leading-snug">
              {protocol.title}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">
              {protocol.shortDescription}
            </p>
          </div>

          {/* Key Takeaways Preview */}
          <div className="p-3 rounded-xl bg-[#050810]/80 border border-white/10 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold block">
              Key Methodology Rules
            </span>
            <ul className="space-y-1">
              {protocol.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF2ED1] flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons: Read & View Image (NO DOWNLOAD) */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReadMoreOpen(true)}
            className="flex-1 border-[#FF2ED1]/50 text-[#FF2ED1] hover:bg-[#FF2ED1]/15 font-bold tracking-wider text-xs gap-1.5 py-2.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>READ SOP</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreenViewerOpen(true)}
            className="border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 p-2.5 text-xs"
            title="View Fullscreen Visual SOP Document"
          >
            <Eye className="w-4 h-4 text-[#FF2ED1]" />
          </Button>
        </div>
      </Card>

      {/* Protocol SOP Modal Details */}
      {isReadMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0F1D] border border-[#FF2ED1]/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-[0_0_50px_rgba(255,46,209,0.3)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF2ED1]/10 border border-[#FF2ED1]/30 flex items-center justify-center text-[#FF2ED1]">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{protocol.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={getCategoryBadgeVariant(protocol.category)} className="text-[10px]">
                      {protocol.category}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-400">Level: {protocol.difficulty}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsReadMoreOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Protocol Content */}
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Protocol Summary</span>
                <p className="text-xs text-slate-200 leading-relaxed">{protocol.shortDescription}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#050810] border border-white/10 space-y-3 font-mono text-xs select-none" onContextMenu={(e) => e.preventDefault()}>
                <span className="text-xs font-bold text-[#FF2ED1] uppercase block border-b border-white/10 pb-2">
                  Standard Operating Procedure Steps
                </span>
                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 leading-relaxed font-normal">
                  {protocol.fullContent}
                </pre>
              </div>

              {/* Key Takeaways Box */}
              <div className="p-4 rounded-xl bg-[#FF2ED1]/10 border border-[#FF2ED1]/30 space-y-2">
                <span className="text-xs font-bold text-white uppercase block">
                  Mandatory Key Takeaways
                </span>
                <ul className="space-y-1.5">
                  {protocol.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[#FF2ED1] flex-shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReadMoreOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </Button>
              <Button
                variant="magenta"
                size="sm"
                onClick={() => {
                  setIsReadMoreOpen(false);
                  setIsFullscreenViewerOpen(true);
                }}
                className="font-bold tracking-wider text-xs gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>OPEN VISUAL SOP VIEWER</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen SOP Document Image Viewer */}
      <FullscreenImageViewer
        isOpen={isFullscreenViewerOpen}
        onClose={() => setIsFullscreenViewerOpen(false)}
        imageUrl={sopImageUrl}
        title={protocol.title}
        subtitle={`${protocol.category} • SOP Level: ${protocol.difficulty}`}
        category={protocol.category}
        badgeText="SOP DOCUMENT"
      />
    </>
  );
};
