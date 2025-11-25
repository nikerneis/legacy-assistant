export interface Note {
  id: string
  title: string
  content: string
  folderId: string | null
  createdAt: Date
  updatedAt: Date
  order: number // Added order field for sorting
}

export interface Folder {
  id: string
  name: string
  color: string
  parentId: string | null
  createdAt: Date
  order: number // Added order field for sorting
}

export const FOLDER_COLORS = [
  { name: "blue", value: "#3B82F6" },
  { name: "red", value: "#EF4444" },
  { name: "green", value: "#10B981" },
  { name: "yellow", value: "#F59E0B" },
  { name: "purple", value: "#8B5CF6" },
  { name: "pink", value: "#EC4899" },
  { name: "indigo", value: "#6366F1" },
  { name: "cyan", value: "#06B6D4" },
]

const NOTES_STORAGE_KEY = "legacy_notes"
const FOLDERS_STORAGE_KEY = "legacy_folders"

export function loadNotes(): Note[] {
  const stored = localStorage.getItem(NOTES_STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function loadFolders(): Folder[] {
  const stored = localStorage.getItem(FOLDERS_STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
}

export function saveFolders(folders: Folder[]): void {
  localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
}

export function addNote(title: string, folderId: string | null = null): Note {
  const notes = loadNotes()
  const newNote: Note = {
    id: Date.now().toString(),
    title,
    content: "",
    folderId,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: notes.length, // Initialize order field
  }
  notes.push(newNote)
  saveNotes(notes)
  return newNote
}

export function addFolder(name: string, color: string, parentId: string | null = null): Folder {
  const folders = loadFolders()
  const newFolder: Folder = {
    id: Date.now().toString(),
    name,
    color,
    parentId,
    createdAt: new Date(),
    order: folders.length, // Initialize order field
  }
  folders.push(newFolder)
  saveFolders(folders)
  return newFolder
}

export function updateNote(id: string, title: string, content: string): void {
  const notes = loadNotes()
  const note = notes.find((n) => n.id === id)
  if (note) {
    note.title = title
    note.content = content
    note.updatedAt = new Date()
    saveNotes(notes)
  }
}

export function updateFolder(id: string, name: string, color: string): void {
  const folders = loadFolders()
  const folder = folders.find((f) => f.id === id)
  if (folder) {
    folder.name = name
    folder.color = color
    saveFolders(folders)
  }
}

export function deleteNote(id: string): void {
  const notes = loadNotes()
  saveNotes(notes.filter((n) => n.id !== id))
}

export function deleteFolder(id: string): void {
  const folders = loadFolders()
  const notes = loadNotes()

  // Delete folder and move its notes to parent
  const parentId = folders.find((f) => f.id === id)?.parentId || null
  saveFolders(folders.filter((f) => f.id !== id))

  notes.forEach((note) => {
    if (note.folderId === id) {
      note.folderId = parentId
    }
  })
  saveNotes(notes)
}

export function moveNoteToFolder(noteId: string, newFolderId: string | null): void {
  const notes = loadNotes()
  const note = notes.find((n) => n.id === noteId)
  if (note) {
    note.folderId = newFolderId
    note.updatedAt = new Date()
    saveNotes(notes)
  }
}

export function reorderNotes(noteIds: string[]): void {
  const notes = loadNotes()
  const noteMap = new Map(notes.map((n) => [n.id, n]))
  noteIds.forEach((id, index) => {
    const note = noteMap.get(id)
    if (note) {
      note.order = index
    }
  })
  saveNotes(Array.from(noteMap.values()))
}

export function reorderFolders(folderIds: string[]): void {
  const folders = loadFolders()
  const folderMap = new Map(folders.map((f) => [f.id, f]))
  folderIds.forEach((id, index) => {
    const folder = folderMap.get(id)
    if (folder) {
      folder.order = index
    }
  })
  saveFolders(Array.from(folderMap.values()))
}

export function sanitizeContent(content: string): string {
  // Remove HTML/PHP/SQL tags and scripts
  const forbidden = /<[^>]*>|<script|<iframe|php|sql|SELECT|INSERT|UPDATE|DELETE|DROP/gi
  return content.replace(forbidden, "")
}
