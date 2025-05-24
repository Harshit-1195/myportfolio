"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Save, ArrowLeft, ImageIcon, Eye, Loader2, Tag, Calendar, User, Folder } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { Markdown } from "@/components/markdown"
import { SEOFields } from "@/components/admin/seo-fields"

interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string | null
  author: string
  category: string | null
  tags: string[]
  published_at: string | null
  is_published: boolean
  views: number
  seo_title?: string
  seo_description?: string
  canonical_url?: string
  og_image?: string | null
}

export default function BlogPostEditor({ params }: { params: { action: string } }) {
  const isNew = params.action === "new"
  const postId = isNew ? null : params.action.replace("edit/", "")

  const [post, setPost] = useState<BlogPost>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: null,
    author: "",
    category: null,
    tags: [],
    published_at: null,
    is_published: false,
    views: 0,
    seo_title: "",
    seo_description: "",
    canonical_url: "",
    og_image: null,
  })

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("edit")
  const [tagsInput, setTagsInput] = useState("")

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!isNew && postId) {
      fetchPost(postId)
    }
  }, [isNew, postId])

  useEffect(() => {
    // Update tags input when post tags change
    if (post.tags) {
      setTagsInput(post.tags.join(", "))
    }
  }, [post.tags])

  const fetchPost = async (id: string) => {
    setLoading(true)

    try {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      if (data) {
        setPost(data)
      }
    } catch (error) {
      console.error("Error fetching blog post:", error)
      setError("Failed to load blog post")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPost({ ...post, [name]: value })
  }

  const handleSwitchChange = (checked: boolean) => {
    setPost({
      ...post,
      is_published: checked,
      published_at: checked && !post.published_at ? new Date().toISOString() : post.published_at,
    })
  }

  const handleTagsChange = (value: string) => {
    setTagsInput(value)
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")

    setPost({ ...post, tags })
  }

  const generateSlug = () => {
    if (!post.title) return

    const slug = post.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    setPost({ ...post, slug })
  }

  const handleImageUpload = (result: { url: string }) => {
    setPost({ ...post, featured_image: result.url })
  }

  const handleSeoUpdate = (seoFields: {
    seoTitle: string
    seoDescription: string
    canonicalUrl: string
    ogImage: string | null
  }) => {
    setPost({
      ...post,
      seo_title: seoFields.seoTitle,
      seo_description: seoFields.seoDescription,
      canonical_url: seoFields.canonicalUrl,
      og_image: seoFields.ogImage,
    })
  }

  const savePost = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate required fields
      if (!post.title || !post.slug || !post.content) {
        throw new Error("Title, slug, and content are required")
      }

      if (isNew) {
        // Create new post
        const { data, error } = await supabase.from("blog_posts").insert([post]).select()

        if (error) {
          throw error
        }

        setSuccess("Blog post created successfully!")

        // Redirect to edit page after creation
        if (data && data[0]) {
          setTimeout(() => {
            router.push(`/admin/blog/edit/${data[0].id}`)
          }, 1500)
        }
      } else {
        // Update existing post
        const { error } = await supabase.from("blog_posts").update(post).eq("id", postId)

        if (error) {
          throw error
        }

        setSuccess("Blog post updated successfully!")
      }
    } catch (err: any) {
      setError(err.message || "Failed to save blog post")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/blog")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>

        <h1 className="text-2xl font-bold text-white">{isNew ? "Create New Blog Post" : "Edit Blog Post"}</h1>
      </div>

      {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-md text-red-300">{error}</div>}

      {success && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-800 rounded-md text-green-300">{success}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Post Content</CardTitle>
              <CardDescription className="text-gray-400">Write and format your blog post content</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-700">
                  <TabsTrigger value="edit" className="data-[state=active]:bg-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="data-[state=active]:bg-gray-600">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-200">
                        Title
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleInputChange}
                        placeholder="Enter post title"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="slug" className="text-gray-200">
                          Slug
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={generateSlug}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Generate from title
                        </Button>
                      </div>
                      <Input
                        id="slug"
                        name="slug"
                        value={post.slug}
                        onChange={handleInputChange}
                        placeholder="enter-post-slug"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt" className="text-gray-200">
                        Excerpt
                      </Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={post.excerpt}
                        onChange={handleInputChange}
                        placeholder="Brief summary of the post"
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content" className="text-gray-200">
                        Content (Markdown)
                      </Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={post.content}
                        onChange={handleInputChange}
                        placeholder="Write your post content using Markdown..."
                        className="bg-gray-700 border-gray-600 text-white font-mono"
                        rows={15}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="bg-white text-gray-900 p-6 rounded-md">
                    <h1 className="text-3xl font-bold mb-4">{post.title || "Post Title"}</h1>
                    {post.featured_image && (
                      <img
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-md mb-6"
                      />
                    )}
                    <div className="prose max-w-none">
                      <Markdown content={post.content || "Write your content in the edit tab..."} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* SEO Card */}
          <div className="mt-6">
            <SEOFields
              title={post.seo_title || ""}
              description={post.seo_description || ""}
              canonicalUrl={post.canonical_url || ""}
              ogImage={post.og_image || null}
              contentTitle={post.title}
              contentExcerpt={post.excerpt}
              slug={post.slug}
              baseUrl="/blog/"
              onUpdate={handleSeoUpdate}
            />
          </div>
        </div>

        <div>
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Post Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure post metadata and publishing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="is_published" checked={post.is_published} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="is_published" className="text-gray-200">
                    Published
                  </Label>
                </div>

                {post.published_at && (
                  <div className="text-sm text-gray-400 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.published_at).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-gray-200 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Author
                </Label>
                <Input
                  id="author"
                  name="author"
                  value={post.author}
                  onChange={handleInputChange}
                  placeholder="Author name"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-200 flex items-center">
                  <Folder className="h-4 w-4 mr-1" />
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={post.category || ""}
                  onChange={handleInputChange}
                  placeholder="Post category"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-200 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="Comma-separated tags"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">Separate tags with commas</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200 flex items-center">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Featured Image
                </Label>

                {post.featured_image ? (
                  <div className="space-y-2">
                    <img
                      src={post.featured_image || "/placeholder.svg"}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <div className="flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => setPost({ ...post, featured_image: null })}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => window.open(post.featured_image!, "_blank")}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ) : (
                  <FileUpload bucket="assets" folder="blog" accept="image/*" onUploadComplete={handleImageUpload} />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Button className="w-full" onClick={savePost} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                {isNew ? "Create Post" : "Update Post"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
