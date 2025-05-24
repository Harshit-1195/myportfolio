"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllBlogPosts, getAllProjects } from "@/lib/cms-service"
import { FileText, FolderOpen, Upload } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [blogCount, setBlogCount] = useState(0)
  const [projectCount, setProjectCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const supabase = getSupabaseClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        // Get counts
        const blogPosts = await getAllBlogPosts()
        const projects = await getAllProjects()

        setBlogCount(blogPosts.length)
        setProjectCount(projects.length)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
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
