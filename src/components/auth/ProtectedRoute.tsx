import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../common/PageContainer';
import { Button } from '../common/Button';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, isDevMode, accountError, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 rounded-full bg-[#00D9FF] animate-ping mx-auto opacity-75"></div>
            <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">Authenticating...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Development Bypass
  if (isDevMode) {
    return <Outlet />;
  }

  if (accountError) {
    return (
      <PageContainer title="Account Status Notice">
        <div className="max-w-md mx-auto py-8">
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Access Restricted</h3>
            <p className="text-xs text-red-300/90 leading-relaxed">
              {accountError}
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full border-red-500/40 text-red-300 hover:bg-red-500/20 hover:text-white"
              >
                Sign Out / Return to Sign In
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
