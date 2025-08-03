import { 
  MetricCard, 
  TimeSeriesData, 
  CategoryData, 
  TableRow,
  ApiResponse 
} from './types';
import { mockApi } from './mock-data';
import { apiCall } from './data-service';

// Dashboard data service with error handling and retry logic
export class DashboardService {
  private static instance: DashboardService;
  
  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  // Metrics data
  async getMetrics(): Promise<ApiResponse<MetricCard[]>> {
    return apiCall(
      () => mockApi.getMetrics(),
      'Failed to load dashboard metrics'
    );
  }

  // Chart data
  async getRevenueData(): Promise<ApiResponse<TimeSeriesData[]>> {
    return apiCall(
      () => mockApi.getRevenueData(),
      'Failed to load revenue data'
    );
  }

  async getUserData(): Promise<ApiResponse<TimeSeriesData[]>> {
    return apiCall(
      () => mockApi.getUserData(),
      'Failed to load user data'
    );
  }

  async getConversionData(): Promise<ApiResponse<TimeSeriesData[]>> {
    return apiCall(
      () => mockApi.getConversionData(),
      'Failed to load conversion data'
    );
  }

  async getChannelData(): Promise<ApiResponse<CategoryData[]>> {
    return apiCall(
      () => mockApi.getChannelData(),
      'Failed to load channel data'
    );
  }

  // Table data
  async getCampaignData(): Promise<ApiResponse<TableRow[]>> {
    return apiCall(
      () => mockApi.getCampaignData(),
      'Failed to load campaign data'
    );
  }

  // Batch data loading for dashboard overview
  async getDashboardData(): Promise<{
    metrics: ApiResponse<MetricCard[]>;
    revenueData: ApiResponse<TimeSeriesData[]>;
    userData: ApiResponse<TimeSeriesData[]>;
    conversionData: ApiResponse<TimeSeriesData[]>;
    channelData: ApiResponse<CategoryData[]>;
    campaignData: ApiResponse<TableRow[]>;
  }> {
    // Load all data in parallel for better performance
    const [
      metrics,
      revenueData,
      userData,
      conversionData,
      channelData,
      campaignData
    ] = await Promise.allSettled([
      this.getMetrics(),
      this.getRevenueData(),
      this.getUserData(),
      this.getConversionData(),
      this.getChannelData(),
      this.getCampaignData()
    ]);

    return {
      metrics: metrics.status === 'fulfilled' ? metrics.value : {
        data: [],
        success: false,
        error: 'Failed to load metrics'
      },
      revenueData: revenueData.status === 'fulfilled' ? revenueData.value : {
        data: [],
        success: false,
        error: 'Failed to load revenue data'
      },
      userData: userData.status === 'fulfilled' ? userData.value : {
        data: [],
        success: false,
        error: 'Failed to load user data'
      },
      conversionData: conversionData.status === 'fulfilled' ? conversionData.value : {
        data: [],
        success: false,
        error: 'Failed to load conversion data'
      },
      channelData: channelData.status === 'fulfilled' ? channelData.value : {
        data: [],
        success: false,
        error: 'Failed to load channel data'
      },
      campaignData: campaignData.status === 'fulfilled' ? campaignData.value : {
        data: [],
        success: false,
        error: 'Failed to load campaign data'
      }
    };
  }

  // Health check for API status
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: Date }>> {
    return apiCall(
      async () => {
        // Simulate a quick health check
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
          status: 'healthy',
          timestamp: new Date()
        };
      },
      'Health check failed'
    );
  }

  // Refresh all dashboard data
  async refreshDashboard(): Promise<boolean> {
    try {
      const dashboardData = await this.getDashboardData();
      
      // Check if at least some data loaded successfully
      const successCount = Object.values(dashboardData)
        .filter(response => response.success).length;
      
      return successCount > 0;
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      return false;
    }
  }
}

// Export singleton instance
export const dashboardService = DashboardService.getInstance();

// Utility functions for data validation
export function validateMetricData(data: unknown): data is MetricCard[] {
  if (!Array.isArray(data)) return false;
  
  return data.every(item => 
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'title' in item &&
    'value' in item &&
    'change' in item &&
    'changeType' in item &&
    'format' in item
  );
}

export function validateTimeSeriesData(data: unknown): data is TimeSeriesData[] {
  if (!Array.isArray(data)) return false;
  
  return data.every(item =>
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'name' in item &&
    'value' in item &&
    'date' in item &&
    typeof item.value === 'number'
  );
}

export function validateCategoryData(data: unknown): data is CategoryData[] {
  if (!Array.isArray(data)) return false;
  
  return data.every(item =>
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'name' in item &&
    'value' in item &&
    'category' in item &&
    typeof item.value === 'number'
  );
}

export function validateTableData(data: unknown): data is TableRow[] {
  if (!Array.isArray(data)) return false;
  
  return data.every(item =>
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'campaign' in item &&
    'impressions' in item &&
    'clicks' in item &&
    'conversions' in item &&
    'cost' in item &&
    'revenue' in item &&
    'roas' in item &&
    'date' in item
  );
}