"use client"

import { useState, useEffect } from "react"
import {
  loadNotes,
  loadFolders,
  addNote,
  addFolder,
  updateNote,
  updateFolder,
  deleteNote,
  deleteFolder,
  moveNoteToFolder as moveFn,
} from "@/lib/notes-storage"
import type { Note, Folder } from "@/lib/notes-storage"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  useEffect(() => {
    setNotes(loadNotes())
    setFolders(loadFolders())
  }, [])

  const createNote = (title: string, folderId: string | null = null) => {
    const newNote = addNote(title, folderId)
    setNotes(loadNotes())
    setSelectedNoteId(newNote.id)
    return newNote
  }

  const createFolder = (name: string, color: string, parentId: string | null = null) => {
    addFolder(name, color, parentId)
    setFolders(loadFolders())
  }

  const updateCurrentNote = (id: string, title: string, content: string) => {
    updateNote(id, title, content)
    setNotes(loadNotes())
  }

  const updateCurrentFolder = (id: string, name: string, color: string) => {
    updateFolder(id, name, color)
    setFolders(loadFolders())
  }

  const removeNote = (id: string) => {
    deleteNote(id)
    setNotes(loadNotes())
    if (selectedNoteId === id) {
      setSelectedNoteId(null)
    }
  }

  const removeFolder = (id: string) => {
    deleteFolder(id)
    setFolders(loadFolders())
    setNotes(loadNotes())
  }

  const moveNoteToFolder = (noteId: string, newFolderId: string | null) => {
    moveFn(noteId, newFolderId)
    setNotes(loadNotes())
  }

  return {
    notes,
    folders,
    selectedNoteId,
    setSelectedNoteId,
    createNote,
    createFolder,
    updateCurrentNote,
    updateCurrentFolder,
    removeNote,
    removeFolder,
    moveNoteToFolder,
  }
}
