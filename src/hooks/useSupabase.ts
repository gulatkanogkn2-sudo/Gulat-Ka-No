import { useEffect, useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

export function useSupabase() {
  const [client] = useState<SupabaseClient<Database> | null>(() => getSupabaseClient());
  const [isConfigured] = useState<boolean>(isSupabaseConfigured);

  return {
    supabase: client,
    isConfigured,
  };
}
