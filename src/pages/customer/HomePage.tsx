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

export const HomePage: React.FC = () => {
  const [cmsConfig, setCmsConfig] = useState<WebsiteConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(!WebsiteManagerService.isConfigInitialized());

  // Load CMS configuration for dynamic home banner if updated by admin
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    WebsiteManagerService.getWebsiteConfig().then((data) => {
      if (isMounted) {
        setCmsConfig(data);
        setIsLoadingConfig(false);
      }
    });

    unsubscribe = WebsiteManagerService.subscribeToConfigUpdates((updated) => {
      if (isMounted) {
        setCmsConfig(updated);
        setIsLoadingConfig(false);
      }
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const bannerImage = cmsConfig?.hero?.heroImage || BRANDING_ASSETS.heroArtwork;

  const groupbuyCardImage =
    cmsConfig?.storeCards?.find((c) => c.storeKey === 'groupbuy')?.image || BRANDING_ASSETS.groupbuy;
  const onhandCardImage =
    cmsConfig?.storeCards?.find((c) => c.storeKey === 'onhand')?.image || BRANDING_ASSETS.onhand;
  const moqCardImage =
    cmsConfig?.storeCards?.find((c) => c.storeKey === 'moq')?.image || BRANDING_ASSETS.moq;

  return (
    <div className="relative w-full overflow-hidden">
      <ResponsiveContainer className="py-6 sm:py-8 lg:py-10 relative z-10">
        {/* ONE CLEAN LANDSCAPE HOME BANNER */}
        {isLoadingConfig ? (
          <div className="mb-10 sm:mb-12">
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#00D9FF]/20 shadow-[0_0_25px_rgba(0,217,255,0.08)] bg-gradient-to-r from-[#050810] via-[#0B132B] to-[#050810] flex items-center justify-center min-h-[140px] sm:min-h-[220px] p-2 animate-pulse">
              <div className="w-10 h-10 rounded-full border-2 border-[#00D9FF]/30 border-t-[#00D9FF] animate-spin opacity-50" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>
          </div>
        ) : cmsConfig?.hero?.isVisible !== false ? (
          <div className="mb-10 sm:mb-12">
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#00D9FF]/30 shadow-[0_0_30px_rgba(0,217,255,0.15)] bg-gradient-to-r from-[#050810] via-[#0B132B] to-[#050810] flex items-center justify-center min-h-[140px] p-1 sm:p-2 group">
              <SafeImage
                src={bannerImage}
                alt="GKN Store Banner"
                fallbackSrc={BRANDING_ASSETS.logo}
                className="w-full h-auto max-h-[500px] object-cover sm:object-contain rounded-xl block transition-transform duration-500 group-hover:scale-[1.003]"
              />
              {/* Subtle Vignette Overlay for GKN Dark Luxury Aesthetic */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>
          </div>
        ) : null}

        {/* CHOOSE YOUR STORE SECTION HEADER */}
        <div className="mb-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#00D9FF]/40 max-w-[120px] sm:max-w-[180px]"></div>
            <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#00D9FF] uppercase font-bold px-3 py-1 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 shadow-[0_0_12px_rgba(0,217,255,0.15)]">
              Choose Your Store
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#00D9FF]/40 max-w-[120px] sm:max-w-[180px]"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wide font-sans">
            CHOOSE YOUR STORE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-mono leading-relaxed">
            Select a store based on availability, delivery timing, and order quantity.
          </p>
        </div>

        {/* STORE SELECTION CARDS & BUTTONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14 sm:mb-16 items-stretch">
          {/* 1. GROUPBUY STORE CARD (Cyan Identity) */}
          <Link to="/groupbuy" className="block h-full group focus:outline-none">
            <Card
              variant="glass"
              noPadding
              className="border-[#00D9FF]/30 group-hover:border-[#00D9FF] group-hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-[0_0_25px_rgba(0,217,255,0.08)] group-hover:shadow-[0_0_35px_rgba(0,217,255,0.25)] h-full cursor-pointer relative flex flex-col justify-between rounded-2xl bg-[#060A17]/95"
            >
              {/* Background Art & Vignette */}
              <div className="absolute inset-0 z-0 opacity-40 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60 pointer-events-none">
                <SafeImage
                  src={groupbuyCardImage}
                  alt="GroupBuy Pre-Order Store"
                  fallbackSrc={BRANDING_ASSETS.logo}
                  className="w-full h-full object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/90 to-[#050810]/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/70 to-transparent"></div>
              </div>

              {/* Card Content Header & Body */}
              <div className="relative z-10 p-6 sm:p-7 flex flex-col h-full justify-between space-y-6">
                <div>
                  {/* Top Badge & Store Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]">
                      PRE-ORDER / BATCH OPEN
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#00D9FF]" />
                      Batch Cycle
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.2)] flex-shrink-0">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl sm:text-2xl text-white group-hover:text-[#00D9FF] transition-colors tracking-wide font-sans">
                        GroupBuy Store
                      </h3>
                      <p className="text-[11px] font-mono text-[#00D9FF]/80 uppercase tracking-wider font-semibold">
                        Pre-Order & Community Allocation
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed my-3.5">
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
                  <div className="w-full min-h-[44px] py-3 px-5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between shadow-[0_0_20px_rgba(0,217,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] group-hover:scale-[1.01]">
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
          <Link to="/onhand" className="block h-full group focus:outline-none">
            <Card
              variant="glass"
              noPadding
              className="border-[#8B5CF6]/30 group-hover:border-[#8B5CF6] group-hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-[0_0_25px_rgba(139,92,246,0.08)] group-hover:shadow-[0_0_35px_rgba(139,92,246,0.25)] h-full cursor-pointer relative flex flex-col justify-between rounded-2xl bg-[#060A17]/95"
            >
              {/* Background Art & Vignette */}
              <div className="absolute inset-0 z-0 opacity-40 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60 pointer-events-none">
                <SafeImage
                  src={onhandCardImage}
                  alt="OnHand In-Stock Store"
                  fallbackSrc={BRANDING_ASSETS.logo}
                  className="w-full h-full object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/90 to-[#050810]/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/70 to-transparent"></div>
              </div>

              {/* Card Content Header & Body */}
              <div className="relative z-10 p-6 sm:p-7 flex flex-col h-full justify-between space-y-6">
                <div>
                  {/* Top Badge & Store Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                      IN STOCK / IMMEDIATE DISPATCH
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      1-3 Days Delivery
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.2)] flex-shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl sm:text-2xl text-white group-hover:text-[#8B5CF6] transition-colors tracking-wide font-sans">
                        OnHand Store
                      </h3>
                      <p className="text-[11px] font-mono text-[#8B5CF6]/80 uppercase tracking-wider font-semibold">
                        In Stock & Ready to Dispatch
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed my-3.5">
                    Available inventory ready for immediate dispatch with rapid express shipping turnaround.
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2 py-3 border-t border-b border-white/10 font-mono text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
                      <span>Zero waiting time â€” items packed and shipped immediately</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
                      <span>Verified local stock with guaranteed COA reports</span>
                    </div>
                  </div>
                </div>

                {/* Prominent Action Button */}
                <div className="pt-2">
                  <div className="w-full min-h-[44px] py-3 px-5 rounded-xl bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] group-hover:scale-[1.01]">
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
          <Link to="/moq" className="block h-full group focus:outline-none">
            <Card
              variant="glass"
              noPadding
              className="border-[#FF2ED1]/30 group-hover:border-[#FF2ED1] group-hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-[0_0_25px_rgba(255,46,209,0.08)] group-hover:shadow-[0_0_35px_rgba(255,46,209,0.25)] h-full cursor-pointer relative flex flex-col justify-between rounded-2xl bg-[#060A17]/95"
            >
              {/* Background Art & Vignette */}
              <div className="absolute inset-0 z-0 opacity-40 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60 pointer-events-none">
                <SafeImage
                  src={moqCardImage}
                  alt="MOQ Minimum Quantity Store"
                  fallbackSrc={BRANDING_ASSETS.logo}
                  className="w-full h-full object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/90 to-[#050810]/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/70 to-transparent"></div>
              </div>

              {/* Card Content Header & Body */}
              <div className="relative z-10 p-6 sm:p-7 flex flex-col h-full justify-between space-y-6">
                <div>
                  {/* Top Badge & Store Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-[#FF2ED1]/15 text-[#FF2ED1] border border-[#FF2ED1]/40 shadow-[0_0_10px_rgba(255,46,209,0.2)]">
                      MINIMUM ORDER / BULK QUOTA
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Boxes className="w-3.5 h-3.5 text-[#FF2ED1]" />
                      Bulk Quotas
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF2ED1]/10 border border-[#FF2ED1]/30 flex items-center justify-center text-[#FF2ED1] shadow-[0_0_12px_rgba(255,46,209,0.2)] flex-shrink-0">
                      <Factory className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl sm:text-2xl text-white group-hover:text-[#FF2ED1] transition-colors tracking-wide font-sans">
                        MOQ Store
                      </h3>
                      <p className="text-[11px] font-mono text-[#FF2ED1]/80 uppercase tracking-wider font-semibold">
                        Minimum Quantity Bulk Reservations
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed my-3.5">
                    Bulk reservations and volume orders with minimum quantity commitment thresholds.
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
                  <div className="w-full min-h-[44px] py-3 px-5 rounded-xl bg-[#FF2ED1] hover:bg-[#FF2ED1]/90 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-between shadow-[0_0_20px_rgba(255,46,209,0.3)] group-hover:shadow-[0_0_30px_rgba(255,46,209,0.6)] group-hover:scale-[1.01]">
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

        {/* RESEARCH HUB - Feature Cards */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#00D9FF]/40 max-w-[150px] sm:max-w-[200px]"></div>
            <h3 className="text-base sm:text-lg font-bold tracking-widest text-[#00D9FF] uppercase font-mono">
              Research & Protocol Hub
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#00D9FF]/40 max-w-[150px] sm:max-w-[200px]"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {/* Peptide Calculator */}
            <Link to="/research/calculators" className="block h-full group focus:outline-none">
              <Card
                variant="glass"
                className="border-[#00D9FF]/20 group-hover:border-[#00D9FF]/60 group-hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.04)] group-hover:shadow-[0_0_20px_rgba(0,217,255,0.15)] rounded-xl bg-[#060A17]/80 p-5"
              >
                <div className="absolute -right-3 -bottom-3 text-[#00D9FF]/10 group-hover:text-[#00D9FF]/20 transition-colors transform rotate-[-15deg] pointer-events-none">
                  <Calculator size={100} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="font-bold text-base text-white group-hover:text-[#00D9FF] transition-colors font-sans">
                        Peptide Calculator
                      </h4>
                      <ArrowUpRight className="w-4 h-4 text-[#00D9FF] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      Precision dosage, reconstitution, syringe, and vial calculation tools.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* COA Library */}
            <Link to="/research/coa-library" className="block h-full group focus:outline-none">
              <Card
                variant="glass"
                className="border-[#8B5CF6]/20 group-hover:border-[#8B5CF6]/60 group-hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.04)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] rounded-xl bg-[#060A17]/80 p-5"
              >
                <div className="absolute -right-3 -bottom-3 text-[#8B5CF6]/10 group-hover:text-[#8B5CF6]/20 transition-colors transform rotate-[15deg] pointer-events-none">
                  <FileText size={100} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="font-bold text-base text-white group-hover:text-[#8B5CF6] transition-colors font-sans">
                        COA Library
                      </h4>
                      <ArrowUpRight className="w-4 h-4 text-[#8B5CF6] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      Access and verify third-party Certificates of Analysis and batch spectrometry reports.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Protocol Library */}
            <Link to="/research/protocol-library" className="block h-full group focus:outline-none">
              <Card
                variant="glass"
                className="border-[#FF2ED1]/20 group-hover:border-[#FF2ED1]/60 group-hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer shadow-[0_0_15px_rgba(255,46,209,0.04)] group-hover:shadow-[0_0_20px_rgba(255,46,209,0.15)] rounded-xl bg-[#060A17]/80 p-5"
              >
                <div className="absolute -right-3 -bottom-3 text-[#FF2ED1]/10 group-hover:text-[#FF2ED1]/20 transition-colors transform rotate-[-10deg] pointer-events-none">
                  <FlaskConical size={100} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="font-bold text-base text-white group-hover:text-[#FF2ED1] transition-colors font-sans">
                        Protocol Library
                      </h4>
                      <ArrowUpRight className="w-4 h-4 text-[#FF2ED1] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      Access analytical research protocols, handling guidelines, and storage methodologies.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Price List */}
            <Link to="/research/price-list" className="block h-full group focus:outline-none">
              <Card
                variant="glass"
                className="border-[#3B82F6]/20 group-hover:border-[#3B82F6]/60 group-hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.04)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] rounded-xl bg-[#060A17]/80 p-5"
              >
                <div className="absolute -right-3 -bottom-3 text-[#3B82F6]/10 group-hover:text-[#3B82F6]/20 transition-colors transform rotate-[20deg] pointer-events-none">
                  <Tags size={100} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="font-bold text-base text-white group-hover:text-[#3B82F6] transition-colors font-sans">
                        Products Price List
                      </h4>
                      <ArrowUpRight className="w-4 h-4 text-[#3B82F6] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      Comprehensive cross-store pricing matrix for all reference materials and catalog items.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};


