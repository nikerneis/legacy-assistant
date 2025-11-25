"use client"

import { useTrialStatus } from "@/hooks/use-trial"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

export default function TrialPage() {
  const trialStatus = useTrialStatus()
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (!trialStatus.isActive) {
      setShowWarning(true)
    }
  }, [trialStatus.isActive])

  if (showWarning && !trialStatus.isActive) {
    return null // No expiration message needed
  }
  // </CHANGE>

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
