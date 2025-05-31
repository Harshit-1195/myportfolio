import { type NextRequest, NextResponse } from "next/server"
import { getAllBlogPosts, createBlogPost } from "@/lib/cms-service"

export async function GET() {
  try {
    const posts = await getAllBlogPosts()
    return NextResponse.json({ items: posts })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, and content are required" },
        { status: 400 },
      )
    }

    // Ensure canonical URL is set
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"
    const canonicalUrl = body.canonical_url || `${baseUrl}/blog/${body.slug}`

    const post = await createBlogPost({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content,
      featured_image: body.featured_image || null,
      author: body.author || "Anonymous",
      category: body.category || null,
      tags: body.tags || [],
      published_at: body.is_published ? new Date().toISOString() : null,
      is_published: body.is_published || false,
      views: 0,
      seo_title: body.seo_title || body.title,
      seo_description: body.seo_description || body.excerpt,
      canonical_url: canonicalUrl,
      og_image: body.og_image || body.featured_image,
    })

    if (!post) {
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
    }

    return NextResponse.json({ item: post }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
