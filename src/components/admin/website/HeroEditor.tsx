import React, { useState } from 'react';
import { Layout, Calendar, Eye, EyeOff, Sparkles, Link as LinkIcon, Save, CheckCircle2 } from 'lucide-react';
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
      console.error('Failed to save hero banner config:', e);
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
            Homepage Hero Banner
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Layout className="w-5 h-5 text-cyan-400" /> Hero Section & Scheduling
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize main title, subtitle, CTA buttons, background atmosphere, and publication schedule.
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
              Hero Visible
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Hero Copy & Images */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Headline & Imagery
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Main Heading</label>
              <textarea
                value={hero.mainHeading}
                onChange={(e) => onChange({ mainHeading: e.target.value })}
                rows={2}
                placeholder="HERO MAIN HEADING..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs font-bold text-white placeholder-slate-600 focus:outline-none uppercase tracking-wide"
              />
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">Example: GULAT KA NO!!? — HIGH PURITY PEPTIDE RESEARCH & BATCH PROCUREMENT</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Subtitle / Paragraph</label>
              <textarea
                value={hero.subtitle}
                onChange={(e) => onChange({ subtitle: e.target.value })}
                rows={3}
                placeholder="Hero descriptive subtitle text..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">Example: Direct lab-to-client groupbuy procurement, batch COA verifications, and nationwide delivery.</span>
            </div>

            <MediaInput
              label="Home Banner Image"
              value={hero.heroImage}
              onChange={(url) => onChange({ heroImage: url })}
              uploadButtonText="Upload Home Banner"
              description="Upload a landscape banner image directly from your device. The banner will be displayed in full without cropping on the Home Screen."
            />

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Atmosphere Background</label>
              <select
                value={hero.heroBackground}
                onChange={(e) => onChange({ heroBackground: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-cyan-300 focus:outline-none"
              >
                <option value="cyber-dark-grid">Cyber Dark Grid Glow (#050810)</option>
                <option value="laboratory-cleanroom">Laboratory Cleanroom Cyan (#0A192F)</option>
                <option value="neon-magenta-glow">Neon Magenta Accent Glow</option>
                <option value="deep-space-minimal">Deep Space Minimal Black</option>
              </select>
            </div>
          </div>
        </div>

        {/* CTA Buttons & Scheduling Card */}
        <div className="space-y-6">
          {/* CTA Buttons */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-cyan-400" /> Action Buttons (CTAs)
            </h3>

            {/* Button 1 */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  CTA Button #1 (Primary)
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={hero.ctaButton1.visible}
                    onChange={(e) =>
                      onChange({
                        ctaButton1: { ...hero.ctaButton1, visible: e.target.checked },
                      })
                    }
                    className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                  />
                  Show Button 1
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Button Label</label>
                  <input
                    type="text"
                    value={hero.ctaButton1.label}
                    onChange={(e) =>
                      onChange({
                        ctaButton1: { ...hero.ctaButton1, label: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5">Example: Shop GroupBuy Store</span>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Link URL</label>
                  <input
                    type="text"
                    value={hero.ctaButton1.link}
                    onChange={(e) =>
                      onChange({
                        ctaButton1: { ...hero.ctaButton1, link: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5">Example: /groupbuy</span>
                </div>
              </div>
            </div>

            {/* Button 2 */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  CTA Button #2 (Secondary)
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={hero.ctaButton2.visible}
                    onChange={(e) =>
                      onChange({
                        ctaButton2: { ...hero.ctaButton2, visible: e.target.checked },
                      })
                    }
                    className="rounded border-slate-700 bg-slate-950 text-purple-500 focus:ring-purple-500"
                  />
                  Show Button 2
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Button Label</label>
                  <input
                    type="text"
                    value={hero.ctaButton2.label}
                    onChange={(e) =>
                      onChange({
                        ctaButton2: { ...hero.ctaButton2, label: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Link URL</label>
                  <input
                    type="text"
                    value={hero.ctaButton2.link}
                    onChange={(e) =>
                      onChange({
                        ctaButton2: { ...hero.ctaButton2, link: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs font-mono text-purple-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Scheduling Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" /> Automated Hero Scheduling
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={hero.scheduling.enabled}
                  onChange={(e) =>
                    onChange({
                      scheduling: { ...hero.scheduling, enabled: e.target.checked },
                    })
                  }
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                />
                Enable Timer
              </label>
            </div>

            {hero.scheduling.enabled ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Display Start Date</label>
                  <input
                    type="datetime-local"
                    value={hero.scheduling.startDate ? hero.scheduling.startDate.slice(0, 16) : ''}
                    onChange={(e) =>
                      onChange({
                        scheduling: { ...hero.scheduling, startDate: new Date(e.target.value).toISOString() },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs font-mono text-cyan-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Display End Date</label>
                  <input
                    type="datetime-local"
                    value={hero.scheduling.endDate ? hero.scheduling.endDate.slice(0, 16) : ''}
                    onChange={(e) =>
                      onChange({
                        scheduling: { ...hero.scheduling, endDate: new Date(e.target.value).toISOString() },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs font-mono text-cyan-300"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Scheduling disabled. Hero section will display continuously while visible.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Explicit Save Actions Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          {savedToast ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Home banner settings saved successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              Click Save Changes to persist uploaded banner image to permanent storage.
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
