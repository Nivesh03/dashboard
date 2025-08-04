'use client';

import { useState, useEffect } from 'react';
import { LazyLineChart, LazyBarChart, LazyPieChart } from './lazy-charts';
import { ChartContainer } from './chart-container';
import { mockApi } from '@/lib/mock-data';
import { TimeSeriesData, CategoryData } from '@/lib/types';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart - Revenue Over Time */}
      <ChartContainer
        title="Revenue Trend"
        isLoading={isLoading}
        error={error || undefined}
        onRetry={loadData}
        onRefresh={loadData}
        expandable
        className="lg:col-span-2"
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

      {/* Bar Chart - Channel Performance */}
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

      {/* Pie Chart - Traffic Sources */}
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

      {/* Donut Chart - Conversion Funnel */}
      <ChartContainer
        title="Conversion Funnel"
        isLoading={isLoading}
        error={error || undefined}
        onRetry={loadData}
        onRefresh={loadData}
        expandable
        className="lg:col-span-2"
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
    </div>
  );
}