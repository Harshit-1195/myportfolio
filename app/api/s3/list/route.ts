import { type NextRequest, NextResponse } from "next/server"
import { listFilesInS3 } from "@/lib/aws-s3"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const prefix = searchParams.get("prefix") || ""

    const files = await listFilesInS3(prefix)

    return NextResponse.json({
      success: true,
      files,
    })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}
