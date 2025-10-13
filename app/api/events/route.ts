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

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const type = searchParams.get("type")
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    let query = supabase.from("events").select("*").eq("user_id", user.id).order("start_time", { ascending: true })

    if (type) {
      query = query.eq("event_type", type)
    }

    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      query = query.gte("start_time", startOfDay.toISOString()).lte("start_time", endOfDay.toISOString())
    }

    if (start && end) {
      query = query.gte("start_time", start).lte("start_time", end)
    }

    const { data: events, error } = await query

    if (error) throw error

    return NextResponse.json({ events: events || [] })
  } catch (error) {
    console.error("[v0] Events API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const body = await request.json()
    const { title, description, event_type, start_time, end_time, category, priority } = body

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        user_id: user.id,
        title,
        description,
        event_type,
        start_time,
        end_time,
        category,
        priority,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ event })
  } catch (error) {
    console.error("[v0] Events API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
