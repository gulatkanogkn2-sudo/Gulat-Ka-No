import React, { useState, useEffect } from 'react';
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { CustomerHeader } from '../components/layout/CustomerHeader';
import { CustomerFooter } from '../components/layout/CustomerFooter';
import { systemSettingsService } from '../services/systemSettingsService';
import { Wrench, ShieldAlert, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, loading, isDevMode } = useAuth();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [maintenanceTitle, setMaintenanceTitle] = useState('Scheduled Maintenance');
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "We're currently performing scheduled maintenance. Please check back shortly."
  );
  const [maintenanceReturnText, setMaintenanceReturnText] = useState('Expected back online shortly.');

  useEffect(() => {
    const updateSettings = () => {
      const s = systemSettingsService.getSettings();
      const active = Boolean(s.general?.maintenanceMode || s.systemConfig?.maintenanceMode);
      setIsMaintenance(active);
      setMaintenanceTitle(s.general?.maintenanceTitle || 'Scheduled Maintenance');
      setMaintenanceMessage(
        s.general?.maintenanceMessage ||
          s.systemConfig?.maintenanceMessage ||
          "We're currently performing scheduled maintenance. Please check back shortly."
      );
      setMaintenanceReturnText(s.general?.maintenanceReturnText || 'Expected back online shortly.');
    };

    updateSettings();
    const unsubscribe = systemSettingsService.subscribe(updateSettings);
    return () => unsubscribe();
  }, []);

  const publicAuthRoutes = new Set(['/login', '/sign-in', '/register', '/forgot-password', '/reset-password']);
  const isPublicAuthRoute = publicAuthRoutes.has(location.pathname);

  if (loading && !isPublicAuthRoute) {
    return (
      <div className="min-h-screen bg-[#050810] text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 rounded-full bg-[#00D9FF] animate-ping mx-auto opacity-75" />
          <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">Loading GKN V2...</p>
        </div>
      </div>
    );
  }

  if (!loading && !isAuthenticated && !isDevMode && !isPublicAuthRoute) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isPublicAuthRoute) {
    return <Outlet />;
  }

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#050810] text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans selection:bg-[#00D9FF]/30 selection:text-[#00D9FF]">
        {/* Background Ambient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#FF2ED1]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Minimal Header */}
        <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800/80 z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-wider text-white">
              GKN <span className="text-[#00D9FF]">V2</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300 uppercase">
              Maintenance Active
            </span>
          </div>
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#00D9FF] text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Admin Login</span>
          </Link>
        </header>

        {/* Maintenance Message Center */}
        <main className="max-w-xl mx-auto w-full text-center space-y-6 my-auto py-12 z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Wrench className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              {maintenanceTitle}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto font-sans">
              {maintenanceMessage}
            </p>
          </div>

          {maintenanceReturnText && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-[#00D9FF]">
              <ShieldAlert className="w-4 h-4 text-[#00D9FF]" />
              <span>{maintenanceReturnText}</span>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800/80 max-w-sm mx-auto">
            <p className="text-xs text-slate-500 font-mono">
              For urgent research logistics inquiries, contact admin support.
            </p>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="max-w-5xl mx-auto w-full text-center py-4 text-[11px] font-mono text-slate-600 border-t border-slate-800/80 z-10">
          GKN V2 Platform Operations &copy; {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050810] text-slate-100 font-sans selection:bg-[#00D9FF]/30 selection:text-[#00D9FF]">
      {/* Customer Header Component */}
      <CustomerHeader />

      {/* Main Content Container with Background Ambient Orbs */}
      <main className="flex-1 relative">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-64 right-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none"></div>

        <Outlet />
      </main>

      {/* Customer Footer Component */}
      <CustomerFooter />
    </div>
  );
};

