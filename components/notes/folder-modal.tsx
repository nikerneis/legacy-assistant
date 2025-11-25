"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FOLDER_COLORS } from "@/lib/notes-storage"
import { X } from "lucide-react"

interface FolderModalProps {
  onClose: () => void
  onCreateFolder: (name: string, color: string) => void
}

export function FolderModal({ onClose, onCreateFolder }: FolderModalProps) {
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0].value)

  const handleCreate = () => {
    if (name.trim()) {
      onCreateFolder(name, selectedColor)
      setName("")
      setSelectedColor(FOLDER_COLORS[0].value)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 w-96 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Folder</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter folder name"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded ${selectedColor === color.value ? "ring-2 ring-offset-2" : ""}`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
