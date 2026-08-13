export interface BrandingSettings {
  websiteLogo: string;
  adminLogo: string;
  mobileLogo: string;
  favicon: string;
  browserTitle: string;
  browserDescription: string;
  brandName: string;
  brandSlogan: string;
}

export interface HeroCTAButton {
  label: string;
  link: string;
  visible: boolean;
  variant: 'primary' | 'secondary' | 'outline';
}

export interface HeroSchedulingSettings {
  enabled: boolean;
  startDate: string;
  endDate: string;
}

export interface HeroSettings {
  heroImage: string;
  heroBackground: string;
  mainHeading: string;
  subtitle: string;
  ctaButton1: HeroCTAButton;
  ctaButton2: HeroCTAButton;
  isVisible: boolean;
  scheduling: HeroSchedulingSettings;
}

export interface AnnouncementBannerSettings {
  message: string;
  backgroundColor: string;
  textColor: string;
  startDate: string;
  endDate: string;
  isVisible: boolean;
  isDismissible: boolean;
}

export interface StoreCardSetting {
  id: string;
  storeKey: 'groupbuy' | 'onhand' | 'moq';
  image: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  buttonText: string;
  destination: string;
  isVisible: boolean;
}

export interface HomepageCardSetting {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badgeText: string;
  badgeColor: string;
  ctaText: string;
  ctaUrl: string;
  isVisible: boolean;
  sortOrder: number;
}

export interface ResearchHubSettings {
  image: string;
  heading: string;
  description: string;
  buttonText: string;
  destinationUrl: string;
  isVisible: boolean;
  featuresList: string[];
}

export interface NavMenuItem {
  id: string;
  label: string;
  path: string;
  sortOrder: number;
  isVisible: boolean;
  isExternal: boolean;
  openInNewTab: boolean;
  badgeText?: string;
}

export interface NavigationSettings {
  menuItems: NavMenuItem[];
}

export interface SocialLinkItem {
  platform: 'twitter' | 'telegram' | 'discord' | 'instagram' | 'github' | 'linkedin' | 'youtube';
  label: string;
  url: string;
  isVisible: boolean;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
  isVisible: boolean;
}

export interface FooterLinkColumn {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

export interface FooterSettings {
  footerLogo: string;
  copyrightText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: SocialLinkItem[];
  linkColumns: FooterLinkColumn[];
}

export interface SEOSettings {
  metaTitleTemplate: string;
  defaultMetaDescription: string;
  ogImage: string;
  keywords: string[];
  googleAnalyticsId: string;
  robotsTxtContent: string;
}

export interface WebsiteConfig {
  branding: BrandingSettings;
  hero: HeroSettings;
  announcement: AnnouncementBannerSettings;
  storeCards: StoreCardSetting[];
  homepageCards: HomepageCardSetting[];
  researchHub: ResearchHubSettings;
  navigation: NavigationSettings;
  footer: FooterSettings;
  seo: SEOSettings;
  draftVersion: number;
  isPublished: boolean;
  lastModifiedAt: string;
  lastModifiedBy: string;
  publishedAt: string | null;
}
