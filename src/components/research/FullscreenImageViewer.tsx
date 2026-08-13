import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, X, ShieldAlert, Eye } from 'lucide-react';

interface FullscreenImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
  category?: string;
  badgeText?: string;
}

export const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  category,
  badgeText,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  // Reset state when opened or image changed
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  // Keyboard shortcut handler (Escape key to close, + / - for zoom)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        setZoom((prev) => Math.min(prev + 0.25, 4));
      } else if (e.key === '-') {
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
      } else if (e.key === '0') {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(prev + 0.15, 4));
    } else {
      setZoom((prev) => Math.max(prev - 0.15, 0.5));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden select-none animate-fadeIn"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header Toolbar */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4 bg-[#050810]/90 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">{title}</h3>
              {badgeText && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs font-mono text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Security / Protected View Warning */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>PROTECTED VIEW • OFFICIAL REPOSITORY DOCUMENT</span>
        </div>

        {/* Action Controls & Close */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 font-mono text-xs text-slate-300">
            <button
              onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4 text-slate-300" />
            </button>
            <span className="px-2 font-bold text-[#00D9FF] text-xs min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((prev) => Math.min(prev + 0.25, 4))}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-1"
              title="Reset Zoom / Fit to Screen (0)"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 hover:text-white transition-colors cursor-pointer"
            title="Close Fullscreen Viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className={`relative flex-1 flex items-center justify-center p-4 overflow-hidden ${
          zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Security Watermark Diagonal Repeat Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden opacity-15">
          <div className="transform -rotate-12 select-none text-center space-y-12">
            <div className="text-2xl md:text-4xl font-mono font-black tracking-widest text-[#00D9FF] whitespace-nowrap">
              GKN LABORATORY REPOSITORY • OFFICIAL COPY
            </div>
            <div className="text-2xl md:text-4xl font-mono font-black tracking-widest text-[#00D9FF] whitespace-nowrap">
              CONFIDENTIAL RESEARCH DOCUMENT • DO NOT DISTRIBUTE
            </div>
            <div className="text-2xl md:text-4xl font-mono font-black tracking-widest text-[#00D9FF] whitespace-nowrap">
              GKN LABORATORY REPOSITORY • OFFICIAL COPY
            </div>
          </div>
        </div>

        {/* Display Image Element */}
        <div
          className="transition-transform duration-75 ease-out relative z-0 flex items-center justify-center max-w-full max-h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="max-h-[82vh] max-w-[90vw] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
          />
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between px-6 py-3 bg-[#050810]/90 border-t border-white/10 font-mono text-xs text-slate-400 backdrop-blur-md gap-2">
        <div className="flex items-center gap-3">
          {category && <span>Category: <strong className="text-slate-200">{category}</strong></span>}
          <span>• Pan: Use mouse drag when zoomed</span>
          <span>• Zoom: Scroll wheel or buttons</span>
        </div>
        <div className="text-[11px] text-[#00D9FF] font-bold">
          ANALYTICAL SECURITY ENFORCED • NO DOWNLOAD ALLOWED
        </div>
      </div>
    </div>
  );
};
