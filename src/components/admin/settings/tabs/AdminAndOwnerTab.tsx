import React, { useState } from 'react';
import { AdminVisibilitySettings, OwnerSettings, SecuritySettings } from '../../../../types/systemSettings';
import { AdminVisibilityTab } from './AdminVisibilityTab';
import { AdministratorsAndRolesTab } from './AdministratorsAndRolesTab';
import { SecuritySettingsTab } from './SecuritySettingsTab';
import { AdminActivityTab } from './AdminActivityTab';
import { Eye, Crown, Lock, Activity } from 'lucide-react';

interface AdminAndOwnerTabProps {
  adminVisibility: AdminVisibilitySettings;
  owner: OwnerSettings;
  security: SecuritySettings;
  onUpdateAdminVisibility: (updated: AdminVisibilitySettings) => void;
  onUpdateOwner: (updated: OwnerSettings) => void;
  onUpdateSecurity: (updated: SecuritySettings) => void;
  subTabParam?: string;
}

export type AdminOwnerSubTab = 'visibility' | 'roles' | 'security' | 'activity';

export const AdminAndOwnerTab: React.FC<AdminAndOwnerTabProps> = ({
  adminVisibility,
  owner,
  security,
  onUpdateAdminVisibility,
  onUpdateOwner,
  onUpdateSecurity,
  subTabParam,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminOwnerSubTab>(() => {
    if (subTabParam === 'owner' || subTabParam === 'roles') return 'roles';
    if (subTabParam === 'security') return 'security';
    if (subTabParam === 'activity' || subTabParam === 'audit') return 'activity';
    return 'visibility';
  });

  return (
    <div className="space-y-6">
      {/* Sub-navigation Pills */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#070B14] border border-white/10 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('visibility')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'visibility'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye size={14} />
          <span>Admin Portal Visibility</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'roles'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Crown size={14} />
          <span>Administrators & Roles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'security'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lock size={14} />
          <span>Security & 2FA Policies</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('activity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'activity'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity size={14} />
          <span>Admin Activity</span>
        </button>
      </div>

      {/* Render Active View */}
      {activeSubTab === 'visibility' && (
        <AdminVisibilityTab settings={adminVisibility} onChange={onUpdateAdminVisibility} />
      )}

      {activeSubTab === 'roles' && (
        <AdministratorsAndRolesTab settings={owner} onChange={onUpdateOwner} />
      )}

      {activeSubTab === 'security' && (
        <SecuritySettingsTab settings={security} onChange={onUpdateSecurity} />
      )}

      {activeSubTab === 'activity' && <AdminActivityTab />}
    </div>
  );
};
