import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Add missing columns one by one
    const alterQueries = [
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false",
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE",
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Admin'",
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0",
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT",
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image TEXT",
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT",
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'",
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT",
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT",
    ]

    for (const query of alterQueries) {
      const { error } = await supabase.rpc("exec_sql", { sql: query })
      if (error) {
        console.error(`Error executing: ${query}`, error)
      }
    }

    // Update existing posts to be published if they don't have the is_published field set
    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({ is_published: true })
      .is("is_published", null)

    if (updateError) {
      console.error("Error updating existing posts:", updateError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Fix columns error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fix columns: " + (error as Error).message,
    })
  }
}
