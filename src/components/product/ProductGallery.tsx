import React, { useState } from 'react';
import { StoreAccent } from '../store/StoreStatusBadge';
import { SafeImage } from '../../assets/branding';

export interface ProductGalleryProps {
  images?: string[];
  mainImage?: string;
  productName?: string;
  accent?: StoreAccent;
  className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [],
  mainImage,
  productName = 'Product',
  accent = 'cyan',
  className = '',
}) => {
  const allImages = images.length > 0 ? images : [mainImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'];
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const activeBorder: Record<StoreAccent, string> = {
    cyan: 'border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.4)]',
    purple: 'border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.4)]',
    magenta: 'border-[#FF2ED1] shadow-[0_0_15px_rgba(255,46,209,0.4)]',
  };

  const mainGlow: Record<StoreAccent, string> = {
    cyan: 'border-[#00D9FF]/30 shadow-[0_0_30px_rgba(0,217,255,0.15)]',
    purple: 'border-[#8B5CF6]/30 shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    magenta: 'border-[#FF2ED1]/30 shadow-[0_0_30px_rgba(255,46,209,0.15)]',
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Display Image */}
      <div className={`relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#090D16] border ${mainGlow[accent]} transition-all group`}>
        <SafeImage
          src={allImages[activeIdx]}
          alt={`${productName} view ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-60 pointer-events-none" />
        
        {/* Subtle Cyberpunk Corner Accents */}
        <div className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-widest text-slate-400 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
          REF-IMG #{activeIdx + 1}
        </div>
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#090D16] border-2 transition-all cursor-pointer flex-shrink-0 ${
                activeIdx === idx
                  ? activeBorder[accent]
                  : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
              }`}
            >
              <SafeImage
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
