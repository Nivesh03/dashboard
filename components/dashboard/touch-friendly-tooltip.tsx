"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TouchFriendlyTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    color: string
  }>
  label?: string
  formatValue?: (value: number) => string
  className?: string
}

export function TouchFriendlyTooltip({ 
  active, 
  payload, 
  label, 
  formatValue,
  className 
}: TouchFriendlyTooltipProps) {
  if (!active || !payload || !payload.length || !label) {
    return null
  }

  const data = payload[0]
  const value = data.value as number
  const formattedValue = formatValue ? formatValue(value) : value.toLocaleString()
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg",
        "p-3 sm:p-4 min-w-[120px] max-w-[200px]",
        "touch-target", // Ensure minimum touch target size
        className
      )}
    >
      {/* Date/Label */}
      <p className="text-sm font-medium text-foreground mb-2">
        {typeof label === 'string' && label.includes('-') 
          ? new Date(label).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          : label
        }
      </p>
      
      {/* Value with color indicator */}
      <div className="flex items-center gap-2">
        <span 
          className="inline-block w-3 h-3 rounded-full flex-shrink-0" 
          style={{ backgroundColor: data.color }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground truncate">
            {data.name}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {formattedValue}
          </p>
        </div>
      </div>
    </motion.div>
  )
}