"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  Home,
  Menu,
  PieChart,
  Table,
  TrendingUp,
  X,
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Data Table",
    href: "/dashboard/data",
    icon: Table,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: PieChart,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">ADmyBRAND</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4">
          <Separator className="mb-4" />
          {!collapsed && (
            <div className="text-xs text-muted-foreground">
              <p>© 2025 ADmyBRAND Insights</p>
              <p>Analytics Dashboard</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}