import {
  AdminProduct,
  AdminProductVariant,
  AdminStoreType,
  AdminProductStatus,
  ProductFilterParams,
  ProductListResult,
  ExportFormat,
} from '../types/adminProduct';
import { getStoreSellingUnitConfig } from '../utils/vialCalculation';
import type { DetailedProduct } from './productService';

export function isProductInStore(p: AdminProduct, targetStore: string): boolean {
  if (ProductManagementService.isProductDeleted(p.id, targetStore)) {
    return false;
  }
  if (p.isVisible === false) return false;
  const st = (p.status || '').toLowerCase();
  if (st === 'draft' || st === 'archived' || st === 'inactive' || st === 'hidden') {
    return false;
  }

  const normTarget = targetStore.toLowerCase().trim();
  const primaryStore = (p.storeType || 'groupbuy').toLowerCase().trim();

  if (primaryStore === normTarget) {
    return true;
  }

  if (normTarget === 'groupbuy' && p.groupBuySettings) return true;
  if (normTarget === 'onhand' && p.onHandSettings) return true;
  if (normTarget === 'moq' && p.moqSettings) return true;
  if (p.storeSettings && p.storeSettings[normTarget]) return true;

  return false;
}

export function convertAdminToDetailedProduct(p: AdminProduct, targetStore: string): DetailedProduct {
  const storeCfg = getStoreSellingUnitConfig(p, targetStore);

  const mappedVariants = (p.variants || []).map((v) => ({
    id: v.id,
    label: v.name || v.strength || v.size || 'Standard',
    price: v.price || p.price,
    costPrice: v.costPrice || p.price,
    inventoryQuantity: v.inventoryQuantity || 100,
    sku: v.sku || p.id,
  }));

  if (mappedVariants.length === 0) {
    mappedVariants.push({
      id: `${p.id}-default`,
      label: 'Standard',
      price: p.price,
      costPrice: p.price,
      inventoryQuantity: 100,
      sku: p.id,
    });
  }

  return {
    id: p.id,
    name: p.name,
    category: p.category || 'Peptides',
    description: p.shortDescription || p.fullDescription || p.name,
    longDescription: p.fullDescription,
    price: p.price,
    currency: p.currency || '$',
    imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    storeType: targetStore as any,
    status: p.status === 'Active' ? 'In Stock' : p.status,
    sellingUnit: storeCfg.sellingUnit,
    vialsPerKit: storeCfg.vialsPerKit,
    minQuantity: storeCfg.minQuantity,
    stepQuantity: storeCfg.stepQuantity,
    groupBuySettings: p.groupBuySettings,
    onHandSettings: p.onHandSettings,
    moqSettings: p.moqSettings,
    storeSettings: p.storeSettings,
    variants: mappedVariants,
    casNumber: p.casNumber,
    purity: p.purity,
    testingLab: p.testingLab,
    specifications: [
      { label: 'CAS Number', value: p.casNumber || 'N/A' },
      { label: 'Purity Level', value: p.purity || '≥99.0%' },
      { label: 'Testing Lab', value: p.testingLab || 'Janoshik Analytical' },
    ],
  };
}

// Seed Initial Products spanning GroupBuy, OnHand, and MOQ stores
const SEED_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod-gb-001',
    name: 'Tirzepatide',
    shortDescription: 'Research peptide available for GroupBuy pre-order.',
    category: 'Active',
    storeType: 'groupbuy',
    price: 120.0,
    currency: '$',
    status: 'Active',
    isVisible: true,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    adminNotes: 'Supplier pre-order allocation. Ships upon batch fulfillment.',
    lastUpdated: '2026-08-04 14:30',
    updatedBy: 'Admin Team',
    variants: [
      {
        id: 'var-gb-101',
        name: '10mg',
        price: 120.0,
        costPrice: 65.0,
        minOrder: 1,
        orderStep: 1,
        sku: 'GKN-TZ10-10MG',
      },
      {
        id: 'var-gb-102',
        name: '15mg',
        price: 165.0,
        costPrice: 85.0,
        minOrder: 1,
        orderStep: 1,
        sku: 'GKN-TZ10-15MG',
      },
    ],
  },
  {
    id: 'prod-oh-001',
    name: 'Semaglutide 5mg Vials',
    scientificName: 'GLP-1 Receptor Agonist Reference Standard',
    shortDescription: 'High-purity lyophilized Semaglutide standard available in ready-to-ship cold vault stock.',
    fullDescription: 'Reference peptide standard (>99.5% purity). Sealed under high-purity argon backfill for express dispatch.',
    category: 'OnHand',
    storeType: 'onhand',
    purity: '99.6%',
    price: 95.0,
    currency: '$',
    status: 'Active',
    isVisible: true,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    ],
    casNumber: '910463-68-2',
    testingLab: 'Janoshik Analytical',
    lastUpdated: '2026-08-05 01:15',
    updatedBy: 'Vault Supervisor Mark R.',
    variants: [
      {
        id: 'var-oh-101',
        name: '5mg Single Vial',
        strength: '5mg',
        size: '1 Vial',
        price: 95.0,
        costPrice: 42.0,
        minOrder: 1,
        orderStep: 1,
        inventoryQuantity: 340,
        sku: 'GKN-SEMA-5MG',
      },
      {
        id: 'var-oh-102',
        name: '5mg 10-Vial Box',
        strength: '5mg',
        size: '10 Vials Box',
        price: 850.0,
        costPrice: 380.0,
        minOrder: 1,
        orderStep: 1,
        inventoryQuantity: 45,
        sku: 'GKN-SEMA-5MG-BOX',
      },
    ],
    onHandSettings: {
      inventoryQuantity: 340,
      lowStockThreshold: 50,
      dispatchTime: 'Same-Day Cold Dispatch (24H)',
      warehouseLocation: 'Vault Section A-3',
    },
  },
  {
    id: 'prod-moq-001',
    name: 'Retatrutide 10mg (Custom Synthesis Batch)',
    scientificName: 'Triple Hormone Receptor Agonist (GIP/GLP-1/Glucagon)',
    shortDescription: 'Custom synthesis batch campaign for high-volume research laboratories requiring mass analytical grade retatrutide.',
    fullDescription: 'Retatrutide is a multi-target receptor agonist targeting GIP, GLP-1, and glucagon receptors. Produced via automated solid-phase peptide synthesis (SPPS) upon reaching batch quota.',
    category: 'Custom Synthesis',
    storeType: 'moq',
    purity: '99.5%',
    price: 340.0,
    currency: '$',
    status: 'Active',
    isVisible: true,
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    casNumber: '2381089-83-2',
    testingLab: 'MZ Biolabs Analytical',
    lastUpdated: '2026-08-03 18:00',
    updatedBy: 'Dr. Alex Vance',
    variants: [
      {
        id: 'var-moq-101',
        name: '10mg (10 Vials / Tray)',
        strength: '10mg',
        size: '10 Vials / Tray',
        price: 340.0,
        costPrice: 180.0,
        minOrder: 5,
        orderStep: 1,
        inventoryQuantity: 100,
        sku: 'GKN-RETA-10MG-MOQ',
      },
    ],
    moqSettings: {
      moqTarget: 100,
      currentProgress: 74,
      productionStatus: 'Collecting Orders',
      estimatedProductionDate: '2026-08-22',
      qualityControlNotice: 'COA provided with every batch tray',
    },
  },
  {
    id: 'prod-gb-002',
    name: 'BPC-157',
    shortDescription: '15-amino acid peptide available for GroupBuy pre-order.',
    category: 'Active',
    storeType: 'groupbuy',
    price: 45.0,
    currency: '$',
    status: 'Active',
    isVisible: true,
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    adminNotes: 'Batch allocation for research pre-orders.',
    lastUpdated: '2026-08-02 11:20',
    updatedBy: 'Admin Team',
    variants: [
      {
        id: 'var-gb-201',
        name: '5mg',
        price: 45.0,
        costPrice: 20.0,
        minOrder: 1,
        orderStep: 1,
        sku: 'GKN-BPC-5MG',
      },
    ],
  },
  {
    id: 'prod-oh-002',
    name: 'CJC-1295 No DAC 2mg Vials',
    scientificName: 'Tetrasubstituted GRF 1-29 Modified Peptide',
    shortDescription: 'In-stock modified growth hormone releasing factor reference standard.',
    fullDescription: 'Modified GRF (1-29) peptide standard without Drug Affinity Complex (DAC). Ready for immediate courier dispatch.',
    category: 'OnHand',
    storeType: 'onhand',
    purity: '99.1%',
    price: 38.0,
    currency: '$',
    status: 'Draft',
    isVisible: false,
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    casNumber: '863288-34-0',
    testingLab: 'Janoshik Analytical',
    lastUpdated: '2026-08-01 09:45',
    updatedBy: 'Dr. Alex Vance',
    variants: [
      {
        id: 'var-oh-201',
        name: '2mg Single Vial',
        strength: '2mg',
        size: '1 Vial',
        price: 38.0,
        costPrice: 16.0,
        minOrder: 1,
        orderStep: 1,
        inventoryQuantity: 80,
        sku: 'GKN-CJC-2MG',
      },
    ],
    onHandSettings: {
      inventoryQuantity: 80,
      lowStockThreshold: 20,
      dispatchTime: 'Same-Day Cold Dispatch (24H)',
      warehouseLocation: 'Vault Section B-1',
    },
  },
  {
    id: 'prod-moq-002',
    name: 'Ipamorelin 10mg Bulk Synthesis Quota',
    scientificName: 'Selective GH Secretagogue Pentapeptide',
    shortDescription: 'Bulk MOQ campaign for high-capacity analytical research requirements.',
    fullDescription: 'Ipamorelin pentapeptide custom synthesis batch reserved for registered institutional accounts.',
    category: 'Custom Synthesis',
    storeType: 'moq',
    purity: '99.4%',
    price: 280.0,
    currency: '$',
    status: 'Active',
    isVisible: true,
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    casNumber: '170851-70-4',
    testingLab: 'MZ Biolabs Analytical',
    lastUpdated: '2026-07-28 16:10',
    updatedBy: 'Admin Team',
    variants: [
      {
        id: 'var-moq-201',
        name: '10mg (10 Vials / Tray)',
        strength: '10mg',
        size: '10 Vials / Tray',
        price: 280.0,
        costPrice: 140.0,
        minOrder: 5,
        orderStep: 1,
        inventoryQuantity: 150,
        sku: 'GKN-IPA-10MG-MOQ',
      },
    ],
    moqSettings: {
      moqTarget: 150,
      currentProgress: 150,
      productionStatus: 'In Synthesis',
      estimatedProductionDate: '2026-08-10',
      qualityControlNotice: 'Synthesis in progress. Purity re-verification scheduled.',
    },
  },
  {
    id: 'prod-bac-water',
    name: 'Bacteriostatic Water (Bac Water)',
    shortDescription: 'USP grade 0.9% Benzyl Alcohol sterile diluent solvent for peptide reconstitution.',
    fullDescription: 'Sterile bacteriostatic water preserved with 0.9% Benzyl Alcohol. Essential solvent for lyophilized peptide research reconstitution.',
    category: 'Reconstitution & Supplies',
    storeType: 'groupbuy',
    price: 80.0,
    currency: '₱',
    status: 'Active',
    isVisible: true,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    lastUpdated: '2026-08-10 12:00',
    updatedBy: 'System Administrator',
    groupBuySettings: {
      batchId: 'gb-batch-01',
      batchName: 'Batch 14 - Active Collection',
      batchStatus: 'Active Collection',
      batchVisibility: 'Public',
      closingDate: '2026-08-30',
      sellingUnit: 'vial',
      minQuantity: 1,
    },
    onHandSettings: {
      inventoryQuantity: 500,
      lowStockThreshold: 50,
      dispatchTime: 'Same-Day Cold Dispatch',
      warehouseLocation: 'Vault Section BAC-1',
      sellingUnit: 'vial',
      minQuantity: 1,
    },
    moqSettings: {
      moqTarget: 100,
      currentProgress: 100,
      productionStatus: 'Ready To Ship',
      sellingUnit: 'vial',
      minQuantity: 1,
    },
    variants: [
      { id: 'var-bac-3ml', name: '3 mL', size: '3 mL Vial', price: 80.0, sku: 'BAC-WATER-3ML' },
      { id: 'var-bac-10ml', name: '10 mL', size: '10 mL Vial', price: 80.0, sku: 'BAC-WATER-10ML' },
      { id: 'var-bac-30ml', name: '30 mL', size: '30 mL Vial', price: 100.0, sku: 'BAC-WATER-30ML' },
    ],
  },
  {
    id: 'prod-syringe-pack',
    name: 'Sterile U-100 Syringes (10-Pack)',
    shortDescription: '1mL U-100 sterile insulin syringes with 31G 5/16" ultra-fine needle.',
    category: 'Reconstitution & Supplies',
    storeType: 'groupbuy',
    price: 120.0,
    currency: '₱',
    status: 'Active',
    isVisible: true,
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    lastUpdated: '2026-08-10 12:00',
    updatedBy: 'System Administrator',
    groupBuySettings: {
      batchId: 'gb-batch-01',
      batchName: 'Batch 14 - Active Collection',
      batchStatus: 'Active Collection',
      batchVisibility: 'Public',
      closingDate: '2026-08-30',
      sellingUnit: 'vial',
      minQuantity: 1,
    },
    onHandSettings: {
      inventoryQuantity: 300,
      lowStockThreshold: 30,
      dispatchTime: 'Same-Day Cold Dispatch',
      warehouseLocation: 'Vault Section SYR-1',
      sellingUnit: 'vial',
      minQuantity: 1,
    },
    moqSettings: {
      moqTarget: 50,
      currentProgress: 50,
      productionStatus: 'Ready To Ship',
      sellingUnit: 'vial',
      minQuantity: 1,
    },
    variants: [
      { id: 'var-syr-10pack', name: '10-Pack (1mL 31G)', price: 120.0, sku: 'SYRINGE-10PK' },
      { id: 'var-syr-30pack', name: '30-Pack (1mL 31G)', price: 320.0, sku: 'SYRINGE-30PK' },
    ],
  },
];

const ADMIN_PRODUCTS_STORAGE_KEY = 'gkn_admin_products_v2';
const DELETED_PRODUCTS_STORAGE_KEY = 'gkn_deleted_store_products_v2';

function loadDeletedFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch (err) {
    console.error('[ProductManagementService] Error loading deleted products:', err);
  }
  return new Set<string>();
}

function saveDeletedToStorage(deletedSet: Set<string>) {
  try {
    localStorage.setItem(DELETED_PRODUCTS_STORAGE_KEY, JSON.stringify(Array.from(deletedSet)));
  } catch (err) {
    console.error('[ProductManagementService] Error saving deleted products:', err);
  }
}

function loadProductsFromStorage(defaultSeed: AdminProduct[]): AdminProduct[] {
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as AdminProduct[];
      if (Array.isArray(arr) && arr.length >= 0) return arr;
    }
  } catch (err) {
    console.error('[ProductManagementService] Error loading products from storage:', err);
  }
  saveProductsToStorage(defaultSeed);
  return defaultSeed;
}

function saveProductsToStorage(products: AdminProduct[]) {
  try {
    localStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('[ProductManagementService] Error saving products to storage:', err);
  }
}

let deletedStoreProducts: Set<string> = loadDeletedFromStorage();
let mockProducts: AdminProduct[] = loadProductsFromStorage(SEED_PRODUCTS);

export const ProductManagementService = {
  /**
   * Get filtered products with pagination & store counts
   */
  async getProducts(params: ProductFilterParams = {}): Promise<ProductListResult> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const {
      search = '',
      storeType = 'all',
      category = 'all',
      status = 'all',
      sortBy = 'lastUpdated',
      sortOrder = 'desc',
      page = 1,
      pageSize = 10,
    } = params;

    let filtered = [...mockProducts].filter((p) => !ProductManagementService.isProductDeleted(p.id, storeType));

    // Search Filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.scientificName?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.casNumber?.toLowerCase().includes(q) ||
          p.variants.some((v) => v.sku?.toLowerCase().includes(q) || v.name.toLowerCase().includes(q))
      );
    }

    // Store Filter
    if (storeType !== 'all') {
      filtered = filtered.filter((p) => isProductInStore(p, storeType));
    }

    // Category Filter
    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // Status Filter
    if (status !== 'all') {
      filtered = filtered.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    // Sorting
    filtered.sort((a, b) => {
      let valA: any = a[sortBy as keyof AdminProduct];
      let valB: any = b[sortBy as keyof AdminProduct];

      if (sortBy === 'price') {
        valA = Number(a.price);
        valB = Number(b.price);
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Store counts for tab headers
    const storeCounts = {
      all: mockProducts.filter((p) => !ProductManagementService.isProductDeleted(p.id, 'all')).length,
      groupbuy: mockProducts.filter((p) => isProductInStore(p, 'groupbuy')).length,
      onhand: mockProducts.filter((p) => isProductInStore(p, 'onhand')).length,
      moq: mockProducts.filter((p) => isProductInStore(p, 'moq')).length,
    };

    // Pagination
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      products: paginated,
      totalCount,
      page,
      pageSize,
      totalPages,
      storeCounts,
    };
  },

  /**
   * Get single Product by ID
   */
  async getProductById(id: string): Promise<AdminProduct | null> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const found = mockProducts.find((p) => p.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  /**
   * Check if a product ID is deleted for a specific store or globally
   */
  isProductDeleted(id: string, targetStore?: string): boolean {
    const normStore = (targetStore || 'all').toLowerCase().trim();
    if (deletedStoreProducts.has(`${id}:*`) || deletedStoreProducts.has(`${id}:all`) || deletedStoreProducts.has(id)) {
      return true;
    }
    if (normStore !== 'all' && deletedStoreProducts.has(`${id}:${normStore}`)) {
      return true;
    }

    const altId = id.startsWith('prod-') ? id.replace('prod-', '') : `prod-${id}`;
    if (
      deletedStoreProducts.has(`${altId}:*`) ||
      deletedStoreProducts.has(`${altId}:all`) ||
      deletedStoreProducts.has(altId)
    ) {
      return true;
    }
    if (normStore !== 'all' && deletedStoreProducts.has(`${altId}:${normStore}`)) {
      return true;
    }

    return false;
  },

  /**
   * Create new product
   */
  async createProduct(productData: Omit<AdminProduct, 'id' | 'lastUpdated'>): Promise<AdminProduct> {
    await new Promise((resolve) => setTimeout(resolve, 120));

    const newId = `prod-${productData.storeType.slice(0, 2)}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newProduct: AdminProduct = {
      ...productData,
      id: newId,
      lastUpdated: now,
      updatedBy: 'Admin Team',
    };

    mockProducts = [newProduct, ...mockProducts];
    saveProductsToStorage(mockProducts);
    return JSON.parse(JSON.stringify(newProduct));
  },

  /**
   * Update existing product
   */
  async updateProduct(id: string, updates: Partial<AdminProduct>): Promise<AdminProduct> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updated = {
      ...mockProducts[index],
      ...updates,
      lastUpdated: now,
      updatedBy: 'Admin Team',
    };

    mockProducts[index] = updated;
    saveProductsToStorage(mockProducts);
    return JSON.parse(JSON.stringify(updated));
  },

  /**
   * Delete product, optionally isolated to a specific store tab
   */
  async deleteProduct(id: string, targetStore?: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    
    const normStore = (targetStore || 'all').toLowerCase().trim();
    const altId = id.startsWith('prod-') ? id.replace('prod-', '') : `prod-${id}`;

    // Record in deleted tracking
    if (normStore === 'all') {
      deletedStoreProducts.add(`${id}:*`);
      deletedStoreProducts.add(id);
      deletedStoreProducts.add(`${altId}:*`);
      deletedStoreProducts.add(altId);
    } else {
      deletedStoreProducts.add(`${id}:${normStore}`);
      deletedStoreProducts.add(`${altId}:${normStore}`);
    }
    saveDeletedToStorage(deletedStoreProducts);

    const index = mockProducts.findIndex((p) => p.id === id || p.id === altId);
    if (index !== -1) {
      const target = mockProducts[index];

      if (normStore === 'all') {
        mockProducts = mockProducts.filter((p) => p.id !== id && p.id !== altId);
      } else {
        if (normStore === 'groupbuy') delete target.groupBuySettings;
        if (normStore === 'onhand') delete target.onHandSettings;
        if (normStore === 'moq') delete target.moqSettings;
        if (target.storeSettings && target.storeSettings[normStore]) {
          delete target.storeSettings[normStore];
        }

        const remainingStores: AdminStoreType[] = [];
        if (target.groupBuySettings) remainingStores.push('groupbuy');
        if (target.onHandSettings) remainingStores.push('onhand');
        if (target.moqSettings) remainingStores.push('moq');

        if (target.storeSettings) {
          Object.keys(target.storeSettings).forEach((k) => {
            if (!remainingStores.includes(k as AdminStoreType)) {
              remainingStores.push(k as AdminStoreType);
            }
          });
        }

        if (remainingStores.length === 0) {
          mockProducts = mockProducts.filter((p) => p.id !== id && p.id !== altId);
          deletedStoreProducts.add(`${id}:*`);
          deletedStoreProducts.add(`${altId}:*`);
          saveDeletedToStorage(deletedStoreProducts);
        } else {
          if ((target.storeType || '').toLowerCase() === normStore) {
            target.storeType = remainingStores[0];
          }
        }
      }
    } else {
      mockProducts = mockProducts.filter((p) => p.id !== id && p.id !== altId);
    }

    saveProductsToStorage(mockProducts);
    return true;
  },

  /**
   * Duplicate product
   */
  async duplicateProduct(id: string): Promise<AdminProduct> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const altId = id.startsWith('prod-') ? id.replace('prod-', '') : `prod-${id}`;
    const target = mockProducts.find((p) => p.id === id || p.id === altId);
    if (!target) throw new Error(`Product ${id} not found to duplicate.`);

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const duplicated: AdminProduct = JSON.parse(JSON.stringify(target));
    duplicated.id = `prod-copy-${Date.now().toString().slice(-4)}`;
    duplicated.name = `${target.name} (Copy)`;
    duplicated.status = 'Draft';
    duplicated.isVisible = false;
    duplicated.lastUpdated = now;
    duplicated.updatedBy = 'Admin Team';

    mockProducts = [duplicated, ...mockProducts];
    saveProductsToStorage(mockProducts);
    return JSON.parse(JSON.stringify(duplicated));
  },

  /**
   * Manage Variants for a Product
   */
  async manageVariants(productId: string, variants: AdminProductVariant[]): Promise<AdminProduct> {
    return this.updateProduct(productId, { variants });
  },

  /**
   * Assign Store Type to Product
   */
  async assignStore(productId: string, storeType: AdminStoreType): Promise<AdminProduct> {
    return this.updateProduct(productId, { storeType });
  },

  /**
   * Update Visibility
   */
  async updateVisibility(productId: string, isVisible: boolean): Promise<AdminProduct> {
    return this.updateProduct(productId, { isVisible });
  },

  /**
   * Bulk Status Update
   */
  async bulkUpdateStatus(productIds: string[], status: AdminProductStatus): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    let updatedCount = 0;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    mockProducts = mockProducts.map((p) => {
      if (productIds.includes(p.id)) {
        updatedCount++;
        return {
          ...p,
          status,
          lastUpdated: now,
        };
      }
      return p;
    });

    saveProductsToStorage(mockProducts);
    return updatedCount;
  },

  /**
   * Bulk Delete Products (Store-Isolated)
   */
  async bulkDelete(productIds: string[], targetStore: string = 'all'): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    let deletedCount = 0;

    for (const id of productIds) {
      await this.deleteProduct(id, targetStore);
      deletedCount++;
    }

    return deletedCount;
  },

  /**
   * Export Products to CSV format for a specific store or all stores
   */
  async exportProducts(
    productIds: string[],
    format: ExportFormat = 'csv',
    targetStore: string = 'all'
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let targets = productIds.length > 0
      ? mockProducts.filter((p) => productIds.includes(p.id))
      : mockProducts;

    if (targetStore !== 'all') {
      targets = targets.filter((p) => p.storeType === targetStore);
    }

    const headers = [
      'Product Name',
      'Variant Name',
      'Store',
      'Category',
      'CAS Registry Number',
      'Short Description',
      'SKU',
      'USD Retail Price',
      'Manufacturer Cost',
      'Minimum Order',
      'Order Step',
      'Inventory Quantity',
      'Target Kits',
      'Status',
      'Visibility',
      'Last Updated',
    ];

    const rows: string[][] = [];

    targets.forEach((p) => {
      const storeStr = p.storeType.toLowerCase();
      const pName = `"${(p.name || '').replace(/"/g, '""')}"`;
      const cat = `"${(p.category || 'Active').replace(/"/g, '""')}"`;
      const cas = `"${(p.casNumber || '').replace(/"/g, '""')}"`;
      const desc = `"${(p.shortDescription || '').replace(/"/g, '""')}"`;
      const status = p.status || 'Active';
      const vis = p.isVisible ? 'Visible' : 'Hidden';
      const lastUpd = p.lastUpdated || '';

      const invQty = p.onHandSettings?.inventoryQuantity ?? p.variants[0]?.inventoryQuantity ?? '';
      const targetKits = p.moqSettings?.moqTarget ?? '';

      if (!p.variants || p.variants.length === 0) {
        rows.push([
          pName,
          '"10mg"',
          storeStr,
          cat,
          cas,
          desc,
          `"${pName}-10MG"`,
          (p.price || 0).toFixed(2),
          '0.00',
          '1',
          '1',
          invQty.toString(),
          targetKits.toString(),
          status,
          vis,
          lastUpd,
        ]);
      } else {
        p.variants.forEach((v) => {
          rows.push([
            pName,
            `"${(v.name || '10mg').replace(/"/g, '""')}"`,
            storeStr,
            cat,
            cas,
            desc,
            `"${(v.sku || '').replace(/"/g, '""')}"`,
            (v.price ?? p.price ?? 0).toFixed(2),
            (v.costPrice ?? 0).toFixed(2),
            (v.minOrder ?? 1).toString(),
            (v.orderStep ?? 1).toString(),
            (v.inventoryQuantity ?? invQty ?? '').toString(),
            targetKits.toString(),
            status,
            vis,
            lastUpd,
          ]);
        });
      }
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return csvContent;
  },

  /**
   * Import products from CSV content
   */
  async importProductsFromCsv(csvText: string, targetStore: string = 'groupbuy'): Promise<{ importedCount: number; variantCount: number; log: string[] }> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('CSV file is empty or missing data rows.');
    }

    const parseCsvLine = (line: string): string[] => {
      const result: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(cur.trim());
          cur = '';
        } else {
          cur += char;
        }
      }
      result.push(cur.trim());
      return result;
    };

    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    const findIndex = (possibleNames: string[]) => {
      for (const name of possibleNames) {
        const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const idx = headers.findIndex((h) => h.includes(clean));
        if (idx !== -1) return idx;
      }
      return -1;
    };

    const nameIdx = findIndex(['productname', 'name', 'title', 'product']);
    const variantIdx = findIndex(['variantname', 'variant', 'strength', 'size']);
    const storeIdx = findIndex(['store', 'storetype']);
    const categoryIdx = findIndex(['category', 'cat']);
    const casIdx = findIndex(['casregistrynumber', 'casnumber', 'cas']);
    const descIdx = findIndex(['shortdescription', 'description', 'summary']);
    const skuIdx = findIndex(['sku', 'code', 'skucode']);
    const priceIdx = findIndex(['usdretailprice', 'price', 'usdprice']);
    const costIdx = findIndex(['manufacturercost', 'costprice', 'cost']);
    const minOrderIdx = findIndex(['minimumorder', 'minorder']);
    const stepIdx = findIndex(['orderstep', 'step']);
    const invIdx = findIndex(['inventoryquantity', 'inventory', 'stock', 'quantity']);
    const targetKitsIdx = findIndex(['targetkits', 'moqtarget']);
    const statusIdx = findIndex(['status', 'productstatus']);
    const visIdx = findIndex(['visibility', 'visible']);

    const log: string[] = [];
    const storeToUse = (targetStore === 'all' ? 'groupbuy' : targetStore) as AdminStoreType;
    log.push(`Target store context: ${storeToUse.toUpperCase()}`);

    // Map to group variants by product name
    const productGroupMap = new Map<string, any>();

    for (let i = 1; i < lines.length; i++) {
      const row = parseCsvLine(lines[i]);
      if (row.length === 0 || row.every((c) => !c)) continue;

      const prodName = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : '';
      if (!prodName) {
        log.push(`Skipped row #${i}: Missing product name.`);
        continue;
      }

      const varName = variantIdx !== -1 && row[variantIdx] ? row[variantIdx] : '10mg';
      const rowStore = storeIdx !== -1 && row[storeIdx] ? row[storeIdx].toLowerCase() : storeToUse;
      const finalStore = (['groupbuy', 'onhand', 'moq'].includes(rowStore) ? rowStore : storeToUse) as AdminStoreType;

      const category = categoryIdx !== -1 && row[categoryIdx] ? row[categoryIdx] : 'Active';
      const casNumber = casIdx !== -1 && row[casIdx] ? row[casIdx] : '';
      const shortDescription = descIdx !== -1 && row[descIdx] ? row[descIdx] : '';
      const rawPrice = priceIdx !== -1 && row[priceIdx] ? parseFloat(row[priceIdx]) : 100.0;
      const price = isNaN(rawPrice) ? 100.0 : rawPrice;
      
      const rawCost = costIdx !== -1 && row[costIdx] ? parseFloat(row[costIdx]) : 50.0;
      const costPrice = isNaN(rawCost) ? 50.0 : rawCost;

      const rawMin = minOrderIdx !== -1 && row[minOrderIdx] ? parseInt(row[minOrderIdx]) : 1;
      const minOrder = isNaN(rawMin) ? 1 : rawMin;

      const rawStep = stepIdx !== -1 && row[stepIdx] ? parseInt(row[stepIdx]) : 1;
      const orderStep = isNaN(rawStep) ? 1 : rawStep;

      const sku = skuIdx !== -1 && row[skuIdx] ? row[skuIdx] : `${prodName.slice(0, 3).toUpperCase()}-${varName.toUpperCase().replace(/[^A-Z0-9]/g, '')}`;
      const statusStr = statusIdx !== -1 && row[statusIdx] ? row[statusIdx] : 'Active';
      const status = (['Active', 'Inactive', 'Draft', 'Hidden', 'Archived'].includes(statusStr) ? statusStr : 'Active') as AdminProductStatus;
      
      const visStr = visIdx !== -1 && row[visIdx] ? row[visIdx].toLowerCase() : 'visible';
      const isVisible = visStr !== 'false' && visStr !== 'hidden' && visStr !== '0';

      const invQty = invIdx !== -1 && row[invIdx] ? parseInt(row[invIdx]) : undefined;
      const targetKits = targetKitsIdx !== -1 && row[targetKitsIdx] ? parseInt(row[targetKitsIdx]) : undefined;

      const variantObj: AdminProductVariant = {
        id: `var-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`,
        name: varName,
        price,
        costPrice,
        minOrder,
        orderStep,
        sku,
        inventoryQuantity: invQty,
      };

      if (!productGroupMap.has(prodName.toLowerCase())) {
        productGroupMap.set(prodName.toLowerCase(), {
          name: prodName,
          category,
          casNumber,
          shortDescription,
          storeType: finalStore,
          price,
          currency: '$',
          status,
          isVisible,
          isFeatured: false,
          variants: [variantObj],
          onHandSettings: finalStore === 'onhand' ? {
            inventoryQuantity: invQty ?? 100,
            lowStockThreshold: 20,
            dispatchTime: 'Same-Day Cold Dispatch (24H)',
            warehouseLocation: 'Vault Section A-1',
          } : undefined,
          moqSettings: finalStore === 'moq' ? {
            moqTarget: targetKits ?? 100,
            currentProgress: 0,
            productionStatus: 'Collecting Orders',
            autoCloseOnTarget: true,
            autoHideOnOrdered: true,
          } : undefined,
        });
      } else {
        const existing = productGroupMap.get(prodName.toLowerCase());
        existing.variants.push(variantObj);
      }
    }

    let createdProductsCount = 0;
    let totalVariantsCount = 0;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    for (const [, pData] of productGroupMap.entries()) {
      const newId = `prod-${pData.storeType.slice(0, 2)}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;
      const newProduct: AdminProduct = {
        ...pData,
        id: newId,
        lastUpdated: now,
        updatedBy: 'CSV Import',
      };
      mockProducts = [newProduct, ...mockProducts];
      createdProductsCount++;
      totalVariantsCount += pData.variants.length;
    }

    log.push(`Imported ${createdProductsCount} products with ${totalVariantsCount} variants into ${storeToUse.toUpperCase()} store.`);
    return {
      importedCount: createdProductsCount,
      variantCount: totalVariantsCount,
      log,
    };
  },

  /**
   * Get available categories for filter dropdowns
   */
  getCategories(): string[] {
    const set = new Set(mockProducts.map((p) => p.category));
    return Array.from(set);
  },

  /**
   * Get raw list of all AdminProduct entries
   */
  getRawProducts(): AdminProduct[] {
    return [...mockProducts];
  },

  /**
   * Get products active for a specific store as DetailedProduct array for storefront display
   */
  getProductsForStore(targetStore: string): DetailedProduct[] {
    return mockProducts
      .filter((p) => isProductInStore(p, targetStore))
      .map((p) => convertAdminToDetailedProduct(p, targetStore));
  },
};
