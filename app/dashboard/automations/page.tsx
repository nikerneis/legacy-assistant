"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Workflow, Plus, Trash2, Edit2, Play } from "lucide-react"
import Link from "next/link"

interface Automation {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  enabled: boolean
  createdAt: Date
}

const SAMPLE_AUTOMATIONS: Automation[] = [
  {
    id: "1",
    name: "Email Summary",
    description: "Send daily email summary of tasks",
    trigger: "Every day at 9:00 AM",
    action: "Send email with daily summary",
    enabled: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Meeting Reminder",
    description: "Remind before meetings",
    trigger: "Meeting in 15 minutes",
    action: "Send notification with meeting details",
    enabled: true,
    createdAt: new Date(),
  },
]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(SAMPLE_AUTOMATIONS)

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter((a) => a.id !== id))
  }

  const toggleAutomation = (id: string) => {
    setAutomations(automations.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)))
  }

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Workflow className="h-6 w-6" />
              <div>
                <h1 className="text-2xl font-bold">Automations</h1>
                <p className="text-sm text-muted-foreground">Create and manage your automated workflows</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/dashboard/automations/new">
                <Plus className="mr-2 h-4 w-4" />
                New Automation
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl space-y-4">
            {automations.length === 0 ? (
              <Card className="flex flex-col items-center justify-center py-12">
                <Workflow className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No automations yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">Create your first automation to get started</p>
                <Button asChild>
                  <Link href="/dashboard/automations/new">Create Automation</Link>
                </Button>
              </Card>
            ) : (
              automations.map((automation) => (
                <Card key={automation.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{automation.name}</h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            automation.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {automation.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{automation.description}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Trigger: {automation.trigger}</p>
                        <p>Action: {automation.action}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleAutomation(automation.id)}>
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/automations/${automation.id}`}>
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteAutomation(automation.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
