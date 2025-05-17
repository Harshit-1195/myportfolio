import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto py-28 px-4 max-w-4xl min-h-screen">
      <Link href="/blog" className="text-white hover:text-white/80 flex items-center gap-2 mb-6">
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      <div className="glass-panel p-8 rounded-lg mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Blog Post Not Found</h1>
        <p className="text-white/70">The blog post you're looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  )
}
