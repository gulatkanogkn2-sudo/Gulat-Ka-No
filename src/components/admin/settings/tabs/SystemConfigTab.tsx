import React, { useState } from 'react';
import { SystemConfig } from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { StatusIndicator } from '../common/StatusIndicator';
import { systemSettingsService } from '../../../../services/systemSettingsService';
import { Cpu, Database, HardDrive, Zap, RefreshCw, Activity, CheckCircle } from 'lucide-react';

export interface SystemConfigTabProps {
  settings: SystemConfig;
  onChange: (updated: SystemConfig) => void;
}

export const SystemConfigTab: React.FC<SystemConfigTabProps> = ({ settings, onChange }) => {
  const [isResettingCache, setIsResettingCache] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (field: keyof SystemConfig, value: unknown) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  const handleFlushCache = () => {
    setIsResettingCache(true);
    setResetSuccess(false);

    setTimeout(() => {
      const updated = systemSettingsService.flushSystemCache();
      onChange(updated.systemConfig);
      setIsResettingCache(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Real-time System Status Dashboard */}
      <SettingCard
        title="Live System Infrastructure Health Status"
        description="Real-time telemetry indicators for database, storage, and API gateway services"
        icon={<Activity size={18} />}
        actions={
          <StatusIndicator status={settings.healthStatus.database} label="Core Engine Operational" />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Database Health */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center space-x-2">
                <Database size={16} className="text-[#00D9FF]" />
                <span>Database Engine</span>
              </span>
              <StatusIndicator status={settings.healthStatus.database} />
            </div>
            <div className="pt-2 flex justify-between text-xs text-slate-400 font-mono">
              <span>Query Latency:</span>
              <span className="text-emerald-400 font-bold">{settings.healthStatus.dbLatencyMs} ms</span>
            </div>
          </div>

          {/* Storage Health */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center space-x-2">
                <HardDrive size={16} className="text-[#8B5CF6]" />
                <span>Storage Bucket</span>
              </span>
              <StatusIndicator status={settings.healthStatus.storage} />
            </div>
            <div className="pt-2 flex justify-between text-xs text-slate-400 font-mono">
              <span>Storage Consumed:</span>
              <span className="text-white font-bold">{settings.healthStatus.storageUsedMb} MB</span>
            </div>
          </div>

          {/* API Gateway Status */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center space-x-2">
                <Zap size={16} className="text-[#FF2ED1]" />
                <span>API Gateway</span>
              </span>
              <StatusIndicator status={settings.healthStatus.api} />
            </div>
            <div className="pt-2 flex justify-between text-xs text-slate-400 font-mono">
              <span>Uptime SLAs:</span>
              <span className="text-[#00D9FF] font-bold">99.98%</span>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Debug Mode & Cache Reset Operations */}
      <SettingCard
        title="Cache Management & System Debugging"
        description="Flush platform client caches and toggle developer diagnostic output"
        icon={<Cpu size={18} />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <ToggleSwitch
              label="System Debug Mode"
              description="Output detailed diagnostic logs to browser console and audit traces"
              checked={settings.debugMode}
              onChange={(val) => handleChange('debugMode', val)}
              activeColor="magenta"
            />
            <ToggleSwitch
              label="Enable Application Caching"
              description="Cache database queries and asset metadata for ultra-fast load times"
              checked={settings.cacheEnabled}
              onChange={(val) => handleChange('cacheEnabled', val)}
              activeColor="cyan"
            />
          </div>

          {/* Cache Flush Button */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block font-mono">
                System Cache Purge & Flush
              </span>
              <p className="text-xs text-slate-400">
                Last Cache Reset:{' '}
                <span className="text-[#00D9FF] font-mono">
                  {new Date(settings.healthStatus.lastCacheReset).toLocaleString()}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleFlushCache}
              disabled={isResettingCache}
              className="px-4 py-2 rounded-lg bg-[#00D9FF]/20 hover:bg-[#00D9FF]/30 border border-[#00D9FF]/40 text-[#00D9FF] text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isResettingCache ? 'animate-spin' : ''} />
              <span>{isResettingCache ? 'Flushing Cache...' : 'Flush Cache Now'}</span>
            </button>
          </div>

          {resetSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-mono flex items-center space-x-2 animate-fadeIn">
              <CheckCircle size={16} />
              <span>System cache flushed and memory refreshed successfully!</span>
            </div>
          )}
        </div>
      </SettingCard>
    </div>
  );
};
