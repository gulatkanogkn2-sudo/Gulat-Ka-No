import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../../app/config';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { systemSettingsService } from '../../services/systemSettingsService';
import { WebsiteManagerService } from '../../services/websiteManagerService';
import { WebsiteConfig } from '../../types/websiteManager';
import { BRANDING_ASSETS, SafeImage } from '../../assets/branding';
import {
  House,
  ShoppingCart,
  Package,
  Factory,
  Truck,
  FlaskConical,
  Calculator,
  Syringe,
  FileText,
  BookOpen,
  DollarSign,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Zap,
  ShoppingBag,
  X,
} from 'lucide-react';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path?: string;
  action?: 'cart';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  bgColor: string;
  activeBgColor: string;
  glowColor: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { openDrawer, totalItemCount } = useCart();
  const [showAdminButton, setShowAdminButton] = useState<boolean>(true);
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig | null>(null);

  useEffect(() => {
    WebsiteManagerService.getWebsiteConfig().then(setWebsiteConfig);
    const unsubscribe = WebsiteManagerService.subscribeToConfigUpdates((updated) => {
      setWebsiteConfig(updated);
    });
    return () => unsubscribe();
  }, []);

  const mobileLogoUrl = websiteConfig?.branding?.mobileLogo || websiteConfig?.branding?.websiteLogo || BRANDING_ASSETS.logo;
  const brandName = websiteConfig?.branding?.brandName || APP_CONFIG.name;
  const brandSlogan = websiteConfig?.branding?.brandSlogan || APP_CONFIG.tagline;

  useEffect(() => {
    const unsubscribe = systemSettingsService.subscribe((settings) => {
      setShowAdminButton(settings.adminVisibility?.showAdminButton ?? true);
    });
    return () => unsubscribe();
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Strict Admin Portal visibility rule: Only for Owner, Super Admin, Admin
  const userRole = (user?.role || '').toLowerCase();
  const isAdminRole = Boolean(
    isAuthenticated &&
      user &&
      ['owner', 'super_admin', 'super admin', 'admin'].includes(userRole)
  );
  const canSeeAdminPortal = isAuthenticated && isAdminRole && showAdminButton;

  if (!isOpen) return null;

  const sections: NavSection[] = [
    {
      title: 'HOME',
      items: [
        {
          label: 'Home',
          path: '/',
          icon: House,
          color: 'text-[#00E5A8]',
          borderColor: 'border-[#00E5A8]/50 hover:border-[#00E5A8]',
          bgColor: 'bg-[#00E5A8]/10',
          activeBgColor: 'bg-[#00E5A8]/25 border-[#00E5A8]',
          glowColor: 'shadow-[0_0_12px_rgba(0,229,168,0.25)]',
        },
      ],
    },
    {
      title: 'STORE',
      items: [
        {
          label: 'GroupBuy',
          path: '/groupbuy',
          icon: ShoppingCart,
          color: 'text-[#00F0FF]',
          borderColor: 'border-[#00F0FF]/50 hover:border-[#00F0FF]',
          bgColor: 'bg-[#00F0FF]/10',
          activeBgColor: 'bg-[#00F0FF]/25 border-[#00F0FF]',
          glowColor: 'shadow-[0_0_12px_rgba(0,240,255,0.25)]',
        },
        {
          label: 'OnHand',
          path: '/onhand',
          icon: Package,
          color: 'text-[#A855F7]',
          borderColor: 'border-[#8A2BE2]/50 hover:border-[#8A2BE2]',
          bgColor: 'bg-[#8A2BE2]/10',
          activeBgColor: 'bg-[#8A2BE2]/25 border-[#8A2BE2]',
          glowColor: 'shadow-[0_0_12px_rgba(138,43,226,0.25)]',
        },
        {
          label: 'MOQ',
          path: '/moq',
          icon: Factory,
          color: 'text-[#FF2ED1]',
          borderColor: 'border-[#FF2ED1]/50 hover:border-[#FF2ED1]',
          bgColor: 'bg-[#FF2ED1]/10',
          activeBgColor: 'bg-[#FF2ED1]/25 border-[#FF2ED1]',
          glowColor: 'shadow-[0_0_12px_rgba(255,46,209,0.25)]',
        },
      ],
    },
    {
      title: 'RESEARCH',
      items: [
        {
          label: 'Research Hub',
          path: '/research',
          icon: FlaskConical,
          color: 'text-[#2979FF]',
          borderColor: 'border-[#2979FF]/50 hover:border-[#2979FF]',
          bgColor: 'bg-[#2979FF]/10',
          activeBgColor: 'bg-[#2979FF]/25 border-[#2979FF]',
          glowColor: 'shadow-[0_0_12px_rgba(41,121,255,0.25)]',
        },
        {
          label: 'Peptide Calculator',
          path: '/research/calculators/peptide',
          icon: Calculator,
          color: 'text-[#00F0FF]',
          borderColor: 'border-[#00F0FF]/40 hover:border-[#00F0FF]',
          bgColor: 'bg-[#00F0FF]/10',
          activeBgColor: 'bg-[#00F0FF]/25 border-[#00F0FF]',
          glowColor: 'shadow-[0_0_12px_rgba(0,240,255,0.2)]',
        },
        {
          label: 'Peptide Cycle Calculator',
          path: '/research/cycle-calculator',
          icon: Syringe,
          color: 'text-[#FF2ED1]',
          borderColor: 'border-[#FF2ED1]/40 hover:border-[#FF2ED1]',
          bgColor: 'bg-[#FF2ED1]/10',
          activeBgColor: 'bg-[#FF2ED1]/25 border-[#FF2ED1]',
          glowColor: 'shadow-[0_0_12px_rgba(255,46,209,0.2)]',
        },
        {
          label: 'COA Library',
          path: '/research/coa-library',
          icon: FileText,
          color: 'text-[#FFB020]',
          borderColor: 'border-[#FFB020]/40 hover:border-[#FFB020]',
          bgColor: 'bg-[#FFB020]/10',
          activeBgColor: 'bg-[#FFB020]/25 border-[#FFB020]',
          glowColor: 'shadow-[0_0_12px_rgba(255,176,32,0.2)]',
        },
        {
          label: 'Protocol Library',
          path: '/research/protocol-library',
          icon: BookOpen,
          color: 'text-[#A855F7]',
          borderColor: 'border-[#8A2BE2]/40 hover:border-[#8A2BE2]',
          bgColor: 'bg-[#8A2BE2]/10',
          activeBgColor: 'bg-[#8A2BE2]/25 border-[#8A2BE2]',
          glowColor: 'shadow-[0_0_12px_rgba(138,43,226,0.2)]',
        },
        {
          label: 'Price List',
          path: '/research/price-list',
          icon: DollarSign,
          color: 'text-[#00E5A8]',
          borderColor: 'border-[#00E5A8]/40 hover:border-[#00E5A8]',
          bgColor: 'bg-[#00E5A8]/10',
          activeBgColor: 'bg-[#00E5A8]/25 border-[#00E5A8]',
          glowColor: 'shadow-[0_0_12px_rgba(0,229,168,0.2)]',
        },
      ],
    },
    {
      title: 'ORDERS',
      items: [
        {
          label: 'Order Tracker',
          path: '/order-tracker',
          icon: Truck,
          color: 'text-[#FFB020]',
          borderColor: 'border-[#FFB020]/50 hover:border-[#FFB020]',
          bgColor: 'bg-[#FFB020]/10',
          activeBgColor: 'bg-[#FFB020]/25 border-[#FFB020]',
          glowColor: 'shadow-[0_0_12px_rgba(255,176,32,0.25)]',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-80 sm:w-96 max-w-[90vw] bg-[#050810]/95 border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col h-full backdrop-blur-2xl z-50 transition-transform duration-300 ease-in-out">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0A0F1D]/80 flex-shrink-0">
          <div className="flex items-center space-x-3 group overflow-hidden">
            <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-[#00D9FF]/20 border border-[#00D9FF]/50 p-1 flex items-center justify-center shadow-[0_0_12px_rgba(0,217,255,0.3)] bg-[#050810] overflow-hidden">
              <SafeImage
                src={mobileLogoUrl}
                alt={brandName}
                fallbackSrc={BRANDING_ASSETS.logo}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
              <span className="font-bold text-[#00D9FF] text-base tracking-wide drop-shadow-[0_0_6px_rgba(0,217,255,0.4)] truncate">
                {brandName}
              </span>
              <span className="text-[10px] text-[#FF2ED1] font-mono tracking-widest uppercase mt-0.5 drop-shadow-[0_0_6px_rgba(255,46,209,0.4)] truncate">
                {brandSlogan}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00D9FF]/50 hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 custom-scrollbar">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2.5">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00D9FF]">
                  {section.title}
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#00D9FF]/30 to-transparent" />
              </div>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/'
                      ? location.pathname === '/'
                      : Boolean(item.path && location.pathname.startsWith(item.path));

                  return (
                    <Link
                      key={item.label}
                      to={item.path || '#'}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 group ${
                        isActive
                          ? `${item.activeBgColor} ${item.color} ${item.glowColor} font-bold`
                          : `${item.bgColor} ${item.borderColor} ${item.color} ${item.glowColor} hover:brightness-125 hover:-translate-x-0.5`
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${item.color} transition-transform group-hover:scale-110`} />
                      <span className="tracking-wide">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ACCOUNT SECTION */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00D9FF]">
                ACCOUNT
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-[#00D9FF]/30 to-transparent" />
            </div>

            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 group ${
                      location.pathname === '/account'
                        ? 'border-white bg-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.3)] font-bold'
                        : 'border-white/20 bg-white/5 text-white/90 hover:border-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <User className="w-5 h-5 flex-shrink-0 text-white transition-transform group-hover:scale-110" />
                    <span className="tracking-wide">My Account</span>
                  </Link>

                  <button
                    onClick={() => {
                      onClose();
                      openDrawer();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/10 text-[#00D9FF] hover:border-[#00D9FF] hover:bg-[#00D9FF]/20 text-sm font-semibold transition-all duration-200 cursor-pointer group shadow-[0_0_12px_rgba(0,217,255,0.15)]"
                  >
                    <div className="flex items-center gap-3.5">
                      <ShoppingBag className="w-5 h-5 flex-shrink-0 text-[#00D9FF] transition-transform group-hover:scale-110" />
                      <span className="tracking-wide">Shopping Cart</span>
                    </div>
                    {totalItemCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-mono font-bold text-black bg-[#00D9FF] rounded-full shadow-[0_0_8px_rgba(0,217,255,0.8)]">
                        {totalItemCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:border-red-500/60 hover:bg-red-500/20 text-sm font-semibold transition-all duration-200 cursor-pointer group"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0 text-red-400 transition-transform group-hover:scale-110" />
                    <span className="tracking-wide">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      openDrawer();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/10 text-[#00D9FF] hover:border-[#00D9FF] hover:bg-[#00D9FF]/20 text-sm font-semibold transition-all duration-200 cursor-pointer group shadow-[0_0_12px_rgba(0,217,255,0.15)]"
                  >
                    <div className="flex items-center gap-3.5">
                      <ShoppingBag className="w-5 h-5 flex-shrink-0 text-[#00D9FF] transition-transform group-hover:scale-110" />
                      <span className="tracking-wide">Shopping Cart</span>
                    </div>
                    {totalItemCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-mono font-bold text-black bg-[#00D9FF] rounded-full shadow-[0_0_8px_rgba(0,217,255,0.8)]">
                        {totalItemCount}
                      </span>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 py-3 px-3 text-xs font-semibold text-white bg-white/5 border border-white/20 rounded-xl hover:bg-white/15 transition-all"
                    >
                      <LogIn className="w-4 h-4 text-white" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold text-white bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] border border-[#00D9FF]/50 rounded-xl shadow-[0_0_12px_rgba(0,217,255,0.25)] hover:brightness-110 transition-all"
                    >
                      <UserPlus className="w-4 h-4 text-white" />
                      <span>Register</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ADMIN SECTION */}
          {canSeeAdminPortal && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00D9FF]">
                  ADMIN
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#00D9FF]/30 to-transparent" />
              </div>

              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 group ${
                  location.pathname.startsWith('/admin')
                    ? 'border-[#00D9FF] bg-[#00D9FF]/25 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.4)] font-bold'
                    : 'border-[#00D9FF]/50 bg-[#00D9FF]/10 text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.2)] hover:border-[#00D9FF] hover:bg-[#00D9FF]/20'
                }`}
              >
                <Zap className="w-5 h-5 flex-shrink-0 text-[#00D9FF] transition-transform group-hover:scale-110" />
                <span className="tracking-wide font-mono">Admin Portal</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer info inside Drawer */}
        <div className="p-4 border-t border-white/10 bg-[#0A0F1D]/80 flex-shrink-0 text-center">
          <p className="text-[11px] font-mono text-slate-400">
            {APP_CONFIG.name} Platform • Research Use Only
          </p>
        </div>
      </div>
    </div>
  );
};
