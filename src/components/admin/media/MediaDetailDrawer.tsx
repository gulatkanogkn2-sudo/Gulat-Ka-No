import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Copy,
  Download,
  Trash2,
  Check,
  Tag,
  ShieldAlert,
  Globe,
  Database,
  Layers,
  Edit2,
  Archive,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { MediaAssetItem, MediaCategory, MediaVisibility } from '../../../types/mediaLibrary';

interface MediaDetailDrawerProps {
  asset: MediaAssetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveUpdates: (id: string, updates: Partial<MediaAssetItem>) => void;
  onDuplicate: (id: string) => void;
  onToggleArchive: (id: string, isArchived: boolean) => void;
  onDownload: (asset: MediaAssetItem) => void;
  onDelete: (id: string) => void;
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

export const MediaDetailDrawer: React.FC<MediaDetailDrawerProps> = ({
  asset,
  isOpen,
  onClose,
  onSaveUpdates,
  onDuplicate,
  onToggleArchive,
  onDownload,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<MediaAssetItem>>({});
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title,
        name: asset.name,
        category: asset.category,
        visibility: asset.visibility,
        description: asset.description,
        altText: asset.altText,
        seoTitle: asset.seoTitle,
        seoDescription: asset.seoDescription,
        url: asset.url,
      });
      setTagsInput(asset.tags?.join(', ') || '');
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

  const isImage = ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG'].includes(asset.fileType);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(asset.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(asset.storagePath);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSaveUpdates(asset.id, {
      ...formData,
      tags: parsedTags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-800">
              {isImage ? <FileText className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">{asset.title}</h3>
              <p className="text-xs font-mono text-slate-400">{asset.id} • {asset.fileType}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Asset Usage Banner / Warning */}
          {asset.usageCount > 0 ? (
            <div className="p-4 bg-cyan-950/40 border border-cyan-800/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Asset Referenced in {asset.usageCount} Location{asset.usageCount !== 1 ? 's' : ''}
                </span>
                <span className="font-mono text-[10px] bg-cyan-900/80 px-2 py-0.5 rounded border border-cyan-700">
                  PROTECTED
                </span>
              </div>
              <p className="text-xs text-slate-300">
                This media asset is actively integrated across GKN modules. Deletion is blocked to safeguard site references.
              </p>
              <div className="space-y-1 pt-1">
                {asset.usageReferences?.map((ref) => (
                  <div
                    key={ref.id || ref.locationName}
                    className="p-2 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs font-mono text-slate-300"
                  >
                    <span className="text-cyan-400 font-bold">{ref.moduleName}</span>
                    <span className="text-slate-400">{ref.locationName}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Unused Asset — Ready for safe archiving or deletion if necessary.</span>
            </div>
          )}

          {/* Preview Canvas */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden group">
            {isImage ? (
              <img
                src={asset.url}
                alt={asset.title}
                className="max-h-64 object-contain rounded-xl"
              />
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-cyan-400 space-y-2">
                <FileText className="w-16 h-16 stroke-[1.5]" />
                <span className="text-xs font-mono text-slate-300 font-bold">
                  {asset.fileType} Document File
                </span>
              </div>
            )}

            <a
              href={asset.url}
              target="_blank"
              rel="noreferrer"
              className="absolute top-3 right-3 p-2 bg-slate-900/90 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 rounded-xl border border-slate-800 transition-colors shadow-lg"
              title="Open Raw Media in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Storage Paths & References Bar */}
          <div className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Supabase Storage Bucket Path
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={asset.storagePath}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyPath}
                  className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  {copiedPath ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPath ? 'Copied' : 'Copy Path'}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Public CDN URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={asset.url}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl ? 'Copied' : 'Copy URL'}
                </button>
              </div>
            </div>
          </div>

          {/* Technical Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Dimensions</span>
              <span className="text-xs font-bold font-mono text-slate-200">{asset.dimensions}</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">File Size</span>
              <span className="text-xs font-bold font-mono text-slate-200">{asset.fileSize}</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Resolution</span>
              <span className="text-xs font-bold font-mono text-slate-200">{asset.resolution}</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Uploaded Date</span>
              <span className="text-xs font-bold font-mono text-slate-200">{asset.uploadDate}</span>
            </div>
          </div>

          {/* Editable Details Form */}
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Asset Display Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={formData.category || 'Website'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as MediaCategory })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Visibility</label>
                <select
                  value={formData.visibility || 'PUBLIC'}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value as MediaVisibility })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="RESTRICTED">RESTRICTED</option>
                  <option value="ADMIN_ONLY">ADMIN_ONLY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. logo, cyan, vector, branding"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  value={formData.altText || ''}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle || ''}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">SEO Description</label>
              <textarea
                rows={2}
                value={formData.seoDescription || ''}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDuplicate(asset.id)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>

                <button
                  type="button"
                  onClick={() => onToggleArchive(asset.id, !asset.isArchived)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5" />
                  {asset.isArchived ? 'Unarchive' : 'Archive'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDelete(asset.id)}
                  className="px-3 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Asset Details
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
