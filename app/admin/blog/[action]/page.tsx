"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { ArrowLeft, Save, ImageIcon, LinkIcon, Globe, Tag, Trash2 } from "lucide-react"
import { MediaLibraryModal } from "@/components/media-library-modal"

export default function BlogPostAction({ params }: { params: { action: string } }) {
  const isNew = params.action === "new"
  const postId = isNew ? null : params.action

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    author: "Admin",
    published: false,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    og_image: "",
    created_at: "",
    updated_at: "",
    published_at: null as string | null,
  })
  const [loading, setLoading] = useState(!isNew) // Only set loading to true if we're editing
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content")
  const [media, setMedia] = useState<any[]>([])
  const [showMediaSelector, setShowMediaSelector] = useState(false)
  const [mediaType, setMediaType] = useState<"featured" | "og">("featured")
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Sample data for preview mode
  const sampleBlogPost = {
    id: "sample-123",
    title: "The Future of Digital Marketing in 2024",
    slug: "future-digital-marketing-2024",
    excerpt: "Explore the emerging trends and technologies shaping digital marketing strategies in 2024 and beyond.",
    content:
      "# The Future of Digital Marketing\n\nDigital marketing continues to evolve at a rapid pace. In 2024, we're seeing several key trends emerge:\n\n## AI-Powered Personalization\nArtificial intelligence is revolutionizing how marketers deliver personalized experiences at scale.\n\n## Privacy-First Strategies\nWith the deprecation of third-party cookies, marketers are developing new approaches to targeting and measurement.\n\n## Immersive Experiences\nAugmented reality and virtual reality are creating new opportunities for brand engagement.\n\n## Conclusion\nStaying ahead of these trends will be crucial for marketing success in the coming years.",
    featured_image: "/digital-marketing-dashboard.png",
    author: "Marketing Expert",
    published: true,
    meta_title: "The Future of Digital Marketing: 2024 Trends and Predictions",
    meta_description:
      "Discover the top digital marketing trends for 2024 including AI personalization, privacy-first strategies, and immersive brand experiences.",
    meta_keywords: "digital marketing, 2024 trends, AI marketing, privacy-first marketing",
    canonical_url: "",
    og_image: "/digital-marketing-dashboard.png",
    created_at: "2023-11-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
    published_at: "2024-01-21T09:00:00Z",
  }

  useEffect(() => {
    // If we're creating a new post, don't fetch anything
    if (isNew) {
      setLoading(false)
      return
    }

    async function fetchPost() {
      try {
        setLoading(true)

        // Use sample data in preview mode
        if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800))
          setFormData(sampleBlogPost)
          setLoading(false)
          return
        }

        const { data, error } = await supabase.from("blog_posts").select("*").eq("id", postId).single()

        if (error) throw error

        if (data) {
          setFormData({
            ...data,
            published: !!data.published_at,
          })
        } else {
          throw new Error("Post not found")
        }
      } catch (err: any) {
        console.error("Error fetching post:", err)
        setError(err.message || "Failed to load blog post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [isNew, postId])

  useEffect(() => {
    if (showMediaSelector) {
      // fetchMedia() // Removed fetchMedia function
    }
  }, [showMediaSelector])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title if creating a new post
    if (isNew && name === "title" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }

    // Auto-generate meta title and description if empty
    if (name === "title" && !formData.meta_title) {
      setFormData((prev) => ({ ...prev, meta_title: value }))
    }

    if (name === "excerpt" && !formData.meta_description) {
      setFormData((prev) => ({ ...prev, meta_description: value }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const selectMedia = (url: string) => {
    if (mediaType === "featured") {
      setFormData((prev) => ({ ...prev, featured_image: url }))
    } else {
      setFormData((prev) => ({ ...prev, og_image: url }))
    }
    setShowMediaSelector(false)
  }

  const openMediaSelector = (type: "featured" | "og") => {
    setMediaType(type)
    setShowMediaSelector(true)
  }

  const generateSlug = () => {
    if (!formData.title) return

    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Validate form
      if (!formData.title || !formData.content) {
        throw new Error("Title and content are required")
      }

      // In preview mode, just simulate success
      if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push("/admin/blog")
        return
      }

      if (isNew) {
        // Create new post
        const { error } = await supabase.from("blog_posts").insert([
          {
            ...formData,
            published_at: formData.published ? new Date().toISOString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (error) throw error
      } else {
        // Update existing post
        const { error } = await supabase
          .from("blog_posts")
          .update({
            ...formData,
            published_at: formData.published ? formData.published_at || new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", postId)

        if (error) throw error
      }

      // Redirect to blog posts list
      router.push("/admin/blog")
    } catch (err: any) {
      console.error("Error saving post:", err)
      setError(err.message || "Failed to save blog post")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }

    try {
      setSaving(true)

      // In preview mode, just simulate success
      if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push("/admin/blog")
        return
      }

      const { error } = await supabase.from("blog_posts").delete().eq("id", postId)

      if (error) throw error

      router.push("/admin/blog")
    } catch (err: any) {
      console.error("Error deleting post:", err)
      setError(err.message || "Failed to delete blog post")
    } finally {
      setSaving(false)
      setDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      {(process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_SUPABASE_URL) && (
        <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-800 rounded-md text-yellow-300">
          <p className="font-medium">Preview Mode</p>
          <p className="text-sm">
            Running in preview mode with simulated functionality. Database operations will work in production.
          </p>
        </div>
      )}

      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-gray-400 hover:text-white">
          <ArrowLeft size={16} />
          Back to Blog Posts
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isNew ? "Create New Blog Post" : "Edit Blog Post"}</h1>
        <div className="flex gap-2">
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              className={`inline-flex items-center gap-2 px-4 py-2 ${
                deleteConfirm ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
              } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                deleteConfirm ? "focus:ring-red-500" : "focus:ring-gray-500"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={saving}
            >
              <Trash2 size={16} />
              {deleteConfirm ? "Confirm Delete" : "Delete"}
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {saving ? "Saving..." : isNew ? "Create Post" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-md text-white">{error}</div>}

      <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "content" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("content")}
            >
              Content
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "seo" ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("seo")}
            >
              SEO
            </button>
          </div>
        </div>

        <form className="p-6">
          {activeTab === "content" ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
                  Slug
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-700 border border-r-0 border-gray-700 rounded-l-md text-gray-400">
                    /blog/
                  </span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="enter-post-slug"
                    required
                  />
                </div>
                {isNew && (
                  <div className="mt-1">
                    <button type="button" onClick={generateSlug} className="text-xs text-blue-400 hover:text-blue-300">
                      Generate from title
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="featured_image" className="block text-sm font-medium text-gray-300 mb-1">
                  Featured Image
                </label>
                <div className="flex gap-2">
                  <input
                    id="featured_image"
                    name="featured_image"
                    type="text"
                    value={formData.featured_image}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaSelector("featured")}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600"
                  >
                    <ImageIcon size={16} />
                  </button>
                </div>
                {formData.featured_image && (
                  <div className="mt-2 relative aspect-video w-full max-w-md rounded-md overflow-hidden bg-gray-800">
                    <img
                      src={formData.featured_image || "/placeholder.svg"}
                      alt="Featured"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-1">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary of the post"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your blog post content here..."
                  required
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">
                  Author
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Author name"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  checked={formData.published}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-300">
                  Published
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Tag size={14} />
                    Meta Title
                  </span>
                </label>
                <input
                  id="meta_title"
                  name="meta_title"
                  type="text"
                  value={formData.meta_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SEO optimized title (defaults to post title)"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Recommended length: 50-60 characters. Current: {formData.meta_title.length}
                </p>
              </div>

              <div>
                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Tag size={14} />
                    Meta Description
                  </span>
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SEO meta description (defaults to excerpt)"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Recommended length: 150-160 characters. Current: {formData.meta_description.length}
                </p>
              </div>

              <div>
                <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Tag size={14} />
                    Meta Keywords
                  </span>
                </label>
                <input
                  id="meta_keywords"
                  name="meta_keywords"
                  type="text"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="mt-1 text-xs text-gray-400">Separate keywords with commas</p>
              </div>

              <div>
                <label htmlFor="canonical_url" className="block text-sm font-medium text-gray-300 mb-1">
                  <span className="flex items-center gap-1">
                    <LinkIcon size={14} />
                    Canonical URL
                  </span>
                </label>
                <input
                  id="canonical_url"
                  name="canonical_url"
                  type="text"
                  value={formData.canonical_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/original-post (optional)"
                />
                <p className="mt-1 text-xs text-gray-400">Use this if the content is duplicated from another source</p>
              </div>

              <div>
                <label htmlFor="og_image" className="block text-sm font-medium text-gray-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Globe size={14} />
                    Social Image URL
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="og_image"
                    name="og_image"
                    type="text"
                    value={formData.og_image}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL for social media sharing image (defaults to featured image)"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaSelector("og")}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600"
                  >
                    <ImageIcon size={16} />
                  </button>
                </div>
                {formData.og_image && (
                  <div className="mt-2 relative aspect-video w-full max-w-md rounded-md overflow-hidden bg-gray-800">
                    <img
                      src={formData.og_image || "/placeholder.svg"}
                      alt="Social"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Recommended size: 1200×630 pixels for optimal social media display
                </p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Media Selector Modal */}
      {showMediaSelector && (
        <MediaLibraryModal
          isOpen={showMediaSelector}
          onClose={() => setShowMediaSelector(false)}
          onSelect={(url) => {
            if (mediaType === "featured") {
              setFormData((prev) => ({ ...prev, featured_image: url }))
            } else {
              setFormData((prev) => ({ ...prev, og_image: url }))
            }
            setShowMediaSelector(false)
          }}
          accept="image/*"
          multiple={false}
        />
      )}
    </div>
  )
}
