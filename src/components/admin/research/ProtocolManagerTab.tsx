import React, { useState } from 'react';
import { ActionMenu } from '../../common/ActionMenu';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Eye,
  EyeOff,
  Check,
  X,
  FileText,
  ShieldAlert,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { ProtocolRecordAdmin, ProtocolCategory, LibraryItemVisibility } from '../../../types/researchLibraryManager';
import { MediaInput } from '../website/MediaAssetPickerModal';

interface ProtocolManagerTabProps {
  protocols: ProtocolRecordAdmin[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSaveProtocol: (protocol: Partial<ProtocolRecordAdmin> & { title: string }) => void;
  onDeleteProtocol: (id: string) => void;
  onReorderProtocols: (orderedIds: string[]) => void;
}

export const ProtocolManagerTab: React.FC<ProtocolManagerTabProps> = ({
  protocols,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSaveProtocol,
  onDeleteProtocol,
  onReorderProtocols,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<Partial<ProtocolRecordAdmin> | null>(null);

  const filteredProtocols = protocols.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.procedure.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingProtocol({
      title: '',
      category: 'Reconstitution',
      description: '',
      procedure: '',
      storageInstructions: 'Keep lyophilized at -20°C. Store reconstituted solution at 2-8°C.',
      safetyNotes: 'FOR LABORATORY RESEARCH ONLY. Wear PPE at all times.',
      visibility: 'PUBLIC',
      featured: true,
      sortOrder: protocols.length + 1,
      pdfUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (protocol: ProtocolRecordAdmin) => {
    setEditingProtocol({ ...protocol });
    setIsEditModalOpen(true);
  };

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= protocols.length) return;

    const newOrder = [...protocols];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;

    onReorderProtocols(newOrder.map((p) => p.id));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProtocol?.title) return;

    onSaveProtocol(editingProtocol as any);
    setIsEditModalOpen(false);
    setEditingProtocol(null);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search protocol title or procedure..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Reconstitution">Reconstitution</option>
            <option value="Storage & Handling">Storage & Handling</option>
            <option value="Assay Standards">Assay Standards</option>
            <option value="Stability & Half-Life">Stability & Half-Life</option>
            <option value="Safety Guidelines">Safety Guidelines</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Protocol
        </button>
      </div>

      {/* Protocol Items List */}
      <div className="space-y-3">
        {filteredProtocols.map((protocol, index) => {
          const isSelected = selectedIds.includes(protocol.id);
          return (
            <div
              key={protocol.id}
              className={`p-4 bg-slate-900 border rounded-2xl transition-all ${
                isSelected ? 'border-purple-500 bg-purple-950/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(protocol.id)}
                      className="rounded bg-slate-950 border-slate-700 text-purple-500 focus:ring-0"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'UP')}
                        className="p-1 rounded hover:bg-slate-800 disabled:opacity-20 text-slate-400"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === protocols.length - 1}
                        onClick={() => handleMove(index, 'DOWN')}
                        className="p-1 rounded hover:bg-slate-800 disabled:opacity-20 text-slate-400"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                        #{protocol.sortOrder}
                      </span>
                      <h4 className="text-sm font-bold text-white">{protocol.title}</h4>
                      {protocol.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Featured
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          protocol.visibility === 'PUBLIC'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {protocol.visibility}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 max-w-3xl">{protocol.description}</p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                      <span>Category: <strong className="text-slate-200">{protocol.category}</strong></span>
                      <span>Updated: {protocol.updatedAt.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center">
                  {protocol.pdfUrl && (
                    <a
                      href={protocol.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-400 rounded-xl text-xs font-mono flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Protocol Image
                    </a>
                  )}

                  <div onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      items={[
                        {
                          label: 'Edit Protocol',
                          icon: <Edit2 className="w-3.5 h-3.5 text-[#00D9FF]" />,
                          onClick: () => handleOpenEdit(protocol),
                        },
                        {
                          divider: true,
                          label: 'Delete Protocol',
                          icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
                          variant: 'danger',
                          onClick: () => onDeleteProtocol(protocol.id),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {isEditModalOpen && editingProtocol && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                {editingProtocol.id ? 'Edit Protocol' : 'Create New Protocol'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Protocol Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProtocol.title || ''}
                    onChange={(e) => setEditingProtocol({ ...editingProtocol, title: e.target.value })}
                    placeholder="e.g. Sterile Reconstitution & Diluent Solubilization"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={editingProtocol.category || 'Reconstitution'}
                    onChange={(e) => setEditingProtocol({ ...editingProtocol, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Reconstitution">Reconstitution</option>
                    <option value="Storage & Handling">Storage & Handling</option>
                    <option value="Assay Standards">Assay Standards</option>
                    <option value="Stability & Half-Life">Stability & Half-Life</option>
                    <option value="Safety Guidelines">Safety Guidelines</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Visibility</label>
                  <select
                    value={editingProtocol.visibility || 'PUBLIC'}
                    onChange={(e) => setEditingProtocol({ ...editingProtocol, visibility: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="HIDDEN">HIDDEN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProtocol.description || ''}
                  onChange={(e) => setEditingProtocol({ ...editingProtocol, description: e.target.value })}
                  placeholder="High level overview of what this protocol covers..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Step-by-Step Procedure *</label>
                <textarea
                  rows={5}
                  required
                  value={editingProtocol.procedure || ''}
                  onChange={(e) => setEditingProtocol({ ...editingProtocol, procedure: e.target.value })}
                  placeholder="1. Prepare aseptic surface..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Storage Instructions</label>
                  <textarea
                    rows={2}
                    value={editingProtocol.storageInstructions || ''}
                    onChange={(e) => setEditingProtocol({ ...editingProtocol, storageInstructions: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Safety Notes</label>
                  <textarea
                    rows={2}
                    value={editingProtocol.safetyNotes || ''}
                    onChange={(e) => setEditingProtocol({ ...editingProtocol, safetyNotes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <MediaInput
                  label="Protocol Image Asset (JPG, PNG, WEBP)"
                  value={editingProtocol.pdfUrl || ''}
                  onChange={(url) => setEditingProtocol({ ...editingProtocol, pdfUrl: url })}
                  description="Reference visual SOP protocol image asset from the Media Library."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="protocolFeatured"
                  checked={editingProtocol.featured || false}
                  onChange={(e) => setEditingProtocol({ ...editingProtocol, featured: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-purple-500 focus:ring-0"
                />
                <label htmlFor="protocolFeatured" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Feature this protocol on the Research Hub Homepage
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
                  className="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Save Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
