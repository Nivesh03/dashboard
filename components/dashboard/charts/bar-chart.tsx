'use client';

import { 
  BarChart as RechartsBarChart, 
  Bar, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CategoryData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface BarChartProps {
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
}

interface LegendItem {
  value: string;
  color: string;
  visible: boolean;
}

const CustomTooltip = ({ active, payload, label, formatValue }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value as number;
    const formattedValue = formatValue ? formatValue(value) : value.toLocaleString();
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3"
      >
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-sm text-muted-foreground">
          <span 
            className="inline-block w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: data.color }}
          />
          {data.name}: <span className="font-semibold text-foreground">{formattedValue}</span>
        </p>
      </motion.div>
    );
  }
  return null;
};

const InteractiveLegend = ({ 
  items, 
  onToggle 
}: { 
  items: LegendItem[]; 
  onToggle: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 mt-4">
    {items.map((item) => (
      <Button
        key={item.value}
        variant="ghost"
        size="sm"
        onClick={() => onToggle(item.value)}
        className={`h-8 px-3 text-xs transition-all ${
          item.visible 
            ? 'bg-muted/50 text-foreground' 
            : 'text-muted-foreground opacity-50'
        }`}
      >
        <span 
          className="inline-block w-3 h-3 rounded-full mr-2" 
          style={{ backgroundColor: item.visible ? item.color : 'transparent' }}
        />
        {item.value}
      </Button>
    ))}
  </div>
);

const BarChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className={`w-full`} style={{ height: `${height}px` }} />
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Failed to load chart data</p>
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

export function BarChart({
  data,
  title,
  dataKey,
  categoryKey = 'name',
  colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'],
  isLoading = false,
  error,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  formatValue,
  onRetry
}: BarChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  if (isLoading) {
    return <BarChartSkeleton height={height} />;
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

  // Filter out hidden series
  const visibleData = data.filter(item => !hiddenSeries.has(item[categoryKey as keyof CategoryData] as string));

  // Create legend items
  const legendItems: LegendItem[] = data.map((item, index) => ({
    value: item[categoryKey as keyof CategoryData] as string,
    color: item.color || colors[index % colors.length],
    visible: !hiddenSeries.has(item[categoryKey as keyof CategoryData] as string)
  }));

  const handleLegendToggle = (value: string) => {
    const newHiddenSeries = new Set(hiddenSeries);
    if (newHiddenSeries.has(value)) {
      newHiddenSeries.delete(value);
    } else {
      newHiddenSeries.add(value);
    }
    setHiddenSeries(newHiddenSeries);
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={visibleData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
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
            dataKey={categoryKey}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => formatValue ? formatValue(value) : value.toLocaleString()}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          {showTooltip && (
            <Tooltip
              content={<CustomTooltip formatValue={formatValue} />}
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
            />
          )}
          <Bar
            dataKey={dataKey}
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-in-out"
          >
            {visibleData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
      
      {showLegend && (
        <InteractiveLegend 
          items={legendItems}
          onToggle={handleLegendToggle}
        />
      )}
    </div>
  );
}