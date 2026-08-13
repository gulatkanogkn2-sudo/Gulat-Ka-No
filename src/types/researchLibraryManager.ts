export type LibraryItemStatus = 'VERIFIED' | 'PENDING' | 'ARCHIVED';
export type LibraryItemVisibility = 'PUBLIC' | 'RESTRICTED' | 'HIDDEN';

export interface COAVersionRecord {
  id: string;
  version: string;
  date: string;
  updatedBy: string;
  changeNote: string;
  pdfUrl?: string;
  chromatogramImageUrl?: string;
}

export interface COARecordAdmin {
  id: string;
  product: string;
  variant: string;
  laboratory: string;
  lotNumber: string;
  purity: number; // e.g. 99.82
  testDate: string;
  expirationDate: string;
  pdfUrl: string;
  chromatogramImageUrl: string;
  status: LibraryItemStatus;
  visibility: LibraryItemVisibility;
  tags: string[];
  searchKeywords: string[];
  versionHistory: COAVersionRecord[];
  updatedAt: string;
}

export type ProtocolCategory =
  | 'Storage & Handling'
  | 'Reconstitution'
  | 'Assay Standards'
  | 'Stability & Half-Life'
  | 'Safety Guidelines';

export interface ProtocolRecordAdmin {
  id: string;
  title: string;
  category: ProtocolCategory;
  description: string;
  procedure: string;
  storageInstructions: string;
  safetyNotes: string;
  visibility: LibraryItemVisibility;
  featured: boolean;
  sortOrder: number;
  pdfUrl?: string;
  updatedAt: string;
}

export interface CalculatorContentAdmin {
  id: string;
  title: string;
  description: string;
  defaultValues: Record<string, number | string>;
  unitLabels: Record<string, string>;
  educationalInfo: string;
  helpText: string;
  visibility: 'PUBLIC' | 'HIDDEN';
  updatedAt: string;
}

export interface PriceListItemAdmin {
  id: string;
  product: string;
  variant: string;
  usdPrice: number;
  phpPrice: number;
  category: 'GroupBuy' | 'OnHand' | 'MOQ Bulk';
  visibility: 'PUBLIC' | 'HIDDEN';
  featured: boolean;
  updatedAt: string;
}

export interface FeatureCardAdmin {
  id: string;
  title: string;
  description: string;
  iconName: string;
  linkUrl: string;
  sortOrder: number;
  visibility: 'PUBLIC' | 'HIDDEN';
}

export interface CategoryCardAdmin {
  id: string;
  name: string;
  description: string;
  countText: string;
  iconName: string;
  targetUrl?: string;
  visibility?: 'PUBLIC' | 'HIDDEN';
}

export interface FeaturedArticleAdmin {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  readTime: string;
  date: string;
  imageUrl: string;
  articleUrl: string;
  featured?: boolean;
  visibility: 'PUBLIC' | 'HIDDEN';
}

export interface QuickLinkAdmin {
  id: string;
  title: string;
  url: string;
  badge?: string;
  visibility?: 'PUBLIC' | 'HIDDEN';
}

export interface RepositoryUpdateAdmin {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  targetUrl?: string;
  badgeColor?: 'cyan' | 'purple' | 'emerald' | 'amber';
  visibility: 'PUBLIC' | 'HIDDEN';
}

export interface ResearchHubHomepageAdmin {
  heroSection: {
    title: string;
    subtitle: string;
    bannerImageUrl: string;
    ctaText: string;
    ctaUrl?: string;
    visibility: 'PUBLIC' | 'HIDDEN';
  };
  featureCards: FeatureCardAdmin[];
  categories: CategoryCardAdmin[];
  featuredArticles: FeaturedArticleAdmin[];
  quickLinks: QuickLinkAdmin[];
  repositoryUpdates?: RepositoryUpdateAdmin[];
  updatedAt: string;
}

export interface GlobalSearchMatch {
  id: string;
  type: 'COA' | 'PROTOCOL' | 'PRICELIST' | 'ARTICLE';
  title: string;
  subtitle: string;
  tags: string[];
  linkTab: string;
}

export type BulkActionType = 'PUBLISH' | 'HIDE' | 'DELETE' | 'EXPORT';
export type ExportFormat = 'csv' | 'excel' | 'sheets';
