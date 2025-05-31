"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, ArrowLeft, ImageIcon, Globe, Github } from "lucide-react"
import { Markdown } from "@/components/markdown"
import { MediaLibraryModal } from "@/components/media-library-modal"

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    featured_image: "",
    technologies: "",
    url: "",
    github_url: "",
    is_featured: false,
    order_index: 0,
    seo_title: "",
    seo_description: "",
    canonical_url: "",
    og_image: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewTab, setPreviewTab] = useState("edit")
  const [showMediaSelector, setShowMediaSelector] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title
    if (name === "title" && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_featured: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.content) {
        throw new Error("Title, slug, and content are required")
      }

      // Process technologies
      const technologies = formData.technologies ? formData.technologies.split(",").map((tech) => tech.trim()) : []

      // Get the highest order_index value
      const { data: projects, error: indexError } = await supabase
        .from("projects")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1)

      if (indexError) {
        throw indexError
      }

      const highestIndex = projects && projects.length > 0 ? projects[0].order_index : -1
      const nextIndex = highestIndex + 1

      // Prepare data for submission
      const projectData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        content: formData.content,
        featured_image: formData.featured_image || null,
        technologies,
        url: formData.url || null,
        github_url: formData.github_url || null,
        is_featured: formData.is_featured,
        order_index: nextIndex,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        canonical_url: formData.canonical_url || null,
        og_image: formData.og_image || formData.featured_image || null,
      }

      // Submit to Supabase
      const { data, error } = await supabase.from("projects").insert([projectData]).select()

      if (error) {
        throw error
      }

      // Redirect to projects list
      router.push("/admin/projects")
    } catch (error: any) {
      console.error("Error creating project:", error)
      setError(error.message || "Failed to create project")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/projects")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-white">New Project</h1>
      </div>

      {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-md text-red-300">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Content</CardTitle>
                <CardDescription className="text-gray-400">Create your portfolio project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter project title"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-white">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="enter-project-slug"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief project description"
                    className="bg-gray-700 border-gray-600 text-white h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-white">
                    Content
                  </Label>
                  <Tabs value={previewTab} onValueChange={setPreviewTab}>
                    <TabsList className="bg-gray-700">
                      <TabsTrigger value="edit" className="data-[state=active]:bg-gray-600">
                        Edit
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="data-[state=active]:bg-gray-600">
                        Preview
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit" className="mt-2">
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write your project content in Markdown"
                        className="bg-gray-700 border-gray-600 text-white min-h-[300px]"
                      />
                    </TabsContent>
                    <TabsContent value="preview" className="mt-2">
                      <div className="bg-gray-700 border border-gray-600 rounded-md p-4 min-h-[300px] prose prose-invert max-w-none">
                        {formData.content ? (
                          <Markdown content={formData.content} />
                        ) : (
                          <p className="text-gray-400">Nothing to preview</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">SEO</CardTitle>
                <CardDescription className="text-gray-400">Optimize your project for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title" className="text-white">
                    SEO Title
                  </Label>
                  <Input
                    id="seo_title"
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleChange}
                    placeholder="SEO optimized title (optional)"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description" className="text-white">
                    Meta Description
                  </Label>
                  <Textarea
                    id="seo_description"
                    name="seo_description"
                    value={formData.seo_description}
                    onChange={handleChange}
                    placeholder="SEO meta description (optional)"
                    className="bg-gray-700 border-gray-600 text-white h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonical_url" className="text-white">
                    Canonical URL
                  </Label>
                  <Input
                    id="canonical_url"
                    name="canonical_url"
                    value={formData.canonical_url}
                    onChange={handleChange}
                    placeholder="https://example.com/original-project (optional)"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_image" className="text-white">
                    Social Image URL
                  </Label>
                  <Input
                    id="og_image"
                    name="og_image"
                    value={formData.og_image}
                    onChange={handleChange}
                    placeholder="URL for social media sharing image (optional)"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Publish</CardTitle>
                <CardDescription className="text-gray-400">Configure project settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured" className="text-white">
                    Feature this project
                  </Label>
                  <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={handleSwitchChange} />
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Project
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Details</CardTitle>
                <CardDescription className="text-gray-400">Additional project information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featured_image" className="text-white">
                    Featured Image URL
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="featured_image"
                      name="featured_image"
                      value={formData.featured_image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0"
                      onClick={() => setShowMediaSelector(true)}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.featured_image && (
                    <div className="mt-2 relative aspect-video rounded-md overflow-hidden bg-gray-700">
                      <img
                        src={formData.featured_image || "/placeholder.svg"}
                        alt="Featured"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/abstract-geometric-shapes.png"
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies" className="text-white">
                    Technologies Used
                  </Label>
                  <Input
                    id="technologies"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="React, TypeScript, Tailwind CSS"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400">Separate technologies with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url" className="text-white flex items-center gap-1">
                    <Globe className="h-4 w-4" /> Live URL
                  </Label>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://project-demo.com"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github_url" className="text-white flex items-center gap-1">
                    <Github className="h-4 w-4" /> GitHub URL
                  </Label>
                  <Input
                    id="github_url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/username/project"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
      {/* Media Selector Modal */}
      {showMediaSelector && (
        <MediaLibraryModal
          isOpen={showMediaSelector}
          onClose={() => setShowMediaSelector(false)}
          onSelect={(url) => {
            setFormData((prev) => ({ ...prev, featured_image: url }))
            setShowMediaSelector(false)
          }}
          accept="image/*"
          multiple={false}
        />
      )}
    </div>
  )
}
