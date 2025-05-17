import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = getSupabaseServerClient()

    // Execute the SQL script to create tables
    const { error } = await supabase.rpc("run_sql_script", {
      sql: `
        -- Create blog posts table
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

        -- Create projects table
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

        -- Create case studies table
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

        -- Create logo stories table
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

        -- Create assets table
        CREATE TABLE IF NOT EXISTS assets (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          description TEXT,
          file_url TEXT NOT NULL,
          file_type TEXT NOT NULL,
          file_size INTEGER,
          version TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create form submissions table
        CREATE TABLE IF NOT EXISTS form_submissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT,
          message TEXT NOT NULL,
          user_agent TEXT,
          referrer TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create asset downloads table
        CREATE TABLE IF NOT EXISTS asset_downloads (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          asset_id UUID NOT NULL REFERENCES assets(id),
          user_agent TEXT,
          referrer TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
        CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
        CREATE INDEX IF NOT EXISTS case_studies_slug_idx ON case_studies(slug);
        CREATE INDEX IF NOT EXISTS assets_name_idx ON assets(name);

        -- Create function to update updated_at timestamp
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        -- Create triggers to automatically update updated_at
        CREATE TRIGGER update_blog_posts_updated_at
        BEFORE UPDATE ON blog_posts
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

        CREATE TRIGGER update_projects_updated_at
        BEFORE UPDATE ON projects
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

        CREATE TRIGGER update_case_studies_updated_at
        BEFORE UPDATE ON case_studies
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

        CREATE TRIGGER update_logo_stories_updated_at
        BEFORE UPDATE ON logo_stories
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

        CREATE TRIGGER update_assets_updated_at
        BEFORE UPDATE ON assets
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
      `,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Database schema created successfully",
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to set up database",
      },
      { status: 500 },
    )
  }
}
