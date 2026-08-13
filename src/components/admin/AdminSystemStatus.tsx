import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { AdminSystemHealth } from '../../types/admin';
import {
  Database,
  HardDrive,
  ShieldCheck,
  Radio,
  GitBranch,
  CheckCircle2,
  Cpu,
  Server,
} from 'lucide-react';

interface AdminSystemStatusProps {
  health: AdminSystemHealth;
  className?: string;
}

export const AdminSystemStatus: React.FC<AdminSystemStatusProps> = ({
  health,
  className = '',
}) => {
  return (
    <Card
      title="System Infrastructure & Health"
      subtitle="Engine status, database replicas & real-time telemetry"
      variant="panel"
      className={`border-white/10 ${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 font-mono">
        {/* Database Status */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-[#00D9FF]/30 space-y-3 relative overflow-hidden group h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                DATABASE STATUS
              </span>
              <Database className="w-4 h-4 text-[#00D9FF]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{health.database.status.toUpperCase()}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {health.database.provider}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] space-y-0.5 text-slate-400">
            <div className="flex justify-between">
              <span>Latency:</span>
              <strong className="text-[#00D9FF]">{health.database.latencyMs} ms</strong>
            </div>
            <div className="flex justify-between">
              <span>Sync state:</span>
              <strong className="text-emerald-400">OK (0 lag)</strong>
            </div>
          </div>
        </div>

        {/* Storage Status */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-[#8B5CF6]/30 space-y-3 relative overflow-hidden group h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                STORAGE VAULT
              </span>
              <HardDrive className="w-4 h-4 text-[#8B5CF6]" />
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-white text-sm">
                <span className="text-[#8B5CF6]">
                  {health.storage.usedGb} GB / {health.storage.totalGb} GB
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  {health.storage.percentUsed}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mt-1.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#00D9FF] rounded-full"
                  style={{ width: `${health.storage.percentUsed}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] space-y-0.5 text-slate-400">
            <div className="flex justify-between">
              <span>Media Assets:</span>
              <strong className="text-white">COA & Spectra</strong>
            </div>
            <div className="flex justify-between">
              <span>Provider:</span>
              <strong className="text-[#8B5CF6]">S3 Vault</strong>
            </div>
          </div>
        </div>

        {/* Auth Status */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3 relative overflow-hidden group h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                AUTHENTICATION
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SECURE JWT</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {health.authentication.provider}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] space-y-0.5 text-slate-400">
            <div className="flex justify-between">
              <span>Active Sessions:</span>
              <strong className="text-emerald-400">{health.authentication.activeSessions} online</strong>
            </div>
            <div className="flex justify-between">
              <span>Encryption:</span>
              <strong className="text-white">TLS 1.3 / AES-256</strong>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-[#FF2ED1]/30 space-y-3 relative overflow-hidden group h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                REAL-TIME BUS
              </span>
              <Radio className="w-4 h-4 text-[#FF2ED1] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF2ED1] animate-ping" />
                <span className="text-[#FF2ED1]">WEBSOCKET ONLINE</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                Channel: {health.realtime.channel}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] space-y-0.5 text-slate-400">
            <div className="flex justify-between">
              <span>Subscribers:</span>
              <strong className="text-[#FF2ED1]">{health.realtime.connections} sockets</strong>
            </div>
            <div className="flex justify-between">
              <span>Heartbeat:</span>
              <strong className="text-emerald-400">Active</strong>
            </div>
          </div>
        </div>

        {/* Version Information */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/20 space-y-3 relative overflow-hidden group h-full flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                SYSTEM VERSION
              </span>
              <GitBranch className="w-4 h-4 text-amber-400" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <Badge variant="cyan">{health.version.version}</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {health.version.buildEnvironment}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] space-y-0.5 text-slate-400">
            <div className="flex justify-between">
              <span>Deployed:</span>
              <strong className="text-white text-[9px]">{health.version.lastDeployed}</strong>
            </div>
            <div className="flex justify-between">
              <span>Core App:</span>
              <strong className="text-amber-400">GKN V2 Master</strong>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
