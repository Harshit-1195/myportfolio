import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const issues: string[] = []

    // Check if blog_posts table exists and has required columns
    const { data: blogPosts, error: blogError } = await supabase.from("blog_posts").select("*").limit(1)

    if (blogError) {
      if (blogError.message.includes('relation "blog_posts" does not exist')) {
        issues.push("blog_posts table does not exist")
      } else {
        issues.push(`blog_posts table error: ${blogError.message}`)
      }
    } else {
      // Check for required columns
      const requiredColumns = [
        "id",
        "title",
        "slug",
        "content",
        "author",
        "is_published",
        "published_at",
        "created_at",
        "updated_at",
      ]

      if (blogPosts && blogPosts.length > 0) {
        const existingColumns = Object.keys(blogPosts[0])
        const missingColumns = requiredColumns.filter((col) => !existingColumns.includes(col))

        missingColumns.forEach((col) => {
          issues.push(`blog_posts table missing column: ${col}`)
        })
      }
    }

    return NextResponse.json({ success: true, issues })
  } catch (error) {
    console.error("Schema check error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to check schema: " + (error as Error).message,
    })
  }
}
