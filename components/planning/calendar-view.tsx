"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { Clock } from "lucide-react"
import type { DayContentProps } from "react-day-picker"

interface Event {
  id: string
  title: string
  description: string | null
  event_type: string
  start_time: string
  end_time: string | null
  category: string | null
  priority: string
  status: string
}

interface CalendarViewProps {
  userId: string
  onDateSelect?: (date: Date | undefined) => void
}

export function CalendarView({ userId, onDateSelect }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [monthEvents, setMonthEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
    fetchMonthEvents()
  }, [date])

  const fetchEvents = async () => {
    if (!date) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/events?date=${date.toISOString()}`)
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

  const fetchMonthEvents = async () => {
    if (!date) return

    try {
      const start = startOfMonth(date)
      const end = endOfMonth(date)
      const response = await fetch(`/api/events?start=${start.toISOString()}&end=${end.toISOString()}`)
      if (response.ok) {
        const data = await response.json()
        setMonthEvents(data.events)
      }
    } catch (error) {
      console.error("[v0] Error fetching month events:", error)
    }
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    onDateSelect?.(newDate)
  }

  const dayEvents = events.filter((event) => {
    if (!date) return false
    const eventDate = new Date(event.start_time)
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    )
  })

  const renderDayContent = (props: DayContentProps) => {
    const dayEvents = monthEvents.filter((event) => {
      const eventDate = new Date(event.start_time)
      return (
        eventDate.getDate() === props.date.getDate() &&
        eventDate.getMonth() === props.date.getMonth() &&
        eventDate.getFullYear() === props.date.getFullYear()
      )
    })

    const hasEvents = dayEvents.some((e) => e.event_type === "event")
    const hasTasks = dayEvents.some((e) => e.event_type === "task")

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{props.date.getDate()}</span>
        {(hasEvents || hasTasks) && (
          <div className="absolute bottom-1 right-1 flex gap-0.5">
            {hasEvents && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Has events" />}
            {hasTasks && <div className="w-1.5 h-1.5 rounded-full bg-green-500" title="Has tasks" />}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendar - Now full width and larger */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-lg border-2 shadow-sm scale-125"
            components={{
              DayContent: renderDayContent,
            }}
          />
        </CardContent>
      </Card>

      {/* Events for Selected Day - Now below calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading events...</p>
            ) : dayEvents.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No events for this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border-2 border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent/50"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <Badge
                        variant={event.priority === "high" || event.priority === "urgent" ? "destructive" : "secondary"}
                        className="ml-2"
                      >
                        {event.priority}
                      </Badge>
                    </div>
                    {event.description && <p className="mb-3 text-sm text-muted-foreground">{event.description}</p>}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {format(new Date(event.start_time), "h:mm a")}
                      </div>
                      {event.category && <Badge variant="outline">{event.category}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
