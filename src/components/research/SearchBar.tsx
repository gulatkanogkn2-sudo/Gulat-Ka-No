import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  activeColor?: 'cyan' | 'purple' | 'magenta' | 'blue';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search knowledge repository...',
  categories,
  selectedCategory,
  onSelectCategory,
  activeColor = 'cyan',
}) => {
  const getActiveBorder = () => {
    switch (activeColor) {
      case 'purple':
        return 'focus:border-[#8B5CF6]';
      case 'magenta':
        return 'focus:border-[#FF2ED1]';
      case 'blue':
        return 'focus:border-[#3B82F6]';
      case 'cyan':
      default:
        return 'focus:border-[#00D9FF]';
    }
  };

  const getButtonActiveStyle = (cat: string) => {
    if (selectedCategory === cat) {
      switch (activeColor) {
        case 'purple':
          return 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]';
        case 'magenta':
          return 'bg-[#FF2ED1]/20 text-[#FF2ED1] border-[#FF2ED1]/40 shadow-[0_0_10px_rgba(255,46,209,0.2)]';
        case 'blue':
          return 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
        case 'cyan':
        default:
          return 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]';
      }
    }
    return 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10';
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {/* Search Input Field */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none ${getActiveBorder()} transition-all shadow-inner`}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      {categories && categories.length > 0 && onSelectCategory && (
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap border ${getButtonActiveStyle(cat)}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
