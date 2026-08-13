import React, { useState } from 'react';
import { ActionMenu } from '../../common/ActionMenu';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  History,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Archive,
  ExternalLink,
  Sparkles,
  X,
  Check,
  Download,
} from 'lucide-react';
import { COARecordAdmin, LibraryItemStatus, LibraryItemVisibility } from '../../../types/researchLibraryManager';
import { MediaInput } from '../website/MediaAssetPickerModal';

interface CoaManagerTabProps {
  coas: COARecordAdmin[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSaveCOA: (coa: Partial<COARecordAdmin> & { product: string; lotNumber: string }) => void;
  onDeleteCOA: (id: string) => void;
  onAddVersion: (coaId: string, versionNote: string, pdfUrl?: string) => void;
}

export const CoaManagerTab: React.FC<CoaManagerTabProps> = ({
  coas,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSaveCOA,
  onDeleteCOA,
  onAddVersion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [labFilter, setLabFilter] = useState<string>('ALL');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCoa, setEditingCoa] = useState<Partial<COARecordAdmin> | null>(null);

  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionCoa, setVersionCoa] = useState<COARecordAdmin | null>(null);
  const [newVersionNote, setNewVersionNote] = useState('');
  const [newVersionPdf, setNewVersionPdf] = useState('');

  // Extract unique labs for filter dropdown
  const uniqueLabs = Array.from(new Set(coas.map((c) => c.laboratory)));

  const filteredCoas = coas.filter((c) => {
    const matchesSearch =
      c.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.laboratory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesLab = labFilter === 'ALL' || c.laboratory === labFilter;

    return matchesSearch && matchesStatus && matchesLab;
  });

  const handleOpenCreate = () => {
    setEditingCoa({
      product: '',
      variant: '10mg Lyophilized Vial',
      laboratory: 'Janoshik Analytical',
      lotNumber: `GKN-${Date.now().toString().slice(-6)}`,
      purity: 99.8,
      testDate: new Date().toISOString().slice(0, 10),
      expirationDate: '2028-12-31',
      pdfUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      chromatogramImageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      status: 'VERIFIED',
      visibility: 'PUBLIC',
      tags: ['Metabolic', 'HPLC'],
      searchKeywords: ['HPLC', 'Analytical'],
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (coa: COARecordAdmin) => {
    setEditingCoa({ ...coa });
    setIsEditModalOpen(true);
  };

  const handleOpenVersionModal = (coa: COARecordAdmin) => {
    setVersionCoa(coa);
    setNewVersionPdf(coa.pdfUrl);
    setNewVersionNote('');
    setIsVersionModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoa?.product || !editingCoa?.lotNumber) return;

    onSaveCOA(editingCoa as any);
    setIsEditModalOpen(false);
    setEditingCoa(null);
  };

  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionCoa || !newVersionNote.trim()) return;

    onAddVersion(versionCoa.id, newVersionNote, newVersionPdf);
    setIsVersionModalOpen(false);
    setVersionCoa(null);
    setNewVersionNote('');
  };

  const getStatusBadge = (status: LibraryItemStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> VERIFIED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
            <Clock className="w-3 h-3 text-amber-400" /> PENDING
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            <Archive className="w-3 h-3 text-slate-400" /> ARCHIVED
          </span>
        );
    }
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
              placeholder="Search product, lot #, or lab..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <select
              value={labFilter}
              onChange={(e) => setLabFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Laboratories</option>
              {uniqueLabs.map((lab) => (
                <option key={lab} value={lab}>
                  {lab}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add COA Record
        </button>
      </div>

      {/* COA Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[800px] text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={coas.length > 0 && selectedIds.length === coas.length}
                    onChange={onToggleSelectAll}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                </th>
                <th className="p-3.5">Product & Lot</th>
                <th className="p-3.5">Testing Lab</th>
                <th className="p-3.5">Purity</th>
                <th className="p-3.5">Dates</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Visibility</th>
                <th className="p-3.5 text-center">Media Assets</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCoas.map((coa) => {
                const isSelected = selectedIds.includes(coa.id);
                return (
                  <tr
                    key={coa.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(coa.id)}
                        className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{coa.product}</div>
                      <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{coa.lotNumber}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{coa.variant}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-200">{coa.laboratory}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono text-sm font-bold text-emerald-400">{coa.purity}%</div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      <div>Tested: {coa.testDate}</div>
                      <div>Exp: {coa.expirationDate}</div>
                    </td>
                    <td className="p-3.5">{getStatusBadge(coa.status)}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          coa.visibility === 'PUBLIC'
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {coa.visibility}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {coa.pdfUrl && (
                          <a
                            href={coa.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="View COA Image"
                          >
                            <FileCheck className="w-4 h-4" />
                          </a>
                        )}
                        {coa.chromatogramImageUrl && (
                          <a
                            href={coa.chromatogramImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-400 hover:text-purple-300 transition-colors"
                            title="View Chromatogram Image"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'Edit COA Record',
                            icon: <Edit2 className="w-3.5 h-3.5 text-[#00D9FF]" />,
                            onClick: () => handleOpenEdit(coa),
                          },
                          {
                            label: `Version History (v1.${coa.versionHistory?.length || 0})`,
                            icon: <History className="w-3.5 h-3.5 text-cyan-400" />,
                            onClick: () => handleOpenVersionModal(coa),
                          },
                          {
                            divider: true,
                            label: 'Delete COA',
                            icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
                            variant: 'danger',
                            onClick: () => onDeleteCOA(coa.id),
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
      {isEditModalOpen && editingCoa && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                {editingCoa.id ? 'Edit COA Record' : 'Create New COA Record'}
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
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCoa.product || ''}
                    onChange={(e) => setEditingCoa({ ...editingCoa, product: e.target.value })}
                    placeholder="e.g. Tirzepatide Reference Standard"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Variant / Spec</label>
                  <input
                    type="text"
                    value={editingCoa.variant || ''}
                    onChange={(e) => setEditingCoa({ ...editingCoa, variant: e.target.value })}
                    placeholder="e.g. 10mg Lyophilized Vial"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Lot Number *</label>
                  <input
                    type="text"
                    required
                    value={editingCoa.lotNumber || ''}
                    onChange={(e) => setEditingCoa({ ...editingCoa, lotNumber: e.target.value })}
                    placeholder="e.g. GKN-TIRZ-2026-A1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Testing Laboratory</label>
                  <input
                    type="text"
                    value={editingCoa.laboratory || ''}
                    onChange={(e) => setEditingCoa({ ...editingCoa, laboratory: e.target.value })}
                    placeholder="e.g. Janoshik Analytical"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Purity Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={editingCoa.purity ?? 99.5}
                    onChange={(e) =>
                      setEditingCoa({
                        ...editingCoa,
                        purity: e.target.value === '' ? 0 : isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Test Date</label>
                  <input
                    type="date"
                    value={editingCoa.testDate || ''}
                    onChange={(e) => setEditingCoa({ ...editingCoa, testDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={editingCoa.expirationDate || ''}
                    onChange={(e) => setEditingCoa({ ...editingCoa, expirationDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Status</label>
                  <select
                    value={editingCoa.status || 'VERIFIED'}
                    onChange={(e) => setEditingCoa({ ...editingCoa, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              {/* Media Assets via Centralized Media Picker */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <MediaInput
                  label="COA Image Asset (JPG, PNG, WEBP)"
                  value={editingCoa.pdfUrl || ''}
                  onChange={(url) => setEditingCoa({ ...editingCoa, pdfUrl: url })}
                  description="Reference official COA image asset from the Media Library."
                />

                <MediaInput
                  label="Chromatogram Image Asset"
                  value={editingCoa.chromatogramImageUrl || ''}
                  onChange={(url) => setEditingCoa({ ...editingCoa, chromatogramImageUrl: url })}
                  description="Reference HPLC signal spectrum image asset from the Media Library."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={editingCoa.tags?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingCoa({
                      ...editingCoa,
                      tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Metabolic, Janoshik, HPLC"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
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
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {isVersionModalOpen && versionCoa && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" /> Version History: {versionCoa.product}
                </h3>
                <p className="text-xs font-mono text-cyan-400">{versionCoa.lotNumber}</p>
              </div>
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Existing Version Logs */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 font-mono uppercase">Version Logs</h4>
                {(!versionCoa.versionHistory || versionCoa.versionHistory.length === 0) ? (
                  <p className="text-xs text-slate-500 italic">No historical revisions logged for this record yet.</p>
                ) : (
                  <div className="space-y-2">
                    {versionCoa.versionHistory.map((ver) => (
                      <div key={ver.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-cyan-300">{ver.version}</span>
                          <span className="text-slate-500">{ver.date}</span>
                        </div>
                        <p className="text-xs text-slate-300">{ver.changeNote}</p>
                        <div className="text-[10px] text-slate-500 font-mono">Logged by: {ver.updatedBy}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Version Note */}
              <form onSubmit={handleSaveVersion} className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Log New COA Version Revision
                </h4>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Revision Note / Reason *</label>
                  <textarea
                    required
                    rows={2}
                    value={newVersionNote}
                    onChange={(e) => setNewVersionNote(e.target.value)}
                    placeholder="e.g. Re-tested peak purity after 12 months storage stability check..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <MediaInput
                  label="Updated PDF Reference (Optional)"
                  value={newVersionPdf}
                  onChange={(url) => setNewVersionPdf(url)}
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsVersionModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Add Version Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
