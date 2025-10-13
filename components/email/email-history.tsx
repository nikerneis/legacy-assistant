"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Email {
  id: string
  recipient: string
  subject: string
  body: string
  sent_at: string
}

interface EmailHistoryProps {
  userId: string
}

export function EmailHistory({ userId }: EmailHistoryProps) {
  const [emails, setEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/email/history")
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails)
      }
    } catch (error) {
      console.error("[v0] Error fetching email history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <span className="text-2xl animate-spin">⏳</span>
        </CardContent>
      </Card>
    )
  }

  if (emails.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <span className="text-5xl mb-4">📧</span>
          <p className="text-muted-foreground">No emails sent yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email History</CardTitle>
        <CardDescription>Your sent emails</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {emails.map((email) => (
              <Card key={email.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{email.subject}</CardTitle>
                      <CardDescription>To: {email.recipient}</CardDescription>
                    </div>
                    <Badge variant="outline">{formatDate(email.sent_at)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">{email.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
