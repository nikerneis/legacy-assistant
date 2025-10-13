"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppearanceSettings } from "./appearance-settings"
import { ResponseSettings } from "./response-settings"
import { VoiceSettings } from "./voice-settings"
import { AccountSettings } from "./account-settings"

interface SettingsInterfaceProps {
  userId: string
}

export function SettingsInterface({ userId }: SettingsInterfaceProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your Legacy experience</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="appearance">
              <AppearanceSettings userId={userId} />
            </TabsContent>

            <TabsContent value="response">
              <ResponseSettings userId={userId} />
            </TabsContent>

            <TabsContent value="voice">
              <VoiceSettings userId={userId} />
            </TabsContent>

            <TabsContent value="account">
              <AccountSettings userId={userId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
