import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create clients
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

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
