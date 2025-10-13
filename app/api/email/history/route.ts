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

    const { data: emails, error } = await supabase
      .from("emails")
      .select("*")
      .eq("user_id", user.id)
      .order("sent_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching emails:", error)
      return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
    }

    return NextResponse.json({ emails: emails || [] })
  } catch (error) {
    console.error("[v0] Email history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
