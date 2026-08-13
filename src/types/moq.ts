import { DetailedProduct } from '../services/productService';

export type MoqManufacturingStatus =
  | 'Collecting Orders'
  | 'Ready To Order'
  | 'Ordered'
  | 'Manufacturing'
  | 'In Transit'
  | 'Received'
  | 'Ready To Ship'
  | 'Completed'
  | 'Almost Reached'
  | 'MOQ Achieved';

export interface MoqHeaderInfo {
  storeTitle: string;
  customManufacturingBadge: string;
  moqProgressSummary: string;
  productionStatus: MoqManufacturingStatus;
  estimatedManufacturingTimeline: string;
  laboratoryProductionNotice: string;
  manufacturingQueueBadge: string;
  totalActiveMoqCampaigns: number;
  activeQueuePosition: string;
  avgLeadTime: string;
}

export interface MoqProduct extends DetailedProduct {
  isVisible?: boolean;
  moqTarget: number;
  moqCurrent: number;
  moqUnitLabel: string; // e.g. 'Kits', 'Vials', 'Grams'
  moqProgressPercent: number;
  moqRemaining: number;
  manufacturingStatus: MoqManufacturingStatus;
  estimatedProductionStart: string;
  estimatedCompletion: string;
  queuePosition?: string;
  qualityControlNotice?: string;
  batchNumber?: string;
}

export interface MoqFilters {
  search?: string;
  category?: string;
  manufacturingStatus?: string;
  progressRange?: string; // e.g., 'all', '0-25', '25-50', '50-75', '75-99', '100'
  variant?: string;
  purity?: string;
  sort?: string;
}

export interface MoqWorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
}
