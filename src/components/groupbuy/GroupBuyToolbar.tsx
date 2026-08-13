import React from 'react';
import { SearchInput } from '../store/SearchInput';

export interface GroupBuyToolbarCategory {
  id: string;
  label: string;
}

export interface GroupBuyToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: GroupBuyToolbarCategory[];
  className?: string;
}

export const GroupBuyToolbar: React.FC<GroupBuyToolbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  className = '',
}) => {
  return (
    <div
      className={`p-4 rounded-2xl bg-[#070B14]/80 border border-white/10 backdrop-blur-md shadow-lg ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Search Input Box (takes 2 columns on desktop) */}
        <div className="md:col-span-2">
          <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search"
            accent="cyan"
          />
        </div>

        {/* Category Dropdown (takes 1 column on desktop) */}
        <div className="relative md:col-span-1">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full h-11 px-4 py-2 bg-slate-900/90 border border-white/10 hover:border-[#00D9FF]/40 text-slate-200 text-sm font-medium rounded-xl focus:outline-none focus:border-[#00D9FF] transition-all cursor-pointer appearance-none pr-8"
          >
            <option value="all" className="bg-[#070B14] text-white">
              Category: All
            </option>
            {categories
              .filter((c) => c.id !== 'all')
              .map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="bg-[#070B14] text-white"
                >
                  Category: {cat.label}
                </option>
              ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
};
