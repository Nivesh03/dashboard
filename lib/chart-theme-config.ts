/**
 * Centralized chart theme configuration utility for next-themes integration
 * Provides theme-aware color mappings and utility functions for chart components
 */

// Chart color scheme interfaces for both light and dark modes
export interface ChartColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  mutedForeground: string;
  background: string;
  foreground: string;
  border: string;
  grid: string;
  chart: string[];
}

export interface ChartThemeConfig {
  light: ChartColorScheme;
  dark: ChartColorScheme;
}

// Enhanced chart theme configuration with next-themes compatibility
export const chartThemeConfig: ChartThemeConfig = {
  light: {
    primary: "hsl(221.2 83.2% 53.3%)",
    secondary: "hsl(210 40% 96%)",
    accent: "hsl(210 40% 90%)",
    muted: "hsl(210 40% 96%)",
    mutedForeground: "hsl(215.4 16.3% 46.9%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    border: "hsl(214.3 31.8% 91.4%)",
    grid: "hsl(214.3 31.8% 91.4%)",
    chart: [
      "hsl(221.2 83.2% 53.3%)", // Primary blue
      "hsl(142.1 76.2% 36.3%)", // Green
      "hsl(24.6 95% 53.1%)", // Orange
      "hsl(346.8 77.2% 49.8%)", // Red
      "hsl(262.1 83.3% 57.8%)", // Purple
      "hsl(173.4 58.9% 39.1%)", // Teal
      "hsl(43.3 96.4% 56.3%)", // Yellow
      "hsl(280.4 89.1% 61.2%)", // Pink
    ],
  },
  dark: {
    primary: "hsl(217.2 91.2% 59.8%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    accent: "hsl(217.2 32.6% 17.5%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    mutedForeground: "hsl(215 20.2% 65.1%)",
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    border: "hsl(217.2 32.6% 17.5%)",
    grid: "hsl(217.2 32.6% 17.5%)",
    chart: [
      "hsl(217.2 91.2% 59.8%)", // Primary blue
      "hsl(142.1 70.6% 45.3%)", // Green
      "hsl(24.6 95% 53.1%)", // Orange
      "hsl(346.8 77.2% 49.8%)", // Red
      "hsl(262.1 83.3% 57.8%)", // Purple
      "hsl(173.4 58.9% 39.1%)", // Teal
      "hsl(43.3 96.4% 56.3%)", // Yellow
      "hsl(280.4 89.1% 61.2%)", // Pink
    ],
  },
};

// Gradient configurations for enhanced chart visuals
export interface ChartGradientConfig {
  [key: string]: {
    start: string;
    end: string;
    opacity?: {
      start: number;
      end: number;
    };
  };
}

export const chartGradients: {
  light: ChartGradientConfig;
  dark: ChartGradientConfig;
} = {
  light: {
    primary: {
      start: "hsl(221.2 83.2% 53.3%)",
      end: "hsl(221.2 83.2% 53.3%)",
      opacity: { start: 0.8, end: 0.1 },
    },
    success: {
      start: "hsl(142.1 76.2% 36.3%)",
      end: "hsl(142.1 76.2% 36.3%)",
      opacity: { start: 0.8, end: 0.1 },
    },
    warning: {
      start: "hsl(24.6 95% 53.1%)",
      end: "hsl(24.6 95% 53.1%)",
      opacity: { start: 0.8, end: 0.1 },
    },
    danger: {
      start: "hsl(346.8 77.2% 49.8%)",
      end: "hsl(346.8 77.2% 49.8%)",
      opacity: { start: 0.8, end: 0.1 },
    },
  },
  dark: {
    primary: {
      start: "hsl(217.2 91.2% 59.8%)",
      end: "hsl(217.2 91.2% 59.8%)",
      opacity: { start: 0.8, end: 0.1 },
    },
    success: {
      start: "hsl(142.1 70.6% 45.3%)",
      end: "hsl(142.1 70.6% 45.3%)",
      opacity: { start: 0.8, end: 0.1 },
    },
    warning: {
      start: "hsl(24.6 95% 53.1%)",
      end: "hsl(24.6 95% 53.1%)",
      opacity: { start: 0.8, end: 0.1 },
    },
    danger: {
      start: "hsl(346.8 77.2% 49.8%)",
      end: "hsl(346.8 77.2% 49.8%)",
      opacity: { start: 0.8, end: 0.1 },
    },
  },
};

/**
 * Get theme-specific chart colors based on resolved theme
 * @param resolvedTheme - The resolved theme from next-themes ('light' or 'dark')
 * @returns ChartColorScheme for the current theme
 */
export function getChartColors(
  resolvedTheme: string | undefined
): ChartColorScheme {
  const isDark = resolvedTheme === "dark";
  return isDark ? chartThemeConfig.dark : chartThemeConfig.light;
}

/**
 * Get a specific chart color by index
 * @param resolvedTheme - The resolved theme from next-themes
 * @param index - Color index (0-7)
 * @returns Color string for the specified index
 */
export function getChartColor(
  resolvedTheme: string | undefined,
  index: number
): string {
  const colors = getChartColors(resolvedTheme);
  return colors.chart[index % colors.chart.length];
}

/**
 * Get multiple chart colors for multi-series charts
 * @param resolvedTheme - The resolved theme from next-themes
 * @param count - Number of colors needed
 * @returns Array of color strings
 */
export function getChartColorPalette(
  resolvedTheme: string | undefined,
  count: number
): string[] {
  const colors = getChartColors(resolvedTheme);
  const palette: string[] = [];

  for (let i = 0; i < count; i++) {
    palette.push(colors.chart[i % colors.chart.length]);
  }

  return palette;
}

/**
 * Get gradient configuration for a specific gradient type
 * @param resolvedTheme - The resolved theme from next-themes
 * @param gradientType - Type of gradient ('primary', 'success', 'warning', 'danger')
 * @returns Gradient configuration object
 */
export function getChartGradient(
  resolvedTheme: string | undefined,
  gradientType: keyof ChartGradientConfig
): ChartGradientConfig[keyof ChartGradientConfig] {
  const isDark = resolvedTheme === "dark";
  const gradients = isDark ? chartGradients.dark : chartGradients.light;
  return gradients[gradientType] || gradients.primary;
}

/**
 * Generate CSS custom properties for chart theming
 * Compatible with next-themes and provides smooth transitions
 * @param resolvedTheme - The resolved theme from next-themes
 * @returns CSS custom properties object
 */
export function getChartCSSVariables(
  resolvedTheme: string | undefined
): React.CSSProperties {
  const colors = getChartColors(resolvedTheme);

  return {
    "--chart-background": colors.background,
    "--chart-foreground": colors.foreground,
    "--chart-muted": colors.muted,
    "--chart-muted-foreground": colors.mutedForeground,
    "--chart-border": colors.border,
    "--chart-grid": colors.grid,
    "--chart-primary": colors.primary,
    "--chart-secondary": colors.secondary,
    "--chart-accent": colors.accent,
    "--chart-1": colors.chart[0],
    "--chart-2": colors.chart[1],
    "--chart-3": colors.chart[2],
    "--chart-4": colors.chart[3],
    "--chart-5": colors.chart[4],
    "--chart-6": colors.chart[5],
    "--chart-7": colors.chart[6],
    "--chart-8": colors.chart[7],
  } as React.CSSProperties;
}

/**
 * Get theme-aware tooltip styles
 * @param resolvedTheme - The resolved theme from next-themes
 * @returns Tooltip style configuration
 */
export function getTooltipStyles(resolvedTheme: string | undefined) {
  const colors = getChartColors(resolvedTheme);

  return {
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    boxShadow:
      resolvedTheme === "dark"
        ? "0 10px 25px rgba(0, 0, 0, 0.5)"
        : "0 10px 25px rgba(0, 0, 0, 0.1)",
    color: colors.foreground,
    fontSize: "14px",
    padding: "12px 16px",
  };
}

/**
 * Get theme-aware grid styles for charts
 * @param resolvedTheme - The resolved theme from next-themes
 * @returns Grid style configuration
 */
export function getGridStyles(resolvedTheme: string | undefined) {
  const colors = getChartColors(resolvedTheme);

  return {
    stroke: colors.grid,
    strokeDasharray: "3 3",
    opacity: 0.4,
  };
}

/**
 * Get theme-aware axis styles for charts
 * @param resolvedTheme - The resolved theme from next-themes
 * @returns Axis style configuration
 */
export function getAxisStyles(resolvedTheme: string | undefined) {
  const colors = getChartColors(resolvedTheme);

  return {
    tick: {
      fontSize: 12,
      fill: colors.mutedForeground,
      fontWeight: 500,
    },
    axisLine: false,
    tickLine: false,
  };
}

/**
 * Get gradient definition properties for SVG charts
 * @param id - Unique identifier for the gradient
 * @param resolvedTheme - The resolved theme from next-themes
 * @param gradientType - Type of gradient to create
 * @returns Gradient properties object
 */
export function getChartGradientProps(
  resolvedTheme: string | undefined,
  gradientType: keyof ChartGradientConfig = "primary"
) {
  const gradient = getChartGradient(resolvedTheme, gradientType);

  return {
    start: {
      offset: "0%",
      stopColor: gradient.start,
      stopOpacity: gradient.opacity?.start || 0.8,
    },
    end: {
      offset: "100%",
      stopColor: gradient.end,
      stopOpacity: gradient.opacity?.end || 0.1,
    },
  };
}

// Types are already exported above with their definitions
