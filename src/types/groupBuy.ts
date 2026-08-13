import { DetailedProduct } from '../services/productService';

export type GroupBuyBatchStatus = 'Open' | 'Closing Soon' | 'Closed' | 'Processing' | 'Completed';

export interface GroupBuyBatch {
  id: string;
  batchNumber: string;
  title: string;
  status: GroupBuyBatchStatus;
  openingDate: string;
  closingDate: string; // ISO date string for countdown timer
  estimatedShipDate: string;
  estimatedLabFulfillment: string;
  minBatchAllocation: string;
  progressPercent: number;
  currentFunding: number;
  targetFunding: number;
  unitsReserved: number;
  targetUnits: number;
  currency: string;
  description: string;
  researchAllocationNotice: string;
  isActive: boolean;
}

export interface GroupBuyFilters {
  search?: string;
  category?: string;
  sort?: string;
  availability?: string;
}
