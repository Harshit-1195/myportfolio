import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "" // avoid crashing on client

// ❌ Server-only: use in API routes or server components
export function getSupabaseClient() {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseClient() should only be used on the server.")
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

// ✅ Safe for use in client
export function getSupabaseClientComponent() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

export function checkSupabaseConfig() {
  const hasUrl = !!supabaseUrl
  const hasAnonKey = !!supabaseAnonKey
  const isConfigured = hasUrl && hasAnonKey

  return {
    hasUrl,
    hasAnonKey,
    isConfigured,
  }
}
