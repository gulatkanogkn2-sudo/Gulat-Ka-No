import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface TrackingSearchProps {
  onSearch: (reference: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  recentReferences?: string[];
  className?: string;
}

export const TrackingSearch: React.FC<TrackingSearchProps> = ({
  onSearch,
  isLoading = false,
  initialValue = '',
  recentReferences = ['GB-000001', 'OH-000001', 'MOQ-000001'],
  className = '',
}) => {
  const [referenceInput, setReferenceInput] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = referenceInput.trim();
    if (!clean) {
      setError('Please enter a valid order reference code (e.g. GB-000001, OH-000001, MOQ-000001).');
      return;
    }

    onSearch(clean);
  };

  return (
    <Card variant="glass" className={`border-[#00D9FF]/30 p-6 sm:p-8 space-y-5 ${className}`}>
      <div className="max-w-2xl mx-auto text-center space-y-2">
        <span className="text-[10px] font-mono text-[#00D9FF] uppercase tracking-widest bg-[#00D9FF]/10 px-3 py-1 rounded-full border border-[#00D9FF]/20">
          REAL-TIME BATCH TRACKING ENGINE
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Track Research Allocation & Waybill Status
        </h2>
        <p className="text-xs text-slate-300">
          Enter your order reference number (e.g. GB-000001, OH-000001, MOQ-000001) or tracking hash to view real-time batch staging, shipment status, and courier dispatch.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00D9FF]" />
            <input
              type="text"
              placeholder="e.g. GB-000001, OH-000001, or MOQ-000001"
              value={referenceInput}
              onChange={(e) => {
                setReferenceInput(e.target.value);
                if (error) setError(null);
              }}
              className="w-full pl-10 pr-4 py-3 bg-black/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF] font-mono transition-colors"
            />
          </div>

          <Button
            variant="cyan"
            size="md"
            glow
            type="submit"
            disabled={isLoading}
            className="font-mono text-xs font-bold uppercase tracking-wider py-3 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Track Order</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Quick Search Chips */}
      {recentReferences && recentReferences.length > 0 && (
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00D9FF]" />
            Sample Reference Codes:
          </span>
          {recentReferences.map((ref) => (
            <button
              key={ref}
              type="button"
              onClick={() => {
                setReferenceInput(ref);
                onSearch(ref);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#00D9FF]/20 text-[#00D9FF] border border-white/10 hover:border-[#00D9FF]/50 transition-all text-[11px] cursor-pointer"
            >
              {ref}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
};
