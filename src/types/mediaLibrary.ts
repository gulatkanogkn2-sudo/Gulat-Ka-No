export type MediaCategory =
  | 'Website'
  | 'Products'
  | 'Research'
  | 'COA'
  | 'Protocols'
  | 'Calculator Assets'
  | 'Homepage'
  | 'Hero Images'
  | 'Store Cards'
  | 'Logos'
  | 'Icons'
  | 'QR Codes'
  | 'Payment Assets'
  | 'Documents'
  | 'Other';

export type SupportedFileType =
  | 'JPG'
  | 'JPEG'
  | 'PNG'
  | 'WEBP'
  | 'SVG'
  | 'PDF'
  | 'DOCX'
  | 'XLSX'
  | 'ZIP'
  | 'ICO'
  | 'MP4 (Disabled)';

export type MediaVisibility = 'PUBLIC' | 'RESTRICTED' | 'ADMIN_ONLY';

export interface AssetUsageReference {
  id: string;
  moduleName: string; // e.g. "Website Manager", "Product Management", "COA Library", etc.
  locationName: string; // e.g. "Homepage Hero Banner", "Semaglutide 10mg Vial", "GC-MS Report Batch 98"
  entityId?: string;
  entityName?: string;
}

export interface MediaAssetItem {
  id: string;
  name: string;
  title: string;
  category: MediaCategory;
  fileType: SupportedFileType;
  mimeType: string;
  url: string;
  storagePath: string; // Abstracted path for Supabase Storage, e.g. "supabase://storage/gkn-media/heroes/cleanroom.png"
  dimensions: string; // e.g., "1920x1080 px" or "N/A"
  resolution: string; // e.g., "300 DPI", "72 DPI", "N/A"
  fileSize: string; // e.g., "420 KB"
  fileSizeBytes: number;
  uploadDate: string; // ISO or formatted date "YYYY-MM-DD"
  uploadedBy: string; // e.g., "Admin Lead (GKN System)"
  visibility: MediaVisibility;
  isArchived: boolean;
  tags: string[];
  description: string;
  altText: string;
  seoTitle: string;
  seoDescription: string;
  usageCount: number;
  usageReferences: AssetUsageReference[];
}

export interface MediaFilterOptions {
  search?: string;
  category?: MediaCategory | 'ALL';
  fileType?: SupportedFileType | 'ALL' | 'IMAGE' | 'DOCUMENT';
  dateFilter?: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR';
  visibility?: MediaVisibility | 'ALL';
  isArchived?: boolean;
  sortBy?: 'name' | 'uploadDate' | 'fileSizeBytes' | 'usageCount' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export interface MediaStats {
  totalAssets: number;
  imagesCount: number;
  documentsCount: number;
  pdfsCount: number;
  logosCount: number;
  iconsCount: number;
  coasCount: number;
  researchAssetsCount: number;
  productAssetsCount: number;
  websiteAssetsCount: number;
  storageUsageBytes: number;
  storageUsageFormatted: string;
  recentUploadsCount: number;
}

export type MediaViewMode = 'table' | 'grid' | 'largeGrid';

export type ExportFormat = 'csv' | 'excel' | 'sheets';
