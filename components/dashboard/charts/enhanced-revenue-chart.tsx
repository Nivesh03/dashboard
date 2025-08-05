"use client";

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { TimeSeriesData } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
} from "lucide-react";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { 
  getChartColors, 
  getChartGradient, 
  getChartCSSVariables,
  getAxisStyles,
  getGridStyles 
} from "@/lib/chart-theme-config";

interface EnhancedRevenueChartProps {
  data: TimeSeriesData[];
  title: string;
  dataKey: string;
  isLoading?: boolean;
  error?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  showTrend?: boolean;
  showGradient?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
  formatValue?: (value: number) => string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  formatValue,
}: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    const data = payload[0];
    const value = data.value as number;
    const formattedValue = formatValue
      ? formatValue(value)
      : value.toLocaleString();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
          type: "spring",
          stiffness: 300,
        }}
        className="bg-background/98 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl p-5 min-w-[220px] relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Daily Revenue
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(label).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-border/30">
            <div
              className="w-4 h-4 rounded-full shadow-lg border-2 border-background"
              style={{ backgroundColor: data.color }}
            />
            <div className="flex-1">
              <span className="text-xl font-bold text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                {formattedValue}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

const EnhancedRevenueChartSkeleton = ({
  height = 350,
}: {
  height?: number;
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton
          className={`w-full rounded-lg`}
          style={{ height: `${height}px` }}
        />
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function EnhancedRevenueChart({
  data,
  dataKey,
  isLoading = false,
  error,
  height = 350,
  showGrid = true,
  showTooltip = true,
  formatValue,
  showTrend = true,
  showGradient = true,
}: EnhancedRevenueChartProps) {
  const { resolvedTheme } = useTheme();

  // Calculate trend and statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const values = data.map((d) => d.value);
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;

    const trend = lastValue > firstValue ? "up" : "down";
    const trendPercentage = ((lastValue - firstValue) / firstValue) * 100;

    return {
      trend,
      trendPercentage,
      maxValue,
      minValue,
      avgValue,
      totalGrowth: lastValue - firstValue,
    };
  }, [data]);

  if (isLoading) {
    return <EnhancedRevenueChartSkeleton height={height} />;
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Failed to load revenue data
            </p>
            <p className="text-xs text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            No revenue data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get theme-aware colors from centralized configuration
  const chartColors = getChartColors(resolvedTheme);
  const primaryGradient = getChartGradient(resolvedTheme, 'primary');
  const axisStyles = getAxisStyles(resolvedTheme);
  const gridStyles = getGridStyles(resolvedTheme);
  const cssVariables = getChartCSSVariables(resolvedTheme);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden theme-transition"
      style={{
        ...cssVariables,
        "--chart-glow": resolvedTheme === "dark"
          ? "0 0 12px hsl(var(--chart-1) / 0.4)"
          : "0 0 8px hsl(var(--chart-1) / 0.3)",
      } as React.CSSProperties}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/10 backdrop-blur-sm">
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-chart-1/20 to-chart-1/10 border border-chart-1/20">
                <BarChart3 className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  Revenue Trend
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Daily revenue performance with trend analysis
                </p>
              </div>
            </div>
            <AnimatePresence>
              {stats && showTrend && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="revenue-trend-indicator"
                >
                  <Badge
                    variant={stats.trend === "up" ? "default" : "destructive"}
                    className={`flex items-center gap-1 px-3 py-1 text-sm font-medium shadow-lg ${
                      stats.trend === "up"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
                        : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0"
                    }`}
                  >
                    {stats.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {Math.abs(stats.trendPercentage).toFixed(1)}%
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div style={{ width: "100%", height: height }}>
            <ResponsiveContainer>
              <ComposedChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={primaryGradient.start}
                      stopOpacity={primaryGradient.opacity?.start || 0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={primaryGradient.end}
                      stopOpacity={primaryGradient.opacity?.end || 0.05}
                    />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {showGrid && (
                  <CartesianGrid
                    {...gridStyles}
                    horizontal={true}
                    vertical={false}
                  />
                )}

                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  tick={axisStyles.tick}
                  axisLine={axisStyles.axisLine}
                  tickLine={axisStyles.tickLine}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />

                <YAxis
                  tickFormatter={(value) =>
                    formatValue
                      ? formatValue(value)
                      : `$${(value / 1000).toFixed(0)}k`
                  }
                  tick={axisStyles.tick}
                  axisLine={axisStyles.axisLine}
                  tickLine={axisStyles.tickLine}
                  width={70}
                />

                {/* Average line */}
                {stats && (
                  <ReferenceLine
                    y={stats.avgValue}
                    stroke={chartColors.mutedForeground}
                    strokeDasharray="5 5"
                    strokeOpacity={0.5}
                    label={{
                      value: "Avg",
                      position: "insideTopRight",
                      fontSize: 10,
                      fill: chartColors.mutedForeground,
                    }}
                  />
                )}

                {showGradient && (
                  <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke="none"
                    fill="url(#revenueGradient)"
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                )}

                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={chartColors.primary}
                  strokeWidth={3}
                  dot={{
                    fill: chartColors.primary,
                    strokeWidth: 2,
                    r: 4,
                    stroke: resolvedTheme === "dark" ? chartColors.background : chartColors.background,
                  }}
                  activeDot={{
                    r: 8,
                    fill: chartColors.primary,
                    stroke: resolvedTheme === "dark" ? chartColors.background : chartColors.background,
                    strokeWidth: 3,
                    filter: "url(#glow)",
                    style: { cursor: "pointer" },
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />

                {showTooltip && (
                  <Tooltip
                    content={<CustomTooltip formatValue={formatValue} />}
                    cursor={{
                      stroke: chartColors.primary,
                      strokeWidth: 2,
                      strokeDasharray: "5 5",
                      strokeOpacity: 0.7,
                    }}
                    allowEscapeViewBox={{ x: false, y: true }}
                    animationDuration={200}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Enhanced Stats Summary */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="mt-6 pt-4 border-t border-gradient-to-r from-transparent via-border to-transparent"
            >
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  className="text-center group cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-2 hover:bg-muted/50 hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="h-3 w-3 text-blue-500 mr-1" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Peak
                    </p>
                  </div>
                  <p className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {formatValue
                      ? formatValue(stats.maxValue)
                      : `$${stats.maxValue.toLocaleString()}`}
                  </p>
                </motion.div>

                <motion.div
                  className="text-center group cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-2 hover:bg-muted/50 hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-1">
                    <Activity className="h-3 w-3 text-purple-500 mr-1" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Average
                    </p>
                  </div>
                  <p className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {formatValue
                      ? formatValue(stats.avgValue)
                      : `$${Math.round(stats.avgValue).toLocaleString()}`}
                  </p>
                </motion.div>

                <motion.div
                  className="text-center group cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-2 hover:bg-muted/50 hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-1">
                    {stats.totalGrowth >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Growth
                    </p>
                  </div>
                  <p
                    className={`text-sm font-bold transition-colors ${
                      stats.totalGrowth >= 0
                        ? "text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300"
                        : "text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300"
                    }`}
                  >
                    {stats.totalGrowth >= 0 ? "+" : ""}
                    {formatValue
                      ? formatValue(stats.totalGrowth)
                      : `$${stats.totalGrowth.toLocaleString()}`}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
