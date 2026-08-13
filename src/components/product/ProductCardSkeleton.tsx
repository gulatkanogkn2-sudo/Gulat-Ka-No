import React from 'react';
import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';

export interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ className = '' }) => {
  return (
    <Card
      variant="glass"
      noPadding
      className={`border-white/10 p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-hidden relative ${className}`}
    >
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-square rounded-xl bg-white/10" />

      {/* Badges Skeleton */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-24 rounded-md bg-white/10" />
        <Skeleton className="h-5 w-20 rounded-md bg-white/10" />
      </div>

      {/* Name and Description Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4 bg-white/10 rounded" />
        <Skeleton className="h-3.5 w-full bg-white/10 rounded" />
        <Skeleton className="h-3.5 w-2/3 bg-white/10 rounded" />
      </div>

      {/* Variant & Quantity Controls Skeleton */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
        <div className="space-y-1">
          <Skeleton className="h-3 w-16 bg-white/10 rounded" />
          <Skeleton className="h-8 w-full bg-white/10 rounded-lg" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-14 bg-white/10 rounded" />
          <Skeleton className="h-8 w-24 bg-white/10 rounded-lg" />
        </div>
      </div>

      {/* Price & Add to Cart Button Skeleton */}
      <div className="pt-2 space-y-3">
        <Skeleton className="h-7 w-28 bg-white/10 rounded" />
        <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
      </div>
    </Card>
  );
};
