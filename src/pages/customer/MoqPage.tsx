import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { MoqHeader } from '../../components/moq/MoqHeader';
import { ProductGrid } from '../../components/product';
import { StoreCartSummary } from '../../components/cart/StoreCartSummary';
import { MOQService } from '../../services/moqService';
import { systemSettingsService } from '../../services/systemSettingsService';
import { MoqProduct } from '../../types/moq';

export const MoqPage: React.FC = () => {
  const [products, setProducts] = useState<MoqProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [moqKitLabel, setMoqKitLabel] = useState<string>(() => {
    return (
      systemSettingsService.getSettings().stores?.moq?.moqKitLabel ||
      'PER KIT: 1 KIT = 10 VIALS'
    );
  });

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    MOQService.getProducts({}).then((data) => {
      if (isMounted) {
        setProducts(data);
        setIsLoading(false);
      }
    });

    const unsubscribe = systemSettingsService.subscribe((settings) => {
      if (isMounted) {
        setMoqKitLabel(
          settings.stores?.moq?.moqKitLabel || 'PER KIT: 1 KIT = 10 VIALS'
        );
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <PageContainer title="MOQ Store">
      <div className="space-y-6">
        {/* MOQ Minimal Header */}
        <MoqHeader moqKitLabel={moqKitLabel} />

        {/* Store Cart Summary */}
        <StoreCartSummary storeType="moq" />

        {/* Product Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          emptyTitle="No MOQ Products Available"
          emptyDescription="There are currently no active MOQ products available in the store."
          accent="magenta"
        />
      </div>
    </PageContainer>
  );
};
