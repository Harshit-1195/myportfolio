import { type NextRequest, NextResponse } from "next/server"
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/dynamodb"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const item = await getBlogPostById(id)

    if (!item) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error(`Error fetching blog post with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const data = await request.json()

    // If publishing for the first time, set published_at
    if (data.is_published && !data.published_at) {
      data.published_at = new Date().toISOString()
    }

    const item = await updateBlogPost(id, data)

    if (!item) {
      return NextResponse.json({ error: "Blog post not found or update failed" }, { status: 404 })
    }

    return NextResponse.json({ item })
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
      return NextResponse.json({ error: "Blog post not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting blog post with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
