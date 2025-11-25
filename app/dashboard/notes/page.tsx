"use client"

import { NotesInterface } from "@/components/notes/notes-interface"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function NotesPage() {
  return (
    <DashboardLayout>
      <NotesInterface />
    </DashboardLayout>
  )
}
