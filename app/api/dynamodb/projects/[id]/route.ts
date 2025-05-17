import { type NextRequest, NextResponse } from "next/server"
import { getProjectById, updateProject, deleteProject } from "@/lib/dynamodb"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const item = await getProjectById(id)

    if (!item) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error(`Error fetching project with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const data = await request.json()

    const item = await updateProject(id, data)

    if (!item) {
      return NextResponse.json({ error: "Project not found or update failed" }, { status: 404 })
    }

    return NextResponse.json({ item })
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
      return NextResponse.json({ error: "Project not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting project with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
