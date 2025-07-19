import { Blog } from "@/lib/types/common";
import PageParticles from "@/components/page-particles";
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper";
import { BlogPostCard } from "@/components/blog-post-card";
import { headers as getHeaders } from "next/headers";

export const revalidate = 3600;

async function getCaseStudies(): Promise<Blog[]> {
  const headers = await getHeaders();
  const host = headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(
      `${baseUrl}/api/news?project=Harshit%20Dabhi&type=Case%20Study`,
      { next: { revalidate: 3600 } }
    );
    const caseStudies = await res.json();
    return Array.isArray(caseStudies) ? caseStudies : [];
  } catch (err) {
    console.error("❌ Failed to fetch case studies:", err);
    return [];
  }
}

export default async function CaseStudiesPage() {
  const posts = await getCaseStudies();

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-6xl">
        <ScrollRevealWrapper>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Case Studies
          </h1>
          <p className="text-xl text-white/70 mb-12 text-center max-w-3xl mx-auto">
            Real-world examples of how performance marketing and programmatic
            strategies helped brands grow across industries.
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-2">No case studies yet</h3>
              <p className="text-white/70">Check back soon for new case studies!</p>
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
                    <BlogPostCard isCS post={cardData} />
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
