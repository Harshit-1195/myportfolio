import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Making middleware async
export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the path is for the admin area
  if (path.startsWith("/admin")) {
    // In a real application, you would check for authentication here
    // For now, we'll just allow access
    // Example of how you might implement authentication:
    // const token = request.cookies.get('auth_token')?.value
    // if (!token) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
