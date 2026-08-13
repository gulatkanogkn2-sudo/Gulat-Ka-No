import React from 'react';
import { SearchInput } from './SearchInput';
import { FilterButton, FilterOption } from './FilterButton';
import { SortButton, SortOption } from './SortButton';
import { StoreAccent } from './StoreStatusBadge';

export interface CategoryTab {
  id: string;
  label: string;
}

export interface StoreToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  categories?: CategoryTab[];
  filterOptions?: FilterOption[];
  sortOptions?: SortOption[];
  accent?: StoreAccent;
  searchPlaceholder?: string;
  className?: string;
}

export const StoreToolbar: React.FC<StoreToolbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  categories,
  filterOptions,
  sortOptions,
  accent = 'cyan',
  searchPlaceholder = 'Search catalog items...',
  className = '',
}) => {
  const activePillStyle: Record<StoreAccent, string> = {
    cyan: 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]',
    purple: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]',
    magenta: 'bg-[#FF2ED1]/20 text-[#FF2ED1] border-[#FF2ED1]/40 shadow-[0_0_10px_rgba(255,46,209,0.2)]',
  };

  return (
    <div className={`space-y-4 mb-8 ${className}`}>
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          accent={accent}
        />

        {/* Filter and Sort Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <FilterButton
            selectedCategory={selectedCategory}
            onSelectCategory={onCategoryChange}
            categories={filterOptions}
            accent={accent}
          />

          <SortButton
            selectedSort={selectedSort}
            onSelectSort={onSortChange}
            options={sortOptions}
            accent={accent}
          />
        </div>
      </div>

      {/* Category Pills (if provided) */}
      {categories && categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                  isActive
                    ? activePillStyle[accent]
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
