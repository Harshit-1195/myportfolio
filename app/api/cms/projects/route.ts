import { type NextRequest, NextResponse } from "next/server"
import { getAllProjects, createProject } from "@/lib/cms-service"

export async function GET() {
  try {
    const projects = await getAllProjects()
    return NextResponse.json({ items: projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
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

    const project = await createProject({
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      content: body.content,
      featured_image: body.featured_image || null,
      technologies: body.technologies || [],
      url: body.url || null,
      github_url: body.github_url || null,
      is_featured: body.is_featured || false,
      order_index: body.order_index || 0,
    })

    if (!project) {
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    return NextResponse.json({ item: project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
