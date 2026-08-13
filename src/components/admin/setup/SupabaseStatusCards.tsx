import React from 'react';
import { SupabaseConnectionStatus } from '../../../types/initialSetup';
import { Key, Database, HardDrive, Zap, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface SupabaseStatusCardsProps {
  status: SupabaseConnectionStatus;
}

export const SupabaseStatusCards: React.FC<SupabaseStatusCardsProps> = ({ status }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
            <Zap className="text-[#00D9FF]" size={18} />
            <span>Supabase Infrastructure Readiness</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time status of backend service layers, authentication tokens, and cloud environment credentials
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${
            status.envValidated
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          {status.envValidated ? 'PRODUCTION LIVE KEYS' : 'FALLBACK ADAPTER MODE'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Auth Connection Card */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 font-mono flex items-center space-x-2">
              <Key size={16} className="text-[#00D9FF]" />
              <span>Auth Connection</span>
            </span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">{status.details.authMessage}</p>
          <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono text-slate-400">
            <span>Provider:</span>
            <span className="text-white font-bold">Supabase GoTrue JWT</span>
          </div>
        </div>

        {/* Database Connection Card */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 font-mono flex items-center space-x-2">
              <Database size={16} className="text-[#8B5CF6]" />
              <span>Database REST Gateway</span>
            </span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">{status.details.dbMessage}</p>
          <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono text-slate-400">
            <span>Engine:</span>
            <span className="text-white font-bold">PostgreSQL 15</span>
          </div>
        </div>

        {/* Storage Connection Card */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 font-mono flex items-center space-x-2">
              <HardDrive size={16} className="text-[#FF2ED1]" />
              <span>Storage Buckets</span>
            </span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">{status.details.storageMessage}</p>
          <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono text-slate-400">
            <span>Provider:</span>
            <span className="text-white font-bold">Supabase Storage</span>
          </div>
        </div>

        {/* Realtime WebSockets Card */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 font-mono flex items-center space-x-2">
              <Zap size={16} className="text-[#00D9FF]" />
              <span>Realtime Subscriptions</span>
            </span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">{status.details.realtimeMessage}</p>
          <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono text-slate-400">
            <span>Channel Status:</span>
            <span className="text-emerald-400 font-bold">SUBSCRIBED</span>
          </div>
        </div>

        {/* Environment Validation Card */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 font-mono flex items-center space-x-2">
              <ShieldCheck size={16} className="text-amber-400" />
              <span>Environment Variables & Credentials Validation</span>
            </span>
            {status.anonKeyPresent ? (
              <CheckCircle2 size={16} className="text-emerald-400" />
            ) : (
              <AlertTriangle size={16} className="text-amber-400" />
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">{status.details.envMessage}</p>
          <div className="pt-2 border-t border-white/10 flex flex-wrap justify-between text-[10px] font-mono text-slate-400 gap-2">
            <span>URL: <code className="text-[#00D9FF]">{status.supabaseUrl}</code></span>
            <span>Anon Key: <span className="text-emerald-400">{status.anonKeyPresent ? 'PRESENT' : 'MISSING'}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
