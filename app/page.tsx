import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h1 className="text-xl font-bold">Legacy</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm">
              <span>✨</span>
              <span className="font-medium">Advanced AI Assistant</span>
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Your intelligent companion for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                everything
              </span>
            </h1>
            <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl">
              Chat with AI, manage your schedule, generate images and videos, and customize your experience. All in one
              powerful platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link href="/auth/signup">Start for free</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto mt-24 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="💬"
              title="AI Chat"
              description="Intelligent conversations with voice support and multiple AI modes"
            />
            <FeatureCard
              icon="📅"
              title="Smart Planning"
              description="Advanced calendar with tasks, events, and intelligent reminders"
            />
            <FeatureCard
              icon="🖼️"
              title="Image Generation"
              description="Create stunning images from text descriptions"
            />
            <FeatureCard icon="🎬" title="Video Creation" description="Generate short videos with AI assistance" />
            <FeatureCard
              icon="⚙️"
              title="Customization"
              description="Personalize themes, response styles, and preferences"
            />
            <FeatureCard
              icon="✨"
              title="Multi-Mode AI"
              description="Education, coding, planning, and more specialized modes"
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

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-lg">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20 text-2xl">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
