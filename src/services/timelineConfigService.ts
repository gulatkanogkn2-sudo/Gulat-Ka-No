import { OrderDetail, OrderStatus, TimelineStep } from '../types/order';

export interface TimelineStageConfig {
  id: string;
  displayName: string;
  displayOrder: number;
  enabled: boolean;
  icon?: string;
  description?: string;
  associatedStatus?: OrderStatus;
}

export type StoreTypeKey = 'groupbuy' | 'onhand' | 'moq' | 'default';

export const DEFAULT_NEUTRAL_STAGES: TimelineStageConfig[] = [
  {
    id: 'order_received',
    displayName: 'Order Received',
    displayOrder: 1,
    enabled: true,
    icon: 'CheckCircle2',
    description: 'Order allocation received and recorded.',
    associatedStatus: 'PENDING',
  },
  {
    id: 'payment_verification',
    displayName: 'Payment Verification',
    displayOrder: 2,
    enabled: true,
    icon: 'FileCheck',
    description: 'Payment submission undergoing verification.',
    associatedStatus: 'PAYMENT_VERIFICATION',
  },
  {
    id: 'order_processing',
    displayName: 'Order Processing',
    displayOrder: 3,
    enabled: true,
    icon: 'Box',
    description: 'Order details and items being prepared.',
    associatedStatus: 'PROCESSING',
  },
  {
    id: 'ready_for_delivery',
    displayName: 'Ready for Delivery',
    displayOrder: 4,
    enabled: true,
    icon: 'PackageCheck',
    description: 'Order packed and staged for carrier dispatch.',
    associatedStatus: 'READY_TO_SHIP',
  },
  {
    id: 'in_transit',
    displayName: 'In Transit',
    displayOrder: 5,
    enabled: true,
    icon: 'Truck',
    description: 'Dispatched via courier with active tracking.',
    associatedStatus: 'SHIPPED',
  },
  {
    id: 'delivered',
    displayName: 'Delivered',
    displayOrder: 6,
    enabled: true,
    icon: 'CheckCircle2',
    description: 'Successfully delivered to destination.',
    associatedStatus: 'DELIVERED',
  },
  {
    id: 'completed',
    displayName: 'Completed',
    displayOrder: 7,
    enabled: true,
    icon: 'Check',
    description: 'Order fulfilled and finalized.',
    associatedStatus: 'COMPLETED',
  },
];

const DEFAULT_STORE_CONFIGS: Record<string, TimelineStageConfig[]> = {
  groupbuy: [
    {
      id: 'order_received',
      displayName: 'Order Received',
      displayOrder: 1,
      enabled: true,
      icon: 'CheckCircle2',
      description: 'GroupBuy batch allocation request registered.',
      associatedStatus: 'PENDING',
    },
    {
      id: 'payment_verification',
      displayName: 'Payment Verification',
      displayOrder: 2,
      enabled: true,
      icon: 'FileCheck',
      description: 'Payment verification and ledger check.',
      associatedStatus: 'PAYMENT_VERIFICATION',
    },
    {
      id: 'order_processing',
      displayName: 'Order Processing',
      displayOrder: 3,
      enabled: true,
      icon: 'Box',
      description: 'Batch items prepared for dispatch.',
      associatedStatus: 'PROCESSING',
    },
    {
      id: 'ready_for_delivery',
      displayName: 'Ready for Delivery',
      displayOrder: 4,
      enabled: true,
      icon: 'PackageCheck',
      description: 'Batch package staged for carrier pickup.',
      associatedStatus: 'READY_TO_SHIP',
    },
    {
      id: 'in_transit',
      displayName: 'In Transit',
      displayOrder: 5,
      enabled: true,
      icon: 'Truck',
      description: 'Fulfillment is marked in transit. Courier details appear when assigned.',
      associatedStatus: 'SHIPPED',
    },
    {
      id: 'delivered',
      displayName: 'Delivered',
      displayOrder: 6,
      enabled: true,
      icon: 'CheckCircle2',
      description: 'Delivered to destination address.',
      associatedStatus: 'DELIVERED',
    },
    {
      id: 'completed',
      displayName: 'Completed',
      displayOrder: 7,
      enabled: true,
      icon: 'Check',
      description: 'Order fulfilled.',
      associatedStatus: 'COMPLETED',
    },
  ],
  onhand: [
    {
      id: 'order_received',
      displayName: 'Order Received',
      displayOrder: 1,
      enabled: true,
      icon: 'CheckCircle2',
      description: 'OnHand inventory order received.',
      associatedStatus: 'PENDING',
    },
    {
      id: 'payment_verification',
      displayName: 'Payment Verification',
      displayOrder: 2,
      enabled: true,
      icon: 'FileCheck',
      description: 'Payment submission undergoing verification.',
      associatedStatus: 'PAYMENT_VERIFICATION',
    },
    {
      id: 'order_processing',
      displayName: 'Order Processing',
      displayOrder: 3,
      enabled: true,
      icon: 'Box',
      description: 'Inventory items allocated and packaged.',
      associatedStatus: 'PROCESSING',
    },
    {
      id: 'ready_for_delivery',
      displayName: 'Ready for Delivery',
      displayOrder: 4,
      enabled: true,
      icon: 'PackageCheck',
      description: 'Handed over for same-day/express dispatch.',
      associatedStatus: 'READY_TO_SHIP',
    },
    {
      id: 'in_transit',
      displayName: 'In Transit',
      displayOrder: 5,
      enabled: true,
      icon: 'Truck',
      description: 'In transit via courier.',
      associatedStatus: 'SHIPPED',
    },
    {
      id: 'delivered',
      displayName: 'Delivered',
      displayOrder: 6,
      enabled: true,
      icon: 'CheckCircle2',
      description: 'Package delivered.',
      associatedStatus: 'DELIVERED',
    },
    {
      id: 'completed',
      displayName: 'Completed',
      displayOrder: 7,
      enabled: true,
      icon: 'Check',
      description: 'Order fulfilled.',
      associatedStatus: 'COMPLETED',
    },
  ],
  moq: [
    {
      id: 'order_received',
      displayName: 'Order Received',
      displayOrder: 1,
      enabled: true,
      icon: 'CheckCircle2',
      description: 'MOQ bulk order allocation logged.',
      associatedStatus: 'PENDING',
    },
    {
      id: 'payment_verification',
      displayName: 'Payment Verification',
      displayOrder: 2,
      enabled: true,
      icon: 'FileCheck',
      description: 'Institutional payment verification.',
      associatedStatus: 'PAYMENT_VERIFICATION',
    },
    {
      id: 'order_processing',
      displayName: 'Order Processing',
      displayOrder: 3,
      enabled: true,
      icon: 'Box',
      description: 'Bulk order preparation.',
      associatedStatus: 'PROCESSING',
    },
    {
      id: 'ready_for_delivery',
      displayName: 'Ready for Delivery',
      displayOrder: 4,
      enabled: true,
      icon: 'PackageCheck',
      description: 'Bulk package verified and staged.',
      associatedStatus: 'READY_TO_SHIP',
    },
    {
      id: 'in_transit',
      displayName: 'In Transit',
      displayOrder: 5,
      enabled: true,
      icon: 'Truck',
      description: 'Shipped with priority waybill tracking.',
      associatedStatus: 'SHIPPED',
    },
    {
      id: 'delivered',
      displayName: 'Delivered',
      displayOrder: 6,
      enabled: true,
      icon: 'CheckCircle2',
      description: 'Delivered to facility.',
      associatedStatus: 'DELIVERED',
    },
    {
      id: 'completed',
      displayName: 'Completed',
      displayOrder: 7,
      enabled: true,
      icon: 'Check',
      description: 'Order fulfilled.',
      associatedStatus: 'COMPLETED',
    },
  ],
};

const STORAGE_KEY_PREFIX = 'gkn_timeline_config_';

export class TimelineConfigService {
  /**
   * Get store timeline stages configuration
   */
  static getTimelineConfigForStore(storeType: string): TimelineStageConfig[] {
    const key = `${STORAGE_KEY_PREFIX}${storeType.toLowerCase()}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => a.displayOrder - b.displayOrder);
        }
      }
    } catch (e) {
      console.warn('Failed to load timeline config from localStorage:', e);
    }

    const defaultConfig = DEFAULT_STORE_CONFIGS[storeType.toLowerCase()] || DEFAULT_NEUTRAL_STAGES;
    return [...defaultConfig].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Save store timeline stages configuration
   */
  static saveTimelineConfigForStore(storeType: string, stages: TimelineStageConfig[]): void {
    const key = `${STORAGE_KEY_PREFIX}${storeType.toLowerCase()}`;
    try {
      localStorage.setItem(key, JSON.stringify(stages));
    } catch (e) {
      console.error('Failed to save timeline config to localStorage:', e);
    }
  }

  /**
   * Reset store timeline stages configuration to defaults
   */
  static resetTimelineConfigForStore(storeType: string): TimelineStageConfig[] {
    const key = `${STORAGE_KEY_PREFIX}${storeType.toLowerCase()}`;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to reset timeline config:', e);
    }
    return this.getTimelineConfigForStore(storeType);
  }

  /**
   * Map an order to active enabled timeline steps based on store configuration
   */
  static mapOrderToTimelineSteps(order: OrderDetail): TimelineStep[] {
    const storeConfig = this.getTimelineConfigForStore(order.storeType);
    const enabledStages = storeConfig.filter((stage) => stage.enabled);

    // Map order status to numeric index in standard status flow
    const statusOrderMap: Record<OrderStatus, number> = {
      PENDING: 1,
      AWAITING_PAYMENT: 2,
      PAYMENT_VERIFICATION: 2,
      CONFIRMED: 3,
      PROCESSING: 3,
      PACKING: 4,
      READY_TO_SHIP: 4,
      SHIPPED: 5,
      DELIVERED: 6,
      COMPLETED: 7,
      CANCELLED: 0,
      REFUNDED: 0,
    };

    const currentOrderLevel = statusOrderMap[order.status] || 1;

    return enabledStages.map((stage, idx) => {
      const stageLevel = idx + 1;
      const isCompleted = currentOrderLevel >= stageLevel;
      const isCurrent = currentOrderLevel === stageLevel;

      let timestamp: string | undefined = undefined;
      if (isCompleted) {
        if (idx === 0) timestamp = 'Order Logged';
        if (idx === 1 && currentOrderLevel >= 2) timestamp = 'Payment Verified';
        if (idx === 2 && currentOrderLevel >= 3) timestamp = 'Processing Complete';
        if (idx === 3 && currentOrderLevel >= 4) timestamp = 'Ready for Carrier';
        if (idx === 4 && currentOrderLevel >= 5) timestamp = order.trackingNumber || 'In Transit';
        if (idx === 5 && currentOrderLevel >= 6) timestamp = 'Delivered';
        if (idx === 6 && currentOrderLevel >= 7) timestamp = 'Fulfilled';
      }

      return {
        status: (stage.associatedStatus || 'PROCESSING') as OrderStatus,
        label: stage.displayName,
        description: stage.description || '',
        timestamp,
        isCompleted,
        isCurrent,
      };
    });
  }
}

