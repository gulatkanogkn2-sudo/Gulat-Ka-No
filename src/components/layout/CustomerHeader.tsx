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
  const brandName = sysBrandName || websiteConfig?.branding?.brandName || APP_CONFIG.name;
  const brandSlogan = websiteConfig?.branding?.brandSlogan || APP_CONFIG.tagline;

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 bg-[rgba(5,8,16,0.92)] backdrop-blur-xl">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] sm:h-[78px] flex items-center justify-between gap-4 w-full">
          {/* Left Section: Brand Logo & Title */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-xl bg-[#00D9FF]/20 border border-[#00D9FF]/50 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.3)] group-hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all overflow-hidden bg-[#050810]">
                <SafeImage
                  src={logoUrl}
                  alt={brandName}
                  fallbackSrc={BRANDING_ASSETS.logo}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-center overflow-hidden">
                <span className="text-base sm:text-lg leading-tight font-bold tracking-wider text-[#00D9FF] drop-shadow-[0_0_8px_rgba(0,217,255,0.4)] whitespace-nowrap truncate">
                  {brandName}
                </span>
                <span className="text-[10px] leading-tight text-[#FF2ED1] font-mono tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,46,209,0.4)] mt-0.5 whitespace-nowrap truncate">
                  {brandSlogan}
                </span>
              </div>
            </Link>
          </div>

          {/* Right Section: Install App, Shopping Cart & Primary Hamburger Trigger */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {deferredPrompt && !isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="h-10 px-2.5 sm:px-4 bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/60 rounded-xl font-mono text-[10px] sm:text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(0,217,255,0.2)] active:scale-95 whitespace-nowrap"
                aria-label="Install App"
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                <span className="hidden min-[390px]:inline">INSTALL APP</span>
              </button>
            )}

            <HeaderIconButton
              icon={<ShoppingCart className="w-5 h-5 text-[#00D9FF]" />}
              tooltip="Cart"
              variant="cyan"
              onClick={() => openDrawer()}
              badgeCount={totalItemCount > 0 ? totalItemCount : undefined}
              ariaLabel="Shopping Cart"
            />

            <HeaderIconButton
              icon={<Menu className="w-5 h-5 text-[#00D9FF]" />}
              tooltip="Open Menu"
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

