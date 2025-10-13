"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AccountSettingsProps {
  userId: string
}

export function AccountSettings({ userId }: AccountSettingsProps) {
  const [profile, setProfile] = useState({
    email: "",
    full_name: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (userData?.user) {
        setProfile({
          email: userData.user.email || "",
          full_name: profileData?.full_name || "",
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      await supabase.from("profiles").update({ full_name: profile.full_name }).eq("id", userId)
    } catch (error) {
      console.error("[v0] Error saving profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10">
                <User className="h-10 w-10 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Profile Picture</p>
              <p className="text-xs text-muted-foreground">Upload a photo to personalize your account</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
