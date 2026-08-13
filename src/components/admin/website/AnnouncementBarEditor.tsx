import React from 'react';
import { Megaphone, Calendar, Eye, EyeOff, Palette, AlertCircle } from 'lucide-react';
import { AnnouncementBannerSettings } from '../../../types/websiteManager';

interface AnnouncementBarEditorProps {
  announcement: AnnouncementBannerSettings;
  onChange: (updated: Partial<AnnouncementBannerSettings>) => void;
}

export const AnnouncementBarEditor: React.FC<AnnouncementBarEditorProps> = ({
  announcement,
  onChange,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Top Header Bar
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-cyan-400" /> Announcement Banner & Alerts
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Broadcast operational alerts, batch arrivals, or free shipping threshold updates at the top of the site.
          </p>
        </div>

        {/* Visibility Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            {announcement.isVisible ? (
              <Eye className="w-4 h-4 text-emerald-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-rose-400" />
            )}
            Banner Active
          </span>
          <button
            type="button"
            onClick={() => onChange({ isVisible: !announcement.isVisible })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              announcement.isVisible ? 'bg-cyan-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                announcement.isVisible ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Instant Visual Live Banner Preview */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
        <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
          Live Storefront Header Banner Render Preview
        </span>
        <div
          className="p-3 rounded-xl text-center text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2"
          style={{
            backgroundColor: announcement.backgroundColor || '#0F172A',
            color: announcement.textColor || '#00D9FF',
          }}
        >
          <span>{announcement.message || 'Announcement message goes here...'}</span>
        </div>
      </div>

      {/* Content & Styling Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-cyan-400" /> Message & Dismissibility
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Announcement Message Text
              </label>
              <textarea
                value={announcement.message}
                onChange={(e) => onChange({ message: e.target.value })}
                rows={3}
                placeholder="Enter alert text, promo codes, or shipping updates..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">Example: BATCH #12 LAB ARRIVAL CONFIRMED — ALL COAs PUBLISHED IN RESEARCH LIBRARY</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold pt-1">
              <input
                type="checkbox"
                checked={announcement.isDismissible}
                onChange={(e) => onChange({ isDismissible: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
              />
              Allow Customers to Dismiss Banner (Close Button)
            </label>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" /> Colors & Active Dates
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={announcement.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-800 bg-slate-950 cursor-pointer"
                />
                <input
                  type="text"
                  value={announcement.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={announcement.textColor}
                  onChange={(e) => onChange({ textColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-800 bg-slate-950 cursor-pointer"
                />
                <input
                  type="text"
                  value={announcement.textColor}
                  onChange={(e) => onChange({ textColor: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Start Date</label>
              <input
                type="datetime-local"
                value={announcement.startDate ? announcement.startDate.slice(0, 16) : ''}
                onChange={(e) =>
                  onChange({ startDate: new Date(e.target.value).toISOString() })
                }
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs font-mono text-cyan-300"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">End Date</label>
              <input
                type="datetime-local"
                value={announcement.endDate ? announcement.endDate.slice(0, 16) : ''}
                onChange={(e) =>
                  onChange({ endDate: new Date(e.target.value).toISOString() })
                }
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs font-mono text-cyan-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
