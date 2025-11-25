"use client"

import { useState } from "react"
import { useNotes } from "@/hooks/use-notes"
import { FolderTree } from "./folder-tree"
import { NoteEditor } from "./note-editor"
import { FolderModal } from "./folder-modal"
import { Button } from "@/components/ui/button"
import { Plus, FolderPlus } from "lucide-react"

export function NotesInterface() {
  const { notes, folders, selectedNoteId, setSelectedNoteId, createNote, createFolder, removeNote } = useNotes()
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [parentFolderId, setParentFolderId] = useState<string | null>(null)

  const selectedNote = notes.find((n) => n.id === selectedNoteId)

  const handleCreateFolder = (name: string, color: string) => {
    createFolder(name, color, parentFolderId)
    setShowFolderModal(false)
  }

  return (
    <div className="flex flex-col md:flex-row h-full gap-4 md:gap-6">
      {/* Sidebar with folders and notes */}
      <div className="w-full md:w-64 border-r border-border p-4 overflow-y-auto">
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button onClick={() => createNote("New Note")} size="sm" variant="outline" className="flex-1 gap-2 min-w-0">
            <Plus className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Note</span>
          </Button>
          <Button
            onClick={() => {
              setParentFolderId(null)
              setShowFolderModal(true)
            }}
            size="sm"
            variant="outline"
            className="flex-1 gap-2 min-w-0"
          >
            <FolderPlus className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Folder</span>
          </Button>
        </div>

        <FolderTree
          folders={folders}
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onCreateFolder={(id) => {
            setParentFolderId(id)
            setShowFolderModal(true)
          }}
        />
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onDelete={() => {
              removeNote(selectedNote.id)
              setSelectedNoteId(null)
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground p-4">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No note selected</p>
              <p className="text-sm">Create a new note to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Folder Modal */}
      {showFolderModal && <FolderModal onClose={() => setShowFolderModal(false)} onCreateFolder={handleCreateFolder} />}
    </div>
  )
}
