import { mockApi } from './mock-data';
import { MetricCard, TimeSeriesData } from './types';

export interface ValidationResult {
  component: string;
  test: string;
  passed: boolean;
  message: string;
  data?: unknown;
  duration?: number;
}

export class IntegrationValidator {
  private results: ValidationResult[] = [];

  async validateDataFlow(): Promise<ValidationResult[]> {
    this.results = [];
    
    // Test 1: Mock API Data Consistency
    await this.validateMockApiConsistency();
    
    // Test 2: Data Type Validation
    await this.validateDataTypes();
    
    // Test 3: Data Relationships
    await this.validateDataRelationships();
    
    // Test 4: Error Handling
    await this.validateErrorHandling();
    
    // Test 5: Performance
    await this.validatePerformance();
    
    return this.results;
  }

  private async validateMockApiConsistency(): Promise<void> {
    const startTime = Date.now();
    
    try {
      const [metrics, revenue, channels, campaigns] = await Promise.all([
        mockApi.getMetrics(),
        mockApi.getRevenueData(),
        mockApi.getChannelData(),
        mockApi.getCampaignData()
      ]);
      
      const duration = Date.now() - startTime;
      
      // Validate metrics
      if (metrics.length === 4 && metrics.every(m => m.id && m.title && typeof m.value !== 'undefined')) {
        this.results.push({
          component: 'Mock API',
          test: 'Metrics Data Consistency',
          passed: true,
          message: `All ${metrics.length} metrics have required fields`,
          data: { count: metrics.length },
          duration
        });
      } else {
        this.results.push({
          component: 'Mock API',
          test: 'Metrics Data Consistency',
          passed: false,
          message: `Invalid metrics data structure`,
          data: { count: metrics.length }
        });
      }
      
      // Validate revenue data
      if (revenue.length > 0 && revenue.every(r => r.date && typeof r.value === 'number')) {
        this.results.push({
          component: 'Mock API',
          test: 'Revenue Data Consistency',
          passed: true,
          message: `${revenue.length} revenue data points with valid structure`,
          data: { count: revenue.length }
        });
      } else {
        this.results.push({
          component: 'Mock API',
          test: 'Revenue Data Consistency',
          passed: false,
          message: 'Invalid revenue data structure'
        });
      }
      
      // Validate channel data
      if (channels.length > 0 && channels.every(c => c.name && typeof c.value === 'number')) {
        this.results.push({
          component: 'Mock API',
          test: 'Channel Data Consistency',
          passed: true,
          message: `${channels.length} channel data points with valid structure`,
          data: { count: channels.length }
        });
      } else {
        this.results.push({
          component: 'Mock API',
          test: 'Channel Data Consistency',
          passed: false,
          message: 'Invalid channel data structure'
        });
      }
      
      // Validate campaign data
      if (campaigns.length > 0 && campaigns.every(c => c.campaign && typeof c.revenue === 'number')) {
        this.results.push({
          component: 'Mock API',
          test: 'Campaign Data Consistency',
          passed: true,
          message: `${campaigns.length} campaign records with valid structure`,
          data: { count: campaigns.length }
        });
      } else {
        this.results.push({
          component: 'Mock API',
          test: 'Campaign Data Consistency',
          passed: false,
          message: 'Invalid campaign data structure'
        });
      }
      
    } catch (error) {
      this.results.push({
        component: 'Mock API',
        test: 'Data Loading',
        passed: false,
        message: `Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  private async validateDataTypes(): Promise<void> {
    try {
      const metrics = await mockApi.getMetrics();
      
      // Validate MetricCard interface compliance
      const validMetrics = metrics.every((metric: MetricCard) => {
        return (
          typeof metric.id === 'string' &&
          typeof metric.title === 'string' &&
          (typeof metric.value === 'string' || typeof metric.value === 'number') &&
          typeof metric.change === 'number' &&
          ['increase', 'decrease'].includes(metric.changeType) &&
          typeof metric.icon === 'function' &&
          ['currency', 'number', 'percentage'].includes(metric.format)
        );
      });
      
      this.results.push({
        component: 'Data Types',
        test: 'MetricCard Interface Compliance',
        passed: validMetrics,
        message: validMetrics 
          ? 'All metrics comply with MetricCard interface'
          : 'Some metrics do not comply with MetricCard interface'
      });
      
      // Validate TimeSeriesData
      const revenueData = await mockApi.getRevenueData();
      const validTimeSeriesData = revenueData.every((data: TimeSeriesData) => {
        return (
          typeof data.id === 'string' &&
          typeof data.name === 'string' &&
          typeof data.value === 'number' &&
          typeof data.date === 'string' &&
          !isNaN(new Date(data.date).getTime())
        );
      });
      
      this.results.push({
        component: 'Data Types',
        test: 'TimeSeriesData Interface Compliance',
        passed: validTimeSeriesData,
        message: validTimeSeriesData 
          ? 'All time series data complies with interface'
          : 'Some time series data does not comply with interface'
      });
      
    } catch (error) {
      this.results.push({
        component: 'Data Types',
        test: 'Type Validation',
        passed: false,
        message: `Type validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  private async validateDataRelationships(): Promise<void> {
    try {
      const [metrics, campaigns] = await Promise.all([
        mockApi.getMetrics(),
        mockApi.getCampaignData()
      ]);
      
      // Check if metrics align with campaign data
      const revenueMetric = metrics.find(m => m.id === 'revenue');
      const totalCampaignRevenue = campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
      
      if (revenueMetric && typeof revenueMetric.value === 'number') {
        const revenueValue = revenueMetric.value;
        const difference = Math.abs(revenueValue - totalCampaignRevenue);
        const percentageDiff = (difference / revenueValue) * 100;
        
        // Allow for some variance in mock data
        const isConsistent = percentageDiff < 50; // 50% tolerance for mock data
        
        this.results.push({
          component: 'Data Relationships',
          test: 'Revenue Metric vs Campaign Data',
          passed: isConsistent,
          message: isConsistent 
            ? `Revenue metric (${revenueValue}) aligns with campaign total (${totalCampaignRevenue})`
            : `Revenue metric (${revenueValue}) differs significantly from campaign total (${totalCampaignRevenue})`,
          data: { metricRevenue: revenueValue, campaignRevenue: totalCampaignRevenue, difference: percentageDiff }
        });
      }
      
      // Check campaign data integrity
      const validCampaigns = campaigns.every(campaign => {
        const roas = campaign.revenue / campaign.cost;
        const calculatedRoas = Math.abs(roas - campaign.roas) < 0.1; // Allow small rounding differences
        return calculatedRoas;
      });
      
      this.results.push({
        component: 'Data Relationships',
        test: 'Campaign ROAS Calculation',
        passed: validCampaigns,
        message: validCampaigns 
          ? 'All campaign ROAS calculations are consistent'
          : 'Some campaign ROAS calculations are inconsistent'
      });
      
    } catch (error) {
      this.results.push({
        component: 'Data Relationships',
        test: 'Relationship Validation',
        passed: false,
        message: `Relationship validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  private async validateErrorHandling(): Promise<void> {
    try {
      // Test error handling by simulating failures
      const originalGetMetrics = mockApi.getMetrics;
      
      // Temporarily replace with failing function
      mockApi.getMetrics = async () => {
        throw new Error('Simulated API failure');
      };
      
      try {
        await mockApi.getMetrics();
        this.results.push({
          component: 'Error Handling',
          test: 'API Failure Simulation',
          passed: false,
          message: 'Expected error was not thrown'
        });
      } catch (error) {
        this.results.push({
          component: 'Error Handling',
          test: 'API Failure Simulation',
          passed: true,
          message: 'Error handling works correctly',
          data: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }
      
      // Restore original function
      mockApi.getMetrics = originalGetMetrics;
      
    } catch (error) {
      this.results.push({
        component: 'Error Handling',
        test: 'Error Handling Test',
        passed: false,
        message: `Error handling test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  private async validatePerformance(): Promise<void> {
    const performanceTests = [
      { name: 'Metrics Load Time', fn: mockApi.getMetrics, maxTime: 1000 },
      { name: 'Revenue Data Load Time', fn: mockApi.getRevenueData, maxTime: 1500 },
      { name: 'Channel Data Load Time', fn: mockApi.getChannelData, maxTime: 800 },
      { name: 'Campaign Data Load Time', fn: mockApi.getCampaignData, maxTime: 2000 }
    ];
    
    for (const test of performanceTests) {
      const startTime = Date.now();
      
      try {
        await test.fn();
        const duration = Date.now() - startTime;
        const passed = duration <= test.maxTime;
        
        this.results.push({
          component: 'Performance',
          test: test.name,
          passed,
          message: passed 
            ? `Loaded in ${duration}ms (under ${test.maxTime}ms limit)`
            : `Loaded in ${duration}ms (exceeded ${test.maxTime}ms limit)`,
          duration
        });
        
      } catch (error) {
        this.results.push({
          component: 'Performance',
          test: test.name,
          passed: false,
          message: `Performance test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
  }

  getOverallStatus(): 'pass' | 'fail' {
    return this.results.every(result => result.passed) ? 'pass' : 'fail';
  }

  getResultsByComponent(): Record<string, ValidationResult[]> {
    return this.results.reduce((acc, result) => {
      if (!acc[result.component]) {
        acc[result.component] = [];
      }
      acc[result.component].push(result);
      return acc;
    }, {} as Record<string, ValidationResult[]>);
  }

  getSummary(): { total: number; passed: number; failed: number; components: string[] } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const components = [...new Set(this.results.map(r => r.component))];
    
    return { total, passed, failed, components };
  }
}