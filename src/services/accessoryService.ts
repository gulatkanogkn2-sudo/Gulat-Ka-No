import { CheckoutAccessory, StoreType } from '../types/checkout';

const ACCESSORIES_STORAGE_KEY = 'gkn_checkout_accessories_v2';

export const DEFAULT_ACCESSORIES: CheckoutAccessory[] = [
  {
    id: 'acc-sticker-labels',
    name: 'Custom Sticker Labels (Vials)',
    description: 'Custom waterproof peptide vial labels with batch & lot info. Calculated per vial.',
    priceUsd: 0.10,
    enabled: true,
    displayOrder: 1,
    availableStores: ['groupbuy', 'onhand', 'moq'],
    calculationMode: 'per_vial',
    multiplier: 1,
  },
  {
    id: 'acc-kit-packaging',
    name: 'Insulated Kit Sleeve & Seals',
    description: 'Thermal vacuum barrier foil sleeve and tamper evident seal per kit box.',
    priceUsd: 1.50,
    enabled: true,
    displayOrder: 2,
    availableStores: ['groupbuy', 'onhand', 'moq'],
    calculationMode: 'per_kit',
    multiplier: 1,
  },
  {
    id: 'acc-ice-pack',
    name: 'Thermal Protection Gel Pack',
    description: 'Extra protective gel pack for transit retention.',
    priceUsd: 3.00,
    enabled: true,
    displayOrder: 3,
    availableStores: ['groupbuy', 'onhand', 'moq'],
    calculationMode: 'manual',
  },
  {
    id: 'acc-thermal-box',
    name: 'Insulated Vacuum Shield Box',
    description: 'Heavy-duty double-walled insulation container for extreme distance or tropical weather transit.',
    priceUsd: 5.00,
    enabled: true,
    displayOrder: 4,
    availableStores: ['groupbuy', 'onhand', 'moq'],
    calculationMode: 'manual',
  },
];

type AccessoryListener = (accessories: CheckoutAccessory[]) => void;

class AccessoryService {
  private listeners: Set<AccessoryListener> = new Set();
  private cache: CheckoutAccessory[] | null = null;

  public getAccessories(): CheckoutAccessory[] {
    if (this.cache) {
      return [...this.cache];
    }

    try {
      const stored = localStorage.getItem(ACCESSORIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CheckoutAccessory[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize entries to ensure missing fields are defaulted
          this.cache = parsed.map((acc, idx) => ({
            ...acc,
            enabled: acc.enabled ?? (acc as any).active ?? true,
            calculationMode: acc.calculationMode || (acc as any).calculationType?.toLowerCase() || 'manual',
            displayOrder: acc.displayOrder ?? idx + 1,
            availableStores: acc.availableStores || ['all'],
          }));
          return [...this.cache];
        }
      }
    } catch (err) {
      console.error('[AccessoryService] Error loading accessories from localStorage:', err);
    }

    this.cache = [...DEFAULT_ACCESSORIES];
    this.saveToStorage(this.cache);
    return [...this.cache];
  }

  public saveAccessories(accessories: CheckoutAccessory[]): CheckoutAccessory[] {
    // Ensure display order is sorted
    const sorted = [...accessories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    this.cache = sorted;
    this.saveToStorage(sorted);
    this.notifyListeners(sorted);
    return sorted;
  }

  public addAccessory(acc: Omit<CheckoutAccessory, 'id'> & { id?: string }): CheckoutAccessory {
    const current = this.getAccessories();
    const newId = acc.id || `acc-${Date.now().toString().slice(-6)}`;
    const newAcc: CheckoutAccessory = {
      ...acc,
      id: newId,
      enabled: acc.enabled ?? true,
      displayOrder: acc.displayOrder ?? current.length + 1,
      availableStores: acc.availableStores && acc.availableStores.length > 0 ? acc.availableStores : ['all'],
      calculationMode: acc.calculationMode || 'manual',
    };

    const updated = [...current, newAcc];
    this.saveAccessories(updated);
    return newAcc;
  }

  public updateAccessory(id: string, updates: Partial<CheckoutAccessory>): CheckoutAccessory {
    const current = this.getAccessories();
    const index = current.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Accessory with ID ${id} not found.`);
    }

    const updatedAcc = {
      ...current[index],
      ...updates,
      enabled: updates.enabled !== undefined ? updates.enabled : (updates as any).active !== undefined ? (updates as any).active : current[index].enabled,
      calculationMode: updates.calculationMode || (updates as any).calculationType?.toLowerCase() || current[index].calculationMode,
    };

    current[index] = updatedAcc;
    this.saveAccessories(current);
    return updatedAcc;
  }

  public deleteAccessory(id: string): boolean {
    const current = this.getAccessories();
    const filtered = current.filter((a) => a.id !== id);
    if (filtered.length === current.length) return false;

    this.saveAccessories(filtered);
    return true;
  }

  public toggleAccessoryStatus(id: string): boolean {
    const current = this.getAccessories();
    const acc = current.find((a) => a.id === id);
    if (!acc) return false;

    this.updateAccessory(id, { enabled: !acc.enabled });
    return true;
  }

  public subscribe(listener: AccessoryListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(accessories: CheckoutAccessory[]) {
    this.listeners.forEach((listener) => {
      try {
        listener(accessories);
      } catch (e) {
        console.error('[AccessoryService] Listener error:', e);
      }
    });
  }

  private saveToStorage(accessories: CheckoutAccessory[]) {
    try {
      localStorage.setItem(ACCESSORIES_STORAGE_KEY, JSON.stringify(accessories));
    } catch (err) {
      console.error('[AccessoryService] Error saving to localStorage:', err);
    }
  }
}

export const accessoryService = new AccessoryService();
