import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Create a Supabase client with the service role key
    const supabaseAdmin = createRouteHandlerClient({
      cookies,
      options: {
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    })

    // Create the user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: data.user,
    })
  } catch (error: any) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create admin user",
      },
      { status: 500 },
    )
  }
}
