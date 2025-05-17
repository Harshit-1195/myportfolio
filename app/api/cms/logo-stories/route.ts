import { type NextRequest, NextResponse } from "next/server"
import { getAllLogoStories, createLogoStory } from "@/lib/cms-service"

export async function GET() {
  try {
    const logoStories = await getAllLogoStories()
    return NextResponse.json({ items: logoStories })
  } catch (error) {
    console.error("Error fetching logo stories:", error)
    return NextResponse.json({ error: "Failed to fetch logo stories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.client || !body.image) {
      return NextResponse.json(
        { error: "Missing required fields: title, client, and image are required" },
        { status: 400 },
      )
    }

    const logoStory = await createLogoStory({
      title: body.title,
      client: body.client,
      description: body.description || null,
      image: body.image,
      challenge: body.challenge || null,
      solution: body.solution || null,
      result: body.result || null,
      is_featured: body.is_featured || false,
      order_index: body.order_index || 0,
    })

    if (!logoStory) {
      return NextResponse.json({ error: "Failed to create logo story" }, { status: 500 })
    }

    return NextResponse.json({ item: logoStory }, { status: 201 })
  } catch (error) {
    console.error("Error creating logo story:", error)
    return NextResponse.json({ error: "Failed to create logo story" }, { status: 500 })
  }
}
