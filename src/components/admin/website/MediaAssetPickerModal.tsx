import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Image as ImageIcon, Check, Sparkles, Filter, ExternalLink, FileText, HardDrive, Upload, Trash2 } from 'lucide-react';
import { mediaLibraryService } from '../../../services/mediaLibraryService';
import { MediaAssetItem, MediaCategory } from '../../../types/mediaLibrary';

export interface MediaAssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (url: string) => void;
  currentValue?: string;
  title?: string;
  defaultCategory?: string;
}

export const MediaAssetPickerModal: React.FC<MediaAssetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  currentValue,
  title = 'Select Asset from Centralized GKN Media Library',
  defaultCategory = 'all',
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [selectedAssetUrl, setSelectedAssetUrl] = useState<string>(currentValue || '');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAssets(mediaLibraryService.getAssets({ isArchived: false }));
      setSelectedAssetUrl(currentValue || '');
    }
  }, [isOpen, currentValue]);

  if (!isOpen) return null;

  const CATEGORIES_FILTER_LIST = [
    'all',
    'Logos',
    'Hero Images',
    'Store Cards',
    'Products',
    'COA',
    'Research',
    'Protocols',
    'Calculator Assets',
    'QR Codes',
    'Documents',
  ];

  const handleModalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const uploaded = mediaLibraryService.uploadAsset({
          name: file.name,
          url: dataUrl,
          category: selectedCategory !== 'all' ? (selectedCategory as MediaCategory) : 'Website',
          fileSize: `${(file.size / 1024).toFixed(0)} KB`,
          fileSizeBytes: file.size,
        });
        setAssets(mediaLibraryService.getAssets({ isArchived: false }));
        setSelectedAssetUrl(uploaded.url);
        onSelectMedia(uploaded.url);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesCat =
      selectedCategory === 'all' ||
      asset.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'research' && (asset.category === 'Research' || asset.category === 'Protocols'));

    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      asset.title.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      asset.tags.some((t) => t.toLowerCase().includes(q)) ||
      asset.category.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const handleConfirm = () => {
    const finalUrl = customUrlInput.trim() || selectedAssetUrl;
    if (finalUrl) {
      onSelectMedia(finalUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <input
        type="file"
        ref={modalFileInputRef}
        accept="image/*,application/pdf"
        onChange={handleModalFileUpload}
        className="hidden"
      />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800/80">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {title}
                <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                  Media Asset Picker
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Upload new files directly from your device or pick existing pre-indexed assets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => modalFileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#00D9FF] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 hover:bg-[#00D9FF]/90 transition-colors shadow-[0_0_15px_rgba(0,217,255,0.3)]"
            >
              <Upload className="w-3.5 h-3.5" /> Upload From Device
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets by name or tag..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {CATEGORIES_FILTER_LIST.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid */}
        <div className="p-4 flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs space-y-2">
              <p>No media assets match the search query.</p>
              <button
                type="button"
                onClick={() => modalFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-cyan-300 rounded-lg text-xs font-bold"
              >
                <Upload className="w-3.5 h-3.5" /> Upload File From Device Now
              </button>
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isSelected = selectedAssetUrl === asset.url;
              const isImage = ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG'].includes(asset.fileType) || asset.url.startsWith('data:image');

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    setSelectedAssetUrl(asset.url);
                    setCustomUrlInput('');
                  }}
                  className={`relative group bg-slate-950 border rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-slate-900'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    {isImage ? (
                      <img
                        src={asset.url}
                        alt={asset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <FileText className="w-8 h-8 text-cyan-400" />
                    )}

                    {isSelected && (
                      <div className="absolute inset-0 bg-cyan-950/60 backdrop-blur-xs flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1.5 py-0.5 bg-slate-950/80 text-slate-300 rounded backdrop-blur-xs">
                      {asset.dimensions}
                    </span>
                  </div>

                  <div className="p-2.5 space-y-1">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{asset.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="uppercase text-cyan-400 font-semibold">{asset.category}</span>
                      <span>{asset.fileSize}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Custom Media Ref Override Input */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 block">
              Or specify custom Media Reference URL
            </label>
            <input
              type="text"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              placeholder="https://... or data:image/..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAssetUrl && !customUrlInput.trim()}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Apply Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MediaInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  description?: string;
  placeholder?: string;
  accept?: string;
  uploadButtonText?: string;
  onSave?: () => void;
}

export const MediaInput: React.FC<MediaInputProps> = ({
  label,
  value,
  onChange,
  description,
  placeholder = 'Upload from device or select from Media Library...',
  accept = 'image/*,application/pdf',
  uploadButtonText,
  onSave,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        mediaLibraryService.uploadAsset({
          name: file.name,
          url: dataUrl,
          category: 'Website',
          fileSize: `${(file.size / 1024).toFixed(0)} KB`,
          fileSizeBytes: file.size,
        });
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2 font-mono">
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleDeviceUpload}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#00D9FF]" /> {label}
        </label>
        <span className="text-[10px] text-slate-400">Direct Device Upload</span>
      </div>

      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
        {/* Preview Container — full artwork preview without cropping */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-24 h-24 sm:w-28 sm:h-20 rounded-xl bg-slate-900 border border-slate-800 p-1 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-inner">
            {value ? (
              <img src={value} alt={label} className="w-full h-full object-contain rounded-lg" />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-600" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-xs font-bold text-slate-200 truncate">
              {value ? (value.startsWith('data:') ? 'Uploaded File (Device)' : value.split('/').pop()) : 'No File Selected'}
            </div>
            <p className="text-[10px] text-slate-400 truncate font-mono">
              {value ? (value.length > 60 ? value.substring(0, 60) + '...' : value) : 'Select an image file to upload directly from your device.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,217,255,0.25)] active:scale-95 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> {uploadButtonText || 'Upload File'}
          </button>

          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" /> Media Library
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-2.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ml-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          )}
        </div>
      </div>

      {/* Static Explanation according to Rule #3 */}
      {description ? (
        <p className="text-[11px] text-slate-400 leading-relaxed">{description}</p>
      ) : (
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Upload any image or document file directly from your device storage, or select an asset from the media library.
        </p>
      )}

      {/* Modal Picker */}
      <MediaAssetPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectMedia={(url) => onChange(url)}
        currentValue={value}
        title={`Select Asset for ${label}`}
      />
    </div>
  );
};

