"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { MessageSquare, Trash2, Search, Calendar } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Conversation {
  id: string
  title: string
  ai_mode: string
  created_at: string
  updated_at: string
  message_count?: number
}

interface ConversationHistoryProps {
  userId: string
}

export function ConversationHistory({ userId }: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error("[v0] Error fetching conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchConversations()
      }
    } catch (error) {
      console.error("[v0] Error deleting conversation:", error)
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Conversations List */}
      <ScrollArea className="h-[600px]">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        ) : filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conversation) => (
              <Card key={conversation.id} className="transition-all hover:border-primary">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{conversation.title}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(conversation.created_at), "MMM d, yyyy")}
                        </span>
                        {conversation.message_count && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {conversation.message_count} messages
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{conversation.ai_mode}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href={`/dashboard?conversation=${conversation.id}`}>View</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteConversation(conversation.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
