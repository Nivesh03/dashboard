"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/dashboard/data-table"
import { TableFilters } from "@/components/dashboard/table-filters"
import { Pagination } from "@/components/dashboard/pagination"
import { useTableSort } from "@/lib/hooks/use-table-sort"
import { useTableFilters } from "@/lib/hooks/use-table-filters"
import { useTablePagination } from "@/lib/hooks/use-table-pagination"
import { mockApi } from "@/lib/mock-data"
import { TableRow } from "@/lib/types"

export default function DataPage() {
  const [data, setData] = useState<TableRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [isPaginationLoading, setIsPaginationLoading] = useState(false)

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(undefined)
        const campaignData = await mockApi.getCampaignData()
        setData(campaignData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Table</h1>
        <p className="text-muted-foreground">
          Advanced data table with sorting, filtering, and pagination.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            View and analyze your marketing campaign performance data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TableFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearAll={handleClearAll}
          />
          
          <DataTable
            data={paginatedData}
            isLoading={isLoading}
            error={error}
            onSort={handleSort}
            sortConfig={sortConfig}
            showLoadingOverlay={isPaginationLoading}
          />

          {!isLoading && !error && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChangeWithLoading}
              onPageSizeChange={handlePageSizeChangeWithLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}