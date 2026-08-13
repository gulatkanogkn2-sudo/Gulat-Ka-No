import React from 'react';
import { EmptyState } from '../common/EmptyState';
import { ProductGridSkeleton } from './LoadingSkeleton';
import { Button } from '../common/Button';
import { PackageX } from 'lucide-react';
import { StoreAccent } from './StoreStatusBadge';

export interface ProductGridContainerProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
  accent?: StoreAccent;
  children?: React.ReactNode;
  className?: string;
}

export const ProductGridContainer: React.FC<ProductGridContainerProps> = ({
  isLoading = false,
  isEmpty = true,
  emptyTitle = 'No products are currently available.',
  emptyDescription = 'Check back soon for upcoming product campaign releases and batch updates.',
  emptyActionText,
  onEmptyAction,
  accent = 'cyan',
  children,
  className = '',
}) => {
  if (isLoading) {
    return <ProductGridSkeleton count={6} />;
  }

  if (isEmpty || !children) {
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
      {children}
    </div>
  );
};
