"use client"

import { useEffect, useState } from "react"
import type { AiMode } from "@/lib/ai-modes"

const TRIAL_STORAGE_KEY = "legacy_trial_start"
const TRIAL_DAYS = 999999 // Effectively unlimited

export interface TrialStatus {
  isActive: boolean
  daysRemaining: number
  expiresAt: Date | null
  startedAt: Date | null
  restrictedModes: AiMode[]
}

export function useTrialStatus(): TrialStatus {
  const [status, setStatus] = useState<TrialStatus>({
    isActive: false,
    daysRemaining: 0,
    expiresAt: null,
    startedAt: null,
    restrictedModes: ["education", "coding", "reflection", "planning", "image", "video"],
  })

  useEffect(() => {
    const storedStart = localStorage.getItem(TRIAL_STORAGE_KEY)

    if (!storedStart) {
      const now = new Date()
      localStorage.setItem(TRIAL_STORAGE_KEY, now.toISOString())

      const expiresAt = new Date(now)
      expiresAt.setDate(expiresAt.getDate() + TRIAL_DAYS)

      setStatus({
        isActive: true,
        daysRemaining: TRIAL_DAYS,
        expiresAt,
        startedAt: now,
        restrictedModes: ["education", "coding", "reflection", "planning", "image", "video"],
      })
    } else {
      const startDate = new Date(storedStart)
      const now = new Date()
      const expiresAt = new Date(startDate)
      expiresAt.setDate(expiresAt.getDate() + TRIAL_DAYS)

      const timeRemaining = expiresAt.getTime() - now.getTime()
      const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

      setStatus({
        isActive: daysRemaining > 0,
        daysRemaining: Math.max(0, daysRemaining),
        expiresAt,
        startedAt: startDate,
        restrictedModes: ["education", "coding", "reflection", "planning", "image", "video"],
      })
    }
  }, [])

  return status
}

export function initiateTrial() {
  const now = new Date()
  localStorage.setItem(TRIAL_STORAGE_KEY, now.toISOString())
}

export function clearTrial() {
  localStorage.removeItem(TRIAL_STORAGE_KEY)
}
