"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./chat-message"
import { ModeSelector } from "./mode-selector"
import { FileUpload } from "./file-upload"
import { ImageGenerator } from "./image-generator"
import { useChat } from "@/hooks/use-chat"
import { useVoice } from "@/hooks/use-voice"
import type { AiMode } from "@/lib/ai-modes"
import { ImageIcon, Mic, Send, Loader2, MessageSquare } from "lucide-react"

interface ChatInterfaceProps {
  isTrialMode?: boolean
  restrictedModes?: AiMode[]
}

export function ChatInterface({ isTrialMode = false, restrictedModes = [] }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [currentMode, setCurrentMode] = useState<AiMode>("assistance")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, isLoading, sendMessage } = useChat(currentMode)
  const { isListening, isSupported, startListening, stopListening, transcript } = useVoice()

  // Load saved mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("selectedAiMode") as AiMode
    if (savedMode) {
      setCurrentMode(savedMode)
    }
  }, [])

  // Save mode to localStorage when changed
  useEffect(() => {
    localStorage.setItem("selectedAiMode", currentMode)
  }, [currentMode])

  // Update input with voice transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !selectedFile) || isLoading) return

    const message = input.trim()
    setInput("")

    if (selectedFile) {
      await uploadAndAnalyzeFile(selectedFile, message)
      setSelectedFile(null)
    } else {
      await sendMessage(message)
    }
  }

  const uploadAndAnalyzeFile = async (file: File, message: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      if (message) formData.append("message", message)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        await sendMessage(message || `Analyze this file: ${file.name}`)
      }
    } catch (error) {
      console.error("[v0] Error uploading file:", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleVoice = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header with Mode Selector */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">AI Mode</h2>
          {isTrialMode && <p className="text-xs text-amber-600">Trial: AI Assistant mode only</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsImageDialogOpen(true)}
            title="Generate Image"
            disabled={isTrialMode}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <ModeSelector value={currentMode} onChange={setCurrentMode} disabledModes={restrictedModes} />
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold">Start a conversation</h2>
              <p className="text-muted-foreground">Ask me anything, upload files, or generate images</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <FileUpload
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onFileRemove={() => setSelectedFile(null)}
            />
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Shift+Enter for new line)"
                className="min-h-[60px] resize-none pr-12"
                disabled={isLoading}
              />
              {isSupported && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-2 right-2"
                  onClick={toggleVoice}
                >
                  <Mic className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`} />
                </Button>
              )}
            </div>
            <Button
              type="submit"
              size="icon"
              className="h-[60px] w-[60px]"
              disabled={(!input.trim() && !selectedFile) || isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          {isListening && <p className="mt-2 text-sm text-muted-foreground">Listening... Speak now</p>}
        </form>
      </div>

      {/* Image Generator Dialog */}
      <ImageGenerator open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen} />
    </div>
  )
}
