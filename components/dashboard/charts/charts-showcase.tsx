'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LazyLineChart, LazyBarChart, LazyPieChart } from './lazy-charts';
import { ChartContainer } from './chart-container';
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
      {/* Line Chart - Revenue Over Time */}
      <motion.div variants={staggerItem} className="lg:col-span-2">
        <ChartContainer
          title="Revenue Trend"
          isLoading={isLoading}
          error={error || undefined}
          onRetry={loadData}
          onRefresh={loadData}
          expandable
        >
          <LazyLineChart
            data={revenueData}
            title=""
            dataKey="value"
            color="hsl(var(--chart-1))"
            formatValue={formatCurrency}
            showGrid
            showTooltip
          />
        </ChartContainer>
      </motion.div>

      {/* Bar Chart - Channel Performance */}
      <motion.div variants={staggerItem}>
        <ChartContainer
          title="Channel Performance"
          isLoading={isLoading}
          error={error || undefined}
          onRetry={loadData}
          onRefresh={loadData}
          expandable
        >
          <LazyBarChart
            data={channelData}
            title=""
            dataKey="value"
            categoryKey="name"
            formatValue={formatPercentage}
            showGrid
            showTooltip
            showLegend
          />
        </ChartContainer>
      </motion.div>

      {/* Pie Chart - Traffic Sources */}
      <motion.div variants={staggerItem}>
        <ChartContainer
          title="Traffic Sources Distribution"
          isLoading={isLoading}
          error={error || undefined}
          onRetry={loadData}
          onRefresh={loadData}
          expandable
        >
          <LazyPieChart
            data={channelData}
            title=""
            dataKey="value"
            nameKey="name"
            formatValue={formatPercentage}
            showTooltip
            showLegend
            showLabels
            showPercentages
          />
        </ChartContainer>
      </motion.div>

      {/* Donut Chart - Conversion Funnel */}
      <motion.div variants={staggerItem} className="lg:col-span-2">
        <ChartContainer
          title="Conversion Funnel"
          isLoading={isLoading}
          error={error || undefined}
          onRetry={loadData}
          onRefresh={loadData}
          expandable
        >
          <LazyPieChart
            data={channelData}
            title=""
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            formatValue={formatPercentage}
            showTooltip
            showLegend
            showLabels={false}
            showPercentages
          />
        </ChartContainer>
      </motion.div>
    </motion.div>
  );
}