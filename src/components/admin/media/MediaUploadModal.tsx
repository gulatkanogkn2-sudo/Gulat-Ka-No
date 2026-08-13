import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Check,
  Image as ImageIcon,
  FileText,
  Sparkles,
  ShieldCheck,
  HardDrive,
  Loader2,
} from 'lucide-react';
import { MediaCategory, MediaVisibility } from '../../../types/mediaLibrary';
import { getSupabaseClient, isSupabaseConfigured } from '../../../lib/supabase';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (assetData: {
    name: string;
    title: string;
    url: string;
    category: MediaCategory;
    visibility: MediaVisibility;
    description: string;
    altText: string;
    tags: string[];
    dimensions?: string;
    fileSize?: string;
  }) => void;
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

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<MediaCategory>('Website');
  const [visibilityInput, setVisibilityInput] = useState<MediaVisibility>('PUBLIC');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [altTextInput, setAltTextInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample quick presets
  const samplePresets = [
    {
      title: 'Lab Cleanroom Synthesizer',
      url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80',
      category: 'Hero Images' as MediaCategory,
      filename: 'cleanroom-synthesizer-hero.jpg',
    },
    {
      title: 'GC-MS Chromatogram Spectrometer PDF',
      url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      category: 'COA' as MediaCategory,
      filename: 'gc-ms-chromatogram-report.pdf',
    },
    {
      title: 'BPC-157 Lyophilized Vial Packaging',
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      category: 'Products' as MediaCategory,
      filename: 'bpc157-10mg-vial-pack.webp',
    },
  ];

  if (!isOpen) return null;

  const handleApplyPreset = (p: typeof samplePresets[0]) => {
    setActiveTab('url');
    setUrlInput(p.url);
    setTitleInput(p.title);
    setNameInput(p.filename);
    setCategoryInput(p.category);
    setAltTextInput(p.title);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setNameInput(file.name);
    if (!titleInput) {
      setTitleInput(file.name.replace(/\.[^/.]+$/, ''));
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalUrl = urlInput.trim();
    let finalFileSize = '320 KB';

    if (activeTab === 'file') {
      if (!selectedFile && !finalUrl) return;

      if (selectedFile) {
        setIsUploading(true);
        try {
          finalFileSize = `${(selectedFile.size / 1024).toFixed(0)} KB`;
          if (isSupabaseConfigured) {
            const client = getSupabaseClient();
            if (client) {
              const extension = selectedFile.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'png';
              const storagePath = `media/${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${extension}`;
              const { error: uploadError } = await client.storage
                .from('gkn-media')
                .upload(storagePath, selectedFile, { contentType: selectedFile.type || 'image/png', upsert: true });

              if (!uploadError) {
                const { data: publicUrlData } = client.storage.from('gkn-media').getPublicUrl(storagePath);
                finalUrl = publicUrlData.publicUrl;
              } else {
                console.warn('[MediaUploadModal] Storage upload error, falling back to local reader:', uploadError);
              }
            }
          }

          if (!finalUrl && filePreview) {
            finalUrl = filePreview;
          }
        } catch (err) {
          console.error('[MediaUploadModal] Upload error:', err);
        } finally {
          setIsUploading(false);
        }
      }
    }

    if (!finalUrl || !nameInput.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onUploadSuccess({
      url: finalUrl,
      name: nameInput.trim(),
      title: titleInput.trim() || nameInput.trim(),
      category: categoryInput,
      visibility: visibilityInput,
      description: descriptionInput,
      altText: altTextInput || titleInput || nameInput,
      tags: tags.length > 0 ? tags : [categoryInput.toLowerCase()],
      dimensions: '1200x800 px',
      fileSize: finalFileSize,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-800">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Upload & Register Asset to Media Library
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Indexed to Supabase Storage Bucket & GKN Central Media Registry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'file'
                ? 'bg-[#00D9FF] text-black shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload File From Device
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'url'
                ? 'bg-[#00D9FF] text-black shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> Remote URL / Presets
          </button>
        </div>

        {/* Preset Bar (Shown when on URL tab) */}
        {activeTab === 'url' && (
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-3 h-3" /> Sample Presets:
            </span>
            {samplePresets.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-800 rounded-lg text-[10px] font-mono transition-colors flex-shrink-0 cursor-pointer"
              >
                + {p.title}
              </button>
            ))}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {activeTab === 'file' ? (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Choose Device File *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-[#00D9FF] rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-950/60 flex flex-col items-center justify-center gap-2 group"
              >
                {filePreview ? (
                  <div className="w-32 h-24 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 p-1">
                    <img src={filePreview} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-[#00D9FF] transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                )}
                <span className="text-xs font-bold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to Browse File on Device'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {selectedFile
                    ? `${(selectedFile.size / 1024).toFixed(0)} KB • Click to choose different file`
                    : 'Supports PNG, JPG, WEBP, SVG, PDF up to 10MB'}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Asset Media URL / Storage Pointer *
              </label>
              <input
                type="text"
                required
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (!nameInput) {
                    const filename = e.target.value.split('/').pop()?.split('?')[0] || 'asset.png';
                    setNameInput(filename);
                    setTitleInput(filename.replace(/\.[^/.]+$/, ''));
                  }
                }}
                placeholder="https://images.unsplash.com/... or media://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                File Name *
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. gkn-banner-2026.png"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Display Title *
              </label>
              <input
                type="text"
                required
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. GKN Banner 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Media Category *
              </label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value as MediaCategory)}
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
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Access Visibility
              </label>
              <select
                value={visibilityInput}
                onChange={(e) => setVisibilityInput(e.target.value as MediaVisibility)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="PUBLIC">PUBLIC</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="ADMIN_ONLY">ADMIN_ONLY</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              placeholder="Internal notes about asset usage and origin..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Alt Text (Accessibility)
              </label>
              <input
                type="text"
                value={altTextInput}
                onChange={(e) => setAltTextInput(e.target.value)}
                placeholder="Image description..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="lab, cyan, hero"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || (activeTab === 'file' ? !selectedFile : !urlInput.trim())}
              className="px-5 py-2 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Supabase...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Index Asset in Media Library
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

