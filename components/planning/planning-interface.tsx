"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CalendarView } from "./calendar-view"
import { TaskList } from "./task-list"
import { TimelineView } from "./timeline-view"
import { EventDialog } from "./event-dialog"

interface PlanningInterfaceProps {
  userId: string
}

export function PlanningInterface({ userId }: PlanningInterfaceProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Planning</h1>
          <p className="text-sm text-muted-foreground">Manage your tasks, events, and schedule</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6">
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
      </div>

      {/* Event Dialog */}
      <EventDialog userId={userId} open={isDialogOpen} onOpenChange={setIsDialogOpen} selectedDate={selectedDate} />
    </div>
  )
}
