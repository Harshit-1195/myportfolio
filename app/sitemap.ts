// app/sitemap.ts
import type { MetadataRoute } from "next"

type NewsItem = {
  slug: string
  type: "Case Study" | "Article" | string
  updatedAt?: string
  createdAt?: string
}

function ensureNoTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

function asDate(value?: string): Date {
  const d = value ? new Date(value) : new Date()
  return isNaN(d.getTime()) ? new Date() : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrlRaw =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://www.harshitdabhi.com"
  const baseUrl = ensureNoTrailingSlash(baseUrlRaw)

  const staticRoutes: MetadataRoute.Sitemap = [
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
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // New listing pages
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  // Helper to fetch items by type
  const fetchItems = async (type: "Case Study" | "Article") => {
    try {
      const url = `${baseUrl}/api/news?project=${encodeURIComponent(
        "Harshit Dabhi"
      )}&type=${encodeURIComponent(type)}`
      const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } })
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
      const items = (await res.json()) as NewsItem[]
      return items || []
    } catch {
      // If API hiccups, fail gracefully with empty list
      return [] as NewsItem[]
    }
  }

  const [caseStudies, articles] = await Promise.all([
    fetchItems("Case Study"),
    fetchItems("Article"),
  ])

  const dynamicRoutes: MetadataRoute.Sitemap = [
    // Case Studies => /case-studies/[slug]
    ...caseStudies
      .filter((i) => i?.slug)
      .map((i) => ({
        url: `${baseUrl}/case-studies/${i.slug}`,
        lastModified: asDate(i.updatedAt || i.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    // Articles => /blog/[slug]
    ...articles
      .filter((i) => i?.slug)
      .map((i) => ({
        url: `${baseUrl}/blog/${i.slug}`,
        lastModified: asDate(i.updatedAt || i.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
