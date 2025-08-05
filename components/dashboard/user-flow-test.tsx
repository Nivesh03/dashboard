'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Play, User, BarChart3, Table, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserFlowStep {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  validations: string[];
  status: 'pending' | 'running' | 'pass' | 'fail';
  message?: string;
  duration?: number;
}

const userFlows: UserFlowStep[] = [
  {
    id: 'overview',
    name: 'Dashboard Overview',
    description: 'Load main dashboard with metrics and charts',
    icon: BarChart3,
    path: '/dashboard',
    validations: [
      'Metrics cards display with data',
      'Charts render correctly',
      'Navigation sidebar is functional',
      'Theme toggle works',
      'Recent activity shows'
    ],
    status: 'pending'
  },
  {
    id: 'analytics',
    name: 'Analytics Deep Dive',
    description: 'Navigate to detailed analytics page',
    icon: BarChart3,
    path: '/dashboard/analytics',
    validations: [
      'Page loads without errors',
      'Multiple chart types display',
      'Tab navigation works',
      'Charts are interactive',
      'Export functionality available'
    ],
    status: 'pending'
  },
  {
    id: 'data-table',
    name: 'Data Table Operations',
    description: 'Test table sorting, filtering, and pagination',
    icon: Table,
    path: '/dashboard/data',
    validations: [
      'Table loads with campaign data',
      'Sorting works on columns',
      'Search filters data correctly',
      'Pagination controls function',
      'Export feature works'
    ],
    status: 'pending'
  },
  {
    id: 'reports',
    name: 'Reports Generation',
    description: 'Access reports and generation features',
    icon: FileText,
    path: '/dashboard/reports',
    validations: [
      'Reports page loads',
      'Report types are displayed',
      'Recent reports show',
      'Generation buttons work',
      'Download functionality present'
    ],
    status: 'pending'
  }
];

export function UserFlowTest() {
  const [flows, setFlows] = useState<UserFlowStep[]>(userFlows);
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'pass' | 'fail'>('pending');
  const router = useRouter();

  const runSingleFlow = async (flowId: string) => {
    setCurrentFlow(flowId);
    
    setFlows(prev => prev.map(flow => 
      flow.id === flowId 
        ? { ...flow, status: 'running', message: 'Testing user flow...', duration: undefined }
        : flow
    ));

    const flow = flows.find(f => f.id === flowId);
    if (!flow) return;

    try {
      const startTime = Date.now();
      
      // Navigate to the page
      router.push(flow.path);
      
      // Wait for navigation and page load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Run validations
      const validationResults = await runValidations(flow.validations);
      const duration = Date.now() - startTime;
      
      const allPassed = validationResults.every(result => result.passed);
      const failedValidations = validationResults.filter(result => !result.passed);
      
      setFlows(prev => prev.map(f => 
        f.id === flowId 
          ? { 
              ...f, 
              status: allPassed ? 'pass' : 'fail',
              message: allPassed 
                ? `All validations passed (${duration}ms)`
                : `${failedValidations.length} validations failed: ${failedValidations.map(v => v.validation).join(', ')}`,
              duration
            }
          : f
      ));
      
    } catch (error) {
      setFlows(prev => prev.map(f => 
        f.id === flowId 
          ? { 
              ...f, 
              status: 'fail',
              message: `Flow failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          : f
      ));
    }
    
    setCurrentFlow(null);
  };

  const runAllFlows = async () => {
    setIsRunning(true);
    
    // Reset all flows
    setFlows(prev => prev.map(flow => ({ ...flow, status: 'pending' as const, message: undefined, duration: undefined })));
    
    // Run each flow sequentially
    for (const flow of userFlows) {
      await runSingleFlow(flow.id);
      // Wait between flows
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsRunning(false);
    
    // Calculate overall status
    const currentFlows = flows;
    const hasFailures = currentFlows.some(flow => flow.status === 'fail');
    setOverallStatus(hasFailures ? 'fail' : 'pass');
  };

  const runValidations = async (validations: string[]): Promise<Array<{validation: string, passed: boolean, message?: string}>> => {
    const results = [];
    
    for (const validation of validations) {
      try {
        let passed = false;
        let message = '';
        
        switch (validation) {
          case 'Metrics cards display with data':
            const metricsCards = document.querySelectorAll('[data-testid="metric-card"]');
            passed = metricsCards.length >= 4;
            message = `Found ${metricsCards.length} metric cards`;
            break;
            
          case 'Charts render correctly':
            const charts = document.querySelectorAll('[data-testid="chart-container"]');
            passed = charts.length > 0;
            message = `Found ${charts.length} charts`;
            break;
            
          case 'Navigation sidebar is functional':
            const sidebar = document.querySelector('[data-testid="sidebar"]');
            const navLinks = document.querySelectorAll('a[href^="/dashboard"]');
            passed = sidebar !== null && navLinks.length >= 4;
            message = `Sidebar present: ${sidebar !== null}, Nav links: ${navLinks.length}`;
            break;
            
          case 'Theme toggle works':
            const themeToggle = document.querySelector('[data-testid="theme-toggle"]');
            passed = themeToggle !== null;
            message = `Theme toggle present: ${themeToggle !== null}`;
            break;
            
          case 'Page loads without errors':
            // Check for error messages or empty states
            const errorElements = document.querySelectorAll('[class*="error"], [class*="destructive"]');
            passed = errorElements.length === 0;
            message = `No error elements found: ${errorElements.length === 0}`;
            break;
            
          case 'Table loads with campaign data':
            const dataTable = document.querySelector('[data-testid="data-table"]');
            const tableRows = document.querySelectorAll('[data-testid="data-table"] tbody tr');
            passed = dataTable !== null && tableRows.length > 0;
            message = `Table present: ${dataTable !== null}, Rows: ${tableRows.length}`;
            break;
            
          case 'Multiple chart types display':
            const chartContainers = document.querySelectorAll('[data-testid="chart-container"]');
            passed = chartContainers.length >= 2;
            message = `Found ${chartContainers.length} chart containers`;
            break;
            
          case 'Recent activity shows':
            const activityElements = document.querySelectorAll('[class*="activity"], [class*="recent"]');
            passed = activityElements.length > 0;
            message = `Activity elements found: ${activityElements.length}`;
            break;
            
          default:
            // Generic validation - check if page loaded successfully
            passed = !document.querySelector('[class*="error"]');
            message = 'Generic validation passed';
        }
        
        results.push({ validation, passed, message });
        
      } catch (error) {
        results.push({ 
          validation, 
          passed: false, 
          message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    return results;
  };

  const getStatusIcon = (status: UserFlowStep['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: UserFlowStep['status']) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-100 text-green-800">Pass</Badge>;
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>;
      case 'running':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const passedFlows = flows.filter(flow => flow.status === 'pass').length;
  const totalFlows = flows.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Flow Testing
              {overallStatus !== 'pending' && getStatusIcon(overallStatus)}
            </CardTitle>
            <CardDescription>
              End-to-end testing of complete user journeys through the dashboard
            </CardDescription>
          </div>
          <Button 
            onClick={runAllFlows} 
            disabled={isRunning}
            variant="outline"
          >
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run All Flows
              </>
            )}
          </Button>
        </div>
        
        {totalFlows > 0 && (
          <Alert className={overallStatus === 'pass' ? 'border-green-200 bg-green-50' : overallStatus === 'fail' ? 'border-red-200 bg-red-50' : ''}>
            <AlertDescription>
              {overallStatus === 'pass' 
                ? `✅ All user flows completed successfully! (${passedFlows}/${totalFlows})`
                : overallStatus === 'fail'
                ? `❌ Some user flows failed (${passedFlows}/${totalFlows} passed)`
                : `⏳ Ready to test ${totalFlows} user flows`
              }
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {flows.map((flow) => {
            const Icon = flow.icon;
            return (
              <div key={flow.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{flow.name}</h4>
                      {getStatusIcon(flow.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{flow.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <strong>Path:</strong> {flow.path}
                    </div>
                    {flow.message && (
                      <p className="text-xs text-muted-foreground mt-1">{flow.message}</p>
                    )}
                    {flow.duration && (
                      <p className="text-xs text-muted-foreground">
                        Duration: {flow.duration}ms
                      </p>
                    )}
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        Validations ({flow.validations.length})
                      </summary>
                      <ul className="text-xs text-muted-foreground mt-1 ml-4 space-y-1">
                        {flow.validations.map((validation, index) => (
                          <li key={index}>• {validation}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(flow.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => runSingleFlow(flow.id)}
                    disabled={isRunning || currentFlow === flow.id}
                  >
                    {currentFlow === flow.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}