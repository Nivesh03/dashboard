"use client"

import { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export function DashboardLayout({
  children,
  title,
  description,
  className,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main content with responsive padding */}
      <div className="lg:pl-64">
        <Header title={title} description={description} />
        
        <main className={cn(
          "flex-1 p-4 sm:p-6", // Reduced padding on mobile
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}