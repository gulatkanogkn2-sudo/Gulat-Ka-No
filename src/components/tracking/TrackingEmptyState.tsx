import React from 'react';
import { ShieldAlert, Search, RefreshCw, ShoppingBag } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';

interface TrackingEmptyStateProps {
  searchedRef?: string;
  onResetSearch?: () => void;
  className?: string;
}

export const TrackingEmptyState: React.FC<TrackingEmptyStateProps> = ({
  searchedRef,
  onResetSearch,
  className = '',
}) => {
  return (
    <Card variant="glass" className={`border-white/10 text-center py-12 px-6 ${className}`}>
      <div className="flex flex-col items-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-white font-mono">
            No Allocation Record Found
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {searchedRef ? (
              <>
                No active order record found for reference code{' '}
                <span className="font-mono text-[#00D9FF] font-bold">{searchedRef}</span>. Please verify the code or check back after receipt clearance.
              </>
            ) : (
              'Enter your 10-character reference number above or choose from your recent account allocations.'
            )}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          {onResetSearch && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetSearch}
              className="border-white/20 text-slate-300 hover:text-white font-mono text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset Search
            </Button>
          )}

          <Link to="/groupbuy">
            <Button variant="cyan" size="sm" className="font-mono text-xs font-bold uppercase">
              <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
              Explore Store
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

