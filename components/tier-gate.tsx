"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

interface TierGateProps {
  tier: "free" | "logged-in" | "premium"
  requiredTier: "logged-in" | "premium"
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function TierGate({ tier, requiredTier, fallback, children }: TierGateProps) {
  const router = useRouter()
  const tierLevels = { free: 0, "logged-in": 1, premium: 2 }
  const hasAccess = tierLevels[tier] >= tierLevels[requiredTier]

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  const title = requiredTier === "premium" ? "Premium Feature" : "Login Required"
  const description =
    requiredTier === "premium"
      ? "This feature is only available with a premium subscription."
      : "Please create an account to access this feature."

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/20 dark:bg-amber-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <Lock className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-amber-800 dark:text-amber-300">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          {requiredTier === "logged-in" && (
            <>
              <Button variant="outline" onClick={() => router.push("/auth/login")}>
                Sign In
              </Button>
              <Button onClick={() => router.push("/auth/signup")}>Create Account</Button>
            </>
          )}
          {requiredTier === "premium" && (
            <Button onClick={() => router.push("/pricing")}>Upgrade to Premium</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface VoiceUsageWarningProps {
  usageCount: number
  limit: number
  period: "day" | "week" | "unlimited"
}

export function VoiceUsageWarning({ usageCount, limit, period }: VoiceUsageWarningProps) {
  if (period === "unlimited") return null

  const remaining = Math.max(0, limit - usageCount)
  const isNearLimit = remaining <= 1
  const isAtLimit = remaining <= 0

  if (isAtLimit) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/20 dark:bg-red-950/20">
        <p className="text-sm font-medium text-red-900 dark:text-red-200">
          You've reached your voice assistant limit for this {period}.
        </p>
        <p className="mt-1 text-sm text-red-800 dark:text-red-300">Upgrade to premium for unlimited voice assistance.</p>
      </div>
    )
  }

  if (isNearLimit) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/20 dark:bg-yellow-950/20">
        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
          You have {remaining} voice assistant use{remaining === 1 ? "" : "s"} remaining this {period}.
        </p>
      </div>
    )
  }

  return null
}
