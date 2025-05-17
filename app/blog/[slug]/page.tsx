import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Share2, ArrowRight } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import PageParticles from "@/components/page-particles"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/cms-service"
import type { Metadata, ResolvingMetadata } from "next"

export const revalidate = 3600 // Revalidate every hour

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || undefined,
    openGraph: post.featured_image
      ? {
          images: [post.featured_image],
        }
      : undefined,
  }
}

// Generate static params for common blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  // If no post is found, show a 404 page
  if (!post) {
    notFound()
  }

  // Get related posts (simple implementation - you can enhance this)
  const allPosts = await getAllBlogPosts()
  const relatedPosts = allPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)

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
                  post.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs bg-white/5 text-white/80">
                      {tag}
                    </span>
                  ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>

              <div className="flex items-center text-sm text-white/70 mb-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                {post.author && (
                  <>
                    <span className="mx-2">•</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </>
                )}
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

            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

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

          {relatedPosts.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="glass-panel rounded-lg overflow-hidden hover-glow block"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={relatedPost.featured_image || "/placeholder.svg?height=160&width=320&query=blog"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 text-white line-clamp-2">{relatedPost.title}</h3>
                      <div className="text-white font-medium flex items-center gap-1 hover:text-white/80 text-sm">
                        Read Article <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
