"use client";

import { useMetrics } from "@/lib/hooks/use-data";
import { MetricsGrid } from "./metrics-grid";
import { MetricsHeader } from "./metrics-header";
import { ErrorState } from "./skeletons";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState, useRef, memo } from "react";
import { fadeInVariants, slideUpVariants, shouldReduceMotion } from "@/lib/animation-utils";

interface MetricsContainerProps {
  className?: string;
  autoRetry?: boolean;
  retryDelay?: number;
  showHeader?: boolean;
}

export const MetricsContainer = memo(function MetricsContainer({
  className,
  autoRetry = false,
  retryDelay = 5000,
  showHeader = true,
}: MetricsContainerProps) {
  const { data: metrics, isLoading, error, retry, lastUpdated } = useMetrics();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Use ref to store the latest retry function
  const retryRef = useRef(retry);
  retryRef.current = retry;

  // Auto-retry logic
  useEffect(() => {
    if (error && autoRetry && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        retryRef.current();
        setRetryCount((prev) => prev + 1);
      }, retryDelay);

      return () => clearTimeout(timer);
    }
  }, [error, autoRetry, retryDelay, retryCount]);

  // Reset retry count on successful load
  useEffect(() => {
    if (metrics && !error) {
      setRetryCount(0);
    }
  }, [metrics, error]);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    retryRef.current();
  }, []);

  // Show error state
  if (error) {
    const errorMessage =
      retryCount >= maxRetries
        ? `Failed to load metrics after ${maxRetries} attempts: ${error}`
        : `Failed to load metrics: ${error}`;

    const motionVariants = shouldReduceMotion() ? fadeInVariants : slideUpVariants;
    
    return (
      <motion.div
        variants={motionVariants}
        initial="hidden"
        animate="visible"
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
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <MetricsGrid isLoading={true} className={className} />
          </motion.div>
        ) : (
          <motion.div
            key="loaded"
            variants={shouldReduceMotion() ? fadeInVariants : slideUpVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ delay: 0.1 }}
          >
            <MetricsGrid metrics={metrics || undefined} className={className} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
