"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  label: string
  id: string
  required?: boolean
}

export function DateTimePicker({ value, onChange, label, id, required }: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined)
  const [time, setTime] = useState(value ? format(new Date(value), "HH:mm") : "09:00")

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      const [hours, minutes] = time.split(":")
      selectedDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      onChange(selectedDate.toISOString())
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (date) {
      const [hours, minutes] = newTime.split(":")
      const newDate = new Date(date)
      newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      onChange(newDate.toISOString())
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("flex-1 justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
          </PopoverContent>
        </Popover>

        <div className="relative w-32">
          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="pl-9"
            required={required}
          />
        </div>
      </div>
    </div>
  )
}
