import { NextResponse } from "next/server"
import { getAllFormSubmissions } from "@/lib/dynamodb"

// GET all submissions
export async function GET() {
  try {
    const submissions = await getAllFormSubmissions()
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}
