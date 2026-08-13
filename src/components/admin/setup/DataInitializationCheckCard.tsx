import React from 'react';
import { DataInitCheckResult } from '../../../types/initialSetup';
import { FolderCheck, CheckCircle, AlertCircle } from 'lucide-react';

export interface DataInitializationCheckCardProps {
  dataChecks: DataInitCheckResult[];
}

export const DataInitializationCheckCard: React.FC<DataInitializationCheckCardProps> = ({
  dataChecks,
}) => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-2xl bg-[#0A0F1D]/90 space-y-4">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
          <FolderCheck className="text-[#8B5CF6]" size={18} />
          <span>Initial Data Seeding & Records Verification</span>
        </h3>
        <p className="text-xs text-slate-400">
          Verification of initial active records across core platform modules
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dataChecks.map((item) => (
          <div
            key={item.module}
            className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-white font-mono">{item.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
                {item.count} Records
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle size={12} />
                <span>INITIALIZED</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
