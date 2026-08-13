import {
  COARecordAdmin,
  ProtocolRecordAdmin,
  CalculatorContentAdmin,
  PriceListItemAdmin,
  ResearchHubHomepageAdmin,
  GlobalSearchMatch,
  BulkActionType,
  ExportFormat,
} from '../types/researchLibraryManager';

const STORAGE_KEY = 'GKN_RESEARCH_LIBRARY_DATA_V2';

// Seed initial COA data
const DEFAULT_COAS: COARecordAdmin[] = [
  {
    id: 'coa-001',
    product: 'Tirzepatide Reference Standard',
    variant: '10mg Lyophilized Vial',
    laboratory: 'Janoshik Analytical',
    lotNumber: 'GKN-TIRZ-2026-A1',
    purity: 99.82,
    testDate: '2026-07-15',
    expirationDate: '2028-07-15',
    pdfUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    chromatogramImageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    status: 'VERIFIED',
    visibility: 'PUBLIC',
    tags: ['Metabolic', 'Tirzepatide', 'HPLC', 'Janoshik'],
    searchKeywords: ['Tirzepatide', 'GLP-1', 'GIP', '99.82%', 'GKN-TIRZ-2026-A1', 'Janoshik'],
    versionHistory: [
      {
        id: 'ver-01',
        version: 'v1.1',
        date: '2026-07-15',
        updatedBy: 'Dr. V. Vance (Head QC)',
        changeNote: 'Initial Janoshik HPLC & MS purity certification uploaded.',
        pdfUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    updatedAt: '2026-07-15T10:00:00Z',
  },
  {
    id: 'coa-002',
    product: 'Semaglutide Lyophilized Standard',
    variant: '10mg Lyophilized Vial',
    laboratory: 'Freedom Analytics Labs',
    lotNumber: 'GKN-SEMA-2026-B3',
    purity: 99.64,
    testDate: '2026-07-10',
    expirationDate: '2028-07-10',
    pdfUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    chromatogramImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    status: 'VERIFIED',
    visibility: 'PUBLIC',
    tags: ['Metabolic', 'Semaglutide', 'Freedom Labs'],
    searchKeywords: ['Semaglutide', 'GLP-1', '99.64%', 'GKN-SEMA-2026-B3'],
    versionHistory: [
      {
        id: 'ver-02',
        version: 'v1.0',
        date: '2026-07-10',
        updatedBy: 'Lab Admin',
        changeNote: 'Verified report issuance.',
      },
    ],
    updatedAt: '2026-07-10T14:30:00Z',
  },
  {
    id: 'coa-003',
    product: 'BPC-157 High-Purity Standard',
    variant: '10mg Lyophilized Vial',
    laboratory: 'Janoshik Analytical',
    lotNumber: 'GKN-BPC157-2026-C2',
    purity: 99.91,
    testDate: '2026-06-28',
    expirationDate: '2028-06-28',
    pdfUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80',
    chromatogramImageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
    status: 'VERIFIED',
    visibility: 'PUBLIC',
    tags: ['Tissue Repair', 'BPC-157', 'Janoshik'],
    searchKeywords: ['BPC-157', 'Body Protection Compound', '99.91%', 'Janoshik'],
    versionHistory: [],
    updatedAt: '2026-06-28T09:15:00Z',
  },
  {
    id: 'coa-004',
    product: 'TB-500 (Thymosin Beta-4 Fragment)',
    variant: '10mg Lyophilized Vial',
    laboratory: 'Independent Bio-Assay Labs',
    lotNumber: 'GKN-TB500-2026-D4',
    purity: 99.45,
    testDate: '2026-06-20',
    expirationDate: '2028-06-20',
    pdfUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    chromatogramImageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    status: 'VERIFIED',
    visibility: 'PUBLIC',
    tags: ['Tissue Repair', 'TB-500'],
    searchKeywords: ['TB-500', 'Thymosin', '99.45%'],
    versionHistory: [],
    updatedAt: '2026-06-20T11:00:00Z',
  },
  {
    id: 'coa-005',
    product: 'Retatrutide Triple Agonist',
    variant: '15mg Lyophilized Vial',
    laboratory: 'Janoshik Analytical',
    lotNumber: 'GKN-RETAT-2026-X1',
    purity: 99.78,
    testDate: '2026-07-22',
    expirationDate: '2028-07-22',
    pdfUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
    chromatogramImageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80',
    status: 'VERIFIED',
    visibility: 'PUBLIC',
    tags: ['Triple Agonist', 'Retatrutide', 'Janoshik'],
    searchKeywords: ['Retatrutide', 'GIP', 'GLP-1', 'Glucagon', '99.78%'],
    versionHistory: [],
    updatedAt: '2026-07-22T16:00:00Z',
  },
];

// Seed initial Protocol data
const DEFAULT_PROTOCOLS: ProtocolRecordAdmin[] = [
  {
    id: 'proto-001',
    title: 'Sterile Reconstitution & Diluent Solubilization',
    category: 'Reconstitution',
    description: 'Standard operating procedure for aseptic reconstitution of lyophilized research peptides using Bacteriostatic Water (0.9% Benzyl Alcohol).',
    procedure: `1. PREPARATION & ASEPTIC AREA
• Sanitize working laminar flow workbench or sterile surface with 70% Isopropyl Alcohol.
• Inspect vial seal for vacuum integrity and glass container clarity.

2. DILUENT WITHDRAWAL
• Clean rubber stoppers of both Bacteriostatic Water and Peptide vial with sterile alcohol wipes.
• Draw required volume of Bacteriostatic Water using a sterile U-100 syringe or 3mL Luer Lock syringe.

3. RECONSTITUTION STEP
• Direct the diluent stream against the inside glass wall of the vial, NOT directly onto the lyophilized cake.
• Allow liquid to gently soak the cake. DO NOT SHAKE. Gently swirl vial in a slow circular pattern until fully dissolved.

4. STORAGE & STABILITY
• Store reconstituted solution immediately in refrigerator at 2°C - 8°C (36°F - 46°F). Protect from light exposure.`,
    storageInstructions: 'Keep lyophilized vials at -20°C for long term. Reconstituted vials must be stored refrigerated between 2°C and 8°C. Do not freeze reconstituted solution.',
    safetyNotes: 'FOR LABORATORY RESEARCH ONLY. Wear nitrile gloves, lab coat, and protective eyewear during handling. Handle all bio-specimens according to Biosafety Level 1/2 standards.',
    visibility: 'PUBLIC',
    featured: true,
    sortOrder: 1,
    pdfUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
    updatedAt: '2026-07-18T12:00:00Z',
  },
  {
    id: 'proto-002',
    title: 'Cryogenic Storage & Thermal Stability Guidelines',
    category: 'Storage & Handling',
    description: 'Guidelines for preserving peptide structural integrity, preventing peptide oxidation, and managing freeze-thaw cycles.',
    procedure: `1. UNBOXING & CHECK
• Upon arrival, inspect cold pack condition and vial integrity immediately.

2. LYOPHILIZED STORAGE
• Store long-term (-20°C to -80°C) dry in dark desiccated containers.
• Protect from moisture ingress by keeping seals intact until use.

3. FREEZE-THAW MITIGATION
• Aliquot reconstituted liquid into micro-centrifuge tubes if multiple freeze-thaw cycles are expected to prevent peptide chain cleavage.`,
    storageInstructions: 'Lyophilized: -20°C for up to 24 months. Reconstituted: 2-8°C for 30-60 days max depending on peptide type.',
    safetyNotes: 'Always thaw vials at room temperature for 15 minutes before opening to prevent condensation buildup on frozen cakes.',
    visibility: 'PUBLIC',
    featured: true,
    sortOrder: 2,
    pdfUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
    updatedAt: '2026-07-12T15:00:00Z',
  },
  {
    id: 'proto-003',
    title: 'HPLC Purity Analysis & Mass Spec Identity Protocol',
    category: 'Assay Standards',
    description: 'Laboratory procedures for validating peptide purity using High-Performance Liquid Chromatography (RP-HPLC) at 214nm wavelength.',
    procedure: `1. MOBILE PHASE PREPARATION
• Phase A: 0.1% TFA in LC-MS grade Water.
• Phase B: 0.1% TFA in LC-MS grade Acetonitrile.

2. COLUMN SELECTION
• C18 Reversed-Phase column (4.6mm x 250mm, 5µm particle size, 100Å pore size).

3. GRADIENT RUN
• Linear gradient 5% to 65% Phase B over 30 minutes at flow rate of 1.0 mL/min. Injection volume 10 µL.`,
    storageInstructions: 'Store reference standard solutions at -80°C in LC-MS grade amber glass vials.',
    safetyNotes: 'Acetonitrile and Trifluoroacetic acid (TFA) are toxic volatile chemicals. Perform all mobile phase prep inside certified chemical fume hood.',
    visibility: 'PUBLIC',
    featured: false,
    sortOrder: 3,
    updatedAt: '2026-06-25T08:00:00Z',
  },
];

// Seed initial Calculator Content
const DEFAULT_CALCULATORS: CalculatorContentAdmin[] = [
  {
    id: 'calc-reconstitution',
    title: 'Peptide Reconstitution Calculator',
    description: 'Accurately calculate dosage concentration per syringe unit (IU / mg / mcg) based on vial mass and diluent volume.',
    defaultValues: {
      vialMassMg: 10,
      diluentMl: 2,
      targetMcg: 250,
      syringeUnitsTotal: 100, // U-100 standard
    },
    unitLabels: {
      vialMassMg: 'mg (Milligrams)',
      diluentMl: 'mL (Milliliters)',
      targetMcg: 'mcg (Micrograms)',
      syringeUnitsTotal: 'Units (U-100)',
    },
    educationalInfo: 'Formula uses standard mass-to-volume ratio: Concentration (mcg/mL) = (Vial Mass in mg * 1000) / Diluent Volume in mL. One U-100 syringe unit equals 0.01 mL.',
    helpText: 'Enter the exact lyophilized mass printed on your vial and the volume of Bac Water added. Formulas are strictly mathematically locked.',
    visibility: 'PUBLIC',
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'calc-cycle',
    title: 'Research Protocol Cycle & Vial Quantity Estimator',
    description: 'Estimate required vial quantities, total reconstituted volume, and duration needed for lab testing protocols.',
    defaultValues: {
      dailyDoseMcg: 500,
      daysPerWeek: 7,
      totalWeeks: 12,
      vialSizeMg: 10,
    },
    unitLabels: {
      dailyDoseMcg: 'mcg/day',
      daysPerWeek: 'Days/Week',
      totalWeeks: 'Total Weeks',
      vialSizeMg: 'mg per Vial',
    },
    educationalInfo: 'Total Mass Required (mg) = (Daily Dose in mcg * Days per Week * Total Weeks) / 1000. Total Vials = Ceil(Total Mass / Vial Size).',
    helpText: 'Useful for planning batch procurement quantities for multi-week research schedules.',
    visibility: 'PUBLIC',
    updatedAt: '2026-07-18T14:00:00Z',
  },
];

// Seed initial Price List
const DEFAULT_PRICE_LIST: PriceListItemAdmin[] = [
  {
    id: 'price-001',
    product: 'Tirzepatide Reference Standard',
    variant: '10mg Vial (10-Pack Kit)',
    usdPrice: 280,
    phpPrice: 16240,
    category: 'GroupBuy',
    visibility: 'PUBLIC',
    featured: true,
    updatedAt: '2026-07-22T00:00:00Z',
  },
  {
    id: 'price-002',
    product: 'Semaglutide Lyophilized',
    variant: '10mg Vial (10-Pack Kit)',
    usdPrice: 210,
    phpPrice: 12180,
    category: 'GroupBuy',
    visibility: 'PUBLIC',
    featured: true,
    updatedAt: '2026-07-22T00:00:00Z',
  },
  {
    id: 'price-003',
    product: 'BPC-157 High Purity',
    variant: '10mg Vial (Single / Pack)',
    usdPrice: 45,
    phpPrice: 2610,
    category: 'OnHand',
    visibility: 'PUBLIC',
    featured: false,
    updatedAt: '2026-07-20T00:00:00Z',
  },
  {
    id: 'price-004',
    product: 'TB-500 (Thymosin Beta-4)',
    variant: '10mg Vial (Single / Pack)',
    usdPrice: 50,
    phpPrice: 2900,
    category: 'OnHand',
    visibility: 'PUBLIC',
    featured: false,
    updatedAt: '2026-07-20T00:00:00Z',
  },
  {
    id: 'price-005',
    product: 'Retatrutide Triple Agonist',
    variant: '15mg Vial Bulk MOQ (100+ Vials)',
    usdPrice: 1800,
    phpPrice: 104400,
    category: 'MOQ Bulk',
    visibility: 'PUBLIC',
    featured: true,
    updatedAt: '2026-07-21T00:00:00Z',
  },
];

// Seed initial Research Hub Homepage Content
const DEFAULT_HUB_SETTINGS: ResearchHubHomepageAdmin = {
  heroSection: {
    title: 'GKN Research Library & Documentation Repository',
    subtitle: 'Access third-party analytical Certificates of Analysis (COAs), peer-reviewed handling protocols, peptide calculators, and transparent catalog pricing.',
    bannerImageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Explore Open Database',
    ctaUrl: '/research/coa-library',
    visibility: 'PUBLIC',
  },
  featureCards: [
    {
      id: 'card-1',
      title: 'Janoshik Verified COAs',
      description: 'Independent HPLC and Mass Spectrometry testing verification for every batch.',
      iconName: 'FileCheck',
      linkUrl: '/research/coa-library',
      sortOrder: 1,
      visibility: 'PUBLIC',
    },
    {
      id: 'card-2',
      title: 'Standard Handling Protocols',
      description: 'Aseptic reconstitution, diluent solubility, and cryogenic stability guidelines.',
      iconName: 'BookOpen',
      linkUrl: '/research/protocol-library',
      sortOrder: 2,
      visibility: 'PUBLIC',
    },
    {
      id: 'card-3',
      title: 'Precision Reconstitution Calculators',
      description: 'Mathematical tools for exact dosage concentrations and U-100 syringe conversions.',
      iconName: 'Calculator',
      linkUrl: '/research/calculators/peptide',
      sortOrder: 3,
      visibility: 'PUBLIC',
    },
    {
      id: 'card-4',
      title: 'Transparent Pricing Directory',
      description: 'Live rates across GroupBuy, OnHand stock, and institutional MOQ bulk orders.',
      iconName: 'Tag',
      linkUrl: '/research/price-list',
      sortOrder: 4,
      visibility: 'PUBLIC',
    },
  ],
  categories: [
    {
      id: 'cat-1',
      name: 'Metabolic & Incretin Peptides',
      description: 'Tirzepatide, Semaglutide, Retatrutide, Cagrilintide standards.',
      countText: '18 Verified Lots',
      iconName: 'Activity',
      targetUrl: '/research/coa-library?q=Tirzepatide',
      visibility: 'PUBLIC',
    },
    {
      id: 'cat-2',
      name: 'Tissue Repair & Bioregulators',
      description: 'BPC-157, TB-500, KPV, GHK-Cu high purity standards.',
      countText: '14 Verified Lots',
      iconName: 'Shield',
      targetUrl: '/research/coa-library?q=BPC-157',
      visibility: 'PUBLIC',
    },
    {
      id: 'cat-3',
      name: 'GH Secretagogues & Anti-Aging',
      description: 'CJC-1295 DAC, Ipamorelin, Tesamorelin, NAD+ standards.',
      countText: '12 Verified Lots',
      iconName: 'Zap',
      targetUrl: '/research/protocol-library',
      visibility: 'PUBLIC',
    },
  ],
  featuredArticles: [
    {
      id: 'art-1',
      title: 'Understanding HPLC Chromatograms & Mass Spectrometry Peak Signals',
      category: 'Analytical Chemistry',
      excerpt: 'How to read peak area integration percentages, identify potential isomer degradants, and verify molecular mass spectrum spikes.',
      content: 'High-Performance Liquid Chromatography (HPLC) coupled with Mass Spectrometry (MS) provides structural purity verification for lyophilized peptides. Key metrics include main peak area integration percentage (purity %), UV absorption spectra at 214nm, and observed molecular weight matched against calculated monoisotopic mass.',
      readTime: '6 Min Read',
      date: 'July 2026',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
      articleUrl: '/research/coa-library',
      featured: true,
      visibility: 'PUBLIC',
    },
    {
      id: 'art-2',
      title: 'Best Practices for Long-Term Lyophilized Powder Cryo-Preservation',
      category: 'Laboratory Protocols',
      excerpt: 'Preventing moisture absorption, thermal degradation, and peptide bond hydrolysis during freezer storage.',
      content: 'Lyophilized peptide cakes must be stored dry at -20°C to -80°C in sealed desiccated containers to prevent moisture accumulation. Always thaw vials at room temperature for 15 minutes before opening stopper seals to mitigate condensation.',
      readTime: '4 Min Read',
      date: 'June 2026',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      articleUrl: '/research/protocol-library',
      featured: true,
      visibility: 'PUBLIC',
    },
  ],
  quickLinks: [
    { id: 'ql-1', title: 'Verify Batch Lot COA', url: '/research/coa-library', badge: 'Search', visibility: 'PUBLIC' },
    { id: 'ql-2', title: 'Reconstitution Calculator', url: '/research/calculators/peptide', badge: 'Tool', visibility: 'PUBLIC' },
    { id: 'ql-3', title: 'Download Technical Manual PDF', url: '/research/protocol-library', badge: 'PDF', visibility: 'PUBLIC' },
    { id: 'ql-4', title: 'Live Products Price Matrix', url: '/research/price-list', badge: 'USD/PHP', visibility: 'PUBLIC' },
  ],
  repositoryUpdates: [
    {
      id: 'rep-1',
      title: 'Batch Lot #GKN-TIRZ-2026-A1 Released',
      description: 'Updated Janoshik analytical report uploaded to COA Library with 99.82% purity certification.',
      timestamp: '2 hours ago',
      targetUrl: '/research/coa-library',
      badgeColor: 'cyan',
      visibility: 'PUBLIC',
    },
    {
      id: 'rep-2',
      title: 'New Peptide Cycle Scheduler Integrated',
      description: 'Updated protocol scheduling tool for compound dosing timelines and vial requirement planning.',
      timestamp: '1 day ago',
      targetUrl: '/research/calculators/cycle',
      badgeColor: 'purple',
      visibility: 'PUBLIC',
    },
  ],
  updatedAt: '2026-07-22T00:00:00Z',
};

export class ResearchLibraryManagerService {
  private coas: COARecordAdmin[];
  private protocols: ProtocolRecordAdmin[];
  private calculators: CalculatorContentAdmin[];
  private priceList: PriceListItemAdmin[];
  private hubSettings: ResearchHubHomepageAdmin;

  constructor() {
    const loaded = this.loadFromStorage();
    this.coas = loaded.coas;
    this.protocols = loaded.protocols;
    this.calculators = loaded.calculators;
    this.priceList = loaded.priceList;
    this.hubSettings = loaded.hubSettings;
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          coas: parsed.coas || DEFAULT_COAS,
          protocols: parsed.protocols || DEFAULT_PROTOCOLS,
          calculators: parsed.calculators || DEFAULT_CALCULATORS,
          priceList: parsed.priceList || DEFAULT_PRICE_LIST,
          hubSettings: parsed.hubSettings || DEFAULT_HUB_SETTINGS,
        };
      }
    } catch (e) {
      console.warn('Failed to parse Research Library Storage data, using defaults', e);
    }
    return {
      coas: DEFAULT_COAS,
      protocols: DEFAULT_PROTOCOLS,
      calculators: DEFAULT_CALCULATORS,
      priceList: DEFAULT_PRICE_LIST,
      hubSettings: DEFAULT_HUB_SETTINGS,
    };
  }

  private saveToStorage() {
    try {
      const payload = {
        coas: this.coas,
        protocols: this.protocols,
        calculators: this.calculators,
        priceList: this.priceList,
        hubSettings: this.hubSettings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save Research Library Data to localStorage', e);
    }
  }

  // ==========================================
  // COA MANAGEMENT METHODS
  // ==========================================
  public getCOAs(): COARecordAdmin[] {
    return [...this.coas];
  }

  public saveCOA(record: Partial<COARecordAdmin> & { product: string; lotNumber: string }): COARecordAdmin {
    let saved: COARecordAdmin;
    const now = new Date().toISOString();

    if (record.id && this.coas.some((c) => c.id === record.id)) {
      this.coas = this.coas.map((existing) => {
        if (existing.id === record.id) {
          saved = {
            ...existing,
            ...record,
            updatedAt: now,
          };
          return saved;
        }
        return existing;
      });
    } else {
      saved = {
        id: record.id || `coa-${Date.now()}`,
        product: record.product,
        variant: record.variant || '10mg Vial',
        laboratory: record.laboratory || 'Janoshik Analytical',
        lotNumber: record.lotNumber,
        purity: record.purity || 99.5,
        testDate: record.testDate || now.slice(0, 10),
        expirationDate: record.expirationDate || '2028-12-31',
        pdfUrl: record.pdfUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        chromatogramImageUrl: record.chromatogramImageUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        status: record.status || 'VERIFIED',
        visibility: record.visibility || 'PUBLIC',
        tags: record.tags || ['Laboratory', record.product],
        searchKeywords: record.searchKeywords || [record.product, record.lotNumber],
        versionHistory: record.versionHistory || [],
        updatedAt: now,
      };
      this.coas.unshift(saved);
    }

    this.saveToStorage();
    return saved!;
  }

  public addCOAVersion(coaId: string, versionNote: string, pdfUrl?: string, updatedBy = 'Admin User'): COARecordAdmin | null {
    const target = this.coas.find((c) => c.id === coaId);
    if (!target) return null;

    const newVer = {
      id: `ver-${Date.now()}`,
      version: `v1.${(target.versionHistory?.length || 0) + 1}`,
      date: new Date().toISOString().slice(0, 10),
      updatedBy,
      changeNote: versionNote,
      pdfUrl: pdfUrl || target.pdfUrl,
      chromatogramImageUrl: target.chromatogramImageUrl,
    };

    const updatedHistory = [newVer, ...(target.versionHistory || [])];
    return this.saveCOA({
      ...target,
      pdfUrl: pdfUrl || target.pdfUrl,
      versionHistory: updatedHistory,
    });
  }

  public deleteCOA(id: string): boolean {
    const before = this.coas.length;
    this.coas = this.coas.filter((c) => c.id !== id);
    if (this.coas.length !== before) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public bulkCOAActions(ids: string[], action: BulkActionType): number {
    let affected = 0;
    if (action === 'DELETE') {
      const before = this.coas.length;
      this.coas = this.coas.filter((c) => !ids.includes(c.id));
      affected = before - this.coas.length;
    } else {
      this.coas = this.coas.map((c) => {
        if (ids.includes(c.id)) {
          affected++;
          if (action === 'PUBLISH') return { ...c, visibility: 'PUBLIC' as const };
          if (action === 'HIDE') return { ...c, visibility: 'HIDDEN' as const };
        }
        return c;
      });
    }
    this.saveToStorage();
    return affected;
  }

  // ==========================================
  // PROTOCOL MANAGEMENT METHODS
  // ==========================================
  public getProtocols(): ProtocolRecordAdmin[] {
    return [...this.protocols].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public saveProtocol(record: Partial<ProtocolRecordAdmin> & { title: string }): ProtocolRecordAdmin {
    let saved: ProtocolRecordAdmin;
    const now = new Date().toISOString();

    if (record.id && this.protocols.some((p) => p.id === record.id)) {
      this.protocols = this.protocols.map((existing) => {
        if (existing.id === record.id) {
          saved = {
            ...existing,
            ...record,
            updatedAt: now,
          };
          return saved;
        }
        return existing;
      });
    } else {
      saved = {
        id: record.id || `proto-${Date.now()}`,
        title: record.title,
        category: record.category || 'Reconstitution',
        description: record.description || 'Laboratory standard procedure.',
        procedure: record.procedure || '1. Clean work area with 70% IPA.',
        storageInstructions: record.storageInstructions || 'Refrigerate at 2-8°C.',
        safetyNotes: record.safetyNotes || 'Lab research only.',
        visibility: record.visibility || 'PUBLIC',
        featured: record.featured ?? true,
        sortOrder: record.sortOrder || this.protocols.length + 1,
        pdfUrl: record.pdfUrl,
        updatedAt: now,
      };
      this.protocols.push(saved);
    }

    this.saveToStorage();
    return saved!;
  }

  public deleteProtocol(id: string): boolean {
    const before = this.protocols.length;
    this.protocols = this.protocols.filter((p) => p.id !== id);
    if (this.protocols.length !== before) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public reorderProtocols(orderedIds: string[]) {
    this.protocols = this.protocols.map((p) => {
      const idx = orderedIds.indexOf(p.id);
      if (idx !== -1) {
        return { ...p, sortOrder: idx + 1 };
      }
      return p;
    });
    this.saveToStorage();
  }

  public bulkProtocolActions(ids: string[], action: BulkActionType): number {
    let affected = 0;
    if (action === 'DELETE') {
      const before = this.protocols.length;
      this.protocols = this.protocols.filter((p) => !ids.includes(p.id));
      affected = before - this.protocols.length;
    } else {
      this.protocols = this.protocols.map((p) => {
        if (ids.includes(p.id)) {
          affected++;
          if (action === 'PUBLISH') return { ...p, visibility: 'PUBLIC' as const };
          if (action === 'HIDE') return { ...p, visibility: 'HIDDEN' as const };
        }
        return p;
      });
    }
    this.saveToStorage();
    return affected;
  }

  // ==========================================
  // PEPTIDE CALCULATOR CONTENT METHODS
  // ==========================================
  public getCalculators(): CalculatorContentAdmin[] {
    return [...this.calculators];
  }

  public saveCalculator(calc: CalculatorContentAdmin): CalculatorContentAdmin {
    const now = new Date().toISOString();
    const updated = { ...calc, updatedAt: now };

    const idx = this.calculators.findIndex((c) => c.id === calc.id);
    if (idx !== -1) {
      this.calculators[idx] = updated;
    } else {
      this.calculators.push(updated);
    }

    this.saveToStorage();
    return updated;
  }

  // ==========================================
  // PRICE LIST MANAGEMENT METHODS
  // ==========================================
  public getPriceList(): PriceListItemAdmin[] {
    return [...this.priceList];
  }

  public savePriceListItem(item: Partial<PriceListItemAdmin> & { product: string; variant: string }): PriceListItemAdmin {
    let saved: PriceListItemAdmin;
    const now = new Date().toISOString();

    if (item.id && this.priceList.some((p) => p.id === item.id)) {
      this.priceList = this.priceList.map((existing) => {
        if (existing.id === item.id) {
          saved = {
            ...existing,
            ...item,
            updatedAt: now,
          };
          return saved;
        }
        return existing;
      });
    } else {
      saved = {
        id: item.id || `price-${Date.now()}`,
        product: item.product,
        variant: item.variant,
        usdPrice: item.usdPrice || 100,
        phpPrice: item.phpPrice || item.usdPrice ? (item.usdPrice || 100) * 58 : 5800,
        category: item.category || 'GroupBuy',
        visibility: item.visibility || 'PUBLIC',
        featured: item.featured ?? false,
        updatedAt: now,
      };
      this.priceList.unshift(saved);
    }

    this.saveToStorage();
    return saved!;
  }

  public deletePriceListItem(id: string): boolean {
    const before = this.priceList.length;
    this.priceList = this.priceList.filter((p) => p.id !== id);
    if (this.priceList.length !== before) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public bulkPriceListActions(ids: string[], action: BulkActionType): number {
    let affected = 0;
    if (action === 'DELETE') {
      const before = this.priceList.length;
      this.priceList = this.priceList.filter((p) => !ids.includes(p.id));
      affected = before - this.priceList.length;
    } else {
      this.priceList = this.priceList.map((p) => {
        if (ids.includes(p.id)) {
          affected++;
          if (action === 'PUBLISH') return { ...p, visibility: 'PUBLIC' as const };
          if (action === 'HIDE') return { ...p, visibility: 'HIDDEN' as const };
        }
        return p;
      });
    }
    this.saveToStorage();
    return affected;
  }

  // ==========================================
  // RESEARCH HUB HOMEPAGE SETTINGS
  // ==========================================
  public getResearchHubSettings(): ResearchHubHomepageAdmin {
    return { ...this.hubSettings };
  }

  public getHubSettings(): ResearchHubHomepageAdmin {
    return this.getResearchHubSettings();
  }

  public saveResearchHubSettings(settings: Partial<ResearchHubHomepageAdmin>): ResearchHubHomepageAdmin {
    this.hubSettings = {
      ...this.hubSettings,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage();
    return { ...this.hubSettings };
  }

  // ==========================================
  // INSTANT GLOBAL SEARCH ACROSS ALL RESOURCES
  // ==========================================
  public searchLibrary(query: string): GlobalSearchMatch[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: GlobalSearchMatch[] = [];

    // Search COAs
    this.coas.forEach((coa) => {
      const match =
        coa.product.toLowerCase().includes(q) ||
        coa.lotNumber.toLowerCase().includes(q) ||
        coa.laboratory.toLowerCase().includes(q) ||
        coa.tags.some((t) => t.toLowerCase().includes(q)) ||
        coa.searchKeywords.some((k) => k.toLowerCase().includes(q));

      if (match) {
        results.push({
          id: coa.id,
          type: 'COA',
          title: `${coa.product} (${coa.lotNumber})`,
          subtitle: `Lab: ${coa.laboratory} | Purity: ${coa.purity}% | Status: ${coa.status}`,
          tags: [coa.status, coa.laboratory, `${coa.purity}%`],
          linkTab: 'coa',
        });
      }
    });

    // Search Protocols
    this.protocols.forEach((proto) => {
      const match =
        proto.title.toLowerCase().includes(q) ||
        proto.category.toLowerCase().includes(q) ||
        proto.description.toLowerCase().includes(q) ||
        proto.procedure.toLowerCase().includes(q);

      if (match) {
        results.push({
          id: proto.id,
          type: 'PROTOCOL',
          title: proto.title,
          subtitle: `Category: ${proto.category} | Visibility: ${proto.visibility}`,
          tags: [proto.category, proto.visibility],
          linkTab: 'protocols',
        });
      }
    });

    // Search Price List
    this.priceList.forEach((item) => {
      const match =
        item.product.toLowerCase().includes(q) ||
        item.variant.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      if (match) {
        results.push({
          id: item.id,
          type: 'PRICELIST',
          title: `${item.product} - ${item.variant}`,
          subtitle: `USD $${item.usdPrice} | PHP ₱${item.phpPrice.toLocaleString()} (${item.category})`,
          tags: [item.category, `$${item.usdPrice}`],
          linkTab: 'price-list',
        });
      }
    });

    // Search Articles
    this.hubSettings.featuredArticles?.forEach((art) => {
      if (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: art.id,
          type: 'ARTICLE',
          title: art.title,
          subtitle: `Article: ${art.category} | ${art.readTime}`,
          tags: ['Article', art.category],
          linkTab: 'hub',
        });
      }
    });

    return results;
  }

  // ==========================================
  // EXPORT GENERATORS (CSV, Excel, Google Sheets)
  // ==========================================
  public exportData(type: 'COA' | 'PROTOCOL' | 'PRICELIST' | 'ALL', format: ExportFormat = 'csv') {
    let csvContent = '';
    let fileName = `GKN_Research_Library_Export_${new Date().toISOString().slice(0, 10)}`;

    if (type === 'COA' || type === 'ALL') {
      fileName = `GKN_COA_Library_${new Date().toISOString().slice(0, 10)}`;
      csvContent += '--- COA LIBRARY RECORDS ---\n';
      csvContent += 'ID,Product,Variant,Laboratory,Lot Number,Purity (%),Test Date,Expiration Date,Status,Visibility,PDF Reference,Chromatogram Reference\n';
      this.coas.forEach((c) => {
        csvContent += `"${c.id}","${c.product}","${c.variant}","${c.laboratory}","${c.lotNumber}",${c.purity},"${c.testDate}","${c.expirationDate}","${c.status}","${c.visibility}","${c.pdfUrl}","${c.chromatogramImageUrl}"\n`;
      });
      csvContent += '\n\n';
    }

    if (type === 'PROTOCOL' || type === 'ALL') {
      if (type === 'PROTOCOL') fileName = `GKN_Protocols_Export_${new Date().toISOString().slice(0, 10)}`;
      csvContent += '--- PROTOCOL REPOSITORY RECORDS ---\n';
      csvContent += 'ID,Title,Category,Visibility,Featured,Sort Order,Updated Date,PDF Reference\n';
      this.protocols.forEach((p) => {
        csvContent += `"${p.id}","${p.title.replace(/"/g, '""')}","${p.category}","${p.visibility}",${p.featured},${p.sortOrder},"${p.updatedAt}","${p.pdfUrl || ''}"\n`;
      });
      csvContent += '\n\n';
    }

    if (type === 'PRICELIST' || type === 'ALL') {
      if (type === 'PRICELIST') fileName = `GKN_Products_PriceList_${new Date().toISOString().slice(0, 10)}`;
      csvContent += '--- PRODUCTS PRICE LIST MATRIX ---\n';
      csvContent += 'ID,Product,Variant,USD Price,PHP Price,Category,Visibility,Featured\n';
      this.priceList.forEach((pr) => {
        csvContent += `"${pr.id}","${pr.product}","${pr.variant}",${pr.usdPrice},${pr.phpPrice},"${pr.category}","${pr.visibility}",${pr.featured}\n`;
      });
    }

    if (format === 'sheets') {
      // For Google Sheets, prompt copyable tab-delimited text or open prompt
      return {
        data: csvContent,
        mimeType: 'text/csv',
        fileName: `${fileName}.csv`,
        sheetsGuide: 'To import into Google Sheets: File -> Import -> Upload -> Select this CSV file.',
      };
    }

    // Default file trigger download for CSV / Excel
    const blob = new Blob([csvContent], { type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.${format === 'excel' ? 'xls' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      data: csvContent,
      fileName: `${fileName}.${format === 'excel' ? 'xls' : 'csv'}`,
    };
  }
}

export const researchLibraryManagerService = new ResearchLibraryManagerService();
