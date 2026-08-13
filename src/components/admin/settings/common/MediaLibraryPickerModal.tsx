import React, { useState, useRef } from 'react';
import { QrCode, Search, Image as ImageIcon, Check, X, Upload } from 'lucide-react';

export interface MediaLibraryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: { id: string; url: string; name: string }) => void;
  currentMediaId?: string;
}

const SAMPLE_MEDIA_QR_CODES = [
  {
    id: 'media-qr-gcash-001',
    name: 'GCash Official QR (GKN Operations)',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    dimensions: '1080x1080 px',
    fileSize: '240 KB',
    category: 'QR Codes',
  },
  {
    id: 'media-qr-maya-001',
    name: 'Maya Wallet Merchant QR Code',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    dimensions: '1080x1080 px',
    fileSize: '310 KB',
    category: 'QR Codes',
  },
  {
    id: 'media-qr-bdo-001',
    name: 'BDO Unibank Direct Instapay QR',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    dimensions: '1200x1200 px',
    fileSize: '410 KB',
    category: 'QR Codes',
  },
  {
    id: 'media-qr-usdt-001',
    name: 'USDT TRC20 Wallet Address QR Code',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    dimensions: '1000x1000 px',
    fileSize: '280 KB',
    category: 'QR Codes',
  },
];

export const MediaLibraryPickerModal: React.FC<MediaLibraryPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentMediaId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onSelect({
          id: `uploaded-qr-${Date.now()}`,
          url: dataUrl,
          name: file.name,
        });
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredMedia = SAMPLE_MEDIA_QR_CODES.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="glass-card bg-[#0A0F1D] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/50 flex items-center justify-center text-[#00D9FF]">
              <QrCode size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Media Asset & Payment QR Picker</h3>
              <p className="text-[11px] text-slate-400">Upload QR image directly from device or select existing asset</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#00D9FF] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 hover:bg-[#00D9FF]/90 transition-colors shadow-[0_0_15px_rgba(0,217,255,0.3)]"
            >
              <Upload size={14} /> Upload From Device
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search QR codes or Payment Media Assets..."
              className="w-full bg-[#050810] border border-white/10 text-white text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          {/* Grid of Media items */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {filteredMedia.map((media) => {
              const isSelected = currentMediaId === media.id;
              return (
                <div
                  key={media.id}
                  onClick={() => {
                    onSelect({ id: media.id, url: media.url, name: media.name });
                    onClose();
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 bg-white/5 hover:bg-white/10 ${
                    isSelected
                      ? 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center relative">
                    <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#00D9FF]/30 flex items-center justify-center text-white">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{media.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{media.dimensions} • {media.fileSize}</p>
                    <p className="text-[9px] text-[#00D9FF] font-mono uppercase mt-0.5">{media.id}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom URL Fallback */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Or specify custom QR Image URL:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://your-storage-bucket.com/qr-code.png"
                className="flex-1 bg-[#050810] border border-white/10 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#00D9FF]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customUrl) {
                    onSelect({
                      id: `custom-media-${Date.now()}`,
                      url: customUrl,
                      name: 'Custom QR Media Link',
                    });
                    onClose();
                  }
                }}
                disabled={!customUrl}
                className="px-3 py-2 bg-[#00D9FF] text-black font-bold text-xs rounded-lg disabled:opacity-50 hover:brightness-110 transition-all cursor-pointer"
              >
                Apply URL
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Media Assets synchronized with GKN Media Library</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
