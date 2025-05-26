import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Use service role client for admin operations
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // First check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email)

    if (existingUser.user) {
      // User exists, try to update password
      const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.user.id,
        {
          password,
          email_confirm: true,
        },
      )

      if (updateError) {
        return NextResponse.json({ error: `Failed to update existing user: ${updateError.message}` }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: "Existing user password updated successfully",
        user: {
          id: updateData.user.id,
          email: updateData.user.email,
        },
      })
    }

    // Create new user with admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: "admin",
      },
    })

    if (authError) {
      console.error("Auth user creation error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 400 })
    }

    // Insert user into users table (ignore errors if table doesn't exist or user already exists)
    try {
      const { error: dbError } = await supabaseAdmin.from("users").upsert(
        [
          {
            id: authData.user.id,
            email: authData.user.email,
            role: "admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        {
          onConflict: "id",
        },
      )

      if (dbError) {
        console.warn("Database upsert warning (user still created in auth):", dbError)
      }
    } catch (dbErr) {
      console.warn("Database operation failed (user still created in auth):", dbErr)
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    })
  } catch (error: any) {
    console.error("Emergency user creation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
