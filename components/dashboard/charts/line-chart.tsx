"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { TimeSeriesData } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TouchFriendlyTooltip } from "../touch-friendly-tooltip";

interface LineChartProps {
  data: TimeSeriesData[];
  title: string;
  dataKey: string;
  color?: string;
  isLoading?: boolean;
  error?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3"
      >
        <p className="text-sm font-medium text-foreground">
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-sm text-muted-foreground">
          <span
            className="inline-block w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: data.color }}
          />
          {data.name}:{" "}
          <span className="font-semibold text-foreground">
            {formattedValue}
          </span>
        </p>
      </motion.div>
    );
  }
  return null;
};

const LineChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className={`w-full`} style={{ height: `${height}px` }} />
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
          <button
            onClick={onRetry}
            className="text-xs text-primary hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    </CardContent>
  </Card>
);

export function LineChart({
  data,
  dataKey,
  color = "hsl(var(--chart-1))",
  isLoading = false,
  error,
  height = 300,
  showGrid = true,
  showTooltip = true,
  formatValue,
}: LineChartProps) {
  if (isLoading) {
    return <LineChartSkeleton height={height} />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{
          top: 5,
          right: 15,
          left: 10,
          bottom: 5,
        }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
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
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis
          tickFormatter={(value) =>
            formatValue ? formatValue(value) : value.toLocaleString()
          }
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        {showTooltip && (
          <Tooltip
            content={<TouchFriendlyTooltip formatValue={formatValue} />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "5 5" }}
            allowEscapeViewBox={{ x: false, y: true }}
            position={{ x: undefined, y: undefined }}
          />
        )}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2, r: 3 }}
          activeDot={{
            r: 8, // Larger for touch devices
            fill: color,
            stroke: "hsl(var(--background))",
            strokeWidth: 2,
          }}
          animationDuration={1000}
          animationEasing="ease-in-out"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
