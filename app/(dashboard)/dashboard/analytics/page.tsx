'use client';

import { Suspense, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundary } from "@/components/dashboard/error-boundary"
import { ChartsShowcase } from "@/components/dashboard/charts/charts-showcase"
import { LazyBarChart, LazyPieChart } from "@/components/dashboard/charts/lazy-charts"
import { EnhancedRevenueChart } from "@/components/dashboard/charts/enhanced-revenue-chart"
import { EnhancedBarChart } from "@/components/dashboard/charts/enhanced-bar-chart"
import { EnhancedPieChart } from "@/components/dashboard/charts/enhanced-pie-chart"

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
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRevenueData = async () => {
      try {
        setIsLoading(true);
        // Import mock data dynamically
        const { mockApi } = await import('@/lib/mock-data');
        const data = await mockApi.getRevenueData();
        setRevenueData(data);
      } catch (error) {
        console.error('Failed to load revenue data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRevenueData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <EnhancedRevenueChart
        data={revenueData}
        title="Revenue Trends"
        dataKey="value"
        color="hsl(var(--chart-1))"
        formatValue={formatCurrency}
        showGrid
        showTooltip
        showTrend
        showGradient
        isLoading={isLoading}
        height={450}
      />
    </div>
  )
}

function ChannelAnalytics() {
  const [channelData, setChannelData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChannelData = async () => {
      try {
        setIsLoading(true);
        // Import mock data dynamically
        const { mockApi } = await import('@/lib/mock-data');
        const data = await mockApi.getChannelData();
        setChannelData(data);
      } catch (error) {
        console.error('Failed to load channel data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChannelData();
  }, []);

  const formatPercentage = (value: number) => `${value}%`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedBarChart
          data={channelData}
          title="Channel Performance"
          dataKey="value"
          categoryKey="name"
          formatValue={formatPercentage}
          showGrid
          showTooltip
          showLegend
          showStats
          isLoading={isLoading}
          height={400}
        />

        <EnhancedPieChart
          data={channelData}
          title="Traffic Distribution"
          dataKey="value"
          nameKey="name"
          formatValue={formatPercentage}
          showTooltip
          showLegend
          showLabels
          showPercentages
          showStats
          isLoading={isLoading}
          height={400}
          outerRadius={100}
        />
      </div>
    </div>
  )
}

function ConversionAnalytics() {
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConversionData = async () => {
      try {
        setIsLoading(true);
        // Import mock data dynamically
        const { mockApi } = await import('@/lib/mock-data');
        const data = await mockApi.getChannelData(); // Using channel data for conversion funnel demo
        setConversionData(data);
      } catch (error) {
        console.error('Failed to load conversion data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversionData();
  }, []);

  const formatPercentage = (value: number) => `${value}%`;

  return (
    <div className="space-y-6">
      <EnhancedPieChart
        data={conversionData}
        title="Conversion Funnel"
        dataKey="value"
        nameKey="name"
        innerRadius={60}
        outerRadius={120}
        formatValue={formatPercentage}
        showTooltip
        showLegend
        showLabels={false}
        showPercentages
        showStats
        isLoading={isLoading}
        height={450}
      />
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
        <ErrorBoundary fallback={() => (
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