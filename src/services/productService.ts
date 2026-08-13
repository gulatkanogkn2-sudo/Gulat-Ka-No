import { ProductData } from '../components/product/ProductCard';
import {
  ProductManagementService,
  convertAdminToDetailedProduct,
} from './productManagementService';

export interface DetailedProduct extends ProductData {
  id: string;
  category: string;
  longDescription?: string;
  purity?: string;
  testingLab?: string;
  casNumber?: string;
  sequence?: string;
  molecularFormula?: string;
  molecularWeight?: string;
  appearance?: string;
  storageConditions?: string;
  reconstitutionInstructions?: string;
  specifications?: { label: string; value: string }[];
  gallery?: string[];
  availability?: string;
  fulfillmentTime?: string;
}

// GroupBuy Store Products
const MOCK_GROUPBUY_PRODUCTS: DetailedProduct[] = [
  {
    id: 'gb-001',
    name: 'Tirzepatide (GKN-TZ10)',
    description: 'Dual GIP/GLP-1 receptor agonist peptide batch allocation for metabolic research.',
    longDescription: 'Tirzepatide is a synthetic dual glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist. Prepared under strict aseptic lyophilization protocols.',
    price: 120.0,
    originalPrice: 150.0,
    currency: '$',
    unitInfo: '/ 10 Vials Kit',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    ],
    storeType: 'groupbuy',
    status: 'Batch Open',
    stockStatus: 'In Stock',
    stockText: 'GroupBuy Staging - 85% Reserved',
    category: 'active',
    purity: '99.4%',
    testingLab: 'Janoshik Analytical',
    casNumber: '2023788-19-2',
    sequence: 'YXEGTFTSDVSSYLEGQAAKEFIAWLVRGRG',
    molecularFormula: 'C225H348N48O68',
    molecularWeight: '4813.52 g/mol',
    appearance: 'White lyophilized powder',
    storageConditions: 'Store at -20°C desicized. Protect from direct ambient UV light.',
    reconstitutionInstructions: 'Reconstitute with 2.0 mL Bacteriostatic Water (0.9% Benzyl Alcohol). Swirl gently.',
    variants: [
      { id: '10mg-10vials', label: '10mg (10 Vials / Kit)', price: 120.0 },
      { id: '15mg-10vials', label: '15mg (10 Vials / Kit)', price: 165.0 },
      { id: '30mg-5vials', label: '30mg (5 Vials / Kit)', price: 190.0 },
    ],
    specifications: [
      { label: 'Formulation', value: 'Lyophilized Cake' },
      { label: 'Assay Standard', value: '≥ 99.4%' },
      { label: 'Mass Spectrometry', value: 'Confirmed (ESI-MS)' },
      { label: 'Endotoxin Level', value: '< 0.05 EU/mg' },
      { label: 'Batch Lot', value: 'GB-TZ-2026-08' },
    ],
    minQuantity: 1,
    maxQuantity: 20,
    stepQuantity: 1,
  },
  {
    id: 'gb-002',
    name: 'Retatrutide (GKN-RT05)',
    description: 'Triple GIP/GLP-1/Glucagon tri-agonist peptide batch allocation.',
    longDescription: 'Retatrutide (LY3437943) is an experimental triple agonist targeting GIP, GLP-1, and glucagon receptors. Engineered for research models inspecting multi-pathway metabolic kinetics.',
    price: 145.0,
    originalPrice: 180.0,
    currency: '$',
    unitInfo: '/ 10 Vials Kit',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    ],
    storeType: 'groupbuy',
    status: 'Staging',
    stockStatus: 'In Stock',
    stockText: 'GroupBuy Staging - 60% Reserved',
    category: 'staging',
    purity: '99.6%',
    testingLab: 'Janoshik Analytical',
    casNumber: '2381089-83-2',
    molecularWeight: '4731.33 g/mol',
    appearance: 'White lyophilized powder',
    storageConditions: 'Store sealed at -20°C.',
    reconstitutionInstructions: 'Reconstitute with sterile BAC water.',
    variants: [
      { id: '5mg-10vials', label: '5mg (10 Vials / Kit)', price: 145.0 },
      { id: '10mg-10vials', label: '10mg (10 Vials / Kit)', price: 210.0 },
    ],
    specifications: [
      { label: 'Formulation', value: 'Lyophilized Cake' },
      { label: 'Assay Standard', value: '≥ 99.6%' },
      { label: 'Mass Spectrometry', value: 'Confirmed' },
      { label: 'Batch Lot', value: 'GB-RT-2026-08' },
    ],
    minQuantity: 1,
    maxQuantity: 10,
    stepQuantity: 1,
  },
  {
    id: 'gb-003',
    name: 'Semaglutide (GKN-SM05)',
    description: 'GLP-1 receptor agonist reference peptide for metabolic research assays.',
    longDescription: 'Semaglutide is a long-acting GLP-1 receptor agonist with high sequence stability and prolonged receptor binding affinity in quantitative research assays.',
    price: 85.0,
    originalPrice: 110.0,
    currency: '$',
    unitInfo: '/ 10 Vials Kit',
    imageUrl: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=600&q=80',
    storeType: 'groupbuy',
    status: 'Batch Open',
    stockStatus: 'In Stock',
    stockText: 'GroupBuy Staging - 92% Reserved',
    category: 'active',
    purity: '99.5%',
    testingLab: 'MZ Biolabs',
    casNumber: '910463-68-2',
    variants: [
      { id: '5mg-10vials', label: '5mg (10 Vials / Kit)', price: 85.0 },
      { id: '10mg-10vials', label: '10mg (10 Vials / Kit)', price: 135.0 },
    ],
    specifications: [
      { label: 'Purity Standard', value: '≥ 99.5%' },
      { label: 'Batch Lot', value: 'GB-SM-2026-08' },
    ],
    minQuantity: 1,
    maxQuantity: 15,
    stepQuantity: 1,
  },
  {
    id: 'gb-004',
    name: 'Cagrilintide (GKN-CG05)',
    description: 'Long-acting amylin analogue peptide for combination research studies.',
    longDescription: 'Cagrilintide is a non-selective amylin receptor agonist investigated in co-formulation assays alongside GLP-1 receptor ligands.',
    price: 110.0,
    originalPrice: 135.0,
    currency: '$',
    unitInfo: '/ 10 Vials Kit',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    storeType: 'groupbuy',
    status: 'Staging',
    stockStatus: 'In Stock',
    stockText: 'GroupBuy Staging - 40% Reserved',
    category: 'staging',
    purity: '99.2%',
    testingLab: 'Janoshik Analytical',
    variants: [
      { id: '5mg-10vials', label: '5mg (10 Vials / Kit)', price: 110.0 },
      { id: '10mg-5vials', label: '10mg (5 Vials / Kit)', price: 130.0 },
    ],
    specifications: [
      { label: 'Purity Standard', value: '≥ 99.2%' },
      { label: 'Batch Lot', value: 'GB-CG-2026-08' },
    ],
    minQuantity: 1,
    maxQuantity: 10,
    stepQuantity: 1,
  },
  {
    id: 'gb-005',
    name: 'Mazdutide (GKN-MZ10)',
    description: 'Dual OXM analogue peptide targeting GLP-1 and glucagon receptors.',
    longDescription: 'Mazdutide (IBI362) is an oxyntomodulin analogue designed for comparative metabolic rate assays and energy expenditure research.',
    price: 135.0,
    originalPrice: 165.0,
    currency: '$',
    unitInfo: '/ 10 Vials Kit',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    storeType: 'groupbuy',
    status: 'Batch Open',
    stockStatus: 'In Stock',
    stockText: 'GroupBuy Staging - 75% Reserved',
    category: 'active',
    purity: '99.3%',
    testingLab: 'Janoshik Analytical',
    variants: [
      { id: '10mg-10vials', label: '10mg (10 Vials / Kit)', price: 135.0 },
    ],
    specifications: [
      { label: 'Purity Standard', value: '≥ 99.3%' },
      { label: 'Batch Lot', value: 'GB-MZ-2026-08' },
    ],
    minQuantity: 1,
    maxQuantity: 10,
    stepQuantity: 1,
  },
  {
    id: 'gb-006',
    name: 'Survodutide (GKN-SV10)',
    description: 'Dual glucagon/GLP-1 receptor agonist peptide batch allocation.',
    longDescription: 'Survodutide (BI 456906) is a dual receptor agonist investigated for metabolic and liver tissue homeostasis research models.',
    price: 150.0,
    originalPrice: 185.0,
    currency: '$',
    unitInfo: '/ 10 Vials Kit',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    storeType: 'groupbuy',
    status: 'Staging',
    stockStatus: 'In Stock',
    stockText: 'GroupBuy Staging - 50% Reserved',
    category: 'staging',
    purity: '99.4%',
    testingLab: 'MZ Biolabs',
    variants: [
      { id: '10mg-10vials', label: '10mg (10 Vials / Kit)', price: 150.0 },
    ],
    specifications: [
      { label: 'Purity Standard', value: '≥ 99.4%' },
      { label: 'Batch Lot', value: 'GB-SV-2026-08' },
    ],
    minQuantity: 1,
    maxQuantity: 10,
    stepQuantity: 1,
  },
];

// OnHand Store Products
const MOCK_ONHAND_PRODUCTS: DetailedProduct[] = [
  {
    id: 'oh-001',
    name: 'BPC-157 Direct Dispatch',
    description: 'Pentadecapeptide BPC-157 available for immediate laboratory dispatch.',
    longDescription: 'Body Protection Compound-157 (BPC-157) is a pentadecapeptide consisting of 15 amino acids derived from human gastric juice sequence. High stability in aqueous solution.',
    price: 38.0,
    originalPrice: 48.0,
    currency: '$',
    unitInfo: '/ Single Vial',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    ],
    storeType: 'onhand',
    status: 'In Stock',
    stockStatus: 'In Stock',
    stockText: '24 units in stock',
    category: 'in-stock',
    purity: '99.7%',
    testingLab: 'Janoshik Analytical',
    casNumber: '137525-51-0',
    sequence: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
    molecularFormula: 'C62H98N16O22',
    molecularWeight: '1419.53 g/mol',
    appearance: 'White lyophilized powder',
    storageConditions: 'Store at 2°C to 8°C after receipt.',
    reconstitutionInstructions: 'Reconstitute with 2.0 mL sterile BAC water.',
    variants: [
      { id: '5mg-vial', label: '5mg Vial', price: 38.0 },
      { id: '10mg-vial', label: '10mg Vial', price: 62.0 },
      { id: '10x5mg-box', label: 'Box of 10x 5mg Vials', price: 290.0 },
    ],
    specifications: [
      { label: 'Purity (HPLC)', value: '≥ 99.7%' },
      { label: 'Dispatched From', value: 'Local Cold Warehouse' },
      { label: 'Shipping Speed', value: 'Same-Day Cold Ship' },
    ],
    minQuantity: 1,
    maxQuantity: 50,
    stepQuantity: 1,
  },
  {
    id: 'oh-002',
    name: 'TB-500 (Thymosin Beta-4)',
    description: 'Synthetic 43-amino acid peptide for cell migration and tissue repair research.',
    longDescription: 'TB-500 is a synthetic version of the naturally occurring peptide present in virtually all human and animal cells. High-purity reference material.',
    price: 42.0,
    originalPrice: 52.0,
    currency: '$',
    unitInfo: '/ Single Vial',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    storeType: 'onhand',
    status: 'In Stock',
    stockStatus: 'In Stock',
    stockText: '18 units in stock',
    category: 'in-stock',
    purity: '99.5%',
    testingLab: 'MZ Biolabs',
    casNumber: '77591-33-4',
    molecularWeight: '4963.5 g/mol',
    variants: [
      { id: '5mg-vial', label: '5mg Vial', price: 42.0 },
      { id: '10mg-vial', label: '10mg Vial', price: 72.0 },
      { id: '5x5mg-kit', label: 'Kit (5x 5mg Vials)', price: 185.0 },
    ],
    specifications: [
      { label: 'Purity Standard', value: '≥ 99.5%' },
      { label: 'Stock Status', value: 'Ready for Immediate Dispatch' },
    ],
    minQuantity: 1,
    maxQuantity: 30,
    stepQuantity: 1,
  },
  {
    id: 'oh-003',
    name: 'BPC-157 / TB-500 Blend (5mg + 5mg)',
    description: 'Dual synergistic 1:1 ratio lyophilized tissue repair research blend.',
    longDescription: 'Premixed 5mg BPC-157 and 5mg TB-500 in a single sterile 10mg lyophilized matrix for dual assay standardizations.',
    price: 75.0,
    originalPrice: 90.0,
    currency: '$',
    unitInfo: '/ 10mg Blend Vial',
    imageUrl: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=600&q=80',
    storeType: 'onhand',
    status: 'In Stock',
    stockStatus: 'In Stock',
    stockText: '12 units in stock',
    category: 'blends',
    purity: '99.6%',
    testingLab: 'Janoshik Analytical',
    variants: [
      { id: '10mg-blend', label: '10mg Blend Vial (5+5)', price: 75.0 },
      { id: '5x10mg-box', label: 'Box of 5x 10mg Blends', price: 330.0 },
    ],
    specifications: [
      { label: 'Blend Ratio', value: '1:1 (5mg BPC / 5mg TB)' },
      { label: 'Combined Purity', value: '≥ 99.6%' },
    ],
    minQuantity: 1,
    maxQuantity: 20,
    stepQuantity: 1,
  },
  {
    id: 'oh-004',
    name: 'GHK-Cu (Copper Peptide)',
    description: 'Tripeptide copper complex for dermal remodeling and cellular turnover assays.',
    longDescription: 'GHK-Cu (Glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring copper complex. Lyophilized deep blue powder.',
    price: 35.0,
    originalPrice: 45.0,
    currency: '$',
    unitInfo: '/ 50mg Vial',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    storeType: 'onhand',
    status: 'In Stock',
    stockStatus: 'In Stock',
    stockText: '30 units in stock',
    category: 'reference',
    purity: '99.8%',
    testingLab: 'Janoshik Analytical',
    casNumber: '49557-75-7',
    variants: [
      { id: '50mg-vial', label: '50mg Blue Powder Vial', price: 35.0 },
      { id: '100mg-vial', label: '100mg Blue Powder Vial', price: 58.0 },
    ],
    specifications: [
      { label: 'Purity Standard', value: '≥ 99.8%' },
      { label: 'Appearance', value: 'Intense Blue Lyophilized Powder' },
    ],
    minQuantity: 1,
    maxQuantity: 50,
    stepQuantity: 1,
  },
  {
    id: 'oh-005',
    name: 'NAD+ Reference Standard',
    description: 'Nicotinamide Adenine Dinucleotide 500mg lyophilized coenzyme standard.',
    longDescription: 'High-grade cellular coenzyme NAD+ for enzymatic kinetics and mitochondrial respiration assays.',
    price: 48.0,
    originalPrice: 60.0,
    currency: '$',
    unitInfo: '/ 500mg Vial',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    storeType: 'onhand',
    status: 'In Stock',
    stockStatus: 'In Stock',
    stockText: '15 units in stock',
    category: 'reference',
    purity: '99.4%',
    testingLab: 'MZ Biolabs',
    variants: [
      { id: '500mg-vial', label: '500mg Vial', price: 48.0 },
      { id: '1000mg-vial', label: '1000mg Vial (1 Gram)', price: 85.0 },
    ],
    specifications: [
      { label: 'Purity', value: '≥ 99.4%' },
      { label: 'Storage', value: 'Freeze at -20°C' },
    ],
    minQuantity: 1,
    maxQuantity: 20,
    stepQuantity: 1,
  },
  {
    id: 'oh-006',
    name: 'BAC Water (Bacteriostatic Water)',
    description: 'USP grade 0.9% Benzyl Alcohol diluent for peptide reconstitution.',
    longDescription: 'Sterile 30mL bacteriostatic water containing 0.9% benzyl alcohol preservative. Essential diluent solvent for lyophilized peptide reconstitution.',
    price: 12.0,
    originalPrice: 15.0,
    currency: '$',
    unitInfo: '/ 30mL Vial',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    storeType: 'onhand',
    status: 'In Stock',
    stockStatus: 'In Stock',
    stockText: '100+ units in stock',
    category: 'in-stock',
    purity: 'USP Grade 0.9% BA',
    testingLab: 'ISO Certified Facility',
    variants: [
      { id: '30ml-single', label: '30mL Single Vial', price: 12.0 },
      { id: '30ml-5pack', label: 'Pack of 5x 30mL Vials', price: 50.0 },
    ],
    specifications: [
      { label: 'Grade', value: 'USP Sterile Reconstitution' },
      { label: 'Preservative', value: '0.9% Benzyl Alcohol' },
    ],
    minQuantity: 1,
    maxQuantity: 100,
    stepQuantity: 1,
  },
];

// MOQ Store Products
const MOCK_MOQ_PRODUCTS: DetailedProduct[] = [
  {
    id: 'moq-001',
    name: 'Bulk Tirzepatide Raw Powder (1g+ MOQ)',
    description: 'Bulk raw peptide powder procurement tier with 99.4% purity standard.',
    longDescription: 'High-capacity raw Tirzepatide synthesis batch for institutional research laboratories requiring bulk gram-scale allocations.',
    price: 450.0,
    originalPrice: 550.0,
    currency: '$',
    unitInfo: '/ 1 Gram MOQ Tier',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    ],
    storeType: 'moq',
    status: 'Quota Open',
    stockStatus: 'In Stock',
    stockText: 'MOQ Quota - 500g Target (65% Reserved)',
    category: 'bulk-sequences',
    purity: '99.4%',
    testingLab: 'Janoshik Analytical',
    casNumber: '2023788-19-2',
    variants: [
      { id: '1g-powder', label: '1g Bulk Powder Tier', price: 450.0 },
      { id: '5g-powder', label: '5g Bulk Powder Tier', price: 1950.0 },
      { id: '10g-institutional', label: '10g Institutional Contract', price: 3500.0 },
    ],
    specifications: [
      { label: 'MOQ Minimum', value: '1.0 Gram' },
      { label: 'Purity Standard', value: '≥ 99.4%' },
      { label: 'Packaging', value: 'Vacuum Sealed Argon Foil Pouch' },
    ],
    minQuantity: 1,
    maxQuantity: 10,
    stepQuantity: 1,
  },
  {
    id: 'moq-002',
    name: 'Bulk Retatrutide Raw Powder (1g+ MOQ)',
    description: 'Bulk synthesis tier for triple-agonist retatrutide raw powder standards.',
    longDescription: 'Bulk gram-scale Retatrutide for quantitative structural and bio-assay research facilities.',
    price: 580.0,
    originalPrice: 700.0,
    currency: '$',
    unitInfo: '/ 1 Gram MOQ Tier',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    storeType: 'moq',
    status: 'Quota Open',
    stockStatus: 'In Stock',
    stockText: 'MOQ Quota - 250g Target (50% Reserved)',
    category: 'bulk-sequences',
    purity: '99.6%',
    testingLab: 'Janoshik Analytical',
    variants: [
      { id: '1g-powder', label: '1g Bulk Powder Tier', price: 580.0 },
      { id: '5g-powder', label: '5g Bulk Powder Tier', price: 2600.0 },
    ],
    specifications: [
      { label: 'MOQ Minimum', value: '1.0 Gram' },
      { label: 'Assay Standard', value: '≥ 99.6%' },
    ],
    minQuantity: 1,
    maxQuantity: 10,
    stepQuantity: 1,
  },
  {
    id: 'moq-003',
    name: 'Institutional BPC-157 Custom Synthesis (100 Vials MOQ)',
    description: 'Bulk 100-vial tray custom synthesis order for research institutions.',
    longDescription: 'High-volume custom lyophilization run of 10mg BPC-157 vials packed into 100-vial sterile laboratory trays.',
    price: 1800.0,
    originalPrice: 2200.0,
    currency: '$',
    unitInfo: '/ 100 Vials Tray',
    imageUrl: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=600&q=80',
    storeType: 'moq',
    status: 'Quota Open',
    stockStatus: 'In Stock',
    stockText: 'MOQ Quota - 1,000 Vials Target',
    category: 'institutional',
    purity: '99.7%',
    testingLab: 'Janoshik Analytical',
    variants: [
      { id: '100-vials-10mg', label: '100 Vials Tray (10mg each)', price: 1800.0 },
      { id: '250-vials-10mg', label: '250 Vials Bulk Contract', price: 3900.0 },
    ],
    specifications: [
      { label: 'MOQ Minimum', value: '100 Vials' },
      { label: 'Unit Vial Mass', value: '10mg Lyophilized' },
    ],
    minQuantity: 1,
    maxQuantity: 5,
    stepQuantity: 1,
  },
  {
    id: 'moq-004',
    name: 'Bulk Semaglutide High-Purity Powder (1g+ MOQ)',
    description: 'Bulk raw Semaglutide powder for quantitative chromatography and stability assays.',
    longDescription: 'Pure Semaglutide peptide raw powder supplied with verification analysis.',
    price: 390.0,
    originalPrice: 480.0,
    currency: '$',
    unitInfo: '/ 1 Gram MOQ Tier',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    storeType: 'moq',
    status: 'Quota Open',
    stockStatus: 'In Stock',
    stockText: 'MOQ Quota - 300g Target',
    category: 'bulk-sequences',
    purity: '99.5%',
    testingLab: 'MZ Biolabs',
    variants: [
      { id: '1g-powder', label: '1g Bulk Powder Tier', price: 390.0 },
      { id: '5g-powder', label: '5g Bulk Powder Tier', price: 1750.0 },
    ],
    specifications: [
      { label: 'MOQ Minimum', value: '1.0 Gram' },
      { label: 'Purity Standard', value: '≥ 99.5%' },
    ],
    minQuantity: 1,
    maxQuantity: 10,
    stepQuantity: 1,
  },
  {
    id: 'moq-005',
    name: 'Custom Peptide Sequence Synthesis Contract',
    description: 'Custom monomer & sequence peptide synthesis with guaranteed ≥98% purity.',
    longDescription: 'Custom solid-phase peptide synthesis (SPPS) for proprietary research sequences. Includes custom amino acid coupling and purification.',
    price: 950.0,
    originalPrice: 1200.0,
    currency: '$',
    unitInfo: '/ Custom Run',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    storeType: 'moq',
    status: 'Quota Open',
    stockStatus: 'In Stock',
    stockText: 'Custom Synthesis Queue Open',
    category: 'custom-purity',
    purity: 'Custom (98%-99.9%)',
    testingLab: 'ISO Analytical Lab',
    variants: [
      { id: '100mg-custom', label: '100mg Custom Sequence Run', price: 950.0 },
      { id: '500mg-custom', label: '500mg Custom Sequence Run', price: 2400.0 },
    ],
    specifications: [
      { label: 'Synthesis Type', value: 'Solid Phase (SPPS)' },
      { label: 'Purity Guarantee', value: '≥ 98.0%' },
    ],
    minQuantity: 1,
    maxQuantity: 5,
    stepQuantity: 1,
  },
];

export const ProductService = {
  // Fetch GroupBuy Store Products
  async getGroupBuyProducts(search?: string, category?: string): Promise<DetailedProduct[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Query live admin product store
    const adminProducts = ProductManagementService.getProductsForStore('groupbuy');
    const existingIds = new Set(adminProducts.map((p) => p.id));
    
    // Merge admin products with mock products that aren't duplicated or deleted
    let result = [
      ...adminProducts,
      ...MOCK_GROUPBUY_PRODUCTS.filter(
        (p) => !existingIds.has(p.id) && !ProductManagementService.isProductDeleted(p.id, 'groupbuy')
      ),
    ];

    if (category && category !== 'all') {
      result = result.filter((p) => p.category === category || p.status?.toLowerCase().includes(category.toLowerCase()));
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.variants?.some((v) =>
            typeof v === 'string'
              ? v.toLowerCase().includes(q)
              : v.label.toLowerCase().includes(q)
          )
      );
    }

    return result;
  },

  // Fetch OnHand Store Products
  async getOnHandProducts(search?: string, category?: string): Promise<DetailedProduct[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Query live admin product store
    const adminProducts = ProductManagementService.getProductsForStore('onhand');
    const existingIds = new Set(adminProducts.map((p) => p.id));

    let result = [
      ...adminProducts,
      ...MOCK_ONHAND_PRODUCTS.filter(
        (p) => !existingIds.has(p.id) && !ProductManagementService.isProductDeleted(p.id, 'onhand')
      ),
    ];

    if (category && category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.variants?.some((v) =>
            typeof v === 'string'
              ? v.toLowerCase().includes(q)
              : v.label.toLowerCase().includes(q)
          )
      );
    }

    return result;
  },

  // Fetch MOQ Store Products
  async getMoqProducts(search?: string, category?: string): Promise<DetailedProduct[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Query live admin product store
    const adminProducts = ProductManagementService.getProductsForStore('moq');
    const existingIds = new Set(adminProducts.map((p) => p.id));

    let result = [
      ...adminProducts,
      ...MOCK_MOQ_PRODUCTS.filter(
        (p) => !existingIds.has(p.id) && !ProductManagementService.isProductDeleted(p.id, 'moq')
      ),
    ];

    if (category && category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.variants?.some((v) =>
            typeof v === 'string'
              ? v.toLowerCase().includes(q)
              : v.label.toLowerCase().includes(q)
          )
      );
    }

    return result;
  },

  // Get single product by ID from any store
  async getProductById(id: string): Promise<DetailedProduct | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (ProductManagementService.isProductDeleted(id)) {
      return null;
    }
    
    // First check Admin Product Management Service
    const adminProduct = ProductManagementService.getRawProducts().find((p) => p.id === id);
    if (adminProduct && !ProductManagementService.isProductDeleted(id, adminProduct.storeType)) {
      return convertAdminToDetailedProduct(adminProduct, adminProduct.storeType || 'groupbuy');
    }

    // Check if it's an MOQ product and pull enriched metrics from moqService if available
    if (id.startsWith('moq-')) {
      const { MOQService } = await import('./moqService');
      const moqProducts = await MOQService.getProducts();
      const match = moqProducts.find((p) => p.id === id);
      if (match && !ProductManagementService.isProductDeleted(id, 'moq')) return match;
    }

    const all = [...MOCK_GROUPBUY_PRODUCTS, ...MOCK_ONHAND_PRODUCTS, ...MOCK_MOQ_PRODUCTS].filter(
      (p) => !ProductManagementService.isProductDeleted(p.id)
    );
    return all.find((p) => p.id === id) || null;
  },
};
