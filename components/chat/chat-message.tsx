"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSpeech } from "@/hooks/use-speech"
import { Volume2, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  imagePrompt?: string
}

export function ChatMessage({ message }: { message: Message }) {
  const { speak, isSpeaking, stop } = useSpeech()
  const isUser = message.role === "user"

  const handleSpeak = () => {
    if (isSpeaking) {
      stop()
    } else {
      speak(message.content)
    }
  }

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <Avatar className={cn("h-8 w-8", isUser ? "bg-primary" : "bg-primary/10")}>
        <AvatarFallback>{isUser ? <User className="h-4 w-4" /> : <span className="text-sm">✨</span>}</AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
          )}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          {message.imagePrompt && (
            <div className="mt-3">
              <img
                src={`/.jpg?height=400&width=400&query=${encodeURIComponent(message.imagePrompt)}`}
                alt={message.imagePrompt}
                className="rounded-lg border-2 border-border"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {!isUser && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSpeak}>
              <Volume2 className={cn("h-4 w-4", isSpeaking && "text-primary")} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
