import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Falls back to a harmless placeholder URL so createClient() never throws
// during build (e.g. static generation on Vercel before env vars are set).
// Real calls only happen client-side when the form is submitted, and if the
// real env vars are missing, the fetch itself will fail with a clear error
// that the form already handles.
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured && typeof window !== "undefined") {
  console.warn(
    "Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment (.env.local locally, Project Settings > Environment Variables on Vercel)."
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export const supabaseIsConfigured = isConfigured;
