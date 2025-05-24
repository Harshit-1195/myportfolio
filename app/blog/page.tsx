import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { BlogPostCard } from "@/components/blog-post-card"
import PageParticles from "@/components/page-particles"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"

export const revalidate = 3600 // Revalidate every hour

async function getBlogPosts() {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data || []
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-6xl">
        <ScrollRevealWrapper>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">Blog</h1>
          <p className="text-xl text-white/70 mb-12 text-center max-w-3xl mx-auto">
            Insights, thoughts, and expertise on digital marketing, programmatic advertising, and media buying.
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-2">No posts yet</h3>
              <p className="text-white/70">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ScrollRevealWrapper key={post.id} delay={0.1}>
                  <BlogPostCard post={post} />
                </ScrollRevealWrapper>
              ))}
            </div>
          )}
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
