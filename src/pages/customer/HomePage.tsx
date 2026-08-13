import React, { useState, useEffect } from 'react';
import { ResponsiveContainer } from '../../components/layout/ResponsiveContainer';
import { Card } from '../../components/common/Card';
import { Link } from 'react-router-dom';
import {
  Calculator,
  FileText,
  FlaskConical,
  Tags,
  ArrowUpRight,
  Download,
  ShoppingCart,
  Package,
  Factory,
  ArrowRight,
  Clock,
  Zap,
  Boxes,
} from 'lucide-react';
import { BRANDING_ASSETS, SafeImage } from '../../assets/branding';
import { WebsiteManagerService } from '../../services/websiteManagerService';
import { WebsiteConfig } from '../../types/websiteManager';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const HomePage: React.FC = () => {
  const [cmsConfig, setCmsConfig] = useState<WebsiteConfig | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  // Load CMS configuration for dynamic home banner if updated by admin
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    WebsiteManagerService.getWebsiteConfig().then((data) => {
      setCmsConfig(data);
    });

    unsubscribe = WebsiteManagerService.subscribeToConfigUpdates((updated) => {
      setCmsConfig(updated);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // PWA Installation Detector
  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const bannerImage = cmsConfig?.hero?.heroImage || BRANDING_ASSETS.heroArtwork;

  return (
    <div className="relative w-full overflow-hidden">
      <ResponsiveContainer className="py-8 relative z-10">
        {/* ONE CLEAN LANDSCAPE HOME BANNER WITH PWA INSTALL BUTTON */}
        <div className="mb-12">
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#00D9FF]/30 shadow-[0_0_35px_rgba(0,217,255,0.2)] bg-gradient-to-r from-[#050810] via-[#0B132B] to-[#050810] flex items-center justify-center min-h-[140px] p-1 sm:p-2 group">
            <SafeImage
              src={bannerImage}
              alt="GKN Research Lab Promotional Banner"
              fallbackSrc={BRANDING_ASSETS.logo}
              className="w-full h-auto max-h-[550px] object-contain rounded-xl block transition-transform duration-500 group-hover:scale-[1.005]"
            />
            {/* Subtle Vignette Overlay for GKN Dark Luxury Aesthetic */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />

            {/* PWA INSTALL APP BUTTON (Desktop / Tablet Overlay on Banner) */}
            {deferredPrompt && !isInstalled && (
              <div className="absolute bottom-4 right-4 z-20">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="px-4 py-2 bg-[#050810]/90 hover:bg-[#050810] text-[#00D9FF] border border-[#00D9FF] rounded-xl font-mono text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(0,217,255,0.8)] active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#00D9FF] animate-bounce" />
                  INSTALL APP
                </button>
              </div>
            )}
          </div>

          {/* PWA INSTALL APP BUTTON (Mobile Toolbar below Banner if preferred for touch accessibility) */}
          {deferredPrompt && !isInstalled && (
            <div className="mt-3 flex justify-end sm:hidden">
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-2.5 bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF] rounded-xl font-mono text-xs font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,217,255,0.2)] active:scale-95"
              >
                <Download className="w-4 h-4 text-[#00D9FF]" />
                INSTALL APP
              </button>
            </div>
          )}
        </div>

        {/* CHOOSE YOUR STORE SECTION HEADER */}
        <div className="mb-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#00D9FF]/50 max-w-[150px] sm:max-w-[200px]"></div>
            <span className="text-xs sm:text-sm font-mono tracking-widest text-[#00D9FF] uppercase font-bold px-3 py-1 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 shadow-[0_0_12px_rgba(0,217,255,0.2)]">
              Select Your Channel
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#00D9FF]/50 max-w-[150px] sm:max-w-[200px]"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-sans">
            CHOOSE YOUR STORE
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-mono">
            Select a store model based on your research fulfillment timeline, inventory availability, and volume requirements.
          </p>
        </div>

        {/* STORE SELECTION CARDS & BUTTONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 items-stretch">
          {/* 1. GROUPBUY STORE CARD (Cyan Identity) */}
          <Link to="/groupbuy" className="block h-full group">
            <Card
              variant="glass"
              noPadding
              className="border-[#00D9FF]/40 group-hover:border-[#00D9FF] group-hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-[0_0_25px_rgba(0,217,255,0.12)] group-hover:shadow-[0_0_40px_rgba(0,217,255,0.35)] h-full cursor-pointer relative flex flex-col justify-between"
            >
              {/* Background Art & Vignette */}
              <div className="absolute inset-0 z-0 opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-85 pointer-events-none">
                <SafeImage
                  src={BRANDING_ASSETS.groupbuy}
                  alt="GroupBuy Pre-Order Store"
                  fallbackSrc={BRANDING_ASSETS.logo}
                  className="w-full h-full object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/85 to-[#050810]/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent"></div>
              </div>

              {/* Card Content Header & Body */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-between space-y-6">
                <div>
                  {/* Top Badge & Store Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/50 shadow-[0_0_12px_rgba(0,217,255,0.3)]">
                      PRE-ORDER / BATCH OPEN
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#00D9FF]" />
                      Batch Cycle
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.25)] flex-shrink-0">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-white group-hover:text-[#00D9FF] transition-colors tracking-wide">
                        GroupBuy Store
                      </h3>
                      <p className="text-xs font-mono text-[#00D9FF]/80 uppercase tracking-wider font-semibold">
                        Pre-Order & Community Allocation
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed my-4">
                    Participate in pre-order batch allocations with community volume tier pricing and scheduled release cycles.
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2 py-3 border-t border-b border-white/10 font-mono text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></span>
                      <span>Best per-kit rates via community volume thresholds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></span>
                      <span>Batch lifecycle tracking with verified timeline updates</span>
                    </div>
                  </div>
                </div>

                {/* Prominent Action Button */}
                <div className="pt-2">
                  <div className="w-full py-3.5 px-5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between shadow-[0_0_20px_rgba(0,217,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] group-hover:scale-[1.02]">
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Enter GroupBuy Store
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          {/* 2. ONHAND STORE CARD (Purple Identity) */}
          <Link to="/onhand" className="block h-full group">
            <Card
              variant="glass"
              noPadding
              className="border-[#8B5CF6]/40 group-hover:border-[#8B5CF6] group-hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-[0_0_25px_rgba(139,92,246,0.12)] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.35)] h-full cursor-pointer relative flex flex-col justify-between"
            >
              {/* Background Art & Vignette */}
              <div className="absolute inset-0 z-0 opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-85 pointer-events-none">
                <SafeImage
                  src={BRANDING_ASSETS.onhand}
                  alt="OnHand In-Stock Store"
                  fallbackSrc={BRANDING_ASSETS.logo}
                  className="w-full h-full object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/85 to-[#050810]/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent"></div>
              </div>

              {/* Card Content Header & Body */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-between space-y-6">
                <div>
                  {/* Top Badge & Store Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/50 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                      IN STOCK / IMMEDIATE DISPATCH
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      1-3 Days Delivery
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.25)] flex-shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-white group-hover:text-[#8B5CF6] transition-colors tracking-wide">
                        OnHand Store
                      </h3>
                      <p className="text-xs font-mono text-[#8B5CF6]/80 uppercase tracking-wider font-semibold">
                        In Stock & Ready to Dispatch
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed my-4">
                    Directly available inventory for immediate laboratory dispatch with rapid express shipping turnaround.
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2 py-3 border-t border-b border-white/10 font-mono text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
                      <span>Zero waiting time — items packed and shipped immediately</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
                      <span>Verified local stock with guaranteed COA reports</span>
                    </div>
                  </div>
                </div>

                {/* Prominent Action Button */}
                <div className="pt-2">
                  <div className="w-full py-3.5 px-5 rounded-xl bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] group-hover:scale-[1.02]">
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Enter OnHand Store
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          {/* 3. MOQ STORE CARD (Neon Pink Identity) */}
          <Link to="/moq" className="block h-full group">
            <Card
              variant="glass"
              noPadding
              className="border-[#FF2ED1]/40 group-hover:border-[#FF2ED1] group-hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-[0_0_25px_rgba(255,46,209,0.12)] group-hover:shadow-[0_0_40px_rgba(255,46,209,0.35)] h-full cursor-pointer relative flex flex-col justify-between"
            >
              {/* Background Art & Vignette */}
              <div className="absolute inset-0 z-0 opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-85 pointer-events-none">
                <SafeImage
                  src={BRANDING_ASSETS.moq}
                  alt="MOQ Minimum Quantity Store"
                  fallbackSrc={BRANDING_ASSETS.logo}
                  className="w-full h-full object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/85 to-[#050810]/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent"></div>
              </div>

              {/* Card Content Header & Body */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-between space-y-6">
                <div>
                  {/* Top Badge & Store Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FF2ED1]/20 text-[#FF2ED1] border border-[#FF2ED1]/50 shadow-[0_0_12px_rgba(255,46,209,0.3)]">
                      MINIMUM ORDER / BULK QUOTA
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Boxes className="w-3.5 h-3.5 text-[#FF2ED1]" />
                      Bulk Quotas
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#FF2ED1]/10 border border-[#FF2ED1]/40 flex items-center justify-center text-[#FF2ED1] shadow-[0_0_12px_rgba(255,46,209,0.25)] flex-shrink-0">
                      <Factory className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-white group-hover:text-[#FF2ED1] transition-colors tracking-wide">
                        MOQ Store
                      </h3>
                      <p className="text-xs font-mono text-[#FF2ED1]/80 uppercase tracking-wider font-semibold">
                        Minimum Quantity Bulk Reservations
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed my-4">
                    Bulk quota reservations and institutional volume runs with minimum quantity commitment thresholds.
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2 py-3 border-t border-b border-white/10 font-mono text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF2ED1]"></span>
                      <span>Maximum savings per vial for bulk quantity buyers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF2ED1]"></span>
                      <span>Custom synthesis batch runs with dedicated purity testing</span>
                    </div>
                  </div>
                </div>

                {/* Prominent Action Button */}
                <div className="pt-2">
                  <div className="w-full py-3.5 px-5 rounded-xl bg-[#FF2ED1] hover:bg-[#FF2ED1]/90 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between shadow-[0_0_20px_rgba(255,46,209,0.4)] group-hover:shadow-[0_0_30px_rgba(255,46,209,0.7)] group-hover:scale-[1.02]">
                    <span className="flex items-center gap-2">
                      <Factory className="w-4 h-4" />
                      Enter MOQ Store
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* RESEARCH HUB - Whole Feature Cards Clickable */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#00D9FF]/50 max-w-[200px]"></div>
            <h3 className="text-xl font-bold tracking-widest text-[#00D9FF] drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]">
              RESEARCH HUB
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#00D9FF]/50 max-w-[200px]"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Peptide Calculator */}
            <Link to="/research/calculators" className="block h-full group">
              <Card
                variant="glass"
                className="border-[#00D9FF]/20 group-hover:border-[#00D9FF]/60 group-hover:-translate-y-1.5 transition-all duration-300 h-full cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.05)] group-hover:shadow-[0_0_25px_rgba(0,217,255,0.2)]"
              >
                <div className="absolute -right-4 -bottom-4 text-[#00D9FF]/10 group-hover:text-[#00D9FF]/25 transition-colors transform rotate-[-15deg] pointer-events-none">
                  <Calculator size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-white group-hover:text-[#00D9FF] transition-colors">
                      Peptide Calculator
                    </h4>
                    <ArrowUpRight className="w-5 h-5 text-[#00D9FF] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Precision dosage, reconstitution, syringe, and vial calculation tools for researchers.
                  </p>
                </div>
              </Card>
            </Link>

            {/* COA Library */}
            <Link to="/research/coa-library" className="block h-full group">
              <Card
                variant="glass"
                className="border-[#8B5CF6]/20 group-hover:border-[#8B5CF6]/60 group-hover:-translate-y-1.5 transition-all duration-300 h-full cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.05)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]"
              >
                <div className="absolute -right-4 -bottom-4 text-[#8B5CF6]/10 group-hover:text-[#8B5CF6]/25 transition-colors transform rotate-[15deg] pointer-events-none">
                  <FileText size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-white group-hover:text-[#8B5CF6] transition-colors">
                      COA Library
                    </h4>
                    <ArrowUpRight className="w-5 h-5 text-[#8B5CF6] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Access and verify third-party Certificates of Analysis and batch spectrometry reports.
                  </p>
                </div>
              </Card>
            </Link>

            {/* Protocol Library */}
            <Link to="/research/protocol-library" className="block h-full group">
              <Card
                variant="glass"
                className="border-[#FF2ED1]/20 group-hover:border-[#FF2ED1]/60 group-hover:-translate-y-1.5 transition-all duration-300 h-full cursor-pointer shadow-[0_0_15px_rgba(255,46,209,0.05)] group-hover:shadow-[0_0_25px_rgba(255,46,209,0.2)]"
              >
                <div className="absolute -right-4 -bottom-4 text-[#FF2ED1]/10 group-hover:text-[#FF2ED1]/25 transition-colors transform rotate-[-10deg] pointer-events-none">
                  <FlaskConical size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-white group-hover:text-[#FF2ED1] transition-colors">
                      Protocol Library
                    </h4>
                    <ArrowUpRight className="w-5 h-5 text-[#FF2ED1] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Access analytical research protocols, handling guidelines, and storage methodologies.
                  </p>
                </div>
              </Card>
            </Link>

            {/* Price List */}
            <Link to="/research/price-list" className="block h-full group">
              <Card
                variant="glass"
                className="border-[#3B82F6]/20 group-hover:border-[#3B82F6]/60 group-hover:-translate-y-1.5 transition-all duration-300 h-full cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.05)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
              >
                <div className="absolute -right-4 -bottom-4 text-[#3B82F6]/10 group-hover:text-[#3B82F6]/25 transition-colors transform rotate-[20deg] pointer-events-none">
                  <Tags size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-white group-hover:text-[#3B82F6] transition-colors">
                      Products Price List
                    </h4>
                    <ArrowUpRight className="w-5 h-5 text-[#3B82F6] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Comprehensive cross-store pricing matrix for all reference materials and catalog items.
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};
