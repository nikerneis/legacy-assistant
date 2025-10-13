"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { FileText, ImageIcon, Video, File, Trash2, Download, Search, Calendar } from "lucide-react"
import { format } from "date-fns"

interface FileRecord {
  id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  is_safe: boolean
  created_at: string
}

interface FileStorageProps {
  userId: string
}

export function FileStorage({ userId }: FileStorageProps) {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/files")
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
      }
    } catch (error) {
      console.error("[v0] Error fetching files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteFile = async (id: string) => {
    try {
      const response = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchFiles()
      }
    } catch (error) {
      console.error("[v0] Error deleting file:", error)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (type.startsWith("video/")) return <Video className="h-5 w-5" />
    if (type === "application/pdf") return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const filteredFiles = files.filter((file) => file.file_name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Files Grid */}
      <ScrollArea className="h-[600px]">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading files...</p>
        ) : filteredFiles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <File className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No files found" : "No files uploaded yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="transition-all hover:border-primary">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {getFileIcon(file.file_type)}
                    </div>
                    {file.is_safe ? (
                      <Badge variant="secondary" className="text-xs">
                        Safe
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Unsafe
                      </Badge>
                    )}
                  </div>

                  <h4 className="mb-1 truncate font-medium" title={file.file_name}>
                    {file.file_name}
                  </h4>

                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(file.created_at), "MMM d")}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                      <a href={file.file_url} download={file.file_name}>
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => deleteFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
