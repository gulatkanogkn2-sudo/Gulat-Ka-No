import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../app/config';
import { staticPagesService, StaticPage } from '../../services/staticPagesService';
import { systemSettingsService } from '../../services/systemSettingsService';

// Footer description text (set to empty string to hide underneath branding)
const FOOTER_DESCRIPTION = "";

export const CustomerFooter: React.FC = () => {
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const [brandName, setBrandName] = useState(() => systemSettingsService.getSettings()?.general?.brandName || APP_CONFIG.name);
  const [companyName, setCompanyName] = useState(() => systemSettingsService.getSettings()?.general?.companyName || APP_CONFIG.name);

  useEffect(() => {
    const unsubscribePages = staticPagesService.subscribe((pages) => {
      setStaticPages(pages.filter((p) => p.status !== 'Hidden'));
    });

    const unsubscribeSys = systemSettingsService.subscribe((sys) => {
      if (sys.general?.brandName) setBrandName(sys.general.brandName);
      if (sys.general?.companyName) setCompanyName(sys.general.companyName);
    });

    return () => {
      unsubscribePages();
      unsubscribeSys();
    };
  }, []);

  const supportPages = staticPages.filter((p) => p.category === 'Support');
  const companyPages = staticPages.filter((p) => p.category === 'Company');

  return (
    <footer className="bg-transparent border-t border-[#00D9FF]/20 py-12 mt-16 relative z-10 text-slate-400">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D9FF]/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10">
          {/* Brand & Overview */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex flex-col">
              <span className="font-black italic text-[#00D9FF] text-3xl drop-shadow-[0_0_10px_rgba(0,217,255,0.5)] tracking-tight">
                {brandName}
              </span>
              <span className="text-[10px] text-[#FF2ED1] font-mono tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,46,209,0.4)]">
                {APP_CONFIG.tagline}
              </span>
            </div>
            {FOOTER_DESCRIPTION && (
              <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
                {FOOTER_DESCRIPTION}
              </p>
            )}
          </div>

          {/* STORE */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              STORE
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li>
                <Link to="/groupbuy" className="hover:text-white transition-colors">GroupBuy</Link>
              </li>
              <li>
                <Link to="/onhand" className="hover:text-white transition-colors">OnHand</Link>
              </li>
              <li>
                <Link to="/moq" className="hover:text-white transition-colors">MOQ</Link>
              </li>
              <li>
                <Link to="/order-tracker" className="hover:text-white transition-colors">Order Tracker</Link>
              </li>
            </ul>
          </div>

          {/* RESEARCH */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              RESEARCH
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li>
                <Link to="/research/calculators" className="hover:text-white transition-colors">Calculators</Link>
              </li>
              <li>
                <Link to="/research/coa-library" className="hover:text-white transition-colors">COA Library</Link>
              </li>
              <li>
                <Link to="/research/protocol-library" className="hover:text-white transition-colors">Protocol Library</Link>
              </li>
              <li>
                <Link to="/research/price-list" className="hover:text-white transition-colors">Price List</Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              SUPPORT
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              {supportPages.map((page) => (
                <li key={page.id}>
                  <Link to={`/${page.slug}`} className="hover:text-white transition-colors">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              COMPANY
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              {companyPages.map((page) => (
                <li key={page.id}>
                  <Link to={`/${page.slug}`} className="hover:text-white transition-colors">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Legal */}
        <div className="pt-6 mt-4 border-t border-white/5 flex flex-col items-center justify-center text-xs">
          <p className="text-slate-500 font-mono text-[11px] mb-2">
            Â© {new Date().getFullYear()} {companyName} ({brandName}). All rights reserved.
          </p>
          <div className="w-[100px] h-[3px] bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent mt-2 rounded-full opacity-50"></div>
        </div>
      </div>
    </footer>
  );
};

