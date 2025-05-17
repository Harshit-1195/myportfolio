import { NextResponse } from "next/server"
import { createSampleData } from "@/lib/cms-service"

export async function POST() {
  try {
    const result = await createSampleData()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error setting up sample data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
