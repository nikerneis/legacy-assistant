"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Mic, Volume2 } from "lucide-react"

interface VoiceSettingsProps {
  userId: string
}

export function VoiceSettings({ userId }: VoiceSettingsProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setVoiceEnabled(data.settings?.voice_enabled ?? false)
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
        body: JSON.stringify({ voice_enabled: voiceEnabled }),
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
          <CardTitle>Voice Settings</CardTitle>
          <CardDescription>Configure voice input and output preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <Label>Voice Input</Label>
                <p className="text-sm text-muted-foreground">Enable voice commands and dictation</p>
              </div>
            </div>
            <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Volume2 className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <Label>Voice Output</Label>
                <p className="text-sm text-muted-foreground">AI responses read aloud automatically</p>
              </div>
            </div>
            <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Voice features use your browser's built-in speech recognition and synthesis. Make sure your browser
              supports these features and has microphone permissions enabled.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
