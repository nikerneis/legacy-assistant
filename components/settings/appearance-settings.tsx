"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppearanceSettingsProps {
  userId: string
}

const themes = [
  {
    id: "light",
    name: "Light",
    description: "Clean and bright",
    icon: Sun,
    preview: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      primary: "oklch(0.205 0 0)",
      card: "oklch(1 0 0)",
    },
  },
  {
    id: "dark",
    name: "Dark",
    description: "Easy on the eyes",
    icon: Moon,
    preview: {
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
      primary: "oklch(0.985 0 0)",
      card: "oklch(0.145 0 0)",
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Refined and elegant",
    icon: Monitor,
    preview: {
      background: "oklch(0.98 0.002 264)",
      foreground: "oklch(0.2 0.01 264)",
      primary: "oklch(0.35 0.08 264)",
      card: "oklch(1 0 0)",
    },
  },
]

export function AppearanceSettings({ userId }: AppearanceSettingsProps) {
  const [theme, setTheme] = useState<string>("light")
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setTheme(data.settings?.theme || "light")
        applyTheme(data.settings?.theme || "light")
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement
    root.classList.remove("dark", "professional")
    if (newTheme === "dark") {
      root.classList.add("dark")
    } else if (newTheme === "professional") {
      root.classList.add("professional")
    }
  }

  const handleThemeSelect = (newTheme: string) => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how Legacy looks on your device</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Theme</Label>
          <div className="grid gap-4 md:grid-cols-3">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              const isSelected = theme === themeOption.id
              const isHovered = hoveredTheme === themeOption.id

              return (
                <button
                  key={themeOption.id}
                  type="button"
                  onClick={() => handleThemeSelect(themeOption.id)}
                  onMouseEnter={() => setHoveredTheme(themeOption.id)}
                  onMouseLeave={() => setHoveredTheme(null)}
                  className={cn(
                    "relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-accent/50",
                  )}
                >
                  {isSelected && (
                    <div className="absolute right-2 top-2">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  )}

                  <Icon className="h-8 w-8" />
                  <div className="text-center">
                    <p className="font-medium">{themeOption.name}</p>
                    <p className="text-xs text-muted-foreground">{themeOption.description}</p>
                  </div>

                  {isHovered && (
                    <div
                      className="absolute -bottom-16 left-1/2 z-10 -translate-x-1/2 rounded-lg border-2 border-border p-2 shadow-lg"
                      style={{ backgroundColor: themeOption.preview.card }}
                    >
                      <div className="flex gap-2">
                        <div className="h-8 w-8 rounded" style={{ backgroundColor: themeOption.preview.background }} />
                        <div className="h-8 w-8 rounded" style={{ backgroundColor: themeOption.preview.primary }} />
                        <div
                          className="h-8 w-8 rounded border"
                          style={{
                            backgroundColor: themeOption.preview.card,
                            borderColor: themeOption.preview.foreground,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}
