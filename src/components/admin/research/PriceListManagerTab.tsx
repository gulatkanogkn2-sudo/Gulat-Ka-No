import React, { useState } from 'react';
import { ActionMenu } from '../../common/ActionMenu';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Check,
  X,
  Zap,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { PriceListItemAdmin } from '../../../types/researchLibraryManager';

interface PriceListManagerTabProps {
  priceList: PriceListItemAdmin[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSavePriceListItem: (item: Partial<PriceListItemAdmin> & { product: string; variant: string }) => void;
  onDeletePriceListItem: (id: string) => void;
}

export const PriceListManagerTab: React.FC<PriceListManagerTabProps> = ({
  priceList,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSavePriceListItem,
  onDeletePriceListItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<PriceListItemAdmin> | null>(null);

  const filteredItems = priceList.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variant.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  const handleOpenCreate = () => {
    setEditingItem({
      product: '',
      variant: '10mg Vial (10-Pack Kit)',
      usdPrice: 200,
      phpPrice: 11600,
      category: 'GroupBuy',
      visibility: 'PUBLIC',
      featured: false,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (item: PriceListItemAdmin) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.product || !editingItem?.variant) return;

    onSavePriceListItem(editingItem as any);
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Auto conversion helper USD to PHP (approx 1 USD = 58 PHP)
  const handleUsdChange = (val: number) => {
    setEditingItem((prev) => ({
      ...prev,
      usdPrice: val,
      phpPrice: Math.round(val * 58),
    }));
  };

  return (
    <div className="space-y-4">
      {/* Notice Banner */}
      <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl flex items-start gap-3 text-emerald-200 text-xs">
        <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Public Research Price List Directory</p>
          <p className="text-emerald-300/80">
            Administrators can manage catalog rates displayed across the Research Hub. Prepared for automatic dynamic FX rate conversions & automated store pricing.
          </p>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product or variant..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Categories</option>
            <option value="GroupBuy">GroupBuy</option>
            <option value="OnHand">OnHand</option>
            <option value="MOQ Bulk">MOQ Bulk</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Price Record
        </button>
      </div>

      {/* Price Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[800px] text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={priceList.length > 0 && selectedIds.length === priceList.length}
                    onChange={onToggleSelectAll}
                    className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                </th>
                <th className="p-3.5">Product & Variant</th>
                <th className="p-3.5">Store Category</th>
                <th className="p-3.5">USD Price</th>
                <th className="p-3.5">PHP Price</th>
                <th className="p-3.5">Visibility</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(item.id)}
                        className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{item.product}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.variant}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono text-sm font-bold text-emerald-400">${item.usdPrice}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono text-xs text-slate-300">₱{item.phpPrice.toLocaleString()}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          item.visibility === 'PUBLIC'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.visibility}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {item.featured ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ) : (
                        <Star className="w-4 h-4 text-slate-700" />
                      )}
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'Edit Price',
                            icon: <Edit2 className="w-3.5 h-3.5 text-[#00D9FF]" />,
                            onClick: () => handleOpenEdit(item),
                          },
                          {
                            divider: true,
                            label: 'Delete Item',
                            icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
                            variant: 'danger',
                            onClick: () => onDeletePriceListItem(item.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                {editingItem.id ? 'Edit Price List Item' : 'Add Price List Item'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.product || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, product: e.target.value })}
                  placeholder="e.g. Semaglutide Reference Standard"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Variant / Spec *</label>
                <input
                  type="text"
                  required
                  value={editingItem.variant || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, variant: e.target.value })}
                  placeholder="e.g. 10mg Vial (10-Pack Kit)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">USD Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={editingItem.usdPrice ?? 0}
                    onChange={(e) => handleUsdChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">PHP Price (₱)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingItem.phpPrice ?? 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        phpPrice: e.target.value === '' ? 0 : isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={editingItem.category || 'GroupBuy'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="GroupBuy">GroupBuy</option>
                    <option value="OnHand">OnHand</option>
                    <option value="MOQ Bulk">MOQ Bulk</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Visibility</label>
                  <select
                    value={editingItem.visibility || 'PUBLIC'}
                    onChange={(e) => setEditingItem({ ...editingItem, visibility: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="HIDDEN">HIDDEN</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="itemFeatured"
                  checked={editingItem.featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="itemFeatured" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Highlight as Featured Item on Research Price Matrix
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Save Price Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
