import {
  MediaAssetItem,
  MediaCategory,
  MediaFilterOptions,
  MediaStats,
  AssetUsageReference,
  ExportFormat,
  SupportedFileType,
} from '../types/mediaLibrary';

const STORAGE_KEY = 'gkn_media_library_v2';

export const INITIAL_MEDIA_ASSETS: MediaAssetItem[] = [
  {
    id: 'med-logo-01',
    name: 'gkn-cyan-flask-logo.png',
    title: 'GKN Cyan Lab Flask Logo (Default)',
    category: 'Logos',
    fileType: 'PNG',
    mimeType: 'image/png',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80',
    storagePath: 'supabase://storage/gkn-media/logos/gkn-cyan-flask-logo.png',
    dimensions: '400x400 px',
    resolution: '300 DPI',
    fileSize: '42 KB',
    fileSizeBytes: 43008,
    uploadDate: '2026-08-01',
    uploadedBy: 'Admin Lead (GKN System)',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['logo', 'branding', 'cyan', 'flask', 'vector'],
    description: 'Primary vector cyan flask logo used across main application header and navigation.',
    altText: 'GKN Cyan Laboratory Flask Logo',
    seoTitle: 'GKN Official Cyan Laboratory Logo Asset',
    seoDescription: 'High resolution vector emblem logo for GKN Scientific Procurement.',
    usageCount: 3,
    usageReferences: [
      { id: 'ref-1', moduleName: 'Website Manager', locationName: 'Main Navigation Header Logo' },
      { id: 'ref-2', moduleName: 'Website Manager', locationName: 'Mobile Navigation Drawer Logo' },
      { id: 'ref-3', moduleName: 'Admin Settings', locationName: 'Admin Workspace Branding Logo' },
    ],
  },
  {
    id: 'med-logo-02',
    name: 'gkn-dark-minimal-emblem.png',
    title: 'GKN Dark Minimal Vector Emblem',
    category: 'Logos',
    fileType: 'PNG',
    mimeType: 'image/png',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    storagePath: 'supabase://storage/gkn-media/logos/gkn-dark-minimal-emblem.png',
    dimensions: '512x512 px',
    resolution: '300 DPI',
    fileSize: '58 KB',
    fileSizeBytes: 59392,
    uploadDate: '2026-08-02',
    uploadedBy: 'Admin Lead (GKN System)',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['logo', 'admin', 'vector', 'dark', 'monochrome'],
    description: 'Dark-mode specialized emblem for admin footer and certification badges.',
    altText: 'GKN Dark Minimal Vector Emblem',
    seoTitle: 'GKN Dark Mode Emblem Asset',
    seoDescription: 'Monochrome dark laboratory emblem for admin branding.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-4', moduleName: 'Website Manager', locationName: 'Footer Branding Emblem' },
    ],
  },
  {
    id: 'med-hero-01',
    name: 'cyberpunk-cleanroom-synthesizer.jpg',
    title: 'Cyberpunk Cleanroom Automated Synthesizer',
    category: 'Hero Images',
    fileType: 'JPG',
    mimeType: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
    storagePath: 'supabase://storage/gkn-media/hero/cyberpunk-cleanroom-synthesizer.jpg',
    dimensions: '1920x1080 px',
    resolution: '72 DPI',
    fileSize: '420 KB',
    fileSizeBytes: 430080,
    uploadDate: '2026-08-01',
    uploadedBy: 'Admin Lead (GKN System)',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['hero', 'lab', 'synthesizer', 'blue', 'homepage'],
    description: 'Primary homepage hero background showcasing automated peptide synthesis robotics.',
    altText: 'Automated peptide synthesis cleanroom equipment with neon cyan illumination',
    seoTitle: 'GKN Homepage Hero Banner — Automated Cleanroom',
    seoDescription: 'High purity peptide synthesis laboratory background asset.',
    usageCount: 2,
    usageReferences: [
      { id: 'ref-5', moduleName: 'Website Manager', locationName: 'Homepage Hero Banner Background' },
      { id: 'ref-6', moduleName: 'Research Hub', locationName: 'Research Hub Header Banner' },
    ],
  },
  {
    id: 'med-hero-02',
    name: 'precision-micro-pipetting.jpg',
    title: 'Precision Micro-pipetting Analytical Bench',
    category: 'Hero Images',
    fileType: 'JPG',
    mimeType: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    storagePath: 'supabase://storage/gkn-media/hero/precision-micro-pipetting.jpg',
    dimensions: '1920x1080 px',
    resolution: '72 DPI',
    fileSize: '380 KB',
    fileSizeBytes: 389120,
    uploadDate: '2026-08-03',
    uploadedBy: 'Research Admin',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['hero', 'pipette', 'analytical', 'research'],
    description: 'Analytical bench setup with precision volumetric micro-pipetting.',
    altText: 'Analytical laboratory technician using high precision pipette',
    seoTitle: 'GKN Analytical Pipetting Asset',
    seoDescription: 'Research laboratory analytical bench background image.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-7', moduleName: 'Protocol Library', locationName: 'Technical Protocol Header Illustration' },
    ],
  },
  {
    id: 'med-store-01',
    name: 'groupbuy-vials-batch-pool.jpg',
    title: 'GroupBuy Batch Synthesis Vials Pool',
    category: 'Store Cards',
    fileType: 'JPG',
    mimeType: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/store/groupbuy-vials-batch-pool.jpg',
    dimensions: '800x600 px',
    resolution: '72 DPI',
    fileSize: '180 KB',
    fileSizeBytes: 184320,
    uploadDate: '2026-08-01',
    uploadedBy: 'Admin Lead (GKN System)',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['groupbuy', 'store', 'vials', 'cyan', 'card'],
    description: 'Store card thumbnail representing GroupBuy pooled batch synthesis.',
    altText: 'Vials of research peptides pooled for GroupBuy distribution',
    seoTitle: 'GKN GroupBuy Store Card Thumbnail',
    seoDescription: 'GroupBuy crowdsourced synthesis batch store card graphic.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-8', moduleName: 'Website Manager', locationName: 'GroupBuy Homepage Store Card' },
    ],
  },
  {
    id: 'med-store-02',
    name: 'onhand-cryo-vault-cold-pack.jpg',
    title: 'OnHand Cryo-Vault Cold Storage Pack',
    category: 'Store Cards',
    fileType: 'JPG',
    mimeType: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/store/onhand-cryo-vault-cold-pack.jpg',
    dimensions: '800x600 px',
    resolution: '72 DPI',
    fileSize: '195 KB',
    fileSizeBytes: 199680,
    uploadDate: '2026-08-01',
    uploadedBy: 'Admin Lead (GKN System)',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['onhand', 'store', 'vault', 'emerald', 'cold-chain'],
    description: 'Store card graphic for OnHand climate-controlled inventory ready for immediate dispatch.',
    altText: 'Cold storage cryo vault containing ready-to-ship peptide vials',
    seoTitle: 'GKN OnHand Cold Vault Store Card',
    seoDescription: 'OnHand cryo vault inventory store card graphic.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-9', moduleName: 'Website Manager', locationName: 'OnHand Homepage Store Card' },
    ],
  },
  {
    id: 'med-store-03',
    name: 'institutional-moq-bulk-cartons.jpg',
    title: 'Institutional Bulk MOQ Sealed Cartons',
    category: 'Store Cards',
    fileType: 'JPG',
    mimeType: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/store/institutional-moq-bulk-cartons.jpg',
    dimensions: '800x600 px',
    resolution: '72 DPI',
    fileSize: '210 KB',
    fileSizeBytes: 215040,
    uploadDate: '2026-08-01',
    uploadedBy: 'Admin Lead (GKN System)',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['moq', 'store', 'bulk', 'purple', 'institutional'],
    description: 'Store card graphic for institutional bulk MOQ procurement tiers.',
    altText: 'Bulk sealed cartons for institutional laboratory orders',
    seoTitle: 'GKN MOQ Bulk Sourcing Store Card',
    seoDescription: 'Institutional MOQ bulk sourcing store card graphic.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-10', moduleName: 'Website Manager', locationName: 'MOQ Bulk Homepage Store Card' },
    ],
  },
  {
    id: 'med-prod-01',
    name: 'semaglutide-10mg-vial-kit.webp',
    title: 'Semaglutide 10mg Vial (10-Pack Kit)',
    category: 'Products',
    fileType: 'WEBP',
    mimeType: 'image/webp',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/products/semaglutide-10mg-vial-kit.webp',
    dimensions: '1000x1000 px',
    resolution: '300 DPI',
    fileSize: '125 KB',
    fileSizeBytes: 128000,
    uploadDate: '2026-08-04',
    uploadedBy: 'Product Manager',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['semaglutide', 'product', 'vial', '10mg', 'glp-1'],
    description: 'High resolution product packaging photo for Semaglutide 10mg 10-pack kit.',
    altText: 'Semaglutide 10mg lyophilized vial kit in sealed box',
    seoTitle: 'Semaglutide 10mg Research Vial Product Photo',
    seoDescription: 'Product photograph of Semaglutide 10mg research reference standard.',
    usageCount: 2,
    usageReferences: [
      { id: 'ref-11', moduleName: 'Product Management', locationName: 'Semaglutide 10mg Product Listing' },
      { id: 'ref-12', moduleName: 'Research Library', locationName: 'Semaglutide Price List Matrix Item' },
    ],
  },
  {
    id: 'med-prod-02',
    name: 'tirzepatide-15mg-vial-kit.webp',
    title: 'Tirzepatide 15mg Lyophilized Vial',
    category: 'Products',
    fileType: 'WEBP',
    mimeType: 'image/webp',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/products/tirzepatide-15mg-vial-kit.webp',
    dimensions: '1000x1000 px',
    resolution: '300 DPI',
    fileSize: '138 KB',
    fileSizeBytes: 141312,
    uploadDate: '2026-08-04',
    uploadedBy: 'Product Manager',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['tirzepatide', 'product', 'vial', '15mg', 'gip-glp1'],
    description: 'Product packaging photo for Tirzepatide 15mg research vials.',
    altText: 'Tirzepatide 15mg lyophilized powder vial for analytical research',
    seoTitle: 'Tirzepatide 15mg Product Photo',
    seoDescription: 'Analytical product shot for Tirzepatide 15mg reference vials.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-13', moduleName: 'Product Management', locationName: 'Tirzepatide 15mg Product Listing' },
    ],
  },
  {
    id: 'med-coa-01',
    name: 'coa-batch-9844-semaglutide-hplc.pdf',
    title: 'HPLC & MS COA Report — Batch #9844 (Semaglutide 10mg)',
    category: 'COA',
    fileType: 'PDF',
    mimeType: 'application/pdf',
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/coa/coa-batch-9844-semaglutide-hplc.pdf',
    dimensions: 'A4 Document',
    resolution: '300 DPI',
    fileSize: '1.2 MB',
    fileSizeBytes: 1258291,
    uploadDate: '2026-08-05',
    uploadedBy: 'QC Officer (Janzen Lab)',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['coa', 'hplc', 'mass-spec', 'batch-9844', 'semaglutide', 'purity-99.85'],
    description: 'Official Janzen Analytical COA confirming 99.85% purity for Semaglutide Batch #9844.',
    altText: 'Certificate of Analysis HPLC Chromatogram for Semaglutide Batch #9844',
    seoTitle: 'COA Batch #9844 Semaglutide HPLC Purity Report PDF',
    seoDescription: 'Third-party lab certified Certificate of Analysis for Semaglutide Batch #9844.',
    usageCount: 2,
    usageReferences: [
      { id: 'ref-14', moduleName: 'COA Library', locationName: 'COA Record Batch #9844' },
      { id: 'ref-15', moduleName: 'Website Manager', locationName: 'Homepage Announcement Lab Flash Link' },
    ],
  },
  {
    id: 'med-coa-02',
    name: 'coa-batch-7712-bpc157-mass-spec.pdf',
    title: 'Mass Spectrometry COA Report — Batch #7712 (BPC-157 10mg)',
    category: 'COA',
    fileType: 'PDF',
    mimeType: 'application/pdf',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/coa/coa-batch-7712-bpc157-mass-spec.pdf',
    dimensions: 'A4 Document',
    resolution: '300 DPI',
    fileSize: '980 KB',
    fileSizeBytes: 1003520,
    uploadDate: '2026-08-05',
    uploadedBy: 'QC Officer (Janzen Lab)',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['coa', 'bpc-157', 'batch-7712', 'purity-99.91', 'mass-spec'],
    description: 'Independent lab verified 99.91% purity mass spec chromatogram for BPC-157.',
    altText: 'BPC-157 Batch #7712 Certificate of Analysis PDF',
    seoTitle: 'BPC-157 COA Report Batch #7712 PDF',
    seoDescription: 'Analytical laboratory COA document for BPC-157 Batch #7712.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-16', moduleName: 'COA Library', locationName: 'COA Record Batch #7712' },
    ],
  },
  {
    id: 'med-proto-01',
    name: 'sop-reconstitution-sterility-protocol-v2.pdf',
    title: 'SOP Reconstitution & Cold-Chain Storage Guidelines (v2.4)',
    category: 'Protocols',
    fileType: 'PDF',
    mimeType: 'application/pdf',
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
    storagePath: 'supabase://storage/gkn-media/protocols/sop-reconstitution-sterility-protocol-v2.pdf',
    dimensions: 'A4 Document',
    resolution: '300 DPI',
    fileSize: '2.4 MB',
    fileSizeBytes: 2516582,
    uploadDate: '2026-08-02',
    uploadedBy: 'Research Director',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['protocol', 'sop', 'reconstitution', 'bacteriostatic', 'pdf'],
    description: 'Standard Operating Procedure manual covering lyophilized peptide reconstitution and sterility storage.',
    altText: 'Technical Protocol Document for Peptide Reconstitution and Sterility',
    seoTitle: 'Peptide Reconstitution SOP Manual PDF',
    seoDescription: 'Comprehensive SOP technical guidelines for peptide reconstitution.',
    usageCount: 2,
    usageReferences: [
      { id: 'ref-17', moduleName: 'Protocol Library', locationName: 'Reconstitution SOP Item #1' },
      { id: 'ref-18', moduleName: 'Research Hub', locationName: 'Research Hub Featured Protocol Link' },
    ],
  },
  {
    id: 'med-calc-01',
    name: 'bac-water-dosage-calculator-diagram.png',
    title: 'Peptide Reconstitution Syringe Unit Calculator Diagram',
    category: 'Calculator Assets',
    fileType: 'PNG',
    mimeType: 'image/png',
    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/calculators/bac-water-dosage-calculator-diagram.png',
    dimensions: '1200x800 px',
    resolution: '300 DPI',
    fileSize: '310 KB',
    fileSizeBytes: 317440,
    uploadDate: '2026-08-03',
    uploadedBy: 'Research Admin',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['calculator', 'bac-water', 'syringe', 'units', 'diagram'],
    description: 'Interactive diagram explaining tick-mark unit calculations on U-100 insulin syringes.',
    altText: 'U-100 syringe unit measurement diagram for reconstitution calculator',
    seoTitle: 'Peptide Reconstitution Syringe Calculator Visual Diagram',
    seoDescription: 'Visual guide graphic for BAC water reconstitution calculator.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-19', moduleName: 'Calculators', locationName: 'Peptide Reconstitution Calculator Header Visual' },
    ],
  },
  {
    id: 'med-qr-01',
    name: 'gkn-gcash-merchant-qr.png',
    title: 'GCash Merchant Verification QR Code (Official)',
    category: 'QR Codes',
    fileType: 'PNG',
    mimeType: 'image/png',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    storagePath: 'supabase://storage/gkn-media/qr/gkn-gcash-merchant-qr.png',
    dimensions: '600x600 px',
    resolution: '300 DPI',
    fileSize: '65 KB',
    fileSizeBytes: 66560,
    uploadDate: '2026-08-01',
    uploadedBy: 'Finance Admin',
    visibility: 'RESTRICTED',
    isArchived: false,
    tags: ['qr', 'gcash', 'payment', 'merchant', 'philippines'],
    description: 'Official merchant QR code scanned by Philippines customers for instant GCash payments.',
    altText: 'GCash Merchant Payment Verification QR Code',
    seoTitle: 'GKN Official GCash Merchant QR Asset',
    seoDescription: 'GCash payment verification QR code graphic.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-20', moduleName: 'Payment Verification', locationName: 'Checkout GCash Payment Modal' },
    ],
  },
  {
    id: 'med-qr-02',
    name: 'gkn-usdt-trc20-deposit-qr.png',
    title: 'USDT-TRC20 Cold Wallet Deposit QR Code',
    category: 'Payment Assets',
    fileType: 'PNG',
    mimeType: 'image/png',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    storagePath: 'supabase://storage/gkn-media/qr/gkn-usdt-trc20-deposit-qr.png',
    dimensions: '600x600 px',
    resolution: '300 DPI',
    fileSize: '62 KB',
    fileSizeBytes: 63488,
    uploadDate: '2026-08-01',
    uploadedBy: 'Finance Admin',
    visibility: 'RESTRICTED',
    isArchived: false,
    tags: ['qr', 'usdt', 'trc20', 'crypto', 'payment'],
    description: 'Crypto payment deposit QR code for USDT TRC20 wallet address.',
    altText: 'USDT TRC20 Crypto Wallet Deposit QR Code',
    seoTitle: 'USDT TRC20 Wallet QR Code',
    seoDescription: 'Crypto payment wallet QR code asset.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-21', moduleName: 'Payment Verification', locationName: 'Checkout USDT Payment Modal' },
    ],
  },
  {
    id: 'med-doc-01',
    name: 'gkn-v2-master-lab-catalog-2026.xlsx',
    title: 'GKN V2 Master Research Product & FX Catalog (2026)',
    category: 'Documents',
    fileType: 'XLSX',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/docs/gkn-v2-master-lab-catalog-2026.xlsx',
    dimensions: 'Spreadsheet',
    resolution: 'N/A',
    fileSize: '3.1 MB',
    fileSizeBytes: 3250585,
    uploadDate: '2026-08-04',
    uploadedBy: 'Admin Lead (GKN System)',
    visibility: 'ADMIN_ONLY',
    isArchived: false,
    tags: ['xlsx', 'catalog', 'prices', 'inventory', 'master'],
    description: 'Internal administrator master pricing matrix and automated FX conversion spreadsheet.',
    altText: 'Master Excel spreadsheet catalog document icon',
    seoTitle: 'GKN Master Product Catalog Excel File',
    seoDescription: 'Internal XLSX pricing spreadsheet asset.',
    usageCount: 0,
    usageReferences: [],
  },
  {
    id: 'med-doc-02',
    name: 'gkn-media-export-archive.zip',
    title: 'GKN High-Res Vector Brand Assets Archive (ZIP)',
    category: 'Documents',
    fileType: 'ZIP',
    mimeType: 'application/zip',
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    storagePath: 'supabase://storage/gkn-media/docs/gkn-media-export-archive.zip',
    dimensions: 'Archive File',
    resolution: 'N/A',
    fileSize: '18.4 MB',
    fileSizeBytes: 19293798,
    uploadDate: '2026-08-05',
    uploadedBy: 'Admin Lead (GKN System)',
    visibility: 'ADMIN_ONLY',
    isArchived: false,
    tags: ['zip', 'brand', 'vectors', 'archive', 'download'],
    description: 'ZIP bundle containing SVG/EPS vector logos, icons, and official brand guidelines.',
    altText: 'ZIP archive file icon containing brand assets',
    seoTitle: 'GKN Brand Assets Vector ZIP Archive',
    seoDescription: 'Downloadable ZIP archive with vector SVG logos.',
    usageCount: 0,
    usageReferences: [],
  },
  {
    id: 'med-icon-01',
    name: 'favicon.ico',
    title: 'GKN Cyan Lab Flask Browser Favicon',
    category: 'Icons',
    fileType: 'ICO',
    mimeType: 'image/x-icon',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=100&q=80',
    storagePath: 'supabase://storage/gkn-media/icons/favicon.ico',
    dimensions: '32x32 px',
    resolution: '72 DPI',
    fileSize: '12 KB',
    fileSizeBytes: 12288,
    uploadDate: '2026-08-01',
    uploadedBy: 'Admin Lead (GKN System)',
    visibility: 'PUBLIC',
    isArchived: false,
    tags: ['icon', 'favicon', 'browser', 'cyan'],
    description: 'Browser tab favicon icon asset displayed on web clients.',
    altText: 'GKN Browser Favicon Flask Icon',
    seoTitle: 'GKN Favicon Icon',
    seoDescription: 'Browser favicon icon asset.',
    usageCount: 1,
    usageReferences: [
      { id: 'ref-22', moduleName: 'Website Manager', locationName: 'Website Favicon Icon' },
    ],
  },
];

class MediaLibraryService {
  private assets: MediaAssetItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.assets = JSON.parse(stored);
      } else {
        this.assets = [...INITIAL_MEDIA_ASSETS];
        this.saveToStorage();
      }
    } catch (e) {
      console.error('Error reading Media Library from localStorage:', e);
      this.assets = [...INITIAL_MEDIA_ASSETS];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.assets));
    } catch (e) {
      console.error('Error saving Media Library to localStorage:', e);
    }
  }

  public getAssets(filters?: MediaFilterOptions): MediaAssetItem[] {
    let result = [...this.assets];

    if (!filters) return result;

    // Search
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q) ||
          item.uploadedBy.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category && filters.category !== 'ALL') {
      result = result.filter((item) => item.category === filters.category);
    }

    // File Type Filter
    if (filters.fileType && filters.fileType !== 'ALL') {
      if (filters.fileType === 'IMAGE') {
        result = result.filter((item) =>
          ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG'].includes(item.fileType)
        );
      } else if (filters.fileType === 'DOCUMENT') {
        result = result.filter((item) =>
          ['PDF', 'DOCX', 'XLSX', 'ZIP'].includes(item.fileType)
        );
      } else {
        result = result.filter((item) => item.fileType === filters.fileType);
      }
    }

    // Date Filter
    if (filters.dateFilter && filters.dateFilter !== 'ALL') {
      const now = new Date();
      result = result.filter((item) => {
        const itemDate = new Date(item.uploadDate);
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        if (filters.dateFilter === 'TODAY') return diffDays <= 1;
        if (filters.dateFilter === 'WEEK') return diffDays <= 7;
        if (filters.dateFilter === 'MONTH') return diffDays <= 30;
        if (filters.dateFilter === 'YEAR') return diffDays <= 365;
        return true;
      });
    }

    // Visibility Filter
    if (filters.visibility && filters.visibility !== 'ALL') {
      result = result.filter((item) => item.visibility === filters.visibility);
    }

    // Archive filter
    if (typeof filters.isArchived === 'boolean') {
      result = result.filter((item) => item.isArchived === filters.isArchived);
    }

    // Sorting
    const sortBy = filters.sortBy || 'uploadDate';
    const sortOrder = filters.sortOrder || 'desc';

    result.sort((a, b) => {
      let valA: any = a[sortBy as keyof MediaAssetItem];
      let valB: any = b[sortBy as keyof MediaAssetItem];

      if (sortBy === 'fileSizeBytes') {
        valA = a.fileSizeBytes;
        valB = b.fileSizeBytes;
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }

  public getAssetById(id: string): MediaAssetItem | null {
    return this.assets.find((a) => a.id === id) || null;
  }

  public getStats(): MediaStats {
    const totalAssets = this.assets.length;
    let imagesCount = 0;
    let documentsCount = 0;
    let pdfsCount = 0;
    let logosCount = 0;
    let iconsCount = 0;
    let coasCount = 0;
    let researchAssetsCount = 0;
    let productAssetsCount = 0;
    let websiteAssetsCount = 0;
    let storageUsageBytes = 0;

    const now = new Date();
    let recentUploadsCount = 0;

    this.assets.forEach((asset) => {
      storageUsageBytes += asset.fileSizeBytes || 0;

      const isImg = ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG'].includes(asset.fileType);
      if (isImg) imagesCount++;

      const isDoc = ['PDF', 'DOCX', 'XLSX', 'ZIP'].includes(asset.fileType);
      if (isDoc) documentsCount++;

      if (asset.fileType === 'PDF') pdfsCount++;
      if (asset.category === 'Logos') logosCount++;
      if (asset.category === 'Icons') iconsCount++;
      if (asset.category === 'COA') coasCount++;
      if (asset.category === 'Research' || asset.category === 'Protocols') researchAssetsCount++;
      if (asset.category === 'Products') productAssetsCount++;
      if (
        asset.category === 'Website' ||
        asset.category === 'Homepage' ||
        asset.category === 'Hero Images' ||
        asset.category === 'Store Cards'
      ) {
        websiteAssetsCount++;
      }

      const diffDays = (now.getTime() - new Date(asset.uploadDate).getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 7) recentUploadsCount++;
    });

    const mb = storageUsageBytes / (1024 * 1024);
    const storageUsageFormatted =
      mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(2)} MB`;

    return {
      totalAssets,
      imagesCount,
      documentsCount,
      pdfsCount,
      logosCount,
      iconsCount,
      coasCount,
      researchAssetsCount,
      productAssetsCount,
      websiteAssetsCount,
      storageUsageBytes,
      storageUsageFormatted,
      recentUploadsCount,
    };
  }

  public uploadAsset(
    data: Partial<MediaAssetItem> & { name: string; url: string; category: MediaCategory }
  ): MediaAssetItem {
    const ext = data.name.split('.').pop()?.toUpperCase() || 'PNG';
    let fileType: SupportedFileType = 'PNG';
    if (['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG', 'PDF', 'DOCX', 'XLSX', 'ZIP', 'ICO'].includes(ext)) {
      fileType = ext as SupportedFileType;
    }

    const cleanFilename = data.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
    const storagePath = `supabase://storage/gkn-media/${data.category.toLowerCase().replace(/\s+/g, '-')}/${cleanFilename}`;

    const newAsset: MediaAssetItem = {
      id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: data.name,
      title: data.title || data.name.replace(/\.[^/.]+$/, ''),
      category: data.category,
      fileType,
      mimeType: data.mimeType || (fileType === 'PDF' ? 'application/pdf' : 'image/png'),
      url: data.url,
      storagePath: data.storagePath || storagePath,
      dimensions: data.dimensions || (fileType === 'PDF' ? 'A4 Document' : '1200x800 px'),
      resolution: data.resolution || '300 DPI',
      fileSize: data.fileSize || '350 KB',
      fileSizeBytes: data.fileSizeBytes || 358400,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: data.uploadedBy || 'Admin Lead (GKN System)',
      visibility: data.visibility || 'PUBLIC',
      isArchived: false,
      tags: data.tags || [data.category.toLowerCase(), 'media-library'],
      description: data.description || 'Uploaded asset stored in GKN Media Library.',
      altText: data.altText || data.title || data.name,
      seoTitle: data.seoTitle || `${data.title} Asset`,
      seoDescription: data.seoDescription || `GKN Media asset for ${data.category}.`,
      usageCount: 0,
      usageReferences: [],
    };

    this.assets.unshift(newAsset);
    this.saveToStorage();
    return newAsset;
  }

  public replaceAsset(id: string, updates: Partial<MediaAssetItem>): MediaAssetItem | null {
    const idx = this.assets.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    this.assets[idx] = {
      ...this.assets[idx],
      ...updates,
    };

    this.saveToStorage();
    return this.assets[idx];
  }

  public renameAsset(id: string, newName: string): MediaAssetItem | null {
    return this.replaceAsset(id, { name: newName, title: newName });
  }

  public duplicateAsset(id: string): MediaAssetItem | null {
    const original = this.getAssetById(id);
    if (!original) return null;

    const copyName = `copy-of-${original.name}`;
    const copyTitle = `${original.title} (Copy)`;

    return this.uploadAsset({
      ...original,
      name: copyName,
      title: copyTitle,
      usageCount: 0,
      usageReferences: [],
    });
  }

  public moveCategory(id: string, newCategory: MediaCategory): MediaAssetItem | null {
    return this.replaceAsset(id, { category: newCategory });
  }

  public archiveAsset(id: string, isArchived: boolean = true): MediaAssetItem | null {
    return this.replaceAsset(id, { isArchived });
  }

  public deleteAsset(id: string, force: boolean = false): { success: boolean; message?: string } {
    const asset = this.getAssetById(id);
    if (!asset) {
      return { success: false, message: 'Asset not found.' };
    }

    if (asset.usageCount > 0 && !force) {
      return {
        success: false,
        message: `Asset "${asset.name}" is currently in use across ${asset.usageCount} location(s) (${asset.usageReferences.map((r) => r.locationName).join(', ')}). Deletion blocked to prevent broken references.`,
      };
    }

    this.assets = this.assets.filter((a) => a.id !== id);
    this.saveToStorage();
    return { success: true };
  }

  public trackAssetUsage(assetUrlOrId: string, ref: AssetUsageReference): void {
    const idx = this.assets.findIndex(
      (a) => a.id === assetUrlOrId || a.url === assetUrlOrId
    );
    if (idx === -1) return;

    const currentRefs = this.assets[idx].usageReferences || [];
    const exists = currentRefs.some(
      (r) => r.moduleName === ref.moduleName && r.locationName === ref.locationName
    );

    if (!exists) {
      const updatedRefs = [...currentRefs, { ...ref, id: ref.id || `ref-${Date.now()}` }];
      this.assets[idx] = {
        ...this.assets[idx],
        usageReferences: updatedRefs,
        usageCount: updatedRefs.length,
      };
      this.saveToStorage();
    }
  }

  public removeAssetUsage(assetUrlOrId: string, locationName: string): void {
    const idx = this.assets.findIndex(
      (a) => a.id === assetUrlOrId || a.url === assetUrlOrId
    );
    if (idx === -1) return;

    const currentRefs = this.assets[idx].usageReferences || [];
    const updatedRefs = currentRefs.filter((r) => r.locationName !== locationName);

    this.assets[idx] = {
      ...this.assets[idx],
      usageReferences: updatedRefs,
      usageCount: updatedRefs.length,
    };
    this.saveToStorage();
  }

  public bulkMoveCategory(ids: string[], category: MediaCategory): number {
    let count = 0;
    this.assets = this.assets.map((item) => {
      if (ids.includes(item.id)) {
        count++;
        return { ...item, category };
      }
      return item;
    });
    this.saveToStorage();
    return count;
  }

  public bulkArchive(ids: string[], archiveState: boolean): number {
    let count = 0;
    this.assets = this.assets.map((item) => {
      if (ids.includes(item.id)) {
        count++;
        return { ...item, isArchived: archiveState };
      }
      return item;
    });
    this.saveToStorage();
    return count;
  }

  public bulkDelete(ids: string[]): {
    deletedCount: number;
    blockedCount: number;
    blockedNames: string[];
  } {
    let deletedCount = 0;
    let blockedCount = 0;
    const blockedNames: string[] = [];

    const remainingAssets: MediaAssetItem[] = [];

    this.assets.forEach((asset) => {
      if (ids.includes(asset.id)) {
        if (asset.usageCount > 0) {
          blockedCount++;
          blockedNames.push(asset.name);
          remainingAssets.push(asset);
        } else {
          deletedCount++;
        }
      } else {
        remainingAssets.push(asset);
      }
    });

    this.assets = remainingAssets;
    this.saveToStorage();

    return { deletedCount, blockedCount, blockedNames };
  }

  public exportMetadata(ids?: string[], format: ExportFormat = 'csv'): void {
    const targetAssets = ids && ids.length > 0
      ? this.assets.filter((a) => ids.includes(a.id))
      : this.assets;

    const headers = [
      'ID',
      'Name',
      'Title',
      'Category',
      'FileType',
      'MimeType',
      'Dimensions',
      'FileSize',
      'UploadDate',
      'UploadedBy',
      'Visibility',
      'UsageCount',
      'StoragePath',
      'URL',
    ];

    const rows = targetAssets.map((a) => [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      a.category,
      a.fileType,
      a.mimeType,
      a.dimensions,
      a.fileSize,
      a.uploadDate,
      `"${a.uploadedBy}"`,
      a.visibility,
      a.usageCount,
      `"${a.storagePath}"`,
      `"${a.url}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `gkn-media-library-metadata-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xls' : 'csv'}`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public getSupabaseStorageConfig() {
    return {
      bucketName: 'gkn-media-assets',
      endpoint: 'https://ais-dev-k54ag55td4j3gkwyk2rv3s.supabase.co/storage/v1',
      isLive: true,
      uploadPathPrefix: 'supabase://storage/gkn-media/',
      supportedTypes: ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG', 'PDF', 'DOCX', 'XLSX', 'ZIP', 'ICO'],
    };
  }
}

export const mediaLibraryService = new MediaLibraryService();
