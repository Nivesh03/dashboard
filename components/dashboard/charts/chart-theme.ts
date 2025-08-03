// Chart theme configuration for consistent styling across all chart components
export const chartTheme = {
  colors: {
    light: {
      primary: 'hsl(221.2 83.2% 53.3%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 90%)',
      muted: 'hsl(210 40% 96%)',
      mutedForeground: 'hsl(215.4 16.3% 46.9%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      grid: 'hsl(214.3 31.8% 91.4%)',
      chart: [
        'hsl(221.2 83.2% 53.3%)', // Primary blue
        'hsl(142.1 76.2% 36.3%)', // Green
        'hsl(24.6 95% 53.1%)',    // Orange
        'hsl(346.8 77.2% 49.8%)', // Red
        'hsl(262.1 83.3% 57.8%)', // Purple
        'hsl(173.4 58.9% 39.1%)', // Teal
        'hsl(43.3 96.4% 56.3%)',  // Yellow
        'hsl(280.4 89.1% 61.2%)', // Pink
      ]
    },
    dark: {
      primary: 'hsl(217.2 91.2% 59.8%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      mutedForeground: 'hsl(215 20.2% 65.1%)',
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      grid: 'hsl(217.2 32.6% 17.5%)',
      chart: [
        'hsl(217.2 91.2% 59.8%)', // Primary blue
        'hsl(142.1 70.6% 45.3%)', // Green
        'hsl(24.6 95% 53.1%)',    // Orange
        'hsl(346.8 77.2% 49.8%)', // Red
        'hsl(262.1 83.3% 57.8%)', // Purple
        'hsl(173.4 58.9% 39.1%)', // Teal
        'hsl(43.3 96.4% 56.3%)',  // Yellow
        'hsl(280.4 89.1% 61.2%)', // Pink
      ]
    }
  },
  
  // Responsive breakpoints for chart sizing
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1280
  },
  
  // Default chart dimensions based on screen size
  dimensions: {
    mobile: {
      height: 250,
      margin: { top: 5, right: 15, left: 15, bottom: 5 }
    },
    tablet: {
      height: 300,
      margin: { top: 5, right: 20, left: 20, bottom: 5 }
    },
    desktop: {
      height: 350,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }
  },
  
  // Animation settings
  animation: {
    duration: 1000,
    easing: 'ease-in-out'
  },
  
  // Typography settings
  typography: {
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16
    }
  }
};

// Helper function to get theme colors based on current theme
export function getChartColors(isDark: boolean) {
  return isDark ? chartTheme.colors.dark : chartTheme.colors.light;
}

// Helper function to get responsive dimensions
export function getResponsiveDimensions(width: number) {
  if (width < chartTheme.breakpoints.mobile) {
    return chartTheme.dimensions.mobile;
  } else if (width < chartTheme.breakpoints.tablet) {
    return chartTheme.dimensions.tablet;
  }
  return chartTheme.dimensions.desktop;
}

// CSS custom properties for chart theming
export function getChartCSSVariables(isDark: boolean) {
  const colors = getChartColors(isDark);
  
  return {
    '--chart-background': colors.background,
    '--chart-foreground': colors.foreground,
    '--chart-muted': colors.muted,
    '--chart-muted-foreground': colors.mutedForeground,
    '--chart-border': colors.border,
    '--chart-grid': colors.grid,
    '--chart-1': colors.chart[0],
    '--chart-2': colors.chart[1],
    '--chart-3': colors.chart[2],
    '--chart-4': colors.chart[3],
    '--chart-5': colors.chart[4],
    '--chart-6': colors.chart[5],
    '--chart-7': colors.chart[6],
    '--chart-8': colors.chart[7],
  } as React.CSSProperties;
}