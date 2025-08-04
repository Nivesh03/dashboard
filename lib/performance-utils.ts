// Performance monitoring utilities for the dashboard

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

// Performance observer for monitoring chart rendering
export class ChartPerformanceMonitor {
  private static instance: ChartPerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observer: PerformanceObserver | null = null;

  static getInstance(): ChartPerformanceMonitor {
    if (!ChartPerformanceMonitor.instance) {
      ChartPerformanceMonitor.instance = new ChartPerformanceMonitor();
    }
    return ChartPerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      this.initializeObserver();
    }
  }

  private initializeObserver() {
    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes("chart-render")) {
            this.recordMetric(entry.name, {
              loadTime: entry.startTime,
              renderTime: entry.duration,
              interactionTime: 0,
            });
          }
        });
      });

      this.observer.observe({ entryTypes: ["measure", "navigation", "paint"] });
    } catch (error) {
      console.warn("Performance monitoring not available:", error);
    }
  }

  // Mark the start of a chart rendering operation
  markStart(chartId: string) {
    if (typeof window !== "undefined" && window.performance) {
      performance.mark(`chart-render-start-${chartId}`);
    }
  }

  // Mark the end of a chart rendering operation
  markEnd(chartId: string) {
    if (typeof window !== "undefined" && window.performance) {
      performance.mark(`chart-render-end-${chartId}`);
      performance.measure(
        `chart-render-${chartId}`,
        `chart-render-start-${chartId}`,
        `chart-render-end-${chartId}`
      );
    }
  }

  // Record custom metrics
  recordMetric(chartId: string, metrics: PerformanceMetrics) {
    this.metrics.set(chartId, metrics);
  }

  // Get metrics for a specific chart
  getMetrics(chartId: string): PerformanceMetrics | undefined {
    return this.metrics.get(chartId);
  }

  // Get all metrics
  getAllMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  // Clear metrics
  clearMetrics() {
    this.metrics.clear();
    if (typeof window !== "undefined" && window.performance) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }

  // Get memory usage if available
  getMemoryUsage(): number | undefined {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (
        performance as unknown as { memory: { usedJSHeapSize: number } }
      ).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return undefined;
  }

  // Log performance summary
  logPerformanceSummary() {
    if (this.metrics.size === 0) return;

    console.group("📊 Chart Performance Summary");

    this.metrics.forEach((metrics, chartId) => {
      console.log(`${chartId}:`, {
        "Load Time": `${metrics.loadTime.toFixed(2)}ms`,
        "Render Time": `${metrics.renderTime.toFixed(2)}ms`,
        "Interaction Time": `${metrics.interactionTime.toFixed(2)}ms`,
        "Memory Usage": metrics.memoryUsage
          ? `${metrics.memoryUsage.toFixed(2)}MB`
          : "N/A",
      });
    });

    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage) {
      console.log("Current Memory Usage:", `${memoryUsage.toFixed(2)}MB`);
    }

    console.groupEnd();
  }

  // Cleanup
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.clearMetrics();
  }
}

// Utility functions for performance optimization

// Debounce function for performance-critical operations
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

// Throttle function for scroll/resize events
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Check if device has limited resources
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;

  // Check for various indicators of low-end devices
  const connection = (
    navigator as unknown as { connection?: { effectiveType: string } }
  ).connection;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const memory = (
    performance as unknown as { memory?: { jsHeapSizeLimit: number } }
  ).memory;

  return (
    hardwareConcurrency <= 2 ||
    (memory && memory.jsHeapSizeLimit < 1073741824) || // Less than 1GB
    (connection &&
      (connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g")) ||
    false
  );
}

// Optimize chart data for low-end devices
export function optimizeDataForDevice<T>(
  data: T[],
  maxPoints: number = 50
): T[] {
  if (!isLowEndDevice() || data.length <= maxPoints) {
    return data;
  }

  // Sample data points to reduce complexity
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
}

// Preload critical resources
export function preloadChartLibraries() {
  if (typeof window === "undefined") return;

  // Preload Recharts chunks
  const link = document.createElement("link");
  link.rel = "modulepreload";
  link.href = "/node_modules/recharts/es6/index.js";
  document.head.appendChild(link);
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window === "undefined") return;

  const monitor = ChartPerformanceMonitor.getInstance();

  // Log performance summary on page unload
  window.addEventListener("beforeunload", () => {
    monitor.logPerformanceSummary();
  });

  // Log performance summary in development
  if (process.env.NODE_ENV === "development") {
    setTimeout(() => {
      monitor.logPerformanceSummary();
    }, 5000);
  }

  return monitor;
}
