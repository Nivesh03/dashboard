// Dashboard configuration constants
export const DASHBOARD_CONFIG = {
  name: 'ADmyBRAND Insights',
  description: 'AI-Powered Analytics Dashboard',
  version: '1.0.0',
} as const;

// Chart configuration
export const CHART_CONFIG = {
  defaultHeight: 300,
  animationDuration: 750,
  colors: {
    primary: 'hsl(var(--chart-1))',
    secondary: 'hsl(var(--chart-2))',
    tertiary: 'hsl(var(--chart-3))',
    quaternary: 'hsl(var(--chart-4))',
    quinary: 'hsl(var(--chart-5))',
  },
} as const;

// Table configuration
export const TABLE_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  maxVisiblePages: 5,
} as const;

// Theme configuration
export const THEME_CONFIG = {
  defaultTheme: 'light' as const,
  storageKey: 'dashboard-theme',
} as const;

// API configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Responsive breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;