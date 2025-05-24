-- Create the stored procedure for setting up CMS tables
CREATE OR REPLACE FUNCTION setup_cms_tables()
RETURNS void AS $$
BEGIN
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
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    og_image TEXT,
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
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    og_image TEXT,
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
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    og_image TEXT,
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

  -- Create function to update updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;

  -- Create triggers to automatically update updated_at
  DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
  CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

  DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
  CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

  DROP TRIGGER IF EXISTS update_case_studies_updated_at ON case_studies;
  CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

  DROP TRIGGER IF EXISTS update_logo_stories_updated_at ON logo_stories;
  CREATE TRIGGER update_logo_stories_updated_at
  BEFORE UPDATE ON logo_stories
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
  CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
  CREATE INDEX IF NOT EXISTS case_studies_slug_idx ON case_studies(slug);
END;
$$ LANGUAGE plpgsql;
