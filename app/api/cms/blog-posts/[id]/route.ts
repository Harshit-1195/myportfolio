import { type NextRequest, NextResponse } from "next/server"
import { getBlogPostBySlug, updateBlogPost, deleteBlogPost } from "@/lib/cms-service"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const post = await getBlogPostBySlug(id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ item: post })
  } catch (error) {
    console.error(`Error fetching blog post with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()

    // Handle published_at field
    if (body.is_published && !body.published_at) {
      body.published_at = new Date().toISOString()
    }

    const post = await updateBlogPost(id, body)

    if (!post) {
      return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
    }

    return NextResponse.json({ item: post })
  } catch (error) {
    console.error(`Error updating blog post with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const success = await deleteBlogPost(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting blog post with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
