import { type NextRequest, NextResponse } from "next/server"
import { uploadFile, STORAGE_BUCKET } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const folder = (formData.get("folder") as string) || ""
    const bucket = (formData.get("bucket") as string) || STORAGE_BUCKET

    // Generate path with folder if provided
    const fileName = file.name
    const path = folder ? `${folder}/${fileName}` : fileName

    const result = await uploadFile(file, bucket, path)

    return NextResponse.json({
      success: true,
      file: result,
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
