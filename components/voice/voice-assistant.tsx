"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useVoice } from "@/hooks/use-voice"
import { useSpeech } from "@/hooks/use-speech"

export function VoiceAssistant() {
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const { isListening, isSupported: voiceSupported, startListening, stopListening } = useVoice()
  const { speak, stop, isSpeaking, isSupported: speechSupported } = useSpeech()

  const handleVoiceCommand = async (text: string) => {
    setTranscript(text)

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
        <p className="text-sm text-muted-foreground">Interact with Legacy using voice commands</p>
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
            {/* Voice Input */}
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className="h-24 w-24 rounded-full"
                onClick={toggleListening}
                disabled={!voiceSupported}
              >
                {isListening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
              </Button>
              <p className="text-sm font-medium">{isListening ? "Listening..." : "Click to speak"}</p>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="rounded-lg border border-border bg-muted p-4">
                <p className="text-sm font-medium text-muted-foreground">You said:</p>
                <p className="mt-2">{transcript}</p>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="space-y-2">
                <div className="rounded-lg border border-border bg-primary/5 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Legacy:</p>
                  <p className="mt-2">{response}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSpeaking}
                  disabled={!speechSupported}
                  className="w-full bg-transparent"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="mr-2 h-4 w-4" />
                      Stop Speaking
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" />
                      Read Aloud
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Instructions */}
            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <p className="font-medium">Tips:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Speak clearly and at a normal pace</li>
                <li>Make sure your microphone is enabled</li>
                <li>Try commands like "What's the weather?" or "Tell me a joke"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
