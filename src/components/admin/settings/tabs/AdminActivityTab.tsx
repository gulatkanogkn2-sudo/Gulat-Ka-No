import React, { useState, useEffect } from 'react';
import { SettingCard } from '../common/SettingCard';
import { adminGovernanceService, GovernanceActivityLog } from '../../../../services/adminGovernanceService';
import {
  Activity,
  Filter,
  Search,
  Shield,
  Clock,
  User,
  ShieldAlert,
  RotateCcw,
  Download,
  FileText,
  Lock,
  ShoppingCart,
  CreditCard,
  Box,
  Truck,
  Globe,
  Tag,
} from 'lucide-react';

export const AdminActivityTab: React.FC = () => {
  const [logs, setLogs] = useState<GovernanceActivityLog[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [securityOnly, setSecurityOnly] = useState<boolean>(false);

  useEffect(() => {
    refreshLogs();
  }, []);

  const refreshLogs = () => {
    setLogs(adminGovernanceService.getActivityLogs());
  };

  const filteredLogs = logs.filter((log) => {
    if (securityOnly && !log.isSecurityEvent) return false;
    if (selectedModule !== 'ALL' && log.module !== selectedModule) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actor.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchTarget = (log.targetRef || '').toLowerCase().includes(q);
      const matchModule = log.module.toLowerCase().includes(q);
      return matchActor || matchAction || matchTarget || matchModule;
    }
    return true;
  });

  const getModuleBadge = (module: string) => {
    switch (module) {
      case 'Security':
        return {
          icon: ShieldAlert,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        };
      case 'Admin Management':
        return {
          icon: User,
          color: 'text-[#FF2ED1] bg-[#FF2ED1]/10 border-[#FF2ED1]/30',
        };
      case 'Settings':
        return {
          icon: Activity,
          color: 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30',
        };
      case 'Stores':
        return {
          icon: Box,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
      case 'Orders':
        return {
          icon: ShoppingCart,
          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        };
      case 'Payments':
        return {
          icon: CreditCard,
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        };
      case 'Shipping':
        return {
          icon: Truck,
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        };
      case 'Website':
        return {
          icon: Globe,
          color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
        };
      default:
        return {
          icon: Activity,
          color: 'text-slate-300 bg-white/10 border-white/20',
        };
    }
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['ID', 'Timestamp', 'Actor', 'Action', 'Module', 'Security Event', 'Target Reference'],
      ...filteredLogs.map((l) => [
        l.id,
        l.timestamp,
        `"${l.actor}"`,
        `"${l.action}"`,
        l.module,
        l.isSecurityEvent ? 'YES' : 'NO',
        `"${l.targetRef || ''}"`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gkn_admin_activity_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const securityEventsCount = logs.filter((l) => l.isSecurityEvent).length;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Total Logged Activities</span>
            <div className="text-xl font-bold text-white font-mono">{logs.length}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] flex items-center justify-center border border-[#00D9FF]/30">
            <Activity size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Security Relevant Events</span>
            <div className="text-xl font-bold text-amber-400 font-mono">{securityEventsCount}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <ShieldAlert size={18} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Active Audit Scope</span>
            <div className="text-sm font-bold text-emerald-400 font-mono">LIGHTWEIGHT AUDIT</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Shield size={18} />
          </div>
        </div>
      </div>

      {/* Activity Log Card */}
      <SettingCard
        title="Admin Activity Log"
        description="Lightweight administrative activity trail logging staff actions and security events"
        icon={<Activity size={18} />}
        badge={
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 font-bold">
            {filteredLogs.length} DISPLAYED
          </span>
        }
      >
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white/5 rounded-xl border border-white/10 font-mono text-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actor, action, or target..."
                className="w-full h-9 pl-9 pr-3 bg-slate-950 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00D9FF] text-xs"
              />
            </div>

            {/* Module Filter Select */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="h-9 bg-slate-950 text-xs text-slate-300 border border-white/10 rounded-lg px-2.5 focus:outline-none focus:border-[#00D9FF]"
              >
                <option value="ALL">All Modules</option>
                <option value="Security">Security</option>
                <option value="Admin Management">Admin Management</option>
                <option value="Settings">Settings</option>
                <option value="Stores">Stores</option>
                <option value="Orders">Orders</option>
                <option value="Payments">Payments</option>
                <option value="Shipping">Shipping</option>
                <option value="Website">Website</option>
              </select>

              {/* Security Only Toggle */}
              <button
                type="button"
                onClick={() => setSecurityOnly(!securityOnly)}
                className={`h-9 px-3 rounded-lg border flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  securityOnly
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <ShieldAlert size={13} />
                <span>Security Only</span>
              </button>

              {/* Export CSV */}
              <button
                type="button"
                onClick={handleExportCSV}
                title="Export Log as CSV"
                className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Activity Logs Table */}
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500 space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <div>No administrative activities match your search or filter criteria.</div>
            </div>
          ) : (
            <div className="space-y-2.5 font-sans">
              {filteredLogs.map((log) => {
                const badge = getModuleBadge(log.module);
                const IconComp = badge.icon;

                return (
                  <div
                    key={log.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      log.isSecurityEvent
                        ? 'bg-slate-950/90 border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.05)]'
                        : 'bg-slate-950/70 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2.5 rounded-xl border flex-shrink-0 mt-0.5 ${badge.color}`}>
                        <IconComp size={16} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono">
                          <span className="text-xs font-bold text-white">{log.action}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                            {log.module}
                          </span>
                          {log.isSecurityEvent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center space-x-1">
                              <ShieldAlert size={10} className="inline mr-0.5" />
                              SECURITY EVENT
                            </span>
                          )}
                        </div>

                        {log.targetRef && (
                          <div className="text-xs text-slate-300 font-mono">
                            Target: <span className="text-[#00D9FF]">{log.targetRef}</span>
                          </div>
                        )}

                        <div className="text-[11px] font-mono text-slate-400">
                          Actor: <span className="text-slate-200">{log.actor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 text-right font-mono text-xs border-t md:border-t-0 border-white/5 pt-2 md:pt-0 text-slate-400">
                      <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                        <Clock size={12} className="text-[#FF2ED1]" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SettingCard>
    </div>
  );
};
