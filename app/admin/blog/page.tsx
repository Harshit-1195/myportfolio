"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Edit2, Trash2, Search, RefreshCw, AlertTriangle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample blog posts for preview mode - ensuring structure matches expected data
const sampleBlogPosts = [
  {
    id: "sample-1",
    title: "The Future of Digital Marketing in 2024",
    slug: "future-digital-marketing-2024",
    excerpt: "Explore the emerging trends and technologies shaping digital marketing strategies in 2024 and beyond.",
    featured_image: "/digital-marketing-dashboard.png",
    author: "Marketing Expert",
    is_published: true,
    published_at: "2024-01-21T09:00:00Z",
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-21T09:00:00Z",
    views: 1245,
    category: "Digital Marketing",
  },
  {
    id: "sample-2",
    title: "Maximizing ROI with Omnichannel Media Buying",
    slug: "maximizing-roi-omnichannel-media-buying",
    excerpt:
      "Learn how to optimize your media buying strategy across multiple channels to achieve the highest return on investment.",
    featured_image: "/omnichannel-marketing.png",
    author: "Media Strategist",
    is_published: true,
    published_at: "2023-12-15T10:30:00Z",
    created_at: "2023-12-14T10:30:00Z",
    updated_at: "2023-12-15T10:30:00Z",
    views: 982,
    category: "Media Buying",
  },
  {
    id: "sample-3",
    title: "Data-Driven Decision Making in Digital Marketing",
    slug: "data-driven-decision-making-digital-marketing",
    excerpt:
      "Discover how to leverage data analytics to make informed marketing decisions that drive business growth and customer engagement.",
    featured_image: "/data-analytics-dashboard.png",
    author: "Data Analyst",
    is_published: false,
    published_at: null,
    created_at: "2023-11-05T14:45:00Z",
    updated_at: "2023-11-05T14:45:00Z",
    views: 0,
    category: "Analytics",
  },
]

export default function BlogPostsAdmin() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPreviewMode, setIsPreviewMode] = useState(true) // Always true for preview

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setPosts(sampleBlogPosts)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this post? This action is simulated in preview mode.")) {
      return
    }
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
    alert(`Simulated deletion of post with ID: ${id}. In a real application, this would be a database operation.`)
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {isPreviewMode && (
        <Card className="bg-yellow-900/30 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-300">Preview Mode Active</p>
                <p className="text-sm text-yellow-400 mt-1">
                  You are currently viewing sample data. All operations (create, edit, delete) are simulated and will
                  not affect a live database.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl">Blog Posts</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => {
                    setPosts(sampleBlogPosts)
                    setLoading(false)
                  }, 500)
                }}
                disabled={loading}
                className="w-1/2 md:w-auto"
              >
                <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Link href="/admin/blog/new" passHref legacyBehavior>
                <Button className="w-1/2 md:w-auto bg-blue-600 hover:bg-blue-700">
                  <PlusCircle size={16} className="mr-2" />
                  New Post
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by title, excerpt, or author..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border-gray-700 rounded-md text-white focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-300">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400 mb-4 text-lg">No blog posts found matching your search.</p>
              <p className="text-gray-500 mb-6">Try adjusting your search query or create a new post.</p>
              <Link href="/admin/blog/new" passHref legacyBehavior>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <PlusCircle size={16} className="mr-2" />
                  Create Your First Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] hidden md:table-cell">Image</TableHead>
                    <TableHead>Title & Excerpt</TableHead>
                    <TableHead className="hidden lg:table-cell">Author</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-gray-800/50">
                      <TableCell className="hidden md:table-cell">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image || "/placeholder.svg"}
                            alt={post.title}
                            className="h-10 w-10 rounded object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg?width=40&height=40"
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-700 flex items-center justify-center text-gray-500 text-xs">
                            No Img
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-white">{post.title}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs md:max-w-sm lg:max-w-md">
                          {post.excerpt || "No excerpt available."}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-gray-300">{post.author}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={post.is_published ? "default" : "secondary"}
                          className={
                            post.is_published
                              ? "bg-green-700/30 text-green-300 border-green-600"
                              : "bg-yellow-700/30 text-yellow-300 border-yellow-600"
                          }
                        >
                          {post.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-gray-400">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-sky-400 h-8 w-8"
                              title="View Live Post"
                              target="_blank"
                            >
                              <ExternalLink size={16} />
                              <span className="sr-only">View Post</span>
                            </Button>
                          </Link>
                          <Link href={`/admin/blog/${post.id}`} passHref legacyBehavior>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-blue-400 h-8 w-8"
                              title="Edit Post"
                            >
                              <Edit2 size={16} />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(post.id)}
                            className="text-gray-400 hover:text-red-400 h-8 w-8"
                            title="Delete Post (Simulated)"
                          >
                            <Trash2 size={16} />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
