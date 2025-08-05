"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";
import { CategoryData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface PieChartProps {
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
  onRetry?: () => void;
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
  showPercentages?: boolean;
  total?: number;
}

interface LegendItem {
  name: string;
  value: number;
  color: string;
  visible: boolean;
  percentage: number;
}

const CustomTooltip = ({
  active,
  payload,
  formatValue,
  showPercentages = true,
  total = 0,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value as number;
    const formattedValue = formatValue
      ? formatValue(value)
      : value.toLocaleString();
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3"
      >
        <p className="text-sm font-medium text-foreground mb-1">{data.name}</p>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: data.color }}
            />
            Value:{" "}
            <span className="font-semibold text-foreground">
              {formattedValue}
            </span>
          </p>
          {showPercentages && (
            <p className="text-sm text-muted-foreground">
              Percentage:{" "}
              <span className="font-semibold text-foreground">
                {percentage}%
              </span>
            </p>
          )}
        </div>
      </motion.div>
    );
  }
  return null;
};

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

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  showPercentages = true,
}: CustomLabelProps) => {
  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent)
    return null;

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
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}
    >
      {showPercentages ? `${(percent * 100).toFixed(0)}%` : name}
    </text>
  );
};

const InteractiveLegend = ({
  items,
  onToggle,
  formatValue,
}: {
  items: LegendItem[];
  onToggle: (name: string) => void;
  formatValue?: (value: number) => string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
    {items.map((item) => (
      <Button
        key={item.name}
        variant="ghost"
        size="sm"
        onClick={() => onToggle(item.name)}
        className={`h-auto p-3 justify-start text-left transition-all ${
          item.visible
            ? "bg-muted/50 text-foreground"
            : "text-muted-foreground opacity-50"
        }`}
      >
        <div className="flex items-center space-x-3 w-full">
          <span
            className="inline-block w-4 h-4 rounded-full flex-shrink-0"
            style={{
              backgroundColor: item.visible ? item.color : "transparent",
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {formatValue
                  ? formatValue(item.value)
                  : item.value.toLocaleString()}
              </span>
              <span>{item.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </Button>
    ))}
  </div>
);

const PieChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
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

const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Failed to load chart data
        </p>
        <p className="text-xs text-red-500">{error}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            Try again
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export function PieChart({
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
  innerRadius = 0,
  outerRadius = 80,
  showTooltip = true,
  showLegend = true,
  showLabels = true,
  showPercentages = true,
  formatValue,
  onRetry,
}: PieChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  if (isLoading) {
    return <PieChartSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter out hidden series and calculate totals
  const visibleData = data.filter(
    (item) => !hiddenSeries.has(item[nameKey as keyof CategoryData] as string)
  );
  const total = visibleData.reduce(
    (sum, item) => sum + (item[dataKey as keyof CategoryData] as number),
    0
  );

  // Create legend items
  const legendItems: LegendItem[] = data.map((item, index) => {
    const value = item[dataKey as keyof CategoryData] as number;
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return {
      name: item[nameKey as keyof CategoryData] as string,
      value,
      color: item.color || colors[index % colors.length],
      visible: !hiddenSeries.has(item[nameKey as keyof CategoryData] as string),
      percentage,
    };
  });

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
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={visibleData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={
              showLabels
                ? (props) => (
                    <CustomLabel {...props} showPercentages={showPercentages} />
                  )
                : false
            }
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            animationBegin={0}
            animationDuration={1000}
          >
            {visibleData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || colors[index % colors.length]}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              content={
                <CustomTooltip
                  formatValue={formatValue}
                  showPercentages={showPercentages}
                  total={total}
                />
              }
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>

      {showLegend && (
        <InteractiveLegend
          items={legendItems}
          onToggle={handleLegendToggle}
          formatValue={formatValue}
        />
      )}
    </div>
  );
}
