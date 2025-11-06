"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Zap,
  Calendar,
  Mail,
  Mic,
  History,
  Settings,
  User,
  Plus,
  LogOut,
  Sparkles,
  Workflow,
} from "lucide-react"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { useTrialStatus } from "@/hooks/use-trial"

const navigation = [
  { name: "AI Assistant", href: "/dashboard", icon: MessageSquare, premium: false },
  { name: "AI Modes", href: "/dashboard/modes", icon: Zap, premium: true },
  { name: "Planning", href: "/dashboard/planning", icon: Calendar, premium: true },
  { name: "Automations", href: "/dashboard/automations", icon: Workflow, premium: true },
  { name: "Email", href: "/dashboard/email", icon: Mail, premium: true },
  { name: "Voice Assistant", href: "/dashboard/voice", icon: Mic, premium: true },
  { name: "History", href: "/dashboard/history", icon: History, premium: false },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, premium: false },
  { name: "Profile", href: "/dashboard/profile", icon: User, premium: false },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const trialStatus = useTrialStatus()

  const handleNewConversation = () => {
    router.push("/dashboard")
    router.refresh()
    onNavigate?.()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Sparkles className="h-5 w-5 text-sidebar-foreground" />
        <span className="text-lg font-bold text-sidebar-foreground">Legacy</span>
      </div>

      {/* New Conversation Button */}
      <div className="border-b border-sidebar-border p-4">
        <Button onClick={handleNewConversation} className="w-full justify-start gap-2" variant="default">
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const showPremiumBadge = item.premium && trialStatus.isActive

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors justify-between group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.name}
                </div>
                {showPremiumBadge && (
                  <PremiumBadge className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Logout Button */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
