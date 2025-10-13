"use client"
import { AI_MODES, type AiMode } from "@/lib/ai-modes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const iconMap = {
  Sparkles: "✨",
  GraduationCap: "🎓",
  Code: "💻",
  Brain: "🧠",
  Calendar: "📅",
  ImageIcon: "🖼️",
  Video: "🎬",
}

interface ModeSelectorProps {
  value: AiMode
  onChange: (mode: AiMode) => void
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as AiMode)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(AI_MODES).map(([key, mode]) => {
          const icon = iconMap[mode.icon as keyof typeof iconMap]
          return (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <span>{icon}</span>
                <span>{mode.name}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
