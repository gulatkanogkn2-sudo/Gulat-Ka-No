import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { ActiveBatchBanner } from '../../components/groupbuy/ActiveBatchBanner';
import { GroupBuyToolbar } from '../../components/groupbuy/GroupBuyToolbar';
import { ProductGrid } from '../../components/product';
import { GroupBuyService } from '../../services/groupBuyService';
import { systemSettingsService } from '../../services/systemSettingsService';
import { GroupBuyBatch } from '../../types/groupBuy';
import { DetailedProduct } from '../../services/productService';
import { StoreCartSummary } from '../../components/cart/StoreCartSummary';
import { Lock, FileText, ArrowRight } from 'lucide-react';

export const GroupBuyPage: React.FC = () => {
  const [activeBatch, setActiveBatch] = useState<GroupBuyBatch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load Active Batch Information & Subscribe to Settings Changes
  useEffect(() => {
    let isMounted = true;

    const loadBatch = () => {
      GroupBuyService.getActiveBatch().then((batch) => {
        if (isMounted) {
          setActiveBatch(batch);
        }
      });
    };

    loadBatch();

    // Re-fetch batch status immediately when system settings are updated
    const unsubscribe = systemSettingsService.subscribe(() => {
      loadBatch();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const isStoreOpen = activeBatch
    ? (activeBatch.status === 'Open' || activeBatch.status === 'Closing Soon') &&
      activeBatch.isActive !== false
    : false;

  // Load Products with search and category filters when open
  useEffect(() => {
    let isMounted = true;
    if (!isStoreOpen) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    GroupBuyService.getProducts({
      search: searchTerm,
      category: selectedCategory,
    }).then((data) => {
      if (isMounted) {
        setProducts(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedCategory, isStoreOpen]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'peptides', label: 'Peptides' },
    { id: 'standards', label: 'Standards' },
  ];

  return (
    <PageContainer title="GroupBuy Store">
      <div className="space-y-6">
        {/* Active Batch Banner (Batch Number, Status, Countdown) */}
        {activeBatch && <ActiveBatchBanner batch={activeBatch} simplified />}

        {/* GroupBuy Catalog when OPEN vs Notice when CLOSED */}
        {isStoreOpen ? (
          <div className="space-y-6">
            <GroupBuyToolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />

            {/* Store Cart Summary */}
            <StoreCartSummary storeType="groupbuy" />

            {/* Product Cards Grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              emptyTitle="No products match your search."
              emptyDescription="There are currently no active products matching your filter criteria."
              emptyActionText="RESET FILTERS"
              onEmptyAction={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              accent="cyan"
            />
          </div>
        ) : (
          /* Closed Notice Card */
          <div className="max-w-2xl mx-auto my-8 p-8 sm:p-10 rounded-2xl bg-[#070B14]/90 border border-[#00D9FF]/30 text-center space-y-6 shadow-[0_0_30px_rgba(0,217,255,0.12)] backdrop-blur-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/40 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.2)]">
              <Lock className="w-8 h-8 text-[#00D9FF]" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-mono">
                GROUPBUY STORE IS CURRENTLY CLOSED
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                The current GroupBuy batch has ended.
              </p>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                Please wait for the next batch opening. You may still browse our Product Price List for available products and pricing.
              </p>
            </div>

            <div className="pt-3">
              <Link
                to="/research/price-list"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(0,217,255,0.4)] group"
              >
                <FileText className="w-4 h-4 text-black" />
                <span>BROWSE PRODUCT PRICE LIST</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
