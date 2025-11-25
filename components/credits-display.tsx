"use client"

import { useEffect, useState } from "react"
import { Coins } from 'lucide-react'
import { useCredits } from "@/hooks/use-credits"
import Link from "next/link"

export function CreditsDisplay() {
  const { credits, loading } = useCredits()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/30 text-sm">
        <Coins className="h-4 w-4 text-amber-500" />
        <span className="font-medium text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return (
    <Link href="/dashboard/shop">
      <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-500" />
          <span className="font-bold text-amber-700 dark:text-amber-400">{credits}</span>
        </div>
        <span className="text-xs text-amber-600 dark:text-amber-500">LEGACOIN</span>
      </div>
    </Link>
  )
}
