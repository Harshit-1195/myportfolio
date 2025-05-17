import { type NextRequest, NextResponse } from "next/server"
import { updateAsset, deleteAsset } from "@/lib/dynamodb"

interface RouteParams {
  params: {
    id: string
  }
}

// PUT to update an asset
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()

    const asset = await updateAsset(id, body)

    if (!asset) {
      return NextResponse.json({ error: "Failed to update asset" }, { status: 500 })
    }

    return NextResponse.json({ asset })
  } catch (error) {
    console.error("Error updating asset:", error)
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 })
  }
}

// DELETE an asset
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const success = await deleteAsset(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting asset:", error)
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 })
  }
}
