import React from 'react';
import { Search, X } from 'lucide-react';
import { StoreAccent } from './StoreStatusBadge';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accent?: StoreAccent;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search products...',
  accent = 'cyan',
  className = '',
}) => {
  const focusBorder: Record<StoreAccent, string> = {
    cyan: 'focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.2)]',
    purple: 'focus:border-[#8B5CF6] focus:shadow-[0_0_15px_rgba(139,92,246,0.2)]',
    magenta: 'focus:border-[#FF2ED1] focus:shadow-[0_0_15px_rgba(255,46,209,0.2)]',
  };

  return (
    <div className={`relative w-full sm:w-72 md:w-80 ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search catalog"
        className={`w-full pl-10 pr-9 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none transition-all ${focusBorder[accent]}`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
