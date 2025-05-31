import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    console.log("Fetching content sections...")

    // First check if the table exists by trying to select from it
    const { data, error } = await supabase.from("content_sections").select("*").limit(1)

    if (error) {
      console.error("Supabase error fetching content sections:", error)

      // If table doesn't exist, return empty array instead of error
      if (error.message.includes('relation "public.content_sections" does not exist')) {
        console.log("Content sections table doesn't exist, returning empty array")
        return NextResponse.json([])
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Now fetch all data
    const { data: allData, error: fetchError } = await supabase
      .from("content_sections")
      .select("*")
      .order("section_order", { ascending: true })

    if (fetchError) {
      console.error("Error fetching all content sections:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    console.log("Content sections fetched successfully:", allData?.length || 0)
    return NextResponse.json(allData || [])
  } catch (error) {
    console.error("Error in content-sections API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = getSupabaseClient()
    const section = await request.json()

    console.log("Updating content section:", section.id)

    const { data, error } = await supabase
      .from("content_sections")
      .update({
        content: section.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", section.id)
      .select()

    if (error) {
      console.error("Error updating content section:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Content section updated successfully")
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in content-sections PUT API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
