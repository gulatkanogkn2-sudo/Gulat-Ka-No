import React, { useState, useRef, useEffect } from 'react';
import { Filter, Check, ChevronDown } from 'lucide-react';
import { StoreAccent } from './StoreStatusBadge';

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterButtonProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categories?: FilterOption[];
  accent?: StoreAccent;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  selectedCategory,
  onSelectCategory,
  categories = [
    { id: 'all', label: 'All Items' },
    { id: 'active', label: 'Active Batches' },
    { id: 'reference', label: 'Reference Standards' },
    { id: 'high-purity', label: 'Purity >99%' },
  ],
  accent = 'cyan',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = categories.find((c) => c.id === selectedCategory) || categories[0];

  const activeStyles: Record<StoreAccent, string> = {
    cyan: 'bg-[#00D9FF]/15 text-[#00D9FF] border-[#00D9FF]/40',
    purple: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/40',
    magenta: 'bg-[#FF2ED1]/15 text-[#FF2ED1] border-[#FF2ED1]/40',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
          selectedCategory !== 'all'
            ? activeStyles[accent]
            : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Filter className="w-3.5 h-3.5" />
        <span>Filter: {activeOption?.label || 'All'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#090D16] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-30 overflow-hidden py-1 backdrop-blur-xl">
          <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase border-b border-white/5">
            Filter Catalog
          </div>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#00D9FF]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
