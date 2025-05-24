"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminBlogPosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err: any) {
      console.error("Error fetching posts:", err)
      setError(err.message || "Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)

      if (error) throw error
      setPosts(posts.filter((post) => post.id !== id))
    } catch (err: any) {
      console.error("Error deleting post:", err)
      alert("Failed to delete post: " + err.message)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-md text-white">{error}</div>}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 bg-gray-900 rounded-lg">
          <p className="text-gray-400 mb-4">No blog posts found</p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={16} />
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/blog/edit/${post.id}`} className="text-blue-400 hover:text-blue-300">
                        <Edit size={16} />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
