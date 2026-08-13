import React, { useState, useEffect } from 'react';
import {
  systemStatusService,
  OverallSystemStatusData,
} from '../../services/systemStatusService';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Database,
  HardDrive,
  Radio,
  Cpu,
  Layers,
  ArrowRight,
  Clock,
  Bell,
  CheckCircle,
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  BookOpen,
  Image as ImageIcon,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminSetupPage: React.FC = () => {
  const [statusData, setStatusData] = useState<OverallSystemStatusData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const data = await systemStatusService.getSystemStatus();
      setStatusData(data);
    } catch (err) {
      console.error('Error fetching system status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusBadge = (status: 'OPERATIONAL' | 'WARNING' | 'ERROR' | 'NOT_VERIFIED') => {
    switch (status) {
      case 'OPERATIONAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            OPERATIONAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            WARNING
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            ERROR
          </span>
        );
      case 'NOT_VERIFIED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            NOT VERIFIED
          </span>
        );
    }
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'auth':
        return <ShieldCheck className="w-5 h-5 text-[#00D9FF]" />;
      case 'database':
        return <Database className="w-5 h-5 text-[#00D9FF]" />;
      case 'storage':
        return <HardDrive className="w-5 h-5 text-[#8B5CF6]" />;
      case 'realtime':
        return <Radio className="w-5 h-5 text-[#FF2ED1]" />;
      case 'application':
      default:
        return <Cpu className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'groupbuy':
      case 'onhand':
      case 'moq':
        return <ShoppingBag className="w-4 h-4 text-[#00D9FF]" />;
      case 'cart':
      case 'checkout':
      case 'payment_methods':
      case 'payment_verification':
        return <CreditCard className="w-4 h-4 text-[#FF2ED1]" />;
      case 'orders':
      case 'shipping':
        return <Truck className="w-4 h-4 text-[#8B5CF6]" />;
      case 'research_hub':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'media_library':
        return <ImageIcon className="w-4 h-4 text-amber-400" />;
      case 'customer_auth':
      case 'admin_panel':
      default:
        return <Lock className="w-4 h-4 text-[#00D9FF]" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Banner Header */}
      <div className="p-6 border border-white/10 rounded-2xl bg-gradient-to-r from-[#0A0F1D] via-[#050810] to-[#0A0F1D] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/20 border border-[#00D9FF]/50 flex items-center justify-center text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.3)]">
              <Activity size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide flex items-center space-x-2">
                <span>System Status</span>
                <span className="text-[#00D9FF] font-mono text-xs">OPERATIONAL MONITORING</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Real-time operational health telemetry across GKN V2 core infrastructure and storefront services.
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Advanced Redirect */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchStatus}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-mono font-semibold flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D9FF]' : ''} />
            <span>{isLoading ? 'Rechecking...' : 'Recheck Status'}</span>
          </button>

          <Link
            to="/admin/settings?tab=deployment"
            className="px-4 py-2 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Layers size={14} />
            <span>Deployment & Advanced</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* SECTION A: OVERALL SYSTEM STATUS */}
      {statusData && (
        <div className="p-6 rounded-2xl bg-[#090D16] border border-white/15 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  statusData.overallStatus === 'ALL_SYSTEMS_OPERATIONAL'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : statusData.overallStatus === 'DEGRADED_PERFORMANCE'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                }`}
              >
                {statusData.overallStatus === 'ALL_SYSTEMS_OPERATIONAL' ? (
                  <ShieldCheck size={28} />
                ) : (
                  <AlertTriangle size={28} />
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Overall System Health State
                </span>
                <h2 className="text-lg font-bold font-mono text-white tracking-wide">
                  {statusData.statusLabel}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 self-start sm:self-auto">
              <Clock size={14} className="text-[#00D9FF]" />
              <span>Last Checked: {statusData.lastChecked}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 font-mono">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block">Core Infrastructure</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {statusData.coreServices.filter((s) => s.status === 'OPERATIONAL').length} / {statusData.coreServices.length} Services Online
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block">Application Modules</span>
              <span className="text-sm font-bold text-[#00D9FF] mt-1 block">
                {statusData.moduleStatuses.filter((m) => m.status === 'OPERATIONAL').length} / {statusData.moduleStatuses.length} Verified
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block">Active Alerts</span>
              <span className={`text-sm font-bold mt-1 block ${statusData.activeAlerts.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {statusData.activeAlerts.length === 0 ? '0 Active Alerts' : `${statusData.activeAlerts.length} System Warning(s)`}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block">Environment Status</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>Configuration Valid</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: CORE SERVICES */}
      {statusData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2">
              <Server className="text-[#00D9FF]" size={18} />
              <span>Core Infrastructure Services</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Live service status & telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statusData.coreServices.map((service) => (
              <div
                key={service.id}
                className="p-4 rounded-xl bg-[#090D16] border border-white/10 flex flex-col justify-between space-y-3 hover:border-white/20 transition-all shadow-lg"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {getServiceIcon(service.id)}
                    </div>
                    {getStatusBadge(service.status)}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">{service.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{service.provider}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] font-mono space-y-1">
                  <span className="text-[#00D9FF] font-bold block truncate">{service.metrics}</span>
                  <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{service.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION C: GKN APPLICATION MODULES */}
      {statusData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2">
              <Layers className="text-[#8B5CF6]" size={18} />
              <span>GKN Application Modules Operational Health</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              13 Core System Modules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statusData.moduleStatuses.map((mod) => (
              <div
                key={mod.id}
                className="p-4 rounded-xl bg-[#090D16] border border-white/10 flex flex-col justify-between space-y-3 hover:border-[#00D9FF]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                      {getModuleIcon(mod.id)}
                    </div>
                    <span className="text-xs font-bold text-white font-mono truncate">{mod.name}</span>
                  </div>
                  <div className="shrink-0">{getStatusBadge(mod.status)}</div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-mono font-bold text-[#00D9FF] block">
                    {mod.metricLabel}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-tight">{mod.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION D & E: SYSTEM ALERTS & RECENT EVENTS */}
      {statusData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECTION D: SYSTEM ALERTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2">
                <Bell className="text-amber-400" size={18} />
                <span>System Alerts</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {statusData.activeAlerts.length} Active
              </span>
            </div>

            {statusData.activeAlerts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#090D16] border border-white/10 text-center space-y-2 flex flex-col items-center justify-center min-h-[160px]">
                <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle size={24} />
                </div>
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                  No Active System Alerts
                </h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  All system modules and core infrastructure services are operating normally with zero active warnings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {statusData.activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-xl bg-[#090D16] border border-amber-500/30 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-amber-400 font-mono uppercase">
                          [{alert.module}] {alert.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{alert.description}</p>
                      <span className="text-[10px] text-slate-500 font-mono block pt-1">
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION E: RECENT SYSTEM EVENTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2">
                <Clock className="text-[#00D9FF]" size={18} />
                <span>Recent System Events</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                System Activity Trail
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#090D16] border border-white/10 space-y-3">
              {statusData.recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-[#00D9FF] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white font-mono block truncate">
                        {evt.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Category: {evt.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0 bg-black/40 px-2 py-1 rounded border border-white/10">
                    {evt.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation Tip */}
      <div className="p-4 rounded-xl bg-[#00D9FF]/5 border border-[#00D9FF]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2 text-slate-300">
          <FileText size={16} className="text-[#00D9FF] shrink-0" />
          <span>Looking for developer setup wizards, database schema checks, or deployment verification checklists?</span>
        </div>
        <Link
          to="/admin/settings?tab=deployment"
          className="text-[#00D9FF] font-bold hover:underline flex items-center space-x-1 shrink-0"
        >
          <span>Open Deployment & Advanced Settings</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
