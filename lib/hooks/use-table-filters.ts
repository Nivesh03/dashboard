"use client"

import { useState, useMemo } from "react"
import { TableRow, TableFilter } from "@/lib/types"

export function useTableFilters(data: TableRow[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<TableFilter[]>([])

  const filteredData = useMemo(() => {
    let result = data

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(row =>
        row.campaign.toLowerCase().includes(query) ||
        row.status?.toLowerCase().includes(query)
      )
    }

    // Apply column filters
    result = result.filter(row => {
      return filters.every(filter => {
        const value = row[filter.column]
        const filterValue = filter.value

        switch (filter.operator) {
          case 'equals':
            return String(value).toLowerCase() === String(filterValue).toLowerCase()
          
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
          
          case 'greater':
            if (typeof value === 'number' && typeof filterValue === 'string') {
              return value > parseFloat(filterValue)
            }
            return false
          
          case 'less':
            if (typeof value === 'number' && typeof filterValue === 'string') {
              return value < parseFloat(filterValue)
            }
            return false
          
          default:
            return true
        }
      })
    })

    return result
  }, [data, searchQuery, filters])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleFiltersChange = (newFilters: TableFilter[]) => {
    setFilters(newFilters)
  }

  const handleClearAll = () => {
    setSearchQuery("")
    setFilters([])
  }

  return {
    filteredData,
    searchQuery,
    filters,
    handleSearchChange,
    handleFiltersChange,
    handleClearAll
  }
}