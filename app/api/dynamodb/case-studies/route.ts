import { type NextRequest, NextResponse } from "next/server"
import { getAllCaseStudies, createCaseStudy } from "@/lib/dynamodb"

export async function GET() {
  try {
    const items = await getAllCaseStudies()
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching case studies:", error)
    return NextResponse.json({ error: "Failed to fetch case studies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Set default values
    if (data.is_featured === undefined) data.is_featured = false
    if (data.order === undefined) data.order = 0
    if (!data.gallery) data.gallery = []

    const item = await createCaseStudy(data)

    if (!item) {
      return NextResponse.json({ error: "Failed to create case study" }, { status: 500 })
    }

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error("Error creating case study:", error)
    return NextResponse.json({ error: "Failed to create case study" }, { status: 500 })
  }
}
