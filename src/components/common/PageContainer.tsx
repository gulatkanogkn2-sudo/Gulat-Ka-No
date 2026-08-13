import React, { useEffect } from 'react';
import { ResponsiveContainer } from '../layout/ResponsiveContainer';
import { APP_CONFIG } from '../../app/config';
import { systemSettingsService } from '../../services/systemSettingsService';
import { WebsiteManagerService } from '../../services/websiteManagerService';

export interface PageContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  children,
  actions,
  className = '',
  maxWidth = '7xl',
}) => {
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    const updateTitle = async () => {
      const websiteConfig = await WebsiteManagerService.getWebsiteConfig();
      const brandName = websiteConfig?.branding?.brandName;
      const browserTitle = websiteConfig?.branding?.browserTitle;
      const general = systemSettingsService.getSettings()?.general;
      const siteTitle = brandName || general?.websiteName || APP_CONFIG.name;
      
      if (title) {
        document.title = `${title} | ${siteTitle}`;
      } else {
        document.title = browserTitle || siteTitle;
      }
    };

    updateTitle();
    const unsubSystem = systemSettingsService.subscribe(updateTitle);
    const unsubWebsite = WebsiteManagerService.subscribeToConfigUpdates(() => {
      updateTitle();
    });

    return () => {
      unsubSystem();
      unsubWebsite();
    };
  }, [title]);

  return (
    <ResponsiveContainer maxWidth={maxWidth} className={`py-8 ${className}`}>
      {(title || description || actions) && (
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl font-sans">
                {title}
              </h1>
            )}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          {actions && <div className="flex items-center space-x-3">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </ResponsiveContainer>
  );
};
