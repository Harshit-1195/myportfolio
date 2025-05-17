import { type NextRequest, NextResponse } from "next/server"
import { getAllCaseStudies, createCaseStudy } from "@/lib/cms-service"

export async function GET() {
  try {
    const caseStudies = await getAllCaseStudies()
    return NextResponse.json({ items: caseStudies })
  } catch (error) {
    console.error("Error fetching case studies:", error)
    return NextResponse.json({ error: "Failed to fetch case studies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.slug || !body.client || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, client, and content are required" },
        { status: 400 },
      )
    }

    const caseStudy = await createCaseStudy({
      title: body.title,
      slug: body.slug,
      client: body.client,
      description: body.description || null,
      content: body.content,
      featured_image: body.featured_image || null,
      gallery: body.gallery || [],
      challenge: body.challenge || null,
      solution: body.solution || null,
      results: body.results || null,
      testimonial: body.testimonial || null,
      testimonial_author: body.testimonial_author || null,
      is_featured: body.is_featured || false,
      order_index: body.order_index || 0,
    })

    if (!caseStudy) {
      return NextResponse.json({ error: "Failed to create case study" }, { status: 500 })
    }

    return NextResponse.json({ item: caseStudy }, { status: 201 })
  } catch (error) {
    console.error("Error creating case study:", error)
    return NextResponse.json({ error: "Failed to create case study" }, { status: 500 })
  }
}
