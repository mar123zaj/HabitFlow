/**
 * Supabase Client
 *
 * Replace the placeholder values below with your Supabase project URL and anon key.
 * Find them at: https://supabase.com/dashboard → Project Settings → API
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://lpjvqoopqdiiegztfmcq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9pdgezwUnVwh7nKhXsVmQw_U8uaWplz';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
