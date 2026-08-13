import React from 'react';
import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import { ProductCardSkeleton } from '../product/ProductCardSkeleton';

export { ProductCardSkeleton };

export const StoreHeroSkeleton: React.FC = () => {
  return (
    <Card variant="glass" className="border-white/10 mb-8 p-6 sm:p-8 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-48 bg-white/10" />
        <Skeleton className="h-6 w-28 bg-white/10 rounded-md" />
      </div>
      <Skeleton className="h-4 w-3/4 bg-white/10" />
      <Skeleton className="h-4 w-1/2 bg-white/10" />
    </Card>
  );
};

export const InformationCardSkeleton: React.FC = () => {
  return (
    <Card variant="glass" className="border-white/10 mb-8 p-5 space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <Skeleton className="w-9 h-9 rounded-lg bg-white/10" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-40 bg-white/10" />
          <Skeleton className="h-3 w-64 bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-lg space-y-2">
            <Skeleton className="h-3 w-20 bg-white/10" />
            <Skeleton className="h-4 w-28 bg-white/10" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export const StoreToolbarSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      <Skeleton className="h-10 w-full sm:w-80 rounded-lg bg-white/10" />
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Skeleton className="h-10 w-32 rounded-lg bg-white/10" />
        <Skeleton className="h-10 w-36 rounded-lg bg-white/10" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};
