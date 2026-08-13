import React from 'react';
import { Store, Eye, EyeOff, Layers, ExternalLink, Sparkles } from 'lucide-react';
import { StoreCardSetting } from '../../../types/websiteManager';
import { MediaInput } from './MediaAssetPickerModal';

interface StoreCardsEditorProps {
  storeCards: StoreCardSetting[];
  onChange: (updatedCards: StoreCardSetting[]) => void;
}

export const StoreCardsEditor: React.FC<StoreCardsEditorProps> = ({ storeCards, onChange }) => {
  const handleCardUpdate = (index: number, updated: Partial<StoreCardSetting>) => {
    const next = [...storeCards];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Homepage Navigation Cards
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Store className="w-5 h-5 text-cyan-400" /> Store Cards (GroupBuy, OnHand, MOQ)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the prominent storefront cards that direct traffic to GroupBuy batches, OnHand dispatch, and MOQ bulk tiers.
          </p>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {storeCards.map((card, idx) => (
          <div
            key={card.id || card.storeKey}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
          >
            {/* Card Header & Visibility Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span
                  className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${card.accentColor}15`,
                    color: card.accentColor,
                    borderColor: `${card.accentColor}40`,
                  }}
                >
                  {card.storeKey.toUpperCase()} CARD
                </span>

                <button
                  type="button"
                  onClick={() => handleCardUpdate(idx, { isVisible: !card.isVisible })}
                  className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                    card.isVisible
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  {card.isVisible ? (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Hidden
                    </>
                  )}
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <MediaInput
                  label="Card Cover Image"
                  value={card.image}
                  onChange={(url) => handleCardUpdate(idx, { image: url })}
                />

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Card Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleCardUpdate(idx, { title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={card.subtitle}
                    onChange={(e) => handleCardUpdate(idx, { subtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Description Paragraph</label>
                  <textarea
                    value={card.description}
                    onChange={(e) => handleCardUpdate(idx, { description: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Accent Hex Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={card.accentColor}
                        onChange={(e) => handleCardUpdate(idx, { accentColor: e.target.value })}
                        className="w-7 h-7 bg-slate-950 rounded border border-slate-800 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={card.accentColor}
                        onChange={(e) => handleCardUpdate(idx, { accentColor: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2 py-1 text-xs font-mono text-cyan-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Button Label</label>
                    <input
                      type="text"
                      value={card.buttonText}
                      onChange={(e) => handleCardUpdate(idx, { buttonText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Destination URL Path</label>
                  <input
                    type="text"
                    value={card.destination}
                    onChange={(e) => handleCardUpdate(idx, { destination: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300"
                  />
                </div>
              </div>
            </div>

            {/* Live Visual Card Preview */}
            <div
              className="p-3 bg-slate-950 rounded-xl border space-y-2 mt-2"
              style={{ borderColor: `${card.accentColor}40` }}
            >
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Card Mini Preview
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{card.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{card.description}</p>
                <div
                  className="mt-2 text-[11px] font-bold text-center py-1 rounded transition-all"
                  style={{ backgroundColor: card.accentColor, color: '#050810' }}
                >
                  {card.buttonText} →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
