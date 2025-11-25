"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { CalendarView } from "./calendar-view"
import { TaskList } from "./task-list"
import { TimelineView } from "./timeline-view"
import { EventDialog } from "./event-dialog"
import { TierGate } from "@/components/tier-gate"
import { useUserTier, getPlanningFeatures } from "@/hooks/use-user-tier"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PlanningInterfaceProps {
  userId: string
}

export function PlanningInterface({ userId }: PlanningInterfaceProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const userTier = useUserTier()
  const features = getPlanningFeatures(userTier.tier)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Planning</h1>
          <p className="text-sm text-muted-foreground">{features.description}</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2" disabled={!features.editEvents}>
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6">
        {userTier.tier === "free" && !userTier.isLoggedIn ? (
          // Free tier - limited view
          <Tabs defaultValue="calendar" className="h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="tasks">Tasks (Max 5)</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="h-[calc(100%-3rem)]">
              <CalendarView userId={userId} onDateSelect={setSelectedDate} isReadOnly={true} maxTasks={5} />
            </TabsContent>

            <TabsContent value="tasks" className="h-[calc(100%-3rem)]">
              <TaskList userId={userId} isReadOnly={true} maxTasks={5} />
            </TabsContent>
          </Tabs>
        ) : userTier.tier === "logged-in" ? (
          // Logged-in tier - full features with trial access
          <Tabs defaultValue="calendar" className="h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="h-[calc(100%-3rem)]">
              <CalendarView userId={userId} onDateSelect={setSelectedDate} maxTasks={50} />
            </TabsContent>

            <TabsContent value="tasks" className="h-[calc(100%-3rem)]">
              <TaskList userId={userId} maxTasks={50} />
            </TabsContent>

            <TabsContent value="timeline" className="h-[calc(100%-3rem)]">
              <TimelineView userId={userId} />
            </TabsContent>
          </Tabs>
        ) : (
          // Premium tier - unlimited
          <Tabs defaultValue="calendar" className="h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="h-[calc(100%-3rem)]">
              <CalendarView userId={userId} onDateSelect={setSelectedDate} />
            </TabsContent>

            <TabsContent value="tasks" className="h-[calc(100%-3rem)]">
              <TaskList userId={userId} />
            </TabsContent>

            <TabsContent value="timeline" className="h-[calc(100%-3rem)]">
              <TimelineView userId={userId} />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Event Dialog */}
      {features.editEvents && (
        <EventDialog userId={userId} open={isDialogOpen} onOpenChange={setIsDialogOpen} selectedDate={selectedDate} />
      )}
    </div>
  )
}
