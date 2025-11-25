import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file size (5GB max for free)
    const MAX_SIZE = 5 * 1024 * 1024 * 1024 // 5GB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 5GB for free tier" }, { status: 400 })
    }

    const shareId = Math.random().toString(36).substr(2, 9)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    return NextResponse.json({ shareId, expiresAt, link: `/share/${shareId}` })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
