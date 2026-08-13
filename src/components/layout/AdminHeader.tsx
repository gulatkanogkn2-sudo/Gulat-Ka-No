import React from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';
import { BackButton } from './BackButton';
import { Badge } from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { Terminal, Menu } from 'lucide-react';

export interface AdminHeaderProps {
  title?: string;
  actions?: React.ReactNode;
  onToggleMobileMenu?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, actions, onToggleMobileMenu }) => {
  const location = useLocation();
  const { isDevMode } = useAuth();

  const rawPathParts = location.pathname.split('/').filter(Boolean);
  const currentTitle =
    title ||
    (rawPathParts.length > 0
      ? rawPathParts[rawPathParts.length - 1].replace(/-/g, ' ')
      : 'Dashboard');

  return (
    <header className="bg-[#0A0F1D] border-b border-white/10 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
      <div className="space-y-1">
        {/* Navigation Breadcrumb and Back Button Row */}
        <div className="flex items-center space-x-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-[#00D9FF]/50 transition-all cursor-pointer"
              title="Toggle Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#00D9FF]" />
            </button>
          )}
          <BackButton fallbackPath="/admin/dashboard" />
          <Breadcrumbs />
        </div>

        {/* Dynamic Page Title */}
        <h1 className="text-lg sm:text-xl font-bold text-slate-100 capitalize tracking-wide font-sans">
          {currentTitle}
        </h1>
      </div>

      {/* Admin Action Area & Operational / Development Badges */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {actions}

        {/* Phase 4.5 Temporary Development Admin Badge */}
        {isDevMode && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] sm:text-[11px] shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold uppercase tracking-wider">Dev Mode</span>
            </div>
          </div>
        )}

        <Badge variant="success">System Operational</Badge>
      </div>
    </header>
  );
};


