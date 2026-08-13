import React from 'react';
import { AdminHeaderData } from '../../types/admin';
import { Badge } from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import {
  Bell,
  ShieldCheck,
  UserCheck,
  Zap,
} from 'lucide-react';

interface AdminHeaderWidgetProps {
  data: AdminHeaderData;
  onOpenAlerts?: () => void;
  className?: string;
}

export const AdminHeaderWidget: React.FC<AdminHeaderWidgetProps> = ({
  data,
  onOpenAlerts,
  className = '',
}) => {
  const { user, isDevMode } = useAuth();

  // Display user details according to development context or header data
  const adminDisplayName = isDevMode ? (user?.fullName || 'Development Owner') : data.adminUser.name;
  const adminRoleDisplay = isDevMode ? 'OWNER (SUPER_ADMIN)' : `${data.adminUser.role} (${data.adminUser.level})`;

  return (
    <div
      className={`relative rounded-2xl bg-[#070B14]/90 border border-[#00D9FF]/30 p-5 sm:p-6 backdrop-blur-md overflow-hidden shadow-[0_0_30px_rgba(0,217,255,0.08)] ${className}`}
    >
      {/* Background Neon Accent Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#FF2ED1]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        {/* Left Welcome Message & Admin Credentials */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              GKN CONTROL CENTER
            </span>
            <Badge variant="cyan" glow>
              <ShieldCheck className="w-3 h-3 mr-1" />
              {data.systemStatus.toUpperCase()}
            </Badge>

            {isDevMode && (
              <span className="text-[10px] font-mono bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                DEV MODE
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {data.welcomeMessage}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300 pt-0.5">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-white/10 text-white font-bold">
              <UserCheck className="w-3.5 h-3.5 text-[#00D9FF]" />
              {adminDisplayName}
            </span>
            <span className="text-slate-400 font-sans hidden sm:inline">|</span>
            <span className="text-slate-400 truncate">{adminRoleDisplay}</span>
          </div>
        </div>

        {/* Right Info: Notification Badge */}
        <div className="flex items-center gap-3">
          {/* Functional Unread Alerts Button */}
          <button
            onClick={onOpenAlerts}
            className="relative px-4 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 hover:border-[#00D9FF]/50 hover:bg-[#00D9FF]/10 transition-all flex items-center gap-3 cursor-pointer group shadow-lg"
          >
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-300 group-hover:text-[#00D9FF] transition-colors" />
              {data.unreadNotificationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FF2ED1] text-white text-[9px] font-bold font-mono flex items-center justify-center animate-bounce shadow-[0_0_8px_rgba(255,46,209,0.8)]">
                  {data.unreadNotificationsCount}
                </span>
              )}
            </div>
            <div className="font-mono text-xs text-left">
              <span className="text-slate-400 block text-[10px] uppercase group-hover:text-slate-300">
                Alerts Center
              </span>
              <span className="text-white font-bold group-hover:text-[#00D9FF] transition-colors">
                {data.unreadNotificationsCount > 0
                  ? `${data.unreadNotificationsCount} Unread`
                  : '0 Alerts'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
