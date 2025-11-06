"use client"
import { AI_MODES, type AiMode } from "@/lib/ai-modes"
import type React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, GraduationCap, Code2, Brain, Calendar, ImageIcon, Video } from "lucide-react"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { useTrialStatus } from "@/hooks/use-trial"

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-4 w-4" />,
  GraduationCap: <GraduationCap className="h-4 w-4" />,
  Code: <Code2 className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  ImageIcon: <ImageIcon className="h-4 w-4" />,
  Video: <Video className="h-4 w-4" />,
}

interface ModeSelectorProps {
  value: AiMode
  onChange: (mode: AiMode) => void
  disabledModes?: AiMode[]
}

export function ModeSelector({ value, onChange, disabledModes = [] }: ModeSelectorProps) {
  const trialStatus = useTrialStatus()

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as AiMode)}
      disabled={disabledModes.length > 0 && disabledModes.includes(value)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(AI_MODES).map(([key, mode]) => {
          const isDisabled = disabledModes.includes(key as AiMode)
          const icon = iconMap[mode.icon]
          const isPremium = mode.premium && trialStatus.isActive

          return (
            <SelectItem key={key} value={key} disabled={isDisabled}>
              <div className="flex items-center gap-2">
                {icon}
                <span>{mode.name}</span>
                {isPremium && <PremiumBadge className="ml-2" />}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
