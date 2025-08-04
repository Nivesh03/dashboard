'use client';

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetricsContainer } from "@/components/dashboard/metrics-container"
import { ErrorBoundary } from "@/components/dashboard/error-boundary"
import { ChartsShowcase } from "@/components/dashboard/charts/charts-showcase"
import { DataTable } from "@/components/dashboard/data-table"
import { EnhancedLoading } from "@/components/dashboard/enhanced-loading"
import { ChartSkeleton, TableSkeleton } from "@/components/dashboard/skeletons"
import { ArrowRight, TrendingUp, Users, DollarSign, Target } from "lucide-react"
import Link from "next/link"
import { initializePerformanceMonitoring } from "@/lib/performance-utils"
import { useEffect } from "react"

// Loading component for charts section
function ChartsLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <ChartSkeleton />
      </div>
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  )
}

// Recent Activity Component
function RecentActivity() {
  const activities = [
    {
      id: 1,
      title: "Holiday Campaign 2024",
      description: "Campaign performance increased by 23%",
      time: "2 hours ago",
      status: "active" as const,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      id: 2,
      title: "Black Friday Sale",
      description: "Conversion rate reached 4.2%",
      time: "5 hours ago",
      status: "paused" as const,
      icon: Target,
      color: "text-orange-600"
    },
    {
      id: 3,
      title: "Summer Collection",
      description: "Generated $45,000 in revenue",
      time: "1 day ago",
      status: "completed" as const,
      icon: DollarSign,
      color: "text-blue-600"
    },
    {
      id: 4,
      title: "New User Acquisition",
      description: "1,250 new users this week",
      time: "2 days ago",
      status: "active" as const,
      icon: Users,
      color: "text-purple-600"
    }
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'paused': return 'secondary'
      case 'completed': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest campaign performance updates
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/analytics">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <Badge variant={getStatusVariant(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    {
      title: "View Analytics",
      description: "Detailed charts and performance metrics",
      href: "/dashboard/analytics",
      icon: TrendingUp
    },
    {
      title: "Campaign Data",
      description: "Sortable table with filtering options",
      href: "/dashboard/data",
      icon: Target
    },
    {
      title: "Revenue Reports",
      description: "Financial performance and ROI analysis",
      href: "/dashboard/reports",
      icon: DollarSign
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Navigate to detailed views and reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant="ghost"
                className="justify-start h-auto p-4"
                asChild
              >
                <Link href={action.href}>
                  <Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  // Initialize performance monitoring
  useEffect(() => {
    const monitor = initializePerformanceMonitoring();
    return () => monitor?.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome to ADmyBRAND Insights. Here&apos;s what&apos;s happening with your campaigns.
        </p>
      </div>

      {/* Metrics Cards with Error Boundary and Loading States */}
      <ErrorBoundary fallback={({ error, retry }) => (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Failed to load metrics. Please refresh the page.
          </p>
        </Card>
      )}>
        <Suspense fallback={<EnhancedLoading text="Loading metrics..." />}>
          <MetricsContainer autoRetry={true} retryDelay={3000} />
        </Suspense>
      </ErrorBoundary>

      {/* Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Analytics Overview</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/analytics">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <ErrorBoundary fallback={({ error, retry }) => (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              Failed to load charts. Please try again.
            </p>
          </Card>
        )}>
          <Suspense fallback={<ChartsLoading />}>
            <ChartsShowcase />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Activity and Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <RecentActivity />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <QuickActions />
        </ErrorBoundary>
      </div>

      {/* Data Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Campaign Performance</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/data">
              View Full Table
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <ErrorBoundary fallback={({ error, retry }) => (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              Failed to load campaign data. Please try again.
            </p>
          </Card>
        )}>
          <Card>
            <CardContent className="p-0">
              <Suspense fallback={<TableSkeleton />}>
                <div className="max-h-96 overflow-hidden">
                  <DataTable 
                    data={[]} 
                    isLoading={false}
                    className="border-0"
                  />
                  <div className="p-4 border-t bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground">
                      Showing preview of campaign data.{" "}
                      <Link 
                        href="/dashboard/data" 
                        className="text-primary hover:underline font-medium"
                      >
                        View full table with filtering and sorting
                      </Link>
                    </p>
                  </div>
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
    </div>
  )
}