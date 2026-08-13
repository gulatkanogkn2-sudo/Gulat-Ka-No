import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ResearchCard } from '../../components/research/ResearchCard';
import { ResearchSubNav } from '../../components/research/ResearchSubNav';
import {
  Calculator,
  FileText,
  FlaskConical,
  Tags,
  Database,
  RefreshCw,
  Star,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileCheck,
  Shield,
  Activity,
  Zap,
  ExternalLink,
  X,
  Clock,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';
import { researchLibraryManagerService } from '../../services/researchLibraryManagerService';
import {
  ResearchHubHomepageAdmin,
  FeaturedArticleAdmin,
  FeatureCardAdmin,
  CategoryCardAdmin,
  QuickLinkAdmin,
  RepositoryUpdateAdmin,
} from '../../types/researchLibraryManager';

// Dynamic Icon Mapper for feature cards & categories
const renderDynamicIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName?.toLowerCase()) {
    case 'filecheck':
    case 'coa':
      return <FileCheck className={className} />;
    case 'bookopen':
    case 'protocol':
      return <BookOpen className={className} />;
    case 'calculator':
    case 'calc':
      return <Calculator className={className} />;
    case 'tag':
    case 'price':
      return <Tags className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'activity':
      return <Activity className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'refreshcw':
      return <RefreshCw className={className} />;
    default:
      return <Database className={className} />;
  }
};

export const ResearchHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [hubSettings, setHubSettings] = useState<ResearchHubHomepageAdmin>(
    researchLibraryManagerService.getHubSettings()
  );
  const [selectedArticle, setSelectedArticle] = useState<FeaturedArticleAdmin | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Load fresh settings from service
    const settings = researchLibraryManagerService.getHubSettings();
    setHubSettings(settings);
  }, []);

  const { heroSection, featureCards, categories, featuredArticles, quickLinks, repositoryUpdates } = hubSettings;

  // Filter public items only for customer view
  const publicFeatureCards = (featureCards || []).filter((c) => c.visibility === 'PUBLIC');
  const publicCategories = (categories || []).filter((c) => c.visibility !== 'HIDDEN');
  const publicArticles = (featuredArticles || []).filter((a) => a.visibility === 'PUBLIC');
  const featuredArticlesList = publicArticles.filter((a) => a.featured === true || a.featured === undefined);
  const publicQuickLinks = (quickLinks || []).filter((l) => l.visibility !== 'HIDDEN');
  const publicUpdates = (repositoryUpdates || []).filter((u) => u.visibility === 'PUBLIC');

  // Filter articles by search query if present
  const filteredArticles = searchQuery.trim()
    ? publicArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : publicArticles;

  return (
    <PageContainer
      title="Research Hub"
      description="Central scientific knowledge base, laboratory calculators, certificates of analysis, research protocols, and pricing catalogs."
      actions={
        <Badge variant="cyan" glow>
          ANALYTICAL REPOSITORY
        </Badge>
      }
    >
      {/* Universal Research SubNav */}
      <ResearchSubNav />

      {/* Global Search Bar */}
      <div className="mb-6 relative max-w-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search analytical research articles, topics, methods, or categories..."
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hero Section (CMS Driven) */}
      {heroSection && heroSection.visibility === 'PUBLIC' && (
        <Card
          variant="glass"
          className="border-[#00D9FF]/30 mb-8 p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-[#00D9FF]/15 via-slate-900/80 to-[#8B5CF6]/15 group"
        >
          {heroSection.bannerImageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${heroSection.bannerImageUrl}')` }}
            />
          )}

          <div className="relative z-10 space-y-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/20 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] flex-shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <span>{heroSection.title}</span>
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              {heroSection.subtitle}
            </p>

            {heroSection.ctaText && (
              <div className="pt-2">
                <button
                  onClick={() => navigate(heroSection.ctaUrl || '/research/coa-library')}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#00D9FF] to-cyan-400 hover:from-cyan-400 hover:to-[#00D9FF] text-slate-950 font-bold rounded-xl text-xs transition-all duration-200 shadow-lg shadow-[#00D9FF]/20 flex items-center gap-2"
                >
                  <span>{heroSection.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Core Research Tools (Permanent System Utilities) */}
      <div className="mb-10">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D9FF] mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Core Analytical Utilities</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResearchCard
            title="Peptide Calculator"
            description="Precision reconstitution, concentration, syringe units, and vial requirement calculation tool."
            path="/research/calculators/peptide"
            icon={Calculator}
            badgeText="UTILITY"
            badgeVariant="cyan"
            neonColor="cyan"
          />

          <ResearchCard
            title="Peptide Cycle Calculator"
            description="Compound scheduling, dosing frequency matrix, cycle length timeline, and multi-vial quantity projection."
            path="/research/calculators/cycle"
            icon={RefreshCw}
            badgeText="SCHEDULER"
            badgeVariant="magenta"
            neonColor="magenta"
          />

          <ResearchCard
            title="COA Library"
            description="Access and verify Certificates of Analysis records for all batch lots."
            path="/research/coa-library"
            icon={FileText}
            badgeText="VERIFICATION"
            badgeVariant="purple"
            neonColor="purple"
          />

          <ResearchCard
            title="Protocol Library"
            description="Standardized storage, solubility, handling, and analytical assay protocols for laboratory reference."
            path="/research/protocol-library"
            icon={FlaskConical}
            badgeText="METHODOLOGY"
            badgeVariant="magenta"
            neonColor="magenta"
          />

          <ResearchCard
            title="Products Price List"
            description="Comprehensive pricing matrix, batch volume tiers, and reference standard cost schedules."
            path="/research/price-list"
            icon={Tags}
            badgeText="CATALOG"
            badgeVariant="cyan"
            neonColor="blue"
          />

          <ResearchCard
            title="Research Repository"
            description="High-priority analytical findings, HPLC spectra breakdowns, and compound handling standards."
            path="/research/protocol-library"
            icon={Star}
            badgeText="FEATURED"
            badgeVariant="amber"
            neonColor="amber"
          />
        </div>
      </div>

      {/* Feature Cards (CMS Managed) */}
      {publicFeatureCards.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D9FF] mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Featured Highlights & Directory</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {publicFeatureCards.map((card) => (
              <Card
                key={card.id}
                variant="glass"
                className="p-5 border-slate-800 hover:border-[#00D9FF]/40 transition-all cursor-pointer flex flex-col justify-between group"
                onClick={() => navigate(card.linkUrl || '/research/coa-library')}
              >
                <div className="space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-[#00D9FF]/50 flex items-center justify-center text-[#00D9FF] transition-colors">
                    {renderDynamicIcon(card.iconName)}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-semibold text-[#00D9FF]">
                  <span>Access Module</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Featured Research Section */}
      {featuredArticlesList.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>Featured Research Publications</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticlesList.map((art) => (
              <Card
                key={art.id}
                variant="glass"
                className="p-5 border-amber-500/20 hover:border-amber-500/50 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {art.imageUrl && (
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-900 relative">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                        {art.category}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {art.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {art.date}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {art.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedArticle(art)}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Read Analysis
                  </button>

                  <button
                    onClick={() => navigate(art.articleUrl || '/research/coa-library')}
                    className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    Open Link <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Research Categories Section */}
      {publicCategories.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Research Standard Categories</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicCategories.map((cat) => (
              <Card
                key={cat.id}
                variant="glass"
                className="p-4 border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group"
                onClick={() => navigate(cat.targetUrl || '/research/coa-library')}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-300">
                    {renderDynamicIcon(cat.iconName)}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80">
                    {cat.countText}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Public Articles & Publications List */}
      {filteredArticles.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Analytical Articles & Research Methodologies</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((art) => (
              <Card
                key={art.id}
                variant="glass"
                className="p-4 border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold">
                      {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {art.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedArticle(art)}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Read Analysis <ArrowRight className="w-3 h-3" />
                  </button>

                  <span className="text-[10px] font-mono text-slate-500">{art.date}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links Row */}
      {publicQuickLinks.length > 0 && (
        <div className="mb-10">
          <Card variant="glass" className="p-4 border-slate-800">
            <div className="text-[11px] font-mono font-bold uppercase text-slate-400 mb-3 tracking-wider">
              Fast Access Directories
            </div>
            <div className="flex flex-wrap gap-2.5">
              {publicQuickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.url || '/research/coa-library')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs text-slate-300 hover:text-white transition-all flex items-center gap-2 group"
                >
                  {link.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                      {link.badge}
                    </span>
                  )}
                  <span>{link.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recent Repository Updates Log */}
      {publicUpdates.length > 0 && (
        <Card variant="glass" className="border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00D9FF]" />
              <h4 className="text-sm font-bold text-white tracking-wide">
                Recent Repository Updates
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">LIVE LOGS</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            {publicUpdates.map((upd) => (
              <div
                key={upd.id}
                onClick={() => upd.targetUrl && navigate(upd.targetUrl)}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white group-hover:text-[#00D9FF] transition-colors flex items-center gap-2">
                    <span>{upd.title}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {upd.description}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap ml-4 flex-shrink-0">
                  {upd.timestamp}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-800 font-bold">
                {selectedArticle.category}
              </span>
              <span>• {selectedArticle.readTime}</span>
              <span>• {selectedArticle.date}</span>
            </div>

            <h3 className="text-lg font-bold text-white leading-tight">
              {selectedArticle.title}
            </h3>

            {selectedArticle.imageUrl && (
              <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 italic leading-relaxed">
              "{selectedArticle.excerpt}"
            </div>

            {selectedArticle.content ? (
              <div className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                {selectedArticle.content}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Full analytical report and chromatogram documentation available in the linked repository route below.
              </p>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Close Reader
              </button>

              <button
                onClick={() => {
                  const url = selectedArticle.articleUrl || '/research/coa-library';
                  setSelectedArticle(null);
                  navigate(url);
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Navigate to Target Module</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
