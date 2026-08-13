import React, { useState } from 'react';
import { Layout, Mail, Phone, MapPin, Share2, Plus, Trash2, Globe, Eye, EyeOff } from 'lucide-react';
import { FooterSettings, SocialLinkItem, FooterLinkColumn } from '../../../types/websiteManager';
import { MediaInput } from './MediaAssetPickerModal';

interface FooterEditorProps {
  footer: FooterSettings;
  onChange: (updated: Partial<FooterSettings>) => void;
}

export const FooterEditor: React.FC<FooterEditorProps> = ({ footer, onChange }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'socials' | 'columns'>('info');

  const handleSocialChange = (index: number, updated: Partial<SocialLinkItem>) => {
    const next = [...footer.socialLinks];
    next[index] = { ...next[index], ...updated };
    onChange({ socialLinks: next });
  };

  const handleAddSocial = () => {
    const newSocial: SocialLinkItem = {
      platform: 'telegram',
      label: 'New Community Link',
      url: 'https://t.me/gkn_research',
      isVisible: true,
    };
    onChange({ socialLinks: [...footer.socialLinks, newSocial] });
  };

  const handleRemoveSocial = (index: number) => {
    const next = footer.socialLinks.filter((_, i) => i !== index);
    onChange({ socialLinks: next });
  };

  const handleColumnTitleChange = (colIdx: number, title: string) => {
    const next = [...footer.linkColumns];
    next[colIdx].title = title;
    onChange({ linkColumns: next });
  };

  const handleAddLinkToColumn = (colIdx: number) => {
    const next = [...footer.linkColumns];
    next[colIdx].links.push({
      id: `fl-${Date.now()}`,
      label: 'New Link',
      url: '/about',
      isVisible: true,
    });
    onChange({ linkColumns: next });
  };

  const handleUpdateColumnLink = (colIdx: number, linkIdx: number, updatedLabel: string, updatedUrl: string) => {
    const next = [...footer.linkColumns];
    next[colIdx].links[linkIdx].label = updatedLabel;
    next[colIdx].links[linkIdx].url = updatedUrl;
    onChange({ linkColumns: next });
  };

  const handleRemoveColumnLink = (colIdx: number, linkIdx: number) => {
    const next = [...footer.linkColumns];
    next[colIdx].links = next[colIdx].links.filter((_, i) => i !== linkIdx);
    onChange({ linkColumns: next });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Storefront Footer
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Layout className="w-5 h-5 text-cyan-400" /> Footer, Contact & Social Links
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure global storefront footer logo, contact phone/email, address, social media links, and footer column links.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'info'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Contact & Copyright
          </button>
          <button
            onClick={() => setActiveTab('socials')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'socials'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Social Links ({footer.socialLinks.length})
          </button>
          <button
            onClick={() => setActiveTab('columns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'columns'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Link Columns ({footer.linkColumns.length})
          </button>
        </div>
      </div>

      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" /> Contact Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Support Email Address</label>
                <input
                  type="email"
                  value={footer.contactEmail}
                  onChange={(e) => onChange({ contactEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Support Telephone / Hotline</label>
                <input
                  type="text"
                  value={footer.contactPhone}
                  onChange={(e) => onChange({ contactPhone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Physical / Lab Facility Address</label>
                <textarea
                  value={footer.address}
                  onChange={(e) => onChange({ address: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Logo & Legal Notice
            </h3>

            <div className="space-y-3">
              <MediaInput
                label="Footer Logo Asset"
                value={footer.footerLogo}
                onChange={(url) => onChange({ footerLogo: url })}
              />

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Copyright Notice Text</label>
                <textarea
                  value={footer.copyrightText}
                  onChange={(e) => onChange({ copyrightText: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'socials' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" /> Social Media & Community Handles
            </h3>
            <button
              onClick={handleAddSocial}
              className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Social Channel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {footer.socialLinks.map((social, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <select
                    value={social.platform}
                    onChange={(e) =>
                      handleSocialChange(idx, { platform: e.target.value as any })
                    }
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300 font-bold capitalize"
                  >
                    <option value="telegram">Telegram</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="discord">Discord</option>
                    <option value="instagram">Instagram</option>
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSocialChange(idx, { isVisible: !social.isVisible })}
                      className={`p-1.5 rounded-lg border text-xs font-semibold ${
                        social.isVisible
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {social.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleRemoveSocial(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={social.label}
                  onChange={(e) => handleSocialChange(idx, { label: e.target.value })}
                  placeholder="Label e.g. Telegram Channel"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-white"
                />

                <input
                  type="text"
                  value={social.url}
                  onChange={(e) => handleSocialChange(idx, { url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'columns' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {footer.linkColumns.map((col, colIdx) => (
            <div
              key={col.id || colIdx}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3"
            >
              <div className="border-b border-slate-800 pb-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Column #{colIdx + 1} Title
                </label>
                <input
                  type="text"
                  value={col.title}
                  onChange={(e) => handleColumnTitleChange(colIdx, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs font-bold text-white"
                />
              </div>

              <div className="space-y-2">
                {col.links.map((link, linkIdx) => (
                  <div key={link.id || linkIdx} className="p-2 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          handleUpdateColumnLink(colIdx, linkIdx, e.target.value, link.url)
                        }
                        placeholder="Label"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-xs text-white"
                      />
                      <button
                        onClick={() => handleRemoveColumnLink(colIdx, linkIdx)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) =>
                        handleUpdateColumnLink(colIdx, linkIdx, link.label, e.target.value)
                      }
                      placeholder="/url-path"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[11px] font-mono text-cyan-300"
                    />
                  </div>
                ))}

                <button
                  onClick={() => handleAddLinkToColumn(colIdx)}
                  className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" /> Add Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
