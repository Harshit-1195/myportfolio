import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate required environment variables
if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
  throw new Error("Supabase URL is required. Please check your environment variables.")
}

if (!supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
  throw new Error("Supabase anonymous key is required. Please check your environment variables.")
}

// Create clients with error handling
let supabaseClient, supabaseAdmin

try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

  if (supabaseServiceRoleKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
  } else {
    console.warn("Missing SUPABASE_SERVICE_ROLE_KEY - admin functions may not work")
    supabaseAdmin = supabaseClient // Fallback to regular client
  }
} catch (error) {
  console.error("Failed to create Supabase client:", error)
  throw new Error("Failed to initialize Supabase. Please check your configuration.")
}

// Export the main client (legacy)
export const supabase = supabaseClient

// Export all required functions
export function getSupabaseClient() {
  return supabaseClient
}

export function getSupabaseBrowserClient() {
  return supabaseClient
}

export function getSupabaseServerClient() {
  return supabaseClient
}

export function getSupabaseAdmin() {
  return supabaseAdmin
}

// Export configuration check function
export function checkSupabaseConfig() {
  return {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceRoleKey,
    url: supabaseUrl,
    isConfigured: !!(supabaseUrl && supabaseAnonKey),
  }
}
