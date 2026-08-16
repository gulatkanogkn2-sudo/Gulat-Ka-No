import React from 'react';
import { DigitalMemberCardProfile, DigitalMemberIdSettings } from '../../types/digitalMember';
import { QrCodeSvg } from './QrCodeSvg';
import { BarcodeSvg } from './BarcodeSvg';
import { ShieldCheck, Lock, User } from 'lucide-react';

interface DigitalMemberCardBackProps {
  profile: DigitalMemberCardProfile;
  settings: DigitalMemberIdSettings;
}

export const DigitalMemberCardBack: React.FC<DigitalMemberCardBackProps> = ({
  profile,
  settings,
}) => {
  const primaryColor = settings.primaryColor || '#00D9FF';
  const secondaryColor = settings.secondaryColor || '#8B5CF6';
  const dimOpacity = Math.min(100, Math.max(0, settings.backBackgroundDim ?? 40)) / 100;

  const customerCode = profile.customerCode || 'GKN-000000';
  const qrPayload = `GKN:${customerCode}`;
  const isVerified = profile.verificationStatus === 'VERIFIED';
  const noticeText =
    settings.backNotice ||
    'This digital member card identifies the registered GKN account holder. Present when account identification is requested.';

  return (
    <div
      data-digital-member-card-side="back"
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-5 select-none font-mono border border-white/15 transition-all duration-300"
      style={{
        aspectRatio: '1.586 / 1',
        background: `linear-gradient(135deg, #060912 0%, #03050a 50%, #090c18 100%)`,
      }}
    >
      {/* 1. Custom Back Background Image */}
      {settings.backBackgroundImage && (
        <img
          src={settings.backBackgroundImage}
          alt="Card Back Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      {/* 2. Configurable Dim Overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: dimOpacity }}
      />

      {/* 3. Decorative Ambient Glow */}
      <div
        className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: secondaryColor }}
      />
      <div
        className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      {/* 4. Top Row: Magnetic Stripe Aesthetic & Security Seal */}
      <div className="relative z-10 space-y-2">
        <div className="w-full h-7 sm:h-9 bg-slate-950/90 rounded-lg border border-white/15 flex items-center justify-between px-3 relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-extrabold">
            <Lock className="w-3.5 h-3.5 text-[#00D9FF] shrink-0" />
            <span className="tracking-wider">GKN MEMBER ID</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#00D9FF] tracking-wider">
            {customerCode}
          </span>
        </div>
      </div>

      {/* 5. Center Row: QR Code + Barcode + Notice */}
      <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4 my-auto py-1">
        {/* Left Side: QR Code */}
        {settings.showQrCode && (
          <div className="shrink-0 flex flex-col items-center">
            <div className="p-1 bg-white rounded-xl shadow-md border border-white/20">
              <QrCodeSvg
                value={qrPayload}
                size={70}
                color="#0f172a"
                bgColor="#ffffff"
              />
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-300 mt-1 font-mono font-bold tracking-wider">
              SCAN TO VERIFY
            </span>
          </div>
        )}

        {/* Right Side: Barcode & Notice text */}
        <div className={`flex-1 min-w-0 flex flex-col ${settings.showQrCode ? 'items-end text-right' : 'items-start text-left'} space-y-2`}>
          {settings.showBarcode && (
            <div className="w-full max-w-[170px] sm:max-w-[200px] p-1 bg-white rounded-lg shadow-md border border-white/20">
              <BarcodeSvg
                value={customerCode}
                height={30}
                color="#0f172a"
                bgColor="#ffffff"
                showText={true}
              />
            </div>
          )}

          <div className="bg-black/50 backdrop-blur-xs p-2 rounded-xl border border-white/10 shadow-sm max-w-[280px]">
            <p className="text-xs sm:text-sm text-slate-100 leading-snug font-sans font-medium">
              {noticeText}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Bottom Row: Footer Branding & Issuer Stamp */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/10 pt-2 text-xs sm:text-sm text-slate-300">
        <div className="flex items-center gap-2 min-w-0">
          {isVerified ? (
            <>
              <ShieldCheck className="w-4 h-4 text-[#00D9FF] shrink-0" />
              <span className="font-extrabold text-white tracking-wider truncate">
                {settings.issuerName || 'GKN'} VERIFIED MEMBER
              </span>
            </>
          ) : (
            <>
              <User className="w-4 h-4 text-slate-300 shrink-0" />
              <span className="font-extrabold text-slate-200 tracking-wider truncate">
                {settings.issuerName || 'GKN'} DIGITAL MEMBER
              </span>
            </>
          )}
        </div>
        <span className="text-slate-400 font-mono text-xs sm:text-sm font-bold shrink-0">
          REF: {customerCode}
        </span>
      </div>
    </div>
  );
};
