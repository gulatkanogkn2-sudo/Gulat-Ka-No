import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  Calculator,
  Tag,
  Globe,
  Search,
  Download,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  Sparkles,
  Database,
  RefreshCw,
  FileSpreadsheet,
  Share2,
} from 'lucide-react';
import { researchLibraryManagerService } from '../../services/researchLibraryManagerService';
import {
  COARecordAdmin,
  ProtocolRecordAdmin,
  CalculatorContentAdmin,
  PriceListItemAdmin,
  ResearchHubHomepageAdmin,
  GlobalSearchMatch,
  ExportFormat,
} from '../../types/researchLibraryManager';

import { CoaManagerTab } from '../../components/admin/research/CoaManagerTab';
import { ProtocolManagerTab } from '../../components/admin/research/ProtocolManagerTab';
import { CalculatorManagerTab } from '../../components/admin/research/CalculatorManagerTab';
import { PriceListManagerTab } from '../../components/admin/research/PriceListManagerTab';
import { ResearchHubManagerTab } from '../../components/admin/research/ResearchHubManagerTab';
import { GlobalSearchOverlay } from '../../components/admin/research/GlobalSearchOverlay';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminResearchLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine active tab from location
  const getTabFromLocation = (): 'coa' | 'protocols' | 'calculators' | 'price-list' | 'hub' => {
    const path = location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab')?.toLowerCase();

    if (tabParam === 'protocols' || path.endsWith('/protocols')) return 'protocols';
    if (tabParam === 'calculators' || path.endsWith('/calculators')) return 'calculators';
    if (tabParam === 'price-list' || tabParam === 'pricing' || path.endsWith('/price-list') || path.endsWith('/pricing')) return 'price-list';
    if (tabParam === 'hub' || tabParam === 'research-hub' || path.endsWith('/research-hub') || path.endsWith('/hub')) return 'hub';
    if (tabParam === 'coa' || path.endsWith('/coa')) return 'coa';

    return 'coa';
  };

  const [activeTab, setActiveTabState] = useState<'coa' | 'protocols' | 'calculators' | 'price-list' | 'hub'>(getTabFromLocation);

  // Sync tab state when location changes
  useEffect(() => {
    const currentTab = getTabFromLocation();
    setActiveTabState(currentTab);
  }, [location.pathname, location.search]);

  // Handler to navigate tab
  const handleTabChange = (tab: 'coa' | 'protocols' | 'calculators' | 'price-list' | 'hub') => {
    setActiveTabState(tab);
    switch (tab) {
      case 'coa':
        navigate('/admin/coa');
        break;
      case 'protocols':
        navigate('/admin/protocols');
        break;
      case 'calculators':
        navigate('/admin/calculators');
        break;
      case 'price-list':
        navigate('/admin/price-list');
        break;
      case 'hub':
        navigate('/admin/research-hub');
        break;
    }
  };

  // Datasets state
  const [coas, setCoas] = useState<COARecordAdmin[]>([]);
  const [protocols, setProtocols] = useState<ProtocolRecordAdmin[]>([]);
  const [calculators, setCalculators] = useState<CalculatorContentAdmin[]>([]);
  const [priceList, setPriceList] = useState<PriceListItemAdmin[]>([]);
  const [hubSettings, setHubSettings] = useState<ResearchHubHomepageAdmin | null>(null);

  // Instant Global Search state
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<GlobalSearchMatch[]>([]);

  // Bulk Selection state
  const [selectedCoaIds, setSelectedCoaIds] = useState<string[]>([]);
  const [selectedProtocolIds, setSelectedProtocolIds] = useState<string[]>([]);
  const [selectedPriceIds, setSelectedPriceIds] = useState<string[]>([]);

  // Status Notification
  const [notification, setNotification] = useState<string | null>(null);

  // Delete confirm modal state
  const [deletingTarget, setDeletingTarget] = useState<{
    type: 'coa' | 'protocol' | 'price' | 'bulk';
    id?: string;
    title: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadData = () => {
    setCoas(researchLibraryManagerService.getCOAs());
    setProtocols(researchLibraryManagerService.getProtocols());
    setCalculators(researchLibraryManagerService.getCalculators());
    setPriceList(researchLibraryManagerService.getPriceList());
    setHubSettings(researchLibraryManagerService.getResearchHubSettings());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Instant Global Search
  useEffect(() => {
    if (globalSearch.trim().length > 1) {
      setSearchResults(researchLibraryManagerService.searchLibrary(globalSearch));
    } else {
      setSearchResults([]);
    }
  }, [globalSearch]);

  const handleSelectMatch = (match: GlobalSearchMatch) => {
    handleTabChange(match.linkTab as any);
    setGlobalSearch('');
  };

  // COA Handlers
  const handleSaveCOA = (data: Partial<COARecordAdmin> & { product: string; lotNumber: string }) => {
    researchLibraryManagerService.saveCOA(data);
    loadData();
    showToast(`COA Record for ${data.product} saved successfully.`);
  };

  const handleDeleteCOA = (id: string) => {
    const item = coas.find((c) => c.id === id);
    setDeletingTarget({
      type: 'coa',
      id,
      title: item ? `COA for ${item.product} (Lot ${item.lotNumber})` : 'this COA record',
    });
  };

  const handleAddCOAVersion = (coaId: string, versionNote: string, pdfUrl?: string) => {
    researchLibraryManagerService.addCOAVersion(coaId, versionNote, pdfUrl);
    loadData();
    showToast('COA revision history updated.');
  };

  // Protocol Handlers
  const handleSaveProtocol = (data: Partial<ProtocolRecordAdmin> & { title: string }) => {
    researchLibraryManagerService.saveProtocol(data);
    loadData();
    showToast(`Protocol "${data.title}" saved successfully.`);
  };

  const handleDeleteProtocol = (id: string) => {
    const item = protocols.find((p) => p.id === id);
    setDeletingTarget({
      type: 'protocol',
      id,
      title: item ? `Protocol "${item.title}"` : 'this protocol',
    });
  };

  const handleReorderProtocols = (orderedIds: string[]) => {
    researchLibraryManagerService.reorderProtocols(orderedIds);
    loadData();
  };

  // Calculator Handler
  const handleSaveCalculator = (calc: CalculatorContentAdmin) => {
    researchLibraryManagerService.saveCalculator(calc);
    loadData();
    showToast(`Calculator "${calc.title}" content updated.`);
  };

  // Price List Handlers
  const handleSavePriceListItem = (item: Partial<PriceListItemAdmin> & { product: string; variant: string }) => {
    researchLibraryManagerService.savePriceListItem(item);
    loadData();
    showToast(`Price item for ${item.product} saved.`);
  };

  const handleDeletePriceListItem = (id: string) => {
    const item = priceList.find((p) => p.id === id);
    setDeletingTarget({
      type: 'price',
      id,
      title: item ? `Price item "${item.product} - ${item.variant}"` : 'this price item',
    });
  };

  // Research Hub Handler
  const handleSaveHubSettings = (settings: Partial<ResearchHubHomepageAdmin>) => {
    researchLibraryManagerService.saveResearchHubSettings(settings);
    loadData();
    showToast('Research Hub Homepage configuration saved.');
  };

  // Bulk Actions Logic
  const getCurrentSelectedCount = () => {
    if (activeTab === 'coa') return selectedCoaIds.length;
    if (activeTab === 'protocols') return selectedProtocolIds.length;
    if (activeTab === 'price-list') return selectedPriceIds.length;
    return 0;
  };

  const executeBulkDelete = () => {
    let affected = 0;
    if (activeTab === 'coa') {
      affected = researchLibraryManagerService.bulkCOAActions(selectedCoaIds, 'DELETE');
      setSelectedCoaIds([]);
    } else if (activeTab === 'protocols') {
      affected = researchLibraryManagerService.bulkProtocolActions(selectedProtocolIds, 'DELETE');
      setSelectedProtocolIds([]);
    } else if (activeTab === 'price-list') {
      affected = researchLibraryManagerService.bulkPriceListActions(selectedPriceIds, 'DELETE');
      setSelectedPriceIds([]);
    }

    loadData();
    showToast(`Bulk delete applied to ${affected} items.`);
  };

  const handleBulkAction = (action: 'PUBLISH' | 'HIDE' | 'DELETE') => {
    const count = getCurrentSelectedCount();
    if (count === 0) return;

    if (action === 'DELETE') {
      setDeletingTarget({
        type: 'bulk',
        title: `${count} selected ${activeTab} record(s)`,
      });
      return;
    }

    let affected = 0;
    if (activeTab === 'coa') {
      affected = researchLibraryManagerService.bulkCOAActions(selectedCoaIds, action);
      setSelectedCoaIds([]);
    } else if (activeTab === 'protocols') {
      affected = researchLibraryManagerService.bulkProtocolActions(selectedProtocolIds, action);
      setSelectedProtocolIds([]);
    } else if (activeTab === 'price-list') {
      affected = researchLibraryManagerService.bulkPriceListActions(selectedPriceIds, action);
      setSelectedPriceIds([]);
    }

    loadData();
    showToast(`Bulk ${action.toLowerCase()} applied to ${affected} items.`);
  };

  const confirmDeleteTarget = () => {
    if (!deletingTarget) return;

    if (deletingTarget.type === 'coa' && deletingTarget.id) {
      researchLibraryManagerService.deleteCOA(deletingTarget.id);
      showToast('COA record removed.');
    } else if (deletingTarget.type === 'protocol' && deletingTarget.id) {
      researchLibraryManagerService.deleteProtocol(deletingTarget.id);
      showToast('Protocol removed.');
    } else if (deletingTarget.type === 'price' && deletingTarget.id) {
      researchLibraryManagerService.deletePriceListItem(deletingTarget.id);
      showToast('Price item removed.');
    } else if (deletingTarget.type === 'bulk') {
      executeBulkDelete();
    }

    loadData();
    setDeletingTarget(null);
  };

  const handleExport = (format: ExportFormat) => {
    const typeMap = {
      coa: 'COA',
      protocols: 'PROTOCOL',
      calculators: 'ALL',
      'price-list': 'PRICELIST',
      hub: 'ALL',
    } as const;

    const exportType = typeMap[activeTab] || 'ALL';
    researchLibraryManagerService.exportData(exportType, format);
    showToast(`Exported ${exportType} library to ${format.toUpperCase()} format.`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 font-mono text-xs">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                MODULE 4.8
              </span>
              <span className="text-xs font-mono text-slate-400">ADMINISTRATOR WORKSPACE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              Research Library Manager
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Centralized administrative management for COAs, Technical Protocols, Peptide Calculators, Price Lists, and Public Research Hub Content.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => loadData()}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
              title="Refresh Local Dataset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" /> CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="px-3 py-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Export Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel
              </button>
              <button
                onClick={() => handleExport('sheets')}
                className="px-3 py-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Export Google Sheets"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-400" /> Sheets
              </button>
            </div>
          </div>
        </div>

        {/* Overview Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <FileText className="w-3 h-3 text-cyan-400" /> Verified COAs
            </div>
            <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">{coas.length} Lots</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-purple-400" /> Protocols
            </div>
            <div className="text-lg font-bold font-mono text-purple-300 mt-0.5">{protocols.length} SOPs</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Calculator className="w-3 h-3 text-amber-400" /> Calculators
            </div>
            <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">{calculators.length} Modules</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-400" /> Price Matrix
            </div>
            <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">{priceList.length} Items</div>
          </div>
        </div>
      </div>

      {/* Instant Global Search Bar */}
      <div className="relative">
        <div className="relative w-full">
          <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Instant Global Search across COAs, Protocols, Price List, Keywords, or Lot Numbers..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none shadow-xl transition-all"
          />
        </div>

        <GlobalSearchOverlay
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          matches={searchResults}
          onSelectMatch={handleSelectMatch}
        />
      </div>

      {/* Main Tabs Navigation & Bulk Operations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTabChange('coa')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'coa'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> COA Library
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-950/40">
              {coas.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('protocols')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'protocols'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Protocol Library
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-950/40">
              {protocols.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('calculators')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'calculators'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" /> Peptide Calculators
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-950/40">
              {calculators.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('price-list')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'price-list'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" /> Products Price List
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-950/40">
              {priceList.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('hub')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'hub'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-lg shadow-cyan-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" /> Research Hub Homepage
          </button>
        </div>

        {/* Bulk Action Toolbar */}
        {getCurrentSelectedCount() > 0 && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl animate-in fade-in duration-200">
            <span className="text-xs font-mono text-cyan-400 px-2 font-bold">
              {getCurrentSelectedCount()} Selected
            </span>
            <button
              onClick={() => handleBulkAction('PUBLISH')}
              className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> Publish
            </button>
            <button
              onClick={() => handleBulkAction('HIDE')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <EyeOff className="w-3.5 h-3.5" /> Hide
            </button>
            <button
              onClick={() => handleBulkAction('DELETE')}
              className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'coa' && (
          <CoaManagerTab
            coas={coas}
            selectedIds={selectedCoaIds}
            onToggleSelect={(id) =>
              setSelectedCoaIds((prev) =>
                prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
              )
            }
            onToggleSelectAll={() =>
              setSelectedCoaIds(selectedCoaIds.length === coas.length ? [] : coas.map((c) => c.id))
            }
            onSaveCOA={handleSaveCOA}
            onDeleteCOA={handleDeleteCOA}
            onAddVersion={handleAddCOAVersion}
          />
        )}

        {activeTab === 'protocols' && (
          <ProtocolManagerTab
            protocols={protocols}
            selectedIds={selectedProtocolIds}
            onToggleSelect={(id) =>
              setSelectedProtocolIds((prev) =>
                prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
              )
            }
            onToggleSelectAll={() =>
              setSelectedProtocolIds(
                selectedProtocolIds.length === protocols.length ? [] : protocols.map((p) => p.id)
              )
            }
            onSaveProtocol={handleSaveProtocol}
            onDeleteProtocol={handleDeleteProtocol}
            onReorderProtocols={handleReorderProtocols}
          />
        )}

        {activeTab === 'calculators' && (
          <CalculatorManagerTab
            calculators={calculators}
            onSaveCalculator={handleSaveCalculator}
          />
        )}

        {activeTab === 'price-list' && (
          <PriceListManagerTab
            priceList={priceList}
            selectedIds={selectedPriceIds}
            onToggleSelect={(id) =>
              setSelectedPriceIds((prev) =>
                prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
              )
            }
            onToggleSelectAll={() =>
              setSelectedPriceIds(
                selectedPriceIds.length === priceList.length ? [] : priceList.map((p) => p.id)
              )
            }
            onSavePriceListItem={handleSavePriceListItem}
            onDeletePriceListItem={handleDeletePriceListItem}
          />
        )}

        {activeTab === 'hub' && hubSettings && (
          <ResearchHubManagerTab
            hubSettings={hubSettings}
            onSaveHubSettings={handleSaveHubSettings}
          />
        )}
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deletingTarget}
        onClose={() => setDeletingTarget(null)}
        onConfirm={confirmDeleteTarget}
        title="Delete Research Library Item"
        message={`Are you sure you want to delete ${deletingTarget?.title || 'this record'}? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
