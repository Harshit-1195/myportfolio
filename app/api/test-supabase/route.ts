import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    // Test the connection with a simple query
    const { data, error } = await supabase.from("blog_posts").select("count()", { count: "exact" }).limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to Supabase",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Supabase",
      count: data[0]?.count || 0,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
