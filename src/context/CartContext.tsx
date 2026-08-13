import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreType } from '../types';
import { CartToast, ToastNotification } from '../components/cart/CartToast';
import { snapToValidQuantity } from '../utils/vialCalculation';
import { productAddonService } from '../services/productAddonService';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  variantId: string;
  variantLabel: string;
  storeType: StoreType;
  price: number;
  originalPrice?: number;
  currency: string;
  unitInfo?: string;
  imageUrl?: string;
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  stepQuantity?: number;
  purity?: string;
  casNumber?: string;
  sellingUnit?: 'vial' | 'kit';
  vialsPerKit?: number;
  isAccessory?: boolean;
  isAddon?: boolean;
  parentProductId?: string;
  addonRelationshipId?: string;
  excessUnitFee?: number;
  excessQuantity?: number;
  excessFeeTotal?: number;
}

export interface StoreCartSummary {
  items: CartItem[];
  subtotal: number;
  estimatedShipping: number;
  estimatedDiscount: number;
  earnedPoints: number;
  grandTotal: number;
  itemCount: number;
}

export interface CartContextType {
  activeStore: StoreType;
  setActiveStore: (store: StoreType) => void;
  carts: Record<StoreType, CartItem[]>;
  getCartForStore: (storeType: StoreType) => StoreCartSummary;
  items: CartItem[]; // Items for activeStore (backwards compatibility)
  addItem: (item: Omit<CartItem, 'id'> & { id?: string; storeType?: StoreType }) => void;
  removeItem: (id: string, storeType?: StoreType) => void;
  updateQuantity: (id: string, quantity: number, storeType?: StoreType) => void;
  clearCart: (storeType?: StoreType) => void;
  subtotal: number;
  estimatedShipping: number;
  estimatedDiscount: number;
  earnedPoints: number;
  grandTotal: number;
  totalItemCount: number;
  allCartsTotalCount: number;
  getItemCountForStore: (storeType: StoreType) => number;
  isDrawerOpen: boolean;
  openDrawer: (storeType?: StoreType) => void;
  closeDrawer: () => void;
  toggleDrawer: (storeType?: StoreType) => void;
}

const STORAGE_KEYS: Record<StoreType, string> = {
  groupbuy: 'groupbuy-cart',
  onhand: 'onhand-cart',
  moq: 'moq-cart',
  GroupBuy: 'groupbuy-cart',
  OnHand: 'onhand-cart',
  MOQ: 'moq-cart',
};

const ACTIVE_STORE_KEY = 'gkn_v2_active_store';

const INITIAL_STORE_ITEMS: Record<string, CartItem[]> = {
  groupbuy: [
    {
      id: 'gb-001-10mg-10vials',
      productId: 'gb-001',
      name: 'Tirzepatide (GKN-TZ10)',
      variantId: '10mg-10vials',
      variantLabel: '10mg (10 Vials / Kit)',
      storeType: 'groupbuy',
      price: 120.0,
      originalPrice: 150.0,
      currency: '$',
      unitInfo: '/ 10 Vials Kit',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      quantity: 2,
      minQuantity: 1,
      maxQuantity: 20,
      stepQuantity: 1,
      purity: '99.4%',
    },
  ],
  onhand: [
    {
      id: 'oh-001-5mg-vial',
      productId: 'oh-001',
      name: 'BPC-157 Direct Dispatch',
      variantId: '5mg-vial',
      variantLabel: '5mg Vial',
      storeType: 'onhand',
      price: 38.0,
      originalPrice: 48.0,
      currency: '$',
      unitInfo: '/ Single Vial',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      quantity: 3,
      minQuantity: 1,
      maxQuantity: 50,
      stepQuantity: 1,
      purity: '99.7%',
    },
  ],
  moq: [
    {
      id: 'moq-001-1g-powder',
      productId: 'moq-001',
      name: 'Bulk Tirzepatide Raw Powder (1g+ MOQ)',
      variantId: '1g-powder',
      variantLabel: '1g Bulk Powder Tier',
      storeType: 'moq',
      price: 450.0,
      originalPrice: 550.0,
      currency: '$',
      unitInfo: '/ 1 Gram MOQ Tier',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      quantity: 1,
      minQuantity: 1,
      maxQuantity: 10,
      stepQuantity: 1,
      purity: '99.4%',
    },
  ],
};

const normalizeStore = (st?: any): StoreType => {
  if (st && typeof st === 'string') {
    const lower = st.toLowerCase();
    if (['groupbuy', 'onhand', 'moq'].includes(lower)) {
      return lower as StoreType;
    }
  }
  return 'groupbuy';
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const [activeStore, setActiveStoreState] = useState<StoreType>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_STORE_KEY);
      if (saved && typeof saved === 'string' && ['groupbuy', 'onhand', 'moq'].includes(saved.toLowerCase())) {
        return saved.toLowerCase() as StoreType;
      }
    } catch (e) {
      console.error('Failed to load active store', e);
    }
    return 'groupbuy';
  });

  const setActiveStore = (store: StoreType) => {
    if (!store || typeof store !== 'string') return;
    const normalized = normalizeStore(store);
    setActiveStoreState(normalized);
    try {
      localStorage.setItem(ACTIVE_STORE_KEY, normalized);
    } catch (e) {
      console.error('Failed to save active store', e);
    }
  };

  // Automatically synchronize activeStore with the current route context
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/onhand')) {
      setActiveStore('onhand');
    } else if (path.includes('/moq')) {
      setActiveStore('moq');
    } else if (path.includes('/groupbuy') || path === '/') {
      setActiveStore('groupbuy');
    } else if (path.includes('/checkout')) {
      const params = new URLSearchParams(location.search);
      const store = params.get('store');
      if (store && ['groupbuy', 'onhand', 'moq'].includes(store.toLowerCase())) {
        setActiveStore(store.toLowerCase() as StoreType);
      }
    }
  }, [location.pathname, location.search]);

  const [carts, setCarts] = useState<Record<StoreType, CartItem[]>>(() => {
    const loadStore = (st: StoreType): CartItem[] => {
      try {
        const norm = (st && typeof st === 'string') ? st.toLowerCase() : 'groupbuy';
        const key = STORAGE_KEYS[st] || `${norm}-cart`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Production products and variants use database UUIDs. Discard any
            // persisted demo cart entries from earlier preview builds.
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return parsed.filter((item) =>
              uuidPattern.test(item?.productId) &&
              (!item?.variantId || uuidPattern.test(item.variantId))
            );
          }
        }
      } catch (e) {
        console.error(`Failed to parse ${st} cart storage`, e);
      }
      return [];
    };

    return {
      groupbuy: loadStore('groupbuy'),
      onhand: loadStore('onhand'),
      moq: loadStore('moq'),
      GroupBuy: loadStore('groupbuy'),
      OnHand: loadStore('onhand'),
      MOQ: loadStore('moq'),
    };
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Persist carts independently to groupbuy-cart, onhand-cart, moq-cart
  useEffect(() => {
    const stores: StoreType[] = ['groupbuy', 'onhand', 'moq'];
    stores.forEach((st) => {
      try {
        const key = STORAGE_KEYS[st];
        const storeItems = carts[st] || [];
        localStorage.setItem(key, JSON.stringify(storeItems));
      } catch (e) {
        console.error(`Failed to save ${st} cart storage`, e);
      }
    });
  }, [carts]);

  const openDrawer = (storeType?: StoreType) => {
    if (storeType && typeof storeType === 'string') {
      setActiveStore(storeType);
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const toggleDrawer = (storeType?: StoreType) => {
    if (storeType && typeof storeType === 'string') {
      setActiveStore(storeType);
    }
    setIsDrawerOpen((prev) => !prev);
  };

  const addItem = (newItemData: Omit<CartItem, 'id'> & { id?: string; storeType?: StoreType }) => {
    const targetStore = normalizeStore(newItemData.storeType || activeStore);
    const itemId = newItemData.id || `${newItemData.productId}-${newItemData.variantId}`;

    setCarts((prev) => {
      const storeCart = prev[targetStore] || [];
      const existingIdx = storeCart.findIndex((item) => item.id === itemId);
      let updatedStoreCart: CartItem[];

      if (existingIdx > -1) {
        updatedStoreCart = [...storeCart];
        const currentQty = updatedStoreCart[existingIdx].quantity;
        const addQty = newItemData.quantity || 1;
        const max = updatedStoreCart[existingIdx].maxQuantity || 999;
        updatedStoreCart[existingIdx] = {
          ...updatedStoreCart[existingIdx],
          quantity: Math.min(currentQty + addQty, max),
        };
      } else {
        const itemToAdd: CartItem = {
          ...newItemData,
          id: itemId,
          storeType: targetStore,
          quantity: newItemData.quantity || 1,
        };
        updatedStoreCart = [...storeCart, itemToAdd];
      }

      return {
        ...prev,
        [targetStore]: updatedStoreCart,
      };
    });

    setActiveStore(targetStore);

    // Trigger toast notification instead of automatically opening cart drawer
    setToast({
      id: Date.now().toString(),
      message: `✓ Added to ${targetStore.toUpperCase()} Cart`,
      productName: newItemData.name || 'Product',
      storeType: targetStore,
    });
  };

  const removeItem = (id: string, storeType?: StoreType) => {
    const targetStore = (storeType && typeof storeType === 'string') ? normalizeStore(storeType) : activeStore;
    setCarts((prev) => ({
      ...prev,
      [targetStore]: (prev[targetStore] || []).filter((item) => item.id !== id),
    }));
  };

  const updateQuantity = (id: string, quantity: number, storeType?: StoreType) => {
    const targetStore = (storeType && typeof storeType === 'string') ? normalizeStore(storeType) : activeStore;
    setCarts((prev) => {
      const currentCart = prev[targetStore] || [];
      const updatedCart = currentCart.map((item) => {
        if (item.id === id) {
          const min = item.minQuantity || 1;
          let max = item.maxQuantity || 999;
          const step = item.stepQuantity || 1;

          let updatedExcessQty = item.excessQuantity || 0;
          let updatedExcessFeeTotal = item.excessFeeTotal || 0;
          let updatedExcessUnitFee = item.excessUnitFee || 0;

          // Check if this item is a related add-on product constrained by a parent product in cart
          const storeAddons = productAddonService.getAddonsForStore(targetStore);
          const addonRel = storeAddons.find(
            (a) => a.relatedProductId === item.productId || item.productId.includes(a.relatedProductId)
          );

          if (addonRel) {
            const parentItem = currentCart.find(
              (p) =>
                (item.parentProductId && p.productId === item.parentProductId) ||
                (addonRel.parentProductId && (p.productId === addonRel.parentProductId || p.id.includes(addonRel.parentProductId)))
            );
            const parentQty = parentItem ? parentItem.quantity : 0;
            const check = productAddonService.validateAddonQuantity(parentQty, quantity, addonRel);
            
            if (check.maxAllowed < max) {
              max = check.maxAllowed;
            }

            if (check.excessQuantity !== undefined) {
              updatedExcessQty = check.excessQuantity;
              updatedExcessFeeTotal = check.excessFeeTotal || 0;
              updatedExcessUnitFee = check.excessFeePerUnit || 0;
            }
          }

          const validQty = snapToValidQuantity(quantity, min, step, max);

          return {
            ...item,
            quantity: validQty,
            excessQuantity: updatedExcessQty,
            excessFeeTotal: updatedExcessFeeTotal,
            excessUnitFee: updatedExcessUnitFee,
          };
        }
        return item;
      });

      return {
        ...prev,
        [targetStore]: updatedCart,
      };
    });
  };

  const clearCart = (storeType?: StoreType) => {
    const targetStore = (storeType && typeof storeType === 'string') ? normalizeStore(storeType) : activeStore;
    setCarts((prev) => ({ ...prev, [targetStore]: [] }));
  };

  const getCartForStore = (st: StoreType): StoreCartSummary => {
    const norm = normalizeStore(st || activeStore);
    const storeItems = carts[norm] || [];
    const sub = storeItems.reduce((sum, item) => sum + item.price * item.quantity + (item.excessFeeTotal || 0), 0);
    const count = storeItems.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = storeItems.length > 0 ? (norm === 'moq' ? 35.0 : 15.0) : 0.0;
    const discount = 0.0;
    const points = Math.floor(sub * 1.5);
    const grand = Math.max(0, sub + shipping - discount);

    return {
      items: storeItems,
      subtotal: sub,
      estimatedShipping: shipping,
      estimatedDiscount: discount,
      earnedPoints: points,
      grandTotal: grand,
      itemCount: count,
    };
  };

  const activeSummary = getCartForStore(activeStore);
  const items = activeSummary.items;
  const subtotal = activeSummary.subtotal;
  const estimatedShipping = activeSummary.estimatedShipping;
  const estimatedDiscount = activeSummary.estimatedDiscount;
  const earnedPoints = activeSummary.earnedPoints;
  const grandTotal = activeSummary.grandTotal;
  const totalItemCount = activeSummary.itemCount;

  const allCartsTotalCount = (['groupbuy', 'onhand', 'moq'] as StoreType[]).reduce(
    (sum, st) => sum + (carts[st] || []).reduce((s, i) => s + i.quantity, 0),
    0
  );

  const getItemCountForStore = (st: StoreType) => {
    const norm = normalizeStore(st || activeStore);
    return (carts[norm] || []).reduce((sum, i) => sum + i.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        activeStore,
        setActiveStore,
        carts,
        getCartForStore,
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        estimatedShipping,
        estimatedDiscount,
        earnedPoints,
        grandTotal,
        totalItemCount,
        allCartsTotalCount,
        getItemCountForStore,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
      <CartToast toast={toast} onClose={() => setToast(null)} onViewCart={(st) => openDrawer(st)} />
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
