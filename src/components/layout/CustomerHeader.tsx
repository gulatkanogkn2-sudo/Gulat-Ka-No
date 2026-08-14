import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../app/config';
import { MobileNavigation } from './MobileNavigation';
import { useCart } from '../../context/CartContext';
import { HeaderIconButton } from '../common/HeaderIconButton';
import { Download, Menu, ShoppingCart } from 'lucide-react';
import { WebsiteManagerService } from '../../services/websiteManagerService';
import { WebsiteConfig } from '../../types/websiteManager';
import { BRANDING_ASSETS, SafeImage } from '../../assets/branding';
import { systemSettingsService } from '../../services/systemSettingsService';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const CustomerHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openDrawer, totalItemCount } = useCart();
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig | null>(null);
  const [sysBrandName, setSysBrandName] = useState(() => systemSettingsService.getSettings()?.general?.brandName);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    WebsiteManagerService.getWebsiteConfig().then(setWebsiteConfig);
    const unsubscribeWeb = WebsiteManagerService.subscribeToConfigUpdates((updated) => {
      setWebsiteConfig(updated);
    });

    const unsubscribeSys = systemSettingsService.subscribe((sys) => {
      setSysBrandName(sys.general?.brandName);
    });

    return () => {
      unsubscribeWeb();
      unsubscribeSys();
    };
  }, []);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
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
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const logoUrl = websiteConfig?.branding?.websiteLogo || BRANDING_ASSETS.logo;
  const brandName = websiteConfig?.branding?.brandName || sysBrandName || APP_CONFIG.name;
  const brandSlogan = websiteConfig?.branding?.brandSlogan || APP_CONFIG.tagline;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050812]/95 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] sm:h-[74px] flex items-center justify-between gap-3 sm:gap-4 w-full">
          {/* Left Section: Brand Logo & Title */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-1 focus:ring-[#00D9FF] rounded-xl p-0.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.15)] group-hover:shadow-[0_0_20px_rgba(0,217,255,0.35)] group-hover:border-[#00D9FF]/60 transition-all overflow-hidden bg-[#070B16]">
                <SafeImage
                  src={logoUrl}
                  alt={brandName}
                  fallbackSrc={BRANDING_ASSETS.logo}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-center overflow-hidden min-w-0">
                <span className="text-sm sm:text-base md:text-lg leading-tight font-black tracking-wider text-white group-hover:text-[#00D9FF] transition-colors whitespace-nowrap truncate font-sans">
                  {brandName}
                </span>
                <span className="text-[9px] sm:text-[10px] leading-tight text-[#00D9FF]/90 font-mono tracking-widest uppercase mt-0.5 whitespace-nowrap truncate font-semibold">
                  {brandSlogan}
                </span>
              </div>
            </Link>
          </div>

          {/* Right Section: Install App, Shopping Cart & Primary Hamburger Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {deferredPrompt && !isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="h-10 sm:h-11 min-h-[44px] px-3 sm:px-4 bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 hover:border-[#00D9FF] rounded-xl font-mono text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-[0_0_12px_rgba(0,217,255,0.15)] active:scale-95 cursor-pointer whitespace-nowrap"
                aria-label="Install GKN Web App"
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">INSTALL</span>
                <span className="hidden md:inline"> APP</span>
              </button>
            )}

            <HeaderIconButton
              icon={<ShoppingCart className="w-5 h-5 text-[#00D9FF]" />}
              tooltip="Shopping Cart"
              variant="cyan"
              onClick={() => openDrawer()}
              badgeCount={totalItemCount > 0 ? totalItemCount : undefined}
              ariaLabel="Shopping Cart"
            />

            <HeaderIconButton
              icon={<Menu className="w-5 h-5 text-[#00D9FF]" />}
              tooltip="Main Menu"
              variant="cyan"
              onClick={() => setIsMenuOpen(true)}
              ariaLabel="Open main navigation menu"
            />
          </div>
        </div>
      </header>

      {/* Primary Hamburger Navigation Drawer (Desktop, Laptop, Tablet, Mobile) */}
      <MobileNavigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};


