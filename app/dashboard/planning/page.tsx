import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PlanningInterface } from "@/components/planning/planning-interface"
import { createClient } from "@/lib/supabase/server"

export default async function PlanningPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  // Allow access for both authenticated and unauthenticated users
  return (
    <DashboardLayout>
      <PlanningInterface userId={data?.user?.id || null} />
    </DashboardLayout>
  )
}
