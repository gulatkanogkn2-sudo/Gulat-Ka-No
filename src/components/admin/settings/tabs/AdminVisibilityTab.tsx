import React from 'react';
import { AdminVisibilitySettings } from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import { Eye, EyeOff, Shield, ShieldCheck, Check } from 'lucide-react';

export interface AdminVisibilityTabProps {
  settings: AdminVisibilitySettings;
  onChange: (updated: AdminVisibilitySettings) => void;
}

export const AdminVisibilityTab: React.FC<AdminVisibilityTabProps> = ({ settings, onChange }) => {
  const isShow = settings.showAdminButton;

  const handleSelect = (showAdminButton: boolean) => {
    onChange({ showAdminButton });
  };

  return (
    <div className="space-y-6">
      <SettingCard
        title="Admin Portal Visibility"
        description="Configure whether the public Admin Portal button appears on customer-facing headers and navigation menus"
        icon={isShow ? <Eye size={18} /> : <EyeOff size={18} />}
        badge={
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
              isShow
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {isShow ? 'BUTTON VISIBLE' : 'BUTTON HIDDEN'}
          </span>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Administrators can hide the public "Admin Portal ⚡" link from customer navigation headers while leaving the protected <code className="text-[#00D9FF] font-mono bg-slate-900 px-1.5 py-0.5 rounded">/admin</code> route fully operational.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Option 1: Show Admin Portal Button */}
            <div
              onClick={() => handleSelect(true)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isShow
                  ? 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_20px_rgba(0,217,255,0.15)]'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#00D9FF]">
                    <Eye size={18} />
                    <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      Show Admin Portal Button
                    </span>
                  </div>
                  {isShow && (
                    <div className="w-5 h-5 rounded-full bg-[#00D9FF] text-black flex items-center justify-center">
                      <Check size={14} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Displays the "Admin Portal ⚡" link prominently in header and mobile drawer navigation for easy staff access.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Public Header Button:</span>
                <span className="text-emerald-400 font-bold">VISIBLE</span>
              </div>
            </div>

            {/* Option 2: Hide Admin Portal Button */}
            <div
              onClick={() => handleSelect(false)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                !isShow
                  ? 'border-[#FF2ED1] bg-[#FF2ED1]/10 shadow-[0_0_20px_rgba(255,46,209,0.15)]'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#FF2ED1]">
                    <EyeOff size={18} />
                    <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      Hide Admin Portal Button
                    </span>
                  </div>
                  {!isShow && (
                    <div className="w-5 h-5 rounded-full bg-[#FF2ED1] text-black flex items-center justify-center">
                      <Check size={14} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Removes the button from customer-facing headers. The <code className="text-[#00D9FF] font-mono">/admin</code> URL remains protected and 100% accessible to authorized admins.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Public Header Button:</span>
                <span className="text-amber-400 font-bold">HIDDEN</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3 text-xs text-slate-300">
            <ShieldCheck className="text-[#00D9FF] flex-shrink-0" size={20} />
            <div>
              <span className="font-bold text-white block">Visual Entry Point Control</span>
              <span>
                This setting controls only whether the public visual entry point appears in customer-facing navigation. The <code className="text-[#00D9FF] font-mono">/admin</code> route remains protected and accessible only to authenticated administrators.
              </span>
            </div>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};
