import React from 'react';
import { SafeImage, BRANDING_ASSETS } from '../../assets/branding';
import { StoreAccent } from '../store/StoreStatusBadge';
import { Package } from 'lucide-react';

export interface ProductImageProps {
  src?: string;
  alt: string;
  accent?: StoreAccent;
  badgeOverlay?: React.ReactNode;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
  compact?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  accent = 'cyan',
  badgeOverlay,
  className = '',
  aspectRatio = 'square',
  compact = false,
}) => {
  const accentGlow: Record<StoreAccent, string> = {
    cyan: 'group-hover:border-[#00D9FF]/50 group-hover:shadow-[0_0_20px_rgba(0,217,255,0.25)]',
    purple: 'group-hover:border-[#8B5CF6]/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]',
    magenta: 'group-hover:border-[#FF2ED1]/50 group-hover:shadow-[0_0_20px_rgba(255,46,209,0.25)]',
  };

  if (compact) {
    return (
      <div
        className={`relative w-20 h-20 overflow-hidden rounded-xl bg-[#090D16] border border-white/10 transition-all duration-300 group ${accentGlow[accent]} ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/60 via-transparent to-transparent z-10 pointer-events-none" />

        {src ? (
          <SafeImage
            src={src}
            alt={alt}
            fallbackSrc={BRANDING_ASSETS.logo}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-500 bg-white/5 transition-transform duration-500 group-hover:scale-105">
            <Package className="w-8 h-8 stroke-[1.5] text-slate-600" />
          </div>
        )}

        {badgeOverlay && (
          <div className="absolute top-1 left-1 z-20 flex items-center gap-1">
            {badgeOverlay}
          </div>
        )}
      </div>
    );
  }

  const aspectClass =
    aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden rounded-xl bg-[#090D16] border border-white/10 transition-all duration-300 group ${accentGlow[accent]} ${className}`}
    >
      {/* Background Gradient & Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent z-10 pointer-events-none" />

      {src ? (
        <SafeImage
          src={src}
          alt={alt}
          fallbackSrc={BRANDING_ASSETS.logo}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-500 bg-white/5 transition-transform duration-500 group-hover:scale-105">
          <Package className="w-12 h-12 stroke-[1.5] text-slate-600 mb-2" />
          <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">GKN ANALYTICAL</span>
        </div>
      )}

      {/* Badge Overlay (Top Left or Top Right) */}
      {badgeOverlay && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          {badgeOverlay}
        </div>
      )}
    </div>
  );
};
