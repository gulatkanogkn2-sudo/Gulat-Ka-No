import React from 'react';
import { SettingCard } from '../common/SettingCard';
import {
  Lock,
  Shield,
  ShieldCheck,
  Key,
  CheckCircle2,
  Server,
  Globe,
  Database,
} from 'lucide-react';

export const SecuritySettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Real Security Architecture Status */}
      <SettingCard
        title="Production Security & Encryption Architecture"
        description="Active encryption protocols, authentication guards, and database isolation policies"
        icon={<ShieldCheck size={18} />}
        badge={
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
            ACTIVE & ENFORCED
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Globe size={14} className="text-[#00D9FF]" />
                <span>Transport Layer Security</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                HTTPS / TLS 1.3
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              All communications between browser, Cloud Run containers, and Supabase endpoints are strictly encrypted in transit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Key size={14} className="text-[#FF2ED1]" />
                <span>JWT Session Authentication</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                SUPABASE AUTH
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Stateless cryptographically signed JWT tokens verify administrative identity on every API request and route transition.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Lock size={14} className="text-[#00D9FF]" />
                <span>Protected Route Guards (/admin/*)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                ENFORCED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Unauthenticated or non-staff users accessing <code className="text-[#00D9FF]">/admin/*</code> routes are automatically redirected to the login view.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Database size={14} className="text-purple-400" />
                <span>Row Level Security (RLS)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                ENABLED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              PostgreSQL database policies isolate customer order histories and restrict administrative tables to authenticated staff profiles.
            </p>
          </div>
        </div>
      </SettingCard>

      {/* Security Governance Notice */}
      <div className="p-4 rounded-xl bg-[#070B14] border border-white/10 flex items-start space-x-3 text-xs font-mono text-slate-300">
        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-white font-bold block mb-0.5">Automated Cloud Security</span>
          <p className="text-slate-400 leading-relaxed">
            Rate limiting, IP reputation filtering, and password hashing algorithms (bcrypt/argon2) are managed at the Supabase Cloud infrastructure layer.
          </p>
        </div>
      </div>
    </div>
  );
};
