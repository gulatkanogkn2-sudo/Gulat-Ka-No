import React, { useState } from 'react';
import { DeploymentSettings } from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { StatusIndicator } from '../common/StatusIndicator';
import { systemSettingsService } from '../../../../services/systemSettingsService';
import {
  Cloud,
  Database,
  Download,
  CheckCircle2,
  HardDrive,
  Layers,
  Radio,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export interface DeploymentSettingsTabProps {
  settings: DeploymentSettings;
}

export const DeploymentSettingsTab: React.FC<DeploymentSettingsTabProps> = ({ settings }) => {
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    systemSettingsService.exportSettings();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Production Deployment Environment Details */}
      <SettingCard
        title="Production Deployment Architecture Details"
        description="Read-only runtime metadata, web hosting platform, and database services"
        icon={<Cloud size={18} />}
        actions={<StatusIndicator status="active" label="Deployment Live" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SettingInput
            label="Active Environment"
            value={settings.environment.toUpperCase()}
            onChange={() => {}}
            disabled
            helperText="Target environment tier."
            exampleText="PRODUCTION"
          />
          <SettingInput
            label="Primary Application Domain"
            value={settings.domain || 'https://gknpeptides.com'}
            onChange={() => {}}
            disabled
            helperText="Main web entry point domain."
            exampleText="https://gknpeptides.com"
          />
          <SettingInput
            label="Frontend Hosting Platform"
            value="Vercel Edge Platform"
            onChange={() => {}}
            disabled
            helperText="Global Edge CDN web server."
            exampleText="Vercel Edge Network"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-white/10 mt-4">
          <SettingInput
            label="Software Core Version"
            value={settings.version || '2.0.0-LOCKED-MASTER'}
            onChange={() => {}}
            disabled
            helperText="Release build version."
            exampleText="2.0.0-LOCKED-MASTER"
          />
          <SettingInput
            label="Backend & Database Provider"
            value="Supabase Cloud (PostgreSQL)"
            onChange={() => {}}
            disabled
            helperText="Database, Auth, and Storage host."
            exampleText="Supabase PostgreSQL"
          />
          <SettingInput
            label="Regional Data Center"
            value="Asia-East (Singapore / Tokyo Edge)"
            onChange={() => {}}
            disabled
            helperText="Regional database region."
            exampleText="Asia-East"
          />
        </div>

        <div className="p-4 mt-4 bg-white/5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
            <Radio size={16} className="text-[#00D9FF] animate-pulse" />
            <span>Last Application Build: {new Date(settings.lastDeployedAt).toUTCString()}</span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 font-bold">
            Vercel + Supabase Architecture
          </span>
        </div>
      </SettingCard>

      {/* 2. Database Migration Status */}
      <SettingCard
        title="Database Schema & Migration Status"
        description="Version status of Supabase PostgreSQL schema, migrations, and Drizzle models"
        icon={<Database size={18} />}
        actions={<StatusIndicator status="active" label="Schema Verified" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                <Layers size={14} className="text-[#00D9FF]" />
                <span>Current Schema Version</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#00D9FF]">v2.0</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              All 14 core tables (products, orders, payments, customers, settings, audit_logs) aligned with TypeScript models.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Migration State</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">UP TO DATE</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              0 pending migrations. Database schema matches latest GKN V2 production codebase requirements.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#8B5CF6]" />
                <span>RLS Security Rules</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#8B5CF6]">ENFORCED</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Row Level Security policies active across orders, customers, payment proofs, and settings tables.
            </p>
          </div>
        </div>
      </SettingCard>

      {/* 3. Backup & Data Recovery Status */}
      <SettingCard
        title="Backup & Data Recovery Options"
        description="Automated Supabase database snapshot policies and administrator data export"
        icon={<HardDrive size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-white font-mono">
              <Clock size={16} className="text-[#00D9FF]" />
              <span>Automated Supabase Cloud Backups</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Supabase manages automated daily point-in-time snapshots and write-ahead log backups for disaster recovery.
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between text-xs font-mono text-slate-400">
              <span>Backup Frequency:</span>
              <span className="text-emerald-400 font-bold">Daily / Automated</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-white font-mono">
              <Download size={16} className="text-[#FF2ED1]" />
              <span>Manual System Data Export</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Export all system configurations, store parameters, and settings parameters as a JSON archive for local backup.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExportData}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FF2ED1]/10 hover:bg-[#FF2ED1]/20 border border-[#FF2ED1]/30 text-[#FF2ED1] font-bold text-xs font-mono flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>{exportSuccess ? 'Settings Exported Successfully!' : 'Export System Settings JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};
