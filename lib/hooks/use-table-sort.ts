"use client"

import { useState, useMemo } from "react"
import { TableRow, SortConfig } from "@/lib/types"

export function useTableSort(data: TableRow[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>()

  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return data
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.column]
      const bValue = b[sortConfig.column]

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      // Handle dates
      if (sortConfig.column === 'date') {
        const dateA = new Date(aValue as string).getTime()
        const dateB = new Date(bValue as string).getTime()
        const comparison = dateA - dateB
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      return 0
    })
  }, [data, sortConfig])

  const handleSort = (column: keyof TableRow) => {
    setSortConfig(prevConfig => {
      // If clicking the same column, toggle direction
      if (prevConfig?.column === column) {
        return {
          column,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      
      // If clicking a new column, start with ascending
      return {
        column,
        direction: 'asc'
      }
    })
  }

  return {
    sortedData,
    sortConfig,
    handleSort
  }
}