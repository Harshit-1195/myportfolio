import { getSupabaseServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = getSupabaseServerClient()

    // Create blog_posts table
    const { error: blogPostsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS blog_posts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          excerpt TEXT,
          content TEXT NOT NULL,
          featured_image TEXT,
          author TEXT NOT NULL,
          category TEXT,
          tags TEXT[] DEFAULT '{}',
          published_at TIMESTAMP WITH TIME ZONE,
          is_published BOOLEAN DEFAULT false,
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
      `,
    })

    if (blogPostsError) {
      console.error("Error creating blog_posts table:", blogPostsError)
      return NextResponse.json({ error: blogPostsError.message }, { status: 500 })
    }

    // Create projects table
    const { error: projectsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          content TEXT NOT NULL,
          featured_image TEXT,
          technologies TEXT[] DEFAULT '{}',
          url TEXT,
          github_url TEXT,
          is_featured BOOLEAN DEFAULT false,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
      `,
    })

    if (projectsError) {
      console.error("Error creating projects table:", projectsError)
      return NextResponse.json({ error: projectsError.message }, { status: 500 })
    }

    // Create case_studies table
    const { error: caseStudiesError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS case_studies (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          client TEXT NOT NULL,
          description TEXT,
          content TEXT NOT NULL,
          featured_image TEXT,
          gallery TEXT[] DEFAULT '{}',
          challenge TEXT,
          solution TEXT,
          results TEXT,
          testimonial TEXT,
          testimonial_author TEXT,
          is_featured BOOLEAN DEFAULT false,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS case_studies_slug_idx ON case_studies(slug);
      `,
    })

    if (caseStudiesError) {
      console.error("Error creating case_studies table:", caseStudiesError)
      return NextResponse.json({ error: caseStudiesError.message }, { status: 500 })
    }

    // Create logo_stories table
    const { error: logoStoriesError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS logo_stories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          client TEXT NOT NULL,
          description TEXT,
          image TEXT NOT NULL,
          challenge TEXT,
          solution TEXT,
          result TEXT,
          is_featured BOOLEAN DEFAULT false,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (logoStoriesError) {
      console.error("Error creating logo_stories table:", logoStoriesError)
      return NextResponse.json({ error: logoStoriesError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Database setup completed successfully" })
  } catch (error: any) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
