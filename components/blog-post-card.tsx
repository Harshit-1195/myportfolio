import Link from "next/link"
import Image from "next/image"
import { Calendar, User, ArrowRight } from "lucide-react"

interface BlogPostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    featured_image: string | null
    author: string
    category: string | null
    tags: string[] | null
    published_at: string | null
    created_at: string
  }
} 

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="glass-panel p-6 rounded-lg hover-glow transition-all duration-300 h-full flex flex-col">
      {post.featured_image && (
        <div className="relative h-48 mb-4 rounded-md overflow-hidden">
          <Image src={post.featured_image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="mb-2 flex flex-wrap gap-2">
          {post.category && (
            <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white">{post.category}</span>
          )}
          {post.tags &&
            post.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-xs bg-white/5 text-white/80">
                {tag}
              </span>
            ))}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>

        {post.excerpt && <p className="text-white/70 mb-4 flex-1">{post.excerpt}</p>}

        <div className="flex items-center text-sm text-white/60 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(post.published_at || post.created_at)}</span>
          <span className="mx-2">•</span>
          <User className="h-4 w-4 mr-1" />
          <span>{post.author}</span>
        </div>

        <Link href={`/blog/${post.slug}`} className="text-white hover:text-white/80 flex items-center gap-1 mt-auto">
          Read More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
