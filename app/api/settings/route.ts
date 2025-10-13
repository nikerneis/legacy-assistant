import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: settings, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return NextResponse.json({ settings: settings || null })
  } catch (error) {
    console.error("[v0] Settings API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Check if settings exist
    const { data: existingSettings } = await supabase.from("user_settings").select("id").eq("user_id", user.id).single()

    let result
    if (existingSettings) {
      // Update existing settings
      result = await supabase.from("user_settings").update(body).eq("user_id", user.id).select().single()
    } else {
      // Create new settings
      result = await supabase
        .from("user_settings")
        .insert({ user_id: user.id, ...body })
        .select()
        .single()
    }

    if (result.error) throw result.error

    return NextResponse.json({ settings: result.data })
  } catch (error) {
    console.error("[v0] Settings API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
