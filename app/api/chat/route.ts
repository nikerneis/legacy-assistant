import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { AI_MODES, type AiMode } from "@/lib/ai-modes"
import { getProviderForMode } from "@/lib/ai-providers"

export async function POST(request: NextRequest) {
  try {
    const { message, mode = "assistance" } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const modeConfig = AI_MODES[mode as AiMode] || AI_MODES.assistance
    const systemPrompt = modeConfig.systemPrompt

    const provider = getProviderForMode(mode as AiMode)

    if (modeConfig.generateImage) {
      return NextResponse.json({
        message: `I'll generate an image based on your prompt: "${message}"\n\nGenerating image...`,
        generateImage: true,
        imagePrompt: message,
      })
    }

    const { text } = await generateText({
      model: provider,
      prompt: message,
      system: systemPrompt,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
