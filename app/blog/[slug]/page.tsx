import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import PageParticles from "@/components/page-particles"
import { Markdown } from "@/components/markdown"

export const revalidate = 3600 // Revalidate every hour

// This function generates static params for all blog posts
export async function generateStaticParams() {
  const supabase = createServerComponentClient({ cookies })
  const { data: posts } = await supabase.from("blog_posts").select("slug").eq("is_published", true)

  return (
    posts?.map((post) => ({
      slug: post.slug,
    })) || []
  )
}

async function getBlogPost(slug: string) {
  const supabase = createServerComponentClient({ cookies })

  // Increment view count
  await supabase.rpc("increment_blog_post_views", { post_slug: slug })

  // Get the post
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single()

  if (!data) {
    notFound()
  }

  return data
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  // Use SEO fields if available, otherwise fall back to regular content
  const seoTitle = post.seo_title || post.title
  const seoDescription = post.seo_description || post.excerpt
  const canonicalUrl = post.canonical_url || `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`
  const ogImage = post.og_image || post.featured_image

  // Format dates for display
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-4xl min-h-screen">
        <ScrollRevealWrapper>
          <Link href="/blog" className="text-white hover:text-white/80 flex items-center gap-2 mb-6">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <article className="glass-panel p-8 rounded-lg mb-10 hover-glow">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.category && (
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white">{post.category}</span>
                )}
                {post.tags &&
                  post.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs bg-white/5 text-white/80">
                      {tag}
                    </span>
                  ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>

              <div className="flex items-center text-sm text-white/70 mb-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{publishedDate}</span>
                <span className="mx-2">•</span>
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
            </div>

            {post.featured_image && (
              <div className="relative h-[300px] md:h-[400px] w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <Markdown content={post.content} />
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-white font-medium">{post.author}</span>
                </div>
                <button className="flex items-center gap-2 text-white/80 hover:text-white">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </article>
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
