"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Database, Check, AlertTriangle } from "lucide-react"

export default function InitDbPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup/init-db", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "An error occurred while initializing the database",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Initialize Database</h1>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Setup
          </CardTitle>
          <CardDescription className="text-gray-400">
            Initialize your Supabase database with the necessary tables for your CMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-md text-yellow-300">
              <p className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Warning
              </p>
              <p className="mt-1 text-sm">
                This will create the necessary tables in your Supabase database. If the tables already exist, this
                operation will not affect your existing data.
              </p>
            </div>

            {result && (
              <div
                className={`p-4 rounded-md ${
                  result.success
                    ? "bg-green-900/20 border border-green-800/50 text-green-300"
                    : "bg-red-900/20 border border-red-800/50 text-red-300"
                }`}
              >
                {result.success ? (
                  <p className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    {result.message || "Database initialized successfully!"}
                  </p>
                ) : (
                  <>
                    <p className="font-medium">Initialization failed</p>
                    {result.error && <p className="text-sm mt-1">{result.error}</p>}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={initializeDatabase} disabled={isInitializing} className="w-full">
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Database"
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">SQL Schema</CardTitle>
            <CardDescription className="text-gray-400">
              For reference, here's the SQL schema that will be created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs text-gray-300">
                {`-- Create blog posts table
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

-- Create function to update updated_at column
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
CREATE INDEX IF NOT EXISTS case_studies_slug_idx ON case_studies(slug);`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
