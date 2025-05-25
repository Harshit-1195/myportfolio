import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Try to get all blog posts without any filters
    const { data: blogPosts, error: blogError } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })

    const tableInfo = {
      exists: false,
      columns: [] as string[],
      missingColumns: [] as string[],
    }

    if (blogError) {
      if (blogError.message.includes('relation "blog_posts" does not exist')) {
        tableInfo.exists = false
      } else {
        console.error("Blog posts error:", blogError)
      }
    } else {
      tableInfo.exists = true

      // Get column information
      if (blogPosts && blogPosts.length > 0) {
        tableInfo.columns = Object.keys(blogPosts[0])
      }

      // Check for required columns
      const requiredColumns = [
        "id",
        "title",
        "slug",
        "content",
        "is_published",
        "published_at",
        "created_at",
        "updated_at",
      ]
      tableInfo.missingColumns = requiredColumns.filter((col) => !tableInfo.columns.includes(col))
    }

    return NextResponse.json({
      success: true,
      tableInfo,
      blogPosts: blogPosts || [],
    })
  } catch (error) {
    console.error("Database debug error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to check database: " + (error as Error).message,
    })
  }
}
