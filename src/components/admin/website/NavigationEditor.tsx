import React, { useState } from 'react';
import { Menu, Eye, EyeOff, ArrowUp, ArrowDown, Plus, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { NavMenuItem } from '../../../types/websiteManager';

interface NavigationEditorProps {
  menuItems: NavMenuItem[];
  onChange: (updatedItems: NavMenuItem[]) => void;
}

export const NavigationEditor: React.FC<NavigationEditorProps> = ({ menuItems, onChange }) => {
  const [newLabel, setNewLabel] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newIsExternal, setNewIsExternal] = useState(false);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const next = [...menuItems];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    // update sortOrder
    const reordered = next.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    onChange(reordered);
  };

  const handleItemUpdate = (index: number, updated: Partial<NavMenuItem>) => {
    const next = [...menuItems];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const handleDelete = (index: number) => {
    const next = menuItems.filter((_, i) => i !== index);
    const reordered = next.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    onChange(reordered);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newPath.trim()) return;

    const newItem: NavMenuItem = {
      id: `nav-${Date.now()}`,
      label: newLabel.trim(),
      path: newPath.trim(),
      sortOrder: menuItems.length + 1,
      isVisible: true,
      isExternal: newIsExternal,
      openInNewTab: newIsExternal,
      badgeText: newBadge.trim() || undefined,
    };

    onChange([...menuItems, newItem]);
    setNewLabel('');
    setNewPath('');
    setNewBadge('');
    setNewIsExternal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Header Navigation Menu
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Menu className="w-5 h-5 text-cyan-400" /> Header Menu Items & Links
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure storefront top header menu labels, URL paths, badges, external links, and display sequence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items Ordering & Editor List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-cyan-400" /> Current Navigation Menu Items ({menuItems.length})
          </h3>

          <div className="space-y-2.5">
            {menuItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Reorder Buttons & Sort Badge */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-30 bg-slate-950 rounded border border-slate-800"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      disabled={idx === menuItems.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-30 bg-slate-950 rounded border border-slate-800"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] font-bold text-slate-400 flex items-center justify-center">
                    #{idx + 1}
                  </span>
                </div>

                {/* Inline Editing Controls */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                      Label
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleItemUpdate(idx, { label: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                      Path / URL
                    </label>
                    <input
                      type="text"
                      value={item.path}
                      onChange={(e) => handleItemUpdate(idx, { path: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                      Badge Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.badgeText || ''}
                      onChange={(e) => handleItemUpdate(idx, { badgeText: e.target.value || undefined })}
                      placeholder="e.g. Batch / Hot"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-purple-300"
                    />
                  </div>
                </div>

                {/* Visibility & Action buttons */}
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => handleItemUpdate(idx, { isVisible: !item.isVisible })}
                    className={`p-1.5 rounded-lg border text-xs font-semibold ${
                      item.isVisible
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                    title="Toggle Visibility"
                  >
                    {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Menu Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Navigation Item Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" /> Add Custom Menu Link
          </h3>

          <form onSubmit={handleAddItem} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Menu Label</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Protocol Guides"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Path or Full URL</label>
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                placeholder="e.g. /research or https://..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Badge Text (Optional)</label>
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="e.g. NEW or 99%"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-purple-300"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={newIsExternal}
                onChange={(e) => setNewIsExternal(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
              />
              External Link (Open in New Tab)
            </label>

            <button
              type="submit"
              disabled={!newLabel.trim() || !newPath.trim()}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Menu Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
