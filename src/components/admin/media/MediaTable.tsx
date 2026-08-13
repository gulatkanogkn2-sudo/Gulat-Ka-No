import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  Eye,
  Copy,
  Download,
  Trash2,
  Check,
  Tag,
  Link,
  ShieldAlert,
  Archive,
  Lock,
  Globe,
  Database,
} from 'lucide-react';
import { ActionMenu } from '../../common/ActionMenu';
import { MediaAssetItem } from '../../../types/mediaLibrary';

interface MediaTableProps {
  assets: MediaAssetItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onInspectAsset: (asset: MediaAssetItem) => void;
  onCopyReference: (asset: MediaAssetItem) => void;
  onDownloadAsset: (asset: MediaAssetItem) => void;
  onDeleteAsset: (id: string) => void;
}

export const MediaTable: React.FC<MediaTableProps> = ({
  assets,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onInspectAsset,
  onCopyReference,
  onDownloadAsset,
  onDeleteAsset,
}) => {
  const isAllSelected = assets.length > 0 && selectedIds.length === assets.length;

  const renderThumbnail = (asset: MediaAssetItem) => {
    const isImage = ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG'].includes(asset.fileType);

    if (isImage) {
      return (
        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group-hover:border-cyan-500/50 transition-colors flex-shrink-0">
          <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 text-cyan-400">
        <FileText className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[800px] text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="p-3.5">Asset</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Type & Specs</th>
              <th className="p-3.5">Size</th>
              <th className="p-3.5">Uploaded</th>
              <th className="p-3.5">Visibility</th>
              <th className="p-3.5">Usage</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500 font-mono">
                  No media assets matched the selected filters.
                </td>
              </tr>
            ) : (
              assets.map((asset) => {
                const isSelected = selectedIds.includes(asset.id);
                return (
                  <tr
                    key={asset.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    } ${asset.isArchived ? 'opacity-60' : ''}`}
                  >
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(asset.id)}
                        className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">
                      <div
                        onClick={() => onInspectAsset(asset)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        {renderThumbnail(asset)}
                        <div className="min-w-0">
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors text-xs truncate max-w-xs">
                            {asset.title}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                            {asset.name}
                          </div>
                          {asset.isArchived && (
                            <span className="text-[9px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/60 inline-block mt-0.5">
                              Archived
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 uppercase whitespace-nowrap">
                        {asset.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono text-xs font-bold text-slate-200">
                        {asset.fileType}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {asset.dimensions}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-xs text-slate-300 whitespace-nowrap">
                      {asset.fileSize}
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono text-xs text-slate-300 whitespace-nowrap">
                        {asset.uploadDate}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {asset.uploadedBy}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          asset.visibility === 'PUBLIC'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : asset.visibility === 'RESTRICTED'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-purple-950 text-purple-300 border-purple-800'
                        }`}
                      >
                        {asset.visibility}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => onInspectAsset(asset)}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
                          asset.usageCount > 0
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-800/80 hover:bg-cyan-900'
                            : 'bg-slate-950 text-slate-500 border-slate-800'
                        }`}
                        title={
                          asset.usageCount > 0
                            ? `Used in: ${asset.usageReferences.map((r) => r.locationName).join(', ')}`
                            : 'Unused Asset'
                        }
                      >
                        {asset.usageCount} Ref{asset.usageCount !== 1 ? 's' : ''}
                      </button>
                    </td>
                    <td className="p-3.5 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5 ml-auto">
                        <button
                          type="button"
                          onClick={() => onCopyReference(asset)}
                          className="px-2.5 py-1.5 rounded-lg border bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border-cyan-800 text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="Copy Asset Reference"
                        >
                          <Copy className="w-3 h-3" />
                          <span>USE</span>
                        </button>

                        <ActionMenu
                          items={[
                            {
                              label: 'Inspect Details',
                              icon: <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />,
                              onClick: () => onInspectAsset(asset),
                            },
                            {
                              label: 'Copy Reference',
                              icon: <Copy className="w-3.5 h-3.5 text-cyan-400" />,
                              onClick: () => onCopyReference(asset),
                            },
                            {
                              label: 'Download Asset',
                              icon: <Download className="w-3.5 h-3.5 text-emerald-400" />,
                              onClick: () => onDownloadAsset(asset),
                            },
                            {
                              divider: true,
                              label: 'Delete Asset',
                              icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
                              variant: 'danger',
                              onClick: () => onDeleteAsset(asset.id),
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
