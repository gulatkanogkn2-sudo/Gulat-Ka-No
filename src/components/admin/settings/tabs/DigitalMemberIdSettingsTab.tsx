import React, { useState } from 'react';
import { DigitalMemberIdSettings, DigitalMemberCardProfile } from '../../../../types/digitalMember';
import { DigitalMemberCard } from '../../../digitalMember/DigitalMemberCard';
import { MediaLibraryPickerModal } from '../common/MediaLibraryPickerModal';
import {
  CreditCard,
  Image as ImageIcon,
  Palette,
  Sliders,
  Shield,
  QrCode,
  Barcode,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Upload,
  X,
  RefreshCw,
} from 'lucide-react';

interface DigitalMemberIdSettingsTabProps {
  settings?: DigitalMemberIdSettings;
  onChange: (updated: DigitalMemberIdSettings) => void;
}

const DEFAULT_PREVIEW_PROFILE: DigitalMemberCardProfile = {
  id: 'preview-001',
  fullName: 'ALEXANDER D. VANCE',
  preferredName: 'Alex',
  email: 'alexander.vance@gkn-labs.com',
  customerCode: 'GKN-000008',
  tier: 'VIP',
  verificationStatus: 'VERIFIED',
  createdAt: new Date().toISOString(),
};

export const DigitalMemberIdSettingsTab: React.FC<DigitalMemberIdSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const currentSettings: DigitalMemberIdSettings = settings || {
    enabled: true,
    brandLogoImage: '',
    frontBackgroundImage: '',
    backBackgroundImage: '',
    frontBackgroundDim: 25,
    backBackgroundDim: 40,
    primaryColor: '#00D9FF',
    secondaryColor: '#8B5CF6',
    accentColor: '#FF2ED1',
    showQrCode: true,
    showBarcode: true,
    issuerName: 'GKN',
    backNotice:
      'This digital member card identifies the registered GKN account holder. Present when account identification is requested.',
  };

  const [activeMediaPickerTarget, setActiveMediaPickerTarget] = useState<'front' | 'back' | 'logo' | null>(null);

  const updateField = <K extends keyof DigitalMemberIdSettings>(key: K, value: DigitalMemberIdSettings[K]) => {
    onChange({
      ...currentSettings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0A0F1D] via-[#050810] to-[#0A0F1D] border border-[#00D9FF]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] shrink-0 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">
                Digital Member ID Configuration
              </h2>
              <span className="text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/30">
                GLOBAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Customize global card appearance, colors, backgrounds, dimming levels, and verification tags.
            </p>
          </div>
        </div>

        {/* Global Enabled Toggle */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
          <span className="text-xs font-bold text-slate-300">Member Cards System:</span>
          <button
            type="button"
            onClick={() => updateField('enabled', !currentSettings.enabled)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentSettings.enabled
                ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-[0_0_12px_rgba(74,222,128,0.2)]'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {currentSettings.enabled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                ENABLED
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                DISABLED
              </>
            )}
          </button>
        </div>
      </div>

      {!currentSettings.enabled && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <strong className="block font-bold">Digital Member ID is Disabled Globally</strong>
            <span className="font-sans">
              Customers will see an unavailable message when visiting their account member card tab.
            </span>
          </div>
        </div>
      )}

      {/* Main Grid Layout: Live Card Preview + Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Card Preview Sticky Block */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Eye className="w-4 h-4 text-[#00D9FF]" />
                <span>Live Card Preview</span>
              </div>
              <span className="text-[10px] text-slate-400 font-sans">
                Real-time CR80 Renderer
              </span>
            </div>

            {/* Live Card Renderer Component */}
            <div className="py-2">
              <DigitalMemberCard
                profile={DEFAULT_PREVIEW_PROFILE}
                settings={currentSettings}
                showFlipControls={true}
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] text-slate-400 font-sans space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[#00D9FF] font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Sample Preview Mode</span>
              </div>
              <p>
                This live card reflects changes to colors, backgrounds, dimming levels, and layout options in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Form Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Colors Section */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Palette className="w-4 h-4 text-[#00D9FF]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Brand & Accent Color Themes
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Primary Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Primary Theme Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentSettings.primaryColor || '#00D9FF'}
                    onChange={(e) => updateField('primaryColor', e.target.value)}
                    className="w-9 h-9 rounded-lg bg-slate-950 border border-white/20 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={currentSettings.primaryColor || '#00D9FF'}
                    onChange={(e) => updateField('primaryColor', e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-[#00D9FF] outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Top branding, borders & verified badges.</p>
              </div>

              {/* Secondary Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Secondary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentSettings.secondaryColor || '#8B5CF6'}
                    onChange={(e) => updateField('secondaryColor', e.target.value)}
                    className="w-9 h-9 rounded-lg bg-slate-950 border border-white/20 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={currentSettings.secondaryColor || '#8B5CF6'}
                    onChange={(e) => updateField('secondaryColor', e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-[#8B5CF6] outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Tier badges & ambient back lighting.</p>
              </div>

              {/* Accent Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Highlight Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentSettings.accentColor || '#FF2ED1'}
                    onChange={(e) => updateField('accentColor', e.target.value)}
                    className="w-9 h-9 rounded-lg bg-slate-950 border border-white/20 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={currentSettings.accentColor || '#FF2ED1'}
                    onChange={(e) => updateField('accentColor', e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-[#FF2ED1] outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Special indicators & highlight effects.</p>
              </div>
            </div>
          </div>

          {/* Background Images & Dimming Controls */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <ImageIcon className="w-4 h-4 text-[#00D9FF]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Brand Logo & Card Background Controls
              </h3>
            </div>

            {/* Brand / Header Logo */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Card Header Brand Logo
                </label>
                <button
                  type="button"
                  onClick={() => setActiveMediaPickerTarget('logo')}
                  className="px-2.5 py-1 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  Select Image
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or select from Media Library"
                  value={currentSettings.brandLogoImage || ''}
                  onChange={(e) => updateField('brandLogoImage', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-[#00D9FF] outline-none"
                />
                {currentSettings.brandLogoImage && (
                  <button
                    type="button"
                    onClick={() => updateField('brandLogoImage', '')}
                    className="px-3 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold shrink-0 cursor-pointer"
                    title="Remove Brand Logo Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                Custom logo displayed in top-left header badge on front card. Falls back to Issuer Brand Name if not set.
              </p>
            </div>

            {/* Front Background */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Front Side Background Image & Dimming
                </label>
                <button
                  type="button"
                  onClick={() => setActiveMediaPickerTarget('front')}
                  className="px-2.5 py-1 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  Select Image
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or select from Media Library"
                  value={currentSettings.frontBackgroundImage || ''}
                  onChange={(e) => updateField('frontBackgroundImage', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-[#00D9FF] outline-none"
                />
                {currentSettings.frontBackgroundImage && (
                  <button
                    type="button"
                    onClick={() => updateField('frontBackgroundImage', '')}
                    className="px-3 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold shrink-0"
                    title="Clear Background Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Front Overlay Black Dim Level:</span>
                  <strong className="text-[#00D9FF]">
                    {currentSettings.frontBackgroundDim ?? 25}%
                  </strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentSettings.frontBackgroundDim ?? 25}
                  onChange={(e) => updateField('frontBackgroundDim', Number(e.target.value))}
                  className="w-full accent-[#00D9FF] cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 font-mono">
                  Controls dark overlay opacity over front card background image for readability.
                </p>
              </div>
            </div>

            {/* Back Background */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Back Side Background Image & Dimming
                </label>
                <button
                  type="button"
                  onClick={() => setActiveMediaPickerTarget('back')}
                  className="px-2.5 py-1 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  Select Image
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or select from Media Library"
                  value={currentSettings.backBackgroundImage || ''}
                  onChange={(e) => updateField('backBackgroundImage', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-[#00D9FF] outline-none"
                />
                {currentSettings.backBackgroundImage && (
                  <button
                    type="button"
                    onClick={() => updateField('backBackgroundImage', '')}
                    className="px-3 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold shrink-0"
                    title="Clear Background Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Back Overlay Black Dim Level:</span>
                  <strong className="text-[#00D9FF]">
                    {currentSettings.backBackgroundDim ?? 40}%
                  </strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentSettings.backBackgroundDim ?? 40}
                  onChange={(e) => updateField('backBackgroundDim', Number(e.target.value))}
                  className="w-full accent-[#00D9FF] cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 font-mono">
                  Controls dark overlay opacity over back card background image.
                </p>
              </div>
            </div>
          </div>

          {/* Verification & Text Elements */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Sliders className="w-4 h-4 text-[#00D9FF]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                3. Verification & Notice Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Issuer Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Issuer Brand Name
                </label>
                <input
                  type="text"
                  value={currentSettings.issuerName || 'GKN'}
                  onChange={(e) => updateField('issuerName', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-[#00D9FF] outline-none"
                />
                <p className="text-[10px] text-slate-500 font-mono">
                  Displays on top badge & security verification footer.
                </p>
              </div>

              {/* Elements Toggles */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Back Verification Codes
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentSettings.showQrCode ?? true}
                      onChange={(e) => updateField('showQrCode', e.target.checked)}
                      className="rounded bg-slate-950 border-white/20 text-[#00D9FF] focus:ring-0 w-4 h-4"
                    />
                    <QrCode className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>Show QR Code</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentSettings.showBarcode ?? true}
                      onChange={(e) => updateField('showBarcode', e.target.checked)}
                      className="rounded bg-slate-950 border-white/20 text-[#00D9FF] focus:ring-0 w-4 h-4"
                    />
                    <Barcode className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>Show Barcode</span>
                  </label>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Safe deterministic identity elements derived from customer code.
                </p>
              </div>
            </div>

            {/* Back Notice Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Back Side Verification Statement
              </label>
              <textarea
                rows={3}
                value={currentSettings.backNotice || ''}
                onChange={(e) => updateField('backNotice', e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-sans focus:border-[#00D9FF] outline-none"
              />
              <p className="text-[10px] text-slate-500 font-mono">
                Standard identity verification statement printed on back side of member card.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Picker Modal */}
      {activeMediaPickerTarget && (
        <MediaLibraryPickerModal
          isOpen={Boolean(activeMediaPickerTarget)}
          onClose={() => setActiveMediaPickerTarget(null)}
          onSelect={(media) => {
            if (activeMediaPickerTarget === 'front') {
              updateField('frontBackgroundImage', media.url);
            } else if (activeMediaPickerTarget === 'back') {
              updateField('backBackgroundImage', media.url);
            } else if (activeMediaPickerTarget === 'logo') {
              updateField('brandLogoImage', media.url);
            }
            setActiveMediaPickerTarget(null);
          }}
        />
      )}
    </div>
  );
};
