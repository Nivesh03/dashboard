import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Metric card skeleton with enhanced animations
export function MetricCardSkeleton() {
  return (
    <Card className="animate-fade-in hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24 animate-shimmer" />
        <Skeleton className="h-4 w-4 animate-pulse-slow" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2 animate-shimmer" />
        <Skeleton className="h-3 w-16 animate-pulse-slow" />
      </CardContent>
    </Card>
  );
}

// Chart skeleton with enhanced animations
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card className="animate-slide-up hover-lift">
      <CardHeader>
        <Skeleton className="h-6 w-32 animate-shimmer" />
        <Skeleton className="h-4 w-48 animate-pulse-slow" />
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Skeleton className="w-full animate-shimmer" style={{ height: `${height}px` }} />
          {/* Animated chart-like elements */}
          <div className="absolute inset-4 flex items-end justify-between opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-primary/30 animate-pulse-slow rounded-t"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  width: '8%',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Table header */}
        <div className="flex space-x-4 mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex space-x-4 mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Metrics grid skeleton with staggered animations
export function MetricsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-fade-in">
      {Array.from({ length: 4 }).map((_, index) => (
        <MetricCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Dashboard overview skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Metrics grid */}
      <MetricsGridSkeleton />
      
      {/* Charts grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      
      {/* Table */}
      <TableSkeleton />
    </div>
  );
}

// Enhanced loading spinner component
export function LoadingSpinner({ 
  size = "default", 
  text,
  variant = "spinner"
}: { 
  size?: "sm" | "default" | "lg";
  text?: string;
  variant?: "spinner" | "dots" | "pulse";
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  };

  if (variant === "dots") {
    return (
      <div className="flex items-center justify-center space-x-1">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="flex items-center justify-center">
        <div className={`bg-primary rounded-full animate-pulse ${sizeClasses[size]}`} />
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`loading-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses[size]}`}
      />
      {text && <span className="ml-2 text-sm text-muted-foreground loading-dots">{text}</span>}
    </div>
  );
}

// Error state component
export function ErrorState({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry?: () => void; 
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <div className="text-destructive mb-2">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground mb-4 text-center">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </CardContent>
    </Card>
  );
}