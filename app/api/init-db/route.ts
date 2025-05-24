import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Create blog_posts table if it doesn't exist
    const { error: blogError } = await supabase.rpc("create_blog_posts_table_if_not_exists")

    if (blogError) {
      // If the RPC function doesn't exist, create it and the table directly
      await supabase.query(`
        CREATE OR REPLACE FUNCTION create_blog_posts_table_if_not_exists()
        RETURNS void AS $$
        BEGIN
          CREATE TABLE IF NOT EXISTS blog_posts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            excerpt TEXT,
            content TEXT NOT NULL,
            featured_image TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            published BOOLEAN DEFAULT FALSE
          );
        END;
        $$ LANGUAGE plpgsql;
      `)

      // Now call the function
      await supabase.rpc("create_blog_posts_table_if_not_exists")
    }

    // Create projects table if it doesn't exist
    const { error: projectsError } = await supabase.rpc("create_projects_table_if_not_exists")

    if (projectsError) {
      // If the RPC function doesn't exist, create it and the table directly
      await supabase.query(`
        CREATE OR REPLACE FUNCTION create_projects_table_if_not_exists()
        RETURNS void AS $$
        BEGIN
          CREATE TABLE IF NOT EXISTS projects (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            content TEXT NOT NULL,
            featured_image TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            published BOOLEAN DEFAULT FALSE
          );
        END;
        $$ LANGUAGE plpgsql;
      `)

      // Now call the function
      await supabase.rpc("create_projects_table_if_not_exists")
    }

    return NextResponse.json({
      success: true,
      message: "Database tables initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database tables",
      },
      { status: 500 },
    )
  }
}
