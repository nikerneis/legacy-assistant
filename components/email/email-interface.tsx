"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { EmailHistory } from "./email-history"
import { EmailTemplates } from "./email-templates"

interface EmailInterfaceProps {
  userId: string
}

export function EmailInterface({ userId }: EmailInterfaceProps) {
  const [recipient, setRecipient] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleGenerateContent = async () => {
    if (!subject) {
      toast({
        title: "Subject required",
        description: "Please enter a subject to generate email content",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Write a professional email with the subject: "${subject}". Make it clear, concise, and appropriate for business communication.`,
          mode: "assistance",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setBody(data.message)
        toast({
          title: "Content generated",
          description: "AI has generated email content for you",
        })
      }
    } catch (error) {
      console.error("[v0] Error generating email:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate email content",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendEmail = async () => {
    if (!recipient || !subject || !body) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, subject, body }),
      })

      if (response.ok) {
        toast({
          title: "Email sent",
          description: `Email sent successfully to ${recipient}`,
        })
        // Reset form
        setRecipient("")
        setSubject("")
        setBody("")
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      console.error("[v0] Error sending email:", error)
      toast({
        title: "Send failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleUseTemplate = (template: { subject: string; body: string }) => {
    setSubject(template.subject)
    setBody(template.body)
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email</h1>
          <p className="text-muted-foreground">Send emails with AI assistance</p>
        </div>

        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">
              <span className="mr-2">📧</span>
              Compose
            </TabsTrigger>
            <TabsTrigger value="templates">
              <span className="mr-2">✨</span>
              Templates
            </TabsTrigger>
            <TabsTrigger value="history">
              <span className="mr-2">📜</span>
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compose Email</CardTitle>
                <CardDescription>Send a new email with optional AI assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    id="recipient"
                    type="email"
                    placeholder="recipient@example.com"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="body">Message</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !subject}
                    >
                      {isGenerating ? (
                        <>
                          <span className="mr-2 animate-spin">⏳</span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">✨</span>
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="body"
                    placeholder="Email content..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />
                </div>

                <Button onClick={handleSendEmail} disabled={isSending} className="w-full">
                  {isSending ? (
                    <>
                      <span className="mr-2 animate-spin">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📤</span>
                      Send Email
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <EmailTemplates onUseTemplate={handleUseTemplate} />
          </TabsContent>

          <TabsContent value="history">
            <EmailHistory userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
