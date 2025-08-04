'use client';

import { lazy, Suspense } from 'react';
import { ChartSkeleton } from '../skeletons';
import { TimeSeriesData, CategoryData } from '@/lib/types';

// Lazy load chart components to reduce initial bundle size
const LineChartComponent = lazy(() => 
  import('./line-chart').then(module => ({ default: module.LineChart }))
);

const BarChartComponent = lazy(() => 
  import('./bar-chart').then(module => ({ default: module.BarChart }))
);

const PieChartComponent = lazy(() => 
  import('./pie-chart').then(module => ({ default: module.PieChart }))
);

// Lazy-loaded LineChart wrapper
interface LazyLineChartProps {
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

export function LazyLineChart(props: LazyLineChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
      <LineChartComponent {...props} />
    </Suspense>
  );
}

// Lazy-loaded BarChart wrapper
interface LazyBarChartProps {
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

export function LazyBarChart(props: LazyBarChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
      <BarChartComponent {...props} />
    </Suspense>
  );
}

// Lazy-loaded PieChart wrapper
interface LazyPieChartProps {
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

export function LazyPieChart(props: LazyPieChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton height={props.height || 300} />}>
      <PieChartComponent {...props} />
    </Suspense>
  );
}