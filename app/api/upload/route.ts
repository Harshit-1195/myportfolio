import { type NextRequest, NextResponse } from "next/server"
import { uploadFile } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate path with folder if provided
    const path = folder ? `${folder}/${file.name}` : file.name

    // Upload to Supabase Storage
    const result = await uploadFile(file, "assets", path) // Uses "assets" bucket by default, not "media"

    return NextResponse.json({
      success: true,
      url: result.url,
      path: result.path,
      size: result.size,
      contentType: result.contentType,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
