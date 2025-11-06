import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Calendar, ImageIcon, Video, Settings, Sparkles, Workflow, Zap, Diamond } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-xl font-bold">Legacy</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Create account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Advanced AI Assistant</span>
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Your intelligent companion for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                everything
              </span>
            </h1>
            <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl">
              Chat with AI, manage your schedule, automate workflows, generate images and videos, and customize your
              experience. All in one powerful platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link href="/trial">Try for free</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <Zap className="h-4 w-4" />
              <span className="font-medium">3 days free trial • No credit card required</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto mt-24 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="AI Chat"
              description="Intelligent conversations with voice support and multiple AI modes"
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="Smart Planning"
              description="Advanced calendar with tasks, events, and intelligent reminders"
              premium
            />
            <FeatureCard
              icon={<ImageIcon className="h-6 w-6" />}
              title="Image Generation"
              description="Create stunning images from text descriptions"
              premium
            />
            <FeatureCard
              icon={<Video className="h-6 w-6" />}
              title="Video Creation"
              description="Generate short videos with AI assistance"
              premium
            />
            <FeatureCard
              icon={<Settings className="h-6 w-6" />}
              title="Customization"
              description="Personalize themes, response styles, and preferences"
            />
            <FeatureCard
              icon={<Workflow className="h-6 w-6" />}
              title="Automations"
              description="Create powerful workflows like N8N to automate any task"
              premium
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Legacy. Advanced AI Assistant Platform.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  premium = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  premium?: boolean
}) {
  return (
    <div className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          {icon}
        </div>
        {premium && (
          <div className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
            <Diamond className="h-3 w-3 fill-current" />
            <span>Premium</span>
          </div>
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
