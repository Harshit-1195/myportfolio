import { type NextRequest, NextResponse } from "next/server"
import { uploadFileServer } from "@/lib/storage-server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const path = folder ? `${folder}/${file.name}` : file.name

    const result = await uploadFileServer(file, "assets", path)

    return NextResponse.json({
      success: true,
      url: result.url,
      path: result.path,
      size: result.size,
      contentType: result.contentType,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 },
    )
  }
}
