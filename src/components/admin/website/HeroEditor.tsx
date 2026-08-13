import React, { useState } from 'react';
import { Layout, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';
import { HeroSettings } from '../../../types/websiteManager';
import { MediaInput } from './MediaAssetPickerModal';
import { WebsiteManagerService } from '../../../services/websiteManagerService';

interface HeroEditorProps {
  hero: HeroSettings;
  onChange: (updated: Partial<HeroSettings>) => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ hero, onChange }) => {
  const [savedToast, setSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await WebsiteManagerService.updateHero(hero);
      await WebsiteManagerService.publishConfig();
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (e) {
      console.error('Failed to save homepage banner config:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Storefront Artwork
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Layout className="w-5 h-5 text-cyan-400" /> Homepage Banner
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload and update the primary landscape promotional banner displayed at the top of the customer homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Visibility Toggle Switch */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              {hero.isVisible ? (
                <Eye className="w-4 h-4 text-emerald-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-rose-400" />
              )}
              Banner Visible
            </span>
            <button
              type="button"
              onClick={() => onChange({ isVisible: !hero.isVisible })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                hero.isVisible ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  hero.isVisible ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
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

      {/* Main Banner Upload and Preview Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
          <Layout className="w-4 h-4 text-cyan-400" /> Promotional Banner Asset
        </h3>

        <div className="space-y-4">
          <MediaInput
            label="Homepage Landscape Banner"
            value={hero.heroImage}
            onChange={(url) => onChange({ heroImage: url })}
            uploadButtonText="Upload New Banner Image"
            description="Upload a landscape banner image directly from your device. The banner will be displayed in full aspect ratio without distortion or cropping on the customer Home screen."
          />
        </div>
      </div>

      {/* Save Action Status Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          {savedToast ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Homepage banner updated and saved successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              Click Save Changes to persist the updated banner image to live storefront storage.
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
