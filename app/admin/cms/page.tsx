"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUp, Database, Settings, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function CMSDashboard() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [initResult, setInitResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; error?: string } | null>(null)
  const [isCheckingDb, setIsCheckingDb] = useState(false)

  // Check database connection
  const checkDatabase = async () => {
    setIsCheckingDb(true)
    setDbStatus(null)

    try {
      const response = await fetch("/api/cms/health-check")
      const data = await response.json()

      setDbStatus({
        connected: data.success,
        error: data.error,
      })
    } catch (error) {
      setDbStatus({
        connected: false,
        error: error instanceof Error ? error.message : "Failed to check database connection",
      })
    } finally {
      setIsCheckingDb(false)
    }
  }

  // Initialize database schema
  const initializeDatabase = async () => {
    setIsInitializing(true)
    setInitResult(null)

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      })
      const data = await response.json()

      setInitResult({
        success: data.success,
        message: data.message,
        error: data.error,
      })

      // Refresh database status after initialization
      if (data.success) {
        setTimeout(checkDatabase, 1000)
      }
    } catch (error) {
      setInitResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to initialize database",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  // Check database connection on component mount
  useEffect(() => {
    checkDatabase()
  }, [])

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-white">CMS Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Database Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Database Status
                </CardTitle>
                <CardDescription>Check your Supabase connection</CardDescription>
              </CardHeader>
              <CardContent>
                {isCheckingDb ? (
                  <div className="flex items-center justify-center py-4">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                ) : dbStatus ? (
                  <div
                    className={`p-4 rounded-md ${dbStatus.connected ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}
                  >
                    {dbStatus.connected ? (
                      <p>Connected to Supabase successfully!</p>
                    ) : (
                      <>
                        <p className="font-medium">Connection failed</p>
                        {dbStatus.error && <p className="text-sm mt-1">{dbStatus.error}</p>}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">Click the button below to check connection</div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={checkDatabase} disabled={isCheckingDb} className="w-full">
                  {isCheckingDb ? "Checking..." : "Check Connection"}
                </Button>
              </CardFooter>
            </Card>

            {/* Content Management Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>Manage your blog content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create, edit, and publish blog posts with rich content and media.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/cms/blog-posts" className="w-full">
                  <Button className="w-full">Manage Blog Posts</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Showcase your work</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add and update your portfolio projects with images and details.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/cms/projects" className="w-full">
                  <Button className="w-full">Manage Projects</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Case Studies</CardTitle>
                <CardDescription>Detailed work examples</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create in-depth case studies with challenges, solutions, and results.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/cms/case-studies" className="w-full">
                  <Button className="w-full">Manage Case Studies</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logo Stories</CardTitle>
                <CardDescription>Brand identity showcases</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share the stories behind your logo design projects.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/cms/logo-stories" className="w-full">
                  <Button className="w-full">Manage Logo Stories</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <FileUp className="mr-2 h-5 w-5 inline" />
                  Media Library
                </CardTitle>
                <CardDescription>Manage your files</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload and organize images and documents using Supabase Storage.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/cms/media" className="w-full">
                  <Button className="w-full">Media Library</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Database Setup
              </CardTitle>
              <CardDescription>Initialize your Supabase database schema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-md">
                  <p className="font-medium">Warning</p>
                  <p className="text-sm mt-1">
                    This will create the necessary tables in your Supabase database. If the tables already exist, this
                    operation will not affect your existing data.
                  </p>
                </div>

                {initResult && (
                  <div
                    className={`p-4 rounded-md ${initResult.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}
                  >
                    {initResult.success ? (
                      <p>{initResult.message || "Database initialized successfully!"}</p>
                    ) : (
                      <>
                        <p className="font-medium">Initialization failed</p>
                        {initResult.error && <p className="text-sm mt-1">{initResult.error}</p>}
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={initializeDatabase} disabled={isInitializing} className="w-full">
                {isInitializing ? "Initializing..." : "Initialize Database"}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SQL Schema</CardTitle>
                <CardDescription>Manual database setup</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  If you prefer to set up your database manually, you can use the SQL schema below:
                </p>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96">
                  <pre className="text-xs">
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
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
