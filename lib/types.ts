import { LucideIcon } from "lucide-react";

// Core metric card interface
export interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  format: 'currency' | 'number' | 'percentage';
}

// Chart data interfaces
export interface ChartData {
  id: string;
  name: string;
  value: number;
  date?: string;
  category?: string;
}

export interface TimeSeriesData extends ChartData {
  date: string;
  previousValue?: number;
}

export interface CategoryData extends ChartData {
  category: string;
  color?: string;
}

// Table data interface
export interface TableRow {
  id: string;
  campaign: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  roas: number;
  date: string;
  status?: 'active' | 'paused' | 'completed';
}

// Filter and sorting interfaces
export interface TableFilter {
  column: keyof TableRow;
  value: string | number;
  operator: 'equals' | 'contains' | 'greater' | 'less';
}

export interface SortConfig {
  column: keyof TableRow;
  direction: 'asc' | 'desc';
}

// Theme and UI interfaces
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
}

// API response interfaces
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: Date;
}

// Dashboard layout interfaces
export interface DashboardSection {
  id: string;
  title: string;
  component: React.ComponentType;
  gridArea?: string;
  minHeight?: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}