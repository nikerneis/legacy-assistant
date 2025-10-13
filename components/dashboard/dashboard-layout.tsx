"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-border bg-sidebar lg:block">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                <span className="text-xl">☰</span>
              </Button>
            </SheetTrigger>
          </Sheet>
          <h1 className="text-lg font-semibold">Legacy</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
