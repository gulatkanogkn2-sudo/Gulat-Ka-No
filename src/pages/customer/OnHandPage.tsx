import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { OnHandHeader } from '../../components/onhand/OnHandHeader';
import { OnHandToolbar } from '../../components/onhand/OnHandToolbar';
import { ProductGrid } from '../../components/product';
import { StoreCartSummary } from '../../components/cart/StoreCartSummary';
import { OnHandService } from '../../services/onHandService';
import { OnHandHeaderInfo, OnHandProduct } from '../../types/onHand';

export const OnHandPage: React.FC = () => {
  const [headerInfo, setHeaderInfo] = useState<OnHandHeaderInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<OnHandProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'peptides', label: 'Peptides' },
    { id: 'standards', label: 'Standards' },
  ];

  useEffect(() => {
    let isMounted = true;
    OnHandService.getHeaderInfo().then((info) => {
      if (isMounted) {
        setHeaderInfo(info);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    OnHandService.getProducts({
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
  }, [searchTerm, selectedCategory]);

  return (
    <PageContainer title="OnHand Store">
      <div className="space-y-6">
        {/* OnHand Simple Fulfillment Notice Header */}
        <OnHandHeader info={headerInfo || undefined} />

        <div className="space-y-6">
          <OnHandToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          {/* Store Cart Summary */}
          <StoreCartSummary storeType="onhand" />

          {/* Product Grid */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            emptyTitle="No products match your search."
            emptyDescription="There are currently no items matching your filter criteria."
            emptyActionText="RESET FILTERS"
            onEmptyAction={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            accent="purple"
          />
        </div>
      </div>
    </PageContainer>
  );
};
