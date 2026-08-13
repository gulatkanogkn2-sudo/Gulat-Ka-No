import React, { useState, useEffect } from 'react';
import { OwnerSettings } from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import {
  adminGovernanceService,
  AdminAccount,
  AdminRole,
  AdminAccountStatus,
  AdminSession,
} from '../../../../services/adminGovernanceService';
import { systemSettingsService } from '../../../../services/systemSettingsService';
import { ConfirmModal } from '../../../common/ConfirmModal';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Crown,
  Users,
  UserPlus,
  Edit2,
  Trash2,
  UserX,
  UserCheck,
  Key,
  Download,
  Upload,
  ArrowRight,
  AlertTriangle,
  X,
  Check,
  Laptop,
  LogOut,
  Radio,
  Eye,
  UserCog,
} from 'lucide-react';

export interface AdministratorsAndRolesTabProps {
  settings: OwnerSettings;
  onChange: (updated: OwnerSettings) => void;
}

export const AdministratorsAndRolesTab: React.FC<AdministratorsAndRolesTabProps> = ({
  settings,
  onChange,
}) => {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('ADMIN');

  const [editAccount, setEditAccount] = useState<AdminAccount | null>(null);
  const [editRoleValue, setEditRoleValue] = useState<AdminRole>('ADMIN');

  const [deleteAccountTarget, setDeleteAccountTarget] = useState<AdminAccount | null>(null);
  const [resetAccountTarget, setResetAccountTarget] = useState<AdminAccount | null>(null);

  // Import / Export JSON modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setAccounts(adminGovernanceService.getAdminAccounts());
    setSessions(adminGovernanceService.getSessions());
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Add Admin Handler
  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      showToast('error', 'Please provide both Name and Email for the administrator.');
      return;
    }

    adminGovernanceService.addAdminAccount({
      name: newAdminName.trim(),
      email: newAdminEmail.trim(),
      role: newAdminRole,
      status: 'Active',
    });

    refreshData();
    setIsAddModalOpen(false);
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminRole('ADMIN');
    showToast('success', `Administrator ${newAdminEmail} added successfully.`);
  };

  // Edit Role Handler
  const handleEditRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAccount) return;

    const res = adminGovernanceService.updateAdminAccount(editAccount.id, { role: editRoleValue });
    if (res.success) {
      refreshData();
      setEditAccount(null);
      showToast('success', `Role for ${editAccount.email} updated to ${editRoleValue}.`);
    } else {
      showToast('error', res.error || 'Failed to update role.');
    }
  };

  // Toggle Enable / Disable
  const handleToggleStatus = (account: AdminAccount) => {
    const nextStatus: AdminAccountStatus = account.status === 'Active' ? 'Disabled' : 'Active';
    const res = adminGovernanceService.updateAdminAccount(account.id, { status: nextStatus });
    if (res.success) {
      refreshData();
      showToast('success', `Account ${account.email} status changed to ${nextStatus}.`);
    } else {
      showToast('error', res.error || 'Failed to change status.');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteAccountTarget) return;
    const res = adminGovernanceService.deleteAdminAccount(deleteAccountTarget.id);
    if (res.success) {
      refreshData();
      setDeleteAccountTarget(null);
      showToast('success', `Administrator ${deleteAccountTarget.email} has been removed.`);
    } else {
      showToast('error', res.error || 'Failed to remove administrator.');
      setDeleteAccountTarget(null);
    }
  };

  // Reset Access Password
  const handleConfirmResetAccess = () => {
    if (!resetAccountTarget) return;
    adminGovernanceService.logActivity({
      actor: 'Owner (owner@gknpeptides.com)',
      action: 'Triggered Password & Session Reset',
      module: 'Admin Management',
      targetRef: resetAccountTarget.email,
      isSecurityEvent: true,
    });
    setResetAccountTarget(null);
    showToast('success', `Password reset invitation sent to ${resetAccountTarget.email}.`);
  };

  // Revoke Single Session
  const handleRevokeSession = (sessionId: string) => {
    const res = adminGovernanceService.revokeSession(sessionId);
    if (res.success) {
      refreshData();
      showToast('success', 'Session revoked successfully.');
    } else {
      showToast('error', res.error || 'Failed to revoke session.');
    }
  };

  // Revoke All Other Sessions
  const handleRevokeAllOtherSessions = () => {
    const res = adminGovernanceService.revokeAllOtherSessions();
    if (res.success) {
      refreshData();
      showToast('success', `Revoked ${res.count} active secondary session(s).`);
    }
  };

  // JSON Export / Import
  const handleExportJSON = () => {
    systemSettingsService.exportSettings();
    showToast('success', 'System Settings configuration exported as JSON.');
  };

  const handleImportSubmit = () => {
    setImportError(null);
    if (!importJsonText.trim()) {
      setImportError('Please paste valid System Settings JSON.');
      return;
    }
    const res = systemSettingsService.importSettings(importJsonText);
    if (res.success) {
      setIsImportModalOpen(false);
      setImportJsonText('');
      showToast('success', 'System Settings imported successfully.');
    } else {
      setImportError(res.error || 'Failed to parse JSON.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ShieldCheck size={16} />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Owner Protection Safeguards Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FF2ED1]/10 via-[#070B14] to-[#00D9FF]/10 border border-[#FF2ED1]/30 shadow-[0_0_20px_rgba(255,46,209,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF2ED1]/20 border border-[#FF2ED1]/50 flex items-center justify-center text-[#FF2ED1] flex-shrink-0 mt-0.5">
            <Crown size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                Owner Protection Rules Active
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF2ED1]/20 text-[#FF2ED1] border border-[#FF2ED1]/40 font-bold">
                LOCKED GOVERNANCE
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl font-mono">
              The primary Owner account cannot be deleted or demoted. Operational Admins cannot elevate their own roles to Owner or alter Owner security rules.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-bold text-xs font-mono flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.3)] flex-shrink-0"
        >
          <UserPlus size={16} />
          <span>Add Administrator</span>
        </button>
      </div>

      {/* Administrator Accounts Table */}
      <SettingCard
        title="Administrators & Personnel"
        description="Active administrative accounts with authenticated portal privileges"
        icon={<Users size={18} />}
        badge={
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 font-bold">
            {accounts.length} ACCOUNTS
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-white/5">
                <th className="py-3 px-4 font-bold">ADMINISTRATOR</th>
                <th className="py-3 px-4 font-bold">EMAIL</th>
                <th className="py-3 px-4 font-bold">ROLE</th>
                <th className="py-3 px-4 font-bold">STATUS</th>
                <th className="py-3 px-4 font-bold">LAST ACTIVE</th>
                <th className="py-3 px-4 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {accounts.map((acc) => {
                const isPrimary = acc.isPrimaryOwner;
                return (
                  <tr key={acc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            acc.role === 'OWNER'
                              ? 'bg-[#FF2ED1]/20 text-[#FF2ED1] border border-[#FF2ED1]/40'
                              : acc.role === 'ADMIN'
                              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                              : acc.role === 'STAFF'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                          }`}
                        >
                          {acc.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{acc.name}</span>
                          {isPrimary && (
                            <span className="text-[9px] text-[#FF2ED1] font-mono font-bold flex items-center space-x-1">
                              <Crown size={10} className="inline mr-0.5" />
                              PRIMARY OWNER
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">{acc.email}</td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                          acc.role === 'OWNER'
                            ? 'bg-[#FF2ED1]/10 text-[#FF2ED1] border-[#FF2ED1]/30'
                            : acc.role === 'ADMIN'
                            ? 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30'
                            : acc.role === 'STAFF'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {acc.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                          acc.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : acc.status === 'Disabled'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {acc.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">{acc.lastActive}</td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Edit Role Button */}
                        <button
                          onClick={() => {
                            setEditAccount(acc);
                            setEditRoleValue(acc.role);
                          }}
                          disabled={isPrimary}
                          title={isPrimary ? 'Primary Owner role is locked' : 'Edit Role'}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isPrimary
                              ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-600'
                              : 'bg-white/5 border-white/10 hover:border-[#00D9FF] text-slate-300 hover:text-[#00D9FF] cursor-pointer'
                          }`}
                        >
                          <Edit2 size={13} />
                        </button>

                        {/* Enable/Disable Button */}
                        <button
                          onClick={() => handleToggleStatus(acc)}
                          disabled={isPrimary}
                          title={
                            isPrimary
                              ? 'Primary Owner cannot be disabled'
                              : acc.status === 'Active'
                              ? 'Disable Account'
                              : 'Enable Account'
                          }
                          className={`p-1.5 rounded-lg border transition-all ${
                            isPrimary
                              ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-600'
                              : acc.status === 'Active'
                              ? 'bg-white/5 border-white/10 hover:border-rose-500 text-slate-300 hover:text-rose-400 cursor-pointer'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer'
                          }`}
                        >
                          {acc.status === 'Active' ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>

                        {/* Reset Access Button */}
                        <button
                          onClick={() => setResetAccountTarget(acc)}
                          title="Reset Password & Sessions"
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400 text-slate-300 hover:text-amber-400 transition-all cursor-pointer"
                        >
                          <Key size={13} />
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => setDeleteAccountTarget(acc)}
                          disabled={isPrimary}
                          title={isPrimary ? 'Primary Owner cannot be deleted' : 'Remove Administrator'}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isPrimary
                              ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-600'
                              : 'bg-white/5 border-white/10 hover:border-rose-500 text-slate-300 hover:text-rose-400 cursor-pointer'
                          }`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SettingCard>

      {/* Active Admin Sessions */}
      <SettingCard
        title="Active Administrative Portal Sessions"
        description="Authenticated device sessions currently connected to the GKN V2 Admin Console"
        icon={<Laptop size={18} />}
        actions={
          <button
            onClick={handleRevokeAllOtherSessions}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Revoke All Other Sessions</span>
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-white/5">
                <th className="py-3 px-4 font-bold">ADMIN ACCOUNT</th>
                <th className="py-3 px-4 font-bold">DEVICE & BROWSER</th>
                <th className="py-3 px-4 font-bold">IP ADDRESS</th>
                <th className="py-3 px-4 font-bold">LAST ACTIVITY</th>
                <th className="py-3 px-4 font-bold">STATUS</th>
                <th className="py-3 px-4 font-bold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{sess.adminName}</span>
                    <span className="text-[10px] text-slate-400">{sess.adminEmail}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-white block font-bold">{sess.device}</span>
                    <span className="text-[10px] text-slate-400">{sess.browser}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">{sess.ipAddress}</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {sess.isCurrentSession ? (
                      <span className="text-[#00D9FF] font-bold flex items-center gap-1">
                        <Radio size={12} className="animate-pulse" />
                        Active Now (Current Session)
                      </span>
                    ) : (
                      sess.lastActive
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                        sess.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {sess.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {sess.status === 'Active' && !sess.isCurrentSession ? (
                      <button
                        onClick={() => handleRevokeSession(sess.id)}
                        className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Revoke
                      </button>
                    ) : sess.isCurrentSession ? (
                      <span className="text-[10px] text-slate-500 italic">Current Device</span>
                    ) : (
                      <span className="text-[10px] text-rose-400 italic">Revoked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingCard>

      {/* Role Permissions Matrix */}
      <SettingCard
        title="Role Governance Permissions Matrix"
        description="Hierarchy and capability scopes assigned across administrative roles"
        icon={<Shield size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Owner Role Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#FF2ED1]/10 via-slate-950/80 to-slate-950 border border-[#FF2ED1]/30 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center space-x-1.5">
                <Crown size={16} className="text-[#FF2ED1]" />
                <h4 className="text-xs font-bold text-white uppercase">1. OWNER</h4>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF2ED1]/20 text-[#FF2ED1] font-bold">
                FULL
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Unrestricted master authority. Protected from deletion, demotion, or unauthorized displacement.
            </p>
            <div className="space-y-1 pt-1 text-[11px]">
              {[
                'Full Admin Portal Access',
                'System Settings & Parameters',
                'Administrator & Role Governance',
                'Security & 2FA Policies',
                'Financial Ledger & Revenue Logs',
                'Deployment & Recovery Tools',
              ].map((perm) => (
                <div key={perm} className="flex items-center space-x-1.5 text-slate-200">
                  <Check size={13} className="text-[#FF2ED1] flex-shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Admin Role Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#00D9FF]/10 via-slate-950/80 to-slate-950 border border-[#00D9FF]/30 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck size={16} className="text-[#00D9FF]" />
                <h4 className="text-xs font-bold text-white uppercase">2. ADMIN</h4>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00D9FF]/20 text-[#00D9FF] font-bold">
                OPERATIONAL
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Full operational store administrator for orders, products, customers, payments, shipping, research, and website.
            </p>
            <div className="space-y-1 pt-1 text-[11px]">
              {[
                'Order Queue & Management',
                'Payment Proof Verification',
                'Product Catalog & Add-Ons',
                'Shipping & Waybills',
                'Research & Media Assets',
                'Normal Operational Settings',
              ].map((perm) => (
                <div key={perm} className="flex items-center space-x-1.5 text-slate-200">
                  <Check size={13} className="text-[#00D9FF] flex-shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Staff Role Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-500/10 via-slate-950/80 to-slate-950 border border-purple-500/30 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center space-x-1.5">
                <UserCog size={16} className="text-purple-300" />
                <h4 className="text-xs font-bold text-white uppercase">3. STAFF</h4>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                RESTRICTED
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Restricted fulfillment clerk for order packing, tracking updates, and initial payment receipt checking.
            </p>
            <div className="space-y-1 pt-1 text-[11px]">
              {[
                'Read-Only Order Queue',
                'Fulfillment & Courier Tracking',
                'Payment Proof Review',
                'COA Certificate Viewing',
              ].map((perm) => (
                <div key={perm} className="flex items-center space-x-1.5 text-slate-200">
                  <Check size={13} className="text-purple-300 flex-shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Viewer Role Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/40 via-slate-950/80 to-slate-950 border border-slate-700 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center space-x-1.5">
                <Eye size={16} className="text-slate-400" />
                <h4 className="text-xs font-bold text-white uppercase">4. VIEWER</h4>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                READ-ONLY
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Read-only auditor access for store reports, order lists, activity logs, and diagnostic checks.
            </p>
            <div className="space-y-1 pt-1 text-[11px]">
              {[
                'Read-Only Analytics Views',
                'Report Exports',
                'Audit Log Inspection',
              ].map((perm) => (
                <div key={perm} className="flex items-center space-x-1.5 text-slate-200">
                  <Check size={13} className="text-slate-400 flex-shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Owner Controls Section */}
      <SettingCard
        title="Owner Governance Controls"
        description="Protected master operations and platform configuration backup tools"
        icon={<Crown size={18} />}
        badge={
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF2ED1]/10 text-[#FF2ED1] border border-[#FF2ED1]/30 font-bold uppercase">
            PROTECTED
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Add Admin Quick Control */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00D9FF] text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono">Add Administrator</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Provision new staff portal credentials</p>
            </div>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono">Export Configuration</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Download JSON settings backup</p>
            </div>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono">Import Configuration</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Restore settings from JSON</p>
            </div>
          </button>

          {/* Deployment / Advanced Link */}
          <Link
            to="/admin/settings?tab=deployment"
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF2ED1] text-left space-y-2 transition-all cursor-pointer group block"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FF2ED1]/10 text-[#FF2ED1] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRight size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1">
                Deployment / Advanced
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Technical diagnostics & tools</p>
            </div>
          </Link>
        </div>
      </SettingCard>

      {/* --- MODALS --- */}

      {/* Modal 1: Add Administrator */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-[0_0_30px_rgba(0,217,255,0.2)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-[#00D9FF]">
                <UserPlus size={18} />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Add Administrator
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAdminSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Administrator Name</label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full h-10 px-3.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g. alex@gknpeptides.com"
                  className="w-full h-10 px-3.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Role Assignment</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                  className="w-full h-10 px-3.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D9FF]"
                >
                  <option value="ADMIN">ADMIN (Operational Store Administrator)</option>
                  <option value="STAFF">STAFF (Fulfillment Clerk)</option>
                  <option value="VIEWER">VIEWER (Read-Only Auditor)</option>
                  <option value="OWNER">OWNER (Full Governance Scope)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-[11px] leading-relaxed">
                An activation link and initial credential reset invitation will be generated for the administrator.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-bold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Role */}
      {editAccount && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-[0_0_30px_rgba(0,217,255,0.2)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-[#00D9FF]">
                <Edit2 size={18} />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Edit Role — {editAccount.name}
                </h3>
              </div>
              <button onClick={() => setEditAccount(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditRoleSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Assigned Role</label>
                <select
                  value={editRoleValue}
                  onChange={(e) => setEditRoleValue(e.target.value as AdminRole)}
                  className="w-full h-10 px-3.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D9FF]"
                >
                  <option value="ADMIN">ADMIN (Operational Store Administrator)</option>
                  <option value="STAFF">STAFF (Fulfillment Clerk)</option>
                  <option value="VIEWER">VIEWER (Read-Only Auditor)</option>
                  <option value="OWNER">OWNER (Full Governance Scope)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-[11px] leading-relaxed">
                Role updates take effect immediately for active staff sessions.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditAccount(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-bold"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Confirm Delete */}
      {deleteAccountTarget && (
        <ConfirmModal
          isOpen={true}
          title="Remove Administrator Account"
          message={`Are you sure you want to remove administrator ${deleteAccountTarget.email}? They will immediately lose staff portal access.`}
          confirmText="Yes, Remove Administrator"
          cancelText="Cancel"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteAccountTarget(null)}
        />
      )}

      {/* Modal 4: Confirm Reset Access */}
      {resetAccountTarget && (
        <ConfirmModal
          isOpen={true}
          title="Reset Access Credentials"
          message={`Send a password reset invitation link and invalidate existing sessions for ${resetAccountTarget.email}?`}
          confirmText="Send Password Reset"
          cancelText="Cancel"
          variant="primary"
          onConfirm={handleConfirmResetAccess}
          onCancel={() => setResetAccountTarget(null)}
        />
      )}

      {/* Modal 5: Import JSON */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070B14] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <Upload size={18} />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Import System Configuration JSON
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {importError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-mono flex items-center space-x-2">
                <AlertTriangle size={16} />
                <span>{importError}</span>
              </div>
            )}

            <div className="space-y-2 font-mono text-xs">
              <label className="text-slate-300 font-bold block">
                Paste System Settings JSON payload:
              </label>
              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"general": {...}, "stores": {...}, "security": {...}}'
                className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono"
              >
                Restore Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
