"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Zap, Crown, Check } from 'lucide-react'
import { useCredits } from "@/hooks/use-credits"

const LEGACOIN_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    coins: 5,
    price: 4.99,
    value: "Save $0.05",
  },
  {
    id: "pro",
    name: "Pro Pack",
    coins: 25,
    price: 19.99,
    value: "Save $1.26 (20% off)",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    coins: 100,
    price: 69.99,
    value: "Save $9.01 (30% off)",
  },
]

const PREMIUM_PLANS = [
  {
    id: "monthly",
    name: "Monthly Premium",
    price: 9.99,
    period: "per month",
    features: ["Unlimited LEGACOIN", "Unlimited Planning", "Unlimited Email", "Unlimited Voice Assistant", "Priority support"],
  },
  {
    id: "yearly",
    name: "Yearly Premium",
    price: 99.99,
    period: "per year",
    features: ["Unlimited LEGACOIN", "Unlimited Planning", "Unlimited Email", "Unlimited Voice Assistant", "Priority support"],
    popular: true,
  },
]

export default function ShopPage() {
  const { credits, addCredits } = useCredits()
  const [isLoading, setIsLoading] = useState(false)

  const handleBuyCredits = async (coins: number, price: number) => {
    setIsLoading(true)
    try {
      // Simulate purchase - in real app, integrate with Stripe
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await addCredits(coins)
      // Show success toast in real implementation
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyPremium = async (planId: string, price: number) => {
    setIsLoading(true)
    try {
      // Redirect to payment in real app
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Show success toast in real implementation
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="h-full overflow-auto">
        <div className="mx-auto max-w-6xl p-6 space-y-12">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Shop</h1>
            <p className="text-xl text-muted-foreground">Get LEGACOIN to unlock full features</p>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              <Coins className="h-6 w-6 text-amber-500" />
              Current balance: <span className="text-amber-600 dark:text-amber-400">{credits} LEGACOIN</span>
            </div>
          </div>

          {/* LEGACOIN Packages */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Coins className="h-6 w-6 text-amber-500" />
              Buy LEGACOIN
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {LEGACOIN_PACKAGES.map((pkg) => (
                <Card key={pkg.id} className={pkg.popular ? "border-primary shadow-lg" : ""}>
                  <CardHeader>
                    {pkg.popular && <Badge className="w-fit mb-2">Most Popular</Badge>}
                    <CardTitle>{pkg.name}</CardTitle>
                    <CardDescription>{pkg.value}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">LEGACOIN</span>
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-amber-500" />
                        <span className="text-2xl font-bold">{pkg.coins}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">${pkg.price}</div>
                    <Button
                      onClick={() => handleBuyCredits(pkg.coins, pkg.price)}
                      disabled={isLoading}
                      className="w-full"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Premium Plans */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              Premium Plans
            </h2>
            <p className="text-muted-foreground">Get unlimited access to all features</p>
            <div className="grid gap-4 md:grid-cols-2">
              {PREMIUM_PLANS.map((plan) => (
                <Card key={plan.id} className={plan.popular ? "border-primary shadow-lg" : ""}>
                  <CardHeader>
                    {plan.popular && <Badge className="w-fit mb-2">Best Value</Badge>}
                    <CardTitle>{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">
                      ${plan.price}
                      <span className="text-lg font-normal text-muted-foreground ml-2">{plan.period}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleBuyPremium(plan.id, plan.price)}
                      disabled={isLoading}
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.popular ? "Get Premium" : "Subscribe"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4 rounded-lg bg-muted p-6">
            <h3 className="text-xl font-bold">How LEGACOIN works?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-foreground">1.</span>
                <span>Buy LEGACOIN packages to get credits</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-foreground">2.</span>
                <span>Spend 1 LEGACOIN to unlock full features of Planning, Email, or Voice Assistant for one use</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-foreground">3.</span>
                <span>Your free tier limits still apply (e.g., 3 voice uses/week), but you can purchase more with LEGACOIN</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-foreground">4.</span>
                <span>Or upgrade to Premium for unlimited everything</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
