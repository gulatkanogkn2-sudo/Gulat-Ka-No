import React from 'react';
import { Card } from '../common/Card';
import { StoreStatusBadge, StoreAccent } from './StoreStatusBadge';
import { InformationCard, InfoField } from './InformationCard';
import { SafeImage } from '../../assets/branding';

export interface StoreHeroProps {
  title: string;
  description: string;
  status: string;
  accent?: StoreAccent;
  bannerImage?: string;
  infoTitle?: string;
  infoFields?: InfoField[];
  infoIcon?: React.ReactNode;
}

export const StoreHero: React.FC<StoreHeroProps> = ({
  title,
  description,
  status,
  accent = 'cyan',
  bannerImage,
  infoTitle,
  infoFields,
  infoIcon,
}) => {
  const accentGlow: Record<StoreAccent, string> = {
    cyan: 'border-[#00D9FF]/30 shadow-[0_0_30px_rgba(0,217,255,0.12)]',
    purple: 'border-[#8B5CF6]/30 shadow-[0_0_30px_rgba(139,92,246,0.12)]',
    magenta: 'border-[#FF2ED1]/30 shadow-[0_0_30px_rgba(255,46,209,0.12)]',
  };

  const accentGradient: Record<StoreAccent, string> = {
    cyan: 'from-[#00D9FF] via-white to-slate-200',
    purple: 'from-[#8B5CF6] via-white to-purple-200',
    magenta: 'from-[#FF2ED1] via-white to-pink-200',
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Store Hero Banner */}
      <Card variant="glass" noPadding className={`${accentGlow[accent]} overflow-hidden relative border`}>
        {bannerImage && (
          <div className="absolute inset-0 z-0 opacity-25 pointer-events-none transition-transform duration-700 hover:scale-105">
            <SafeImage src={bannerImage} alt={`${title} Store Hero Banner`} className="w-full h-full object-cover object-right" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent"></div>
          </div>
        )}

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className={`text-3xl sm:text-4xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${accentGradient[accent]}`}>
                {title}
              </h1>
              <StoreStatusBadge status={status} accent={accent} glow />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              {description}
            </p>
          </div>
        </div>
      </Card>

      {/* Information Section Card */}
      {infoTitle && infoFields && infoFields.length > 0 && (
        <InformationCard
          title={infoTitle}
          fields={infoFields}
          accent={accent}
          icon={infoIcon}
        />
      )}
    </div>
  );
};
