import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Table as TableIcon,
  Image as ImageIcon,
  History,
  Sparkles,
  Search,
  Globe,
  Tag,
  FolderTree,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { staticPagesService, StaticPage, PageCategory, PageStatus } from '../../../services/staticPagesService';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { ConfirmModal } from '../../common/ConfirmModal';

export const StaticPagesEditor: React.FC = () => {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('page-about');
  const [currentPage, setCurrentPage] = useState<StaticPage | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'history' | 'preview'>('content');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'All' | PageCategory>('All');
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  // Sync state with staticPagesService
  useEffect(() => {
    const unsubscribe = staticPagesService.subscribe((loadedPages) => {
      setPages(loadedPages);
      if (selectedPageId) {
        const p = loadedPages.find((item) => item.id === selectedPageId) || loadedPages[0];
        if (p) {
          setCurrentPage({ ...p });
        }
      }
    });
    return () => unsubscribe();
  }, [selectedPageId]);

  const handleSelectPage = (id: string) => {
    setSelectedPageId(id);
    const p = pages.find((item) => item.id === id);
    if (p) {
      setCurrentPage({ ...p });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    if (!currentPage) return;
    const saved = staticPagesService.savePage(currentPage, 'Admin Owner');
    setCurrentPage({ ...saved });
    showToast(`Page "${saved.title}" updated successfully!`);
  };

  const handleRestoreVersion = (versionId: string) => {
    if (!currentPage) return;
    setRestoringVersionId(versionId);
  };

  const confirmRestoreVersion = () => {
    if (!currentPage || !restoringVersionId) return;
    const restored = staticPagesService.restoreVersion(currentPage.id, restoringVersionId, 'Admin Owner');
    if (restored) {
      setCurrentPage({ ...restored });
      showToast('Restored previous version successfully!');
    }
    setRestoringVersionId(null);
  };

  // Content formatting toolbar helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!currentPage) return;
    const textarea = document.getElementById('cms-content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentPage.content;
    const selectedText = text.substring(start, end) || 'Sample Text';

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setCurrentPage({ ...currentPage, content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const insertTable = () => {
    const tableTemplate = `\n| Specification | Details |\n| --- | --- |\n| Analytical Purity | 99.2% Standard |\n| Molecular Formula | C149H246N44O42S |\n`;
    insertFormatting(tableTemplate);
  };

  const insertImage = () => {
    const imageUrl = prompt('Enter Image URL (or path from Media Library):', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80');
    if (imageUrl) {
      insertFormatting(`\n![Image Description](${imageUrl})\n`);
    }
  };

  const insertLink = () => {
    const linkUrl = prompt('Enter Link URL:', 'https://gkn.research/research/coa-library');
    if (linkUrl) {
      insertFormatting('[', `](${linkUrl})`);
    }
  };

  const filteredPages = pages.filter((p) => {
    if (filterCategory === 'All') return true;
    return p.category === filterCategory;
  });

  if (!currentPage) {
    return <div className="p-8 text-slate-400 font-mono text-xs">Loading Static Pages CMS...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-emerald-200 border border-emerald-800 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pages List Selector */}
        <div className="lg:col-span-4 space-y-4">
          <Card variant="glass" className="border-white/10 p-4">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-[#00D9FF]" />
                <h3 className="font-bold text-sm text-white">Managed Footer Pages</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {pages.length} Pages
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1 mb-4 p-1 bg-[#050810] rounded-xl border border-white/5">
              {(['All', 'Company', 'Support'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                    filterCategory === cat
                      ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Page List Cards */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredPages.map((page) => {
                const isSelected = page.id === currentPage.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => handleSelectPage(page.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#00D9FF]/15 border-[#00D9FF]/50 shadow-[0_0_15px_rgba(0,217,255,0.15)]'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white group-hover:text-[#00D9FF] transition-colors">
                          {page.title}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                          /{page.slug}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>{page.category}</span>
                        <span>•</span>
                        <span>Updated {new Date(page.lastEdited).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Badge
                      variant={
                        page.status === 'Published'
                          ? 'success'
                          : page.status === 'Draft'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {page.status}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Page Editor Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <Card variant="glass" className="border-white/10 p-6">
            {/* Editor Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/30 uppercase">
                    CMS • {currentPage.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {currentPage.id}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                  {currentPage.title}
                  <a
                    href={`/${currentPage.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-normal text-[#00D9FF] hover:underline flex items-center gap-1"
                    title="View page live"
                  >
                    /{currentPage.slug} <ExternalLink className="w-3 h-3" />
                  </a>
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] hover:brightness-110 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-[#00D9FF]/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save & Publish
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 my-4 border-b border-white/10 pb-3">
              {[
                { key: 'content', label: 'Rich Content Editor', icon: FileText },
                { key: 'seo', label: 'SEO & Metadata', icon: Globe },
                { key: 'history', label: `Version History (${currentPage.versions?.length || 0})`, icon: History },
                { key: 'preview', label: 'Live Page Preview', icon: Eye },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: CONTENT EDITOR */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                {/* Status & Settings Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#050810] p-4 rounded-xl border border-white/5">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={currentPage.status}
                      onChange={(e) =>
                        setCurrentPage({ ...currentPage, status: e.target.value as PageStatus })
                      }
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                    >
                      <option value="Published">Published (Visible in Footer)</option>
                      <option value="Draft">Draft (Under Review)</option>
                      <option value="Hidden">Hidden (Not listed in Footer)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={currentPage.title}
                      onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      URL Slug
                    </label>
                    <div className="flex items-center">
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1.5 rounded-l-lg border border-r-0 border-white/10">
                        /
                      </span>
                      <input
                        type="text"
                        value={currentPage.slug}
                        onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                        className="w-full bg-slate-900 border border-white/10 rounded-r-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#0A0F1D] rounded-xl border border-white/10">
                  <button
                    onClick={() => insertFormatting('# ')}
                    className="p-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded border border-white/10 flex items-center gap-1"
                    title="Insert H1 Heading"
                  >
                    <Heading1 className="w-3.5 h-3.5 text-[#00D9FF]" /> H1
                  </button>
                  <button
                    onClick={() => insertFormatting('## ')}
                    className="p-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded border border-white/10 flex items-center gap-1"
                    title="Insert H2 Heading"
                  >
                    <Heading2 className="w-3.5 h-3.5 text-[#00D9FF]" /> H2
                  </button>
                  <button
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded border border-white/10 px-2"
                    title="Bold Text"
                  >
                    B
                  </button>
                  <button
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 text-xs italic text-slate-300 hover:text-white hover:bg-white/10 rounded border border-white/10 px-2"
                    title="Italic Text"
                  >
                    I
                  </button>
                  <button
                    onClick={() => insertFormatting('- ')}
                    className="p-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded border border-white/10 flex items-center gap-1"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                  <button
                    onClick={() => insertFormatting('1. ')}
                    className="p-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded border border-white/10 flex items-center gap-1"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                  <button
                    onClick={insertLink}
                    className="p-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded border border-white/10 flex items-center gap-1"
                    title="Insert Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-magenta-400" /> Link
                  </button>
                  <button
                    onClick={insertTable}
                    className="p-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded border border-white/10 flex items-center gap-1"
                    title="Insert Data Table"
                  >
                    <TableIcon className="w-3.5 h-3.5 text-amber-400" /> Table
                  </button>
                  <button
                    onClick={insertImage}
                    className="p-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded border border-white/10 flex items-center gap-1"
                    title="Insert Image"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Image
                  </button>
                </div>

                {/* Main Content Area */}
                <div>
                  <textarea
                    id="cms-content-editor"
                    rows={18}
                    value={currentPage.content}
                    onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                    placeholder="Enter formatted page content..."
                    className="w-full bg-[#050810] border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-[#00D9FF] resize-y"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: SEO & METADATA */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div className="bg-[#050810] p-4 rounded-xl border border-white/5 space-y-4">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider text-[#00D9FF]">
                    SEO & Search Engine Fields
                  </h3>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      SEO Page Title (`&lt;title&gt;`)
                    </label>
                    <input
                      type="text"
                      value={currentPage.seoTitle}
                      onChange={(e) => setCurrentPage({ ...currentPage, seoTitle: e.target.value })}
                      placeholder="e.g. Terms of Service — GKN Platform"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={currentPage.metaDescription}
                      onChange={(e) => setCurrentPage({ ...currentPage, metaDescription: e.target.value })}
                      placeholder="Brief search snippet describing page content..."
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Keywords (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={currentPage.keywords}
                      onChange={(e) => setCurrentPage({ ...currentPage, keywords: e.target.value })}
                      placeholder="gkn, research, terms, compliance, laboratory"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      OpenGraph Image URL (Social Cards)
                    </label>
                    <input
                      type="text"
                      value={currentPage.openGraphImage || ''}
                      onChange={(e) => setCurrentPage({ ...currentPage, openGraphImage: e.target.value })}
                      placeholder="https://gkn.research/og-banner.jpg"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VERSION HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider text-[#00D9FF]">
                    Version History & Auditing
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Last Saved: {new Date(currentPage.lastEdited).toLocaleString()} by {currentPage.editedBy}
                  </span>
                </div>

                {!currentPage.versions || currentPage.versions.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs bg-[#050810] rounded-xl border border-white/5">
                    No previous revision snapshots logged yet for this page.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentPage.versions.map((version) => (
                      <div
                        key={version.id}
                        className="bg-[#050810] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{version.title}</span>
                            <Badge variant="outline" size="sm">
                              {version.status}
                            </Badge>
                          </div>
                          <p className="text-[11px] font-mono text-slate-400 mt-1">
                            Edited on {new Date(version.editedAt).toLocaleString()} by {version.editedBy}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRestoreVersion(version.id)}
                          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 self-start sm:self-center"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restore This Version
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: LIVE PREVIEW */}
            {activeTab === 'preview' && (
              <div className="space-y-4">
                <div className="bg-[#050810] p-6 rounded-2xl border border-white/10">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <span className="text-[10px] font-mono uppercase text-[#00D9FF] tracking-wider">
                      {currentPage.category} Document
                    </span>
                    <h1 className="text-3xl font-black text-white mt-1">{currentPage.title}</h1>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Published URL: https://gkn.research/{currentPage.slug}
                    </p>
                  </div>

                  <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-4">
                    {currentPage.content.split('\n\n').map((block, idx) => {
                      if (block.startsWith('# ')) {
                        return (
                          <h1 key={idx} className="text-2xl font-bold text-[#00D9FF] my-3">
                            {block.replace('# ', '')}
                          </h1>
                        );
                      }
                      if (block.startsWith('## ')) {
                        return (
                          <h2 key={idx} className="text-xl font-bold text-white my-3">
                            {block.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (block.startsWith('### ')) {
                        return (
                          <h3 key={idx} className="text-lg font-bold text-[#FF2ED1] my-2">
                            {block.replace('### ', '')}
                          </h3>
                        );
                      }
                      return (
                        <p key={idx} className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {block}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Restore Version Confirm Modal */}
      <ConfirmModal
        isOpen={!!restoringVersionId}
        onClose={() => setRestoringVersionId(null)}
        onConfirm={confirmRestoreVersion}
        title="Restore Page Version"
        message="Are you sure you want to restore this previous version of the page? Current unsaved modifications will be replaced."
        confirmText="Restore Version"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
};
