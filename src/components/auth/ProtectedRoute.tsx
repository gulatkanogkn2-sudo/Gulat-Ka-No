import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageContainer } from '../common/PageContainer';

/**
 * TEMPORARY PHASE 4.5 DEVELOPMENT PROTECTED ROUTE GUARD
 *
 * In Development Mode, authentication checks are bypassed to allow direct
 * access with the in-memory Development Owner account.
 * In Production Mode, standard Supabase authentication flow is enforced.
 */
export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, isDevMode } = useAuth();
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

  // Phase 4.5 Development Bypass
  if (isDevMode) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
