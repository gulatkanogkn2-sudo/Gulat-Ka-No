// API Service Abstraction Placeholder
import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';

export const ApiService = {
  async getHealthStatus() {
    return {
      status: 'online',
      supabaseConfigured: isSupabaseConfigured,
      timestamp: new Date().toISOString(),
    };
  },
};
