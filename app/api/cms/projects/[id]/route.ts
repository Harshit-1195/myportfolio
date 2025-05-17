import { type NextRequest, NextResponse } from "next/server"
import { getProjectBySlug, updateProject, deleteProject } from "@/lib/cms-service"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const project = await getProjectBySlug(id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ item: project })
  } catch (error) {
    console.error(`Error fetching project with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()

    const project = await updateProject(id, body)

    if (!project) {
      return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }

    return NextResponse.json({ item: project })
  } catch (error) {
    console.error(`Error updating project with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const success = await deleteProject(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting project with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
