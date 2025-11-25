import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { VoiceAssistant } from "@/components/voice/voice-assistant"
import { createClient } from "@/lib/supabase/server"

export default async function VoicePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  // Allow access for both authenticated and unauthenticated users
  return (
    <DashboardLayout>
      <VoiceAssistant userId={data?.user?.id || null} />
    </DashboardLayout>
  )
}
