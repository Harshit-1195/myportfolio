import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient()

    // Create the tables
    const { error } = await supabase.rpc("setup_cms_tables")

    if (error) {
      console.error("Error setting up tables:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error: any) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
