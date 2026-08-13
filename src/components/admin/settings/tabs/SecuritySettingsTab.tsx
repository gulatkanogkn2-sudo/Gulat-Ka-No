import React from 'react';
import { SecuritySettings, TwoFactorAuthConfig } from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { SettingSelect } from '../common/SettingSelect';
import { ToggleSwitch } from '../common/ToggleSwitch';
import {
  Lock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  UserCheck,
  Check,
  Smartphone,
  Mail,
  HardDrive,
} from 'lucide-react';

export interface SecuritySettingsTabProps {
  settings: SecuritySettings;
  onChange: (updated: SecuritySettings) => void;
}

export type TwoFactorPolicy = 'disabled' | 'optional' | 'required_admins' | 'required_owner';

export const SecuritySettingsTab: React.FC<SecuritySettingsTabProps> = ({ settings, onChange }) => {
  const handleChange = (field: keyof SecuritySettings, value: unknown) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  const handle2FAChange = (field: keyof TwoFactorAuthConfig, value: unknown) => {
    onChange({
      ...settings,
      twoFactorAuth: {
        ...settings.twoFactorAuth,
        [field]: value,
      },
    });
  };

  // Derived 2FA policy selection for clean UI cards
  const get2FAPolicy = (): TwoFactorPolicy => {
    if (!settings.twoFactorAuth?.enabled) return 'disabled';
    if (settings.twoFactorAuth.requiredForAdmins) return 'required_admins';
    if (settings.twoFactorAuth.requiredForOwner) return 'required_owner';
    return 'optional';
  };

  const set2FAPolicy = (policy: TwoFactorPolicy) => {
    switch (policy) {
      case 'disabled':
        onChange({
          ...settings,
          twoFactorAuth: {
            ...settings.twoFactorAuth,
            enabled: false,
            requiredForAdmins: false,
            requiredForOwner: false,
          },
        });
        break;
      case 'optional':
        onChange({
          ...settings,
          twoFactorAuth: {
            ...settings.twoFactorAuth,
            enabled: true,
            requiredForAdmins: false,
            requiredForOwner: false,
          },
        });
        break;
      case 'required_admins':
        onChange({
          ...settings,
          twoFactorAuth: {
            ...settings.twoFactorAuth,
            enabled: true,
            requiredForAdmins: true,
            requiredForOwner: true,
          },
        });
        break;
      case 'required_owner':
        onChange({
          ...settings,
          twoFactorAuth: {
            ...settings.twoFactorAuth,
            enabled: true,
            requiredForAdmins: false,
            requiredForOwner: true,
          },
        });
        break;
    }
  };

  const currentPolicy = get2FAPolicy();

  return (
    <div className="space-y-6">
      {/* Section 1: Authentication Security */}
      <SettingCard
        title="Authentication Security"
        description="Session duration, login rate limits, and password complexity governance"
        icon={<Lock size={18} />}
        badge={
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
            AUTHENTICATION ACTIVE
          </span>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SettingInput
              label="Inactivity Session Timeout (Minutes)"
              type="number"
              suffixText="Mins"
              value={settings.sessionTimeoutMinutes}
              onChange={(val) => handleChange('sessionTimeoutMinutes', parseInt(val) || 30)}
              helperText="Auto-logouts inactive admin sessions to protect staff portal access."
              exampleText="30 Mins"
              tooltipText="When idle for this duration, staff members are logged out automatically."
            />

            <SettingSelect
              label="Password Complexity Policy"
              value={settings.passwordPolicy}
              onChange={(val) => handleChange('passwordPolicy', val)}
              options={[
                { value: 'flexible', label: 'Flexible (Min 6 chars)', description: 'Basic character length check' },
                { value: 'standard', label: 'Standard (Min 8 chars, numbers + letters)', description: 'Recommended baseline' },
                { value: 'strict', label: 'Strict (Min 10 chars, upper, lower, numbers, symbols)', description: 'High security' },
                { value: 'cyberpunk_hardened', label: 'Cyberpunk Hardened (Min 12 chars, strict complexity)', description: 'Maximum hardened rules' },
              ]}
              helperText="Rules enforced during account creation and password updates."
              exampleText="Standard (Min 8 chars)"
            />

            <SettingInput
              label="Maximum Failed Login Attempts"
              type="number"
              suffixText="Attempts"
              value={settings.maxLoginAttempts}
              onChange={(val) => handleChange('maxLoginAttempts', parseInt(val) || 3)}
              helperText="Triggers temporary IP lockout after reaching failure threshold."
              exampleText="3 Attempts"
              tooltipText="Prevents brute-force password guessing on staff accounts."
            />
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="text-[#00D9FF] flex-shrink-0" size={18} />
              <div>
                <span className="font-bold text-white block">Protected Route Guards (/admin/*)</span>
                <span className="text-slate-400">All administrative API routes and frontend pages require valid JWT session tokens.</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded bg-[#00D9FF]/20 text-[#00D9FF] font-bold border border-[#00D9FF]/30">
              ENFORCED
            </span>
          </div>
        </div>
      </SettingCard>

      {/* Section 2: 2FA Policies */}
      <SettingCard
        title="Two-Factor Authentication (2FA) Policies"
        description="Multi-factor security enforcement levels and verification methods for admin staff"
        icon={<ShieldCheck size={18} />}
        badge={
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
            currentPolicy !== 'disabled'
              ? 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            2FA POLICY: {currentPolicy.toUpperCase()}
          </span>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white font-mono block">
              2FA Enforcement Policy Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Option 1: Disabled */}
              <div
                onClick={() => set2FAPolicy('disabled')}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  currentPolicy === 'disabled'
                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono uppercase">
                      Disabled
                    </span>
                    {currentPolicy === 'disabled' && (
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    2FA is deactivated across all staff accounts. Password login only.
                  </p>
                </div>
              </div>

              {/* Option 2: Optional */}
              <div
                onClick={() => set2FAPolicy('optional')}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  currentPolicy === 'optional'
                    ? 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_15px_rgba(0,217,255,0.15)]'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono uppercase">
                      Optional
                    </span>
                    {currentPolicy === 'optional' && (
                      <div className="w-4 h-4 rounded-full bg-[#00D9FF] text-black flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Administrators can choose whether to enroll in 2FA in profile settings.
                  </p>
                </div>
              </div>

              {/* Option 3: Required for Admins */}
              <div
                onClick={() => set2FAPolicy('required_admins')}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  currentPolicy === 'required_admins'
                    ? 'border-[#FF2ED1] bg-[#FF2ED1]/10 shadow-[0_0_15px_rgba(255,46,209,0.15)]'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono uppercase">
                      Required for Admins
                    </span>
                    {currentPolicy === 'required_admins' && (
                      <div className="w-4 h-4 rounded-full bg-[#FF2ED1] text-black flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Mandatory 2FA setup required for all Admin and Owner accounts before granting portal access.
                  </p>
                </div>
              </div>

              {/* Option 4: Required for Owner */}
              <div
                onClick={() => set2FAPolicy('required_owner')}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  currentPolicy === 'required_owner'
                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono uppercase">
                      Required for Owner
                    </span>
                    {currentPolicy === 'required_owner' && (
                      <div className="w-4 h-4 rounded-full bg-purple-500 text-black flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Strictly enforced for Owner and Super Admin accounts. Optional for standard staff.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <SettingSelect
              label="2FA Preferred Authentication Method"
              value={settings.twoFactorAuth?.method || 'authenticator_app'}
              onChange={(val) => handle2FAChange('method', val)}
              options={[
                { value: 'authenticator_app', label: 'TOTP Authenticator App (Google Authenticator / Authy)', description: 'Time-based OTP' },
                { value: 'email_otp', label: 'Email One-Time Password (OTP)', description: 'Code sent to inbox' },
                { value: 'hardware_key', label: 'Hardware Security Key (FIDO2 / YubiKey)', description: 'Physical USB key' },
              ]}
              helperText="Secondary verification challenge protocol utilized during staff authentication."
              exampleText="TOTP Authenticator App"
            />
          </div>
        </div>
      </SettingCard>

      {/* Section 3: Admin Access Restrictions */}
      <SettingCard
        title="Admin Access Restrictions & IP Whitelisting"
        description="Restrict staff portal access strictly to verified laboratory and operational IP addresses"
        icon={<UserCheck size={18} />}
      >
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <ToggleSwitch
              label="Enable Admin IP Address Whitelisting"
              description="Reject connection attempts to /admin from unlisted IP addresses."
              checked={settings.adminIpWhitelistEnabled}
              onChange={(val) => handleChange('adminIpWhitelistEnabled', val)}
            />
          </div>

          {settings.adminIpWhitelistEnabled && (
            <div>
              <SettingInput
                label="Whitelisted IPv4 / IPv6 Addresses (Comma-separated)"
                value={settings.whitelistedIps ? settings.whitelistedIps.join(', ') : ''}
                onChange={(val) =>
                  handleChange(
                    'whitelistedIps',
                    val.split(',').map((s) => s.trim()).filter(Boolean)
                  )
                }
                helperText="Specify exact IP addresses permitted to load the admin portal."
                exampleText="127.0.0.1, 192.168.1.100, 203.0.113.195"
                tooltipText="Staff connecting from outside these IP addresses will be blocked."
              />
            </div>
          )}
        </div>
      </SettingCard>
    </div>
  );
};
