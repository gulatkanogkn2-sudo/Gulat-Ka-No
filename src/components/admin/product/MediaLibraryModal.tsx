import { Image, Search, CheckCircle2, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '../../common/Badge';
import { Card } from '../../common/Card';

interface MediaItem {
  id: string;
  title: string;
  url: string;
  category: 'Vial Photos' | 'COA Certificates' | 'Lab Equipment' | 'Chemical Diagrams';
  resolution: string;
  fileSize: string;
}

const MOCK_MEDIA_ASSETS: MediaItem[] = [
  {
    id: 'med-101',
    title: 'Tirzepatide Lyophilized Vial (Aseptic Box)',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    category: 'Vial Photos',
    resolution: '1920x1080',
    fileSize: '1.4 MB',
  },
  {
    id: 'med-102',
    title: 'HPLC Quantitative Purity Spectrum Chart',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    category: 'COA Certificates',
    resolution: '2400x1600',
    fileSize: '2.8 MB',
  },
  {
    id: 'med-103',
    title: 'Retatrutide Lyophilized Cake Sample',
    url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    category: 'Vial Photos',
    resolution: '1920x1200',
    fileSize: '1.9 MB',
  },
  {
    id: 'med-104',
    title: 'Automated Solid-Phase Peptide Synthesizer',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
    category: 'Lab Equipment',
    resolution: '2048x1536',
    fileSize: '3.1 MB',
  },
  {
    id: 'med-105',
    title: 'Peptide Secondary Structure Diagram',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    category: 'Chemical Diagrams',
    resolution: '1600x1200',
    fileSize: '1.1 MB',
  },
  {
    id: 'med-106',
    title: 'Cold Storage Vault Tray Inspection',
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
    category: 'Lab Equipment',
    resolution: '1920x1080',
    fileSize: '2.2 MB',
  },
];

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (url: string) => void;
  selectedUrl?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  selectedUrl,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | string>('all');
  const [currentSelected, setCurrentSelected] = useState<string>(selectedUrl || '');

  if (!isOpen) return null;

  const categories = ['all', 'Vial Photos', 'COA Certificates', 'Lab Equipment', 'Chemical Diagrams'];

  const filteredAssets = MOCK_MEDIA_ASSETS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleConfirm = () => {
    if (currentSelected) {
      onSelectMedia(currentSelected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans animate-fade-in">
      <div className="w-full max-w-4xl bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,217,255,0.2)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
                <Image className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Centralized Media Library
              </h3>
              <Badge variant="cyan" glow>Supabase Asset Vault</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select verified laboratory assets, COA spectra charts, or product photography from storage.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-mono"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-white/10 space-y-3 bg-slate-950/40">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search media assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto font-mono text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1 rounded-lg border text-[11px] transition-colors capitalize ${
                    activeTab === cat
                      ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] font-bold'
                      : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Assets */}
        <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
          {filteredAssets.map((asset) => {
            const isSelected = currentSelected === asset.url;
            return (
              <div
                key={asset.id}
                onClick={() => setCurrentSelected(asset.url)}
                className={`relative group rounded-xl bg-slate-950 border transition-all cursor-pointer overflow-hidden p-2 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.4)] ring-1 ring-[#00D9FF]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="aspect-video w-full rounded-lg bg-slate-900 overflow-hidden relative">
                  <img
                    src={asset.url}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#00D9FF]/20 backdrop-blur-[2px] flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-[#00D9FF] drop-shadow-[0_0_10px_rgba(0,217,255,1)]" />
                    </div>
                  )}
                </div>

                <div className="mt-2 space-y-1 font-mono">
                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                    {asset.title}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>{asset.category}</span>
                    <span>{asset.resolution}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00D9FF]" />
            Asset Vault Sync: Active
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!currentSelected}
              className="px-5 py-2 rounded-lg bg-[#00D9FF] text-black font-bold disabled:opacity-50 hover:bg-[#00D9FF]/90 transition-colors shadow-[0_0_15px_rgba(0,217,255,0.4)]"
            >
              USE SELECTED ASSET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
