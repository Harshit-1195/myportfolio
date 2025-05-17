import { type NextRequest, NextResponse } from "next/server"
import { getCaseStudyBySlug, updateCaseStudy, deleteCaseStudy } from "@/lib/cms-service"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const caseStudy = await getCaseStudyBySlug(id)

    if (!caseStudy) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 })
    }

    return NextResponse.json({ item: caseStudy })
  } catch (error) {
    console.error(`Error fetching case study with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch case study" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()

    const caseStudy = await updateCaseStudy(id, body)

    if (!caseStudy) {
      return NextResponse.json({ error: "Failed to update case study" }, { status: 500 })
    }

    return NextResponse.json({ item: caseStudy })
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
      return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting case study with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 })
  }
}
