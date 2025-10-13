"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversationHistory } from "./conversation-history"
import { FileStorage } from "./file-storage"

interface HistoryInterfaceProps {
  userId: string
}

export function HistoryInterface({ userId }: HistoryInterfaceProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-sm text-muted-foreground">View your conversations and uploaded files</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="conversations" className="h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="h-[calc(100%-3rem)]">
            <ConversationHistory userId={userId} />
          </TabsContent>

          <TabsContent value="files" className="h-[calc(100%-3rem)]">
            <FileStorage userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
