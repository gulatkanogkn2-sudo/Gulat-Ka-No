import React from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { SettingCard } from '../common/SettingCard';
import {
  Shield,
  ShieldCheck,
  Crown,
  Users,
  Key,
  CheckCircle2,
  Lock,
  Database,
  UserCheck,
  Terminal,
} from 'lucide-react';

export const AdministratorsAndRolesTab: React.FC = () => {
  const { user, isDevMode, isAuthenticated } = useAuth();

  return (
    <div className="space-y-6">
      {/* Active Session Card */}
      <SettingCard
        title="Authenticated Administrator Profile"
        description="Active authenticated session profile loaded from Supabase Auth and database profiles table"
        icon={<UserCheck size={18} />}
        badge={
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
            {isAuthenticated ? 'SESSION ACTIVE' : 'UNAUTHENTICATED'}
          </span>
        }
      >
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block">Authenticated User:</span>
              <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                {user?.fullName || 'Active Administrator'}
              </span>
              <span className="text-xs text-slate-400 font-mono">{user?.email || 'admin@gknpeptides.com'}</span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-400 block">Assigned Database Role:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#FF2ED1]/20 text-[#FF2ED1] border border-[#FF2ED1]/40 flex items-center gap-1.5">
                  <Crown size={13} />
                  <span>{user?.role || 'OWNER'}</span>
                </span>
                {isDevMode && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    DEV BYPASS
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-400 block">Authorization Method:</span>
              <span className="text-xs font-mono text-slate-300 mt-1 block">
                Supabase JWT + profiles.role
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={12} />
                <span>Route Guard Enforced</span>
              </span>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Role-Based Access Control Architecture */}
      <SettingCard
        title="Role-Based Access Control (RBAC) Architecture"
        description="Enforced role permissions across customer storefront and administrative operations"
        icon={<Shield size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Owner Role */}
          <div className="p-4 rounded-xl bg-white/5 border border-[#FF2ED1]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Crown size={15} className="text-[#FF2ED1]" />
                <span>OWNER (Root Superadmin)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF2ED1]/10 text-[#FF2ED1] border border-[#FF2ED1]/30 font-bold">
                LEVEL 4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Unrestricted master access. Full control over system configurations, payment methods, shipping methods, finance ledgers, and database diagnostics.
            </p>
            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">All Modules</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Settings</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Finance</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Diagnostics</span>
            </div>
          </div>

          {/* Admin Role */}
          <div className="p-4 rounded-xl bg-white/5 border border-[#00D9FF]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#00D9FF]" />
                <span>ADMIN (Operations Manager)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 font-bold">
                LEVEL 3
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Operational administration. Manage store products, order lifecycle, payment verifications, customer accounts, and website content.
            </p>
            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Stores & Products</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Orders</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Payments</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Customers</span>
            </div>
          </div>

          {/* Staff Role */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Users size={15} className="text-purple-400" />
                <span>STAFF (Fulfillment & Support)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">
                LEVEL 2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Fulfillment and customer support access. Order packing, status tracking updates, shipping label generation, and customer inquiries.
            </p>
            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Order Queue</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Shipping</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Customer Support</span>
            </div>
          </div>

          {/* Customer Role */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Lock size={15} className="text-slate-400" />
                <span>CUSTOMER (Storefront Researcher)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-400 border border-white/20 font-bold">
                LEVEL 1
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Public storefront access. Browse GroupBuy, OnHand, and MOQ catalogs, place orders, upload payment receipts, and track order progress.
            </p>
            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Storefront</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Cart & Checkout</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">Order Tracker</span>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Production Provisioning Guidance */}
      <SettingCard
        title="Admin Account Provisioning in Supabase"
        description="Standard operating procedure for adding or promoting staff and administrators in production"
        icon={<Terminal size={18} />}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            In compliance with strict security architecture, administrator accounts are provisioned directly in Supabase to guarantee cryptographic password hashing and authentic JWT token issuance.
          </p>

          <div className="p-4 rounded-xl bg-[#070B14] border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#00D9FF] font-bold">
              <Database size={15} />
              <span>Provisioning Steps:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>Create user in Supabase Authentication dashboard or register via storefront.</li>
              <li>
                In the Supabase SQL Editor or Table Editor, navigate to the <code className="text-[#00D9FF]">public.profiles</code> table.
              </li>
              <li>
                Update the user row: set <code className="text-emerald-400 font-bold">role = 'ADMIN'</code> or <code className="text-[#FF2ED1] font-bold">role = 'OWNER'</code>.
              </li>
              <li>The user immediately gains protected access to the Admin Portal on their next login.</li>
            </ol>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};
