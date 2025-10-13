"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { Calendar } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string | null
  event_type: string
  start_time: string
  end_time: string | null
  priority: string
  status: string
}

interface TimelineViewProps {
  userId: string
}

export function TimelineView({ userId }: TimelineViewProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWeekEvents()
  }, [])

  const fetchWeekEvents = async () => {
    setIsLoading(true)
    try {
      const start = startOfWeek(new Date())
      const end = endOfWeek(new Date())
      const response = await fetch(`/api/events?start=${start.toISOString()}&end=${end.toISOString()}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      }
    } catch (error) {
      console.error("[v0] Error fetching events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date()),
  })

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time)
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      )
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Weekly Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading timeline...</p>
          ) : (
            <div className="space-y-6">
              {weekDays.map((day) => {
                const dayEvents = getEventsForDay(day)
                const isToday = day.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={day.toISOString()}
                    className={`rounded-lg border p-4 ${isToday ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{format(day, "EEEE, MMMM d")}</h3>
                      {isToday && <Badge variant="default">Today</Badge>}
                    </div>

                    {dayEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No events</p>
                    ) : (
                      <div className="space-y-2">
                        {dayEvents.map((event) => (
                          <div key={event.id} className="flex items-start gap-3 rounded-md bg-background p-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {format(new Date(event.start_time), "h:mm a")}
                                </span>
                                <span className="text-sm">-</span>
                                <span className="text-sm font-medium">{event.title}</span>
                              </div>
                              {event.description && (
                                <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
                              )}
                            </div>
                            <Badge
                              variant={
                                event.priority === "high" || event.priority === "urgent" ? "destructive" : "secondary"
                              }
                              className="text-xs"
                            >
                              {event.event_type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
