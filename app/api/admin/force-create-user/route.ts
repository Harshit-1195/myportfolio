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

    // Delete any existing user with this email first
    try {
      const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email)
      if (existingUser.user) {
        await supabaseAdmin.auth.admin.deleteUser(existingUser.user.id)
        console.log("Deleted existing user")
      }
    } catch (deleteErr) {
      console.log("No existing user to delete or delete failed:", deleteErr)
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
      return NextResponse.json({ error: `Auth error: ${authError.message}` }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user - no user data returned" }, { status: 400 })
    }

    // Test the login immediately
    const testClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data: loginTest, error: loginError } = await testClient.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      return NextResponse.json(
        {
          error: `User created but login test failed: ${loginError.message}`,
          user_created: true,
          user_id: authData.user.id,
        },
        { status: 400 },
      )
    }

    // Clean up test session
    await testClient.auth.signOut()

    return NextResponse.json({
      success: true,
      message: "Admin user created and login verified successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        confirmed: authData.user.email_confirmed_at ? true : false,
      },
      login_test_passed: true,
    })
  } catch (error: any) {
    console.error("Force user creation error:", error)
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 })
  }
}
