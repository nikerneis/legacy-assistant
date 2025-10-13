import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AiModesGrid } from "@/components/modes/ai-modes-grid"

export default async function ModesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col">
        <div className="border-b border-border bg-background px-6 py-4">
          <h1 className="text-2xl font-bold">AI Modes</h1>
          <p className="text-sm text-muted-foreground">Choose a specialized mode for your conversation</p>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <AiModesGrid />
        </div>
      </div>
    </DashboardLayout>
  )
}
