import { OnHandHeaderInfo, OnHandFilters, OnHandProduct } from '../types/onHand';
import { ProductService, DetailedProduct } from './productService';

// Mutable store state for header & inventory (prepared for future Admin service calls)
let currentHeaderInfo: OnHandHeaderInfo = {
  storeTitle: 'OnHand Direct Laboratory Inventory',
  statusBadge: 'READY FOR DISPATCH',
  totalInStockItems: 142,
  coldChainReadyPercent: 100,
  sameDayDispatchCutoff: '2:00 PM EST',
  dispatchNotice: 'Same-day shipping guaranteed for orders placed before 2:00 PM EST.',
  shippingNotice: 'Express 1–2 day courier dispatch with real-time temperature telemetry tracking.',
  coldChainReminder: 'Lyophilized compounds packaged with insulated thermo-shielding & cold-pack gel inserts.',
  labInventoryBadge: 'ISO-9001 / cGMP Certified Facility',
  storageFacility: 'Main Atlantic Research Cold Storage Vault',
};

// Internal mutable dataset for OnHand items with additional customer inventory details
let onHandProductsStore: OnHandProduct[] = [];

// Initialize dataset from ProductService on service load
async function initializeProducts() {
  if (onHandProductsStore.length === 0) {
    const raw = await ProductService.getOnHandProducts();
    onHandProductsStore = raw.map((p, idx) => ({
      ...p,
      availableStockQuantity: p.stockText?.includes('units')
        ? parseInt(p.stockText) || 24
        : 20 + idx * 6,
      estimatedDispatchTime: idx % 2 === 0 ? 'Ships within 12 Hours' : 'Ships Same-Day',
      coldChainRequired: true,
      storageTemperature: p.storageConditions || '2°C to 8°C (Refrigerated) / -20°C (Long term)',
      laboratoryGrade: p.purity ? `≥ ${p.purity} (Purity Standard)` : '≥ 99.5% Ultra-Pure',
    }));
  }
}

export const OnHandService = {
  /**
   * Fetch customer-facing header summary info
   */
  async getHeaderInfo(): Promise<OnHandHeaderInfo> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { ...currentHeaderInfo };
  },

  /**
   * Fetch OnHand products with instant multi-parameter filtering
   */
  async getProducts(filters: OnHandFilters = {}): Promise<OnHandProduct[]> {
    await initializeProducts();
    let result = [...onHandProductsStore];

    // 1. Search filter (Name, description, CAS, sequence, purity)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.casNumber?.toLowerCase().includes(q) ||
          p.sequence?.toLowerCase().includes(q) ||
          p.purity?.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // 3. Availability status filter
    if (filters.availability && filters.availability !== 'all') {
      const avail = filters.availability.toLowerCase();
      result = result.filter((p) => {
        const status = (p.stockStatus || p.status || '').toLowerCase();
        if (avail === 'ready' || avail === 'in-stock') return status.includes('in stock') || status.includes('ready');
        if (avail === 'low-stock') return status.includes('low') || (p.availableStockQuantity && p.availableStockQuantity < 15);
        if (avail === 'restocked') return status.includes('restocked') || status.includes('recent');
        if (avail === 'out-of-stock') return status.includes('out');
        return true;
      });
    }

    // 4. Purity filter
    if (filters.purity && filters.purity !== 'all') {
      result = result.filter((p) => {
        if (!p.purity) return false;
        if (filters.purity === '99.7+') return p.purity.includes('99.7') || p.purity.includes('99.8') || p.purity.includes('99.9');
        if (filters.purity === '99.5+') return parseFloat(p.purity) >= 99.5 || p.purity.includes('99.');
        if (filters.purity === 'usp') return p.purity.toLowerCase().includes('usp');
        return true;
      });
    }

    // 5. Variant filter (e.g., single vial, box, kit, blend)
    if (filters.variant && filters.variant !== 'all') {
      result = result.filter((p) => {
        const vType = filters.variant?.toLowerCase();
        if (vType === 'single')
          return (
            p.unitInfo?.toLowerCase().includes('single') ||
            p.variants?.some((v) => {
              const label = typeof v === 'string' ? v : v.label;
              return label.toLowerCase().includes('single') || label.toLowerCase().includes('vial');
            })
          );
        if (vType === 'box')
          return (
            p.unitInfo?.toLowerCase().includes('box') ||
            p.variants?.some((v) => {
              const label = typeof v === 'string' ? v : v.label;
              return label.toLowerCase().includes('box');
            })
          );
        if (vType === 'kit')
          return (
            p.unitInfo?.toLowerCase().includes('kit') ||
            p.variants?.some((v) => {
              const label = typeof v === 'string' ? v : v.label;
              return label.toLowerCase().includes('kit');
            })
          );
        if (vType === 'blend') return p.category === 'blends' || p.name.toLowerCase().includes('blend');
        return true;
      });
    }

    // 6. Sorting
    if (filters.sort) {
      if (filters.sort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'purity-desc') {
        result.sort((a, b) => {
          const pA = parseFloat((a.purity || '0').replace('%', ''));
          const pB = parseFloat((b.purity || '0').replace('%', ''));
          return pB - pA;
        });
      } else if (filters.sort === 'stock-desc') {
        result.sort((a, b) => (b.availableStockQuantity || 0) - (a.availableStockQuantity || 0));
      } else if (filters.sort === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return result;
  },

  /**
   * Filter dropdown option metadata
   */
  getFilterOptions() {
    return {
      categories: [
        { id: 'all', label: 'All OnHand Items' },
        { id: 'in-stock', label: 'In Stock Standard' },
        { id: 'reference', label: 'Reference Standards' },
        { id: 'blends', label: 'Analytical Blends' },
      ],
      availabilities: [
        { id: 'all', label: 'All Stock Statuses' },
        { id: 'ready', label: 'Ready to Ship' },
        { id: 'low-stock', label: 'Low Stock' },
        { id: 'restocked', label: 'Recently Restocked' },
      ],
      purities: [
        { id: 'all', label: 'All Purity Grades' },
        { id: '99.7+', label: '≥ 99.7% Ultra High' },
        { id: '99.5+', label: '≥ 99.5% Standard' },
        { id: 'usp', label: 'USP Reconstitution Grade' },
      ],
      variants: [
        { id: 'all', label: 'All Package Types' },
        { id: 'single', label: 'Single Vials' },
        { id: 'box', label: 'Multi-Vial Boxes' },
        { id: 'blend', label: 'Synergistic Blends' },
      ],
      sorts: [
        { id: 'featured', label: 'Featured Inventory' },
        { id: 'price-asc', label: 'Price: Low to High' },
        { id: 'price-desc', label: 'Price: High to Low' },
        { id: 'purity-desc', label: 'Highest Purity Standard' },
        { id: 'stock-desc', label: 'Highest Stock Quantity' },
        { id: 'name-asc', label: 'Alphabetical A-Z' },
      ],
    };
  },

  /**
   * Prepared Admin integration method to update inventory/products
   */
  async updateInventoryItem(id: string, updates: Partial<OnHandProduct>): Promise<OnHandProduct | null> {
    await initializeProducts();
    const idx = onHandProductsStore.findIndex((p) => p.id === id);
    if (idx !== -1) {
      onHandProductsStore[idx] = { ...onHandProductsStore[idx], ...updates };
      return { ...onHandProductsStore[idx] };
    }
    return null;
  },

  /**
   * Prepared Admin integration method to update header stats/notices
   */
  async updateHeaderInfo(updates: Partial<OnHandHeaderInfo>): Promise<OnHandHeaderInfo> {
    currentHeaderInfo = { ...currentHeaderInfo, ...updates };
    return { ...currentHeaderInfo };
  },
};
