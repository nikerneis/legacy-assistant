"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Workflow, Save, X } from "lucide-react"
import Link from "next/link"

const TRIGGERS = [
  { id: "schedule", label: "Schedule", description: "Run at a specific time" },
  { id: "event", label: "Calendar Event", description: "Trigger when event occurs" },
  { id: "email", label: "Email Received", description: "Trigger on incoming email" },
  { id: "message", label: "AI Message", description: "Trigger on AI interaction" },
  { id: "form", label: "Form Submit", description: "Trigger on form submission" },
]

const ACTIONS = [
  { id: "send-email", label: "Send Email", description: "Send an email" },
  { id: "notify", label: "Send Notification", description: "Send notification" },
  { id: "create-event", label: "Create Event", description: "Create calendar event" },
  { id: "run-workflow", label: "Run Workflow", description: "Execute automation" },
  { id: "webhook", label: "Call Webhook", description: "Make HTTP request" },
  { id: "transform", label: "Transform Data", description: "Transform and map data" },
]

export default function NewAutomationPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [trigger, setTrigger] = useState<string | null>(null)
  const [action, setAction] = useState<string | null>(null)
  const [triggerConfig, setTriggerConfig] = useState("")
  const [actionConfig, setActionConfig] = useState("")

  const handleSave = async () => {
    if (!name || !trigger || !action) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          trigger,
          triggerConfig,
          action,
          actionConfig,
          enabled: true,
        }),
      })

      if (response.ok) {
        window.location.href = "/dashboard/automations"
      }
    } catch (error) {
      console.error("[v0] Error creating automation:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col overflow-hidden">
        <div className="border-b border-border bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Workflow className="h-6 w-6" />
              <div>
                <h1 className="text-2xl font-bold">Create Automation</h1>
                <p className="text-sm text-muted-foreground">Build automated workflows like N8N</p>
              </div>
            </div>
            <Link href="/dashboard/automations">
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Automation Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Daily Email Summary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What does this automation do?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="trigger" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="trigger">Trigger *</TabsTrigger>
                <TabsTrigger value="action">Action *</TabsTrigger>
              </TabsList>

              <TabsContent value="trigger">
                <Card>
                  <CardHeader>
                    <CardTitle>When should this automation run?</CardTitle>
                    <CardDescription>Select the trigger event</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      {TRIGGERS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTrigger(t.id)}
                          className={`rounded-lg border-2 p-4 text-left transition-colors ${
                            trigger === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <h3 className="font-semibold">{t.label}</h3>
                          <p className="text-sm text-muted-foreground">{t.description}</p>
                        </button>
                      ))}
                    </div>

                    {trigger && (
                      <div className="space-y-2 border-t pt-4">
                        <Label htmlFor="trigger-config">Configuration</Label>
                        <Input
                          id="trigger-config"
                          placeholder="Configure trigger (e.g., time, conditions)"
                          value={triggerConfig}
                          onChange={(e) => setTriggerConfig(e.target.value)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="action">
                <Card>
                  <CardHeader>
                    <CardTitle>What should happen?</CardTitle>
                    <CardDescription>Select the action to perform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      {ACTIONS.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setAction(a.id)}
                          className={`rounded-lg border-2 p-4 text-left transition-colors ${
                            action === a.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <h3 className="font-semibold">{a.label}</h3>
                          <p className="text-sm text-muted-foreground">{a.description}</p>
                        </button>
                      ))}
                    </div>

                    {action && (
                      <div className="space-y-2 border-t pt-4">
                        <Label htmlFor="action-config">Configuration</Label>
                        <Input
                          id="action-config"
                          placeholder="Configure action (e.g., email recipient, notification text)"
                          value={actionConfig}
                          onChange={(e) => setActionConfig(e.target.value)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Automation
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/dashboard/automations">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
