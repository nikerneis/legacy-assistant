import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { AI_MODES, type AiMode } from "@/lib/ai-modes"

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

    const { message, mode = "assistance" } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const modeConfig = AI_MODES[mode as AiMode] || AI_MODES.assistance
    const systemPrompt = modeConfig.systemPrompt

    if (modeConfig.generateImage) {
      return NextResponse.json({
        message: `I'll generate an image based on your prompt: "${message}"\n\nGenerating image...`,
        generateImage: true,
        imagePrompt: message,
      })
    }

    // Generate AI response
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: message,
      system: systemPrompt,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
