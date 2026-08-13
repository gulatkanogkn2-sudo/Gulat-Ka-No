import { BrandingSettings } from '../types/websiteManager';
import { WebsiteManagerService } from '../services/websiteManagerService';

/**
 * Updates browser favicon, apple-touch-icon, document title, and meta description
 * dynamically based on current WebsiteManager branding configuration.
 */
export function applyDynamicBranding(branding?: Partial<BrandingSettings>): void {
  if (typeof document === 'undefined') return;

  const brandName = branding?.brandName || 'GKN V2';
  const browserTitle = branding?.browserTitle || `${brandName} — Premium Peptide Research & Ordering Portal`;
  const faviconUrl = branding?.favicon || '/gkn-logo.svg';
  const description = branding?.browserDescription;

  // 1. Update Document Title
  if (browserTitle) {
    document.title = browserTitle;
  }

  // 2. Update or Inject Favicon Link
  if (faviconUrl) {
    let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = faviconUrl;

    if (faviconUrl.endsWith('.svg')) {
      faviconLink.type = 'image/svg+xml';
    } else if (faviconUrl.endsWith('.png')) {
      faviconLink.type = 'image/png';
    } else if (faviconUrl.endsWith('.ico')) {
      faviconLink.type = 'image/x-icon';
    } else {
      faviconLink.removeAttribute('type');
    }

    // 3. Update Apple Touch Icon
    let appleTouchLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
    if (!appleTouchLink) {
      appleTouchLink = document.createElement('link');
      appleTouchLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleTouchLink);
    }
    appleTouchLink.href = faviconUrl;
  }

  // 4. Update Meta Description if present
  if (description) {
    let metaDesc = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
  }
}

/**
 * Initializes dynamic branding lifecycle listener for the whole application.
 * Automatically synchronizes on load and whenever WebsiteConfig changes.
 */
export function initDynamicBranding(): () => void {
  WebsiteManagerService.getWebsiteConfig().then((config) => {
    if (config?.branding) {
      applyDynamicBranding(config.branding);
    }
  });

  const unsubscribe = WebsiteManagerService.subscribeToConfigUpdates((config) => {
    if (config?.branding) {
      applyDynamicBranding(config.branding);
    }
  });

  return unsubscribe;
}
