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
import { getSupabaseClient } from '../lib/supabase';

// Initial Mock Database for Admin Customer Management (Clean Empty Fallback)
const ADMIN_MOCK_CUSTOMERS: CustomerDetail[] = [];

const CUSTOMERS_STORAGE_KEY = 'gkn_customers_v2';

const loadCustomersFromStorage = (): CustomerDetail[] => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[CustomerManagementService] Error reading customers from storage:', e);
  }
  return [];
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
      id: row.id,
      customerCode: row.customer_code || 'UNASSIGNED',
      name: row.full_name || 'Customer',
      email: row.email,
      phone: row.phone || '',
      companyOrInstitution: row.company_or_institution || undefined,
      avatarUrl: row.avatar_url || undefined,
      registrationDate: row.created_at,
      lastLoginDate: row.last_login_at || row.created_at,
      status: row.status || 'ACTIVE',
      role: row.role || 'CUSTOMER',
      tier: row.tier || 'STANDARD',
      isManualTierOverride: Boolean(row.is_manual_tier_override),
      qualifyingLifetimeSpending: Number(row.qualifying_lifetime_spending_php || 0),
      verificationStatus: row.verification_status || (row.status === 'ACTIVE' ? 'VERIFIED' : 'UNVERIFIED'),
      addresses: [],
      billingInfo: {} as any,
      wishlist: [],
      rewardPoints: {
        currentBalance: row.reward_points || 0,
        lifetimeEarned: row.reward_points || 0,
        lifetimeRedeemed: 0,
        tierProgressPercentage: 0,
        nextTier: null,
      },
      adminNotes: [],
      loginActivity: [],
      orders: [],
      stats: {
        lifetimeSpending: Number(row.qualifying_lifetime_spending_php || 0),
        ordersCompleted: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        favoriteStore: 'N/A',
        mostPurchasedProduct: 'N/A',
        lastPurchaseDate: '',
      },
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
    const result = await this.getCustomers({ searchQuery: id, page: 1, pageSize: 100 });
    return result.customers.find((customer) => customer.id === id || customer.customerCode === id) || null;
  }

  /**
   * Update full customer details
   */
  static async updateCustomer(
    id: string,
    updates: Partial<CustomerDetail>
  ): Promise<CustomerDetail | null> {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase is required to update customer profiles.');
    const { data: currentRow, error: currentError } = await client.from('profiles').select('*').eq('id', id).single();
    const current: any = currentRow;
    if (currentError || !current) throw currentError || new Error('Customer profile not found.');

    const isManualTierChange = updates.tier && updates.tier !== current.tier;
    const manualFlag = updates.isManualTierOverride !== undefined
      ? updates.isManualTierOverride
      : isManualTierChange
        ? true
        : current.is_manual_tier_override;

    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined) payload.full_name = updates.name.trim();
    if (updates.phone !== undefined) payload.phone = updates.phone.trim();
    if (updates.companyOrInstitution !== undefined) payload.company_or_institution = updates.companyOrInstitution.trim() || null;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.tier !== undefined) {
      payload.tier = updates.tier;
      payload.is_manual_tier_override = manualFlag;
    }
    if (updates.role !== undefined && updates.role !== current.role) {
      if (current.role === 'OWNER' || updates.role === 'OWNER') throw new Error('OWNER roles are managed directly in Supabase.');
      if (!['CUSTOMER', 'STAFF', 'ADMIN'].includes(updates.role)) throw new Error('Unsupported account role.');
      payload.role = updates.role;
    }
    payload.updated_at = new Date().toISOString();

    const { error } = await client.from('profiles').update(payload as any).eq('id', id);
    if (error) throw error;
    notifyListeners();
    return this.getCustomerById(id);
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
      (c) => c.tier === 'VIP' || c.tier === 'GOLD'
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
      'Company',
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

