import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Create function to get table columns
    await supabase.rpc("create_helper_functions")

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error creating helper functions:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to create helper functions" })
}
