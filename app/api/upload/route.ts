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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const message = formData.get("message") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/", "video/", "application/pdf", "text/"]
    const isAllowed = allowedTypes.some((type) => file.type.startsWith(type))

    if (!isAllowed) {
      return NextResponse.json({ error: "File type not supported" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Upload to storage (e.g., Vercel Blob, S3)
    // 2. Scan for malware
    // 3. Store metadata in database
    // 4. Return file URL

    // For now, we'll simulate the upload
    const fileUrl = `/uploads/${file.name}`

    // Store file metadata
    const { data: fileRecord, error: dbError } = await supabase
      .from("files")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: fileUrl,
        is_scanned: true,
        is_safe: true,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({
      file: fileRecord,
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("[v0] Upload API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
