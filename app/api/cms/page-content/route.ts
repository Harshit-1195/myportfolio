import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    console.log("Fetching page content...")

    // First check if the table exists by trying to select from it
    const { data, error } = await supabase.from("page_content").select("*").limit(1)

    if (error) {
      console.error("Supabase error fetching page content:", error)

      // If table doesn't exist, return empty array instead of error
      if (error.message.includes('relation "public.page_content" does not exist')) {
        console.log("Page content table doesn't exist, returning empty array")
        return NextResponse.json([])
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Now fetch all data
    const { data: allData, error: fetchError } = await supabase.from("page_content").select("*")

    if (fetchError) {
      console.error("Error fetching all page content:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    console.log("Page content fetched successfully:", allData?.length || 0)
    return NextResponse.json(allData || [])
  } catch (error) {
    console.error("Error in page-content API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
