import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { StoreAccent } from './StoreStatusBadge';

export interface SortOption {
  id: string;
  label: string;
}

export interface SortButtonProps {
  selectedSort: string;
  onSelectSort: (sortId: string) => void;
  options?: SortOption[];
  accent?: StoreAccent;
}

export const SortButton: React.FC<SortButtonProps> = ({
  selectedSort,
  onSelectSort,
  options = [
    { id: 'featured', label: 'Featured First' },
    { id: 'newest', label: 'Newest Releases' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'name-asc', label: 'Sequence Name (A-Z)' },
  ],
  accent = 'cyan',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = options.find((o) => o.id === selectedSort) || options[0];

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
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white/5 text-slate-300 border border-white/10 hover:border-white/20 hover:text-white transition-all cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        <span>Sort: {activeOption?.label || 'Featured'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#090D16] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-30 overflow-hidden py-1 backdrop-blur-xl">
          <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase border-b border-white/5">
            Sort Order
          </div>
          {options.map((opt) => {
            const isSelected = selectedSort === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelectSort(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#00D9FF]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
