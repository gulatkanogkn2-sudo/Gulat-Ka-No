import React from 'react';
import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';

export const ResearchCardSkeleton: React.FC = () => {
  return (
    <Card variant="glass" className="border-white/10 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-12 h-12 rounded-xl bg-white/10" />
        <Skeleton className="w-20 h-5 rounded-full bg-white/10" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-6 bg-white/10" />
        <Skeleton className="w-full h-4 bg-white/10" />
        <Skeleton className="w-5/6 h-4 bg-white/10" />
      </div>
      <div className="pt-4">
        <Skeleton className="w-full h-9 rounded-lg bg-white/10" />
      </div>
    </Card>
  );
};

export const ResearchGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ResearchCardSkeleton key={idx} />
      ))}
    </div>
  );
};
