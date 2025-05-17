import { type NextRequest, NextResponse } from "next/server"
import { getAllBlogPosts, createBlogPost } from "@/lib/dynamodb"

export async function GET() {
  try {
    const items = await getAllBlogPosts()
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Set default values
    if (!data.views) data.views = 0
    if (data.is_published === undefined) data.is_published = false
    if (!data.published_at && data.is_published) data.published_at = new Date().toISOString()
    if (!data.tags) data.tags = []

    const item = await createBlogPost(data)

    if (!item) {
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
    }

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
