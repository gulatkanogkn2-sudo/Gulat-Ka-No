import React, { useState } from 'react';
import { ShieldCheck, Globe, Smartphone, Lock, Edit3, Eye, Sparkles, Save, CheckCircle2 } from 'lucide-react';
import { BrandingSettings } from '../../../types/websiteManager';
import { MediaInput } from './MediaAssetPickerModal';
import { WebsiteManagerService } from '../../../services/websiteManagerService';

interface BrandingEditorProps {
  branding: BrandingSettings;
  onChange: (updated: Partial<BrandingSettings>) => void;
}

export const BrandingEditor: React.FC<BrandingEditorProps> = ({ branding, onChange }) => {
  const [savedToast, setSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await WebsiteManagerService.updateBranding(branding);
      await WebsiteManagerService.publishConfig();
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (e) {
      console.error('Failed to save branding:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Section Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Branding & Identity
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" /> Site Logos & Browser Metadata
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage global brand names, slogans, website logos, admin panel logos, favicon, and browser page titles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
            <div className="text-slate-400 text-[11px] font-mono">Brand Preview:</div>
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {branding.brandName || 'GKN V2'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-extrabold rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(0,217,255,0.3)] flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Text Settings Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-cyan-400" /> Identity Text & Slogan
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Name</label>
              <input
                type="text"
                value={branding.brandName}
                onChange={(e) => onChange({ brandName: e.target.value })}
                placeholder="e.g. GKN V2"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">Example: GKN V2 • Short name used in navigation headers</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Tagline / Slogan</label>
              <input
                type="text"
                value={branding.brandSlogan}
                onChange={(e) => onChange({ brandSlogan: e.target.value })}
                placeholder="e.g. Gulat Ka No!!? Scientific Excellence"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">Example: Gulat Ka No!!? Premium Research Portal</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Browser Page Title</label>
              <input
                type="text"
                value={branding.browserTitle}
                onChange={(e) => onChange({ browserTitle: e.target.value })}
                placeholder="Title shown in browser tab..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">Example: GKN V2 — Premium Peptide Research & Ordering</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Browser Description (Meta)</label>
              <textarea
                value={branding.browserDescription}
                onChange={(e) => onChange({ browserDescription: e.target.value })}
                rows={3}
                placeholder="Default description for search engines and social cards..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">Example: High purity research peptides, COA analytics, and groupbuy catalog in the Philippines.</span>
            </div>
          </div>
        </div>

        {/* Logos & Assets Settings Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" /> Logo Assets (Media Library / Device)
          </h3>

          <div className="space-y-4">
            <MediaInput
              label="Website Header Logo"
              value={branding.websiteLogo}
              onChange={(url) => onChange({ websiteLogo: url })}
              uploadButtonText="Upload Logo"
              description="Primary logo displayed on storefront header."
            />

            <MediaInput
              label="Admin Panel Logo"
              value={branding.adminLogo}
              onChange={(url) => onChange({ adminLogo: url })}
              uploadButtonText="Upload Logo"
              description="Logo displayed inside admin navigation sidebar."
            />

            <MediaInput
              label="Mobile View Logo"
              value={branding.mobileLogo}
              onChange={(url) => onChange({ mobileLogo: url })}
              uploadButtonText="Upload Logo"
              description="Compact logo asset for mobile screens."
            />

            <MediaInput
              label="Browser Favicon & Touch Icon"
              value={branding.favicon}
              onChange={(url) => onChange({ favicon: url })}
              uploadButtonText="Upload Favicon"
              accept="image/x-icon,image/svg+xml,image/png,image/*"
              description="Browser tab icon (.ico, .png, .svg) and mobile home screen touch icon."
            />
          </div>
        </div>
      </div>

      {/* Explicit Save Actions Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          {savedToast ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Logo and branding changes saved successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              Click Save Changes to persist uploaded logo files to permanent storage.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-extrabold rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(0,217,255,0.3)] flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>
    </div>
  );
};
