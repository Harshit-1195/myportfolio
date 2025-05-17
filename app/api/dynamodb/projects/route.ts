import { type NextRequest, NextResponse } from "next/server"
import { getAllProjects, createProject } from "@/lib/dynamodb"

export async function GET() {
  try {
    const items = await getAllProjects()
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Set default values
    if (data.is_featured === undefined) data.is_featured = false
    if (data.order === undefined) data.order = 0
    if (!data.technologies) data.technologies = []

    const item = await createProject(data)

    if (!item) {
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
