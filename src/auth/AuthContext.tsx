import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { UserProfile, UserRole } from '../types';
import { IS_DEV_MODE, DEV_OWNER_USER } from './devAuthBypass';

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isStaff: boolean;
  isDevMode: boolean;
  accountError: string | null;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supabase, isConfigured } = useSupabase();
  const [user, setUser] = useState<UserProfile | null>(IS_DEV_MODE ? DEV_OWNER_USER : null);
  const [loading, setLoading] = useState<boolean>(!IS_DEV_MODE);
  const [accountError, setAccountError] = useState<string | null>(null);

  const loadTrustedProfile = useCallback(async (authUser: { id: string; email?: string; created_at: string }) => {
    if (!supabase) return;
    setAccountError(null);

    // Query profiles table safely retrieving all available fields
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    // Fail-Closed: If profile does not exist or database lookup fails, deny access
    if (error || !profile) {
      console.warn('[AuthFlow] Profile lookup failed:', error?.message || 'Profile row not found');
      setUser(null);
      setAccountError('Unable to load authoritative account profile. Access denied.');
      return;
    }

    const rawStatus = profile.status ? String(profile.status).trim().toUpperCase() : 'ACTIVE';
    const rawRole = profile.role ? String(profile.role).trim().toUpperCase() : 'CUSTOMER';

    // Check authoritative status: Only ACTIVE profiles are granted access
    if (rawStatus !== 'ACTIVE') {
      setUser(null);
      if (rawStatus === 'SUSPENDED') {
        setAccountError('Your account has been suspended. Please contact GKN support.');
      } else if (rawStatus === 'DISABLED') {
        setAccountError('Your account has been disabled. Please contact GKN support.');
      } else if (rawStatus === 'BANNED') {
        setAccountError('Your account has been permanently banned. Access is denied.');
      } else {
        setAccountError(`Your account status is ${profile.status || rawStatus}. Access denied.`);
      }
      return;
    }

    setAccountError(null);
    setUser({
      id: profile.id,
      email: profile.email || authUser.email || '',
      fullName: profile.full_name || 'Customer',
      preferredName: profile.preferred_name || undefined,
      phone: profile.phone || undefined,
      birthDate: profile.birth_date || undefined,
      primaryAddress: profile.primary_address || undefined,
      cityProvince: profile.city_province || undefined,
      avatarUrl: profile.avatar_url || undefined,
      role: (rawRole as UserRole) || 'CUSTOMER',
      status: rawStatus,
      tier: profile.tier || 'STANDARD',
      customerCode: profile.customer_code || undefined,
      verificationStatus: profile.verification_status || 'UNVERIFIED',
      qualifyingLifetimeSpendingPhp: profile.qualifying_lifetime_spending_php ?? profile.lifetime_spend_php ?? 0,
      rewardPoints: profile.reward_points ?? 0,
      createdAt: profile.created_at || authUser.created_at,
      updatedAt: profile.updated_at || undefined,
    });
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (IS_DEV_MODE) {
      // In Dev mode, maintain state
      return;
    }
    if (!supabase) return;
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await loadTrustedProfile(authUser);
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  }, [supabase, loadTrustedProfile]);

  useEffect(() => {
    // In Development Mode, bypass Supabase auth and use in-memory Development Owner
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
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          await loadTrustedProfile(authUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setUser(null);
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
        setAccountError(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, isConfigured, loadTrustedProfile]);

  const logout = async () => {
    setAccountError(null);
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
        accountError,
        logout,
        refreshProfile,
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
