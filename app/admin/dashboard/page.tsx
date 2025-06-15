"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, FolderOpen, Upload, AlertCircle, Settings } from "lucide-react"
import Link from "next/link"
import { getSupabaseClientComponent, checkSupabaseConfig } from "@/lib/supabase"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [blogCount, setBlogCount] = useState(0) 
  const [projectCount, setProjectCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [configError, setConfigError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const config = checkSupabaseConfig()
        if (!config.isConfigured) {
          setConfigError(
            `Missing Supabase configuration: ${!config.hasUrl ? "URL " : ""}${!config.hasAnonKey ? "ANON_KEY" : ""}`
          )
          setLoading(false)
          return
        }

        const supabase = getSupabaseClientComponent()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        const { getAllBlogPosts: getBlogPosts, getAllProjects: getProjects } = await import("@/lib/cms-service")

        try {
          const blogPosts = await getBlogPosts()
          const projects = await getProjects()
          setBlogCount(blogPosts.length)
          setProjectCount(projects.length)
        } catch (error) {
          console.warn("Could not fetch content counts:", error)
          setBlogCount(0)
          setProjectCount(0)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // setConfigError(error.message || "Failed to initialize dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (configError) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuration Error:</strong> {configError}
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Setup Required
            </CardTitle>
            <CardDescription>
              Your Supabase configuration is incomplete. Please set up your environment variables.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Required Environment Variables:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <code>NEXT_PUBLIC_SUPABASE_URL</code> - Your Supabase project URL
                </li>
                <li>
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Your Supabase anonymous key
                </li>
                <li>
                  <code>SUPABASE_SERVICE_ROLE_KEY</code> - Your Supabase service role key (optional)
                </li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Link href="/admin/setup/environment-check">
                <Button variant="outline">Check Environment</Button>
              </Link>
              <Link href="/admin/setup/supabase-config">
                <Button>Configure Supabase</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogCount}</div>
            <p className="text-xs text-muted-foreground">Total blog posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount}</div>
            <p className="text-xs text-muted-foreground">Total projects</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/blog/new">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                New Blog Post
              </CardTitle>
              <CardDescription>Create a new blog post</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/projects/new">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderOpen className="mr-2 h-5 w-5" />
                New Project
              </CardTitle>
              <CardDescription>Add a new project to your portfolio</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/media/upload">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Media
              </CardTitle>
              <CardDescription>Upload images and files</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
