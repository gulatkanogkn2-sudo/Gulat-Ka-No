import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProductGallery } from '../../components/product/ProductGallery';
import { PriceDisplay } from '../../components/product/PriceDisplay';
import { VariantSelector, ProductVariant } from '../../components/product/VariantSelector';
import { QuantitySelector } from '../../components/product/QuantitySelector';
import { AddToCartButton } from '../../components/product/AddToCartButton';
import { StoreProductAddonWidget } from '../../components/product/StoreProductAddonWidget';
import { ProductService, DetailedProduct } from '../../services/productService';
import { GroupBuyService } from '../../services/groupBuyService';
import { systemSettingsService } from '../../services/systemSettingsService';
import { StoreAccent } from '../../components/store/StoreStatusBadge';
import { useCart } from '../../context/CartContext';
import { getStoreSellingUnitConfig, getStoreQuantityConfig, snapToValidQuantity } from '../../utils/vialCalculation';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'handling'>('overview');

  const [isGroupBuyOpen, setIsGroupBuyOpen] = useState<boolean>(() => GroupBuyService.isStoreOpen());

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    if (id) {
      ProductService.getProductById(id).then((data) => {
        if (isMounted) {
          setProduct(data);
          if (data && data.variants && data.variants.length > 0) {
            const first = data.variants[0];
            setSelectedVariantId(typeof first === 'string' ? first : first.id);
          }
          if (data) {
            const storeCfg = getStoreQuantityConfig(data, data.storeType || 'groupbuy');
            setQuantity(storeCfg.minQuantity);
          }
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    const unsubscribe = systemSettingsService.subscribe(() => {
      setIsGroupBuyOpen(GroupBuyService.isStoreOpen());
    });
    return () => unsubscribe();
  }, []);

  // Redirect attempting to access a GroupBuy product while CLOSED to the existing GroupBuy Closed page
  useEffect(() => {
    if (!isLoading && product && (product.storeType === 'groupbuy' || !product.storeType) && !isGroupBuyOpen) {
      navigate('/groupbuy', { replace: true });
    }
  }, [product, isLoading, isGroupBuyOpen, navigate]);

  if (isLoading) {
    return (
      <PageContainer title="Loading Product..." description="Retrieving product analytical records...">
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-[#00D9FF]/30 border-t-[#00D9FF] rounded-full animate-spin" />
          <p className="text-sm font-mono text-slate-400">LOADING PRODUCT SPECIFICATIONS...</p>
        </div>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer title="Product Not Found" description="The requested product specification could not be located.">
        <Card variant="glass" className="text-center py-16 space-y-6 max-w-xl mx-auto border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Catalog Product Unlisted</h2>
            <p className="text-sm text-slate-400">
              The product identifier <span className="font-mono text-red-300">{id}</span> does not match any current GroupBuy, OnHand, or MOQ entries.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)} className="border-white/20 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Store Catalog
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const storeAccent: StoreAccent =
    product.storeType === 'onhand'
      ? 'purple'
      : product.storeType === 'moq'
      ? 'magenta'
      : 'cyan';

  const storePath =
    product.storeType === 'onhand'
      ? '/onhand'
      : product.storeType === 'moq'
      ? '/moq'
      : '/groupbuy';

  const storeName =
    product.storeType === 'onhand'
      ? 'OnHand Store'
      : product.storeType === 'moq'
      ? 'MOQ Store'
      : 'GroupBuy Store';

  // Calculate current price based on selected variant if variant price is present
  const selectedVariantObj: ProductVariant | null =
    product.variants
      ?.map((v) => (typeof v === 'string' ? { id: v, label: v } : v))
      .find((v) => v.id === selectedVariantId) || null;

  const currentPrice = selectedVariantObj?.price || product.price;

  const targetStore = product.storeType || 'groupbuy';
  const storeCfg = getStoreQuantityConfig(product, targetStore);
  const maxAllowedQty =
    product.storeType === 'moq' && product.moqRemaining !== undefined
      ? Math.max(1, product.moqRemaining)
      : product.maxQuantity || 999;

  const handleAddToCart = () => {
    setIsAdded(true);
    const validQty = snapToValidQuantity(quantity, storeCfg.minQuantity, storeCfg.stepQuantity, maxAllowedQty);
    addItem({
      id: `${product.id}-${selectedVariantId || 'default'}`,
      productId: product.id,
      name: product.name,
      variantId: selectedVariantId || 'default',
      variantLabel: selectedVariantObj?.label || selectedVariantId || 'Standard',
      storeType: targetStore,
      price: currentPrice,
      originalPrice: product.originalPrice,
      currency: product.currency || '$',
      unitInfo: product.unitInfo,
      sellingUnit: storeCfg.sellingUnit,
      vialsPerKit: storeCfg.vialsPerKit,
      imageUrl: product.imageUrl,
      quantity: validQty,
      minQuantity: storeCfg.minQuantity,
      maxQuantity: maxAllowedQty,
      stepQuantity: storeCfg.stepQuantity,
      purity: product.purity,
      casNumber: product.casNumber,
    });
    setTimeout(() => setIsAdded(false), 2500);
  };

  const accentText: Record<StoreAccent, string> = {
    cyan: 'text-[#00D9FF]',
    purple: 'text-[#8B5CF6]',
    magenta: 'text-[#FF2ED1]',
  };

  const accentBorder: Record<StoreAccent, string> = {
    cyan: 'border-[#00D9FF]/30',
    purple: 'border-[#8B5CF6]/30',
    magenta: 'border-[#FF2ED1]/30',
  };

  const activeTabClass: Record<StoreAccent, string> = {
    cyan: 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/40',
    purple: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40',
    magenta: 'bg-[#FF2ED1]/20 text-[#FF2ED1] border-[#FF2ED1]/40',
  };

  return (
    <PageContainer
      title={product.name}
      description={`${storeName} entry`}
      actions={
        <div className="flex items-center gap-3">
          <Link to={storePath}>
            <Button variant="outline" size="sm" className="border-white/20 text-slate-300 hover:bg-white/10 text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to {storeName}
            </Button>
          </Link>
          <Badge variant={storeAccent} glow>
            {product.storeType?.toUpperCase()}
          </Badge>
        </div>
      }
    >
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to={storePath} className="hover:text-white transition-colors">
          {storeName}
        </Link>
        <span>/</span>
        <span className={accentText[storeAccent]}>{product.name}</span>
      </div>

      {/* Main Product View: Gallery & Purchase Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <ProductGallery
            images={product.gallery}
            mainImage={product.imageUrl}
            productName={product.name}
            accent={storeAccent}
          />
        </div>

        {/* Right Column: Product Details & Controls */}
        <div className="lg:col-span-6 space-y-6">
          <Card variant="glass" className={`p-6 sm:p-8 space-y-6 border ${accentBorder[storeAccent]}`}>
            {/* Product Title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Display */}
            <div className="py-2 border-y border-white/5">
              <PriceDisplay
                price={currentPrice}
                quantity={quantity}
                accent={storeAccent}
              />
            </div>

            {/* MOQ Progress Section (MOQ Store) */}
            {product.storeType === 'moq' && (
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/90 border border-[#FF2ED1]/30 font-mono text-xs">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Badge variant="magenta" glow className="text-[10px]">MOQ Progress</Badge>
                  </span>
                  <span className="text-[#FF2ED1]">
                    {product.moqCurrent ?? 0} / {product.moqTarget ?? 50} Kits ({product.moqProgressPercent ?? 0}%)
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF2ED1] via-[#8B5CF6] to-[#00D9FF] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,46,209,0.5)]"
                    style={{ width: `${Math.min(100, Math.max(0, product.moqProgressPercent ?? 0))}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] pt-0.5">
                  {(product.moqRemaining !== undefined && product.moqRemaining <= 0) || (product.moqProgressPercent !== undefined && product.moqProgressPercent >= 100) ? (
                    <span className="font-bold text-[#FF2ED1] tracking-wider">MOQ TARGET REACHED</span>
                  ) : (
                    <span className="text-slate-300">
                      <strong className="text-white">{product.moqRemaining ?? 0}</strong> Kits Remaining
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Variant Selector (Hidden for MOQ Store) */}
            {product.storeType !== 'moq' && product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariantId}
                  onChange={setSelectedVariantId}
                  accent={storeAccent}
                />
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Select Quantity
              </label>
              <QuantitySelector
                showLabel={false}
                value={quantity}
                onChange={setQuantity}
                min={storeCfg.minQuantity}
                max={maxAllowedQty}
                step={storeCfg.stepQuantity}
                accent={storeAccent}
              />
            </div>

            {/* Add to Cart Button */}
            <div className="pt-2">
              <AddToCartButton
                onClick={handleAddToCart}
                disabled={
                  product.status === 'Out of Stock' ||
                  product.status === 'Batch Closed' ||
                  (product.storeType === 'moq' &&
                    ((product.moqRemaining !== undefined && product.moqRemaining <= 0) ||
                      (product.moqProgressPercent !== undefined && product.moqProgressPercent >= 100)))
                }
                accent={storeAccent}
                label={
                  product.storeType === 'moq' &&
                  ((product.moqRemaining !== undefined && product.moqRemaining <= 0) ||
                    (product.moqProgressPercent !== undefined && product.moqProgressPercent >= 100))
                    ? 'MOQ TARGET REACHED'
                    : 'Add to Cart'
                }
                isAdded={isAdded}
              />
              {isAdded && (
                <p className={`text-xs font-mono text-center mt-2 flex items-center justify-center gap-1.5 ${accentText[storeAccent]}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Item added to cart
                </p>
              )}
            </div>

            {/* Store Product Add-Ons / Related Product System */}
            <StoreProductAddonWidget
              productId={product.id}
              storeType={product.storeType || 'groupbuy'}
              parentQuantity={quantity}
            />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
