import { type NextRequest, NextResponse } from "next/server"
import { getResumeUrl } from "@/lib/data"
import { trackDownload } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    // Get the resume URL from Supabase
    const resumeUrl = await getResumeUrl()

    // Track the download
    const userAgent = request.headers.get("user-agent") || undefined
    const referrer = request.headers.get("referer") || undefined
    await trackDownload("resume", userAgent, referrer)

    // If the URL is from an external source, redirect to it
    if (resumeUrl.startsWith("http")) {
      return NextResponse.redirect(resumeUrl)
    }

    // Otherwise, it's a local file, so we'll redirect to it
    return NextResponse.redirect(new URL(resumeUrl, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"))
  } catch (error) {
    console.error("Error serving resume:", error)
    return NextResponse.json({ error: "Failed to retrieve resume" }, { status: 500 })
  }
}
