"use client"

import { useState, useEffect } from "react"
import { useNotes } from "@/hooks/use-notes"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { sanitizeContent } from "@/lib/notes-storage"
import type { Note } from "@/lib/notes-storage"

interface NoteEditorProps {
  note: Note
  onDelete: () => void
}

export function NoteEditor({ note, onDelete }: NoteEditorProps) {
  const { updateCurrentNote } = useNotes()
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
  }, [note])

  const handleSave = () => {
    const sanitized = sanitizeContent(content)
    updateCurrentNote(note.id, title, sanitized)
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4 md:p-6">
      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          className="text-xl md:text-2xl font-bold flex-1 min-w-0 bg-transparent outline-none border-b border-transparent hover:border-border focus:border-primary"
          placeholder="Note title"
        />
        <Button onClick={onDelete} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleSave}
        className="flex-1 p-3 md:p-4 border border-border rounded-lg resize-none bg-background outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
        placeholder="Start typing... (Code, HTML, PHP, and SQL are automatically filtered)"
      />

      <div className="text-xs text-muted-foreground">Last updated: {new Date(note.updatedAt).toLocaleString()}</div>
    </div>
  )
}
