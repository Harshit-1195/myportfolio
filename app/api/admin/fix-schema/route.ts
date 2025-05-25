import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create or update the blog_posts table with all required columns
    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        -- Enable UUID extension if not already enabled
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Create or replace the blog_posts table
        CREATE TABLE IF NOT EXISTS blog_posts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          excerpt TEXT,
          content TEXT NOT NULL,
          featured_image TEXT,
          author TEXT NOT NULL DEFAULT 'Admin',
          category TEXT,
          tags TEXT[] DEFAULT '{}',
          published_at TIMESTAMP WITH TIME ZONE,
          is_published BOOLEAN DEFAULT false,
          views INTEGER DEFAULT 0,
          seo_title TEXT,
          seo_description TEXT,
          canonical_url TEXT,
          og_image TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Add missing columns if they don't exist
        DO $$ 
        BEGIN
          -- Add is_published column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'blog_posts' AND column_name = 'is_published') THEN
            ALTER TABLE blog_posts ADD COLUMN is_published BOOLEAN DEFAULT false;
          END IF;

          -- Add published_at column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'blog_posts' AND column_name = 'published_at') THEN
            ALTER TABLE blog_posts ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
          END IF;

          -- Add views column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'blog_posts' AND column_name = 'views') THEN
            ALTER TABLE blog_posts ADD COLUMN views INTEGER DEFAULT 0;
          END IF;

          -- Add author column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'blog_posts' AND column_name = 'author') THEN
            ALTER TABLE blog_posts ADD COLUMN author TEXT NOT NULL DEFAULT 'Admin';
          END IF;
        END $$;

        -- Create index on slug if it doesn't exist
        CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
        
        -- Create index on is_published if it doesn't exist
        CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(is_published);
      `,
    })

    if (error) {
      console.error("Schema fix error:", error)
      return NextResponse.json({
        success: false,
        error: "Failed to fix schema: " + error.message,
      })
    }

    return NextResponse.json({ success: true, message: "Schema fixed successfully" })
  } catch (error) {
    console.error("Schema fix error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fix schema: " + (error as Error).message,
    })
  }
}
