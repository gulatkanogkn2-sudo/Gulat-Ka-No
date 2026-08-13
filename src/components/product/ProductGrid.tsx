import React from 'react';
import { ProductCard, ProductData } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { PackageX } from 'lucide-react';
import { StoreAccent } from '../store/StoreStatusBadge';

export interface ProductGridProps {
  products?: ProductData[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
  accent?: StoreAccent;
  onAddToCart?: (product: ProductData, variantId: string, quantity: number) => void;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyTitle = 'No products are currently available.',
  emptyDescription = 'Check back soon for upcoming product catalog updates and allocation campaigns.',
  emptyActionText,
  onEmptyAction,
  accent = 'cyan',
  onAddToCart,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    const accentButtonClass: Record<StoreAccent, string> = {
      cyan: 'border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF]/10',
      purple: 'border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10',
      magenta: 'border-[#FF2ED1] text-[#FF2ED1] hover:bg-[#FF2ED1]/10',
    };

    const accentIconClass: Record<StoreAccent, string> = {
      cyan: 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30',
      purple: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/30',
      magenta: 'text-[#FF2ED1] bg-[#FF2ED1]/10 border-[#FF2ED1]/30',
    };

    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={
          <div className={`p-4 rounded-2xl border ${accentIconClass[accent]}`}>
            <PackageX className="w-8 h-8" />
          </div>
        }
        action={
          emptyActionText ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onEmptyAction}
              className={`text-xs ${accentButtonClass[accent]}`}
            >
              {emptyActionText}
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((prod, idx) => (
        <ProductCard
          key={prod.id || idx}
          product={prod}
          accent={accent}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
