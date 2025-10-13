"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmailTemplate {
  id: string
  name: string
  description: string
  subject: string
  body: string
}

const templates: EmailTemplate[] = [
  {
    id: "meeting-request",
    name: "Meeting Request",
    description: "Request a meeting with someone",
    subject: "Meeting Request",
    body: "Hello,\n\nI hope this email finds you well. I would like to schedule a meeting to discuss [topic].\n\nWould you be available for a [duration] meeting sometime [timeframe]? Please let me know what works best for your schedule.\n\nBest regards",
  },
  {
    id: "follow-up",
    name: "Follow-up",
    description: "Follow up on a previous conversation",
    subject: "Following Up",
    body: "Hello,\n\nI wanted to follow up on our previous conversation regarding [topic].\n\nHave you had a chance to review [item]? I'm happy to provide any additional information you might need.\n\nLooking forward to hearing from you.\n\nBest regards",
  },
  {
    id: "thank-you",
    name: "Thank You",
    description: "Send a thank you email",
    subject: "Thank You",
    body: "Hello,\n\nI wanted to take a moment to thank you for [reason].\n\nYour [help/support/time] has been invaluable, and I truly appreciate it.\n\nThank you again.\n\nBest regards",
  },
  {
    id: "introduction",
    name: "Introduction",
    description: "Introduce yourself or your company",
    subject: "Introduction",
    body: "Hello,\n\nMy name is [Your Name], and I'm reaching out to introduce myself and [company/service].\n\nWe specialize in [description], and I believe we could provide value to [their company/situation].\n\nWould you be interested in learning more? I'd be happy to schedule a brief call at your convenience.\n\nBest regards",
  },
]

interface EmailTemplatesProps {
  onUseTemplate: (template: { subject: string; body: string }) => void
}

export function EmailTemplates({ onUseTemplate }: EmailTemplatesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">📄</span>
              {template.name}
            </CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => onUseTemplate({ subject: template.subject, body: template.body })}
            >
              Use Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
