export type AdminStoreType = 'groupbuy' | 'onhand' | 'moq';

export type AdminProductStatus = 'Active' | 'Inactive' | 'Draft' | 'Hidden' | 'Archived';

export interface AdminProductVariant {
  id: string;
  name: string; // Variant Name / Label (represents Strength e.g. 10mg)
  strength?: string;
  size?: string;
  price: number;
  costPrice?: number; // Manufacturer Cost
  minOrder?: number;
  orderStep?: number;
  inventoryQuantity?: number; // Store-specific inventory / reserved stock (OnHand only)
  sku?: string;
}

export interface GroupBuyStoreSettings {
  batchId: string;
  batchName: string;
  batchStatus: 'Pre-Order' | 'Active Collection' | 'In Production' | 'Completed';
  batchVisibility: 'Public' | 'Private' | 'Hidden';
  closingDate: string;
  progressPercent?: number;
  sellingUnit?: 'vial' | 'kit';
  vialsPerKit?: number;
  minQuantity?: number;
  stepQuantity?: number;
  minOrder?: number;
  orderStep?: number;
}

export interface OnHandStoreSettings {
  inventoryQuantity: number;
  lowStockThreshold: number;
  dispatchTime: string; // e.g. "Same-Day Cold Dispatch"
  warehouseLocation?: string;
  sellingUnit?: 'vial' | 'kit';
  vialsPerKit?: number;
  minQuantity?: number;
  stepQuantity?: number;
  minOrder?: number;
  orderStep?: number;
}

export type MoqLifecycleStatus =
  | 'Collecting Orders'
  | 'Ready To Order'
  | 'Ordered'
  | 'Manufacturing'
  | 'In Transit'
  | 'Received'
  | 'Ready To Ship'
  | 'Completed';

export interface MoqStoreSettings {
  moqTarget: number;
  currentProgress: number;
  productionStatus: MoqLifecycleStatus | string;
  autoCloseWhenTargetReached?: boolean;
  autoHideWhenStatusOrdered?: boolean;
  estimatedProductionDate?: string;
  qualityControlNotice?: string;
  sellingUnit?: 'vial' | 'kit';
  vialsPerKit?: number;
  minQuantity?: number;
  stepQuantity?: number;
  minOrder?: number;
  orderStep?: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  scientificName?: string;
  shortDescription: string;
  fullDescription?: string;
  adminNotes?: string; // Internal Admin Notes (never shown to customers)
  category: string;
  storeType: AdminStoreType;
  purity?: string;
  price: number;
  currency: string;
  status: AdminProductStatus;
  isVisible: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  gallery?: string[];
  casNumber?: string;
  testingLab?: string;
  lastUpdated: string;
  updatedBy?: string;
  variants: AdminProductVariant[];
  
  // Selling Unit Architecture
  sellingUnit?: 'vial' | 'kit';
  vialsPerKit?: number; // Configurable vials count per kit (default 10)

  // Store-specific settings
  groupBuySettings?: GroupBuyStoreSettings;
  onHandSettings?: OnHandStoreSettings;
  moqSettings?: MoqStoreSettings;
  storeSettings?: Record<string, { sellingUnit?: 'vial' | 'kit'; vialsPerKit?: number; [key: string]: any }>;
}

export interface ProductFilterParams {
  search?: string;
  storeType?: string; // 'all' | 'groupbuy' | 'onhand' | 'moq'
  category?: string;
  status?: string;
  sortBy?: 'name' | 'price' | 'category' | 'status' | 'lastUpdated' | 'store';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ProductListResult {
  products: AdminProduct[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  storeCounts: {
    all: number;
    groupbuy: number;
    onhand: number;
    moq: number;
  };
}

export type ExportFormat = 'csv' | 'excel' | 'sheets';
