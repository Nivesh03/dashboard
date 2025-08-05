'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LazyLineChart, LazyBarChart, LazyPieChart } from './lazy-charts';
import { ChartContainer } from './chart-container';
import { EnhancedRevenueChart } from './enhanced-revenue-chart';
import { EnhancedBarChart } from './enhanced-bar-chart';
import { EnhancedPieChart } from './enhanced-pie-chart';
import { mockApi } from '@/lib/mock-data';
import { TimeSeriesData, CategoryData } from '@/lib/types';
import { staggerContainer, staggerItem } from '@/lib/animation-utils';

export function ChartsShowcase() {
  const [revenueData, setRevenueData] = useState<TimeSeriesData[]>([]);
  const [channelData, setChannelData] = useState<CategoryData[]>([]);
  const [, setConversionData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [revenue, channels, conversions] = await Promise.all([
        mockApi.getRevenueData(),
        mockApi.getChannelData(),
        mockApi.getConversionData()
      ]);
      
      setRevenueData(revenue);
      setChannelData(channels);
      setConversionData(conversions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      data-motion-component
    >
      {/* Enhanced Revenue Chart */}
      <motion.div variants={staggerItem} className="lg:col-span-2">
        <EnhancedRevenueChart
          data={revenueData}
          title="Revenue Trend"
          dataKey="value"
          color="hsl(var(--chart-1))"
          formatValue={formatCurrency}
          showGrid
          showTooltip
          showTrend
          showGradient
          isLoading={isLoading}
          error={error || undefined}
          height={400}
        />
      </motion.div>

      {/* Enhanced Bar Chart - Channel Performance */}
      <motion.div variants={staggerItem}>
        <EnhancedBarChart
          data={channelData}
          title="Channel Performance"
          dataKey="value"
          categoryKey="name"
          formatValue={formatPercentage}
          showGrid
          showTooltip
          showLegend
          showStats
          isLoading={isLoading}
          error={error || undefined}
          height={350}
        />
      </motion.div>

      {/* Enhanced Pie Chart - Traffic Sources */}
      <motion.div variants={staggerItem}>
        <EnhancedPieChart
          data={channelData}
          title="Traffic Sources Distribution"
          dataKey="value"
          nameKey="name"
          formatValue={formatPercentage}
          showTooltip
          showLegend
          showLabels
          showPercentages
          showStats
          isLoading={isLoading}
          error={error || undefined}
          height={350}
          outerRadius={90}
        />
      </motion.div>
    </motion.div>
  );
}