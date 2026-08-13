import React from 'react';
import { AdminProduct, AdminStoreType } from '../../../types/adminProduct';
import { Badge } from '../../common/Badge';
import { ActionMenu, ActionMenuItem } from '../../common/ActionMenu';
import {
  Edit3,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Box,
  Factory,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface ProductTableProps {
  products: AdminProduct[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onEdit: (product: AdminProduct) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, current: boolean) => void;
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleVisibility,
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  isLoading = false,
}) => {
  const isAllSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  const renderStoreBadge = (storeType: AdminStoreType) => {
    switch (storeType) {
      case 'groupbuy':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#8B5CF6] font-mono text-[10px] font-bold flex items-center gap-1 w-fit">
            <Layers className="w-3 h-3" />
            GroupBuy
          </span>
        );
      case 'onhand':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#00D9FF]/15 border border-[#00D9FF]/40 text-[#00D9FF] font-mono text-[10px] font-bold flex items-center gap-1 w-fit">
            <Box className="w-3 h-3" />
            OnHand
          </span>
        );
      case 'moq':
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#FF2ED1]/15 border border-[#FF2ED1]/40 text-[#FF2ED1] font-mono text-[10px] font-bold flex items-center gap-1 w-fit">
            <Factory className="w-3 h-3" />
            MOQ Mfg
          </span>
        );
      default:
        return <Badge variant="slate">{storeType}</Badge>;
    }
  };

  const renderStatusBadge = (status: AdminProduct['status']) => {
    switch (status) {
      case 'Active':
        return <Badge variant="emerald" glow>Active</Badge>;
      case 'Inactive':
        return <Badge variant="amber">Inactive</Badge>;
      case 'Draft':
        return <Badge variant="purple">Draft</Badge>;
      case 'Hidden':
        return <Badge variant="slate">Hidden</Badge>;
      case 'Archived':
        return <Badge variant="rose">Archived</Badge>;
      default:
        return <Badge variant="cyan">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Table Container */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/80 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[850px] text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded bg-slate-900 border-white/20 text-[#00D9FF] focus:ring-[#00D9FF]"
                  />
                </th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Store</th>
                <th className="p-4">Category</th>
                <th className="p-4">Variants</th>
                <th className="p-4 text-right">Price ($ USD)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Visibility</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 font-mono">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin" />
                      Loading catalog database...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-400 font-mono space-y-2">
                    <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-white font-bold">No products found matching filters.</p>
                    <p className="text-xs text-slate-500">
                      Try clearing filters or search parameters.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const minPrice =
                    p.variants && p.variants.length > 0
                      ? Math.min(...p.variants.map((v) => v.price))
                      : p.price;
                  const maxPrice =
                    p.variants && p.variants.length > 0
                      ? Math.max(...p.variants.map((v) => v.price))
                      : p.price;

                  const priceDisplay =
                    minPrice !== maxPrice
                      ? `$${minPrice.toFixed(0)} - $${maxPrice.toFixed(0)}`
                      : `$${(p.price || minPrice || 0).toFixed(2)}`;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-[#00D9FF]/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectRow(p.id, e.target.checked)}
                          className="rounded bg-slate-900 border-white/20 text-[#00D9FF] focus:ring-[#00D9FF]"
                        />
                      </td>

                      {/* Product Name & Details */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0 relative flex items-center justify-center text-slate-600">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-slate-600" />
                            )}
                            {p.isFeatured && (
                              <div className="absolute top-0 right-0 p-0.5 bg-[#FF2ED1] text-black rounded-bl">
                                <Sparkles className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                onClick={() => onEdit(p)}
                                className="font-bold text-white hover:text-[#00D9FF] transition-colors cursor-pointer truncate max-w-[240px]"
                              >
                                {p.name}
                              </span>
                            </div>
                            {p.shortDescription && (
                              <span className="text-[10px] text-slate-400 truncate max-w-[240px]">
                                {p.shortDescription}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Store */}
                      <td className="p-4">{renderStoreBadge(p.storeType)}</td>

                      {/* Category */}
                      <td className="p-4 text-slate-300 font-semibold">{p.category}</td>

                      {/* Variant Count */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-bold">
                          {p.variants ? p.variants.length : 1}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 text-right font-bold text-emerald-400">{priceDisplay}</td>

                      {/* Status */}
                      <td className="p-4">{renderStatusBadge(p.status)}</td>

                      {/* Visibility Toggle */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => onToggleVisibility(p.id, p.isVisible)}
                          className={`p-1.5 rounded-lg border text-[10px] font-bold transition-colors ${
                            p.isVisible
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                          }`}
                          title={p.isVisible ? 'Visible in store' : 'Hidden from store'}
                        >
                          {p.isVisible ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>

                      {/* Last Updated */}
                      <td className="p-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {p.lastUpdated}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          items={[
                            {
                              label: 'Edit Product',
                              icon: <Edit3 className="w-3.5 h-3.5 text-[#00D9FF]" />,
                              onClick: () => onEdit(p),
                            },
                            {
                              label: 'Duplicate Product',
                              icon: <Copy className="w-3.5 h-3.5 text-purple-400" />,
                              onClick: () => onDuplicate(p.id),
                            },
                            {
                              label: p.isVisible ? 'Hide from Store' : 'Show in Store',
                              icon: p.isVisible ? (
                                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                              ),
                              onClick: () => onToggleVisibility(p.id, p.isVisible),
                            },
                            {
                              divider: true,
                              label: 'Delete Product',
                              icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
                              variant: 'danger',
                              onClick: () => onDelete(p.id),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="text-slate-400">
            Showing <strong className="text-white">{totalCount > 0 ? (page - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-white">{Math.min(page * pageSize, totalCount)}</strong> of{' '}
            <strong className="text-[#00D9FF]">{totalCount}</strong> Products
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-400 hover:text-white disabled:opacity-40 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>

            <span className="px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] font-bold">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-400 hover:text-white disabled:opacity-40 flex items-center gap-1 transition-colors"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
