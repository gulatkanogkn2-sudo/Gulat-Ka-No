import React from 'react';
import {
  FileText,
  Eye,
  Copy,
  Download,
  Trash2,
  Tag,
  Check,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { MediaAssetItem, MediaViewMode } from '../../../types/mediaLibrary';

interface MediaGridProps {
  assets: MediaAssetItem[];
  selectedIds: string[];
  viewMode: 'grid' | 'largeGrid';
  onToggleSelect: (id: string) => void;
  onInspectAsset: (asset: MediaAssetItem) => void;
  onCopyReference: (asset: MediaAssetItem) => void;
  onDownloadAsset: (asset: MediaAssetItem) => void;
  onDeleteAsset: (id: string) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  assets,
  selectedIds,
  viewMode,
  onToggleSelect,
  onInspectAsset,
  onCopyReference,
  onDownloadAsset,
  onDeleteAsset,
}) => {
  const isLarge = viewMode === 'largeGrid';

  if (assets.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 font-mono text-xs">
        No media assets matched the selected filters.
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 ${
        isLarge
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
      }`}
    >
      {assets.map((asset) => {
        const isSelected = selectedIds.includes(asset.id);
        const isImage = ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG'].includes(asset.fileType);

        return (
          <div
            key={asset.id}
            className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-200 relative ${
              isSelected
                ? 'border-cyan-400 ring-2 ring-cyan-500/30 shadow-xl'
                : 'border-slate-800 hover:border-slate-700 hover:shadow-2xl'
            } ${asset.isArchived ? 'opacity-60' : ''}`}
          >
            {/* Top Selection Overlay Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(asset.id)}
                className="rounded bg-slate-950/90 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer w-4 h-4"
              />
            </div>

            {/* Top Badges */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
              {asset.usageCount > 0 && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-800 backdrop-blur-xs">
                  {asset.usageCount} Ref{asset.usageCount !== 1 ? 's' : ''}
                </span>
              )}
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/90 text-slate-300 border border-slate-800 backdrop-blur-xs uppercase">
                {asset.fileType}
              </span>
            </div>

            {/* Media Preview Box */}
            <div
              onClick={() => onInspectAsset(asset)}
              className={`bg-slate-950 relative overflow-hidden cursor-pointer ${
                isLarge ? 'aspect-video' : 'aspect-square'
              }`}
            >
              {isImage ? (
                <img
                  src={asset.url}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-cyan-400 space-y-2">
                  <FileText className="w-10 h-10 stroke-[1.5]" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {asset.fileType} Document
                  </span>
                </div>
              )}

              {/* Hover Quick Action Buttons */}
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspectAsset(asset);
                  }}
                  className="p-2 rounded-xl bg-slate-900 text-white hover:bg-cyan-500 hover:text-slate-950 transition-colors shadow-lg"
                  title="Inspect Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyReference(asset);
                  }}
                  className="p-2 rounded-xl bg-slate-900 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 transition-colors shadow-lg"
                  title="Copy Reference"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadAsset(asset);
                  }}
                  className="p-2 rounded-xl bg-slate-900 text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 transition-colors shadow-lg"
                  title="Download Asset"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Specs Tag inside Preview */}
              <div className="absolute bottom-1 right-1 text-[9px] font-mono px-1.5 py-0.5 bg-slate-950/80 text-slate-400 rounded backdrop-blur-xs">
                {asset.dimensions}
              </div>
            </div>

            {/* Asset Information Footer */}
            <div className="p-3 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h4
                  onClick={() => onInspectAsset(asset)}
                  className="text-xs font-bold text-white hover:text-cyan-300 transition-colors line-clamp-1 cursor-pointer"
                >
                  {asset.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="uppercase text-cyan-400 font-semibold">{asset.category}</span>
                <span>{asset.fileSize}</span>
              </div>

              {/* Tag Badges if Large View */}
              {isLarge && asset.tags && asset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {asset.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
