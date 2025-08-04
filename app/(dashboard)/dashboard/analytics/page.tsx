'use client';

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundary } from "@/components/dashboard/error-boundary"
import { ChartsShowcase } from "@/components/dashboard/charts/charts-showcase"
import { LineChart } from "@/components/dashboard/charts/line-chart"
import { BarChart } from "@/components/dashboard/charts/bar-chart"
import { PieChart } from "@/components/dashboard/charts/pie-chart"
import { ChartContainer } from "@/components/dashboard/charts/chart-container"
import { ChartSkeleton } from "@/components/dashboard/skeletons"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import Link from "next/link"

// Loading component for individual charts
function ChartLoading() {
  return <ChartSkeleton />
}

// Individual chart sections for detailed views
function RevenueAnalytics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>
            Detailed revenue analysis over time with multiple metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ChartLoading />}>
            <ChartContainer
              title=""
              expandable
              onRefresh={() => window.location.reload()}
            >
              <LineChart
                data={[]}
                title=""
                dataKey="value"
                color="hsl(var(--chart-1))"
                formatValue={(value) => `$${value.toLocaleString()}`}
                showGrid
                showTooltip
              />
            </ChartContainer>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function ChannelAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
            <CardDescription>
              Compare performance across different marketing channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartLoading />}>
              <ChartContainer
                title=""
                expandable
                onRefresh={() => window.location.reload()}
              >
                <BarChart
                  data={[]}
                  title=""
                  dataKey="value"
                  categoryKey="name"
                  formatValue={(value) => `${value}%`}
                  showGrid
                  showTooltip
                  showLegend
                />
              </ChartContainer>
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Distribution</CardTitle>
            <CardDescription>
              Breakdown of traffic sources and their contribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartLoading />}>
              <ChartContainer
                title=""
                expandable
                onRefresh={() => window.location.reload()}
              >
                <PieChart
                  data={[]}
                  title=""
                  dataKey="value"
                  nameKey="name"
                  formatValue={(value) => `${value}%`}
                  showTooltip
                  showLegend
                  showLabels
                  showPercentages
                />
              </ChartContainer>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ConversionAnalytics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>
            Track user journey from impression to conversion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ChartLoading />}>
            <ChartContainer
              title=""
              expandable
              onRefresh={() => window.location.reload()}
            >
              <PieChart
                data={[]}
                title=""
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={120}
                formatValue={(value) => `${value}%`}
                showTooltip
                showLegend
                showLabels={false}
                showPercentages
              />
            </ChartContainer>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Detailed charts and interactive data visualization for comprehensive analysis.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Charts Overview Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Overview Charts</h2>
        <ErrorBoundary fallback={({ error, retry }) => (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              Failed to load charts. Please refresh the page.
            </p>
          </Card>
        )}>
          <Suspense fallback={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2"><ChartLoading /></div>
              <ChartLoading />
              <ChartLoading />
            </div>
          }>
            <ChartsShowcase />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Detailed Analytics Tabs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Detailed Analysis</h2>
        
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-4">
            <ErrorBoundary>
              <RevenueAnalytics />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="channels" className="space-y-4">
            <ErrorBoundary>
              <ChannelAnalytics />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="conversions" className="space-y-4">
            <ErrorBoundary>
              <ConversionAnalytics />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}