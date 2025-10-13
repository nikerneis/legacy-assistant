import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipient, subject, body } = await request.json()

    if (!recipient || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store email in database
    const { error: insertError } = await supabase.from("emails").insert({
      user_id: user.id,
      recipient,
      subject,
      body,
      sent_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("[v0] Error storing email:", insertError)
      return NextResponse.json({ error: "Failed to store email" }, { status: 500 })
    }

    // In a real application, you would integrate with an email service here
    // For now, we just store it in the database
    console.log("[v0] Email sent:", { recipient, subject })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Email send error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
