"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { ArrowLeft, Save, ImageIcon, LinkIcon, Globe, Tag, X, Upload } from "lucide-react"

export default function NewBlogPost() {
  const [formData, setFormData] = useState({
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
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content")
  const [media, setMedia] = useState<any[]>([])
  const [showMediaSelector, setShowMediaSelector] = useState(false)
  const [mediaType, setMediaType] = useState<"featured" | "og">("featured")
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (showMediaSelector) {
      fetchMedia()
    }
  }, [showMediaSelector])

  async function fetchMedia() {
    try {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error
      setMedia(data || [])
    } catch (err) {
      console.error("Error fetching media:", err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title
    if (name === "title" && !formData.slug) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.title || !formData.content) {
        throw new Error("Title and content are required")
      }

      // Create the blog post
      const { error } = await supabase.from("blog_posts").insert([
        {
          ...formData,
          published_at: formData.published ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      // Redirect to blog posts list
      router.push("/admin/blog")
    } catch (err: any) {
      console.error("Error creating post:", err)
      setError(err.message || "Failed to create blog post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-gray-400 hover:text-white">
          <ArrowLeft size={16} />
          Back to Blog Posts
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {loading ? "Saving..." : "Save Post"}
        </button>
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
                  Publish immediately
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Select Media</h3>
              <button onClick={() => setShowMediaSelector(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
              {media.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No media found</p>
                  <Link
                    href="/admin/media/upload"
                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => setShowMediaSelector(false)}
                  >
                    <Upload size={16} />
                    Upload Media
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {media
                    .filter((item) => item.mime_type.startsWith("image/"))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="relative group rounded-md overflow-hidden border border-gray-700 cursor-pointer"
                        onClick={() =>
                          selectMedia(
                            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item.file_path}`,
                          )
                        }
                      >
                        <div className="aspect-square bg-gray-800">
                          <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item.file_path}`}
                            alt={item.alt_text || item.original_filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 bg-gray-800 text-xs truncate">{item.original_filename}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setShowMediaSelector(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
