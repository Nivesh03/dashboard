"use client"

import * as React from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TableRow as TableRowType, SortConfig } from "@/lib/types"

interface DataTableProps {
  data: TableRowType[]
  isLoading?: boolean
  error?: string
  onSort?: (column: keyof TableRowType) => void
  sortConfig?: SortConfig
  className?: string
  showLoadingOverlay?: boolean
}

interface SortableHeaderProps {
  column: keyof TableRowType
  children: React.ReactNode
  onSort?: (column: keyof TableRowType) => void
  sortConfig?: SortConfig
  className?: string
}

function SortableHeader({ 
  column, 
  children, 
  onSort, 
  sortConfig, 
  className 
}: SortableHeaderProps) {
  const isSorted = sortConfig?.column === column
  const direction = sortConfig?.direction

  const handleSort = () => {
    if (onSort) {
      onSort(column)
    }
  }

  return (
    <TableHead className={cn("cursor-pointer select-none", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={handleSort}
      >
        <span className="flex items-center gap-2">
          {children}
          <span className="flex flex-col">
            {!isSorted && (
              <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
            )}
            {isSorted && direction === 'asc' && (
              <ChevronUp className="h-3 w-3 text-foreground" />
            )}
            {isSorted && direction === 'desc' && (
              <ChevronDown className="h-3 w-3 text-foreground" />
            )}
          </span>
        </span>
      </Button>
    </TableHead>
  )
}

function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

function ErrorRow({ error }: { error: string }) {
  return (
    <TableRow>
      <TableCell colSpan={9} className="text-center py-8">
        <div className="text-muted-foreground">
          <p className="text-sm">Error loading data: {error}</p>
          <Button variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

function EmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={9} className="text-center py-8">
        <div className="text-muted-foreground">
          <p className="text-sm">No campaigns found</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  }

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
      statusStyles[status as keyof typeof statusStyles] || statusStyles.active
    )}>
      {status}
    </span>
  )
}

export function DataTable({ 
  data, 
  isLoading = false, 
  error, 
  onSort, 
  sortConfig,
  className,
  showLoadingOverlay = false
}: DataTableProps) {
  return (
    <div className={cn("rounded-md border relative", className)}>
      {showLoadingOverlay && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading...
          </div>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader 
              column="campaign" 
              onSort={onSort} 
              sortConfig={sortConfig}
            >
              Campaign
            </SortableHeader>
            <SortableHeader 
              column="impressions" 
              onSort={onSort} 
              sortConfig={sortConfig}
            >
              Impressions
            </SortableHeader>
            <SortableHeader 
              column="clicks" 
              onSort={onSort} 
              sortConfig={sortConfig}
            >
              Clicks
            </SortableHeader>
            <SortableHeader 
              column="conversions" 
              onSort={onSort} 
              sortConfig={sortConfig}
            >
              Conversions
            </SortableHeader>
            <SortableHeader 
              column="cost" 
              onSort={onSort} 
              sortConfig={sortConfig}
            >
              Cost
            </SortableHeader>
            <SortableHeader 
              column="revenue" 
              onSort={onSort} 
              sortConfig={sortConfig}
            >
              Revenue
            </SortableHeader>
            <SortableHeader 
              column="roas" 
              onSort={onSort} 
              sortConfig={sortConfig}
            >
              ROAS
            </SortableHeader>
            <SortableHeader 
              column="date" 
              onSort={onSort} 
              sortConfig={sortConfig}
            >
              Date
            </SortableHeader>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <LoadingSkeleton />}
          {error && <ErrorRow error={error} />}
          {!isLoading && !error && data.length === 0 && <EmptyRow />}
          {!isLoading && !error && data.length > 0 && data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.campaign}</TableCell>
              <TableCell>{formatNumber(row.impressions)}</TableCell>
              <TableCell>{formatNumber(row.clicks)}</TableCell>
              <TableCell>{formatNumber(row.conversions)}</TableCell>
              <TableCell>{formatCurrency(row.cost)}</TableCell>
              <TableCell>{formatCurrency(row.revenue)}</TableCell>
              <TableCell className="font-mono">
                {row.roas.toFixed(2)}x
              </TableCell>
              <TableCell>{formatDate(row.date)}</TableCell>
              <TableCell>
                <StatusBadge status={row.status || 'active'} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}