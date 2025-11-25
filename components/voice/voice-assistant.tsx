"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useVoice } from "@/hooks/use-voice"
import { useSpeech } from "@/hooks/use-speech"
import { useUserTier, getVoiceUsageLimit, getVoiceUsagePeriod } from "@/hooks/use-user-tier"
import { VoiceUsageWarning, TierGate } from "@/components/tier-gate"

export function VoiceAssistant() {
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [usageCount, setUsageCount] = useState(0)
  const { isListening, isSupported: voiceSupported, startListening, stopListening } = useVoice()
  const { speak, stop, isSpeaking, isSupported: speechSupported } = useSpeech()
  const userTier = useUserTier()

  const usageLimit = getVoiceUsageLimit(userTier.tier)
  const usagePeriod = getVoiceUsagePeriod(userTier.tier)
  const canUseVoice = userTier.tier === "premium" || usageCount < usageLimit

  const handleVoiceCommand = async (text: string) => {
    if (!canUseVoice) {
      console.warn("[v0] Voice usage limit reached")
      return
    }

    setTranscript(text)
    setUsageCount((prev) => prev + 1)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })

      if (res.ok) {
        const data = await res.json()
        setResponse(data.message)
        speak(data.message)
      }
    } catch (error) {
      console.error("[v0] Error processing voice command:", error)
    }
  }

  const toggleListening = () => {
    if (!canUseVoice) {
      alert(`You've reached your voice assistant limit for this ${usagePeriod}. Upgrade to premium for unlimited use.`)
      return
    }

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stop()
    } else if (response) {
      speak(response)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-background px-6 py-4">
        <h1 className="text-2xl font-bold">Voice Assistant</h1>
        <p className="text-sm text-muted-foreground">
          {userTier.tier === "free" && !userTier.isLoggedIn
            ? "3 uses per week"
            : userTier.tier === "logged-in"
              ? "2 uses per day"
              : "Unlimited uses"}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>Voice Control</CardTitle>
            <CardDescription>
              {voiceSupported
                ? "Click the microphone to start speaking"
                : "Voice recognition is not supported in your browser"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <VoiceUsageWarning usageCount={usageCount} limit={usageLimit} period={usagePeriod} />

            {/* Voice Input */}
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className="h-24 w-24 rounded-full"
                onClick={toggleListening}
                disabled={!voiceSupported || !canUseVoice}
              >
                {isListening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
              </Button>
              <p className="text-sm font-medium">
                {!canUseVoice ? "Limit reached" : isListening ? "Listening..." : "Click to speak"}
              </p>
            </div>

            {/* ... rest of component stays the same ... */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
