"use client"

import * as React from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TableFilter, TableRow } from "@/lib/types"

interface TableFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: TableFilter[]
  onFiltersChange: (filters: TableFilter[]) => void
  onClearAll: () => void
  className?: string
}

interface FilterOption {
  label: string
  value: string
  column: keyof TableRow
  operator: TableFilter['operator']
}

const filterOptions: FilterOption[] = [
  { label: "Status: Active", value: "active", column: "status", operator: "equals" },
  { label: "Status: Paused", value: "paused", column: "status", operator: "equals" },
  { label: "Status: Completed", value: "completed", column: "status", operator: "equals" },
  { label: "ROAS > 3.0", value: "3", column: "roas", operator: "greater" },
  { label: "ROAS > 5.0", value: "5", column: "roas", operator: "greater" },
  { label: "Cost > $1000", value: "1000", column: "cost", operator: "greater" },
  { label: "Cost > $2000", value: "2000", column: "cost", operator: "greater" },
  { label: "Conversions > 100", value: "100", column: "conversions", operator: "greater" },
  { label: "Conversions > 150", value: "150", column: "conversions", operator: "greater" },
]

export function TableFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearAll,
  className
}: TableFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false)

  const handleAddFilter = (option: FilterOption) => {
    const newFilter: TableFilter = {
      column: option.column,
      value: option.value,
      operator: option.operator
    }

    // Check if filter already exists
    const exists = filters.some(
      filter => 
        filter.column === newFilter.column && 
        filter.value === newFilter.value && 
        filter.operator === newFilter.operator
    )

    if (!exists) {
      onFiltersChange([...filters, newFilter])
    }
  }

  const handleRemoveFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index)
    onFiltersChange(newFilters)
  }

  const getFilterLabel = (filter: TableFilter): string => {
    const option = filterOptions.find(
      opt => 
        opt.column === filter.column && 
        opt.value === filter.value && 
        opt.operator === filter.operator
    )
    return option?.label || `${filter.column} ${filter.operator} ${filter.value}`
  }

  const hasActiveFilters = filters.length > 0 || searchQuery.length > 0

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {filters.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {filters.length}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {getFilterLabel(filter)}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Quick Filters</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {filterOptions.map((option, index) => {
                    const isActive = filters.some(
                      filter => 
                        filter.column === option.column && 
                        filter.value === option.value && 
                        filter.operator === option.operator
                    )

                    return (
                      <Button
                        key={index}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAddFilter(option)}
                        disabled={isActive}
                        className="justify-start text-xs"
                      >
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Custom Filter</h4>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="campaign">Campaign</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="cost">Cost</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="roas">ROAS</SelectItem>
                      <SelectItem value="conversions">Conversions</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater">Greater than</SelectItem>
                      <SelectItem value="less">Less than</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input placeholder="Value" className="flex-1" />
                  
                  <Button size="sm">Add Filter</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}