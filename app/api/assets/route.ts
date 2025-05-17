import { type NextRequest, NextResponse } from "next/server"
import { getAllAssets, createAsset } from "@/lib/dynamodb"

// GET all assets
export async function GET() {
  try {
    const assets = await getAllAssets()
    return NextResponse.json({ assets })
  } catch (error) {
    console.error("Error fetching assets:", error)
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 })
  }
}

// POST to create a new asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.file_url || !body.file_type) {
      return NextResponse.json(
        { error: "Missing required fields: name, file_url, and file_type are required" },
        { status: 400 },
      )
    }

    const asset = await createAsset({
      name: body.name,
      description: body.description || null,
      file_url: body.file_url,
      file_type: body.file_type,
      file_size: body.file_size || null,
      version: body.version || null,
      is_active: body.is_active !== undefined ? body.is_active : true,
    })

    if (!asset) {
      return NextResponse.json({ error: "Failed to create asset" }, { status: 500 })
    }

    return NextResponse.json({ asset }, { status: 201 })
  } catch (error) {
    console.error("Error creating asset:", error)
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 })
  }
}
