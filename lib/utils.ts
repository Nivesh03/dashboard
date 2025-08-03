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
