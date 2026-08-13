import React from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Layers,
  Box,
  Factory,
  CheckSquare,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ArrowUpDown,
} from 'lucide-react';
import { Badge } from '../../common/Badge';
import { AdminProductStatus, ExportFormat } from '../../../types/adminProduct';

interface ProductToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeStore: string; // 'all' | 'groupbuy' | 'onhand' | 'moq'
  onStoreChange: (store: string) => void;
  storeCounts: {
    all: number;
    groupbuy: number;
    onhand: number;
    moq: number;
  };
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: any) => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  selectedIds: string[];
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
  onBulkDuplicate: () => void;
  onBulkExport: () => void;
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onExportAll: (format: ExportFormat) => void;
  onDownloadSampleCsv: () => void;
}

export const ProductToolbar: React.FC<ProductToolbarProps> = ({
  searchTerm,
  onSearchChange,
  activeStore,
  onStoreChange,
  storeCounts,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  sortOrder,
  onToggleSortOrder,
  selectedIds,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  onBulkDuplicate,
  onBulkExport,
  onOpenCreateModal,
  onOpenImportModal,
  onExportAll,
  onDownloadSampleCsv,
}) => {
  const hasSelection = selectedIds.length > 0;
  const storeLabel = activeStore === 'all' ? 'ALL' : activeStore.toUpperCase();

  return (
    <div className="space-y-4 font-sans">
      {/* Store Tabs (All, GroupBuy, OnHand, MOQ) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => onStoreChange('all')}
            className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-2 font-bold ${
              activeStore === 'all'
                ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span>ALL STORES</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">
              {storeCounts.all}
            </span>
          </button>

          <button
            onClick={() => onStoreChange('groupbuy')}
            className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-2 font-bold ${
              activeStore === 'groupbuy'
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>GROUPBUY</span>
            <span className="px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px]">
              {storeCounts.groupbuy}
            </span>
          </button>

          <button
            onClick={() => onStoreChange('onhand')}
            className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-2 font-bold ${
              activeStore === 'onhand'
                ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>ONHAND VAULT</span>
            <span className="px-1.5 py-0.5 rounded bg-[#00D9FF]/20 text-[#00D9FF] text-[10px]">
              {storeCounts.onhand}
            </span>
          </button>

          <button
            onClick={() => onStoreChange('moq')}
            className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-2 font-bold ${
              activeStore === 'moq'
                ? 'bg-[#FF2ED1]/20 border-[#FF2ED1] text-[#FF2ED1] shadow-[0_0_15px_rgba(255,46,209,0.3)]'
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Factory className="w-3.5 h-3.5 text-[#FF2ED1]" />
            <span>MOQ MFG</span>
            <span className="px-1.5 py-0.5 rounded bg-[#FF2ED1]/20 text-[#FF2ED1] text-[10px]">
              {storeCounts.moq}
            </span>
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={onOpenImportModal}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 flex items-center gap-1.5 transition-colors"
            title={`Import CSV into ${storeLabel} Store`}
          >
            <Upload className="w-3.5 h-3.5 text-[#00D9FF]" />
            IMPORT CSV
          </button>

          <button
            onClick={() => onExportAll('csv')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 flex items-center gap-1.5 transition-colors"
            title={`Export ${storeLabel} Store products`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            EXPORT {storeLabel} CSV
          </button>

          <button
            onClick={onDownloadSampleCsv}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-[#00D9FF] hover:text-white hover:border-[#00D9FF]/40 flex items-center gap-1.5 transition-colors"
            title={`Download ${storeLabel} Store Sample CSV template`}
          >
            <Download className="w-3.5 h-3.5 text-[#00D9FF]" />
            SAMPLE CSV
          </button>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-1.5 rounded-lg bg-[#00D9FF] text-black font-bold hover:bg-[#00D9FF]/90 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,217,255,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" />
            ADD PRODUCT
          </button>
        </div>
      </div>

      {/* Filter Row: Search, Category, Status, Sort, Bulk Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center font-mono text-xs">
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, CAS, SKU, category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF] transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-slate-300 focus:outline-none focus:border-[#00D9FF] [&_option]:bg-slate-950 [&_option]:text-white"
          >
            <option value="all">Category: All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-slate-300 focus:outline-none focus:border-[#00D9FF] [&_option]:bg-slate-950 [&_option]:text-white"
          >
            <option value="all">Status: All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Draft">Draft</option>
            <option value="Hidden">Hidden</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Sort Select & Direction */}
        <div className="md:col-span-4 flex items-center gap-2">
          <div className="flex-1 flex items-center bg-slate-950/90 border border-white/10 rounded-xl px-2">
            <span className="text-slate-500 pl-1 text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-slate-950 text-slate-300 py-2 px-2 focus:outline-none w-full border-0 rounded-xl [&_option]:bg-slate-950 [&_option]:text-white"
            >
              <option value="lastUpdated">Last Updated</option>
              <option value="name">Product Name</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
            </select>
          </div>

          <button
            onClick={onToggleSortOrder}
            className="p-2 rounded-xl bg-slate-950/90 border border-white/10 text-slate-400 hover:text-white"
            title={`Sort Order: ${sortOrder.toUpperCase()}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (when products selected) */}
      {hasSelection && (
        <div className="p-3 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/40 flex flex-wrap items-center justify-between gap-3 font-mono text-xs animate-fade-in shadow-[0_0_20px_rgba(0,217,255,0.15)]">
          <div className="flex items-center gap-2 text-white font-bold">
            <CheckSquare className="w-4 h-4 text-[#00D9FF]" />
            <span>{selectedIds.length} Products Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBulkActivate}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              Activate
            </button>

            <button
              onClick={onBulkDeactivate}
              className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold hover:bg-amber-500/30 transition-colors flex items-center gap-1"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Deactivate
            </button>

            <button
              onClick={onBulkDuplicate}
              className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold hover:bg-purple-500/30 transition-colors flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </button>

            <button
              onClick={onBulkExport}
              className="px-3 py-1 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/40 text-[#00D9FF] font-bold hover:bg-[#00D9FF]/30 transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>

            <button
              onClick={onBulkDelete}
              className="px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold hover:bg-rose-500/30 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
