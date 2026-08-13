import {
  CustomerDetail,
  CustomerAccountStatus,
  CustomerTier,
  CustomerVerificationStatus,
  CustomerFilterOptions,
  CustomerAggregateMetrics,
  CustomerExportData,
  CustomerAdminNote,
} from '../types/customer';
import { CustomerTierService } from './customerTierService';
import { fetchCustomers } from './productionService';

// Initial Mock Database for Admin Customer Management
let ADMIN_MOCK_CUSTOMERS: CustomerDetail[] = [
  {
    id: 'cust_8801',
    customerCode: 'CUST-2026-081',
    name: 'Dr. Alexander Vance',
    email: 'alexander.vance@gknlabs.org',
    phone: '+63 917 123 4567',
    companyOrInstitution: 'Aegis BioResearch Institute',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    registrationDate: '2025-11-12T08:30:00Z',
    lastLoginDate: '2026-08-04T16:22:00Z',
    status: 'ACTIVE',
    tier: 'VIP',
    verificationStatus: 'VERIFIED',
    kycDocStatus: 'PRC Medical License Verified (#0098412)',
    addresses: [
      {
        id: 'addr_8801_1',
        isDefault: true,
        type: 'BOTH',
        label: 'Primary Lab Tower',
        recipientName: 'Dr. Alexander Vance (Lab Receiving)',
        phone: '+63 917 123 4567',
        addressLine1: 'Suite 402, BioTech Innovation Tower',
        addressLine2: '32nd Street, Bonifacio Global City',
        city: 'Taguig City',
        province: 'Metro Manila',
        postalCode: '1634',
        country: 'Philippines',
      },
      {
        id: 'addr_8801_2',
        isDefault: false,
        type: 'SHIPPING',
        label: 'Subic Cold Depot',
        recipientName: 'Vance Bio Storage Facility',
        phone: '+63 918 888 2211',
        addressLine1: 'Building B, Freeport Zone',
        city: 'Olongapo City',
        province: 'Zambales',
        postalCode: '2200',
        country: 'Philippines',
      },
    ],
    billingInfo: {
      preferredPaymentMethod: 'Institutional Bank Wire (BDO)',
      taxId: 'TIN: 249-102-993-000',
      currencyPreference: 'PHP',
    },
    wishlist: [
      {
        id: 'wish_101',
        productId: 'retatrutide-10mg',
        productName: 'Retatrutide 10mg Standard Vial',
        casNumber: '2381089-83-2',
        addedDate: '2026-07-28T10:00:00Z',
        storeType: 'groupbuy',
        estimatedPrice: 189.99,
      },
      {
        id: 'wish_102',
        productId: 'nad-plus-1000mg',
        productName: 'NAD+ 1000mg Lyophilized Powder',
        casNumber: '53-84-9',
        addedDate: '2026-08-01T14:15:00Z',
        storeType: 'onhand',
        estimatedPrice: 119.50,
      },
    ],
    rewardPoints: {
      currentBalance: 4850,
      lifetimeEarned: 12400,
      lifetimeRedeemed: 7550,
      tierProgressPercentage: 100,
      nextTier: null,
    },
    customerNotes: 'Preferred courier: LBC Express.',
    adminNotes: [
      {
        id: 'cnote_1',
        author: 'Chief Admin',
        timestamp: '2026-01-15T09:00:00Z',
        text: 'Upgraded to VIP status following high-volume BDO Wire commitments ($15,000+ total volume).',
      },
      {
        id: 'cnote_2',
        author: 'QC Compliance Officer',
        timestamp: '2026-05-20T11:45:00Z',
        text: 'Verified PRC license & institutional affiliation with Aegis BioResearch.',
      },
    ],
    loginActivity: [
      {
        id: 'log_1',
        timestamp: '2026-08-04T16:22:00Z',
        ipAddress: '112.198.102.45',
        location: 'Taguig, Philippines',
        device: 'Chrome 127.0 (macOS Sequoia)',
        status: 'SUCCESS',
      },
      {
        id: 'log_2',
        timestamp: '2026-08-01T08:14:00Z',
        ipAddress: '112.198.102.45',
        location: 'Taguig, Philippines',
        device: 'Safari 17.5 (iPhone 15 Pro)',
        status: 'SUCCESS',
      },
    ],
    orders: [
      {
        id: 'ord_1001',
        referenceNumber: 'GB-000001',
        orderDate: '2026-08-04T14:32:00Z',
        status: 'PAYMENT_VERIFICATION',
        grandTotal: 579.97,
        storeType: 'groupbuy',
        itemCount: 3,
        itemsSummary: 'Semaglutide 5mg (x2), Tirzepatide 10mg (x1)',
      },
      {
        id: 'ord_1002',
        referenceNumber: 'OH-000001',
        orderDate: '2026-08-01T09:15:00Z',
        status: 'SHIPPED',
        grandTotal: 1240.50,
        storeType: 'onhand',
        itemCount: 5,
        itemsSummary: 'Tirzepatide 10mg (x5)',
      },
      {
        id: 'ord_1006',
        referenceNumber: 'MOQ-000001',
        orderDate: '2026-06-12T11:20:00Z',
        status: 'DELIVERED',
        grandTotal: 4500.00,
        storeType: 'moq',
        itemCount: 50,
        itemsSummary: 'Custom Peptide Synthesis Batch - 50 Vials',
      },
    ],
    stats: {
      lifetimeSpending: 18450.75,
      ordersCompleted: 14,
      totalOrders: 15,
      averageOrderValue: 1230.05,
      favoriteStore: 'GroupBuy',
      mostPurchasedProduct: 'Tirzepatide 10mg Standard Vial',
      lastPurchaseDate: '2026-08-04',
    },
  },
  {
    id: 'cust_8802',
    customerCode: 'CUST-2026-082',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@xenonbio.ph',
    phone: '+63 920 987 6543',
    companyOrInstitution: 'Xenon Life Sciences Philippines',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    registrationDate: '2026-01-20T10:15:00Z',
    lastLoginDate: '2026-08-03T21:10:00Z',
    status: 'ACTIVE',
    tier: 'GOLD',
    verificationStatus: 'VERIFIED',
    kycDocStatus: 'Corporate SEC Registration Uploaded',
    addresses: [
      {
        id: 'addr_8802_1',
        isDefault: true,
        type: 'BOTH',
        label: 'Alabang Research Lab',
        recipientName: 'Dr. Elena Rostova',
        phone: '+63 920 987 6543',
        addressLine1: 'Filinvest Corporate City, Alabang',
        city: 'Muntinlupa City',
        province: 'Metro Manila',
        postalCode: '1781',
        country: 'Philippines',
      },
    ],
    billingInfo: {
      preferredPaymentMethod: 'GCash Instant Transfer',
      taxId: 'TIN: 104-982-111-000',
      currencyPreference: 'PHP',
    },
    wishlist: [
      {
        id: 'wish_201',
        productId: 'bpc157-5mg',
        productName: 'BPC-157 5mg High Purity',
        casNumber: '137525-51-0',
        addedDate: '2026-07-15T09:30:00Z',
        storeType: 'onhand',
        estimatedPrice: 65.00,
      },
    ],
    rewardPoints: {
      currentBalance: 2100,
      lifetimeEarned: 5400,
      lifetimeRedeemed: 3300,
      tierProgressPercentage: 75,
      nextTier: 'VIP',
    },
    customerNotes: 'Prefers SMS updates upon dispatch.',
    adminNotes: [
      {
        id: 'cnote_3',
        author: 'Admin Sarah',
        timestamp: '2026-02-10T14:00:00Z',
        text: 'Verified corporate identity. Granted Gold discount privileges.',
      },
    ],
    loginActivity: [
      {
        id: 'log_3',
        timestamp: '2026-08-03T21:10:00Z',
        ipAddress: '180.191.88.12',
        location: 'Muntinlupa, Philippines',
        device: 'Firefox 128.0 (Windows 11)',
        status: 'SUCCESS',
      },
    ],
    orders: [
      {
        id: 'ord_1003',
        referenceNumber: 'GKN-2026-772109',
        orderDate: '2026-08-02T16:45:00Z',
        status: 'PENDING',
        grandTotal: 349.50,
        storeType: 'groupbuy',
        itemCount: 2,
        itemsSummary: 'Cagrilintide 5mg (x2)',
      },
      {
        id: 'ord_1004',
        referenceNumber: 'GKN-2026-440192',
        orderDate: '2026-07-10T11:00:00Z',
        status: 'DELIVERED',
        grandTotal: 2890.00,
        storeType: 'onhand',
        itemCount: 12,
        itemsSummary: 'BPC-157 (x10), TB-500 (x2)',
      },
    ],
    stats: {
      lifetimeSpending: 6480.00,
      ordersCompleted: 6,
      totalOrders: 7,
      averageOrderValue: 925.71,
      favoriteStore: 'OnHand Vault',
      mostPurchasedProduct: 'BPC-157 5mg High Purity',
      lastPurchaseDate: '2026-08-02',
    },
  },
  {
    id: 'cust_8803',
    customerCode: 'CUST-2026-083',
    name: 'Prof. Marcus Chen',
    email: 'm.chen@upm.edu.ph',
    phone: '+63 915 555 7890',
    companyOrInstitution: 'University of the Philippines Manila - College of Pharmacy',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    registrationDate: '2026-03-05T14:22:00Z',
    lastLoginDate: '2026-08-04T09:05:00Z',
    status: 'ACTIVE',
    tier: 'SILVER',
    verificationStatus: 'VERIFIED',
    kycDocStatus: 'Faculty Institutional ID Clearance',
    addresses: [
      {
        id: 'addr_8803_1',
        isDefault: true,
        type: 'BOTH',
        label: 'UP Manila Pharmacognosy Dept',
        recipientName: 'Prof. Marcus Chen',
        phone: '+63 915 555 7890',
        addressLine1: 'Pedro Gil Street, Ermita',
        city: 'Manila',
        province: 'Metro Manila',
        postalCode: '1000',
        country: 'Philippines',
      },
    ],
    billingInfo: {
      preferredPaymentMethod: 'Bank Wire (BPI)',
      taxId: 'TIN: 000-312-998-000',
      currencyPreference: 'PHP',
    },
    wishlist: [
      {
        id: 'wish_301',
        productId: 'epithalon-10mg',
        productName: 'Epithalon 10mg Lyophilized',
        casNumber: '307297-39-8',
        addedDate: '2026-07-20T16:00:00Z',
        storeType: 'moq',
        estimatedPrice: 145.00,
      },
    ],
    rewardPoints: {
      currentBalance: 920,
      lifetimeEarned: 2400,
      lifetimeRedeemed: 1480,
      tierProgressPercentage: 45,
      nextTier: 'GOLD',
    },
    customerNotes: 'Deliver only during official office hours (8AM - 5PM Mon-Fri).',
    adminNotes: [
      {
        id: 'cnote_4',
        author: 'Admin Sarah',
        timestamp: '2026-03-06T10:00:00Z',
        text: 'Academic researcher discount rate applied.',
      },
    ],
    loginActivity: [
      {
        id: 'log_4',
        timestamp: '2026-08-04T09:05:00Z',
        ipAddress: '202.92.128.14',
        location: 'Manila, Philippines',
        device: 'Chrome 126.0 (macOS)',
        status: 'SUCCESS',
      },
    ],
    orders: [
      {
        id: 'ord_1005',
        referenceNumber: 'GKN-2026-881903',
        orderDate: '2026-07-25T13:20:00Z',
        status: 'DELIVERED',
        grandTotal: 1850.00,
        storeType: 'moq',
        itemCount: 20,
        itemsSummary: 'GHK-Cu Copper Peptide 50mg (x20)',
      },
    ],
    stats: {
      lifetimeSpending: 3250.00,
      ordersCompleted: 3,
      totalOrders: 3,
      averageOrderValue: 1083.33,
      favoriteStore: 'MOQ Bulk',
      mostPurchasedProduct: 'GHK-Cu Copper Peptide 50mg',
      lastPurchaseDate: '2026-07-25',
    },
  },
  {
    id: 'cust_8804',
    customerCode: 'CUST-2026-084',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@apexendocrinology.com',
    phone: '+63 928 333 4455',
    companyOrInstitution: 'Apex Endocrinology Clinic',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    registrationDate: '2026-06-01T11:10:00Z',
    lastLoginDate: '2026-08-05T02:15:00Z',
    status: 'PENDING_VERIFICATION',
    tier: 'STANDARD',
    verificationStatus: 'PENDING_ID',
    kycDocStatus: 'Awaiting PRC License Re-submission',
    addresses: [
      {
        id: 'addr_8804_1',
        isDefault: true,
        type: 'SHIPPING',
        label: 'Clinic Reception',
        recipientName: 'Dr. Sarah Jenkins',
        phone: '+63 928 333 4455',
        addressLine1: 'Level 8, Medical Plaza Cebu',
        city: 'Cebu City',
        province: 'Cebu',
        postalCode: '6000',
        country: 'Philippines',
      },
    ],
    billingInfo: {
      preferredPaymentMethod: 'GCash Instant Transfer',
      currencyPreference: 'PHP',
    },
    wishlist: [],
    rewardPoints: {
      currentBalance: 0,
      lifetimeEarned: 0,
      lifetimeRedeemed: 0,
      tierProgressPercentage: 0,
      nextTier: 'SILVER',
    },
    customerNotes: 'Pending verification submission.',
    adminNotes: [
      {
        id: 'cnote_5',
        author: 'Compliance Team',
        timestamp: '2026-06-02T09:00:00Z',
        text: 'Initial registration received. Requested clear photo of PRC card.',
      },
    ],
    loginActivity: [
      {
        id: 'log_5',
        timestamp: '2026-08-05T02:15:00Z',
        ipAddress: '119.93.201.55',
        location: 'Cebu City, Philippines',
        device: 'Edge 127.0 (Windows 11)',
        status: 'SUCCESS',
      },
    ],
    orders: [],
    stats: {
      lifetimeSpending: 0,
      ordersCompleted: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      favoriteStore: 'N/A',
      mostPurchasedProduct: 'None',
      lastPurchaseDate: 'N/A',
    },
  },
  {
    id: 'cust_8805',
    customerCode: 'CUST-2026-085',
    name: 'PharmD Jonathan Reyes',
    email: 'jreyes@vanguardpharma.ph',
    phone: '+63 908 777 6611',
    companyOrInstitution: 'Vanguard Compounding Pharmacy',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    registrationDate: '2026-02-18T16:40:00Z',
    lastLoginDate: '2026-07-28T18:30:00Z',
    status: 'SUSPENDED',
    tier: 'STANDARD',
    verificationStatus: 'REJECTED',
    kycDocStatus: 'Flagged Document - Name Mismatch',
    addresses: [
      {
        id: 'addr_8805_1',
        isDefault: true,
        type: 'BOTH',
        label: 'Pharmacy Dispatch',
        recipientName: 'Jonathan Reyes',
        phone: '+63 908 777 6611',
        addressLine1: '124 J.P. Laurel Avenue',
        city: 'Davao City',
        province: 'Davao del Sur',
        postalCode: '8000',
        country: 'Philippines',
      },
    ],
    billingInfo: {
      preferredPaymentMethod: 'Bank Wire',
      currencyPreference: 'PHP',
    },
    wishlist: [],
    rewardPoints: {
      currentBalance: 120,
      lifetimeEarned: 120,
      lifetimeRedeemed: 0,
      tierProgressPercentage: 10,
      nextTier: 'SILVER',
    },
    customerNotes: 'Account suspended pending administrative audit.',
    adminNotes: [
      {
        id: 'cnote_6',
        author: 'Audit Department',
        timestamp: '2026-07-29T10:15:00Z',
        text: 'Account suspended due to unverified third-party payment wire reference. Contacted user.',
      },
    ],
    loginActivity: [
      {
        id: 'log_6',
        timestamp: '2026-07-28T18:30:00Z',
        ipAddress: '110.54.192.10',
        location: 'Davao, Philippines',
        device: 'Chrome Mobile 126.0 (Android)',
        status: 'SUCCESS',
      },
    ],
    orders: [
      {
        id: 'ord_1007',
        referenceNumber: 'GKN-2026-992011',
        orderDate: '2026-07-28T14:10:00Z',
        status: 'CANCELLED',
        grandTotal: 780.00,
        storeType: 'onhand',
        itemCount: 4,
        itemsSummary: 'Oxytocin 2mg (x4)',
      },
    ],
    stats: {
      lifetimeSpending: 450.00,
      ordersCompleted: 1,
      totalOrders: 2,
      averageOrderValue: 225.00,
      favoriteStore: 'OnHand Vault',
      mostPurchasedProduct: 'Oxytocin 2mg Vial',
      lastPurchaseDate: '2026-07-28',
    },
  },
  {
    id: 'cust_8806',
    customerCode: 'CUST-2026-086',
    name: 'GKN System Admin (Master)',
    email: 'admin@gknlabs.org',
    phone: '+63 917 000 9999',
    companyOrInstitution: 'GKN Labs Headquarters',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    registrationDate: '2025-01-01T00:00:00Z',
    lastLoginDate: '2026-08-05T04:20:00Z',
    status: 'ACTIVE',
    tier: 'OWNER',
    verificationStatus: 'VERIFIED',
    kycDocStatus: 'System Master Root Credentials',
    addresses: [
      {
        id: 'addr_8806_1',
        isDefault: true,
        type: 'BOTH',
        label: 'GKN Vault HQ',
        recipientName: 'GKN Master Admin',
        phone: '+63 917 000 9999',
        addressLine1: 'BGC Innovation Tower, Taguig',
        city: 'Taguig City',
        province: 'Metro Manila',
        postalCode: '1634',
        country: 'Philippines',
      },
    ],
    billingInfo: {
      preferredPaymentMethod: 'Internal System Credit',
      currencyPreference: 'USD',
    },
    wishlist: [],
    rewardPoints: {
      currentBalance: 99999,
      lifetimeEarned: 99999,
      lifetimeRedeemed: 0,
      tierProgressPercentage: 100,
      nextTier: null,
    },
    customerNotes: 'Master system root account for GKN V2 administrative operations.',
    adminNotes: [
      {
        id: 'cnote_7',
        author: 'System Root',
        timestamp: '2025-01-01T00:00:00Z',
        text: 'Owner privilege level initialized.',
      },
    ],
    loginActivity: [
      {
        id: 'log_7',
        timestamp: '2026-08-05T04:20:00Z',
        ipAddress: '127.0.0.1',
        location: 'Local Container Proxy',
        device: 'GKN Admin Studio Workspace',
        status: 'SUCCESS',
      },
    ],
    orders: [],
    stats: {
      lifetimeSpending: 0,
      ordersCompleted: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      favoriteStore: 'N/A',
      mostPurchasedProduct: 'None',
      lastPurchaseDate: 'N/A',
    },
  },
];

const CUSTOMERS_STORAGE_KEY = 'gkn_customers_v2';

const loadCustomersFromStorage = (): CustomerDetail[] => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[CustomerManagementService] Error reading customers from storage:', e);
  }
  // Initialize with ADMIN_MOCK_CUSTOMERS and save
  saveCustomersToStorage(ADMIN_MOCK_CUSTOMERS);
  return ADMIN_MOCK_CUSTOMERS;
};

const saveCustomersToStorage = (customers: CustomerDetail[]) => {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error('[CustomerManagementService] Error saving customers to storage:', e);
  }
};

// Event subscribers listener pool
type CustomerUpdateListener = () => void;
const listeners: Set<CustomerUpdateListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((fn) => fn());
};

export class CustomerManagementService {
  /**
   * Recalculate customer tiers across the entire directory based on current tier settings
   */
  static recalculateAllCustomerTiers(): number {
    const customers = loadCustomersFromStorage();
    const tierSettings = CustomerTierService.getTierSettings();
    let updatedCount = 0;

    const updatedList = customers.map((customer) => {
      const qualifyingSpend = CustomerTierService.calculateQualifyingSpending(customer.orders || []);
      const evaluatedTier = CustomerTierService.determineTierForSpending(
        qualifyingSpend,
        tierSettings,
        customer.tier,
        customer.isManualTierOverride
      );

      const isChanged = customer.tier !== evaluatedTier || customer.qualifyingLifetimeSpending !== qualifyingSpend;
      if (isChanged) updatedCount++;

      return {
        ...customer,
        qualifyingLifetimeSpending: qualifyingSpend,
        tier: evaluatedTier,
        stats: {
          ...customer.stats,
          lifetimeSpending: qualifyingSpend,
        },
      };
    });

    saveCustomersToStorage(updatedList);
    notifyListeners();
    return updatedCount;
  }

  /**
   * Subscribe to real-time customer update events
   */
  static subscribeToCustomerUpdates(callback: CustomerUpdateListener): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  /**
   * Fetch customer directory list with full filtering, sorting, and pagination
   */
  static async getCustomers(filters?: CustomerFilterOptions): Promise<{
    customers: CustomerDetail[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    const rows = await fetchCustomers();
    let customers: CustomerDetail[] = rows.map((row: any) => ({
      id: row.id, customerCode: row.customer_code || row.id.slice(0, 8).toUpperCase(), name: row.full_name,
      email: row.email, phone: row.phone || '', companyOrInstitution: row.company_or_institution || undefined,
      avatarUrl: row.avatar_url || undefined, registrationDate: row.created_at, lastLoginDate: row.last_login_at || row.created_at,
      status: row.status, tier: row.tier, isManualTierOverride: row.is_manual_tier_override,
      qualifyingLifetimeSpending: Number(row.qualifying_lifetime_spending_php), verificationStatus: row.status === 'ACTIVE' ? 'VERIFIED' : 'UNVERIFIED',
      addresses: [], billingInfo: {} as any, wishlist: [], rewardPoints: { currentBalance: row.reward_points, lifetimeEarned: row.reward_points, lifetimeRedeemed: 0, tierProgressPercentage: 0, nextTier: null },
      adminNotes: [], loginActivity: [], orders: [], stats: { lifetimeSpending: Number(row.qualifying_lifetime_spending_php), ordersCompleted: 0, totalOrders: 0, averageOrderValue: 0, favoriteStore: 'N/A', mostPurchasedProduct: 'N/A', lastPurchaseDate: '' },
    }));

    let result = [...customers];

    if (!filters) {
      return {
        customers: result,
        totalCount: result.length,
        totalPages: 1,
        currentPage: 1,
      };
    }

    // 1. Text Search Query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.customerCode.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          (c.companyOrInstitution && c.companyOrInstitution.toLowerCase().includes(q))
      );
    }

    // 2. Status Filter
    if (filters.statusFilter && filters.statusFilter !== 'all') {
      result = result.filter((c) => c.status === filters.statusFilter);
    }

    // 3. Tier Filter
    if (filters.tierFilter && filters.tierFilter !== 'all') {
      result = result.filter((c) => c.tier === filters.tierFilter);
    }

    // 4. Verification Filter
    if (filters.verificationFilter && filters.verificationFilter !== 'all') {
      result = result.filter((c) => c.verificationStatus === filters.verificationFilter);
    }

    // 5. Date Range Filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      result = result.filter((c) => {
        const regDate = new Date(c.registrationDate);
        if (filters.dateRange === '7days') {
          const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return regDate >= past;
        }
        if (filters.dateRange === '30days') {
          const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return regDate >= past;
        }
        if (filters.dateRange === '90days') {
          const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return regDate >= past;
        }
        if (filters.dateRange === 'year') {
          const past = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return regDate >= past;
        }
        if (filters.dateRange === 'custom' && filters.customStartDate && filters.customEndDate) {
          const start = new Date(filters.customStartDate);
          const end = new Date(filters.customEndDate);
          return regDate >= start && regDate <= end;
        }
        return true;
      });
    }

    // 6. Sorting
    const sortBy = filters.sortBy || 'registration_desc';
    result.sort((a, b) => {
      switch (sortBy) {
        case 'registration_desc':
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        case 'registration_asc':
          return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
        case 'spending_desc':
          return b.stats.lifetimeSpending - a.stats.lifetimeSpending;
        case 'spending_asc':
          return a.stats.lifetimeSpending - b.stats.lifetimeSpending;
        case 'orders_desc':
          return b.stats.totalOrders - a.stats.totalOrders;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'last_active_desc':
          return new Date(b.lastLoginDate).getTime() - new Date(a.lastLoginDate).getTime();
        default:
          return 0;
      }
    });

    // 7. Pagination
    const totalCount = result.length;
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const startIndex = (page - 1) * pageSize;
    const paginatedCustomers = result.slice(startIndex, startIndex + pageSize);

    return {
      customers: paginatedCustomers,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  /**
   * Fetch single customer by ID
   */
  static async getCustomerById(id: string): Promise<CustomerDetail | null> {
    const customers = loadCustomersFromStorage();
    const found = customers.find((c) => c.id === id || c.customerCode === id);
    return found ? { ...found } : null;
  }

  /**
   * Update full customer details
   */
  static async updateCustomer(
    id: string,
    updates: Partial<CustomerDetail>
  ): Promise<CustomerDetail | null> {
    const customers = loadCustomersFromStorage();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) return null;

    // If manual tier change is requested, mark isManualTierOverride = true (unless explicitly passed)
    const isManualTierChange = updates.tier && updates.tier !== customers[index].tier;
    const manualFlag = updates.isManualTierOverride !== undefined
      ? updates.isManualTierOverride
      : isManualTierChange
        ? true
        : customers[index].isManualTierOverride;

    customers[index] = {
      ...customers[index],
      ...updates,
      isManualTierOverride: manualFlag,
    };

    saveCustomersToStorage(customers);
    notifyListeners();
    return { ...customers[index] };
  }

  /**
   * Change single customer status
   */
  static async updateCustomerStatus(
    id: string,
    newStatus: CustomerAccountStatus,
    noteText?: string
  ): Promise<CustomerDetail | null> {
    const customer = await this.getCustomerById(id);
    if (!customer) return null;

    const updatedNotes = [...customer.adminNotes];
    if (noteText) {
      updatedNotes.unshift({
        id: `cnote_${Date.now()}`,
        author: 'Admin User',
        timestamp: new Date().toISOString(),
        text: `Status changed to ${newStatus}. Note: ${noteText}`,
      });
    }

    return this.updateCustomer(id, {
      status: newStatus,
      adminNotes: updatedNotes,
    });
  }

  /**
   * Change single customer tier
   */
  static async updateCustomerTier(
    id: string,
    newTier: CustomerTier,
    noteText?: string
  ): Promise<CustomerDetail | null> {
    const customer = await this.getCustomerById(id);
    if (!customer) return null;

    const updatedNotes = [...customer.adminNotes];
    updatedNotes.unshift({
      id: `cnote_${Date.now()}`,
      author: 'Admin User',
      timestamp: new Date().toISOString(),
      text: `Tier adjusted to ${newTier}.${noteText ? ` Note: ${noteText}` : ''}`,
    });

    return this.updateCustomer(id, {
      tier: newTier,
      adminNotes: updatedNotes,
    });
  }

  /**
   * Add internal admin note to customer profile
   */
  static async addAdminNote(
    id: string,
    text: string,
    author: string = 'Admin User'
  ): Promise<CustomerDetail | null> {
    const customer = await this.getCustomerById(id);
    if (!customer) return null;

    const newNote: CustomerAdminNote = {
      id: `cnote_${Date.now()}`,
      author,
      timestamp: new Date().toISOString(),
      text,
    };

    return this.updateCustomer(id, {
      adminNotes: [newNote, ...customer.adminNotes],
    });
  }

  /**
   * Bulk Status Update
   */
  static async bulkUpdateStatus(
    ids: string[],
    newStatus: CustomerAccountStatus
  ): Promise<number> {
    let updatedCount = 0;
    for (const id of ids) {
      const res = await this.updateCustomerStatus(id, newStatus, `Bulk action update to ${newStatus}`);
      if (res) updatedCount++;
    }
    notifyListeners();
    return updatedCount;
  }

  /**
   * Bulk Tier Assignment
   */
  static async bulkUpdateTier(ids: string[], newTier: CustomerTier): Promise<number> {
    let updatedCount = 0;
    for (const id of ids) {
      const res = await this.updateCustomerTier(id, newTier, `Bulk action tier update to ${newTier}`);
      if (res) updatedCount++;
    }
    notifyListeners();
    return updatedCount;
  }

  /**
   * Calculate aggregate metrics for top summary cards
   */
  static async getAggregateStats(): Promise<CustomerAggregateMetrics> {
    const customers = loadCustomersFromStorage();
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === 'ACTIVE').length;
    const vipGoldCount = customers.filter(
      (c) => c.tier === 'VIP' || c.tier === 'GOLD' || c.tier === 'OWNER'
    ).length;
    const pendingVerificationCount = customers.filter(
      (c) => c.status === 'PENDING_VERIFICATION' || c.verificationStatus === 'PENDING_ID'
    ).length;
    const suspendedCount = customers.filter(
      (c) => c.status === 'SUSPENDED' || c.status === 'BANNED' || c.status === 'DISABLED'
    ).length;

    const totalLifetimeRevenue = customers.reduce(
      (acc, c) => acc + (c.qualifyingLifetimeSpending ?? c.stats.lifetimeSpending),
      0
    );

    const customersWithOrders = customers.filter((c) => c.stats.ordersCompleted > 0);
    const averageCustomerAOV =
      customersWithOrders.length > 0
        ? customersWithOrders.reduce((acc, c) => acc + c.stats.averageOrderValue, 0) /
          customersWithOrders.length
        : 0;

    return {
      totalCustomers,
      activeCustomers,
      vipGoldCount,
      pendingVerificationCount,
      suspendedCount,
      totalLifetimeRevenue,
      averageCustomerAOV,
      topFavoriteStore: 'OnHand Vault & GroupBuy',
    };
  }

  /**
   * Export Customers data to CSV / Excel / Sheets format
   */
  static exportCustomers(
    ids?: string[],
    format: 'csv' | 'excel' | 'sheets' = 'csv'
  ): CustomerExportData {
    const customers = loadCustomersFromStorage();
    const targetCustomers =
      ids && ids.length > 0
        ? customers.filter((c) => ids.includes(c.id))
        : customers;

    const headers = [
      'Customer Code',
      'ID',
      'Name',
      'Email',
      'Phone',
      'Institution / Company',
      'Registration Date',
      'Last Active',
      'Account Status',
      'Tier',
      'Verification Status',
      'Total Orders',
      'Lifetime Spending ($)',
      'Reward Points',
      'Default Address',
    ];

    const rows = targetCustomers.map((c) => {
      const defAddr = c.addresses.find((a) => a.isDefault) || c.addresses[0];
      const addrStr = defAddr
        ? `${defAddr.city}, ${defAddr.province}, ${defAddr.country}`
        : 'N/A';

      return [
        `"${c.customerCode}"`,
        `"${c.id}"`,
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        `"${c.companyOrInstitution || ''}"`,
        `"${c.registrationDate}"`,
        `"${c.lastLoginDate}"`,
        `"${c.status}"`,
        `"${c.tier}"`,
        `"${c.verificationStatus}"`,
        c.stats.totalOrders,
        c.stats.lifetimeSpending.toFixed(2),
        c.rewardPoints.currentBalance,
        `"${addrStr}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const timestamp = new Date().toISOString().slice(0, 10);

    return {
      filename: `GKN_Customers_Export_${timestamp}.${format === 'excel' ? 'xlsx' : 'csv'}`,
      format,
      mimeType: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;',
      content: csvContent,
    };
  }

  /**
   * Browser file download helper
   */
  static downloadExport(exportData: CustomerExportData): void {
    const blob = new Blob([exportData.content], { type: exportData.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportData.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
