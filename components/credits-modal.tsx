"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Coins, AlertCircle, CheckCircle2 } from 'lucide-react'

interface CreditsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: "planning" | "email" | "voice"
  creditsNeeded: number
  currentCredits: number
  onConfirm: () => Promise<void>
  onUpgrade?: () => void
}

export function CreditsModal({
  open,
  onOpenChange,
  feature,
  creditsNeeded,
  currentCredits,
  onConfirm,
  onUpgrade,
}: CreditsModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const hasEnoughCredits = currentCredits >= creditsNeeded

  const featureNames = {
    planning: "Planning",
    email: "Email",
    voice: "Voice Assistant",
  }

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasEnoughCredits ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-yellow-500" />}
            Use {creditsNeeded} LEGACOIN?
          </DialogTitle>
          <DialogDescription>
            You're about to use full access to {featureNames[feature]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium">Credits needed</span>
            </div>
            <span className="font-bold text-lg">{creditsNeeded}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Your balance</span>
            </div>
            <span className={`font-bold text-lg ${hasEnoughCredits ? "text-green-600" : "text-red-600"}`}>
              {currentCredits}
            </span>
          </div>

          {hasEnoughCredits && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-3 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              You have enough credits to proceed
            </div>
          )}

          {!hasEnoughCredits && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-3 flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="h-4 w-4" />
              You don't have enough credits. You need {creditsNeeded - currentCredits} more.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {!hasEnoughCredits ? (
            <Button onClick={onUpgrade || (() => {})} asChild>
              <a href="/dashboard/shop">Buy Credits</a>
            </Button>
          ) : (
            <Button onClick={handleConfirm} disabled={isConfirming} className="gap-2">
              {isConfirming ? "Processing..." : "Confirm & Use"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
