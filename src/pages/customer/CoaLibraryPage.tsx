import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { COACard } from '../../components/research/COACard';
import { SearchBar } from '../../components/research/SearchBar';
import { ResearchSubNav } from '../../components/research/ResearchSubNav';
import { ResearchCardSkeleton } from '../../components/research/LoadingSkeleton';
import { ResearchService, COARecord } from '../../services/researchService';
import { researchLibraryManagerService } from '../../services/researchLibraryManagerService';
import { FileCheck, FileX, ShieldCheck } from 'lucide-react';

export const CoaLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [coas, setCoas] = useState<COARecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    try {
      // 1. Fetch public admin-managed COA records
      const adminCoas = researchLibraryManagerService
        .getCOAs()
        .filter((c) => c.visibility === 'PUBLIC' && c.status === 'VERIFIED');

      let mappedCoas: COARecord[] = [];

      if (adminCoas.length > 0) {
        mappedCoas = adminCoas.map((c) => ({
          id: c.id,
          lotNumber: c.lotNumber,
          productName: c.product,
          category: c.tags?.[0] || 'Metabolic Peptides',
          purity: c.purity,
          testingLab: c.laboratory,
          testDate: c.testDate,
          testType: 'HPLC & MS',
          status: 'VERIFIED',
          reportUrl: c.chromatogramImageUrl || c.pdfUrl,
          summary: `Verified ${c.purity}% purity by ${c.laboratory}. Lot #${c.lotNumber} (${c.variant}).`,
        }));
      }

      // Filter locally based on search and category
      if (mappedCoas.length > 0) {
        let filtered = mappedCoas;
        if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
          const lowerCat = selectedCategory.toLowerCase();
          filtered = filtered.filter((item) =>
            item.category.toLowerCase().includes(lowerCat)
          );
        }

        if (searchTerm && searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase().trim();
          filtered = filtered.filter(
            (item) =>
              item.lotNumber.toLowerCase().includes(q) ||
              item.productName.toLowerCase().includes(q) ||
              item.testingLab.toLowerCase().includes(q)
          );
        }

        if (isMounted) {
          setCoas(filtered);
          setIsLoading(false);
        }
      } else {
        // Fallback to ResearchService
        ResearchService.getCoaRecords(searchTerm, selectedCategory)
          .then((records) => {
            if (isMounted) {
              setCoas(records);
              setIsLoading(false);
            }
          })
          .catch(() => {
            if (isMounted) setIsLoading(false);
          });
      }
    } catch {
      ResearchService.getCoaRecords(searchTerm, selectedCategory)
        .then((records) => {
          if (isMounted) {
            setCoas(records);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedCategory]);

  const categories = ['all', 'metabolic peptides', 'tissue repair', 'gh secretagogues', 'certificates'];

  return (
    <PageContainer
      title="COA Library"
      description="Access Certificates of Analysis records for research batch lots."
      actions={
        <Badge variant="purple" glow>
          BATCH VERIFICATION
        </Badge>
      }
    >
      <ResearchSubNav />
      {/* Banner Card */}
      <Card variant="glass" className="border-[#8B5CF6]/30 mb-8 p-6 bg-gradient-to-r from-[#8B5CF6]/10 via-transparent to-transparent">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#8B5CF6]" />
              Analytical Testing Repository
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Every GKN research batch lot undergoes documented quality checks. Click any card to open the fullscreen protected report viewer.
            </p>
          </div>
          <Badge variant="purple" className="px-3 py-1 font-mono text-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> PROTECTED REPOSITORY
          </Badge>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by lot # (e.g. GKN-TIRZ-2026), product name, or lab..."
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          activeColor="purple"
        />
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResearchCardSkeleton key={i} />
          ))}
        </div>
      ) : coas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {coas.map((coa) => (
            <COACard key={coa.id} coa={coa} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card variant="glass" className="border-white/10 text-center py-16 px-6">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center mb-4 text-[#8B5CF6]">
              <FileX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No COA records match your search</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Try adjusting your lot number query or resetting category filters to view all indexed laboratory certificates.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/30 text-xs font-bold transition-all cursor-pointer"
            >
              RESET ALL SEARCH FILTERS
            </button>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};
