import { createClient } from "@supabase/supabase-js"

// Hardcoded values as fallbacks (from the user's provided values)
const SUPABASE_URL = "https://nktkomwmqstnzmsegdzc.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdGtvbXdtcXN0bnptc2VnZHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNTc3ODUsImV4cCI6MjA1OTgzMzc4NX0.qGWNEYVkoRTGMVRDW2g08VEJC_jpsK-Teej6_ADlnog"

// Create a singleton for the client-side Supabase client
let clientSideClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (clientSideClient) return clientSideClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or anon key is missing")
    throw new Error("Supabase URL or anon key is missing")
  }

  clientSideClient = createClient(supabaseUrl, supabaseAnonKey)
  return clientSideClient
}

// Add alias for backward compatibility
export const getSupabaseClient = getSupabaseBrowserClient

// Server-side client (uses service role key if available)
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    console.error("Supabase URL is missing")
    throw new Error("Supabase URL is missing")
  }

  // Use service role key if available, otherwise use anon key
  const key = supabaseServiceKey || supabaseAnonKey

  if (!key) {
    console.error("No Supabase key available")
    throw new Error("No Supabase key available")
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
    },
  })
}
