import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * TEMPORARY PHASE 4.5 DEVELOPMENT ADMIN ROUTE GUARD
 *
 * In Development Mode, authentication checks are bypassed to allow direct
 * access to all Admin routes with the in-memory Development Owner account.
 * In Production Mode, standard Supabase authentication flow is enforced.
 */
export const AdminRoute: React.FC = () => {
  const { isAuthenticated, isStaff, loading, isDevMode } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050810]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 rounded-full bg-[#00D9FF] animate-ping mx-auto opacity-75"></div>
          <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">Admin System Init...</p>
        </div>
      </div>
    );
  }

  // Phase 4.5 Development Bypass: Allow direct access during development
  if (isDevMode) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isStaff) {
    return <Navigate to="/" replace />; // Redirect non-admins to storefront
  }

  return <Outlet />;
};
