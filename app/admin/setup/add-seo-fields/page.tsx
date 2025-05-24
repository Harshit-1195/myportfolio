"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function AddSeoFieldsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    blogPosts?: { success: boolean; message: string }
    projects?: { success: boolean; message: string }
    caseStudies?: { success: boolean; message: string }
    logoStories?: { success: boolean; message: string }
  }>({})

  const supabase = createClientComponentClient()

  const addSeoFieldsToBlogPosts = async () => {
    try {
      // Check if columns already exist
      const { data: columns } = await supabase.rpc("get_table_columns", { table_name: "blog_posts" })

      const hasColumns = columns.some((col: any) => col.column_name === "seo_title")

      if (hasColumns) {
        return { success: true, message: "SEO fields already exist in blog_posts table" }
      }

      // Add columns
      await supabase.rpc("add_column_if_not_exists", {
        table_name: "blog_posts",
        column_name: "seo_title",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "blog_posts",
        column_name: "seo_description",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "blog_posts",
        column_name: "canonical_url",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "blog_posts",
        column_name: "og_image",
        column_type: "text",
      })

      return { success: true, message: "SEO fields added to blog_posts table" }
    } catch (error: any) {
      console.error("Error adding SEO fields to blog_posts:", error)
      return { success: false, message: error.message || "Failed to add SEO fields" }
    }
  }

  const addSeoFieldsToProjects = async () => {
    try {
      // Check if columns already exist
      const { data: columns } = await supabase.rpc("get_table_columns", { table_name: "projects" })

      const hasColumns = columns.some((col: any) => col.column_name === "seo_title")

      if (hasColumns) {
        return { success: true, message: "SEO fields already exist in projects table" }
      }

      // Add columns
      await supabase.rpc("add_column_if_not_exists", {
        table_name: "projects",
        column_name: "seo_title",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "projects",
        column_name: "seo_description",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "projects",
        column_name: "canonical_url",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "projects",
        column_name: "og_image",
        column_type: "text",
      })

      return { success: true, message: "SEO fields added to projects table" }
    } catch (error: any) {
      console.error("Error adding SEO fields to projects:", error)
      return { success: false, message: error.message || "Failed to add SEO fields" }
    }
  }

  const addSeoFieldsToCaseStudies = async () => {
    try {
      // Check if columns already exist
      const { data: columns } = await supabase.rpc("get_table_columns", { table_name: "case_studies" })

      const hasColumns = columns.some((col: any) => col.column_name === "seo_title")

      if (hasColumns) {
        return { success: true, message: "SEO fields already exist in case_studies table" }
      }

      // Add columns
      await supabase.rpc("add_column_if_not_exists", {
        table_name: "case_studies",
        column_name: "seo_title",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "case_studies",
        column_name: "seo_description",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "case_studies",
        column_name: "canonical_url",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "case_studies",
        column_name: "og_image",
        column_type: "text",
      })

      return { success: true, message: "SEO fields added to case_studies table" }
    } catch (error: any) {
      console.error("Error adding SEO fields to case_studies:", error)
      return { success: false, message: error.message || "Failed to add SEO fields" }
    }
  }

  const addSeoFieldsToLogoStories = async () => {
    try {
      // Check if columns already exist
      const { data: columns } = await supabase.rpc("get_table_columns", { table_name: "logo_stories" })

      const hasColumns = columns.some((col: any) => col.column_name === "seo_title")

      if (hasColumns) {
        return { success: true, message: "SEO fields already exist in logo_stories table" }
      }

      // Add columns
      await supabase.rpc("add_column_if_not_exists", {
        table_name: "logo_stories",
        column_name: "seo_title",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "logo_stories",
        column_name: "seo_description",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "logo_stories",
        column_name: "canonical_url",
        column_type: "text",
      })

      await supabase.rpc("add_column_if_not_exists", {
        table_name: "logo_stories",
        column_name: "og_image",
        column_type: "text",
      })

      return { success: true, message: "SEO fields added to logo_stories table" }
    } catch (error: any) {
      console.error("Error adding SEO fields to logo_stories:", error)
      return { success: false, message: error.message || "Failed to add SEO fields" }
    }
  }

  const handleAddSeoFields = async () => {
    setIsLoading(true)

    try {
      // Create the stored procedures if they don't exist
      await supabase.rpc("create_helper_functions")

      // Add SEO fields to each table
      const blogPostsResult = await addSeoFieldsToBlogPosts()
      setStatus((prev) => ({ ...prev, blogPosts: blogPostsResult }))

      const projectsResult = await addSeoFieldsToProjects()
      setStatus((prev) => ({ ...prev, projects: projectsResult }))

      const caseStudiesResult = await addSeoFieldsToCaseStudies()
      setStatus((prev) => ({ ...prev, caseStudies: caseStudiesResult }))

      const logoStoriesResult = await addSeoFieldsToLogoStories()
      setStatus((prev) => ({ ...prev, logoStories: logoStoriesResult }))
    } catch (error) {
      console.error("Error adding SEO fields:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Add SEO Fields to Content Tables</h1>

      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white">SEO Fields Setup</CardTitle>
          <CardDescription className="text-gray-400">
            Add SEO-specific fields to your content tables for better search engine optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-6">This utility will add the following fields to your content tables:</p>

          <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
            <li>
              <code className="bg-gray-700 px-2 py-0.5 rounded">seo_title</code> - Optimized title for search engines
              (50-60 characters)
            </li>
            <li>
              <code className="bg-gray-700 px-2 py-0.5 rounded">seo_description</code> - Meta description for search
              results (150-160 characters)
            </li>
            <li>
              <code className="bg-gray-700 px-2 py-0.5 rounded">canonical_url</code> - Canonical URL to prevent
              duplicate content issues
            </li>
            <li>
              <code className="bg-gray-700 px-2 py-0.5 rounded">og_image</code> - Custom image for social media sharing
            </li>
          </ul>

          <Button onClick={handleAddSeoFields} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding SEO Fields...
              </>
            ) : (
              "Add SEO Fields to Content Tables"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {Object.keys(status).length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {status.blogPosts && (
                <div
                  className={`flex items-start gap-2 ${status.blogPosts.success ? "text-green-400" : "text-red-400"}`}
                >
                  {status.blogPosts.success ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">Blog Posts</p>
                    <p className="text-sm text-gray-300">{status.blogPosts.message}</p>
                  </div>
                </div>
              )}

              {status.projects && (
                <div
                  className={`flex items-start gap-2 ${status.projects.success ? "text-green-400" : "text-red-400"}`}
                >
                  {status.projects.success ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">Projects</p>
                    <p className="text-sm text-gray-300">{status.projects.message}</p>
                  </div>
                </div>
              )}

              {status.caseStudies && (
                <div
                  className={`flex items-start gap-2 ${status.caseStudies.success ? "text-green-400" : "text-red-400"}`}
                >
                  {status.caseStudies.success ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">Case Studies</p>
                    <p className="text-sm text-gray-300">{status.caseStudies.message}</p>
                  </div>
                </div>
              )}

              {status.logoStories && (
                <div
                  className={`flex items-start gap-2 ${status.logoStories.success ? "text-green-400" : "text-red-400"}`}
                >
                  {status.logoStories.success ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">Logo Stories</p>
                    <p className="text-sm text-gray-300">{status.logoStories.message}</p>
                  </div>
                </div>
              )}
            </div>

            {Object.values(status).every((item) => item?.success) && (
              <div className="mt-6 p-4 bg-green-900/20 border border-green-800/50 rounded-md">
                <p className="text-green-400 font-medium">All SEO fields were added successfully!</p>
                <p className="text-gray-300 mt-2">
                  You can now use the SEO fields in your content editors to optimize your pages for search engines.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
