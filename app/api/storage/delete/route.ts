import { type NextRequest, NextResponse } from "next/server"
import { deleteFile, STORAGE_BUCKET } from "@/lib/storage"

export async function DELETE(request: NextRequest) {
  try {
    const { path, bucket = STORAGE_BUCKET } = await request.json()

    if (!path) {
      return NextResponse.json({ error: "No file path provided" }, { status: 400 })
    }

    const success = await deleteFile(path, bucket)

    return NextResponse.json({
      success: true,
      message: `File ${path} deleted successfully`,
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete file" },
      { status: 500 },
    )
  }
}
