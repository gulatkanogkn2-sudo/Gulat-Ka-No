import React from 'react';
import { DigitalMemberCardProfile, DigitalMemberIdSettings } from '../../types/digitalMember';
import { CustomerTierConfig } from '../../types/customerTier';
import { ShieldCheck, ShieldAlert, Award, Calendar } from 'lucide-react';

interface DigitalMemberCardFrontProps {
  profile: DigitalMemberCardProfile;
  settings: DigitalMemberIdSettings;
  avatarDisplayUrl?: string | null;
  tierConfig?: CustomerTierConfig | null;
}

function getInitials(name?: string): string {
  if (!name) return 'GKN';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'AUG 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).toUpperCase();
  } catch {
    return dateStr;
  }
}

function formatTierDisplay(tierConfigName?: string | null, rawTier?: string): string {
  if (tierConfigName && tierConfigName.trim()) {
    return tierConfigName.trim();
  }
  if (!rawTier) return 'Standard';
  if (rawTier.toUpperCase() === 'VIP') return 'VIP';
  const clean = rawTier.replace(/_/g, ' ').toLowerCase();
  return clean.replace(/\b\w/g, (c) => c.toUpperCase());
}

export const DigitalMemberCardFront: React.FC<DigitalMemberCardFrontProps> = ({
  profile,
  settings,
  avatarDisplayUrl,
  tierConfig,
}) => {
  const primaryColor = settings.primaryColor || '#00D9FF';
  const secondaryColor = settings.secondaryColor || '#8B5CF6';
  const dimOpacity = Math.min(100, Math.max(0, settings.frontBackgroundDim ?? 25)) / 100;

  const tierName = formatTierDisplay(tierConfig?.name, profile.tier);
  const formattedDate = formatDate(profile.createdAt);
  const isVerified = profile.verificationStatus === 'VERIFIED';

  const fullNameStr = profile.fullName || 'Registered Customer';
  const nameLength = fullNameStr.length;

  let nameSizeClass = 'text-base sm:text-lg lg:text-xl';
  if (nameLength > 28) {
    nameSizeClass = 'text-xs sm:text-sm lg:text-base';
  } else if (nameLength > 18) {
    nameSizeClass = 'text-sm sm:text-base lg:text-lg';
  }

  const [logoFailed, setLogoFailed] = React.useState(false);

  React.useEffect(() => {
    setLogoFailed(false);
  }, [settings.brandLogoImage]);

  return (
    <div
      data-digital-member-card-side="front"
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-5 select-none font-mono border border-white/15 transition-all duration-300"
      style={{
        aspectRatio: '1.586 / 1',
        background: `linear-gradient(135deg, #090e1a 0%, #04070e 50%, #0d1222 100%)`,
      }}
    >
      {/* 1. Custom Background Image if configured */}
      {settings.frontBackgroundImage && (
        <img
          src={settings.frontBackgroundImage}
          alt="Card Front Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      {/* 2. Configurable Dim Overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: dimOpacity }}
      />

      {/* 3. Decorative Geometric Glow Accents */}
      <div
        className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: secondaryColor }}
      />

      {/* 4. Top Header Row: Branding & Verification */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Cyberpunk GKN Badge / Brand Logo */}
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-extrabold text-sm sm:text-base tracking-wider shadow-lg border shrink-0 overflow-hidden"
            style={{
              backgroundColor: `${primaryColor}1A`,
              borderColor: `${primaryColor}60`,
              color: primaryColor,
              boxShadow: `0 0 15px ${primaryColor}30`,
            }}
          >
            {settings.brandLogoImage && !logoFailed ? (
              <img
                src={settings.brandLogoImage}
                alt={settings.issuerName || 'Brand Logo'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-1"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              settings.issuerName || 'GKN'
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold tracking-widest text-white truncate">
                {settings.issuerName || 'GKN'}
              </span>
              <span
                className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded uppercase border tracking-wider shrink-0"
                style={{
                  color: primaryColor,
                  borderColor: `${primaryColor}50`,
                  backgroundColor: `${primaryColor}15`,
                }}
              >
                MEMBER ID
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 font-sans tracking-wide truncate font-medium">
              Digital Member Credential
            </p>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="shrink-0">
          {isVerified ? (
            <span
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm"
              style={{
                color: '#4ADE80',
                borderColor: 'rgba(74, 222, 128, 0.5)',
                backgroundColor: 'rgba(74, 222, 128, 0.15)',
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              VERIFIED
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm"
              style={{
                color: '#FBBF24',
                borderColor: 'rgba(251, 191, 36, 0.5)',
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
              }}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              {profile.verificationStatus || 'UNVERIFIED'}
            </span>
          )}
        </div>
      </div>

      {/* 5. Center ID Portrait & Primary Identity Panel */}
      <div className="relative z-10 flex items-center gap-3.5 sm:gap-4 my-auto py-1 min-w-0">
        {/* Large ID Portrait Photo — No Overlay Icon */}
        <div className="shrink-0">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shadow-xl flex items-center justify-center bg-black/80 relative"
            style={{
              borderColor: `${primaryColor}80`,
              boxShadow: `0 0 20px ${primaryColor}30`,
            }}
          >
            {avatarDisplayUrl ? (
              <img
                src={avatarDisplayUrl}
                alt={profile.fullName || 'Member Avatar'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="text-2xl sm:text-3xl font-extrabold tracking-wider"
                style={{ color: primaryColor }}
              >
                {getInitials(profile.fullName)}
              </span>
            )}
          </div>
        </div>

        {/* Primary Identity Info Box */}
        <div className="min-w-0 flex-1 space-y-1 bg-black/40 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
          <div className="max-w-full">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              FULL NAME
            </span>
            <h3
              className={`${nameSizeClass} font-extrabold text-white tracking-wide leading-tight drop-shadow-md break-words line-clamp-2`}
              title={fullNameStr}
            >
              {fullNameStr}
            </h3>
            {profile.preferredName && (
              <p
                className="text-[10px] sm:text-xs font-semibold truncate mt-0.5"
                style={{ color: primaryColor }}
                title={`AKA "${profile.preferredName}"`}
              >
                AKA &quot;{profile.preferredName}&quot;
              </p>
            )}
          </div>

          <div className="pt-1 flex items-center gap-1.5 text-xs sm:text-sm border-t border-white/10 mt-1">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ID NO:
            </span>
            <span className="font-extrabold tracking-wider text-[#00D9FF] truncate text-xs sm:text-sm">
              {profile.customerCode || 'GKN-000000'}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Bottom Row: Structured Tier + Member Since Fields */}
      <div className="relative z-10 flex items-end justify-between gap-2 border-t border-white/10 pt-2 shrink-0">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
            CUSTOMER TIER
          </span>
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs sm:text-sm font-extrabold uppercase tracking-wider mt-0.5 max-w-full truncate shadow-sm"
            style={{
              color: secondaryColor,
              borderColor: `${secondaryColor}60`,
              backgroundColor: `${secondaryColor}20`,
            }}
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{tierName}</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
            MEMBER SINCE
          </span>
          <div className="text-xs sm:text-sm font-extrabold text-slate-100 flex items-center justify-end gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

