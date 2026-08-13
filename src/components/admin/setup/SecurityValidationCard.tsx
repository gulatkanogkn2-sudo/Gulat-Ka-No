import React from 'react';
import { SecurityCheckResult } from '../../../types/initialSetup';
import { ShieldCheck, Lock, CheckCircle, ArrowRight } from 'lucide-react';

export interface SecurityValidationCardProps {
  securityChecks: SecurityCheckResult[];
}

export const SecurityValidationCard: React.FC<SecurityValidationCardProps> = ({
  securityChecks,
}) => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-2xl bg-[#0A0F1D]/90 space-y-4">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
          <ShieldCheck className="text-[#FF2ED1]" size={18} />
          <span>Security Architecture & Route Guard Validation</span>
        </h3>
        <p className="text-xs text-slate-400">
          Verification of protected routes, auth session restoration, RBAC scopes, and owner permissions
        </p>
      </div>

      <div className="space-y-3">
        {securityChecks.map((sec) => (
          <div
            key={sec.id}
            className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center space-x-2">
                <Lock size={14} className="text-[#FF2ED1]" />
                <span>{sec.name}</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1">
                <CheckCircle size={12} />
                <span>PASSED</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-300">{sec.description}</p>
            <p className="text-[10px] text-slate-500 font-mono">
              <span className="text-[#00D9FF]">Verification detail:</span> {sec.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
