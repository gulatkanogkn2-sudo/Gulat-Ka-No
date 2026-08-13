import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

function formatSupabaseUrl(raw: string): string {
  if (!raw) return '';
  let urlStr = raw.trim().replace(/^["']|["']$/g, '');
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = `https://${urlStr}`;
  }
  try {
    const parsed = new URL(urlStr);
    const pathname = parsed.pathname
      .replace(/\/rest\/v1\/?$/i, '')
      .replace(/\/+$/, '');
    return `${parsed.origin}${pathname}`;
  } catch {
    return urlStr
      .replace(/\/rest\/v1\/?$/i, '')
      .replace(/\/+$/, '');
  }
}

export const supabaseUrl = formatSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '');
export const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim().replace(/^["']|["']$/g, '');

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
);

let supabaseInstance: SupabaseClient<Database> | null = null;

export const getSupabaseClient = (): SupabaseClient<Database> | null => {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseInstance;
};

// Fallback dummy client accessor to prevent null exceptions when unconfigured in preview
export const supabase = getSupabaseClient();

export const hasAuthenticatedSupabaseSession = async (): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { data: { session } } = await client.auth.getSession();
    return Boolean(session?.user?.id);
  } catch {
    return false;
  }
};

