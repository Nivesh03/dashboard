"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryData } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/providers/theme-provider";
import { TrendingUp, BarChart3, Activity, Target } from "lucide-react";
import { useMemo, useState } from "react";

interface EnhancedBarChartProps {
  data: CategoryData[];
  title: string;
  dataKey: string;
  categoryKey?: string;
  colors?: string[];
  isLoading?: boolean;
  error?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
  showStats?: boolean;
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
        transition={{ duration: 0.2, ease: "easeOut", type: "spring", stiffness: 300 }}
        className="bg-background/98 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl p-5 min-w-[200px] relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {label}
              </p>
              <p className="text-xs text-muted-foreground">
                Channel Performance
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

const EnhancedBarChartSkeleton = ({ height = 350 }: { height?: number }) => (
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
        <Skeleton className={`w-full rounded-lg`} style={{ height: `${height}px` }} />
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function EnhancedBarChart({
  data,
  title,
  dataKey,
  categoryKey = "name",
  colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ],
  isLoading = false,
  error,
  height = 350,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  formatValue,
  showStats = true,
}: EnhancedBarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d[dataKey as keyof CategoryData] as number);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
    const topPerformer = data.find(d => (d[dataKey as keyof CategoryData] as number) === maxValue);

    return {
      maxValue,
      minValue,
      avgValue,
      topPerformer: topPerformer?.[categoryKey as keyof CategoryData] as string,
      total: values.reduce((sum, val) => sum + val, 0),
    };
  }, [data, dataKey, categoryKey]);

  if (isLoading) {
    return <EnhancedBarChartSkeleton height={height} />;
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Failed to load chart data
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
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Filter visible data
  const visibleData = data.filter(item => !hiddenSeries.has(item[categoryKey as keyof CategoryData] as string));

  // Enhanced color scheme based on theme
  const chartColors = {
    grid: isDark ? "hsl(217.2 32.6% 17.5%)" : "hsl(214.3 31.8% 91.4%)",
    text: isDark ? "hsl(215 20.2% 65.1%)" : "hsl(215.4 16.3% 46.9%)",
  };

  const handleLegendToggle = (name: string) => {
    const newHiddenSeries = new Set(hiddenSeries);
    if (newHiddenSeries.has(name)) {
      newHiddenSeries.delete(name);
    } else {
      newHiddenSeries.add(name);
    }
    setHiddenSeries(newHiddenSeries);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/10 backdrop-blur-sm">
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-chart-2/20 to-chart-2/10 border border-chart-2/20">
                <BarChart3 className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  {title}
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Performance comparison across channels
                </p>
              </div>
            </div>
            <AnimatePresence>
              {stats && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Badge 
                    variant="default"
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Top: {stats.topPerformer}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div style={{ width: '100%', height: height }}>
            <ResponsiveContainer width="100%" height={height}>
              <RechartsBarChart
                data={visibleData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <defs>
                  {colors.map((color, index) => (
                    <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor={color}
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  ))}
                </defs>

                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartColors.grid}
                    opacity={0.4}
                    horizontal={true}
                    vertical={false}
                  />
                )}

                <XAxis
                  dataKey={categoryKey}
                  tick={{ 
                    fontSize: 12, 
                    fill: chartColors.text,
                    fontWeight: 500
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />

                <YAxis
                  tickFormatter={(value) =>
                    formatValue ? formatValue(value) : value.toLocaleString()
                  }
                  tick={{ 
                    fontSize: 12, 
                    fill: chartColors.text,
                    fontWeight: 500
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />

                <Bar
                  dataKey={dataKey}
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {visibleData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#barGradient${index % colors.length})`}
                      stroke={entry.color || colors[index % colors.length]}
                      strokeWidth={2}
                    />
                  ))}
                </Bar>

                {showTooltip && (
                  <Tooltip
                    content={<CustomTooltip formatValue={formatValue} />}
                    cursor={{
                      fill: isDark ? "hsl(217.2 32.6% 17.5%)" : "hsl(214.3 31.8% 91.4%)",
                      opacity: 0.3,
                      radius: 4,
                    }}
                    allowEscapeViewBox={{ x: false, y: true }}
                    animationDuration={200}
                  />
                )}
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          {/* Enhanced Legend */}
          {showLegend && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50"
            >
              {data.map((item, index) => {
                const name = item[categoryKey as keyof CategoryData] as string;
                const isVisible = !hiddenSeries.has(name);
                return (
                  <motion.button
                    key={name}
                    onClick={() => handleLegendToggle(name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isVisible 
                        ? 'bg-muted/50 text-foreground hover:bg-muted/70' 
                        : 'text-muted-foreground opacity-50 hover:opacity-70'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ 
                        backgroundColor: isVisible ? (item.color || colors[index % colors.length]) : 'transparent',
                        border: `2px solid ${item.color || colors[index % colors.length]}`
                      }}
                    />
                    <span className="truncate max-w-[100px]" title={name}>
                      {name}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Enhanced Stats Summary */}
          {stats && showStats && (
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
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Highest</p>
                  </div>
                  <p className="text-sm font-bold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {formatValue ? formatValue(stats.maxValue) : stats.maxValue.toLocaleString()}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="text-center group cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-2 hover:bg-muted/50 hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-1">
                    <Activity className="h-3 w-3 text-blue-500 mr-1" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Average</p>
                  </div>
                  <p className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {formatValue ? formatValue(stats.avgValue) : Math.round(stats.avgValue).toLocaleString()}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="text-center group cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-2 hover:bg-muted/50 hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-1">
                    <Target className="h-3 w-3 text-purple-500 mr-1" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</p>
                  </div>
                  <p className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {formatValue ? formatValue(stats.total) : stats.total.toLocaleString()}
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