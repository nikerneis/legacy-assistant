"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

interface ResponseSettingsProps {
  userId: string
}

export function ResponseSettings({ userId }: ResponseSettingsProps) {
  const [settings, setSettings] = useState({
    response_style: "balanced",
    use_emojis: true,
    tone: "friendly",
    detail_level: "medium",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        if (data.settings) {
          setSettings({
            response_style: data.settings.response_style || "balanced",
            use_emojis: data.settings.use_emojis ?? true,
            tone: data.settings.tone || "friendly",
            detail_level: data.settings.detail_level || "medium",
          })
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching settings:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Response Style</CardTitle>
          <CardDescription>Control how the AI responds to your messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Length</Label>
            <RadioGroup
              value={settings.response_style}
              onValueChange={(value) => setSettings({ ...settings, response_style: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="short" />
                <Label htmlFor="short" className="font-normal">
                  Short - Brief and concise responses
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="balanced" id="balanced" />
                <Label htmlFor="balanced" className="font-normal">
                  Balanced - Moderate detail and length
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="long" id="long" />
                <Label htmlFor="long" className="font-normal">
                  Long - Detailed and comprehensive responses
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Tone</Label>
            <RadioGroup value={settings.tone} onValueChange={(value) => setSettings({ ...settings, tone: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formal" id="formal" />
                <Label htmlFor="formal" className="font-normal">
                  Formal - Professional and structured
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="friendly" />
                <Label htmlFor="friendly" className="font-normal">
                  Friendly - Warm and approachable
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional" className="font-normal">
                  Professional - Balanced and polished
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Detail Level</Label>
            <RadioGroup
              value={settings.detail_level}
              onValueChange={(value) => setSettings({ ...settings, detail_level: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-normal">
                  Low - Essential information only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal">
                  Medium - Balanced detail
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal">
                  High - Comprehensive explanations
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label>Use Emojis</Label>
              <p className="text-sm text-muted-foreground">Include emojis in AI responses</p>
            </div>
            <Switch
              checked={settings.use_emojis}
              onCheckedChange={(checked) => setSettings({ ...settings, use_emojis: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
