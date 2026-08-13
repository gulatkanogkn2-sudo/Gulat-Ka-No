import { BRANDING_ASSETS } from '../assets/branding';
import {
  WebsiteConfig,
  BrandingSettings,
  HeroSettings,
  AnnouncementBannerSettings,
  StoreCardSetting,
  HomepageCardSetting,
  ResearchHubSettings,
  NavMenuItem,
  FooterSettings,
  SEOSettings,
} from '../types/websiteManager';

const STORAGE_KEY = 'gkn_website_manager_config_v2';

export const DEFAULT_WEBSITE_CONFIG: WebsiteConfig = {
  branding: {
    websiteLogo: BRANDING_ASSETS.logo,
    adminLogo: BRANDING_ASSETS.logo,
    mobileLogo: BRANDING_ASSETS.logo,
    favicon: '/favicon.ico',
    browserTitle: 'GKN V2 — High Purity Laboratory Research Peptides & Analytics',
    browserDescription: 'Premier laboratory peptide procurement platform supporting GroupBuy batches, OnHand immediate dispatch, and volume MOQ sourcing.',
    brandName: 'GKN V2',
    brandSlogan: 'Gulat Ka No!!? Scientific Excellence & Verified Purity',
  },
  hero: {
    heroImage: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
    heroBackground: 'cyber-dark-grid',
    mainHeading: 'NEXT-GENERATION RESEARCH PEPTIDES & ANALYTICAL PURITY',
    subtitle: 'Direct laboratory access to verified research compounds, multi-laboratory COA validation, and transparent batch tracking.',
    ctaButton1: {
      label: 'Explore GroupBuy Batches',
      link: '/groupbuy',
      visible: true,
      variant: 'primary',
    },
    ctaButton2: {
      label: 'OnHand Direct Dispatch',
      link: '/onhand',
      visible: true,
      variant: 'secondary',
    },
    isVisible: true,
    scheduling: {
      enabled: false,
      startDate: '2026-08-01T00:00:00.000Z',
      endDate: '2026-12-31T23:59:59.000Z',
    },
  },
  announcement: {
    message: '🔬 LAB FLASH: BPC-157 & TB-500 Batch #9844 Test Reports Verified at 99.85% Purity. Free Express Shipping on orders over $300.',
    backgroundColor: '#0F172A',
    textColor: '#00D9FF',
    startDate: '2026-08-01T00:00:00.000Z',
    endDate: '2026-09-01T23:59:59.000Z',
    isVisible: true,
    isDismissible: true,
  },
  storeCards: [
    {
      id: 'sc-groupbuy',
      storeKey: 'groupbuy',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      title: 'GroupBuy Sourcing',
      subtitle: 'Crowdsourced Batch Savings',
      description: 'Join community research pools to unlock factory-direct wholesale pricing on large-volume synthesis batches.',
      accentColor: '#00D9FF',
      buttonText: 'Join GroupBuy Pool',
      destination: '/groupbuy',
      isVisible: true,
    },
    {
      id: 'sc-onhand',
      storeKey: 'onhand',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      title: 'OnHand Vault',
      subtitle: 'Immediate Express Dispatch',
      description: 'Pre-stocked inventory ready for dispatch from domestic facilities.',
      accentColor: '#10B981',
      buttonText: 'Shop OnHand Items',
      destination: '/onhand',
      isVisible: true,
    },
    {
      id: 'sc-moq',
      storeKey: 'moq',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
      title: 'MOQ Bulk Sourcing',
      subtitle: 'Institutional & Lab Volume',
      description: 'Custom contract manufacturing, custom lyophilization vials, and bulk wholesale tiers for institutions.',
      accentColor: '#A855F7',
      buttonText: 'View MOQ Tiers',
      destination: '/moq',
      isVisible: true,
    },
  ],
  homepageCards: [
    {
      id: 'hpc-coa',
      title: 'Third-Party Analytical COA Library',
      subtitle: 'Analytical Quality & Verification',
      description: 'Access complete raw data files, NMR spectral scans, and independent lab certifications for every batch.',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      badgeText: 'VERIFIED 99%+',
      badgeColor: '#00D9FF',
      ctaText: 'Search COA Records',
      ctaUrl: '/research/coa-library',
      isVisible: true,
      sortOrder: 1,
    },
    {
      id: 'hpc-calc',
      title: 'Precision Reconstitution Calculator',
      subtitle: 'Sub-microgram Dosing & Solvent Math',
      description: 'Interactive laboratory tool for calculating reconstitution volumes, syringe graduations, and storage stability.',
      image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
      badgeText: 'INTERACTIVE TOOL',
      badgeColor: '#EC4899',
      ctaText: 'Open Calculator',
      ctaUrl: '/research/calculators/peptide',
      isVisible: true,
      sortOrder: 2,
    },
  ],
  researchHub: {
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
    heading: 'GKN Scientific Knowledge Base & Protocol Index',
    description: 'Comprehensive technical documentation, storage protocols, stability testing analysis, and reference guide library.',
    buttonText: 'Explore Research Hub',
    destinationUrl: '/research',
    isVisible: true,
    featuresList: [
      'Independent 3rd-Party Lab Verification (Janoshik & Chromate)',
      'Lyophilized Storage & Temperature Stability Matrix',
      'HPLC & Mass Spectrometry Interactive Viewer',
      'Protocol Dosing & Diluent Safety Standards',
    ],
  },
  navigation: {
    menuItems: [
      { id: 'nav-1', label: 'Home', path: '/', sortOrder: 1, isVisible: true, isExternal: false, openInNewTab: false },
      { id: 'nav-2', label: 'GroupBuy', path: '/groupbuy', sortOrder: 2, isVisible: true, isExternal: false, openInNewTab: false, badgeText: 'Batch' },
      { id: 'nav-3', label: 'OnHand', path: '/onhand', sortOrder: 3, isVisible: true, isExternal: false, openInNewTab: false, badgeText: 'Ready' },
      { id: 'nav-4', label: 'MOQ', path: '/moq', sortOrder: 4, isVisible: true, isExternal: false, openInNewTab: false, badgeText: 'Volume' },
      { id: 'nav-5', label: 'Order Tracker', path: '/order-tracker', sortOrder: 5, isVisible: true, isExternal: false, openInNewTab: false },
      { id: 'nav-6', label: 'Research Hub', path: '/research', sortOrder: 6, isVisible: true, isExternal: false, openInNewTab: false },
    ],
  },
  footer: {
    footerLogo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80',
    copyrightText: '© 2026 GKN V2 Laboratory Sourcing Platform. All rights reserved. For research purposes only.',
    contactEmail: 'support@gkn.research',
    contactPhone: '+1 (800) 555-4567',
    address: 'Building 4B, BioTech Science Park, Silicon Corridor, CA 94025',
    socialLinks: [
      { platform: 'telegram', label: 'Telegram Community', url: 'https://t.me/gkn_research', isVisible: true },
      { platform: 'twitter', label: 'Twitter / X', url: 'https://x.com/gkn_research', isVisible: true },
      { platform: 'discord', label: 'Discord Server', url: 'https://discord.gg/gkn_research', isVisible: true },
      { platform: 'github', label: 'GitHub Docs', url: 'https://github.com/gkn-research', isVisible: false },
    ],
    linkColumns: [
      {
        id: 'fc-1',
        title: 'Storefront',
        links: [
          { id: 'fl-1', label: 'GroupBuy Sourcing', url: '/groupbuy', isVisible: true },
          { id: 'fl-2', label: 'OnHand Fast Shipping', url: '/onhand', isVisible: true },
          { id: 'fl-3', label: 'MOQ Wholesale Tiers', url: '/moq', isVisible: true },
          { id: 'fl-4', label: 'Order Tracking', url: '/order-tracker', isVisible: true },
        ],
      },
      {
        id: 'fc-2',
        title: 'Research & Tools',
        links: [
          { id: 'fl-5', label: 'Peptide Calculators', url: '/research/calculators/peptide', isVisible: true },
          { id: 'fl-6', label: 'COA Certificate Library', url: '/research/coa-library', isVisible: true },
          { id: 'fl-7', label: 'Protocol Guides', url: '/research/protocol-library', isVisible: true },
          { id: 'fl-8', label: 'Price List', url: '/research/price-list', isVisible: true },
        ],
      },
      {
        id: 'fc-3',
        title: 'Policies & Safety',
        links: [
          { id: 'fl-9', label: 'Terms of Service', url: '/terms', isVisible: true },
          { id: 'fl-10', label: 'Privacy Policy', url: '/privacy', isVisible: true },
          { id: 'fl-11', label: 'Shipping Policy', url: '/shipping', isVisible: true },
          { id: 'fl-12', label: 'Research Disclaimer', url: '/disclaimer', isVisible: true },
        ],
      },
    ],
  },
  seo: {
    metaTitleTemplate: '%s | GKN V2 Laboratory Research Peptides',
    defaultMetaDescription: 'GKN V2 is the premier source for HPLC-certified research peptides, offering GroupBuy batch pools, OnHand cold-chain dispatch, and institutional MOQ bulk sourcing.',
    ogImage: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
    keywords: ['peptides', 'research chemicals', 'GroupBuy', 'HPLC verified', 'BPC-157', 'TB-500', 'Semaglutide', 'Tirzepatide'],
    googleAnalyticsId: 'G-GKNV2RESEARCH99',
    robotsTxtContent: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /checkout/\nSitemap: https://gkn.research/sitemap.xml',
  },
  draftVersion: 1,
  isPublished: true,
  lastModifiedAt: new Date().toISOString(),
  lastModifiedBy: 'Super Admin',
  publishedAt: new Date().toISOString(),
};

type ConfigListener = (config: WebsiteConfig) => void;
const listeners: Set<ConfigListener> = new Set();

const notifyListeners = (config: WebsiteConfig) => {
  listeners.forEach((cb) => cb(config));
};

export class WebsiteManagerService {
  private static currentConfig: WebsiteConfig | null = null;

  /**
   * Get current website configuration (from cache or defaults)
   */
  public static async getWebsiteConfig(): Promise<WebsiteConfig> {
    if (this.currentConfig) {
      return { ...this.currentConfig };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.currentConfig = { ...DEFAULT_WEBSITE_CONFIG, ...parsed };
      } else {
        this.currentConfig = { ...DEFAULT_WEBSITE_CONFIG };
      }
    } catch (e) {
      console.warn('Failed to parse saved website manager config:', e);
      this.currentConfig = { ...DEFAULT_WEBSITE_CONFIG };
    }

    return { ...this.currentConfig! };
  }

  /**
   * Internal draft save & update listener caller
   */
  private static async saveConfig(updated: WebsiteConfig): Promise<WebsiteConfig> {
    updated.lastModifiedAt = new Date().toISOString();
    updated.draftVersion += 1;
    this.currentConfig = updated;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write error in WebsiteManagerService:', e);
    }

    notifyListeners({ ...updated });
    return { ...updated };
  }

  public static async updateBranding(branding: Partial<BrandingSettings>): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.branding = { ...config.branding, ...branding };
    config.isPublished = false;
    return this.saveConfig(config);
  }

  public static async updateHero(hero: Partial<HeroSettings>): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.hero = { ...config.hero, ...hero };
    config.isPublished = false;
    return this.saveConfig(config);
  }

  public static async updateAnnouncementBar(
    announcement: Partial<AnnouncementBannerSettings>
  ): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.announcement = { ...config.announcement, ...announcement };
    config.isPublished = false;
    return this.saveConfig(config);
  }

  public static async updateStoreCards(storeCards: StoreCardSetting[]): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.storeCards = [...storeCards];
    config.isPublished = false;
    return this.saveConfig(config);
  }

  public static async updateHomepageCards(
    homepageCards: HomepageCardSetting[]
  ): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.homepageCards = [...homepageCards];
    config.isPublished = false;
    return this.saveConfig(config);
  }

  public static async updateResearchHub(
    researchHub: Partial<ResearchHubSettings>
  ): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.researchHub = { ...config.researchHub, ...researchHub };
    config.isPublished = false;
    return this.saveConfig(config);
  }

  public static async updateNavigation(menuItems: NavMenuItem[]): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.navigation = { menuItems: [...menuItems] };
    config.isPublished = false;
    return this.saveConfig(config);
  }

  public static async updateFooter(footer: Partial<FooterSettings>): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.footer = { ...config.footer, ...footer };
    config.isPublished = false;
    return this.saveConfig(config);
  }

  public static async updateSEO(seo: Partial<SEOSettings>): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.seo = { ...config.seo, ...seo };
    config.isPublished = false;
    return this.saveConfig(config);
  }

  /**
   * Publish current draft configuration to live site
   */
  public static async publishConfig(): Promise<WebsiteConfig> {
    const config = await this.getWebsiteConfig();
    config.isPublished = true;
    config.publishedAt = new Date().toISOString();
    return this.saveConfig(config);
  }

  /**
   * Discard draft changes and reset to defaults
   */
  public static async resetToDefaults(): Promise<WebsiteConfig> {
    this.currentConfig = { ...DEFAULT_WEBSITE_CONFIG, publishedAt: new Date().toISOString() };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    notifyListeners({ ...this.currentConfig });
    return { ...this.currentConfig };
  }

  /**
   * Export config as JSON string
   */
  public static exportConfigJson(config: WebsiteConfig): string {
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import config from JSON string
   */
  public static async importConfigJson(jsonStr: string): Promise<WebsiteConfig> {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.branding || !parsed.hero) {
      throw new Error('Invalid WebsiteConfig JSON format. Missing required fields.');
    }
    const updated = { ...DEFAULT_WEBSITE_CONFIG, ...parsed, isPublished: false };
    return this.saveConfig(updated);
  }

  /**
   * Subscribe to live updates (for live preview panel)
   */
  public static subscribeToConfigUpdates(callback: ConfigListener): () => void {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }
}
