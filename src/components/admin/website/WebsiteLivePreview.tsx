import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Megaphone,
  ShoppingBag,
  ArrowRight,
  Send,
  Globe,
  X,
  RefreshCw,
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

  const content = (
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
            title="Desktop View (1200px)"
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
            title="Tablet View (768px)"
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
            title="Mobile View (375px)"
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
          {/* 1. Announcement Banner */}
          {config.announcement.isVisible && (
            <div
              className="px-4 py-2 text-center text-[11px] font-semibold flex items-center justify-center gap-2 relative transition-all"
              style={{
                backgroundColor: config.announcement.backgroundColor || '#0F172A',
                color: config.announcement.textColor || '#00D9FF',
              }}
            >
              <Megaphone className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
              <span className="truncate">{config.announcement.message}</span>
            </div>
          )}

          {/* 2. Top Header Navigation */}
          <header className="px-5 py-3.5 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-4 sticky top-0 z-10">
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 overflow-hidden flex items-center justify-center">
                {config.branding.websiteLogo ? (
                  <img
                    src={config.branding.websiteLogo}
                    alt={config.branding.brandName}
                    className="w-full h-full object-cover"
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

            {/* Menu Nav items */}
            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold">
              {config.navigation.menuItems
                .filter((m) => m.isVisible)
                .map((item) => (
                  <span
                    key={item.id}
                    className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {item.label}
                    {item.badgeText && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-purple-950 text-purple-300 rounded border border-purple-800">
                        {item.badgeText}
                      </span>
                    )}
                  </span>
                ))}
            </nav>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-cyan-500/20">
                Cart (0)
              </button>
            </div>
          </header>

          {/* 3. Hero Section */}
          {config.hero.isVisible && (
            <section className="p-6 md:p-10 relative overflow-hidden bg-gradient-to-b from-[#0A0F24] to-[#050810] border-b border-slate-800/80">
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    GKN V2 Master Sourcing Platform
                  </span>
                  <h1 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-wide">
                    {config.hero.mainHeading}
                  </h1>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {config.hero.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {config.hero.ctaButton1.visible && (
                      <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
                        {config.hero.ctaButton1.label} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {config.hero.ctaButton2.visible && (
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 transition-colors">
                        {config.hero.ctaButton2.label}
                      </button>
                    )}
                  </div>
                </div>

                {config.hero.heroImage && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-video">
                    <img
                      src={config.hero.heroImage}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent" />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. Store Cards Grid Section */}
          <section className="p-6 space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Storefront Sourcing Channels
              </span>
              <h2 className="text-base font-bold text-white uppercase">
                Choose Your Procurement Model
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {config.storeCards
                .filter((sc) => sc.isVisible)
                .map((card) => (
                  <div
                    key={card.id}
                    className="bg-[#0A0F1D] border rounded-2xl p-4 space-y-3 flex flex-col justify-between"
                    style={{ borderColor: `${card.accentColor}40` }}
                  >
                    <div className="space-y-2">
                      <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border inline-block"
                        style={{
                          backgroundColor: `${card.accentColor}15`,
                          color: card.accentColor,
                          borderColor: `${card.accentColor}40`,
                        }}
                      >
                        {card.subtitle}
                      </span>
                      <h3 className="text-sm font-bold text-white">{card.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-3">{card.description}</p>
                    </div>

                    <button
                      className="w-full py-2 font-bold rounded-xl text-xs transition-transform active:scale-95 shadow-md text-center block mt-2"
                      style={{ backgroundColor: card.accentColor, color: '#050810' }}
                    >
                      {card.buttonText} →
                    </button>
                  </div>
                ))}
            </div>
          </section>

          {/* 5. Homepage Spotlights */}
          {config.homepageCards.some((c) => c.isVisible) && (
            <section className="p-6 bg-[#080D1A] border-t border-slate-800/80 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.homepageCards
                  .filter((c) => c.isVisible)
                  .map((card) => (
                    <div
                      key={card.id}
                      className="bg-[#0D1427] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border"
                            style={{
                              backgroundColor: `${card.badgeColor}20`,
                              color: card.badgeColor,
                              borderColor: `${card.badgeColor}40`,
                            }}
                          >
                            {card.badgeText}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{card.title}</h3>
                        <p className="text-xs text-slate-300">{card.description}</p>
                      </div>

                      <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-lg text-xs w-fit border border-slate-700">
                        {card.ctaText} →
                      </button>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* 6. Research Hub Section */}
          {config.researchHub.isVisible && (
            <section className="p-6 border-t border-slate-800/80 bg-gradient-to-r from-cyan-950/30 to-purple-950/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 uppercase">
                    Knowledge Base
                  </span>
                  <h2 className="text-base font-bold text-white uppercase">{config.researchHub.heading}</h2>
                  <p className="text-xs text-slate-300">{config.researchHub.description}</p>

                  <ul className="space-y-1.5 pt-1">
                    {config.researchHub.featuresList.map((f, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button className="mt-2 px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">
                    {config.researchHub.buttonText} →
                  </button>
                </div>

                {config.researchHub.image && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-900">
                    <img
                      src={config.researchHub.image}
                      alt="Research Hub"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 7. Footer */}
          <footer className="p-6 bg-[#04060C] border-t border-slate-800/80 space-y-6 text-slate-400 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  {config.branding.brandName}
                </div>
                <p className="text-[11px] text-slate-500">{config.branding.brandSlogan}</p>
                <p className="text-[11px] text-slate-400">{config.footer.address}</p>
                <div className="text-[11px] text-cyan-400 font-mono">{config.footer.contactEmail}</div>
              </div>

              {config.footer.linkColumns.map((col) => (
                <div key={col.id} className="space-y-2">
                  <h4 className="font-bold text-white uppercase text-xs">{col.title}</h4>
                  <ul className="space-y-1 text-[11px]">
                    {col.links
                      .filter((l) => l.isVisible)
                      .map((l) => (
                        <li key={l.id} className="hover:text-cyan-400 cursor-pointer">
                          {l.label}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <span>{config.footer.copyrightText}</span>
              <div className="flex items-center gap-3">
                {config.footer.socialLinks
                  .filter((s) => s.isVisible)
                  .map((s, i) => (
                    <span key={i} className="hover:text-cyan-400 capitalize cursor-pointer">
                      {s.platform}
                    </span>
                  ))}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );

  if (isModalMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center">
        <div className="w-full max-w-6xl h-[90vh]">{content}</div>
      </div>
    );
  }

  return content;
};
