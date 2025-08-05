"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryData } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { 
  getChartColors, 
  getChartColorPalette, 
  getChartCSSVariables
} from "@/lib/chart-theme-config";
import { PieChart as PieChartIcon, Activity, Target, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

interface EnhancedPieChartProps {
  data: CategoryData[];
  title: string;
  dataKey: string;
  nameKey?: string;
  colors?: string[];
  isLoading?: boolean;
  error?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  showLabels?: boolean;
  showPercentages?: boolean;
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
  total?: number;
}

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  name?: string;
  showPercentages?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  formatValue,
  total = 0,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value as number;
    const formattedValue = formatValue
      ? formatValue(value)
      : value.toLocaleString();
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut", type: "spring", stiffness: 300 }}
        className="bg-background/98 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl p-5 min-w-[220px] relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-chart-3/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/20">
              <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {data.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Traffic Distribution
              </p>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t border-border/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Value:</span>
              <span className="text-lg font-bold text-foreground">
                {formattedValue}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Share:</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full shadow-lg border-2 border-background"
                  style={{ backgroundColor: data.color }}
                />
                <span className="text-lg font-bold text-foreground">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

const CustomLabel = ({ 
  cx, 
  cy, 
  midAngle, 
  innerRadius, 
  outerRadius, 
  percent, 
  name,
  showPercentages = true
}: CustomLabelProps) => {
  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent) return null;
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-bold drop-shadow-lg"
      style={{ 
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))'
      }}
    >
      {showPercentages ? `${(percent * 100).toFixed(0)}%` : name}
    </text>
  );
};

const EnhancedPieChartSkeleton = ({ height = 350 }: { height?: number }) => (
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
        <div className="flex justify-center">
          <Skeleton className="w-48 h-48 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function EnhancedPieChart({
  data,
  title,
  dataKey,
  nameKey = "name",
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
  innerRadius = 0,
  outerRadius = 120,
  showTooltip = true,
  showLegend = true,
  showLabels = true,
  showPercentages = true,
  formatValue,
  showStats = true,
}: EnhancedPieChartProps) {
  const { resolvedTheme } = useTheme();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  // Get theme-aware colors from centralized configuration
  const chartColors = getChartColors(resolvedTheme);
  const themeAwareColors = colors.length > 0 ? colors : getChartColorPalette(resolvedTheme, 8);
  const cssVariables = getChartCSSVariables(resolvedTheme);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d[dataKey as keyof CategoryData] as number);
    const total = values.reduce((sum, val) => sum + val, 0);
    const maxValue = Math.max(...values);
    const topSegment = data.find(d => (d[dataKey as keyof CategoryData] as number) === maxValue);
    const topPercentage = total > 0 ? (maxValue / total) * 100 : 0;

    return {
      total,
      maxValue,
      topSegment: topSegment?.[nameKey as keyof CategoryData] as string,
      topPercentage,
      segments: data.length,
    };
  }, [data, dataKey, nameKey]);

  if (isLoading) {
    return <EnhancedPieChartSkeleton height={height} />;
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

  // Filter visible data and calculate totals
  const visibleData = data.filter(item => !hiddenSeries.has(item[nameKey as keyof CategoryData] as string));
  const total = visibleData.reduce((sum, item) => sum + (item[dataKey as keyof CategoryData] as number), 0);

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
      className="relative overflow-hidden theme-transition"
      style={cssVariables}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/10 backdrop-blur-sm">
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-chart-3/20 to-chart-3/10 border border-chart-3/20">
                <PieChartIcon className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  {title}
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Distribution breakdown with percentages
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
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium shadow-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white border-0"
                  >
                    <TrendingUp className="h-4 w-4" />
                    {stats.segments} segments
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div style={{ width: '100%', height: height }}>
            <ResponsiveContainer width="100%" height={height}>
              <RechartsPieChart>
                <defs>
                  {themeAwareColors.map((color, index) => (
                    <filter key={index} id={`pieGlow${index}`}>
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  ))}
                </defs>
                <Pie
                  data={visibleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={showLabels ? (props) => (
                    <CustomLabel {...props} showPercentages={showPercentages} />
                  ) : false}
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  fill="#8884d8"
                  dataKey={dataKey}
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {visibleData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || themeAwareColors[index % themeAwareColors.length]}
                      stroke={chartColors.background}
                      strokeWidth={3}
                      filter={`url(#pieGlow${index % themeAwareColors.length})`}
                      style={{
                        filter: `drop-shadow(0 0 8px ${entry.color || themeAwareColors[index % themeAwareColors.length]}40)`,
                      }}
                    />
                  ))}
                </Pie>
                {showTooltip && (
                  <Tooltip
                    content={<CustomTooltip formatValue={formatValue} total={total} />}
                    animationDuration={200}
                  />
                )}
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Enhanced Legend */}
          {showLegend && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/50"
            >
              {data.map((item, index) => {
                const name = item[nameKey as keyof CategoryData] as string;
                const value = item[dataKey as keyof CategoryData] as number;
                const percentage = total > 0 ? (value / total) * 100 : 0;
                const isVisible = !hiddenSeries.has(name);
                
                return (
                  <motion.button
                    key={name}
                    onClick={() => handleLegendToggle(name)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      isVisible 
                        ? 'bg-muted/50 text-foreground hover:bg-muted/70' 
                        : 'text-muted-foreground opacity-50 hover:opacity-70'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="w-4 h-4 rounded-full shadow-lg flex-shrink-0"
                      style={{ 
                        backgroundColor: isVisible ? (item.color || colors[index % colors.length]) : 'transparent',
                        border: `2px solid ${item.color || colors[index % colors.length]}`
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{name}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatValue ? formatValue(value) : value.toLocaleString()}</span>
                        <span className="font-semibold">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
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
                    <Target className="h-3 w-3 text-orange-500 mr-1" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</p>
                  </div>
                  <p className="text-sm font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {formatValue ? formatValue(stats.total) : stats.total.toLocaleString()}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="text-center group cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-2 hover:bg-muted/50 hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Largest</p>
                  </div>
                  <p className="text-sm font-bold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {stats.topPercentage.toFixed(1)}%
                  </p>
                </motion.div>
                
                <motion.div 
                  className="text-center group cursor-pointer transition-all duration-200 ease-in-out rounded-lg p-2 hover:bg-muted/50 hover:-translate-y-0.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-1">
                    <PieChartIcon className="h-3 w-3 text-blue-500 mr-1" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Segments</p>
                  </div>
                  <p className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {stats.segments}
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