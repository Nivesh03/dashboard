"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// TypeScript interfaces for theme configuration
export interface ThemeConfig {
  themes: string[];
  defaultTheme: string;
  storageKey: string;
  attribute: "class" | "data-theme";
  enableSystem: boolean;
  disableTransitionOnChange: boolean;
}

export interface NextThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  themes?: string[];
}

// Default theme configuration based on design requirements
const defaultThemeConfig: ThemeConfig = {
  themes: ["light", "dark", "system"],
  defaultTheme: "system",
  storageKey: "dashboard-theme",
  attribute: "class" as const,
  enableSystem: true,
  disableTransitionOnChange: false,
};

export function NextThemeProvider({
  children,
  attribute = defaultThemeConfig.attribute,
  defaultTheme = defaultThemeConfig.defaultTheme,
  enableSystem = defaultThemeConfig.enableSystem,
  disableTransitionOnChange = defaultThemeConfig.disableTransitionOnChange,
  storageKey = defaultThemeConfig.storageKey,
  themes = defaultThemeConfig.themes,
  ...props
}: NextThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      storageKey={storageKey}
      themes={themes}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

// Re-export useTheme hook from next-themes for convenience
export { useTheme } from "next-themes";
