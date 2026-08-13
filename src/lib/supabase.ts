import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

let supabaseInstance: SupabaseClient<Database> | null = null;

export const getSupabaseClient = (): SupabaseClient<Database> | null => {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
};

// Fallback dummy client accessor to prevent null exceptions when unconfigured in preview
export const supabase = getSupabaseClient();
