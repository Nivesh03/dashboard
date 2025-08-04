"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ResponsiveChartContainerProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  height?: number
  minHeight?: number
}

export function ResponsiveChartContainer({
  title,
  description,
  children,
  className,
  height = 300,
  minHeight = 250,
}: ResponsiveChartContainerProps) {
  return (
    <Card className={cn("w-full", className)}>
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && (
            <CardTitle className="text-lg sm:text-xl font-semibold">
              {title}
            </CardTitle>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </CardHeader>
      )}
      <CardContent className="p-4 sm:p-6">
        <div 
          className="w-full"
          style={{ 
            height: `${height}px`,
            minHeight: `${minHeight}px`
          }}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  )
}