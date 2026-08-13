import React from 'react';
import { BookOpen, Eye, EyeOff, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { ResearchHubSettings } from '../../../types/websiteManager';
import { MediaInput } from './MediaAssetPickerModal';

interface ResearchHubEditorProps {
  researchHub: ResearchHubSettings;
  onChange: (updated: Partial<ResearchHubSettings>) => void;
}

export const ResearchHubEditor: React.FC<ResearchHubEditorProps> = ({
  researchHub,
  onChange,
}) => {
  const handleAddFeature = () => {
    const next = [...researchHub.featuresList, 'New Research Hub Protocol Feature'];
    onChange({ featuresList: next });
  };

  const handleUpdateFeature = (index: number, text: string) => {
    const next = [...researchHub.featuresList];
    next[index] = text;
    onChange({ featuresList: next });
  };

  const handleRemoveFeature = (index: number) => {
    const next = researchHub.featuresList.filter((_, i) => i !== index);
    onChange({ featuresList: next });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
            Knowledge Base Section
          </span>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" /> Research Hub Homepage Section
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure the homepage spotlight card highlighting COA verification libraries, peptide calculators, and protocol documentation.
          </p>
        </div>

        {/* Visibility Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            {researchHub.isVisible ? (
              <Eye className="w-4 h-4 text-emerald-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-rose-400" />
            )}
            Section Visible
          </span>
          <button
            type="button"
            onClick={() => onChange({ isVisible: !researchHub.isVisible })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              researchHub.isVisible ? 'bg-cyan-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                researchHub.isVisible ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Content Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" /> Content & Media Asset
          </h3>

          <div className="space-y-3">
            <MediaInput
              label="Research Hub Spotlight Image"
              value={researchHub.image}
              onChange={(url) => onChange({ image: url })}
            />

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Section Heading</label>
              <input
                type="text"
                value={researchHub.heading}
                onChange={(e) => onChange({ heading: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs font-bold text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Description Paragraph</label>
              <textarea
                value={researchHub.description}
                onChange={(e) => onChange({ description: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Button Label</label>
                <input
                  type="text"
                  value={researchHub.buttonText}
                  onChange={(e) => onChange({ buttonText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Destination URL</label>
                <input
                  type="text"
                  value={researchHub.destinationUrl}
                  onChange={(e) => onChange({ destinationUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Manager */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Feature Highlight Points
            </h3>
            <button
              onClick={handleAddFeature}
              className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-semibold border border-cyan-800 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Point
            </button>
          </div>

          <div className="space-y-2">
            {researchHub.featuresList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-bold text-[10px] flex items-center justify-center border border-cyan-800 flex-shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                />
                <button
                  onClick={() => handleRemoveFeature(idx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
