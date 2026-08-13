import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Globe,
  Layout,
  Store,
  Columns,
  Search,
  CheckCircle2,
  Send,
  Eye,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  FileText,
} from 'lucide-react';
import { WebsiteManagerService } from '../../services/websiteManagerService';
import { WebsiteConfig } from '../../types/websiteManager';
import { BrandingEditor } from '../../components/admin/website/BrandingEditor';
import { HeroEditor } from '../../components/admin/website/HeroEditor';
import { StoreCardsEditor } from '../../components/admin/website/StoreCardsEditor';
import { FooterEditor } from '../../components/admin/website/FooterEditor';
import { SEOEditor } from '../../components/admin/website/SEOEditor';
import { StaticPagesEditor } from '../../components/admin/website/StaticPagesEditor';
import { WebsiteLivePreview } from '../../components/admin/website/WebsiteLivePreview';
import { ConfirmModal } from '../../components/common/ConfirmModal';

type TabKey =
  | 'branding'
  | 'hero'
  | 'store-cards'
  | 'footer'
  | 'static-pages'
  | 'seo';

export const AdminWebsitePage: React.FC = () => {
  const location = useLocation();

  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('branding');
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isResetDefaultsConfirmOpen, setIsResetDefaultsConfirmOpen] = useState(false);
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
  const [showSplitPreview, setShowSplitPreview] = useState(false);

  // Map route path to active tab
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/website/homepage')) {
      setActiveTab('hero');
    } else if (path.includes('/admin/website/theme')) {
      setActiveTab('branding');
    } else if (path.includes('/admin/website/footer')) {
      setActiveTab('footer');
    } else if (path.includes('/admin/website/static-pages')) {
      setActiveTab('static-pages');
    }
  }, [location.pathname]);

  // Load configuration
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    const loadConfig = async () => {
      setLoading(true);
      const data = await WebsiteManagerService.getWebsiteConfig();
      setConfig(data);
      setLoading(false);

      unsubscribe = WebsiteManagerService.subscribeToConfigUpdates((updated) => {
        setConfig(updated);
      });
    };
    loadConfig();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    const updated = await WebsiteManagerService.publishConfig();
    setConfig(updated);
    setIsPublishing(false);
    showToast(`Site published to live production! Version #${updated.draftVersion}`);
  };

  const handleResetDefaults = () => {
    setIsResetDefaultsConfirmOpen(true);
  };

  const confirmResetDefaults = async () => {
    const reset = await WebsiteManagerService.resetToDefaults();
    setConfig(reset);
    showToast('Website configuration restored to factory defaults.');
    setIsResetDefaultsConfirmOpen(false);
  };

  const handleExportJson = () => {
    if (!config) return;
    const jsonStr = WebsiteManagerService.exportConfigJson(config);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gkn-website-config-v${config.draftVersion}.json`;
    a.click();
    showToast('Configuration exported as JSON.');
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const updated = await WebsiteManagerService.importConfigJson(text);
      setConfig(updated);
      showToast('Website configuration imported successfully.');
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    }
  };

  if (loading || !config) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center gap-3">
        <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
        Loading GKN V2 Website Manager configuration...
      </div>
    );
  }

  const tabList: { key: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'branding', label: 'Branding & Logo', icon: Globe },
    { key: 'hero', label: 'Homepage Banner', icon: Layout },
    { key: 'store-cards', label: 'Store Card Artwork', icon: Store },
    { key: 'footer', label: 'Footer & Socials', icon: Columns },
    { key: 'static-pages', label: 'Static Pages CMS', icon: FileText },
    { key: 'seo', label: 'SEO & Analytics', icon: Search },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 text-cyan-200 border border-cyan-800 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800 uppercase">
              Module 4.7 — Website Manager
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${
                config.isPublished
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}
            >
              {config.isPublished ? '● LIVE SYNCED' : '▲ DRAFT UNPUBLISHED'}
            </span>
          </div>

          <h1 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400" /> Website Manager & Storefront Artwork
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Update storefront logos, home promotional banner, store card artwork, and SEO metadata.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Split Screen Preview Toggle */}
          <button
            onClick={() => setShowSplitPreview(!showSplitPreview)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              showSplitPreview
                ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            <Columns className="w-4 h-4" /> Split View
          </button>

          {/* Modal Preview Toggle */}
          <button
            onClick={() => setShowLivePreviewModal(true)}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-cyan-400" /> Full Preview
          </button>

          {/* Reset Defaults */}
          <button
            onClick={handleResetDefaults}
            className="p-2 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold transition-colors"
            title="Reset to Factory Defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Export / Import */}
          <button
            onClick={handleExportJson}
            className="p-2 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold transition-colors"
            title="Export Config JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <label
            className="p-2 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            title="Import Config JSON"
          >
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Publish Live Site
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl">
        {tabList.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-md shadow-cyan-950/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Split-Screen Layout / Full Width Editor */}
      <div className={`grid grid-cols-1 ${showSplitPreview ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Editor Column */}
        <div className="space-y-6">
          {activeTab === 'branding' && (
            <BrandingEditor
              branding={config.branding}
              onChange={(updated) =>
                WebsiteManagerService.updateBranding(updated).then(setConfig)
              }
            />
          )}

          {activeTab === 'hero' && (
            <HeroEditor
              hero={config.hero}
              onChange={(updated) => WebsiteManagerService.updateHero(updated).then(setConfig)}
            />
          )}

          {activeTab === 'store-cards' && (
            <StoreCardsEditor
              storeCards={config.storeCards}
              onChange={(updated) =>
                WebsiteManagerService.updateStoreCards(updated).then(setConfig)
              }
            />
          )}

          {activeTab === 'footer' && (
            <FooterEditor
              footer={config.footer}
              onChange={(updated) => WebsiteManagerService.updateFooter(updated).then(setConfig)}
            />
          )}

          {activeTab === 'static-pages' && (
            <StaticPagesEditor />
          )}

          {activeTab === 'seo' && (
            <SEOEditor
              seo={config.seo}
              onChange={(updated) => WebsiteManagerService.updateSEO(updated).then(setConfig)}
            />
          )}
        </div>

        {/* Live Split Preview Panel */}
        {showSplitPreview && (
          <div className="sticky top-6 h-[calc(100vh-120px)] hidden lg:block">
            <WebsiteLivePreview config={config} />
          </div>
        )}
      </div>

      {/* Full Modal Preview */}
      {showLivePreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center animate-in fade-in">
          <div className="w-full h-full max-w-7xl max-h-[90vh]">
            <WebsiteLivePreview
              config={config}
              isModalMode={true}
              isOpen={showLivePreviewModal}
              onClose={() => setShowLivePreviewModal(false)}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetDefaultsConfirmOpen}
        title="Reset Website Configuration"
        message="Are you sure you want to restore the website configuration to factory defaults? All custom logos, banners, store cards, and text changes will be reset."
        confirmText="Reset to Defaults"
        confirmVariant="danger"
        onConfirm={confirmResetDefaults}
        onCancel={() => setIsResetDefaultsConfirmOpen(false)}
      />
    </div>
  );
};
