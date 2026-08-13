import React from 'react';
import { Layers, Plus, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { HomepageCardSetting } from '../../../types/websiteManager';
import { MediaInput } from './MediaAssetPickerModal';

interface HomepageCardsEditorProps {
  homepageCards: HomepageCardSetting[];
  onChange: (updatedCards: HomepageCardSetting[]) => void;
}

export const HomepageCardsEditor: React.FC<HomepageCardsEditorProps> = ({
  homepageCards,
  onChange,
}) => {
  const handleCardUpdate = (index: number, updated: Partial<HomepageCardSetting>) => {
    const next = [...homepageCards];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const handleAddCard = () => {
    const newCard: HomepageCardSetting = {
      id: `hpc-${Date.now()}`,
      title: 'New Spotlight Feature Card',
      subtitle: 'Technical Laboratory Highlight',
      description: 'Enter detailed description of this feature or tool highlight...',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      badgeText: 'SPOTLIGHT',
      badgeColor: '#00D9FF',
      ctaText: 'Explore Feature',
      ctaUrl: '/research',
      isVisible: true,
      sortOrder: homepageCards.length + 1,
    };
    onChange([...homepageCards, newCard]);
  };

  const handleRemoveCard = (index: number) => {
    const next = homepageCards.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Feature Spotlights
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> Homepage Feature & Tool Cards
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add custom feature cards highlighting COA libraries, calculators, or laboratory protocols.
          </p>
        </div>

        <button
          onClick={handleAddCard}
          className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Feature Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homepageCards.map((card, idx) => (
          <div
            key={card.id || idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-mono font-bold text-cyan-400">Card #{idx + 1}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCardUpdate(idx, { isVisible: !card.isVisible })}
                    className={`p-1.5 rounded-lg border text-xs font-semibold ${
                      card.isVisible
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    {card.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRemoveCard(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <MediaInput
                label="Card Image Asset"
                value={card.image}
                onChange={(url) => handleCardUpdate(idx, { image: url })}
              />

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleCardUpdate(idx, { title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={card.subtitle}
                  onChange={(e) => handleCardUpdate(idx, { subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-slate-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Description</label>
                <textarea
                  value={card.description}
                  onChange={(e) => handleCardUpdate(idx, { description: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={card.badgeText}
                    onChange={(e) => handleCardUpdate(idx, { badgeText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-purple-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={card.ctaText}
                    onChange={(e) => handleCardUpdate(idx, { ctaText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">CTA Target URL</label>
                <input
                  type="text"
                  value={card.ctaUrl}
                  onChange={(e) => handleCardUpdate(idx, { ctaUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
