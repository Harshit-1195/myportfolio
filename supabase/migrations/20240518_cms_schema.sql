-- Create blog_posts table if it doesn't exist
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
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table if it doesn't exist
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
  order_index INTEGER NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create case_studies table if it doesn't exist
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
  results TEXT[] DEFAULT '{}',
  testimonial TEXT,
  testimonial_author TEXT,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create logo_stories table if it doesn't exist
CREATE TABLE IF NOT EXISTS logo_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  logo_image TEXT NOT NULL,
  process TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  typography TEXT,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contact_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a function to increment blog post views
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET views = views + 1
  WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at column automatically
CREATE TRIGGER update_blog_posts_modtime
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_projects_modtime
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_case_studies_modtime
BEFORE UPDATE ON case_studies
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_logo_stories_modtime
BEFORE UPDATE ON logo_stories
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_contact_submissions_modtime
BEFORE UPDATE ON contact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
