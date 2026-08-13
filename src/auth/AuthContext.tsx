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

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // For now, getting role from user_metadata. Default to customer.
          const role = (session.user.user_metadata?.role as UserRole) || 'customer';
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || 'Researcher',
            role,
            createdAt: session.user.created_at,
          });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = (session.user.user_metadata?.role as UserRole) || 'customer';
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || 'Researcher',
          role,
          createdAt: session.user.created_at,
        });
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
  const isStaff = IS_DEV_MODE || user?.role === 'owner' || user?.role === 'manager' || user?.role === 'staff';

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
