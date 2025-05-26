import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/admin/dashboard"

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(new URL("/admin/login?error=auth_callback_error", requestUrl.origin))
      }
    } catch (err) {
      console.error("Auth callback exception:", err)
      return NextResponse.redirect(new URL("/admin/login?error=auth_callback_error", requestUrl.origin))
    }
  }

  // Redirect to the admin dashboard or specified next URL
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
