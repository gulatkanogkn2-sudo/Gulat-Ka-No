import React, { useState } from 'react';
import { Search, Globe, Tag, Plus, Trash2, Shield, Code } from 'lucide-react';
import { SEOSettings } from '../../../types/websiteManager';
import { MediaInput } from './MediaAssetPickerModal';

interface SEOEditorProps {
  seo: SEOSettings;
  onChange: (updated: Partial<SEOSettings>) => void;
}

export const SEOEditor: React.FC<SEOEditorProps> = ({ seo, onChange }) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    if (seo.keywords.includes(newKeyword.trim())) return;
    onChange({ keywords: [...seo.keywords, newKeyword.trim()] });
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    onChange({ keywords: seo.keywords.filter((k) => k !== keyword) });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Search & Social Media
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" /> SEO Placeholders & Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure meta title templates, default descriptions, OpenGraph social sharing images, tracking IDs, and robots.txt rules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meta & Social Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" /> Meta Tags & OpenGraph Sharing
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Meta Title Template
              </label>
              <input
                type="text"
                value={seo.metaTitleTemplate}
                onChange={(e) => onChange({ metaTitleTemplate: e.target.value })}
                placeholder="%s | GKN"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Use <code className="text-cyan-400">%s</code> as placeholder for dynamic page titles.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Default Meta Description
              </label>
              <textarea
                value={seo.defaultMetaDescription}
                onChange={(e) => onChange({ defaultMetaDescription: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">Example: GKN — Private peptide store, verified COA documents, and GroupBuy ordering.</span>
            </div>

            <MediaInput
              label="OpenGraph Social Sharing Image (og:image)"
              value={seo.ogImage}
              onChange={(url) => onChange({ ogImage: url })}
              description="Image preview displayed when site link is shared on Telegram, Twitter, or Discord."
            />
          </div>
        </div>

        {/* Analytics & Keywords & Robots */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400" /> Global Keywords & Analytics
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Google Analytics Measurement ID
                </label>
                <input
                  type="text"
                  value={seo.googleAnalyticsId}
                  onChange={(e) => onChange({ googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs font-mono text-purple-300"
                />
              </div>

              {/* Keywords Tag Cloud Manager */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">SEO Target Keywords</label>
                <form onSubmit={handleAddKeyword} className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add keyword e.g. BPC-157"
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="submit"
                    disabled={!newKeyword.trim()}
                    className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Tag
                  </button>
                </form>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {seo.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-1.5"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" /> Robots.txt Crawling Directives
            </h3>

            <textarea
              value={seo.robotsTxtContent}
              onChange={(e) => onChange({ robotsTxtContent: e.target.value })}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

