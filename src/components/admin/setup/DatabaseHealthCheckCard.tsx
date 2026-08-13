import React from 'react';
import { HealthCheckResult } from '../../../types/initialSetup';
import { CheckCircle, AlertTriangle, XCircle, Database, RefreshCw } from 'lucide-react';

export interface DatabaseHealthCheckCardProps {
  checks: HealthCheckResult[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const DatabaseHealthCheckCard: React.FC<DatabaseHealthCheckCardProps> = ({
  checks,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-2xl bg-[#0A0F1D]/90 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
            <Database className="text-[#00D9FF]" size={18} />
            <span>Database & Services Health Matrix</span>
          </h3>
          <p className="text-xs text-slate-400">
            Automated verification of database tables, auth schemas, storage policies, and realtime channels
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Running Checks...' : 'Re-run Health Check'}</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {checks.map((chk) => {
          const isPass = chk.status === 'pass';
          const isWarn = chk.status === 'warning';

          return (
            <div
              key={chk.id}
              className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {isPass ? (
                    <CheckCircle className="text-emerald-400" size={18} />
                  ) : isWarn ? (
                    <AlertTriangle className="text-amber-400" size={18} />
                  ) : (
                    <XCircle className="text-red-400" size={18} />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">{chk.name}</h4>
                  <p className="text-[11px] text-slate-400">{chk.message}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-auto font-mono text-[10px]">
                {chk.latencyMs !== undefined && (
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                    {chk.latencyMs} ms
                  </span>
                )}

                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase border ${
                    isPass
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : isWarn
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  {chk.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
