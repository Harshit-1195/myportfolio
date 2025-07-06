import { Blog } from "@/lib/types/common";
import PageParticles from "@/components/page-particles";
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper";
import { BlogPostCard } from "@/components/blog-post-card";
import { headers as getHeaders } from "next/headers";

export const revalidate = 3600;

async function getBlogs(): Promise<Blog[]> {
  const headers = await getHeaders(); // ✅ FIXED
  const host = headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(
      `${baseUrl}/api/news?project=Dubai%20Metro%20Rails&type=Article`,
      { next: { revalidate: 3600 } }
    );
    const blogs = await res.json();
    return Array.isArray(blogs) ? blogs : [];
  } catch (err) {
    console.error("❌ Failed to fetch blogs:", err);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-6xl">
        <ScrollRevealWrapper>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Blog
          </h1>
          <p className="text-xl text-white/70 mb-12 text-center max-w-3xl mx-auto">
            Insights, thoughts, and expertise on digital marketing, programmatic
            advertising, and media buying.
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-2">No posts yet</h3>
              <p className="text-white/70">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const cardData = {
                  id: post.id || "",
                  title: post.title || "Untitled",
                  slug: post.slug || "",
                  excerpt: post.metaDescription || "",
                  featured_image: post.heroImage || null,
                  author: post.by || "Unknown",
                  category: post.category || "Uncategorized",
                  tags: [],
                  published_at: post.createdAt || null,
                  created_at: post.createdAt || "",
                };

                return (
                  <ScrollRevealWrapper key={cardData.id}>
                    <BlogPostCard post={cardData} />
                  </ScrollRevealWrapper>
                );
              })}
            </div>
          )}
        </ScrollRevealWrapper>
      </div>
    </>
  );
}
