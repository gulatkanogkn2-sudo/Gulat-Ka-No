import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Globe,
  X,
  Package,
  ShoppingCart,
  Factory,
} from 'lucide-react';
import { WebsiteConfig } from '../../../types/websiteManager';

interface WebsiteLivePreviewProps {
  config: WebsiteConfig;
  isOpen?: boolean;
  onClose?: () => void;
  isModalMode?: boolean;
}

export const WebsiteLivePreview: React.FC<WebsiteLivePreviewProps> = ({
  config,
  isOpen = true,
  onClose,
  isModalMode = false,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (isModalMode && !isOpen) return null;

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-6xl';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Preview Header & Viewport Toolbar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono font-bold text-slate-300 ml-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            https://gkn.research/ <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">LIVE PREVIEW</span>
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              viewport === 'desktop'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              viewport === 'tablet'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              viewport === 'mobile'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {isModalMode && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Simulated Browser Body Container */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-4 flex justify-center">
        <div
          className={`${getViewportWidthClass()} transition-all duration-300 bg-[#050810] text-slate-100 rounded-xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col font-sans text-xs`}
        >
          {/* Header Bar */}
          <header className="px-5 py-3.5 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-4 sticky top-0 z-10">
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 overflow-hidden flex items-center justify-center">
                {config.branding.websiteLogo ? (
                  <img
                    src={config.branding.websiteLogo}
                    alt={config.branding.brandName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-wider">
                  {config.branding.brandName || 'GKN V2'}
                </span>
                <span className="text-[9px] font-mono text-cyan-400 block -mt-0.5">
                  {config.branding.brandSlogan || 'Research Peptides'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">PHP â‚± / USD $</span>
              <div className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" /> Cart (0)
              </div>
            </div>
          </header>

          {/* Promotional Banner */}
          {config.hero.isVisible && config.hero.heroImage && (
            <section className="p-4 sm:p-6 bg-[#050810]">
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#00D9FF]/30 shadow-[0_0_25px_rgba(0,217,255,0.15)] bg-slate-950 flex items-center justify-center p-1 sm:p-2">
                <img
                  src={config.hero.heroImage}
                  alt="GKN Homepage Banner"
                  className="w-full h-auto max-h-[380px] object-contain rounded-xl block"
                />
              </div>
            </section>
          )}

          {/* Store Selection Cards Grid Section */}
          <section className="p-4 sm:p-6 space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800">
                Select Your Channel
              </span>
              <h2 className="text-base font-bold text-white uppercase tracking-wide">
                Choose Your Store
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* GroupBuy Card */}
              <div className="bg-[#0A0F1D] border border-[#00D9FF]/40 rounded-2xl p-4 space-y-3 flex flex-col justify-between shadow-[0_0_20px_rgba(0,217,255,0.1)]">
                <div className="space-y-2">
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={config.storeCards.find((c) => c.storeKey === 'groupbuy')?.image || ''}
                      alt="GroupBuy Store"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-[#00D9FF]/40 bg-[#00D9FF]/10 text-[#00D9FF] inline-block">
                    PRE-ORDER / BATCH OPEN
                  </span>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#00D9FF]" />
                    <h3 className="text-sm font-bold text-white">GroupBuy Store</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Participate in pre-order batch allocations with community volume tier pricing.
                  </p>
                </div>
                <div className="w-full py-2 bg-[#00D9FF] text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
                  Enter GroupBuy Store <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* OnHand Card */}
              <div className="bg-[#0A0F1D] border border-[#8B5CF6]/40 rounded-2xl p-4 space-y-3 flex flex-col justify-between shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                <div className="space-y-2">
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={config.storeCards.find((c) => c.storeKey === 'onhand')?.image || ''}
                      alt="OnHand Store"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6] inline-block">
                    IN STOCK / IMMEDIATE DISPATCH
                  </span>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#8B5CF6]" />
                    <h3 className="text-sm font-bold text-white">OnHand Store</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Directly available inventory for immediate laboratory dispatch with rapid express shipping.
                  </p>
                </div>
                <div className="w-full py-2 bg-[#8B5CF6] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
                  Enter OnHand Store <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* MOQ Card */}
              <div className="bg-[#0A0F1D] border border-[#FF2ED1]/40 rounded-2xl p-4 space-y-3 flex flex-col justify-between shadow-[0_0_20px_rgba(255,46,209,0.1)]">
                <div className="space-y-2">
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={config.storeCards.find((c) => c.storeKey === 'moq')?.image || ''}
                      alt="MOQ Store"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-[#FF2ED1]/40 bg-[#FF2ED1]/10 text-[#FF2ED1] inline-block">
                    BULK / MINIMUM ORDER QUANTITY
                  </span>
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[#FF2ED1]" />
                    <h3 className="text-sm font-bold text-white">MOQ Store</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Volume institutional contracts, custom synthesis runs, and bulk enterprise pricing.
                  </p>
                </div>
                <div className="w-full py-2 bg-[#FF2ED1] text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
                  Enter MOQ Store <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="p-4 bg-[#0A0F1D] border-t border-slate-800/80 text-center text-slate-500 font-mono text-[10px] mt-auto">
            {config.footer.copyrightText || '\u00A9 2026 GKN V2. All rights reserved.'}
          </footer>
        </div>
      </div>
    </div>
  );
};

