import { GroupBuyBatch, GroupBuyFilters } from '../types/groupBuy';
import { ProductService, DetailedProduct } from './productService';
import { systemSettingsService } from './systemSettingsService';
import { getEffectiveStoreStatus } from '../utils/storeStatusUtils';

// Active GroupBuy Batch State Model (Prepared for Admin controls)
let currentActiveBatch: GroupBuyBatch = {
  id: 'gb-batch-1',
  batchNumber: 'Batch #1',
  title: 'Batch #1 Allocation',
  status: 'Open',
  openingDate: '2026-08-01',
  closingDate: '2026-08-20T23:59:59Z',
  estimatedShipDate: 'Sep 01 – Sep 10, 2026',
  estimatedLabFulfillment: 'Late August 2026',
  minBatchAllocation: '10 Vials Kit / Minimum Order Tier',
  progressPercent: 78,
  currentFunding: 39000,
  targetFunding: 50000,
  unitsReserved: 780,
  targetUnits: 1000,
  currency: '$',
  description:
    'Batch #2026-08 pools institutional & community research demand to achieve raw synthesis volume discounts on GLP-1, GIP, and triple-agonist peptide candidates. All products in this batch undergo quality verification prior to sterile packaging.',
  researchAllocationNotice:
    'Strict Laboratory Notice: All products listed in Batch #2026-08 are provided strictly for in-vitro analytical research. Orders are fulfilled once batch funding reaches target thresholds.',
  isActive: true,
};

export const GroupBuyService = {
  /**
   * Check if GroupBuy store is open using effective store status engine
   */
  isStoreOpen(): boolean {
    const storeSettings = systemSettingsService.getSettings().stores?.groupbuy;
    return getEffectiveStoreStatus(storeSettings).isOpen;
  },

  /**
   * Fetch current active GroupBuy batch details synced with system settings
   */
  async getActiveBatch(): Promise<GroupBuyBatch> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const storeSettings = systemSettingsService.getSettings().stores?.groupbuy;
    const statusResult = getEffectiveStoreStatus(storeSettings);

    return {
      ...currentActiveBatch,
      status: statusResult.isOpen ? 'Open' : 'Closed',
      isActive: statusResult.isOpen,
    };
  },

  /**
   * Fetch GroupBuy products with search, category, sort, and availability filters
   */
  async getProducts(filters: GroupBuyFilters = {}): Promise<DetailedProduct[]> {
    const rawProducts = await ProductService.getGroupBuyProducts(filters.search, filters.category);
    let result = rawProducts.map((p) => ({
      ...p,
      batchNumber: p.batchNumber || currentActiveBatch.batchNumber,
      storeType: 'groupbuy' as const,
    }));

    // Apply Availability filter
    if (filters.availability && filters.availability !== 'all') {
      const avail = filters.availability.toLowerCase();
      result = result.filter((p) => {
        const status = (p.status || '').toLowerCase();
        const stockStatus = (p.stockStatus || '').toLowerCase();
        if (avail === 'open') return status.includes('open') || status.includes('active');
        if (avail === 'closing') return status.includes('closing') || stockStatus.includes('closing');
        if (avail === 'staging') return status.includes('staging') || stockStatus.includes('staging');
        if (avail === 'in-stock') return stockStatus.includes('in stock') || status.includes('available');
        return true;
      });
    }

    // Apply Sorting
    if (filters.sort) {
      if (filters.sort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (filters.sort === 'purity-desc') {
        result.sort((a, b) => {
          const pA = parseFloat((a.purity || '0').replace('%', ''));
          const pB = parseFloat((b.purity || '0').replace('%', ''));
          return pB - pA;
        });
      }
    }

    return result;
  },

  /**
   * Get GroupBuy rules and campaign parameters
   */
  async getBatchRules(): Promise<{
    currentBatch: string;
    closingDate: string;
    minAllocation: string;
    expectedDispatch: string;
    batchStatus: string;
    fulfillmentLeadTime: string;
  }> {
    const batch = await this.getActiveBatch();
    return {
      currentBatch: batch.batchNumber,
      closingDate: new Date(batch.closingDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      minAllocation: batch.minBatchAllocation,
      expectedDispatch: batch.estimatedShipDate,
      batchStatus: batch.status,
      fulfillmentLeadTime: '10–14 Business Days Post-Batch Closure',
    };
  },

  /**
   * Prepared Admin method for updating active batch state
   */
  async updateActiveBatch(data: Partial<GroupBuyBatch>): Promise<GroupBuyBatch> {
    currentActiveBatch = {
      ...currentActiveBatch,
      ...data,
    };
    return { ...currentActiveBatch };
  },
};
