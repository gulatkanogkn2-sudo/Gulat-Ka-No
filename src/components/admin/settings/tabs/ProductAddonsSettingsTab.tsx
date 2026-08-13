import React, { useState, useEffect, useRef } from 'react';
import { ProductAddonRelationship, AddonRuleType, AddonScopeType } from '../../../../types/productAddon';
import { productAddonService } from '../../../../services/productAddonService';
import { ProductManagementService } from '../../../../services/productManagementService';
import { mediaLibraryService } from '../../../../services/mediaLibraryService';
import { AdminProduct, AdminProductVariant } from '../../../../types/adminProduct';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { SettingSelect } from '../common/SettingSelect';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { ConfirmModal } from '../../../common/ConfirmModal';
import { StoreType } from '../../../../types';
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  Info,
  Check,
  Layers,
  AlertCircle,
  Upload,
  RefreshCw,
  Search,
} from 'lucide-react';

interface UnifiedAddonFormState extends Partial<AdminProduct> {
  // Relationship & Rule Settings
  relationshipName?: string;
  storeScope?: StoreType | 'all';
  applyScope?: AddonScopeType;
  parentProductIds?: string[];
  excludedProductIds?: string[];
  ruleType?: AddonRuleType;
  excessUnitFeePhp?: number;
  maxRelatedQty?: number;
}

export const ProductAddonsSettingsTab: React.FC = () => {
  const [addons, setAddons] = useState<ProductAddonRelationship[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File Input Ref for Device Upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Unified Supply Product + Relationship Modal State
  const [editingSupplyProduct, setEditingSupplyProduct] = useState<UnifiedAddonFormState | null>(null);
  const [deletingSupplyProductId, setDeletingSupplyProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [parentSearchTerm, setParentSearchTerm] = useState<string>('');

  // Variant Modal / Inline Sub-Form State
  const [editingVariant, setEditingVariant] = useState<Partial<AdminProductVariant> | null>(null);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await ProductManagementService.getProducts({ pageSize: 200 });
    setProducts(res.products);
    const validIds = res.products.map((p) => p.id);
    setAddons([...productAddonService.getAddons(validIds)]);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Supply products filtered from main product catalog
  const supplyProducts = products.filter(
    (p) =>
      p.category === 'Reconstitution & Supplies' ||
      p.category === 'Add-On / Supply' ||
      p.category === 'Supplies' ||
      p.id.startsWith('prod-bac-') ||
      p.id.startsWith('prod-syr-') ||
      p.id.includes('supply') ||
      p.id.includes('addon') ||
      addons.some((a) => a.relatedProductId === p.id)
  );

  // Device File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image file size exceeds 5MB limit. Please select a smaller image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        if (dataUrl && editingSupplyProduct) {
          setEditingSupplyProduct({
            ...editingSupplyProduct,
            imageUrl: dataUrl,
          });
          
          // Register in Global Media Library Service
          try {
            mediaLibraryService.uploadAsset({
              name: file.name,
              title: editingSupplyProduct.name ? `${editingSupplyProduct.name} Image` : file.name,
              category: 'Products',
              url: dataUrl,
              fileSizeBytes: file.size,
              mimeType: file.type || 'image/png',
              uploadedBy: 'Admin Lead (GKN System)',
            });
          } catch (mediaErr) {
            console.error('Failed to register image in Media Library:', mediaErr);
          }

          setFormError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // =========================================================================
  // UNIFIED ADD-ON PRODUCT & RELATIONSHIP MANAGEMENT
  // =========================================================================

  const handleOpenCreateSupplyProduct = () => {
    setEditingSupplyProduct({
      id: `prod-supply-${Date.now().toString().slice(-6)}`,
      name: '',
      shortDescription: '',
      category: 'Reconstitution & Supplies',
      storeType: 'groupbuy',
      price: 0,
      currency: '₱',
      status: 'Active',
      isVisible: true,
      isFeatured: false,
      imageUrl: '',
      variants: [],
      // Default Relationship & Rule Settings
      relationshipName: '',
      storeScope: 'groupbuy',
      applyScope: 'ENTIRE_STORE',
      parentProductIds: [],
      excludedProductIds: [],
      ruleType: 'RULE_E',
      excessUnitFeePhp: 50,
      maxRelatedQty: 10,
    });
    setFormError(null);
    setIsSaving(false);
    setParentSearchTerm('');
    setEditingVariant(null);
    setEditingVariantIndex(null);
  };

  const handleOpenEditSupplyProduct = (prod: AdminProduct) => {
    const existingRel = addons.find((a) => a.relatedProductId === prod.id);

    setEditingSupplyProduct({
      ...prod,
      variants: prod.variants ? [...prod.variants] : [],
      // Prefill relationship settings if available
      relationshipName: existingRel?.name || `${prod.name} Relationship`,
      storeScope: existingRel?.store || 'groupbuy',
      applyScope: existingRel?.scope || 'ENTIRE_STORE',
      parentProductIds: existingRel?.parentProductIds || (existingRel?.parentProductId ? [existingRel.parentProductId] : []),
      excludedProductIds: existingRel?.excludedProductIds || [],
      ruleType: existingRel?.ruleType || 'RULE_E',
      excessUnitFeePhp: existingRel?.excessUnitFeePhp ?? existingRel?.extraUnitPricePhp ?? 50,
      maxRelatedQty: existingRel?.maxRelatedQty || 10,
    });
    setFormError(null);
    setIsSaving(false);
    setParentSearchTerm('');
    setEditingVariant(null);
    setEditingVariantIndex(null);
  };

  const handleSaveSupplyProduct = async () => {
    if (!editingSupplyProduct) return;
    setFormError(null);

    // 1. Validation
    const trimmedName = (editingSupplyProduct.name || '').trim();
    if (!trimmedName) {
      setFormError('Product Name is required. Please enter a descriptive name for the add-on product.');
      return;
    }

    const vars = editingSupplyProduct.variants || [];
    if (vars.length === 0) {
      setFormError('At least one product size/pack variant is required (e.g. 3mL, 5mL, 10mL, 30mL). Click "+ Add Variant" below.');
      return;
    }

    // Validate variant names and prices
    const seenVariantNames = new Set<string>();
    for (const v of vars) {
      const vName = (v.name || '').trim();
      if (!vName) {
        setFormError('All product variants must have a non-empty Variant Name.');
        return;
      }
      const lower = vName.toLowerCase();
      if (seenVariantNames.has(lower)) {
        setFormError(`Duplicate variant name "${vName}" detected. Variant names within the same product must be unique.`);
        return;
      }
      seenVariantNames.add(lower);

      if (typeof v.price !== 'number' || isNaN(v.price) || v.price < 0) {
        setFormError(`Please specify a valid numeric price for variant "${vName}".`);
        return;
      }
    }

    setIsSaving(true);

    try {
      const basePrice = vars[0]?.price ?? 0;

      const payload: Omit<AdminProduct, 'lastUpdated'> = {
        id: editingSupplyProduct.id || `prod-supply-${Date.now().toString().slice(-6)}`,
        name: trimmedName,
        shortDescription: editingSupplyProduct.shortDescription?.trim() || 'Essential research supply item.',
        fullDescription: editingSupplyProduct.shortDescription?.trim() || 'Essential research supply item.',
        category: 'Reconstitution & Supplies',
        storeType: editingSupplyProduct.storeScope !== 'all' ? (editingSupplyProduct.storeScope as any) : 'groupbuy',
        price: basePrice,
        currency: '₱',
        status: editingSupplyProduct.status || 'Active',
        isVisible: editingSupplyProduct.status === 'Active',
        isFeatured: editingSupplyProduct.isFeatured || false,
        imageUrl: editingSupplyProduct.imageUrl || '',
        variants: vars,
        groupBuySettings: editingSupplyProduct.groupBuySettings || { sellingUnit: 'vial', minQuantity: 1 },
        onHandSettings: editingSupplyProduct.onHandSettings || { inventoryQuantity: 500, sellingUnit: 'vial', minQuantity: 1 },
        moqSettings: editingSupplyProduct.moqSettings || { moqTarget: 50, sellingUnit: 'vial', minQuantity: 1 },
      };

      const existingProdIndex = products.findIndex((p) => p.id === payload.id);

      if (existingProdIndex >= 0) {
        await ProductManagementService.updateProduct(payload.id, payload);
      } else {
        await ProductManagementService.createProduct(payload);
      }

      // Save/update corresponding Relationship in productAddonService
      const existingRel = addons.find((a) => a.relatedProductId === payload.id);
      const relId = existingRel?.id || `addon-${Date.now().toString().slice(-6)}`;

      const relPayload: ProductAddonRelationship = {
        id: relId,
        enabled: payload.status === 'Active',
        name: editingSupplyProduct.relationshipName?.trim() || `${payload.name} Relationship`,
        scope: editingSupplyProduct.applyScope || 'ENTIRE_STORE',
        store: editingSupplyProduct.storeScope || 'groupbuy',
        relatedProductId: payload.id,
        relatedProductName: payload.name,
        defaultVariantId: vars[0]?.id || '',
        minRelatedQty: 1,
        maxRelatedQty: editingSupplyProduct.maxRelatedQty || 20,
        ruleType: editingSupplyProduct.ruleType || 'RULE_E',
        extraPricingBehavior: editingSupplyProduct.ruleType === 'RULE_E' ? 'ADDITIONAL_FEE' : 'NORMAL',
        extraUnitPricePhp: editingSupplyProduct.excessUnitFeePhp ?? 50,
        excessUnitFeePhp: editingSupplyProduct.excessUnitFeePhp ?? 50,
        parentProductIds: editingSupplyProduct.applyScope === 'SPECIFIC_PRODUCTS' ? (editingSupplyProduct.parentProductIds || []) : [],
        excludedProductIds: editingSupplyProduct.applyScope === 'ENTIRE_STORE' ? (editingSupplyProduct.excludedProductIds || []) : [],
        notes: `Configured in Add-On / Supply Product Catalog.`,
      };

      productAddonService.saveAddon(relPayload);

      showToast(
        existingProdIndex >= 0
          ? `Updated Add-On Product "${payload.name}" and assignment rules.`
          : `Created Add-On Product "${payload.name}" with store assignment rules.`
      );

      setEditingSupplyProduct(null);
      await loadData();
    } catch (err: any) {
      console.error('Failed to save Add-On product:', err);
      setFormError(err?.message || 'Unable to save Add-On product. Please check your inputs and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSupplyProduct = async () => {
    if (!deletingSupplyProductId) return;
    const prod = products.find((p) => p.id === deletingSupplyProductId);
    await ProductManagementService.deleteProduct(deletingSupplyProductId, 'all');
    productAddonService.deleteAddonsByRelatedProductId(deletingSupplyProductId);
    setDeletingSupplyProductId(null);
    showToast(`Deleted Add-On Product "${prod?.name || deletingSupplyProductId}".`);
    await loadData();
  };

  // Variant Editing inside Supply Modal
  const handleOpenAddVariant = () => {
    setEditingVariant({
      id: `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: '',
      price: 80,
      sku: '',
      inventoryQuantity: undefined,
    });
    setEditingVariantIndex(-1);
  };

  const handleOpenEditVariant = (variant: AdminProductVariant, index: number) => {
    setEditingVariant({ ...variant });
    setEditingVariantIndex(index);
  };

  const handleSaveVariant = () => {
    if (!editingVariant || !editingVariant.name?.trim()) {
      alert('Please enter a variant name (e.g. "3mL" or "10-Pack").');
      return;
    }

    const vName = editingVariant.name.trim();
    const vPrice = typeof editingVariant.price === 'number' ? editingVariant.price : parseFloat(editingVariant.price as any);

    if (isNaN(vPrice) || vPrice < 0) {
      alert('Please enter a valid price for this variant.');
      return;
    }

    if (!editingSupplyProduct) return;

    const currentVars = [...(editingSupplyProduct.variants || [])];

    // Check duplicate variant names
    const isDuplicate = currentVars.some(
      (v, idx) => v.name.trim().toLowerCase() === vName.toLowerCase() && idx !== editingVariantIndex
    );

    if (isDuplicate) {
      alert(`A variant named "${vName}" already exists for this product. Variant names must be unique.`);
      return;
    }

    // Process optional inventory quantity
    let invQty: number | undefined = undefined;
    if (
      editingVariant.inventoryQuantity !== undefined &&
      editingVariant.inventoryQuantity !== null &&
      (editingVariant.inventoryQuantity as any) !== ''
    ) {
      const parsed =
        typeof editingVariant.inventoryQuantity === 'number'
          ? editingVariant.inventoryQuantity
          : parseInt(editingVariant.inventoryQuantity as any, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        invQty = parsed;
      }
    }

    const newVar: AdminProductVariant = {
      id: editingVariant.id || `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: vName,
      price: vPrice,
      sku: editingVariant.sku?.trim() || `${(editingSupplyProduct.name || 'SUP').substring(0, 3).toUpperCase()}-${vName.toUpperCase().replace(/\s+/g, '-')}`,
      inventoryQuantity: invQty,
    };

    if (editingVariantIndex !== null && editingVariantIndex >= 0) {
      currentVars[editingVariantIndex] = newVar;
    } else {
      currentVars.push(newVar);
    }

    setEditingSupplyProduct({
      ...editingSupplyProduct,
      variants: currentVars,
      price: currentVars[0]?.price || editingSupplyProduct.price,
    });

    setEditingVariant(null);
    setEditingVariantIndex(null);
  };

  const handleDeleteVariant = (index: number) => {
    if (!editingSupplyProduct) return;
    const currentVars = [...(editingSupplyProduct.variants || [])];
    currentVars.splice(index, 1);
    setEditingSupplyProduct({
      ...editingSupplyProduct,
      variants: currentVars,
      price: currentVars[0]?.price || editingSupplyProduct.price,
    });
    if (editingVariantIndex === index) {
      setEditingVariant(null);
      setEditingVariantIndex(null);
    }
  };

  // Toggle Parent Product Selection in Unified Form
  const toggleSupplyParentProduct = (productId: string) => {
    if (!editingSupplyProduct) return;
    const current = editingSupplyProduct.parentProductIds || [];
    const updated = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    setEditingSupplyProduct({
      ...editingSupplyProduct,
      parentProductIds: updated,
    });
  };

  // Toggle Excluded Product Selection in Unified Form
  const toggleSupplyExcludedProduct = (productId: string) => {
    if (!editingSupplyProduct) return;
    const current = editingSupplyProduct.excludedProductIds || [];
    const updated = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    setEditingSupplyProduct({
      ...editingSupplyProduct,
      excludedProductIds: updated,
    });
  };

  const getRuleLabel = (rule?: AddonRuleType, fee?: number) => {
    switch (rule) {
      case 'RULE_A':
        return 'Rule A — Max Qty ≤ Parent Qty (1:1 Ratio Limit)';
      case 'RULE_B':
        return 'Rule B — Qty ≤ Parent Qty (Up To Parent)';
      case 'RULE_C':
        return 'Rule C — Max Allowed Qty Limit';
      case 'RULE_D':
        return 'Rule D — Unrestricted Qty';
      case 'RULE_E':
        return `Rule E — Excess Units Extra Fee (+₱${fee ?? 50}/unit)`;
      default:
        return 'Rule E — Excess Units Extra Fee';
    }
  };

  // Filtered parent products for selection inside unified modal
  const parentProductOptions = products.filter(
    (p) => p.id !== editingSupplyProduct?.id && p.category !== 'Reconstitution & Supplies'
  );

  const filteredParentProductOptions = parentProductOptions.filter((p) =>
    p.name.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(parentSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check size={16} className="text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Overview Header */}
      <div className="p-5 rounded-2xl bg-[#050810] border border-cyan-500/20 space-y-2">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Package size={18} className="text-cyan-400" />
          <span>Add-On & Supply Product Management</span>
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          Single source of truth for reconstitution supplies (Bacteriostatic Water, Syringes, Kits), store assignments, product links, and excess pricing rules.
        </p>
      </div>

      {/* SINGLE SOURCE OF TRUTH: ADD-ON & SUPPLY PRODUCTS CATALOG */}
      <SettingCard
        title="Add-On & Supply Products Catalog"
        description="Create and manage add-on products, variants, store assignments, auto-pairing rules, and pricing surcharges."
        badgeText="Single Source of Truth"
        badgeVariant="cyan"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-white/5">
            <div>
              <p className="text-xs font-mono text-slate-300 font-bold">Configured Supply & Add-On Items</p>
              <p className="text-[10px] font-mono text-slate-500">
                {supplyProducts.length} Add-On Product(s) Configured
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateSupplyProduct}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.2)] transition-all"
            >
              <Plus size={16} />
              <span>Create New Add-On Product</span>
            </button>
          </div>

          {supplyProducts.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#050810] border border-cyan-500/20 text-center space-y-3">
              <Package size={32} className="mx-auto text-cyan-400 opacity-60" />
              <p className="text-xs font-mono text-slate-300">No Add-On Products Created Yet</p>
              <p className="text-[10px] font-mono text-slate-500 max-w-md mx-auto">
                Create supply products like Bacteriostatic Water or Sterile Syringes to link with store peptide products.
              </p>
              <button
                type="button"
                onClick={handleOpenCreateSupplyProduct}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} />
                <span>Create First Add-On Product</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplyProducts.map((prod) => {
                const variantCount = prod.variants?.length || 1;
                const isEnabled = prod.status === 'Active';
                const rel = addons.find((a) => a.relatedProductId === prod.id);

                const storeLabel = rel?.store ? rel.store.toUpperCase() : (prod.storeType || 'GROUPBUY').toUpperCase();
                const isAllStores = rel?.store === 'all';

                let applyToText = 'ALL PRODUCTS';
                if (rel?.scope === 'SPECIFIC_PRODUCTS') {
                  const count = rel.parentProductIds?.length || 0;
                  applyToText = `SPECIFIC PRODUCTS (${count} selected)`;
                } else if (rel?.excludedProductIds && rel.excludedProductIds.length > 0) {
                  applyToText = `ALL PRODUCTS (${rel.excludedProductIds.length} excluded)`;
                }

                const ruleText = getRuleLabel(rel?.ruleType || 'RULE_E', rel?.excessUnitFeePhp ?? rel?.extraUnitPricePhp ?? 50);

                return (
                  <div
                    key={prod.id}
                    className={`p-4 rounded-2xl bg-[#050810] border transition-all space-y-3 ${
                      isEnabled ? 'border-cyan-500/30' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Product Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 flex items-center justify-center">
                        {prod.imageUrl ? (
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={24} className="text-cyan-400/60" />
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold uppercase">
                            ADD-ON / SUPPLY
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${
                              isEnabled
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                            }`}
                          >
                            {isEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[9px] font-mono font-bold uppercase">
                            STORE: {isAllStores ? 'ALL STORES' : storeLabel}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white font-mono truncate">{prod.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono line-clamp-1">
                          {prod.shortDescription || 'Essential reconstitution supply item.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <ToggleSwitch
                          checked={isEnabled}
                          onChange={async (val) => {
                            const newStatus = val ? 'Active' : 'Inactive';
                            await ProductManagementService.updateProduct(prod.id, {
                              status: newStatus,
                              isVisible: val,
                            });
                            if (rel) {
                              productAddonService.saveAddon({
                                ...rel,
                                enabled: val,
                              });
                            }
                            showToast(`Product "${prod.name}" ${val ? 'Enabled' : 'Disabled'}.`);
                            await loadData();
                          }}
                          size="sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleOpenEditSupplyProduct(prod)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/20 cursor-pointer"
                          title="Edit Add-On Product & Rules"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSupplyProductId(prod.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Configuration Summary Box */}
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5 text-[11px] font-mono">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-slate-400">
                          Apply To: <span className="text-cyan-300 font-bold">{applyToText}</span>
                        </span>
                        <span className="text-[#FF2ED1] font-bold">
                          Base ₱{prod.price.toLocaleString()} ({variantCount} Variant{variantCount !== 1 ? 's' : ''})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-amber-300 font-semibold pt-1 border-t border-white/5">
                        <Info size={13} className="shrink-0 text-amber-400" />
                        <span className="truncate">{ruleText}</span>
                      </div>

                      {/* Render variant list chips */}
                      {prod.variants && prod.variants.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {prod.variants.map((v) => (
                            <span
                              key={v.id || v.name}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] border border-white/5"
                            >
                              {v.name} — ₱{v.price.toLocaleString()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SettingCard>

      {/* =====================================================================
          UNIFIED MODAL: CREATE / EDIT ADD-ON PRODUCT
         ===================================================================== */}
      {editingSupplyProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#030712] border border-[#00D9FF]/30 rounded-3xl p-6 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Package size={18} className="text-[#00D9FF]" />
                <span>
                  {editingSupplyProduct.id && products.some((p) => p.id === editingSupplyProduct.id)
                    ? 'Edit Add-On Product'
                    : 'Create New Add-On Product'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSupplyProduct(null)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Error Alert Banner */}
            {formError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-400" />
                <div className="space-y-0.5">
                  <p className="font-bold">Unable to save Add-On Product</p>
                  <p className="text-slate-300">{formError}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* SECTION 1: PRODUCT INFORMATION */}
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                    1. Product Information
                  </h4>
                </div>

                {/* Product Name */}
                <SettingInput
                  label="Product Name *"
                  type="text"
                  placeholder="e.g. Bacteriostatic Water, Sterile Syringes, Reconstitution Kit"
                  value={editingSupplyProduct.name || ''}
                  onChange={(val) => setEditingSupplyProduct({ ...editingSupplyProduct, name: val })}
                  helperText="Full descriptive name of the add-on/supply product."
                />

                {/* Product Type & Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Product Type</label>
                    <input
                      type="text"
                      disabled
                      value="Add-On / Supply"
                      className="w-full h-10 bg-[#050810] border border-cyan-500/30 text-cyan-400 text-xs px-3.5 font-mono rounded-xl opacity-90"
                    />
                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      Categorized as Reconstitution & Supplies.
                    </p>
                  </div>

                  <SettingSelect
                    label="Status"
                    value={editingSupplyProduct.status || 'Active'}
                    onChange={(val) => setEditingSupplyProduct({ ...editingSupplyProduct, status: val as any })}
                    options={[
                      { value: 'Active', label: 'Enabled (Active)' },
                      { value: 'Inactive', label: 'Disabled (Hidden)' },
                    ]}
                    helperText="Disabled products will not be offered to customers."
                  />
                </div>

                {/* Short Description */}
                <SettingInput
                  label="Short Description (Optional)"
                  type="text"
                  placeholder="e.g. 30mL USP Grade Sterile Bacteriostatic Water"
                  value={editingSupplyProduct.shortDescription || ''}
                  onChange={(val) => setEditingSupplyProduct({ ...editingSupplyProduct, shortDescription: val })}
                  helperText="Brief details shown on product cards and checkout summaries."
                />

                {/* Upload Product Image (Device File Picker) */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Upload Product Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="addon-image-upload-input"
                  />

                  {editingSupplyProduct.imageUrl ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-[#050810] border border-cyan-500/30 rounded-2xl">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-900 flex items-center justify-center">
                        <img
                          src={editingSupplyProduct.imageUrl}
                          alt="Product Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                        <p className="text-xs font-mono text-cyan-400 font-semibold">Device Image Uploaded</p>
                        <p className="text-[10px] font-mono text-slate-400">
                          Selected from local device file storage.
                        </p>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload size={14} />
                            <span>Replace Image</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSupplyProduct({ ...editingSupplyProduct, imageUrl: '' })}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-5 border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 rounded-2xl bg-[#050810] hover:bg-cyan-950/20 text-center cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 group-hover:scale-110 transition-transform">
                        <Upload size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white font-mono">Click to Upload Product Image</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Select an image file directly from your device (PNG, JPG, WEBP)
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] font-mono text-slate-500">
                    Direct device file picker. Remote image URLs are strictly disabled.
                  </p>
                </div>
              </div>

              {/* SECTION 2: PRODUCT VARIANTS */}
              <div className="space-y-4 bg-[#050810] p-4.5 rounded-2xl border border-cyan-500/30">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                      <Layers size={14} className="text-[#FF2ED1]" />
                      <span>2. Product Size / Pack Variants</span>
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Configure size or pack variants (e.g. 3mL, 5mL, 10mL, 30mL). Unlimited variants supported.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddVariant}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Add Variant</span>
                  </button>
                </div>

                {/* Variant List Table */}
                {editingSupplyProduct.variants && editingSupplyProduct.variants.length > 0 ? (
                  <div className="space-y-2">
                    {editingSupplyProduct.variants.map((v, idx) => {
                      const hasStock = v.inventoryQuantity !== undefined && v.inventoryQuantity !== null && !isNaN(v.inventoryQuantity);
                      return (
                        <div
                          key={v.id || idx}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-xs"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <span className="font-bold text-white">{v.name}</span>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span>SKU: <span className="text-slate-300">{v.sku || 'N/A'}</span></span>
                              <span>•</span>
                              <span>
                                Stock:{' '}
                                <span className={hasStock ? 'text-cyan-300 font-bold' : 'text-slate-400 italic'}>
                                  {hasStock ? `${v.inventoryQuantity} units` : 'Unlimited / Untracked'}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <span className="font-bold text-[#FF2ED1]">₱{v.price.toLocaleString()}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditVariant(v, idx)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 cursor-pointer"
                                title="Edit Variant"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteVariant(idx)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                                title="Delete Variant"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs font-mono text-amber-400">No variants added yet. Click "+ Add Variant" above to define product options.</p>
                )}

                {/* Sub-Form for Add / Edit Variant */}
                {editingVariant && (
                  <div className="p-4 rounded-2xl bg-[#030712] border border-cyan-500/50 space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 font-mono">
                        {editingVariantIndex !== null && editingVariantIndex >= 0 ? 'Edit Variant' : 'New Variant'}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setEditingVariant(null); setEditingVariantIndex(null); }}
                        className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 uppercase font-mono mb-1">Variant Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. 3mL, 5mL, 10mL, 30mL"
                          value={editingVariant.name || ''}
                          onChange={(e) => setEditingVariant({ ...editingVariant, name: e.target.value })}
                          className="w-full h-10 bg-[#0A0F1D] border border-cyan-500/30 text-white text-xs px-3 rounded-xl font-mono focus:outline-none focus:border-[#00D9FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 uppercase font-mono mb-1">Price (₱) *</label>
                        <input
                          type="number"
                          placeholder="80"
                          value={editingVariant.price ?? ''}
                          onChange={(e) => setEditingVariant({ ...editingVariant, price: e.target.value === '' ? ('' as any) : parseFloat(e.target.value) })}
                          className="w-full h-10 bg-[#0A0F1D] border border-cyan-500/30 text-white text-xs px-3 rounded-xl font-mono focus:outline-none focus:border-[#00D9FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 uppercase font-mono mb-1">SKU (Optional)</label>
                        <input
                          type="text"
                          placeholder="BAC-WATER-3ML"
                          value={editingVariant.sku || ''}
                          onChange={(e) => setEditingVariant({ ...editingVariant, sku: e.target.value })}
                          className="w-full h-10 bg-[#0A0F1D] border border-cyan-500/30 text-white text-xs px-3 rounded-xl font-mono focus:outline-none focus:border-[#00D9FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 uppercase font-mono mb-1">
                          Inventory Quantity (Optional)
                        </label>
                        <input
                          type="number"
                          placeholder="Leave blank for unlimited"
                          value={editingVariant.inventoryQuantity ?? ''}
                          onChange={(e) =>
                            setEditingVariant({
                              ...editingVariant,
                              inventoryQuantity: e.target.value === '' ? ('' as any) : parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full h-10 bg-[#0A0F1D] border border-cyan-500/30 text-white text-xs px-3 rounded-xl font-mono focus:outline-none focus:border-[#00D9FF]"
                        />
                        <p className="text-[9px] font-mono text-slate-500 mt-1">
                          Leave blank if inventory is untracked or unlimited.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveVariant}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold font-mono hover:bg-cyan-400 cursor-pointer shadow-[0_0_10px_rgba(0,217,255,0.2)]"
                    >
                      Save Variant
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 3: STORE & PRODUCT ASSIGNMENT */}
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                    3. STORE & PRODUCT ASSIGNMENT
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SettingSelect
                    label="Target Store Scope"
                    value={editingSupplyProduct.storeScope || 'groupbuy'}
                    onChange={(val) => setEditingSupplyProduct({ ...editingSupplyProduct, storeScope: val as any })}
                    options={[
                      { value: 'groupbuy', label: 'GroupBuy Store Only', description: 'Isolates rule exclusively to GroupBuy catalog' },
                      { value: 'onhand', label: 'OnHand Store Only', description: 'Isolates rule exclusively to OnHand vault catalog' },
                      { value: 'moq', label: 'MOQ Bulk Store Only', description: 'Isolates rule exclusively to MOQ catalog' },
                      { value: 'all', label: 'ALL Stores (Universal)', description: 'Applies across GroupBuy, OnHand, and MOQ' },
                    ]}
                    helperText="Select which store channel this add-on product applies to."
                  />

                  <SettingSelect
                    label="Apply To (Link Scope)"
                    value={editingSupplyProduct.applyScope || 'ENTIRE_STORE'}
                    onChange={(val) => setEditingSupplyProduct({ ...editingSupplyProduct, applyScope: val as AddonScopeType })}
                    options={[
                      { value: 'ENTIRE_STORE', label: 'All Products in Store (Store-Wide Auto-Link)', description: 'Automatically inherits to ALL current AND future products created in this store.' },
                      { value: 'SPECIFIC_PRODUCTS', label: 'Specific Product(s)', description: 'Applies ONLY to explicitly selected parent products.' },
                    ]}
                    helperText="Store-wide auto-link ensures new store products automatically inherit this add-on."
                  />
                </div>

                {/* Conditional Scope Selector */}
                {editingSupplyProduct.applyScope === 'SPECIFIC_PRODUCTS' ? (
                  <div className="space-y-3 bg-[#050810] p-4 rounded-2xl border border-cyan-500/30">
                    <div className="flex items-center justify-between gap-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Select Parent Product(s) to Link To:
                      </label>
                      <span className="text-[10px] font-mono text-cyan-400">
                        {editingSupplyProduct.parentProductIds?.length || 0} Product(s) Selected
                      </span>
                    </div>

                    {/* Search filter for products */}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search parent products..."
                        value={parentSearchTerm}
                        onChange={(e) => setParentSearchTerm(e.target.value)}
                        className="w-full bg-[#030712] border border-white/10 text-white text-xs pl-9 pr-3 py-2 rounded-xl font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1.5 pt-1">
                      {filteredParentProductOptions.length > 0 ? (
                        filteredParentProductOptions.map((p) => {
                          const isChecked = editingSupplyProduct.parentProductIds?.includes(p.id) || false;
                          return (
                            <label
                              key={p.id}
                              className="flex items-center gap-2.5 text-xs font-mono text-slate-200 cursor-pointer hover:text-white p-1.5 rounded hover:bg-white/5"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleSupplyParentProduct(p.id)}
                                className="rounded border-cyan-500/40 text-cyan-500 focus:ring-0 cursor-pointer"
                              />
                              <span>{p.name} ({p.id})</span>
                            </label>
                          );
                        })
                      ) : (
                        <p className="text-xs font-mono text-slate-500 italic p-2">No matching products found.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-[#050810] p-4 rounded-2xl border border-cyan-500/30">
                    <label className="block text-xs font-semibold text-slate-300">
                      Store-Wide Auto-Inheritance Active
                    </label>
                    <p className="text-[10px] font-mono text-slate-400">
                      All products in the selected store will automatically inherit this add-on item. Check any products you wish to EXCLUDE from receiving this add-on:
                    </p>

                    <div className="max-h-40 overflow-y-auto space-y-1.5 pt-1">
                      {parentProductOptions.map((p) => {
                        const isExcluded = editingSupplyProduct.excludedProductIds?.includes(p.id) || false;
                        return (
                          <label
                            key={p.id}
                            className="flex items-center gap-2.5 text-xs font-mono text-slate-200 cursor-pointer hover:text-white p-1.5 rounded hover:bg-white/5"
                          >
                            <input
                              type="checkbox"
                              checked={isExcluded}
                              onChange={() => toggleSupplyExcludedProduct(p.id)}
                              className="rounded border-rose-500/40 text-rose-500 focus:ring-0 cursor-pointer"
                            />
                            <span className={isExcluded ? 'line-through text-rose-400' : ''}>
                              {p.name} ({p.id}) {isExcluded && '[EXCLUDED]'}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: QUANTITY & PRICING RULE */}
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                    4. QUANTITY & PRICING RULE
                  </h4>
                </div>

                {/* Quantity Rule Selection */}
                <SettingSelect
                  label="Quantity Rule"
                  value={editingSupplyProduct.ruleType || 'RULE_E'}
                  onChange={(val) => setEditingSupplyProduct({ ...editingSupplyProduct, ruleType: val as AddonRuleType })}
                  options={[
                    { value: 'RULE_A', label: 'Rule A: Add-on quantity cannot exceed parent quantity', description: 'Parent Qty 5 -> Max 5 add-ons' },
                    { value: 'RULE_B', label: 'Rule B: Add-on quantity can be equal to or less than parent quantity', description: 'Parent Qty 5 -> 1 to 5 add-ons allowed' },
                    { value: 'RULE_C', label: 'Rule C: Add-on quantity can exceed parent quantity up to max', description: 'Allows ordering up to configured max limit' },
                    { value: 'RULE_D', label: 'Rule D: No quantity constraint', description: 'Unrestricted add-on ordering' },
                    { value: 'RULE_E', label: 'Rule E: Excess units incur additional fee', description: 'Units exceeding parent quantity incur extra fee per unit' },
                  ]}
                  helperText="Select the logic enforced when customers add this item."
                />

                {/* Rule E Surcharge Config */}
                {editingSupplyProduct.ruleType === 'RULE_E' && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-300">
                      <Info size={16} />
                      <span>Rule E Surcharge Configuration</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Included Quantity Basis
                        </label>
                        <input
                          type="text"
                          disabled
                          value="Parent Quantity (1:1 Ratio)"
                          className="w-full h-10 bg-[#050810] border border-amber-500/30 text-amber-300 text-xs px-3.5 font-mono rounded-xl opacity-80"
                        />
                        <p className="text-[10px] font-mono text-slate-400 mt-1">
                          Add-on quantity up to parent quantity is charged standard price.
                        </p>
                      </div>

                      <SettingInput
                        label="Additional Fee Per Extra Unit (₱)"
                        type="number"
                        min="0"
                        step="1"
                        value={editingSupplyProduct.excessUnitFeePhp ?? 50}
                        onChange={(val) =>
                          setEditingSupplyProduct({
                            ...editingSupplyProduct,
                            excessUnitFeePhp: val === '' ? 0 : parseFloat(val),
                          })
                        }
                        helperText="Extra surcharge added for every unit exceeding parent quantity (e.g. ₱50 or ₱80)."
                        prefixText="₱"
                      />
                    </div>
                  </div>
                )}

                {editingSupplyProduct.ruleType === 'RULE_C' && (
                  <SettingInput
                    label="Maximum Allowed Add-On Quantity"
                    type="number"
                    min="1"
                    value={editingSupplyProduct.maxRelatedQty || 10}
                    onChange={(val) =>
                      setEditingSupplyProduct({ ...editingSupplyProduct, maxRelatedQty: parseInt(val, 10) || 10 })
                    }
                    helperText="Absolute cap on how many add-on units can be ordered."
                  />
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setEditingSupplyProduct(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 text-xs font-mono font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveSupplyProduct}
                className="px-5 py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/80 disabled:opacity-50 text-slate-950 text-xs font-mono font-bold cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.3)] flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Saving Add-On Product...</span>
                  </>
                ) : (
                  <span>Save Add-On Product</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Supply Product Modal */}
      <ConfirmModal
        isOpen={!!deletingSupplyProductId}
        onClose={() => setDeletingSupplyProductId(null)}
        onConfirm={handleDeleteSupplyProduct}
        title="Delete Add-On Product"
        message="Are you sure you want to delete this Add-On Product, its variants, and all store pairing rules associated with it?"
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
