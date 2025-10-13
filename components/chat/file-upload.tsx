"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  selectedFile: File | null
}

export function FileUpload({ onFileSelect, onFileRemove, selectedFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.startsWith("video/")) return "🎬"
    if (type === "application/pdf") return "📄"
    return "📁"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*,video/*,.pdf,.txt,.doc,.docx"
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
          <span className="text-lg">{getFileIcon(selectedFile.type)}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onFileRemove}>
            <span>❌</span>
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
        >
          <span className="text-lg">📎</span>
        </Button>
      )}
    </div>
  )
}
