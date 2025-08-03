"use client";

import { useMetrics } from "@/lib/hooks/use-data";
import { MetricsGrid } from "./metrics-grid";
import { MetricsHeader } from "./metrics-header";
import { ErrorState } from "./skeletons";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface MetricsContainerProps {
  className?: string;
  autoRetry?: boolean;
  retryDelay?: number;
  showHeader?: boolean;
}

export function MetricsContainer({ 
  className, 
  autoRetry = false, 
  retryDelay = 5000,
  showHeader = true
}: MetricsContainerProps) {
  const { data: metrics, isLoading, error, retry, lastUpdated } = useMetrics();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Auto-retry logic
  useEffect(() => {
    if (error && autoRetry && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        retry();
        setRetryCount(prev => prev + 1);
      }, retryDelay);

      return () => clearTimeout(timer);
    }
  }, [error, autoRetry, retryDelay, retryCount, retry]);

  // Reset retry count on successful load
  useEffect(() => {
    if (metrics && !error) {
      setRetryCount(0);
    }
  }, [metrics, error]);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    retry();
  }, [retry]);

  // Show error state
  if (error) {
    const errorMessage = retryCount >= maxRetries 
      ? `Failed to load metrics after ${maxRetries} attempts: ${error}`
      : `Failed to load metrics: ${error}`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ErrorState 
          message={errorMessage}
          onRetry={retryCount < maxRetries ? handleRetry : undefined}
        />
      </motion.div>
    );
  }

  return (
    <div>
      {showHeader && (
        <MetricsHeader 
          onRefresh={handleRetry}
          isRefreshing={isLoading}
          lastUpdated={lastUpdated}
        />
      )}
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MetricsGrid isLoading={true} className={className} />
          </motion.div>
        ) : (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <MetricsGrid metrics={metrics || undefined} className={className} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}