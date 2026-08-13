import { DetailedProduct } from '../services/productService';

export type OnHandInventoryStatus = 'Ready' | 'Low Stock' | 'Almost Sold Out' | 'Out of Stock' | 'Recently Restocked';

export interface OnHandHeaderInfo {
  storeTitle: string;
  statusBadge: string;
  totalInStockItems: number;
  coldChainReadyPercent: number;
  sameDayDispatchCutoff: string;
  dispatchNotice: string;
  shippingNotice: string;
  coldChainReminder: string;
  labInventoryBadge: string;
  storageFacility: string;
}

export interface OnHandFilters {
  search?: string;
  category?: string;
  availability?: string;
  sort?: string;
  purity?: string;
  variant?: string;
}

export interface OnHandProduct extends DetailedProduct {
  availableStockQuantity?: number;
  estimatedDispatchTime?: string;
  coldChainRequired?: boolean;
  storageTemperature?: string;
  laboratoryGrade?: string;
}
