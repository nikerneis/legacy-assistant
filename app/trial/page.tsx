"use client"

import { useTrialStatus } from "@/hooks/use-trial"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AlertCircle, Clock } from "lucide-react"

export default function TrialPage() {
  const trialStatus = useTrialStatus()
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (!trialStatus.isActive) {
      setShowWarning(true)
    }
  }, [trialStatus.isActive])

  if (showWarning && !trialStatus.isActive) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-amber-500" />
                <CardTitle className="text-2xl font-semibold">Trial period ended</CardTitle>
              </div>
              <CardDescription>Your 3-day free trial has expired</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-2 text-sm text-muted-foreground">
                <p>
                  You've enjoyed Legacy for 3 days! To continue using all features and save your conversations and data,
                  please create an account.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/auth/signup">Create an account</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Already have an account?</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <>
      {trialStatus.daysRemaining <= 1 && trialStatus.isActive && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  Your trial ends in {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Trial mode: AI Assistant only • Create account to unlock all features
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800"
            >
              <Link href="/auth/signup">Upgrade now</Link>
            </Button>
          </div>
        </div>
      )}

      <div className={trialStatus.daysRemaining <= 1 && trialStatus.isActive ? "pt-[80px]" : ""}>
        <DashboardLayout isTrialMode={true} daysRemaining={trialStatus.daysRemaining}>
          <ChatInterface isTrialMode={true} restrictedModes={trialStatus.restrictedModes} />
        </DashboardLayout>
      </div>
    </>
  )
}
