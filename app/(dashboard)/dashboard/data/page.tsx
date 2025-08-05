"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/dashboard/data-table"
import { TableFilters } from "@/components/dashboard/table-filters"
import { Pagination } from "@/components/dashboard/pagination"
import { ErrorBoundary } from "@/components/dashboard/error-boundary"
import { TableSkeleton } from "@/components/dashboard/skeletons"
import { useTableSort } from "@/lib/hooks/use-table-sort"
import { useTableFilters } from "@/lib/hooks/use-table-filters"
import { useTablePagination } from "@/lib/hooks/use-table-pagination"
import { mockApi } from "@/lib/mock-data"
import { TableRow } from "@/lib/types"
import { ArrowLeft, Download, RefreshCw, Filter, Search } from "lucide-react"
import Link from "next/link"
import { exportToCSV } from "@/lib/utils"

// Loading component for the data table
function DataTableLoading() {
  return <TableSkeleton />
}

// Stats component to show data summary
function DataStats({ 
  totalItems, 
  filteredItems, 
  isFiltered 
}: { 
  totalItems: number
  filteredItems: number
  isFiltered: boolean 
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          {totalItems} total campaigns
        </Badge>
        {isFiltered && (
          <Badge variant="secondary">
            {filteredItems} filtered
          </Badge>
        )}
      </div>
    </div>
  )
}

export default function DataPage() {
  const [data, setData] = useState<TableRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [isPaginationLoading, setIsPaginationLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Apply filters first, then sorting, then pagination
  const {
    filteredData,
    searchQuery,
    filters,
    handleSearchChange,
    handleFiltersChange,
    handleClearAll
  } = useTableFilters(data)

  const { sortedData, sortConfig, handleSort } = useTableSort(filteredData)

  const {
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
    resetPagination
  } = useTablePagination(sortedData, 10)

  // Check if any filters are active
  const isFiltered = searchQuery.length > 0 || filters.length > 0

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
  }, [filteredData.length, resetPagination])

  // Simulate loading state for pagination changes
  const handlePageChangeWithLoading = async (page: number) => {
    setIsPaginationLoading(true)
    // Simulate API delay for pagination
    await new Promise(resolve => setTimeout(resolve, 300))
    handlePageChange(page)
    setIsPaginationLoading(false)
  }

  const handlePageSizeChangeWithLoading = async (newPageSize: number) => {
    setIsPaginationLoading(true)
    // Simulate API delay for page size change
    await new Promise(resolve => setTimeout(resolve, 300))
    handlePageSizeChange(newPageSize)
    setIsPaginationLoading(false)
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(undefined)
      const campaignData = await mockApi.getCampaignData()
      setData(campaignData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadData()
  }

  const handleExport = () => {
    // Use the exportToCSV function to export data
    exportToCSV(
      sortedData,
      `campaign-data-${new Date().toISOString().split('T')[0]}`,
      {
        id: 'ID',
        campaign: 'Campaign Name',
        impressions: 'Impressions',
        clicks: 'Clicks',
        conversions: 'Conversions',
        cost: 'Cost ($)',
        revenue: 'Revenue ($)',
        roas: 'ROAS',
        date: 'Date',
        status: 'Status'
      }
    )
  }

  useEffect(() => {
    loadData()
  }, [])

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Campaign Data</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Advanced data table with sorting, filtering, and pagination capabilities.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isLoading || data.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Data Stats */}
      {!isLoading && !error && (
        <DataStats 
          totalItems={data.length}
          filteredItems={filteredData.length}
          isFiltered={isFiltered}
        />
      )}

      {/* Main Data Table Card */}
      <ErrorBoundary fallback={({ error, retry }) => (
        <Card className="p-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Failed to load campaign data.</p>
            <Button variant="outline" onClick={retry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Card>
      )}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Campaign Performance Data
                  {isFiltered && (
                    <Badge variant="secondary" className="text-xs">
                      <Filter className="mr-1 h-3 w-3" />
                      Filtered
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  View and analyze your marketing campaign performance data
                  {lastUpdated && (
                    <span className="block text-xs mt-1">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </CardDescription>
              </div>
              
              {!isLoading && !error && data.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <span>
                    Showing {paginatedData.length} of {filteredData.length} campaigns
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
              <TableFilters
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearAll={handleClearAll}
              />
            </Suspense>
            
            <Suspense fallback={<DataTableLoading />}>
              <DataTable
                data={paginatedData}
                isLoading={isLoading}
                error={error}
                onSort={handleSort}
                sortConfig={sortConfig}
                showLoadingOverlay={isPaginationLoading}
              />
            </Suspense>

            {!isLoading && !error && data.length > 0 && (
              <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={totalItems}
                  onPageChange={handlePageChangeWithLoading}
                  onPageSizeChange={handlePageSizeChangeWithLoading}
                />
              </Suspense>
            )}

            {!isLoading && !error && data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No campaign data available.</p>
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  )
}