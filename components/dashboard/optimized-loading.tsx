'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { shouldReduceMotion, staggerContainer, staggerItem } from '@/lib/animation-utils';

interface OptimizedLoadingProps {
  type?: 'metrics' | 'chart' | 'table' | 'page';
  count?: number;
  height?: number;
  className?: string;
}

const MetricsLoading = memo(() => (
  <motion.div
    variants={shouldReduceMotion() ? {} : staggerContainer}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
  >
    {Array.from({ length: 4 }).map((_, i) => (
      <motion.div key={i} variants={shouldReduceMotion() ? {} : staggerItem}>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </motion.div>
));

MetricsLoading.displayName = 'MetricsLoading';

const ChartLoading = memo(({ height = 300 }: { height?: number }) => (
  <Card>
    <CardContent className="p-6">
      <motion.div
        initial={shouldReduceMotion() ? {} : { opacity: 0 }}
        animate={shouldReduceMotion() ? {} : { opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="w-full" style={{ height: `${height}px` }} />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </motion.div>
    </CardContent>
  </Card>
));

ChartLoading.displayName = 'ChartLoading';

const TableLoading = memo(() => (
  <Card>
    <CardContent className="p-6">
      <motion.div
        initial={shouldReduceMotion() ? {} : { opacity: 0 }}
        animate={shouldReduceMotion() ? {} : { opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-4" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </motion.div>
    </CardContent>
  </Card>
));

TableLoading.displayName = 'TableLoading';

const PageLoading = memo(() => (
  <motion.div
    variants={shouldReduceMotion() ? {} : staggerContainer}
    initial="hidden"
    animate="visible"
    className="space-y-8"
  >
    <motion.div variants={shouldReduceMotion() ? {} : staggerItem}>
      <MetricsLoading />
    </motion.div>
    
    <motion.div 
      variants={shouldReduceMotion() ? {} : staggerItem}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <ChartLoading height={300} />
      <ChartLoading height={300} />
    </motion.div>
    
    <motion.div variants={shouldReduceMotion() ? {} : staggerItem}>
      <TableLoading />
    </motion.div>
  </motion.div>
));

PageLoading.displayName = 'PageLoading';

export const OptimizedLoading = memo(function OptimizedLoading({
  type = 'page',
  count = 1,
  height = 300,
  className = ''
}: OptimizedLoadingProps) {
  const renderLoading = () => {
    switch (type) {
      case 'metrics':
        return <MetricsLoading />;
      case 'chart':
        return (
          <div className={`space-y-6 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <ChartLoading key={i} height={height} />
            ))}
          </div>
        );
      case 'table':
        return <TableLoading />;
      case 'page':
      default:
        return <PageLoading />;
    }
  };

  return (
    <div className={className}>
      {renderLoading()}
    </div>
  );
});