import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("content_sections").select("*").order("section_order")

    if (error) {
      console.error("Error fetching content sections:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in content-sections API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const section = await request.json()
    const supabase = getSupabaseClient()

    const { error } = await supabase.from("content_sections").upsert({
      ...section,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating content section:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in content-sections PUT API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
