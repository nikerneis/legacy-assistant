"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNotes } from "@/hooks/use-notes"
import { Button } from "@/components/ui/button"
import { Trash2, Save, Bold, Italic, Underline, List, Minus } from "lucide-react"
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [fontSize, setFontSize] = useState("base")
  const [fontFamily, setFontFamily] = useState("font-sans")

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setHasUnsavedChanges(false)
  }, [note])

  const handleSave = () => {
    const sanitized = sanitizeContent(content)
    updateCurrentNote(note.id, title, sanitized)
    setHasUnsavedChanges(false)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setHasUnsavedChanges(true)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setHasUnsavedChanges(true)
  }

  const insertFormatting = (before: string, after = "") => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end)
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const fontSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4 md:p-6 bg-background">
      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-xl md:text-2xl font-bold flex-1 min-w-0 bg-transparent outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors"
          placeholder="Note title"
        />
        {hasUnsavedChanges && <span className="text-xs text-amber-500 font-medium">Unsaved changes</span>}
        <Button onClick={handleSave} variant="default" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button onClick={onDelete} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1 p-3 border border-border rounded-lg bg-muted/30 flex-wrap">
        <div className="flex gap-1 border-r border-border pr-2">
          <Button
            onClick={() => insertFormatting("**", "**")}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => insertFormatting("*", "*")}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => insertFormatting("__", "__")}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1 border-r border-border pr-2">
          <Button
            onClick={() => insertFormatting("# ")}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            title="Heading"
          >
            H1
          </Button>
          <Button
            onClick={() => insertFormatting("## ")}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            title="Subheading"
          >
            H2
          </Button>
          <Button
            onClick={() => insertFormatting("### ")}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            title="Subheading 2"
          >
            H3
          </Button>
        </div>

        <div className="flex gap-1 border-r border-border pr-2">
          <Button
            onClick={() => insertFormatting("- ")}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Bullet list"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => insertFormatting("1. ")}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Numbered list"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1">
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="h-8 px-2 text-xs rounded border border-border bg-background"
            title="Font family"
          >
            <option value="font-sans">Sans</option>
            <option value="font-serif">Serif</option>
            <option value="font-mono">Mono</option>
          </select>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="h-8 px-2 text-xs rounded border border-border bg-background"
            title="Font size"
          >
            <option value="sm">Small</option>
            <option value="base">Normal</option>
            <option value="lg">Large</option>
            <option value="xl">XL</option>
          </select>
        </div>
      </div>

      <textarea
        value={content}
        onChange={handleContentChange}
        className={`flex-1 p-3 md:p-4 border border-border rounded-lg resize-none bg-background outline-none focus:ring-2 focus:ring-primary text-sm md:text-base ${fontFamily} ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]}`}
        placeholder="Start typing... (Code, HTML, PHP, and SQL are automatically filtered)"
      />

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div>Last updated: {new Date(note.updatedAt).toLocaleString()}</div>
        <div>{content.length} characters</div>
      </div>
    </div>
  )
}
