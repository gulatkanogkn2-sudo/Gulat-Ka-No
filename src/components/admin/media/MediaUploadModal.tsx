import React, { useState } from 'react';
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
} from 'lucide-react';
import { MediaCategory, MediaVisibility } from '../../../types/mediaLibrary';

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
  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<MediaCategory>('Website');
  const [visibilityInput, setVisibilityInput] = useState<MediaVisibility>('PUBLIC');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [altTextInput, setAltTextInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

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
    setUrlInput(p.url);
    setTitleInput(p.title);
    setNameInput(p.filename);
    setCategoryInput(p.category);
    setAltTextInput(p.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !nameInput.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onUploadSuccess({
      url: urlInput.trim(),
      name: nameInput.trim(),
      title: titleInput.trim() || nameInput.trim(),
      category: categoryInput,
      visibility: visibilityInput,
      description: descriptionInput,
      altText: altTextInput || titleInput || nameInput,
      tags: tags.length > 0 ? tags : [categoryInput.toLowerCase()],
      dimensions: '1200x800 px',
      fileSize: '320 KB',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
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
              <p className="text-xs text-slate-400">
                Indexed to Supabase Storage Bucket & GKN Central Media Registry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3 h-3" /> Sample Presets:
          </span>
          {samplePresets.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-800 rounded-lg text-[10px] font-mono transition-colors flex-shrink-0"
            >
              + {p.title}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Asset Media URL / Storage Pointer *
            </label>
            <div className="flex items-center gap-2">
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
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Index Asset in Media Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
