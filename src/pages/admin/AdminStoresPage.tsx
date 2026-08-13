import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProductManagementService } from '../../services/productManagementService';
import { systemSettingsService } from '../../services/systemSettingsService';
import {
  AdminProduct,
  AdminStoreType,
  ProductListResult,
  ExportFormat,
} from '../../types/adminProduct';
import { ProductToolbar } from '../../components/admin/product/ProductToolbar';
import { ProductTable } from '../../components/admin/product/ProductTable';
import { ProductEditorModal } from '../../components/admin/product/ProductEditorModal';
import { ProductImportModal } from '../../components/admin/product/ProductImportModal';
import { StoreSettingsEditorModal } from '../../components/admin/store/StoreSettingsEditorModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { getEffectiveStoreStatus } from '../../utils/storeStatusUtils';
import { StoreConfig } from '../../types/systemSettings';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Package,
  Layers,
  Box,
  Factory,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
} from 'lucide-react';

export const AdminStoresPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeType: urlStoreParam } = useParams<{ storeType?: string }>();

  // Determine initial store from URL path
  const getInitialStoreFromUrl = useCallback((): string => {
    if (urlStoreParam) return urlStoreParam.toLowerCase();
    if (location.pathname.includes('/groupbuy')) return 'groupbuy';
    if (location.pathname.includes('/onhand')) return 'onhand';
    if (location.pathname.includes('/moq')) return 'moq';
    return 'all';
  }, [location.pathname, urlStoreParam]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStore, setActiveStore] = useState<string>(getInitialStoreFromUrl());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category' | 'status' | 'lastUpdated'>(
    'lastUpdated'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Store Config & Settings State
  const [storeSettingsMap, setStoreSettingsMap] = useState(() => systemSettingsService.getSettings().stores);
  const [editingStoreConfig, setEditingStoreConfig] = useState<StoreConfig | null>(null);

  // GroupBuy Store Status Evaluation
  const gbStore = storeSettingsMap.groupbuy;
  const gbEffective = getEffectiveStoreStatus(gbStore);
  const isGroupBuyOpen = gbEffective.isOpen;

  // Table Data & Selection State
  const [listResult, setListResult] = useState<ProductListResult>({
    products: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    storeCounts: { all: 0, groupbuy: 0, onhand: 0, moq: 0 },
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [deletingProductTarget, setDeletingProductTarget] = useState<{ id: string; name: string } | null>(null);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  // Sync URL store param with state if location changes
  useEffect(() => {
    const storeFromUrl = getInitialStoreFromUrl();
    if (storeFromUrl !== activeStore) {
      setActiveStore(storeFromUrl);
      setPage(1);
    }
  }, [location.pathname, urlStoreParam, getInitialStoreFromUrl]);

  // Subscribe to system settings changes for store configurations
  useEffect(() => {
    const unsubscribe = systemSettingsService.subscribe((settings) => {
      if (settings.stores) {
        setStoreSettingsMap(settings.stores);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveStoreConfig = (updatedStore: StoreConfig) => {
    const nextStores = {
      ...storeSettingsMap,
      [updatedStore.key]: updatedStore,
    };
    systemSettingsService.saveSettings({ stores: nextStores });
    setStoreSettingsMap(nextStores);
  };

  // Fetch Products Handler
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ProductManagementService.getProducts({
        search: searchTerm,
        storeType: activeStore,
        category: selectedCategory,
        status: selectedStatus,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });
      setListResult(res);
      setCategories(ProductManagementService.getCategories());
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, activeStore, selectedCategory, selectedStatus, sortBy, sortOrder, page, pageSize]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle GroupBuy Store Toggle (OPEN / CLOSED)
  const handleToggleGroupBuyStoreStatus = () => {
    const currentStores = systemSettingsService.getSettings().stores;
    const currentGb = currentStores.groupbuy;
    const nextState = !isGroupBuyOpen;

    const nextStores = {
      ...currentStores,
      groupbuy: {
        ...currentGb,
        enabled: nextState,
      },
    };

    systemSettingsService.saveSettings({ stores: nextStores });
    setStoreSettingsMap(nextStores);
  };

  // Handle Store Tab Change
  const handleStoreTabChange = (store: string) => {
    setActiveStore(store);
    setPage(1);
    setSelectedIds([]);
    if (store === 'all') {
      navigate('/admin/stores');
    } else {
      navigate(`/admin/stores/${store}`);
    }
  };

  // Row Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(listResult.products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Single Actions
  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleDuplicate = async (id: string) => {
    try {
      await ProductManagementService.duplicateProduct(id);
      await loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: string) => {
    const targetProduct = listResult.products.find((p) => p.id === id);
    const pName = targetProduct ? targetProduct.name : 'this product';
    setDeletingProductTarget({ id, name: pName });
  };

  const confirmDeleteSingle = async () => {
    if (!deletingProductTarget) return;
    try {
      await ProductManagementService.deleteProduct(deletingProductTarget.id, activeStore);
      setSelectedIds((prev) => prev.filter((i) => i !== deletingProductTarget.id));
      await loadProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingProductTarget(null);
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      await ProductManagementService.updateVisibility(id, !currentVisibility);
      await loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (productData: any) => {
    if (productData.id) {
      await ProductManagementService.updateProduct(productData.id, productData);
    } else {
      await ProductManagementService.createProduct(productData);
    }
    await loadProducts();
  };

  // Bulk Actions
  const handleBulkActivate = async () => {
    if (selectedIds.length === 0) return;
    await ProductManagementService.bulkUpdateStatus(selectedIds, 'Active');
    setSelectedIds([]);
    await loadProducts();
  };

  const handleBulkDeactivate = async () => {
    if (selectedIds.length === 0) return;
    await ProductManagementService.bulkUpdateStatus(selectedIds, 'Inactive');
    setSelectedIds([]);
    await loadProducts();
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleteConfirmOpen(true);
  };

  const confirmDeleteBulk = async () => {
    if (selectedIds.length === 0) return;
    try {
      await ProductManagementService.bulkDelete(selectedIds, activeStore);
      setSelectedIds([]);
      await loadProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsBulkDeleteConfirmOpen(false);
    }
  };

  const handleBulkDuplicate = async () => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await ProductManagementService.duplicateProduct(id);
    }
    setSelectedIds([]);
    await loadProducts();
  };

  // Export Trigger
  const handleExport = async (format: ExportFormat = 'csv', idsToExport?: string[]) => {
    const csvContent = await ProductManagementService.exportProducts(
      idsToExport || selectedIds,
      format,
      activeStore
    );
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gkn_${activeStore}_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleCsv = () => {
    let csvContent = '';
    const filename = `gkn_${activeStore}_sample.csv`;

    if (activeStore === 'onhand') {
      csvContent =
        'Product Name,Variant Name,Category,CAS Registry Number,Short Description,SKU,USD Retail Price,Manufacturer Cost,Minimum Order,Order Step,Inventory Quantity,Visibility,Status\n' +
        '"Semaglutide 5mg Vials","5mg Single Vial","OnHand","910463-68-2","In-stock ready to ship","GKN-SEMA-5MG",95.00,42.00,1,1,340,"Visible","Active"\n' +
        '"BPC-157 5mg Vials","5mg Single Vial","OnHand","863288-34-0","In-stock cold vault","GKN-BPC-5MG",45.00,20.00,1,1,120,"Visible","Active"\n';
    } else if (activeStore === 'moq') {
      csvContent =
        'Product Name,Variant Name,Category,CAS Registry Number,Short Description,SKU,USD Retail Price,Manufacturer Cost,Minimum Order,Order Step,Target Kits,MOQ Status,Visibility,Status\n' +
        '"Retatrutide 10mg","10mg (10 Vials / Tray)","Custom Synthesis","2381089-83-2","Custom synthesis batch","GKN-RETA-10MG-MOQ",340.00,180.00,5,1,100,"Collecting Orders","Visible","Active"\n';
    } else {
      csvContent =
        'Product Name,Variant Name,Category,CAS Registry Number,Short Description,SKU,USD Retail Price,Manufacturer Cost,Minimum Order,Order Step,Visibility,Status\n' +
        '"Tirzepatide","10mg","Active","2023788-19-2","Research peptide pre-order","GKN-TZ10-10MG",120.00,65.00,1,1,"Visible","Active"\n' +
        '"Semaglutide","5mg","Active","910463-68-2","GLP-1 pre-order","GKN-SEMA-5MG",95.00,42.00,1,1,"Visible","Active"\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Overview Metric Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Products Count for active store or total */}
        <div className="p-4 rounded-2xl bg-[#070B14] border border-white/10 flex items-center justify-between h-full">
          <div className="space-y-1 font-mono min-w-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block truncate">
              {activeStore === 'all'
                ? 'TOTAL CATALOG PRODUCTS'
                : `${activeStore.toUpperCase()} PRODUCTS`}
            </span>
            <div className="text-2xl font-black text-white">
              {listResult.storeCounts[activeStore as keyof typeof listResult.storeCounts] ?? listResult.storeCounts.all}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 flex-shrink-0" />{' '}
              {activeStore === 'all' ? 'All Stores Catalog' : `${activeStore.toUpperCase()} Store Active`}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#00D9FF] flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Selected Store Status Control Card */}
        {(() => {
          const currentStore = storeSettingsMap[activeStore] || storeSettingsMap.groupbuy;
          const currentEffective = getEffectiveStoreStatus(currentStore);
          const isOpen = currentEffective.isOpen;

          return (
            <div
              className="p-4 rounded-2xl bg-[#070B14] flex items-center justify-between h-full border"
              style={{ borderColor: `${currentStore.accentColor || '#00D9FF'}40` }}
            >
              <div className="space-y-1 font-mono min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block truncate">
                  {currentStore.name.toUpperCase()} STORE STATUS
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-extrabold uppercase font-mono ${
                      isOpen ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {currentEffective.statusLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingStoreConfig(currentStore)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all border bg-slate-800 border-slate-700 text-[#00D9FF] hover:bg-slate-700"
                  >
                    CONFIGURE
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">
                  {currentEffective.reason}
                </span>
              </div>
              <div
                className={`p-3 rounded-xl border flex-shrink-0 ${
                  isOpen
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {isOpen ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
            </div>
          );
        })()}

        {/* Card 3: Store Specific Capability / Metric */}
        {(() => {
          const currentStore = storeSettingsMap[activeStore] || storeSettingsMap.groupbuy;
          const caps = currentStore.capabilities || { openCloseControl: true, inventoryManagement: false, variantInventory: false };

          if (activeStore === 'onhand') {
            return (
              <div className="p-4 rounded-2xl bg-[#070B14] border border-[#00D9FF]/30 flex items-center justify-between h-full">
                <div className="space-y-1 font-mono min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block truncate">
                    INVENTORY MANAGEMENT
                  </span>
                  <div className="text-xl font-black text-[#00D9FF]">
                    {caps.inventoryManagement ? 'ENABLED' : 'DISABLED'}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block truncate">
                    Ready to Ship Stock
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] flex-shrink-0">
                  <Box className="w-6 h-6" />
                </div>
              </div>
            );
          } else if (activeStore === 'moq') {
            return (
              <div className="p-4 rounded-2xl bg-[#070B14] border border-[#FF2ED1]/30 flex items-center justify-between h-full">
                <div className="space-y-1 font-mono min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block truncate">
                    MINIMUM ORDER QUOTA
                  </span>
                  <div className="text-xl font-black text-[#FF2ED1]">BULK ORDERS</div>
                  <span className="text-[10px] text-slate-400 font-bold block truncate">
                    Manufacturer Batches
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FF2ED1]/10 border border-[#FF2ED1]/30 text-[#FF2ED1] flex-shrink-0">
                  <Factory className="w-6 h-6" />
                </div>
              </div>
            );
          } else {
            return (
              <div className="p-4 rounded-2xl bg-[#070B14] border border-[#8B5CF6]/30 flex items-center justify-between h-full">
                <div className="space-y-1 font-mono min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block truncate">
                    GROUPBUY BATCH STATE
                  </span>
                  <div className="text-xl font-black text-[#8B5CF6]">BATCH #1</div>
                  <span className="text-[10px] text-slate-400 font-bold block truncate">
                    Active Pre-Order Window
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            );
          }
        })()}

        {/* Card 4: Availability Mode or Secondary Metric */}
        {(() => {
          const currentStore = storeSettingsMap[activeStore] || storeSettingsMap.groupbuy;
          const availMode = currentStore.availability?.scheduleMode || 'Manual';

          return (
            <div className="p-4 rounded-2xl bg-[#070B14] border border-white/10 flex items-center justify-between h-full">
              <div className="space-y-1 font-mono min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block truncate">
                  AVAILABILITY MODE
                </span>
                <div className="text-xl font-black text-white uppercase">{availMode}</div>
                <span className="text-[10px] text-slate-400 font-bold block truncate">
                  Timezone: {currentStore.availability?.timezone || 'Asia/Manila'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex-shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Main Product Management Card */}
      <Card
        title={
          activeStore === 'groupbuy'
            ? 'GroupBuy Store — Pre-Order Catalog'
            : activeStore === 'onhand'
            ? 'OnHand Store — Immediate Stock Catalog'
            : activeStore === 'moq'
            ? 'MOQ Store — Bulk Contract Catalog'
            : 'Store Engine & Product Management'
        }
        subtitle={
          activeStore === 'groupbuy'
            ? 'Manage GroupBuy pre-order products. Pre-orders are controlled at the store level (OPEN or CLOSED).'
            : 'Manage unified product definitions, store allocations, variants, and inventory settings.'
        }
      >
        <div className="space-y-6 pt-2">
          {/* Toolbar */}
          <ProductToolbar
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            activeStore={activeStore}
            onStoreChange={handleStoreTabChange}
            storeCounts={listResult.storeCounts}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setPage(1);
            }}
            categories={categories}
            selectedStatus={selectedStatus}
            onStatusChange={(st) => {
              setSelectedStatus(st);
              setPage(1);
            }}
            sortBy={sortBy}
            onSortChange={(sb) => setSortBy(sb)}
            sortOrder={sortOrder}
            onToggleSortOrder={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            selectedIds={selectedIds}
            onBulkActivate={handleBulkActivate}
            onBulkDeactivate={handleBulkDeactivate}
            onBulkDelete={handleBulkDelete}
            onBulkDuplicate={handleBulkDuplicate}
            onBulkExport={() => handleExport('csv', selectedIds)}
            onOpenCreateModal={handleCreateNew}
            onOpenImportModal={() => setIsImportOpen(true)}
            onExportAll={(fmt) => handleExport(fmt)}
            onDownloadSampleCsv={handleDownloadSampleCsv}
          />

          {/* Table */}
          <ProductTable
            products={listResult.products}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
            page={listResult.page}
            totalPages={listResult.totalPages}
            totalCount={listResult.totalCount}
            pageSize={listResult.pageSize}
            onPageChange={(p) => setPage(p)}
            isLoading={isLoading}
          />
        </div>
      </Card>

      {/* Unified Product Editor Modal */}
      <ProductEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        initialStoreType={(activeStore === 'all' ? 'groupbuy' : activeStore) as AdminStoreType}
      />

      {/* CSV / Excel Import Modal */}
      <ProductImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportComplete={() => loadProducts()}
        activeStore={activeStore}
      />

      {/* Store Settings & Capabilities Modal */}
      <StoreSettingsEditorModal
        isOpen={!!editingStoreConfig}
        store={editingStoreConfig}
        onClose={() => setEditingStoreConfig(null)}
        onSave={handleSaveStoreConfig}
      />

      {/* Delete Confirmation Modal (Single Product) */}
      <ConfirmModal
        isOpen={!!deletingProductTarget}
        onClose={() => setDeletingProductTarget(null)}
        onConfirm={confirmDeleteSingle}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProductTarget?.name || 'this product'}" from ${activeStore === 'all' ? 'the product catalog' : `the ${activeStore.toUpperCase()} store`}? This action will remove the product configuration for this store.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteBulk}
        title="Bulk Delete Products"
        message={`Are you sure you want to delete ${selectedIds.length} selected product(s) from ${activeStore === 'all' ? 'all stores' : `the ${activeStore.toUpperCase()} store`}? This action will remove the configuration for the selected store.`}
        confirmText={`Delete ${selectedIds.length} Products`}
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
