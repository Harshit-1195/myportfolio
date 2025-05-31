import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()
    const supabase = getSupabaseClient()

    console.log("Updating content section status:", id, updates)

    const { error } = await supabase
      .from("content_sections")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating content section status:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Content section status updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in content-sections PATCH API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
