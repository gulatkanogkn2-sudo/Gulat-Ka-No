export interface COARecord {
  id: string;
  lotNumber: string;
  productName: string;
  category: string;
  purity: number; // e.g. 99.4
  testingLab: string;
  testDate: string;
  testType: 'HPLC & MS' | 'HPLC Purity' | 'Mass Spectrometry' | 'Heavy Metals';
  status: 'VERIFIED' | 'PENDING' | 'ARCHIVED';
  reportUrl?: string;
  summary: string;
  sequence?: string;
  molecularWeight?: string;
}

export interface ProtocolRecord {
  id: string;
  title: string;
  category: 'Storage & Handling' | 'Reconstitution' | 'Assay Standards' | 'Stability & Half-Life';
  shortDescription: string;
  fullContent: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced Laboratory';
  keyTakeaways: string[];
  pdfUrl?: string;
  updatedAt: string;
}

export interface PriceListItem {
  id: string;
  productName: string;
  category: 'GroupBuy' | 'OnHand' | 'MOQ Bulk';
  variant: string;
  priceUSD: number;
  pricePHP?: number;
  purity: string;
  moqUnits?: string;
  availability: 'In Stock' | 'Active Batch' | 'Custom Quote';
}

// Mock Database Records
const MOCK_COAS: COARecord[] = [
  {
    id: 'coa-001',
    lotNumber: 'GKN-TIRZ-2026-A1',
    productName: 'Tirzepatide Reference Standard',
    category: 'Metabolic Peptides',
    purity: 99.82,
    testingLab: 'Janoshik Analytical',
    testDate: '2026-07-15',
    testType: 'HPLC & MS',
    status: 'VERIFIED',
    summary: 'Verified >99.8% purity with identity confirmation.',
    sequence: 'Y-Aib-EGTFTSDYSIYLDKQAA-Aib-EFVNWLLAQGPSSGAPPPS-NH2',
    molecularWeight: '4813.52 g/mol',
  },
  {
    id: 'coa-002',
    lotNumber: 'GKN-SEMA-2026-B3',
    productName: 'Semaglutide 10mg Lyophilized',
    category: 'Metabolic Peptides',
    purity: 99.64,
    testingLab: 'Freedom Analytics Labs',
    testDate: '2026-07-10',
    testType: 'HPLC & MS',
    status: 'VERIFIED',
    summary: 'Chromatographic purity confirmed at 99.64%. Zero detectable trifluoroacetic acid residual salts.',
    sequence: 'H-EGTFTSDVSSYLEGQAAK(AEEAc-AEEAc-gamma-Glu-17-carboxyheptadecanoyl)EFIAWLVRGRG-OH',
    molecularWeight: '4113.58 g/mol',
  },
  {
    id: 'coa-003',
    lotNumber: 'GKN-[#00D9]-BPC-10M',
    productName: 'BPC-157 10mg High-Purity Standard',
    category: 'Tissue Repair',
    purity: 99.91,
    testingLab: 'Janoshik Analytical',
    testDate: '2026-06-28',
    testType: 'HPLC & MS',
    status: 'VERIFIED',
    summary: 'Exceptional 99.91% purity. Single main peak observed without degradation or isomer fragmentation.',
    sequence: 'Gly-Glu-Pro-[#00D9]-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
    molecularWeight: '1419.53 g/mol',
  },
  {
    id: 'coa-004',
    lotNumber: 'GKN-[#8B5C]-TB500-10M',
    productName: 'TB-500 (Thymosin Beta-4 Fragment)',
    category: 'Tissue Repair',
    purity: 99.45,
    testingLab: 'Independent Bio-Assay Labs',
    testDate: '2026-06-20',
    testType: 'HPLC Purity',
    status: 'VERIFIED',
    summary: 'Assay demonstrates 99.45% peptide content matching synthetic benchmarks.',
    sequence: 'Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-[#8B5C]-Glu-[#8B5C]-Glu-Gln-Glu-Lys-Gln-[#8B5C]',
    molecularWeight: '4963.50 g/mol',
  },
  {
    id: 'coa-005',
    lotNumber: 'GKN-[#FF2E]-CJC-DAC',
    productName: 'CJC-1295 with DAC 5mg',
    category: 'GH Secretagogues',
    purity: 99.12,
    testingLab: 'Janoshik Analytical',
    testDate: '2026-06-12',
    testType: 'Mass Spectrometry',
    status: 'VERIFIED',
    summary: 'Spectrum validates molecular mass of 3647.2 Da corresponding to CJC-1295 DAC complex.',
    sequence: 'Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Q-D-I-L-S-R-Lys(Maleimidopropionyl)-NH2',
    molecularWeight: '3647.28 g/mol',
  },
  {
    id: 'coa-006',
    lotNumber: 'GKN-RETAT-2026-X1',
    productName: 'Retatrutide 15mg Lyophilized',
    category: 'Metabolic Peptides',
    purity: 99.78,
    testingLab: 'Janoshik Analytical',
    testDate: '2026-07-22',
    testType: 'HPLC & MS',
    status: 'VERIFIED',
    summary: 'Triple agonist peptide standard verified 99.78% pure with exact target fragment spectra.',
    sequence: 'Y-Aib-EGTFTSDYSIYLDKQAA-Aib-EFVNWLLAQGPSSGAPPPS-NH2 (Triple Agonist Motif)',
    molecularWeight: '4731.33 g/mol',
  },
];

const MOCK_PROTOCOLS: ProtocolRecord[] = [
  {
    id: 'proto-001',
    title: 'Sterile Reconstitution & Diluent Solubilization',
    category: 'Reconstitution',
    shortDescription: 'Standard operating procedure for aseptic reconstitution of lyophilized research peptides using Bacteriostatic Water (0.9% Benzyl Alcohol).',
    fullContent: `1. PREPARATION & ASEPTIC AREA
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
    estimatedTime: '10 Mins',
    difficulty: 'Beginner',
    keyTakeaways: [
      'Never shake vial forcibly; gentle swirling prevents protein denaturation.',
      'Always aim diluent at glass inner wall.',
      'Reconstituted peptides should be refrigerated immediately.',
    ],
    updatedAt: '2026-07-18',
  },
  {
    id: 'proto-002',
    title: 'Long-Term Freeze Storage & Thermal Stability',
    category: 'Storage & Handling',
    shortDescription: 'Guidelines for dry storage, desiccated freezing, freeze-thaw cycle minimization, and shelf-life optimization.',
    fullContent: `1. UNRECONSTITUTED LYOPHILIZED STORAGE
• Lyophilized peptide powders are stable at room temperature for up to 30 days during transit.
• For long-term storage (6-24 months), keep dry lyophilized vials in dark freezer at -20°C or -80°C.

2. MINIMIZING FREEZE-THAW CYCLES
• Avoid repeated freeze-thaw cycles as phase transitions disrupt secondary peptide structure.
• Aliquot liquid solutions into single-use micro-tubes if long-term freezing is required after solubilization.

3. HUMIDITY CONTROL
• Equilibrate frozen vials to room temperature BEFORE opening container to prevent atmospheric condensation.`,
    estimatedTime: '15 Mins',
    difficulty: 'Intermediate',
    keyTakeaways: [
      'Lyophilized powders at -20°C remain stable for up to 24 months.',
      'Allow frozen vials to warm to room temperature before opening to avoid moisture absorption.',
    ],
    updatedAt: '2026-06-30',
  },
  {
    id: 'proto-003',
    title: 'Analytical Assay Standard Operating Procedure',
    category: 'Assay Standards',
    shortDescription: 'Analytical reference methodology for assay purity verification and detector setup.',
    fullContent: `1. CHROMATOGRAPHIC CONDITIONS
• Column: C18 Reverse-Phase (4.6mm x 250mm, 5µm particle size).
• Mobile Phase A: 0.1% TFA in LC-MS grade Water.
• Mobile Phase B: 0.1% TFA in LC-MS grade Acetonitrile.
• Flow Rate: 1.0 mL/min. Injection Volume: 10 µL.
• Detection Wavelength: 214 nm (peptide backbone absorption).

2. GRADIENT ELUTION PROGRAM
• 0 - 5 min: 10% B (Isocratic hold)
• 5 - 35 min: Linear gradient from 10% B to 70% B
• 35 - 40 min: Wash at 95% B
• 40 - 45 min: Re-equilibration at 10% B.`,
    estimatedTime: '45 Mins',
    difficulty: 'Advanced Laboratory',
    keyTakeaways: [
      'UV 214nm absorption captures peptide peptide-bond carbonyl excitation.',
      '0.1% TFA functions as an ion-pairing agent for optimal peak symmetry.',
    ],
    updatedAt: '2026-07-02',
  },
  {
    id: 'proto-004',
    title: 'Solution Degradation & pH Buffering Stability',
    category: 'Stability & Half-Life',
    shortDescription: 'Analytical reference on pH stability windows, oxidation prevention, and aqueous degradation kinetics.',
    fullContent: `1. OPTIMAL pH WINDOWS
• Most research peptides exhibit peak thermodynamic stability between pH 5.0 and pH 7.0.
• Extreme basic environments (pH > 8.5) promote deamidation of Asn/Gln residues and disulfide scrambling.

2. OXIDATION PROTECTANTS
• Methionine and Cysteine containing sequences are prone to oxidation. Store with nitrogen overlay or argon purging if required for micro-volume liquid storage.`,
    estimatedTime: '20 Mins',
    difficulty: 'Intermediate',
    keyTakeaways: [
      'Maintain pH 5.5 - 6.5 for maximum aqueous stability.',
      'Keep away from UV light sources and direct fluorescent illumination.',
    ],
    updatedAt: '2026-05-14',
  },
];

const MOCK_PRICES: PriceListItem[] = [
  {
    id: 'price-001',
    productName: 'Tirzepatide 10mg Lyophilized',
    category: 'GroupBuy',
    variant: '10mg Vial (10-pack Batch)',
    priceUSD: 180.00,
    pricePHP: 10440,
    purity: '>99.5%',
    moqUnits: '10 Vials / Box',
    availability: 'Active Batch',
  },
  {
    id: 'price-002',
    productName: 'Tirzepatide 15mg Lyophilized',
    category: 'GroupBuy',
    variant: '15mg Vial (10-pack Batch)',
    priceUSD: 240.00,
    pricePHP: 13920,
    purity: '>99.5%',
    moqUnits: '10 Vials / Box',
    availability: 'Active Batch',
  },
  {
    id: 'price-003',
    productName: 'Semaglutide 5mg Standard',
    category: 'OnHand',
    variant: '5mg Single Vial',
    priceUSD: 45.00,
    pricePHP: 2610,
    purity: '>99.6%',
    moqUnits: '1 Vial',
    availability: 'In Stock',
  },
  {
    id: 'price-004',
    productName: 'Semaglutide 10mg Standard',
    category: 'OnHand',
    variant: '10mg Single Vial',
    priceUSD: 75.00,
    pricePHP: 4350,
    purity: '>99.6%',
    moqUnits: '1 Vial',
    availability: 'In Stock',
  },
  {
    id: 'price-005',
    productName: 'BPC-157 10mg High-Purity',
    category: 'OnHand',
    variant: '10mg Single Vial',
    priceUSD: 38.00,
    pricePHP: 2204,
    purity: '>99.9%',
    moqUnits: '1 Vial',
    availability: 'In Stock',
  },
  {
    id: 'price-006',
    productName: 'TB-500 10mg Fragment',
    category: 'OnHand',
    variant: '10mg Single Vial',
    priceUSD: 42.00,
    pricePHP: 2436,
    purity: '>99.4%',
    moqUnits: '1 Vial',
    availability: 'In Stock',
  },
  {
    id: 'price-007',
    productName: 'Retatrutide 15mg Ultra',
    category: 'GroupBuy',
    variant: '15mg Vial (10-pack Batch)',
    priceUSD: 290.00,
    pricePHP: 16820,
    purity: '>99.7%',
    moqUnits: '10 Vials / Box',
    availability: 'Active Batch',
  },
  {
    id: 'price-008',
    productName: 'CJC-1295 DAC 5mg Bulk Quota',
    category: 'MOQ Bulk',
    variant: '100 Vials Institutional Box',
    priceUSD: 1450.00,
    pricePHP: 84100,
    purity: '>99.1%',
    moqUnits: '100 Vials',
    availability: 'Custom Quote',
  },
  {
    id: 'price-009',
    productName: 'Ipamorelin 10mg Bulk Quota',
    category: 'MOQ Bulk',
    variant: '100 Vials Institutional Box',
    priceUSD: 1350.00,
    pricePHP: 78300,
    purity: '>99.3%',
    moqUnits: '100 Vials',
    availability: 'Custom Quote',
  },
  {
    id: 'price-010',
    productName: 'NAD+ 500mg Lyophilized',
    category: 'OnHand',
    variant: '500mg Single Vial',
    priceUSD: 32.00,
    pricePHP: 1856,
    purity: '>99.8%',
    moqUnits: '1 Vial',
    availability: 'In Stock',
  },
];

export const ResearchService = {
  async getCoaRecords(query?: string, category?: string): Promise<COARecord[]> {
    // Simulated async delay prepared for future Supabase client fetch
    await new Promise((resolve) => setTimeout(resolve, 80));
    
    let results = [...MOCK_COAS];

    if (category && category.toLowerCase() !== 'all') {
      const lowerCat = category.toLowerCase();
      results = results.filter((item) =>
        item.category.toLowerCase().includes(lowerCat) ||
        item.testType.toLowerCase().includes(lowerCat)
      );
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.lotNumber.toLowerCase().includes(q) ||
          item.productName.toLowerCase().includes(q) ||
          item.testingLab.toLowerCase().includes(q) ||
          (item.sequence && item.sequence.toLowerCase().includes(q))
      );
    }

    return results;
  },

  async getProtocolRecords(query?: string, category?: string): Promise<ProtocolRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    let results = [...MOCK_PROTOCOLS];

    if (category && category.toLowerCase() !== 'all') {
      const lowerCat = category.toLowerCase();
      results = results.filter((item) =>
        item.category.toLowerCase().includes(lowerCat)
      );
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q) ||
          item.fullContent.toLowerCase().includes(q)
      );
    }

    return results;
  },

  async getPriceList(query?: string, category?: string): Promise<PriceListItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    let results = [...MOCK_PRICES];

    if (category && category.toLowerCase() !== 'all') {
      const lowerCat = category.toLowerCase();
      results = results.filter((item) =>
        item.category.toLowerCase().replace(/\s+/g, '').includes(lowerCat.replace(/\s+/g, '')) ||
        item.availability.toLowerCase().includes(lowerCat)
      );
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.productName.toLowerCase().includes(q) ||
          item.variant.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return results;
  },
};
