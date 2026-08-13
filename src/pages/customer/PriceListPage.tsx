import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { PriceListTable } from '../../components/research/PriceListTable';
import { SearchBar } from '../../components/research/SearchBar';
import { ResearchSubNav } from '../../components/research/ResearchSubNav';
import { ResearchCardSkeleton } from '../../components/research/LoadingSkeleton';
import { ResearchService, PriceListItem } from '../../services/researchService';
import { Tags, DollarSign } from 'lucide-react';

export const PriceListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState<PriceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    ResearchService.getPriceList(searchTerm, selectedCategory)
      .then((records) => {
        if (isMounted) {
          setItems(records);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load price catalog:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedCategory]);

  const categories = ['all', 'GroupBuy', 'OnHand', 'MOQ Bulk'];

  return (
    <PageContainer
      title="Products Price List"
      description="Comprehensive pricing matrix, batch volume discount tiers, and reference standard cost schedules."
      actions={
        <Badge variant="cyan" glow>
          READ-ONLY CATALOG SCHEDULE
        </Badge>
      }
    >
      <ResearchSubNav />
      {/* Banner Card */}
      <Card variant="glass" className="border-[#3B82F6]/30 mb-8 p-6 bg-gradient-to-r from-[#3B82F6]/10 via-transparent to-transparent">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Tags className="w-5 h-5 text-[#3B82F6]" />
              Standardized Research Catalog Pricing Matrix
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Transparent batch pricing across GroupBuy allocations, OnHand immediate dispatch items, and MOQ institutional volume reservations. Strictly read-only reference list.
            </p>
          </div>
          <Badge variant="cyan" className="px-3 py-1 font-mono text-xs font-semibold">CURRENCY: USD ($) & PHP (₱)</Badge>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search price catalog by product name or variant..."
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          activeColor="blue"
        />
      </div>

      {/* Loading or Table Display */}
      {isLoading ? (
        <div className="space-y-4 mb-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <ResearchCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="mb-12">
          <PriceListTable items={items} />
        </div>
      ) : (
        /* Empty State */
        <Card variant="glass" className="border-white/10 text-center py-16 px-6">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center mb-4 text-[#3B82F6]">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No catalog items match your search</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Try adjusting your query or resetting channel filters to view all cataloged pricing schedules.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#3B82F6]/20 border border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/30 text-xs font-bold transition-all cursor-pointer"
            >
              RESET PRICING FILTERS
            </button>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};
