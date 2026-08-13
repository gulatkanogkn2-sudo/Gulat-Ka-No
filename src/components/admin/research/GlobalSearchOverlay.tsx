import React from 'react';
import { Search, FileText, BookOpen, Tag, ArrowRight, X } from 'lucide-react';
import { GlobalSearchMatch } from '../../../types/researchLibraryManager';

interface GlobalSearchOverlayProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  matches: GlobalSearchMatch[];
  onSelectMatch: (match: GlobalSearchMatch) => void;
}

export const GlobalSearchOverlay: React.FC<GlobalSearchOverlayProps> = ({
  searchQuery,
  onSearchChange,
  matches,
  onSelectMatch,
}) => {
  if (!searchQuery.trim()) return null;

  const getTypeIcon = (type: GlobalSearchMatch['type']) => {
    switch (type) {
      case 'COA':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'PROTOCOL':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'PRICELIST':
        return <Tag className="w-4 h-4 text-emerald-400" />;
      default:
        return <Search className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-96 overflow-y-auto animate-in fade-in duration-150">
      <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Instant Research Library Matches ({matches.length})</span>
        <button
          onClick={() => onSearchChange('')}
          className="text-slate-500 hover:text-slate-300 flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500 font-mono">
          No records found matching "{searchQuery}". Try searching lot numbers, product names, or keywords.
        </div>
      ) : (
        <div className="divide-y divide-slate-800/50">
          {matches.map((match) => (
            <button
              key={`${match.type}-${match.id}`}
              onClick={() => onSelectMatch(match)}
              className="w-full text-left p-3 hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-start gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex-shrink-0 mt-0.5">
                  {getTypeIcon(match.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {match.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                      {match.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{match.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-1">
                  {match.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
