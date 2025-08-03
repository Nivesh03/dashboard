import { 
  MetricCard, 
  TimeSeriesData, 
  CategoryData, 
  TableRow 
} from './types';
import { 
  DollarSign, 
  Users, 
  Target, 
  TrendingUp 
} from 'lucide-react';

// Generate realistic time series data
export function generateTimeSeriesData(
  days: number = 30,
  baseValue: number = 1000,
  volatility: number = 0.1
): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    const trendFactor = 1 + (i / days) * 0.2; // 20% growth trend
    const value = Math.round(baseValue * randomFactor * trendFactor);
    
    data.push({
      id: `data_${i}`,
      name: date.toISOString().split('T')[0],
      date: date.toISOString().split('T')[0],
      value,
      previousValue: i > 0 ? data[i - 1].value : value * 0.95
    });
  }

  return data;
}

// Mock metrics data
export const mockMetrics: MetricCard[] = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: 284750,
    change: 12.5,
    changeType: 'increase',
    icon: DollarSign,
    format: 'currency'
  },
  {
    id: 'users',
    title: 'Active Users',
    value: 18420,
    change: -2.3,
    changeType: 'decrease',
    icon: Users,
    format: 'number'
  },
  {
    id: 'conversions',
    title: 'Conversions',
    value: 1247,
    change: 8.7,
    changeType: 'increase',
    icon: Target,
    format: 'number'
  },
  {
    id: 'growth',
    title: 'Growth Rate',
    value: 15.8,
    change: 3.2,
    changeType: 'increase',
    icon: TrendingUp,
    format: 'percentage'
  }
];

// Mock revenue data over time
export const mockRevenueData: TimeSeriesData[] = generateTimeSeriesData(30, 8500, 0.15);

// Mock user acquisition data
export const mockUserData: TimeSeriesData[] = generateTimeSeriesData(30, 620, 0.12);

// Mock conversion data
export const mockConversionData: TimeSeriesData[] = generateTimeSeriesData(30, 42, 0.2);

// Mock channel distribution data
export const mockChannelData: CategoryData[] = [
  {
    id: 'organic',
    name: 'Organic Search',
    category: 'acquisition',
    value: 35,
    color: 'hsl(var(--chart-1))'
  },
  {
    id: 'paid',
    name: 'Paid Search',
    category: 'acquisition',
    value: 28,
    color: 'hsl(var(--chart-2))'
  },
  {
    id: 'social',
    name: 'Social Media',
    category: 'acquisition',
    value: 22,
    color: 'hsl(var(--chart-3))'
  },
  {
    id: 'direct',
    name: 'Direct',
    category: 'acquisition',
    value: 15,
    color: 'hsl(var(--chart-4))'
  }
];

// Mock campaign performance data
export const mockCampaignData: TableRow[] = [
  {
    id: 'camp_001',
    campaign: 'Holiday Sale 2024',
    impressions: 125000,
    clicks: 3200,
    conversions: 156,
    cost: 2400,
    revenue: 8900,
    roas: 3.71,
    date: '2024-01-15',
    status: 'active'
  },
  {
    id: 'camp_002',
    campaign: 'Spring Collection Launch',
    impressions: 98500,
    clicks: 2850,
    conversions: 142,
    cost: 1950,
    revenue: 7200,
    roas: 3.69,
    date: '2024-01-14',
    status: 'active'
  },
  {
    id: 'camp_003',
    campaign: 'Brand Awareness Q1',
    impressions: 156000,
    clicks: 1890,
    conversions: 89,
    cost: 3200,
    revenue: 4500,
    roas: 1.41,
    date: '2024-01-13',
    status: 'paused'
  },
  {
    id: 'camp_004',
    campaign: 'Retargeting Campaign',
    impressions: 45000,
    clicks: 2100,
    conversions: 198,
    cost: 1200,
    revenue: 9800,
    roas: 8.17,
    date: '2024-01-12',
    status: 'active'
  },
  {
    id: 'camp_005',
    campaign: 'Mobile App Install',
    impressions: 78000,
    clicks: 1560,
    conversions: 78,
    cost: 890,
    revenue: 2340,
    roas: 2.63,
    date: '2024-01-11',
    status: 'completed'
  }
];

// Utility function to simulate API delay
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock API functions
export const mockApi = {
  getMetrics: async (): Promise<MetricCard[]> => {
    await simulateApiDelay(800);
    return mockMetrics;
  },

  getRevenueData: async (): Promise<TimeSeriesData[]> => {
    await simulateApiDelay(1200);
    return mockRevenueData;
  },

  getUserData: async (): Promise<TimeSeriesData[]> => {
    await simulateApiDelay(1000);
    return mockUserData;
  },

  getConversionData: async (): Promise<TimeSeriesData[]> => {
    await simulateApiDelay(900);
    return mockConversionData;
  },

  getChannelData: async (): Promise<CategoryData[]> => {
    await simulateApiDelay(600);
    return mockChannelData;
  },

  getCampaignData: async (): Promise<TableRow[]> => {
    await simulateApiDelay(1500);
    return mockCampaignData;
  }
};