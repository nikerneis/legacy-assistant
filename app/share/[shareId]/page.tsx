"use client"

import { useEffect, useState } from "react"
import { Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"

export default function SharePage() {
  const params = useParams()
  const shareId = params.shareId as string
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; expiresAt: string; downloads: number } | null>(
    null,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching file info
    setFileInfo({
      name: "document.pdf",
      size: 2500000,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      downloads: 3,
    })
    setLoading(false)
  }, [shareId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!fileInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">File not found or expired</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="rounded-lg border border-border bg-card p-8 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Shared File</h1>
        <div className="mb-6">
          <h2 className="font-medium text-lg mb-2">{fileInfo.name}</h2>
          <p className="text-sm text-muted-foreground">{(fileInfo.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Expires: {new Date(fileInfo.expiresAt).toLocaleDateString()}</span>
        </div>
        <p className="mb-6 text-xs text-muted-foreground">Downloaded {fileInfo.downloads} times</p>
        <Button className="w-full gap-2">
          <Download className="h-4 w-4" />
          Download File
        </Button>
      </div>
    </div>
  )
}
