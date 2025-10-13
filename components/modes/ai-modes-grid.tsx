"use client"

import { AI_MODES, type AiMode } from "@/lib/ai-modes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Sparkles, GraduationCap, Code, Brain, Calendar, ImageIcon, Video } from "lucide-react"

const iconMap = {
  Sparkles,
  GraduationCap,
  Code,
  Brain,
  Calendar,
  ImageIcon,
  Video,
}

export function AiModesGrid() {
  const router = useRouter()

  const handleSelectMode = (mode: AiMode) => {
    // Store selected mode in localStorage
    localStorage.setItem("selectedAiMode", mode)
    router.push("/dashboard")
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(AI_MODES).map(([key, mode]) => {
        const Icon = iconMap[mode.icon as keyof typeof iconMap]
        return (
          <Card
            key={key}
            className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg"
            onClick={() => handleSelectMode(key as AiMode)}
          >
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle>{mode.name}</CardTitle>
              <CardDescription>{mode.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Select Mode
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
