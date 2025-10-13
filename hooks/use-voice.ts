"use client"

import { useState, useEffect, useCallback } from "react"

export function useVoice() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = "en-US"

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setTranscript(transcript)
          setIsListening(false)
          setError(null)
        }

        recognitionInstance.onerror = (event: any) => {
          setIsListening(false)

          // Handle different error types gracefully
          if (event.error === "network") {
            setError("Network error. Voice recognition requires an internet connection.")
          } else if (event.error === "not-allowed") {
            setError("Microphone access denied. Please allow microphone access.")
          } else if (event.error === "no-speech") {
            setError("No speech detected. Please try again.")
          } else {
            setError(`Voice recognition error: ${event.error}`)
          }
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript("")
      setError(null)
      try {
        recognition.start()
        setIsListening(true)
      } catch (err) {
        setError("Failed to start voice recognition")
        setIsListening(false)
      }
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    error,
  }
}
