"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function ShareModal({ open, onOpenChange, onFileUpload }: ShareModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Upload File</h2>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
          <input type="file" onChange={onFileUpload} multiple className="hidden" id="file-input" />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">Max 5GB (Premium: unlimited)</p>
            </div>
          </label>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
