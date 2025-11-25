import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { shareId: string } }) {
  try {
    const { shareId } = params

    // Simulate fetching file info from storage
    // In production, this would query your database/storage service
    return NextResponse.json({
      shareId,
      name: "document.pdf",
      size: 2500000,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      downloads: 3,
    })
  } catch (error) {
    console.error("[v0] Share API error:", error)
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
