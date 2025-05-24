import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a singleton for the client-side Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Add alias for backward compatibility
export const getSupabaseBrowserClient = getSupabaseClient

// Server-side client (uses service role key if available)
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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

  // For server components
  if (typeof cookies === "function") {
    try {
      return createServerComponentClient({ cookies })
    } catch (e) {
      // Fallback to direct client if cookies() fails
      console.warn("Falling back to direct Supabase client")
    }
  }

  // Direct client as fallback
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
    },
  })
}

// Admin client with service role key (for admin operations only)
export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  return createClient(supabaseUrl, supabaseServiceKey)
}
