"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Bell, Search, Settings, User } from "lucide-react"

interface HeaderProps {
  title?: string
  description?: string
}

export function Header({ title = "Dashboard", description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Title and search */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          {/* Title - responsive sizing */}
          <div className="hidden sm:block lg:block min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold truncate">{title}</h1>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{description}</p>
            )}
          </div>
          
          {/* Mobile title - show on small screens */}
          <div className="block sm:hidden min-w-0 flex-1 ml-12">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
          </div>
          
          {/* Search - responsive width with enhanced interactions */}
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search..."
              className="w-48 lg:w-64 pl-10 transition-all duration-200 hover:bg-accent/50 focus:shadow-sm focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile search button with hover effect */}
          <Button variant="ghost" size="icon" className="md:hidden hover-lift touch-target">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications - hide on very small screens with pulse animation */}
          <Button variant="ghost" size="icon" className="relative hidden xs:flex hover-lift touch-target">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User menu with enhanced interactions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover-lift touch-target transition-all duration-200 hover:ring-2 hover:ring-primary/20">
                <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-105">
                  <AvatarImage src="/avatars/01.png" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@admybrand.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}