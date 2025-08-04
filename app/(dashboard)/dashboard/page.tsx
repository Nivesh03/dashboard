import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricsContainer } from "@/components/dashboard/metrics-container"
import { ErrorBoundary } from "@/components/dashboard/error-boundary"

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome to your analytics dashboard. Here&apos;s what&apos;s happening with your campaigns.
        </p>
      </div>

      {/* Metrics Cards with real data, animations, and error handling */}
      <ErrorBoundary>
        <MetricsContainer autoRetry={true} retryDelay={3000} />
      </ErrorBoundary>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest campaign performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Holiday Campaign 2024</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Black Friday Sale</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
                <Badge variant="secondary">Paused</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Summer Collection</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                📊 Charts and analytics will be implemented in the next tasks
              </p>
              <p className="text-sm text-muted-foreground">
                📋 Data tables with filtering and sorting
              </p>
              <p className="text-sm text-muted-foreground">
                🎨 Full responsive design for all devices
              </p>
              <p className="text-sm text-muted-foreground">
                ✨ Smooth animations and micro-interactions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}