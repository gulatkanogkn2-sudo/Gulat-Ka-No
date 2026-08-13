import React, { useEffect, useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { staticPagesService, StaticPage } from '../../services/staticPagesService';
import { ResponsiveContainer } from '../../components/layout/ResponsiveContainer';
import { Badge } from '../../components/common/Badge';
import { FileText, ShieldCheck, HelpCircle, ArrowLeft, Clock, Calendar } from 'lucide-react';

export const StaticPageViewer: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const [page, setPage] = useState<StaticPage | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugFromPath = params.slug || location.pathname.replace(/^\/+/, '');
    const loadedPage = staticPagesService.getPageBySlug(slugFromPath);
    setPage(loadedPage);
    setLoading(false);

    // Dynamic document title update for SEO
    if (loadedPage) {
      document.title = loadedPage.seoTitle || `${loadedPage.title} — GKN Platform`;
    }
  }, [location.pathname, params.slug]);

  if (loading) {
    return (
      <ResponsiveContainer className="py-20 text-center">
        <div className="animate-pulse text-xs font-mono text-slate-400">Loading page content...</div>
      </ResponsiveContainer>
    );
  }

  if (!page || page.status === 'Hidden') {
    return (
      <ResponsiveContainer className="py-20 max-w-3xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 mx-auto flex items-center justify-center text-xl font-bold">
          404
        </div>
        <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          The requested informational document is either unavailable or currently undergoing draft revision.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00D9FF]/40 text-xs font-bold text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#00D9FF]" /> Return to Storefront
        </Link>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer className="py-12 max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-[#070B14]/90 border border-[#00D9FF]/20 p-6 sm:p-8 backdrop-blur-md overflow-hidden shadow-[0_0_30px_rgba(0,217,255,0.05)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-3 py-1 rounded-full border border-[#00D9FF]/30 uppercase tracking-widest">
              {page.category} Document
            </span>
            
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Updated {new Date(page.lastEdited).toLocaleDateString()}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {page.title}
          </h1>

          {page.status === 'Draft' && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Administrator Draft Mode — This document is currently unpublished.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Formatted Content */}
      <div className="rounded-2xl bg-[#050810]/80 border border-white/10 p-6 sm:p-10 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-6 shadow-xl backdrop-blur-sm">
        {page.content.split('\n\n').map((block, idx) => {
          const trimmed = block.trim();
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-[#00D9FF] pt-2 pb-1 border-b border-white/10">
                {trimmed.replace('# ', '')}
              </h1>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white pt-3">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-bold text-[#FF2ED1] pt-2">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const listItems = trimmed.split('\n').map((li) => li.replace(/^[-*]\s+/, ''));
            return (
              <ul key={idx} className="list-disc list-inside space-y-2 text-slate-300 pl-2">
                {listItems.map((li, i) => (
                  <li key={i} className="leading-relaxed">
                    {li}
                  </li>
                ))}
              </ul>
            );
          }
          if (trimmed.startsWith('1. ')) {
            const listItems = trimmed.split('\n').map((li) => li.replace(/^\d+\.\s+/, ''));
            return (
              <ol key={idx} className="list-decimal list-inside space-y-2 text-slate-300 pl-2">
                {listItems.map((li, i) => (
                  <li key={i} className="leading-relaxed">
                    {li}
                  </li>
                ))}
              </ol>
            );
          }
          return (
            <p key={idx} className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {trimmed}
            </p>
          );
        })}
      </div>

      {/* Bottom Back Button */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00D9FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>
        <span className="text-[10px] font-mono text-slate-500">
          GKN Platform • Research Compliance Verified
        </span>
      </div>
    </ResponsiveContainer>
  );
};
