import { type NextRequest, NextResponse } from "next/server"
import { getCaseStudyById, updateCaseStudy, deleteCaseStudy } from "@/lib/dynamodb"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const item = await getCaseStudyById(id)

    if (!item) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error(`Error fetching case study with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch case study" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const data = await request.json()

    const item = await updateCaseStudy(id, data)

    if (!item) {
      return NextResponse.json({ error: "Case study not found or update failed" }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error(`Error updating case study with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update case study" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const success = await deleteCaseStudy(id)

    if (!success) {
      return NextResponse.json({ error: "Case study not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting case study with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 })
  }
}
