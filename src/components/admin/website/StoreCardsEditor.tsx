import React, { useState } from 'react';
import { Store, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';
import { StoreCardSetting } from '../../../types/websiteManager';
import { MediaInput } from './MediaAssetPickerModal';
import { WebsiteManagerService } from '../../../services/websiteManagerService';

interface StoreCardsEditorProps {
  storeCards: StoreCardSetting[];
  onChange: (updatedCards: StoreCardSetting[]) => void;
}

export const StoreCardsEditor: React.FC<StoreCardsEditorProps> = ({ storeCards, onChange }) => {
  const [savedToast, setSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCardUpdate = (index: number, updated: Partial<StoreCardSetting>) => {
    const next = [...storeCards];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await WebsiteManagerService.updateStoreCards(storeCards);
      await WebsiteManagerService.publishConfig();
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (e) {
      console.error('Failed to save store cards config:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Storefront Artwork
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Store className="w-5 h-5 text-cyan-400" /> Store Card Artwork (GroupBuy, OnHand, MOQ)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage cover imagery for the three customer store selection cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {storeCards.map((card, idx) => {
          const storeName =
            card.storeKey === 'groupbuy'
              ? 'GroupBuy Store'
              : card.storeKey === 'onhand'
              ? 'OnHand Store'
              : 'MOQ Store';

          const storeTagline =
            card.storeKey === 'groupbuy'
              ? 'Pre-Order & Community Allocation'
              : card.storeKey === 'onhand'
              ? 'In Stock & Ready to Dispatch'
              : 'Volume & Bulk Ordering';

          const defaultAccent =
            card.storeKey === 'groupbuy'
              ? '#00D9FF'
              : card.storeKey === 'onhand'
              ? '#8B5CF6'
              : '#FF2ED1';

          return (
            <div
              key={card.id || card.storeKey}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
            >
              {/* Card Header & Visibility Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span
                    className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: `${defaultAccent}15`,
                      color: defaultAccent,
                      borderColor: `${defaultAccent}40`,
                    }}
                  >
                    {card.storeKey.toUpperCase()} STORE
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

                {/* Form Fields: Direct Image Upload Only */}
                <div className="space-y-3">
                  <MediaInput
                    label={`${storeName} Cover Background`}
                    value={card.image}
                    onChange={(url) => handleCardUpdate(idx, { image: url })}
                    uploadButtonText={`Upload ${card.storeKey.toUpperCase()} Image`}
                    description={`Upload background artwork for the ${storeName} selection card.`}
                  />
                </div>
              </div>

              {/* Locked System Preview */}
              <div
                className="p-3.5 bg-slate-950 rounded-xl border space-y-2 mt-2"
                style={{ borderColor: `${defaultAccent}40` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                    {storeName}
                  </span>
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase"
                    style={{ color: defaultAccent, backgroundColor: `${defaultAccent}20` }}
                  >
                    LOCKED GKN THEME
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-300 font-mono">{storeTagline}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

