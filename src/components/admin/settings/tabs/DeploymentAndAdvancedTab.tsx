import React, { useState, useEffect } from 'react';
import {
  SystemConfig,
  DeploymentSettings,
  NotificationSettings,
} from '../../../../types/systemSettings';
import {
  HealthCheckResult,
  DataInitCheckResult,
  SecurityCheckResult,
  DeploymentCheckItem,
  RoleDefinition,
  ReadinessReport,
  SupabaseConnectionStatus,
} from '../../../../types/initialSetup';
import { initialSetupService } from '../../../../services/initialSetupService';

// Sub-components
import { SystemConfigTab } from './SystemConfigTab';
import { DeploymentSettingsTab } from './DeploymentSettingsTab';
import { NotificationSettingsTab } from './NotificationSettingsTab';
import { FirstAdminSetupWizard } from '../../setup/FirstAdminSetupWizard';
import { SupabaseStatusCards } from '../../setup/SupabaseStatusCards';
import { DatabaseHealthCheckCard } from '../../setup/DatabaseHealthCheckCard';
import { DataInitializationCheckCard } from '../../setup/DataInitializationCheckCard';
import { SecurityValidationCard } from '../../setup/SecurityValidationCard';
import { DeploymentChecklistCard } from '../../setup/DeploymentChecklistCard';
import { SystemValidationReportModal } from '../../setup/SystemValidationReportModal';

// Icons
import {
  Cpu,
  Cloud,
  Bell,
  Shield,
  Play,
  FileText,
  RefreshCw,
  Crown,
  Database,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface DeploymentAndAdvancedTabProps {
  systemConfig: SystemConfig;
  deployment: DeploymentSettings;
  notifications: NotificationSettings;
  onUpdateSystemConfig: (updated: SystemConfig) => void;
  onUpdateNotifications: (updated: NotificationSettings) => void;
  subTabParam?: string;
}

export const DeploymentAndAdvancedTab: React.FC<DeploymentAndAdvancedTabProps> = ({
  systemConfig,
  deployment,
  notifications,
  onUpdateSystemConfig,
  onUpdateNotifications,
  subTabParam,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'deployment' | 'infrastructure' | 'setup' | 'notifications'
  >(() => {
    if (subTabParam === 'notifications') return 'notifications';
    if (subTabParam === 'setup') return 'setup';
    if (subTabParam === 'infrastructure') return 'infrastructure';
    return 'deployment';
  });

  // Diagnostics State
  const [supabaseStatus] = useState<SupabaseConnectionStatus>(() =>
    initialSetupService.getSupabaseStatus()
  );
  const [dbHealthChecks, setDbHealthChecks] = useState<HealthCheckResult[]>([]);
  const [dataChecks, setDataChecks] = useState<DataInitCheckResult[]>([]);
  const [securityChecks, setSecurityChecks] = useState<SecurityCheckResult[]>([]);
  const [checklist, setChecklist] = useState<DeploymentCheckItem[]>(() =>
    initialSetupService.getDeploymentChecklist()
  );
  const [roles] = useState<RoleDefinition[]>(() =>
    initialSetupService.getRoleHierarchy()
  );
  const [readinessReport, setReadinessReport] = useState<ReadinessReport | null>(null);

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);

  const loadDiagnostics = async () => {
    setIsLoadingDiagnostics(true);
    try {
      const db = await initialSetupService.validateDatabase();
      const dt = await initialSetupService.validateDataInitialization();
      const sc = await initialSetupService.validateSecurity();
      const rep = await initialSetupService.getReadinessReport();

      setDbHealthChecks(db);
      setDataChecks(dt);
      setSecurityChecks(sc);
      setReadinessReport(rep);
    } catch (err) {
      console.error('Error loading diagnostics:', err);
    } finally {
      setIsLoadingDiagnostics(false);
    }
  };

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const handleToggleCheckitem = (id: string, newStatus: DeploymentCheckItem['status']) => {
    const updated = initialSetupService.updateChecklistItem(id, newStatus);
    setChecklist(updated);
  };

  const handleResetChecklist = () => {
    const reset = initialSetupService.resetChecklist();
    setChecklist(reset);
  };

  const handleWizardComplete = () => {
    setIsWizardOpen(false);
    loadDiagnostics();
  };

  return (
    <div className="space-y-6">
      {/* Wizard Modal */}
      {isWizardOpen && (
        <FirstAdminSetupWizard
          isModal
          onComplete={handleWizardComplete}
          onCancel={() => setIsWizardOpen(false)}
        />
      )}

      {/* Validation Report Modal */}
      {readinessReport && (
        <SystemValidationReportModal
          report={readinessReport}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {/* Technical Header Controls Banner */}
      <div className="p-5 rounded-2xl bg-[#090D16] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
            <Cloud className="w-5 h-5 text-[#00D9FF]" />
            <span>Deployment & Developer Diagnostics</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Technical environment configuration, Supabase readiness, database diagnostics, and setup wizard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-white font-bold text-xs font-mono flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:brightness-110 cursor-pointer"
          >
            <Play size={14} />
            <span>Launch Setup Wizard</span>
          </button>

          <button
            type="button"
            onClick={loadDiagnostics}
            disabled={isLoadingDiagnostics}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoadingDiagnostics ? 'animate-spin' : ''} />
            <span>{isLoadingDiagnostics ? 'Diagnosing...' : 'Re-run Diagnostics'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <FileText size={14} />
            <span>Validation Report</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Pills */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#070B14] border border-white/10 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('deployment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'deployment'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cloud size={14} />
          <span>Deployment & Build Checklist</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('infrastructure')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'infrastructure'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Database size={14} />
          <span>Supabase & DB Health</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('setup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'setup'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield size={14} />
          <span>Security & Data Seeding</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'notifications'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bell size={14} />
          <span>Notifications & Alert Routing</span>
        </button>
      </div>

      {/* Render Active View */}

      {/* SubTab 1: Deployment & Build Checklist */}
      {activeSubTab === 'deployment' && (
        <div className="space-y-6 animate-fadeIn">
          <DeploymentSettingsTab settings={deployment} />
          <DeploymentChecklistCard
            checklist={checklist}
            onToggleItem={handleToggleCheckitem}
            onResetChecklist={handleResetChecklist}
          />
        </div>
      )}

      {/* SubTab 2: Supabase & DB Health */}
      {activeSubTab === 'infrastructure' && (
        <div className="space-y-6 animate-fadeIn">
          <SupabaseStatusCards status={supabaseStatus} />
          <DatabaseHealthCheckCard
            checks={dbHealthChecks}
            onRefresh={loadDiagnostics}
            isLoading={isLoadingDiagnostics}
          />
          <SystemConfigTab settings={systemConfig} onChange={onUpdateSystemConfig} />
        </div>
      )}

      {/* SubTab 3: Security & Data Seeding */}
      {activeSubTab === 'setup' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataInitializationCheckCard dataChecks={dataChecks} />
            <SecurityValidationCard securityChecks={securityChecks} />
          </div>

          {/* Role Architecture Card */}
          <div className="p-6 rounded-2xl bg-[#090D16] border border-white/10 space-y-4">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                <Crown className="text-[#FF2ED1]" size={18} />
                <span>Super Admin & Role Hierarchy Architecture</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Five-tier role hierarchy prepared for multi-staff administration and permission assignment
              </p>
            </div>

            <div className="space-y-3">
              {roles.map((r) => (
                <div
                  key={r.roleId}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white font-mono">{r.roleName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        Level {r.level}
                      </span>
                      {r.roleId === 'owner' && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FF2ED1]/10 text-[#FF2ED1] border border-[#FF2ED1]/30 font-bold">
                          SUPER ADMIN / ROOT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Assigned: {r.userCount} Accounts</span>
                  </div>

                  <p className="text-xs text-slate-300">{r.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {r.permissions.map((p, pIdx) => (
                      <span
                        key={`${r.roleId}-${p}-${pIdx}`}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Notifications */}
      {activeSubTab === 'notifications' && (
        <NotificationSettingsTab settings={notifications} onChange={onUpdateNotifications} />
      )}
    </div>
  );
};
