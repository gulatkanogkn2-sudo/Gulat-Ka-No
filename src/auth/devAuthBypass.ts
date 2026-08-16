import { UserProfile } from '../types';

/**
 * TEMPORARY PHASE 4.5 DEVELOPMENT ADMIN ACCESS
 *
 * This module provides temporary, development-only access to the Admin Panel
 * without requiring Supabase Authentication during local testing and development.
 *
 * SAFETY & SECURITY RULES:
 * 1. Active ONLY in development mode (import.meta.env.DEV === true or NODE_ENV !== 'production').
 * 2. Automatically disabled in production builds (import.meta.env.PROD === true).
 * 3. The Development Owner account exists strictly IN MEMORY during React runtime.
 * 4. NEVER saved to Supabase, database tables, localStorage, sessionStorage, or cookies.
 * 5. Easily removable when Phase 5 authentication is deployed.
 */

// Detect if application is running in Vite/Node development mode
export const IS_DEV_MODE: boolean =
  Boolean(import.meta.env.DEV) &&
  !Boolean(import.meta.env.PROD) &&
  import.meta.env.VITE_ENABLE_DEV_AUTH_BYPASS === 'true';

// In-Memory Development Owner account
export const DEV_OWNER_USER: UserProfile = {
  id: 'dev-owner-in-memory-id',
  email: 'development@gkn.local',
  fullName: 'Development Owner',
  preferredName: 'Dev Lead',
  phone: '09170000000',
  birthDate: '1990-01-01',
  primaryAddress: '123 GKN Cyber Hub, Cyberpunk Blvd',
  cityProvince: 'Metro Manila',
  role: 'OWNER',
  status: 'ACTIVE',
  tier: 'VIP',
  customerCode: 'GKN-000001',
  verificationStatus: 'VERIFIED',
  qualifyingLifetimeSpendingPhp: 50000,
  rewardPoints: 1250,
  createdAt: '2026-01-01T00:00:00.000Z',
};

// Permission descriptor for Phase 4.5 development context
export const DEV_OWNER_PERMISSIONS = {
  role: 'OWNER',
  permission: 'SUPER_ADMIN',
  isDevBypass: true,
};
