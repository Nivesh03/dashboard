"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState, useCallback, memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import { getChartCSSVariables } from "@/lib/chart-theme-config";
import { chartFadeIn, slideUpVariants } from "@/lib/animation-utils";

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onRefresh?: () => void;
  className?: string;
  headerActions?: React.ReactNode;
  expandable?: boolean;
}

interface ResponsiveChartWrapperProps {
  children: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
}

const ChartSkeleton = memo(({ height = 300 }: { height?: number }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
    <Skeleton className={`w-full`} style={{ height: `${height}px` }} />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
));

ChartSkeleton.displayName = "ChartSkeleton";

const ErrorState = memo(
  ({
    error,
    onRetry,
    onRefresh,
  }: {
    error: string;
    onRetry?: () => void;
    onRefresh?: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Failed to load chart data
        </p>
        <p className="text-xs text-red-500 max-w-md">{error}</p>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        )}
      </div>
    </div>
  )
);

ErrorState.displayName = "ErrorState";

export const ResponsiveChartWrapper = memo(function ResponsiveChartWrapper({
  children,
  minHeight = 200,
  maxHeight = 500,
  aspectRatio = 16 / 9,
}: ResponsiveChartWrapperProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    const width = window.innerWidth;
    let chartHeight = width / aspectRatio;

    // Apply min/max constraints
    chartHeight = Math.max(minHeight, Math.min(maxHeight, chartHeight));

    // Apply responsive height constraints
    // Keep the existing height calculation without theme-specific overrides

    setDimensions({ width, height: chartHeight });
  }, [aspectRatio, minHeight, maxHeight]);

  useEffect(() => {
    updateDimensions();

    // Throttle resize events for better performance
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    window.addEventListener("resize", throttledResize);

    return () => {
      window.removeEventListener("resize", throttledResize);
      clearTimeout(timeoutId);
    };
  }, [updateDimensions]);

  return (
    <motion.div
      className="w-full"
      style={{ height: dimensions.height || minHeight }}
      variants={chartFadeIn}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
});

export const ChartContainer = memo(function ChartContainer({
  title,
  children,
  isLoading = false,
  error,
  onRetry,
  onRefresh,
  className = "",
  headerActions,
  expandable = false,
}: ChartContainerProps) {
  const { resolvedTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize chart theme variables
  const chartThemeVars = useMemo(
    () => getChartCSSVariables(resolvedTheme),
    [resolvedTheme]
  );

  // Memoize callbacks
  const handleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleBackdropClick = useCallback(() => {
    setIsExpanded(false);
  }, []);

  if (!mounted) {
    return (
      <Card className={className} style={{ opacity: 0 }}>
        <CardContent className="p-6">
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      className={`${className} ${isExpanded ? "fixed inset-4 z-50" : ""}`}
      style={chartThemeVars}
      variants={slideUpVariants}
      initial="initial"
      animate="animate"
      data-motion-component
      onAnimationComplete={() => {
        // Mark as ready after animation completes
        const element = document.querySelector("[data-motion-component]");
        if (element) element.classList.add("motion-ready");
      }}
    >
      <Card
        className={`h-full ${isExpanded ? "shadow-2xl" : ""}`}
        data-testid="chart-container"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {headerActions}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            )}
            {expandable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpand}
                className="h-8 w-8 p-0"
                aria-label={isExpanded ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          {isLoading ? (
            <ChartSkeleton />
          ) : error ? (
            <ErrorState error={error} onRetry={onRetry} onRefresh={onRefresh} />
          ) : (
            <ResponsiveChartWrapper
              minHeight={isExpanded ? 400 : 200}
              maxHeight={isExpanded ? 800 : 500}
            >
              <motion.div
                key={resolvedTheme}
                variants={chartFadeIn}
                initial="initial"
                animate="animate"
                className="h-full"
              >
                {children}
              </motion.div>
            </ResponsiveChartWrapper>
          )}
        </CardContent>
      </Card>

      {/* Backdrop for expanded view */}
      {isExpanded && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleBackdropClick}
        />
      )}
    </motion.div>
  );
});
