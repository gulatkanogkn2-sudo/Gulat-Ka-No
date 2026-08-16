import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../../app/config';
import { Badge } from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { WebsiteManagerService } from '../../services/websiteManagerService';
import { WebsiteConfig } from '../../types/websiteManager';
import { BRANDING_ASSETS, SafeImage } from '../../assets/branding';
import { systemSettingsService } from '../../services/systemSettingsService';

interface AdminNavigationProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onToggleMobile?: () => void;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  isMobileOpen: externalIsMobileOpen,
  onCloseMobile,
  onToggleMobile,
}) => {
  const location = useLocation();
  const { isDevMode } = useAuth();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig | null>(null);
  const [sysBrandName, setSysBrandName] = useState(() => systemSettingsService.getSettings()?.general?.brandName);

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

  const adminLogoUrl = websiteConfig?.branding?.adminLogo || websiteConfig?.branding?.websiteLogo || BRANDING_ASSETS.logo;
  const brandName = websiteConfig?.branding?.brandName || sysBrandName || APP_CONFIG.name;
  const brandSlogan = websiteConfig?.branding?.brandSlogan || APP_CONFIG.tagline;

  const isMobileOpen = externalIsMobileOpen !== undefined ? externalIsMobileOpen : internalMobileOpen;

  const handleToggle = () => {
    if (onToggleMobile) {
      onToggleMobile();
    } else {
      setInternalMobileOpen((prev) => !prev);
    }
  };

  const handleClose = () => {
    if (onCloseMobile) {
      onCloseMobile();
    } else {
      setInternalMobileOpen(false);
    }
  };

  // Close mobile nav on route change
  useEffect(() => {
    handleClose();
  }, [location.pathname, location.search]);

  return (
    <aside className="w-full md:w-56 lg:w-60 xl:w-64 bg-[#070B15]/95 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0 flex flex-col justify-between md:h-full backdrop-blur-xl">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-[#0A0F1D] flex-shrink-0">
          <Link to="/admin/dashboard" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/50 p-0.5 flex items-center justify-center shadow-[0_0_10px_rgba(0,217,255,0.3)] group-hover:shadow-[0_0_15px_rgba(0,217,255,0.5)] transition-all overflow-hidden bg-[#050810]">
              <SafeImage
                src={adminLogoUrl}
                alt={brandName}
                fallbackSrc={BRANDING_ASSETS.logo}
                className="w-full h-full object-contain rounded-md"
              />
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-wider text-[#00D9FF] group-hover:brightness-125 transition-all drop-shadow-[0_0_8px_rgba(0,217,255,0.4)] truncate">
                  {brandName}
                </span>
                <span className="text-[9px] font-mono bg-[#00D9FF]/20 text-[#00D9FF] px-1.5 py-0.5 rounded border border-[#00D9FF]/30 font-bold">
                  ADMIN
                </span>
              </div>
              <span className="text-[9px] text-[#FF2ED1] font-mono tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,46,209,0.4)] mt-0.5 truncate">
                {brandSlogan}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-xs font-mono text-slate-400 hover:text-[#00D9FF] transition-colors px-2 py-1 rounded bg-white/5 border border-white/10 md:bg-transparent md:border-0"
              title="Exit Admin to Storefront"
            >
              Exit ↗
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={handleToggle}
              className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-[#00D9FF]/50 transition-all cursor-pointer"
              aria-label="Toggle Admin Menu"
            >
              {isMobileOpen ? <X className="w-5 h-5 text-[#00D9FF]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Grouped Admin Nav Sections (Desktop or Mobile Expanded) */}
        <div
          className={`${
            isMobileOpen ? 'block' : 'hidden'
          } md:block p-3 space-y-4 md:flex-1 md:overflow-y-auto custom-scrollbar`}
        >
          {APP_CONFIG.adminNavGroups.map((group, groupIdx) => {
            const isMainGroup = group.category === 'MAIN';
            return (
              <div
                key={group.category || groupIdx}
                className={`space-y-1 ${isMainGroup ? 'pb-3 border-b border-white/10' : ''}`}
              >
                {!isMainGroup && (
                  <h4 className="px-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-1">
                    {group.category}
                  </h4>
                )}
                {group.items.map((item, itemIdx) => {
                  const itemPathNoQuery = item.path.split('?')[0];
                  const itemQuery = item.path.includes('?') ? `?${item.path.split('?')[1]}` : '';
                  const isExactMatch = location.pathname === itemPathNoQuery;
                  const isSubMatch =
                    itemPathNoQuery !== '/admin' &&
                    itemPathNoQuery !== '/admin/dashboard' &&
                    location.pathname.startsWith(`${itemPathNoQuery}/`);
                  const isPathMatch = isExactMatch || isSubMatch;

                  let isSearchMatch = true;
                  if (itemQuery) {
                    if (location.pathname === '/admin/settings') {
                      const currentTab = new URLSearchParams(location.search).get('tab') || 'general';
                      const tabToMainMap: Record<string, string> = {
                        general: '?tab=general',
                        stores: '?tab=stores',
                        productAddons: '?tab=stores',
                        customerTiers: '?tab=customerTiers',
                        checkout: '?tab=checkout',
                        accessories: '?tab=checkout',
                        orders: '?tab=orders',
                        orderTimeline: '?tab=orders',
                        shipping: '?tab=shipping',
                        payments: '?tab=payments',
                        digitalMemberId: '?tab=digitalMemberId',
                        adminOwner: '?tab=adminOwner',
                        adminVisibility: '?tab=adminOwner',
                        owner: '?tab=adminOwner',
                        security: '?tab=adminOwner',
                        deployment: '?tab=deployment',
                        systemConfig: '?tab=deployment',
                        notifications: '?tab=deployment',
                      };
                      const mappedQuery = tabToMainMap[currentTab] || '?tab=general';
                      isSearchMatch = mappedQuery === itemQuery;
                    } else {
                      isSearchMatch = location.search === itemQuery;
                    }
                  }

                  const isActive = isPathMatch && isSearchMatch;
                  return (
                    <Link
                      key={`${group.category}-${item.label}-${item.path}-${itemIdx}`}
                      to={item.path}
                      onClick={handleClose}
                      className={`flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40 font-bold shadow-[inset_0_0_8px_rgba(0,217,255,0.15)]'
                          : 'text-slate-400 font-semibold hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate flex items-center gap-2">
                        {isMainGroup && <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />}
                        {item.label}
                      </span>
                      {item.badge && <Badge variant="cyan">{item.badge}</Badge>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Footer Status (Only on Desktop or when Mobile Expanded) */}
      <div
        className={`${
          isMobileOpen ? 'flex' : 'hidden md:flex'
        } p-3 border-t border-white/10 bg-[#050810] text-[10px] font-mono text-slate-500 items-center justify-between`}
      >
        {isDevMode ? (
          <>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Dev Mode (Owner)
            </span>
            <span className="text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Phase 4.5
            </span>
          </>
        ) : (
          <>
            <span>Admin Team (3/5)</span>
            <span className="text-emerald-400">● Online</span>
          </>
        )}
      </div>
    </aside>
  );
};


