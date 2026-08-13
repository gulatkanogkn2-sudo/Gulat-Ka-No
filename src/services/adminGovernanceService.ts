export type AdminRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'VIEWER';

export type AdminAccountStatus = 'Active' | 'Disabled' | 'Pending';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminAccountStatus;
  lastActive: string;
  avatarUrl?: string;
  isPrimaryOwner?: boolean;
  createdAt: string;
}

export interface AdminSession {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  device: string;
  browser: string;
  ipAddress: string;
  lastActive: string;
  isCurrentSession?: boolean;
  status: 'Active' | 'Revoked';
}

export interface GovernanceActivityLog {
  id: string;
  actor: string;
  action: string;
  module: 'Security' | 'Settings' | 'Stores' | 'Orders' | 'Payments' | 'Admin Management' | 'Shipping' | 'Website';
  timestamp: string;
  targetRef?: string;
  isSecurityEvent?: boolean;
}

const STORAGE_KEY_ADMIN_ACCOUNTS = 'gkn_admin_accounts_v2';
const STORAGE_KEY_ACTIVITY_LOGS = 'gkn_admin_activity_logs_v2';
const STORAGE_KEY_SESSIONS = 'gkn_admin_sessions_v2';

const DEFAULT_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'usr_owner_1',
    name: 'Gulatkano Owner',
    email: 'owner@gknpeptides.com',
    role: 'OWNER',
    status: 'Active',
    lastActive: 'Just now',
    isPrimaryOwner: true,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'usr_admin_1',
    name: 'GKN Operational Admin',
    email: 'admin@gknpeptides.com',
    role: 'ADMIN',
    status: 'Active',
    lastActive: '12 mins ago',
    isPrimaryOwner: false,
    createdAt: '2025-03-10T00:00:00.000Z',
  },
  {
    id: 'usr_staff_1',
    name: 'Fulfillment Specialist',
    email: 'staff@gknpeptides.com',
    role: 'STAFF',
    status: 'Active',
    lastActive: '1 hour ago',
    isPrimaryOwner: false,
    createdAt: '2025-05-20T00:00:00.000Z',
  },
  {
    id: 'usr_viewer_1',
    name: 'Compliance Auditor',
    email: 'auditor@gknpeptides.com',
    role: 'VIEWER',
    status: 'Active',
    lastActive: '2 days ago',
    isPrimaryOwner: false,
    createdAt: '2025-06-01T00:00:00.000Z',
  },
];

const DEFAULT_SESSIONS: AdminSession[] = [
  {
    id: 'sess_cur_01',
    adminId: 'usr_owner_1',
    adminName: 'Gulatkano Owner',
    adminEmail: 'owner@gknpeptides.com',
    device: 'Desktop Workstation',
    browser: 'Chrome 127.0 (macOS)',
    ipAddress: '110.54.212.80',
    lastActive: 'Active Now',
    isCurrentSession: true,
    status: 'Active',
  },
  {
    id: 'sess_cur_02',
    adminId: 'usr_admin_1',
    adminName: 'GKN Operational Admin',
    adminEmail: 'admin@gknpeptides.com',
    device: 'MacBook Pro 16"',
    browser: 'Safari 17.5 (macOS)',
    ipAddress: '112.198.102.14',
    lastActive: '12 mins ago',
    isCurrentSession: false,
    status: 'Active',
  },
  {
    id: 'sess_cur_03',
    adminId: 'usr_staff_1',
    adminName: 'Fulfillment Specialist',
    adminEmail: 'staff@gknpeptides.com',
    device: 'iPad Pro (Lab Staging)',
    browser: 'Mobile Safari (iPadOS)',
    ipAddress: '112.198.102.22',
    lastActive: '1 hour ago',
    isCurrentSession: false,
    status: 'Active',
  },
];

const DEFAULT_ACTIVITY_LOGS: GovernanceActivityLog[] = [
  {
    id: 'act_101',
    actor: 'Owner (owner@gknpeptides.com)',
    action: 'Updated shipping method',
    module: 'Shipping',
    timestamp: '2026-08-11 23:15:10',
    targetRef: 'Standard Courier Fee set to ₱150',
    isSecurityEvent: false,
  },
  {
    id: 'act_102',
    actor: 'Admin (admin@gknpeptides.com)',
    action: 'Changed variant price',
    module: 'Stores',
    timestamp: '2026-08-11 22:40:02',
    targetRef: 'BPC-157 10mg: ₱1,850',
    isSecurityEvent: false,
  },
  {
    id: 'act_103',
    actor: 'Owner (owner@gknpeptides.com)',
    action: 'Enabled GCash payment method',
    module: 'Payments',
    timestamp: '2026-08-11 21:05:44',
    targetRef: 'Manual QR Code Verification',
    isSecurityEvent: false,
  },
  {
    id: 'act_104',
    actor: 'Admin (admin@gknpeptides.com)',
    action: 'Updated GroupBuy settings',
    module: 'Stores',
    timestamp: '2026-08-11 20:12:30',
    targetRef: 'Batch #12 Auto-close threshold',
    isSecurityEvent: false,
  },
  {
    id: 'act_105',
    actor: 'Owner (owner@gknpeptides.com)',
    action: 'Created administrator account',
    module: 'Admin Management',
    timestamp: '2026-08-11 19:30:15',
    targetRef: 'staff@gknpeptides.com (Role: ADMIN)',
    isSecurityEvent: true,
  },
  {
    id: 'act_106',
    actor: 'Admin (admin@gknpeptides.com)',
    action: 'Updated order status',
    module: 'Orders',
    timestamp: '2026-08-11 18:45:00',
    targetRef: 'Order #GKN-9021 set to Processing',
    isSecurityEvent: false,
  },
  {
    id: 'act_107',
    actor: 'Owner (owner@gknpeptides.com)',
    action: 'Updated 2FA Policy',
    module: 'Security',
    timestamp: '2026-08-11 15:00:12',
    targetRef: 'Enforcement: Required for Admins',
    isSecurityEvent: true,
  },
  {
    id: 'act_108',
    actor: 'System Security',
    action: 'Admin Login Success',
    module: 'Security',
    timestamp: '2026-08-11 14:10:05',
    targetRef: 'IP: 110.54.212.80 (2FA Verified)',
    isSecurityEvent: true,
  },
];

class AdminGovernanceService {
  private accounts: AdminAccount[] = [];
  private logs: GovernanceActivityLog[] = [];
  private sessions: AdminSession[] = [];

  constructor() {
    this.loadAccounts();
    this.loadLogs();
    this.loadSessions();
  }

  private loadSessions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (stored) {
        this.sessions = JSON.parse(stored);
      } else {
        this.sessions = [...DEFAULT_SESSIONS];
        this.saveSessions();
      }
    } catch {
      this.sessions = [...DEFAULT_SESSIONS];
    }
  }

  private saveSessions() {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(this.sessions));
    } catch {
      // Storage unavailable
    }
  }

  public getSessions(): AdminSession[] {
    return [...this.sessions];
  }

  public revokeSession(sessionId: string): { success: boolean; error?: string } {
    const idx = this.sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) return { success: false, error: 'Session not found' };

    const session = this.sessions[idx];
    if (session.isCurrentSession) {
      return { success: false, error: 'Cannot revoke your active current session from this console.' };
    }

    this.sessions[idx] = { ...session, status: 'Revoked' };
    this.saveSessions();

    this.logActivity({
      actor: 'Owner (owner@gknpeptides.com)',
      action: 'Revoked active admin session',
      module: 'Security',
      targetRef: `Session #${sessionId} (${session.adminEmail} on ${session.device})`,
      isSecurityEvent: true,
    });

    return { success: true };
  }

  public revokeAllOtherSessions(currentSessionId = 'sess_cur_01'): { success: boolean; count: number } {
    let count = 0;
    this.sessions = this.sessions.map((s) => {
      if (s.id !== currentSessionId && s.status === 'Active') {
        count++;
        return { ...s, status: 'Revoked' as const };
      }
      return s;
    });

    this.saveSessions();

    this.logActivity({
      actor: 'Owner (owner@gknpeptides.com)',
      action: 'Revoked all other active sessions',
      module: 'Security',
      targetRef: `Revoked ${count} session(s)`,
      isSecurityEvent: true,
    });

    return { success: true, count };
  }

  private loadAccounts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ADMIN_ACCOUNTS);
      if (stored) {
        this.accounts = JSON.parse(stored);
      } else {
        this.accounts = [...DEFAULT_ADMIN_ACCOUNTS];
        this.saveAccounts();
      }
    } catch {
      this.accounts = [...DEFAULT_ADMIN_ACCOUNTS];
    }
  }

  private saveAccounts() {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_ACCOUNTS, JSON.stringify(this.accounts));
    } catch {
      // Storage unavailable
    }
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVITY_LOGS);
      if (stored) {
        this.logs = JSON.parse(stored);
      } else {
        this.logs = [...DEFAULT_ACTIVITY_LOGS];
        this.saveLogs();
      }
    } catch {
      this.logs = [...DEFAULT_ACTIVITY_LOGS];
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITY_LOGS, JSON.stringify(this.logs));
    } catch {
      // Storage unavailable
    }
  }

  public getAdminAccounts(): AdminAccount[] {
    return [...this.accounts];
  }

  public addAdminAccount(account: Omit<AdminAccount, 'id' | 'createdAt' | 'lastActive'>): AdminAccount {
    const newAcc: AdminAccount = {
      ...account,
      id: `usr_admin_${Date.now()}`,
      lastActive: 'Never',
      createdAt: new Date().toISOString(),
    };
    this.accounts.push(newAcc);
    this.saveAccounts();

    this.logActivity({
      actor: 'Owner (owner@gknpeptides.com)',
      action: `Created ${account.role} account`,
      module: 'Admin Management',
      targetRef: `${account.email} (${account.name})`,
      isSecurityEvent: true,
    });

    return newAcc;
  }

  public updateAdminAccount(id: string, updates: Partial<AdminAccount>): { success: boolean; error?: string } {
    const idx = this.accounts.findIndex((a) => a.id === id);
    if (idx === -1) return { success: false, error: 'Account not found' };

    const target = this.accounts[idx];

    // Protection rule: Cannot demote or disable primary owner
    if (target.isPrimaryOwner) {
      if (updates.role && updates.role !== 'OWNER') {
        return { success: false, error: 'The primary Owner account cannot be demoted.' };
      }
      if (updates.status && updates.status !== 'Active') {
        return { success: false, error: 'The primary Owner account cannot be disabled.' };
      }
    }

    this.accounts[idx] = { ...target, ...updates };
    this.saveAccounts();

    if (updates.role) {
      this.logActivity({
        actor: 'Owner (owner@gknpeptides.com)',
        action: `Changed role to ${updates.role}`,
        module: 'Admin Management',
        targetRef: target.email,
        isSecurityEvent: true,
      });
    }

    if (updates.status) {
      this.logActivity({
        actor: 'Owner (owner@gknpeptides.com)',
        action: `Set status to ${updates.status}`,
        module: 'Admin Management',
        targetRef: target.email,
        isSecurityEvent: true,
      });
    }

    return { success: true };
  }

  public deleteAdminAccount(id: string): { success: boolean; error?: string } {
    const target = this.accounts.find((a) => a.id === id);
    if (!target) return { success: false, error: 'Account not found' };

    // Protection rule: Primary owner cannot be deleted
    if (target.isPrimaryOwner) {
      return { success: false, error: 'The primary Owner account cannot be deleted.' };
    }

    // Protection rule: Ensure at least one OWNER remains
    const remainingOwners = this.accounts.filter((a) => a.role === 'OWNER' && a.id !== id);
    if (remainingOwners.length === 0) {
      return { success: false, error: 'Cannot remove the final Owner account.' };
    }

    this.accounts = this.accounts.filter((a) => a.id !== id);
    this.saveAccounts();

    this.logActivity({
      actor: 'Owner (owner@gknpeptides.com)',
      action: 'Removed administrator account',
      module: 'Admin Management',
      targetRef: target.email,
      isSecurityEvent: true,
    });

    return { success: true };
  }

  public getActivityLogs(): GovernanceActivityLog[] {
    return [...this.logs];
  }

  public logActivity(log: Omit<GovernanceActivityLog, 'id' | 'timestamp'>): GovernanceActivityLog {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: GovernanceActivityLog = {
      ...log,
      id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: nowStr,
    };
    this.logs.unshift(newLog);
    // Keep max 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }
    this.saveLogs();
    return newLog;
  }
}

export const adminGovernanceService = new AdminGovernanceService();
