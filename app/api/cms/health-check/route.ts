import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    // Simple query to check connection
    const { data, error } = await supabase.from("blog_posts").select("count(*)", { count: "exact" }).limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to connect to database",
      },
      { status: 500 },
    )
  }
}
