import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { UserProfile, UserRole } from '../types';
import { IS_DEV_MODE, DEV_OWNER_USER } from './devAuthBypass';

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isStaff: boolean;
  isDevMode: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supabase, isConfigured } = useSupabase();
  const [user, setUser] = useState<UserProfile | null>(IS_DEV_MODE ? DEV_OWNER_USER : null);
  const [loading, setLoading] = useState<boolean>(!IS_DEV_MODE);

  useEffect(() => {
    // In Phase 4.5 Development Mode, bypass Supabase auth and use in-memory Development Owner
    if (IS_DEV_MODE) {
      setUser(DEV_OWNER_USER);
      setLoading(false);
      return;
    }

    if (!isConfigured || !supabase) {
      setLoading(false);
      return;
    }

    const loadTrustedProfile = async (authUser: { id: string; email?: string; created_at: string }) => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, status, created_at')
        .eq('id', authUser.id)
        .single();
      if (error || !profile || profile.status !== 'ACTIVE') {
        setUser(null);
        return;
      }
      setUser({
        id: profile.id,
        email: profile.email || authUser.email || '',
        fullName: profile.full_name || 'Researcher',
        role: profile.role as UserRole,
        createdAt: profile.created_at || authUser.created_at,
      });
    };

    const initAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) await loadTrustedProfile(authUser);
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadTrustedProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, isConfigured]);

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    if (!IS_DEV_MODE) {
      setUser(null);
    }
  };

  const isAuthenticated = IS_DEV_MODE || !!user;
  const isStaff = IS_DEV_MODE || user?.role === 'OWNER' || user?.role === 'ADMIN' || user?.role === 'STAFF';

  return (
    <AuthContext.Provider
      value={{
        user: IS_DEV_MODE ? (user || DEV_OWNER_USER) : user,
        loading: IS_DEV_MODE ? false : loading,
        isAuthenticated,
        isStaff,
        isDevMode: IS_DEV_MODE,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
