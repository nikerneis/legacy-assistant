"use client"

import { useState, useCallback } from "react"
import type { AiMode } from "@/lib/ai-modes"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  imagePrompt?: string
}

export function useChat(mode: AiMode = "assistance") {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, mode }),
        })

        if (!response.ok) throw new Error("Failed to send message")

        const data = await response.json()

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
          imagePrompt: data.generateImage ? data.imagePrompt : undefined,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error("[v0] Error sending message:", error)
        // Add error message
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [mode],
  )

  return {
    messages,
    isLoading,
    sendMessage,
  }
}
