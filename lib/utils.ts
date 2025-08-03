import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format number values with commas
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

// Format percentage values
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Format metric values based on type
export function formatMetricValue(
  value: number,
  format: "currency" | "number" | "percentage"
): string {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "number":
      return formatNumber(value);
    case "percentage":
      return formatPercentage(value);
    default:
      return value.toString();
  }
}

// Calculate percentage change
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// Debounce function for search inputs
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate random color for charts
export function generateChartColor(index: number): string {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];
  return colors[index % colors.length];
}

// Data transformation utilities for different chart types
export function transformDataForLineChart<T extends { date: string; value: number }>(
  data: T[]
): T[] {
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function transformDataForBarChart<T extends { name: string; value: number }>(
  data: T[]
): T[] {
  return data.sort((a, b) => b.value - a.value);
}

export function transformDataForPieChart<T extends { name: string; value: number }>(
  data: T[]
): (T & { percentage: number })[] {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return data.map(item => ({
    ...item,
    percentage: (item.value / total) * 100
  }));
}

// Aggregate data by time period
export function aggregateDataByPeriod<T extends { date: string; value: number }>(
  data: T[],
  period: 'day' | 'week' | 'month'
): { date: string; value: number }[] {
  const aggregated = new Map<string, number>();
  
  data.forEach(item => {
    const date = new Date(item.date);
    let key: string;
    
    switch (period) {
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
        break;
      default:
        key = item.date;
    }
    
    aggregated.set(key, (aggregated.get(key) || 0) + item.value);
  });
  
  return Array.from(aggregated.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Calculate moving average for trend analysis
export function calculateMovingAverage<T extends { value: number }>(
  data: T[],
  windowSize: number = 7
): (T & { movingAverage: number })[] {
  return data.map((item, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const window = data.slice(start, index + 1);
    const average = window.reduce((sum, w) => sum + w.value, 0) / window.length;
    
    return {
      ...item,
      movingAverage: Math.round(average * 100) / 100
    };
  });
}
