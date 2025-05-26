import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("navigation_menus").select("*")

    if (error) {
      console.error("Error fetching navigation menus:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in navigation-menus API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
