"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const navigation = [
  { name: "AI Assistant", href: "/dashboard", icon: "💬" },
  { name: "AI Modes", href: "/dashboard/modes", icon: "🎯" },
  { name: "Planning", href: "/dashboard/planning", icon: "📅" },
  { name: "Email", href: "/dashboard/email", icon: "📧" },
  { name: "Voice Assistant", href: "/dashboard/voice", icon: "🎤" },
  { name: "History", href: "/dashboard/history", icon: "📜" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  { name: "Profile", href: "/dashboard/profile", icon: "👤" },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleNewConversation = () => {
    router.push("/dashboard")
    router.refresh()
    onNavigate?.()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <span className="text-xl">✨</span>
        <span className="text-lg font-bold text-sidebar-foreground">Legacy</span>
      </div>

      {/* New Conversation Button */}
      <div className="border-b border-sidebar-border p-4">
        <Button onClick={handleNewConversation} className="w-full justify-start gap-2" variant="default">
          <span>➕</span>
          New Conversation
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
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
          <span>🚪</span>
          Logout
        </Button>
      </div>
    </div>
  )
}
