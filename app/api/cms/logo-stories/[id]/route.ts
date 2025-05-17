import { type NextRequest, NextResponse } from "next/server"
import { getLogoStoryById, updateLogoStory, deleteLogoStory } from "@/lib/cms-service"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const logoStory = await getLogoStoryById(id)

    if (!logoStory) {
      return NextResponse.json({ error: "Logo story not found" }, { status: 404 })
    }

    return NextResponse.json({ item: logoStory })
  } catch (error) {
    console.error(`Error fetching logo story with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch logo story" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()

    const logoStory = await updateLogoStory(id, body)

    if (!logoStory) {
      return NextResponse.json({ error: "Failed to update logo story" }, { status: 500 })
    }

    return NextResponse.json({ item: logoStory })
  } catch (error) {
    console.error(`Error updating logo story with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update logo story" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const success = await deleteLogoStory(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete logo story" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting logo story with id ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete logo story" }, { status: 500 })
  }
}
