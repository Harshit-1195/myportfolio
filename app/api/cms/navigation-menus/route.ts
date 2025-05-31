import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    console.log("Fetching navigation menus...")

    // First check if the table exists by trying to select from it
    const { data, error } = await supabase.from("navigation_menus").select("*").limit(1)

    if (error) {
      console.error("Supabase error fetching navigation menus:", error)

      // If table doesn't exist, return empty array instead of error
      if (error.message.includes('relation "public.navigation_menus" does not exist')) {
        console.log("Navigation menus table doesn't exist, returning empty array")
        return NextResponse.json([])
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Now fetch all data
    const { data: allData, error: fetchError } = await supabase
      .from("navigation_menus")
      .select("*")
      .eq("is_active", true)

    if (fetchError) {
      console.error("Error fetching all navigation menus:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    console.log("Navigation menus fetched successfully:", allData?.length || 0)
    return NextResponse.json(allData || [])
  } catch (error) {
    console.error("Error in navigation-menus API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
