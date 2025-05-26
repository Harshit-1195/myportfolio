import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const supabase = getSupabaseClient()

    const { error } = await supabase.from("content_sections").update(updates).eq("id", params.id)

    if (error) {
      console.error("Error updating content section:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in content-sections PATCH API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
