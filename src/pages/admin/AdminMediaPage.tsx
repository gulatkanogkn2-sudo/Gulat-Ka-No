import React, { useState, useEffect } from 'react';
import {
  Search,
  Grid,
  List,
  Sparkles,
  ShieldCheck,
  Check,
  Trash2,
  Copy,
  Archive,
  Download,
  Plus,
  RefreshCw,
  AlertTriangle,
  X,
  FileText,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';
import { mediaLibraryService } from '../../services/mediaLibraryService';
import {
  MediaAssetItem,
  MediaCategory,
  MediaFilterOptions,
  MediaViewMode,
  MediaVisibility,
} from '../../types/mediaLibrary';
import { MediaTable } from '../../components/admin/media/MediaTable';
import { MediaGrid } from '../../components/admin/media/MediaGrid';
import { MediaDetailDrawer } from '../../components/admin/media/MediaDetailDrawer';
import { MediaUploadModal } from '../../components/admin/media/MediaUploadModal';
import { MediaBulkBar } from '../../components/admin/media/MediaBulkBar';

type MainCategoryTab =
  | 'ALL'
  | 'WEBSITE'
  | 'PRODUCTS'
  | 'RESEARCH'
  | 'COA'
  | 'PROTOCOLS'
  | 'PAYMENTS'
  | 'DOCUMENTS';

const CATEGORY_TABS: { id: MainCategoryTab; label: string }[] = [
  { id: 'ALL', label: 'ALL' },
  { id: 'WEBSITE', label: 'WEBSITE' },
  { id: 'PRODUCTS', label: 'PRODUCTS' },
  { id: 'RESEARCH', label: 'RESEARCH' },
  { id: 'COA', label: 'COA' },
  { id: 'PROTOCOLS', label: 'PROTOCOLS' },
  { id: 'PAYMENTS', label: 'PAYMENTS' },
  { id: 'DOCUMENTS', label: 'DOCUMENTS' },
];

const CATEGORY_TAB_MAPPINGS: Record<MainCategoryTab, MediaCategory[]> = {
  ALL: [],
  WEBSITE: ['Website', 'Homepage', 'Hero Images', 'Store Cards', 'Logos', 'Icons'],
  PRODUCTS: ['Products'],
  RESEARCH: ['Research', 'Calculator Assets'],
  COA: ['COA'],
  PROTOCOLS: ['Protocols'],
  PAYMENTS: ['Payment Assets', 'QR Codes'],
  DOCUMENTS: ['Documents', 'Other'],
};

export const AdminMediaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainCategoryTab>('ALL');
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<MediaViewMode>('table');

  // Filters State
  const [filters, setFilters] = useState<MediaFilterOptions>({
    search: '',
    category: 'ALL',
    fileType: 'ALL',
    dateFilter: 'ALL',
    visibility: 'ALL',
    isArchived: false,
    sortBy: 'uploadDate',
    sortOrder: 'desc',
  });

  // Modal / Drawer / Deletion States
  const [selectedAssetForInspect, setSelectedAssetForInspect] = useState<MediaAssetItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Safe Deletion Modals
  const [blockedDeleteAsset, setBlockedDeleteAsset] = useState<MediaAssetItem | null>(null);
  const [confirmDeleteAsset, setConfirmDeleteAsset] = useState<MediaAssetItem | null>(null);

  // Asset Replace Modal
  const [replaceTargetAsset, setReplaceTargetAsset] = useState<MediaAssetItem | null>(null);
  const [replaceUrlInput, setReplaceUrlInput] = useState('');
  const [replaceTitleInput, setReplaceTitleInput] = useState('');

  const refreshData = () => {
    const allAssets = mediaLibraryService.getAssets(filters);

    // Apply main category tab filter if not ALL
    let filtered = allAssets;
    if (activeTab !== 'ALL') {
      const allowedCategories = CATEGORY_TAB_MAPPINGS[activeTab];
      filtered = allAssets.filter((a) => allowedCategories.includes(a.category));
    }

    setAssets(filtered);
  };

  useEffect(() => {
    refreshData();
  }, [filters, activeTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === assets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assets.map((a) => a.id));
    }
  };

  // Inspect Drawer
  const handleInspectAsset = (asset: MediaAssetItem) => {
    setSelectedAssetForInspect(asset);
    setIsDetailDrawerOpen(true);
  };

  // Save updates from drawer
  const handleSaveAssetUpdates = (id: string, updates: Partial<MediaAssetItem>) => {
    const updated = mediaLibraryService.replaceAsset(id, updates);
    if (updated) {
      showToast(`Asset "${updated.title}" updated successfully.`);
      refreshData();
      if (selectedAssetForInspect && selectedAssetForInspect.id === id) {
        setSelectedAssetForInspect(updated);
      }
    }
  };

  // Replace Asset handler
  const handleOpenReplaceModal = (asset: MediaAssetItem) => {
    setReplaceTargetAsset(asset);
    setReplaceUrlInput(asset.url);
    setReplaceTitleInput(asset.title);
  };

  const handleConfirmReplace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceTargetAsset || !replaceUrlInput.trim()) return;

    const updated = mediaLibraryService.replaceAsset(replaceTargetAsset.id, {
      url: replaceUrlInput.trim(),
      title: replaceTitleInput.trim() || replaceTargetAsset.title,
    });

    if (updated) {
      showToast(`Successfully replaced media source for "${updated.title}".`);
      refreshData();
      setReplaceTargetAsset(null);
      if (selectedAssetForInspect?.id === replaceTargetAsset.id) {
        setSelectedAssetForInspect(updated);
      }
    }
  };

  // Duplicate Asset
  const handleDuplicateAsset = (id: string) => {
    const duplicated = mediaLibraryService.duplicateAsset(id);
    if (duplicated) {
      showToast(`Duplicated asset created: "${duplicated.title}".`);
      refreshData();
      setIsDetailDrawerOpen(false);
    }
  };

  // Toggle Archive
  const handleToggleArchiveAsset = (id: string, isArchived: boolean) => {
    mediaLibraryService.archiveAsset(id, isArchived);
    showToast(`Asset archive status updated to ${isArchived ? 'Archived' : 'Active'}.`);
    refreshData();
    setIsDetailDrawerOpen(false);
  };

  // Safe Delete Request Handler
  const handleDeleteRequest = (id: string) => {
    const target = assets.find((a) => a.id === id) || mediaLibraryService.getAssetById(id);
    if (!target) return;

    if (target.usageCount > 0) {
      // Block deletion and show references modal
      setBlockedDeleteAsset(target);
    } else {
      // Show deletion confirmation modal
      setConfirmDeleteAsset(target);
    }
  };

  // Execute Safe Delete
  const handleExecuteDelete = () => {
    if (!confirmDeleteAsset) return;
    const res = mediaLibraryService.deleteAsset(confirmDeleteAsset.id);
    if (res.success) {
      showToast('Asset deleted successfully.');
      refreshData();
      setIsDetailDrawerOpen(false);
      setConfirmDeleteAsset(null);
    } else {
      showToast(`⚠️ ${res.message}`);
      setConfirmDeleteAsset(null);
    }
  };

  // Download Asset
  const handleDownloadAsset = (asset: MediaAssetItem) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.target = '_blank';
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Initiating download for ${asset.name}...`);
  };

  // Copy Reference
  const handleCopyReference = (asset: MediaAssetItem) => {
    navigator.clipboard.writeText(asset.storagePath);
    showToast(`Copied storage path: ${asset.storagePath}`);
  };

  // Upload handler
  const handleUploadSuccess = (data: any) => {
    const created = mediaLibraryService.uploadAsset(data);
    showToast(`Successfully indexed asset "${created.title}" in Media Library.`);
    refreshData();
  };

  // Bulk Actions
  const handleBulkMoveCategory = (category: MediaCategory) => {
    const count = mediaLibraryService.bulkMoveCategory(selectedIds, category);
    showToast(`Moved ${count} asset(s) to "${category}".`);
    setSelectedIds([]);
    refreshData();
  };

  const handleBulkArchive = (archiveState: boolean) => {
    const count = mediaLibraryService.bulkArchive(selectedIds, archiveState);
    showToast(`${archiveState ? 'Archived' : 'Restored'} ${count} asset(s).`);
    setSelectedIds([]);
    refreshData();
  };

  const handleBulkDelete = () => {
    const res = mediaLibraryService.bulkDelete(selectedIds);
    if (res.blockedCount > 0) {
      showToast(
        `Deleted ${res.deletedCount} asset(s). Blocked ${res.blockedCount} asset(s) in active use: (${res.blockedNames.join(', ')})`
      );
    } else {
      showToast(`Deleted ${res.deletedCount} asset(s) successfully.`);
    }
    setSelectedIds([]);
    refreshData();
  };

  const handleBulkExportMetadata = () => {
    mediaLibraryService.exportMetadata(selectedIds, 'csv');
    showToast(`Exported metadata CSV for ${selectedIds.length || assets.length} assets.`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-cyan-500 text-cyan-300 px-4 py-3 rounded-2xl shadow-2xl text-xs font-mono flex items-center gap-2 animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Simplified Clean Header Section */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800 uppercase tracking-wider">
              GKN V2 Media Library
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Central Storage
            </span>
          </div>

          <h1 className="text-xl font-extrabold text-white">MEDIA ASSETS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized media and document library for reusable GKN V2 website and research assets.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 bg-[#00D9FF] hover:bg-[#00c4e6] text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-[#00D9FF]/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Upload Asset
          </button>
        </div>
      </div>

      {/* Simplified Search & Category Filter Navigation */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search assets by name, title, tags, or file location..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-[#00D9FF] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Primary Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00D9FF] text-black border border-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Basic Useful Sub-filters Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* File Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-mono text-[10px] uppercase">File Type:</span>
              <select
                value={filters.fileType || 'ALL'}
                onChange={(e) => setFilters({ ...filters, fileType: e.target.value as any })}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 font-mono text-xs focus:outline-none focus:border-[#00D9FF]"
              >
                <option value="ALL">All File Types</option>
                <option value="IMAGE">Images (JPG/PNG/WEBP/SVG)</option>
                <option value="DOCUMENT">Documents (PDF/XLSX/ZIP)</option>
                <option value="PDF">PDF Only</option>
                <option value="PNG">PNG Only</option>
                <option value="WEBP">WEBP Only</option>
              </select>
            </div>

            {/* Visibility Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Visibility:</span>
              <select
                value={filters.visibility || 'ALL'}
                onChange={(e) => setFilters({ ...filters, visibility: e.target.value as any })}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 font-mono text-xs focus:outline-none focus:border-[#00D9FF]"
              >
                <option value="ALL">All Visibilities</option>
                <option value="PUBLIC">PUBLIC</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="ADMIN_ONLY">ADMIN_ONLY</option>
              </select>
            </div>

            {/* Archived Toggle */}
            <button
              onClick={() => setFilters({ ...filters, isArchived: !filters.isArchived })}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-colors border cursor-pointer ${
                filters.isArchived
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {filters.isArchived ? 'View: Archived' : 'View: Active Assets'}
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#00D9FF] text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#00D9FF] text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Asset List View */}
      {viewMode === 'table' ? (
        <MediaTable
          assets={assets}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onInspectAsset={handleInspectAsset}
          onCopyReference={handleCopyReference}
          onDownloadAsset={handleDownloadAsset}
          onDeleteAsset={handleDeleteRequest}
        />
      ) : (
        <MediaGrid
          assets={assets}
          selectedIds={selectedIds}
          viewMode={viewMode}
          onToggleSelect={handleToggleSelect}
          onInspectAsset={handleInspectAsset}
          onCopyReference={handleCopyReference}
          onDownloadAsset={handleDownloadAsset}
          onDeleteAsset={handleDeleteRequest}
        />
      )}

      {/* Bulk Toolbar */}
      <MediaBulkBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkMoveCategory={handleBulkMoveCategory}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
        onBulkExportMetadata={handleBulkExportMetadata}
      />

      {/* Inspect / Detail Drawer */}
      <MediaDetailDrawer
        asset={selectedAssetForInspect}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        onSaveUpdates={handleSaveAssetUpdates}
        onDuplicate={handleDuplicateAsset}
        onToggleArchive={handleToggleArchiveAsset}
        onDownload={handleDownloadAsset}
        onDelete={handleDeleteRequest}
      />

      {/* Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* SAFE DELETION BLOCKED MODAL */}
      {blockedDeleteAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-xl flex-shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Safe Deletion Protection Triggered</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Cannot delete <span className="font-bold text-amber-300">"{blockedDeleteAsset.title}"</span>. This asset is actively referenced across <span className="font-mono text-cyan-400 font-bold">{blockedDeleteAsset.usageCount} location(s)</span>.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 max-h-48 overflow-y-auto">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Active Integration References:
              </div>
              {blockedDeleteAsset.usageReferences?.map((ref) => (
                <div
                  key={ref.id || ref.locationName}
                  className="flex items-center justify-between text-xs font-mono p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
                >
                  <span className="text-[#00D9FF] font-bold">{ref.moduleName}</span>
                  <span className="text-slate-400">{ref.locationName}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 italic">
              To delete this asset, first remove or replace its reference in the corresponding modules.
            </p>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setBlockedDeleteAsset(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE UNUSED ASSET MODAL */}
      {confirmDeleteAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-950/80 border border-rose-800 text-rose-400 rounded-xl flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Confirm Asset Deletion</h3>
                <p className="text-xs text-slate-400 mt-0.5">Unused asset — safe to remove.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete <span className="font-bold text-white">"{confirmDeleteAsset.title}"</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setConfirmDeleteAsset(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPLACE ASSET SOURCE MODAL */}
      {replaceTargetAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#00D9FF]" />
                Replace Media Source for "{replaceTargetAsset.title}"
              </h3>
              <button
                onClick={() => setReplaceTargetAsset(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReplace} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  New Media URL / Asset Source Pointer *
                </label>
                <input
                  type="text"
                  required
                  value={replaceUrlInput}
                  onChange={(e) => setReplaceUrlInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-[#00D9FF] focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Display Title
                </label>
                <input
                  type="text"
                  value={replaceTitleInput}
                  onChange={(e) => setReplaceTitleInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400">
                Replacing the media source retains the existing ID (<span className="text-cyan-400">{replaceTargetAsset.id}</span>) so all active integration references remain connected without breaking.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReplaceTargetAsset(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00D9FF] hover:bg-[#00c4e6] text-black font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Confirm Replace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
