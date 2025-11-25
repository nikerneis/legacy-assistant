"use client"

import { useEffect, useState } from "react"
import { useTrialStatus } from "./use-trial"

export type UserTier = "free" | "logged-in" | "premium"

export interface UserTierInfo {
  tier: UserTier
  isLoggedIn: boolean
  isPremium: boolean
  voiceUsageThisWeek: number
  voiceUsageToday: number
}

export function useUserTier(): UserTierInfo {
  const trialStatus = useTrialStatus()
  const [tierInfo, setTierInfo] = useState<UserTierInfo>({
    tier: "free",
    isLoggedIn: false,
    isPremium: false,
    voiceUsageThisWeek: 0,
    voiceUsageToday: 0,
  })

  useEffect(() => {
    // Determine tier based on trial status - users in trial get full features for planning/voice
    const currentTier: UserTier = trialStatus.isActive ? "logged-in" : "free"
    
    const voiceUsageThisWeek = localStorage.getItem("voiceUsageThisWeek") 
      ? parseInt(localStorage.getItem("voiceUsageThisWeek")!) 
      : 0
    const voiceUsageToday = localStorage.getItem("voiceUsageToday") 
      ? parseInt(localStorage.getItem("voiceUsageToday")!) 
      : 0

    setTierInfo({
      tier: currentTier,
      isLoggedIn: trialStatus.isActive,
      isPremium: false,
      voiceUsageThisWeek,
      voiceUsageToday,
    })
  }, [trialStatus.isActive])

  return tierInfo
}

export function getVoiceUsageLimit(tier: UserTier): number {
  switch (tier) {
    case "free":
      return 3 // 3 per week
    case "logged-in":
      return 2 // 2 per day
    case "premium":
      return Infinity // Unlimited
    default:
      return 0
  }
}

export function getVoiceUsagePeriod(tier: UserTier): "week" | "day" | "unlimited" {
  switch (tier) {
    case "free":
      return "week"
    case "logged-in":
      return "day"
    case "premium":
      return "unlimited"
    default:
      return "week"
  }
}

export function getPlanningFeatures(tier: UserTier) {
  switch (tier) {
    case "free":
      return {
        calendar: true, // Basic calendar view
        tasks: true, // Basic tasks (max 5)
        timeline: false, // Not available
        editEvents: false, // Cannot create/edit
        deleteEvents: false, // Cannot delete
        maxTasks: 5,
        description: "Limited to 5 tasks, view-only mode",
      }
    case "logged-in":
      return {
        calendar: true, // Full calendar
        tasks: true, // Full tasks
        timeline: true, // Full timeline
        editEvents: true, // Can create/edit
        deleteEvents: true, // Can delete
        maxTasks: 50,
        description: "Full planning features during trial",
      }
    case "premium":
      return {
        calendar: true,
        tasks: true,
        timeline: true,
        editEvents: true,
        deleteEvents: true,
        maxTasks: Infinity,
        description: "Unlimited planning features",
      }
    default:
      return {
        calendar: true,
        tasks: true,
        timeline: false,
        editEvents: false,
        deleteEvents: false,
        maxTasks: 5,
        description: "Limited planning features",
      }
  }
}
