import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

interface MediaThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

export const MediaThumbnail: React.FC<MediaThumbnailProps> = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-slate-900 text-slate-500" role="img" aria-label={`${alt} preview unavailable`}>
        <ImageOff className="w-5 h-5" />
        <span className="text-[9px] font-mono text-center px-1">Preview unavailable</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
};

