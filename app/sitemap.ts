import type { MetadataRoute } from "next"
import { getSupabaseServerClient } from "@/lib/supabase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://v0-portfolio-website-clone-seven.vercel.app"

  // Initialize the sitemap with static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/podcast`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ] as MetadataRoute.Sitemap

  try {
    // Get Supabase client
    const supabase = getSupabaseServerClient()

    // Fetch blog posts
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("is_published", true)

    // Add blog posts to sitemap
    const blogRoutes =
      blogPosts?.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })) || []

    // Fetch projects
    const { data: projects } = await supabase.from("projects").select("slug, updated_at")

    // Add projects to sitemap
    const projectRoutes =
      projects?.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })) || []

    // Fetch case studies
    const { data: caseStudies } = await supabase.from("case_studies").select("slug, updated_at")

    // Add case studies to sitemap
    const caseStudyRoutes =
      caseStudies?.map((caseStudy) => ({
        url: `${baseUrl}/case-study/${caseStudy.slug}`,
        lastModified: new Date(caseStudy.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })) || []

    // Combine all routes
    return [...staticRoutes, ...blogRoutes, ...projectRoutes, ...caseStudyRoutes]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    // Return only static routes if there's an error
    return staticRoutes
  }
}
