import React, { useState } from 'react';
import {
  FolderOutput,
  Archive,
  Trash2,
  Download,
  FileSpreadsheet,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { MediaCategory } from '../../../types/mediaLibrary';

interface MediaBulkBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkMoveCategory: (category: MediaCategory) => void;
  onBulkArchive: (archiveState: boolean) => void;
  onBulkDelete: () => void;
  onBulkExportMetadata: () => void;
}

const CATEGORIES_LIST: MediaCategory[] = [
  'Website',
  'Products',
  'Research',
  'COA',
  'Protocols',
  'Calculator Assets',
  'Homepage',
  'Hero Images',
  'Store Cards',
  'Logos',
  'Icons',
  'QR Codes',
  'Payment Assets',
  'Documents',
  'Other',
];

export const MediaBulkBar: React.FC<MediaBulkBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkMoveCategory,
  onBulkArchive,
  onBulkDelete,
  onBulkExportMetadata,
}) => {
  const [showMoveDropdown, setShowMoveDropdown] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-xs flex items-center justify-center font-mono">
          {selectedCount}
        </span>
        <span className="text-xs font-mono font-bold text-cyan-200">
          Assets Selected
        </span>
        <button
          onClick={onClearSelection}
          className="p-1 text-slate-400 hover:text-white rounded"
          title="Clear Selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-800 hidden sm:block" />

      <div className="flex flex-wrap items-center gap-2">
        {/* Bulk Category Move */}
        <div className="relative">
          <button
            onClick={() => setShowMoveDropdown(!showMoveDropdown)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FolderOutput className="w-3.5 h-3.5 text-cyan-400" /> Move Category
          </button>

          {showMoveDropdown && (
            <div className="absolute bottom-full mb-2 left-0 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-1 max-h-56 overflow-y-auto z-50">
              <div className="text-[10px] font-mono font-bold text-slate-400 px-2 py-1 uppercase">
                Select Destination
              </div>
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onBulkMoveCategory(cat);
                    setShowMoveDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-cyan-950 hover:text-cyan-300 rounded-lg transition-colors font-mono"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Archive */}
        <button
          onClick={() => onBulkArchive(true)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <Archive className="w-3.5 h-3.5 text-amber-400" /> Archive
        </button>

        {/* Bulk Export */}
        <button
          onClick={onBulkExportMetadata}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
        </button>

        {/* Bulk Delete */}
        <button
          onClick={onBulkDelete}
          className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Selected
        </button>
      </div>
    </div>
  );
};
