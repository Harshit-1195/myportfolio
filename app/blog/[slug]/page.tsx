"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Share2, ArrowRight, ChevronRight } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import PageParticles from "@/components/page-particles"
import { useEffect, useState } from "react"
import { blogPosts } from "@/lib/blog-data"
import { motion } from "framer-motion"
import { BackToHomeAlt } from "@/components/back-to-home-alt"

export default function BlogPost() {
  const { slug } = useParams() // Changed from id to slug
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [nextPosts, setNextPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFullArticle, setShowFullArticle] = useState(false)

  useEffect(() => {
    // Find the current post
    const currentPost = blogPosts.find((post) => post.id === slug) // We're still using id as the identifier
    setPost(currentPost || null)

    // Find related posts (same category, excluding current post)
    if (currentPost) {
      const related = blogPosts.filter((p) => p.id !== slug && p.category === currentPost.category).slice(0, 3)
      setRelatedPosts(related)

      // Find next posts (different from related posts and current post)
      const next = blogPosts
        .filter((p) => p.id !== slug && !related.some((r) => r.id === p.id) && p.category !== currentPost.category)
        .sort(() => 0.5 - Math.random()) // Shuffle the array
        .slice(0, 6)
      setNextPosts(next)
    }

    setIsLoading(false)
  }, [slug])

  if (isLoading) {
    return (
      <>
        <PageParticles />
        <div className="container mx-auto py-28 px-4 max-w-4xl min-h-screen">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-white/10 rounded mb-6"></div>
            <div className="glass-panel p-8 rounded-lg mb-10">
              <div className="h-8 w-3/4 bg-white/10 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-white/10 rounded mb-8"></div>
              <div className="h-64 w-full bg-white/10 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-white/10 rounded"></div>
                <div className="h-4 w-full bg-white/10 rounded"></div>
                <div className="h-4 w-3/4 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!post) {
    return (
      <>
        <PageParticles />
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
      </>
    )
  }

  // Function to extract a preview of the content (first paragraph after h1)
  const getContentPreview = () => {
    const content = post.content
    const h1EndIndex = content.indexOf("</h1>")
    if (h1EndIndex === -1) return content

    const afterH1 = content.substring(h1EndIndex + 5)
    const firstParagraphEndIndex = afterH1.indexOf("</p>")
    if (firstParagraphEndIndex === -1) return afterH1

    return content.substring(0, h1EndIndex + 5) + afterH1.substring(0, firstParagraphEndIndex + 4)
  }

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

              <div className="flex items-center text-sm text-white/70 mb-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
            </div>

            {post.image && (
              <div className="relative h-[300px] md:h-[400px] w-full mb-8 rounded-lg overflow-hidden">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
              </div>
            )}

            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: showFullArticle ? post.content : getContentPreview() }}
            />

            {!showFullArticle && (
              <div className="mt-6">
                <button
                  onClick={() => setShowFullArticle(true)}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-all"
                >
                  Read Now
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

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
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="glass-panel rounded-lg overflow-hidden hover-glow block"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={relatedPost.image || "/placeholder.svg"}
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

          {/* Next Blogs Grid - Only shown after clicking "Read Now" */}
          {showFullArticle && nextPosts.length > 0 && (
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Discover More Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nextPosts.map((nextPost, index) => (
                  <motion.div
                    key={nextPost.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/blog/${nextPost.id}`}
                      className="glass-panel rounded-lg overflow-hidden hover-glow block h-full"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={nextPost.image || "/placeholder.svg"}
                          alt={nextPost.title}
                          fill
                          className="object-cover"
                        />
                        {nextPost.category && (
                          <div className="absolute top-2 right-2 glass-panel text-white text-xs px-2 py-1 rounded">
                            {nextPost.category}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center text-xs text-white/70 mb-2">
                          <span>{nextPost.date}</span>
                          <span className="mx-2">•</span>
                          <span>{nextPost.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white line-clamp-2">{nextPost.title}</h3>
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">{nextPost.excerpt}</p>
                        <div className="text-white font-medium flex items-center gap-1 hover:text-white/80 text-sm mt-auto">
                          Read Article <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          <BackToHomeAlt />
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
