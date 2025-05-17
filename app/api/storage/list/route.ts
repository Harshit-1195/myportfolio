import { type NextRequest, NextResponse } from "next/server"
import { listFiles, STORAGE_BUCKET } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folder = searchParams.get("folder") || ""
    const bucket = searchParams.get("bucket") || STORAGE_BUCKET

    const files = await listFiles(bucket, folder)

    return NextResponse.json({
      success: true,
      files,
    })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list files" },
      { status: 500 },
    )
  }
}
