"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, ChevronDown, FolderIcon, FileText } from "lucide-react"
import type { Note, Folder } from "@/lib/notes-storage"
import { cn } from "@/lib/utils"
import { useNotes } from "@/hooks/use-notes"

interface FolderTreeProps {
  folders: Folder[]
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
  onCreateFolder: (parentId: string) => void
}

export function FolderTree({ folders, notes, selectedNoteId, onSelectNote, onCreateFolder }: FolderTreeProps) {
  const { moveNoteToFolder } = useNotes()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [draggedNote, setDraggedNote] = useState<string | null>(null)

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const rootNotes = notes.filter((n) => !n.folderId).sort((a, b) => a.order - b.order)
  const rootFolders = folders.filter((f) => !f.parentId).sort((a, b) => a.order - b.order)

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    setDraggedNote(noteId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDropOnFolder = (e: React.DragEvent, folderId: string) => {
    e.preventDefault()
    if (draggedNote) {
      moveNoteToFolder(draggedNote, folderId)
      setDraggedNote(null)
    }
  }

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedNote) {
      moveNoteToFolder(draggedNote, null)
      setDraggedNote(null)
    }
  }

  const renderFolders = (parentId: string | null, level = 0) => {
    const childFolders = parentId ? folders.filter((f) => f.parentId === parentId) : rootFolders
    const childNotes = notes.filter((n) => n.folderId === parentId).sort((a, b) => a.order - b.order)

    return (
      <>
        {childFolders.map((folder) => (
          <div key={folder.id}>
            <div
              className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded cursor-pointer transition-colors"
              style={{ paddingLeft: `${level * 16 + 8}px` }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnFolder(e, folder.id)}
            >
              <button onClick={() => toggleFolder(folder.id)} className="p-0 h-4 w-4">
                {expandedFolders.has(folder.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <FolderIcon className="h-4 w-4" style={{ color: folder.color }} />
              <span className="text-sm flex-1 truncate">{folder.name}</span>
            </div>
            {expandedFolders.has(folder.id) && (
              <>
                {renderFolders(folder.id, level + 1)}
                {childNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, note.id)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 hover:bg-muted rounded cursor-move text-sm transition-colors",
                      selectedNoteId === note.id && "bg-muted",
                      draggedNote === note.id && "opacity-50",
                    )}
                    style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{note.title}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
        {!parentId && (
          <div onDragOver={handleDragOver} onDrop={handleDropOnRoot} className="space-y-1">
            {rootNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                draggable
                onDragStart={(e) => handleDragStart(e, note.id)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 hover:bg-muted rounded cursor-move text-sm transition-colors",
                  selectedNoteId === note.id && "bg-muted",
                  draggedNote === note.id && "opacity-50",
                )}
              >
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{note.title}</span>
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  return <div className="space-y-1 overflow-y-auto">{renderFolders(null)}</div>
}
