import { type NextRequest, NextResponse } from "next/server"
import { getAllLogoStories, createLogoStory } from "@/lib/dynamodb"

export async function GET() {
  try {
    const items = await getAllLogoStories()
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching logo stories:", error)
    return NextResponse.json({ error: "Failed to fetch logo stories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Set default values
    if (data.is_featured === undefined) data.is_featured = false
    if (data.order === undefined) data.order = 0

    const item = await createLogoStory(data)

    if (!item) {
      return NextResponse.json({ error: "Failed to create logo story" }, { status: 500 })
    }

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error("Error creating logo story:", error)
    return NextResponse.json({ error: "Failed to create logo story" }, { status: 500 })
  }
}
