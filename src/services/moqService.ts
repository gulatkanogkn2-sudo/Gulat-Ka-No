import {
  MoqHeaderInfo,
  MoqProduct,
  MoqFilters,
  MoqManufacturingStatus,
} from '../types/moq';
import { ProductService } from './productService';

// Active MOQ Store Header State Model (Prepared for Admin & Automation)
let currentMoqHeaderInfo: MoqHeaderInfo = {
  storeTitle: 'Custom Laboratory Manufacturing Quotas',
  customManufacturingBadge: 'CUSTOM SYNTHESIS & SCALE-UP',
  moqProgressSummary: '74% Average Batch Target Capacity Reached Across Active Quotas',
  productionStatus: 'Collecting Orders',
  estimatedManufacturingTimeline: '2–3 Weeks Post-MOQ Quota Fulfillment',
  laboratoryProductionNotice: 'Production runs initiate strictly upon reaching 100% Minimum Order Quantity threshold verification.',
  manufacturingQueueBadge: 'BATCH RUN #MOQ-2026-Q3',
  totalActiveMoqCampaigns: 8,
  activeQueuePosition: 'Queue Position #03 – Active Slot',
  avgLeadTime: '14–21 Business Days',
};

// Internal mutable dataset for MOQ Campaign Products
let moqProductsStore: MoqProduct[] = [];

// Automation Helper Functions (Exposed for future business automation phase)
export const MoqAutomation = {
  calculateProgress(current: number, target: number) {
    const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    const remaining = Math.max(0, target - current);
    return { percent, remaining };
  },

  determineStatus(percent: number): MoqManufacturingStatus {
    if (percent >= 100) return 'MOQ Achieved';
    if (percent >= 85) return 'Almost Reached';
    if (percent >= 50) return 'Collecting Orders';
    return 'Collecting Orders';
  },
};

// Initialize MOQ Product Dataset from ProductService & supplement with full MOQ metrics
async function initializeMoqProducts() {
  if (moqProductsStore.length === 0) {
    const raw = await ProductService.getMoqProducts();

    // Production storefront data must come only from Supabase. Campaign
    // progress remains absent until real campaign metrics are configured.
    moqProductsStore = raw.map((product) => ({ ...product, storeType: 'moq' }));
  }
}

export const MOQService = {
  /**
   * Fetch MOQ Dashboard Header Information
   */
  async getHeaderInfo(): Promise<MoqHeaderInfo> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { ...currentMoqHeaderInfo };
  },

  /**
   * Fetch MOQ Products with instant multi-parameter filtering & sorting
   */
  async getProducts(filters: MoqFilters = {}): Promise<MoqProduct[]> {
    await initializeMoqProducts();
    let result = [...moqProductsStore];

    // Exclude products whose status is ORDERED or beyond in the fulfillment lifecycle from customer browsing
    const hiddenStatuses = ['ordered', 'manufacturing', 'in transit', 'received', 'ready to ship', 'completed'];
    result = result.filter(
      (p) =>
        p.isVisible !== false &&
        !hiddenStatuses.includes((p.manufacturingStatus || '').toLowerCase())
    );

    // 1. Search Query (Name, Description, CAS, Sequence, Batch Number)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.batchNumber?.toLowerCase().includes(q) ||
          p.casNumber?.toLowerCase().includes(q) ||
          p.purity?.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // 3. Manufacturing Status Filter
    if (filters.manufacturingStatus && filters.manufacturingStatus !== 'all') {
      const statusFilter = filters.manufacturingStatus.toLowerCase();
      result = result.filter((p) => {
        const s = p.manufacturingStatus.toLowerCase();
        if (statusFilter === 'collecting') return s.includes('collecting');
        if (statusFilter === 'almost') return s.includes('almost');
        if (statusFilter === 'achieved') return s.includes('achieved');
        if (statusFilter === 'scheduled') return s.includes('scheduled');
        if (statusFilter === 'manufacturing') return s.includes('manufacturing');
        if (statusFilter === 'qc') return s.includes('quality') || s.includes('qc');
        if (statusFilter === 'completed') return s.includes('completed');
        return true;
      });
    }

    // 4. Progress Range Filter (%)
    if (filters.progressRange && filters.progressRange !== 'all') {
      const pr = filters.progressRange;
      result = result.filter((p) => {
        const pct = p.moqProgressPercent;
        if (pr === '0-25') return pct >= 0 && pct <= 25;
        if (pr === '25-50') return pct > 25 && pct <= 50;
        if (pr === '50-75') return pct > 50 && pct <= 75;
        if (pr === '75-99') return pct > 75 && pct < 100;
        if (pr === '100') return pct >= 100;
        return true;
      });
    }

    // 5. Purity Filter
    if (filters.purity && filters.purity !== 'all') {
      result = result.filter((p) => {
        if (!p.purity) return false;
        if (filters.purity === '99.5+') return parseFloat(p.purity) >= 99.5;
        if (filters.purity === '99.0+') return parseFloat(p.purity) >= 99.0;
        return true;
      });
    }

    // 6. Variant Type Filter
    if (filters.variant && filters.variant !== 'all') {
      const vFilter = filters.variant.toLowerCase();
      result = result.filter((p) => {
        if (vFilter === 'powder') return p.name.toLowerCase().includes('powder') || p.unitInfo?.toLowerCase().includes('gram');
        if (vFilter === 'tray') return p.name.toLowerCase().includes('tray') || p.unitInfo?.toLowerCase().includes('vials');
        if (vFilter === 'bulk') return p.category === 'bulk-sequences' || p.name.toLowerCase().includes('bulk');
        return true;
      });
    }

    // 7. Sorting
    if (filters.sort) {
      if (filters.sort === 'progress-desc') {
        result.sort((a, b) => b.moqProgressPercent - a.moqProgressPercent);
      } else if (filters.sort === 'progress-asc') {
        result.sort((a, b) => a.moqProgressPercent - b.moqProgressPercent);
      } else if (filters.sort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return result;
  },

  /**
   * Filter dropdown options metadata
   */
  getFilterOptions() {
    return {
      categories: [
        { id: 'all', label: 'All Manufacturing Quotas' },
        { id: 'bulk-sequences', label: 'Bulk Synthetic Sequences' },
        { id: 'custom-purity', label: 'Custom Purity Standards' },
        { id: 'institutional', label: 'Institutional Tray Contracts' },
      ],
      manufacturingStatuses: [
        { id: 'all', label: 'All Manufacturing Statuses' },
        { id: 'collecting', label: 'Collecting Orders' },
        { id: 'almost', label: 'Almost Reached (75%+)' },
        { id: 'achieved', label: 'MOQ Achieved (100%)' },
        { id: 'scheduled', label: 'Production Scheduled' },
        { id: 'manufacturing', label: 'Manufacturing In-Progress' },
        { id: 'qc', label: 'Quality Control' },
        { id: 'completed', label: 'Completed Batches' },
      ],
      progressRanges: [
        { id: 'all', label: 'All Progress Ranges' },
        { id: '75-99', label: '75% – 99% (Near Fulfillment)' },
        { id: '50-75', label: '50% – 75% (Halfway)' },
        { id: '25-50', label: '25% – 50% (Early Stage)' },
        { id: '0-25', label: '0% – 25% (Newly Launched)' },
        { id: '100', label: '100% Fully Reached' },
      ],
      purities: [
        { id: 'all', label: 'All Purity Standards' },
        { id: '99.5+', label: '≥ 99.5% Ultra-Pure' },
        { id: '99.0+', label: '≥ 99.0% Standard' },
      ],
      variants: [
        { id: 'all', label: 'All Order Formats' },
        { id: 'powder', label: 'Gram-Scale Bulk Powder' },
        { id: 'tray', label: '100-Vial Sterile Trays' },
        { id: 'bulk', label: 'Institutional Bulk Contracts' },
      ],
      sorts: [
        { id: 'featured', label: 'Featured Quotas' },
        { id: 'progress-desc', label: 'Highest MOQ Progress %' },
        { id: 'progress-asc', label: 'Lowest MOQ Progress %' },
        { id: 'price-asc', label: 'Price: Low to High' },
        { id: 'price-desc', label: 'Price: High to Low' },
        { id: 'name-asc', label: 'Alphabetical A-Z' },
      ],
    };
  },

  /**
   * Educational and Workflow Information for MOQ Information Panel
   */
  getMoqInformation() {
    return {
      title: 'Understanding Minimum Order Quantity (MOQ) Custom Synthesis',
      description:
        'Custom synthesis and high-volume peptide manufacturing require dedicated chemical reactor setup, argon gas purification environments, and specialized cGMP lyophilization runs. The MOQ model aggregates demand to unlock volume pricing.',
      sections: [
        {
          id: 'what-is-moq',
          title: 'What is Minimum Order Quantity (MOQ)?',
          description:
            'An MOQ target represents the minimum cumulative order volume required by our synthesis facility to justify powering raw synthesis reactors, calibrating purification columns, and executing a dedicated sterile lyophilization batch.',
        },
        {
          id: 'when-manufacturing-begins',
          title: 'When Does Manufacturing Begin?',
          description:
            'Synthesis initiates immediately once the product quota reaches 100% of its required MOQ threshold. Customers receive automated production scheduling updates as the batch transitions from reactor synthesis to purification.',
        },
        {
          id: 'why-moq-exists',
          title: 'Why Does MOQ Exist?',
          description:
            'Custom high-purity chemical synthesis has high fixed initial setup costs. Aggregating institutional and individual research orders into single production queues drops unit pricing by 40%–60% compared to single-unit custom quotes.',
        },
        {
          id: 'quality-assurance',
          title: 'Laboratory Quality Assurance & Verification',
          description:
            'Every completed MOQ batch undergoes mandatory quality assay and structural confirmation prior to release.',
        },
      ],
      workflowSteps: [
        {
          stepNumber: 1,
          title: 'Order Quota Aggregation',
          description: 'Research orders accumulate in the public batch queue until 100% MOQ is funded.',
          iconName: 'Users',
        },
        {
          stepNumber: 2,
          title: 'Reactor Setup & Synthesis',
          description: 'Chemical synthesis starts in specialized solid-phase peptide synthesizer reactors.',
          iconName: 'FlaskConical',
        },
        {
          stepNumber: 3,
          title: 'Column Purification',
          description: 'Preparative purification isolates target peptide sequences to high purity standards.',
          iconName: 'Sparkles',
        },
        {
          stepNumber: 4,
          title: 'Sterile Lyophilization & QC',
          description: 'Lyophilization into sterile glass vials followed by quality certification.',
          iconName: 'CheckCircle',
        },
      ],
    };
  },

  // =========================================================
  // AUTOMATION PREPARATION & FUTURE ADMIN INTEGRATION METHODS
  // =========================================================

  /**
   * Prepared Admin / Automation method: Update product MOQ progress when a new order is placed
   */
  async updateMoqProgress(productId: string, additionalUnits: number): Promise<MoqProduct | null> {
    await initializeMoqProducts();
    const idx = moqProductsStore.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      const p = moqProductsStore[idx];
      const newCurrent = p.moqCurrent + additionalUnits;
      const { percent, remaining } = MoqAutomation.calculateProgress(newCurrent, p.moqTarget);
      const newStatus = percent >= 100 ? 'MOQ Achieved' : MoqAutomation.determineStatus(percent);

      moqProductsStore[idx] = {
        ...p,
        moqCurrent: newCurrent,
        moqProgressPercent: percent,
        moqRemaining: remaining,
        manufacturingStatus: newStatus,
        status: percent >= 100 ? 'MOQ Achieved' : 'Quota Open',
      };
      return { ...moqProductsStore[idx] };
    }
    return null;
  },

  /**
   * Prepared Admin method: Schedule production dates and transition manufacturing status
   */
  async scheduleProduction(
    productId: string,
    productionStart: string,
    completionDate: string,
    status: MoqManufacturingStatus = 'Manufacturing'
  ): Promise<MoqProduct | null> {
    await initializeMoqProducts();
    const idx = moqProductsStore.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      moqProductsStore[idx] = {
        ...moqProductsStore[idx],
        estimatedProductionStart: productionStart,
        estimatedCompletion: completionDate,
        manufacturingStatus: status,
      };
      return { ...moqProductsStore[idx] };
    }
    return null;
  },

  /**
   * Prepared Admin method: Generic MOQ Product updater
   */
  async updateMoqProduct(id: string, updates: Partial<MoqProduct>): Promise<MoqProduct | null> {
    await initializeMoqProducts();
    const idx = moqProductsStore.findIndex((p) => p.id === id);
    if (idx !== -1) {
      moqProductsStore[idx] = { ...moqProductsStore[idx], ...updates };
      return { ...moqProductsStore[idx] };
    }
    return null;
  },

  /**
   * Prepared Admin method: Update Store Header info
   */
  async updateHeaderInfo(updates: Partial<MoqHeaderInfo>): Promise<MoqHeaderInfo> {
    currentMoqHeaderInfo = { ...currentMoqHeaderInfo, ...updates };
    return { ...currentMoqHeaderInfo };
  },
};
