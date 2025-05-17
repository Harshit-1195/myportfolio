import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PageParticles from "@/components/page-particles"

export default function BlogPostLoading() {
  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-4xl min-h-screen">
        <Link href="/blog" className="text-white hover:text-white/80 flex items-center gap-2 mb-6">
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        <div className="glass-panel p-8 rounded-lg mb-10">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <div className="w-24 h-6 bg-white/10 rounded-full animate-pulse"></div>
            </div>

            <div className="w-3/4 h-10 bg-white/10 rounded animate-pulse mb-4"></div>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-32 h-4 bg-white/10 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="w-full h-[300px] bg-white/10 rounded-lg animate-pulse mb-8"></div>

          <div className="space-y-4">
            <div className="w-full h-4 bg-white/10 rounded animate-pulse"></div>
            <div className="w-full h-4 bg-white/10 rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-white/10 rounded animate-pulse"></div>
            <div className="w-full h-4 bg-white/10 rounded animate-pulse"></div>
            <div className="w-5/6 h-4 bg-white/10 rounded animate-pulse"></div>
            <div className="w-full h-4 bg-white/10 rounded animate-pulse"></div>
            <div className="w-2/3 h-4 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </>
  )
}
