"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, MessageSquare, Calendar, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ProfileInterfaceProps {
  userId: string
}

export function ProfileInterface({ userId }: ProfileInterfaceProps) {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    conversations: 0,
    events: 0,
    files: 0,
  })

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (userData?.user && profileData) {
        setProfile({
          email: userData.user.email,
          full_name: profileData.full_name,
          created_at: profileData.created_at,
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const supabase = createClient()

      const [conversationsRes, eventsRes, filesRes] = await Promise.all([
        supabase.from("conversations").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("files").select("*", { count: "exact", head: true }).eq("user_id", userId),
      ])

      setStats({
        conversations: conversationsRes.count || 0,
        events: eventsRes.count || 0,
        files: filesRes.count || 0,
      })
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    }
  }

  if (!profile) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-background px-6 py-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account information and statistics</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-2xl">
                    <User className="h-10 w-10 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.full_name || "User"}</CardTitle>
                  <CardDescription className="text-base">{profile.email}</CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    Active
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.conversations}</div>
                <p className="text-xs text-muted-foreground">Total chat sessions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.events}</div>
                <p className="text-xs text-muted-foreground">Scheduled items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Files</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.files}</div>
                <p className="text-xs text-muted-foreground">Uploaded files</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
