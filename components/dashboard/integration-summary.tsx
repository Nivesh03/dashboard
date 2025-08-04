'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Activity, Database, Layers, Zap } from 'lucide-react';
import { IntegrationValidator } from '@/lib/integration-validator';
import { useMetrics, useDashboardData } from '@/lib/hooks/use-data';

interface IntegrationStatus {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'healthy' | 'warning' | 'error' | 'loading';
  message: string;
  details: string[];
  lastChecked?: Date;
}

export function IntegrationSummary() {
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');
  
  // Use hooks to check real-time status
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useMetrics();
  const dashboardData = useDashboardData();

  const checkIntegrationHealth = async () => {
    setIsLoading(true);
    const statusUpdates: IntegrationStatus[] = [];

    // 1. Data Layer Health
    try {
      const validator = new IntegrationValidator();
      const results = await validator.validateDataFlow();
      const summary = validator.getSummary();
      
      statusUpdates.push({
        category: 'Data Layer',
        icon: Database,
        status: validator.getOverallStatus() === 'pass' ? 'healthy' : 'error',
        message: `${summary.passed}/${summary.total} validations passed`,
        details: [
          `Mock API: ${results.filter(r => r.component === 'Mock API' && r.passed).length} tests passed`,
          `Data Types: ${results.filter(r => r.component === 'Data Types' && r.passed).length} validations passed`,
          `Performance: ${results.filter(r => r.component === 'Performance' && r.passed).length} benchmarks met`
        ],
        lastChecked: new Date()
      });
    } catch (error) {
      statusUpdates.push({
        category: 'Data Layer',
        icon: Database,
        status: 'error',
        message: 'Data layer validation failed',
        details: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        lastChecked: new Date()
      });
    }

    // 2. Component Integration Health
    const componentHealth = checkComponentHealth();
    statusUpdates.push(componentHealth);

    // 3. User Interface Health
    const uiHealth = checkUIHealth();
    statusUpdates.push(uiHealth);

    // 4. Performance Health
    const performanceHealth = await checkPerformanceHealth();
    statusUpdates.push(performanceHealth);

    setIntegrationStatus(statusUpdates);
    
    // Calculate overall health
    const hasErrors = statusUpdates.some(status => status.status === 'error');
    const hasWarnings = statusUpdates.some(status => status.status === 'warning');
    
    if (hasErrors) {
      setOverallHealth('error');
    } else if (hasWarnings) {
      setOverallHealth('warning');
    } else {
      setOverallHealth('healthy');
    }
    
    setIsLoading(false);
  };

  const checkComponentHealth = (): IntegrationStatus => {
    const details: string[] = [];
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    let message = 'All components integrated successfully';

    // Check metrics loading
    if (metricsError) {
      status = 'error';
      message = 'Component integration issues detected';
      details.push(`Metrics loading error: ${metricsError}`);
    } else if (metricsLoading) {
      status = 'warning';
      message = 'Components still loading';
      details.push('Metrics are currently loading');
    } else if (metrics) {
      details.push(`${metrics.length} metric cards loaded successfully`);
    }

    // Check dashboard data
    if (dashboardData.hasError) {
      status = 'error';
      message = 'Dashboard data integration failed';
      details.push('Dashboard data loading errors detected');
    } else if (dashboardData.isLoading) {
      if (status !== 'error') {
        status = 'warning';
        message = 'Dashboard components loading';
      }
      details.push('Dashboard data is loading');
    } else {
      details.push('Dashboard data integration successful');
    }

    return {
      category: 'Component Integration',
      icon: Layers,
      status,
      message,
      details,
      lastChecked: new Date()
    };
  };

  const checkUIHealth = (): IntegrationStatus => {
    const details: string[] = [];
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    let message = 'UI components functioning correctly';

    // Check for key UI elements
    const metricsCards = document.querySelectorAll('[data-testid="metric-card"]');
    const charts = document.querySelectorAll('[data-testid="chart-container"]');
    const sidebar = document.querySelector('[data-testid="sidebar"]');
    const header = document.querySelector('[data-testid="header"]');
    const themeToggle = document.querySelector('[data-testid="theme-toggle"]');

    if (metricsCards.length > 0) {
      details.push(`${metricsCards.length} metric cards rendered`);
    } else {
      status = 'warning';
      details.push('No metric cards found');
    }

    if (charts.length > 0) {
      details.push(`${charts.length} charts rendered`);
    } else {
      status = 'warning';
      details.push('No charts found');
    }

    if (sidebar) {
      details.push('Navigation sidebar present');
    } else {
      status = 'error';
      message = 'Critical UI components missing';
      details.push('Navigation sidebar not found');
    }

    if (header) {
      details.push('Header component present');
    } else {
      status = 'error';
      message = 'Critical UI components missing';
      details.push('Header component not found');
    }

    if (themeToggle) {
      details.push('Theme toggle functional');
    } else {
      if (status === 'healthy') status = 'warning';
      details.push('Theme toggle not found');
    }

    return {
      category: 'User Interface',
      icon: Activity,
      status,
      message,
      details,
      lastChecked: new Date()
    };
  };

  const checkPerformanceHealth = async (): Promise<IntegrationStatus> => {
    const details: string[] = [];
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    let message = 'Performance within acceptable limits';

    try {
      // Check bundle size (approximate)
      const scripts = document.querySelectorAll('script[src]');
      details.push(`${scripts.length} script resources loaded`);

      // Check memory usage (if available)
      if ('memory' in performance) {
        const memory = (performance as unknown as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
        
        details.push(`Memory usage: ${usedMB}MB / ${limitMB}MB`);
        
        if (usedMB > limitMB * 0.8) {
          status = 'warning';
          message = 'High memory usage detected';
        }
      }

      // Check for performance entries
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0] as PerformanceNavigationTiming;
        const loadTime = nav.loadEventEnd - nav.loadEventStart;
        details.push(`Page load time: ${Math.round(loadTime)}ms`);
        
        if (loadTime > 3000) {
          status = 'warning';
          message = 'Slow page load detected';
        }
      }

      // Check for long tasks (if supported)
      if ('PerformanceObserver' in window) {
        details.push('Performance monitoring active');
      }

    } catch (error) {
      status = 'warning';
      message = 'Performance monitoring limited';
      details.push('Some performance metrics unavailable');
    }

    return {
      category: 'Performance',
      icon: Zap,
      status,
      message,
      details,
      lastChecked: new Date()
    };
  };

  useEffect(() => {
    checkIntegrationHealth();
  }, [metrics, metricsLoading, metricsError, dashboardData]);

  const getStatusIcon = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'loading':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'loading':
        return <Badge variant="outline">Loading</Badge>;
    }
  };

  const getOverallHealthColor = () => {
    switch (overallHealth) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
    }
  };

  const healthyCount = integrationStatus.filter(s => s.status === 'healthy').length;
  const totalCount = integrationStatus.length;
  const healthPercentage = totalCount > 0 ? (healthyCount / totalCount) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Integration Health Dashboard
              {getStatusIcon(overallHealth === 'healthy' ? 'healthy' : overallHealth === 'warning' ? 'warning' : 'error')}
            </CardTitle>
            <CardDescription>
              Real-time monitoring of all dashboard integrations and components
            </CardDescription>
          </div>
          <Button 
            onClick={checkIntegrationHealth} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={`font-medium ${getOverallHealthColor()}`}>
              Overall Health: {overallHealth.charAt(0).toUpperCase() + overallHealth.slice(1)}
            </span>
            <span className="text-muted-foreground">
              {healthyCount}/{totalCount} systems healthy
            </span>
          </div>
          <Progress value={healthPercentage} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrationStatus.map((status) => {
            const Icon = status.icon;
            return (
              <div key={status.category} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{status.category}</h4>
                  </div>
                  {getStatusBadge(status.status)}
                </div>
                
                <p className="text-sm text-muted-foreground">{status.message}</p>
                
                <div className="space-y-1">
                  {status.details.map((detail, index) => (
                    <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {detail}
                    </div>
                  ))}
                </div>
                
                {status.lastChecked && (
                  <div className="text-xs text-muted-foreground">
                    Last checked: {status.lastChecked.toLocaleTimeString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}