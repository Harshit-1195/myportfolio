import { type NextRequest, NextResponse } from "next/server"
import { deleteFileFromS3 } from "@/lib/aws-s3"

export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ error: "No file key provided" }, { status: 400 })
    }

    const success = await deleteFileFromS3(key)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `File ${key} deleted successfully`,
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
