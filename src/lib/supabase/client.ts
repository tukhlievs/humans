import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when public Supabase env vars are present. Drives the mock fallback. */
export const isSupabaseConfigured = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

/**
 * Browser Supabase client (anon key) for public reads of the catalog and
 * profiles. Returns null when env is not configured so callers can fall back
 * to local mock data and keep the app runnable out of the box.
 */
export function getSupabaseBrowser(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createClient(url as string, anonKey as string, {
      auth: { persistSession: false },
    });
  }
  return cached;
}
