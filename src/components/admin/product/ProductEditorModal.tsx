import React, { useState, useEffect } from 'react';
import {
  AdminProduct,
  AdminStoreType,
  AdminProductStatus,
  AdminProductVariant,
  GroupBuyStoreSettings,
  OnHandStoreSettings,
  MoqStoreSettings,
} from '../../../types/adminProduct';
import { systemSettingsService } from '../../../services/systemSettingsService';
import { getStoreSellingUnitConfig, getStoreQuantityConfig } from '../../../utils/vialCalculation';
import { VariantEditor } from './VariantEditor';
import { StoreSettingsEditor } from './StoreSettingsEditor';
import { MediaInput } from '../website/MediaAssetPickerModal';
import { Badge } from '../../common/Badge';
import {
  Package,
  Layers,
  Box,
  Image as ImageIcon,
  Save,
  X,
  Sparkles,
  Eye,
  EyeOff,
  FileText,
  Trash2,
  Lock,
} from 'lucide-react';

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<AdminProduct, 'id' | 'lastUpdated'> | AdminProduct) => Promise<void>;
  product?: AdminProduct | null; // null for Create Mode
  initialStoreType?: AdminStoreType;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  initialStoreType = 'groupbuy',
}) => {
  const isEditMode = !!product;

  // Form State
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [category, setCategory] = useState('Active');
  const [storeType, setStoreType] = useState<AdminStoreType>(initialStoreType);
  const [price, setPrice] = useState<number>(120.0);
  const [currency] = useState('$');
  const [status, setStatus] = useState<AdminProductStatus>('Active');
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [casNumber, setCasNumber] = useState('');
  const [sellingUnit, setSellingUnit] = useState<'vial' | 'kit'>('vial');
  const [vialsPerKit, setVialsPerKit] = useState<number>(10);
  const [minQuantity, setMinQuantity] = useState<number>(1);
  const [stepQuantity, setStepQuantity] = useState<number>(1);
  const [variants, setVariants] = useState<AdminProductVariant[]>([]);

  // Store Specific Settings State
  const [groupBuySettings, setGroupBuySettings] = useState<GroupBuyStoreSettings | undefined>(
    undefined
  );
  const [onHandSettings, setOnHandSettings] = useState<OnHandStoreSettings | undefined>(
    undefined
  );
  const [moqSettings, setMoqSettings] = useState<MoqStoreSettings | undefined>(undefined);

  // Tab State
  const [activeTab, setActiveTab] = useState<'general' | 'variants' | 'store' | 'media'>('general');
  const [isSaving, setIsSaving] = useState(false);

  const currentStoreConfig = systemSettingsService.getSettings().stores[storeType];
  const capabilities = currentStoreConfig?.capabilities || {
    openCloseControl: storeType === 'groupbuy',
    inventoryManagement: storeType === 'onhand',
    variantInventory: storeType === 'onhand',
  };

  const isGroupBuy = storeType === 'groupbuy';

  // Populate form when modal opens or product changes
  useEffect(() => {
    if (product) {
      const activeStore = product.storeType || initialStoreType || 'groupbuy';
      setName(product.name || '');
      setShortDescription(product.shortDescription || '');
      setAdminNotes(product.adminNotes || '');
      setCategory(product.category || 'Active');
      setStoreType(activeStore);
      setPrice(product.price || 120.0);
      setStatus(product.status || 'Active');
      setIsVisible(product.isVisible ?? true);
      setIsFeatured(product.isFeatured ?? false);
      setImageUrl(product.imageUrl || '');
      setCasNumber(product.casNumber || '');
      
      const storeCfg = getStoreQuantityConfig(product, activeStore);
      setSellingUnit(storeCfg.sellingUnit);
      setVialsPerKit(storeCfg.vialsPerKit);
      setMinQuantity(storeCfg.minQuantity);
      setStepQuantity(storeCfg.stepQuantity);

      setVariants(
        product.variants && product.variants.length > 0
          ? JSON.parse(JSON.stringify(product.variants))
          : [
              {
                id: 'var-1',
                name: '10mg',
                price: product.price || 120.0,
                costPrice: 60.0,
                minOrder: storeCfg.minQuantity,
                orderStep: storeCfg.stepQuantity,
                sku: 'GKN-TZ10-10MG',
              },
            ]
      );
      setGroupBuySettings(product.groupBuySettings);
      setOnHandSettings(product.onHandSettings);
      setMoqSettings(product.moqSettings);
    } else {
      // Reset for Create Mode
      setName('');
      setShortDescription('');
      setAdminNotes('');
      setCategory('Active');
      setStoreType(initialStoreType);
      setPrice(100.0);
      setStatus('Active');
      setIsVisible(true);
      setIsFeatured(false);
      setImageUrl(''); // Optional image starts blank
      setCasNumber('');
      setSellingUnit(initialStoreType === 'groupbuy' ? 'kit' : 'vial');
      setVialsPerKit(10);
      setMinQuantity(1);
      setStepQuantity(1);
      setVariants([
        {
          id: 'var-default-1',
          name: '10mg',
          price: 100.0,
          costPrice: 50.0,
          minOrder: 1,
          orderStep: 1,
          sku: `GKN-GB-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      ]);
      setGroupBuySettings({
        batchId: 'gb-batch-1',
        batchName: 'Batch #1 Allocation',
        batchStatus: 'Active Collection',
        batchVisibility: 'Public',
        closingDate: '2026-08-31',
        sellingUnit: initialStoreType === 'groupbuy' ? 'kit' : 'vial',
        vialsPerKit: 10,
        minQuantity: 1,
        stepQuantity: 1,
      });
      setOnHandSettings({
        inventoryQuantity: 200,
        lowStockThreshold: 30,
        dispatchTime: 'Same-Day Cold Dispatch (24H)',
        warehouseLocation: 'Vault Section A-1',
        sellingUnit: initialStoreType === 'onhand' ? 'vial' : 'kit',
        vialsPerKit: 10,
        minQuantity: 1,
        stepQuantity: 1,
      });
      setMoqSettings({
        moqTarget: 100,
        currentProgress: 10,
        productionStatus: 'Collecting Orders',
        estimatedProductionDate: '2026-08-30',
        qualityControlNotice: 'HPLC COA with batch release',
        sellingUnit: initialStoreType === 'moq' ? 'kit' : 'vial',
        vialsPerKit: 10,
        minQuantity: 1,
        stepQuantity: 1,
      });
    }
  }, [product, initialStoreType, isOpen]);

  // Sync selling unit and quantity changes to the active store settings object
  const updateSellingUnitForStore = (
    targetStore: AdminStoreType,
    unit: 'vial' | 'kit',
    vials: number,
    minQty: number = minQuantity,
    stepQty: number = stepQuantity
  ) => {
    if (targetStore === 'groupbuy') {
      setGroupBuySettings((prev) => ({
        ...(prev || {
          batchId: 'gb-batch-1',
          batchName: 'Batch #1 Allocation',
          batchStatus: 'Active Collection',
          batchVisibility: 'Public',
          closingDate: '2026-08-31',
        }),
        sellingUnit: unit,
        vialsPerKit: unit === 'kit' ? vials : undefined,
        minQuantity: minQty,
        stepQuantity: stepQty,
        minOrder: minQty,
        orderStep: stepQty,
      }));
    } else if (targetStore === 'onhand') {
      setOnHandSettings((prev) => ({
        ...(prev || {
          inventoryQuantity: 200,
          lowStockThreshold: 30,
          dispatchTime: 'Same-Day Cold Dispatch (24H)',
        }),
        sellingUnit: unit,
        vialsPerKit: unit === 'kit' ? vials : undefined,
        minQuantity: minQty,
        stepQuantity: stepQty,
        minOrder: minQty,
        orderStep: stepQty,
      }));
    } else if (targetStore === 'moq') {
      setMoqSettings((prev) => ({
        ...(prev || {
          moqTarget: 100,
          currentProgress: 10,
          productionStatus: 'Collecting Orders',
        }),
        sellingUnit: unit,
        vialsPerKit: unit === 'kit' ? vials : undefined,
        minQuantity: minQty,
        stepQuantity: stepQty,
        minOrder: minQty,
        orderStep: stepQty,
      }));
    }
  };

  const handleStoreTypeChange = (newStore: AdminStoreType) => {
    // Save current modal inputs into current store settings before switching
    updateSellingUnitForStore(storeType, sellingUnit, vialsPerKit, minQuantity, stepQuantity);
    setStoreType(newStore);
    
    // Load newStore selling unit and quantity settings
    const storeCfg = getStoreQuantityConfig(
      {
        ...product,
        groupBuySettings,
        onHandSettings,
        moqSettings,
      },
      newStore
    );
    setSellingUnit(storeCfg.sellingUnit);
    setVialsPerKit(storeCfg.vialsPerKit);
    setMinQuantity(storeCfg.minQuantity);
    setStepQuantity(storeCfg.stepQuantity);
  };

  const handleSellingUnitChange = (newUnit: 'vial' | 'kit') => {
    setSellingUnit(newUnit);
    updateSellingUnitForStore(storeType, newUnit, vialsPerKit, minQuantity, stepQuantity);
  };

  const handleVialsPerKitChange = (newVials: number) => {
    const v = Math.max(1, newVials);
    setVialsPerKit(v);
    updateSellingUnitForStore(storeType, sellingUnit, v, minQuantity, stepQuantity);
  };

  const handleMinQuantityChange = (min: number) => {
    const m = Math.max(1, min);
    setMinQuantity(m);
    updateSellingUnitForStore(storeType, sellingUnit, vialsPerKit, m, stepQuantity);
  };

  const handleStepQuantityChange = (step: number) => {
    const s = Math.max(1, step);
    setStepQuantity(s);
    updateSellingUnitForStore(storeType, sellingUnit, vialsPerKit, minQuantity, s);
  };

  // Ensure active tab doesn't point to 'store' or 'media' if storeType === 'groupbuy'
  useEffect(() => {
    if (isGroupBuy && (activeTab === 'store' || activeTab === 'media')) {
      setActiveTab('general');
    }
  }, [storeType, isGroupBuy, activeTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Product Name is required.');
      return;
    }

    if (sellingUnit === 'kit' && (!vialsPerKit || vialsPerKit <= 0)) {
      alert('Vials Per Kit must be a number greater than 0 when "Per Kit" selling unit is selected.');
      return;
    }

    setIsSaving(true);

    try {
      // Prepare store-specific settings ensuring active store has updated sellingUnit/vialsPerKit/minQuantity/stepQuantity
      const finalGbSettings = groupBuySettings ? {
        ...groupBuySettings,
        ...(storeType === 'groupbuy' ? { sellingUnit, vialsPerKit: sellingUnit === 'kit' ? vialsPerKit : undefined, minQuantity, stepQuantity, minOrder: minQuantity, orderStep: stepQuantity } : {})
      } : (storeType === 'groupbuy' ? {
        batchId: 'gb-batch-1',
        batchName: 'Batch #1 Allocation',
        batchStatus: 'Active Collection' as const,
        batchVisibility: 'Public' as const,
        closingDate: '2026-08-31',
        sellingUnit,
        vialsPerKit: sellingUnit === 'kit' ? vialsPerKit : undefined,
        minQuantity,
        stepQuantity,
        minOrder: minQuantity,
        orderStep: stepQuantity,
      } : undefined);

      const finalOhSettings = onHandSettings ? {
        ...onHandSettings,
        ...(storeType === 'onhand' ? { sellingUnit, vialsPerKit: sellingUnit === 'kit' ? vialsPerKit : undefined, minQuantity, stepQuantity, minOrder: minQuantity, orderStep: stepQuantity } : {})
      } : (storeType === 'onhand' ? {
        inventoryQuantity: 200,
        lowStockThreshold: 30,
        dispatchTime: 'Same-Day Cold Dispatch (24H)',
        sellingUnit,
        vialsPerKit: sellingUnit === 'kit' ? vialsPerKit : undefined,
        minQuantity,
        stepQuantity,
        minOrder: minQuantity,
        orderStep: stepQuantity,
      } : undefined);

      const finalMoqSettings = moqSettings ? {
        ...moqSettings,
        ...(storeType === 'moq' ? { sellingUnit, vialsPerKit: sellingUnit === 'kit' ? vialsPerKit : undefined, minQuantity, stepQuantity, minOrder: minQuantity, orderStep: stepQuantity } : {})
      } : (storeType === 'moq' ? {
        moqTarget: 100,
        currentProgress: 10,
        productionStatus: 'Collecting Orders',
        sellingUnit,
        vialsPerKit: sellingUnit === 'kit' ? vialsPerKit : undefined,
        minQuantity,
        stepQuantity,
        minOrder: minQuantity,
        orderStep: stepQuantity,
      } : undefined);

      const payload: any = {
        name,
        shortDescription,
        category,
        casNumber,
        storeType,
        sellingUnit,
        vialsPerKit: sellingUnit === 'kit' ? vialsPerKit : undefined,
        minQuantity,
        stepQuantity,
        minOrder: minQuantity,
        orderStep: stepQuantity,
        price: variants.length > 0 ? variants[0].price : price,
        currency,
        status,
        isVisible,
        isFeatured,
        imageUrl: imageUrl.trim() ? imageUrl.trim() : undefined,
        adminNotes,
        variants,
        groupBuySettings: finalGbSettings,
        onHandSettings: finalOhSettings,
        moqSettings: finalMoqSettings,
      };

      if (isEditMode && product) {
        payload.id = product.id;
      }

      await onSave(payload);
      setIsSaving(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-sans animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,217,255,0.25)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                {isEditMode
                  ? `Edit ${isGroupBuy ? 'GroupBuy Pre-Order' : 'Product'}: ${product?.name}`
                  : `Create New ${isGroupBuy ? 'GroupBuy Pre-Order' : 'Product'}`}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {isGroupBuy
                  ? 'GroupBuy Pre-Order Product Form (No inventory, no batch settings).'
                  : 'Catalog manager for OnHand & MOQ store modules.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-white/10 bg-slate-950/50 flex flex-wrap gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 border-b-2 font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-[#00D9FF] text-[#00D9FF]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            1. General & Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`px-4 py-2 border-b-2 font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'variants'
                ? 'border-[#00D9FF] text-[#00D9FF]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            2. Variants ({variants.length})
          </button>

          {!isGroupBuy && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('store')}
                className={`px-4 py-2 border-b-2 font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'store'
                    ? 'border-[#00D9FF] text-[#00D9FF]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                3. Store Settings ({storeType.toUpperCase()})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`px-4 py-2 border-b-2 font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'media'
                    ? 'border-[#00D9FF] text-[#00D9FF]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                4. Media Assets
              </button>
            </>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-6 flex-1 font-mono text-xs">
          {/* TAB 1: GENERAL & DETAILS */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Store & Status Header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">STORE TYPE</label>
                  <select
                    value={storeType}
                    onChange={(e) => handleStoreTypeChange(e.target.value as AdminStoreType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-[#00D9FF]/40 text-[#00D9FF] font-bold focus:outline-none"
                  >
                    <option value="groupbuy">GroupBuy Store (Pre-Order)</option>
                    <option value="onhand">OnHand Store (Immediate Stock)</option>
                    <option value="moq">MOQ Store (Bulk Contract)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">PRODUCT STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AdminProductStatus)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white font-bold focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">Active or Inactive state.</p>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">VISIBILITY & FEATURED</label>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsVisible(!isVisible)}
                      className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                        isVisible
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                      }`}
                    >
                      {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {isVisible ? 'Visible' : 'Hidden'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFeatured(!isFeatured)}
                      className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-colors ${
                        isFeatured
                          ? 'bg-[#FF2ED1]/10 border-[#FF2ED1]/40 text-[#FF2ED1]'
                          : 'bg-slate-900 border-white/10 text-slate-400'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isFeatured ? 'Featured' : 'Standard'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Selling Unit Configuration */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-[#00D9FF]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <label className="text-[10px] text-[#00D9FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    SELLING UNIT & VIAL ARCHITECTURE ({storeType.toUpperCase()}) *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {sellingUnit === 'vial' ? '1 Unit = 1 Vial' : `1 Kit = ${vialsPerKit} Vials`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selling Unit Selection */}
                  <div>
                    <label className="text-[10px] text-slate-300 font-semibold block mb-1.5">
                      CONFIGURE SELLING UNIT
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSellingUnitChange('vial')}
                        className={`px-3 py-2 rounded-lg border font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                          sellingUnit === 'vial'
                            ? 'bg-[#00D9FF]/10 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>PER VIAL</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSellingUnitChange('kit')}
                        className={`px-3 py-2 rounded-lg border font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                          sellingUnit === 'kit'
                            ? 'bg-[#FF2ED1]/10 border-[#FF2ED1] text-[#FF2ED1] shadow-[0_0_15px_rgba(255,46,209,0.2)]'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>PER KIT</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      {sellingUnit === 'vial'
                        ? `Customer buys single vials in ${storeType.toUpperCase()}. 1 Qty = 1 Vial.`
                        : `Customer buys boxed kits in ${storeType.toUpperCase()}. 1 Qty = 1 Kit.`}
                    </p>
                  </div>

                  {/* Vials Per Kit Field */}
                  <div>
                    <label className="text-[10px] text-slate-300 font-semibold block mb-1.5">
                      VIALS PER KIT {sellingUnit === 'kit' ? '*' : '(Disabled)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      disabled={sellingUnit === 'vial'}
                      value={sellingUnit === 'vial' ? '' : vialsPerKit}
                      onChange={(e) => handleVialsPerKitChange(parseInt(e.target.value) || 10)}
                      placeholder={sellingUnit === 'vial' ? 'N/A (Per Vial Product)' : 'e.g., 10'}
                      className={`w-full px-3.5 py-2 rounded-lg bg-slate-900 border text-white font-mono font-bold text-sm focus:outline-none ${
                        sellingUnit === 'vial'
                          ? 'opacity-40 border-white/5 cursor-not-allowed text-slate-500'
                          : 'border-white/20 focus:border-[#00D9FF]'
                      }`}
                    />
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      {sellingUnit === 'vial'
                        ? 'Not applicable for Per Vial items.'
                        : 'Number of vials included in 1 kit (e.g. 10, 5, 20).'}
                    </p>
                  </div>
                </div>

                {/* MOQ & Order Step Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-[10px] text-slate-300 font-semibold block mb-1.5 uppercase">
                      MINIMUM ORDER QUANTITY (MOQ)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={minQuantity}
                      onChange={(e) => handleMinQuantityChange(e.target.value === '' ? 0 : isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10))}
                      placeholder="e.g., 0, 1 or 3"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/20 text-white font-mono font-bold text-sm focus:outline-none focus:border-[#00D9FF]"
                    />
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Minimum number of {sellingUnit === 'kit' ? 'kits' : 'vials'} required to place an order in {storeType.toUpperCase()}.
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-300 font-semibold block mb-1.5 uppercase">
                      ORDER STEP QUANTITY
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={stepQuantity}
                      onChange={(e) => handleStepQuantityChange(parseInt(e.target.value) || 1)}
                      placeholder="e.g., 1 or 2"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/20 text-white font-mono font-bold text-sm focus:outline-none focus:border-[#00D9FF]"
                    />
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Quantity step increments (e.g., step 2 allows {minQuantity}, {minQuantity + stepQuantity}, {minQuantity + stepQuantity * 2}...).
                    </p>
                  </div>
                </div>
              </div>

              {/* Display Name, Category & CAS Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    PRODUCT DISPLAY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Tirzepatide"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-[#00D9FF]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Public product title shown on customer page.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">CATEGORY</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Active, GLP-1 Research"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Store grouping category.</p>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">CAS REGISTRY NUMBER</label>
                  <input
                    type="text"
                    value={casNumber}
                    onChange={(e) => setCasNumber(e.target.value)}
                    placeholder="e.g., 2023788-19-2"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:border-[#00D9FF]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">CAS identifier (optional).</p>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">SHORT DESCRIPTION</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g., Research peptide available for GroupBuy pre-order."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#00D9FF]"
                />
                <p className="text-[10px] text-slate-500 mt-1">Brief summary displayed on product cards.</p>
              </div>

              {/* Internal Admin Notes */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#FF2ED1]" />
                  INTERNAL ADMIN NOTES (Optional - Never shown to customers)
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Private operational notes, supplier contacts, or internal reference code..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 focus:outline-none focus:border-[#00D9FF]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Visible only to store managers in the admin portal.
                </p>
              </div>

              {/* Optional Product Image (Direct inside General for GroupBuy as requested) */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-slate-300 font-bold uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#00D9FF]" />
                    PRODUCT IMAGE (OPTIONAL)
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove Image
                    </button>
                  )}
                </div>

                <MediaInput
                  label="Product Vial Image"
                  value={imageUrl}
                  onChange={setImageUrl}
                  description="Upload a custom product image or pick from library. Leave empty if no image is available."
                />
              </div>

              {/* End of General Tab */}
            </div>
          )}

          {/* TAB 2: VARIANTS */}
          {activeTab === 'variants' && (
            <VariantEditor
              variants={variants}
              onChange={setVariants}
              currency={currency}
              storeType={storeType}
              hasVariantInventory={capabilities.variantInventory}
              productName={name}
            />
          )}

          {/* TAB 3: STORE SETTINGS (OnHand / MOQ Only) */}
          {activeTab === 'store' && !isGroupBuy && (
            <StoreSettingsEditor
              storeType={storeType}
              groupBuySettings={groupBuySettings}
              onHandSettings={onHandSettings}
              moqSettings={moqSettings}
              onChangeGroupBuy={setGroupBuySettings}
              onChangeOnHand={setOnHandSettings}
              onChangeMoq={setMoqSettings}
            />
          )}

          {/* TAB 4: MEDIA ASSETS (OnHand / MOQ Only) */}
          {activeTab === 'media' && !isGroupBuy && (
            <div className="space-y-4 p-4 rounded-xl bg-slate-950/90 border border-white/10">
              <MediaInput
                label="Primary Product Image"
                value={imageUrl}
                onChange={setImageUrl}
                description="Upload a high-resolution product vial image directly from your device or select an existing asset from the media library."
              />
            </div>
          )}

          {/* Submit Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400">
              Mode: <strong className="text-white">{isEditMode ? 'EDIT' : 'CREATE NEW'}</strong>
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 rounded-lg bg-[#00D9FF] text-black font-bold hover:bg-[#00D9FF]/90 transition-colors shadow-[0_0_20px_rgba(0,217,255,0.4)] flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'SAVING...' : isEditMode ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
