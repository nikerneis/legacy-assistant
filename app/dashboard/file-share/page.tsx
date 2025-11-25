"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, LinkIcon, Trash2 } from "lucide-react"
import { ShareModal } from "@/components/file-share/share-modal"

export default function FileSharePage() {
  const [files, setFiles] = useState<
    Array<{ id: string; name: string; size: number; link: string; expiresAt: string; downloads: number }>
  >([])
  const [showModal, setShowModal] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles) return

    Array.from(uploadedFiles).forEach((file) => {
      const shareId = Math.random().toString(36).substr(2, 9)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

      setFiles((prev) => [
        ...prev,
        {
          id: shareId,
          name: file.name,
          size: file.size,
          link: `${window.location.origin}/share/${shareId}`,
          expiresAt,
          downloads: 0,
        },
      ])
    })
  }

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">File Sharing</h1>
          <p className="mt-2 text-muted-foreground">
            Share files with temporary links. Free tier: 7 days, max 5GB. Premium: unlimited.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
      </div>

      <div className="grid gap-4">
        {files.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No files uploaded yet. Upload a file to start sharing.</p>
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex-1">
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Downloads: {file.downloads}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expires: {new Date(file.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(file.link)} className="gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteFile(file.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <ShareModal open={showModal} onOpenChange={setShowModal} onFileUpload={handleFileUpload} />
    </div>
  )
}
