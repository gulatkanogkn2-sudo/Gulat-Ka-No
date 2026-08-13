import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProtocolCard } from '../../components/research/ProtocolCard';
import { SearchBar } from '../../components/research/SearchBar';
import { ResearchSubNav } from '../../components/research/ResearchSubNav';
import { ResearchCardSkeleton } from '../../components/research/LoadingSkeleton';
import { ResearchService, ProtocolRecord } from '../../services/researchService';
import { researchLibraryManagerService } from '../../services/researchLibraryManagerService';
import { FlaskConical, BookOpenCheck, ShieldAlert } from 'lucide-react';

export const ProtocolLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [protocols, setProtocols] = useState<ProtocolRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    try {
      const adminProtocols = researchLibraryManagerService
        .getProtocols()
        .filter((p) => p.visibility === 'PUBLIC');

      let mapped: ProtocolRecord[] = [];

      if (adminProtocols.length > 0) {
        mapped = adminProtocols.map((p) => ({
          id: p.id,
          title: p.title,
          category: (p.category as any) || 'Reconstitution',
          shortDescription: p.description,
          fullContent: p.procedure,
          estimatedTime: '15 Mins',
          difficulty: 'Intermediate',
          keyTakeaways: p.safetyNotes
            ? [p.safetyNotes, p.storageInstructions].filter(Boolean)
            : ['Follow aseptic technique', 'Store at designated temperatures'],
          pdfUrl: p.pdfUrl,
          updatedAt: p.updatedAt,
        }));
      }

      if (mapped.length > 0) {
        let filtered = mapped;
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
              item.title.toLowerCase().includes(q) ||
              item.shortDescription.toLowerCase().includes(q) ||
              item.fullContent.toLowerCase().includes(q)
          );
        }

        if (isMounted) {
          setProtocols(filtered);
          setIsLoading(false);
        }
      } else {
        ResearchService.getProtocolRecords(searchTerm, selectedCategory)
          .then((records) => {
            if (isMounted) {
              setProtocols(records);
              setIsLoading(false);
            }
          })
          .catch(() => {
            if (isMounted) setIsLoading(false);
          });
      }
    } catch {
      ResearchService.getProtocolRecords(searchTerm, selectedCategory)
        .then((records) => {
          if (isMounted) {
            setProtocols(records);
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

  const categories = ['all', 'reconstitution', 'storage & handling', 'assay standards', 'stability & half-life'];

  return (
    <PageContainer
      title="Protocol Library"
      description="Standardized research storage protocols, solubility methodologies, and laboratory assay reference guides."
      actions={
        <Badge variant="magenta" glow>
          RESEARCH METHODOLOGIES
        </Badge>
      }
    >
      <ResearchSubNav />
      {/* Banner Card */}
      <Card variant="glass" className="border-[#FF2ED1]/30 mb-8 p-6 bg-gradient-to-r from-[#FF2ED1]/10 via-transparent to-transparent">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#FF2ED1]" />
              Laboratory Protocol & Handling Repository
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Standardized laboratory methodologies for aseptic lyophilized peptide handling, sterile solubilization, and assay procedures.
            </p>
          </div>
          <Badge variant="magenta" className="px-3 py-1 font-mono text-xs flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> PROTECTED REPOSITORY
          </Badge>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search research protocols (e.g. sterile, storage, pH)..."
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          activeColor="magenta"
        />
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <ResearchCardSkeleton key={i} />
          ))}
        </div>
      ) : protocols.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {protocols.map((protocol) => (
            <ProtocolCard key={protocol.id} protocol={protocol} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card variant="glass" className="border-white/10 text-center py-16 px-6">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#FF2ED1]/10 border border-[#FF2ED1]/30 flex items-center justify-center mb-4 text-[#FF2ED1]">
              <BookOpenCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No protocols found matching search</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Try adjusting your protocol search query or resetting category filters to view all laboratory standard operating procedures.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#FF2ED1]/20 border border-[#FF2ED1] text-[#FF2ED1] hover:bg-[#FF2ED1]/30 text-xs font-bold transition-all cursor-pointer"
            >
              RESET SEARCH FILTERS
            </button>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};
