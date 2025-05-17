import { type NextRequest, NextResponse } from "next/server"
import { getPresentationUrl } from "@/lib/data"
import { trackDownload } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    // Get the presentation URL from Supabase
    const presentationUrl = await getPresentationUrl()

    // Track the download
    const userAgent = request.headers.get("user-agent") || undefined
    const referrer = request.headers.get("referer") || undefined
    await trackDownload("presentation", userAgent, referrer)

    // If the URL is from an external source, redirect to it
    if (presentationUrl.startsWith("http")) {
      return NextResponse.redirect(presentationUrl)
    }

    // Otherwise, it's a local file, so we'll redirect to it
    return NextResponse.redirect(new URL(presentationUrl, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"))
  } catch (error) {
    console.error("Error serving presentation:", error)
    return NextResponse.json({ error: "Failed to retrieve presentation" }, { status: 500 })
  }
}
