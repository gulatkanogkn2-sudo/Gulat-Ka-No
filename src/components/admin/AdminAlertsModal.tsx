import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAlertItem } from '../../types/admin';
import {
  X,
  Bell,
  CheckCheck,
  Check,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AdminAlertItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const AdminAlertsModal: React.FC<AdminAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkRead,
  onMarkAllRead,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const getSeverityBadge = (severity: AdminAlertItem['severity']) => {
    switch (severity) {
      case 'urgent':
        return {
          icon: ShieldAlert,
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-500',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
        };
      default:
        return {
          icon: Info,
          bg: 'bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF]',
          dot: 'bg-[#00D9FF]',
        };
    }
  };

  const handleAlertClick = (alert: AdminAlertItem) => {
    if (!alert.isRead) {
      onMarkRead(alert.id);
    }
    if (alert.linkPath) {
      navigate(alert.linkPath);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-[#070B14] border border-[#00D9FF]/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0A0F1D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  System Alerts
                </h3>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF2ED1] text-white shadow-[0_0_10px_rgba(255,46,209,0.5)]">
                    {unreadCount} Unread
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    All Caught Up
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Action items and operational events
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-slate-950/60 border-b border-white/5 flex items-center justify-between font-mono text-xs text-slate-400">
            <span>{unreadCount} unread alert{unreadCount > 1 ? 's' : ''}</span>
            <button
              onClick={onMarkAllRead}
              className="text-[#00D9FF] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          </div>
        )}

        {/* List of Alerts */}
        <div className="p-4 overflow-y-auto space-y-3 custom-scrollbar flex-1">
          {alerts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              No system alerts at this time.
            </div>
          ) : (
            alerts.map((alert) => {
              const badge = getSeverityBadge(alert.severity);
              const IconComp = badge.icon;

              return (
                <div
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                    alert.isRead
                      ? 'bg-slate-950/40 border-white/5 opacity-75 hover:opacity-100 hover:border-white/20'
                      : 'bg-slate-950/90 border-[#00D9FF]/40 shadow-[0_0_15px_rgba(0,217,255,0.05)] hover:border-[#00D9FF]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg border flex-shrink-0 mt-0.5 ${badge.bg}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-bold">
                            {alert.type}
                          </span>
                          {!alert.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#FF2ED1] animate-pulse flex-shrink-0" />
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3 text-[#FF2ED1]" />
                          {alert.timestamp}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors truncate">
                        {alert.title}
                      </h4>

                      <p className="text-xs text-slate-400 font-sans line-clamp-2">
                        {alert.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#00D9FF] flex items-center gap-1 font-bold group-hover:underline">
                          Open Module
                          <ArrowRight className="w-3 h-3" />
                        </span>

                        {!alert.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkRead(alert.id);
                            }}
                            className="text-slate-400 hover:text-emerald-400 transition-colors px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 flex items-center gap-1"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0A0F1D] border-t border-white/10 text-center font-mono text-[11px] text-slate-400">
          GKN Operations Alert Center
        </div>
      </div>
    </div>
  );
};

